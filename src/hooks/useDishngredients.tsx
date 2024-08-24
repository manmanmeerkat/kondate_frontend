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

// 特定のレシピの材料を取得するカスタムフック
const useDishIngredients = (dishId: number | null): UseDishIngredients => {
  // 材料を管理するステート
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  // ローディング状態を管理するステート
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // dishId が有効な値であることを確認
    if (dishId) {
      const fetchIngredients = async () => {
        try {
          // APIリクエストを送信して材料を取得
          const response: AxiosResponse<DishIngredientsResponse> = await axios.get(`/api/dishes/${dishId}/ingredients`);
          // 取得した材料をステートに設定
          setIngredients(response.data.ingredients);
          setLoading(false);
        } catch (error) {
          // エラーが発生した場合のログ
          console.error('エラー:', error);
          setLoading(false);
        }
      };

      fetchIngredients();
    }
  }, [dishId]);

  // 材料とローディング状態を返す
  return { ingredients, loading };
};

export default useDishIngredients;
