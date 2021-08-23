import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon, Toast, Keyboard, Input } from 'zarm';
import classNames from 'classnames';
import moment from 'moment';
import CustomIcon from '../CustomIcon';
import PopupDate from '../PopupDate';
import axios from '@/utils/axios.js';
import { typeMap } from '@/utils/type.js'

import s from './style.less';

/**
 * 1是收入,2是支出
 */
const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  // data锚点
  const dateRef = useRef();
  // 外部传进来的账单详情 id
  const id = detail && detail.id;
  // 弹出展示
  const [show, setShow] = useState(false);
  // 支出或收入类型
  const [payType, setPayType] = useState('expense');
  // 支出类型数组
  const [expense, setExpense] = useState([]);
  // 收入类型数组
  const [income, setIncome] = useState([]);
  // 当前状态
  const [currentType, setCurrentType] = useState({});
  // 账单价格
  const [amount, setAmount] = useState('');
  // 备注
  const [remark, setRemark] = useState('');
  // 备注输入框
  const [showRemark, setShowRemark] = useState(false);
  // 日期
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'income' : 'expense');
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      });
      setRemark(detail.remark);
      setAmount(detail.amount);
      setDate(moment(new Date(detail.date)).$d);
    }
  }, [detail])

  // 控制弹窗的弹窗和折叠
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      }
    }
  };

  useEffect(async () => {
    const { data: { list } } = await axios.get('/api/type/list');
    // 收入类型
    const _income = list.filter(i => i.type == 1);
    // 支出类型
    const _expense = list.filter(i => i.type == 2);
    // 设置收入和支出的值
    setExpense(_expense);
    setIncome(_income);
    // 没有 id 的情况下，说明是新建账单。
    if (!id) {
      setCurrentType(_expense[0]);
    };
  }, []);

  // 切换收入还是支出
  function changeType(type) {
    setPayType(type);
    // 切换之后，默认给相应类型的第一个值
    if (type == 'expense') {
      setCurrentType(expense[0]);
    } else {
      setCurrentType(income[0]);
    }
  };

  // 日期弹窗
  function handleDatePop() {
    dateRef.current && dateRef.current.show()
  }

  // 日期选择回调
  function selectDate(val) {
    setDate(val)
  }

  // 选择账单类型
  function chooseType(item) {
    setCurrentType(item)
  }

  /**
   * 监听输入框改变值，将value作用附加给amount
   * @param {*} value 点击键盘输入的value值
   */
  function handleMoney(value) {
    value = String(value);
    if (value == 'close') {
      return;
    }
    // 点击是删除按钮时，amount字符串长度减1
    if (value == 'delete') {
      let _amount = amount.slice(0, amount.length - 1);
      setAmount(_amount);
      return;
    }
    // 点击确认按钮时，调用添加账单函数
    if (value == 'ok') {
      addBill()
      return
    }
    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) {
      return;
    }
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) {
      return
    }
    // 重新设置金额
    setAmount(amount + value)
  }

  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show('请输入具体金额')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: moment(date).unix() * 1000,
      pay_type: payType == 'expense' ? 1 : 2,
      remark: remark || ''
    }
    if (id) {
      params.id = id;
      // 如果有 id 需要调用详情更新接口
      const result = await axios.post('/api/bill/update', params);
      Toast.show('修改成功');
    } else {
      const result = await axios.post('/api/bill/add', params);
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark('');
      Toast.show('添加成功');
    }
    setShow(false);
    if (onReload) onReload();
  }

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        {/* 头部，关闭弹窗图标 */}
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}><Icon type="wrong" /></span>
        </header>
        {/* 收入和支出过滤 */}
        <div className={s.filter}>
          <div className={s.type}>
            <span onClick={() => changeType('expense')} className={classNames({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
            <span onClick={() => changeType('income')} className={classNames({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
          </div>
          <div className={s.time} onClick={handleDatePop}>{moment(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom" /></div>
        </div>
        {/* 金额模块，amount存放输入的金额 */}
        <div className={s.money}>
          <span className={s.sufix}>¥</span>
          <span className={classNames(s.amount, s.animation)}>{amount}</span>
        </div>
        {/* 类型选择模块 */}
        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {
              (payType == 'expense' ? expense : income).map(item => <div onClick={() => chooseType(item)} key={item.id} className={s.typeItem}>
                {/* 添加多个类名 */}
                <span className={classNames({ [s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id })}>
                  <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                </span>
                <span>{item.name}</span>
              </div>)
            }
          </div>
        </div>
        {/* 备注模块 */}
        <div className={s.remark}>
          {
            showRemark ? <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
          }
        </div>
        {/* 键盘 */}
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        {/* 日期弹窗 */}
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  )
});

PopupAddBill.propTypes = {
  detail: PropTypes.object,
  onReload: PropTypes.func
}

export default PopupAddBill;