import axios, { AxiosResponse } from "axios";
import { useCallback, useState } from "react";

// レシピの型を定義
interface Recipe {
  id: number;
  name: string;
  // 他にも必要なプロパティがあれば追加
}

// APIのレスポンスの型を定義
interface DishDataResponse {
  recipes: Recipe[];
  // 他にも必要なプロパティがあれば追加
}

export const useDishData = () => {
  const [dishData, setDishData] = useState<DishDataResponse | null>(null);

  const getDish = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = localStorage.getItem('userId');

      axios.get<DishDataResponse>(`http://localhost:8000/api/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response: AxiosResponse<DishDataResponse>) => {
        const recipes: Recipe[] = response.data.recipes;
        setDishData({ recipes });
      })
      .catch(error => console.error('ユーザー情報の取得エラー:', error));
    }
  }, []);

  console.log(dishData);
  return { getDish, dishData };
};
