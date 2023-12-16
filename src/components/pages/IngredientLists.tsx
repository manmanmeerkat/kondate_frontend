import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { ja } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import { Stack, Button, InputGroup, Box, Heading, List, ListItem, Text, Menu, useToast } from '@chakra-ui/react';

interface Menu {
  menu_id: number;
  date: string;
  dish_name: string;
  ingredients: string[];
}

interface MenuData {
  menu_id: number;
  menus: Menu[];
  ingredients: string[];
  date: string;
  dish_name: string;
}

interface ResponseData {
  menuData: MenuData[];
}

// ロケールを設定
registerLocale('ja', ja);

const SearchForm: React.FC<{ onSearch: (startDate: string, endDate: string) => void }> = ({ onSearch }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearch = () => {
    // バックエンドに日付範囲を送信
    onSearch(startDate?.toISOString() || '', endDate?.toISOString() || '');
  };

  return (
    <Stack spacing={4} mb={8} direction="row" align="center">
      <InputGroup>
        <DatePicker
          dateFormat="yyyy/MM/dd"
          selected={startDate}
          onChange={(date) => setStartDate(date as Date)}
          placeholderText="開始日を選択"
          customInput={
            <Box
              as={Button}
              _hover={{ cursor: 'pointer' }}
              _focus={{ outline: 'none' }}
              _active={{ outline: 'none' }}
              w="100%"
              textAlign="left"
            >
              {startDate ? startDate.toLocaleDateString('ja', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }) : '開始日を選択'}
            </Box>
          }
        />
        <Text mx={4} my={2}>～</Text>
        <DatePicker
          dateFormat="yyyy/MM/dd"
          selected={endDate}
          onChange={(date) => setEndDate(date as Date)}
          locale={ja}
          placeholderText="終了日を選択"
          customInput={
            <Box
              as={Button}
              _hover={{ cursor: 'pointer' }}
              _focus={{ outline: 'none' }}
              _active={{ outline: 'none' }}
              w="100%"
              textAlign="left"
            >
              {endDate ? endDate.toLocaleDateString('ja', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }) : '終了日を選択'}
            </Box>
          }
        />
      </InputGroup>
      <Button colorScheme="teal" onClick={handleSearch}>
        Search
      </Button>
    </Stack>
  );
};

export const IngredientsList: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuData[] | null>(null);
  const toast = useToast();

  const handleSearch = async (startDate: string, endDate: string) => {
    try {
      // 日付が選択されていない場合、トースターを表示して処理を中断
      if (!startDate || !endDate) {
        toast({
          title: '日付を選択してください',
          status: 'warning',
          duration: 3000, // トーストが表示される時間（ミリ秒）
          isClosable: true, // ユーザーが手動でトーストを閉じることができるかどうか
        });
        return;
      }

      // バックエンドに日付範囲を送信し、結果を取得
      const response = await axios.get<ResponseData>('http://localhost:8000/api/get-ingredients-list', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
  
      // 取得したデータを確認
      // menuData プロパティが存在することを確認
      if (response.data && response.data.menuData) {
        setMenuData(response.data.menuData);
      } else {
        console.error('Menu data is not available in the response.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  return (
    <>
      <Box p={8}>
        <Heading mb={4}>材料リスト</Heading>
        <SearchForm onSearch={handleSearch} />

        {menuData && (
  <Box>
    <Heading as="h2" size="md" mb={2}>
      メニュー
    </Heading>
    <List>
      {menuData.map((menu) => (
        <ListItem key={menu.menu_id}>
          {menu.date} - {menu.dish_name}
        </ListItem>
      ))}
    </List>

    <Heading as="h2" size="md" mt={4} mb={2}>
      材料
    </Heading>
    <List>
      {menuData.map((menuItem) => (
        <ListItem key={menuItem.menu_id}>
          {menuItem.ingredients.map((ingredient, index) => (
            <ListItem key={index}>{ingredient}</ListItem>
          ))}
        </ListItem>
      ))}
    </List>
  </Box>
)}

      </Box>
    </>
  );
};

export default IngredientsList;