import { HTTP } from '../utils/http.js';
import { Banner } from '../config/api.js';
/**
 * 主页数据请求、业务处理类
 */

class HomeModel extends HTTP {

  /**
   * 获取Banner轮播数据
   */
  getBanners() {
    return this.request({
      url: Banner,
    });
  }
}

export { HomeModel }