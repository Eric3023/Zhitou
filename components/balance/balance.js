// components/balance/balance.js
Component({
  /**
   * Component properties
   */
  properties: {
    balance: {
      type: Number
    }
  },

  /**
   * Component initial data
   */
  data: {
    icon: "/img/icon_mine_balance.png",
    title: "我的账户",
    background: "/img/balance_backgroud.png",
    recharge: "/img/icon_mine_recharge.png"
  },

  /**
   * Component methods
   */
  methods: {
    recharge: function (e) {
      this.triggerEvent("recharge", { event: e })
    }
  }
})
