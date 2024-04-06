import { useEffect, useState } from 'react';
import axios from 'axios';
import { MenuItem } from '../store/slices/menuSlice';
import useAuthToken from './useAuthToken';

export const useMenuForDate = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const authToken = useAuthToken();

  const getMenuForDate = async (date: Date |null): Promise<MenuItem[]> => {
    setLoading(true);
    try {
      const formattedDate = date?.toLocaleDateString('en-CA');
      console.log('formattedDate:', formattedDate);
      const response = await axios.get<MenuItem[]>(`/api/recipes/${formattedDate}`, 
      { withCredentials: true ,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        });
      setMenu(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setMenu([]);
      setError('Error fetching menu data');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { menu, loading, error, getMenuForDate };
};