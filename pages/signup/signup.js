var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;

Page({

  data: {
    loading: false,
    isAgree: false,
    isSignedUp: false,
    event: "",
    isSubmitingUserInfo: false
  },


  onLoad: function (options) {
    that = this;
    this.setData({
      loading: true
    })
    getEvent(this);
    getEventList(this);

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
    this.setData({
      isAgree: !!e.detail.value.length
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

  sighUpBtnClick: function (e) {
    // Show pop up for user to fill in info if is new user
    checkNewUser(this);

  },

  quitBtnClick: function (e) {
    //Todo
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
    that.setData({ isSubmitingUserInfo: false })
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
        signUpUser();
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}


// Get user signed up for upcoming event
function signUpUser(t, k) {

  // Signed up successfully
  that.setData({ isSignedUp: true })
  wx.showToast({
    title: 'Signed up!',
    icon: 'success',
    duration: 2000
  })
  
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
      console.log("***** SignUpPage: Start loading UpComing Event from BMOB *****");
      console.log(results);
      console.log("***** SignUpPage: End loading UpComing Event from BMOB *****");
      that.setData({
        event: results,
        
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
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  //Select Upcoming event
  var today = util.formatTime(new Date());
  event.equalTo("date", { "$lt": { "__type": "Date", "iso": today } });
  event.descending('date');
  event.find({
    success: function (results) {
      console.log("***** EventListPage: Start loading Event Listfrom BMOB *****");
      console.log(results);
      console.log("***** EventListPage: End loading Event Listfrom BMOB *****");
      app.globalData.eventList = results;
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