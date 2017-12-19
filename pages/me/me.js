var util = require('../../utils/util.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    cipHour : 40
  },
  onLoad: function () {
    var that = this
      that.setData({
        userInfo: getApp().globalData.userInfo
    })

  },

})