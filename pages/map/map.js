import {
  CDN_PATH,
} from '../../config/appConfig';
import { WEBSERVICE_APPID } from '../../config/appConfig';

const RADIUS = 4;
const app = getApp()
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
    keywrod: '',
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
      latitude: 40.040415,
      longitude: 116.273511,
      iconPath: '../../img/Marker3_Activated.png',
      width: '34px',
      height: '34px',
      rotate: 0,
      alpha: 1
    }]
  },

  onLoad: function (options) {
   
    var that = this
    that.setData({//为何不能直接写在data上
      latitude: app.globalData.lat,
      longitude: app.globalData.lng,
      regionCallbackTxt: app.globalData.lat+','+app.globalData.lng,
      'markers[0].latitude': app.globalData.lat,
      'markers[0].longitude': app.globalData.lng
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

  onKeywordConfirm(event) {//搜索提交
    this.getSearchResult(event.detail.value);
  },
  getSearchResult(keyword) {
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
    } else {//输入之后搜索


    }
    

    //this.getGoodsList();
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
})



