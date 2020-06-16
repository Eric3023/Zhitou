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
    idcard_a_progress: 0,//0：不显示；1:正在上传；2：上传成功；3：上传失败
    idcard_b: '',//身份证反面
    idcard_b_url: '',
    idcard_b_progress: 0,//0：不显示；1:正在上传；2：上传成功；3：上传失败
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    wx.showModal({
      title: "提示",
      content: "您在此提供的所有信息，仅用于企业认证，我们不会透漏您的任何信息，也不会另作他用，请您放心填写",
      cancelText: "取消",
      confirmText: "继续",
      success(res) {
        if (res.confirm) {

        } else if (res.cancel) {
          wx.reLaunch({
            url: '/pages/mine/mine',
          })
        }
      }
    })

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
            licenseProgess: 1,//正在上传
          });
          return this._updateImage(path);
        }
      }
    ).then(res => {
      if (res) {
        let data = res;
        this.setData({
          licenseUrl: data.data.url,
          licenseProgess: 2,//上传成功
        });
        console.log(this.data.licenseUrl);
      } else {
        this.setData({
          licenseProgess: 3,//上传失败
        });
      }
    }, error => {
      console.log(error);
      this.setData({
        licenseProgess: 3,//上传失败
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
            idcard_a_progress: 1,//开始上传
          });
          return this._updateImage(path);
        }
      }
    ).then(res => {
      if (res) {
        let data = res;
        this.setData({
          idcard_a_url: data.data.url,
          idcard_a_progress: 2,//上传成功
        });
        console.log(this.data.idcard_a_url);
      } else {
        this.setData({
          idcard_a_progress: 3,//上传失败
        });
      }
    }, error => {
      this.setData({
        idcard_a_progress: 3,//上传失败
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
            idcard_b_progress: 1,//开始上传
          });
          return this._updateImage(path);
        }
      }
    ).then(res => {
      if (res) {
        let data = res;
        this.setData({
          idcard_b_url: data.data.url,
          idcard_b_progress: 2,//上传成功
        });
        console.log(this.data.idcard_b_url);
      } else {
        this.setData({
          idcard_b_progress: 3,//上传失败
        });
      }
    }, error => {
      this.setData({
        idcard_b_progress: 3,//上传失败
      });
    });
  },

  /**
   * 预览图片
   */
  onPreviewImage(event) {
    console.log("================================");
    console.log(event);
    
    
    let url = event.currentTarget.dataset.url;
    if (url) {
      wx.previewImage({
        urls: [url],
      })
    }
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

    let authorPromise = authorModel.author(this.data.index, this.data.regionId, this.data.licenseUrl, this.data.idcard_a_url, this.data.idcard_b_url);
    if (authorPromise) {
      authorPromise.then(
        res => {
          console.log(res);
          wx.showToast({
            title: '信息已提交，请等待认证',
            icon: 'none',
          });
        }
      ).catch(error => {
        console.log(error);
        wx.showToast({
          title: '提交失败，请尝试重新提交',
          icon: 'none',
        });
      })
    }
  },


  /**
   * 选择照片
   */
  _chooseImage: function () {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        // sizeType: ['compressed'],
        sizeType: ['original'],
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
  },

})