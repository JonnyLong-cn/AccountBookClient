import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// 移动端项目适配rem
import 'lib-flexible/flexible';
import {
  HashRouter as Router,
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
