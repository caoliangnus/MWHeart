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

    userList:null,
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

    if(isVolunteerList) {
      getVolunteerList();
    } else if(isWaitingList) {
      getWaitingList();
    }else{
      getList(this);
    }
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (that.data.isAllUserList) {
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
    deleteUser(event)
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

  /**For Animation */
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            isModifyUser: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          isModifyUser: true
        }
      );
    }
  }  
})

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
  phoneNum = Number(phoneNum);
  //Phone length must be 8 and must be num only
  return Number.isInteger(phoneNum) && phoneNum >= 0 && phoneNum.toString().length == 8;
}

function getVolunteerList() {
  that.setData({ loading: true })
  //One user for One Event
  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  var eventId = that.data.eventId;
  query.equalTo("event", eventId);
  query.equalTo("status", 1)
  query.ascending('updatedAt');
  query.include("user");
  var userList = [];
  query.find({
    success: function (results) {
      for (var i = 0; i < results.length; i++) {
        userList = userList.concat(results[i].attributes.user);
      }
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

function getWaitingList() {
  that.setData({ loading: true })
  //One user for One Event
  var P = Bmob.Object.extend("p");
  var query = new Bmob.Query(P);
  var eventId = that.data.eventId;
  query.equalTo("event", eventId);
  query.equalTo("status", 0)
  query.ascending('updatedAt');
  query.include("user");
  var userList = [];
  query.find({
    success: function (results) {
      for (var i = 0; i < results.length; i++) {
        userList = userList.concat(results[i].attributes.user);
      }
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