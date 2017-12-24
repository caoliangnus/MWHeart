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
    loading: false,
    eventList:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    //To determine MyPastEvent or EventList Page
    var isMyEvent = options.isMyEvent == "true" ? true : false;
    if(isMyEvent){
      //Display event list for specific user only
      this.setData({
        isMyEvent: isMyEvent
      })
      getMyEventList(this);
    }else{
      //Display all events in the list
      getEventList(this);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getEventList();    
  },
})

/*
* Get Event List from Bmob
*/
function getEventList() {
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  event.descending('date');

  event.find({
    success: function (results) {
      that.setData({
        eventList: results,
        loading: false
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

/*
* Get My Event List from Bmob
*/
function getMyEventList(t) {
  that.setData({loading: true})
  var userId = app.globalData.userId;

  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  query.equalTo("user", userId);
  query.equalTo("status", 1);
  query.include("event");
  var eventList = [];
  query.find({
    success: function (results) {
      var cipHour = 0;
      for (var i = 0; i < results.length; i++) {
        eventList = eventList.concat(results[i].attributes.event);
      }
      that.setData({
        eventList: eventList,
        loading: false
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}
