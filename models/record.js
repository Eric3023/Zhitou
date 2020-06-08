var util = require('../utils/util.js');
var config = require('../config/api.js');
const check = require('../models/check.js');

class RecordModel {

  /**
   * 获取充值记录
   */
  getPayRecods(page, size) {
    return check.checkResult(util.request(
      config.PayRecord,
      {
        page: page,
        size: size
      },
      'GET'));
  }
}

module.exports = RecordModel;

