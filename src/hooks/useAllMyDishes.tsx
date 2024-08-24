import axios from "axios"
import { useCallback, useState } from "react"
import { useMessage } from "./useMessage"
import config from "../components/pages/config/production"
import useAuthToken from "./useAuthToken"


export const useAllMyDishes = () => {
    const { showMessage } = useMessage(); // メッセージ表示用のカスタムフックを取得
    const authToken = useAuthToken(); // 認証トークンを取得するカスタムフックを取得
    const [loading, setLoading] = useState(false); // ローディング状態を管理するステート
    const [dishes, setDishes] = useState([]); // 料理データを格納するステート

    // 全てのメニューを取得する関数
    const getDishes = useCallback(async () => {
        setLoading(true); // ローディング開始
        try {
            const response = await axios.get('/api/all-my-dish', {
                withCredentials: true, // クッキーをリクエストに含める
                headers: {
                    Authorization: `Bearer ${authToken}` // 認証トークンをヘッダーに設定
                }
            });
            setDishes(response.data.dishes); // 取得した料理データをステートに保存
        } catch (error) {
            showMessage({ title: "データ取得に失敗しました", status: "error" }); // エラーメッセージを表示
        } finally {
            setLoading(false); // ローディング終了
        }
    }, [authToken, showMessage]);

    // "和食"ジャンルの全データを取得する関数
    const getJapanese = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/japanese/`)
        .then((res) => setDishes(res.data)) // 取得したデータをステートに保存
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" }); // エラーメッセージを表示
        }).finally(() => {
            setLoading(false); // ローディング終了
        });
    }, [showMessage]);

    // "和食"ジャンルの主菜データを取得する関数
    const getJapaneseSyusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/japanese_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "和食"ジャンルの副菜データを取得する関数
    const getJapaneseFukusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/japanese_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "和食"ジャンルの汁物データを取得する関数
    const getJapaneseShirumono = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/japanese_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "和食"ジャンルのその他のデータを取得する関数
    const getJapaneseOthers = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/japanese_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "洋食"ジャンルの全データを取得する関数
    const getWestern = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/western/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "洋食"ジャンルの主菜データを取得する関数
    const getWesternSyusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/western_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "洋食"ジャンルの副菜データを取得する関数
    const getWesternFukusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/western_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "洋食"ジャンルの汁物データを取得する関数
    const getWesternShirumono = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/western_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "洋食"ジャンルのその他のデータを取得する関数
    const getWesternOthers = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/western_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "中華"ジャンルの全データを取得する関数
    const getChinese = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/chinese/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "中華"ジャンルの主菜データを取得する関数
    const getChineseSyusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/chinese_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "中華"ジャンルの副菜データを取得する関数
    const getChineseFukusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/chinese_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "中華"ジャンルの汁物データを取得する関数
    const getChineseShirumono = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/chinese_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // "中華"ジャンルのその他のデータを取得する関数
    const getChineseOthers = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/chinese_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // その他ジャンルの全データを取得する関数
    const getOthers = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // その他ジャンルの主菜データを取得する関数
    const getOthersSyusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/others_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // その他ジャンルの副菜データを取得する関数
    const getOthersFukusai = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/others_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // その他ジャンルの汁物データを取得する関数
    const getOthersShirumono = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/others_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    // その他ジャンルのその他のデータを取得する関数
    const getOthersOthers = useCallback(() => {
        setLoading(true);
        axios.get(`${config.API_ENDPOINT}/api/others_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" });
        }).finally(() => {
            setLoading(false);
        });
    }, [showMessage]);

    
    return {
        getDishes, getJapanese, getJapaneseSyusai, getJapaneseFukusai, getJapaneseShirumono, getJapaneseOthers,
        getWestern, getWesternSyusai, getWesternFukusai, getWesternShirumono, getWesternOthers,
        getChinese, getChineseSyusai, getChineseFukusai, getChineseShirumono, getChineseOthers,
        getOthers, getOthersSyusai, getOthersFukusai, getOthersShirumono, getOthersOthers,
        loading, dishes
    }
}
