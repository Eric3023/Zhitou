// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 5000,
    user_info: {
      uicon: "/img/icon_header.jpg",
      uid: "151*****627"
    },
    user_datas: [
      { icon: "/img/icon_mine_collection.jpg", title: "我的订单" },
      { icon: "/img/icon_mine_rmb.jpg", title: "充值记录" },
      { icon: "/img/icon_mine_quan.jpg", title: "优惠券" },
      { icon: "/img/icon_mine_proxy.jpg", title: "我是代理" },
      { icon: "/img/icon_mine_setting.png", title: "设置" }
    ]
  },

  /**
   * 立即充值
   */
  recharge(event) {
    wx.showToast({
      title: '进入【充值】页面',
      icon: 'none'
    })
  },

  /**
   * 进入下级页面
   */
  onClickItem(event) {
    let index = event.detail.title;
    switch (index) {
      case '我的订单':
        wx.navigateTo({
          url: '/pages/order/order',
        })
        break;
      default:
        let title = '进入【' + event.detail.title + '】页面';
        wx.showToast({
          title: title,
          icon: 'none'
        })
        break
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})