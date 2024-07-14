const jwt = require('jsonwebtoken');

const cookieJwtAuth = async (req, res, next) =>{
    const token = req.cookies.token;
    
    try{
        if(!token) throw new Error("Token not found");
        const account = await jwt.verify(token, process.env.JWT_SECRET);
        
        req.account = account;
        next();
    }catch(err){
        //console.error(err);
        console.error("User token expired or doesn't exist");
        res.clearCookie("token");
        res.cookie("signedIn", false);
        return res.status(403).send("User token expired or doesn't exist");
    }
}

module.exports = cookieJwtAuth;