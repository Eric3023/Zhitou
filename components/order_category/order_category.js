// components/orde_category/order_category.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick: function (event) {
      let index = parseInt(event.currentTarget.dataset.index);
      console.log(index);
      this.setData({
        index: index
      })
    }
  }
})
