import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../components/pages/config/production';

export const useGetAllDishes = () => {
  const [dishData, setDishData] = useState({ dishes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(`${config.API_ENDPOINT}/api/admin/getdish`);
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
