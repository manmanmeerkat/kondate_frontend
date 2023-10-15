import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Heading, Box, Link, Button, useDisclosure } from '@chakra-ui/react';
import { MenuIconButton } from '../../atoms/button/MenuIconButton';
import { MenuDrawer } from '../../molecules/MenuDrawer';
import axios from 'axios';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const [logoutEnabled, setLogoutEnabled] = useState(true); // 初期状態でログアウトが有効
  const [csrfToken, setCsrfToken] = useState<string>(''); // CSRFトークンの状態

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Laravel Sanctumの/csrf-cookieエンドポイントを使用
        const csrfResponse = await axios.get('http://localhost:8000/api/sanctum/csrf-cookie', { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);
        
        

      
      } catch (error) {
        console.error('CSRFトークンの取得エラー:', error);
      }
    };

    // コンポーネント初期化時に同期的に CSRF トークンを取得
    fetchCsrfToken();
  }, []);

  const onClickHome = useCallback(() => navigate('/'), [navigate]);
  const onClickAllMyDishes = useCallback(() => navigate('/all_my_dishes'), [navigate]);
  const onClickRandomPage = useCallback(() => navigate('/home/random'), [navigate]);
  const onClickCreate = useCallback(() => navigate('/create'), [navigate]);

  const onClickLogout = useCallback(async () => {
    try {
      console.log('ログアウトボタンがクリックされました');
  
      // CSRF トークンを参照してログアウトリクエストを送信
      const response = await axios.post('http://localhost:8000/api/logout', null, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true, // クッキーを送信するために必要
      });
  
      if (response.data.message === 'Unauthenticated.') {
        // ログアウト成功
        console.log('ログアウトしました');
  
        // 任意: ログアウト後の処理
        document.cookie = 'auth_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

  
        toast({
          title: 'ログアウトしました',
          description: 'またのご利用をお待ちしています。',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
  
        navigate('/');
      } else {
        // ログアウト失敗
        throw new Error(`Logout failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
  
      toast({
        title: 'ログアウトエラー',
        description: 'ログアウト中に問題が発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [navigate, toast, csrfToken]);
  

  return (
    <>
      <Flex as="nav" bg="teal.500" color="white" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <Flex align="center" as="a" mr={8} _hover={{ cursor: 'pointer' }} onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: 'md', md: 'lg' }}>
            こんだてずかん
          </Heading>
        </Flex>

        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: 'none', md: 'flex' }}>
          <Box pr={4} onClick={onClickAllMyDishes}>
            <Link>すべての料理</Link>
          </Box>
          <Box pr={4} onClick={onClickRandomPage}>
            <Link>ランダムページ</Link>
          </Box>
          <Box pr={4} onClick={onClickCreate}>
            <Link>新規登録</Link>
          </Box>
        </Flex>

        <Button colorScheme="teal" onClick={onClickLogout} isDisabled={!logoutEnabled}>
          ログアウト
        </Button>

        <MenuIconButton onOpen={onOpen} />
      </Flex>

      <MenuDrawer onClose={onClose} isOpen={isOpen} onClickHome={onClickHome} onClickCreate={onClickCreate} />
    </>
  );
};
