var util = require('../utils/util.js');
var config = require('../config/api.js');
const check = require('../models/check.js');

class ThrowModel {

  /**
   * 获取投放广告位
   */
  getAdPlaces() {
    return check.checkResult(util.request(config.AdPlaces));
  }

  /**
   * 获取车型列表 
   */
  getCarTypes() {
    return check.checkResult(util.request(config.CarTypes));
  }

  /**
   * 获取投放模板
   */
  getTemplates(adPlace) {
    return check.checkResult(util.request(config.Templates,
      {
        adPlace: adPlace,
      }));
  }

  /**
   * 投放
   */
  doAdvertising({ lat, lng, regionId, address, province, audience, distance, throwType, position, isTemplate, templateId, phone, content, imgUrl, modelImagUrl, motto, city, coupon, couponId, startTime, endTime, totalAmount, unitPrice, isMonitor, cpm, monitor }) {
    return check.checkResult(util.request(config.DoAdvertising,
      {
        regionId: regionId,
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
        cpm: cpm,
        monitor: monitor,
      },
      'POST'));
  }
}


module.exports = ThrowModel;