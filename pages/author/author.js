const authorModel = require('../../models/author.js');
const fileModel = require('../../models/file.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      '营业执照',
    ],
    region: [
      '北京市', '北京市', '朝阳区'
    ],

    //参数信息
    index: 0,
    regionId: 110105,
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
    this.data.regionId = event.detail.code[2];
    console.log(this.data.regionId);

    this.setData({
      region: event.detail.value
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
      let response = JSON.parse(res);
      let data = response.data;
      this.setData({
        licenseUrl: data,
        licenseProgess: 2,
      });
      console.log(this.data.licenseUrl);
    }, error => {
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
      let response = JSON.parse(res);
      let data = response.data;
      this.setData({
        idcard_a_url: data,
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
      let response = JSON.parse(res);
      let data = response.data;
      this.setData({
        idcard_b_url: data,
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
    authorModel.author(this.data.index, this.data.regionId, this.data.licenseUrl, this.data.idcard_a_url, this.data.idcard_b_url);
  },


  /**
   * 选择照片
   */
  _chooseImage: function () {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        sourceType: 'album',
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
    return new Promise((resolve, reject) => {
      fileModel.uploadImage({
        path: path,
        progress: res => {
          console.log('上传进度', res.progress);
        },
        success: res => {
          console.log('上传成功');
          console.log(res);
          resolve(res);
        },
        fail: error => {
          console.log('上传失败');
          console.log(error);
          reject(error);
        },
      });
    })
  }

})