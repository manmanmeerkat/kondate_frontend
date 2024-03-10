import React, { useState, useEffect, useRef } from 'react';
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

interface DishParams {
  dishId: string;
  [key: string]: string | undefined;
}

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
}

interface DishData {
  name: string;
  description: string;
  image_file: File | undefined;
  image_path: string | null;
  reference_url: string;
  user_id: string | null;
  ingredients: { name: string; quantity: string }[]; // 各材料に数量を含む
  genre_id: number | null;
  category_id: number | null;
}

export const EditDish: React.FC = () => {
  const { dishId } = useParams<DishParams>();
  const [formData, setFormData] = useState<DishData>({
    name: '',
    description: '',
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
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrfResponse = await axios.get('http://localhost:8000/api/csrf-cookie');
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);

        const [dishResponse, ingredientsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/edit/${dishId}`),
          axios.get(`http://localhost:8000/api/dishes/${dishId}/ingredients`),
        ]);

        const dishData = dishResponse.data;
        const ingredientsData: Ingredient[] = ingredientsResponse.data.ingredients;

        // レシピの材料情報をフォームデータに反映
        const formattedIngredients = ingredientsData.map((ingredient) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
        }));

        setFormData({
          ...dishData,
          ingredients: formattedIngredients,
        });
      } catch (error) {
        console.error('データの取得エラー:', error);
      }
    };

    fetchData();
  }, [dishId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFormData((prevData) => ({ ...prevData, image_file: selectedFile }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'genre_id' || name === 'category_id') {
      setFormData((prevData) => ({ ...prevData, [name]: value ? parseInt(value, 10) : null }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value || '' }));
    }
  };

  useEffect(() => {
  }, [formData]);

  useEffect(() => {
    if (leastDestructiveRef.current) {
      leastDestructiveRef.current.focus();
    }
  }, [isDeleteAlertOpen]);

  const handleAddIngredient = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, { name: '', quantity: '' }],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, ingredients: updatedIngredients }));
  };

  const Image: React.FC = () => {
    if (formData.image_path) {
      return (
        <Box mb={4}>
          <img src={`http://localhost:8000/storage/${formData.image_path}`} alt="Dish" style={{ maxWidth: '100%' }} />
        </Box>
      );
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setIsSubmitting(true);
  
      // CSRF Cookieを同期的に取得
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const xsrfToken = getCookie('XSRF-TOKEN');
  
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

      const response = await axios.put(
        `http://localhost:8000/api/update/${dishId}`,
        formDataToSend,
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast({
          title: '更新が完了しました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(-1);
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
    } finally {
      setIsSubmitting(false); // 送信が完了したらフラグをリセット
    }
  };

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }

  const handleConfirmDelete = () => {
    setIsDeleteAlertOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleteAlertOpen(false);
    try {
    setIsDeleting(true)
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const xsrfToken = getCookie('XSRF-TOKEN');

      const response = await axios.delete(`http://localhost:8000/api/delete/${dishId}`, {
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast({
          title: '削除が完了しました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(-1);
      } else {
        console.error('削除が失敗しました');
        toast({
          title: '削除失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('削除エラー:', error);
      toast({
        title: 'エラーが発生しました',
        description: '削除中にエラーが発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false); // 削除が完了したらフラグをリセット
      setIsSubmitting(false); // 送信が完了したらフラグをリセット
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
            <Image />
            <FormControl mb={4}>
              <FormLabel>画像を変更する</FormLabel>
              <Input
                type="file"
                name="image_file"
                accept="image/*"
                onChange={handleFileChange}
                size="xs" 
                height="26px" // 
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

            <FormControl mb={4}>
              <FormLabel>メモ</FormLabel>
              <Textarea
                name="description"
                value={formData.description !== "null" ? formData.description : ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>ジャンル</FormLabel>
              <Select
                name="genre_id"
                value={formData.genre_id !== null ? formData.genre_id : ''}
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
                name="category_id"
                value={formData.category_id !== null ? String(formData.category_id) : ''}
                onChange={handleChange}
              >
                <option value="">カテゴリを選択してください</option>
                <option value="1">主菜</option>
                <option value="2">副菜</option>
                <option value="3">汁物</option>
                <option value="4">その他</option>
              </Select>
            </FormControl>
            <FormLabel>材料</FormLabel>
            <Wrap spacing={1} mb={4} flexDirection={{ base: 'column', md: 'row' }}>
              {formData.ingredients.map((ingredient, index) => (
                <WrapItem key={index} width={{ base: '100%', md: '33%' }}>
                  <Flex>
                    <Input
                      type="text"
                      name={`ingredients[${index}].name`}
                      value={ingredient.name || ''}
                      onChange={(e) => {
                        const updatedIngredients = [...formData.ingredients];
                        updatedIngredients[index].name = e.target.value;
                        setFormData((prevData) => ({ ...prevData, ingredients: updatedIngredients }));
                      }}
                      size="sm"
                      width="70%"
                      placeholder="材料名"
                    />
                    <Input
                      type="text"
                      name={`ingredients[${index}].quantity`}
                      value={ingredient.quantity || ''}
                      onChange={(e) => {
                        const updatedIngredients = [...formData.ingredients];
                        updatedIngredients[index].quantity = e.target.value;
                        setFormData((prevData) => ({ ...prevData, ingredients: updatedIngredients }));
                      }}
                      size="sm"
                      width="30%"
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
              mt={2}
              onClick={handleAddIngredient}
            >
              材料を追加
            </Button>

            <FormControl mb={4} mt={2}>
              <FormLabel>参考URL</FormLabel>
              <Input
                type="text"
                name="reference_url"
                value={formData.reference_url !== "null" ? formData.reference_url : ''}
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
                isLoading={isSubmitting}
                isDisabled={isSubmitting}  
              >
                更新
              </Button>

              <Button
                type="button"
                colorScheme="red"
                width="100%"
                fontSize="18px"
                letterSpacing="1px"
                borderRadius="base"
                mt={4}
                isLoading={isDeleting}  
                onClick={handleConfirmDelete}
              >
                削除
            </Button>

            {/* 確認のアラート */}
            <AlertDialog
              isOpen={isDeleteAlertOpen}
              leastDestructiveRef={leastDestructiveRef}
              onClose={() => setIsDeleteAlertOpen(false)}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    削除の確認
                  </AlertDialogHeader>
  
                  <AlertDialogBody>
                    本当に削除しますか？
                  </AlertDialogBody>
  
                  <AlertDialogFooter>
                    <Button onClick={() => setIsDeleteAlertOpen(false)}>
                      キャンセル
                    </Button>
                    <Button ref={leastDestructiveRef} colorScheme="red" onClick={handleDelete} ml={3}>
                      削除
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>
        </form>

       {/* 前のページに戻るボタン */}
       <Button
          mt={4}
          onClick={() => navigate(-1)}
          colorScheme="blue" // ボタンの色を変更
          size="sm"
          width="100%" // 幅を100%にして全幅を占めるようにする
          fontSize="18px"
          letterSpacing="1px"
          borderRadius="base"
        >
          戻る
        </Button>
      </Box>
    </VStack>
  );
};