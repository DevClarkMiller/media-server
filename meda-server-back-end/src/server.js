require('dotenv').config();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const express = require('express');
const sqlDB = require('./database');
const app = express();

app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, res) =>{
        res(`uploads/${req.body.email}/`);   //Users will have their own folder based off email
    },
    filename: (req, file, res) => {
        res(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

const start = async () =>{
    let dbObj = new sqlDB();
    await dbObj.createDB();
    require('./routes')(app, dbObj, upload);

    app.listen(process.env.PORT, () =>{
        console.log(`✅ Active on port: ${process.env.port}`);
    })
}

start();