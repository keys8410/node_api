const express = require('express');
const {
  getPedidos,
  postPedidos,
  getUniquePedido,
  deletePedido,
} = require('../controllers/pedidos');
const router = express.Router();

// retorna todos os pedidos
router.get('/', getPedidos);

// insere um pedido
router.post('/', postPedidos);

// retorna um pedido especifico
router.get('/:id_pedido', getUniquePedido);

// deleta um pedido
router.delete('/', deletePedido);

module.exports = router;
