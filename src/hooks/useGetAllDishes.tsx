// useGetAllDishes.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetAllDishes = () => {
  const [dishData, setDishData] = useState({ dishes: [] }); // 初期値をオブジェクトに変更
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/getdish');
        setDishData(response.data); // response.dataがオブジェクトであることを仮定
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  return { dishData, loading };
};
