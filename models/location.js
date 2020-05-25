var util = require('../utils/util.js');
import { AroundUsers } from '../config/api.js';

/**
 * 位置相关-业务处理
 */

class LocationModel {
  /**
   * 获取周边用户数
   */
  getAroundUser(lng, lat, distance) {
    return util.request(AroundUsers, {
      lng: lng,
      lat: lat,
      distance: distance,
    }, 'POST');
  }
}

export { LocationModel }