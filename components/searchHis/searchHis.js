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

    /**
     * 选中搜索历史Item
     */
    onSelectHistory: function (event) {
      const value = event.currentTarget.dataset.value;
      this.triggerEvent("selectHistory", { value: value });
    },

    clearHisSearchData: function () {
      this.triggerEvent("clearHisSearchData");
    }
  }
})
