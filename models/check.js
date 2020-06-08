/**
 * 检查系统返回errno，0为正常
 */
function checkResult(promise) {
  return new Promise((resolve, reject) => {
    promise.then(res => {
      if (res && res.errno == 0) {
        resolve(res);
      } else {
        reject(res);
      }
    }, error => {
      reject(error);
    });
  });
}

module.exports = {
  checkResult: checkResult
}