const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    openid: '',
    items: [],
    isRefreshing: false,
    hasMoreData: true,
    isLoadingMoreData: false
  },

  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    this.setData({
      pageNum: 0
    })
    this.loadData()
  },

  onPullDownRefresh: function() {
    wx.startPullDownRefresh()
  },

  onPullDownRefresh: function() {
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      pageNum: 0,
      isRefreshing: true
    })
    this.loadData()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    this.setData({
      pageNum: this.data.pageNum + 1,
      isLoadingMoreData: true
    })
    this.loadMoreData()
  },

  loadData: function() {
    const pageNum = this.data.pageNum;
    db.collection('works').where({}).get({
      success: res => {
        this.setData({
          items: res.data,
          isRefreshing: false
        })
      }
    })
  },

  loadMoreData: function() {
    const pageNum = this.data.pageNum;
    this.setData({
      isLoadingMoreData: false
    })
    db.collection('works').where({}).get({
      success: res => {
        moreItems = res.data
        if (moreItems.length != 0) {
          this.setData({
            items: this.data.items.concat(moreItems)
          })
        }
      }
    })
  }

})