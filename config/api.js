// 本机开发API地址
// var WxApiRoot = 'http://180.76.112.118:8070/wx/';
// 局域网开发API地址
// var WxApiRoot = 'http://192.168.1.19:8070/wx/';
// 线上云平台api地址
var WxApiRoot = 'https://zt.ottauto.tv/wx/';

module.exports = {

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthPhoneLoginByWeixin: WxApiRoot + 'auth/phone_login_by_weixin', //根据手机号登录

  //图片根地址
  BaseImgApi: 'http://180.76.112.118:8070/',
  //首页Banner
  Banner: WxApiRoot + 'index/banner',
  //行业分类
  LocationCategory: WxApiRoot + 'index/allCategory',
  //周边用户数
  AroundUsers: WxApiRoot + 'index/userNums',

};