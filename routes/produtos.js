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

router.get('/produtos/', getProdutos);

router.post(
  '/produtos/',
  verifyLogin,
  uploadImg.single('imagem_produto'),
  postProduto,
);

router.get('/produtos/:id_produto', async (req, res, next) => {
  const query = 'SELECT * FROM produtos WHERE id_produto = ?';
  const id_produto = req.params.id_produto;

  try {
    const result = await mysql.execute(query, [id_produto]);

    const response = {
      produto: {
        id_produto: result[0].id_produto,
        nome: result[0].nome_produto,
        preco: result[0].preco_produto,
        src: result[0].imagem_produto,
      },
      url: `${process.env.URL_API}/produtos`,
      request: {
        type: 'GET',
        desc: 'Retorna os detalhes de um único produto.',
      },
    };

    if (result.length !== 0) return res.status(200).send(response);

    return res.status(404).send({ message: 'Produto não encontrado.' });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.patch('/produtos/', verifyLogin, patchProduto);

router.delete('/produtos/', verifyLogin, deleteProduto);

module.exports = router;
