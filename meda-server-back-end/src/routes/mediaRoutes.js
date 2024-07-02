module.exports = (app, dbObj, upload) =>{
    const mediaController = require('../controllers/mediaControllers')(dbObj);
    app.route('/media')
        .get(mediaController.getMedia)
        .post(upload.single('file'), mediaController.postMedia)
        .put(mediaController.putMedia)
        .delete(mediaController.deleteMedia)
}