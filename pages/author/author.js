// pages/author/author.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      '请选择',
      '身份证',
    ],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 证件类型改变
   */
  onTypeChanged(evnet) {
    let index = evnet.detail.value;
    this.setData({
      index,
    });
  }
})