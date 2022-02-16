const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "node_modules/bootstrap")));
app.use(express.static(path.join(__dirname, "node_modules/@fortawesome/fontawesome-free/")));
//app.use(express.static(path.join(__dirname, "node_modules/font-awesome/")));

//app.use(express.static(path.join(__dirname, "node_modules/font-awesome/fonts")));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

/* Routing */
app.use('/', require('./routes/index'));
//app.use('/metadata', require('./routes/metadataRoute'));
//app.use('/setting', require('./routes/settingRoute');

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
//  res.render('error');
});

module.exports = app;
