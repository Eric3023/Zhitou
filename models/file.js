const config = require('../config/api.js');
const check = require('../models/check.js');

/**
 * 上传图片
 */
function uploadImage({ path, progress}) {
  console.log(`url:${config.Upload}`);
  console.log(`filePath:${path}`);

  return check.checkResult(new Promise((resolve, reject) => {
    let uploadTask = wx.uploadFile({
      url: config.Upload,
      filePath: path,
      name: 'file',
      success: res => {
        let response = JSON.parse(res.data);
        resolve(response);
      },
      fail: error => {
        reject(error);
      }
    });

    if (uploadTask)
      uploadTask.onProgressUpdate((res) => {
        progress(res);
      });
  }));

}

module.exports = {
  uploadImage: uploadImage
}