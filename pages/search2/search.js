var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
const app = getApp()

Page({
  data: {
    keywrod: '',
    searchStatus:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../more/more'
    })
  },
  onLoad: function () {},

  onKeywordConfirm(event) {//搜索提交
    this.getSearchResult(event.detail.value);
  }, 
  getSearchResult(keyword) {
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
    }
    this.setData({
      keyword: keyword,
      page: 1,
      totalPages: 1,
      categoryId: 0,
      goodsList: []
    });

    //this.getGoodsList();
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  //请求轮播图
  requestCarouselListData() {
    var that = this;//注意this指向性问题
    // var urlStr = that.data.host + "/xjj/chome_carousel_list.json"; //请求连接注意替换（我用本地服务器模拟）
    // console.log("请求轮播图：" + urlStr);
    // wx.request({
    //   url: urlStr,
    //   data: {//这里放请求参数，如果传入参数值不是String，会被转换成String 
    //     // x: '',
    //     // y: ''
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log("轮播图返回值：");
    //     console.log(res.data.result);
    //     var resultArr = res.data.result;
    //     that.setData({
    //       carouselList: resultArr
    //     })
    //   }
    // })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
