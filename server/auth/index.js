var express = require('express');
var router = express.Router();
const loginCtrl = require('./login.ctrl');

//로그인
router.post('/', loginCtrl.login);

router.put('/', loginCtrl.verify);

module.exports = router;
