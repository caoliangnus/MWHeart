var util = require("../../../utils/util.js")
var common = require("../../../utils/common.js")
var Show = require("../../../utils/alert/alert.js");
var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    })
    getEventList(this);
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
    getEventList(this);
    console.log("***** Start opening Page *****");
    console.log("EventListPage is ready" + ". Window opened: " + getCurrentPages().length);
    console.log("***** End opening Page *****");
    
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
    
  }
})


/*
* Get Event Detail from Bmob
*/
function getEventList(t, k) {
  that = t;
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  event.descending('date');
  event.find({
    success: function (results) {
      console.log("***** EventListPage: Start loading Event Listfrom BMOB *****");
      console.log(results);
      console.log("***** EventListPage: End loading Event Listfrom BMOB *****");
      app.globalData.eventList = results;
      that.setData({
        eventList: results,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}