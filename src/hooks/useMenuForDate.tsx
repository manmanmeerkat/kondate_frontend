// useMenuForDate.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { MenuItem } from '../store/slices/menuSlice';

export const useMenuForDate = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getMenuForDate = async (date: Date |null): Promise<MenuItem[]> => {
    setLoading(true);
    try {
      const formattedDate = date?.toLocaleDateString('en-CA');
      const response = await axios.get<MenuItem[]>(`http://localhost:8000/api/recipes/${formattedDate}`, { withCredentials: true });
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