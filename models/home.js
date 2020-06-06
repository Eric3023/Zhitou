const config = require('../config/api.js')
const util = require('../utils/util.js');

/**
 * 获取Banner轮播数据
 */
function getBanners() {
  return util.request(config.Banner);
}

module.exports = {
  getBanners: getBanners
}