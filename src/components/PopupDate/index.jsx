import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, DatePicker } from 'zarm';
import moment from 'moment';

// forwardRef 用于拿到父组件传入的 ref 属性，这样在父组件便能通过 ref 控制子组件。
const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => {
  const [show, setShow] = useState(false)
  const [now, setNow] = useState(new Date())

  function choseMonth(item) {
    setNow(item);
    setShow(false);
    if (mode == 'month') {
      onSelect(moment(new Date(item)).format('YYYY-MM'))
    } else if (mode == 'date') {
      onSelect(moment(new Date(item)).format('YYYY-MM-DD'))
    }
  }

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  };

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div>
      <DatePicker
        visible={show}
        value={now}
        mode={mode}
        onOk={choseMonth}
        onCancel={() => setShow(false)}
      />
    </div>
  </Popup>
});

PopupDate.propTypes = {
  mode: PropTypes.string, // 日期模式
  onSelect: PropTypes.func, // 选择后的回调
}

export default PopupDate;

