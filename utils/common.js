function showTip(sms, icon, fun, t) {
    if (!t) {
        t = 1000;
    }
    wx.showToast({
        title: sms,
        icon: icon,
        duration: t,
        success: fun
    })
}

function showModal(c,t,fun) {
    if(!t)
        t='Notice'
    wx.showModal({
        title: t,
        content: c,
        showCancel:false,
        success: fun
    })
}

function showAlert(that, iconType, alertlable) {
  that.setData({
    isAlert: true,
    iconType: iconType,
    alertLable: alertlable
  });
  setTimeout(function (e) {
    that.setData({
      isAlert: false
    })
  }, 1000)
}

module.exports.showTip = showTip;
module.exports.showModal = showModal;
