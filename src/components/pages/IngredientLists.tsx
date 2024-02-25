import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { ja } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import { Stack, Button, InputGroup, Box, Heading, List, ListItem, Text, Menu, useToast, Flex, Divider, Table, Thead, Tr, Th, Tbody, Td, Badge } from '@chakra-ui/react';
import { Header } from '../organisms/layout/Header';
import config from './config/production';
import useAuthToken from '../../hooks/useAuthToken';

interface Menu {
  menu_id: number;
  date: string;
  dish_name: string;
  ingredients: { name: string; quantity: string }[]; // 材料の名前と数量 
}

interface MenuData {
  menu_id: number;
  menus: Menu[];
  ingredients: { name: string; quantity: string }[]; // 材料の名前と数量 
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
    <Stack spacing={4} mb={8} direction={{ base: 'column', md: 'row' }} align="center">
    <Flex direction={{ base: 'row', md: 'row' }} align="center" justify="center" ml={{ base: 2, md: 0 }} mr={{ base: 2, md: 0 }}>
      <InputGroup flex={{ base: '1', md: 'auto' }} mr={{ base: 0, md: 2 }} mb={{ base: -4, md: 0 }}>
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
      </InputGroup>
      <Text mx={2} my={2} mb={-4} alignSelf="center">～</Text>
      <InputGroup flex={{ base: '1', md: 'auto' }} mr={{ base: 0, md: 2 }} mb={{ base: -4, md: 0 }}>
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
      <Button colorScheme="teal" flex={{ base: '1', md: 'auto' }} mt={{ base: 4, md: 0 }} ml={{ base: 0, md: 2 }} onClick={handleSearch}>
        表示
      </Button>
    </Flex>
  </Stack>
  );
};

export const IngredientsList: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuData[] | null>(null);
  const authToken = useAuthToken();  
  const toast = useToast();

  const handleSearch = async (startDate: string, endDate: string) => {
    try {
      // 日付が選択されていない場合、トースターを表示して処理を中断
      if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
        toast({
          title: '期間を正しく選択してください',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
     // バックエンドに日付範囲を送信し、結果を取得
     const response = await axios.get<ResponseData>(`/api/get-ingredients-list`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });

    // ソート処理を追加（日付の昇順）
    const sortedMenuData = response.data.menuData?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 取得したデータを確認
    // menuData プロパティが存在することを確認
    if (sortedMenuData) {
      setMenuData(sortedMenuData);
    } else {
      console.error('Menu data is not available in the response.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
  
  
  // 同じ日付のメニューをグループ化する関数
  const groupMenusByDate = (menus: Menu[]) => {
    const groupedMenus: { [date: string]: Menu[] } = {};
    menus.forEach((menu) => {
      const date = menu.date;
      if (groupedMenus[date]) {
        groupedMenus[date].push(menu);
      } else {
        groupedMenus[date] = [menu];
      }
    });
    return groupedMenus;
  };

  return (
    <>
      <Header />
      <Box p={8}>
        <Heading mb={4}>材料リスト</Heading>
        <SearchForm onSearch={handleSearch} />
  
        {menuData && (
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Box flex={1}>
              {Object.entries(groupMenusByDate(menuData)).map(([date, menus], index, array) => (
                <Box key={date} mb={index < array.length - 1 ? 4 : 0}>
                  <Heading as="h2" size="lg" mb={2}>
                    {`${date} (${new Date(date).toLocaleDateString('ja', { weekday: 'short' })})`}
                  </Heading>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th textAlign="left" borderRight="1px solid #e0e0e0" position="sticky" left="0" zIndex="1" background="white" width="50%">メニュー</Th>
                        <Th textAlign="left" width="25%">材料</Th>
                        <Th textAlign="left" width="25%">数量</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {menus.map((menu) => (
                        <Tr key={menu.menu_id}>
                          <Td borderRight="1px solid #e0e0e0">
                            <Badge colorScheme="teal" mr={2} fontSize="lg">
                              {menu.dish_name}
                            </Badge>
                          </Td>
                          <Td width="25%">
                            <List fontSize="lg">
                              {menu.ingredients.map((ingredient, index) => (
                                <ListItem key={index} mb={2}>
                                  {ingredient.name}
                                </ListItem>
                              ))}
                            </List>
                          </Td>
                          <Td width="25%">
                            <List fontSize="lg">
                              {menu.ingredients && menu.ingredients.map((count, index) => (
                                <ListItem key={index} mb={2}>
                                  {count.quantity}
                                </ListItem>
                              ))}
                            </List>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {index < array.length - 1 && <Divider mt={4} borderColor="gray.300" />}
                </Box>
              ))}
            </Box>
  
            <Box flex={{ base: 'auto', md: 0.7 }} pl={{ base: 0, md: 4 }}>
              <Heading as="h2" size="lg" mb={2}>
                すべての材料
              </Heading>
              <Divider mb={4} />
              <List fontSize="lg">
                {menuData.reduce((ingredients, menu) => {
                  menu.ingredients.forEach((ingredient) => {
                    const existingIngredient = ingredients.find(
                      (item) => item.name === ingredient.name && item.quantity === ingredient.quantity
                    );

                    if (existingIngredient) {
                      existingIngredient.quantityCount += 1;
                    } else {
                      if (ingredient.name && ingredient.quantity) {
                        ingredients.push({ ...ingredient, quantityCount: 1 });
                      }
                    }
                  });
                  return ingredients;
                }, [] as { name: string; quantity: string; quantityCount: number }[]).map((ingredient, index) => (
                  ingredient.name && ingredient.quantity && ingredient.quantityCount > 0 && (
                    <ListItem key={index} mb={2}>
                      {`${ingredient.name}：${ingredient.quantityCount > 1 ? `${ingredient.quantity} × ${ingredient.quantityCount}` : ingredient.quantity}`}
                    </ListItem>
                  )
                ))}
              </List>
            </Box>
          </Flex>
        )}
      </Box>
    </>
  );
};

export default IngredientsList;
