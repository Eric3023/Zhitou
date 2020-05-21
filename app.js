import wxValidate from './utils/WxValidate.js'

App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  onLaunch: function () {
    var that = this
  },

  globalData: {
    lat: 0,
    lng: 0,
    hasLogin: false,

    //是否显示优惠券
    couponing: false,
    //投放地点参数，switchTab无法传递参数，使用全局变量
    t_location: {},
  }
})