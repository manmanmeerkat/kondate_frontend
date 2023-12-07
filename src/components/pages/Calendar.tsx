import React, { useState } from 'react';
import { Box, ChakraProvider, Flex, Heading, VStack } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../../store/reducers/dateReducer';

// Reduxのstateの型を指定
interface RootState {
  date: {
    selectedDate: Date | null;
  };
}



export interface MenuItem {
  date: Date;
  name: string;
  description: string;
}

interface CalendarProps {
  getMenuForDate: (date: Date) => MenuItem[];
}

export const Calendar: React.FC<CalendarProps> = ({ getMenuForDate }) => {
  const dispatch = useDispatch();

  // Reduxのstateの型を指定してuseSelectorを使用
  const selectedDateRedux = useSelector((state: RootState) => {
    console.log(state); // コンソールログを追加
    return state.date ? state.date.selectedDate : null;
  });
  

  const [menu, setMenu] = useState<MenuItem[]>([]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      dispatch(setSelectedDate(date?.toLocaleDateString())); 
      const menuForDate = getMenuForDate(date);
      setMenu(menuForDate);
    }
  };
  

  return (
    <ChakraProvider>
      <Box borderWidth="1px" borderRadius="md">
        <Flex align="center" p={2} borderBottomWidth="1px">
        <DatePicker
          selected={selectedDateRedux ? new Date(selectedDateRedux) : null}
          onChange={handleDateChange}
          dateFormat="yyyy年MM月d日（eee）"
          popperClassName="custom-datepicker"
          locale={ja}
          className="compact-datepicker"
        />

        </Flex>
        <VStack spacing={2} p={2}>
          <Heading size="sm">{selectedDateRedux?.toLocaleDateString()}のメニュー</Heading>
          {menu.map((item, index) => (
            <Box key={index} borderWidth="1px" p={2} borderRadius="md" width="100%">
              <Heading size="xs">{item.name}</Heading>
              <Box mt={1} fontSize="sm">
                {item.description}
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
