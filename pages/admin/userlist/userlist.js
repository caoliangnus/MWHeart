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

    loading: false,
    
    isModifyUser: false,
    isAllUserList: false,
    isVolunteerList: false,
    isWaitingList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    getList();

    //Determine which list to open
    var isAllUserList = options.isAllUserList == "true" ? true : false;
    var isVolunteerList = options.isVolunteerList == "true" ? true : false;
    var isWaitingList = options.isWaitingList == "true" ? true : false;
    var eventId = options.eventId;

    this.setData({
      isAllUserList: isAllUserList,
      isVolunteerList: isVolunteerList,
      isWaitingList: isWaitingList,
      eventId: eventId,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getList();
  },

  noneWindows: function () {
    that.setData({
      isModifyUser: ""
    })
  },

  //Delete User After clicked Delete Button
  deleteUserBtnClick: function (event) {
    deleteUser()
  },


  //Open form after clicked Edit button
  modifyUserBtnClick: function (event) {
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
  modifyUserForm: function (e) {
    var t = this;
    modify(t, e)
  },
})

/**
 * Delete User from list
 */
function deleteUser() {
  var id = event.target.dataset.id;
  wx.showModal({
    title: 'Alert',
    content: 'Delete User？',
    success: function (res) {
      if (res.confirm) {
        //delete user
        var User = Bmob.Object.extend("user");
        var query = new Bmob.Query(User);
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
}

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
      console.log("*****UserListPage: Start loading User List from BMOB *****");
      console.log(results);
      console.log("*****UserListPage: End loading User List from BMOB *****");
      app.globalData.userList = results;
      that.setData({
        userList: results,
        loading: false,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

/**
 * Upload data to BMob after clicked submit button on ModifyForm
 */

function modify() {
  //Edit User
  var modyName = e.detail.value.name;
  var modyPhone = Number(e.detail.value.phone);
  var thatName = that.data.nowName;
  var thatPhone = Number(that.data.nowPhone);

  if ((modyName != thatName || modyPhone != thatPhone)) {
    if (modyName == "" || modyPhone == "") {
      Show.showAlert(that, "warn", 'Name or Phone can not be empty');
    } else if (!isPhoneValid(modyPhone)) {
      Show.showAlert(that, "warn", 'Phone must be 8 digits only');
    }
    else {
      that.setData({ loading: true })
      var Diary = Bmob.Object.extend("user");
      var query = new Bmob.Query(Diary);

      query.get(that.data.nowId, {
        success: function (result) {
          result.set('realName', modyName);
          result.set('phone', modyPhone);
          result.save();
          common.showTip('Success', 'success', function () {
            that.onShow();
            that.setData({
              isModifyUser: false,
              loading: false,
            })
            console.log("*****UserListPage: End uploading Edited UserInfo to Bmob *****");
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

function isPhoneValid(phoneNum) {
  //Phone length must be 8 and must be num only
  return Number.isInteger(phoneNum) && phoneNum >= 0 && phoneNum.toString().length == 8;
}