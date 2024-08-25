import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Icon } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { Calendar } from './Calendar';
import { useMenuForDate } from '../../hooks/useMenuForDate';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const MenuForDate: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { getMenuForDate } = useMenuForDate();
  const selectedDateRedux = useSelector((state: RootState) => state.date ? state.date.selectedDate : null);

  const getDayOfWeek = (date: Date) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
  };

  const handleDateChange = async (date: Date | null) => {
    setSelectedDate(date);
    await getMenuForDate(date || new Date());
  };

  useEffect(() => {}, [selectedDate]);

  return (
    <div>
      {selectedDateRedux && (
        <Box 
          bg="white" 
          p={4}
          boxShadow="md" 
          textAlign="center" 
        >
          <Heading as="h1" fontSize="2xl" mb={2} color="black">
            <Icon as={CalendarIcon} w={6} h={6} mr={2} color="brown.500" />
            {`${selectedDateRedux} (${getDayOfWeek(new Date(selectedDateRedux))})`}
          </Heading>
          <Text fontSize="lg" color="black">のメニュー</Text>
        </Box>
      )}
      <Calendar 
        getMenuForDate={getMenuForDate} 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange} 
      />
    </div>
  );
};

export default MenuForDate;
