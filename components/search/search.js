// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentcity:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    keyword: '',
    defaultKeyword: {
      keyword: '搜索'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击确认查询
    onKeywordConfirm:function(event) {
      console.log(event);
      this.triggerEvent("onKeywordConfirm", { value: event.detail.value });
    },
    //点击选择城市
    onSelectCity:function() {
      this.triggerEvent("onSelectCity");
    },
    clearKeyword: function () {
      this.setData({
        keyword:''
      });
      this.triggerEvent("clearKeyword");
    },
    _hiddenMap:function() {
      this.triggerEvent("hiddenMap");
    },
    _showMap: function (event) {
      
      this.triggerEvent("showMap",{ value: event.detail.value });
    }

  }
})
