module.exports = (dbObj) =>{
    const fs = require('fs');
    const path = require('path');
    const db = dbObj.DB;

    const getUsersID = (email) =>{
        return new Promise((resolve, reject) =>{
            const sql = `SELECT id FROM User WHERE email = ?`;
            db.get(sql, [email], (err, row)=>{
                if(err) reject(err.message);
                if(!row) reject("User not found!");
                console.log(`Found user with the ID: ${row.id}`);
                resolve(row.id);
            });
        })
    }

    const getMedia = async (req, res) =>{
        console.log('Hit getMedia controller');
        const email = req.query.email;

        let userID = await getUsersID(email);
        if(!userID){
            console.error("User not found!");
            return;
        }

        const sql = 'SELECT * FROM UserMedia WHERE user_id = ?';
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

        const email = req.body.email;
        console.log(`USERS EMAIL: ${email}`);

        let userID = await getUsersID(email);
        if(!userID){
            console.error("User not found!");
            return;
        }

        //Uploads each file
        for(let fileItem of files){
            let file = fileItem.file;
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

            const basepath = `C:\\projects\\media-server\\media-server-back-end\\uploads\\${email}\\`;
            const filepath = `basepath${fileName}`;
            fs.mkdirSync(basepath, { recursive: true });    //Creates filepath if it doesn't exist

            const params = [userID, fileName, filepath, dateStr, fileExt, file.name, file.mimetype];

            db.run(sql, params, async (err)=>{
                if(err){
                    console.error(err.message);
                    res.status(409).send('File with that name already exists!');
                }else{
                    sql = 'SELECT * FROM UserMedia WHERE user_id = ? AND og_name = ?';
                    db.get(sql, [userID, file.name], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }
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
            }); 
        });
        res.status(200).send("Successfully removed the file!");
    }

    return{
        getMedia, 
        postMedia,
        putMedia,
        deleteMedia
    };
}