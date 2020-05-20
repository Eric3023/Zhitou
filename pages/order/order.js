import { OrderModel } from '../../models/order';

const orderModel = new OrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: {},
    displaying: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getOrders();
  },


  /**
   * 获取我的订单列表
   */
  _getOrders() {
    const orders = orderModel.getOrders();
    const displaying = orders.creating;
    this.setData({
      orders: orders,
      displaying: displaying,
    });
  },


  /**
   * 修改列表中的订单状态
   */
  onChangeType: function (event) {
    let index = event.detail.index;
    let displaying;
    switch (index) {
      case 0:
        displaying = this.data.orders.creating;
        break;
      case 1:
        displaying = this.data.orders.examing;
        break;
      case 2:
        displaying = this.data.orders.throwing;
        break;
      case 3:
        displaying = this.data.orders.completed;
        break;
    }
    this.setData({
      displaying,
    });
  },

  /**
   * 点击订单列表，进入订单详情
   */
  onClickItem(event) {
    wx.navigateTo({
      url: '/pages/throw_detail/throw_detail',
    })
  },

})