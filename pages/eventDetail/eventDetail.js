var util = require('../../utils/util.js');
var common = require('../../utils/common.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    eventId: null,
    eventItem:null,
    volunteerList:null,
    numPeopleJoined:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var eventId = String(options.objectId);
    this.setData({ eventId: eventId})
    getEvent(this, eventId);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
})

function getEvent() {
  that.setData({ loading: true })

  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);

  event.get(that.data.eventId, {
    success: function (results) {
      that.setData({
        loading: false,
        //Load Event information
        eventItem:results,
      })
      getVolunteerList();
    },
    error: function (object, error) {
      // 查询失败
    }
  });
}

function getVolunteerList() {
  that.setData({ loading: true })
  //One user for One Event
  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  var eventId = that.data.eventId;
  console.log(eventId);
  query.equalTo("event", eventId);
  query.equalTo("status", 1)
  query.ascending('updatedAt');
  query.include("user");
  var volunteerList = [];
  query.find({
    success: function (results) {
      for (var i = 0; i < results.length; i++) {
        var user = [{ user: results[i].attributes.user, updatedAt: results[i].updatedAt }]
        volunteerList = volunteerList.concat(user);
      }
      that.setData({
        volunteerList: volunteerList,
        loading: false,
        numPeopleJoined: results.length,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}