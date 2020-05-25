import { Banner } from '../config/api.js';
var util = require('../utils/util.js');
/**
 * 主页数据请求、业务处理类
 */

class HomeModel {

  /**
   * 获取Banner轮播数据
   */
  getBanners() {
    return util.request(Banner);
  }
}

export { HomeModel }