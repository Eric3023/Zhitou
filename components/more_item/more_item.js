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
    },
    more: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultIcon:'/img/icon_point_green.png',
    //超过该数量，折叠
    max_num:9
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick: function (event) {
      let title = event.currentTarget.dataset.name;
      this.triggerEvent("clickItem", { title: title });
    },

    onClose: function (event) {
      this.triggerEvent("close", { event: event })
    },

    seeMore: function (event) {
      this.setData({
        more: true
      })
    }
  }
})
