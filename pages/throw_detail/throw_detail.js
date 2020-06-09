let order = require('../../local/orderDetail.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: order
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.detail);
  },

  /**
   * 查看详情
   */
  onClickDetail() {
    // wx.navigateTo({
    //   url: '/pages/throw_detail2/throw_detail2',
    // })
  },
})