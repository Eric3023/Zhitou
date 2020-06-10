// pages/preview/preview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '/img/preview/bully.jpg',
    url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let adcode = options.adcode;
    let url = options.url;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})