import React, { useState,useEffect } from 'react';
import moment from 'moment';
import BillItem from '@/components/BillItem';
import { Pull } from 'zarm';
import {REFRESH_STATE,LOAD_STATE} from '@/utils/type.js';
import axios from '@/utils/axios.js';

import s from './style.less';

function Home() {
  // 总收入和总支出
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  // 账单列表
  const [list, setList] = useState([]);
  // 分页
  const [page, setPage] = useState(1);
  // 分页总数
  const [totalPage, setTotalPage] = useState(0);
  // 当前筛选时间
  const [currentTime, setCurrentTime] = useState(moment().format('YYYY-MM'))
  // 下拉刷新状态
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  // 上拉加载状态
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  // 当前筛选类型
  const [currentSelect, setCurrentSelect] = useState({});

  useEffect(() => {
    getBillList();
  }, [page,currentSelect,currentTime])

  // 获取账单
  const getBillList = async () => {
    const { data } = await axios.get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}`);
    // 下拉刷新，重制数据
    if (page === 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    // 设置收入和支出
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    // 设置总页数
    setTotalPage(data.totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  // 请求列表数据
  function refreshData() {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  function loadData() {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>总支出：<b>¥ {totalExpense}</b></span>
          <span className={s.income}>总收入：<b>¥ {totalIncome}</b></span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left}>类型</div>
          <div className={s.right}>日期</div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {
          list.length ?
            <Pull
              animationDuration={200}
              stayTime={400}
              refresh={{
                state: refreshing,
                handler: () => { refreshData() }
              }}
              load={{
                state: loading,
                distance: 200,
                handler: () => { loadData() }
              }}
            >
              {
                list.map((item, index) =>
                  <BillItem
                    bill={item}
                    key={index}
                  />
                )
              }
            </Pull> : null
        }
      </div>
    </div>
  )
}

export default Home;