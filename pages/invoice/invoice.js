const recordModel = require('../../models/record.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,//0:个人发票；1:个人发票

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
   * 提交信息
   */
  onSubmit(event) {

    let value = event.detail.value;

    if (!value.name) {
      this._showToast('请输入名称');
      return;
    }
    if (!value.email) {
      this._showToast('请输入接收邮箱');
      return;
    }

    if (this.data.type == 0) {
      if (!value.number) {
        this._showToast('请输入公司税号');
        return;
      }
    }

    recordModel.openInvoice({
      type: this.data.type,
      name: value.name,
      dutySign: value.number,
      totalPrice: this.data.price,
      email: value.email,
      orderId: this.data.ids,
    }).then(res => {
      this._showToast('发票信息已提交，稍后请在邮箱查收')
      setTimeout(res => {
        wx.navigateBack({
          delta: 1,
        });
      }, 1500);
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
