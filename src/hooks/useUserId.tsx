import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../components/pages/config/production';
import useAuthToken from './useAuthToken';


const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null); // ユーザーIDを格納するステート
  const authToken = useAuthToken(); // 認証トークンを取得するカスタムフックを取得

  useEffect(() => {
    // ユーザー情報を取得する非同期関数
    const fetchUserData = async () => {
      try {
        // CSRFトークンを取得
        const csrfResponse = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`);
        const csrfToken = csrfResponse.data.csrfToken; // 取得したCSRFトークン

        // ユーザー情報を取得
        const userResponse = await axios.get(`${config.API_ENDPOINT}/api/user`, {
          withCredentials: true, // クッキーをリクエストに含める
          headers: {
            'X-CSRF-TOKEN': csrfToken, // CSRFトークンをヘッダーに設定
            'Authorization': `Bearer ${authToken}`, // 認証トークンをヘッダーに設定
          },
        });
        const fetchedUserId = userResponse.data.id; // 取得したユーザーID
        setUserId(fetchedUserId); // ユーザーIDをステートに保存
      } catch (error) {
        console.error('ユーザー情報の取得エラー:', error); // エラーが発生した場合のログ出力
      }
    };

    fetchUserData(); // データ取得関数を呼び出す
  }, [authToken]); // authToken が変更されたときに再実行

  return userId; // ユーザーIDを返す
};

export default useUserId;
