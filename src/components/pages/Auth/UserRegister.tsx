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
  FormErrorMessage,
} from '@chakra-ui/react';
import config from '../config/production';
import { useCookie } from '../../../hooks/useCookie';

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ユーザー登録コンポーネント
export const UserRegister: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const [emailExistsError, setEmailExistsError] = useState<string | null>(null); 
  const { setCookie } = useCookie(); 
  
  const navigate = useNavigate(); // ルーティング用のフック
  const toast = useToast(); // トースト通知用のフック
  const [csrfToken, setCsrfToken] = useState<string>(''); // CSRFトークンを管理するステート

  // コンポーネントの初回レンダリング時にフォームデータを初期化
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
  }, []);

  // 初回レンダリング時にCSRFトークンを取得
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const csrfToken = response.data.csrfToken;
        setCsrfToken(csrfToken);
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        console.log('CSRFトークンを取得しました', csrfToken);
      } catch (error) {
        console.error('CSRFトークンの取得に失敗しました', error);
      }
    };

    fetchCsrfToken(); 
  }, []);

  // フォーム入力の変更を処理する関数
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // メールアドレスのバリデーション
    if (name === 'email') {
      const isValidEmail = validateEmail(value);
      setEmailError(isValidEmail ? null : '正しいEメールアドレスの形式ではありません');
    }

    // パスワードのバリデーション
    if (name === 'password') {
      const isValidPassword = validatePassword(value);
      setPasswordError(isValidPassword ? null : '半角英数字で８文字以上入力してください');
    }
  };

  // メールアドレスのバリデーション関数
  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // パスワードのバリデーション関数
  const validatePassword = (password: string): boolean => {
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
  };

  // ユーザー登録成功時の処理
  const handleRegistrationSuccess = async (token: string) => {
  
    setCookie('authToken', token, 7); // 有効期限を7日に設定

    // 成功メッセージをトーストで表示
    toast({
      title: 'ユーザー登録が完了しました',
      description: 'ようこそ！',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  
    // 登録完了後に料理一覧ページに遷移
    navigate('/all_my_dishes');
  };

  // フォームの送信を処理する関数
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
  
    try {
      setLoading(true); // ローディング状態をtrueに設定
      const response = await axios.post<{ token: string; userId: string }>(
        `/api/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );
  
      const token = response.data.token;
      const userId = response.data.userId;
  
      await handleRegistrationSuccess(token); // 成功時の処理を呼び出す
      setLoading(false); 
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        // バリデーションエラーがある場合
        const validationErrors = error.response.data.errors;
  
        // メールアドレスの重複エラーがあるか確認
        if (validationErrors && validationErrors.email) {
          setEmailError('このメールアドレスは既に登録されています');
        }
      } else {
        console.error('ユーザー登録エラー:', error.response?.data);
      }
      setLoading(false); 
    }
  };
  
  // トップページに戻る処理
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
          <FormControl mt="4" isInvalid={!!emailError || !!emailExistsError}>
            <FormLabel>Eメール</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormErrorMessage>{emailError || emailExistsError}</FormErrorMessage>
          </FormControl>
          <FormControl mt="4" isInvalid={!!passwordError}>
            <FormLabel>パスワード</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FormErrorMessage>{passwordError}</FormErrorMessage>
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
            isLoading={loading} // ローディング中はボタンを無効にする
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
