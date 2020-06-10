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
    days: 0,
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
        this.setData({
          detail: res.data,
        });

        let start = res.data.ad.startTime;
        let end = res.data.ad.endTime;
        this._calDays(start, end);
      }).catch(error => {
        console.log(error);
      });
  },

  /**
   * 计算投放天数
   */
  _calDays(start, end){
    let endDate = new Date(end);
    let startDate = new Date(start);
    let endTime = dateUtil.tsFormatTime(endDate, 'yyyy年MM月dd日');
    let startTime = dateUtil.tsFormatTime(startDate, 'yyyy年MM月dd日')
    let days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    this.setData({
      startTime: startTime,
      endTime: endTime,
      days: days,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})