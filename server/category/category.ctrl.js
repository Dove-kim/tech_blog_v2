const db = require('../config/mysql');

exports.getList = async (req, res) => {
  const data = await db.excute('select * from category');
  res.send(data);
};
