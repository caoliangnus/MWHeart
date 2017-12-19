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
            console.log("First Time: " + user, 'user', user.id, res);
            console.log(user.get("nickName"));
            if (user.get("nickName")) {

              // 第二次登录，打印用户之前保存的昵称
              console.log("Second Time: " + user.get("nickName"), 'res.get("nickName")');
              //更新openid
              wx.setStorageSync('openid', openid)
            } else { //注册成功的情况

              //保存用户其他信息
              wx.getUserInfo({
                success: function (result) {

                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;

                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                  query.get(user.id, {
                    success: function (result) {
                      // 自动绑定之前的账号

                      result.set('nickName', nickName);
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      result.save();

                    }
                  });

                }
              });


            }

          }, function (err) {
            console.log(err, 'errr');
          });

        }
      });
    }

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
  globalData: {
    userInfo: null
  }
})