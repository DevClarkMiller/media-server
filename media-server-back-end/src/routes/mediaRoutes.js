module.exports = (app, dbObj/*, upload*/) =>{
    const mediaController = require('../controllers/mediaControllers')(dbObj);
    const cookieJwtAuth = require('../middleware/cookieJwtAuth');
    //Middleware that checks if file is able to be downloaded and sets the dir
    app.route('/media')
        .get(cookieJwtAuth, mediaController.getMedia)
        .post(cookieJwtAuth, mediaController.postMedia)
        .put(cookieJwtAuth, mediaController.putMedia)
        .delete(cookieJwtAuth, mediaController.deleteMedia);

    app.route('share')  // Route for shared files
        .post(cookieJwtAuth, null)
        // Person accessing the shared media must have an account, this route downloads the file
        .get(cookieJwtAuth, null);  

    app.route('/media/download')
        .get(cookieJwtAuth, mediaController.downloadMedia);
}