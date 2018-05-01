# GstarCAD Front-End Style Guide
> 此文档不仅仅是一份编码风格的文档,更是一份`javascript,css,html`的进阶教学文档,推荐所有的前台工程师都能好好阅读一遍

## *目录*

## 1 介绍

### 1.1 本文档中的示例代码是非规范的。仅供学习和参考。

## 2 项目结构
|——  dist/ 打包编译后的所有文件存放于此

|—— middleware/ 中间件
mock/ 模拟数据
node_modules /依赖包
router /路由
server /服务端
src/ 前端项目源代码
  api /项目api
  common /通用文件夹（css、其他文件）
  components /展示组件
  containers /容器组件
  images /图片
  store /数据仓库
    action /action动作
    reducer /纯函数
    action-types /统一存放action的类型
    index.js /redux入口文件
test /测试
util /事件
.babelrc /babel编译
.editorconfig /编辑器格式
.eslintrc /eslint代码风格
.gitignore /git仓库管理
.npmrc /npm仓库
app.js /项目入口文件
package.json /包依赖总表
postcss.config.js /css样式兼容
README.md /项目说明
webpack.config.js /webpack配置文件


## 2 源文件基础
### 2.1文件名称
文件名必须全部小写，可以包含下划线（_）或破折号（ - ），但不得包含其他内容标点。 遵循你的项目使用的约定。 文件名的扩展名必须是.js。
### 2.2文件编码：UTF-8
源文件以UTF-8编码。
### 2.3特殊字符
#### 2.3.1 空白字符
除行终止符序列外，ASCII水平空格字符（0x20）是唯一的空白字符，字符出现在源文件的任何地方。 这意味着
1.字符串文字中的所有其他空白字符都会被转义，并且
2.制表符不用于缩进。
#### 2.3.2 特殊的转义序列
对于任何具有特殊转义序列（\'，\“，\\，\ b，\ f，\ n，\ r，\ t，\ v）的字符，使用该序列而不是相应的数字转义（例如\ x0a，\ u000a或\ u {a}）。
传统的八进制转义从不使用。
#### 2.3.3 非ASCII字符
对于其余的非ASCII字符，可以是实际的Unicode字符（例如∞）或等效的十六进制或Unicode转义（例如\ u221e），这仅取决于哪一种让代码更容易阅读和理解。
> 提示：在Unicode转义情况下，偶尔即使使用实际的Unicode字符，也是如此解释性评论可能会非常有帮助。

Example | Discussion
 - | -
const units = 'μs'; | Best: perfectly clear even without a comment.
const units = '\u03bcs'; // 'μs' | Allowed, but there’s no reason to do this.
const units = '\u03bcs'; // Greek letter mu, 's' | Allowed, but awkward and prone to mistakes.
const units = '\u03bcs'; |  Poor: the reader has no idea what this is.
return '\ufeff' + content; // byte order mark |  Good: use escapes for non-printable characters,and comment if necessary.


> 提示：不要因为担心某些程序可能无法处理nonASCII而使代码不易读取
字符正确。 如果发生这种情况，那些程序就会被破坏并且必须修复。

## 3源文件结构
一个源文件按顺序包含：
- 1.许可或版权信息，如果有的话
- 2. @fileoverview JSDoc，如果有的话
- 3. goog.module语句
- 4. goog.require声明
> 文件的实现实际上，一个空白行分隔每个存在的部分，除了文件的实现，可能是前面有1或2个空白行。

### 3.1许可或版权信息，如果有的话
如果许可证或版权信息属于文件，则属于此处
### 3.2 @fileoverview JSDoc，如果存在的话
有关格式化规则，请参阅7.5顶级/文件级注释
### 3.3 goog.module语句
所有文件必须在一行中声明一个goog.module名称：包含goog.module的行
声明不能被包装，因此是80列限制的例外。
goog.module的整个参数是定义一个名称空间的参数。 它是包名称（一个标识符反映了代码所在的目录结构的片段）以及可选的main2.3.3非ASCII字符

Example
```
goog.module('search.urlHistory.UrlHistoryService');
```
#### 3.3.1层次结构
模块名称空间可能永远不会被命名为另一个模块名称空间的直接子节点。
非法：
```
goog.module('foo.bar'); // 'foo.bar.qux' would be fine, though goog.module('foo.bar.baz');
```
目录层次结构反映了命名空间层次结构，因此嵌套较深的子节点是子目录更高级别的父目录。 请注意，这意味着“父”名称空间组的所有者是必须知道所有的子名称空间，因为它们存在于同一个目录中。
#### 3.3.2 goog.setTestOnly
单个goog.module语句可以随后调用goog.setTestOnly（）

#### 3.3.3 goog.module.declareLegacyNamespace
单个goog.module语句可以随后调用
`goog.module.declareLegacyNamespace()`;。 尽可能避免使用`goog.module.declareLegacyNamespace()`。
Example:
```
goog.module('my.test.helpers');
goog.module.declareLegacyNamespace();
goog.setTestOnly();
```
`goog.module.declareLegacyNamespace`存在以简化从传统的基于对象层次结构的转换命名空间，但带有一些命名限制。 由于子模块名称必须在创建后创建父名称空间，此名称不能是任何其他`goog.module`的子项或父项（例如，`goog.module`（ '父'）; 和`goog.module（'parent.child'）`; 不能既安全地存在，也不能`goog.module`（ '父'）; 和`goog.module（'parent.child.grandchild'）`;）。

#### 3.3.4 ES6 Module
不要使用ES6模块（即导出和导入关键字），因为它们的语义尚未最终确定。 请注意，一旦语义是完全标准的，这个策略将被重新审视。

### 3.4 goog.require语句
导入使用goog.require语句完成，紧跟在模块后面
宣言。每个goog.require被分配给一个常量别名，或者被解构成几个
恒定的别名。不管是否这些别名是引用require d依赖关系的唯一可接受的方式
在代码或类型注释中：完全限定名称从不使用，除非作为参数
goog.require。别名应与导入的模块名称的最后点分隔的组件匹配
3.3.1层次结构
3.3.2 goog.setTestOnly
3.3.3 goog.module.declareLegacyNamespace
3.3.4 ES6模块
3.4 goog.require语句
在可能的情况下，尽管可能包括其他组件（使用适当的套管，
如果需要的话，套管仍能正确识别其类型）或明显提高可读性。
goog.require语句可能不会出现在文件的其他任何地方。
如果仅为其副作用导入模块，则可以省略该分配，但可以使用完全限定名称可能不会出现在文件的其他地方。需要评论来解释为什么这是必要的，并抑制一个
编译器警告。
这些行按照以下规则进行排序：所有要求在左侧都有一个名字，
这些名称按字母顺序排序。然后解构需要，再按左边的名字排序
侧。最后，任何goog.require调用都是独立的（通常这些调用是为了刚刚导入的模块）
他们的副作用）。
> 提示：无需记住此订单并手动强制执行。您可以依靠您的IDE进行报告要求没有正确排序。

如果一个长的别名或模块名称会导致一行超过80列的限制，则它不能被包装：
goog.require行是80列限制的例外。
Example:
```
const MyClass = goog.require('some.package.MyClass');
const NsMyClass = goog.require('other.ns.MyClass');
const googAsserts = goog.require('goog.asserts');
const testingAsserts = goog.require('goog.testing.asserts');
const than80columns = goog.require('pretend.this.is.longer.than80columns');
const {clear, forEach, map} = goog.require('goog.array');
/** @suppress {extraRequire} Initializes MyFramework. */
goog.require('my.framework.initialization');

```
不合法：
```
const randomName = goog.require('something.else'); // name must match
const {clear, forEach, map} = // don't break lines
 goog.require('goog.array');
function someFunction() {
 const alias = goog.require('my.long.name.alias'); // must be at top level
 // …
}

```
#### 3.4.1 goog.forward声明
`goog.forwardDeclare`并不经常被需要，但它是打破循环依赖或者一个有价值的工具
参考后期加载的代码。 这些陈述分组在一起，并立即遵循任何
`goog.require`声明。 `goog.forwardDeclare`声明必须遵循与a相同的样式规则
`goog.require`声明。

### 3.5文件的实现
在声明所有依赖关系信息（至少由一个空白行分隔）之后，实际执行会执行。

这可能包含任何模块局部声明（常量，变量，类，函数等），以及任何导出的符号。

## 4格式化
> 术语注意：块状结构是指类，函数，方法或花括号分隔的主体
代码块。 请注意，通过5.2数组文字和5.3对象文字，可以选择任何数组或对象文字被视为块状结构。

> 提示：使用clang格式。 JavaScript社区已经投入了努力确保clang格式“确实如此
正确的事情“在JavaScript文件上。 铿锵的格式已经与一些流行编辑整合。
### 4.1大括号
#### 4.1.1大括号用于所有控制结构
所有控制结构都需要花括号（即，如果，其他，为，做，同时以及其他任何控制结构），即使身体只包含一个声明。 非空块的第一条语句必须从其开始
自己的路线。
Illegal:
```
if (someVeryLongCondition())
 doSomething();
for (let i = 0; i < foo.length; i++) bar(foo[i]);

```
例外：一个简单的if语句，可以完全适用于没有包装的单行（而且没有包装
一个else）可能会保留在一个没有大括号的行中，以提高可读性。 这是唯一的例子
其中一个控制结构可以省略大括号和换行符。
```
if (shortCondition()) return;
```
#### 4.1.2非空块：K＆R风格
大括号遵循Kernighan和里奇风格（“埃及括号”）为非空块和块状结构体：
- 在大括号之前没有换行符。
- 在大括号之后换行。
- 在大括号之前换行。
- 如果大括号终止语句或函数的主体或大括号，则在大括号后面断行
类声明或类方法。 具体而言，如果紧跟在后面，则大括号之后不会有换行符否则，赶上，或者逗号，分号或右括号。
Example:
```
class InnerClass {
 constructor() {}
 /** @param {number} foo */
 method(foo) {
 if (condition(foo)) {
 try {
 // Note: this might fail.
 something();
 } catch (err) {
 recover();
 }
 }
 }
}

```
#### 4.1.3空白块：可能简洁
一个空的块或块状构造可以在其被打开后立即关闭，没有字符，
空格或换行符（即{}）之间的换行符，除非它是多块语句的一部分（可直接使用包含多个块：if / else或try / catch / finally）。
Example:
```
function doNothing() {}
```
Illegal:
```
if (condition) {
 // …
} else if (otherCondition) {} else {
 // …
}
try {
 // …
} catch (e) {}
```

### 4.2块缩进：+2个空格
每次打开一个新的块或块状构造时，缩进都会增加两个空格。 当该块结束时，缩进将返回到之前的缩进级别。 缩进级别适用于代码和注释整个街区。 （请参阅4.1.2非空块的示例：K＆R样式）。
#### 4.2.1数组文字：可选“块状”
任何数组文字都可以选择格式化，就像它是“块状结构”一样。例如，以下内容都是有效的（不是详尽的清单）：
```
const a = [
 0,
 1,
 2,
];
const b =
 [0, 1, 2];
const c = [0, 1, 2];
someMethod(foo, [
 0, 1, 2,
], bar);

```
允许其他组合，特别是当强调元素之间的语义分组时，但是
不应该仅用于减小较大阵列的垂直尺寸。
#### 4.2.2对象文字：可选“块状”
任何对象字面值可以选择性地被格式化，就好像它是一个“块状结构”。应用相同的例子作为4.2.1数组文字：可选地是块状的。 例如，以下都是有效的（不是详尽的列表）：
```
const a = {
 a: 0,
 b: 1,
};
const b =
 {a: 0, b: 1};
const c = {a: 0, b: 1};
someMethod(foo, {
 a: 0, b: 1,
}, bar);
```
#### 4.2.3 Class literals
类文字（不论是声明还是表达式）被缩进为块。 之后不要添加分号方法之后，或者在类声明的右括号之后（语句，如赋值）包含
类表达式仍然以分号结束）。 使用extends关键字，但不要使用@extends JSDoc注释，除非类扩展了模板化类型。
```
Example:
class Foo {
 constructor() {
 /** @type {number} */
 this.x = 42;
 }
 /** @return {number} */
 method() {
 return this.x;
 }
}
Foo.Empty = class {};
/** @extends {Foo<string>} */
foo.Bar = class extends Foo {
 /** @override */
 method() {
 return super.method() / 2;
 }
};
/** @interface */
class Frobnicator {
 /** @param {string} message */
 frobnicate(message) {}
}
```
#### 4.2.4 Function expressions
在函数调用的参数列表中声明一个匿名函数时，该函数的主体是
比前面的压痕深度缩进两个空格。
Example:
```
prefix.something.reallyLongFunctionName('whatever', (a1, a2) => {
 // Indent the function body +2 relative to indentation depth
 // of the 'prefix' statement one line above.
 if (a1.equals(a2)) {
 someOtherLongFunctionName(a1);
 } else {
 andNowForSomethingCompletelyDifferent(a2.parrot);
 }
});
some.reallyLongFunctionCall(arg1, arg2, arg3)
 .thatsWrapped()
 .then((result) => {
 // Indent the function body +2 relative to the indentation depth
 // of the '.then()' call.
 if (result) {
 result.use();
 }
 });

```
#### 4.2.5 Switch statements
与其他任何块一样，开关块的内容都是缩进+2。

切换标签后，出现一个换行符，缩进级别增加+2，就像一个块一样被打开。 如果词法作用域需要，可以使用明确的块。 以下开关标签返回到前一个缩进级别，就好像一个块已关闭。

中断和下列情况之间的空白行是可选的。
```
Example:
switch (animal) {
 case Animal.BANDERSNATCH:
 handleBandersnatch();
 break;
 case Animal.JABBERWOCK:
 handleJabberwock();
4.2.4 Function expressions
4.2.5 Switch statements
 break;
 default:
 throw new Error('Unknown animal');
}
```

### 4.3声明
#### 4.3.1 One statement per line
每条语句后跟一个换行符。
#### 4.3.2需要使用分号
每个语句都必须以分号结尾。 禁止使用自动分号插入。

### 4.4列数限制：80
JavaScript代码的列限制为80个字符。 除了下面指出的，任何会超过这个的行限制必须是线包装的，如4.5线包装中所述。
例外：
1. 遵守列限制的行是不可能的（例如，JSDoc中的长URL或外壳
命令打算被复制和粘贴）。
2. goog.module和goog.require语句（请参阅3.3 goog.module语句和3.4 goog.require
语句）。
### 4.5换行
术语注意：换行定义为将单个表达式分解为多行。
没有一个全面的，确定性的公式可以确切地说明如何在每种情况下进行换行。 非常通常有几种有效的方法来换行代码。
注意：换行的典型原因是避免溢出列限制，即使是代码
实际上符合列限制可能会由作者自行决定。
> 提示：提取方法或局部变量可以解决问题，而无需换行。

### 4.6空白
### 4.7分组括号：建议
### 4.8评论
## 5语言功能
### 5.1局部变量声明
### 5.2数组文字
### 5.3对象文字
### 5.4类
### 5.5功能
### 5.6字符串文字
### 5.7数字文字
### 5.8控制结构
### 5.9这个
### 5.10不允许的功能
## 6命名
### 6.1所有标识符通用的规则
### 6.2按标识符类型的规则
### 6.3骆驼案例：定义
## 7 JSDoc
### 7.1一般形式
### 7.2降价
### 7.3 JSDoc标签
### 7.4线包装
### 7.5顶级/文件级评论
### 7.6课堂评论
### 7.7枚举和typedef注释
### 7.8方法和功能注释
### 7.9房产评论
### 7.10键入注释
### 7.11可见性注释
## 8政策
### 8.1 Google风格未指定的问题：是
一致！
### 8.2编译器警告
### 8.3弃用
### 8.4不是Google风格的代码
### 8.5当地风格规则
### 8.6生成的代码：大部分免除
## 9附录
### 9.1 JSDoc标签参考
### 9.2常见的误解风格规则
### 9.3风格相关的工具
### 9.4传统平台的例外情况

