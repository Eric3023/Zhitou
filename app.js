import wxValidate from './utils/WxValidate.js'

App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  onLaunch: function () {
    this._checkVersion();
  },

  /**
   * 版本升级
   */
  _checkVersion() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('检查版本更新', res)
        if (res.hasUpdate) {
          console.log('发现新版本')
          updateManager.onUpdateReady(function () {
            //新版本下载成功
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('重启应用', res)
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了',
              content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  globalData: {
    lat: 0,
    lng: 0,
    hasLogin: false,

    //是否显示优惠券
    couponing: false,
    //投放地点参数，switchTab无法传递参数，使用全局变量
    t_location: null,
    //当前选择地点（未授权）
    city: "",

    version: '1.0.1',
    time: '2020.06.05'
  }
})