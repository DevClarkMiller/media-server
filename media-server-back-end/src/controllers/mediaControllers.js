module.exports = (dbObj) =>{
    const fs = require('fs');
    const db = dbObj.DB;
    const sharp = require('sharp');

    const getUsersID = (email) =>{
        return new Promise((resolve, reject) =>{
            const sql = `SELECT id FROM User WHERE email = ?`;
            db.get(sql, [email], (err, row)=>{
                if(err) return reject(err.message);
                if(!row) return reject("User not found!");
                resolve(row.id);
            });
        })
    }

    const getMedia = async (req, res) =>{
        console.log('Hit getMedia controller');

        const {account} = req.account;  //Note that it must be destructed here to work properly
        const userID = account.id;


        if(!userID) return res.status(404).send("Account not found");

        //Sends only safe data
        const sql = 'SELECT date_added, ext, og_name, mimetype FROM UserMedia WHERE user_id = ?';
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

        //Uploads each file
        for(let fileItem of files){
            if(!file) return res.status(500).send("File not uploaded!");

            let file = fileItem?.file;
            file.name = file.name.replace(" ", "");

            const fileName = Date.now() + "-" + file.name;
            // //Scalar query for getting the id of the user given the email
            sql = `
            INSERT INTO UserMedia (user_id, name, path, date_added, ext, og_name, mimetype) 
            VALUES (?,?,?,?,?,?,?)`;
            const dateStr = new Date().toISOString();
            const partedName = file.name.split('.');
            const fileExt = partedName[partedName.length - 1];

            //When server is actually active, change the path to be relative and include the server url at beginning.
            //also keep files in a static folder

            const basepath = `/var/uploads/${email}/`;
            const filepath = `${basepath}${fileName}`;
            fs.mkdirSync(basepath, { recursive: true });    //Creates filepath if it doesn't exist

            const params = [userID, fileName, filepath, dateStr, fileExt, file.name, file.mimetype];

            db.run(sql, params, async (err)=>{
                if(err){
                    console.error(err.message);
                    return res.status(409).send('File with that name already exists!');
                }else{
                    sql = 'SELECT * FROM UserMedia WHERE user_id = ? AND og_name = ?';
                    db.get(sql, [userID, file.name], (err, row) => {
                        if (err) return res.status(500).send(err.message);
                        console.log('Newly inserted record:', row);

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

    const putMedia = async (req, res) =>{

    };

    const deleteMedia = async (req, res) =>{
        const email = req.query.email;
        const ogName = req.query.ogName;
        console.log(`EMAIL: ${email}, OGNAME: ${ogName}`);

        const userID = getUsersID(email);

        let filePath = "";
        let sql = "SELECT path FROM UserMedia WHERE user_id=? AND og_name=?";
        const params = [userID, ogName];

        //Do query to get the file path
        db.get(sql, params, (err, row)=>{
            if(err) return console.error(err.message);
            if(!row) return console.error("File not found!");
            filePath = row.path;
            console.log(filePath);
        });
        sql = 'DELETE FROM UserMedia WHERE user_id=? AND og_name=?';
        db.run(sql, params, (err) =>{
            if(err){
                res.status(500).send('Could not remove the specified file');
                return console.log("Couldn't remove file!");
            }
            console.log("Successfully deleted the record!");

            fs.unlinkSync(filePath,(err) => {
                if(err){
                    res.status(500).send('Could not remove the specified file');
                    return console.log("Couldn't remove file!");
                }                
                res.status(200).send("Successfully removed the file!");
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
        const sql = 'SELECT path, mimetype FROM UserMedia WHERE og_name = ? AND user_id = ?';

        db.get(sql, [filename, id], (err, row)=>{
            if(err || !row) return console.error(err);
            filePath = row.path;
            const mimetype = row.mimetype;

            if(isCompressed && mimetype.split('/')[0] === "image"){
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
            }else{
                //Send uncompressed
                res.sendFile(filePath, (err) =>{
                    if (err) return res.status(500).end()/*.send('Error sending file');*/
                    console.log(`${filename} File sent!`);
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