const config = require('../config/api.js');
const util = require('../utils/util.js');

const size = 20;

function getCoupons(page) {
  return util.request(
    config.Coupons,
    {
      // status: 0,
      page: page,
      size: size
    }
  )
}

module.exports = {
  getCoupons: getCoupons
}