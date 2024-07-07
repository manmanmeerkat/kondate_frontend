import axios from "axios";
import { useCallback, useState } from "react";
import { useMessage } from "./useMessage";
import { Dish } from "../types/Dish";
import config from "../components/pages/config/production";


export const useAllMyDishes = () => {
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);

  const fetchDishes = useCallback(async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_ENDPOINT}/api/${endpoint}`, {
        withCredentials: true,
      });
      setDishes(response.data);
      return response.data;
    } catch (error) {
      showMessage({ title: "データ取得に失敗しました", status: "error" });
      return [];
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // 全てのメニューを取得
  const getDishes = useCallback(() => fetchDishes("all-my-dish"), [fetchDishes]);

  // 和食カテゴリ
  const getJapanese = useCallback(() => fetchDishes("japanese"), [fetchDishes]);
  const getJapaneseSyusai = useCallback(() => fetchDishes("japanese_syusai"), [fetchDishes]);
  const getJapaneseFukusai = useCallback(() => fetchDishes("japanese_fukusai"), [fetchDishes]);
  const getJapaneseShirumono = useCallback(() => fetchDishes("japanese_shirumono"), [fetchDishes]);
  const getJapaneseOthers = useCallback(() => fetchDishes("japanese_others"), [fetchDishes]);

  // 洋食カテゴリ
  const getWestern = useCallback(() => fetchDishes("western"), [fetchDishes]);
  const getWesternSyusai = useCallback(() => fetchDishes("western_syusai"), [fetchDishes]);
  const getWesternFukusai = useCallback(() => fetchDishes("western_fukusai"), [fetchDishes]);
  const getWesternShirumono = useCallback(() => fetchDishes("western_shirumono"), [fetchDishes]);
  const getWesternOthers = useCallback(() => fetchDishes("western_others"), [fetchDishes]);

  // 中華カテゴリ
  const getChinese = useCallback(() => fetchDishes("chinese"), [fetchDishes]);
  const getChineseSyusai = useCallback(() => fetchDishes("chinese_syusai"), [fetchDishes]);
  const getChineseFukusai = useCallback(() => fetchDishes("chinese_fukusai"), [fetchDishes]);
  const getChineseShirumono = useCallback(() => fetchDishes("chinese_shirumono"), [fetchDishes]);
  const getChineseOthers = useCallback(() => fetchDishes("chinese_others"), [fetchDishes]);

  // その他カテゴリ
  const getOthers = useCallback(() => fetchDishes("others"), [fetchDishes]);
  const getOthersSyusai = useCallback(() => fetchDishes("others_syusai"), [fetchDishes]);
  const getOthersFukusai = useCallback(() => fetchDishes("others_fukusai"), [fetchDishes]);
  const getOthersShirumono = useCallback(() => fetchDishes("others_shirumono"), [fetchDishes]);
  const getOthersOthers = useCallback(() => fetchDishes("others_others"), [fetchDishes]);

  return {
    getDishes,
    getJapanese,
    getJapaneseSyusai,
    getJapaneseFukusai,
    getJapaneseShirumono,
    getJapaneseOthers,
    getWestern,
    getWesternSyusai,
    getWesternFukusai,
    getWesternShirumono,
    getWesternOthers,
    getChinese,
    getChineseSyusai,
    getChineseFukusai,
    getChineseShirumono,
    getChineseOthers,
    getOthers,
    getOthersSyusai,
    getOthersFukusai,
    getOthersShirumono,
    getOthersOthers,
    loading,
    dishes
  };
};