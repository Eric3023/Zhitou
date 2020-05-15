import { LocationCategory } from '../config/api.js';
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
      url: LocationCategory,
    });
  }
}

export { MoreModel }