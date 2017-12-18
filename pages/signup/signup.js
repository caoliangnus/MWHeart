var util = require('../../utils/util.js');

//get app instance
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    time: "10am-1pm",
    deadLine: "",
    isAgree: false,
    isSignedUp: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("SignUp is Ready")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
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
  }

})
