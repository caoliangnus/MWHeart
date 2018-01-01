var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');  // Initialize cloud server Bmob
const app = getApp(); //get app instance
var that;

var curIndex = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    eventDesc: null,
    bonusArray: [],
    time: null,
    location: null,
    whatWeDo:null,

    autoplay: false,
    curIndex: 0,
    postsShowSwiperList: [
      "http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/a712a0bb4013e73080e3700f3f35dc20.jpg", "http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/b180e0824004dd6580adece2aca64da2.jpeg", "http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/023c52924012f954806e99a0a26a79e3.png", "http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/5d77378240eec6e380ce5f4f55b96fea.jpeg",
    ],

    isShowingDetails: false,

    //Moral welfare home 301 henderson road
    markers: [{
      latitude: 1.272070,
      longitude: 103.812195,
      scale: 28,
      name: 'Moral Welfare Home'
    }],
  },

  onShow: function (options) {
    that = this;
    getEventList();
    setUpContent();
    that.setData({
      autoplay: true,
    })
  },
  onPullDownRefresh: function () {
    that.onShow()
  },

  click: function (e) {
    wx.openLocation({
      latitude: 1.272070,
      longitude: 103.812195,
      scale: 24,
      name: 'Moral Welfare Home',
      address: '301 henderson road'
    })
  },
  //Swiper 
  onSwiperChange: function (event) {
    curIndex = event.detail.current
    this.changeCurIndex()
  },
  changeCurIndex: function () {
    this.setData({
      curIndex: curIndex
    })
  },
  onHide: function () {
    this.setData({
      autoplay: false
    })
  },
  click_activity: function (e) {
    var objectId = e.target.dataset.id;
    console.log(objectId);
    wx.navigateTo({
      url: '../eventDetail/eventDetail?isMyEvent=true&objectId=' + objectId,
    })
  },
  showProjectDetails: function (e) {
    this.setData({
      isShowingDetails: false
    });
  }

})

function setUpContent() {
  that.setData({
    eventDesc: app.globalData.eventDesc,
    bonusArray: app.globalData.bonusArray,
    time: app.globalData.time,
    location: app.globalData.location,
    whatWeDo: app.globalData.whatWeDo,
  })
}

/*
* Get Past Event Detail from Bmob
*/
function getEventList() {
  that.setData({ loading: true });
  var Event = Bmob.Object.extend("event");
  var event = new Bmob.Query(Event);
  //Select past event
  var yesterday = util.formatTime(new Date(new Date().setDate(new Date().getDate() - 1)));
  event.equalTo("date", { "$lte": { "__type": "Date", "iso": yesterday } });
  event.descending('date');
  event.find({
    success: function (results) {
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

function getEventLocation() {
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 28
      })
    }
  })
}

