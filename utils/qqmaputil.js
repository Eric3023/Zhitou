var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: '5PEBZ-P4N63-LO53C-YFVFX-AGA2F-2WFE4'
});

function reverseGeocoder(app,that) {
  
  qqmapsdk.reverseGeocoder({
    
    success: function(res) {

      console.log(res);
      const result = res.result;
      let adInfo = '';
      let businessArea = '';
      let landmark = '';
      let crossroad = '';
      let tempCity = '';
      if (result.ad_info) {
        adInfo = result.ad_info.nation || '';
        adInfo += result.ad_info.province ? ',' + result.ad_info.province : '';
        adInfo += result.ad_info.city ? ',' + result.ad_info.city : '';
        adInfo += result.ad_info.district ? ',' + result.ad_info.district : '';
      }

      if (result.address_reference && result.address_reference.business_area) {
        businessArea = result.address_reference.business_area.title || '';
        businessArea += '(' + result.address_reference.business_area._dir_desc + ')';
      }

      if (result.address_reference && result.address_reference.landmark_l1) {
        landmark = result.address_reference.landmark_l1.title || '';
        landmark += '(' + result.address_reference.landmark_l1._dir_desc + ')';
      }

      if (result.address_reference && result.address_reference.crossroad) {
        crossroad = result.address_reference.crossroad.title || '';
        crossroad += '(' + result.address_reference.crossroad._dir_desc + ')';
      }
      that.setData({

        addressInfo: {
          adcode: result.ad_info && result.ad_info.adcode || '', //行政区划代码
          address: result.address || '',
          businessArea: businessArea, //商圈
          adInfo: adInfo,
          landmark: landmark,
          recommend: result.formatted_addresses && result.formatted_addresses.recommend || '',
          crossroad: crossroad
        },
        currentcity: result.ad_info.city,
        regionCallbackTxt: result.location.lat + ',' + result.location.lng,
        pois: result.pois
      });

      app.globalData.lat = result.location.lat;
      app.globalData.lng = result.location.lng;

    }
  });
  
}

function reverseGeocoderPoi(app, that, loca) {
  qqmapsdk.reverseGeocoder({
    location: loca,
    get_poi: 1,
    poi_options:
      'page_size=20' //[默认] 以地标+主要的路+近距离poi为主，着力描述当前位置；
    ,

    success: function (res) {
      console.log(res);
      const result = res.result;
      let adInfo = '';
      let businessArea = '';
      let landmark = '';
      let crossroad = '';
      let tempCity = '';
      if (result.ad_info) {
        adInfo = result.ad_info.nation || '';
        adInfo += result.ad_info.province ? ',' + result.ad_info.province : '';
        adInfo += result.ad_info.city ? ',' + result.ad_info.city : '';
        adInfo += result.ad_info.district ? ',' + result.ad_info.district : '';
      }

      if (result.address_reference && result.address_reference.business_area) {
        businessArea = result.address_reference.business_area.title || '';
        businessArea += '(' + result.address_reference.business_area._dir_desc + ')';
      }

      if (result.address_reference && result.address_reference.landmark_l1) {
        landmark = result.address_reference.landmark_l1.title || '';
        landmark += '(' + result.address_reference.landmark_l1._dir_desc + ')';
      }
      if (result.address_reference && result.address_reference.crossroad) {
        crossroad = result.address_reference.crossroad.title || '';
        crossroad += '(' + result.address_reference.crossroad._dir_desc + ')';
      }
      that.setData({
        
        addressInfo: {
          adcode: result.ad_info && result.ad_info.adcode || '', //行政区划代码
          address: result.address || '',
          businessArea: businessArea, //商圈
          adInfo: adInfo,
          landmark: landmark,
          recommend: result.formatted_addresses && result.formatted_addresses.recommend || '',
          crossroad: crossroad
        },
        pois: result.pois
      });
    },
    fail: function (res) {
      console.log(res);
    },
  });
}

function search(that, keyword, shapLocation, currentcity, siteData) {
  qqmapsdk.search({
    keyword: keyword,//搜索关键词
    location: shapLocation,//设置周边搜索中心点
    address_format: 'short',
    region:currentcity,
    page_size: "20",
    success: function (res) {
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          siteData.push({
            title: res.data[i].title,//名字
            id: res.data[i].id,//id
            da_info: res.data[i].da_info,//所属省市区
            address: res.data[i].address,//具体地址
            location: res.data[i].location,//坐标
            category: res.data[i].category,//类型
            tel: res.data[i].tel,//电话
            checked: false,//是否在选中
            scope: false,//是否在范围以内
          })
        };

        that.setData({
          siteData: siteData,
        })
        wx.hideLoading();
      } else {
        //无数据
        that.setData({
          showNull: true
        })

        wx.hideLoading();

      }
      that.setData({//搜索后，隐藏历史
        hiddenHis: true
      })

      //最多50条历史
      that.addHisSearchData(keyword);


    },
  })
}
////最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错
module.exports = {
  reverseGeocoder: reverseGeocoder,
  reverseGeocoderPoi: reverseGeocoderPoi,
  search: search
}