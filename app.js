const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan');
const bodyParser= require('body-parser')
const basePath = process.cwd()
const fs = require("fs")

const app = express();
app.set('view engine', 'ejs')
app.use(express.static(`${basePath}/node_modules/bootstrap`))
app.use(express.static(`${basePath}/node_modules/@fortawesome/fontawesome-free/`))
app.use(express.static(`${basePath}/node_modules/dropzone`))
app.use(express.static(`${basePath}/public`))
app.use(express.static(`${basePath}/views`))
app.use(express.static(`${basePath}/tmp`))

//app.use(multer({ dest: `${basePath}/public/asset/attributes`}));

//app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
/* Routing */
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  res.send('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});
module.exports = app;
