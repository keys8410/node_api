const mysql = require('../mysql').pool;

const getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.release();

    if (error) return res.status(400).send(error);

    const query = `SELECT pedidos.id_pedido,
                    pedidos.quantidade,
                    produtos.id_produto,
                    produtos.nome_produto,
                    produtos.preco_produto
                  FROM pedidos
                  INNER JOIN produtos 
                  ON produtos.id_produto = pedidos.id_produto;`;

    conn.query(query, (error, result, fields) => {
      if (error) return res.status(400).send(error);

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

      return res.status(200).send(response);
    });
  });
};

const postPedidos = (req, res, next) => {
  const { id_produto, quantidade } = req.body;

  mysql.getConnection((error, conn) => {
    conn.release();

    if (error) return res.status(400).send({ error });

    const queryId = 'SELECT * FROM produtos WHERE id_produto = ?';
    conn.query(queryId, [id_produto], (error, result, fields) => {
      if (result.length === 0)
        return res.status(404).send({ message: 'Produto não encontrado.' });

      const query =
        'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)';
      conn.query(
        query,
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
    });
  });
};

const getUniquePedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    const query = 'SELECT * FROM pedidos WHERE id_pedido = ?';
    conn.query(query, [req.params.id_pedido], (error, result, fields) => {
      conn.release();

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
    });
  });
};

const deletePedido = (req, res, next) => {
  const { id_pedido } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    const query = 'DELETE FROM pedidos WHERE id_pedido = ?';
    conn.query(
      query,
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
};

module.exports = { getPedidos, postPedidos, getUniquePedido, deletePedido };
