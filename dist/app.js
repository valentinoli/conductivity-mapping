'use strict';

require('dotenv').config();
var express = require('express');

var app = express();

var server = require('http').createServer(app);
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('server');

var port = process.env.PORT || '3000';
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

app.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));

app.use(favicon(path.join(__dirname, './public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', require('./routes'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('404: Not Found ');
  err.status = '404';
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    status: err.status
  });
});

module.exports = app;