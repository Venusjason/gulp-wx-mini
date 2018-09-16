module.exports = {
  root: true,
  plugins: ['html', 'vue'],
  "settings": {
    "html/html-extensions": [".html", ".wxml", ".xml"],
    "html/report-bad-indent": "error",
  },
  env: {
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 7
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    // 关闭语句强制分号结尾
    semi: [0],
    'no-console': 0,
    "generator-star-spacing": 0,//生成器函数*的前后空格
    "require-yield": 0,//生成器函数必须有yield
  },
  globals: {
    getApp: false,
    Page: false,
    wx: false,
    App: false,
    getCurrentPages: false,
    Component: false
  }
};
