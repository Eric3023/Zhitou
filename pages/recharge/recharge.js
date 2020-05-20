
var api = require('../../config/api.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenAccount:true,
    wechatChecked:true,
    bankChecked:false,
    balance:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  rechargePrepay: function (e) {
    let that = this;
    util.request(api.RechargePrepay, {
      amount: e.detail.value.recharge
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        const payParam = res.data;
        console.log("支付过程开始");
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.packageValue,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log("支付过程成功");
            util.redirect('/pages/ucenter/order/order');
          },
          'fail': function (res) {
            console.log("支付过程失败");
            util.showErrorToast('支付失败');
          },
          'complete': function (res) {
            console.log("支付过程结束")
          }
        });
      }
    });

  },
  radioChange: function (e) {
    var that = this;
    console.log(e.detail.value);
    
    that.setData({
      hiddenAccount: !that.data.hiddenAccount,

    });
  },
  catchBankTap: function() {
    var that = this;
    that.setData({
      hiddenAccount:!that.data.hiddenAccount,
      bankChecked: !that.data.bankChecked,
      wechatChecked: false
    });
  },

})