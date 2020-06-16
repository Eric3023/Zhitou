const util = require('../utils/util.js');
const config = require('../config/api.js');

function author(typeId, regionId, license, idcard_a, idcard_b, credentials) {
  if (!license) {
    wx.showToast({
      title: '请重新上传营业执照',
      icon: 'none',
    })
    return;
  }
  // else if (!idcard_a) {
  //   wx.showToast({
  //     title: '请重新上传身份证正面',
  //     icon: 'none',
  //   })
  //   return;
  // } 
  // else if (!idcard_b) {
  //   wx.showToast({
  //     title: '请重新上传身份证反面',
  //     icon: 'none',
  //   })
  //   return;
  // }

  return util.request(
    config.Author,
    {
      certType: typeId,
      domicile: regionId,
      imgUrl_biz: license,
      imgUrl_f: idcard_a,
      imgUrl_b: idcard_b,
      credentials: credentials,
    },
    'POST'
  );
}

module.exports = {
  author: author
}