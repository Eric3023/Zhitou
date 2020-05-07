// components/more_item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
    items: {
      type: Array
    },
    color: {
      type: String
    },
    close: {
      type: Boolean
    }
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
    onClick: function (event) {
      wx.showToast({
        title: '进入搜索商圈页面',
        icon: 'none'
      });
    },

    onClose: function (event) {
      wx.showToast({
        title: '关闭推荐',
        icon: 'none'
      });
      this.triggerEvent("close", { event: event })
    },
  }
})
