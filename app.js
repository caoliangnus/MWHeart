//app.js

//Initialize Bmob cloud server
var Bmob = require('/utils/bmob.js')
Bmob.initialize("dd7e3fb3803d26291a1867bd44df6986", "0efefcfe6a0c92f7abf501a7d44dbd75");

App({
  onLaunch: function () {
    var user = new Bmob.User();//开始注册用户

    var newOpenid = wx.getStorageSync('openid')
    if (!newOpenid) {

      wx.login({
        success: function (res) {
          user.loginWithWeapp(res.code).then(function (user) {
            var openid = user.get("authData").weapp.openid;
            console.log(user, 'user', user.id, res);

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
                      console.log("failed to save (user id alr exited)", error)
                    }
                  });

              }
            });

          }, function (err) {
            console.log(err, 'errr');
          });



        }
      });
    }

    this.getUserRealNameAndPhone();
    this.getUserInfo(function (userInfo) {
      console.log(userInfo)
    })

  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
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
    // Get user real name and phone number
    var u = Bmob.Object.extend("user");
    var query = new Bmob.Query(u);
    query.first({
      success: function (object) {
        // 查询成功
        console.log(object)
        that.globalData.realName = object.get('realName')
        that.globalData.phone = object.get('phone')
        console.log(that.globalData.realName, that.globalData.phone)
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  globalData: {
    userInfo: null,
    realName: null,
    phone: null
  }
})
