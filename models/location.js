import { HTTP } from '../utils/http.js'
import { API_AROUND_USER } from '../config/appConfig.js';

/**
 * 位置相关-业务处理
 */

class LocationModel extends HTTP {
  /**
   * 获取周边用户数
   */
  getAroundUser(lng, lat, distance) {
    return this.request({
      url: API_AROUND_USER,
      method:'POST',
      data: {
        lng: lng,
        lat: lat,
        distance: distance,
      },
    })
  }
}

export { LocationModel }