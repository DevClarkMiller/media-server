module.exports = (app, dbObj, upload) =>{
    const mediaController = require('../controllers/mediaControllers')(dbObj);
    //Middleware that checks if file is able to be downloaded and sets the dir
    const verifyFile = require('../middleware/verifyFile')(dbObj);
    app.route('/media')
        .get(mediaController.getMedia)
        .post([verifyFile, upload.single('file')], mediaController.postMedia)
        .put(mediaController.putMedia)
        .delete(mediaController.deleteMedia)
}