//get app instance
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventDescription: "Moral Welfare House是NUS Volunteer Action Committee" +
    "旗下的一个volunteer project",
    bonusDescription: "参与活动认真积极的同学下学期可升级为project director，" + 
    "获得更多福利，提升leadership skills, 甚至享受pgp保房特权。",
    bonusArray: [{
        msg: "方便日积月累攒CIP"
    }, {
        msg: "活动轻松，不占用太多时间"
    }, {
        msg: "时间固定，地点方便"
    }, {
        msg: "活动有趣又有爱"
    }, {
        msg: "后续更多福利"
    }],
    time: "Every Saturday 2pm - 4pm",
    location: "Moral Welfare House",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("Home is ready" + ". Window opened: " + getCurrentPages().length);
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

  }
})
