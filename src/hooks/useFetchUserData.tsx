// useFetchUserData.ts

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
  fetchUserData: (token: string) => Promise<void>; // トークンを引数に追加
}

export const useFetchUserData = (): FetchUserDataHook => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get<User>(`${config.API_ENDPOINT}/api/user`, {
        withCredentials: true,
        headers: {
          'X-CSRF-TOKEN': token,
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
    // 何もしない
  }, []);

  return {
    user,
    fetchUserData,
  };
};
