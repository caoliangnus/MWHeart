var util = require('../../../utils/util.js');
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var util = require('../../../utils/util.js');
var Show = require("../../../utils/alert/alert.js");
const app = getApp(); //get app instance
var that;
var saturday = null;
var file = null;




Page({

  /**
   * 页面的初始数据
   */
  data: {

    eventName: "MWH(Moral Welfare Home)",
    contactPD: {
      name: "Chen Xiaoman",
      phone: "98643467",
      weChatID: "Chen Xiaomann"
    },
    terms: [
      {
        q: "When & where to gather?",
        a: "Please gather at Kent Ridge MRT station entrance (near the ATM machine) at 12:15 pm on the day of event you've signed up."
      },
      {
        q: "Do not pay for the residents",
        a: "Every resident going out with us already has 5 or 10 dollars given by MWH. This money is for lunch and shopping. Volunteers only need to assist them to pay by their own money."
      },
      {
        q: "Safety first",
        a: "A staff from MWH will go along with us. Please approach the staff or porject director if you encounter any problem (e.g. difficulty in understanding the resident)."
      },
      {
        q: "Be patient",
        a: "Some of the residents have mental illness. Talking with them using sign language would be useful sometimes."
      }
    ],

    eventDesc: [{
      p: "Moral Welfare Home (MWH) is a volunteer project under NUS Volunteer Action Committee (NVAC)."
    }, {
      p: "MWH is also the name of the purpose built Home that cares for destitute residents suffering from multiple disabilities, where we do our service."
    }],
    time: "Every Saturday 1pm - 3pm",

    location: "Moral Welfare Home. Near Telok Blangah MRT station which is only 4 stops away from Kent Ridge MRT station.",

    whatWeDo: [{
      p: "志愿者们会推着老人的轮椅带他们在附近food center吃饭，附近小店里购物。"
    }, {
      p: "活动轻松，不需要过重的体力劳动或脑力活动。而且老人吃饭的时候义工们也能吃饭，不占用午饭时间；老人们购物时义工们也能顺便把自己生活必需品买了，为自己的生活也提供了便利。"
    }, {
      p: "这是个能收获友谊和人脉，收获欢乐与笑声的地方，想要一个有趣又有爱的活动的你一定不能错过。"
    }],
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

    // Translate into English
    // whatWeDo: [{
    //   p: "Volunteers push the wheelchair-bound elderly out for shopping and having lunch together at the nearby shopping centre."
    // }, {
    //     p: "It is a relatively easy activity that does not need too much physical or mental efforts. When elderly are eating or shopping, volunteers can also enjoy their lunch or buy their necessities."
    // }, {
    //     p: "It is a place where you can reap the friendship and connections, the joy and laughter, and you must not miss this fun and friendly event."
    // }],
    // bonusArray: [{
    //   msg: "The CIP hours distribute to all volunteers."
    // }, {
    //     msg: "The activities are comfortable and do not take up too much time."
    // }, {
    //     msg: "The activity time is fixed on every Saturday."
    // }, {
    //     msg: "The activity location is convenient."
    // }, {
    //     msg: "The activities spread kindness and fun to participate."
    // }, {
    //     msg: "Hard-working and active volunteers will promote to project director next semester. A project director can enjoy the benefits of developing leadership skills as well as staying in PGP in the following semester."
    // }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getDescription();
  },

  //Submit form
  submitForm: function (e) {
    updateDescription(e)
  },

})


function updateDescription(e) {
  that.setData({ loading: true })
  // Event information
  var eventName = e.detail.value.name;
  var name = e.detail.value.contact1;
  var phone = e.detail.value.contact2;
  var weChatID = e.detail.value.contact3;
  var contactPD = {
    name: name,
    phone: phone,
    weChatID: weChatID
  }
  var terms = getTerms(e);
  var eventDesc = getEventDesc(e);
  var time = e.detail.value.time;
  var location = e.detail.value.location;
  var whatWeDo = getWhatWeDo(e);
  var bonusArray = getBonus(e);

  //Upload Description info to Bmob
  var Description = Bmob.Object.extend("desc");
  var description = new Description(); //For create desc Table on Bmob


  description.save({
    eventName: eventName,
    contactPD: contactPD,
    terms: terms,
    eventDesc: eventDesc,
    time: time,
    location: location,
    whatWeDo: whatWeDo,
    bonusArray: bonusArray
  }, {
      success: function (result) {
        that.setData({ loading: false })
        getApp().globalData.eventName = eventName;
        getApp().globalData.contactPD = contactPD;
        getApp().globalData.terms = terms;
        getApp().globalData.eventDesc = eventDesc;
        getApp().globalData.time = time;
        getApp().globalData.location = location;
        getApp().globalData.whatWeDo = whatWeDo;
        getApp().globalData.bonusArray = bonusArray;
        common.showTip('Success');
      },
      error: function (result, error) {
        common.showTip('Fail');
        console.log("failed to create event", error)
      }
    })
}

function getTerms(e) {
  var terms = [];

  var qa1 = {
    q: e.detail.value.tsq1,
    a: e.detail.value.tsa1,
  }

  var qa2 = {
    q: e.detail.value.tsq2,
    a: e.detail.value.tsa2,
  }

  var qa3 = {
    q: e.detail.value.tsq3,
    a: e.detail.value.tsa3,
  }

  var qa4 = {
    q: e.detail.value.tsq4,
    a: e.detail.value.tsa4,
  }

  terms = terms.concat(qa1, qa2, qa3, qa4);
  return terms;
}

function getEventDesc(e) {
  var eventDesc = [];

  var para1 = {
    p: e.detail.value.descp1,
  }

  var para2 = {
    p: e.detail.value.descp2,
  }
  eventDesc = eventDesc.concat(para1, para2);
  return eventDesc;
}

function getWhatWeDo(e) {
  var whatWeDo = [];

  var para1 = {
    p: e.detail.value.wedop1,
  }

  var para2 = {
    p: e.detail.value.wedop2,
  }

  var para3 = {
    p: e.detail.value.wedop3,
  }
  whatWeDo = whatWeDo.concat(para1, para2, para3);
  return whatWeDo;
}

function getBonus(e) {
  var bonusArray = [];

  var msg1 = {
    msg: e.detail.value.bonus1,
  }

  var msg2 = {
    msg: e.detail.value.bonus2,
  }

  var msg3 = {
    msg: e.detail.value.bonus3,
  }

  var msg4 = {
    msg: e.detail.value.bonus4,
  }

  var msg5 = {
    msg: e.detail.value.bonus5,
  }

  var msg6 = {
    msg: e.detail.value.bonus6,
  }
  bonusArray = bonusArray.concat(msg1, msg2, msg3, msg4, msg5, msg6);
  return bonusArray;
}

function getDescription() {
  that.setData({ loading: true })
  var Description = Bmob.Object.extend("desc");
  var description = new Bmob.Query(Description);

  description.descending("updatedAt");

  description.first({
    success: function (results) {
      if (typeof (results) !="undefined") {
        console.log(results);
        that.setData({
          loading: false,
          //Load Event information
          eventName: results.attributes.eventName,
          contactPD: results.attributes.contactPD,
          terms: results.attributes.terms,
          eventDesc: results.attributes.eventDesc,
          time: results.attributes.time,
          location: results.attributes.location,
          whatWeDo: results.attributes.whatWeDo,
          bonusArray: results.attributes.bonusArray
        })
      }
    },
    error: function (object, error) {
      // 查询失败
    }
  });
}

