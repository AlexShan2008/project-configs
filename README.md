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

#### 3.3.4 CSS3兼容性
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

#### 3.4.1 CSS中引用图片

> 如果是在css文件里引入的如背景图之类的图片，就需要指定一下相对路径 `publicPath: '../'`
> 在css中指定了publicPath路径这样就可以根据相对路径引用到图片资源了
```
/style.scss
background:url('../images/coffe.jpg') no-repeat;

npm i file-loader url-loader -D

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

#### 3.4.2 页面img引用图片
页面中经常会用到img标签，img引用的图片地址也需要一个loader来帮我们处理好
```sh
npm i html-withimg-loader -D
```
```
module.exports = {
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            }
        ]
    }
}

```

#### 3.4.3 引用字体图片和svg图片
```sh
module.exports = {
    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    }
}

```

### 3.5 自动清除webpack上次打包生成的文件

```sh
npm i clean-webpack-plugin -D

let cleanWebpackPlugin = require('clean-webpack-plugin');//删除上次打包的相同文件；

new cleanWebpackPlugin(['dist']),//打包之前先清空指定文件夹

```

### 3.5 转译ES6+
> 将ES6+语法编译成ES5，供浏览器直接读取
```sh
npm i babel-core babel-loader babel-preset-env babel-preset-stage-0 -D

module.exports = {
    module: {
        rules: [
            {
                test:/\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            }
        ]
    }
}

```
根目录下创建一个`.babelrc`文件来配置编译
```
// .babelrc
{
    "presets": ["env", "stage-0"]   // 从右向左解析
}
```

### 3.6 编译React
安装开发依赖
```
npm i react react-dom react-router-dom redux react-redux -S
```
安装编译依赖
```
npm i babel-preset-react -D
```

### 3.6 resolve解析
在webpack的配置中，resolve我们常用来配置别名和省略后缀名
```
module.exports = {
    resolve: {
        // 别名
        alias: {
            $: './src/jquery.js'
        },
        // 省略后缀
        extensions: ['.js', '.json', '.css']
    },
}

```

### 3.7 提取公共代码

// 假设a.js和b.js都同时引入了jquery.js和一个写好的utils.js
// a.js和b.js
import $ from 'jquery';
import {sum} from 'utils';
那么他们两个js中其中公共部分的代码就是jquery和utils里的代码了
可以针对第三方插件和写好的公共文件

```
module.exports = {
    entry: {
        a: './src/a.js',
        b: './src/b.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dust')
    },
    // 提取公共代码
+   optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10    
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
+   },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'a.html',
            template: './src/index.html',  // 以index.html为模板
+           chunks: ['vendor', 'a']
        }),
        new HtmlWebpackPlugin({
            filename: 'b.html',
            template: './src/index.html',  // 以index.html为模板
+           chunks: ['vendor', 'b']
        })
    ]
}

```