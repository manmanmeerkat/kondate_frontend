// useIngredientSearch.tsx
import { useState } from 'react';
import { Dish } from '../types/Dish';

export const useIngredientSearch = (endpoint: string) => {
  const [searchedRecipes, setSearchedRecipes] = useState<Dish[]>([]);

  const handleIngredientSearch = async (searchIngredient: string): Promise<Dish[]> => {
    try {
      if (searchIngredient.trim() === "") {
        // 検索条件が空の場合、すべてのレシピを表示
        setSearchedRecipes([]);
        return [];
      } else {
        const response = await fetch(`http://localhost:8000/api/${endpoint}/search?ingredient=${searchIngredient}`);
        const data = await response.json();
  
        if (response.ok) {
          setSearchedRecipes(data.recipes);
          return data.recipes;
        } else {
          console.error("検索に失敗しました。");
          return [];
        }
      }
    } catch (error) {
      console.error("通信エラー:", error);
      return [];
    }
  };

  return { searchedRecipes, handleIngredientSearch };
};
