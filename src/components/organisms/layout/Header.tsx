import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Heading, Box, Link, useDisclosure, Select } from '@chakra-ui/react';
import { MenuIconButton } from '../../atoms/button/MenuIconButton';
import { MenuDrawer } from '../../molecules/MenuDrawer';
import axios from 'axios';
import { LogoutButton } from '../../atoms/button/LogoutButton';
import MenuForDate from '../../pages/MenuForDate';
import { SettingsIcon } from '@chakra-ui/icons';
import { nodeModuleNameResolver } from 'typescript';


interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [headerColor, setHeaderColor] = useState<string>('white');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const csrfResponse = await axios.get('http://localhost:8000/api/sanctum/csrf-cookie', { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error('CSRFトークンの取得エラー:', error);
      }
    };

    fetchCsrfToken();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onClickHome = useCallback(() => navigate('/'), [navigate]);
  const onClickAllMyDishes = useCallback(() => navigate('/all_my_dishes'), [navigate]);
  const onClickCreate = useCallback(() => navigate('/create'), [navigate]);
  const onClickIngredientsList = useCallback(() => navigate('/ingredients_list'), [navigate]);
  const onClickdeleteUser = useCallback(() => navigate('/users/self'), [navigate]);
  const onClickpasswordChange = useCallback(() => navigate('/change_password'), [navigate]);
  const [selectedOption, setSelectedOption] = useState('');

  const onLogoutSuccess = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleToggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleSettingsChange = (selectedValue: string) => {
  switch (selectedValue) {
    case "deleteAccount":
      onClickdeleteUser();
      break;
    case "changePassword":
      onClickpasswordChange();
      break;
    case "logout":
      onLogoutSuccess();
      break;
    default:
      // サポートされていない値の場合の処理
      break;
  }
};


return (
  <>
    <Flex as="nav" bg="teal" color="white" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
      <MenuIconButton onOpen={onOpen} />

      <Flex align="center" as="a" mr={8} _hover={{ cursor: 'pointer' }} onClick={onClickHome}>
        <Heading as="h1" fontSize={{ base: 'md', md: 'lg' }} noOfLines={1}>
          こんだてずかん
        </Heading>
      </Flex>

      <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: 'none', md: 'flex' }}>
        <Box pr={4} onClick={onClickAllMyDishes}>
          <Link>すべての料理</Link>
        </Box>

        {!isMobile && (
          <Box pr={4} onClick={handleToggleMenu}>
            <Link>こんだて作成</Link>
          </Box>
        )}

        <Box pr={4} onClick={onClickCreate}>
          <Link>新規登録</Link>
        </Box>

        <Box pr={4} onClick={onClickIngredientsList}>
          <Link>材料リスト</Link>
        </Box>
      </Flex>

      {!isMobile && <LogoutButton csrfToken={csrfToken} onLogoutSuccess={onLogoutSuccess} />}

      <Box position="relative" display={{ base: 'inline-block', md: 'flex' }} paddingRight={{ base: 1, md: 8 }}>
        <Select
          value={selectedOption}
          colorScheme="teal"
          onChange={(e) => handleSettingsChange(e.target.value)}
          width="15px" // アイコンの幅を設定
          variant="unstyled" // 外枠の色を削除する
          iconColor="teal" // 
          cursor="pointer"
          userSelect="none" // テキスト選択を無効にする
          position="absolute" // 要素の位置を絶対位置に設定
          right={{ base: '20px', md: '30px' }} // スマホ画面では右端、デスクトップ画面ではデフォルト位置
          zIndex="1" // アイコンがセレクトボックスの上に表示されるようにzインデックスを設定
          top="50%" // 上端を中央に配置
          transform="translateY(-50%)" // 上下中央に配置
        >
          {selectedOption === '' && <option value="" disabled></option>}
          <option value="changePassword" style={{ backgroundColor: 'teal', color: 'white' }}> 　パスワード変更　 </option>
          <option value="deleteAccount" style={{ backgroundColor: 'teal', color: 'white' }}> 　アカウント削除　 </option>
        </Select>
        <Box
  position="absolute"
  top="50%"
  paddingBottom="3px"
  right="10px" // アイコンの位置を右端に設定
  transform="translateY(-50%)"
  display={{ base: 'none', md: 'block' }} // スマホ画面では非表示
>
  <SettingsIcon />
</Box>

      </Box>
    </Flex>
    {isMenuVisible && <MenuForDate />}
    <MenuDrawer
      onClickAllMyDishes={onClickAllMyDishes}
      onLogoutSuccess={onLogoutSuccess}
      handleToggleMenu={handleToggleMenu}
      onClose={onClose}
      isOpen={isOpen}
      onClickHome={onClickHome}
      onClickCreate={onClickCreate}
      onClickIngredientsList={onClickIngredientsList}
      onClickdeleteUser={onClickdeleteUser}
      onClickpasswordChange={onClickpasswordChange}
      handleSettingsChange={handleSettingsChange}
      selectedOption={selectedOption}
      csrfToken={csrfToken}
    />
  </>
);
}