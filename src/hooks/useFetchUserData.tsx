// useFetchUserData.ts

import { useEffect, useState } from 'react';
import axios from 'axios';

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

  const fetchUserData = async () => {
    try {
      const response = await axios.get<User>('http://localhost:8000/api/user', {
        withCredentials: true,
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
    fetchUserData();
  }, []);

  return {
    user,
    fetchUserData,
  };
};


