// components/searchPoi/searchPoi.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pois: {
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
     * 点击了列表ITEM
     */
    bindSelect(event){
      this.triggerEvent("click");
    },
  }
})
