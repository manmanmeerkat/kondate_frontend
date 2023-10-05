import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  useToast,
} from '@chakra-ui/react';

interface FormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Laravel Sanctumの/csrf-cookieエンドポイントを使用
        const csrfResponse = await axios.get('http://localhost:8000/api/sanctum/csrf-cookie', { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);
        
        

        // コンソールにCSRFトークンを表示
        console.log('CSRFトークン:', csrfToken);
      } catch (error) {
        console.error('CSRFトークンの取得エラー:', error);
      }
    };

    fetchCsrfToken();

    setFormData({
      email: '',
      password: '',
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post<{ token: string; userId: string }>('http://localhost:8000/api/login', formData, {
        withCredentials: true, // クッキーを送信するために必要
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
      })
      .then((response) => {
        console.log('ログイン成功:', response.data);

        const token = response.data.token;
        const userId = response.data.userId;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        toast({
          title: 'ログインしました',
          description: 'ようこそ！',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        navigate('/all_my_dishes');
      })
      .catch((error) => {
        console.error('ログインエラー:', error.response?.data);

        toast({
          title: 'ログインエラー',
          description: 'ログインに失敗しました。',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" flexDirection="column">
      <Box p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg" background="white" width="400px">
        <Heading size="lg" textAlign="center" mb="4">
          ログイン
        </Heading>
        <form onSubmit={handleSubmit}>
          {/* CSRFトークンをメタタグから取得 */}
          <meta name="csrf-token" content={csrfToken} />

          <FormControl mt="4">
            <FormLabel>Eメール</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </FormControl>
          <FormControl mt="4">
            <FormLabel>パスワード</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button
            mt="6"
            colorScheme="teal"
            type="submit"
            width="100%"
            fontSize="18px"
            letterSpacing="1px"
            borderRadius="base"
          >
            ログイン
          </Button>
          <Button
            mt="4"
            variant="outline"
            colorScheme="teal"
            width="100%"
            fontSize="18px"
            letterSpacing="1px"
            borderRadius="base"
            onClick={handleGoToHome}
          >
            トップページに戻る
          </Button>
        </form>
      </Box>
    </Flex>
  );
};
