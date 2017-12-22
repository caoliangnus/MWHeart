//app.js

//Initialize Bmob cloud server
var Bmob = require('/utils/bmob.js')
Bmob.initialize("dd7e3fb3803d26291a1867bd44df6986", "0efefcfe6a0c92f7abf501a7d44dbd75");

App({
  onLaunch: function () {

    this.getOpenId();
    this.getUserInfo();

  },

  getOpenId: function () {
    var that = this;

    wx.login({
      success: function (res) {
        if (res.code) {
          Bmob.User.requestOpenId(res.code, {
            success: function (result) {
              that.globalData.openid = result.openid;
              console.log("***** AppPage: Start login WeChat and load UserInfo *****");
              console.log(result);
              console.log("openid: " + that.globalData.openid);
              console.log("***** AppPage:End login WeChat and load UserInfo *****");
            },
            error: function (error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
            }
          });
        } else {
          common.showTip('Unable to get userInfo', 'loading');
        }
      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  getUserRealNameAndPhone: function () {
    var that = this
    var openid = that.globalData.openid

    // Query user real name and phone number from cloud server
    var u = Bmob.Object.extend("user");
    var query = new Bmob.Query(u);
    query.equalTo("openid", openid);
    query.find({
      success: function (results) {
        // There is such a user
        // Otherwise this user is not stored to clound yet
        if (results.length == 1) {
        that.globalData.realName = results[0].get('realName')
        that.globalData.phone = results[0].get('phone')
        console.log("realName: " + that.globalData.realName, " phone: " + that.globalData.phone)
        }
      },
      error: function (error) {
        console.log("failed to query realName and phone" + error.code + " " + error.message);
      }
    });
  },
  globalData: {
    userInfo: null,
    realName: null,
    phone: null,
    openid: null,
    objectId: null,
    eventDetail: null,
    userList: null,
    eventList: null,
  }
})
