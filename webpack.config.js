const path = require('path');
let htmlWebpackPlugin = require('html-webpack-plugin');
// let cleanWebpackPlugin = require('clean-webpack-plugin'); //删除上次打包的文件；
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let PurifyCss = require('purifycss-webpack'); //去掉多余css，没有使用的css代码
let Glob = require('glob'); //搜索引用；

module.exports = {
  // 多入口文件的两种写法; 1.写成数组的方式，输入多个，entry:
  // ['./src/index.js','./src/login.js']，输出一个文件bundle.js 2.对象的方式：输入多个，输出多个
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    // 1. filename: 'bundle.[hash:8].js',//8位hash值，指定输出文件名
    // 2. [name]就可以将出口文件名和入口文件名一一对应
    filename: '[name].[hash:8].js', //打包后会生成index.js和login.js文件 8位hash值
    path: path.resolve(__dirname, 'dist') //绝对路径
  },
  //对模块的处理
  module: {
    rules: [
      { test: /\.css$/, use: ExtractTextPlugin.extract({ use: 'css-loader' }) },
      // {
      //   test: /\.(css|scss|sass)$/,
      //   use: ExtractTextPlugin.extract({
      //     use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      //     publicPath: '../'
      //   }),
      // },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: 'images/'   // 图片打包后存放的目录
            }
          }
        ]
      }
    ]
  },
  //对应的插件
  plugins: [
    // new cleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextPlugin('css/style.css'),
    new PurifyCss({
      paths: Glob.sync(path.join(__dirname, 'src/*.html'))
    }),
    new htmlWebpackPlugin({
      filename: 'index.html', template: './public/index.html', chunks: ['index'], hash: true, //mdn文件名带md5蹉
      minify: {
        collapseWhitespace: true, //去空格
        removeAttributeQuotes: true //去双引号
      }
    }),
    new htmlWebpackPlugin({
      filename: 'login.html', template: './public/index.html', hash: true, //mdn文件名带md5蹉
      chunks: ['login'],
      minify: {
        collapseWhitespace: true, //去空格
        removeAttributeQuotes: true //去双引号
      }
    })
  ],
  //开发服务器的配置,启动静态服务器
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true, //需要配置一个插件webpack.HotModuleReplacementPlugin
  },
  mode: 'development'
}
