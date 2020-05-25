var util = require('../utils/util.js');
import { orders } from '../local/order.js'

/**
 * 我的订单-业务处理
 */

class OrderModel {
  /**
   * 获取我的订单列表
   */
  getOrders() {
    //测试数据
    return orders;
  }
}

export { OrderModel }