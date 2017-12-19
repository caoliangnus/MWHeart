var util = require('../../utils/util.js');

// Initialize cloud server Bmob
var Bmob = require('../../utils/bmob.js');

//get app instance
const app = getApp()

Page({

  data: {
    date: "",
    time: "1pm-3pm",
    deadLine: "",
    isAgree: false,
    isSignedUp: false,
    peventList : []
  },

  onLoad: function (options) {

    //Set formated Date
    var date = util.formatDate(new Date());

    //DeadLine is 2 days before eventDay
    var deadLine = util.formatDate(new Date(new Date().setDate(new Date().getDate() - 2)));
    this.setData({
      date: date,
      deadLine: deadLine
    })
  },

  onReady: function () {
    console.log("SignUp is Ready")
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  /**
   * Display panel on Agree terms and conditions
   */
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
    console.log("Agree condition set to: " + this.data.isAgree)
  }, 

  //Hide panel when tapped outside
  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },

  //Show panel when tapped "Terms of Service"
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },

  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },

  /**
   * Update SignUp status
   */
  updateStatus: function (e) {
    var isSignedUp = !this.data.isSignedUp;
    console.log(isSignedUp);
    this.setData({
      isSignedUp: isSignedUp
    })
  },

})
