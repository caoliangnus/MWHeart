var util = require('../../utils/util.js');
var common = require('../../utils/common.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;

Page({

  data: {
    loading: false,

    numPeopleJoined:null,
    picUrl: null,
    oldPicUrl: null,

    isSubmitingUserInfo: false,
    isSignedUp: false,
    isWaiting: false,

    isNotYet: false,
    isOngoing: false,
    isClose: false,
    isAgree: false,
    isSignUpAllowed: false,

    statusArray: ['Not Yet', 'Ongoing', 'Closed'],
    volunteerList: [],
    waitingList: [],
  },


  onLoad: function (options) {
    that = this;
    getUpComingEvent();
    setTimeout(function () {
      getUserSignUpStatus();
      countPeopleInEvent();
      setUpNoticePanel();
    }, 2000)     
  },

  onShow: function () {
    getUpComingEvent();
    getUserSignUpStatus();
    countPeopleInEvent();
    setUpNoticePanel();
  },


  //Agree checkbox
  bindAgreeChange: function (e) {
    var isNotYet = that.data.isNotYet;
    var isOngoing = that.data.isOngoing;
    var isClosed = that.data.isClosed;
    var isDeadlineOver = that.data.isDeadlineOver;
    var isAgree = e.detail.value.length === 1 ? true : false;
    var isSignUpAllowed = !isNotYet && isOngoing && !isClosed && !isDeadlineOver && isAgree;  
    this.setData({
      isAgree: isAgree,
      isSignUpAllowed: isSignUpAllowed,
    });
  },

  //Terms of Service Panel
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },


  showContactPD: function (e) {
    //Todo: Display infomation on how to contact PD
  },


  /**
   * User can sign up or quit event
   */
  sighUpBtnClick: function (e) {
    checkNewUser();
  },
  quitBtnClick: function (e) {
    quitEvent();
  },


  /**
   * User need to fill up phone and realname
   */
  submitUserInfo: function (e) {
    submitUserInfoForm()
  },
  cancelBtnClick: function (e) {
    that.setData({
      isSubmitingUserInfo: false,
    })
  }
})



function checkNewUser() {

  var User = Bmob.Object.extend("user");
  var user = new Bmob.Query(User);

  //Select user with that openid
  user.equalTo("openid", getApp().globalData.openid);
  user.find({
    success: function (results) {
      if (results.length == 0) {
        //Pop up window shows
        that.setData({ isSubmitingUserInfo: true })
      } else {
        //Allow user to sign up
        signUpUser();
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function submitUserInfoForm(){
  var realName = e.detail.value.realName;
  var phone = e.detail.value.phone;

  if (isInvalidRealName(realName)) {
    wx.showModal({
      title: 'Invalid name',
      content: 'Please enter your name in Pinyin. e.g. Chen Xiaoman',
      confirmText: 'OK',
      showCancel: false
    })
  } else if (isInvalidPhone(phone)) {
    wx.showModal({
      title: 'Invalid phone number',
      content: 'Please enter valid phone number.',
      confirmText: 'OK',
      showCancel: false
    })
  } else {
    // Save new user: openid,name and phone to cloud
    var User = Bmob.Object.extend("user");
    var user = new User();
    user.save({
      openid: getApp().globalData.openid,
      realName: realName,
      phone: phone
    }, {
        success: function (result) {
          // Create new user successfully and Store objectId
          wx.setStorageSync("objectId", result.id)
          console.log("objectId: " + wx.getStorageSync("objectId"))
          // Close window
          that.setData({ isSubmitingUserInfo: false })
          // Update me page: update phone & name
          app.getUserRealNameAndPhone();
          // Get user sign up
          signUpUser();
          console.log("***** SignUpPage: End Signing Up New User *****");
        },
        error: function (result, error) {
          console.log("failed to create new user" + error.message)
        }
      });
  }
}

// Get user to sign up for upcoming event
function signUpUser() {
  that.setData({loading:true})
  
  var userId = app.globalData.userId;
  var eventId = app.globalData.eventId;
  var status = (that.data.numPeopleJoined < that.data.limit) ? 1 : 0;

  var P = Bmob.Object.extend("p");
  var participation = new P();

  var event = Bmob.Object.createWithoutData("event", eventId);
  var user = Bmob.Object.createWithoutData("user", userId);

  participation.set("user", user);
  participation.set("event", event);
  participation.set("status", status);

  participation.save(null, {
    success: function (result) {
      var isNotYet = that.data.isNotYet;
      var isOngoing = that.data.isOngoing;
      var isClosed = that.data.isClosed;
      var isDeadlineOver = that.data.isDeadlineOver;
      var isAgree = e.detail.value.length === 1 ? true : false;
      var isSignUpAllowed = !isNotYet && isOngoing && !isClosed && !isDeadlineOver && isAgree;
      var isWaiting = status == 0 ? true : false;
      this.setData({
        loading: false,
        isSignUpAllowed: isSignUpAllowed,
        isSignedUp: true,
        isWaiting: false,
      });
    }
  });

}

function quitEvent(){
  that.setData({ loading: true })
  var userId = app.globalData.userId;
  var eventId = app.globalData.eventId;

  wx.showModal({
    title: 'Alert',
    content: 'Quit Event？',
    success: function (res) {
      if (res.confirm) {
        //delete user from Participation Table
        var P = Bmob.Object.extend("p");
        var query = new Bmob.Query(P);
        query.equalTo("user", userId);
        query.equalTo("event", eventId);
        query.destroyAll({
          success: function () {
            that.setData({
              isSignedUp: false,
              loading: false,
            })
            common.showTip('Success');
            console.log("Quit an event")
          },
          error: function (err) {
            common.showTip('Fail', 'loading');
          }
        });
      }
    }
  })
}

function getUpComingEvent(t, k) {
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
  var today = new Date(new Date().setDate(new Date().getDate() -1));
  var yesterday = util.formatTime(new Date(new Date().setDate(new Date().getDate() - 1)));

  //Select Upcoming event
  event.equalTo("date", { "$gte": { "__type": "Date", "iso": yesterday } });
  event.ascending('date');

  event.find({
    success: function (results) {
      console.log("共查询到 " + results.length + " 条记录");
      if(results.length == 0) {
        return;
      }else{
        console.log("DSA");
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id + ' - ' + object.get('title'));
        }
      }

    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });

  // event.find({
  //   success: function (results) {
  //     console.log("TEST: ", results);
  //     app.globalData.eventId = results.id;
  //     var limit = results.attributes.limit;
  //     var isNotYet = results.attributes.eventStatus == 0 ? true : false;
  //     var isOngoing = results.attributes.eventStatus == 1 ? true : false;
  //     var isClosed = results.attributes.eventStatus == 2 ? true : false;
  //     var isDeadlineOver = new Date(results.attributes.deadline) <= today ? true : false;
  //     var isSignUpAllowed = !isNotYet && isOngoing && !isClosed && !isDeadlineOver && that.data.isAgree;   
  //     updateBtnText(isDeadlineOver, isClosed);

  //     that.setData({
  //       loading: false,
  //       eventItem: results,
  //       limit: limit,
  //       isNotYet: isNotYet,
  //       isOngoing: isOngoing,
  //       isClosed: isClosed,
  //       isDeadlineOver: isDeadlineOver,
  //       isSignUpAllowed: isSignUpAllowed,
  //     })
  //   },
  //   error: function (error) {
  //     console.log("查询失败: " + error.code + " " + error.message);
  //   }
  // });

}

/**
 * Determine the signing up status
 * status = 1 to indicate already signed up
 * status = 0 to indicate not signed up yet
 */
function getUserSignUpStatus() {
  that.setData({ loading: true })

  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  var userId = app.globalData.userId;
  var eventId = app.globalData.eventId;
  query.equalTo("user", userId);
  query.equalTo("event", eventId);
  query.find({
    success: function (result) {
      console.log(result);
      if(result.length == 0) {
        // User has not signed up
        that.setData({
          isSignedUp: false,
        })
      }else{
        that.setData({
          status: result[0].attributes.status,
          isSignedUp: true,
        })
      }

    },
    error: function (object, error) {

    }
  });
}


function countPeopleInEvent() {
  that.setData({ loading: true })
  //One user for One Event
  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  var eventId = app.globalData.eventId;
  query.equalTo("event", eventId);
  query.find({
    success: function (results) {
      console.log("NumPeople: ",results.length);
      that.setData({ 
        loading: false, 
        numPeopleJoined: results.length, 
        })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function updateBtnText(isDeadlineOver, isClosed) {
  var btnText = "";
  if (isClosed || isDeadlineOver) {
    btnText = "Closed";
  } else {
    btnText = "Sign Up";
  }
  that.setData({ btnText: btnText })
}

function setUpNoticePanel() {
  wx.getSystemInfo({
    success: (res) => {
      that.setData({
        windowHeight: res.windowHeight,
        windowWidth: res.windowWidth
      })
    }
  })
}

function isInvalidRealName(realName) {
  //Todo
  return false;
}

function isInvalidPhone(phone) {
  //Todo
  return false;
}