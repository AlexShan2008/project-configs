const path = require('path');
let htmlWebpackPlugin = require('html-webpack-plugin');
let cleanWebpackPlugin = require('clean-webpack-plugin');//删除上次打包的文件；
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let PurifyCss = require('purifycss-webpack');//去掉多余css，没有使用的css代码
let Glob = require('glob');//搜索引用；

module.exports = {
  // 多入口文件; ['./src/index.js', './src/a.js'] 输入一个bundle.js
  // 多页面开发;{ index: './src/index.js', a: './src/a.js' } 打包多个文件名 filename: '[name].[hash:8].js',//4位hash值
  entry: {
    index: './src/index.js',
    a: './src/a.js'
  },
  output: {
    filename: '[name].[hash:8].js',//8位hash值
    // filename: 'bundle.[hash:8].js',//8位hash值
    path: path.resolve(__dirname, 'dist') //绝对路径
  },
  //对模块的处理
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        })
      }
      // {test:/\.(scss|sass)$/,use:['style-loader','css-loader','postcss-loader','sass-loader']}
    ]
  },
  //对应的插件
  plugins: [
    new cleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('css.css'),
    new PurifyCss({
      paths: Glob.sync(path.join(__dirname, 'src/*.html'))
    }),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index'],
      hash: true,//mdn文件名带md5蹉
      minify: {
        collapseWhitespace: true,//去空格
        removeAttributeQuotes: true//去双引号
      }
    }),
    new htmlWebpackPlugin({
      filename: 'a.html',
      template: './src/index.html',
      hash: true,//mdn文件名带md5蹉
      chunks: ['a'],
      minify: {
        collapseWhitespace: true,//去空格
        removeAttributeQuotes: true//去双引号
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