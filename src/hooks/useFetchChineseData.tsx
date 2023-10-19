import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useFetchUserData from './useFetchUserData';

const useFetchChineseData = (endpoint:string) => {
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

export const useChineseSyusai = () => {
  return useFetchChineseData('all-my-chinese-syusai');
};

export const useChineseShirumono = () => {
  return useFetchChineseData('all-my-chinese-shirumono');
};

export const useChineseFukusai = () => {
  return useFetchChineseData('all-my-chinese-fukusai');
};

export const useChineseRecipes = () => {
  return useFetchChineseData('all-my-chinese-recipes');
};
