# Project Configs

## 技术栈 webpack + ES6 + SASS/LESS + ESlint + React +
> 项目基本配置模板

*核心功能*
> 1. 代码转换
> 2. 文件优化
> 3. 代码分割
> 4. 模块合并
> 5. 自动刷新
> 6. 代码校验
> 7. 自动发布

## 0 项目初始化
```sh
npm init -y
```

## 1. 项目结构
```
|——/root/
|——/node_modules/
  dist/
  src/
  .babelrc
  .editorconfig
  .gitignore
  package.json
  README.md
  webpack.config.js
```

## 2. webpack
> ★ npm i -D 是 npm install --save-dev 的简写，是指安装模块并保存到 package.json 的 `devDependencies`中，主要在**开发环境**中的依赖包

> ★ npm i -S 是 npm install --save 的简写，是指安装模块并保存到 package.json 的 `Dependencies`中，主要在**生成环境**中的依赖包
### 2.1 安装webpack
> Tips: 不建议全局安装webpack, 保证不同项目各自独立运行，互补影响
```sh
npm i webpack webpack-cli -D
npm i webpack-dev-server -D

```
### 2.2 webpack4 mode环境配置
> 运行webpack命令时可以直接指定开发环境

```sh
npm webpack-dev-server --mode development 开发模式
npm webpack --mode production  生成模式

```
### 2.3 配置webpack执行命令
// package.json
```
  "scripts": {
    "start": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
  },
```
### 2.4 运行webpack命令
// 在命令行窗口执行,就可以运行上面的配置命令
```sh
npm run start
npm run build
```

## 3. webpack config
webpack是基于Node.js的
> 在项目根目录下创建一个`webpack.config.js`(默认，可修改)文件来配置webpack

```
module.exports = {
    entry: '',               // 入口文件
    output: {},              // 出口文件
    module: {},              // 处理对应模块
    plugins: [],             // 对应的插件
    devServer: {},           // 开发服务器配置
    mode: 'development'      // 模式配置
}

```

### 3.1 entry && ouput

> 配置打包的入口和出口文件

#### 3.1.1 单入口文件
// webpack.config.js

```
const path = require('path');

module.exports = {
    entry: './src/index.js',    // 入口文件
    output: {
        filename: 'bundle.js',      // 打包后的文件名称
        path: path.resolve('dist')  // 打包后的目录，必须是绝对路径
    }
}

```
#### 3.1.2 多入口文件
> 多个入口可以有两种实现方式进行打包
1 一种是没有关系的但是要打包到一起去的，可以写一个数组，实现多个文件打包
2 另一种就是每一个文件都单独打包成一个文件的
- 下面就来看看这两种方式的写法
// webpack.config.js
```
let path = require('path');

module.exports = {
    // 1.写成数组的方式就可以打出多入口文件，不过这里打包后的文件都合成了一个
    // entry: ['./src/index.js', './src/login.js'],
    // 2.真正实现多入口和多出口需要写成对象的方式
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        // 1. filename: 'bundle.js',
        // 2. [name]就可以将出口文件名和入口文件名一一对应
        filename: '[name].js',      // 打包后会生成`index.js`和`login.js`文件
        path: path.resolve(__dirname ,'dist') //一定要是绝对路径,会在项目根目录下创建一个`dist`文件夹
    }
}

```
### 3.2 配置Html模板

> 需要安装插件 `html-webpack-plugin`
```sh
npm i html-webpack-plugin -D
```

#### 3.2.1 配置单页面（1个html）文件
// webpack.config.js
```
let path = require('path');
// 插件都是一个类，所以我们命名的时候尽量用大写开头
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        // 添加hash可以防止文件缓存，每次都会生成4位的hash串
        filename: 'bundle.[hash:4].js',
        path: path.resolve('dist')
    },
    plugins: [
        // 通过new一下这个类来使用插件
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在src目录下创建一个index.html页面当做模板来用
            template: './src/index.html',
            hash: true, // 会在打包好的bundle.js后面加上hash串，如果`ouput`中已配置，此处不需要重复配置
        })
    ]
}

```
> 通过上面的配置后，我们再npm run build打包后会在dist文件夹下生成新的index.html文件，并且自动引入打包后的bundle.js文件

#### 3.2.2 配置多页面（多个html）文件
> 如果开发的时候不只一个页面，我们需要配置多页面

// webpack.config.js
```
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 多页面开发，怎么配置多页面
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    // 出口文件  
    output: {                       
        filename: '[name].js',
        path: path.resolve('dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',   
            filename: 'index.html',
            chunks: ['index']   // 对应关系,index.js对应的是index.html
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: 'login.html',
            chunks: ['login']   // 对应关系,login.js对应的是login.html
        })
    ]
}

```







### 3.3 引入CSS文件
> 可以在src/index.js里引入css文件，到时候直接打包到生产目录下,需要下载一些解析css样式的loader
```sh
npm i style-loader css-loader -D
// 引入sass文件的话，也需要安装对应的loader
npm i node-sass sass-loader -D

```
#### 3.3.1 配置CSS文件的解析
```
// index.js
import './css/style.css';   // 引入css
import './sass/style.scss'; // 引入scss

// webpack.config.js
module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,     // 解析css
                use: ['style-loader', 'css-loader'] // 从右向左解析
                /* 
                    也可以这样写，这种方式方便写一些配置参数
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                */
            }
        ]
    }
}

```



#### 3.3.2 提取CSS文件，作为外联样式引入 
> `extract-text-webpack-plugin`

```sh
// @next表示可以支持webpack4版本的插件
npm i extract-text-webpack-plugin@next -D
```
```
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
// 拆分css样式的插件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filaneme: 'bundle.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    use: 'css-loader'       
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        // 拆分后会把css文件放到dist目录下的css/style.css
        new ExtractTextWebpackPlugin('css/style.css')  
    ]
}

```





#### 3.3.3 去掉没有用到的CSS
```
> npm i purifycss-webpack purify-css -glob -D
```
#### 3.3.4 CSS兼容不同浏览器的前缀
```
npm i postcss-loader autoprefixer -D
```
安装完插件后，需要在根目录下创建一个`postcss.config.js`配置文件
```
module.exports = {
  plugins: [require('autoprefixer')]
}
```


### 3.4 应用图片

> 如果是在css文件里引入的如背景图之类的图片，就需要指定一下相对路径 `publicPath: '../'`
> 在css中指定了publicPath路径这样就可以根据相对路径引用到图片资源了
```
/style.scss
background:url('../images/coffe.jpg') no-repeate;
```

```sh
npm i file-loader url-loader -D
````
```
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: 'css-loader',
                    publicPath: '../'
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
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
    }
}

```


### 1.7 自动清除webpack上次打包生成的文件
```
clean-webpack-plugin -D
```
## 2 常用配置webpack.config.js

## 6. 多页面开发 webpack.config.js
> 在项目根目录下创建一个webpack.config.js配置文件，webpack会自动寻找最近的配置文件。

*webpack.config.js*
```
const path = require('path');
let htmlWebpackPlugin = require('html-webpack-plugin');//自动将打包的文件绑定到html文件中；
let cleanWebpackPlugin = require('clean-webpack-plugin');//删除上次打包的相同文件；

module.exports = {
  打包入口文件; 通常为1个或者2个入口文件；
  entry: {
    index: './src/index.js',
    a: './src/a.js'
  },
  output: {
    filename: '[name].[hash:8].js',//[name]根据入口文件名自动命名，[hash:8]将hash值保存，限定8位hash值
    path: path.resolve(__dirname, 'dist') //*一定要：绝对路径
  },
  //对模块的处理
  module: {
    rules:[
      {
        test:/\.(scss|sass)$/,
        use:['style-loader','css-loader','postcss-loader','sass-loader']
      }
    ]
  },
  plugins: [
    new cleanWebpackPlugin(['dist']),//指定文件夹
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks:['index'],
      hash: true,//mdn文件名带md5蹉
      minify: {
        collapseWhitespace: true,//去空格
        removeAttributeQuotes: true//去双引号
      }
    }),
    new htmlWebpackPlugin({
      filename:'a.html',
      template: './src/index.html',
      hash: true,//mdn文件名带md5蹉
      chunks:['a'],
      minify: {
        collapseWhitespace: true,//去空格
        removeAttributeQuotes: true//去双引号
      }
    })
  ], //对应的插件
  devServer: {}//开发服务器的配置

}
```

## 7. 单页面开发 webpack.config.js
```
const path = require('path');
let htmlWebpackPlugin = require('html-webpack-plugin');
let cleanWebpackPlugin = require('clean-webpack-plugin');//删除上次打包的文件；

module.exports = {
  // 多入口文件; ['./src/index.js', './src/a.js'] 输出一个bundle.js
  // 单入口文件; './src/index.js' 输出一个bundle.js
  entry: {
    index: './src/index.js',
    a: './src/a.js'
  },
  output: {
    filename: 'bundle.[hash:8].js',//8位hash值
    path: path.resolve(__dirname, 'dist') //绝对路径
  },
  module: {
  },//对模块的处理
  plugins: [
    new cleanWebpackPlugin(['dist']),
    new htmlWebpackPlugin({
      template: './src/index.html',
      hash: true,//mdn文件名带md5蹉
      minify: {
        collapseWhitespace: true,//去空格
        removeAttributeQuotes: true//去双引号
      }
    })
  ], //对应的插件
  devServer: {}//开发服务器的配置

}
```

## 开发服务器,配置热更新，自动打开及刷新页面，并且如果只更改了一个文件，只更改更改的文件
> webpack.HotModuleReplacementPlugin 热更新

```sh
npm i webpack-dev-server -D

  devServer: {
    contentBase:'./dist',
    host:'localhost',
    port:3000,
    open: true,
    hot: true, //需要配置一个插件webpack.HotModuleReplacementPlugin
  },

```

### css打包;抽离样式css文件，把多个css文件转成1个，以Link形式引入；style-loader (行内样式引入)
> npm i extract-text-webpack-plugin@next -D
> npm i mini-css-etract-plugin -D

```
npm i css-loader style-loader -D

  module: {
    rules:[
      {test:/\.css$/,use:ExtractTextPlugin.extract({use:'css-loader'})},
      {test:/\.(scss|sass)$/,use:['style-loader','css-loader','sass-loader']}
    ]
  },

npm i sass sass-loader node-sass

postcss  transform:rotate(45deg); -webkit- -md-

npm i postcss-loader autoprefixer -D
```
### 前端代码模块用ES6模块  import('./index.js')
### 后端代码用common.js   require('./index.js')


```

```
