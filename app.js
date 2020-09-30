const express = require('express');
const app = express();

const routeProducts = require('./routes/produtos');

app.use('/produtos', routeProducts);

module.exports = app;
