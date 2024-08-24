import { useState } from 'react';
import { Dish } from '../types/Dish';
import config from '../components/pages/config/production';

// 食材でレシピを検索するためのカスタムフック
export const useIngredientSearch = (endpoint: string, user_id: number | undefined) => {
  const [searchedDishes, setSearchedDishes] = useState<Dish[]>([]); // 検索結果のレシピリストを管理するステート

  // 食材でレシピを検索する関数
  const handleIngredientSearch = async (searchIngredient: string): Promise<Dish[]> => {
    try {
      // 検索条件が空の場合は、検索結果を空にして全レシピを表示しない
      if (searchIngredient.trim() === "") {
        setSearchedDishes([]);
        return [];
      } else {
        // ユーザーがログインしている場合にのみ検索を行う
        if (user_id) {
          // APIエンドポイントに対して検索リクエストを送信
          const response = await fetch(`${config.API_ENDPOINT}/api/${endpoint}/search?ingredient=${searchIngredient}&user_id=${user_id}`);
          const data = await response.json(); // レスポンスを JSON 形式でパース

          // レスポンスが成功した場合、検索結果をステートに設定
          if (response.ok) {
            setSearchedDishes(data.dishes);
            return data.dishes;
          } else {
            // レスポンスが失敗した場合のエラーログ出力
            console.error("検索に失敗しました。");
            return [];
          }
        } else {
          // ユーザーがログインしていない場合のエラーログ出力
          console.error("ユーザーがログインしていません。");
          return [];
        }
      }
    } catch (error) {
      // 通信エラーが発生した場合のエラーログ出力
      console.error("通信エラー:", error);
      return [];
    }
  };

  return { searchedDishes, handleIngredientSearch }; // 検索結果と検索処理関数を返す
};
