var util = require('../../utils/util.js');
var common = require('../../utils/common.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;
var saturday;

Page({

  data: {
    loading: false,

    eventName: null,
    contactPD: null,
    terms: null,

    numPeopleJoined: null,
    picUrl: null,
    oldPicUrl: null,

    isNotYet: false,
    isOngoing: false,
    isClosed: false,
    isAgree: false,
    isSignUpAllowed: false,
    hasUpcomingEvent: true,

    statusArray: ['Not Yet', 'Ongoing', 'Closed'],
    volunteerList: []
  },


  onShow: function (options) {
    that = this;
    refresh()
  },
  onPullDownRefresh: function () {
    refresh()
  },

})

// Refresh the entire page
// Including upcoming event, event's lists, user sign up status
function refresh() {
  that.setData({
    loading: true,
  })
  getUpComingEvent();
}

function getUpComingEvent(f) {
  that.setData({ loading: true })

  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);

  /**
   * Bomb Date default is 8am, eg. 23/12/2017 0800
   * If event date is 23/12/2017 and today is also 23/12/2017
   * Upcoming event will be updated after 8am 23/12/2017
   * 
   * Code below is to avoid this issue
   * If event date is 23/12/2017 and today is also 23/12/2017
   * By setting today to be yesterday
   * Upcoming event will only be updated after 8am 24/12/2017
   */
  var today = new Date();
  today.setDate(today.getDate() - 1);
  var yesterday = util.formatTime(today);

  //Select Upcoming event
  event.equalTo("date", { "$gte": { "__type": "Date", "iso": yesterday } });
  event.ascending('date');

  event.find({
    success: function (results) {
      if (results.length == 0) {
        console.log("Have no upcoming event")
        createNewEvent()
      } else {
        console.log("Upcoming Event", results);
        app.globalData.eventId = results[0].id;
        var limit = results[0].attributes.limit;
        var isNotYet = results[0].attributes.eventStatus == 0 ? true : false;
        var isOngoing = results[0].attributes.eventStatus == 1 ? true : false;
        var isClosed = results[0].attributes.eventStatus == 2 ? true : false;

        var dateString = String(results[0].attributes.deadline);
        dateString = dateString.replace(/-/g, '/');
        var deadline = new Date(dateString);

        var isDeadlineOver = deadline <= today ? true : false;
        isClosed = isClosed || isDeadlineOver
        var isSignUpAllowed = !isNotYet && isOngoing && !isClosed && !isDeadlineOver && that.data.isAgree;

        that.setData({
          loading: false,
          eventItem: results[0],
          limit: limit,
          isNotYet: isNotYet,
          isOngoing: isOngoing,
          isClosed: isClosed,
          isDeadlineOver: isDeadlineOver,
          isSignUpAllowed: isSignUpAllowed,
          hasUpcomingEvent: true,

          // Description
          eventName: app.globalData.eventName,
          contactPD: app.globalData.contactPD,
          terms: app.globalData.terms,
        })
        if (isNotYet) {
          // Do nothing
          console.log("Event sign up not yet.")
        } else {
          getVolunteerList()
        }
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getVolunteerList() {
  that.setData({ loading: true })
  //One user for One Event
  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  var eventId = app.globalData.eventId;
  query.equalTo("event", eventId);
  query.equalTo("status", 1)
  query.ascending('updatedAt');
  query.include("user");
  var volunteerList = [];
  query.find({
    success: function (results) {
      for (var i = 0; i < results.length; i++) {
        var user = results[i].attributes.user
        volunteerList = volunteerList.concat(user);
      }
      that.setData({
        volunteerList: volunteerList,
        loading: false,
        numPeopleJoined: volunteerList.length
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

/**
 * Get next Saturday Date
 */
function getNextSaturday() {
  var day = Number(new Date().getDay());
  var offSet = 0;
  while (day !== 6) {
    offSet++;
    day++;
  }
  var saturday = new Date(new Date().setDate(new Date().getDate() + offSet));
  return saturday
}