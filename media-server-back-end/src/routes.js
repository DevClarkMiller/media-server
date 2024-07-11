module.exports = (app, dbObj, upload) =>{
    require('./routes/mediaRoutes')(app, dbObj, upload);   //Contains routes for media
}