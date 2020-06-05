const config = require('../config/api.js');

/**
 * 上传图片
 */
function uploadImage({ path, progress, success, fail }) {
  console.log(`url:${config.Upload}`);
  console.log(`filePath:${path}`);
  
  let uploadTask = wx.uploadFile({
    url: config.Upload,
    filePath: path,
    name: 'file',
    success: res => {
      success(res.data);
    },
    fail: error => {
      fail(error);
    }
  });

  uploadTask.onProgressUpdate((res) => {
    progress(res);
  })
}

module.exports = {
  uploadImage: uploadImage
}