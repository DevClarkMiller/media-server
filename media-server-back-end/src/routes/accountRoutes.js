module.exports = (app, dbObj) =>{
    const accountController = require('../controllers/accountControllers')(dbObj);
    const cookieJwtAuth = require('../middleware/cookieJwtAuth');
    //Middleware that checks if file is able to be downloaded and sets the dir
    app.route('/account')
        .get(cookieJwtAuth, accountController.isUserAuth)
        .post(accountController.login)
        // .put(mediaController.putMedia) Add this for changing account details
        .delete(accountController.deleteAccount)

    
    app.route("/account/create")
        .post(accountController.createAccount)
        .get(accountController.activateAccount);
    
    app.route("/account/signout")
        .delete(accountController.signOut);

    app.route("/account/storage")
        .get(accountController.storageDetails)
}