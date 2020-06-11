let util = require('../utils/util.js');
let config = require('../config/api.js');
const check = require('../models/check.js');

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

/**
 * 获取用户信息
 */
function getUserInfo() {
  return check.checkResult(util.request(
    config.UserInfo
  ));
}


module.exports = {
  getUserInfo: getUserInfo,
  loginOut: loginOut,
}