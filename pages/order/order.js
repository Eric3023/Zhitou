let orderModel = require('../../models/order.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    extras: {
      "exposureNum": 3,
      "launching": 0,
      "macNum": 1,
    },

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
   * 滑动到页面底部
   */
  onReachBottom: function () {
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
          extras: res.data.extras,
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
    let value = event.currentTarget.dataset.value;
    let id = value.id;
    let status = value.status;
    console.log(event);
    if (id) {
      if (status == 0 || status == 1) {
        wx.navigateTo({
          url: `/pages/throw_detail2/throw_detail2?id=${id}`,
        })
      } else if (status == 2 || status == 3) {
        wx.navigateTo({
          url: `/pages/throw_detail/throw_detail?id=${id}`,
        })
      }
    }
  },

  /**
   * 删除订单
   */
  onDeleteItem(event) {
    let value = event.currentTarget.dataset.value;
    let id = value.id;
    let status = value.status;
    if (status == 0 || status == 1) {
      wx.showModal({
        title: "提示",
        content: "确认删除该订单",
        cancelText: "取消",
        confirmText: "确定",
        success: res => {
          if (res.confirm) {
            this._deleteOrder(id);
          } else if (res.cancel) {

          }
        }
      });
    }
  },

  /**
   * 删除订单
   */
  _deleteOrder(id) {
    orderModel.deleteOrder(id)
      .then(res => {
        let index = this._getIndexOfItem(id);
        if (index >= 0) {
          this.data.orders.splice(index, 1),
            this.setData({
              orders: this.data.orders,
            });
        }
      })
      .catch(e => {
        wx.showToast({
          title: '订单删除失败',
          icon: 'none',
        })
      });
  },

  /**
   * 重置数据
   */
  _reset(status) {
    this.setData({
      status,
      orders: [],
      page: 1,
      lock: false,
      hasMore: true,
    });
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
  },

  /**
   * 获取订单索引
   */
  _getIndexOfItem(id) {
    let index = -1;
    for (let i = 0; i < this.data.orders.length; i++) {
      if (this.data.orders[i].id == id) {
        index = i;
        break;
      }
    }
    return index;
  },

})