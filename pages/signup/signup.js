var util = require('../../utils/util.js');
var common = require('../../utils/common.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;

Page({

  data: {
    loading: false,
    picUrl: null,
    oldPicUrl: null,
    isAgree: false,
    isOngoing: false,
    isSignedUp: false,
    isClose: false,
    isNotYet: false,
    signUpStatus: false,
    event: "",
    statusArray: ['Not Yet', 'Ongoing', 'Closed'],
    isSubmitingUserInfo: false,
    volunteerList: [],
    waitingList: [],
    isWaiting: false
  },


  onLoad: function (options) {
    that = this;
    getEvent(this);
    getEventList(this);
    getUserSignUpStatus(this);
    //Get userInfo
    that.setData({
      userInfo: getApp().globalData.userInfo
    })

    //This is for Scroll view in Terms of Service
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {
    getEvent(this);
    getEventList(this);
    getUserSignUpStatus(this);
    console.log("***** Start opening Page *****");
    console.log("SignUp Page is ready" + ". Window opened: " + getCurrentPages().length);
    console.log("***** End opening Page *****");
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  /**
   * Methods below are used for Notice panel
   */
  //Agree checkbox
  bindAgreeChange: function (e) {
    var isAgree = !!e.detail.value.length;
    var signUpStatus = this.data.isOngoing && this.data.isClosed && isAgree;
    this.setData({
      isAgree: !!e.detail.value.length,
      signUpStatus: signUpStatus,
    });
  },

  //Hide panel when tapped outside
  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  //Show panel when tapped "Terms of Service"
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

  },

  sighUpBtnClick: function (e) {
    // Show pop up for user to fill in info if is new user
    checkNewUser(this);

  },

  quitBtnClick: function (e) {
    //Todo
    var that = this;
    that.setData({
      loading: true
    })
    var userId = app.globalData.openid;
    var eventId = app.globalData.eventId;

    wx.showModal({
      title: 'Alert',
      content: 'Quit Event？',
      success: function (res) {
        if (res.confirm) {
          //delete user from Participation Table
          var Participation = Bmob.Object.extend("participationTable");
          //创建查询对象，入口参数是对象类的实例
          var event = new Bmob.Query(Participation);
          event.equalTo("user", userId);
          event.equalTo("event", eventId);
          event.destroyAll({
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
  },

  /**
   * Sumbit button clicked when submitting
   * user real name and phone number
   *  Register a new user in cloud
   */
  submitUserInfo: function (e) {
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

      console.log("***** SignUpPage: Start Signing Up New User *****");
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
  },

  cancelBtnClick: function (e) {
    that.setData({
      isSubmitingUserInfo: false,
    })
  }

})

function isInvalidRealName(realName) {
  //Todo
  return false;
}

function isInvalidPhone(phone) {
  //Todo
  return false;
}

function checkNewUser(t) {
  that = t;
  var User = Bmob.Object.extend("user");
  var user = new Bmob.Query(User);

  //Select user with that openid
  user.equalTo("openid", getApp().globalData.openid);
  user.find({
    success: function (results) {
      if (results.length == 0) {
        // Is new user
        console.log("New user")
        // User needs to key in real name and phone number
        // Pop up window shows
        that.setData({ isSubmitingUserInfo: true })
      } else {
        // Old user -> Get user sign up
        signUpUser(that);
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}


// Get user signed up for upcoming event
function signUpUser(t, k) {
  var that = t;
  that.setData({
    loading: true
  })

  var limit = that.data.limit
  var status = 0;
  var userId = app.globalData.openid;
  var eventId = app.globalData.eventId;

  var Participlation = Bmob.Object.extend("participationTable");
  var participation = new Participlation();

  //Check for number of participants
  var query = new Bmob.Query(Participlation);
  query.include("event");

  query.find({
    success: function (results) {
      console.log("***** SignUpPage: Start Signing Up User *****");
      //Need to be less than {{limit}}, initially results.length = 0
      if(results.length < limit){
        console.log("Number of Participants before signUp: ", results.length);
        status = 1;
      } else {
        status = 0;
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  }).then(function() {
    var event = Bmob.Object.createWithoutData("event", eventId);
    var user = Bmob.Object.createWithoutData("user", userId);

    participation.set("user", userId);
    participation.set("event", eventId);
    participation.set("status", status)

    participation.save();
    // Signed up successfully
    that.setData({
      isSignedUp: true,
      loading: false,
      isWaiting: status == 0
    })
    wx.showToast({
      title: 'Signed up!',
      icon: 'success',
      duration: 2000
    })
    console.log("***** SignUpPage: End Signing Up User *****");
  })
}

/*
* Get Event Detail from Bmob
*/
function getEvent(t, k) {
  that = t;
  that.setData({
    loading: true
  })
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  var today = new Date(new Date().setDate(new Date().getDate() - 1)); //This actually refers to yesterday
  var yesterday = util.formatTime(new Date(new Date().setDate(new Date().getDate() - 1)));

  //Select Upcoming event
  event.equalTo("date", { "$gte": { "__type": "Date", "iso": yesterday } });
  event.ascending('date');

  event.first({
    success: function (results) {
      console.log("***** SignUpPage: Start loading UpComing Event from BMOB *****");
      console.log(results);
      app.globalData.eventId = results.id;
      console.log("Event Id: ", results.id, " Event Date: ", results.attributes.fullDate);
      var isNotYet = results.attributes.eventStatus === 0 ? true : false;
      console.log("Event not open: ", isNotYet);
      var isOngoing = results.attributes.eventStatus === 1 ? true : false;
      console.log("Event ongoing: ", isOngoing);
      var isClosed = new Date(results.attributes.deadline) >= today ? true : false;
      console.log("Deadline reached: ", isClosed);
      var btnText = "";
      if (isClosed) {
        btnText = "Sign Up";
      } else {
        btnText = "Closed";
      }
      var signUpStatus = isOngoing && !isClosed && that.data.isAgree;
      var limit = results.attributes.limit;
      console.log("***** SignUpPage: End loading UpComing Event from BMOB *****");
      that.setData({
        event: results,
        isNotYet: isNotYet,
        isOngoing: isOngoing,
        isClosed: isClosed,
        signUpStatus: signUpStatus,
        btnText: btnText,
        limit: limit,
        loading: false
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });

}


/*
* Get Past Event Detail from Bmob
*/
function getEventList(t, k) {
  that = t;
  that.setData({
    loading: true
  })

  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  var tomorrow = util.formatTime(new Date(new Date().setDate(new Date().getDate() - 1)));
  event.equalTo("date", { "$lte": { "__type": "Date", "iso": tomorrow } });
  event.descending('date');
  event.find({
    success: function (results) {
      console.log("***** SignUpPage: Start loading Event Listfrom BMOB *****");
      console.log(results);
      console.log("***** SignUpPage: End loading Event Listfrom BMOB *****");
      app.globalData.eventList = results;
      // Get pic url if the event image is not null
      that.setData({
        eventList: results,
        loading: false,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getUserSignUpStatus(t){
  var that = t;
  that.setData({
    loading: true
  })
  //One user for One Event
  var Participlation = Bmob.Object.extend("participationTable");
  var query = new Bmob.Query(Participlation);
  query.include("user");
  query.find({
    success: function (results) {
      var userId = app.globalData.openid;
      var eventId = app.globalData.eventId;
      console.log("***** SignUpPage: Start loading UserStatusfrom BMOB *****");
      for (var i = 0; i < results.length; i++) {
        if (results[i].attributes.event == eventId) {
          console.log("User Already Signed Up");
          //Already signed up
          that.setData({
            isSignedUp: true,
            loading: false,
            isWaiting: results[i].attributes.status == 0
          })
        }
      }
      console.log(results);
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}