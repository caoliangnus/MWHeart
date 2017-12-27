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
    eventDescription: "",
    bonusDescription: "",
    bonusArray: [],
    time: "",
    location: "",

    autoplay:false,
    curIndex:0,

    //Moral welfare home 301 henderson road
    markers: [{
      latitude: 1.272070,
      longitude: 103.812195,
      scale: 28,
      name: 'Moral Welfare Home'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    getEventList();
    setUpContent();
    this.setData({
      autoplay:true,
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchTopThreePosts(); //获取轮播图的3篇文章
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
  //首页切换图片
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
  click_activity:function(e) {
    var objectId = e.target.dataset.id;
    console.log(objectId);
    wx.navigateTo({
      url: '../eventDetail/eventDetail?isMyEvent=true&objectId=' + objectId,  
    })
  },
  //获取轮播图的文章,点赞数最多的前3个
  fetchTopThreePosts: function () {
    var molist = new Array();
    var Event = Bmob.Object.extend("event");
    var query = new Bmob.Query(Event);
    //Select past event
    var yesterday = util.formatTime(new Date(new Date().setDate(new Date().getDate() - 1)));
    query.equalTo("date", { "$lte": { "__type": "Date", "iso": yesterday } });
    query.limit(3);
    query.find({
      success: function (results) {
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          var id = results[i].id;
          var createdAt = results[i].createdAt;
          var _url
          var actpic = results[i].get("pic");
          if (actpic) {
            _url = results[i].get("pic")._url;
          } else {
            _url = "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/01/89a6eba340008dce801381c4550787e4.png";
          }

          var jsonA;
          jsonA = {
            "id": id || '',
            "actPic": _url || '',
          }
          molist.push(jsonA);
        }
        that.setData({
          postsShowSwiperList: molist
        })
      },
      error: function (error) {
        console.log(error)
      }
    })
  },
})

function setUpContent() {
  that.setData({
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

