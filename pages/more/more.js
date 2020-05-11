// pages/more/more.js
import { MoreModel } from '../../models/more.js'

const height = 164;
const moreModel = new MoreModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    data: []
  },

  /**
   * 关闭顶部推荐栏目
   */
  onClose: function (event) {
    wx.pageScrollTo({
      scrollTop: height,
      complete: (res) => { },
    })
  },

  onClickItem: function (event) {
    let title = '点击了【' + event.detail.title + '】, 进入搜索商圈页面';
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从服务器获取行业列表
    moreModel.getCategoryList().then(res => {
      let data = res.data;
      this.setData({
        data: data
      })
    })
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

  onPageScroll: function (e) {
    console.log(e)
    let flag = e.scrollTop > height / 2 ? false : true;
    this.setData({
      show: flag
    });
  }
})