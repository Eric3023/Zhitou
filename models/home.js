const config = require('../config/api.js')
const util = require('../utils/util.js');
const check = require('../models/check.js');

/**
 * 获取Banner轮播数据
 */
function getBanners() {
  return check.checkResult(util.request(config.Banner));
}

module.exports = {
  getBanners: getBanners
}