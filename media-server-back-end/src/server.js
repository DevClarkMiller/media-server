require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const sqlDB = require('./database');

const start = async () =>{
    const app = express();
    app.use(fileUpload());
    app.use(cookieParser());
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }));

    app.use(bodyParser.json()); // for JSON data

    let dbObj = new sqlDB();
    await dbObj.createDB();
    require('./routes')(app, dbObj);

    app.listen(process.env.PORT, () =>{
        console.log(`✅ Active on port: ${process.env.port}`);
    })
}

start();