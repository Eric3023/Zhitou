const authorModel = require('../../models/author.js');
const fileModel = require('../../models/file.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth: 0,//0：未认证；1:认证中；2：已认证

    types: [
      '营业执照',
    ],
    region: [
      '北京市', '北京市', '朝阳区'
    ],

    //参数信息
    index: 0,
    regionId: '北京市北京市朝阳区',
    license: '',//营业执照
    licenseUrl: '',
    licenseProgess: 0, //0：不显示；1:正在上传；2：上传成功；3：上传失败
    idcard_a: '',//身份证正面
    idcard_a_url: '',
    idcard_a_progress: 0,
    idcard_b: '',//身份证反面
    idcard_b_url: '',
    idcard_b_progress: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    this.setData({
      isAuth: options.isAuth,
    })
  },

  /**
   * 证件类型改变
   */
  onTypeChanged(evnet) {
    let index = evnet.detail.value;
    this.setData({
      index,
    });
  },

  /**
   * 注册地改变
   */
  bindRegionChange(event) {

    let region = event.detail.value;
    let regionId = '';
    for (var i = 0; i < region.length; i++) {
      regionId += region[i];
    }

    this.setData({
      region: region,
      regionId: regionId,
    });
  },

  /**
   * 上传营业执照
   */
  onSelectLicense() {
    this._chooseImage().then(
      res => {
        if (res && res.tempFilePaths) {
          let path = res.tempFilePaths[0];
          this.setData({
            license: path,
            licenseProgess: 1,
          });
          return this._updateImage(path);
        }
      }
    ).then(res => {
      let data = res;
      this.setData({
        licenseUrl: data.data.url,
        licenseProgess: 2,
      });
      console.log(this.data.licenseUrl);
    }, error => {
      console.log(error);
      this.setData({
        licenseProgess: 3,
      });
    });
  },

  /**
   * 上传身份证正面
   */
  onSelectIDCardA() {
    this._chooseImage().then(
      res => {
        if (res && res.tempFilePaths) {
          let path = res.tempFilePaths[0];
          this.setData({
            idcard_a: path,
            idcard_a_progress: 1,
          });
          return this._updateImage(path);
        }
      }
    ).then(res => {
      let data = res;
      this.setData({
        idcard_a_url: data.data.url,
        idcard_a_progress: 2,
      });
      console.log(this.data.idcard_a_url);
    }, error => {
      this.setData({
        idcard_a_progress: 3,
      });
    });
  },

  /**
   * 上传身份证反面
   */
  onSelectIDCardB() {
    this._chooseImage().then(
      res => {
        if (res && res.tempFilePaths) {
          let path = res.tempFilePaths[0];
          this.setData({
            idcard_b: path,
            idcard_b_progress: 1,
          });
          return this._updateImage(path);
        }
      }
    ).then(res => {
      let data = res;
      this.setData({
        idcard_b_url: data.data.url,
        idcard_b_progress: 2,
      });
      console.log(this.data.idcard_b_url);
    }, error => {
      this.setData({
        idcard_b_progress: 3,
      });
    });
  },

  /**
   * 提交信息
   */
  onSubmit(event) {
    console.log(this.data.index);
    console.log(this.data.regionId);
    console.log(this.data.licenseUrl);
    console.log(this.data.idcard_a_url);
    console.log(this.data.idcard_b_url);

    authorModel.author(this.data.index, this.data.regionId, this.data.licenseUrl, this.data.idcard_a_url, this.data.idcard_b_url).then(
      res => {
        wx.showToast({
          title: '信息已提交，请等待认证',
        });
      }
    ).catch(error => {
      wx.showToast({
        title: '提交失败，请尝试重新提交',
      });
    });
  },


  /**
   * 选择照片
   */
  _chooseImage: function () {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        complete: (res) => {
          resolve(res);
        },
      });
    });
  },

  /**
   * 上传照片
   */
  _updateImage(path) {
    return fileModel.uploadImage({
      path: path,
      progress: res => {
        console.log('上传进度', res.progress);
      }
    });
  }

})