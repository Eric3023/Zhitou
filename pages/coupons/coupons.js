const couponModel = require('../../models/coupon.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        money: 200,
        condition: '2000',
        title: '知了互联全国出行领域公共资源投放系统',
        startTime: '2020.06.01',
        endTime: '2020.06.25',
        isOver: false,
      },
      {
        money: 200,
        condition: '2000',
        title: '知了互联全国出行领域公共资源投放系统',
        startTime: '2020.06.01',
        endTime: '2020.06.25',
        isOver: false,
      },
      {
        money: 200,
        condition: '2000',
        title: '知了互联全国出行领域公共资源投放系统',
        startTime: '2020.06.01',
        endTime: '2020.06.25',
        isOver: false,
      },
      {
        money: 200,
        condition: '2000',
        title: '知了互联全国出行领域公共资源投放系统',
        startTime: '2020.05.01',
        endTime: '2020.05.25',
        isOver: true,
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getCoupons();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取优惠券列表
   */
  _getCoupons: function () {
    couponModel.getCoupons(1)
      .then(res => {
        console.log(res);
      }, error => {
        console.log(error);
      });
  }
})