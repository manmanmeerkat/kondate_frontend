import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

interface Recipe {
  id: number;
  name: string;
  // 他にも必要なプロパティがあれば追加
}

interface DishDataResponse {
  dishes: Recipe[];
  // 他にも必要なプロパティがあれば追加
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const useDishData = () => {
  const [dishData, setDishData] = useState<DishDataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const getDish = useCallback(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      api.get<DishDataResponse>(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response: AxiosResponse<DishDataResponse>) => {
          const dishes: Recipe[] = response.data.dishes;
          console.log(response.data);
          setDishData({ dishes });
        })
        .catch((error) => console.error("ユーザー情報の取得エラー:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    getDish();
  }, [getDish]);

  return { loading, dishData, getDish };
};
