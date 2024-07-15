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

    const readHTMLFile = (path, callback) =>{
        fs.readFile(path, {encoding: 'utf-8'}, (err, html) =>{
            if(err) {
                throw err;
            }else{
                callback(null, html);
            }
        });
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

        let sql = 'SELECT id, email, password, first_name, last_name FROM User WHERE email = ?';
        try{
            db.get(sql, email, async function(err, row){
                if(err){
                    console.error(err);
                    return res.status(404).send("User not found!");
                }

                if(!row || !row.password) return res.status(404).send("User not found!");
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

    const accountActivated = async (req, res) =>{
        const account = req.account;

        if(!account || !account?.id) return res.status(410).send('Link for account authentication has expired!');   //NOTE - GIVE USERS ABILITY TO GENERATE A NEW LINK!

        let sql = `
        UPDATE User 
        SET account_status = "active"
        WHERE id = ?;
        `;
        db.run(sql, [account.id], function(err){
            if(err){
                res.status(404).send("Couldn't find account or something went wrong when trying to authenticate!");
            }else{
                res.status(200).send("Your account has been successfully activated! Enjoy storing your files with safety and simplicity!");
            }
        });
    }

    const createAccount = async (req, res) =>{
        const {email, password, firstname, lastname} = req.body;

        try{
            //1. Hash + Salt password
            const hashedPass = await bcrypt.hash(password, salt);

            let sql = `
            INSERT INTO User (email, first_name, last_name, password, max_storage, max_file_size) 
            VALUES (?,?,?,?,?,?)`;
            const params = [email, firstname, lastname, hashedPass, 5000000, 1000000];

            db.run(sql, params, async function(err){
                if(err){
                    console.error(err);
                    return res.status(500).send("Error encountered with creating");
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

                res.cookie("token", token, {
                    httpOnly: true, //Prevents browser javascript from seeing the cookies
                });

                res.json({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    accountStatus: "not-active"
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
        signOut
    }
}