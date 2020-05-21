import { HTTP } from '../utils/http.js';
var config = require('../config/api.js');

class ThrowModel extends HTTP {

  /**
   * 获取投放广告位
   */
  getAdPlaces() {
    return this.request({
      url: config.AdPlaces,
    });
  }


  /**
   * 获取车型列表 
   */
  getCarTypes() {
    return this.request({
      url: config.CarTypes,
    });
  }

  /**
   * 获取投放模板
   */
  getTemplates(adPlace) {
    return this.request({
      url: config.Templates,
      data: {
        adPlace: adPlace,
      },
    });
  }

  /**
   * 投放
   */
  doAdvertising(phone, ) {
    return this.request({
      url: config.DoAdvertising,
      method: 'POST',
      data: {
        adContact: phone,
        adDesc: content,
        adImgUrl: imgUrl,
        adPlace: posiotn,
        adTmpUrl: modelImagUtl,
        carType: motto,
        city: city,
        couponAmount: coupon,
        couponId: couponId,
        crowd: audience,
        distance: distance,
        endTime: endTime,
        isTemplate: isTemplate,
        lat: lat,
        lng: lnt,
        positionDesc: address,
        province: province,
        startTime: startTime,
        templateId: templateId,
        throwType: throwType,
        totalAmount: totalAmount,
        unitPrice: unitPrice,
      },
    });
  }
}


module.exports = ThrowModel;