const cityData = require('../../utils/city.js');
const locationModel = require('../../models/location.js');

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
    currentcity: '北京市',
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
    { name: '深圳市' },
    { name: '上海市' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.setData({
      location: wx.getStorageSync("getLocation"),
    })
    if (options.currentcity) {
      _this.setData({
        currentcity: options.currentcity
      })
    }
    app.globalData.city = this.data.currentcity;
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {

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
    this._getCurrentGeocoder(name);

  },

  /**
   * 地址解析
   */
  _getCurrentGeocoder(name) {    
    locationModel.getGeocoder(name)
      .then(res => {
        console.log(res);
        var res = res.result;

        app.globalData.lat = res.location.lat;
        app.globalData.lng = res.location.lng;
        app.globalData.city = res.address_components.city
  
        wx.navigateTo({
          url: `../map/map?lat=${app.globalData.lat}&lng=${app.globalData.lng}&currentcity=${app.globalData.city}`,
        })
      }, error => {
        console.log(error)
      });
  },
})