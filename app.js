const express = require('express');
const app = express();
const morgan = require('morgan');

const routeProdutos = require('./routes/produtos');
const routePedidos = require('./routes/pedidos');

app.use(morgan('dev'));

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
