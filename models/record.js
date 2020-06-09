var util = require('../utils/util.js');
var config = require('../config/api.js');
const check = require('../models/check.js');


/**
 * 获取充值记录
 */
function getPayRecods(page, size) {
  return check.checkResult(util.request(
    config.PayRecord,
    {
      page: page,
      size: size
    },
    'GET'));
}

/**
 * 获取待开发票记录
 */
function getInvoice(page, size) {
  return check.checkResult(util.request(
    config.NoUserInvoice,
    {
      page: page,
      size: size
    },
    'GET'));
}

/**
 * 开具发票
 */
function openInvoice({type, name, dutySign, totalPrice, email, orderId}) {
  return check.checkResult(util.request(
    config.OpenInvoice,
    {
      "dutySign": dutySign,
      "email": email,
      "name": name,
      "orderId": orderId,
      "totalPrice": totalPrice,
      "type": type   
    },
    'POST'));
}

module.exports = {
  getPayRecods: getPayRecods,
  getInvoice: getInvoice,
  openInvoice: openInvoice,
};

