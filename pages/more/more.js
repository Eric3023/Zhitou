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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCatagory()
  },

  onShareAppMessage(){

  },

  /**
   * 获取行业列表
   */
  getCatagory() {
    wx.showLoading();
    moreModel.getCategoryList().then(res => {
      let data = res.data;
      this.setData({
        data: data
      });
      wx.hideLoading();
    }, error => {
      wx.hideLoading();
    });
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

  /**
   * 点击行业Item
   */
  onClickItem: function (event) {
    let title = event.detail.title;
    wx.navigateTo({
      url: `../map/map?searching=true&keyword=${title}`,
    })
  },

  /**
   * 页面滚动监听
   */
  onPageScroll: function (e) {
    console.log(e)
    let flag = e.scrollTop > height / 2 ? false : true;
    this.setData({
      show: flag
    });
  }
})