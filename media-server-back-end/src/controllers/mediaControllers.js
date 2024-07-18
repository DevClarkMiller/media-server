module.exports = (dbObj) =>{
    const fs = require('fs');
    const db = dbObj.DB;
    const sharp = require('sharp');
    const conversion = require('../utilities/Conversion')();
    const ffmpeg = require('fluent-ffmpeg');
    const {PassThrough} = require('stream');

    //Gets crucial details about how much storage a user has left
    const checkStorageUsage = (userID) =>{
        return new Promise((resolve, reject) =>{
            let sql = 
            `SELECT 
            COALESCE(SUM(file_size), 0) AS "used",
            (SELECT max_storage FROM User where id = ? LIMIT 1) AS "max",
            (SELECT max_file_size FROM User where id = ? LIMIT 1) AS "max_file_size"
            FROM UserMedia um INNER JOIN User u ON
            um.user_id = u.id
            WHERE um.user_id = ?`

            db.get(sql, [userID, userID, userID], function(err, row){
                if(err) return reject(`User with ${userID} not found!`);    
                row.free = (row.used > 0) ? row.max - row.used : row.max; 
                console.log(row);
                resolve(row);
            });
        });
    }

    const deleteFile = async filename =>{
        return new Promise((resolve, reject) =>{
            fs.unlink(filename, (err) => {
                if(err){
                    reject(err);
                }                
                resolve('Successfully removed the file!');
            }); 
        });
    }

    const getMedia = async (req, res) =>{
        console.log('Hit getMedia controller');

        const {account} = req.account;  //Note that it must be destructed here to work properly
        const userID = account.id;

        if(!userID) return res.status(404).send("Account not found");

        //Sends only safe data
        const sql = 'SELECT date_added, ext, og_name, mimetype, file_size FROM UserMedia WHERE user_id = ?';
        db.all(sql, [userID], (err, rows)=>{
            if(err){
                return console.error(err.message);
            }else{
                res.send(rows);
            } 
        });
    };

    const postMedia = async (req, res) =>{
        console.log('Hit postMedia controller');
        let files = req.files;

        //If not array, convert it to array
        if(!Array.isArray(files)) files = [files];

        if(!files) {
            console.error('Files failed to upload');
            return res.send('No files were uploaded');
        }
        const {account} = req.account;
        const {email, id} = account;

        console.log(`USERS EMAIL: ${email}`);

        const userID = id;
        if(!userID){
            console.error("User not found!");
            return;
        }

        let storageDetails;
        try{
            storageDetails = await checkStorageUsage(id);
        }catch(err){
            console.error(err);
            return res.status(500).send(err);
        }

        //Uploads each file
        for(let fileItem of files){
            if(!fileItem) return res.status(500).send("File not uploaded!");

            let file = fileItem?.file;
            file.name = file.name.replace(" ", "_");
            const filesize = file.size / 1024;

            //Checks if adding the file will take up more storage than the user has
            if((storageDetails.used += filesize) > storageDetails.max || filesize > storageDetails.max_file_size){
                console.log('File cannot be stored! This is why');
                console.log(`Storage used: ${(storageDetails.used / storageDetails.max) * 100}%`);
                console.log(`Max file size: ${storageDetails.max_file_size}`);
                console.log(`Uploaded files size: ${filesize}`);
                console.log(`Uploaded file is bigger than upload limit: ${filesize > storageDetails.max_file_size}`);
                console.log(`Adding file exceeding storage limits: ${(storageDetails.used += filesize) > storageDetails.max}`);
                return res.status(507).send("Insuffficient Storage OR file too big to upload");
            }

            const fileName = Date.now() + "-" + file.name;
            // //Scalar query for getting the id of the user given the email
            sql = `
            INSERT INTO UserMedia (user_id, name, path, date_added, ext, og_name, mimetype, file_size) 
            VALUES (?,?,?,?,?,?,?,?)`;
            const dateStr = new Date().toISOString();
            const partedName = file.name.split('.');            
            const fileExt = partedName[partedName.length - 1];

            //When server is actually active, change the path to be relative and include the server url at beginning.
            //also keep files in a static folder

            const basepath = `${process.env.BASE_FILE_PATH}/${email}/`; //Left up to the user to add in their .env
            const filepath = `${basepath}${fileName}`;
            fs.mkdirSync(basepath, { recursive: true });    //Creates filepath if it doesn't exist

            const params = [userID, fileName, filepath, dateStr, fileExt, file.name, file.mimetype, filesize];  //I divide here to convert it to kb for more compact storage in the db

            db.run(sql, params, async function(err){
                if(err){
                    console.error(err.message);
                    return res.status(409).send('File with that name already exists!');
                }else{
                    sql = 'SELECT * FROM UserMedia WHERE user_id = ? AND og_name = ?';
                    db.get(sql, [userID, file.name], (err, row) => {
                        if (err) return res.status(500).send(err.message);

                        // Move the file to the desired location
                        file.mv(filepath, err => {
                            if (err) {
                                //Deletes the file from the database if there's an issue
                                let sql = "DELETE FROM UserMedia WHERE user_id = ? AND og_name = ?";
                                db.run(sql, [userID, file.name], (err) => {
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log('Deleted broken file from database');
                                    }
                                });
    
                                return res.status(500).send(err);
                            }

                            // Return or use the newly inserted record as needed
                            res.json(row);
                        });
                    });
                }
            });
        }
    };

    //For renaming files
    const putMedia = async (req, res) =>{
        console.log('Hit putMedia controller');
        const {account} = req.account;
        const {email, id} = account;
        const ogName = req.body.ogName;
        let newName = req.body.newName;

        if(!email || !id || !ogName || !newName) {
            console.log("One or more required fields not provided!");
            return res.status(404).send("One or more required fields not provided!");
        }

        newName = newName.replace(" ", "_");

        //1. Get filepath
        let sql = "SELECT path, date_added, ext, mimetype, file_size FROM UserMedia WHERE og_name = ? AND user_id = ?"
        let params = [ogName, id];
        db.get(sql, params, (err, row) =>{
            if(err || !row) {
                console.error('Error when getting path');
                console.log(row);
                return res.status(404).send("File not found!");
            }
            const oldPath = row.path;
            const date_added = row.date_added;
            const ext = row.ext;
            const mimetype = row.mimetype;
            const file_size = row.file_size;

            //2. Rename the file in the file system with an updated time stamp as well
            const newFileName = Date.now() + "-" + newName;
            const newPath = `/var/uploads/${email}/${newFileName}`;

            fs.rename(oldPath, newPath, (err) =>{
                if(err) {
                    console.error(err);
                    return res.status(500).send("Error, couldn't delete file!");
                }

                //3. Update database with new filename and path
                sql = 
                `UPDATE UserMedia
                SET path = ?, name = ?, og_name = ?
                WHERE user_id = ? AND path = ?
                `
                params = [newPath, newFileName, newName, id, oldPath];
                db.run(sql, params, (err)=>{
                    if(err) {
                        console.error(err);
                        return res.status(500).send("Something went wrong with updating your filename");
                    }
                    //4. Return updated file
                    console.log('Successfully renamed your file!');
                    res.json({
                        date_added: date_added,
                        ext: ext,
                        og_name: newName,
                        mimetype: mimetype,
                        file_size: file_size
                    });
                });
            });
        });
    };

    const deleteMedia = async (req, res) =>{
        const {account} = req.account;
        const {email, id} = account;
        const ogName = req.query.ogName;
        console.log(`EMAIL: ${email}, OGNAME: ${ogName}`);

        let sql = "SELECT path FROM UserMedia WHERE user_id=? AND og_name=?";
        const params = [id, ogName];

        //Do query to get the file path
        db.get(sql, params, (err, row)=>{
            if(err || !row) {
                console.error("File not found!");
                return res.status(404).send('File not found!');
            }
            const filePath = row.path;
            console.log(filePath);
            sql = 'DELETE FROM UserMedia WHERE user_id=? AND og_name=?';
            db.run(sql, params, async (err) =>{
                if(err){
                    res.status(500).send('Could not remove the specified file');
                    return console.log("Couldn't remove file!");
                }
                console.log("Successfully deleted the record!");
                deleteFile(filePath)
                .then(msg =>{
                    console.log(msg);
                    res.status(200).send(msg);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Could not remove the specified file')
                });
            });
        });
    }

    const downloadMedia = async (req, res) =>{
        console.log('Hit downloadMedia controller');

        if(!req.account) return res.status(404).send("Email or file not found");

        const {account} = req.account;
        const {email, id} = account;

        const filename = req.query.filename;
        const isCompressed = req.query.isCompressed === 'true';

        if(!email || !filename || isCompressed === undefined) return res.status(404).send("Email or file not found");

        if(!id) return res.status(404).send("User not found");

        //Do query to get the file path
        const sql = 'SELECT name, path, mimetype, ext FROM UserMedia WHERE og_name = ? AND user_id = ?';

        db.get(sql, [filename, id], async (err, row)=>{
            if(err || !row) return console.error(err);
            filePath = row.path;
            const stamped_filename = row.name;
            const ext = row.ext;
            const mimetype = row.mimetype;
            const mediaType = mimetype.split('/')[0];


            if(isCompressed && mediaType === "image"){
                //For resizing the image if it's supposed to be compressed
                sharp(filePath)
                .resize(640, 480)   //Output buffer is 360 x 480
                .toBuffer((err, buffer) => {
                    if (err) {
                        console.log("Error resizing image");
                        return res.status(500).send("Error resizing image");
                    }
                    console.log(`${filename} sent as compressed!`);
                    return res.contentType(mimetype).send(buffer);
                });
            }else if(isCompressed && mediaType === "video"){
                try{
                    console.log('Going to try to downscale video');
                    const downscaledPath = await conversion.downScaleVideo(filePath, stamped_filename, ext, "480");
                    res.sendFile(downscaledPath, (err) =>{
                        if (err) {
                            console.error("Send file error: ", err.message);
                        }else{
                            console.log(`${filename} has been sent downscaled!`);
                        }
                        //Unlink the file no matter what
                        fs.unlink(downscaledPath, (err) =>{
                            if(err) return console.error("Temp file couldn't be deleted!");
                            console.log('Temp file successfully deleted!');
                        });                
                    });
                }catch(err){
                    console.error(err);
                    res.sendFile(filePath, (err) =>{
                        if (err) return res.status(500).end()/*.send('Error sending file');*/
                        console.log(`${filename} File sent normally as there was an issue with downscaling!`);
                    });
                }
            }else{
                //Send uncompressed
                res.sendFile(filePath, (err) =>{
                    if (err) return res.status(500).end()/*.send('Error sending file');*/
                    console.log(`${filename} File sent normally without compression!!`);
                });
            }
        });
    }

    return{
        getMedia, 
        postMedia,
        putMedia,
        deleteMedia,
        downloadMedia,
    };
}