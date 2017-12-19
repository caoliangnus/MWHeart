var util = require('../../../utils/util.js');
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');

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
    date: getNextSaturday(),
    fullDate: util.formatDate(saturday),
    deadlineDate: "",
    fullDeadlineDate: "",
    time: "1pm - 3pm",
    limit: 16,
    buttonText: "Create New Event",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //Default Deadline is Wednesday
    var deadlineDate = new Date(new Date().setDate(saturday.getDate() - 3))
    var fullDeadlineDate = util.formatDate(deadlineDate);
    this.setData({
      deadlineDate: deadlineDate,
      fullDeadlineDate: fullDeadlineDate,
    })

    var isUpdateEvent = options.isUpdateEvent == "true" ? true : false;

    if (isUpdateEvent) {
      this.setData({
        isUpdateEvent: isUpdateEvent,
        buttonText: "Update Event",
      })
      console.log("Update Event is ready")
    } else {
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

  bindDateChange: function (e) {
    var date = new Date(e.detail.value);
    var fulldate = util.formatDate(date);
    this.setData({
      date: date,
      fullDate: fulldate
    })
  },

  bindDeadlineChange: function (e) {
    var deadlineDate = new Date(e.detail.value);
    var fullDeadlineDate = util.formatDate(deadlineDate);
    this.setData({
      deadlineDate: deadlineDate,
      fullDeadlineDate: fullDeadlineDate
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
})

function createEvent(t, e) {
  // Event information
  var title = e.detail.value.title;
  var date = e.detail.value.date;
  var fullDate = util.formatDate(new Date(date));
  var deadline = e.detail.value.deadline;
  var fullDeadline = util.formatDate(new Date(deadline));
  var time = e.detail.value.time;
  var limit = Number(e.detail.value.limit);

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
    limit: limit
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