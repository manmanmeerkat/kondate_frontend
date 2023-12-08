// Calendar.tsx

import React, { useState } from 'react';
import { Box, ChakraProvider, Flex, Wrap, WrapItem, Heading, Text } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../../store/reducers/dateReducer';

interface RootState {
  date: {
    selectedDate: Date | null;
  };
}

export interface MenuItem {
  id: number;
  date: string;
  dish: {
    id: number;
    name: string;
    description: string;
  };
}

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  getMenuForDate: (date: Date) => Promise<MenuItem[]>;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, getMenuForDate }) => {
  const dispatch = useDispatch();

  const selectedDateRedux = useSelector((state: RootState) => {
    console.log(state);
    return state.date ? state.date.selectedDate : null;
  });

  const [menu, setMenu] = useState<MenuItem[]>([]);

  const handleDateChange = async (date: Date | null) => {
    onDateChange(date);
    if (date) {
      dispatch(setSelectedDate(date?.toLocaleDateString()));
      const menuForDate = await getMenuForDate(date);
      setMenu(menuForDate);
    }
  };

  return (
    <ChakraProvider>
      <Box borderWidth="1px" borderRadius="md" p={4}>
        <Flex align="center" borderBottomWidth="1px">
          <DatePicker
            selected={selectedDateRedux ? new Date(selectedDateRedux) : null}
            onChange={handleDateChange}
            dateFormat="yyyy年MM月d日（eee）"
            popperClassName="custom-datepicker"
            locale={ja}
            className="compact-datepicker"
            placeholderText='日付を選択してください'
          />
        </Flex>
        {menu.length === 0 ? (
          <Text mt={4}>メニューが何も登録されていません。</Text>
        ) : (
          <Wrap spacing={4} mt={4}>
            {menu.map((item, index) => (
              <WrapItem key={index} p={4} borderRadius="md" borderWidth="1px" width="200px">
                <Heading size="md" mb={2}>
                  {item.dish.name}
                </Heading>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Box>
    </ChakraProvider>
  );
};
