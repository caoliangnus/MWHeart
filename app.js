//app.js

//Initialize Bmob cloud server
var Bmob = require('/utils/bmob.js')
Bmob.initialize("dd7e3fb3803d26291a1867bd44df6986", "0efefcfe6a0c92f7abf501a7d44dbd75");

App({
  onLaunch: function () {

  },

  getOpenIdUserIdRealNameAndPhone: function (f) {
    console.log("***** AppPage: Start get Openid *****");
    var that = this;

    wx.login({
      success: function (res) {
        if (res.code) {
          Bmob.User.requestOpenId(res.code, {
            success: function (result) {
              that.globalData.openid = result.openid;
              console.log("openid: " + that.globalData.openid);
              console.log("***** AppPage: End get Openid *****");
              that.getUserIdRealNameAndPhone(f);
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
    console.log("***** AppPage: Start get UserInfo *****");
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
              console.log("***** AppPage: End get UserInfo *****");
            }
          })
        }
      })
    }
  },

  getUserIdRealNameAndPhone: function (f) {
    console.log("***** AppPage:Start get userId realName and phone *****");
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
        that.globalData.userId = results[0].id;
        console.log("userId: ", that.globalData.userId);
        console.log("realName: " + that.globalData.realName, " phone: " + that.globalData.phone)
        console.log("***** AppPage:End get userId realName and phone *****");
        } else {
          console.log("***** AppPage:End get userId realName and phone, no such user *****");
        }

        // Execute function parameter passed in
        f()
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
    
    userId:null,
    eventId:null
  }
})
