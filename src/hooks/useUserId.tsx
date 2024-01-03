import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../components/pages/config/production';

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // CSRFトークンの取得
        const csrfResponse = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`);
        const csrfToken = csrfResponse.data.csrfToken;

        // ユーザー情報の取得
        const userResponse = await axios.get(`${config.API_ENDPOINT}/api/user`, {
          withCredentials: true,
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
        });

        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId.toString());
      } catch (error) {
        console.error('ユーザー情報の取得エラー:', error);
      } finally {
        // 非同期処理完了後にisLoadingをfalseに設定
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // isLoadingがtrueの間、userIdをnullに保つ
  return isLoading ? null : userId;
};

export default useUserId;
