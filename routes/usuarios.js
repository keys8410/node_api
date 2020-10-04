const express = require('express');
const router = express.Router();

const { verifyLogin } = require('../middleware/jwt');

const {
  postLogin,
  postCadastro,
  postDadosUsuario,
} = require('../controllers/usuarios');

router.post('/', verifyLogin, postDadosUsuario);

router.post('/cadastro', postCadastro);

router.post('/login', postLogin);

module.exports = router;
