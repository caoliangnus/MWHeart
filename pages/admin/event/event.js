var util = require('../../../utils/util.js');
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
const app = getApp(); //get app instance
var that;

/**
 * Get next Saturday Date
 */
var saturday;
function getNextSaturday() {
  var day = Number(new Date().getDay());
  var offSet = 0;
  while (day !== 6) {
    offSet++;
    day++;
  }
  saturday = new Date(new Date().setDate(new Date().getDate() + offSet));
  return saturday
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusArray: ['Not Yet', 'Ongoing', 'Closed'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var isUpdateEvent = options.isUpdateEvent == "true" ? true : false;

    if (isUpdateEvent) {
      // getEvent(this);
      var Event = Bmob.Object.extend("event");
      var event = new Bmob.Query(Event);
      var today = util.formatTime(new Date());

      //Select Upcoming event
      event.equalTo("date", { "$gte": { "__type": "Date", "iso": today } });
      event.ascending('date');

      event.first({
        success: function (results) {
          console.log(results);
          app.globalData.eventDetail = results;
          var detail = app.globalData.eventDetail.attributes;
          console.log(detail);
          that.setData({
            isUpdateEvent: isUpdateEvent,
            uniqueID: app.globalData.eventDetail.objectId,
            date: detail.date,
            fullDate: detail.fullDate,
            deadline: detail.deadline,
            fullDeadline: detail.fullDeadline,
            time: detail.time,
            limit: detail.limit,
            eventStatus: detail.eventStatus,
            buttonText: "Update Event",
            formText: "modifyForm",
          })

        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });

      wx.setNavigationBarTitle({
        title: "Update Event",
        success: function (res) {
          console.log("Update Event is ready")
        }
      });

    } else {
      /**Create Event Page */
      //Default Deadline is Wednesday
      var deadline = new Date(new Date().setDate(getNextSaturday().getDate() - 3))
      var fullDeadline = util.formatDate(deadline);
      this.setData({
        date: getNextSaturday(),
        fullDate: util.formatDate(saturday),
        deadline: deadline,
        fullDeadline: fullDeadline,
        time: "1pm - 3pm",
        limit: 16,
        eventStatus: 0,
        buttonText: "Create New Event",
        formText: "submitForm",
      })
      console.log("Create Event is ready")
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
    console.log("Event is ready" + ". Window opened: " + getCurrentPages().length);
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

  //For Event Status 
  onPickerChange: function (e) {
    var eventStatus = e.detail.value
    this.setData({
      eventStatus: eventStatus
    })
  },

  bindDateChange: function (e) {
    var date = new Date(e.detail.value);
    var fulldate = util.formatDate(date);
    this.setData({
      date: date,
      fullDate: fulldate
    })
  },

  bindDeadlineChange: function (e) {
    var deadline = new Date(e.detail.value);
    var fullDeadline = util.formatDate(deadline);
    this.setData({
      deadline: deadline,
      fullDeadline: fullDeadline
    })
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //Submit form
  submitForm: function (e) {
    var t = this;
    createEvent(t, e)
  },

  modifyForm: function (e) {
    var t = this;
    var nowId = t.data.uniqueID;
    that.setData({
      nowId: nowId,
    })
    modifyEvent(t, e)
  },
})

function createEvent(t, e) {
  // Event information
  var date = new Date((e.detail.value.date));
  var fullDate = util.formatDate(new Date(date));
  var deadline = new Date((e.detail.value.deadline));
  var fullDeadline = util.formatDate(new Date(deadline));
  var time = e.detail.value.time;
  var limit = Number(e.detail.value.limit);
  var eventStatus = Number(e.detail.value.eventStatus)

  console.log(e.detail.value);

  //Bmob Create Event
  var Event = Bmob.Object.extend("event");
  var event = new Event();

  event.save({
    date: date,
    fullDate: fullDate,
    deadline: deadline,
    fullDeadline: fullDeadline,
    time: time,
    limit: limit,
    eventStatus: eventStatus
  }, {
      success: function (result) {
        common.showTip('Event successfully created ');
        console.log("Event successfully created")
      },
      error: function (result, error) {
        common.showTip('failed to create event ');
        console.log("failed to create event", error)
      }
    });
}

/*
* Get Event Detail from Bmob
*/
function getEvent(t, k) {
  that = t;
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  var today = util.formatTime(new Date());

  //Select Upcoming event
  event.equalTo("date", { "$gte": { "__type": "Date", "iso": today } });
  event.ascending('date');

  event.first({
    success: function (results) {
      console.log(results);
      app.globalData.eventDetail = results.attributes;
      that.setData({
        event: results,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function modifyEvent(t, e) {
  var that = t;

  // Event information
  var date = new Date((e.detail.value.date));
  var fullDate = util.formatDate(new Date(date));
  var deadline = new Date((e.detail.value.deadline));
  var fullDeadline = util.formatDate(new Date(deadline));
  var time = e.detail.value.time;
  var limit = Number(e.detail.value.limit);
  var eventStatus = Number(e.detail.value.eventStatus)

  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);

  // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
  event.get(that.data.nowId, {
    success: function (result) {
      // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
      result.set('date', date);
      result.set('fullDate', fullDate);
      result.set('deadline', deadline);
      result.set('fullDeadline', fullDeadline);
      result.set('time', time);
      result.set('limit', limit);
      result.set('eventStatus', eventStatus);
      result.save();

      common.showTip('Event successfully updated ');
      console.log("Event successfully updated")
    },
    error: function (object, error) {
      common.showTip('Event updated Fail');
      console.log("Event updated Fail")
    }
  });
}