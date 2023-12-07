import React, { useState } from 'react';
import { Calendar, MenuItem } from './Calendar';

const MenuForDate: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const getMenuForDate = (date: Date): MenuItem[] => {
    // ここで実際のデータ取得ロジックを実装する
    const formattedDate = date.toLocaleDateString();
    return [
      { date, name: `Dish 1 for ${formattedDate}`, description: 'Description for Dish 1' },
      { date, name: `Dish 2 for ${formattedDate}`, description: 'Description for Dish 2' },
      // ... 他の献立アイテム
    ];
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const menuForDate = getMenuForDate(date || new Date()); // date が null の場合はデフォルトの日付を使用
    setMenu(menuForDate);
  };

  return (
    <div>
      <h1>{selectedDate?.toLocaleDateString()}のメニュー</h1>
      <Calendar getMenuForDate={getMenuForDate} selectedDate={selectedDate} onDateChange={handleDateChange} />
      {/* 他の表示要素やコンポーネント */}
    </div>
  );
};

export default MenuForDate;
