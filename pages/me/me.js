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
    setUpAccountLoginPage();
    refresh();
  },
  
  onPullDownRefresh: function () {
    refresh()
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
    checkUser(account, password);
  },

  getCIPForm: function (e) {
    console.log("Get CIP form")

  }
})

function refresh() {
  // Then ensure user info needed is completedly loaded in app.js
  app.getOpenIdUserIdRealNameAndPhone(
    function () {
      getUserCIPHour();
      that.setData({
        userInfo: getApp().globalData.userInfo,
        realName: getApp().globalData.realName == null ? "" : getApp().globalData.realName,
        phone: getApp().globalData.phone == null ? "" : getApp().globalData.phone,
      })
    });
}

function getUserCIPHour() {
  that.setData({ loading: true })

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
        var dateString = String(results[i].attributes.event.attributes.date);
        dateString = dateString.replace(/-/g, '/');
        var eventDate = new Date(dateString);
        var today = new Date();
        today.setDate(today.getDate() - 1);

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
      that.setData({
        loading: false
      })
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function setUpAccountLoginPage() {
  wx.getSystemInfo({
    success: (res) => {
      that.setData({
        windowHeight: res.windowHeight,
        windowWidth: res.windowWidth
      })
    }
  })
}

function checkUser(account, password) {
  that.setData({ loading: true })
  var Admin = Bmob.Object.extend("admin");
  var admin = new Bmob.Query(Admin);

  admin.find({
    success: function (results) {
      for (var i = 0; i < results.length; i++) {
        var ac = String(results[i].attributes.account);
        var pw = String(results[i].attributes.password);
        if (ac == account && pw == password) {
          that.setData({
            adminStatus: true,
            showAdminLogIn: false,
          });
        }
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  }).then(function (results) {
    that.setData({ loading: false })
    if (that.data.adminStatus) {
      wx.navigateTo({
        url: '../admin/admin/admin'
      })
      wx.showToast({
        title: 'Welcome',
        icon: 'success',
        duration: 1000
      })
    } else {
      wx.showToast({
        title: 'Log in Fail',
        icon: 'error',
        duration: 1000
      })
    }
  })
}