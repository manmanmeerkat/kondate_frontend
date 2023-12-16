import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useFetchUserData } from './useFetchUserData';

const useFetchJapaneseData = (endpoint: string) => {
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

const createFetchHook = (endpoint: string) => () => useFetchJapaneseData(endpoint);

export const useJapaneseSyusai = createFetchHook('all-my-japanese-syusai');
export const useJapaneseShirumono = createFetchHook('all-my-japanese-shirumono');
export const useJapaneseFukusai = createFetchHook('all-my-japanese-fukusai');
export const useJapaneseDishes = createFetchHook('all-my-japanese-foods');
export const useJapaneseOthers = createFetchHook('all-my-japanese-others');

