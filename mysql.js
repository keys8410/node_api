const mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 500,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
});

exports.execute = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, result, fields) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });
};

exports.pool = pool;
