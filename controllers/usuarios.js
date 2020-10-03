const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const postDadosUsuario = (req, res, next) => {
  const { id_usuario } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(401).send(error);

    const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';

    conn.query(query, [id_usuario], (error, result, fields) => {
      conn.release();

      if (error) return res.status(500).send(error);

      const response = result.map((userData) => {
        delete userData.senha;

        return userData;
      });

      if (result.length !== 0) return res.status(200).send(response);

      return res.status(401).send({ message: 'Falha na autenticação.' });
    });
  });
};

const postLogin = (req, res, next) => {
  const { email, senha } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send(error);

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    conn.query(query, [email], (error, result, fields) => {
      conn.release();

      if (error) return res.status(500).send(error);

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
    });
  });
};

const postCadastro = (req, res, next) => {
  const { email, senha } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send(error);

    const checkEmail = 'SELECT * FROM usuarios WHERE email = ?';
    conn.query(checkEmail, [email], (error, result) => {
      if (error) return res.status(500).send(error);

      if (result.length > 0)
        return res.status(409).send({ message: 'Usuário já cadastrado' });

      bcrypt.hash(senha, 10, (error, hash) => {
        if (error) return res.status(500).send(error);

        const newUser = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
        conn.query(newUser, [email, hash], (error, result) => {
          conn.release();
          if (error) return res.status(500).send(error);

          const response = {
            message: 'Usuário cadastrado com sucesso.',
            usuario: { id_usuario: result.insertId, email },
          };

          return res.status(200).send(response);
        });
      });
    });
  });
};

module.exports = { postLogin, postCadastro, postDadosUsuario };
