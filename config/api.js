// 本机开发API地址
var WxApiRoot = 'http://192.168.1.105:8070/wx/';

// 线上云平台api地址
//var WxApiRoot = 'https://www.dtsshop.com/wx/';

module.exports = {
  
  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthPhoneLoginByWeixin: WxApiRoot + 'auth/phone_login_by_weixin', //根据手机号登录

};