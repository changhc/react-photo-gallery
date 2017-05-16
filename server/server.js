const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const sizeOf = require('image-size');

const imgPath = `/public/image/`;
const server = express();
const multerupload = multer({ dest: __dirname + imgPath });
const port = 5000;
const imgMeta = {};
let imgMetaList = [];
const itemWidth = 200;

fs.watch(__dirname + imgPath, (event, filename) => {
  if (filename.replace('thumb-', '') !== filename) return;
  if (event === 'rename') {
    fs.access(__dirname + imgPath + filename, (err) => {
      if (err) {  // doesn't exist
        fs.unlink(__dirname + imgPath + `thumb-${filename}`, (err) => { if (err) console.log(err); });
        delete imgMeta[filename];
        imgMetaList = [];
        for (let key in imgMeta) {
          imgMetaList.push(imgMeta[key]);
        }
        console.log(imgMeta);
        return;
      }
      console.log(`${filename} exists.`);
      imgMeta[filename] = {
        thumb: imgPath + `thumb-${filename}`,
        origin: imgPath + filename,
      };
      sharp(__dirname + imgPath + filename)
        .resize(300, null)
        .toFile(__dirname + imgPath + `thumb-${filename}`)
        .then((info) => {
          imgMeta[filename].height = info.height;     
          imgMetaList = [];  
          for (let key in imgMeta) {
            imgMetaList.push(imgMeta[key]);
          }
          console.log(imgMeta);
        })
        .catch((err) => console.error(err));
    });
  }
});

server.use('/', express.static('public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.get('/api/images', (req, res) => {
  const body = {
    width: itemWidth,   // meta add timestamp
    meta: imgMetaList,
  };
  
  res.send(JSON.stringify(body));
});

server.listen(port, () => {
  console.log('%s listening on %s', server.name, port);
});
