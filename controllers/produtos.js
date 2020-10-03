const mysql = require('../mysql').pool;
const uploadImg = require('../helpers/upload');

const getProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    const query = 'SELECT * FROM produtos';
    conn.query(query, (error, result, fields) => {
      if (error) return res.status(400).send({ error });

      const response = {
        total: result.length,
        produtos: result.map((prod) => {
          return {
            id_produto: prod.id_produto,
            produto: prod.nome_produto,
            preco: prod.preco_produto,
            src: prod.imagem_produto,
            url: `${process.env.URL_API}/produtos/${prod.id_produto}`,
          };
        }),
        request: {
          type: 'GET',
          desc: 'Retorna todos os produtos',
        },
      };

      return res.status(200).send({ response });
    });
  });
};

const postProduto = (req, res, next) => {
  const { nome, preco } = req.body;
  const { path } = req.file;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    const query =
      'INSERT INTO produtos (nome_produto, preco_produto, imagem_produto) VALUES (?, ?, ?)';
    conn.query(
      query,
      [nome, preco, path],

      (error, result, fields) => {
        conn.release();

        if (error) return res.status(400).send({ error });

        const response = {
          message: 'Produto inserido com sucesso.',

          produto: {
            id_produto: result.id_produto,
            nome,
            preco,
            src: path,
          },
          url: `${process.env.URL_API}/produtos`,
          request: {
            type: 'POST',
            desc: 'Insere um produto.',
          },
        };

        return res.status(201).send(response);
      },
    );
  });
};

const getUniqueProduto = (req, res, next) => {
  const id_produto = req.params.id_produto;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    const query = 'SELECT * FROM produtos WHERE id_produto = ?';
    conn.query(query, [id_produto], (error, result, fields) => {
      if (error) return res.status(404).send({ error });

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
    });
  });
};

const patchProduto = (req, res, next) => {
  const { nome, preco, id } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    const query =
      'UPDATE produtos SET nome_produto = ?, preco_produto = ? WHERE id_produto = ?';
    conn.query(
      query,
      [nome, preco, id],

      (error, result, fields) => {
        conn.release();
        console.log(result);

        if (error) return res.status(400).send({ error });

        const response = {
          message: 'Produto atualizado com sucesso.',
          produto: { id, nome, preco },
          request: {
            type: 'GET',
            desc: 'Retorna os dados específicos de um produto.',
            url: `${process.env.URL_API}/produtos/${id}`,
          },
        };

        if (result.affectedRows !== 0) return res.status(202).send(response);

        return res.status(404).send({ message: 'Produto não encontrado.' });
      },
    );
  });
};

const deleteProduto = (req, res, next) => {
  const { id_produto } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(400).send({ error });

    const query = 'DELETE FROM produtos WHERE id_produto = ?';
    conn.query(
      query,
      [id_produto],

      (error, result, fields) => {
        conn.release();

        if (error) return res.status(400).send({ error });

        const response = {
          message: 'Produto removido com sucesso',
          request: {
            type: 'POST',
            desc: 'Insere um novo produto.',
            url: `${process.env.URL_API}/produtos`,
            body: { nome: 'String', preco: 'Float' },
          },
        };

        if (result.affectedRows !== 0) return res.status(202).send(response);

        return res.status(404).send({ message: 'Produto não encontrado.' });
      },
    );
  });
};

module.exports = {
  getProdutos,
  postProduto,
  getUniqueProduto,
  patchProduto,
  deleteProduto,
  uploadImg,
};
