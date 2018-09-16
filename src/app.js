
App({
  onLaunch() {
    // Do something initial when launch.
  },
  onShow() {
    // Do something when show.
    this.updateToken('88888888888888')
    const token = wx.getStorageSync('token')
    this.globalData.token = token
  },
  onHide() {
    // Do something when hide.
  },
  onError() {
    // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  },
  onPageNotFound() {
    // 当要打开的页面并不存在时，会回调这个监听器
    console.log('路由404')
  },

  updateToken(token) {
    if (token) { // 存储
      wx.setStorageSync('token', token)
    } else { // 删除
      wx.removeStorageSync('token')
    }
    this.globalData.token = token
  },
  globalData: {
    token: '',
  }
})
