import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';

const useFetchJapaneseData = (endpoint: string) => {
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

const createFetchHook = (endpoint: string) => () => useFetchJapaneseData(endpoint);

export const useJapaneseSyusai = createFetchHook('all-my-japanese-syusai');
export const useJapaneseShirumono = createFetchHook('all-my-japanese-shirumono');
export const useJapaneseFukusai = createFetchHook('all-my-japanese-fukusai');
export const useJapaneseDishes = createFetchHook('all-my-japanese-foods');
export const useJapaneseOthers = createFetchHook('all-my-japanese-others');
