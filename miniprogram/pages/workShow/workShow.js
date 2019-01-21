const app = getApp()

Page({

  data: {},

  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  }

})