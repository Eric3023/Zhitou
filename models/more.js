import { LocationCategory } from '../config/api.js';
var util = require('../utils/util.js');

/**
 * 地点分类数据请求类
 */

class MoreModel{

  /**
   * 获取行业分类列表
   */
  getCategoryList() {
    return util.request(LocationCategory);
  }
}

export { MoreModel }