const cors = require('cors');
const express = require('express');
const routes = require('../index.route');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin);
  },
  credentials: true
}));

app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Url not found');
  err.response = {
    status: 404,
    statusText: 'Url not found'
  };
  return next(err);
});

app.use((err, req, res, next) =>

  res.status(err.response.status).json({
    message: err.response.statusText || err.response.data.message || err.message,
    stack: err.stack
  })
);

module.exports = app;