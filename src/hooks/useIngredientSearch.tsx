// useIngredientSearch.tsx
import { useState } from 'react';
import { Dish } from '../types/Dish';

export const useIngredientSearch = (endpoint: string, user_id: number | undefined) => {
  const [searchedDishes, setSearchedDishes] = useState<Dish[]>([]);

  const handleIngredientSearch = async (searchIngredient: string): Promise<Dish[]> => {
    try {
      if (searchIngredient.trim() === "") {
        // 検索条件が空の場合、すべてのレシピを表示
        setSearchedDishes([]);
        return [];
      } else {
        // ユーザーがログインしている場合にのみ検索を行う
        if (user_id) {
          const response = await fetch(`http://localhost:8000/api/${endpoint}/search?ingredient=${searchIngredient}&user_id=${user_id}`);
          const data = await response.json();

          if (response.ok) {
            setSearchedDishes(data.dishes);
            return data.dishes;
          } else {
            console.error("検索に失敗しました。");
            return [];
          }
        } else {
          console.error("ユーザーがログインしていません。");
          return [];
        }
      }
    } catch (error) {
      console.error("通信エラー:", error);
      return [];
    }
  };

  return { searchedDishes, handleIngredientSearch };
};
