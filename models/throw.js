var util = require('../utils/util.js');
var config = require('../config/api.js');

class ThrowModel {

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
  doAdvertising(phone, ) {
    return util.request(config.DoAdvertising,
      {
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
        sCallback(res);
      },
      fail: error => {
        fCallback(error);
      }
    });
  }
}


module.exports = ThrowModel;