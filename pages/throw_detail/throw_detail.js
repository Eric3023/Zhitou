const throwModel = require('../../models/order.js');
const dateUtil = require('../../utils/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},

    startTime: '',
    endTime: '',
    totalDays: 0,//总共需要投放天数
    days: 0,//已投放天数
    remainDays: 0,//剩余天数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    console.log(`id:${id}`);
    this._getThrowDetail(id);
  },


  /**
   * 获取投放详情
   */
  _getThrowDetail(id) {
    throwModel.getThrowDetail(id)
      .then(res => {
        console.log(res);
        res.data.ad.totalAmount = res.data.ad.totalAmount.toFixed(2) + '元';
        res.data.ad.unitPrice = res.data.ad.unitPrice.toFixed(2) + '元' + (res.data.charing == 1 ? '/CPD' : '/CPM');
        this.setData({
          detail: res.data,
        });

        let start = res.data.ad.startTime;
        let end = res.data.ad.endTime;
        this._calDays(start, end);
        this._getMonitors(res.data.ad.monitor);
      }).catch(error => {
        console.log(error);
      });
  },

  /**
   * 计算投放天数
   */
  _calDays(start, end) {
    let endDate = new Date(end);
    let startDate = new Date(start);
    let nowDate = new Date();
    let endTime = dateUtil.tsFormatTime(endDate, 'yyyy.MM.dd');
    let startTime = dateUtil.tsFormatTime(startDate, 'yyyy.MM.dd')

    let days = 0;
    if (endDate - nowDate > 0) {
      days = Math.ceil((nowDate - startDate) / (1000 * 60 * 60 * 24));
    } else {
      days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }
    let totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    this.setData({
      startTime: startTime,
      endTime: endTime,
      days: days,
      remainDays: totalDays - days,
      totalDays: totalDays,
    });
  },

  /**
   * 获取监测链接
   */
  _getMonitors: function (monitor) {
    let monitors = monitor.split('|');
    this.setData({
      monitors: monitors,
    });
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