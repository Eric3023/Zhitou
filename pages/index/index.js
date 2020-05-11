var qqmaputil = require('../../utils/qqmaputil.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    address: '',
    host: "http://manage.aitopone.com/pic/",
    carouselList: [{ url: 'o_1e6qm4a4b11uecafbhb13g25h07.png', img: 'o_1e6qm4a4b11uecafbhb13g25h07.png' }, { url: 'o_1e6qm4a4b11uecafbhb13g25h07.png', img: 'o_1e6qm4a4b11uecafbhb13g25h07.png' }],
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
    type_positon_5: 5
  },

  /**
   * 查看广告投放效果 
   */
  onShowEffect: function (event) {
    let positionCode = event.currentTarget.dataset.code;
    let imgPath = '';
    switch (positionCode) {
      case this.data.type_positon_0:
        imgPath = '/img/effect/effect_app_start.jpg';
        break;
      case this.data.type_positon_1:
        imgPath = '/img/effect/effect_banner.jpg';
        break;
      case this.data.type_positon_2:
        imgPath='/img/effect/effect_receive_order.jpg'
        break;
      case this.data.type_positon_3:
        imgPath='/img/effect/effect_activity_center.jpg'
        break;
      case this.data.type_positon_4:
        imgPath='/img/effect/effect_personal_center.jpg'
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
    this.requestCarouselListData();//请求轮播图

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
              //注：坐标系采用gcj02坐标系
             
              qqmaputil.reverseGeocoder(app, that);

              console.log(res)
            },
            fail(res) {//拒绝授权
              address="北京市";
              currentcity="北京市";
              app.globalData.lat =39.909604;
              app.globalData.lng =116.397228;
              regionCallbackTxt = 39.909604 + "," + 116.397228;
            }
          })
        } else {//授权过位置信息
          
          qqmaputil.reverseGeocoder(app,that);

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
  //请求轮播图
  requestCarouselListData() {
    var that = this;//注意this指向性问题
    // var urlStr = that.data.host + "/xjj/chome_carousel_list.json"; //请求连接注意替换（我用本地服务器模拟）
    // console.log("请求轮播图：" + urlStr);
    // wx.request({
    //   url: urlStr,
    //   data: {//这里放请求参数，如果传入参数值不是String，会被转换成String 
    //     // x: '',
    //     // y: ''
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log("轮播图返回值：");
    //     console.log(res.data.result);
    //     var resultArr = res.data.result;
    //     that.setData({
    //       carouselList: resultArr
    //     })
    //   }
    // })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
