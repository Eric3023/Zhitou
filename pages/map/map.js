import {
  CDN_PATH,
} from '../../config/appConfig';
import { WEBSERVICE_APPID } from '../../config/appConfig';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const RADIUS = 4;
const app = getApp();
var qqmapsdk;
Page({
  data: {
    isLocation: false,
    latitude: app.globalData.lat,
    longitude: app.globalData.lng,
    policy: 1,
    animation: false,
    isShowSubpois: true,
    dialogShow: false,
    link: 'https://developers.weixin.qq.com/community/servicemarket/detail/00046c6eed0df09552990112551815',
    regionCallbackTxt:'',
    keyword: '',
    defaultKeyword:{
      keyword :'搜索'
    },
    markers: [{
      callout: {
        content: '10公里内2000+用户',
        padding: 11,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      latitude: 0,
      longitude: 0,
      //iconPath: '../../img/Marker3_Activated.png',
      width: '34px',
      height: '34px',
      rotate: 0,
      alpha: 1
    }],
    currentcity:'北京市',
    hiddenMap:false,
    siteData:[]
  },

  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '5PEBZ-P4N63-LO53C-YFVFX-AGA2F-2WFE4'
    });

    var that = this
    that.setData({//为何不能直接写在data上
      latitude: options.lat,
      longitude: options.lng,
      regionCallbackTxt: options.lat + ',' + options.lng,
      'markers[0].latitude': options.lat,
      'markers[0].longitude': options.lng,
      currentcity: options.currentcity
    })

    const data = {
      location: that.data.regionCallbackTxt
    };
    let dataTxt = '{\n&emsp;&emsp;location:' + options.location + ',';
    //if (options.getPoi === '1') {
      data.get_poi = '1';
      dataTxt += '\n&emsp;&emsp;get_poi:1,';
   //}
    if (options.policy) {
      data.poi_options = 'policy=' + options.policy;
      dataTxt += '\n&emsp;&emsp;poi_options: "policy=' + options.policy + '"';
    }
    this.setData({
      requestJson: `wx.serviceMarket.invokeService({
      &emsp;service: "${WEBSERVICE_APPID}",
      &emsp;api: "rgeoc",
      &emsp;data: ${dataTxt}
      &emsp;}
      }).then( res => {
      &emsp;console.log(res)
      }).catch( err => {
      &emsp;console.error(err)
      })`

    });
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
      let tempCity = '';
      if (result.ad_info) {
        adInfo = result.ad_info.nation || '';
        adInfo += result.ad_info.province ? ',' + result.ad_info.province : '';
        adInfo += result.ad_info.city ? ',' + result.ad_info.city : '';
        adInfo += result.ad_info.district ? ',' + result.ad_info.district : '';

       
      }

      if (result.address_reference && result.address_reference.business_area) {
        businessArea = result.address_reference.business_area.title || '';
        businessArea += '(' + result.address_reference.business_area._dir_desc + ')';
      }

      if (result.address_reference && result.address_reference.landmark_l1) {
        landmark = result.address_reference.landmark_l1.title || '';
        landmark += '(' + result.address_reference.landmark_l1._dir_desc + ')';
      }
      if (result.address_reference && result.address_reference.crossroad) {
        crossroad = result.address_reference.crossroad.title || '';
        crossroad += '(' + result.address_reference.crossroad._dir_desc + ')';
      }
      that.setData({
        resultJson: [{
          name: 'pre',
          children: [{
            type: 'text',
            text: (typeof res.data) === 'string' ? res.data : JSON.stringify(res.data, null, '\t')
          }]
        }],
        addressInfo: {
          adcode: result.ad_info && result.ad_info.adcode || '', //行政区划代码
          address: result.address || '',
          businessArea: businessArea, //商圈
          adInfo: adInfo,
          landmark: landmark,
          recommend: result.formatted_addresses && result.formatted_addresses.recommend || '',
          crossroad: crossroad
        },
        pois: result.pois
      });
    }).catch(err => {
      console.error(err);
    });
    
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
        // success: function (res) {
        //   console.log(res)
        // }, fail: function (res) {
        //   console.log(res)
        // }
        //拿到移动的位置
        success: res => {
          const latitude = res.latitude;
          const longitude = res.longitude;
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

        },
        
      });
    }
  },
  onRun() {
    if (this.data.regionCallbackTxt === '拖动地图选择坐标') {
      wx.showToast({
        title: '请拖动地图选择坐标',
        icon: 'none',
        duration: 1500,
        mask: false
      });
      return;
    }
    wx.navigateTo({
      url: `../reverseGeocoder-result/reverseGeocoder-result?location=${this.data.regionCallbackTxt}&getPoi=${this.data.isShowSubpois ? 1 : 0}&policy=${this.data.policy}`,
    });
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
    if (event.detail.value == '') {//有搜索值的时候，失去焦点后不显示地图
      this.setData({
        hiddenMap: false,
        siteData:[]//清空搜索结果
      })
    }
  },
  hiddenMap() {
    this.setData({
      hiddenMap: true
    })
  },

  onKeywordConfirm(event) {//搜索提交
    console.log(event);
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
    var shapLocation = that.data.regionCallbackTxt;//坐标中心 
      
    //http://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodSearch
    qqmapsdk.search({
      keyword: keyword,//搜索关键词
      location: shapLocation,//设置周边搜索中心点
      address_format: 'short',
      region: that.data.currentcity,
      page_size:20,
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



  onSelectCity() {
    var that = this;
    wx.navigateTo({
      url: `../city/city?currentcity=` + that.data.currentcity,
    })

  },

  /**
   * 选择地址
   */
  bindDistance: function (e) {
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

        /**
         * 计算距离
         * form=>起点坐标
         * to=>终点坐标
         * scope=>距离
         */
        qqmapsdk.calculateDistance({
          mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
          from: shapLocation,
          to: toLocation,
          success: function (res) {
            var distance = res.result.elements[0].distance;/**起点到终点的距离，单位：米，如果radius半径过小或者无法搜索到，则返回-1 */
            var duration = res.result.elements[0].duration;/**表示从起点到终点的结合路况的时间，秒为单位。 注：步行方式不计算耗时，该值始终为0 */
            if (distance <= range) {
              wx.showModal({
                title: '提示',
                content: '该地址在配送范围以内,是否选择为收货地址',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/user/site/edit/index?title=' + title
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '该地址不在我们的配送范围之内，请重新选择地址',
              })
            }
          }
        })

      } else {
        siteData[i].checked = false;
      }
    }
    var set = setInterval(function () {
      if (siteData.length > 0) {
        wx.hideLoading()
        that.setData({
          siteData: siteData
        })
        clearInterval(set);
      }
    }, 100)
    that.setData({
      listIndex: index
    })
  },
})



