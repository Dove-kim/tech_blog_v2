module.exports = {
  getTagArray: async (arr) => {
    let tmp = [];
    for (let i = 0; i < arr.length; i++) {
      tmp.push(arr[i].tag);
    }
    return tmp;
  },
};
