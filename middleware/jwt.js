const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const verifyLogin = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).send({ message: 'Falha na auteticação.' });
  }
};

module.exports = { verifyLogin };
