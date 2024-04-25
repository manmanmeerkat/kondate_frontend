import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../components/pages/config/production';
import useAuthToken from './useAuthToken';

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const authToken = useAuthToken();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const csrfResponse = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`);
        const csrfToken = csrfResponse.data.csrfToken;

        const userResponse = await axios.get(`${config.API_ENDPOINT}/api/user`, {
          withCredentials: true,
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);
      } catch (error) {
        console.error('ユーザー情報の取得エラー:', error);
      }
    };

    fetchUserData();
  }, []);

  return userId;
};

export default useUserId;
