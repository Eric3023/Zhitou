// components/searchItem/searchItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hiddenMap:{
      type:Boolean
    },
    siteData: {
      type: Array
    },


  },

  /**
   * 组件的初始数据
   */
  data: {
    hiddenMap:{
      type:String
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 点击加载更多，监听回调
     */
    onLoadMore:function(event){
      this.triggerEvent("loadMore");
    },

    bindSelect:function(event) {
      this.triggerEvent("bindSelect", { event: event });
    }
  }
})
