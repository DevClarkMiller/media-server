module.exports = (dbObj) =>{
    const db = dbObj.DB;

    const verifyFile = async (req, res, next) =>{
        console.log('Hit verifyFile middle ware');

        let rawBody = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            rawBody += chunk;
        });

        console.log(rawBody);

        const email = req.body.email;
        console.log(`EMAIL: ${email}`);

        if(!email) return res.status(404).send("Error, email was undefined!");

        //Checks if user exists
        const sql = 'SELECT COUNT(*) as count FROM User WHERE email = ?';
        db.get(sql, [email], (err, row)=>{
            if(err) return res.status(404).send("Account with given email not found");
            if(row.count === 0) return res.status(404).send("email not found");
            console.log('Email found by middleware');
            next();
        });
        
    }

    return verifyFile;
}

