/**
 * optionCode：
 * 16：app开屏
 * 15：首页霸屏
 * 17：活动中心
 * 18：个人中心
 * 19：司机接单
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appCode: 16,
    bullyCode: 15,
    activityCode: 17,
    personalCode: 18,
    receiveCode: 19,
    optionCode: 0,

    path: '',
    url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let adcode = options.adcode;
    let url = options.url;
    this._initBackground(adcode);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 初始化背景
   */
  _initBackground(adcode) {
    let optionCode = parseInt(adcode);

    this.setData({
      optionCode: optionCode,
    });

    let path = "";
    switch (optionCode) {
      case this.data.appCode:
        path = '/img/preview/appStart.jpg';
        break;
      case this.data.bullyCode:
        path = '/img/preview/bully.jpg';
        break;
      case this.data.activityCode:
        path = '/img/preview/activityCenter.jpg';
        break;
      case this.data.personalCode:
        path = '/img/preview/personalCenter.jpg';
        break;
      case this.data.receiveCode:
        path = '/img/preview/receiveOrder.jpg';
        break;
    }
    this.setData({
      path: path,
      optionCode: optionCode,
    });
    console.log(this.data.path);
    console.log(this.data.optionCode);
  }
})