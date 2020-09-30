const express = require('express');
const router = express.Router();

// retorna todos os produtos
router.get('/', (req, res, next) => {
  res.status(200).send({ message: 'usando o GET dentro de rota de produtos' });
});

// insere um produto
router.post('/', (req, res, next) => {
  const { nome, preco } = req.body;

  const produto = {
    nome,
    preco,
  };

  res
    .status(201)
    .send({ message: 'insere um produto', produtoCriado: produto });
});

// retorna um produto especifico
router.get('/:id_produto', (req, res, next) => {
  const id = req.params.id_produto;

  if (id === 'especial') {
    res
      .status(200)
      .send({ message: 'retorna o GET de um produto exclusivo', id });
  }
});

// edita um produto
router.patch('/', (req, res, next) => {
  res
    .status(200)
    .send({ message: 'usando um PATCH dentro da rota de produtos' });
});

// deleta um produto
router.delete('/', (req, res, next) => {
  res
    .status(200)
    .send({ message: 'usando um DELETE dentro da rota de produtos' });
});

module.exports = router;
