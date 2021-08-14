import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// 解析URL的包
import qs from 'query-string';
import classNames from 'classnames';
import moment from 'moment';

import PopupAddBill from '@/components/PopupAddBill'
import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import { Toast, Modal } from 'zarm';

import axios from '@/utils/axios.js';
import s from './style.less';
import { typeMap } from '@/utils/type.js'

function Detail() {
  const addRef = useRef();
  const location = useLocation();
  const { id } = qs.parse(location.search);
  const [detail, setDetail] = useState({});
  console.log('location = ', location);

  useEffect(() => {
    queryDetail();
  }, [])

  async function queryDetail() {
    const { data } = await axios.get(`/api/bill/detail?id=${id}`);
    setDetail(data);
  }

  function deleteDetail() {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: async () => {
        const { data } = await post('/api/bill/delete', { id })
        Toast.show('删除成功')
        history.goBack()
      },
    });
  }

  // 打开编辑弹窗方法
  function openModal() {
    addRef.current && addRef.current.show()
  }

  return (
    <div className={s.detail}>
      <Header title='账单详情' />
      <div className={s.card}>
        <div className={s.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span className={classNames({ [s.expense]: detail.pay_type === 1, [s.income]: detail.pay_type == 2 })}>
            <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
          </span>
          <span>{detail.type_name || ''}</span>
        </div>
        {
          detail.pay_type === 1
            ? <div className={classNames(s.amount, s.expense)}>-{detail.amount}</div>
            : <div className={classNames(s.amount, s.incom)}>+{detail.amount}</div>
        }
        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{moment(new Date(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={s.remark}>
            <span>备注</span>
            <span>{detail.remark || '-'}</span>
          </div>
        </div>
        <div className={s.operation}>
          <span onClick={deleteDetail}><CustomIcon type='shanchu' />删除</span>
          <span onClick={openModal}><CustomIcon type='tianjia' />编辑</span>
        </div>
      </div>
      <PopupAddBill ref={addRef} detail={detail} onReload={queryDetail} />
    </div>
  )
}

export default Detail;