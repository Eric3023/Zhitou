let util = require('../utils/util.js');
let config = require('../config/api.js');
const check = require('../models/check.js');

class AccountModel {

  /**
   * 获取账户余额
   */
  getBalance() {
    return check.checkResult(util.request(
      config.Balance
    ));
  }

}

module.exports = AccountModel;