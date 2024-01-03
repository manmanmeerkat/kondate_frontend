// LogoutButton.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import config from '../../pages/config/production';

interface LogoutButtonProps {
  csrfToken: string;
  onLogoutSuccess?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ csrfToken, onLogoutSuccess }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      // ログアウト処理中にボタンを不活性にする
      setIsLoggingOut(true);

      // ログアウトリクエストの送信
      const logoutResponse = await axios.post(`${config.API_ENDPOINT}/api/logout`, null, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });

      if (logoutResponse.data.message === 'Unauthenticated.') {
        // ログアウト成功
        navigate('/login');
        console.log('ログアウトしました');

        // トースト表示
        toast({
          title: 'ログアウトしました',
          description: 'またのご利用をお待ちしています。',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // onLogoutSuccess が渡されていれば呼び出す
        if (onLogoutSuccess && typeof onLogoutSuccess === 'function') {
          onLogoutSuccess();
        }

        // ローカルストレージからトークンとuserIdを削除
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } else {
        // ログアウト失敗
        throw new Error(`Logout failed: ${logoutResponse.data.message}`);
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);

      // エラーの場合もトースト表示
      toast({
        title: 'ログアウトエラー',
        description: 'ログアウト中に問題が発生しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // ログアウト処理が完了したらボタンを活性化する
      setIsLoggingOut(false);
    }
  };

  return (
    <button onClick={handleLogoutClick} disabled={isLoggingOut}>
      {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
};

export { LogoutButton };
