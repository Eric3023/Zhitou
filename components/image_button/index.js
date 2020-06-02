// components/imageButton/index.js
Component({

  options: {
    multipleSlots: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    openType: String,//openType,wxml中为open-type
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
    onGetUserInfo(event) {
      console.log(event);
      this.triggerEvent('userinfo', { value: event.detail });
    },
  }
})
