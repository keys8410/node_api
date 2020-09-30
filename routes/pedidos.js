const express = require('express');
const router = express.Router();

// retorna todos os pedidos
router.get('/', (req, res, next) => {
  res.status(200).send({ message: 'usando o GET dentro de rota de pedidos' });
});

// insere um pedido
router.post('/', (req, res, next) => {
  res.status(200).send({ message: 'usando o POST dentro de rota de pedidos' });
});

// retorna um pedido especifico
router.get('/:id_pedido', (req, res, next) => {
  const id = req.params.id_pedido;

  if (id === 'especial') {
    res
      .status(200)
      .send({ message: 'retorna o GET de um pedido exclusivo', id });
  }
});

// deleta um pedido
router.delete('/', (req, res, next) => {
  res
    .status(200)
    .send({ message: 'usando um DELETE dentro da rota de pedidos' });
});

module.exports = router;
