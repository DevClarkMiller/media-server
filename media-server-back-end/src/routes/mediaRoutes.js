module.exports = (app, dbObj/*, upload*/) =>{
    const mediaController = require('../controllers/mediaControllers')(dbObj);
    //Middleware that checks if file is able to be downloaded and sets the dir
    app.route('/media')
        .get(mediaController.getMedia)
        .post(mediaController.postMedia)
        .put(mediaController.putMedia)
        .delete(mediaController.deleteMedia);

    app.route('/media/download')
        .get(mediaController.downloadMedia);
}