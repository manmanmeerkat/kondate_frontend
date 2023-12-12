import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { Stack, Button, Input, InputGroup, InputLeftAddon, Box, Heading, List, ListItem, Text } from '@chakra-ui/react';

interface Menu {
  id: number;
  date: string;
  dish: {
    name: string;
  };
}

interface Ingredient {
  id: number;
  name: string;
}

interface MenuData {
  menus: Menu[];
  ingredients: Ingredient[];
}

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
          onChange={setStartDate} 
          placeholderText='開始日を選択'
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
              {
                startDate
               ? '開始日を選択' : '日付を選択してください'}
            </Box>
          }
        />
        <Text mx={2}>～</Text>
        <DatePicker 
          dateFormat="yyyy/MM/dd"
          selected={endDate} 
          onChange={setEndDate} 
          placeholderText='終了日を選択'
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
              {
                startDate
               ? '' : '終了日を選択'}
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
  const [menuData, setMenuData] = useState<MenuData | null>(null);

  const handleSearch = async (startDate: string, endDate: string) => {
    try {
      // バックエンドに日付範囲を送信し、結果を取得
      const response = await axios.get<MenuData>('http://localhost:8000/api/menus', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      // 取得したデータをセット
      setMenuData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
      <Box p={8}>
        <Heading mb={4}>材料リスト</Heading>
        <SearchForm onSearch={handleSearch} />

        {menuData ? (
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Menu
            </Heading>
            <List>
              {menuData.menus.map((menu) => (
                <ListItem key={menu.id}>
                  {menu.date} - {menu.dish.name}
                </ListItem>
              ))}
            </List>

            <Heading as="h2" size="md" mt={4} mb={2}>
              Ingredients
            </Heading>
            <List>
              {menuData.ingredients.map((ingredient) => (
                <ListItem key={ingredient.id}>{ingredient.name}</ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Text>No data available</Text>
        )}
      </Box>
  );
};

export default IngredientsList;
