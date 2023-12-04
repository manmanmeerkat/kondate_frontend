// Calendar.tsx

import React, { useState } from 'react';
import { Box, ChakraProvider, Flex, Heading, VStack } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';

export interface MenuItem {
  date: Date;
  name: string;
  description: string;
}

interface CalendarProps {
  getMenuForDate: (date: Date) => MenuItem[];
}

export const Calendar: React.FC<CalendarProps> = ({ getMenuForDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const menuForDate = getMenuForDate(date);
      setMenu(menuForDate);
    }
  };

  return (
    <ChakraProvider>
      <Box borderWidth="1px" borderRadius="md">
        <Flex align="center" p={2} borderBottomWidth="1px">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy年MM月d日（eee）"
            popperClassName="custom-datepicker"
            locale={ja}
            className="compact-datepicker"
          />
        </Flex>
        <VStack spacing={2} p={2}>
          <Heading size="sm">{selectedDate?.toLocaleDateString()}のメニュー</Heading>
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
