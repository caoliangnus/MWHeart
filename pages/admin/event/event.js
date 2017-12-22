var util = require('../../../utils/util.js');
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var Show = require("../../../utils/alert/alert.js");
const app = getApp(); //get app instance
var that;
var file = null;

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
    picUrl: null,
    oldPicUrl: null,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    //To determine CreateEvent Page or UpdateEvent Page
    var isUpdateEvent = options.isUpdateEvent == "true" ? true : false;

    /**
     * Update Event Page
     */
    if (isUpdateEvent) {
      var objectId = String(options.objectId);
      this.setData({
        isUpdateEvent: isUpdateEvent,
        buttonText: "Update Event",
        objectId: objectId,
      })

      getEvent(this, objectId);

      wx.setNavigationBarTitle({
        title: "Update Event",
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
        limit: "16",
        duration: "2",
        eventStatus: 0,
        buttonText: "Create New Event",
        formText: "submitForm"
      })

    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("***** Start opening Page *****");
    console.log(this.data.buttonText + " Page is ready" + ". Window opened: " + getCurrentPages().length);
    console.log("***** End opening Page *****");
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

  upPic: function (e) {
    upPic(this);
  },

  delPic: function (e) {
    delPic(this);
  },

  //Delete User After clicked Delete Button
  deleteEvent: function (event) {
    var id = that.data.objectId;
    wx.showModal({
      title: 'Alert',
      content: 'Delete Event？',
      success: function (res) {
        if (res.confirm) {
          //delete user
          var Event = Bmob.Object.extend("event");
          //创建查询对象，入口参数是对象类的实例
          var event = new Bmob.Query(Event);
          event.equalTo("objectId", id);
          event.destroyAll({
            success: function () {
              wx.navigateBack({
                delta: 1
              })
              common.showTip('Success');
            },
            error: function (err) {
              common.showTip('Fail', 'loading');
            }
          });
        }
      }
    })
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
  var duration = Number(e.detail.value.duration);
  var eventStatus = Number(e.detail.value.eventStatus)

  console.log("***** EventPage: Start Validing Event Information *****");
  //Valid Event information
  if (!isValidDeadline(date, deadline)) {
    Show.showAlert(t, "warn", 'Deadline must before the actual Date');
  } else if (!isValidLimit(limit)) {
    Show.showAlert(t, "warn", 'Limit must be positive integer');
  } else if (!isValidDuration(duration)) {
    Show.showAlert(t, "warn", 'Duration must be positive integer');
  } else {
    console.log("***** EventPage: End Validing Event Information *****");
    console.log("***** EventPage: Start uploading EventInfo to Bmob *****");
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
      duration: duration,
      eventStatus: eventStatus
    }, {
        success: function (result) {
          wx.navigateBack({
            delta: 1
          })
          common.showTip('Event successfully created ');
          console.log("***** EventPage: End uploading EventInfo to Bmob *****");
        },
        error: function (result, error) {
          common.showTip('failed to create event ');
          console.log("failed to create event", error)
        }
      });
  }
}

/*
* Get Event Detail from Bmob
*/
function getEvent(t, k) {

  that = t;
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);

  event.get(k, {
    success: function (results) {
      console.log("***** EventPage: Start loading Specific Event from BMOB *****");
      console.log(results);
      console.log("***** EventPage: End loading Specific Event from BMOB *****");
      app.globalData.eventDetail = results;
      var detail = app.globalData.eventDetail.attributes;
      that.setData({
        uniqueID: app.globalData.eventDetail.objectId,
        date: detail.date,
        fullDate: detail.fullDate,
        deadline: detail.deadline,
        fullDeadline: detail.fullDeadline,
        time: detail.time,
        limit: detail.limit,
        duration: detail.duration,
        eventStatus: detail.eventStatus,
        formText: "modifyForm"
      })

      // Get pic url if the event image is not null
      if (detail.pic) {
        that.setData({ picUrl: detail.pic._url })
      }
    },
    error: function (object, error) {
      // 查询失败
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
  var duration = Number(e.detail.value.duration);
  var eventStatus = Number(e.detail.value.eventStatus)
  var picFile = file

  console.log("***** EventPage: Start Validing Event Information *****");
  //Valid Event information
  if (!isValidDeadline(date, deadline)) {
    Show.showAlert(t, "warn", 'Deadline must before the actual Date');
  } else if (!isValidLimit(limit)) {
    Show.showAlert(t, "warn", 'Limit must be positive integer');
  } else if (!isValidDuration(duration)) {
    Show.showAlert(t, "warn", 'Duration must be positive integer');
  } else {
    console.log("***** EventPage: End Validing Event Information *****");

    var Event = Bmob.Object.extend("event");
    var event = new Bmob.Query(Event);

    event.get(that.data.nowId, {
      success: function (result) {
        console.log("***** EventPage: Start uploading EventInfo to BMOB *****");
        result.set('date', date);
        result.set('fullDate', fullDate);
        result.set('deadline', deadline);
        result.set('fullDeadline', fullDeadline);
        result.set('time', time);
        result.set('limit', limit);
        result.set('duration', duration);
        result.set('eventStatus', eventStatus);

        // Handle pic file
        if (file) {
          // There is a uploaded new pic
          console.log("not empty")
          result.set('pic', file);
        } else {
          // No new uploaded pic
          console.log("empty")
          var path = that.data.oldPicUrl;

          // Need to delete old pic
          if (path) {
            var s = new Bmob.Files.del(path).then(function (res) {
              if (res.msg == "ok") {
                console.log("Cloud storage pic deleted")
              }
            }, function (error) {
              console.log(error)
            }
            );
            result.unset("pic");
          }
        }
        
        result.save();
        wx.navigateBack({
          delta: 1
        })  
        console.log("***** EventPage: End uploading EventInfo to BMOB *****");

      },
      error: function (object, error) {
        common.showTip('Event updated Fail');
        console.log("Event updated Fail")
      }
    });
  }


}

function delPic(t) {//图片删除
  console.log('Event image deleted');
  common.showTip("Deleted");
  that.setData({
    oldPicUrl: that.data.picUrl,
    picUrl: null
  })
  file = null;
}

function upPic(t, e) {
  var that = t;
  wx.chooseImage({
    count: 1,
    sourceType: 'album',
    success: function (res) {
      wx.showNavigationBarLoading()
      that.setData({
        loading: true
      })
      var tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths)
      var url;
      if (tempFilePaths.length > 0) {
        // Set file name to date.png
        var extension = /\.([^.]*)$/.exec(tempFilePaths[0]);
        if (extension) {
          extension = extension[1].toLowerCase();
        }
        var newDate = new Date();
        var newDateStr = newDate.toLocaleDateString();
        var name = newDateStr + "." + extension;

        // Upload file
        file = new Bmob.File(name, tempFilePaths);
        file.save().then(function (res) {
          url = res.url();
          console.log("Upload image successfully: " + name)
          // Set data
          that.setData({
            loading: false,
            picUrl: url
          })

        }, function (error) {
          console.log(error);
        })
      }
    }
  })
}

function isValidDeadline(date, deadline) {
  
  console.log("Checking Deadline");
  //Deadline must before date
  return date >= deadline;
}

function isValidLimit(limit) {
  
  console.log("Checking Limit: " + limit);
  //limit must be a positive integer
  return Number.isInteger(limit) && limit >= 0;
}

function isValidDuration(duration) {
  
  console.log("Checking Duration: " + duration);
  //duration must be a positive integer
  return Number.isInteger(duration) && duration >= 0;
}
