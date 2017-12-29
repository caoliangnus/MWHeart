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

    autoplay: false,
    curIndex: 0,
    postsShowSwiperList: [
"http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/a712a0bb4013e73080e3700f3f35dc20.jpg",      "http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/b180e0824004dd6580adece2aca64da2.jpeg",     "http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/023c52924012f954806e99a0a26a79e3.png",   "http://bmob-cdn-15793.b0.upaiyun.com/2017/12/29/5d77378240eec6e380ce5f4f55b96fea.jpeg",
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    getEventList();
    setUpContent();
    this.setData({
      autoplay: true,
    })
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

function setUpContent(){
that.setData({
  eventDescription: "Moral Welfare Home (MWH) is a volunteer project under NUS Volunteer Action Committee (NVAC). ",
  eventDescription2: "MWH is also the name of the purpose built Home that cares for destitute residents suffering from multiple disabilities, where we do our service.",
  bonusArray: [{
    msg: "方便日积月累攒CIP"
  }, {
    msg: "活动轻松，不占用太多时间"
  }, {
    msg: "时间固定"
  }, {
    msg: "地点方便"
  }, {
    msg: "活动有趣又有爱"
  }, {
      msg: "福利: 参与活动认真积极的同学下学期可升级为project director, 提升leadership skills, 甚至享受pgp保房特权。"
  }],
  time: "Every Saturday 1pm - 3pm",
  location: "Moral Welfare Home. Near Telok Blangah MRT station which is only 4 stops away from Kent Ridge MRT station.",
  whatWeDo: "志愿者们会推着老人的轮椅带他们在附近food center吃饭，附近小店里购物。",
  whatWeDo2: "活动轻松，不需要过重的体力劳动或脑力活动。而且老人吃饭的时候义工们也能吃饭，不占用午饭时间；老人们购物时义工们也能顺便把自己生活必需品买了，为自己的生活也提供了便利。",
  whatWeDo3: "这是个能收获友谊和人脉，收获欢乐与笑声的地方，想要一个有趣又有爱的活动的你一定不能错过。"
})
}

/*
* Get Past Event Detail from Bmob
*/
function getEventList() {
  that.setData({loading:true});
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

function getEventLocation(){
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