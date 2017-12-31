var util = require('../../../utils/util.js');
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var util = require('../../../utils/util.js');
const app = getApp(); //get app instance
var that;

Page({
  data: {
    showTopTips: false,
    errorMsg: ""
  },
  onLoad: function () {
    that = this;
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },

  formSubmit: function (e) {
    createAdmin(e);
  }
})  

function createAdmin(e) {
  var t = that;
  that.setData({ loading: true })
  // new Admin information
  var account = String(e.detail.value.account);
  var password = String(e.detail.value.password);
  var subPassword = String(e.detail.value.subPassword);

  //Process information
  account = account.replace(/(^\s*)|(\s*$)/g, ""); //Trim
  password = password.replace(/(^\s*)|(\s*$)/g, ""); //Trim
  subPassword = subPassword.replace(/(^\s*)|(\s*$)/g, ""); //Trim

  //Valid Event information
  if (!account) {
    Show.showAlert(t, "warn", 'Account can not empty');
  } else if (!password || !subPassword) {
    Show.showAlert(t, "warn", 'Password can not empty');
  } else if (subPassword != password) {
    Show.showAlert(t, "warn", 'Two password do not match');
  } else {
    //Upload Event information to Bmob
    var Admin = Bmob.Object.extend("admin");
    var admin = new Admin();

    admin.save({
      account: account,
      password: password,
    }, {
        success: function (result) {
          that.setData({ loading: false })
          wx.navigateBack({
            delta: 1
          })
          common.showTip('Success');
        },
        error: function (result, error) {
          common.showTip('Fail');
          console.log("failed to create event", error)
        }
      })
  }
  that.setData({ loading: false })
}