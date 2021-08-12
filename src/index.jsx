import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// 移动端项目适配rem
import 'lib-flexible/flexible';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
