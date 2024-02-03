import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';

const useFetchChineseData = (endpoint: string) => {
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

const createFetchHook = (endpoint: string) => () => useFetchChineseData(endpoint);

export const useChineseSyusai = createFetchHook('all-my-chinese-syusai');
export const useChineseShirumono = createFetchHook('all-my-chinese-shirumono');
export const useChineseFukusai = createFetchHook('all-my-chinese-fukusai');
export const useChineseDishes = createFetchHook('all-my-chinese-foods');
export const useChineseOthers = createFetchHook('all-my-chinese-others');
