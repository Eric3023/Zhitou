// components/setting/setting.js
Component({
  /**
   * Component properties
   */
  properties: {
    icon: {
      type: String
    },

    title: {
      type: String
    }
  },

  /**
   * Component initial data
   */
  data: {
    enter: "/img/icon_mine_enter.png"
  },

  /**
   * Component methods
   */
  methods: {
    onClickItem:function(event){
      let title = this.data.title;
      this.triggerEvent("clickItem", {title: title});
    }
  }
})
