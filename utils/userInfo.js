class UserInfoHelper {

  /**
  * 获取微信用户信息
  */
  getUserInfo({ success, fail }) {
    this._checkUserInfor()
      //用户已授权，才执行then
      .then(res => {
        return this._getUserInfo();
      })
      .then(res => {
        success(res);
      }, error => {
        fail(error);
      });
  }

  /**
   * 检查用户是否授权
   */
  _checkUserInfor() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        complete: (res) => {
          //是否授权获取用户信息
          let userInfo = res.authSetting['scope.userInfo'];
          console.log(`[checkUserInfor]用户是否授权：${userInfo}`);
          if (userInfo)
            resolve(userInfo);
          else
            reject('用户未授权');
        },
      })
    });
  }

  /**
   * API获取用户信息
   */
  _getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: (res) => {
          console.log(`[getUserInfo]用户信息获取成功`);
          console.log(res);
          resolve(res);
        },
        fail: (error) => {
          console.log(`[getUserInfo]用户信息获取失败`);
          console.log(error);
          reject('用户信息获取失败');
        }
      })
    });
  }
}

module.exports = UserInfoHelper;