var userDataList = require("../../../utils/fakeData.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: userDataList.dataList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isAllUserList = options.isAllUserList=="true"?true:false;
    var isVolunteerList = options.isVolunteerList=="true" ? true : false;
    var isWaitingList = options.isWaitingList=="true" ? true : false;
    
    this.setData({
      isAllUserList: isAllUserList,
      isVolunteerList: isVolunteerList,
      isWaitingList: isWaitingList,
    })
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
    console.log("List is ready" + ". Window opened: " + getCurrentPages().length);
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

})