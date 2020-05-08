// pages/my_order/my_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_message: {
      throwing: 1,
      exposed: 5000,
      audience: 8000
    },
    orders: [
      {
        img: '/img/t1.jpg',
        title: '韩国烤肉餐饮店投放',
        address: '北京市朝阳区建国路华贸购物中心',
        count: 18668,
        start: "2020年4月20日",
        end: "2020年8月21日",
        state: '投放中'
      },
      {
        img: '/img/t1.jpg',
        title: '韩国烤肉餐饮店投放',
        address: '北京市朝阳区建国路华贸购物中心',
        count: 18668,
        start: "2020年4月20日",
        end: "2020年8月21日",
        state: '投放中'
      }, {
        img: '/img/t1.jpg',
        title: '韩国烤肉餐饮店投放',
        address: '北京市朝阳区建国路华贸购物中心',
        count: 18668,
        start: "2020年4月20日",
        end: "2020年8月21日",
        state: '投放中'
      },
      {
        img: '/img/t1.jpg',
        title: '韩国烤肉餐饮店投放',
        address: '北京市朝阳区建国路华贸购物中心',
        count: 18668,
        start: "2020年4月20日",
        end: "2020年8月21日",
        state: '投放中'
      },
      {
        img: '/img/t1.jpg',
        title: '韩国烤肉餐饮店投放',
        address: '北京市朝阳区建国路华贸购物中心',
        count: 18668,
        start: "2020年4月20日",
        end: "2020年8月21日",
        state: '投放中'
      }
    ],
    state: "创建中"
  },

  onChangeType: function (event) {
    let index = event.detail.index;
    let state = "创建中";
    switch (index) {
      case 0:
        state = "创建中";
        break;
      case 1:
        state = "审核中";
        break;
      case 2:
        state = "投放中";
        break;
      case 3:
        state = "已完成";
        break;
    }
    this.setData({
      state: state
    })
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