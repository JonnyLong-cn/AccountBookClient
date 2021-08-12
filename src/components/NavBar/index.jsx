import { useHistory, useLocation } from 'react-router-dom';
import React, { useState } from 'React';
import PropTypes from 'prop-types';
import { TabBar } from "zarm";
import s from './style.module.less';

const NavBar = ({ showNav = true }) => {
  const [activeKey, setActiveKey] = useState(useLocation().pathname);
  const history = useHistory();

  // 根据传入的path推送到指定路径
  const changeTab = (path) => {
    setActiveKey(path);
    history.push(path);
  }

  return (
    <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey="/"
        title="账单"
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
      />
      <TabBar.Item
        itemKey="/user"
        title="用户"
      />
    </TabBar>
  )
}

NavBar.prototype = {
  showNav: PropTypes.bool
}

export default NavBar;