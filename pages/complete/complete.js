/**
 * 投放结算完成页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    status: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.status = options.status;
  },

  /**
   * 查看订单
   */
  onClikeDetail() {
    let id = this.data.id;
    wx.navigateTo({
      url: `/pages/throw_detail2/throw_detail2?id=${id}`,
    })
  }
})

