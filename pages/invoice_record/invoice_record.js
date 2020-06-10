var recordModel = require('../../models/record.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    checkedAll: false,
    items: [],//需要开具发票的订单

    page: 1,
    size: 20,
    lock: false,
    hasMore: true,

    prices: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow: function () {
    this._reset();
    this._getRecords();
  },

  /**
   * 滑动到页面底部
   */
  onReachBottom: function () {
    this._getRecords();
  },

  /**
   * 选中订单发生变化
   */
  onCheckedChanged(event) {
    this.data.items = event.detail.value;

    let price = this._calTotalMoney();
    this.setData({
      prices: price.toFixed(2),
    })
  },

  /**
   * 全选发生变化
   */
  onCheckedAllCheanged(event) {
    let array = event.detail.value;
    if (array && array.length > 0) {
      this.data.items = [];
      for (var i = 0; i < this.data.records.length; i++) {
        this.data.items.push(i);
      }
      this.setData({
        checkedAll: true,
      })
    } else {
      this.setData({
        checkedAll: false,
        items: [],
      });
    }

    let price = this._calTotalMoney();
    this.setData({
      prices: price.toFixed(2),
    })
  },

  /**
   * 开具发票
   */
  onInvoice(event) {
    if (this.data.items && this.data.items.length > 0) {
      var ids = '';
      var prices = 0;
      for (var i = 0; i < this.data.items.length; i++) {
        let index = this.data.items[i];
        let id = this.data.records[index].id;
        let price = this.data.records[index].actualPrice;
        //获取id
        ids += id;
        if (i != this.data.items.length - 1) ids += ',';
        //获取价格
        prices += parseFloat(price);
      }

      console.log(ids);
      console.log(prices);
      wx.navigateTo({
        url: `/pages/invoice/invoice?ids=${ids}&price=${prices.toFixed(2)}`,
      })
    } else {
      wx.showToast({
        title: '请选择开具发票的订单',
        icon: 'none'
      })
    }
  },

  /**
   * 重置数据
   */
  _reset(){
    this.setData({
      records: [],
      checkedAll: false,
      items: [],//需要开具发票的订单
  
      page: 1,
      size: 20,
      lock: false,
      hasMore: true,
  
      prices: 0,
    });
  },

  /**
   * 计算总金额
   */
  _calTotalMoney() {
    let prices = 0;
    for (var i = 0; i < this.data.items.length; i++) {
      let index = this.data.items[i];
      let price = this.data.records[index].actualPrice;
      //获取价格
      prices += parseFloat(price);
    }
    return prices;
  },

  /**
   * 获取代开发票充值记录
   */
  _getRecords(page, size) {
    if (this._isLock() || !this._hasMore()) return;
    wx.showLoading();
    this._addLock();
    recordModel.getInvoice(this.data.page, this.data.size).then(
      res => {
        let list = res.data.list;
        let hasNext = res.data.pageData.hasNext;
        this.data.hasMore = hasNext;
        this.data.records = this.data.records.concat(list);
        this.setData({
          records: this.data.records,
          hasMore: hasNext,
        });

        this.data.page++;
        this._removeLock();
        wx.hideLoading();
      },
      error => {
        this._removeLock();
        wx.hideLoading();
      }
    );
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