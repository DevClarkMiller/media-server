module.exports = (dbObj) =>{
    const db = dbObj.DB;

    const verifyFile = async (req, res, next) =>{
        try{
            //Checks if user exists
            next();
        }catch(err){
            
        }
    }

    return verifyFile;
}

