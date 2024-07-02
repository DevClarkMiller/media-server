module.exports = (dbObj, upload) =>{
    const fs = require('fs');
    const path = require('path');
    const db = dbObj.DB;

    const getMedia = (req, res) =>{
        const user = req.query.user;

        const sql = 'SELECT * FROM Media;';
        db.all(sql, [], (err, rows)=>{
            if(err){
                return console.error(err.message);
            }else{
                res.send(rows);
            } 
        });
    };

    const postMedia = (req, res) =>{
        if(!req.file) res.send('File failed to upload');
        const file = req.file;
        const creator = req.body.creator;
        console.log(creator);
        console.log(file);

        sql = 'INSERT INTO Media (name, path, date_added, ext, creator, og_name) VALUES (?,?,?,?,?,?)'

        const dateStr = new Date().toISOString();
        const partedName = file.originalname.split('.');
        const fileExt = partedName[partedName.length - 1];

        //When server is actually active, change the path to be relative and include the server url at beginning.
        //also keep files in a static folder
        const params = [file.filename, path.resolve(file.path), dateStr, fileExt, creator, file.originalname];

        db.run(sql, params, (err)=>{
            if(err){
                //Deletes the file if there was an issue with the query
                fs.unlinkSync(file.path,(err) => {
                    if(err) return console.error("Error removing file!");
                    console.log('Removed bad file');
                });
                return console.error(err.message);
            }else{
                console.log('Successfully inserted file!');
            }
        });

        res.send('Success!');
    };

    const putMedia = (req, res) =>{

    };

    const deleteMedia = (req, res) =>{
        const creator = req.query.creator;
        const ogName = req.query.ogName;
        console.log(`CREATOR: ${creator}, OGNAME: ${ogName}`);
        let filePath = "";
        let sql = "SELECT path FROM Media WHERE creator=? AND og_name=?";
        const params = [creator, ogName];

        //Do query to get the file path
        db.all(sql, params, (err, rows)=>{
            if(err) return console.error(err.message);
            const filePathObj = rows[0];
            if(!filePathObj) return console.error("File not found!");
            filePath = filePathObj.path;
            console.log(filePath);
        });
        sql = 'DELETE FROM Media WHERE creator=? AND og_name=?';
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