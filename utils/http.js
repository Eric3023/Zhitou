class HTTP {
  /**
   * 网络请求
   */
  request(param) {
    wx.request({
      url: param.url,
      method: param.method,
      data: param.data,
      header: {
        "content-type": "application/json",
      },
      success: (res) => {
        console.log(res.data)
        let code = res.statusCode;
        //请求成功
        if (code.toString().startsWith('2')) {
          param.success&&param.success(res.data)
        }
        //请求失败 
        else {
          this._show_error("数据请求出错");
        }
      },
      fail: (err) => {
        console.log(err)
        this._show_error("数据请求出错");
      }
    });
  }

  _show_error(error) {
    wx.showToast({
      title: error,
      icon: 'none',
      duration: 3000
    });
  }

}

export { HTTP }