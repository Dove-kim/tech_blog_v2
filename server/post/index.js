var express = require('express');
var router = express.Router();
const postCtrl = require('./post.ctrl');

//특정 게시글 조회
router.get('/:postId', postCtrl.read);

//게시글 조회
router.get('/', postCtrl.list);

//게시글 작성
router.post('/', postCtrl.write);

//게시글 업데이트
router.patch('/', async (req, res) => {
  res.send('hi');
});

//게시글 삭제
router.delete('/:postId', postCtrl.delete);

module.exports = router;
