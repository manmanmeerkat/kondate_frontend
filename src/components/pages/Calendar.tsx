// Calendar.tsx
import React, { useState } from 'react';
import { Box, ChakraProvider, Flex, Wrap, WrapItem, Heading, Text, Button } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../../store/reducers/dateReducer';
import axios from 'axios';
import { MenuItem, deleteMenu, selectMenu, setMenu } from '../../store/slices/menuSlice';

interface RootState {
  date: {
    selectedDate: Date | null;
  };
}

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  getMenuForDate: (date: Date) => Promise<MenuItem[]>;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, getMenuForDate }) => {
  const dispatch = useDispatch();
  const selectedDateRedux = useSelector((state: RootState) => state.date ? state.date.selectedDate : null);
  const menu = useSelector(selectMenu);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const handleDateChange = async (date: Date | null) => {
    onDateChange(date);
    if (date) {
      dispatch(setSelectedDate(date?.toLocaleDateString()));
      const menuForDate = await getMenuForDate(date);
      dispatch(setMenu(menuForDate));
    }
  };

  const handleDelete = async (dishId: number) => {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }

    try {
      setDeletingItemId(dishId); // 削除中のアイテムのIDをセット

      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const xsrfToken = getCookie('XSRF-TOKEN');
      console.log('XSRF Token:', xsrfToken);

      await axios.delete(`http://localhost:8000/api/delete/menus/${dishId}`, {
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
        },
        withCredentials: true,
      });

      dispatch(deleteMenu(dishId));
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeletingItemId(null); // 削除が完了したら削除中のアイテムのIDをリセット
    }
  };

  return (
    <ChakraProvider>
      <Box borderWidth="1px" borderRadius="md" p={4}>
        <Flex align="center" borderBottomWidth="1px">
          <Button style={{ cursor: 'pointer' }}>
          <DatePicker
            selected={selectedDateRedux ? new Date(selectedDateRedux) : null}
            onChange={handleDateChange}
            dateFormat="日付を選択してください"
            popperClassName="custom-datepicker"
            locale={ja}
            className="compact-datepicker"
            placeholderText='日付を選択してください'
            //マウスホバーしたらポインターになる
            customInput={
              <Box
                as={Button}
                // bg="white"
                _hover={{ cursor: 'pointer' }}
                _focus={{ outline: 'none' }}
                _active={{ outline: 'none' }}
                w="100%"
                textAlign="left"
              >
                {selectedDate ? '日付を選択してください' : '日付を選択してください'}
              </Box>
            }
          /></Button>
        </Flex>
        {menu.length === 0 ? (
          <Text mt={4}>メニューが何も登録されていません。</Text>
        ) : (
          <Wrap spacing={4} mt={4}>
            {menu.map((item, index) => (
              <WrapItem key={index} p={4} position="relative" borderRadius="md" borderWidth="1px" width="200px" bg="teal.500">
              <Box key={index} p={4} borderRadius="md" width="200px" bg="teal.500" textAlign="center" borderWidth={0}>
                <Heading size="md" mb={2} color="white"> {/* 文字色を白に設定 */}
                  {item.dish.name}
                </Heading>
                <Button
                  onClick={() => handleDelete(item.id)}
                  isDisabled={deletingItemId === item.id}
                  position="absolute"
                  top={0}
                  right={0}
                  fontSize="12px"
                  size="xs"
                  colorScheme="red"  // ボタンの色を赤に設定
                >
                  {deletingItemId === item.id ? '削除中...' : '✖'}
                </Button>
              </Box>
            </WrapItem>
            
            ))}
          </Wrap>
        )}
      </Box>
    </ChakraProvider>
  );
};