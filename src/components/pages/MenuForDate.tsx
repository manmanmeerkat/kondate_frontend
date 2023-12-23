// MenuForDate.tsx

import React, { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import { useMenuForDate } from '../../hooks/useMenuForDate';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';



const MenuForDate: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { getMenuForDate } = useMenuForDate();
  const selectedDateRedux = useSelector((state: RootState) => state.date ? state.date.selectedDate : null);

  const handleDateChange = async (date: Date | null) => {
    setSelectedDate(date);
    await getMenuForDate(date || new Date());
  };

  useEffect(() => {
    // 初期表示時にもデータを取得する場合はコメントアウトを解除
    // handleDateChange(selectedDate);
  }, [selectedDate]); 

  return (
    <div>
          {selectedDateRedux && (
        <h1 style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
          {selectedDateRedux}のメニュー
        </h1>
      )}
      <Calendar getMenuForDate={getMenuForDate} selectedDate={selectedDate} onDateChange={handleDateChange} />
    </div>
  );
};

export default MenuForDate;