const locationModel = require('../../models/location.js');

const app = getApp();

Page({
  data: {
    location: {},

    isLocation: false,
    latitude: app.globalData.lat,
    longitude: app.globalData.lng,
    regionId: 0,
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
        // content: '10公里内有x个用户',
        content: '用户转换指数等级：高',
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

    //搜索关键词
    keyword: '',
    //搜索页码
    page: 1,
    //搜索结果
    siteData: [],

    //周边用户数
    user_num: 0,
  },

  /**
   * 页面加载监听
   */
  onLoad: function (options) {
    console.log("+++++++++++");
    console.log(options);
    this._loadHistory();//载入搜索历史记录

    //需要直接开始搜索(主页顶部/行业分类进入)
    let keyword = options.keyword;
    let searching = options.searching;
    if (searching) {
      this.hiddenMap();
      if (keyword)
        this._searchList(keyword);
    }
    //从首页进入，直接显示地图
    else {
      this._initMap(options);
    }
  },

  /**
   * 监听视野变化
   */
  onChangeRegion(event) {
    if (event.type === 'end' && event.causedBy === 'drag') {
      const mapCtx = wx.createMapContext('map', this);//根据控件ID
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

          this._reverseGeocoderPositon({
            location: {
              latitude: latitude, longitude: longitude
            },
            get_poi: 1,
          });
        },

      });
    }
  },

  /**
   * 提交搜索
   */
  onKeywordConfirm(event) {//搜索提交，从组件传值，默认封装成event.detail.变量名称
    const value = event.detail.value;
    this._searchList(value);
  },

  /**
   * 清除搜索输入框内容
   */
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

  /**
   * 隐藏地图
   */
  hiddenMap() {
    this.setData({
      hiddenMap: true,
      hiddenHis: false//显示搜索历史
    });
  },

  /**
   * 跳转到选择城市页面
   */
  onSelectCity: function () {
    wx.navigateTo({
      url: `../city/city?currentcity=` + this.data.currentcity,
    })
  },

  /**
   * 清空搜索历史
   */
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
   * 选择地址
   */
  bindSelect: function (e) {
    //隐藏搜索结果。显示地图
    e = e.detail.event;
    var index = e.currentTarget.dataset.index ? e.currentTarget.dataset.index : "0";
    var siteData = this.data.siteData;

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

        this._reverseGeocoderPositon({
          location: {
            latitude: latitude, longitude: longitude
          },
          get_poi: 1,
        });

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

    this.setData({
      listIndex: index
    })
  },

  /**
   * 加载更多搜索结果
   */
  onLoadMore() {
    const value = this.data.keyword;
    this._searchMoreList(value)
  },

  /**
   * 点击了周边位置Item
   */
  onSelectPosition(event) {
    let location = event.detail.value;
    app.globalData.selectLocation = location;
    wx.switchTab({
      url: `../throw/throw`,
      success: res => {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },

  /**
   * 跳转到热力图页面
   */
  onJumpToHeatMap(event) {
    wx.navigateTo({
      url: `/pages/heatmap/heatmap?regionid=${this.data.regionId}&lat=${this.data.latitude}&lng=${this.data.longitude}&zoom=10`,
    })
  },
  /**
   * 初始化地图视图 
   */
  _initMap(options) {    
    this.setData({
      latitude: options.lat,
      longitude: options.lng,
      regionCallbackTxt: options.lat + ',' + options.lng,
      currentcity: options.currentcity,
      'markers[0].latitude': options.lat,
      'markers[0].longitude': options.lng,

    })

    //获取当前位置信息
    this._reverseGeocoderPositon({
      location: {
        latitude: options.lat,
        longitude: options.lng
      },
      get_poi: 1
    });
  },

  /**
   * 加载搜索历史记录
   */
  _loadHistory() {
    let arr = wx.getStorageSync("searchHisArray");
    if (Array.isArray(arr)) {
      this.setData({
        hisSearchData: arr
      })
    }
  },

  /**
   * 获取选中位置信息
   */
  _reverseGeocoderPositon({ location, get_poi }) {
    locationModel.reverseGeocoder({
      location: location,
      get_poi: get_poi,
    }).then(
      res => {
        console.log(res);
        const result = res.result;
        app.globalData.selectLocation = result;

        this.setData({
          regionId: result.ad_info.adcode,
          location: result,
          pois: result.pois,
          currentcity: result.address_component.city,
        });
        //获取周边用户
        this._getAroundUser(res.result.location.longitude, res.result.location.latitude, 10);
      }, error => {
        console.log(error);
      }
    );
  },

  /**
   * 获取周边用户数量
   */
  _getAroundUser(lng, lat, distance) {
    locationModel.getAroundUser(lng, lat, distance).then(
      res => {
        const data = res.data;
        // this.data.markers[0].content = `10公里内有${data == 0 ? 'x' : data}个用户`;
        this.data.markers[0].callout.content = `${this.data.location.ad_info.province}用户转换指数等级：高`;
        this.setData({
          user_num: data,
          markers: this.data.markers,
        });
      }, error => {

      }
    );
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
    this._getSearchResult(value);
  },

  /**
   * 不修改检索关键词，加载更多结果
   */
  _searchMoreList(value) {
    //加载更多，页码递增
    this.data.page++;
    this._getSearchResult(value);
  },

  /**
   * 获取搜索结果
   */
  _getSearchResult(keyword) {
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none',
        duration: 1000
      })
    } else {//输入之后搜索
      this._execSearch(keyword);
    }
  },

  /**
   * 执行具体搜索
   */
  _execSearch: function (keyword) {
    wx.showLoading({
      title: '加载中',
    })
    var shapLocation = this.data.regionCallbackTxt;//坐标中心 

    locationModel.search({
      keyword,
      page: this.data.page,
      shapLocation:
        shapLocation,
      currentcity: this.data.currentcity
    }).then(
      res => {
        if(res.data){
          this.data.siteData = this.data.siteData.concat(res.data);
        }
        wx.hideLoading();
        this.setData({//搜索后，隐藏历史
          hiddenHis: true,
          siteData: this.data.siteData,
        })
      }, error => {
        wx.hideLoading();
        this.setData({//搜索后，隐藏历史
          hiddenHis: true,
          siteData: this.data.siteData,
        })
      }
    );
  },
})



