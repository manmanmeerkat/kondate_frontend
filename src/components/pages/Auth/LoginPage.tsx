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
import config from '../../../config/production';

interface FormData {
  email: string;
  password: string;
}

interface UserData {
  userId: string;
  token: string;
  message: string;
  role: string;
}


export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // CSRFトークン取得 (Sanctumのログインエンドポイントにアクセスする前に必要)
      await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      // ログインリクエスト
      const response = await axios.post<UserData>(
        `${config.API_ENDPOINT}/api/login`,
        formData,
        { withCredentials: true }
      );

      const { token, userId, message, role } = response.data;

      // Cookieの設定
      document.cookie = `token=${token}; path=/`;
      document.cookie = `userId=${userId}; path=/`;

      console.log(userId, token, role);

      toast({
        title: 'ログインしました',
        description: message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/all_my_dishes');
      }
    } catch (error: any) {
      console.error('ログインエラー:', error.response?.data);

      toast({
        title: 'ログインエラー',
        description: error.response?.data?.message || 'ログインに失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
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
            isLoading={isLoading}
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
