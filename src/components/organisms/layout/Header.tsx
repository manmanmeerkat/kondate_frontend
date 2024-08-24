import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Flex, Heading, Box, Link, useDisclosure, Select } from '@chakra-ui/react';
import { MenuIconButton } from '../../atoms/button/MenuIconButton';
import { MenuDrawer } from '../../molecules/MenuDrawer';
import axios from 'axios';
import { LogoutButton } from '../../atoms/button/LogoutButton';
import MenuForDate from '../../pages/MenuForDate';
import { SettingsIcon } from '@chakra-ui/icons';

interface HeaderProps {}

// Headerコンポーネントの定義
export const Header: React.FC<HeaderProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // ドロワーの開閉状態を管理するフック
  const navigate = useNavigate(); // ルーティング用のフック
  const toast = useToast(); // トースト通知用のフック
  const [csrfToken, setCsrfToken] = useState<string>(''); // CSRFトークンを管理するステート
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // モバイル表示かどうかを判定するステート
  const [isMenuVisible, setIsMenuVisible] = useState(false); // メニューの表示状態を管理するステート

  // コンポーネントの初回レンダリング時にCSRFトークンを取得し、画面サイズの変更を監視
  useEffect(() => {
    // CSRFトークンを取得する非同期関数
    const fetchCsrfToken = async () => {
      try {
        const csrfResponse = await axios.get('/api/sanctum/csrf-cookie', { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        setCsrfToken(csrfToken); // トークンをステートにセット
      } catch (error) {
        console.error('CSRFトークンの取得エラー:', error); // エラー時のログ
      }
    };

    fetchCsrfToken(); // トークン取得関数を呼び出す

    // 画面サイズ変更時にモバイル表示かどうかを判定する関数
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize); // 画面サイズ変更イベントを監視

    return () => {
      window.removeEventListener('resize', handleResize); // クリーンアップ処理
    };
  }, []);

  // 各ページへのナビゲーションを処理するコールバック関数
  const onClickHome = useCallback(() => navigate('/'), [navigate]);
  const onClickAllMyDishes = useCallback(() => navigate('/all_my_dishes'), [navigate]);
  const onClickCreate = useCallback(() => navigate('/create'), [navigate]);
  const onClickIngredientsList = useCallback(() => navigate('/ingredients_list'), [navigate]);
  const onClickdeleteUser = useCallback(() => navigate('/users/self'), [navigate]);
  const onClickpasswordChange = useCallback(() => navigate('/change_password'), [navigate]);
  const onClickMenuCalendar = useCallback(() => navigate('/menu_calendar'), [navigate]);

  const [selectedOption, setSelectedOption] = useState(''); // ドロップダウンで選択されたオプションを管理するステート

  // ログアウト成功時の処理
  const onLogoutSuccess = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // メニュー表示状態の切り替えを処理する関数
  const handleToggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // 設定変更時の処理
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
      {/* ナビゲーションバー */}
      <Flex as="nav" bg="teal" color="white" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <MenuIconButton onOpen={onOpen} /> {/* メニューアイコンボタン */}

        <Flex align="center" as="a" mr={8} _hover={{ cursor: 'pointer' }} onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: 'md', md: 'lg' }} noOfLines={1}>
            こんだてずかん {/* アプリ名 */}
          </Heading>
        </Flex>

        {/* リンクの表示（デスクトップとモバイルで異なる） */}
        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: 'none', md: 'flex' }}>
          <Box pr={4} onClick={onClickAllMyDishes}>
            <Link>すべての料理</Link>
          </Box>

          {!isMobile && (
            <Box pr={4} onClick={handleToggleMenu}>
              <Link>こんだて作成モード</Link>
            </Box>
          )}

          <Box pr={4} onClick={onClickCreate}>
            <Link>新規登録</Link>
          </Box>

          <Box pr={4} onClick={onClickMenuCalendar}>
            <Link>カレンダー</Link>
          </Box>

          <Box pr={4} onClick={onClickIngredientsList}>
            <Link>材料リスト</Link>
          </Box>
        </Flex>

        {/* ログアウトボタンの表示（モバイルとデスクトップで異なる） */}
        {!isMobile && <LogoutButton csrfToken={csrfToken} onLogoutSuccess={onLogoutSuccess} />}

        {/* 設定メニュー（パスワード変更やアカウント削除） */}
        <Box position="relative" display={{ base: 'inline-block', md: 'flex' }} paddingRight={{ base: 1, md: 8 }}>
          <Select
            value={selectedOption}
            colorScheme="teal"
            onChange={(e) => handleSettingsChange(e.target.value)}
            width="15px"
            variant="unstyled" // 外枠の色を削除する
            iconColor="teal"
            cursor="pointer"
            userSelect="none" // テキスト選択を無効にする
            position="absolute" 
            right={{ base: '20px', md: '30px' }} // スマホ画面では右端、デスクトップ画面ではデフォルト位置
            zIndex="1" // アイコンがセレクトボックスの上に表示されるようにzインデックスを設定
            top="50%" 
            transform="translateY(-50%)" 
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
            pointerEvents={{ base: 'none', md: 'auto' }} // スマホ画面ではクリックを無効にする
          >
            <SettingsIcon />
          </Box>
        </Box>
      </Flex>

      {/* メニューの表示 */}
      {isMenuVisible && <MenuForDate />}

      {/* ドロワーメニュー */}
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
        onClickMenuCalendar={onClickMenuCalendar}
        handleSettingsChange={handleSettingsChange}
        selectedOption={selectedOption}
        csrfToken={csrfToken}
      />
    </>
  );
}
