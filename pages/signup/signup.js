var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;

Page({

  data: {
    isAgree: false,
    isSignedUp: false,
    event : "",
  },

  onLoad: function (options) {
    that = this;
    //Get userInfo
    that.setData({
      userInfo: getApp().globalData.userInfo
    })
  },

  onReady: function () {
    
  },

  onShow: function () {
    getEvent(this);
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


/*
* Get Event Detail from Bmob
*/
function getEvent(t, k) {
  that = t;
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);

  event.descending('date');

  event.first({
    success: function (results) {
      console.log(results);
      that.setData({
        event: results,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}