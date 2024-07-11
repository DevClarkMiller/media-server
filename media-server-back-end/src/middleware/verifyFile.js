module.exports = (dbObj) =>{
    const db = dbObj.DB;

    const verifyFile = async (req, res, next) =>{
        const email = req.body.email;
        console.log(`EMAIL: ${email}`);

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

