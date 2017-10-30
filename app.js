const express = require('express');

// nodejs modules
const path = require('path');

// npm package modules
const logger = require('morgan'); // Логгер уровня запросов
const log = require('./libs/log')(module); // Информативный логгер
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sendHttpError = require('./middlewares/sendHttpError');

// custom modules
const HttpError = require('./errors/index').HttpError;
const passport = require('./auth/passport');

// route modules
const users = require('./routes/users');
const token = require('./routes/token');


// create app
const app = express();

//*******************************************************//
// configures middleware                                 //
//*******************************************************//

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sendHttpError);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

//*******************************************************//
// routes middleware                                     //
//*******************************************************//

app.use('/token', token);
app.use('/users', users);

//*******************************************************//
// error 404 middleware                                  //
//*******************************************************//

app.use((req, res, next) => {
  next(404);
});

//*******************************************************//
// error handler middlerware                             //
//*******************************************************//

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
