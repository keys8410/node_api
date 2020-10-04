const express = require('express');

const { verifyLogin } = require('../middleware/jwt');

const {
  getPedidos,
  postPedidos,
  getUniquePedido,
  deletePedido,
} = require('../controllers/pedidos');
const router = express.Router();

router.get('/', getPedidos);

router.post('/', verifyLogin, postPedidos);

router.get('/:id_pedido', getUniquePedido);

router.delete('/', verifyLogin, deletePedido);

module.exports = router;
