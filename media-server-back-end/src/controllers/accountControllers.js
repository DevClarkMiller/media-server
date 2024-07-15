const path = require('path');

module.exports = (dbObj) =>{
    const fs = require('fs');
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(5);
    const jwt = require('jsonwebtoken');
    const db = dbObj.DB;
    const handlebars = require('handlebars');
    const nodemailer = require('nodemailer');
    require('dotenv').config();

    //HTML Email Template paths
    const html_confirmation_path = './src/email-templates/account_confirmation.html';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: process.env.TRANSPONDER_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const sendMail = async (trans, mailOpts) =>{
        try{
            await trans.sendMail(mailOpts);
            console.log('Authentication email successfully sent!');
        }catch(error){
            console.log(error);
        }
    }

    const createMailOptions = (details) =>{
        const mailOptions = {
            from: {
                name: details.name
            },
            to: details.sendTo,
            subject: details.subject,
            text: details.text,
            html: details.html
        }
        return mailOptions;
    }

    const mailAuthentication = async (email, html_template) =>{
        const mailOpts = createMailOptions({
            name: 'drive.clarkmiller.ca',
            subject: "Account creation authentication",
            sendTo: email,
            text: "Thank you for signing up, to activate your account, please click the link",
            html: html_template

        });
        sendMail(transporter, mailOpts);
    }

    const verifyPassword = async (pass, hashedPass) =>{
        try{
            const match = await bcrypt.compare(pass, hashedPass);
            return match;
        }catch(err){
            return false;
        }
    }

    const isUserAuth = async (req, res) =>{
        console.log('Hit isUserAuth controller');    

        let account = req.account;

        if(!account) return res.status(400).send();
        delete account.id;  //Removes the id from the return value of this function
        delete account.password;

        res.json(account);
    }

    const login = async (req, res) =>{
        console.log('Hit login controller');

        const {email, password} = req.body;

        let sql = 'SELECT id, email, password, first_name, last_name, account_status FROM User WHERE email = ?';
        try{
            db.get(sql, email, async function(err, row){
                if(err){
                    console.error(err);
                    return res.status(404).send("User not found!");
                }

                if(!row || !row.password|| row?.account_status === "not-active") return res.status(404).send("User not found, or account isn't activated!");
                //Then check if the password is valid
                const passMatches = await verifyPassword(password, row.password);
                if(!passMatches) return res.status(403).send(`Your login details seem to be incorrect`);

                //Token only lasts for 900 seconds which is 15 minutes before expiring
                const token = jwt.sign({account: row}, process.env.JWT_SECRET, {expiresIn: "900s"});
                console.log('NEW TOKEN CREATED!');

                res.cookie("token", token, {
                    httpOnly: true, //Prevents browser javascript from seeing the cookies
                });

                res.json({
                    firstname: row.first_name,
                    lastname: row.last_name,
                    email: row.email
                });
            });
        }catch (err){
            console.error(err);
            res.status(400).send(err.message);
        }
    }

    const deleteAccount = async (req, res) =>{

    }

    //When users go to create an account, the account details will be inserted into the database, and have the accountStatus set as not-active
    //Then when they hit this route, their account will get activated
    const activateAccount = async (req, res) =>{
        console.log('Hit activateAccount controller');
        const token = req.query.token;

        if(!token) return res.status(404).send('Account token not provided!');

        try{
            const {account} = await jwt.verify(token, process.env.JWT_SECRET);

            if(!account || !account?.id) {
                console.error('Link for account authentication has expired!');
                return res.status(410).send('Link for account authentication has expired!');   //NOTE - GIVE USERS ABILITY TO GENERATE A NEW LINK!}
            }
            let sql = `
            UPDATE User 
            SET account_status = "active"
            WHERE id = ?;
            `;
            db.run(sql, [account.id], function(err){
                if(err){
                    res.status(404).send("Couldn't find account or something went wrong when trying to authenticate!");
                }else{
                    console.log('Users account has now been verified');
                    //Gives the user a token cookie upon account activation
                    res.cookie("token", token, {
                        httpOnly: true, //Prevents browser javascript from seeing the cookies
                    });
                    res.status(200).send("Your account has been successfully activated! Enjoy storing your files with safety and simplicity!");
                }
            });
        }catch(err){
            res.status(400).send('Token is malformed!');
        }
    }

    const createAccount = async (req, res) =>{
        const {email, password, firstname, lastname} = req.body;
        if(!email || !password || !firstname || !lastname) return res.status(404).send("One or more crucial fields weren't provided");
        console.log(req.body);
        try{
            //1. Hash + Salt password
            const hashedPass = await bcrypt.hash(password, salt);

            let sql = `
            INSERT INTO User (email, first_name, last_name, password, max_storage, max_file_size, account_status) 
            VALUES (?,?,?,?,?,?, "not-active")`;
            const params = [email, firstname, lastname, hashedPass, 5000000, 1000000];

            db.run(sql, params, async function(err){
                if(err){
                    console.error(err);
                    return res.status(500).send("Error encountered with creating account");
                }
                console.log(`USER WITH EMAIL: ${email} HAS BEEN CREATED WITH AN ID OF: ${this.lastID}`);

                const account = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    id: this.lastID,
                    accountStatus: "not-active"
                };

                const token = jwt.sign({account: account}, process.env.JWT_SECRET, {expiresIn: "900s"});
                console.log('NEW TOKEN CREATED!');

                const baseUrl = process.env.AUTHENTICATION_BASE_URL;
                const queryParams = new URLSearchParams({
                    token: token
                });

                const fullUrl = `${baseUrl}?${queryParams.toString()}`;

                //Reads in the html
                fs.readFile(path.resolve(html_confirmation_path), {encoding: 'utf-8'}, (err, html) =>{
                    if(err) {
                        console.log(path.resolve(html_confirmation_path));
                        console.log(err);
                        // console.error('Something went wrong when reading in the html');
                    }else{
                        const template = handlebars.compile(html);
                        const confirmation_html = template({confirmation_url: fullUrl});
                        mailAuthentication(email, confirmation_html);
                        res.status(200).send("Email confirmation sent!");
                    }
                });
            });
        }catch(error){
            console.error(error);
            res.status(400).send(error);
        }
    }

    const signOut = (req, res) =>{
        console.log('Hit signOut controller');
        res.clearCookie("token");
        res.status(200).send("You should now be logged out!");
    } 

    return{
        isUserAuth,
        login,
        deleteAccount,
        createAccount,
        signOut,
        activateAccount
    }
}