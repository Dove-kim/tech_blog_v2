var express = require('express');
var router = express.Router();
const loginCtrl = require('./category.ctrl.js');

//로그인
router.get('/', loginCtrl.getList);

module.exports = router;
