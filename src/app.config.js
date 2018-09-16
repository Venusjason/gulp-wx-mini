const CONFIGS = {
  appId: '',
  appName: '项目名称',
  // App发布版本
  version: '',
  // 环境配置
  env: 'production',
  // 数据接口配置
  apiService: {
    mock: 'http://mock/api',
    debug: 'http://debug/api',
    test: 'http://test/api',
    production: 'https://production/api'
  },
  // 静态资源 例如图片存放的服务器
  assetsPaths: {
    production: 'http://xiaoy.fed.ywwl.com/weapp',
  },
};

module.exports = CONFIGS
