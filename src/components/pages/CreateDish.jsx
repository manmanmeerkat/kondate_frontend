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
  useToast, // useToast フックを追加
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
  });

  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');
  const toast = useToast(); // useToast フックを初期化

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
    });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData({ ...formData, image_file: selectedFile });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    try {
      const response = await axios.post('http://localhost:8000/api/submitform', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (response.status === 201) {
        console.log('フォームの送信が成功しました');
        // 成功時のトーストメッセージを表示
        toast({
          title: '登録が完了しました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(-1); 
        // 成功時の処理を追加
      } else {
        console.error('フォームの送信が失敗しました');
        // 失敗時のトーストメッセージを表示
        toast({
          title: '登録失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        // 失敗時の処理を追加
      }
    } catch (error) {
      console.error('エラー:', error);
      // エラー時のトーストメッセージを表示
      toast({
        title: 'エラーが発生しました',
        description: 'フォームの送信中にエラーが発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // エラー時の処理を追加
    }
  };

  return (
    <div>
      <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
        <Heading size="lg" textAlign="center" mb="4">
          レシピを作成
        </Heading>
        <form onSubmit={handleSubmit}>
          <Flex direction="column">
            <FormControl isRequired>
              <FormLabel>画像アップロード</FormLabel>
              <Input
                type="file"
                name="image_file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>料理名</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>説明</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
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

            <FormControl isRequired>
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

            <FormControl>
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
          <Button
            type="button" // ページ遷移を行わないためtype="button"を指定
            colorScheme="teal"
            width="100%"
            fontSize="18px"
            letterSpacing="1px"
            borderRadius="base"
            mt={4}
            onClick={() => navigate(-1)} // ボタンがクリックされたときの処理でページを戻る
          >
            前のページに戻る
          </Button>
        </form>
      </Box>
    </div>
  );
};
