const sqlite3 = require('sqlite3').verbose();

class sqlDB{
    constructor(){
        this.DB = null;
    }

    createDB(){
        return new Promise((resolve, reject) =>{
            this.DB = new sqlite3.Database(process.env.DB_PATH, sqlite3.OPEN_READWRITE, (err) =>{
                if(err) {
                    console.error(err);
                    reject(err);
                }else{
                    console.log('Database opened up successfully!');
                    resolve(this.DB);
                }
            });
        });
    }

    closeDB(){
        this.DB.close((err) => {
            if (err) {
                console.log(err);
            }
            console.log('Closed the database connection.');
        });
    }
}


module.exports = sqlDB;