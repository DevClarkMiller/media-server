const jwt = require('jsonwebtoken');

const cookieJwtAuth = async (req, res, next) =>{
    const token = req.cookies.token;
    console.log('Hit cookiejwtAuth');
    
    try{
        const account = await jwt.verify(token, process.env.JWT_SECRET);
        
        if(!token) throw new Error("Token not found");
        req.account = account;
        next();
    }catch(err){
        //console.error(err);
        console.error("User token expired or doesn't exist");
        res.clearCookie("token");
        res.cookie("signedIn", false);
    }
}

module.exports = cookieJwtAuth;