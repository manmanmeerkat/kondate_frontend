import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Heading, Box, Link, Button, useDisclosure } from '@chakra-ui/react';
import { MenuIconButton } from './MenuIconButton';
import { MenuDrawer } from '../../molecules/MenuDrawer';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const onClickHome = useCallback(() => navigate("/"), [navigate]);
  const onClickAllMyDishes = useCallback(() => navigate("/all_my_dishes"), [navigate]);
  const onClickRandomPage = useCallback(() => navigate("/home/random"), [navigate]);
  const onClickCreate = useCallback(() => navigate("/create"), [navigate]);

  const onClickLogout = useCallback(() => {
    // ログアウト処理を実行（例：トークンの削除など）
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
  }, [navigate, toast]);

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
        <Flex align="center" as="a" mr={8} _hover={{ cursor: "pointer" }} onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: "md", md: "lg" }}>
            こんだてずかん
          </Heading>
        </Flex>
        
        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: "none", md: "flex" }}>
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
      
      <MenuDrawer onClose={onClose} isOpen={isOpen} onClickHome={onClickHome}  onClickCreate={onClickCreate} />
    </>
  );
};
