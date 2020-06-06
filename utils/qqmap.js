var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
//https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
//注：坐标系采用gcj02坐标系
var qqmapsdk = new QQMapWX({
  key: '5PEBZ-P4N63-LO53C-YFVFX-AGA2F-2WFE4'
});

/**
 * 逆地址解析
 */
function reverseGeocoder({ location = null, get_poi = 0 }) {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: location,
      get_poi: get_poi,//是否返回周边地址:1.返回；0不返回(默认)
      poi_options: 'page_index=1;page_size=20',
      success: res => {
        console.log(res);
        resolve(res);
      },
      fail: error => {
        console.log(error);
        reject(error);
      }
    });
  });
}

/**
 * 地址解析
 */
function getGeocoder(name) {
  return new Promise((resolve, reject) => {
    qqmapsdk.geocoder({
      address: name,
      success: res => {
        console.log(res);
        resolve(res);
      },
      fail: error => {
        console.log(error);
        reject(error);
      }
    });
  });
}

/**
 * 搜索地点
 */
function search({ keyword, page, shapLocation, currentcity }) {
  return new Promise((resolve, reject) => {
    qqmapsdk.search({
      keyword: keyword,//搜索关键词
      location: shapLocation,//设置周边搜索中心点
      address_format: 'short',
      region: currentcity,
      page_index: page,
      page_size: "20",
      success: function (res) {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    })
  });
}

/**
 * 获取当前定位，同reverseGeocoder，与page解耦
 */
function getCurrentLocation({ app } = null) {
  return new Promise(function (resolve, reject) {
    console.log("开始获取当前定位");
    qqmapsdk.reverseGeocoder({
      success: res => {
        console.log("获取当前定位");
        console.log(res);
        const result = res.result;
        if (app) {
          app.globalData.lat = result.location.lat;
          app.globalData.lng = result.location.lng;

          app.globalData.selectLocation = result;
        }
        resolve(result);
      },
      fail: error => {
        console.log(error);
        reject(error);
      }
    });
  });
}

module.exports = {
  reverseGeocoder: reverseGeocoder,
  getGeocoder: getGeocoder,
  getCurrentLocation: getCurrentLocation,
  search: search
}