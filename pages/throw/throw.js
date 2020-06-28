const locationModel = require('../../models/location.js');
const fileModel = require('../../models/file.js');
let ThrowModel = require('../../models/throw.js');
var dateUtil = require('../../utils/date.js');
let userModel = require('../../models/user.js');

const defaultModel = 0;
const app = getApp();
const date = new Date();
let now = dateUtil.tsFormatTime(date, 'yyyy-MM-dd');
let throwModel = new ThrowModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //广告位列表
    codes: [],
    //选中的广告位信息
    adcode: {
      code: null,//广告位信息,
      model: defaultModel,//0.使用模板；1.直接上传
      //模板参数
      model_param: {
        modelId: 0,//选中的模板Id
        content: '',//输入的显示内容
        phone: '',//输入的电话
      },
      //自定义参数
      div_param: {
        img: '',//750*1332，本地path地址
        img2: '',//750*1624,本地path地址
      },

    },
    imgurl: '',//标准图片，网络地址
    imgurl2: '',//其他规格图片，网络地址
    //临时参数
    tmpCode: null,
    tmpImgPath1: "",
    tmpImgPath2: "",

    models: [],
    now: now,//当前日期

    state: 0,//流程当前状态 0：选择广告位;1：选择模板/文件；2.选择素材完成，等待上传；3.素材上传完成 4：结算中/结算确认；5；结算完成

    //地点相关参数
    location_state: 0,//投放地点：0：特定地点投放;2：全省投放；3.全国投放
    location: {},//投放地点
    audience: 0,//周边用户数


    start: now,//投放开始日期
    end: now,//投放结束日期
    progress: '',//图片上传进度

    isMonitor: 0, //是否使用记刻数据0:不使用；1:使用；
    monitorUrl: [''],

    throwCount: 0,//投放数量，cpm
    charging: 0,//按天计费，按照CPM计费
    days: 1,//天数

    totalAmount: 0,
    balance: 0,
    remain: 0,
    unitPrice: 0,
    unit: '元/CPM',//单价单位

    mapFlag: false,//是否是从地图页面返回
    previewUrl: '',//预览的url

    noticing: false,//显示注意事项
    priceJson: [],//价格表
    jk_price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this._setState(0);
    this._resetData(true);

    this._getPriceJson();
    this._getLocation();
    this._getAdPlaces();
    this._getCarTypes();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //如果从地图也返回（修改了地点），重新设置数据
    if (this.data.mapFlag) {
      this._setState(0);
      this._resetData(true);
      this._getLocation();
      this._getAdPlaces();
      this._getCarTypes();
    }
    //更新余额，判断是否认证
    this._getBalance();
    this.data.mapFlag = false;
  },

  /**
   * 切换至全城投放
   */
  onChangeToCity(event) {
    let value = event.currentTarget.dataset.value;
    switch (value) {
      case 'area':
        this.setData({
          location_state: 0
        });
        break;
      case 'province':
        this.setData({
          location_state: 2
        });
        break;
      case 'country':
        this.setData({
          location_state: 3
        });
        break;
    }
    // if (this.data.location_state == 0) {
    //   this.setData({
    //     location_state: 2
    //   });
    // } else {
    //   this.setData({
    //     location_state: 0
    //   });
    // }
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
    if (this.data.adcode.code) {
      wx.showModal({
        title: "提示",
        content: "每个订单仅能选择一个广告位，确认提交后，会覆盖之前填写的信息",
        cancelText: "取消",
        confirmText: "确定",
        success: res => {
          if (res.cancel) {
            this.setData({
              state: 0,
            });
          }
        }
      });
    }

    let codeIndex = event.currentTarget.dataset.index;
    let code = this.data.codes[codeIndex];
    if (!code || code.status != 0) {
      wx.showToast({
        title: '该广告位暂时无法投放',
        icon: 'none',
      })
      return;
    }

    this.setData({
      state: 1,
      tmpCode: code,
    });
    this._getTemplates(code.optionCode);
  },

  /**
   * 预览
   */
  onPreview(event) {
    let code = event.currentTarget.dataset.item;
    if (code.optionCode == this.data.adcode.code.optionCode) {
      if (!this.data.previewUrl) {
        wx.showToast({
          title: '请上传素材后预览',
          icon: 'none',
        })
        return;
      }
      wx.navigateTo({
        url: `/pages/preview/preview?adcode=${this.data.adcode.code.optionCode}&url=${this.data.previewUrl}`,
      })
    }
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
   * 选择照片(750*1334)
   */
  onSelectDivPhoto() {
    wx.chooseImage({
      count: 1,
      // sizeType: ['compressed'],
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      complete: (res) => {
        if (res && res.tempFilePaths) {
          this.setData({
            tmpImgPath1: res.tempFilePaths[0],
          });
        }
      },
    })
  },

  /**
   * 选择照片(750*1624)
   */
  onSelectDivPhoto2() {
    wx.chooseImage({
      count: 1,
      // sizeType: ['compressed'],
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      complete: (res) => {
        if (res && res.tempFilePaths) {
          this.setData({
            tmpImgPath2: res.tempFilePaths[0],
          });
        }
      },
    })
  },


  /**
   * 取消了上传素材
   */
  onCancelMaterial() {
    this._setState(0);
  },

  /**
   * 上传素材
   */
  onCommitMaterial(event) {
    let value = event.detail.value;
    let model = parseInt(value.model);//模板or直接上传
    let modelId = value.modelId;//选中模板的Id
    let content = value.content;//模板显示内容
    let phone = value.phone;//模板联系方式
    let code = this.data.tmpCode;//广告位信息
    let divimg1 = this.data.tmpImgPath1;//直接上传图片本地地址
    let divimg2 = this.data.tmpImgPath2;//直接上传图片本地地址

    let imgPath = [];
    //图片未选择
    if (model == 0) {
      if (!content) {
        wx.showToast({
          title: '请输入显示内容',
          icon: 'none',
        });
        return;
      }
    } else {
      //开屏广告
      if (code.optionCode == 16) {
        if (!divimg1 || !divimg2) {
          wx.showToast({
            title: '两种尺寸图片都需要上传',
            icon: 'none',
          });
          return;
        }
      } else {
        if (!divimg1) {
          wx.showToast({
            title: '请上传图片',
            icon: 'none',
          });
          return;
        }
      }
      imgPath[0] = divimg1;
      imgPath[1] = divimg2;
    }

    //更新Data中广告位参数
    this.setData({
      adcode: {
        code: code,//广告位信息,
        model: model,//0.使用模板；1.直接上传
        model_param: {
          modelId: modelId,//选中的模板Id
          content: content,//输入的显示内容
          phone: phone,//输入的电话
        },
        //自定义参数
        div_param: {
          img: divimg1,//750*1332，本地path地址
          img2: divimg2,//750*1624,本地path地址
        },
      },

      tmpCode: null,
      tmpImgPath1: '',
      tmpImgPath2: '',
    });

    this.setData({
      state: 2, //等待图片上传完成
    });

    //上传图片
    if (this.data.adcode.model == 0) {
      this.setData({
        state: 3,//图片上传完成
      });
      this._getPreviewImage();
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
    if (!this.data.adcode.code) {
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
      wx.navigateTo({
        url: '../../pages/recharge/recharge',
      })
      return;
    }
    //投放
    let start = this.data.start;
    let end = this.data.end;
    let startTime = dateUtil.tsFormatTime(dateUtil.formatTimeStamp(start), 'yyyy-MM-dd 00:00:00');
    let endTime = dateUtil.tsFormatTime(dateUtil.formatTimeStamp(end), 'yyyy-MM-dd 23:59:59');
    //拼接第三方监测链接
    let monitor = '';
    //不使用记刻监测时，使用第三方监测链接
    if (!this.data.isMonitor) {
      let monitors = [];
      for (let i = 0; i < this.data.monitorUrl.length; i++) {
        if (this.data.monitorUrl[i]) {
          monitors.push(this.data.monitorUrl[i]);
        }
      }
      if (monitors.length > 0)
        monitor = monitors.join('|');
    }
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
      position: this.data.adcode.code.optionCode,//广告位id
      isTemplate: this.data.adcode.model,//是否使用模板
      // motto: this.data.mottos[this.data.mottoIndex].code,
      startTime: startTime,
      endTime: endTime,
      totalAmount: this.data.totalAmount,//总价
      unitPrice: this.data.unitPrice,//单价
      coupon: 0,
      couponId: 0,
      isMonitor: this.data.isMonitor,//是否使用即可监测
      cpm: this.data.throwCount,//投放数量cpm
      monitor: monitor,//第三方监测简介
      charging: this.data.charging,//计价方式
    };
    //使用模板    
    if (this.data.adcode.model == 0) {
      data.templateId = this.data.adcode.model_param.modelId;
      data.phone = this.data.adcode.model_param.phone;
      data.content = this.data.adcode.model_param.content;
    }
    //直接上传
    else {
      data.imgUrl = this.data.imgurl;
      data.imgUrl2 = this.data.imgurl2;
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
          url: `../../pages/complete/complete?id=${res.data}`,
        });
      } else {
        wx.showToast({
          title: '投放失败，请尝试重新投放',
          icon: 'none',
        });
        this.setData({
          state: 3,//投放失败
        });
      }
    }, error => {
      console.log(error);
      wx.showToast({
        title: '投放失败，请尝试重新投放',
        icon: 'none',
      });
      this.setData({
        state: 3,//投放失败
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
    let index = parseInt(event.currentTarget.dataset.index);
    if (isNaN(index)) return;
    let value = event.detail.value;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      this.data.monitorUrl[index] = value;
      this.setData({
        monitorUrl: this.data.monitorUrl,
      })
    }
    let monitor = this.data.monitorUrl.join('|');
  },

  /**
   * 注意事项
   */
  onNotice(event) {
    this.setData({
      noticing: true,
    });
  },
  /**
   * 取消注意事项
   */
  onCacelNotice() {
    this.setData({
      noticing: false,
    });
  },

  /**
   * 计算总价
   */
  _onCalTotal() {
    if (!this.data.adcode.code) return;
    let code = this.data.adcode.code;
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

    //1.筛选广告位
    let optionPrice = {};
    for (var i = 0; i < this.data.priceJson.length; i++) {
      if (this.data.priceJson[i].code == code.optionCode) {
        optionPrice = this.data.priceJson[i];
        break;
      }
    }

    //2.筛选地域
    //全国
    let regionId = null;
    if (this.data.location_state == 3) {
      regionId = 999999;
    }
    //全省/区域
    else {
      regionId = Math.floor(this.data.location.ad_info.adcode / 10000) * 10000;
    }
    let regionPrice = {};
    for (var i = 0; i < optionPrice.regions.length; i++) {
      if (optionPrice.regions[i].code == regionId) {
        regionPrice = optionPrice.regions[i];
        break;
      }
    }

    //3.筛选类型
    //cpm
    if (this.data.charging == 0) {
      if (this.data.throwCount > 0) {
        this.data.unitPrice = regionPrice.chargings[0].price;
        let jk = this.data.isMonitor ? this.data.jk_price : 0;
        this.setData({
          charging: 0,
          unitPrice: this.data.unitPrice,
          totalAmount: this.data.throwCount * this.data.unitPrice + jk,
        });
      } else {
        this.data.unitPrice = regionPrice.chargings[0].price;
        this.setData({
          charging: 0,
          unitPrice: this.data.unitPrice,
          totalAmount: 0,
        });
      }
    }
    //cpd
    else if (this.data.charging == 1) {
      console.log(regionPrice.chargings[1]);
      console.log(regionPrice.chargings[1].price);
      if (days > 0) {
        this.data.unitPrice = regionPrice.chargings[1].price;
        let jk = this.data.isMonitor ? this.data.jk_price : 0;
        this.setData({
          charging: 1,
          days: days,

          unitPrice: this.data.unitPrice,
          totalAmount: days * this.data.unitPrice + jk,
        });
      } else {
        this.data.unitPrice = regionPrice.chargings[1].price;
        this.setData({
          charging: 1,
          days: 0,
          unitPrice: this.data.unitPrice,
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
    if (!value) {
      this.setData({
        isMonitor: 0,
      })
    } else {
      this.setData({
        isMonitor: 1,
      })
    }
    this._onCalTotal();
  },

  /**
   * 添加监测链接输入框
   */
  onAddLink() {
    let length = this.data.monitorUrl.length;
    if (length < 3) {
      this.data.monitorUrl.push('');
      this.setData({
        monitorUrl: this.data.monitorUrl,
      });
    }
  },

  /**
   * 计价方式改变
   */
  onValuationChanged: function (event) {
    console.log(event);
    let value = event.detail.value;
    if (value == "1") {
      this.setData({
        charging: 1,
      });
    } else {
      this.setData({
        charging: 0,
      });
    }
    this._onCalTotal();
  },

  /**
   * 预览模板
   */
  onPreviewModel: function (event) {
    wx.previewImage({
      urls: [event.currentTarget.dataset.value],
    })
  },

  /**
   * 获取价格表格 
   */
  _getPriceJson() {
    throwModel.getAllPrices()
      .then(res => {
        console.log(res);
        this.data.jk_price = res.data.jk_price;
        this.data.priceJson = res.data.list;
      })
      .catch(e => {
        console.log(e);
      });
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
      adcode: {
        code: null,//广告位信息,
        model: defaultModel,//0.使用模板；1.直接上传
        //模板参数
        model_param: {
          modelId: 0,//选中的模板Id
          content: '',//输入的显示内容
          phone: '',//输入的电话
        },
        //自定义参数
        div_param: {
          img: '',//750*1332，本地path地址
          img2: '',//750*1624,本地path地址
        },
      },
      //临时参数
      tmpCode: null,
      tmpImgPath1: "",
      tmpImgPath2: "",

      progress: '',//图片上传进度
      imgurl: '',
      imgurl2: '',

      days: 1,

      totalAmount: 0,

      throwCount: 0,//投放数量，cpm
      unitPrice: 0,//单价
      unit: '元/CPM',//单价单位
      preview: '',
    });
    //全部内容重置：包括城市、周期、投放数量等
    if (isAll) {
      this.setData({
        location_state: 0,
        isMonitor: 0, //是否使用记刻数据0:不使用；1:使用；
        monitorUrl: [''],
        mottoIndex: 0,//选中车型索引
        start: now,//投放开始日期
        end: now,//投放结束日期
        charging: 0,
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
      if (res.data.length > 0) {
        this.data.model_param.modelId = res.data[0].id;
      }
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
    let imgPromise0 = null;
    let imgPromise1 = null;
    if (path[0]) {
      imgPromise0 = fileModel.uploadImage({
        path: path[0],
        progress: res => {
          console.log('上传进度', res.progress);
          console.log('已经上传的数据长度', res.totalBytesSent);
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
          this.setData({
            progress: res.progress,
          });
        },
      });
    }
    if (path[1]) {
      imgPromise1 = fileModel.uploadImage({
        path: path[1],
      });
    }

    let promises = [];
    if (imgPromise0) {
      promises[0] = imgPromise0;
      if (imgPromise1) {
        promises[1] = imgPromise1;
      }
    }

    Promise.all(promises)
      .then(
        res => {
          console.log('上传成功');
          console.log(res);
          if (res[1] && res[1].errno == 0) {
            let data = res[1].data;
            this.data.imgurl2 = data.url;
          }

          if (res[0] && res[0].errno == 0) {
            let data = res[0].data;
            this.data.imgurl = data.url;
            this.data.previewUrl = data.url;
            this.setData({
              state: 3,//图片上传完成
            });
            console.log(this.data.imgurl);
            this._onCalTotal();
          } else {
            console.log('上传失败');
            console.log(res[0]);
            wx.showToast({
              title: '图片上传失败',
              icon: 'none',
            });
            this._setState(0);//重新选择广告位
            this.setData({
              progress: 0,
              imgUrl: '',
              imgUrl2: '',
            });
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
          this.setData({
            progress: 0,
            imgUrl: '',
            imgUrl2: '',
          });
        },
      )
  },

  /**
   *  获取预览模板图片 
   */
  _getPreviewImage() {
    throwModel.getPreviewImage({
      templateId: this.data.model_param.modelId,//模板Id
      desc: this.data.model_param.content,//显示内容
      contact: this.data.model_param.phone,//联系方式
    }).then(
      res => {
        this.data.model_param.img = res.data.join(',');
        console.log(this.data.model_param.img);
        this.setData({
          progress: 100,
          previewUrl: res.data[0],//需要预览的图片
        });
        this._onCalTotal();
      }
    ).catch(e => {
      console.log(e);
    });
  },

  /**
   * 获取余额
   */
  _getBalance() {
    userModel.getUserInfo()
      .then(
        res => {
          console.log('成功获取余额');
          console.log(res);
          let balance = res.data.totalAmount;
          let isAuth = res.data.isAuth;
          // isAuth = 2;

          //余额不足
          if (balance <= 0) {
            this._showNoMoney();
            return;
          }
          //是否认证
          if (isAuth != 2) {
            this._showNoAuth(isAuth);
            return;
          }

          this.setData({
            balance: balance.toFixed(2),
            remain: (this.data.balance - this.data.totalAmount).toFixed(2),
          });
        }, error => {

        });
  },

  /**
   * 提示未认证
   */
  _showNoAuth(isAuth) {
    wx.showModal({
      title: "提示",
      content: "账户未认证，请认证后进行投放",
      cancelText: "取消",
      confirmText: "去认证",
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/author/author?isAuth=${isAuth}`,
          })
        } else if (res.cancel) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    });
  },

  /**
  * 提示余额不足
  */
  _showNoMoney() {
    wx.showModal({
      title: "提示",
      content: "余额不足，请充值后进行投放",
      cancelText: "取消",
      confirmText: "去充值",
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/recharge/recharge',
          })
        } else if (res.cancel) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    });
  },
})