var RecordModel = require('../../models/record.js');

let recordModel = new RecordModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],

    page: 1,
    size: 20,
    lock: false,
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getRecords();
  },

  /**
   * 滑动到页面底部
   */
  onReachBottom: function () {
    this._getRecords();
  },

  /**
   * 获取充值记录
   */
  _getRecords(page, size) {
    if (this._isLock() || !this._hasMore()) return;
    wx.showLoading();
    this._addLock();
    recordModel.getPayRecods(this.data.page, this.data.size).then(
      res => {
        let list = res.data.list;
        let hasNext = res.data.pageData.hasNext;
        let tmp = "";
        for (var i = 0; i < list.length; i++) {
          let item = list[i];
          let time = item.payTime;
          if (time) {
            let date = new Date(time);
            item.mouth = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
            if (tmp == item.mouth) {
              item.first = false;
            } else {
              item.first = true;
            }
            tmp = item.mouth;
          }
        }
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