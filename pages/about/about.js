const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: '',
    time: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = wx.getAccountInfoSync();
    if (!info.version) {
      info.version = app.globalData.version;
    }

    if (!info.time) {
      info.time = app.globalData.time;
    }

    this.setData({
      version: info.version,
      time: info.time,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 跳转到法律政策和隐私协议
   */
  onJumpToPolicy(){
    wx.navigateTo({
      url: '/pages/policy/policy',
    })
  }
})