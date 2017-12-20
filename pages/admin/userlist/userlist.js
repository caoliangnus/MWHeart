var userDataList = require("../../../utils/fakeData.js");

var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userList: userDataList.dataList,
    eventDate:"",
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

    //Update Data
    var isAllUserList = options.isAllUserList=="true"?true:false;
    var isVolunteerList = options.isVolunteerList=="true" ? true : false;
    var isWaitingList = options.isWaitingList=="true" ? true : false;
    var eventDate = "";
    if(isVolunteerList || isWaitingList){
      eventDate = options.date;
    }
    
    this.setData({
      isAllUserList: isAllUserList,
      isVolunteerList: isVolunteerList,
      isWaitingList: isWaitingList,
      eventDate : eventDate,
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
    //getList(this);
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
          query.equalTo("id", id);
          query.destroyAll({
            success: function () {
              common.showTip('Delete User Success');
              that.onShow();
            },
            error: function (err) {
              common.showTip('Delete User Fail', 'loading');
            }
          });
        }
      }
    })
  },


  toModifyUser: function (event) {
    var nowId = event.target.dataset.id;
    var nowName = event.target.dataset.name;
    var nowStatus = event.target.dataset.status;
    that.setData({
      isModifyUser: true,
      nowId: nowId,
      nowName: nowName,
      nowStatus: nowStatus
    })
  },
  modifyUser: function (e) {
    var t = this;
    modify(t, e)
  },


})

/*
* 获取数据
*/
function getList(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("user");
  var query = new Bmob.Query(Diary);

  query.equalTo("name", k);

  query.descending('createdAt');
  query.include("own")
  // 查询所有数据
  query.limit(that.data.limit);
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        userList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function modify(t, e) {
  var that = t;
  //Edit User
  var modyId = e.detail.value.id;
  var modyName = e.detail.value.name;
  var modyStatus = e.detail.value.status;
  var thatName = that.data.nowName;
  var thatStatus = that.data.nowStatus;
  if ((modyName != thatName || modyStatus != thatStatus)) {
    if (modyName == "" || modyStatus == "") {
      common.showTip('Name or Status can not be empty', 'isLoading');
    }
    else {
      console.log(modyName, modyStatus)
      var Diary = Bmob.Object.extend("user");
      var query = new Bmob.Query(Diary);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(that.data.nowId, {
        success: function (result) {

          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('name', modyName);
          result.set('status', modyStatus);
          result.save();
          common.showTip('User Updated', 'success', function () {
            that.onShow();
            that.setData({
              modifyDiarys: false
            })
          });

          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  }
  else if (modyTitle == "" || modyContent == "") {
    common.showTip('标题或内容不能为空', 'isLoading');
  }
  else {
    that.setData({
      modifyDiarys: false
    })
    common.showTip('修改成功', 'isLoading');
  }
}