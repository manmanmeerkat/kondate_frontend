// MenuForDate.tsx

import React, { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import { useMenuForDate } from '../../hooks/useMenuForDate';



const MenuForDate: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { menu, loading, error, getMenuForDate } = useMenuForDate();

  const handleDateChange = async (date: Date | null) => {
    setSelectedDate(date);
    await getMenuForDate(date || new Date());
  };

  useEffect(() => {
    // 初期表示時にもデータを取得する場合はコメントアウトを解除
    // handleDateChange(selectedDate);
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h1>{selectedDate?.toLocaleDateString()}のメニュー</h1>
      <Calendar getMenuForDate={getMenuForDate} selectedDate={selectedDate} onDateChange={handleDateChange} />
      {/* メニューの表示
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {menu.map((menuItem) => (
        <div key={menuItem.id}>
          <p>Dish Name: {menuItem.dish.name}</p>
        </div>
      ))} */}
    </div>
  );
};

export default MenuForDate;
