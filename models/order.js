var util = require('../utils/util.js');
var config = require('../config/api.js');
const check = require('../models/check.js');

/**
 * 获取我的订单(投放)列表
 */
function getOrders(status, page, size) {
  return check.checkResult(util.request(
    config.Order,
    {
      status: status,
      page: page,
      size: size
    }
  ));
}

/**
 * 删除订单
 */
function deleteOrder(id) {
  return check.checkResult(util.request(
    config.delOrder,
    {
      id: id
    },
    "POST"
  ));
}

/**
 * 获取订单列表(投放)详情
 */
function getThrowDetail(id) {
  return check.checkResult(util.request(
    config.ThrowDetail,
    {
      id: id
    }
  ));
}

module.exports = {
  getOrders: getOrders,
  deleteOrder: deleteOrder,
  getThrowDetail: getThrowDetail,
};