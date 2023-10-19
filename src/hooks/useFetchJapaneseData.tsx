import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useFetchUserData from './useFetchUserData';

const useFetchJapaneseData = (endpoint:string) => {
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

export const useJapaneseSyusai = () => {
  return useFetchJapaneseData('all-my-japanese-syusai');
};

export const useJapaneseShirumono = () => {
  return useFetchJapaneseData('all-my-japanese-shirumono');
};

export const useJapaneseFukusai = () => {
  return useFetchJapaneseData('all-my-japanese-fukusai');
};

export const useJapaneseRecipes = () => {
  return useFetchJapaneseData('all-my-japanese-recipes');
};
