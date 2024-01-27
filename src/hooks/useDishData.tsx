import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import config from "../components/pages/config/production";
import useUserId from "./useUserId";

interface Dishes {
  id: number;
  name: string;
  genre_id: number;
  category_id: number;
  description: string;
  reference_url: string;
}

interface DishDataResponse {
  dishes: Dishes[];
}

const api = axios.create({
  baseURL: `${config.API_ENDPOINT}/api`,
});

export const useDishData = () => {
  const [dishData, setDishData] = useState<DishDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = useUserId();

  const getDish = useCallback(() => {
    const token = localStorage.getItem("token");


    if (token && userId) {
      api.get<DishDataResponse>(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response: AxiosResponse<DishDataResponse>) => {
          console.log("response", response);
          const dishes: Dishes[] = response.data.dishes;
          console.log("dishes", dishes);
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
