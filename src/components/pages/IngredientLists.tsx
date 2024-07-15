import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { ja } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import { Stack, Button, InputGroup, Box, Heading, List, ListItem, Text, Menu, useToast, Flex, Divider, Table, Thead, Tr, Th, Tbody, Td, Badge, Spinner } from '@chakra-ui/react';
import { Header } from '../organisms/layout/Header';
import config from './config/production';
import useAuthToken from '../../hooks/useAuthToken';

interface Menu {
  menu_id: number;
  date: string;
  dish_name: string;
  ingredients: { name: string; quantity: string }[]; 
}

interface MenuData {
  menu_id: number;
  menus: Menu[];
  ingredients: { name: string; quantity: string }[]; 
  date: string;
  dish_name: string;
}

interface ResponseData {
  menuData: MenuData[];
}

// ロケールを設定
registerLocale('ja', ja);

const SearchForm: React.FC<{ onSearch: (startDate: string, endDate: string) => void; isLoading: boolean }> = ({ onSearch, isLoading }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearch = async () => {
    onSearch(startDate?.toISOString() || '', endDate?.toISOString() || '');
  };

  return (
    <>
      <Stack spacing={4} mb={8} direction={{ base: 'column', md: 'row' }} align="center">
        <Flex direction={{ base: 'row', md: 'row' }} align="center" justify="center" ml={{ base: 2, md: 0 }} mr={{ base: 2, md: 0 }}>
          <InputGroup flex={{ base: '1', md: 'auto' }} mr={{ base: 0, md: -7 }} mb={{ base: 0, md: 0 }}>
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
          <Text my={2} alignSelf="center">～</Text>
          <InputGroup flex={{ base: '1', md: 'auto' }} mr={{ base: 0, md: 2 }} ml={{ base: 0, md: 2 }} mb={{ base: 0, md: 0 }}>
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
          <Button
            colorScheme="teal"
            flex={{ base: '1', md: 'auto' }}
            mt={{ base: 0, md: 0 }}
            ml={{ base: 0, md: 2 }}
            onClick={handleSearch}
            width={{ base: 'auto', md: '150px' }} // スマホ画面の横幅を150pxに設定
          >
            表示
          </Button>
        </Flex>
      </Stack>
      {isLoading && (
        <Flex justify="center">
          <Spinner color="teal.500" thickness="4px" size="xl" mt={4} />
        </Flex>
      )}
    </>
  );
};

export const IngredientsList: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuData[] | null>(null);
  const authToken = useAuthToken();  
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);


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

      setIsLoading(true); 

  
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

    if (sortedMenuData) {
      setMenuData(sortedMenuData);
    } else {
      console.error('Menu data is not available in the response.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false); 
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
        <Heading mb={4} textAlign={{ base: 'center', md: 'left' }}>材料リスト</Heading>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {menuData && (
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Box flex={{ base: 1, md: 'auto' }}>
              {Object.entries(groupMenusByDate(menuData)).map(([date, menus], index, array) => (
                <Box key={date} mb={index < array.length - 1 ? 4 : 0}>
                  <Heading as="h2" size="lg" mb={2} textAlign={{ base: 'center', md: 'left' }}>
                    {`${date} (${new Date(date).toLocaleDateString('ja', { weekday: 'short' })})`}
                  </Heading>
                  {menus.map((menu) => (
                    <Box key={menu.menu_id} mb={4}>
                      <Badge colorScheme="teal" mb={2} fontSize="lg">{menu.dish_name}</Badge>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th textAlign="left">材料</Th>
                            <Th textAlign="left">数量</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {menu.ingredients.map((ingredient, index) => (
                            <Tr key={index}>
                              <Td>{ingredient.name}</Td>
                              <Td>{ingredient.quantity}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  ))}
                  {index < array.length - 1 && <Divider mt={4} borderColor="gray.300" />}
                </Box>
              ))}
            </Box>
            <Box
              flex={{ base: 'auto', md: 0.7 }}
              pl={{ base: 0, md: 4 }}
              textAlign={{ base: 'left', md: 'left' }} 
              bg="teal.50"
              p={4}
              borderRadius="md"
              width="100%" 
            >
              <Heading as="h2" size="lg" mb={2}>
                すべての材料
              </Heading>
              <Divider mb={4} />
              <List fontSize="lg">
                {menuData.reduce((ingredients, menu) => {
                  menu.ingredients.forEach((ingredient) => {
                    const existingIngredientIndex = ingredients.findIndex(
                      (item) => item.name === ingredient.name && item.quantity === ingredient.quantity
                    );

                    if (existingIngredientIndex !== -1) {
                      ingredients[existingIngredientIndex].quantityCount += 1;
                    } else {
                      if (ingredient.name) {
                        ingredients.push({ ...ingredient, quantityCount: 1 });
                      }
                    }
                  });
                  return ingredients;
                }, [] as { name: string; quantity: string | undefined; quantityCount: number }[]).map((ingredient, index) => (
                  <ListItem key={index} mb={2}>
                    {`${ingredient.name}${ingredient.quantity ? `：${ingredient.quantityCount > 1 ? `${ingredient.quantity} × ${ingredient.quantityCount}` : ingredient.quantity}` : ''}`}
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
