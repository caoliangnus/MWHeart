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

    userList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    if (that.data.isVolunteerList) {
      getVolunteerList();
    } else if (that.data.isWaitingList) {
      getWaitingList();
    } else {
      getList();
    }
    
  },

  noneWindows: function () {
    that.setData({
      isModifyUser: ""
    })
  },

  //Delete User After clicked Delete Button
  deleteUserBtnClick: function (event) {
    if (that.data.isAllUserList){
      deleteUser(event);
    }else{
      deleteUserFromEvent(event);
    }
    
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
    modify(e)
  },

  moveBtnClick: function (event) {
    moveUser(event);
  }
})

function moveUser(event) {
  var userId = event.target.dataset.id;
  wx.showModal({
    title: 'Alert',
    content: 'Move User to Volunteer List？',
    success: function (res) {
      if (res.confirm) {
        that.setData({ loading: true })
        //modify user
        var P = Bmob.Object.extend("p");
        var query = new Bmob.Query(P);
        var eventId = that.data.eventId;
        console.log(eventId);
        query.equalTo("event", eventId);
        query.equalTo("user", userId);
        query.first({
          success: function (object) {
            var participationId = object.id
            console.log("participation id for candidate: " + participationId)

            // Update status of candidate to 1
            var P2 = Bmob.Object.extend("p");
            var query2 = new Bmob.Query(P2);
            query2.get(participationId, {
              success: function (result) {
                // Change status to be in volunteer list
                result.set('status', 1);
                result.save().then(function() {
                  that.onShow();
                });

                console.log("Put candidate into volunteer list")
                common.showTip('Success');
                
              },
              error: function (object, error) {
                console.log(error.code, error.message)
                that.setData({ loading: false })
              }
            });
          },
          error: function (err) {
            console.log(err.code, err.message)
            that.setData({ loading: false })
          }
        });
      }
    }
  })
}

/**
 * Delete User from list
 */
function deleteUser(event) {
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
            that.setData({ loading: false })
          }
        });
      }
    }
  })
}

function deleteUserFromEvent(event) {
  var userId = event.target.dataset.id;
  wx.showModal({
    title: 'Alert',
    content: 'Delete User from Event？',
    success: function (res) {
      if (res.confirm) {
        that.setData({ loading: true })
        //delete user
        var P = Bmob.Object.extend("p");
        var query = new Bmob.Query(P);
        var eventId = that.data.eventId;
        console.log(eventId);
        query.equalTo("event", eventId);
        query.equalTo("user", userId);
        query.limit(1);

        query.destroyAll({
          success: function () {
            common.showTip('Success');
            that.onShow();
            that.setData({ loading: false })
          },
          error: function (err) {
            common.showTip('Fail', 'loading');
            that.setData({ loading: false })
          }
        });
      }
    }
  })
}

/*
* Get Event Detail from Bmob
*/
function getList() {
  var User = Bmob.Object.extend("user");
  var user = new Bmob.Query(User);
  user.ascending('updatedAt');
  user.find({
    success: function (results) {
      var i;
      for (i = 0; i < results.length; i++) {
        getUserCIPHour(results[i].id, results[i], function (user, CIP) {
          var userPlusCIP = [{ user: user, CIP: CIP }]
          that.setData({
            userList: that.data.userList.concat(userPlusCIP),
          })
        })        
      }
      that.setData({
        loading: false,
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getUserCIPHour(userId, user, f) {

  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);

  query.equalTo("user", userId);
  query.equalTo("status", 1);

  query.include("event");
  query.include("user");

  query.find({
    success: function (results) {
      var cipHour = 0;
      for (var i = 0; i < results.length; i++) {
        var dateString = String(results[i].attributes.event.attributes.date);
        dateString = dateString.replace(/-/g, '/');
        var eventDate = new Date(dateString);
        var today = new Date();
        today.setDate(today.getDate() - 1);

        if (eventDate <= today) {
          cipHour += results[i].attributes.event.attributes.duration;
        }
      }
      f(user, cipHour);
      
    },
    error: function (error) {
      that.setData({
        loading: false
      })
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

/**
 * Upload data to BMob after clicked submit button on ModifyForm
 */

function modify(e) {
  //Edit User
  var modyName = e.detail.value.name;
  var modyPhone = e.detail.value.phone;
  var thatName = that.data.nowName;
  var thatPhone = Number(that.data.nowPhone);

  if ((modyName != thatName || modyPhone != thatPhone)) {
    if (modyName == "" || modyPhone == "") {
      Show.showAlert(that, "warn", 'Name or Phone can not be empty');
    } else if (!isPhoneValid(modyPhone)) {
      Show.showAlert(that, "warn", 'Phone must be 8 digits only');
    } else {
      that.setData({ loading: true })
      var User = Bmob.Object.extend("user");
      var query = new Bmob.Query(User);

      query.get(that.data.nowId, {
        success: function (result) {
          result.set('realName', modyName);
          result.set('phone', modyPhone);
          result.save().then(function (result) {
            common.showTip('Success', 'success', function () {
              that.onShow();
              that.setData({
                isModifyUser: false,
                loading: false,
              })
              console.log("*****UserListPage: End uploading Edited UserInfo to Bmob *****");
            });
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
  phoneNum = Number(phoneNum);
  //Phone length must be 8 and must be num only
  return Number.isInteger(phoneNum) && phoneNum >= 0 && phoneNum.toString().length == 8;
}

function getUserList(type) {
  that.setData({ loading: true })
  //One user for One Event
  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  var eventId = that.data.eventId;
  query.equalTo("event", eventId);
  query.equalTo("status", type)
  query.ascending('updatedAt');
  query.include("user");
  var userList = [];
  query.find({
    success: function (results) {
      for (var i = 0; i < results.length; i++) {
        var item = results[i].attributes.user;
        userList = userList.concat(item);
      }
      console.log(userList)
      that.setData({
        userList: userList,
        loading: false
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getVolunteerList() {
  getUserList(1);
}

function getWaitingList() {
  getUserList(0);
}
