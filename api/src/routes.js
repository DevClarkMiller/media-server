module.exports = (app, dbObj) =>{
    require('./routes/mediaRoutes')(app, dbObj);   //Contains routes for media
    require('./routes/accountRoutes')(app, dbObj);
}