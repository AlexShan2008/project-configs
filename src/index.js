import './common/reset.css';
import './common/base.scss';

// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
  // 实现热更新
  module.hot.accept();
}

class Pro {
  constructor() {
    this.name = 'shan';
    this.age = 18
  }
  getName = () => {
    return this.name
  }
}

let pro = new Pro();
console.log(pro.getName());

import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  render() {
    return (
      <div>
        <h2>Home Hot</h2>
        <img src='images/spring.jpg' />
      </div>
    );
  }
}

export default App;

render(
  <App />,
  document.getElementById('root')
)