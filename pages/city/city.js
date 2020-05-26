const cityData = require('../../utils/city.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letters: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
    lettersFlag: 0,
    cityData: cityData.cityData,
    scrollIntoView: '',
    showLetter: false,
    currentcity: '',
    hotCity: [{ name: '北京市' },
    { name: '天津市' },
    { name: '石家庄市' },
    { name: '杭州市' },
    { name: '成都市' },
    { name: '重庆市' },
    { name: '青岛市' },
    { name: '广州市' },
    { name: '南京市' },
    { name: '福州市' },
    { name: '深圳市' }

    ],
    latitude: 0,
    longitude: 0,
    regionCallbackTxt: '',
  },
  /**
   * 点击滑动到字母
   */
  clickIntoView: function (e) {
    let index = e.currentTarget.dataset.index;
    _this.setData({
      scrollIntoView: index == 0 ? 'top' : _this.data.letters[index],
      lettersFlag: index,
      showLetter: true
    })
    setTimeout(function () {
      _this.setData({
        showLetter: false
      })
    }, 800)
  },
  /**
   * 移动到字母
   */
  moveIntoView: function (e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.setData({
      location: wx.getStorageSync("getLocation"),
      currentcity: options.currentcity
    })
  },

  onShareAppMessage() {

  },

  /**
   * 选中城市
   */
  chooseCity: function (e) {
    let name = e.currentTarget.dataset.name;
    // let pages = getCurrentPages();
    // let prePage = getCurrentPages()[pages.length - 2];
    // prePage.setData({
    //   currentcity: name
    // })
    // wx.setStorageSync("city_name", name);
    // wx.navigateBack({
    //   delta:1
    // })

    //根据选择的城市，算出经纬度，调用地址解析接口
    this.getCurrentGeocoder(name);

  },

  getCurrentGeocoder(name) {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: '5PEBZ-P4N63-LO53C-YFVFX-AGA2F-2WFE4'
    });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            complete(res) {
              //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
              //注：坐标系采用gcj02坐标系
              qqmapsdk.geocoder({
                address: name,
                success: function (res) {//成功后的回调

                  console.log(res);
                  var res = res.result;

                  that.setData({
                    regionCallbackTxt: res.location.lat + ',' + res.location.lng,
                    latitude: res.location.lat,
                    longitude: res.location.lng,
                    currentcity: res.address_components.city
                  });

                  let ad_info = res.ad_info;
                  let components = res.address_components;
                  let address =`${components.province}${components.city}${components.district}`;
                  app.globalData.lat = res.location.lat;
                  app.globalData.lng = res.location.lng;

                  wx.navigateTo({
                    url: `../map/map?location=${that.data.regionCallbackTxt}&getPoi=1&policy=1&lat=${that.data.latitude}&lng=${that.data.longitude}&currentcity=${that.data.currentcity}`,
                  })
                }
              });

            }

          })
        } else {//授权过位置信息
          qqmapsdk.geocoder({
            address: name,
            success: function (res) {//成功后的回调

              console.log(res);
              var res = res.result;
              that.setData({

                regionCallbackTxt: res.location.lat + ',' + res.location.lng,
                latitude: res.location.lat,
                longitude: res.location.lng,
                currentcity: res.address_components.city
              });


              wx.navigateTo({
                url: `../map/map?location=${that.data.regionCallbackTxt}&getPoi=1&policy=1&lat=${that.data.latitude}&lng=${that.data.longitude}&currentcity=${that.data.currentcity}`,
              })
            }
          });
        }
      }
    })
  },

  getCurrentCity: function () {
    var that = this;

    var qqmapsdk = new QQMapWX({
      key: '5PEBZ-P4N63-LO53C-YFVFX-AGA2F-2WFE4'
    });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
              //注：坐标系采用gcj02坐标系
              qqmapsdk.reverseGeocoder({
                success: function (res) {//成功后的回调
                  console.log(res);
                  that.setData({
                    currentcity:
                      res.result.address_component.city
                  });
                }
              });

              console.log(res)
            }

          })
        } else {//授权过位置信息
          qqmapsdk.reverseGeocoder({
            success: function (res) {//成功后的回调
              console.log(res);
              that.setData({
                currentcity:
                  res.result.address_component.city
              });
            }
          });
        }
      }
    })
  }
})