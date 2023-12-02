import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useFetchUserData } from './useFetchUserData';

const useFetchWesternData = (endpoint: string) => {
  const { user } = useFetchUserData();
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      if (!user?.id) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`http://localhost:8000/api/user/${user.id}/${endpoint}`, {
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

const createFetchHook = (endpoint: string) => () => useFetchWesternData(endpoint);

export const useWesternSyusai = createFetchHook('all-my-western-syusai');
export const useWesternShirumono = createFetchHook('all-my-western-shirumono');
export const useWesternFukusai = createFetchHook('all-my-western-fukusai');
export const useWesternDishes = createFetchHook('all-my-western-foods');
export const useWesternOthers = createFetchHook('all-my-western-others');

