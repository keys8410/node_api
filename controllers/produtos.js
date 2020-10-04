const mysql = require('../mysql');
const uploadImg = require('../helpers/upload');

const getProdutos = async (req, res, next) => {
  const query = 'SELECT * FROM produtos';

  try {
    const result = await mysql.execute(query);

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

    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
};
const postProduto = async (req, res, next) => {
  const query =
    'INSERT INTO produtos (nome_produto, preco_produto, imagem_produto) VALUES (?, ?, ?)';
  const { nome, preco } = req.body;
  const { path } = req.file;

  try {
    const result = await mysql.execute(query, [nome, preco, path]);

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
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getUniqueProduto = async (req, res, next) => {
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
};

const patchProduto = async (req, res, next) => {
  const query =
    'UPDATE produtos SET nome_produto = ?, preco_produto = ? WHERE id_produto = ?';
  const { nome, preco, id } = req.body;

  try {
    const result = await mysql.execute(query, [nome, preco, id]);

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
  } catch (error) {
    return res.status(400).send(error);
  }
};

const deleteProduto = async (req, res, next) => {
  const query = 'DELETE FROM produtos WHERE id_produto = ?';
  const { id_produto } = req.body;

  try {
    const result = await mysql.execute(query, [id_produto]);

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
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  getProdutos,
  postProduto,
  getUniqueProduto,
  patchProduto,
  deleteProduto,
  uploadImg,
};
