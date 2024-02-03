import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';

const useFetchWesternData = (endpoint: string) => {
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

const createFetchHook = (endpoint: string) => () => useFetchWesternData(endpoint);

export const useWesternSyusai = createFetchHook('all-my-western-syusai');
export const useWesternShirumono = createFetchHook('all-my-western-shirumono');
export const useWesternFukusai = createFetchHook('all-my-western-fukusai');
export const useWesternDishes = createFetchHook('all-my-western-foods');
export const useWesternOthers = createFetchHook('all-my-western-others');
