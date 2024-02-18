import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, FormControl, FormLabel, Input, Button, Flex, useToast } from '@chakra-ui/react';
import config from '../config/production';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      // ログイン状態の復元などの処理を行う
      navigate('/dashboard');
    }
  }, []); // 初回のみ実行するため空の依存配列を指定

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${config.API_ENDPOINT}/api/login`, formData);
      const { token } = response.data;

      // ログイン成功時の処理
      setCookie('token', token, 7); // 7日間有効なクッキーを設定
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('ログインエラー:', error);
      setIsLoading(false);
      toast({
        title: 'ログインエラー',
        description: 'ログインに失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
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
            <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </FormControl>
          <Button mt="6" colorScheme="teal" type="submit" width="100%" fontSize="18px" letterSpacing="1px" borderRadius="base" isLoading={isLoading}>
            ログイン
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

// クッキーを設定する関数
function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// クッキーを取得する関数
function getCookie(name: string) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}
