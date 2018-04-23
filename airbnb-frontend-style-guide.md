# Airbnb前端编码规范
> 遵循编码规范和使用语法检测，可以很好的提高代码的可读性，可维护性，并有效的减少一些编码错误，这里学习的是著名的独角兽公司 Airbnb 的前端编码规范，该项目是github上很受欢迎的一个开源项目，目前获得了40000多个star。

*附：ESLint简介*

> ESLint 是一个开源的 JavaScript 代码检查工具。代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。

> JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调适。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。

> ESLint 的所有规则都被设计成可插入的。ESLint 的默认规则与其他的插件并没有什么区别，规则本身和测试可以依赖于同样的模式。为了便于人们使用，ESLint 内置了一些规则，当然，也可以在使用过程中自定义规则。

以下的编码规范多数都可以配置成ESLint的规则从而在编译时进行语法检查，下面的规范有ESLint规则的都在后面附上了相应的说明，方便之后进行配置。

## 一 Airbnb javascript编码规范
### 1 引用
#### 1.1 对所有的引用使用 const ，不要使用 var。
eslint: prefer-const, no-const-assign

这能确保你无法对引用重新赋值，也不会导致出现 bug 或难以理解

```
// bad
  var a = 1;
  var b = 2;

  // good
  const a = 1;
  const b = 2;
```

#### 1.2 如果一定需要可变动的引用，使用 let 代替 var。
eslint: no-var jscs: disallowVar

因为 let 是块级作用域，而 var 是函数作用域。

```
// bad
  var count = 1;
  if (true) {
    count += 1;
  }

  // good, use the let.
  let count = 1;
  if (true) {
    count += 1;
  }
  ```

### 2 对象
#### 2.1 使用字面值创建对象。
eslint: no-new-object

```// bad
const item = new Object();

// good
const item = {};
```

#### 2.2 使用对象方法的简写。
eslint: object-shorthand jscs: requireEnhancedObjectLiterals

```// bad
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};
```

#### 2.3 使用对象属性值的简写。
eslint: object-shorthand jscs: requireEnhancedObjectLiterals

这样更短更有描述性。

```const lukeSkywalker = 'Luke Skywalker';

  // bad
  const obj = {
    lukeSkywalker: lukeSkywalker,
  };

  // good
  const obj = {
    lukeSkywalker,
  };
```

#### 2.4 不要直接调用 Object.prototype 的方法，如：hasOwnProperty, propertyIsEnumerable, 和 isPrototypeOf
```// bad
console.log(object.hasOwnProperty(key));

// good
console.log(Object.prototype.hasOwnProperty.call(object, key));

// best
const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.
/* or */
const has = require('has');
…
console.log(has.call(object, key));

```

#### 2.5 浅拷贝对象的时候最好是使用 … 操作符而不是 Object.assign
```// very bad
const original = { a: 1, b: 2 };
const copy = Object.assign(original, { c: 3 }); // this mutates `original`
delete copy.a; // so does this

// bad
const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

// good
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

const { a, ...noA } = copy; // noA => { b: 2, c: 3 }
```

### 3 数组
#### 3.1 使用字面值创建数组。eslint: no-array-constructor
```// bad
const items = new Array();

// good
const items = [];
```

#### 3.2 使用拓展运算符 … 复制数组。
```// bad
const items = new Array();

// good
const items = [];

// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

#### 3.3 使用 Array#from 把一个类数组对象转换成数组
```const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);
```
### 4 函数
#### 4.1 使用函数声明代替函数表达式
> 为什么？因为函数声明是可命名的，所以他们在调用栈中更容易被识别。此外，函数声明会把整个函数提升（hoisted），而函数表达式只会把函数的引用变量名提升。这条规则使得箭头函数可以取代函数表达式。

```// bad
  const foo = function () {
  };

  // good
  function foo() {
  }
  ```

#### 4.2 函数表达式:
```// 立即调用的函数表达式 (IIFE)
(() => {
   console.log('Welcome to the Internet. Please follow me.');
})();
```

#### 4.3 永远不要在一个非函数代码块（if、while 等）中声明一个函数，把那个函数赋给一个变量。浏览器允许你这么做，但它们的解析表现不一致
```// bad
if (currentUser) {
  function test() {
    console.log('Nope.');
  }
}

// good
let test;
if (currentUser) {
  test = () => {
    console.log('Yup.');
  };
}
```

#### 4.4 不要使用 arguments。可以选择 rest 语法 … 替代
> 为什么？使用 … 能明确你要传入的参数。另外 rest 参数是一个真正的数组，而 arguments 是一个类数组。

```// bad
  function concatenateAll() {
    const args = Array.prototype.slice.call(arguments);
    return args.join('');
  }

  // good
  function concatenateAll(...args) {
    return args.join('');
  }
```

### 5 箭头函数
#### 5.1 当你必须使用函数表达式（或传递一个匿名函数）时，使用箭头函数符号。
> 为什么?因为箭头函数创造了新的一个 this 执行环境（译注：参考 Arrow functions - JavaScript | MDN 和 ES6 arrow functions, syntax and lexical scoping），通常情况下都能满足你的需求，而且这样的写法更为简洁。

> 为什么不？如果你有一个相当复杂的函数，你或许可以把逻辑部分转移到一个函数声明上。

```// bad
  [1, 2, 3].map(function (x) {
    return x * x;
  });

  // good
  [1, 2, 3].map((x) => {
    return x * x;
  });
  ```

#### 5.2 如果一个函数适合用一行写出并且只有一个参数，那就把花括号、圆括号和 return 都省略掉。如果不是，那就不要省略
为什么？语法糖。在链式调用中可读性很高。
为什么不？当你打算回传一个对象的时候。

 ``` // good
  [1, 2, 3].map(x => x * x);

  // good
  [1, 2, 3].reduce((total, n) => {
    return total + n;
  }, 0);
  ```

### 6 构造器
#### 6.1 总是使用 class。避免直接操作 prototype
> 为什么? 因为 class 语法更为简洁更易读。

```// bad
  function Queue(contents = []) {
    this._queue = [...contents];
  }
  Queue.prototype.pop = function() {
    const value = this._queue[0];
    this._queue.splice(0, 1);
    return value;
  }


  // good
  class Queue {
    constructor(contents = []) {
      this._queue = [...contents];
    }
    pop() {
      const value = this._queue[0];
      this._queue.splice(0, 1);
      return value;
    }
  }
  ```

#### 6.2 使用 extends 继承。
> 为什么？因为 extends 是一个内建的原型继承方法并且不会破坏 instanceof。

#### 6.3 方法可以返回 this 来帮助链式调用。
### 7 模块
#### 7.1 总是使用模组 (import/export)
> 而不是其他非标准模块系统。你可以编译为你喜欢的模块系统。
为什么？模块就是未来，让我们开始迈向未来吧。

#### 7.2 不要使用通配符 import
> 为什么？这样能确保你只有一个默认 export。

```  // bad
  import * as AirbnbStyleGuide from './AirbnbStyleGuide';

  // good
  import AirbnbStyleGuide from './AirbnbStyleGuide';
  ```

#### 7.3 不要从 import 中直接 export
> 为什么？虽然一行代码简洁明了，但让 import 和 export 各司其职让事情能保持一致。

```// bad
  // filename es6.js
  export { es6 as default } from './airbnbStyleGuide';

  // good
  // filename es6.js
  import { es6 } from './AirbnbStyleGuide';
  export default es6;
  ```

### 8 Iterators and Generators
#### 8.1 不要使用 iterators,使用高阶函数例如 map() 和 reduce() 替代 for-of
> 为什么？这加强了我们不变的规则。处理纯函数的回调值更易读，这比它带来的副作用更重要。

```  const numbers = [1, 2, 3, 4, 5];

  // bad
  let sum = 0;
  for (let num of numbers) {
    sum += num;
  }

  sum === 15;

  // good
  let sum = 0;
  numbers.forEach((num) => sum += num);
  sum === 15;

  // best (use the functional force)
  const sum = numbers.reduce((total, num) => total + num, 0);
  sum === 15;
  ```

#### 8.2 现在还不要使用 generators?
> 为什么？因为它们现在还没法很好地编译到 ES5。 (目前Chrome 和 Node.js 的稳定版本都已支持 generators)

### 9 变量
#### 9.1 一直使用 const 来声明变量
如果不这样做就会产生全局变量。我们需要避免全局命名空间的污染。

```// bad
superPower = new SuperPower();

// good
const superPower = new SuperPower();
```

#### 9.2 使用 const 声明每一个变量
> 为什么？增加新变量将变的更加容易，而且你永远不用再担心调换错 ; 跟 ,。

#### 9.3 将所有的 const 和 let 分组
>为什么？当你需要把已赋值变量赋值给未赋值变量时非常有用。

```
// bad
  let i, len, dragonball,
      items = getItems(),
      goSportsTeam = true;

  // bad
  let i;
  const items = getItems();
  let dragonball;
  const goSportsTeam = true;
  let len;

  // good
  const goSportsTeam = true;
  const items = getItems();
  let dragonball;
  let i;
  let length;
  ```

#### 9.4 在你需要的地方给变量赋值，但请把它们放在一个合理的位置
> 为什么？let 和 const 是块级作用域而不是函数作用域。

### 10 提升
#### 10.1 var 声明会被提升至该作用域的顶部，但它们赋值不会提升。
let 和 const 被赋予了一种称为「暂时性死区（Temporal Dead Zones, TDZ）」的概念。这对于了解为什么 type of 不再安全相当重要。

#### 10.2 匿名函数表达式的变量名会被提升，但函数内容并不会。
#### 10.3 命名的函数表达式的变量名会被提升，但函数名和函数函数内容并不会。
#### 10.4 函数声明的名称和函数体都会被提升。
### 11 比较运算符 & 等号
#### 11.1 优先使用 === 和 !== 而不是 == 和 !=.
#### 11.2 条件表达式例如 if 语句通过抽象方法 ToBoolean 强制计算它们的表达式并且总是遵守下面的规则：
- 对象 被计算为 true
- Undefined 被计算为 false
- Null 被计算为 false
- 布尔值 被计算为 布尔的值
- 数字 如果是 +0、-0、或 NaN 被计算为 false, 否则为 true
- 字符串 如果是空字符串 ” 被计算为 false，否则为 true

### 12 注释
#### 12.1 使用 /* … / 作为多行注释。包含描述、指定所有参数和返回值的类型和值。
```// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
function make(tag) {

  // ...stuff...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed in tag name
 *
 * @param {String} tag
 * @return {Element} element
 */
function make(tag) {

  // ...stuff...

  return element;
}
```

#### 12.2 使用 // 作为单行注释。在注释对象上面另起一行使用单行注释。在注释前插入空行。
#### 12.3 给注释增加 FIXME 或 TODO 的前缀
帮助其他开发者快速了解这是一个需要复查的问题，或是给需要实现的功能提供一个解决方式。这将有别于常见的注释，因为它们是可操作的。使用 `FIXME – need to figure this out 或者 TODO – need to implement。`

#### 12.4 使用 // FIXME: 标注问题。
```class Calculator {
  constructor() {
    // FIXME: shouldn't use a global here
    total = 0;
  }
}
```

#### 12.5 使用 // TODO: 标注问题的解决方式。
```class Calculator {
  constructor() {
    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

### 13 空白
#### 13.1 使用 2 个空格作为缩进。
#### 13.2 在花括号前要放一个空格。
#### 13.3 在控制语句（if、while 等）的小括号前放一个空格。
在函数调用及声明中，不在函数的参数列表前加空格。

#### 13.4 在文件末尾插入一个空行。
#### 13.5 在使用长方法链时进行缩进。使用放置在前面的点 . 强调这是方法调用而不是新语句。

## 二 Airbnb React/JSX 编码规范
### 1 基本规范
每个文件只写一个模块.
多个无状态模块可以放在单个文件中. eslint: react/no-multi-comp.

不要使用 React.createElement，除非从一个非JSX的文件中初始化app.

### 2 创建模块
#### 2.1 如果模块有内部状态或者是refs, 推荐使用 class extends React.Component 而不是 React.createClass.
`eslint: react/prefer-es6-class react/prefer-stateless-function`

#### 2.2 如果模块没有状态或是没有引用refs， 推荐使用普通函数（非箭头函数）而不是类:
```// bad
  class Listing extends React.Component {
    render() {
      return <div>{this.props.hello}</div>;
    }
  }

  // bad (relying on function name inference is discouraged)
  const Listing = ({ hello }) => (
    <div>{hello}</div>
  );

  // good
  function Listing({ hello }) {
    return <div>{hello}</div>;
  }
  ```

### 3 Props 属性
避免使用数组的index来作为属性key的值，推荐使用唯一ID

```// bad
{todos.map((todo, index) =>
  <Todo
    {...todo}
    key={index}
  />
)}

// good
{todos.map(todo => (
  <Todo
    {...todo}
    key={todo.id}
  />
))}
```

### 4 Refs
总是在Refs里使用回调函数. `eslint: react/no-string-refs`

```// bad
<Foo
  ref="myRef"
/>

// good
<Foo
  ref={ref => { this.myRef = ref; }}
/>
```

### 5 Tags 标签
#### 5.1 对于没有子元素的标签来说总是自己关闭标签.
`eslint: react/self-closing-comp`

```// bad
<Foo className="stuff"></Foo>

// good
<Foo className="stuff" />
```

#### 5.2 如果模块有多行的属性， 关闭标签时新建一行.
`eslint: react/jsx-closing-bracket-location`

```// bad
<Foo
  bar="bar"
  baz="baz" />

// good
<Foo
  bar="bar"
  baz="baz"
/>
```

### 6 函数
当在 render() 里使用事件处理方法时，提前在构造函数里把 this 绑定上去.

`eslint: react/jsx-no-bind`

为什么? 在每次 render 过程中， 再调用 bind 都会新建一个新的函数，浪费资源.

```// bad
  class extends React.Component {
    onClickDiv() {
      // do stuff
    }

    render() {
      return <div onClick={this.onClickDiv.bind(this)} />
    }
  }

  // good
  class extends React.Component {
    constructor(props) {
      super(props);

      this.onClickDiv = this.onClickDiv.bind(this);
    }

    onClickDiv() {
      // do stuff
    }

    render() {
      return <div onClick={this.onClickDiv} />
    }
  }
  ```

## 三 Airbnb css/sass编码规范
### 1 格式
- 类名建议使用破折号代替驼峰法。如果你使用 BEM，也可以使用下划线（参- 见下面的 OOCSS 和 BEM）。
- 不要使用 ID 选择器。
- 在一个规则声明中应用了多个选择器时，每个选择器独占一行。
- 在规则声明的左大括号 { 前加上一个空格。
- 在属性的冒号 : 后面加上一个空格，前面不加空格。
- 规则声明的右大括号 } 独占一行。
- 规则声明之间用空行分隔开。

```Bad
.avatar{
    border-radius:50%;
    border:2px solid white; }
.no, .nope, .not_good {
    // ...
}
#lol-no {
  // ...
}
Good
.avatar {
  border-radius: 50%;
  border: 2px solid white;
}

.one,
.selector,
.per-line {
  // ...
}
```

### ２ 注释
建议使用行注释 (在 Sass 中是 //) 代替块注释。
建议注释独占一行。避免行末注释。

### 3 OOCSS 和 BEM
出于以下原因，我们鼓励使用 OOCSS 和 BEM 的某种组合：
- 可以帮助我们理清 CSS 和 HTML 之间清晰且严谨的关系。
- 可以帮助我们创建出可重用、易装配的组件。
- 可以减少嵌套，降低特定性。
- 可以帮助我们创建出可扩展的样式表。

OOCSS，也就是 “Object Oriented CSS（面向对象的CSS）”，是一种写 CSS 的方法，其思想就是鼓励你把样式表看作“对象”的集合：创建可重用性、可重复性的代码段让你可以在整个网站中多次使用。

BEM，也就是 “Block-Element-Modifier”，是一种用于 HTML 和 CSS 类名的命名约定。BEM 最初是由 Yandex 提出的，要知道他们拥有巨大的代码库和可伸缩性，BEM 就是为此而生的，并且可以作为一套遵循 OOCSS 的参考指导规范。

示例:

```<article class="listing-card listing-card--featured">

  <h1 class="listing-card__title">Adorable 2BR in the sunny Mission</h1>

  <div class="listing-card__content">
    <p>Vestibulum id ligula porta felis euismod semper.</p>
  </div>

</article>
```

```.listing-card { }
.listing-card--featured { }
.listing-card__title { }
.listing-card__content { }
```

- .listing-card 是一个块（block），表示高层次的组件。
- .listing-card__title 是一个元素（element），它属于 .listing-card 的一部分，因此块是由元素组成的。
- .listing-card–featured 是一个修饰符（modifier），表示这个块与 .listing-card 有着不同的状态或者变化。

### 4 尽量不要使用ID 选择器！！！
在 CSS 中，虽然可以通过 ID 选择元素，但大家通常都会把这种方式列为反面教材。ID 选择器给你的规则声明带来了不必要的高优先级，而且 ID 选择器是不可重用的。

### 5 推荐使用Scss语法
使用 `.scss` 的语法，不使用 `.sass` 原本的语法。

### 6 变量
变量名应使用破折号（例如 my−variable）代替camelCased和snakecased风格。对于仅用在当前文件的变量，可以在变量名之前添加下划线前缀（例如_my-variable）。

### 7 Mixins
为了让代码遵循 DRY 原则（Don’t Repeat Yourself）、增强清晰性或抽象化复杂性，应该使用 mixin，这与那些命名良好的函数的作用是异曲同工的。虽然 mixin 可以不接收参数，但要注意，假如不压缩负载（比如通过 gzip），这样会导致最终的样式包含不必要的代码重复。

### 8 扩展指令
应避免使用 @extend 指令，因为它并不直观，而且具有潜在风险，特别是用在嵌套选择器的时候。即便是在顶层占位符选择器使用扩展，如果选择器的顺序最终会改变，也可能会导致问题。（比如，如果它们存在于其他文件，而加载顺序发生了变化）。其实，使用 @extend 所获得的大部分优化效果，gzip 压缩已经帮助你做到了，因此你只需要通过 mixin 让样式表更符合 DRY 原则就足够了。

### 9 嵌套选择器
请不要让嵌套选择器的深度超过 3 层！

```.page-container {
  .content {
    .profile {
      // STOP!
    }
  }
}
```

当遇到以上情况的时候，你也许是这样写 CSS 的：
- 与 HTML 强耦合的（也是脆弱的）—或者—
- 过于具体（强大）—或者—
- 没有重用

在开发项目之前，建议团队制定编码规范（或使用一些大团队制定好的规范，如：淘宝前端编码规范），严格遵守，这样无论对于自己开发还是团队成员的协作都是很有好处的。
