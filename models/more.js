/**
 * 地点分类数据请求
 */
import { HTTP } from '../utils/http.js'

const url = 'http://192.168.1.105:8070/api/wx/index/allCategory';

class MoreModel extends HTTP {

  /**
   * 获取行业分类列表
   */
    getCategoryList(callback) {
    this.request({
      url: url,
      success: (res) => {
        callback(res);
      }
    });
  }
}

export { MoreModel }