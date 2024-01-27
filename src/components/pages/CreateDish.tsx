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
  Text,
} from '@chakra-ui/react';
import { Header } from '../organisms/layout/Header';
import useUserId from '../../hooks/useUserId';
import config from './config/production';

interface FormData {
  name: string;
  description: string;
  genre: string;
  category: string;
  image_file: File | undefined;
  image_path: string | null;
  reference_url: string;
  user_id: string | null;
  ingredients: { name: string; quantity: string }[];
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
  const toast = useToast();
  const [csrfToken, setCsrfToken] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 初期値を true に設定
  const userId = useUserId();
console.log('userId', userId);
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const csrfResponse = await axios.get('${config.API_ENDPOINT}/api/sanctum/csrf-cookie');
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error('CSRFトークンの取得エラー:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  
  useEffect(() => {

    // 初期化はここで行う
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
    // 初回レンダリング時のみ isLoading を false に設定
    setIsLoading(false);
  }, []);

  // userId が変更されるたびに formData を更新
  useEffect(() => {
    if (userId) {
      setFormData((prevData) => ({ ...prevData, user_id: userId }));
    }
  }, [userId]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFormData((prevData) => ({ ...prevData, image_file: selectedFile }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      genre_id: name === 'genre' ? mapGenreToId(value) : prevData.genre_id,
      category_id: name === 'category' ? mapCategoryToId(value) : prevData.category_id,
    }));
  };

  const mapGenreToId = (genre: string): number | null => {
    switch (genre) {
      case '和食':
        return 1;
      case '洋食':
        return 2;
      case '中華':
        return 3;
      case 'その他':
        return 4;
      default:
        return null;
    }
  };

  const mapCategoryToId = (category: string): number | null => {
    switch (category) {
      case '主菜':
        return 1;
      case '副菜':
        return 2;
      case '汁物':
        return 3;
      case 'その他':
        return 4;
      default:
        return null;
    }
  };

  const handleAddIngredient = () => {
    setFormData((prevData) => ({ ...prevData,  ingredients: [...prevData.ingredients, { name: '', quantity: '' }], }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prevData) => {
      const updatedIngredients = [...prevData.ingredients];
      updatedIngredients.splice(index, 1);
      return { ...prevData, ingredients: updatedIngredients };
    });
  };

  const handleIngredientChange = (index: number, field: 'name' | 'quantity', value: string) => {
    setFormData((prevData) => {
      const updatedIngredients = [...prevData.ingredients];
      updatedIngredients[index][field] = value;
      return { ...prevData, ingredients: updatedIngredients };
    });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
      const xsrfToken = getCookie('XSRF-TOKEN');

      let imagePath = formData.image_path;
console.log('formData', formData);
      if (formData.image_file) {
        const imageFormData = new FormData();
        imageFormData.append('image_file', formData.image_file);

        const imageUploadResponse = await axios.post(
          `${config.API_ENDPOINT}/api/upload-image`,
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

     // フォームデータ送信前にingredientsをJSON文字列に変換
      const ingredientsData = JSON.stringify(formData.ingredients);
      formDataToSend.append('ingredients', ingredientsData);

      const response = await axios.post(
        `${config.API_ENDPOINT}/api/create`,
        formDataToSend,
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log('フォームの登録が成功しました');
        toast({
          title: '登録が完了しました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false); // ここで isLoading を false に設定
        navigate(-1);
      } else {
        console.error('フォームの登録が失敗しました');
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
        description: 'フォームの更新中にエラーが発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // ここでも isLoading を false に設定
    }
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  return (
    <>
    <Header />
    <VStack spacing={4} align="center" justify="center" minHeight="100vh">
      <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white" width="90%">
        <Heading size="lg" textAlign="center" mb="4">
          料理を登録する
        </Heading>
        <Text color="red" mb={4}>
            * マークは必須
          </Text>
        <form onSubmit={handleSubmit}>
          <Flex direction="column">
            <FormControl mb={4}>
              <FormLabel>画像</FormLabel>
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

            <FormControl mb={4}>
              <FormLabel>メモ</FormLabel>
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
                  name={`ingredients[${index}].name`}
                  value={ingredient.name}
                  onChange={(e:any) => handleIngredientChange(index, 'name', e.target.value)}
                  size="sm"
                  width="50%"
                  placeholder="材料名"
                />
                <Input
                  type="text"
                  name={`ingredients[${index}].quantity`}
                  value={ingredient.quantity}
                  onChange={(e:any) => handleIngredientChange(index, 'quantity', e.target.value)}
                  size="sm"
                  width="40%"
                  placeholder="数量"
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
              isLoading={isLoading}
            >
              {isLoading ? '作成中...' : '作成'}
            </Button>
            <Button
              colorScheme="teal"
              width="100%"
              fontSize="18px"
              letterSpacing="1px"
              borderRadius="base"
              mt={4}
              onClick={() => navigate(-1)}
            >
              戻る
            </Button>
          </Flex>
        </form>
      </Box>
    </VStack>
    </>
  );
};
