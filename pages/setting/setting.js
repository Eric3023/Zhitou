// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      '联系客服',
      '关于枝头'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 退出登录
   */
  loginOut: function (event) {
    wx.showToast({
      title: '退出登录',
      icon: 'none'
    });
  },

  /**
   * 点击了设置Item
   */
  onClickItem: function (event) {
    let value = event.currentTarget.dataset.item;
    console.log(value);
    switch (value) {
      case '关于枝头':
        wx.showToast({
          title: '关于枝头',
          icon: 'none'
        });
        break;
      default:
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})