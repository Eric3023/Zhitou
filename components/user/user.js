// components/user/user.js
Component({
  /**
   * Component properties
   */
  properties: {
    uicon: {
      type: String
    },
    uid: {
      type: String
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    getWxUserInfo:function(event){
        console.log(event);
      this.triggerEvent("getWxUserInfo", { event: event.detail});
    }
  }
})
