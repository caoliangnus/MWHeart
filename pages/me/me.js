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
    windowHeight: "",
    windowWidth: "",
    adminStatus: true,
  },
  onLoad: function () {
    that = this
    this.setData({
      loading: true
    })

    getUserCIPHour(this);

    console.log("***** MePage: Start loading user info *****");
    console.log(getApp().globalData.userInfo)
    console.log(getApp().globalData.openid)
    console.log("***** MePage: End loading user info *****");
    that.setData({
      userInfo: getApp().globalData.userInfo,
      realName: getApp().globalData.realName == null ? "" : getApp().globalData.realName,
      phone: getApp().globalData.phone == null ? "" : getApp().globalData.phone,
      showAdminLogIn: false,
      loading: false,
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

    getUserCIPHour(this);
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
    console.log("adminStatus: " + that.data.adminStatus);
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

function getUserCIPHour(t) {
  var that = t;
  that.setData({
    loading: true
  })
  var userId = app.globalData.openid;

  var Participlation = Bmob.Object.extend("participationTable");
  var query = new Bmob.Query(Participlation);
  query.equalTo("user", userId);
  query.equalTo("status", 1);
  query.include("event");
  query.find({
    success: function (results) {
      console.log("***** MePage: Start loading UserStatusfrom BMOB *****");
      console.log(results);
      var eventArray = [];
      for (var i = 0; i < results.length; i++) {
        var eventId = results[i].attributes.event
        eventArray = eventArray.concat(eventId);
      }
      that.setData({
        eventArray: eventArray,
        loading:false,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  }).then(function(){
    that.setData({
      loading: true
    })
    var Event = Bmob.Object.extend("event");
    var event = new Bmob.Query(Event);

    var sum = 0;
    for (var i = 0; i < that.data.eventArray.length; i++) {
      var eventId = that.data.eventArray[i];
      event.get(eventId, {
        success: function (result) {
          console.log("Event", result);
          var eventDate = new Date(result.attributes.date);
          if (new Date() >= eventDate){
            sum += Number(result.attributes.duration);
            that.setData({
              cipHour: sum,
              loading: false
            })
          }else{
            that.setData({
              cipHour: sum,
              loading: false
            })
          }
          console.log("***** MePage: End loading UserStatusfrom BMOB *****");
        },
        error: function (object, error) {
          // 查询失败

        }
      });
    }
    
  });
}
