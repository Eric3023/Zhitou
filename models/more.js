import { LocationCategory } from '../config/api.js';
var util = require('../utils/util.js');
const check = require('../models/check.js');

/**
 * 地点分类数据请求类
 */

class MoreModel{

  /**
   * 获取行业分类列表
   */
  getCategoryList() {
    return check.checkResult(util.request(LocationCategory));
  }
}

export { MoreModel }