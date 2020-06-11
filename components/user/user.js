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
    },
    flag: Boolean,
    authored: Number
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

    getUserInfo:function(event){
      this.triggerEvent("getWxUserInfo", { event: event.detail.value});
    },

    getWxUserInfo:function(event){
      this.triggerEvent("getWxUserInfo", { event: event.detail});
    }
  }
})
