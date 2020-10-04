const mysql = require('../mysql');

const getPedidos = async (req, res, next) => {
  const query = `SELECT pedidos.id_pedido,
                    pedidos.quantidade,
                    produtos.id_produto,
                    produtos.nome_produto,
                    produtos.preco_produto
                  FROM pedidos
                  INNER JOIN produtos 
                  ON produtos.id_produto = pedidos.id_produto;`;

  try {
    const result = await mysql.execute(query);

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
  } catch (error) {
    return res.status(400).send(error);
  }
};

const postPedidos = async (req, res, next) => {
  const queryId = 'SELECT * FROM produtos WHERE id_produto = ?';
  const query = 'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)';

  const { id_produto, quantidade } = req.body;

  try {
    const resultId = await mysql.execute(queryId, [id_produto]);
    if (resultId.length === 0)
      return res.status(404).send({ message: 'Produto não encontrado.' });

    const result = await mysql.execute(query, [id_produto, quantidade]);

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
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getUniquePedido = async (req, res, next) => {
  const { id_pedido } = req.params;

  const query = 'SELECT * FROM pedidos WHERE id_pedido = ?';

  try {
    const result = await mysql.execute(query, [id_pedido]);

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
  } catch (error) {
    return res.status(400).send(error);
  }
};

const deletePedido = async (req, res, next) => {
  const query = 'DELETE FROM pedidos WHERE id_pedido = ?';

  const { id_pedido } = req.body;

  try {
    const result = await mysql.execute(query, [id_pedido]);

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
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = { getPedidos, postPedidos, getUniquePedido, deletePedido };
