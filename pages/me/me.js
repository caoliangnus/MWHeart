var util = require('../../utils/util.js');

//获取应用实例
const app = getApp()
var that;

Page({
  data: {
    loading: false,
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
    this.setData({
      loading: true
    })
    console.log("***** MePage: Start loading user info *****");
    console.log(getApp().globalData.userInfo)
    console.log(getApp().globalData.openid)
    console.log("***** MePage: End loading user info *****");
    that.setData({
      userInfo: getApp().globalData.userInfo,
      realName: getApp().globalData.realName == null ? "" : getApp().globalData.realName,
      phone: getApp().globalData.phone == null ? "" : getApp().globalData.phone,
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
    console.log("***** Start opening Page *****");
    console.log("Me Page is ready" + ". Window opened: " + getCurrentPages().length);
    that.setData({
      realName: getApp().globalData.realName == null ? "" : getApp().globalData.realName,
      phone: getApp().globalData.phone == null ? "" : getApp().globalData.phone,
      loading: false,
    })
    console.log(this.data.realname, this.data.phone)
    console.log("***** End opening Page *****");
  },

  adminBtnClick: function (e) {
    console.log("***** MePage: Admin Button Clicked *****");
    console.log("adminStatus: "+ that.data.adminStatus);
    console.log("***** MePage: End Admin Button Clicked *****");
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
