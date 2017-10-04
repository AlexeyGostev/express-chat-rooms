var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sendHttpError = require('./middlewares/sendHttpError');
var HttpError = require('./errors/index').HttpError;

var log = require('./libs/log')(module);

var app = express();

// view engine setup

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sendHttpError);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(404);
});

// error handler
app.use(function(err, req, res, next) {
  log.error(err);
  if (typeof err === 'number') err = new HttpError(err);

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    err = new HttpError(500);
    res.sendHttpError(err);
  }
});

module.exports = app;
