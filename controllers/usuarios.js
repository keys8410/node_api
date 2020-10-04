const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const postDadosUsuario = async (req, res, next) => {
  const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';

  const { id_usuario } = req.body;

  try {
    const result = await mysql.execute(query, [id_usuario]);

    const response = result.map((userData) => {
      delete userData.senha;

      return userData;
    });

    if (result.length !== 0) return res.status(200).send(response);

    return res.status(401).send({ message: 'Falha na autenticação.' });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const postLogin = async (req, res, next) => {
  const query = 'SELECT * FROM usuarios WHERE email = ?';

  const { email, senha } = req.body;

  try {
    const result = await mysql.execute(query, [email]);
    if (result.length < 1)
      return res.status(401).send({ message: 'Falha na autenticação.' });

    bcrypt.compare(senha, result[0].senha, (error, resultBcrypt) => {
      if (error)
        return res.status(401).send({ message: 'Falha na autenticação.' });

      if (resultBcrypt) {
        const token = jwt.sign(
          { id_usuario: result[0].id_usuario },
          process.env.JWT_KEY,
          { expiresIn: '2h' },
        );

        const response = { message: 'Autenticado com sucesso.', token };

        return res.status(200).send(response);
      }

      return res.status(401).send({ message: 'Falha na autenticação.' });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

const postCadastro = async (req, res, next) => {
  const queryEmail = 'SELECT * FROM usuarios WHERE email = ?';
  const queryUser = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';

  const { email, senha } = req.body;

  try {
    const resultEmail = await mysql.execute(queryEmail, [email]);

    if (resultEmail.length > 0)
      return res.status(409).send({ message: 'Usuário já cadastrado' });

    bcrypt.hash(senha, 10, async (error, hash) => {
      if (error) return res.status(500).send(error);

      const resultUser = await mysql.execute(queryUser, [email, hash]);

      const response = {
        message: 'Usuário cadastrado com sucesso.',
        usuario: { id_usuario: resultUser.insertId, email },
      };

      return res.status(200).send(response);
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = { postLogin, postCadastro, postDadosUsuario };
