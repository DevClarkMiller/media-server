module.exports = (app, dbObj/*, upload*/) =>{
    const mediaController = require('../controllers/mediaControllers')(dbObj);
    const cookieJwtAuth = require('../middleware/cookieJwtAuth');
    //Middleware that checks if file is able to be downloaded and sets the dir
    app.route('/media')
        .get(cookieJwtAuth, mediaController.getMedia)
        .post(cookieJwtAuth, mediaController.postMedia)
        .put(cookieJwtAuth, mediaController.putMedia)
        .delete(cookieJwtAuth, mediaController.deleteMedia);

    app.route('/media/download')
        .get(cookieJwtAuth, mediaController.downloadMedia);
}