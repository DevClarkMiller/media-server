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
        if(!req.file) {
            console.error('File failed to upload');
            return res.send('File failed to upload');
        }
        const file = req.file;
        const email = req.body.email;
        console.log(email);
        console.log(file);

        let userID = await getUsersID(email);
        if(!userID){
            console.error("User not found!");
            return;
        }

        //Scalar query for getting the id of the user given the email
        sql = `
        INSERT INTO UserMedia (user_id, name, path, date_added, ext, og_name) 
        VALUES (?,?,?,?,?,?)`;
        const dateStr = new Date().toISOString();
        const partedName = file.originalname.split('.');
        const fileExt = partedName[partedName.length - 1];

        //When server is actually active, change the path to be relative and include the server url at beginning.
        //also keep files in a static folder
        const params = [userID, file.filename, path.resolve(file.path), dateStr, fileExt, file.originalname];

        db.run(sql, params, async (err)=>{
            if(err){
                //Deletes the file if there was an issue with the query
                try{
                    await fs.unlinkSync(file.path);
                    console.log('Removed bad file');
                }catch(err) { return console.error("Error removing file!"); }

                console.log('SQL ERROR ->');
                console.error(err.message);
                res.status(409).send('File with that name already exists!');
            }else{
                sql = 'SELECT * FROM UserMedia WHERE user_id = ? AND og_name = ?';
                db.get(sql, [userID, file.originalname], (err, row) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Newly inserted record:', row);
                    res.json(row);
                    // Return or use the newly inserted record as needed
                });
            }
        });
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