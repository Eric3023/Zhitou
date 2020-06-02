let config = require("../../config/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: config.BaseImgApi + "html/heapmap.html",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lat = options.lat;
    let lng = options.lng;
    this.setData({
      url: config.BaseImgApi + `html/heapmap.html?lat=${lat}&lng=${lng}`
    });
    console.log(this.data.url);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})