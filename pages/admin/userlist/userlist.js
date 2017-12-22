var userDataList = require("../../../utils/fakeData.js");
var util = require("../../../utils/util.js")
var common = require("../../../utils/common.js")
var Show = require("../../../utils/alert/alert.js");
var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    eventDate: "",
    isLoading: false,
    isModifyUser: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //Get userInfo
    that.setData({
      userInfo: getApp().globalData.userInfo
    })

    getList(this);

    //Update Data
    var isAllUserList = options.isAllUserList == "true" ? true : false;
    var isVolunteerList = options.isVolunteerList == "true" ? true : false;
    var isWaitingList = options.isWaitingList == "true" ? true : false;
    var eventDate = "";
    if (isVolunteerList || isWaitingList) {
      eventDate = options.date;
    }

    this.setData({
      isAllUserList: isAllUserList,
      isVolunteerList: isVolunteerList,
      isWaitingList: isWaitingList,
      eventDate: eventDate,
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
    getList(this);
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

  noneWindows: function () {
    that.setData({
      isModifyUser: ""
    })
  },

  //Delete User After clicked Delete Button
  deleteUser: function (event) {
    var id = event.target.dataset.id;
    wx.showModal({
      title: 'Alert',
      content: 'Delete User？',
      success: function (res) {
        if (res.confirm) {
          //delete user
          var Diary = Bmob.Object.extend("user");
          //创建查询对象，入口参数是对象类的实例
          var query = new Bmob.Query(Diary);
          query.equalTo("objectId", id);
          query.destroyAll({
            success: function () {
              common.showTip('Success');
              that.onShow();
            },
            error: function (err) {
              common.showTip('Fail', 'loading');
            }
          });
        }
      }
    })
  },


  //Open form after clicked Edit button
  toModifyUser: function (event) {
    var nowId = event.target.dataset.id;
    var nowName = event.target.dataset.name;
    var nowPhone = event.target.dataset.phone;
    that.setData({
      isModifyUser: true,
      nowId: nowId,
      nowName: nowName,
      nowPhone: nowPhone
    })
  },

  //Form for modifying user
  modifyUser: function (e) {
    var t = this;
    modify(t, e)
  },
})



/*
* Get Event Detail from Bmob
*/
function getList(t, k) {
  that = t;
  var User = Bmob.Object.extend("user");
  var user = new Bmob.Query(User);
  user.ascending('updatedAt');
  user.find({
    success: function (results) {
      console.log(results);
      app.globalData.userList = results;
      that.setData({
        userList: results,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}


//Upload data to BMob after clicked submit button on ModifyForm
function modify(t, e) {
  var that = t;
  //Edit User
  var modyName = e.detail.value.name;
  var modyPhone = Number(e.detail.value.phone);
  var thatName = that.data.nowName;
  var thatPhone = Number(that.data.nowPhone);

  if ((modyName != thatName || modyPhone != thatPhone)) {
    if (modyName == "" || modyPhone == "") {
      Show.showAlert(that, "warn", 'Name or Phone can not be empty');
    }else if(!isPhoneValid(modyPhone)){
      Show.showAlert(that,"warn" ,'Phone must be 8 digits only');
    }
    else {
      console.log(modyName, modyPhone)
      var Diary = Bmob.Object.extend("user");
      var query = new Bmob.Query(Diary);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(that.data.nowId, {
        success: function (result) {
          console.log(result);
          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('realName', modyName);
          result.set('phone', modyPhone);
          result.save();
          common.showTip('Success', 'success', function () {
            that.onShow();
            that.setData({
              isModifyUser: false
            })
          });
        },
        error: function (object, error) {

        }
      });
    }
  }
  else if (modyName == "" || modyPhone == "") {
    Show.showAlert(that, "warn", 'Name or Phone can not be empty');
  }
  else {
    that.setData({
      isModifyUser: false
    })
    common.showTip('Success', 'success');
  }
}

function isPhoneValid(phoneNum){
  //Phone length must be 8 and must be num only
  return Number.isInteger(phoneNum) && phoneNum >= 0 && phoneNum.toString().length == 8;
}