const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const sizeOf = require('image-size');

const resourcePath = __dirname + '/public';
const imgPath = `/image/`;
const server = express();
const port = 3000;
let imgMeta = {};
let imgMetaList = [];
const itemWidth = 200;
const thumbnailWidth = 300;

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, resourcePath + imgPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});

/** Server shutdown start **/
const gracefulShutdown = function () {
  console.log("Received kill signal, shutting down gracefully.");
  fs.writeFile(__dirname + '/imgMeta.json', JSON.stringify(imgMeta), (err) => {
    if (err) throw err;
    serverObj.close(() => {
      console.log("Closed out remaining connections.");
      process.exit();
    });
  })

  // if after 
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit()
  }, 10000);
}

// listen for TERM signal .e.g. kill 
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown); 
/** Server shuutdown end **/

/** File list start : read the list on start **/
fs.readFile(__dirname + '/imgMeta.json', 'utf8', (err, data) => {
  if (err) {
    console.error('imgMeta.json doesn\'t exist!');
    return;
  }
  if (data === '') return;
  imgMeta = JSON.parse(data);
  console.log(imgMeta);
});
/** File list end **/

/** listen to any file modification start **/
fs.watch(resourcePath + imgPath, (event, filename) => {
  if (filename.replace('thumb-', '') !== filename) return;
  if (event === 'rename') {
    fs.access(resourcePath + imgPath + filename, (err) => {
      if (err) {  // doesn't exist
        console.log(`${filename} removed.`);
        fs.unlink(resourcePath + imgPath + `thumb-${filename}`, (err) => { if (err) console.log(err); });
        delete imgMeta[filename];
        imgMetaList = [];
        for (let key in imgMeta) {
          imgMetaList.push(imgMeta[key]);
        }
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
/** listen to any file modification end **/


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

server.post('/api/images', upload.single('image'), (req, res) => {
  console.log(req.body);
});

const serverObj = server.listen(port, () => {
  console.log('%s listening on %s', server.name, port);
});
