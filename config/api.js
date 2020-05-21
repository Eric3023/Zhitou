// 本机开发API地址
var BaseApi = 'http://180.76.112.118:8070/';
// 局域网开发API地址
// var BaseApi = 'http://192.168.1.19:8070/';
// 线上云平台api地址
// var BaseApi = "https://zt.ottauto.tv/"

var WxApiRoot = BaseApi + 'wx/';

module.exports = {

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthPhoneLoginByWeixin: WxApiRoot + 'auth/phone_login_by_weixin', //根据手机号登录

  //图片根地址
  BaseImgApi: BaseApi,
  //首页Banner
  Banner: WxApiRoot + 'index/banner',
  //行业分类
  LocationCategory: WxApiRoot + 'index/allCategory',
  //周边用户数
  AroundUsers: WxApiRoot + 'index/userNums',
  //获取投放广告位
  AdPlaces: WxApiRoot + 'advertising/getAdPlaces',
  //车型列表
  CarTypes: WxApiRoot + 'advertising/getCarTypes',
  //投放模板
  Templates: WxApiRoot + 'advertising/getTemplates',
  //投放
  DoAdvertising: WxApiRoot + 'advertising/dodvertising',


};