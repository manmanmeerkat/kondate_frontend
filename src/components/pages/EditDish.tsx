import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Select,
  Textarea,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

interface DishParams {
    dishId: string;
    [key: string]: string | undefined;
  }
  
  interface Ingredient {
    id: number;
    name: string;
    // 他のプロパティがあれば追加
  }
  
  interface DishData {
    name: string;
    description: string;
    image_file: File | undefined;
    reference_url: string;
    user_id: string | null;
    ingredients: string[]; // ここを string[] に変更
    genre_id: number | null;
    category_id: number | null;
  }
  
  export const EditDish: React.FC = () => {
    const { dishId } = useParams<DishParams>();
    const [formData, setFormData] = useState<DishData>({
      name: '',
      description: '',
      image_file: undefined,
      reference_url: '',
      user_id: null,
      ingredients: [],
      genre_id: null,
      category_id: null,
    });
    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState('');
    const toast = useToast();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // CSRFトークンの取得
          const csrfResponse = await axios.get('http://localhost:8000/api/csrf-cookie');
          const csrfToken = csrfResponse.data.csrfToken;
          setCsrfToken(csrfToken);
  
          // レシピデータの取得
          const dishResponse = await axios.get(`http://localhost:8000/api/edit/${dishId}`);
          const dishData = dishResponse.data;
  
          // 材料データの取得
          const ingredientsResponse = await axios.get(`http://localhost:8000/api/recipes/${dishId}/ingredients`);
          const ingredientsData: Ingredient[] = ingredientsResponse.data.ingredients;
  
          // フォームデータのセット
          setFormData({
            ...dishData,
            ingredients: ingredientsData.map((ingredient) => ingredient.name),
          });
  
          console.log(formData); // setFormDataが完了した後にログを出力
        } catch (error) {
          console.error('データの取得エラー:', error);
        }
      };
  
      fetchData();
    }, [dishId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFormData((prevData) => ({ ...prevData, image_file: selectedFile }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
    
      if (name === 'genre') {
        // ジャンルごとの処理...
      } else if (name === 'category') {
        // カテゴリーごとの処理...
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value || '' }));
      }
    };
    
  const handleAddIngredient = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, ''],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, ingredients: updatedIngredients }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('image_file', formData.image_file as File);
    formDataToSend.append('reference_url', formData.reference_url);
    formDataToSend.append('user_id', formData.user_id as string);
    formDataToSend.append('genre_id', formData.genre_id?.toString() || '');
    formDataToSend.append('category_id', formData.category_id?.toString() || '');

    const ingredientsData = formData.ingredients;
    formDataToSend.append('ingredients', JSON.stringify(ingredientsData));

    try {
      const response = await axios.put(`http://localhost:8000/api/edit/${dishId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('フォームの更新が成功しました');
        toast({
          title: '更新が完了しました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(`/dish/${dishId}`);
      } else {
        console.error('フォームの更新が失敗しました');
        toast({
          title: '更新失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('エラー:', error);
      toast({
        title: 'エラーが発生しました',
        description: 'フォームの更新中にエラーが発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" minHeight="100vh">
      <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white" width="90%">
        <Heading size="lg" textAlign="center" mb="4">
          レシピを編集
        </Heading>
        <form onSubmit={handleSubmit}>
          <Flex direction="column">
            <FormControl isRequired mb={4}>
              <FormLabel>画像アップロード</FormLabel>
              <Input
                type="file"
                name="image_file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>料理名</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name || ''} 
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>説明</FormLabel>
              <Textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>ジャンル</FormLabel>
              <Select
                name="genre"
                value={formData.genre_id !== null ? String(formData.genre_id) : ""}
                onChange={handleChange}
              >
                <option value="">ジャンルを選択してください</option>
                <option value="1">和食</option>
                <option value="2">洋食</option>
                <option value="3">中華</option>
                <option value="4">その他</option>
              </Select>
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel>カテゴリー</FormLabel>
              <Select
                name="category"
                value={formData.category_id !== null ? String(formData.category_id) : ""}
                onChange={handleChange}
              >
                <option value="">カテゴリを選択してください</option>
                <option value="1">主菜</option>
                <option value="2">副菜</option>
                <option value="3">汁物</option>
                <option value="4">その他</option>
              </Select>
            </FormControl>
            <Wrap spacing={2} mb={4}>
              {formData.ingredients.map((ingredient, index) => (
                <WrapItem key={index} width="19.4%">
                  <Flex>
                  <Input
                    type="text"
                    name={`ingredients[${index}]`}
                    value={String(ingredient) || ''}  
                    onChange={(e) => {
                      const updatedIngredients = [...formData.ingredients];
                      updatedIngredients[index] = e.target.value;
                      setFormData((prevData) => ({ ...prevData, ingredients: updatedIngredients }));
                    }}
                    size="sm"
                    width="100%"
                  />
                    <Button ml={2} colorScheme="red" onClick={() => handleRemoveIngredient(index)}>
                      削除
                    </Button>
                  </Flex>
                </WrapItem>
              ))}
            </Wrap>
            <Button
              type="button"
              colorScheme="blue"
              width="100%"
              fontSize="18px"
              letterSpacing="1px"
              borderRadius="base"
              mt={4}
              onClick={handleAddIngredient}
            >
              材料を追加
            </Button>

            <FormControl mb={4}>
              <FormLabel>参考URL</FormLabel>
              <Input
                type="text"
                name="reference_url"
                value={formData.reference_url || ''}
                onChange={handleChange}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="100%"
              fontSize="18px"
              letterSpacing="1px"
              borderRadius="base"
              mt={4}
            >
              更新
            </Button>
          </Flex>
        </form>
      </Box>
    </VStack>
  );
};
