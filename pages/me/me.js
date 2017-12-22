var util = require('../../utils/util.js');

//获取应用实例
const app = getApp()
var that;

Page({
  data: {
    userInfo: {},
    cipHour: 40,
    realName: null,
    phone: null,
    windowHeight: "",
    windowWidth: "",
    adminStatus: true,
  },
  onLoad: function () {
    that = this
    console.log(getApp().globalData.userInfo)
    console.log(getApp().globalData.openid)
    that.setData({
      userInfo: getApp().globalData.userInfo,
      realName: getApp().globalData.realName,
      phone: getApp().globalData.phone,
      showAdminLogIn: false,
    }),

      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth
          })
        }
      })
  },
  onShow: function () {
    console.log("Me is ready" + ". Window opened: " + getCurrentPages().length);
  },

  adminBtnClick: function (e) {
    console.log(that.data.adminStatus);
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
          showAdminLogIn: false
        });
        console.log(that.data.adminStatus);
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
