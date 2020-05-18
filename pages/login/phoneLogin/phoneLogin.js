/**
 * 手机号登录页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 监听输入
   */
  onInput(event) {
    this.data.phone = event.detail.value;
  },

  /**
   * 手机号输入完成
   */
  onConfirm(event) {
    let value = this.data.phone;
    this._checkPhone(value);
  },

  /**
   * 校验手机号是否合法 
   */
  _checkPhone(value) {
    value = value.trim();
    let warn = "";
    if (!value) {
      warn = "手机号不能为空";
      this.data.phone = "";
      this._showError(warn);
    } else if (value.trim().length != 11
      || ! /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/.test(value)) {
      warn = "手机号格式不正确";
      this.data.phone = "";
      this._showError(warn);
    } else {
      this.data.phone = value;
      this._sendCode();
      this._changeLayout();
    }
  },

  /**
   * 发送验证码
   */
  _sendCode() {

  },

  /**
   * 验证码布局
   */
  _changeLayout() {
      wx.navigateTo({
        url: `/pages/login/code/code?phone=+86${this.data.phone}`,
      })
  },

  /**
   * 错误提示
   */
  _showError(warn) {
    wx.showToast({
      title: warn,
      icon: 'none'
    })
  }
})