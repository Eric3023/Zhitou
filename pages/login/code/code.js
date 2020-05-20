// pages/login/code/code.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',//手机号码
    length: 6,//验证码输入长度
    value: "",//验证码
    isFocus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
    });
  },

  /**
   * 验证码输入框获取焦点
   */
  onFocus: function (e) {
    this.setData({ isFocus: true });
  },

  /**
   * 更新验证码输入框的显示内容
   */
  setValue: function (e) {
    let value = e.detail.value;
    this.setData({ value: value });

    //验证码输入完毕
    if(value.length == length){
      this._checkCode();
    }
  },

  /**
   * 校验验证码
   */
  _checkCode(){

  }
})