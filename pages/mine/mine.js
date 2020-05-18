const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone : '',
    authored: false,
    hasLogin: false,
    balance: 5000,
    user_info: {
      uicon: "/img/mine/icon_header.png",
      uid: ""
    },
    user_datas: [
      { icon: "/img/icon_mine_collection.jpg", title: "我的订单" },
      { icon: "/img/icon_mine_rmb.jpg", title: "充值记录" },
      { icon: "/img/icon_mine_quan.jpg", title: "优惠券" },
      { icon: "/img/icon_mine_proxy.jpg", title: "我是代理" },
      { icon: "/img/icon_mine_setting.png", title: "设置" }
    ]
  },

  /**
   * 立即充值
   */
  recharge(event) {
    wx.showToast({
      title: '进入【充值】页面',
      icon: 'none'
    })
  },

  /**
   * 进入下级页面
   */
  onClickItem(event) {
    let index = event.detail.title;
    switch (index) {
      case '我的订单':
        wx.navigateTo({
          url: '/pages/order/order',
        })
        break;
      default:
        let title = '进入【' + event.detail.title + '】页面';
        wx.showToast({
          title: title,
          icon: 'none'
        })
        break
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let uicon = wx.getStorageSync("uicon");
    let uid = wx.getStorageSync("uid");
    if (!uicon) {
      that.setData({
        uicon : uicon,
        uid:uid
      })
    }
    let token = wx.getStorageSync("token");
    let phone = wx.getStorageSync("phone");
    //必须登录才能查看
    console.log(token);
    if (!token || token == '') {
      wx.showModal({
        title: "提示",
        content: "登录后体验更多功能",
        cancelText: "取消",
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        }
      })

    } else {
      this.setData({
        phone: phone,
        hasLogin: true
      });
    }
  },
  
  getWxUserInfo(event) {
    
    var that = this
    // 声明一个变量接收用户授权信息
    var userinfo = event.detail.event.userInfo;
    if (userinfo != undefined) {
      that.setData({
        user_info: {
          uicon: userinfo.avatarUrl,
          uid: userinfo.nickName
        }
      })

      //存储用户信息
      wx.setStorageSync('uicon', userinfo.avatarUrl);
      wx.setStorageSync('uid', userinfo.nickName);

    }
  }
})