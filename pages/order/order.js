let OrderModel = require('../../models/order.js');
const orderModel = new OrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    status: 0,
    page: 1,
    size: 20,
    lock: false,
    hasMore: true,
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
    if (this._isLock() || !this.data.hasMore) return;
    this._addLock();
    wx.showLoading();
    orderModel.getOrders(this.data.status, this.data.page, this.data.size).then(
      res => {
        this.data.page++;
        let hasNext = res.data.pageData.hasNext;
        this.data.orders = this.data.orders.concat(res.data.list);
        this.setData({
          hasMore: hasNext,
          orders: this.data.orders,
        });
        this._removeLock();
        wx.hideLoading();
      }, error => {
        this._removeLock();
        wx.hideLoading();
      }
    );
  },


  /**
   * 修改列表中的订单状态
   */
  onChangeType: function (event) {
    let index = event.detail.index;
    this._reset(index);
    this._getOrders();
  },

  /**
   * 点击订单列表，进入订单详情
   */
  onClickItem(event) {
    wx.navigateTo({
      url: '/pages/throw_detail/throw_detail',
    })
  },

  /**
   * 重置数据
   */
  _reset(status) {
    this.data.status = status;
    this.data.orders = [];
    this.data.page = 1;
    this.data.lock = false;
    this.data.hasMore = true;
  },

  /**
 * 是否加锁（正在请求数据）
 */
  _isLock() {
    return this.data.lock;
  },

  /**
   * 加锁
   */
  _addLock() {
    this.setData({
      lock: true,
    });
  },

  /**
   * 解锁
   */
  _removeLock() {
    this.setData({
      lock: false,
    });
  },

  /**
   * 是否还有更多数据
   */
  _hasMore() {
    return this.data.hasMore;
  }

})