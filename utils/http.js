class HTTP {
  /**
   * 网络请求
   */
  request({ url, data = null, method = 'GET' }) {
    return new Promise((resolve, reject) => {
      this._request(url, data, method, resolve, reject);
    });
  }

  _request(url, data, method, resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        "content-type": "application/json",
      },
      success: (res) => {
        console.log(res)
        let code = res.statusCode;
        //请求成功
        if (code.toString().startsWith('2')) {
          console.log(res.data);
          resolve(res);
        }
        //请求失败 
        else {
          this._handler_error("数据请求出错", reject);
        }
      },
      fail: (error) => {
        console.log(error)
        this._handler_error("数据请求出错", reject);
      }
    });
  }

  // 处理失败
  _handler_error(error, reject) {
    // wx.showToast({
    //   title: error,
    //   icon: 'none',
    //   duration: 3000
    // });
    reject();
  }

}

export { HTTP }