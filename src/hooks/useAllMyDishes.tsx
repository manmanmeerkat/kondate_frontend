import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useMessage } from "./useMessage";
import config from "../components/pages/config/production";
import useAuthToken from "./useAuthToken";

export const useAllMyDishes = () => {
    const { showMessage } = useMessage();
    const authToken = useAuthToken();
    const [loading, setLoading] = useState(false);
    const [dishes, setDishes] = useState([]);

    // 共通のデータ取得関数
    const fetchData = useCallback(async (url:string) => {
        setLoading(true);
        try {
            const response = await axios.get(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setDishes(response.data);
        } catch (error) {
            showMessage({ title: "データ取得に失敗しました", status: "error" });
        } finally {
            setLoading(false);
        }
    }, [authToken, showMessage]);

    // 全てのメニューを取得
    const getDishes = useCallback(() => fetchData('/api/all-my-dish'), [fetchData]);

    // ジャンルが"和食"のデータを全て取得
    const getJapanese = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/japanese/`), [fetchData]);
    const getJapaneseSyusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/japanese_syusai/`), [fetchData]);
    const getJapaneseFukusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/japanese_fukusai/`), [fetchData]);
    const getJapaneseShirumono = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/japanese_shirumono/`), [fetchData]);
    const getJapaneseOthers = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/japanese_others/`), [fetchData]);

    // ジャンルが"洋食"のデータを全て取得
    const getWestern = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/western/`), [fetchData]);
    const getWesternSyusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/western_syusai/`), [fetchData]);
    const getWesternFukusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/western_fukusai/`), [fetchData]);
    const getWesternShirumono = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/western_shirumono/`), [fetchData]);
    const getWesternOthers = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/western_others/`), [fetchData]);

    // ジャンルが"中華"のデータを全て取得
    const getChinese = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/chinese/`), [fetchData]);
    const getChineseSyusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/chinese_syusai/`), [fetchData]);
    const getChineseFukusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/chinese_fukusai/`), [fetchData]);
    const getChineseShirumono = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/chinese_shirumono/`), [fetchData]);
    const getChineseOthers = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/chinese_others/`), [fetchData]);

    // その他のジャンルのデータを全て取得
    const getOthers = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/others/`), [fetchData]);
    const getOthersSyusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/others_syusai/`), [fetchData]);
    const getOthersFukusai = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/others_fukusai/`), [fetchData]);
    const getOthersShirumono = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/others_shirumono/`), [fetchData]);
    const getOthersOthers = useCallback(() => fetchData(`${config.API_ENDPOINT}/api/others_others/`), [fetchData]);

    // 初回レンダリング時に全てのメニューを取得
    useEffect(() => {
        getDishes();
    }, [getDishes]);

    return {
        getDishes, getJapanese, getJapaneseSyusai, getJapaneseFukusai,
        getJapaneseShirumono, getJapaneseOthers, getWestern, getWesternSyusai,
        getWesternFukusai, getWesternShirumono, getWesternOthers, getChinese,
        getChineseSyusai, getChineseFukusai, getChineseShirumono, getChineseOthers,
        getOthers, getOthersSyusai, getOthersFukusai, getOthersShirumono, getOthersOthers,
        loading, dishes
    };
};
