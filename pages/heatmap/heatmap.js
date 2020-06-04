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
    let regionid = options.regionid;
    let lat = options.lat;
    let lng = options.lng;
    let zoom = options.zoom;
    this.setData({
      url: config.BaseImgApi + `html/heapmap.html?regionid=${regionid}&lat=${lat}&lng=${lng}&zoom=${zoom}`
    });
    console.log(this.data.url);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})