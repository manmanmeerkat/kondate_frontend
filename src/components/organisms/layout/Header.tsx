import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Heading, Box, Link, useDisclosure, Select } from '@chakra-ui/react';
import { MenuIconButton } from '../../atoms/button/MenuIconButton';
import { MenuDrawer } from '../../molecules/MenuDrawer';
import axios from 'axios';
import { LogoutButton } from '../../atoms/button/LogoutButton';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const [csrfToken, setCsrfToken] = useState<string>(''); // CSRFトークンの状態
  const [headerColor, setHeaderColor] = useState<string>('white'); // ヘッダーの色

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
  const onClickCreate = useCallback(() => navigate('/create'), [navigate]);

  const onLogoutSuccess = useCallback(() => {
    // ログアウト成功時の追加の処理をここに追加できます
    navigate('/');
  }, [navigate]);

  const handleHeaderColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHeaderColor(e.target.value);
  };

  return (
    <>
      <Flex as="nav" bg="teal" color="white" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <Flex align="center" as="a" mr={8} _hover={{ cursor: 'pointer' }} onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: 'md', md: 'lg' }}>
            こんだてずかん
          </Heading>
        </Flex>

        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: 'none', md: 'flex' }}>
          <Box pr={4} onClick={onClickAllMyDishes}>
            <Link>すべての料理</Link>
          </Box>
          
          <Box pr={4} onClick={onClickCreate}>
            <Link>新規登録</Link>
          </Box>
        </Flex>

        <LogoutButton csrfToken={csrfToken} onLogoutSuccess={onLogoutSuccess} />

        <MenuIconButton onOpen={onOpen} />
      </Flex>

      <MenuDrawer onClickAllMyDishes={onClickAllMyDishes} onLogoutSuccess={onLogoutSuccess} onClose={onClose} isOpen={isOpen} onClickHome={onClickHome} onClickCreate={onClickCreate} csrfToken={csrfToken}/>
    </>
  );
};
