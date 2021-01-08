const moment = require('moment');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
let setting = require('../config/config');

exports.login = async (req, res) => {
  try {
    const data = await req.body;
    const password = crypto
      .createHash('sha512')
      .update(data.password)
      .digest('base64');

    if (password === setting.userPw) {
      const token = jwt.sign(
        {
          _id: 'Mark',
          time: moment(),
          name: 'DoveKim',
        },
        setting.jwt_secret,
        { expiresIn: '1d' },
      );
      res.send({ result: 'yes', token: token });
    } else {
      res.send({ result: 'no' });
    }
  } catch {
    res.send({ result: 'no' });
  }
};

exports.verify = async (req, res) => {
  try {
    const data = await req.body;
    var decoded_data = jwt.verify(data.token, setting.jwt_secret);

    if (decoded_data._id === 'Mark') {
      res.send({ result: 'yes' });
    } else {
      res.send({ result: 'no' });
    }
  } catch {
    res.send({ result: 'no' });
  }
};
