import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { ja } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import { Stack, Button, InputGroup, Box, Heading, List, ListItem, Text, Menu, useToast, Flex, Divider, Table, Thead, Tr, Th, Tbody, Td, Badge } from '@chakra-ui/react';
import { Header } from '../organisms/layout/Header';

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
        表示
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
        console.log(response.data.menuData);
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
          <Flex>
            {/* 左側のセクション */}
            <Box flex={2}>
              {Object.entries(groupMenusByDate(menuData)).map(([date, menus], index, array) => (
                <Box key={date} mb={index < array.length - 1 ? 4 : 0}>
                  <Heading as="h2" size="lg" mb={2}>
                    {`${date} (${new Date(date).toLocaleDateString('ja', { weekday: 'short' })})`}
                  </Heading>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th
                          textAlign="left"
                          borderRight="1px solid #e0e0e0"
                          position="sticky"
                          left="0"
                          zIndex="1"
                          background="white"
                          width="500px"
                        >
                          メニュー
                        </Th>
                        <Th textAlign="left">材料</Th>
                        <Th textAlign="left">数量</Th> {/* ここに数量のカラムを追加 */}
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
                          <Td>
                            <List fontSize="lg">
                              {menu.ingredients.map((ingredient, index) => (
                                <ListItem key={index} mb={2}>
                                  {ingredient.name}
                                </ListItem>
                              ))}
                            </List>
                          </Td>
                          <Td>
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
            {/* 右側のセクション */}
            <Box flex={1} pl={4}>
              <Heading as="h2" size="lg" mb={2}>
                すべての材料
              </Heading>
              <Divider mb={4} />
              <List fontSize="lg">
                {menuData.reduce((ingredients, menu) => {
                  menu.ingredients.forEach((ingredient) => {
                    const index = ingredients.findIndex((item) => item.name === ingredient.name);
                    if (index !== -1) {
                      ingredients[index].quantity += ingredient.quantity;
                    } else {
                      ingredients.push(ingredient);
                    }
                  });
                  return ingredients;
                }, [] as { name: string; quantity: string }[]).map((ingredient, index) => (
                  <ListItem key={index} mb={2}>
                    {ingredient.name}：{ingredient.quantity}
                  </ListItem>
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