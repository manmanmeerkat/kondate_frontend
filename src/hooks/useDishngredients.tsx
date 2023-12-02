import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// レシピの材料の型を定義
interface Ingredient {
  id: number;
  name: string;
}

// レシピの材料のレスポンスの型を定義
interface DishIngredientsResponse {
  ingredients: Ingredient[];
}

// useDishIngredients フックの型を定義
interface UseDishIngredients {
  ingredients: Ingredient[];
  loading: boolean;
}

const useDishIngredients = (dishId: number | null): UseDishIngredients => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // dishId が有効な値であることを確認
    if (dishId) {
      const fetchIngredients = async () => {
        try {
          const response: AxiosResponse<DishIngredientsResponse> = await axios.get(`http://localhost:8000/api/dishes/${dishId}/ingredients`);
          setIngredients(response.data.ingredients);
          setLoading(false);
        } catch (error) {
          console.error('エラー:', error);
          setLoading(false);
        }
      };

      fetchIngredients();
    }
  }, [dishId]); // dishId が変更されたときのみ再実行

  return { ingredients, loading };
};

export default useDishIngredients;
