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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      loading: true
    })
    
    //To determine MyPastEvent or EventList Page
    var isMyEvent = options.isMyEvent == "true" ? true : false;
    if(isMyEvent){
      //Display event list for specific user only
      this.setData({
        isMyEvent: isMyEvent
      })
      getUserEventList(this);
    }else{
      //Display all events in the list
      getEventList(this);
    }
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
  that.setData({
    loading: true
  })
  event.find({
    success: function (results) {
      console.log("***** EventListPage: Start loading Event Listfrom BMOB *****");
      console.log(results);
      console.log("***** EventListPage: End loading Event Listfrom BMOB *****");
      app.globalData.eventList = results;
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

function getUserEventList(t) {
  var that = t;
  that.setData({
    loading: true
  })
  var userId = app.globalData.openid;

  var Participlation = Bmob.Object.extend("participationTable");
  var query = new Bmob.Query(Participlation);
  query.equalTo("user", userId);
  query.equalTo("status", 1);
  query.include("event");
  query.find({
    success: function (results) {
      console.log("***** MePage: Start loading UserStatusfrom BMOB *****");
      console.log(results);
      var eventArray = [];
      for (var i = 0; i < results.length; i++) {
        var eventId = results[i].attributes.event
        eventArray = eventArray.concat(eventId);
      }
      that.setData({
        eventArray: eventArray,
        loading: false,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  }).then(function () {
    that.setData({
      loading: true
    })
    var Event = Bmob.Object.extend("event");
    var event = new Bmob.Query(Event);

    var eventList = [];
    for (var i = 0; i < that.data.eventArray.length; i++) {
      var eventId = that.data.eventArray[i];
      event.get(eventId, {
        success: function (result) {
          console.log("Event", result);
          var eventDate = new Date(result.attributes.date);
          if (new Date() >= eventDate) {
            eventList = eventList.concat(result);
            that.setData({
              eventList: eventList,
              loading: false
            })
          } else {
            that.setData({
              eventList: eventList,
              loading: false
            })
          }
          console.log("***** MePage: End loading UserStatusfrom BMOB *****");
        },
        error: function (object, error) {
          // 查询失败

        }
      });
    }
  });
}
