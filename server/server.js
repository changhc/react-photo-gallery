const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const sizeOf = require('image-size');

const resourcePath = __dirname + '/public';
const imgPath = `/image/`;
const server = express();
const multerupload = multer({ dest: __dirname + imgPath });
const port = 5000;
const imgMeta = {};
let imgMetaList = [];
const itemWidth = 200;
const thumbnailWidth = 300;

fs.watch(resourcePath + imgPath, (event, filename) => {
  if (filename.replace('thumb-', '') !== filename) return;
  if (event === 'rename') {
    fs.access(resourcePath + imgPath + filename, (err) => {
      if (err) {  // doesn't exist
        fs.unlink(resourcePath + imgPath + `thumb-${filename}`, (err) => { if (err) console.log(err); });
        delete imgMeta[filename];
        imgMetaList = [];
        for (let key in imgMeta) {
          imgMetaList.push(imgMeta[key]);
        }
        // console.log(imgMeta);
        return;
      }
      console.log(`${filename} exists.`);
      imgMeta[filename] = {
        thumb: imgPath + `thumb-${filename}`,
        origin: imgPath + filename,
      };
      sharp(resourcePath + imgPath + filename)
        .resize(thumbnailWidth, null)
        .toFile(resourcePath + imgPath + `thumb-${filename}`)
        .then((info) => {
          console.log(filename, Date.now());
          imgMeta[filename].height = Math.ceil(info.height * itemWidth / thumbnailWidth);
          imgMetaList = [];  
          for (let key in imgMeta) {
            imgMetaList.push(imgMeta[key]);
          }
          // console.log(imgMeta);
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
    width: itemWidth,
    meta: imgMetaList,
  };
  
  res.send(JSON.stringify(body));
});

server.listen(port, () => {
  console.log('%s listening on %s', server.name, port);
});
