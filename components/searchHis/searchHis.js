// components/searchHis/searchHis.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hiddenHis: {
      type: Boolean
    },
    hisSearchData: {
      type: Array
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clearHisSearchData:function() {
      this.triggerEvent("clearHisSearchData");
    }
  }
})
