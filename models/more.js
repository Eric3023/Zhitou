import { API_LOCATION_CATEGOTY } from '../config/appConfig.js';
/**
 * 地点分类数据请求类
 */

import { HTTP } from '../utils/http.js'

class MoreModel extends HTTP {

  /**
   * 获取行业分类列表
   */
  getCategoryList() {
    return this.request({
      url: API_LOCATION_CATEGOTY
    });
  }
}

export { MoreModel }