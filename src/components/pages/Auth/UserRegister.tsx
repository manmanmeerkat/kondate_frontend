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
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const UserRegister: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const navigate = useNavigate();
  const toast = useToast(); // useToast を初期化

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistrationSuccess = (token: string) => {
    localStorage.setItem('token', token);

    // 登録成功のトーストを表示
    toast({
      title: 'ユーザー登録が完了しました',
      description: 'ようこそ！',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    navigate('/all_my_dishes');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post<{ token: string; userId: string }>('http://localhost:8000/api/register', formData)
      .then((response) => {
        console.log('ユーザーが登録されました:', response.data);
        const token = response.data.token;
        const userId = response.data.userId;
        localStorage.setItem('userId', userId);
        handleRegistrationSuccess(token);
      })
      .catch((error) => {
        console.error('ユーザー登録エラー:', error.response?.data);
      });
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box
        p="6"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        background="white"
        width="400px"
      >
        <Heading size="lg" textAlign="center" mb="4">
          ユーザー登録
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>名前</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl mt="4">
            <FormLabel>Eメール</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
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
          <FormControl mt="4">
            <FormLabel>パスワード確認</FormLabel>
            <Input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
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
            ユーザー登録
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
