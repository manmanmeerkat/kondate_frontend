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
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

interface FormData {
  name: string;
  description: string;
  genre: string;
  category: string;
  image_file: File | undefined;
  image_path: string | null;
  reference_url: string;
  user_id: string | null;
  ingredients: string[];
  genre_id: number | null;
  category_id: number | null;
}

export const CreateDish = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    genre: '',
    category: '',
    image_file: undefined,
    image_path: null,
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
        const csrfResponse = await axios.get('http://localhost:8000/api/sanctum/csrf-cookie');
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);

        const userId = localStorage.getItem('userId');
        setFormData((prevData) => ({ ...prevData, user_id: userId }));
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
      image_file: undefined,
      image_path: null,
      reference_url: '',
      user_id: null,
      ingredients: [],
      genre_id: null,
      category_id: null,
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFormData((prevData) => ({ ...prevData, image_file: selectedFile }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'genre') {
      setFormData((prevData) => ({
        ...prevData,
        genre: value,
        genre_id: value === '和食' ? 1 : value === '洋食' ? 2 : value === '中華' ? 3 : value === 'その他' ? 4 : null,
      }));
    } else if (name === 'category') {
      setFormData((prevData) => ({
        ...prevData,
        category: value,
        category_id: value === '主菜' ? 1 : value === '副菜' ? 2 : value === '汁物' ? 3 : value === 'その他' ? 4 : null,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleAddIngredient = () => {
    setFormData((prevData) => ({ ...prevData, ingredients: [...prevData.ingredients, ''] }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prevData) => {
      const updatedIngredients = [...prevData.ingredients];
      updatedIngredients.splice(index, 1);
      return { ...prevData, ingredients: updatedIngredients };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const xsrfToken = getCookie('XSRF-TOKEN');
      console.log('XSRF Token:', xsrfToken);

      let imagePath = formData.image_path;

      if (formData.image_file) {
        const imageFormData = new FormData();
        imageFormData.append('image_file', formData.image_file);

        const imageUploadResponse = await axios.post(
          'http://localhost:8000/api/upload-image',
          imageFormData,
          {
            headers: {
              'X-XSRF-TOKEN': xsrfToken,
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );

        imagePath = imageUploadResponse.data.image_path;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image_path', imagePath || '');
      formDataToSend.append('reference_url', formData.reference_url);
      formDataToSend.append('user_id', formData.user_id as string);
      formDataToSend.append('genre_id', formData.genre_id !== null ? String(formData.genre_id) : '');
      formDataToSend.append(
        'category_id',
        formData.category_id !== null ? String(formData.category_id) : ''
      );

      const ingredientsData = formData.ingredients;
      formDataToSend.append('ingredients', JSON.stringify(ingredientsData));

      const response = await axios.post(
        `http://localhost:8000/api/submitform`,
        formDataToSend,
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json',  // Content-Type を設定

          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log('フォームのが登録が成功しました');
        toast({
          title: '登録が完了しました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(-1);
      } else {
        console.error('フォームの登録が失敗しました');
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

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }
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
                value={formData.genre}
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
                value={formData.category}
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
