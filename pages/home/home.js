var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
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
    that = this;
    getEventList(this);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getEventList(this);
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


/*
* Get Past Event Detail from Bmob
*/
function getEventList(t, k) {
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  //Select past event
  var yesterday = util.formatTime(new Date(new Date().setDate(new Date().getDate() - 1)));
  event.equalTo("date", { "$lte": { "__type": "Date", "iso": yesterday } });
  event.descending('date');
  event.find({
    success: function (results) {
      console.log("***** EventListPage: Start loading Event Listfrom BMOB *****");
      console.log(results);
      console.log("***** EventListPage: End loading Event Listfrom BMOB *****");
      app.globalData.eventList = results;
      // Get pic url if the event image is not null
      that.setData({
        eventList: results,
        loading: false,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}