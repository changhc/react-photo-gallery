const express = require('express');
const bodyParser = require('body-parser');

const server = express();

const port = 5000;
const data = { child: [] };

server.use('/', express.static('public'));
server.use(bodyParser.json());
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.get('/api/images', (req, res) => {
  const body = {
    width: 200,   // meta add timestamp
    meta: [{ height: 100, url: '' }, { height: 180, url: '' }, { height: 150, url: '' }, { height: 200, url: '' }, { height: 120, url: '' }],
  };
  res.send(JSON.stringify(body));
});

server.listen(port, () => {
  console.log('%s listening on %s', server.name, port);
});
