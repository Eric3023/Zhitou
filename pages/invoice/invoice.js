const recordModel = require('../../models/record.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,//0:个人发票；1:个人发票
    name: '',//名称
    number: '',//税号
    email: '',//邮箱

    price: 0, //总金额
    ids: '',//订单id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ids: options.ids,
      price: options.price
    });
  },

  /**
   * 发票类型改变
   */
  onTypeChanged(event) {
    let value = event.detail.value;
    let type = parseInt(value);
    if (type == 0 || type == 1) {
      this.setData({
        type,
      });
    }
  },

  /**
   * 发票名称改变
   */
  onConfirmName(event) {
    this.data.name = event.detail.value;
  },

  /**
   * 发票税号改变
   */
  onConfirmNumber(event) {
    this.data.number = event.detail.value;
  },

  /**
   * 接收邮箱改变
   */
  onConfirmEmail(event) {
    this.data.email = event.detail.value;
  },

  /**
   * 提交信息
   */
  onSubmit(event) {

    if (!this.data.name) {
      this._showToast('请输入名称');
      return;
    }
    if (!this.data.email) {
      this._showToast('请输入接收邮箱');
      return;
    }

    if (this.data.type == 0) {
      if (!this.data.number) {
        this._showToast('请输入公司税号');
        return;
      }
    }

    recordModel.openInvoice({
      type: this.data.type,
      name: this.data.name,
      dutySign: this.data.number,
      totalPrice: this.data.price,
      email: this.data.email,
      orderId: this.data.ids,
    }).then(res => {

    }).catch(e => {
      this._showToast('开具发票失败，请重新尝试')
    });
  },


  /**
   * 提示弹框
   */
  _showToast(title) {
    wx.showToast({
      title: title,
      icon: "none",
    })
  }
})
