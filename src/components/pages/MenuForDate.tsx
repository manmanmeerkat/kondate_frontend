import React, { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import { useMenuForDate } from '../../hooks/useMenuForDate';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const MenuForDate: React.FC = () => {
  // 選択された日付の状態を管理
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // useMenuForDate フックからメニュー取得関数を取得
  const { getMenuForDate } = useMenuForDate();
  
  // Redux ストアから選択された日付を取得
  const selectedDateRedux = useSelector((state: RootState) => state.date ? state.date.selectedDate : null);

  // 日付変更ハンドラ
  const handleDateChange = async (date: Date | null) => {
    setSelectedDate(date);
    await getMenuForDate(date || new Date());
  };

  useEffect(() => {
    // 特に依存関係が無い場合、selectedDate の変更に応じて何か処理を行う可能性あり
  }, [selectedDate]); 

  return (
    <div>
      {/* Redux ストアから取得した日付がある場合に表示 */}
      {selectedDateRedux && (
        <h1 style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
          {selectedDateRedux}のメニュー
        </h1>
      )}
      {/* Calendar コンポーネントにプロパティを渡す */}
      <Calendar 
        getMenuForDate={getMenuForDate} 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange} 
      />
    </div>
  );
};

export default MenuForDate;
