import { API_LOCATION_CATEGOTY } from '../config/appConfig.js';
import { HTTP } from '../utils/http.js'

/**
 * 地点分类数据请求类
 */

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