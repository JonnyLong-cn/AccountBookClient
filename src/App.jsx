// App.jsx
import React, { useState,useEffect, Fragment } from 'react';
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import routes from '@/router';
import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import 'zarm/dist/zarm.css';

import NavBar from '@/components/NavBar/index.jsx';

function App() {
  // 拿到location实例
  const location = useLocation();
  const { pathname } = location;
  // 需要底部导航栏的路径
  const needNav = ['/', '/data', '/user'];
  // 是否展示 Nav
  const [showNav, setShowNav] = useState(false);
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]);

  /*
  执行 useLocation 时，报错 location of undefined
  这是因为想要在函数组件内执行 useLocation，该组件必须被 Router 高阶组件包裹
  因此将 App.jsx 的 Router 组件，前移到 index.jsx 内
   */
  return (
    <Fragment>
      <ConfigProvider primaryColor="#00bc70" locale={zhCN}>
        <Switch>
          {
            routes.map((item, index) => {
              return (
                <Route exact path={item.path} key={item.path + index}>
                  <item.component />
                </Route>
              )
            })
          }
        </Switch>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </Fragment>
  )
}

export default App;