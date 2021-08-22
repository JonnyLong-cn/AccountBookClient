import React, { useEffect, useState } from 'react';
import { Cell, Input, Button, Checkbox, Toast } from 'zarm';
import CustomIcon from '@/components/CustomIcon';
import s from './style.less';
// axios
import axios from '@/utils/axios';
// 类名拼接
import classNames from 'classnames';

function Login() {
  // 保存输入数据
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // 登录注册类型
  const [type, setType] = useState('login');

  async function onSubmit() {
    console.log(username, password, type);
    if (!username) {
      Toast.show('请输入账号');
      return;
    }
    if (!password) {
      Toast.show('请输入密码');
      return;
    }
    try {
      if (type === 'login') {
        const { data } = await axios.post('/api/user/login', {
          username,
          password
        });
        localStorage.setItem('token', data.token);
        window.location.hash = "/";
      } else {
        const { data } = await axios.post('/api/user/register', {
          username,
          password
        });
        Toast.show('注册成功');
        setType('login');
      }
    } catch (err) {
      console.log(err);
      Toast.show('登录账户或密码错误');
    }
  }

  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册';
  }, [type])

  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span className={classNames({ [s.acv]: type === 'login' })} onClick={() => setType('login')}>登录</span>
        <span className={classNames({ [s.acv]: type === 'register' })} onClick={() => setType('register')}>注册</span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={value => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={value => setPassword(value)}
          />
        </Cell>
      </div>
      <div className={s.operation}>
        {
          type === 'register' ? (
            <div className={s.agree}>
              <Checkbox />
              <label className="text-light">阅读并同意<a href="https://jonnylong-cn.github.io/#/" target="_blank">《龙猫记账条款》</a></label>
            </div>
          ) : null
        }
        <Button onClick={()=>{return onSubmit()}} block theme="primary">{type === 'login' ? '登录' : '注册'}</Button>
      </div>
    </div>
  )
}
export default Login;