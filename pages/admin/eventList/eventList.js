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
    url:null,

    isUpdate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    //To determine MyPastEvent or EventList Page
    var isMyEvent = options.isMyEvent == "true" ? true : false;
    this.setData({
      isMyEvent: isMyEvent
    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      if (that.data.isMyEvent) {
        that.setData({ url: "../../eventDetail/eventDetail?isMyEvent=true" })
        //Display event list for specific user only
        getMyEventList();
      } else {
        that.setData({ url: "../event/event?isUpdateEvent=true" })
        //Display all events in the list
        getEventList();
      }
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
      console.log(results);
      that.setData({
        eventList: results,
        loading: false,
      })
    },
    error: function (error) {
      that.setData({
        loading: false,
      })
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
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        that.setData({ loading: true })
        var eventDate = new Date(results[i].attributes.event.attributes.date);
        var today = new Date();
        today.setDate(today.getDate() - 1);
        if (eventDate <= today) {
          eventList = eventList.concat(results[i].attributes.event);
          that.setData({
            eventList: eventList
          })
        }
      }
      that.setData({
        loading: false,
      })
     
    },
    error: function (error) {
      that.setData({
        loading: false,
      })
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })
}
