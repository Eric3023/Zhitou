var util = require('../utils/util.js');
var config = require('../config/api.js');
var map = require('../utils/qqmaputil');

class ThrowModel {

  /**
   * 获取当前定位
   */
  getLocation(app) {
    return map.getCurrentLocation({ app: app });
  }

  /**
   * 获取投放广告位
   */
  getAdPlaces() {
    return util.request(config.AdPlaces);
  }


  /**
   * 获取车型列表 
   */
  getCarTypes() {
    return util.request(config.CarTypes);
  }

  /**
   * 获取投放模板
   */
  getTemplates(adPlace) {
    return util.request(config.Templates,
      {
        adPlace: adPlace,
      });
  }

  /**
   * 投放
   */
  doAdvertising({ lat, lng, address, province, audience, distance, throwType, position, isTemplate, templateId, phone, content, imgUrl, modelImagUrl, motto, city, coupon, couponId, startTime, endTime, totalAmount, unitPrice, isMonitor }) {
    return util.request(config.DoAdvertising,
      {
        adContact: phone,
        adDesc: content,
        adImgUrl: imgUrl,
        adPlace: position,
        adTmpUrl: modelImagUrl,
        carType: motto,
        city: city,
        couponAmount: coupon,
        couponId: couponId,
        crowd: audience,
        distance: distance,
        endTime: endTime,
        isTemplate: isTemplate,
        lat: lat,
        lng: lng,
        positionDesc: address,
        province: province,
        startTime: startTime,
        templateId: templateId,
        throwType: throwType,
        totalAmount: totalAmount,//总价
        unitPrice: unitPrice,//单价
        isMonitor: isMonitor,//是否使用检测
      },
      'POST');
  }

  /**
   * 上传图片
   */
  updateImgFie({ path, sCallback, fCallback }) {
    return wx.uploadFile({
      url: config.Upload,
      filePath: path,
      name: 'file',
      success: res => {
        sCallback(res.data);
      },
      fail: error => {
        fCallback(error);
      }
    });
  }
}


module.exports = ThrowModel;