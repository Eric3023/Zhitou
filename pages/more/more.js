// pages/more/more.js
const height = 164;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    show: true,

    items: [
      {
        icon: "/img/icon1.png",
        title: "热门",
        items: [
          "银行",
          "超市",
          "公交站",
          "附近小店",
          "快餐",
          "厕所",
          "电影院",
          "洗浴",
          "商场"
        ],
        color: "#000000"
      },
      {
        icon: "/img/icon1.png",
        title: "吃",
        items: [
          "快餐",
          "中餐",
          "火锅",
          "咖啡厅",
          "美食",
          "小吃",
          "自助餐",
          "茶餐厅",
          "糕饼店"
        ],
        color: "#000000"
      },
      {
        icon: "/img/icon1.png",
        title: "住",
        items: [
          "宾馆",
          "星级宾馆",
          "酒店",
          "快捷酒店",
          "招待所",
          "钟点房",
          "如家",
          "汉庭",
          "旅馆"
        ],
        color: "#000000"
      },
      {
        icon: "/img/icon1.png",
        title: "行",
        items: [
          "加油站",
          "汽车站",
          "火车站",
          "公交站",
          "客运站",
          "汽车维修",
          "火车票代售",
          "停车场",
          "中石化"
        ],
        color: "#000000"
      },
      {
        icon: "/img/icon1.png",
        title: "玩",
        items: [
          "网吧",
          "洗浴",
          "足疗",
          "KTV",
          "夜店",
          "电影院",
          "酒吧",
          "农家乐",
          "体育馆"
        ],
        color: "#000000"
      },
      {
        icon: "/img/icon1.png",
        title: "游",
        items: [
          "著名景点",
          "游乐园",
          "公园",
          "博物馆",
          "动物园",
          "植物园",
          "广场",
          "展览馆",
          "纪念馆"
        ],
        color: "#000000"
      },
      {
        icon: "/img/icon1.png",
        title: "生活",
        items: [
          "医院",
          "银行",
          "快递",
          "诊所",
          "美容美发",
          "电信营业厅",
          "厕所",
          "ATM",
          "照相馆"
        ],
        color: "#000000"
      },
      {
        icon: "/img/icon1.png",
        title: "购",
        items: [
          "超市",
          "商场",
          "药店",
          "步行街",
          "便利店",
          "建材市场",
          "五金店",
          "书店",
          "花店"
        ],
        color: "#000000"
      }
    ],

    itemInfo: {
      icon: "/img/icon1.png",
      title: "热门",
      items: [
        "银行",
        "超市",
        "公交站",
        "附近小店",
        "快餐",
        "厕所",
        "电影院",
        "洗浴",
        "商场"
      ],
      color: "#000000"
    }
  },

  onClose: function (event) {
    this.setData({
      show: false
    })

    wx.pageScrollTo({
      scrollTop: height,
      complete: (res) => { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPageScroll: function (e) {
    console.log(e)
    let flag = e.scrollTop > height ? false : true;
    this.setData({
      show: flag
    });
  }
})