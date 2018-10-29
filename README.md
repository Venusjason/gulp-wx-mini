## gulp-wx-mini
>基于Gulp构建的微信小程序开发工作流


### 特性

+ 基于`gulp+less`构建的微信小程序工程项目
+ 项目图片`//CDN`路径自动替换
+ ESLint代码检查
+ 使用命令行快速创建`page`和`component` 
+ 集成mobx为状态管理
+ 使用fly.js做请求方案

### Getting Started

##### 0. 开始之前，请确保已经安装node和npm，全局安装gulp-cli
```
$ npm install --global gulp-cli
```
##### 1. 进目录，安装依赖
```
$ npm install
```
##### 3. 编译代码，生成dist目录，使用开发者工具打开dist目录
```
$ npm run dev
```
##### 4. 打开微信开发者工具，dist目录（先打开dist，再运行 dev 会报错，因为dev会清空dist一次，而此时dist文件夹被微信开发者工具占用）
##### 5. 新建page、component
```
  gulp auto -p mypage           创建名为mypage的page文件
  gulp auto -c mycomponent      创建名为mycomponent的component文件
  gulp auto -s index -p mypage  复制pages/index中的文件创建名称为mypage的页面
```
##### 5. 上传代码前编译压缩
```
$ npm run build
```
##### 6. 上传代码，审核，发版

* js/less/xml文件中的`//CDN`会被自动替换为 `app.config.js`配置的服务器路径
* 请在正式发包前将 images 文件夹整体放到认证过的服务器

### 编辑器配置

##### 1. vscode 支持（其他编辑器暂未处理）,安装`vetur` 利用vue的vetur 插件，识别`.xml`文件
##### 2. 文件 => 首选项 => 设置 => `"vetur.validation.template": false`, `files.associations: { "*.xml": "vue" }`
##### 3. .xml文件会被vscode识别的vue的高亮配置，可以在单xml文件内书写 .json/.wxml/.wxss/.js文件

### 与vue html代码片段互转

#### 1. 因为小程序基本只有两个标签`view`和`text`,所以请用`div`和`span/em`这几个标签开发vue部分代码，其他特殊标签与小程序无差别使用
#### 2. 事件`bind:tap`请统一使用`@click`，工具会自动编译成小程序的`bindtap`
#### 3. `image`请统一使用`img`，工具会自动编译成小程序需要的方式
#### 4. css书写时请不要使用标签选择器，正确的做法是每一个标签都有对应的class,暂不支持vue的动态class编译到小程序，需要手动处理差异
#### 5. 将vue代码复制到小程序、或者小程序代码复制到vue，都需要针对两个端的差异做特殊处理，需要开发者手动处理

#### 6. 如果wxml的原生写法，转换器不会做任何转换,but 不要使用`bind:tap`类的写法，please `bindtap`

| vue   |      wxml      |  是否支持 | 备注 |
|----------|:-------------:|------:|------:|
| :name="name"   | name="{{name}}" | Y |  |
| @click="onHandler" | bindtap="onHandler" | Y |  |
| v-for="list"   | wx:for="{{list}}" | N(待支持) | 不支持item,index定义 v-for="(item, i) in list" |
| v-if="isShow" | wx:if="{{isShow}}" | N(待支持) | |
| v-show="isShow" | wx:if="{{isShow}}" | N(待支持) |实际还是 wx:if |
| :key="key" | wx:key="key" | N(待支持) | |

### 工程结构
```
wx-miniprogram-boilerplate
├── dist         // 编译后目录
├── node_modules // 项目依赖
├── src
│    ├── components // 微信小程序自定义组件
│    ├── img     // 页面中的图片和icon 会被编译到dist
│    ├── images     // 页面中的图片和icon 不会被编译 需要同步到服务器
│    ├── pages      // 小程序page文件
│    │    ├── index      // 首页
│    ├── styles     // ui框架，公共样式
│    ├── utils      // 公共js文件
│    ├── app.js
│    ├── app.json
│    ├── app.less
│    ├── project.config.json // 项目配置文件
│    └── api.config.js       // 项目api接口配置
├── .gitignore
├── .eslintrc.js
├── package-lock.json
├── package.json
└── README.md

```
### Gulp说明

```
Tasks:
  dev              开发编译，同时监听文件变化
  build            整体编译

  clean            清空产出目录
  wxml             编译wxml文件（仅仅copy）
  js               编译js文件，同时进行ESLint语法检查
  json             编译json文件（仅仅copy）
  wxss             编译less文件为wxss
  img              编译压缩图片文件
  watch            监听开发文件变化
  
  auto             自动根据模板创建page,template或者component(小程序自定义组件)

gulp auto 

选项：
  -s, --src        copy的模板                     [字符串] [默认值: "_template"]
  -p, --page       生成的page名称                                       [字符串]
  -c, --component  生成的component名称                                  [字符串]
  --msg            显示帮助信息                                           [布尔]

示例：
  gulp auto -p mypage           创建名为mypage的page文件
  gulp auto -c mycomponent      创建名为mycomponent的component文件
  gulp auto -s index -p mypage  复制pages/index中的文件创建名称为mypage的页面
```

- **Q:** `_template`目录的文件有什么用？


  **A:** 使用`gulp auto`命令自动生成文件，`-s`参数可以指定copy的对象，默认情况下是以对应目录下文件夹为`_template`中的文件为copy对象的。开发者可以根据业务需求，自定义`_template`下的文件。


- **Q:** `_template`目录的文件是否会被编译到`dist`目录？


  **A:** 不会。

### 对mobx做的改动
#### 因为采用es6方法  class 会转成 proto，computed会处理成 enumerable = false,为了能在wxml可已使用类似vue的comouted 对`mobx`的 `createComputedDecorator`实现 enumerable 处理为true
具体改动 mobx.js第261行 true

