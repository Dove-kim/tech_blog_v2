const db = require('../../config/mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');
let rawdata = fs.readFileSync('config/config.json');
let setting = JSON.parse(rawdata);

exports.list = async (req, res) => {
  let data;
  let category = req.query.category ? req.query.category : -1;
  if (category == 0) {
    data = await db.excute(
      `select post.no as no, post.title as title, post.body as body, post.createdAt as createdAt, category.no as cate, category.name as category from post inner join category on category.no=post.category where post.category=0 order by post.createdAt desc;`,
    );

    res.send(data);
  }

  data = await db.excute(
    `select post.no as no, post.title as title, post.body as body, post.createdAt as createdAt, category.no as cate, category.name as category from post inner join category on category.no=post.category where post.category!=1 ${
      category >= 0 ? ` and post.category=${category}` : ''
    } order by post.createdAt desc;`,
  );

  res.send(data);
};

exports.write = async (req, res) => {
  const data = await req.body;

  if (data.token) {
    const decode = jwt.verify(data.token, setting.jwt_secret);
    if (decode._id !== 'Mark') {
      res.send({ result: 'no' });
      return;
    }
    if (data.id > 0) {
      let sql = await db.excute(
        'update post set title=?, body=?,category=? where no =?',
        [data.title, data.body, data.category, data.id],
      );
      res.send({ result: 'yes' });
      return;
    } else {
      let sql = await db.excute(
        'insert into post (title,body,category) values(?,?,?)',
        [data.title, data.body, data.category],
      );
      console.log(sql);

      res.send({ result: 'yes' });
      return;
    }
  }

  res.send({ result: 'no' });
  return;
};

exports.read = async (req, res) => {
  const postId = req.params.postId;

  let data = await db.excute(
    'select post.no as no, post.title as title, post.body as body, post.createdAt as createdAt, category.name as category, category.no as cate from post inner join category on category.no=post.category where post.no=?',
    [postId],
  );

  res.send(data.length > 0 ? data[0] : { result: false });
};

exports.delete = async (req, res) => {
  const data = await req.body;

  if (data.token) {
    const decode = jwt.verify(data.token, setting.jwt_secret);
    if (decode._id !== 'Mark') {
      res.send({ result: 'no' });
      return;
    }
    const post = await req.params.postId;

    let sql = await db.excute('delete from post where no=?', [post]);
    res.send({ result: 'yes' });
    return;
  }
  res.send({ result: 'no' });
  return;
};
