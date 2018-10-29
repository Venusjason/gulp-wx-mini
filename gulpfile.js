const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const del = require('del');
// const imagemin = require('gulp-imagemin');
const path = require('path');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const urlPrefixer = require('gulp-url-prefixer');
const postcss = require('gulp-postcss');
const pxtorpx = require('wx-px2rpx')
const mina = require('@tinajs/gulp-mina')
const appConfig = require('./src/app.config.js');
// const { Tags } = require('./html.options.js');
var os = require('os');
var ip = showObj(os.networkInterfaces());

const replaceHtml = require('./templete2wxml.js')

function showObj(obj){
  for(var devName in obj){
    var iface = obj[devName];
    for(var i=0;i<iface.length;i++){
      var alias = iface[i];
      if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
        return alias.address;
      }
    }
  }
}



const gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins()

const srcPath = './src/**';
const distPath = './dist/';
const wxmlFiles = [`${srcPath}/*.wxml`, `!${srcPath}/_template/*.wxml`];
const xmlFiles = [`${srcPath}/*.xml`, `!${srcPath}/_template/*.xml`];
const lessFiles = [
  `${srcPath}/*.less`,
  `!${srcPath}/styles/**/*.less`,
  `!${srcPath}/_template/*.less`
];
const jsonFiles = [`${srcPath}/*.json`, `!${srcPath}/_template/*.json`];
const jsFiles = [`${srcPath}/*.js`, `!${srcPath}/_template/*.js`];
const imgFiles = [
  `${srcPath}/img/*.{png,jpg,gif,ico}`,
  `${srcPath}/img/**/*.{png,jpg,gif,ico}`
];

const isProduction = process.env.NODE_ENV === 'production'
const isApiProduction = appConfig.env === 'production'

// 图片存在服务器上的路径
const assetsPort = 1988
const assetsPath = isApiProduction ? appConfig.assetsPaths['production'] : `http://${ip}:${assetsPort}`

if (isProduction) {
  // 生产模式 demo不被编译
  wxmlFiles.push(`!${srcPath}/demo/*.wxml`)
  lessFiles.push(`!${srcPath}/demo/*.less`)
  jsonFiles.push(`!${srcPath}/demo/*.json`)
  jsFiles.push(`!${srcPath}/demo/*.js`)
}

// console.log(`当前配置运行环境${process.env.NODE_ENV}, api环境${appConfig.env}`)
/* 清除dist目录 */
gulp.task('clean', done => {
  del.sync(['dist/**/*']);
  done();
});

/* 编译wxml文件 */
const wxml = () => {
  return gulp.src(wxmlFiles)
    .pipe(plugins.changed(distPath))
    .pipe(urlPrefixer.html({
      prefix: assetsPath,
      tags: ['image']
    }))
    .pipe(plugins.replace('//CDN', `${assetsPath}`)) // 自动替换静态资源路径 //CDN
    .pipe(plugins.data(function(file) {
      const htmlStr = String(file.contents)
      file.contents = new Buffer(replaceHtml(htmlStr))
      return file
    }))
    .pipe(plugins.if(isProduction, plugins.htmlmin({
      collapseWhitespace: true,
      keepClosingSlash: true, // xml
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(plugins.logger({ showChange: true }))
    .pipe(gulp.dest(distPath));
};
gulp.task(wxml);

/* 编译JS文件 */
const js = () => {
  return gulp
    .src(jsFiles)
    .pipe(plugins.changed(distPath))
    .pipe(plugins.replace('//CDN', `${assetsPath}`)) // 自动替换静态资源路径 //CDN
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({
      presets: ['es2015', 'mobx'],
      plugins: ['transform-decorators-legacy']
    }))
    .pipe(plugins.logger({
      showChange: true,
      colors: true,
      after: `当前配置运行环境${process.env.NODE_ENV}, api环境${appConfig.env}`
    }))
    .pipe(plugins.if(isProduction, plugins.uglify({
      compress: true
    })))
    .pipe(gulp.dest(distPath));
};
gulp.task(js);

/* 编译json文件 */
const json = () => {
  return gulp.src(jsonFiles).pipe(plugins.logger({ showChange: true })).pipe(gulp.dest(distPath));
};
gulp.task(json);

/* 编译less文件 */
const wxss = () => {
  return gulp
    .src(lessFiles)
    .pipe(plugins.changed(distPath))
    .pipe(plugins.replace('//CDN', `${assetsPath}`)) // 自动替换静态资源路径 //CDN
    .pipe(less())
    .pipe(postcss([pxtorpx()]))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(plugins.logger({ showChange: true }))
    .pipe(plugins.if(isProduction, plugins.cssnano({ compatibility: '*' })))
    .pipe(gulp.dest(distPath));
};
gulp.task(wxss);

// function performChange (content, done) {
//   done(null, content)
// }

/* 编译html文件 */
const xml = () => {
  return gulp.src(xmlFiles)
    .pipe(plugins.changed(distPath, {extension:'.js'}))
    .pipe(plugins.debug({title: '编译:'}))
    .pipe(plugins.replace('//CDN', `${assetsPath}`)) // 自动替换静态资源路径 //CDN
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(mina({
      script: (stream) => stream
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(babel({
          presets: ['es2015', 'mobx'],
          plugins: ['transform-decorators-legacy']
        }))
        .pipe(plugins.logger({
          showChange: true,
          colors: true,
          after: `当前配置运行环境${process.env.NODE_ENV}, api环境${appConfig.env}`
        }))
        .pipe(plugins.if(isProduction, plugins.uglify({
          compress: true
        })))
        .pipe(gulp.dest(distPath)),
      template: (stream) => stream
        .pipe(urlPrefixer.html({
          prefix: assetsPath,
          tags: ['image']
        }))
        .pipe(plugins.data(function(file) {
          // console.log(String(file.contents))
          const htmlStr = String(file.contents)
          file.contents = new Buffer(replaceHtml(htmlStr))
          return file
        }))
        .pipe(plugins.if(isProduction, plugins.htmlmin({
          collapseWhitespace: true,
          keepClosingSlash: true, // xml
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        })))
        .pipe(plugins.logger({ showChange: true }))
        .pipe(gulp.dest(distPath)),
      style: (stream) => stream
        .pipe(less())
        .pipe(postcss([pxtorpx()]))
        .pipe(plugins.autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(rename({ extname: '.wxss' }))
        .pipe(plugins.logger({ showChange: true }))
        .pipe(plugins.if(isProduction, plugins.cssnano({ compatibility: '*' })))
        .pipe(gulp.dest(distPath)),
      config: (stream) => stream.pipe(plugins.logger({ showChange: true })).pipe(gulp.dest(distPath)),
    }))
};
gulp.task(xml);

/* 编译压缩图片 */
const img = () => {
  return gulp
    .src(imgFiles)
    // .pipe(imagemin())
    .pipe(gulp.dest(distPath));
};
gulp.task(img);

/* build */
gulp.task(
  'build',
  gulp.series('clean', gulp.parallel( 'wxml', 'js', 'json', 'wxss', 'xml', 'img'))
);

/* watch */
gulp.task('watch', () => {
  gulp.watch(lessFiles, wxss);
  gulp.watch(jsFiles, js);
  gulp.watch(xmlFiles, xml);
  gulp.watch(jsonFiles, json);
  gulp.watch(wxmlFiles, wxml);
  gulp.watch(imgFiles, img);
});

gulp.task('server', done => {
  plugins.connect.server({
    root: 'src',
    livereload: false,
    port: assetsPort,
    host: `${ip}`
  })
  done()
})

// plugins.connect.server({
//   root: 'src',
//   livereload: false,
//   port: assetsPort,
//   host: `${ip}`
// })

/* dev */
gulp.task('dev', gulp.series('build', 'server', 'watch'));

/**
 * auto 自动创建page or template or component
 *  -s 源目录（默认为_template)
 * @example
 *   gulp auto -p mypage           创建名称为mypage的page文件
 *   gulp auto -t mytpl            创建名称为mytpl的template文件
 *   gulp auto -c mycomponent      创建名称为mycomponent的component文件
 *   gulp auto -s index -p mypage  创建名称为mypage的page文件
 */
const auto = done => {
  const yargs = require('yargs')
    .example('gulp auto -p mypage', '创建名为mypage的page文件')
    .example('gulp auto -t mytpl', '创建名为mytpl的template文件')
    .example('gulp auto -c mycomponent', '创建名为mycomponent的component文件')
    .example(
      'gulp auto -s index -p mypage',
      '复制pages/index中的文件创建名称为mypage的页面'
    )
    .option({
      s: {
        alias: 'src',
        default: '_template',
        describe: 'copy的模板',
        type: 'string'
      },
      p: {
        alias: 'page',
        describe: '生成的page名称',
        conflicts: ['t', 'c'],
        type: 'string'
      },
      t: {
        alias: 'template',
        describe: '生成的template名称',
        type: 'string',
        conflicts: ['c']
      },
      c: {
        alias: 'component',
        describe: '生成的component名称',
        type: 'string'
      },
      version: { hidden: true },
      help: { hidden: true }
    })
    .fail(msg => {
      done();
      console.error('创建失败!!!');
      console.error(msg);
      console.error('请按照如下命令执行...');
      yargs.parse(['--msg']);
      return;
    })
    .help('msg');

  const argv = yargs.argv;
  const source = argv.s;
  const typeEnum = {
    p: 'pages',
    t: 'templates',
    c: 'components'
  };
  let hasParams = false;
  let name, type;
  for (let key in typeEnum) {
    hasParams = hasParams || !!argv[key];
    if (argv[key]) {
      name = argv[key];
      type = typeEnum[key];
    }
  }

  if (!hasParams) {
    done();
    yargs.parse(['--msg']);
  }

  const root = path.join(__dirname, 'src', type);
  return gulp
    .src(path.join(root, source, '*.*'))
    .pipe(
      rename({
        dirname: name,
        basename: name
      })
    )
    .pipe(gulp.dest(path.join(root)));
};
gulp.task(auto);
