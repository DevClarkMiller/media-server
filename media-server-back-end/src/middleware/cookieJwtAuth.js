const jwt = require('jsonwebtoken');

const cookieJwtAuth = async (req, res, next) =>{
    const token = req.cookies.token;
    
    try{
        if(!token) throw new Error("Token not found");
        const account = await jwt.verify(token, process.env.JWT_SECRET);
        const decodedToken = jwt.decode(token, process.env.JWT_SECRET);

        const nowUNIX = Math.floor(new Date().getTime() / 1000);    //Get current time in unix format
        const timeLeft = decodedToken.exp - nowUNIX;

        if(timeLeft <= 60){ //If users token has less than a minute left, sign a new one
            const {account} = decodedToken; 
            const newToken = jwt.sign({account: account}, process.env.JWT_SECRET, {expiresIn: "900s"});
            res.cookie("token", newToken, {
                httpOnly: true, //Prevents browser javascript from seeing the cookies
            });
            console.log('Users token has been refreshed!');
        }
        
        req.account = account;
        next();
    }catch(err){
        //console.error(err);
        console.error("User token expired or doesn't exist");
        res.clearCookie("token");
        return res.status(403).send("User token expired or doesn't exist");
    }
}

module.exports = cookieJwtAuth;