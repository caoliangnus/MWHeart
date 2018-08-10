var util = require('../../../utils/util.js');
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var that;
const app = getApp(); //get app instance

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    auto: false
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
    that = this;
    //getAutoCreate();
    that.setData({
      auto: getApp().globalData.auto
    })
  },

  autoEventBtnClick: function (e) {
    if (that.data.auto) {
      that.setData({
        auto: false
      })
      
    } else {
      that.setData({
        auto: true
      })

    }

    getApp().globalData.auto = that.data.auto

    saveAutoCreate()  
  }

})

function saveAutoCreate() {

  var Event = Bmob.Object.extend("ifAutoUpdate");
  var event = new Bmob.Query(Event);

  event.first({
    success: function (object) {
      console.log(object)
      object.set('ifAutoUpdate', that.data.auto);
      object.save()

      wx.showToast({
        title: 'Success',
        icon: 'success',
        duration: 1000
      })
    },
    error: function (err) {
      console.log(err.code, err.message)
    }
  });
}

