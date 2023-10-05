import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Heading, Box, Link, Button, useDisclosure } from '@chakra-ui/react';
import { MenuIconButton } from '../../atoms/button/MenuIconButton';
import { MenuDrawer } from '../../molecules/MenuDrawer';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされた際にCSRFトークンを取得
    getCsrfToken();
  }, []);

  // CSRF トークンの取得関数
  const getCsrfToken = async (): Promise<void> => {
    try {
      const csrfResponse = await fetch('http://localhost:8000/api/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });

      if (csrfResponse.ok) {
        const csrfToken = csrfResponse.headers.get('X-CSRF-Token');
        // 取得したトークンをstateに保存
        setCsrfToken(csrfToken);
      }
    } catch (error) {
      console.error('CSRFトークンの取得エラー:', error);
    }
  };

  const onClickHome = useCallback(() => navigate('/'), [navigate]);
  const onClickAllMyDishes = useCallback(() => navigate('/all_my_dishes'), [navigate]);
  const onClickRandomPage = useCallback(() => navigate('/home/random'), [navigate]);
  const onClickCreate = useCallback(() => navigate('/create'), [navigate]);

  // ログアウト処理
  const onClickLogout = useCallback(async () => {
    try {
      if (!csrfToken) {
        // トークンが取得されていない場合の処理
        return;
      }

      // サーバーサイドでのログアウト処理
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // クッキーの削除
      document.cookie = 'auth_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // ローカルストレージからトークンを削除
      localStorage.removeItem('token');

      // ログアウト成功のトースト通知を表示
      toast({
        title: 'ログアウトしました',
        description: 'またのご利用をお待ちしています。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // ログアウト後にホームに遷移
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // エラー時のトースト通知を表示
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
      <Flex
        as="nav"
        bg="teal.500"
        color="white"
        align="center"
        justify="space-between"
        padding={{ base: 3, md: 5 }}
      >
        <Flex align="center" as="a" mr={8} _hover={{ cursor: 'pointer' }} onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: 'md', md: 'lg' }}>
            こんだてずかん
          </Heading>
        </Flex>

        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: 'none', md: 'flex' }}>
          <Box pr={4} onClick={onClickAllMyDishes}>
            <Link>料理一覧</Link>
          </Box>
          <Box pr={4} onClick={onClickRandomPage}>
            <Link>ランダムページ</Link>
          </Box>
          <Box pr={4} onClick={onClickCreate}>
            <Link>新規作成</Link>
          </Box>
        </Flex>

        {/* ログアウトボタン */}
        <Button colorScheme="teal" onClick={onClickLogout}>
          ログアウト
        </Button>

        <MenuIconButton onOpen={onOpen} />
      </Flex>

      <MenuDrawer onClose={onClose} isOpen={isOpen} onClickHome={onClickHome} onClickCreate={onClickCreate} />
    </>
  );
};
