const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
  const { email, senha } = req.body;

  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send(error);

    conn.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email],
      (error, result) => {
        if (error) return res.status(500).send(error);

        if (result.length > 0)
          return res.status(409).send({ message: 'Usuário já cadastrado' });

        bcrypt.hash(senha, 10, (error, hash) => {
          if (error) return res.status(500).send(error);

          conn.query(
            'INSERT INTO usuarios (email, senha) VALUES (?, ?)',
            [email, hash],
            (error, result) => {
              conn.release();
              if (error) return res.status(500).send(error);

              const response = {
                message: 'Usuário cadastrado com sucesso.',
                usuario: { id_usuario: result.insertId, email },
              };

              return res.status(200).send(response);
            },
          );
        });
      },
    );
  });
});

module.exports = router;
