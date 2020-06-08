var util = require('../utils/util.js');
var config = require('../config/api.js');
const check = require('../models/check.js');

/**
 * 我的订单-业务处理
 */

class OrderModel {
  /**
   * 获取我的订单列表
   */
  getOrders(status, page, size) {
    return check.checkResult(util.request(
      config.Order,
      {
        status: status,
        page: page,
        size: size
      }
    ));
  }
}

module.exports = OrderModel;