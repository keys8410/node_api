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

/**
 * @api {get} /signin Singin
 * @apiGroup Sistema
 *
 * @apiSuccess {String} status Mensagem de acesso autorizado
 *
 * @apiSuccessExample {json} Sucesso
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "Logado!"
 *    }
 *
 */
router.get('/', getProdutos);

router.post('/', verifyLogin, uploadImg.single('imagem_produto'), postProduto);

router.get('/:id_produto', getUniqueProduto);

router.patch('/', verifyLogin, patchProduto);

router.delete('/', verifyLogin, deleteProduto);

module.exports = router;
