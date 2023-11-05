import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useFetchUserData } from './useFetchUserData';


const useFetchChineseData = (endpoint: string) => {
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

const createFetchHook = (endpoint: string) => () => useFetchChineseData(endpoint);

export const useChineseSyusai = createFetchHook('all-my-chinese-syusai');
export const useChineseShirumono = createFetchHook('all-my-chinese-shirumono');
export const useChineseFukusai = createFetchHook('all-my-chinese-fukusai');
export const useChineseRecipes = createFetchHook('all-my-chinese-recipes');
export const useChineseOthers = createFetchHook('all-my-chinese-others');

