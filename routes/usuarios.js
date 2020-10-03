const express = require('express');
const router = express.Router();

const {
  postLogin,
  postCadastro,
  postDadosUsuario,
} = require('../controllers/usuarios');

router.post('/', postDadosUsuario);

router.post('/cadastro', postCadastro);

router.post('/login', postLogin);

module.exports = router;
