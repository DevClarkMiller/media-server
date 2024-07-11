require('dotenv').config();
const cors = require('cors');
const multer = require('multer');
const express = require('express');

const sqlDB = require('./database');
const fs =  require('fs');

const start = async () =>{
    const app = express();
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(express.json());
    app.use(cors({
        origin: "*"
    }));

    // Set up multer for file uploads
    const storage = multer.diskStorage({
        destination: (req, file, cb) =>{
            //Creates dir if it doesn't exist
            const path = `uploads/${req.body.email}/`;
            fs.mkdirSync(path, { recursive: true })

            cb(null, `uploads/${req.body.email}/`);   //Users will have their own folder based off email
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        },
    });
    const upload = multer({ storage: storage });

    let dbObj = new sqlDB();
    await dbObj.createDB();
    require('./routes')(app, dbObj, upload);

    app.listen(process.env.PORT, () =>{
        console.log(`✅ Active on port: ${process.env.port}`);
    })
}

start();