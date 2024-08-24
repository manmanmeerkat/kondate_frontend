import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import config from "../components/pages/config/production";
import useUserId from "./useUserId";

// レシピの型を定義
interface Dishes {
  id: number;
  name: string;
  genre_id: number;
  category_id: number;
  description: string;
  reference_url: string;
}

// レシピデータのレスポンスの型を定義
interface DishDataResponse {
  dishes: Dishes[];
}

// Axios のインスタンスを作成
const api = axios.create({
  baseURL: `${config.API_ENDPOINT}/api`,
});

// レシピデータを取得するカスタムフック
export const useDishData = () => {
  // レシピデータを管理するステート
  const [dishData, setDishData] = useState<DishDataResponse | null>(null);
  // ローディング状態を管理するステート
  const [loading, setLoading] = useState(true);
  // ユーザーIDを取得するカスタムフック
  const userId = useUserId();

  // レシピデータを取得する非同期関数
  const getDish = useCallback(() => {
    // ユーザーID が存在する場合にのみデータを取得
    if (userId) {
      api.get<DishDataResponse>(`/user/${userId}`)
        .then((response: AxiosResponse<DishDataResponse>) => {
          // レスポンスからレシピデータを抽出
          console.log("response", response);
          const dishes: Dishes[] = response.data.dishes;
          console.log("dishes", dishes);
          setDishData({ dishes });
        })
        .catch((error) => console.error("ユーザー情報の取得エラー:", error))
        .finally(() => setLoading(false)); // ローディング状態を更新
    }
  }, [userId]); // userId が変更された場合に再実行

  // フックの初回レンダリング時にデータを取得
  useEffect(() => {
    getDish();
  }, [getDish]); // getDish 関数が変更された場合に再実行

  // レシピデータとローディング状態を返す
  return { loading, dishData, getDish };
};
