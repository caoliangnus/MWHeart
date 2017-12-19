var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance

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
    
  },

  onShow: function () {
    console.log("SignUp is ready" + ". Window opened: " + getCurrentPages().length);
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  /**
   * Methods below are used for Notice panel
   */
  //Agree checkbox
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
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
    this.setData({
      isSignedUp: isSignedUp
    })
  },

})
