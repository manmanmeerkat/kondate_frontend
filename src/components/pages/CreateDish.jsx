import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  HStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

export const CreateDish = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: '',
    category: '',
    image_file: null,
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
    const fetchCsrfToken = async () => {
      try {
        const csrfResponse = await axios.get('http://localhost:8000/api/csrf-cookie');
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);

        const userId = localStorage.getItem('userId');
        setFormData({ ...formData, user_id: userId });
      } catch (error) {
        console.error('CSRFトークンの取得エラー:', error);
      }
    };

    fetchCsrfToken();

    setFormData({
      name: '',
      description: '',
      genre: '',
      category: '',
      image_file: null,
      reference_url: '',
      user_id: null,
      ingredients: [],
      genre_id: null,
      category_id: null,
    });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData({ ...formData, image_file: selectedFile });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'genre') {
      if (value === '和食') {
        setFormData({ ...formData, [name]: value, genre_id: 1 });
      } else if (value === '洋食') {
        setFormData({ ...formData, [name]: value, genre_id: 2 });
      } else if (value === '中華') {
        setFormData({ ...formData, [name]: value, genre_id: 3 });
      } else if (value === 'その他') {
        setFormData({ ...formData, [name]: value, genre_id: 4 });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'category') {
      if (value === '主菜') {
        setFormData({ ...formData, [name]: value, category_id: 1 });
      } else if (value === '副菜') {
        setFormData({ ...formData, [name]: value, category_id: 2 });
      } else if (value === '汁物') {
        setFormData({ ...formData, [name]: value, category_id: 3 });
      } else if (value === 'その他') {
        setFormData({ ...formData, [name]: value, category_id: 4 });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('genre', formData.genre);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('image_file', formData.image_file);
    formDataToSend.append('reference_url', formData.reference_url);
    formDataToSend.append('user_id', formData.user_id);
    formDataToSend.append('genre_id', formData.genre_id);
    formDataToSend.append('category_id', formData.category_id);

    const ingredientsData = formData.ingredients;
    formDataToSend.append('ingredients', JSON.stringify(ingredientsData));

    try {
      const response = await axios.post('http://localhost:8000/api/submitform', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        console.log('フォームの送信が成功しました');
        toast({
          title: '登録が完了しました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(-1);
      } else {
        console.error('フォームの送信が失敗しました');
        toast({
          title: '登録失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('エラー:', error);
      toast({
        title: 'エラーが発生しました',
        description: 'フォームの送信中にエラーが発生しました。',
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
          レシピを作成
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
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>説明</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>ジャンル</FormLabel>
              <Select
                name="genre"
                value={formData.genre || ""}
                onChange={handleChange}
              >
                <option value="">ジャンルを選択してください</option>
                <option value="和食">和食</option>
                <option value="洋食">洋食</option>
                <option value="中華">中華</option>
                <option value="その他">その他</option>
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>カテゴリー</FormLabel>
              <Select
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
              >
                <option value="">カテゴリを選択してください</option>
                <option value="主菜">主菜</option>
                <option value="副菜">副菜</option>
                <option value="汁物">汁物</option>
                <option value="その他">その他</option>
              </Select>
            </FormControl>

            <Wrap spacing={2} mb={4}>
              {formData.ingredients.map((ingredient, index) => (
                <WrapItem key={index} width="19.4%">
                  <Flex>
                    <Input
                      type="text"
                      name={`ingredients[${index}]`}
                      value={ingredient}
                      onChange={(e) => {
                        const updatedIngredients = [...formData.ingredients];
                        updatedIngredients[index] = e.target.value;
                        setFormData({ ...formData, ingredients: updatedIngredients });
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
                value={formData.reference_url}
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
              作成
            </Button>
          </Flex>
        </form>
      </Box>
    </VStack>
  );
};
