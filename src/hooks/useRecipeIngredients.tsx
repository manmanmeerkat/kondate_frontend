import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// レシピの材料の型を定義
interface Ingredient {
  id: number;
  name: string;
  // 他にも必要なプロパティがあれば追加
}

// レシピの材料のレスポンスの型を定義
interface RecipeIngredientsResponse {
  ingredients: Ingredient[];
}

// useRecipeIngredients フックの型を定義
interface UseRecipeIngredients {
  ingredients: Ingredient[];
  loading: boolean;
}

const useRecipeIngredients = (recipeId: number | null): UseRecipeIngredients => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // recipeId が有効な値であることを確認
    if (recipeId) {
      const fetchIngredients = async () => {
        try {
          const response: AxiosResponse<RecipeIngredientsResponse> = await axios.get(`http://localhost:8000/api/recipes/${recipeId}/ingredients`);
          setIngredients(response.data.ingredients);
          setLoading(false);
        } catch (error) {
          console.error('エラー:', error);
          setLoading(false);
        }
      };

      fetchIngredients();
    }
  }, [recipeId]); // recipeId が変更されたときのみ再実行

  return { ingredients, loading };
};

export default useRecipeIngredients;
