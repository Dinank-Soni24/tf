const express = require('express');
const app = express();

// import routes
const textRoute = require('./api/routes/text');
const tensorRoute = require('./api/routes/tensor');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files (HTML, JavaScript, CSS)
app.use(express.static('public'));

// routes
app.use('/text', textRoute);
app.use('/tensor', tensorRoute);

// handle 404
app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  next(err);
});

// handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    err: {
      message: err.message,
    },
  });
});

module.exports = app;
