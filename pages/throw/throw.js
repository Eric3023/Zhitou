const locationModel = require('../../models/location.js');
const fileModel = require('../../models/file.js');
let ThrowModel = require('../../models/throw.js');
var dateUtil = require('../../utils/date.js');
let AccountModel = require('../../models/account.js')

const defaultModel = 1;
const app = getApp();
const accountModel = new AccountModel();
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

    state: 0,//流程当前状态 0：选择广告位;1：选择模板/文件；2.选择素材完成，等待上传；3.素材上传完成 4：结算中/结算确认；5；结算完成

    //地点相关参数
    location_state: 0,//投放地点：0：特定地点投放;2：全省投放
    location: {},//投放地点
    audience: 0,//周边用户数

    //后台返回的广告位id
    position: 0,
    //广告位索引
    codeIndex: -1,

    //模板相关参数
    model: defaultModel,//0.使用模板；1.直接上传
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
    monitorUrl: '',

    throwCount: 0,//投放数量，cpm
    charging: 0,//按天计费，按照CPM计费
    days: 1,//天数

    totalAmount: 0,
    balance: 0,
    remain: 0,
    unitPrice: 0,
    unit: '元/CPM',//单价单位

    mapFlag: false,//是否是从地图页面返回
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this._setState(0);
    this._resetData(true);

    this._getLocation();
    this._getAdPlaces();
    this._getCarTypes();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.mapFlag) {
      this._setState(0);
      this._resetData(true);
      this._getLocation();
      this._getAdPlaces();
      this._getCarTypes();
    }
    this._getBalance();
    this.data.mapFlag = false;
  },

  /**
   * 切换至全城投放
   */
  onChangeToCity() {
    if (this.data.location_state == 0) {
      this.setData({
        location_state: 2
      });
    } else {
      this.setData({
        location_state: 0
      });
    }
  },

  /**
   * 跳转到地图选择城市
   */
  onJumpToMap() {
    wx.navigateTo({
      url: `../map/map?lat=${app.globalData.selectLocation.location.lat}&lng=${app.globalData.selectLocation.location.lng}`,
    })
    this.data.mapFlag = true;
  },

  /**
   * 点击了上传素材
   */
  onClickUpdate(event) {
    let position = event.currentTarget.dataset.position;
    let codeIndex = event.currentTarget.dataset.index;

    let code = this.data.codes[codeIndex];
    if (!code || code.status != 0) {
      wx.showToast({
        title: '该广告位暂时无法投放',
        icon: 'none',
      })
      return;
    }

    this._resetData(false);//重新选择广告位，之前广告位信息清空
    this.setData({
      state: 1,
      position: position,
      codeIndex: codeIndex,
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
    this._onCalTotal();
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
    this._onCalTotal();
  },

  /**
   * 选择照片
   */
  onSelectModelPhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
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
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
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
    //取消上传素材，只清空广告位相关信息
    this._setState(0);
    this._resetData(false);
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
      state: 2, //等待图片上传完成
    });

    //上传图片
    if (this.data.model == 0) {
      this.setData({
        state: 3,//图片上传完成
      });
    } else {
      this._updateImgFie({
        path: imgPath,
      });
    }
  },

  /**
   * 点击开始结算
   */
  onSettle() {
    if (this.data.state != 3) {
      wx.showToast({
        title: '请选择需要投放的广告位',
        icon: 'none',
      })
      return;
    }//只有选择完广告位，且图片上传完成后，才可结算
    if (this.data.totalAmount <= 0) return;
    this.setData({
      state: 4,//确认结算弹框？
    });
  },

  /**
   * 取消结算 
   */
  onCancleCheck() {
    //取消结算，保留参数信息，不做清空操作
    this._setState(3);
  },

  /**
   * 确认投放 
   */
  onConfirmCheck() {
    if (this.data.remain < 0) {
      wx.showToast({
        title: '余额不足',
        icon: 'none',
      })
      return;
    }
    //投放
    let start = this.data.start;
    let end = this.data.end;
    let startTime = dateUtil.tsFormatTime(dateUtil.formatTimeStamp(start), 'yyyy-MM-dd 00:00:00');
    let endTime = dateUtil.tsFormatTime(dateUtil.formatTimeStamp(end), 'yyyy-MM-dd 23:59:59');
    let data = {
      lat: this.data.location.location.lat,
      lng: this.data.location.location.lng,
      regionId: this.data.location.ad_info.adcode,
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
      totalAmount: this.data.totalAmount,
      unitPrice: this.data.unitPrice,
      coupon: 0,
      couponId: 0,
      isMonitor: this.data.isMonitor,
      cpm: this.data.throwCount,
      monitor: this.data.monitorUrl,
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
      if (res && res.errno == 0) {
        this.setData({
          state: 5,//结算完成
        });
        this.setData({
          state: 0,//重置页面
        });
        this._resetData(true);

        wx.navigateTo({
          url: '../../pages/complete/complete',
        });
      } else {
        wx.showToast({
          title: '投放失败，请尝试重新投放',
          icon: 'none',
        });
        this.setData({
          state: 0,//投放失败
        });
      }
    }, error => {
      console.log(error);
      wx.showToast({
        title: '投放失败，请尝试重新投放',
        icon: 'none',
      });
      this.setData({
        state: 0,//投放失败
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
   * 投放数量输入完成
   */
  onConfirmThrowCount(event) {
    let value = event.detail.value;
    this.data.throwCount = parseInt(value);
    this._onCalTotal();
  },

  /**
   * 监测链接输入完成
   */
  onConfirmMonitorUrl(event) {
    let value = event.detail.value;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      this.setData({
        monitorUrl: value,
      })
    }
  },

  /**
   * 计算总价
   */
  _onCalTotal() {
    if (this.data.codeIndex < 0) return;
    let code = this.data.codes[this.data.codeIndex];
    let start = this.data.start;
    let end = this.data.end;
    let days = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) + 1;
    console.log(days);
    if (days <= 0) {
      wx.showToast({
        title: '结束日期应大于开始日期',
        icon: 'none',
      })
      return;
    }

    //按照cpm结算
    if (code.charging == 0) {
      if (this.data.throwCount > 0) {
        this.data.unitPrice = 60;
        this.setData({
          charging: 0,

          unitPrice: 60,
          unit: '元/CPM',//单价单位
          totalAmount: this.data.throwCount * this.data.unitPrice
        });
      } else {
        this.setData({
          charging: 0,

          unitPrice: 60,
          unit: '元/CPM',//单价单位
          totalAmount: 0,
        });
      }
    } else if (code.charging == 1) {
      if (days > 0) {
        this.data.unitPrice = 20000;
        this.setData({
          charging: 1,
          days: days,

          unitPrice: 20000,
          unit: '元/天',//单价单位
          totalAmount: days * this.data.unitPrice
        });
      } else {
        this.setData({
          charging: 1,
          days: 0,

          unitPrice: 20000,
          unit: '元/天',//单价单位
          totalAmount: 0
        });
      }
    }

    this.setData({
      remain: (this.data.balance - this.data.totalAmount).toFixed(2),
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
    //当前已定位过，直接从全局中取
    if (app.globalData.selectLocation) {
      let location = app.globalData.selectLocation;
      this._setLocationView(location);
    }
    //当前未定位过，重新定位，防止进入程序后，index尚未定位完成，直接进入投放页面
    else {
      locationModel.getCurrentLocation().then(
        res => {
          if (res && res.result) {
            app.globalData.selectLocation = res.result;
            let location = res.result;
            this._setLocationView(location);
          }
        }, error => {

        }
      );
    }
  },

  /**
   * 设置视图显示的位置
   */
  _setLocationView(location) {
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
        }, error => {

        }
      );
  },

  /**
   * 设置当前投放状态
   */
  _setState(state) {
    this.setData({
      state: state
    })
  },

  /**
   * 数据重置
   */
  _resetData(isAll) {
    //仅将广告位相关重置
    this.setData({
      codeIndex: -1,
      position: 0,
      model: defaultModel,
      model_param: {
        modelId: 0,//选中的模板id
        img: '',//上传的模板照片
        content: '',//输入的显示内容
        phone: '',//输入的电话
      },
      div_param: {
        img: '',//上传的照片
      },
      progress: '',//图片上传进度
      imgurl: '',

      charging: 0,
      days: 1,

      totalAmount: 0,
    });
    //全部内容重置：包括城市、周期、投放数量等
    if (isAll) {
      this.setData({
        location_state: 0,
        isMonitor: 0, //是否使用记刻数据0:不使用；1:使用；
        monitorUrl: '',
        mottoIndex: 0,//选中车型索引
        start: now,//投放开始日期
        end: now,//投放结束日期
        throwCount: 0,//投放数量，cpm
        unitPrice: 0,//单价
        unit: '元/CPM',//单价单位
      });
    }
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
    }, error => {
      console.log('获取投放车型列表');
      console.log(error);
    });
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
  _updateImgFie({ path }) {
    fileModel.uploadImage({
      path: path,
      progress: res => {
        console.log('上传进度', res.progress);
        console.log('已经上传的数据长度', res.totalBytesSent);
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
        this.setData({
          progress: res.progress,
        });
      },
    }).then(
      res => {
        console.log('上传成功');
        console.log(res);
        if (res && res.errno == 0) {
          let data = res.data;
          this.data.imgurl = data.url;
          this.setData({
            state: 3,//图片上传完成
          });
          console.log(this.data.imgurl);
          this._onCalTotal();
        } else {
          console.log('上传失败');
          console.log(response);
          wx.showToast({
            title: '图片上传失败',
            icon: 'none',
          });
          this._setState(0);//重新选择广告位
          this._resetData(false);
        }
      },
      error => {
        console.log("-------------------");
        console.log('上传失败');
        console.log(error);
        wx.showToast({
          title: '图片上传失败',
          icon: 'none',
        });
        this._setState(0);//重新选择广告位
        this._resetData(false);
      },
    )
  },

  /**
   * 获取余额
   */
  _getBalance() {
    accountModel.getBalance()
      .then(
        res => {
          console.log('成功获取余额');
          console.log(res);
          let balance = res.data.totalAmount;
          this.setData({
            balance: balance.toFixed(2),
            remain: (this.data.balance - this.data.totalAmount).toFixed(2),
          });
        }, error => {

        });
  }
})