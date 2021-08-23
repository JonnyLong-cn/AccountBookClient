import React, { useEffect, useRef, useState } from 'react';
import { Icon, Progress } from 'zarm';
import classNames from 'classnames';
import moment from 'moment';
import { typeMap } from '@/utils/type.js';
import axios from '@/utils/axios.js';
import CustomIcon from '@/components/CustomIcon';
import PopupDate from '@/components/PopupDate';
import s from './style.less';

let proportionChart = null;

function Data() {
  const monthRef = useRef();
  // 当前月份，格式为YYYY-MM
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));
  // 收支类型
  const [totalType, setTotalType] = useState('expense');
  // 总支出
  const [totalExpense, setTotalExpense] = useState(0);
  // 总收入
  const [totalIncome, setTotalIncome] = useState(0);
  // 支出数据
  const [expenseData, setExpenseData] = useState([]);
  // 收入数据
  const [incomeData, setIncomeData] = useState([]);
  // 饼图类型
  const [pieType, setPieType] = useState('expense');

  useEffect(() => {
    getData();
  }, [currentMonth]);

  useEffect(()=>{
    setPieChart(expenseData);
  },[expenseData]);

  async function getData() {
    const { data } = await axios.get(`/api/bill/data?date=${currentMonth}`);
    // 总收支
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);
    // 过滤支出和收入
    const income_data = data.total_data.filter(item => item.pay_type === 1).sort((a, b) => b.number - a.number);
    const expense_data = data.total_data.filter(item => item.pay_type === 2).sort((a, b) => b.number - a.number);
    setExpenseData(expense_data);
    setIncomeData(income_data);
  }

  // 月份弹窗开关
  function monthShow() {
    return monthRef.current && monthRef.current.show();
  }

  function selectMonth(item) {
    setCurrentMonth(item);
  }

  // 切换收支构成类型
  function changeTotalType(type) {
    setTotalType(type);
  }

  // 切换饼图收支类型
  function changePieType(type) {
    setPieType(type);
    // 重绘饼图
    setPieChart(type === 'expense' ? expenseData : incomeData);
  }

  // 绘制饼图方法
  function setPieChart(data) {
    const proportion = document.getElementById('proportion');
    if (window.echarts) {
      proportionChart = echarts.init(proportion);
      proportionChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        // 图例
        legend: {
          data: data.map(item => item.type_name)
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map(item => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date" />
        </div>
        <div className={s.title}>余额</div>
        <div className={s.expense}>¥{totalIncome - totalExpense}</div>
        <div className={s.income}>共支出 ¥{totalExpense}</div>
      </div>
      {/* 收支显示部分结构 */}
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span onClick={() => changeTotalType('expense')} className={classNames({ [s.expense]: true, [s.active]: totalType === 'expense' })}>支出</span>
            <span onClick={() => changeTotalType('income')} className={classNames({ [s.income]: true, [s.active]: totalType === 'income' })}>收入</span>
          </div>
        </div>
        <div className={s.content}>
          {
            (totalType == 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={s.item}>
              <div className={s.left}>
                <div className={s.type}>
                  <span className={classNames({ [s.expense]: totalType == 'expense', [s.income]: totalType == 'income' })}>
                    <CustomIcon
                      type={item.type_id ? typeMap[item.type_id].icon : 1}
                    />
                  </span>
                  <span className={s.name}>{item.type_name}</span>
                </div>
                <div className={s.progress}>¥{Number(item.number).toFixed(2) || 0}</div>
              </div>
              <div className={s.right}>
                {/* 进度条，显示收入构成比例 */}
                <div className={s.percent}>
                  <Progress
                    shape="line"
                    percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                    theme={totalType == 'expense' ? 'warning' : 'primary'}
                  />
                </div>
              </div>
            </div>)
          }
        </div>
        {/* 收支统计图 */}
        {/* <div className={s.proportion}> */}
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span onClick={() => changePieType('expense')} className={classNames({ [s.expense]: true, [s.active]: pieType === 'expense' })}>支出</span>
            <span onClick={() => changePieType('income')} className={classNames({ [s.income]: true, [s.active]: pieType === 'income' })}>收入</span>
          </div>
        </div>
        <div id="proportion" className={s.proportion}></div>
      </div>
      {/* </div> */}
      {/* 日期弹窗 */}
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  )
}

export default Data