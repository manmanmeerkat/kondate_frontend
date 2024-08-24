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
import config from '../config/production';
import { useCookie } from '../../../hooks/useCookie';

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
  }); // フォームデータを管理するステート

  const navigate = useNavigate(); // ルーティング用のフック
  const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態を管理するステート
  const [csrfToken, setCsrfToken] = useState<string>(''); // CSRFトークンを管理するステート
  const { setCookie } = useCookie(); // クッキーを設定するカスタムフック
  const toast = useToast(); // トースト通知用のフック

  // コンポーネントの初回レンダリング時にCSRFトークンを取得する
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const csrfToken = response.data.csrfToken;
        setCsrfToken(csrfToken); // 取得したCSRFトークンをステートに設定
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken; // axiosのデフォルトヘッダーにCSRFトークンを設定
      } catch (error) {
        console.error('CSRFトークンの取得に失敗しました', error);
      }
    };

    fetchCsrfToken(); // 非同期処理を実行してCSRFトークンを取得
  }, []);

  // フォーム入力の変更を処理する関数
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // 入力された値でフォームデータを更新
  };

  // フォームの送信を処理する関数
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // デフォルトのフォーム送信動作をキャンセル

    setIsLoading(true); // ローディング状態をtrueに設定

    try {
      // ログインリクエストを送信
      const response = await axios.post<UserData>(
        `${config.API_ENDPOINT}/api/login`,
        formData,
        {
          withCredentials: true,
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );

      const { token, userId, message, role } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // axiosのデフォルトヘッダーにトークンを設定

      setCookie('authToken', token, 7); // クッキーにトークンを7日間保持


      // 成功メッセージをトーストで表示
      toast({
        title: 'ログインしました',
        description: message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // ユーザーの役割に応じてページを遷移
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/all_my_dishes');
      }
    } catch (error: any) {
      console.error('ログインエラー:', error.response?.data);

      // エラーメッセージをトーストで表示
      toast({
        title: 'ログインエラー',
        description: error.response?.data?.message || 'ログインに失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // ローディング状態をfalseにリセット
    }
  };

  // トップページに戻る処理
  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      {/* ログインフォーム */}
      <Box p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg" background="white" width={{ base: '90%', md: '400px' }}>
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
