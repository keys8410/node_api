const express = require('express');
const router = express.Router();

const { verifyLogin } = require('../middleware/jwt');

const {
  getProdutos,
  postProduto,
  getUniqueProduto,
  patchProduto,
  deleteProduto,
  uploadImg,
} = require('../controllers/produtos');

router.get('/', getProdutos);

router.post('/', verifyLogin, uploadImg.single('imagem_produto'), postProduto);

router.get('/:id_produto', getUniqueProduto);

router.patch('/', verifyLogin, patchProduto);

router.delete('/', verifyLogin, deleteProduto);

module.exports = router;
