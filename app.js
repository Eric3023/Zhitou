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

    couponing: false,
  }
})