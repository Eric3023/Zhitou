import {
  CDN_PATH,
} from '../../config/appConfig';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const app = getApp();
var qqmapsdk;
Page({
  data: {
    latitude: 0,
    longitude: 0,
    keyword: '',
    defaultKeyword: {
      keyword: '搜索'
    },
    currentcity: '北京市',
    siteData: []
  },

  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '5PEBZ-P4N63-LO53C-YFVFX-AGA2F-2WFE4'
    });

    var that = this
    that.setData({
      latitude: options.lat,
      longitude: options.lng,
      currentcity: options.currentcity
    })
  },

  onKeywordConfirm(event) {//搜索提交，从组件传值，默认封装成event.detail.变量名称
    this.getSearchResult(event.detail.value);
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
    var siteData = [];

    wx.showLoading({
      title: '加载中',
    })
    var shapLocation = that.data.latitude + "," + that.data.longitude;//坐标中心 
    //http://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodSearch
    qqmapsdk.search({
      keyword: keyword,//搜索关键词
      location: shapLocation,//设置周边搜索中心点
      address_format: 'short',
      region: that.data.currentcity,
      page_size: 20,
      success: function (res) {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            siteData.push({
              title: res.data[i].title,//名字
              id: res.data[i].id,//id
              da_info: res.data[i].da_info,//所属省市区
              address: res.data[i].address,//具体地址
              location: res.data[i].location,//坐标
              category: res.data[i].category,//类型
              tel: res.data[i].tel,//电话
              checked: false,//是否在选中
              scope: false,//是否在范围以内
            })
          };

          that.setData({
            siteData: siteData
          })
          wx.hideLoading();
        } else {
          //无数据


        }

      },
    })

    console.log(siteData);
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
    wx.hideLoading();
    //取消后显示地图
    this.setData({
      hiddenMap: false,
      siteData: []//清空搜索结果
    })
  },



  onSelectCity: function () {
    var that = this;
    console.log("222");
    wx.navigateTo({
      url: `../city/city?currentcity=` + that.data.currentcity,
    })

  },

  /**
   * 选择地址
   */
  bindSelect: function (e) {
    //隐藏搜索结果。显示地图

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
          regionCallbackTxt: latitude.toFixed(6) + ',' + longitude.toFixed(6)
        });

        const data = {
          location: that.data.regionCallbackTxt
        };
        let dataTxt = '{\n&emsp;&emsp;location:' + that.data.regionCallbackTxt + ',';
        data.get_poi = '1';
        dataTxt += '\n&emsp;&emsp;get_poi:1,';
        //}

        data.poi_options = 'policy=1';
        dataTxt += '\n&emsp;&emsp;poi_options: "policy=1' + '"';

        wx.serviceMarket.invokeService({
          service: WEBSERVICE_APPID,
          api: 'rgeoc',
          data: data
        }).then(res => {
          console.log(res);
          const result = (typeof res.data) === 'string' ? JSON.parse(res.data).result : res.data.result;
          let adInfo = '';
          let businessArea = '';
          let landmark = '';
          let crossroad = '';

          if (result.address_reference && result.address_reference.business_area) {
            businessArea = result.address_reference.business_area.title || '';
            businessArea += '(' + result.address_reference.business_area._dir_desc + ')';
          }

          if (result.address_reference && result.address_reference.landmark_l1) {
            landmark = result.address_reference.landmark_l1.title || '';
            landmark += '(' + result.address_reference.landmark_l1._dir_desc + ')';
          }

          that.setData({
            addressInfo: {
              businessArea: businessArea, //商圈
              recommend: result.formatted_addresses && result.formatted_addresses.recommend || ''
            },
            pois: result.pois,

            'markers[0].latitude': latitude.toFixed(6),
            'markers[0].longitude': longitude.toFixed(6),

          });
        }).catch(err => {
          console.error(err);
        });
        //显示地图
        this.setData({
          hiddenMap: false,
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
})