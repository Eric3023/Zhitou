/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录,获取sessionKey
 */
function loginByWeixin(that) {

  let shareUserId = wx.getStorageSync('shareUserId');
  if (!shareUserId || shareUserId == 'undefined') {
    shareUserId = 1;
  }
  return new Promise(function (resolve, reject) {
    return login().then((res) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
        code: res.code
      }, 'POST').then(res => {
        
        if (res.errno === 0) {
          that.setData({
            sessionKey: res.data.sessionKey,
            openId: res.data.openId
          })
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 获取微信手机号码，如不存在，则并自动注册
 */
function wxLoginPhone(e, that) {

  let shareUserId = wx.getStorageSync('shareUserId');
  if (!shareUserId || shareUserId =='undefined'){
    shareUserId = 1;
  }
  return new Promise(function(resolve, reject) {
    //登录远程服务器
    util.request(api.AuthPhoneLoginByWeixin, {
      sessionKey: that.data.sessionKey,
      openId: that.data.openId,
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
      shareUserId: shareUserId
    }, 'POST').then(res => {
      console.log(res);
      if (res.errno === 0) {
        //存储用户信息
        wx.setStorageSync('phone', res.data.userInfo.phone);
        wx.setStorageSync('token', res.data.token);

        resolve(res);
      } else {
        reject(res);
      }

    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
  wxLoginPhone,
};