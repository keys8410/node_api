const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// retorna todos os pedidos
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      `SELECT pedidos.id_pedido,
          pedidos.quantidade,
          produtos.id_produto,
          produtos.nome_produto,
          produtos.preco_produto
        FROM pedidos
        INNER JOIN produtos 
        ON produtos.id_produto = pedidos.id_produto;`,

      (error, result, fields) => {
        if (error) return res.status(400).send({ error });

        const response = {
          pedidos: result.map((pedido) => {
            return {
              id_pedido: pedido.id_pedido,
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome_produto,
                preco: pedido.preco_produto,
              },
              request: {
                type: 'GET',
                desc: 'Retorna todos os pedidos',
                url: `${process.env.URL_API}/pedidos/${pedido.id_pedido}`,
              },
            };
          }),
        };

        return res.status(200).send({ response });
      },
    );
  });
});

// insere um pedido
router.post('/', (req, res, next) => {
  const { id_produto, quantidade } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      [id_produto],
      (error, result, fields) => {
        if (result.length === 0)
          return res.status(404).send({ message: 'Produto não encontrado.' });

        conn.query(
          'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)',
          [id_produto, quantidade],

          (error, result, fields) => {
            conn.release();

            if (error) return res.status(400).send({ error });

            const response = {
              message: 'Pedido criado com sucesso.',
              pedido: { id_pedido: result.id_pedido, id_produto, quantidade },

              request: {
                type: 'GET',
                desc: 'Retorna todos os pedido.',
                url: `${process.env.URL_API}/pedidos`,
              },
            };

            return res.status(201).send(response);
          },
        );
      },
    );
  });
});

// retorna um pedido especifico
router.get('/:id_pedido', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      'SELECT * FROM pedidos WHERE id_pedido = ?',
      [req.params.id_pedido],
      (error, result, fields) => {
        if (error) return res.status(404).send({ error });

        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
          },
          request: {
            type: 'GET',
            desc: 'Retorna os pedidos.',
            url: `${process.env.URL_API}/pedidos`,
          },
        };

        if (result.length !== 0) return res.status(200).send(response);

        return res.status(404).send({ message: 'Pedido não encontrado.' });
      },
    );
  });
});

// deleta um pedido
router.delete('/', (req, res, next) => {
  const { id_pedido } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    conn.query(
      'DELETE FROM pedidos WHERE id_pedido = ?',
      [id_pedido],

      (error, result, fields) => {
        conn.release();

        if (error) return res.status(400).send({ error });

        const response = {
          message: 'Pedido removido com sucesso',
          request: {
            type: 'POST',
            desc: 'Insere um novo pedido.',
            url: `${process.env.URL_API}/pedidos`,
            body: { id_produto: 'Int', quantidade: 'Int' },
          },
        };

        if (result.affectedRows !== 0) return res.status(202).send(response);

        return res.status(404).send({ message: 'Produto não encontrado.' });
      },
    );
  });
});

module.exports = router;
