const app = getApp()
const dateUtil = require('../../utils/dateUtil.js')
const db = wx.cloud.database()

Page({

  data: {
    hasUserInfo: false,
    userInfo: {},
    avatarUrl: '../../images/me/avatar.png'
  },

  onLoad: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              app.globalData.hasUserInfo = true
              app.globalData.userInfo = res.userInfo
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              this.setData({
                hasUserInfo: true,
                userInfo: res.userInfo,
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
  },

  getUserInfo: function(e) {
    if (!this.hasUserInfo && e.detail.userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: e.detail.userInfo,
        avatarUrl: e.detail.userInfo.avatarUrl
      })
    }
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        this.setData({
          openid: app.globalData.openid
        })
      }
    })
  },

  queryMyWorks: function(options) {
    db.collection('works').where({
      _openid: app.globalData.openid,
    }).get({
      success: res => {
        app.globalData.items = res.data
        wx.navigateTo({
          url: '../work/work'
        })
      }
    })
  },

  doUpload: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        const uploadDate = new Date()
        const extension = filePath.match(/\.[^.]+?$/)[0]
        const baseName = app.globalData.openid + '-' + dateUtil.formatDate(uploadDate)
        const cloudPath = baseName + extension
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            app.globalData.fileID = res.fileID
            db.collection('works').add({
              data: {
                cloudPath: app.globalData.fileID,
                nickName: app.globalData.userInfo.nickName,
                gender: app.globalData.userInfo.gender,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                createDate: uploadDate,
                displayCreateDate: dateUtil.formatDisplayDate(uploadDate)
              },
              success: res => {
                this.setData({
                  id: res._id
                })
              }
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    })
  }

})