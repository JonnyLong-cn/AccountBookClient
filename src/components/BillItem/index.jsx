import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'zarm';
import { useHistory } from 'react-router-dom'
import CustomIcon from '../CustomIcon';
import { typeMap } from '@/utils/type.js';
import moment from 'moment';

import s from './style.less';

function BillItem({ bill }) {
  const [income, setIncome] = useState(0); // 收入
  const [expense, setExpense] = useState(0); // 支出
  const history = useHistory(); // 路由实例

  // 获取收入和支出
  useEffect(() => {
    const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  }, [bill.bills]);

  // 路由导航--->账单详情
  const goToDetail = (item) => {
    history.push(`/detail?id=${item.id}`)
  };

  return (
    <div className={s.item}>
      {/* 小项的头部: 显示日期和收支 */}
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>
        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
            <span>¥{income.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{expense.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {
        /* 小项具体，遍历展示到列表项Cell中
        根据收支确定字体颜色，收入为绿，支出为红
        收入支出的时间显示列表项的左下角
        */
        bill && bill.bills.sort((a, b) => { b.date - a.date }).map(item => (
          <Cell
            className={s.bill}
            key={item.id}
            onClick={() => goToDetail(item)}
            title={
              <>
                <CustomIcon
                  className={s.itemIcon}
                  type={item.type_id ? typeMap[item.type_id].icon : 1}
                />
                <span>{item.type_name}</span>
              </>
            }
            // 收支
            description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 2 ? '-' : '+'}${item.amount}`}</span>}
            // 时间点和备注
            help={<div>{moment(new Date(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
          ></Cell>
        ))
      }
    </div>
  )
}

BillItem.prototype = {
  bill: PropTypes.object
};
export default BillItem;