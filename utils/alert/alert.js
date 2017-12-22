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
  }, 1500)
}

module.exports.showAlert = showAlert;