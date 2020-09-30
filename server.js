const { setServers } = require('dns');
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port);

//localhost:3000

module.exports = app;
