const express = require('express');
const next = require('next');
const fs = require('fs');
let rawdata = fs.readFileSync('config/config.json');
let setting = JSON.parse(rawdata);
const multer = require('multer');

const port = 8080;
const dev = true;
const app = next({ dev: setting.dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json({ limit: '300mb' }));
  server.use(express.urlencoded({ limit: '300mb', extended: true }));

  server.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // multer setting
  const upload = multer({
    storage: multer.diskStorage({
      // set a localstorage destination
      destination: (req, file, cb) => {
        cb(null, 'public/blog_img/');
      },
      // convert a file name
      filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
      },
    }),
  });

  server.post('/api/uploads', upload.single('img'), (req, res) => {
    res.send('upload' + req.file);
  });

  server.use('/api/auth', require('./auth'));
  server.use('/api/post', require('./post'));
  server.use('/api/category', require('./category'));

  server.all('*', (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> ✨Ready on http://localhost:${port}`);
  });
});
