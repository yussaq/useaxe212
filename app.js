/*################################################################################################*\
#                                                                                                  #
#     .01   10.        .0101010.        .0110110.        .0010010.  100         011  .0101010.     #
#   1010     0101    0101010101000    0100101101100    1010010010100  010     110  0101001010100   #
#  0100       0101  1010             0110       0010             0110  010   010  0110       0010  #
# 010           100101001001111010000101000100101101001001011001010010  0011100  01101001010100010 #
#  1000       0010             0110  0010             0010       0110  010   000  0110             #
#   0010101011100    0110100010100    0110101010110    0110101101010  011     101  0110111010000   #
#     '0101010'        '0100100'        '0100110'        '1001010'  010         010  '0110100'     #
#                                                                                                  #
\*################################################################################################*/

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
app.use(express.static(`${basePath}/public/asset/json`))
app.use(express.static(`${basePath}/views`))
app.use(express.static(`${basePath}/tmp`))

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
