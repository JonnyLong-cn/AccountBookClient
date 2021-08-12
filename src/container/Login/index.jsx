import React,{useState} from 'react';
import { Cell, Input, Button, Checkbox } from 'zarm';
import CustomIcon from '@/components/CustomIcon';
import s from './style.less';
// 验证码
import Captcha from 'react-captcha-code';

function Login() {
  // 保存输入数据
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [verity,setVerify] = useState('');
  // 登录注册类型
  const [type, setType] = useState('login');
  // 验证码变化后存储值
  const [captcha, setCaptcha] = useState('');


  
  return (
    <div className={s.auth}>
      <div className={s.head}>
        <div className={s.tab}>
          <span>注册</span>
        </div>
        <div className={s.form}>
          <Cell icon={<CustomIcon type="zhanghao" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入账号"
            />
          </Cell>
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="password"
              placeholder="请输入密码"
            />
          </Cell>
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={value=>setVerify(value)}
            />
            {/* 4位验证码 */}
            <Captcha charNum={4} />
          </Cell>
        </div>
        <div className={s.operation}>
          <div className={s.agree}>
            <Checkbox/>
            <label className="text-light">阅读并同意服务条款<a href="https://jonnylong-cn.github.io/#/" target="_black">《龙猫账本条款》</a></label>
          </div>
          <Button block theme="primary">注册</Button>
        </div>
      </div>
    </div>
  )
}
export default Login;