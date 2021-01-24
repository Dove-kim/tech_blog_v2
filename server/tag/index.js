var express = require('express');
var router = express.Router();
const loginCtrl = require('./tag.ctrl.js');

//태그 가져오기
router.get('/', loginCtrl.getList);

module.exports = router;
