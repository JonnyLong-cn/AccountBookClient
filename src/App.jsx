// App.jsx
import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import routes from '@/router';
import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import 'zarm/dist/zarm.css';

import NavBar from '@/components/NavBar/index.jsx';

function App() {
  return (
    <Router>
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
      <NavBar showNav={true} />
    </Router >
  )
}

export default App;