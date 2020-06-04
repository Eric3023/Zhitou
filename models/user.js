/**
 * 退出登录，删除本地用户信息
 */
function loginOut() {
  try {
    wx.removeStorageSync('phone');
    wx.removeStorageSync('token');
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  loginOut: loginOut,
}