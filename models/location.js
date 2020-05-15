import { HTTP } from '../utils/http.js'
import { AroundUsers } from '../config/api.js';

/**
 * 位置相关-业务处理
 */

class LocationModel extends HTTP {
  /**
   * 获取周边用户数
   */
  getAroundUser(lng, lat, distance) {
    return this.request({
      url: AroundUsers,
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