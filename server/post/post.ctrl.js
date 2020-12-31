const db = require('../../config/mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');
let rawdata = fs.readFileSync('config/config.json');
let setting = JSON.parse(rawdata);

exports.list = async (req, res) => {
  let data;
  data = await db.excute('select * from post order by post.createdAt desc;');

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

  let data = await db.excute('select * from post where no=?', [postId]);

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
