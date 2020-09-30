const express = require('express');
const router = express.Router();

// retorna todos os pedidos
router.get('/', (req, res, next) => {
  res.status(200).send({ message: 'usando o GET dentro de rota de pedidos' });
});

// insere um pedido
router.post('/', (req, res, next) => {
  const pedido = {
    id_produto: req.body.id_produto,
    quantidade: req.body.quantidade,
  };
  res
    .status(200)
    .send({ message: 'o pedido foi criado', pedidoCriado: pedido });
});

// retorna um pedido especifico
router.get('/:id_pedido', (req, res, next) => {
  const id = req.params.id_pedido;

  if (id === 'especial') {
    res.status(200).send({ message: 'detalhes do pedido', id });
  }
});

// deleta um pedido
router.delete('/', (req, res, next) => {
  res
    .status(200)
    .send({ message: 'usando um DELETE dentro da rota de pedidos' });
});

module.exports = router;
