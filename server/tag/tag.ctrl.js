const db = require('../config/mysql');

exports.getList = async (req, res) => {
  const data = await db.excute('select * from tag order by name');
  res.send(data);
};
