const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const routeProdutos = require('./routes/produtos');
const routePedidos = require('./routes/pedidos');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // no lugar de *, poderia ser um servidor especifico https://meusite.com.br
  res.header(
    'Acces-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method === 'OPTIONS' || req.method === 'options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

    return res.status(200).send({});
  }

  next();
});

app.use('/produtos', routeProdutos);
app.use('/pedidos', routePedidos);

app.use((req, res, next) => {
  const error = new Error('Nenhuma rota encontrada.');
  error.status = 400;

  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  return res.send({
    error: { message: error.message },
  });
});

module.exports = app;
