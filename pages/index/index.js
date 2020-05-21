var qqmaputil = require('../../utils/qqmaputil.js');
import { HomeModel } from '../../models/home.js';
import { LocationModel } from '../../models/location.js';
import { coupons } from '../../local/coupon.js';
import { BaseImgApi } from '../../config/api.js';

//获取应用实例
const app = getApp()
const homeModel = new HomeModel();
const locationModel = new LocationModel();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    address: '',
    host: "http://manage.aitopone.com/pic/",
    regionCallbackTxt: '',
    policy: 1,
    animation: true,
    isShowSubpois: true,
    currentcity: '北京市',

    // 广告位编码
    type_positon_0: 0,
    type_positon_1: 1,
    type_positon_2: 2,
    type_positon_3: 3,
    type_positon_4: 4,
    // Banner默认轮播图
    banners: [
      { imageUrl: '/img/banner/banner1.jpg' },
      { imageUrl: '/img/banner/banner2.jpg' },
    ],
    defaultBanner: '/img/banner/banner1.jpg',

    user_num: 0,

    //优惠券列表
    coupons: coupons,
    //是否显示霸屏
    bullying: false,
  },

  /**
   * 查看广告投放效果 
   */
  onShowEffect: function (event) {
    let positionCode = event.currentTarget.dataset.code;
    let imgPath = BaseImgApi;
    switch (positionCode) {
      case this.data.type_positon_0:
        imgPath += 'img/effect/effect_app_start.jpg';
        break;
      case this.data.type_positon_1:
        imgPath += 'img/effect/effect_banner.jpg';
        break;
      case this.data.type_positon_2:
        imgPath += 'img/effect/effect_activity_center.jpg'
        break;
      case this.data.type_positon_3:
        imgPath += 'img/effect/effect_receive_order.jpg'
        break;
      case this.data.type_positon_4:
        imgPath += 'img/effect/effect_personal_center.jpg'
        break;
      case this.data.type_positon_5:
        break;
    }
    if (imgPath) {
      wx.navigateTo({
        url: `/pages/show/show?path=${imgPath}`,
      })
    }
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../more/more'
    })
  },

  mapPageTap: function () {
    wx.navigateTo({
      url: `../map/map?location=${this.data.regionCallbackTxt}&getPoi=${this.data.isShowSubpois ? 1 : 0}&policy=${this.data.policy}&lat=${app.globalData.lat}&lng=${app.globalData.lng}&currentcity=${this.data.currentcity}`,
    })
    // wx.navigateTo({
    //   url: '../map/map'
    // })
  },
  onLoad: function () {
    var that = this;
    this._getBanners();//请求轮播图
    this._getCouponing();

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
              //注：坐标系采用gcj02坐标系

              qqmaputil.reverseGeocoder(app, that, (location, lat, lng) => {
                app.globalData.t_location = location;
                console.log('开始获取周边用户');
                that._getAroundUser(lng, lat, 10);
              });
              console.log(res)
            },
            fail(res) {//拒绝授权
              address = "北京市";
              currentcity = "北京市";
              app.globalData.lat = 39.909604;
              app.globalData.lng = 116.397228;
              regionCallbackTxt = 39.909604 + "," + 116.397228;
            }
          })
        } else {//授权过位置信息

          qqmaputil.reverseGeocoder(app, that, (location, lat, lng) => {
            app.globalData.t_location = location;
            console.log('开始获取周边用户');
            that._getAroundUser(lng, lat, 10);
          });
        }
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 获取轮播图
   */
  _getBanners() {
    homeModel.getBanners().then(
      res => {
        let banners = res.data.data;
        if (banners) {
          this.setData({
            banners: banners
          });
        }
      }
    );
  },

  /**
   * 获取周边用户数量
   */
  _getAroundUser(lng, lat, distance) {
    locationModel.getAroundUser(lng, lat, distance).then(
      res => {
        const data = res.data.data;
        this.setData({
          user_num: data,
        });
      }
    );
  },

  /**
   * Banner图片加载失败
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
   * 是否需要显示霸屏
   */
  _getCouponing() {
    this.setData({
      bullying: app.globalData.couponing,
    });
  },

  /**
   * 关闭优惠霸屏
   */
  onCloseCoupon() {
    app.globalData.couponing = false;
    this.setData({
      bullying: false,
    });
  },

  /**
   * 领取优惠券
   */
  onConfirCoupon() {
    app.globalData.couponing = false;
    this.setData({
      bullying: false,
    });
  },
})
