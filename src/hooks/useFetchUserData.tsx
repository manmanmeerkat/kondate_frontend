import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthToken from './useAuthToken';

// ユーザー情報の型定義
interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// フックの返り値の型定義
interface FetchUserDataHook {
  user: User | null;
  fetchUserData: () => Promise<void>;
}

export const useFetchUserData = (): FetchUserDataHook => {
  // ユーザー情報のステート
  const [user, setUser] = useState<User | null>(null);
  // 認証トークンを取得するフック
  const authToken = useAuthToken();

  // ユーザー情報を取得する非同期関数
  const fetchUserData = async () => {
    try {
      // APIエンドポイントからユーザー情報を取得
      const response = await axios.get<User>('/api/user', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`, // 認証ヘッダー
        },
      });

      if (response.status === 200) {
        // レスポンスが成功した場合、ユーザー情報をステートに設定
        const userData = response.data;
        setUser(userData);
      } else {
        // レスポンスのステータスが200以外の場合のエラーログ
        console.error('サーバーレスポンスエラー:', response);
      }
    } catch (error) {
      // 通信エラーのログ
      console.error('ユーザー情報の取得エラー:', error);
    }
  };

  // コンポーネントのマウント時にユーザー情報を取得
  useEffect(() => {
    fetchUserData();
  }, [authToken]); // `authToken` が変更された時にも再実行

  return {
    user, // 現在のユーザー情報
    fetchUserData, // ユーザー情報を取得する関数
  };
};
