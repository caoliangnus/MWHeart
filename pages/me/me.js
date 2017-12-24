var util = require('../../utils/util.js');
var common = require('../../utils/common.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;


Page({
  data: {
    loading: false,
    userInfo: {},
    cipHour: 0,
    realName: null,
    phone: null,
    windowHeight: null,
    windowWidth: null,
    adminStatus: true,
    showAdminLogIn: false,
  },

  onLoad: function () {
    that = this
    getUserCIPHour();
    setUpAccountLoginPage();
    that.setData({
      userInfo: getApp().globalData.userInfo,
      realName: getApp().globalData.realName == null ? "" : getApp().globalData.realName,
      phone: getApp().globalData.phone == null ? "" : getApp().globalData.phone,
    })
  },

  onShow: function () {
   
  },

  adminBtnClick: function (e) {
    if (that.data.adminStatus) {
      wx.navigateTo({
        url: '../admin/admin/admin'
      })
    } else {
      that.setData({
        showAdminLogIn: true
      });
    }
  },

  cancelBtnClick: function (e) {
    that.setData({
      showAdminLogIn: false
    })
  },

  formSubmit: function (e) {
    var account = e.detail.value.account;
    var password = e.detail.value.password;

    if (account === "xiaoman" && password === "liang") {
      if (true) {
        that.setData({
          adminStatus: true,
          showAdminLogIn: false,
        });
        wx.showToast({
          title: 'Welcome',
          icon: 'success',
          duration: 1000
        })
        wx.navigateTo({
          url: '../admin/admin/admin'
        })
      } else {
        wx.showToast({
          title: 'Log in Fail',
          icon: 'error',
          duration: 1000
        })
      }
    }
  }
})

function getUserCIPHour() {
  that.setData({loading: true})

  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);

  var userId = app.globalData.userId;
  query.equalTo("user", userId);
  query.equalTo("status", 1);

  query.include("event");
  query.include("user");

  query.find({
    success: function (results) {
      console.log("My Event: ", results);
      var cipHour = 0;
      for (var i = 0; i < results.length; i++) {
        var eventDate = new Date(results[i].attributes.event.attributes.date);
        var today = new Date(new Date().setDate(new Date().getDate() - 1));
        if (eventDate <= today) {
          cipHour += results[i].attributes.event.attributes.duration;
        }
      }
      that.setData({
        loading: false,
        cipHour: cipHour,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function setUpAccountLoginPage(){
  wx.getSystemInfo({
    success: (res) => {
      that.setData({
        windowHeight: res.windowHeight,
        windowWidth: res.windowWidth
      })
    }
  })
}