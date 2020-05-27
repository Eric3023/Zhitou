import { LocationModel } from '../../models/location.js';
let ThrowModel = require('../../models/throw.js');
var dateUtil = require('../../utils/date.js');

const app = getApp();
const locationModel = new LocationModel();
const date = new Date();
let now = dateUtil.tsFormatTime(date, 'yyyy-MM-dd');
let throwModel = new ThrowModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //广告位
    codes: [],
    models: [],
    mottos: [],
    now: now,//当前日期

    state: 0,//流程当前状态 0：选择广告位;1：选择模板/文件；2.选择素材完成，等待上传；3.素材上传完成 3：结算中/结算确认；4；结算完成

    //地点相关参数
    location_state: 0,//投放地点：0：特定地点投放;1：全城投放
    location: {},//投放地点
    audience: 0,//周边用户数

    //广告位
    position: 0,

    //模板相关参数
    model: 0,//0.使用模板；1.直接上传
    model_param: {
      modelId: 0,//选中的模板Id
      img: '',//上传的模板照片
      content: '',//输入的显示内容
      phone: '',//输入的电话
    },
    div_param: {
      img: '',//上传的照片
    },
    mottoIndex: 0,//选中车型索引
    start: now,//投放开始日期
    end: now,//投放结束日期
    imgurl: '',
    progress: '',//图片上传进度

    isMonitor: 0, //是否使用记刻数据0:不使用；1:使用；
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._resetData(0);
    this._getLocation();
    this._getAdPlaces();
    this._getCarTypes();
  },

  /**
   * 切换至全城投放
   */
  onChangeToCity() {
    if (this.data.location_state == 0) {
      this.setData({
        location_state: 1
      });
    } else {
      this.setData({
        location_state: 0
      });
    }
  },

  /**
   * 点击了上传素材
   */
  onClickUpdate(event) {
    let position = event.currentTarget.dataset.position;
    this._resetData(0);
    this.setData({
      state: 1,
      position: position,
    });
    this._getTemplates(position);
  },

  /**
   * 预览
   */
  onPreview(event) {
    let position = event.currentTarget.dataset.position;
    if (position == this.data.position) {
      console.log(position);
    }
  },

  /**
   * 模板/直接上传
   */
  onModelChange(event) {
    let model = event.detail.value;
    this.setData({
      model: model
    });
    console.log(model);
  },

  /**
   * 选中模板 
   */
  onModelDetailChange(event) {
    let modelId = event.detail.value;
    this.data.model_param.modelId = modelId;
    console.log(this.data.model_param.modelId);
  },

  /**
   * 模板内容输入完成 
   */
  onConfirmModelContent(event) {
    let content = event.detail.value;
    this.data.model_param.content = content;
    console.log(this.data.model_param.content);
  },

  /**
   * 模板电话输入完成 
   */
  onConfirmModelPhone(event) {
    let phone = event.detail.value;
    this.data.model_param.phone = phone;
    console.log(this.data.model_param.phone);
  },

  /**
   * 选中车型
   */
  bindMottoPickerChange(event) {
    this.setData({
      mottoIndex: event.detail.value,
    });
    console.log(this.data.mottos[this.data.mottoIndex]);
  },

  /**
   * 投放开始时间
   */
  onStartTimeChange(event) {
    let start = event.detail.value;
    this.setData({
      start: start,
    });
    console.log(this.data.start);
  },

  /**
   * 投放结束时间
   */
  onEndTimeChange(event) {
    let end = event.detail.value;
    this.setData({
      end: end,
    });
    console.log(this.data.end);
  },

  /**
   * 选择照片
   */
  onSelectModelPhoto() {
    wx.chooseImage({
      count: 1,
      sourceType: 'album',
      complete: (res) => {
        if (res && res.tempFilePaths) {
          this.data.model_param.img = res.tempFilePaths[0];
          this.setData({
            model_param: this.data.model_param,
          });
        }
      },
    })
  },

  /**
   * 选择照片
   */
  onSelectDivPhoto() {
    wx.chooseImage({
      count: 1,
      sourceType: 'album',
      complete: (res) => {
        if (res && res.tempFilePaths) {
          this.data.div_param.img = res.tempFilePaths[0];
          this.setData({
            div_param: this.data.div_param,
          });
        }
      },
    })
  },

  /**
   * 取消了上传素材
   */
  onCancelMaterial() {
    this._resetData(0);
  },

  /**
   * 上传素材
   */
  onCommitMaterial() {
    let imgPath = '';
    //图片未选择
    if (this.data.model == 0) {
      console.log(this.data.model_param);
      // if (!this.data.model_param.img) {
      //   wx.showToast({
      //     title: '您已选择模板类型，请上传图片',
      //     icon: 'none',
      //   });
      //   return;
      // }
      imgPath = this.data.model_param.img;
    } else {
      console.log(this.data.div_param);
      if (!this.data.div_param.img) {
        wx.showToast({
          title: '请上传图片',
          icon: 'none',
        });
        return;
      }
      imgPath = this.data.div_param.img;
    }

    this.setData({
      state: 2,
    });

    //上传图片
    if (this.data.model == 0) {
      this.setData({
        state: 3,
      });
    } else {
      this._updateImgFie({
        path: imgPath,
        progress: res => {
          console.log('上传进度', res.progress);
          console.log('已经上传的数据长度', res.totalBytesSent);
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
          this.setData({
            progress: res.progress,
          });
        },
        success: res => {
          console.log('上传成功');
          console.log(res);
          let response = JSON.parse(res);
          let data = response.data;
          this.data.imgurl = data.url;
          this.setData({
            state: 3,
          });
          console.log(this.data.imgurl);
        },
        fail: error => {
          console.log('上传失败');
          console.log(error);
          this._resetData();
        },
      });
    }
  },

  /**
   * 点击开始结算
   */
  onSettle() {
    this.setData({
      state: 4,
    });
  },

  /**
   * 取消结算 
   */
  onCancleCheck() {
    this._resetData(0);
  },

  /**
   * 确认投放 
   */
  onConfirmCheck() {
    //投放
    let start = this.data.start;
    let end = this.data.end;
    let startTime = dateUtil.tsFormatTime(dateUtil.formatTimeStamp(start), 'yyyy-MM-dd 00:00:00');
    let endTime = dateUtil.tsFormatTime(dateUtil.formatTimeStamp(end), 'yyyy-MM-dd 23:59:59');
    let data = {
      lat: this.data.location.location.lat,
      lng: this.data.location.location.lng,
      address: this.data.location.title ? this.data.location.title : this.data.location.formatted_addresses.recommend,
      province: this.data.location.ad_info.provice,
      city: this.data.location.ad_info.city,
      audience: this.data.audience,
      distance: 10,
      throwType: this.data.location_state,
      position: this.data.position,
      isTemplate: this.data.model,
      motto: this.data.mottos[this.data.mottoIndex].code,
      startTime: startTime,
      endTime: endTime,
      totalAmount: 9000,
      unitPrice: 1500,
      coupon: 0,
      couponId: 0,
      isMonitor: this.data.isMonitor,
    };
    //使用模板
    if (this.data.model == 0) {
      data.templateId = this.data.models[this.data.model_param.modelId].id;
      data.phone = this.data.model_param.phone;
      data.content = this.data.model_param.content;
      data.modelImagUrl = this.data.models[this.data.model_param.modelId].styleImageUrl;
    }
    //直接上传
    else {
      data.imgUrl = this.data.imgurl;
    }
    throwModel.doAdvertising(data).then(res => {
      console.log(res);
      this.setData({
        state: 5,
      });
      wx.navigateTo({
        url: '../../pages/complete/complete',
      });
    }, error => {
      console.log(error);
      wx.showToast({
        title: '投放失败，请尝试重新投放',
        icon: 'none',
      });
      this.setData({
        state: 0,
      });
    });

  },

  /**
   * 广告位背景图加载失败
   */
  onBackgroundError(event) {
    const index = event.currentTarget.dataset.index;
    this.data.codes[index].imageUrl = '/img/throw/activity_center.png';
    this.setData({
      codes: this.data.codes,
    });
  },

  /**
   * 是否使用监测
   */
  onMonitorChange(event) {
    let value = event.detail.value;
    if (!value || value.length == 0) {
      this.data.isMonitor = 0;
    } else {
      this.data.isMonitor = 1;
    }
  },

  /**
   * 获取投放地点 
   */
  _getLocation() {
    let location = app.globalData.t_location;
    if (location) {
      console.log(location);
      this.setData({
        location: location,
      });

      if (location.location) {
        let lat = location.location.lat;
        let lng = location.location.lng;
        if (lat && lng)
          this._getAroundUser(lng, lat, 10);
      }
    }
  },

  /**
   * 获取周边用户数
   */
  _getAroundUser(lng, lat, distance) {
    locationModel.getAroundUser(lng, lat, distance)
      .then(
        res => {
          const data = res.data;
          this.setData({
            audience: data,
          });
        }
      );
  },

  /**
   * 数据重置
   */
  _resetData(state) {
    this.setData({
      state: state,
      position: 0,
      model: 0,
      model_param: {
        modelId: 0,//选中的模板id
        img: '',//上传的模板照片
        content: '',//输入的显示内容
        phone: '',//输入的电话
      },
      div_param: {
        img: '',//上传的照片
      },
      imgurl: '',
      mottoIndex: 0,//选中车型索引
      start: now,//投放开始日期
      end: now,//投放结束日期
    });
  },

  /**
   * 获取投放广告位
   */
  _getAdPlaces() {
    throwModel.getAdPlaces().then(res => {
      console.log('获取投放广告位成功');
      console.log(res);
      this.setData({
        codes: res.data,
      });
    }, error => {
      console.log('获取投放广告位失败');
      console.log(error);
    });
  },

  /**
   * 获取车型列表
   */
  _getCarTypes() {
    throwModel.getCarTypes().then(res => {
      console.log('获取投放车型列表');
      console.log(res);
      this.setData({
        mottos: res.data,
      });
    }), error => {
      console.log('获取投放车型列表');
      console.log(error);
    };
  },

  /**
   * 获取模板列表
   */
  _getTemplates(adPlace) {
    throwModel.getTemplates(adPlace).then(res => {
      console.log('获取模板列表成功');
      console.log(res.data);
      this.setData({
        models: res.data,
      });
    }, error => {
      console.log('获取模板列表失败');
      console.log(error);
    })
  },

  /**
   * 上传图片
   */
  _updateImgFie({ path, progress, success, fail }) {
    let uploadTask = throwModel.updateImgFie({
      path: path,
      sCallback: res => {
        success(res);
      },
      fCallback: error => {
        fail(error)
      }
    });
    uploadTask.onProgressUpdate((res) => {
      progress(res);
    })
  },
})