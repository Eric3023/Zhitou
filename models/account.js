let util = require('../utils/util.js');
let config = require('../config/api.js');

class AccountModel {

  /**
   * 获取账户余额
   */
  getBalance() {
    return util.request(
      config.Balance
    );
  }

}

module.exports = AccountModel;