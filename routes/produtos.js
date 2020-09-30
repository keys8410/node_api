const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// retorna todos os produtos
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query('SELECT * FROM produtos', (error, result, fields) => {
      if (error) return res.status(400).send({ error });

      return res.status(200).send({ response: result });
    });
  });
});

// insere um produto
router.post('/', (req, res, next) => {
  const { nome, preco } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      'INSERT INTO produtos (nome_produto, preco_produto) VALUES (?, ?)',
      [nome, preco],

      (error, result, fields) => {
        conn.release();

        if (error) return res.status(400).send({ error });

        res.status(201).send({
          message: 'Produto inserido com sucesso.',
          id_produto: result.insertId,
        });
      },
    );
  });
});

// retorna um produto especifico
router.get('/:id_produto', (req, res, next) => {
  const id_produto = req.params.id_produto;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      [id_produto],
      (error, result, fields) => {
        if (error) return res.status(400).send({ error });
        console.log(result);
        if (result.length === 0)
          return res.status(404).send({ message: 'Produto não encontrado.' });

        return res.status(200).send({ response: result });
      },
    );
  });
});

// edita um produto
router.patch('/', (req, res, next) => {
  const { nome_produto, preco_produto, id_produto } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      'UPDATE produtos SET nome_produto = ?, preco_produto = ? WHERE id_produto = ?',
      [nome_produto, preco_produto, id_produto],

      (error, result, fields) => {
        conn.release();

        if (error) return res.status(400).send({ error });

        res.status(202).send({
          message: 'Produto alterado com sucesso.',
        });
      },
    );
  });
});

// deleta um produto
router.delete('/', (req, res, next) => {
  const { id_produto } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      'DELETE FROM produtos WHERE id_produto = ?',
      [id_produto],

      (error, result, fields) => {
        conn.release();

        if (error) return res.status(400).send({ error });

        res.status(202).send({
          message: 'Produto removido com sucesso.',
        });
      },
    );
  });
});

module.exports = router;
