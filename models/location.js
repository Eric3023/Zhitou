const util = require('../utils/util.js');
const config = require('../config/api.js');
const qqmap = require('../utils/qqmap.js');

/**
 * 获取当前位置
 */
function getCurrentLocation() {
  return _checkPermission().then(
    res => {
      return qqmap.reverseGeocoder({});
    }
  )
}

/**
 * 地址逆解析
 */
function reverseGeocoder({ location, get_poi = 1 }) {
  return qqmap.reverseGeocoder({
    location: location,
    get_poi: get_poi,
  });
}

/**
 * 地址解析
 */
function getGeocoder(address) {
  return qqmap.getGeocoder(address);
}

/**
 * 获取周边用户数
 */
function getAroundUser(lng, lat, distance) {
  return util.request(config.AroundUsers, {
    lng: lng,
    lat: lat,
    distance: distance,
  }, 'POST');
}

/**
 * 搜索地点
 */
function search({keyword, page, shapLocation, currentcity}){
  return qqmap.search({keyword, page, shapLocation, currentcity});
}

/**
 * 检查定位权限
 */
function _checkPermission() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        //如果尚未授权，请求授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            //同意授权
            success: res => {
              resolve(res);
            },
            //拒绝授权
            fail: error => {
              reject(error);
            }
          })
        }
        //如果已经授权
        else {
          resolve(res);
        }
      }
    })
  });
}

module.exports = {
  getAroundUser: getAroundUser,
  getCurrentLocation: getCurrentLocation,
  reverseGeocoder: reverseGeocoder,
  getGeocoder: getGeocoder,
  search: search,
}
