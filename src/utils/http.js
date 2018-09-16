const Fly = require('./../libs/fly.js')
const { ObjToQueryString } = require('./../utils/index.js')
const fly = new Fly() // 创建fly实例
const appConfig = require('./../app.config.js')

//配置请求基地址
fly.config.baseURL = appConfig.apiService[appConfig.env]
//添加拦截器
fly.interceptors.request.use((config) => {
  //给所有请求添加自定义header
  if (appConfig.env !== 'mock') {
    config.headers['X-TOKEN'] = getApp().globalData.token
  }
  // 对接口添加约定配置
  const addParams = {
    'platformType': 2, // 终端标识
  }
  const userLabel = getApp().globalData.userInfo.userLabel
  if (userLabel === 2 || userLabel === 4 || userLabel === '') { // 新人用户 带上上线的id
    Object.assign(addParams, getApp().globalData.parentShareParams)
  }
  config.url += config.url.indexOf('?') > -1 ? `&${ObjToQueryString(addParams)}` : `?${ObjToQueryString(addParams)}`
  // platformType
  return config
})

fly.interceptors.response.use((response) => {
  if (appConfig.env !== 'mock') {
    if (response.data.code === 1) {
      return response.data.data
    } else {
      wx.showToast({
        icon: 'none',
        title: response.data.msg || '数据异常',
        duration: 2000
      })
      return Promise.reject(response.data)
    }
  } else { // mock 直接返回
    return response.data.data
  }
}, (err) => {
  wx.showToast({
    icon: 'none',
    title: '服务器开小差了~',
    duration: 2000
  })
  return Promise.reject(err)
})

module.exports = {
  Fly: Fly, // 需要重新创建实例时使用
  Http: fly, // 通用
}