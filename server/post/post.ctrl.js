const db = require('../config/mysql');
const jwt = require('jsonwebtoken');
const setting = require('../config/config');
const util = require('../../lib/util');

exports.list = async (req, res) => {
  let data;
  let tag = req.query.tag ? req.query.tag : -1;

  data = await db.excute(
    `select post.no, post.title as title, post.body as body, post.createdAt as createdAt, tag.name as tag from post, tag, post_tag where post.no=post_tag.post_no and tag.no=post_tag.tag_no ${
      tag > 0
        ? ` and post.no in (select post_no from post_tag where tag_no=${tag})`
        : ''
    } order by post.createdAt desc ,tag.name asc;`,
  );

  const posts = data;
  const postsList = [];
  const map = new Map();
  for (let i = 0; i < posts.length; i++) {
    if (map.has(posts[i].no)) {
      postsList[map.get(posts[i].no)].tag.push(posts[i].tag);
    } else {
      map.set(posts[i].no, postsList.length);
      postsList.push({
        no: posts[i].no,
        title: posts[i].title,
        body: posts[i].body,
        createdAt: posts[i].createdAt,
        tag: [posts[i].tag],
      });
    }
  }

  res.send(postsList);
};

exports.write = async (req, res) => {
  const data = await req.body;

  if (!data.id || !data.body || !data.title || !data.tags) {
    res.send(404);
    return;
  }
  if (data.token) {
    const decode = jwt.verify(data.token, setting.jwt_secret);
    if (decode._id !== 'Mark') {
      res.send({ result: 'no' });
      return;
    }

    const result = await db.write(data.id, data.title, data.body, data.tags);
    if (result) {
      res.send({ result: 'yes' });
      return;
    } else {
      res.send({ result: 'no' });
      return;
    }
  }
};

exports.read = async (req, res) => {
  const postId = req.params.postId;

  let data = await db.excute(
    'select post.no as no, post.title as title, post.body as body, post.createdAt as createdAt, tag.name as tag from post, post_tag, tag ' +
      'where post.no = post_tag.post_no and post_tag.tag_no=tag.no and post.no=? order by tag.name;',
    [postId],
  );

  if (data.length > 0) {
    let post = {
      title: data[0].title,
      no: data[0].no,
      body: data[0].body,
      createdAt: data[0].createdAt,
      tag: await util.getTagArray(data),
    };
    res.send({ result: true, post });
  } else {
    res.send({ result: false });
  }
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

    //게시글 삭제
    let sql = await db.excute('delete from post where no=?', [post]);
    //게시글에 없는 태그 삭제
    sql = await db.excute(
      'delete from tag where no in (select * from (select no from tag left join post_tag on post_tag.tag_no = tag.no where post_tag.post_no is null)as t);',
    );
    //이미지 삭제
    if (data.img) {
      await util.delete(data.img);
    }
    res.send({ result: 'yes' });
    return;
  }
  res.send({ result: 'no' });
  return;
};
