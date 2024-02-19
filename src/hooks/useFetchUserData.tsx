// useFetchUserData.ts

import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../components/pages/config/production';
import useAuthToken from './useAuthToken';

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
  const authToken = useAuthToken();

  const fetchUserData = async () => {
    try {
      const response = await axios.get<User>('/api/user', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        });

      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
        console.log('userData', userData);
      } else {
        console.error('サーバーレスポンスエラー:', response);
      }
    } catch (error) {
      console.error('ユーザー情報の取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return {
    user,
    fetchUserData,
  };
};
