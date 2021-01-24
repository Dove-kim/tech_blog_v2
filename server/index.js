const express = require('express');
const next = require('next');
const setting = require('./config/config');
const multer = require('multer');
const nextConfig = require('../next.config'); // next.config.js

const port = setting.port;
const app = next({
  dev: setting.dev,
  dir: __dirname + '/../',
  conf: nextConfig,
});
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
        cb(null, setting.blog_img_src);
      },
      // convert a file name
      filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
      },
    }),
  });
  /*server.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(ip);
    next();
  });*/

  server.post('/api/uploads', upload.single('img'), (req, res) => {
    res.send('upload' + req.file);
  });

  server.use('/api/auth', require('./auth'));
  server.use('/api/post', require('./post'));
  server.use('/api/category', require('./category'));
  server.use('/api/tag', require('./tag'));
  server.use('/', express.static(setting.public_src));

  server.get('/admin/', (req, res) => {
    return app.render(req, res, '/admin');
  });
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> ✨Ready on http://localhost:${port}`);
  });
});
