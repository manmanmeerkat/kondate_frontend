import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../components/pages/config/production';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface FetchUserDataHook {
  user: User | null;
  fetchUserData: () => Promise<void>;
}

export const useFetchUserData = (): FetchUserDataHook => {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      // CSRFトークン取得
      const csrfResponse = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      console.log('csrfResponse:', csrfResponse); // レスポンス全体を確認
      const csrfToken = csrfResponse.data.csrfToken;
      setCsrfToken(csrfToken);

      // ユーザーデータ取得
      const response = await axios.get(`${config.API_ENDPOINT}/api/user`, {
        withCredentials: true,
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
      } else {
        console.error('サーバーレスポンスエラー:', response);
      }
    } catch (error) {
      console.error('ユーザー情報の取得エラー:', error);
    }
  };

  useEffect(() => {
    // コンポーネントがマウントされたらユーザーデータを取得
    fetchUserData();
  }, []);

  return {
    user,
    fetchUserData,
  };
};
