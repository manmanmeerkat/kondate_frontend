import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';

const useFetchOthersData = (endpoint: string) => {
  const userId = useUserId();
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`/api/user/${userId}/${endpoint}`, {
        withCredentials: true,
      });

      setData(response.data);
    } catch (error) {
      console.error('データの取得エラー:', error);
    }
  }, [userId, endpoint]);

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

