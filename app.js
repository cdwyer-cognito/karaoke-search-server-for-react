const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const searchRouter = require('./routes/search');
const newRequestRouter = require('./routes/newRequest');
const submittedRequestsRouter = require('./routes/submittedRequests');
const completedRequestRouter = require('./routes/completedRequests');
const adminRouter = require('./routes/admin');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// enable CORS
app.use(cors());

app.use('/api/find-songs', searchRouter);
app.use('/api/new-request', newRequestRouter);
app.use('/api/submitted-requests', submittedRequestsRouter);
app.use('/api/completed-request', completedRequestRouter);
app.use('/api/admin-task', adminRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  // next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(JSON.stringify({ 'error': err }));
});

module.exports = app;
