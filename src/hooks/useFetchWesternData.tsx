import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useFetchUserData from './useFetchUserData';

const useFetchWesternData = (endpoint:string) => {
  const [data, setData] = useState([]);
  const { user } = useFetchUserData();

  const fetchData = useCallback(() => {
    const userId = user?.id;
    
    if (userId) {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get(`http://localhost:8000/api/user/${userId}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          const fetchedData = response.data;
          setData(fetchedData);
        })
        .catch(error => console.error('データの取得エラー:', error));
      }
    }
  }, [user, endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data };
};

export const useWesternSyusai = () => {
  return useFetchWesternData('all-my-western-syusai');
};

export const useWesternShirumono = () => {
  return useFetchWesternData('all-my-western-shirumono');
};

export const useWesternFukusai = () => {
  return useFetchWesternData('all-my-western-fukusai');
};

export const useWesternRecipes = () => {
  return useFetchWesternData('all-my-western-recipes');
};
