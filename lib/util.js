const fs = require('fs');
const path = require('path');
const setting = require('../server/config/config');

module.exports = {
  //태그를 배열로 변환
  getTagArray: async (arr) => {
    let tmp = [];
    for (let i = 0; i < arr.length; i++) {
      tmp.push(arr[i].tag);
    }
    return tmp;
  },
  //파일 삭제
  delete: async (filename) => {
    filename.map((file) => {
      const filePath = path.join(setting.public_src + file);
      fs.access(filePath, fs.constants.F_OK, (err) => {
        // A
        if (err) return console.log('삭제할 수 없는 파일입니다');

        fs.unlink(filePath, (err) =>
          err
            ? console.log(err)
            : console.log(`${filePath} 를 정상적으로 삭제했습니다`),
        );
      });
    });
  },
};
