import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useFetchUserData } from './useFetchUserData';

const useFetchOthersData = (endpoint: string) => {
  const { user } = useFetchUserData();
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const userId = user?.id;
      if (!userId) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`http://localhost:8000/api/user/${userId}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(response.data);
    } catch (error) {
      console.error('データの取得エラー:', error);
    }
  }, [user, endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data };
};

const createFetchHook = (endpoint: string) => () => useFetchOthersData(endpoint);

export const useOthersSyusai = createFetchHook('all-my-others-syusai');
export const useOthersShirumono = createFetchHook('all-my-others-shirumono');
export const useOthersFukusai = createFetchHook('all-my-others-fukusai');
export const useOthersDishes = createFetchHook('all-my-others-foods');
export const useOthersOthers = createFetchHook('all-my-others-others');

