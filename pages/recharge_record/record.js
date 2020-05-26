var RecordModel = require('../../models/record.js');

let recordModel = new RecordModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [
      {
        mouth: "2020年6月",
        money: 220220,
        datas: [
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
        ]
      },
      {
        mouth: "2020年5月",
        money: 220220,
        datas: [
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
        ]
      },
      {
        mouth: "2020年4月",
        money: 220220,
        datas: [
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
        ]
      },
      {
        mouth: "2020年3月",
        money: 220220,
        datas: [
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
          {
            time: '1月30日 18:15',
            money: 10000,
            person: '西红柿老太太',
          },
        ]
      },
    ],

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
        this.data.hasMore = hasNext;
        this.setData({
          records: list,
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