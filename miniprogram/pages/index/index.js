const app = getApp()
const db = wx.cloud.database()
const size = 2

Page({

  data: {
    openid: '',
    count: 0,
    items: [],
    isRefreshing: false,
    hasMore: true,
    isLoadingMore: false
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    this.setData({
      page: 0
    })
    this.loadData()
  },

  onPullDownRefresh: function () {
    wx.startPullDownRefresh()
  },

  onPullDownRefresh: function () {
    if (this.data.isRefreshing || this.data.isLoadingMore) {
      return
    }
    this.setData({
      page: 0,
      isRefreshing: true
    })
    this.loadData()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMore || !this.data.hasMore) {
      return
    }
    this.setData({
      page: this.data.page + 1,
      isLoadingMore: true
    })
    this.loadMoreData()
  },

  loadData: function () {
    const page = this.data.page;
    wx.cloud.callFunction({
      name: 'query',
      data: {
        collection: "works",
        page: page,
        size: size
      }
    }).then(res => {
      const result = res.result
      this.setData({
        count: result.count,
        items: result.data,
        hasMore: result.hasMore,
        isRefreshing: false
      })
    })
  },

  loadMoreData: function () {
    const page = this.data.page;
    this.setData({
      isLoadingMore: false
    })
    wx.cloud.callFunction({
      name: 'query',
      data: {
        collection: "works",
        page: page,
        size: size
      }
    }).then(res => {
      const result = res.result
      const moreItems = result.data
      if (moreItems && moreItems.length > 0) {
        this.setData({
          items: this.data.items.concat(moreItems),
        })
      }
      this.setData({
        count: result.count,
        hasMore: result.hasMore,
        isRefreshing: false
      })
    })
  }

})