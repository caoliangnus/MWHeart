//app.js

//Initialize Bmob cloud server
var Bmob = require('/utils/bmob.js')
Bmob.initialize("dd7e3fb3803d26291a1867bd44df6986", "0efefcfe6a0c92f7abf501a7d44dbd75");

App({
  data: {
    id: null
  },
  onLaunch: function () {
    var user = new Bmob.User();//开始注册用户
    var that = this;

    wx.login({
      success: function (res) {
        user.loginWithWeapp(res.code).then(function (user) {
          var openid = user.get("authData").weapp.openid;
          that.globalData.openid = openid;

          // Get real name and phone if there is any
          that.getUserRealNameAndPhone();

          // Store user info to cloud
          wx.getUserInfo({
            success: function (result) {
              var U = Bmob.Object.extend("user");
              var u = new U();
              u.save({
                openid: openid
              }, {
                  success: function (result) {
                    console.log("saved openid to cloud")
                  },
                  error: function (result, error) {
                    console.log("failed to save (user id alr exited)", error.message)
                  }
                });
            }
          });

        }, function (err) {
          console.log(err, 'errr');
        });
      }
    });

    this.getUserInfo();

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
        that.globalData.realName = results[0].get('realName')
        that.globalData.phone = results[0].get('phone')
        console.log("realName: " + that.globalData.realName, " phone: " + that.globalData.phone)
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
    openid : null
  }
})
