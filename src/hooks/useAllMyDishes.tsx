import axios from "axios";
import { useCallback, useState } from "react";
import { useMessage } from "./useMessage";
import config from "../components/pages/config/production";
import useAuthToken from "./useAuthToken";

// 型定義
type Dish = {
  // 必要な属性をここに追加
  id: number;
  name: string;
  // ...
};

type Category = "japanese" | "western" | "chinese" | "others";
type Subcategory = "syusai" | "fukusai" | "shirumono" | "others" | "";

export const useAllMyDishes = () => {
  const { showMessage } = useMessage();
  const authToken = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);

  const fetchDishes = useCallback(async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await axios.get<{ dishes: Dish[] }>(`${config.API_ENDPOINT}/api/${endpoint}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setDishes(response.data.dishes);
      console.log("response", response);
      return response.data.dishes;
    } catch (error) {
      showMessage({ title: "データ取得に失敗しました", status: "error" });
      return [];
    } finally {
      setLoading(false);
    }
  }, [authToken, showMessage]);

  const getDishes = useCallback(() => fetchDishes("all-my-dish"), [fetchDishes]);

  const getCategoryDishes = useCallback(
    (category: Category, subcategory: Subcategory = "") => {
      const endpoint = subcategory
        ? `${category}_${subcategory}`
        : category;
      return fetchDishes(endpoint);
    },
    [fetchDishes]
  );

  // カテゴリとサブカテゴリの組み合わせを生成
  const categories: Category[] = ["japanese", "western", "chinese", "others"];
  const subcategories: Subcategory[] = ["syusai", "fukusai", "shirumono", "others", ""];

  // 動的に関数を生成
  const dishFunctions = categories.reduce((acc, category) => {
    subcategories.forEach((subcategory) => {
      const functionName = subcategory
        ? `get${category.charAt(0).toUpperCase() + category.slice(1)}${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`
        : `get${category.charAt(0).toUpperCase() + category.slice(1)}`;
      
      acc[functionName] = () => getCategoryDishes(category, subcategory);
    });
    return acc;
  }, {} as Record<string, () => Promise<Dish[]>>);

  return {
    getDishes,
    ...dishFunctions,
    loading,
    dishes
  };
};