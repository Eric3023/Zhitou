import { LocationModel } from '../../models/location.js';
let ThrowModel = require('../../models/throw.js');

const app = getApp();
const locationModel = new LocationModel();
const date = new Date();
let now = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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
      modelIndex: 0,//选中的模板索引
      img: '',//上传的模板照片
      content: '',//输入的显示内容
      phone: '',//输入的电话
      mottoIndex: 0,//选中车型索引
      start: now,//投放开始日期
      end: now,//投放结束日期
    },
    div_param: {
      img: '',//上传的照片
      mottoIndex: 0,//选中车型索引
      start: now,//投放开始日期
      end: now,//投放结束日期
    },
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

  onShow: function () {
    console.log('onShow');
  },

  /**
   * 切换至全城投放
   */
  onChangeToCity() {
    this.setData({
      location_state: 1
    });
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
    this.data.model = model;
    console.log(model);
  },

  /**
   * 选中模板 
   */
  onModelDetailChange(event) {
    let modelIndex = event.detail.value;
    this.data.model_param.modelIndex = modelIndex;
    console.log(this.data.model_param.modelIndex);
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
   * 模板选中车型
   */
  bindModelPickerChange(event) {
    this.data.model_param.mottoIndex = event.detail.value;
    this.setData({
      model_param: this.data.model_param,
    });
    console.log(this.data.mottos[this.data.model_param.mottoIndex]);
  },

  /**
   * 直接上传选中车型
   */
  bindDivPickerChange(event) {
    this.data.div_param.mottoIndex = event.detail.value;
    this.setData({
      div_param: this.data.div_param,
    });
    console.log(this.data.mottos[this.data.div_param.mottoIndex]);
  },

  /**
   * 投放开始时间
   */
  onModelStartTimeChange(event) {
    let start = event.detail.value;
    this.data.model_param.start = start;
    this.setData({
      model_param: this.data.model_param,
    });
    console.log(this.data.model_param.start);
  },

  /**
   * 投放结束时间
   */
  onModelEndTimeChange(event) {
    let end = event.detail.value;
    this.data.model_param.end = end;
    this.setData({
      model_param: this.data.model_param,
    });
    console.log(this.data.model_param.end);
  },

  /**
   * 直接上传投放开始时间
   */
  onDivStartTimeChange(event) {
    let start = event.detail.value;
    this.data.div_param.start = start;
    this.setData({
      div_param: this.data.div_param,
    });
    console.log(this.data.div_param.start);
  },

  /**
   * 直接上传投放结束时间
   */
  onDivEndTimeChange(event) {
    let end = event.detail.value;
    this.data.div_param.end = end;
    this.setData({
      div_param: this.data.div_param,
    });
    console.log(this.data.div_param.end);
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
    if (this.data.model == 0) {
      console.log(this.data.model_param);
      if (!this.data.model_param.img) {
        wx.showToast({
          title: '请上传图片',
          icon: 'none',
        });
        return;
      }
    } else {
      console.log(this.data.div_param);
      if (!this.data.div_param.img) {
        wx.showToast({
          title: '请上传图片',
          icon: 'none',
        });
        return;
      }
    }

    this.setData({
      state: 2,
    });

    //模拟上传素材
    setTimeout(() => {
      this.setData({
        state: 3,
      });
    }, 3000);
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
   * 确认结算 
   */
  onConfirmCheck() {
    //开始结算，结算完成后，投放

    this.setData({
      state: 5,
    });
    wx.navigateTo({
      url: '../../pages/complete/complete',
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
          const data = res.data.data;
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
        modelIndex: 0,//选中的模板索引
        img: '',//上传的模板照片
        content: '',//输入的显示内容
        phone: '',//输入的电话
        mottoIndex: 0,//选中车型索引
        start: now,//投放开始日期
        end: now,//投放结束日期
      },
      div_param: {
        img: '',//上传的照片
        mottoIndex: 0,//选中车型索引
        start: now,//投放开始日期
        end: now,//投放结束日期
      },
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
        codes: res.data.data,
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
        mottos: res.data.data,
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
        models: res.data.data,
      });
    }, error => {
      console.log('获取模板列表失败');
      console.log(error);
    })
  },
})