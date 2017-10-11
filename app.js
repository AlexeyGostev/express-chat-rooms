const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sendHttpError = require('./middlewares/sendHttpError');
const HttpError = require('./errors/index').HttpError;
const log = require('./libs/log')(module);

const user = require('./routes/user.js');

const app = express();

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

// routes middleware

app.use('/user', user);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(404);
});

// error handler
app.use((err, req, res, next) => {
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
