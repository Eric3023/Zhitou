var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');

var app = getApp();
Page({
  data:{
    disabled:true,
    checked:false
  },
  onLoad: function (options) {
    
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  wxLogin: function (e) {
    let that = this;
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权，弹出提示
      wx.showToast({
        title: '同意授权后可体验完整功能',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    user.checkLogin().catch(() => {
      wx.showLoading({
        title: '登录中'
      })
      user.loginByWeixin(e).then(res => {
        console.log(res);
        app.globalData.hasLogin = true;
        
        wx.showToast({
          title: '登录成功',
          duration: 500
        });

        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        wx.hideLoading();
        console.log(err);
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
      });

    });
  },
  accountLogin: function () {
    var that = this;
    if(!that.data.disabled) {
      wx.navigateTo({
        url: "/pages/login/phoneLogin/phoneLogin"
      });
    }
    
  },
  checkedTap() {
    var that = this;
    that.setData({
      checked: !that.data.checked,
      disabled: !that.data.disabled
    })
  },
  
})