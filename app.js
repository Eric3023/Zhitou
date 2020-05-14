import wxValidate from './utils/WxValidate.js'

App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  onLaunch: function () {
    var that = this
  },
  initGlobalData: function (callBack) {
    var that = this
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res.data);
        that.globalData.token = res.data;
        wx.request({
          url: that.globalData.contextPath + '/micro/checkLogin',
          header: {
            'token': 'Bearer ' + res.data
          },
          success: function (res) {
            console.log(res.data.code);//cosole 字符串和对象不能一起输出,否则会把对象转化成object字符串
            //如果校验成功，则设置全局变量标志
            if (res.data.code == 700) {//重新登录
              that.globalData.authFlag = false;
            } else {
              that.globalData.authFlag = true;
            }
            wx.switchTab({
              url: '/pages/index/index',
            })
            return false;
          }
        })
      },
      fail: function () {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },

  globalData: {
    lat:0,
    lng:0,
    hasLogin: false
  }
})