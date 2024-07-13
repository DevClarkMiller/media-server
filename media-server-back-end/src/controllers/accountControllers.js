module.exports = (dbObj) =>{
    const fs = require('fs');
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(5);
    const jwt = require('jsonwebtoken');
    const db = dbObj.DB;
    require('dotenv').config();

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

        const account = req.account;

        if(!account) return res.status(400).send();
        res.json(account);
    }

    const login = async (req, res) =>{
        console.log('Hit login controller');

        const {email, password} = req.body;

        let sql = 'SELECT email, password, first_name, last_name FROM User WHERE email = ?';
        try{
            db.get(sql, email, async function(err, row){
                if(err){
                    console.error(err);
                    return res.status(404).send("User not found!");
                }
                //Then check if the password is valid
                const passMatches = await verifyPassword(password, row.password);
                if(!passMatches) return res.status(403).send(`Your login details seem to be incorrect`);

                //Token only lasts for 900 seconds which is 15 minutes before expiring
                const token = jwt.sign({account: row}, process.env.JWT_SECRET, {expiresIn: "900s"});
                console.log('NEW TOKEN CREATED!');

                delete row.password;    //Removes password for sercurity reasons
                console.log(row);

                res.cookie("token", token, {
                    httpOnly: true, //Prevents browser javascript from seeing the cookies
                });

                res.json(row);
            });
        }catch (err){
            console.error(err);
            res.status(400).send(err.message);
        }
    }

    const deleteAccount = async (req, res) =>{

    }

    const createAccount = async (req, res) =>{
        const {email, password, firstname, lastname} = req.body;

        try{
            //1. Hash + Salt password
            const hashedPass = await bcrypt.hash(password, salt);

            let sql = `
            INSERT INTO User (email, fist_name, last_name, password, max_storage) 
            VALUES (?,?,?,?,?)`;
            const params = [email, firstname, lastname, hashedPass, 5];

            db.run(sql, params, async function(err){
                if(err){
                    console.error(err);
                    return res.status(500).send("Error encountered with creating");
                }
                console.log(`USER WITH EMAIL: ${email} HAS BEEN CREATED WITH AN ID OF: ${this.lastID}`);

                //Then creates a session token and returns it to the user
            });
        }catch(error){
            console.error(error);
            res.status(400).send(error);
        }
    }

    return{
        isUserAuth,
        login,
        deleteAccount,
        createAccount
    }
}