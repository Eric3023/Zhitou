Component({
  properties: {
    couponList: {
      type: Array,
      value: [],
    },
    bullying: Boolean,
    bullyInfo: Boolean,
  },
  data: {

  },
  attached: function () {

  },
  methods: {

    /**
     * 关闭
     */
    onClose: function () {
      this.triggerEvent('close');
    },

    /**
     * 确认
     */
    onConfirm: function () {
      this.triggerEvent('confirm');
    },

  }
})