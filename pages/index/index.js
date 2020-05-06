var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    address:'',
    host: "http://manage.aitopone.com/pic/",
    carouselList: [{ url: 'o_1e6qm4a4b11uecafbhb13g25h07.png', img: 'o_1e6qm4a4b11uecafbhb13g25h07.png' }, { url: 'o_1e6qm4a4b11uecafbhb13g25h07.png', img: 'o_1e6qm4a4b11uecafbhb13g25h07.png' }],
    regionCallbackTxt:'',
    policy: 1,
    animation: true,
    isShowSubpois: true,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../more/more'
    })
  },
  
  mapPageTap: function() {
    wx.navigateTo({
      url: `../map/map?location=${this.data.regionCallbackTxt}&getPoi=${this.data.isShowSubpois ? 1 : 0}&policy=${this.data.policy}`,
    })
    // wx.navigateTo({
    //   url: '../map/map'
    // })
  },
  onLoad: function () {
    var that = this;
    this.requestCarouselListData();//请求轮播图
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
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
                    address: //res.result.address_reference.crossroad.title
                    res.result.address_reference.town.title,
                    regionCallbackTxt: res.result.location.lat + ',' +     res.result.location.lng
                  });
                  app.globalData.lat = res.result.location.lat;
                  app.globalData.lng = res.result.location.lng;
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
                address: res.result.address_reference.town.title
              });
              app.globalData.lat = res.result.location.lat;
              app.globalData.lng = res.result.location.lng;
            }
          });
        }
      }
    })
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  setGlobalVar: function(e) {
    var that = this;
    console.log(res);
    that.setData({
      address: res.result.address_reference.town.title,
    });

    app.globalData.lat = res.result.location.lat;
    app.globalData.lng = res.result.location.lng;
  }
})
