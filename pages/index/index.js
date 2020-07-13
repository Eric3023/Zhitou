const homeModel = require('../../models/home.js');
const locationModel = require('../../models/location.js');
const config = require('../../config/api.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    // Banner默认轮播图(防止网络数据获取失败，显示空白)
    banners: [
      { imageUrl: '/img/banner/banner1.jpg' },
    ],
    defaultBanner: '/img/banner/banner1.jpg',

    //周边用户数量
    user_num: 0,

    //是否显示霸屏
    bullying: false,
    bullyInfo: false,
  },

  /**
   * 加载页面
   */
  onLoad: function () {
    // this._getCurrentLocation();//获取当前定位
    this._getBanners();//请求轮播图
    this._getCouponing();//显示优惠券
  },

  /**
   * 显示页面
   */
  onShow: function () {
    this._showLocationNoPessimion();
  },

  /**
   * 分享页面
   */
  onShareAppMessage() {

  },

  /**
   * 跳转到广告投放效果 
   */
  onShowEffect: function (event) {
    let positionCode = event.currentTarget.dataset.code;
    let imgPath = config.BaseImgApi;
    switch (positionCode) {
      case 'start':
        imgPath += 'img/effect/effect_app_start.jpg';
        break;
      case 'bully':
        imgPath += 'img/effect/effect_banner.jpg';
        break;
      case 'activity':
        imgPath += 'img/effect/effect_activity_center.jpg'
        break;
      case 'receive':
        imgPath += 'img/effect/effect_receive_order.jpg'
        break;
      case 'personal':
        imgPath += 'img/effect/effect_personal_center.jpg'
        break;
      default:
        break;
    }
    if (imgPath) {
      wx.navigateTo({
        url: `/pages/show/show?path=${imgPath}`,
      })
    }
  },

  /**
   * 跳转到行业列表页面
   */
  onSelectCategory: function () {
    wx.navigateTo({
      url: '../more/more'
    })
  },

  /**
   * 跳转到地图页
   */
  onJumpToMap: function () {
    wx.navigateTo({
      url: `../map/map?lat=${this.data.location.location.lat}&lng=${this.data.location.location.lng}&currentcity=${this.data.location.ad_info.city}`,
    })
  },

  /**
   * Banner图片加载失败(显示默认图片)
   */
  onBannerError(event) {
    const index = event.currentTarget.dataset.index;
    this.data.banners[index].imageUrl = this.data.defaultBanner;
    this.setData({
      banners: this.data.banners,
    });
  },

  /**
   * 点击顶部搜索按钮
   */
  onSearch(event) {
    let title = event.detail.title;
    if (title) {
      wx.navigateTo({
        url: `../map/map?searching=true&keyword=${title}`,
      });
    } else {
      wx.navigateTo({
        url: `../map/map?searching=true`,
      });
    }
  },

  /**
   * 关闭优惠霸屏
   */
  onCloseCoupon() {
    app.globalData.couponing = false;
    this.setData({
      bullying: false,
      bullyInfo: false,
    });
  },

  /**
   * 领取优惠券
   */
  onConfirCoupon() {
    app.globalData.couponing = false;
    this.setData({
      bullying: false,
      bullyInfo: true,
    });
    setTimeout(res => {
      console.log('已领取优惠券');
      this.onCloseCoupon();
    }, 3000)
  },

  /**
   * 获取当前定位
   */
  _getCurrentLocation: function () {
    locationModel.getCurrentLocation()
      .then(res => {
        if(res && res.result){
          this.setData({
            location: res.result
          });
          app.globalData.selectLocation = res.result;
        }
      }, error => {
        // wx.navigateTo({
        //   url: '/pages/city/city',
        // }) 
      });
  },

  /**
   * 未授权时，显示选中城市
   */
  _showLocationNoPessimion: function(){
    if (!this.data.location) {
      this.setData({
        location: app.globalData.selectLocation,
      });
    }
  },

  /**
   * 获取轮播图
   */
  _getBanners() {
    homeModel.getBanners().then(
      res => {
        let banners = res.data;
        if (banners) {
          this.setData({
            banners: banners
          });
        }
      },
      error => {
        
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
        this.setData({
          user_num: data,
        });
      },
      error => {

      }
    );
  },

  /**
   * 是否需要显示霸屏
   */
  _getCouponing() {
    this.setData({
      bullying: app.globalData.couponing,
    });
  },

})
