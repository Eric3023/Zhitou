let AccountModel = require('../../models/account.js');
let UserInfoHelper = require('../../utils/userInfo.js')
const userInfoHelper = new UserInfoHelper();
const accountModel = new AccountModel();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    authored: false,
    hasLogin: false,
    balance: '0',
    user_info: {
      uicon: "/img/mine/icon_header.png",
      uid: "",
      flag: false,
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
    wx.navigateTo({
      url: '/pages/recharge/recharge',
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
      case '充值记录':
        wx.navigateTo({
          url: '/pages/recharge_record/record',
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
        uicon: uicon,
        uid: uid
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

    this._getBalance();
    this._getUserInfo();
  },

  /**
   * 转发
   */
  onShareAppMessage: function () {

  },

  getWxUserInfo(event) {
    console.log(event);
    var that = this
    // 声明一个变量接收用户授权信息
    var userinfo = event.detail.event.userInfo;
    if (userinfo != undefined) {
      that.setData({
        user_info: {
          uicon: userinfo.avatarUrl,
          uid: userinfo.nickName,
          flag: true,
        }
      })

      //存储用户信息
      wx.setStorageSync('uicon', userinfo.avatarUrl);
      wx.setStorageSync('uid', userinfo.nickName);

    }
  },

  /**
   * 实名认证
   */
  onAuthor(event) {
    wx.navigateTo({
      url: '/pages/author/author',
    })
  },

  /**
   * 获取账户余额
   */
  _getBalance() {
    accountModel.getBalance().then(
      res => {
        let balance = res.data.totalAmount;
        balance = balance.toFixed(2);
        this.setData({
          balance: balance,
        });
      }
    );
  },

  /**
   * API获取用户信息
   */
  _getUserInfo() {
    userInfoHelper.getUserInfo({
      success: res => {
        this.setData({
        user_info: {
          uicon: res.userInfo.avatarUrl,
          uid: res.userInfo.nickName,
          flag: true,
        }
        });
      },
      fail: error => {
        this.setData({
          user_info: {
            uicon: "/img/mine/icon_header.png",
            uid: "",
            flag: false,
          }
        });
      },
    })
  },
})