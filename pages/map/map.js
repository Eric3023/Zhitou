import { LocationModel } from '../../models/location.js';
var qqmaputil = require('../../utils/qqmaputil.js');
const locationModel = new LocationModel();

const RADIUS = 4;
const app = getApp();

Page({
  data: {
    isLocation: false,
    latitude: app.globalData.lat,
    longitude: app.globalData.lng,
    policy: 1,
    animation: false,
    isShowSubpois: true,
    dialogShow: false,
    regionCallbackTxt: '',
    keyword: '',
    defaultKeyword: {
      keyword: '搜索'
    },
    markers: [{
      callout: {
        content: '10公里内有x个用户',
        padding: 11,
        borderRadius: 2,
        display: 'ALWAYS',
        // anchorY: -10
      },
      latitude: 0,
      longitude: 0,
      iconPath: '../../img/Marker3_Activated.png',
      width: '1px',
      height: '60rpx',
      rotate: 0,
      alpha: 1
    }],
    currentcity: '北京市',
    hiddenMap: false,
    hiddenHis: true,
    hisSearchData: [],
    showNull: false,

    //搜索关键词
    keyword: '',
    //搜索页码
    page: 1,
    //搜索结果
    siteData: [],

    //周边用户数
    user_num: 0,
  },

  onLoad: function (options) {

    var that = this
    that.loadHis();//载入搜索历史记录

    //需要直接开始搜索
    let keyword = options.keyword;
    let searching = options.searching;
    if (searching) {
      this.hiddenMap();
      if (keyword)
        this._searchList(keyword);
    } else {
      that.setData({
        latitude: options.lat,
        longitude: options.lng,
        regionCallbackTxt: options.lat + ',' + options.lng,
        currentcity: options.currentcity,
        'markers[0].latitude': options.lat,
        'markers[0].longitude': options.lng,

      })

      //获取指定位置的poi
      qqmaputil.reverseGeocoderPoi(app, that, { latitude: options.lat, longitude: options.lng });
      //获取周边用户
      this._getAroundUser(options.lng, options.lat, 10);
    }
  },

  onShareAppMessage(){

  },

  onMarkerAnimationend() {
    this.setData({
      animation: false
    });
  },// 监听视野变化
  onChangeRegion(event) {
    var that = this
    if (event.type === 'end' && event.causedBy === 'drag') {
      const mapCtx = wx.createMapContext('map', that);//根据控件ID
      mapCtx.getCenterLocation({

        //拿到移动的位置
        success: res => {
          const latitude = res.latitude;
          const longitude = res.longitude;
          this.setData({
            animation: true,
            'markers[0].latitude': latitude,
            'markers[0].longitude': longitude,
          });

          qqmaputil.reverseGeocoderPoi(app, that, { latitude: latitude, longitude: longitude });
          //获取周边用户
          this._getAroundUser(longitude, latitude, 10);

          // wx.serviceMarket.invokeService({
          //   service: WEBSERVICE_APPID,
          //   api: 'rgeoc',
          //   data: data
          // }).then(res => {
          //   const result = (typeof res.data) === 'string' ? JSON.parse(res.data).result : res.data.result;
          //   let adInfo = '';
          //   let businessArea = '';
          //   let landmark = '';
          //   let crossroad = '';

          //   if (result.address_reference && result.address_reference.business_area) {
          //     businessArea = result.address_reference.business_area.title || '';
          //     businessArea += '(' + result.address_reference.business_area._dir_desc + ')';
          //   }

          //   if (result.address_reference && result.address_reference.landmark_l1) {
          //     landmark = result.address_reference.landmark_l1.title || '';
          //     landmark += '(' + result.address_reference.landmark_l1._dir_desc + ')';
          //   }

          //   that.setData({
          //     addressInfo: {
          //       businessArea: businessArea, //商圈
          //       recommend: result.formatted_addresses && result.formatted_addresses.recommend || ''
          //     },
          //     pois: result.pois,

          //     'markers[0].latitude': latitude.toFixed(6),
          //     'markers[0].longitude': longitude.toFixed(6),

          //   });
          // }).catch(err => {
          //   console.error(err);
          // });

        },

      });
    }
  },
  onDialogClose() {
    this.setData({
      dialogShow: false
    });
  },
  onWatchDoc() {
    this.setData({
      dialogShow: true
    });
  },
  onShareAppMessage: function () {
    return {
      title: '腾讯位置服务'
    };
  },

  showMap(event) {
    console.log(event);
    // if (event.detail.value == '') {//有搜索值的时候，失去焦点后不显示地图
    //   this.setData({
    //     hiddenMap: false,
    //     hiddenHis: true,
    //     showNull: false,
    //     siteData: []//清空搜索结果
    //   })
    // }
  },
  loadHis() {
    console.log(111);
    var that = this;
    let arr = wx.getStorageSync("searchHisArray");
    if (Array.isArray(arr)) {
      that.setData({
        hisSearchData: arr
      })
    }
  },

  hiddenMap() {

    var that = this;
    this.setData({
      hiddenMap: true,
      showNull: false,
      hiddenHis: false//显示搜索历史
    });

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

    //http://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodSearch
    // qqmapsdk.search({
    //   keyword: keyword,//搜索关键词
    //   location: shapLocation,//设置周边搜索中心点
    //   address_format: 'short',
    //   region: that.data.currentcity,
    //   page_size:20,
    //     success: function (res) {
    //       if (res.data.length > 0) {
    //         for (var i = 0; i < res.data.length; i++) {
    //           siteData.push({
    //             title: res.data[i].title,//名字
    //             id: res.data[i].id,//id
    //             da_info: res.data[i].da_info,//所属省市区
    //             address: res.data[i].address,//具体地址
    //             location: res.data[i].location,//坐标
    //             category: res.data[i].category,//类型
    //             tel: res.data[i].tel,//电话
    //             checked: false,//是否在选中
    //             scope: false,//是否在范围以内
    //           })
    //         };

    //         that.setData({
    //           siteData: siteData
    //         })
    //         wx.hideLoading();
    //       } else {
    //         //无数据
    //         that.setData({
    //           showNull :true
    //         })

    //         wx.hideLoading();

    //       }
    //       that.setData({//搜索后，隐藏历史
    //         hiddenHis: true
    //       })

    //       //最多50条历史
    //       that.addHisSearchData(keyword);


    //     },
    //   })
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false,

    });

    wx.hideLoading();
    //取消后显示地图
    this.setData({
      hiddenMap: false,
      hiddenHis: true,
      siteData: []//清空搜索结果
    })
  },



  onSelectCity: function () {
    var that = this;
    wx.navigateTo({
      url: `../city/city?currentcity=` + that.data.currentcity,
    })

  },

  /**
   * 选择地址
   */
  bindSelect: function (e) {
    //隐藏搜索结果。显示地图

    e = e.detail.event;
    var that = this;
    var index = e.currentTarget.dataset.index ? e.currentTarget.dataset.index : "0";
    var location = e.currentTarget.dataset.location;
    var siteData = this.data.siteData;
    var shapLocation = this.data.shapLocation;//起点地址坐标

    wx.showLoading({
      title: '加载中',
    })

    for (var i = 0; i < siteData.length; i++) {
      if (index == (i + 1)) {
        siteData[i].checked = true;
        var toLocation = siteData[i].location.lat + "," + siteData[i].location.lng
        toLocation = String(toLocation);
        var title = siteData[i].title;

        //显示地图，定位到此。并搜索周边
        const latitude = siteData[i].location.lat;
        const longitude = siteData[i].location.lng;
        this.setData({
          animation: true,
          regionCallbackTxt: latitude.toFixed(6) + ',' + longitude.toFixed(6),
          'markers[0].latitude': latitude.toFixed(6),
          'markers[0].longitude': longitude.toFixed(6),
          latitude: latitude,
          longitude: longitude,
        });

        qqmaputil.reverseGeocoderPoi(app, that, { latitude: latitude, longitude: longitude });
        //获取周边用户
        this._getAroundUser(longitude, latitude, 10);


        //显示地图
        this.setData({
          hiddenMap: false,
          hiddenHis: true,
          siteData: []//清空搜索结果
        })
        wx.hideLoading();

        break;
      } else {
        siteData[i].checked = false;
      }
    }

    that.setData({
      listIndex: index
    })
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
  },

  /**
   * 获取周边用户数量
   */
  _getAroundUser(lng, lat, distance) {
    locationModel.getAroundUser(lng, lat, distance).then(
      res => {
        const data = res.data.data;
        this.data.markers[0].content = `10公里内有${data == 0 ? 'x' : data}个用户`;
        this.setData({
          user_num: data,
          markers: this.data.markers,
        });
      }
    );
  },

  /**
   * 点击了周边位置Item
   */
  onSelectPosition(event) {
    let location = event.detail.value;
    app.globalData.t_location = location;
    wx.switchTab({
      url: `../throw/throw`,
      success: res => {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  }
})



