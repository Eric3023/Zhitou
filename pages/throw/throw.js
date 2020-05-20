// pages/throw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    models: [
      {
        img: "/img/throw/model.png",
        type: 0,
      },
      {
        img: "/img/throw/model.png",
        type: 0,
      },
      {
        img: "/img/throw/model.png",
        type: 0,
      },
      {
        img: "/img/throw/model.png",
        type: 0,
      },
    ],
    mottos: [
      "5万以下",
      "5-10万",
      "10-15万",
      "15-20万",
      "20-25万",
      "25-30万",
      "30-35万",
      "35-50万",
      "50-100万",
      "100万以上",
    ],
    index: 0,
    state: 0,//0：选择广告位，1：选择模板/文件；2.选择素材完成；3：结算中/结算确认；4；结算完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 点击了上传素材
   */
  onClickUpdate(event) {
    this.setData({
      state: 1,
    });
  },

  /**
   * 取消了上传素材
   */
  onCancelMaterial() {
    this.setData({
      state: 0,
    });
  },

  /**
   * 上传素材
   */
  onCommitMaterial() {
    this.setData({
      state: 2,
    });
  },

  /**
   * 选中车型
   */
  bindPickerChange(event) {
    this.setData({
      index: event.detail.value,
    })
  },

  /**
   * 点击开始结算
   */
  onSettle() {
    this.setData({
      state: 3,
    });
  },

  /**
   * 取消结算 
   */
  onCancleCheck() {
    this.setData({
      state: 2,
    });
  },

  /**
   * 完成结算 
   */
  onConfirmCheck() {
    this.setData({
      state: 4,
    });
    wx.navigateTo({
      url: '../../pages/complete/complete',
    })
  },
})