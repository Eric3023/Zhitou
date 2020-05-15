
var qqmaputil = require('../../utils/qqmaputil.js');

const app = getApp();

Page({
  data: {
    latitude: app.globalData.lat,
    longitude: app.globalData.lng,
    keyword: '',
    defaultKeyword: {
      keyword: '搜索'
    },
    currentcity: '北京市',
    hiddenRes: false,//进入搜索，隐藏搜索结果
    hiddenHis: false,//默认显示历史搜索记录

    //搜索关键词
    keyword: '',
    //搜索页码
    page: 1,
    //搜索结果
    siteData: [],
  },

  onLoad: function (options) {

    var that = this
    that.setData({
      latitude: options.lat,
      longitude: options.lng,
      currentcity: options.currentcity,
    })

    that.loadHis();//载入搜索历史记录
  },

  onKeywordConfirm(event) {//搜索提交，从组件传值，默认封装成event.detail.变量名称
    const value = event.detail.value;
    this._searchList(value);
  },
  getSearchResult(keyword) {
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none',
        duration: 1000
      })
    } else {//输入之后搜索
      this.search(keyword);
    }
  },

  search: function (keyword) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var shapLocation = that.data.regionCallbackTxt;//坐标中心 

    qqmaputil.search(that, keyword, this.data.page, shapLocation, that.data.currentcity, this.data.siteData);

    console.log(this.data.siteData);
    this.setData({
      hiddenRes: true,//显示结果
      hiddenHis: true//隐藏历史
    });

  },

  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
    wx.hideLoading();
    //取消后显示地图
    this.setData({
      hiddenRes: false,//隐藏搜索结果
      hiddenHis: false,//默认显示历史搜索记录
      siteData: []//清空搜索结果
    })
  },

  onSelectCity: function () {
    var that = this;
    wx.navigateTo({
      url: `../city/city?currentcity=` + that.data.currentcity,
    })

  },
  loadHis() {
    var that = this;
    let arr = wx.getStorageSync("searchHisArray");

    if (Array.isArray(arr)) {
      that.setData({
        hisSearchData: arr
      })
    }
  },

  // 添加历史搜索记录缓存
  addHisSearchData: function (searchValue) {

    var that = this;
    let arr = wx.getStorageSync("searchHisArray");
    if (!Array.isArray(arr)) {//判断本地缓存是否有数组，如果没有，则新建
      that.setData({
        hisSearchData: [searchValue]//更新历史显示列表
      })
      wx.setStorage({//更新存储的历史
        key: 'searchHisArray',
        data: that.data.hisSearchData
      })

      return;
    }

    //如果存在了，则读取本地缓存

    if (arr !== null) {

      let num = arr.indexOf(searchValue);
      if (num != -1) {
        // 删除已存在后重新插入至数组
        arr.splice(num, 1);
        arr.unshift(searchValue);
      } else {
        arr.unshift(searchValue);
      }
    }

    if (arr.length >= 50) {
      arr.splice(49, 1);
    }

    //存储搜索记录
    wx.setStorage({
      key: "searchHisArray",
      data: arr
    })

    that.setData({
      hisSearchData: arr
    })

  },
  clearHisSearchData: function () {
    this.setData({
      hisSearchData: []
    });

    wx.clearStorage("searchHisArray");
  },


  showRes(event) {
    if (event.detail.value == '') {//有搜索值的时候，失去焦点后不显示地图
      // this.setData({

      //   siteData: []//清空搜索结果
      // })
    }
  },

  hiddenRes() {
    var that = this;
    // this.setData({
    //   hiddenRes: true,
    //   hiddenHis: false//显示搜索历史
    // });

  },

  /**
   * 选中搜索历史监听回调
   */
  onSelectHistory(event) {
    const value = event.detail.value;
    this._searchList(value);
  },

  /**
   * 加载更多搜索结果
   */
  onLoadMore() {
    const value = this.data.keyword;
    this._searchMoreList(value)
  },

  /**
   * 修改检索关键词，重新搜索
   */
  _searchList(value) {
    //重新搜索，页码和搜索结果需要重置
    this.data.page = 1;
    this.data.siteData = [];
    //修改搜索框的显示内容
    this.setData({
      keyword: value
    });
    this.getSearchResult(value);
  },

  /**
   * 不修改检索关键词，加载更多结果
   */
  _searchMoreList(value) {
    //加载更多，页码递增
    this.data.page++;
    this.getSearchResult(value);
  }
})