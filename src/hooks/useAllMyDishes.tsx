import axios from "axios"
import { useCallback, useState } from "react"

import { useMessage } from "./useMessage"
import config from "../components/pages/config/production"
export const useAllMyDishes = () => {
    const { showMessage } = useMessage()

    const [loading, setLoading] = useState(false);
    const [dishes, setDishes] = useState([]);

    //全てのメニューを取得
    const getDishes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/all-my-dish', {
            });
            setDishes(response.data.dishes);
            console.log("response",response);
        } catch (error) {
            showMessage({ title: "データ取得に失敗しました", status: "error" });
        } finally {
            setLoading(false);
        }
    }, []);
    


    //ジャンルが"和食"のデータを全て取得
    const getJapanese = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/japanese/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getJapaneseSyusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/japanese_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getJapaneseFukusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/japanese_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getJapaneseShirumono = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/japanese_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getJapaneseOthers = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/japanese_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    //ジャンルが"洋食"のデータを全て取得
    const getWestern = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/western/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getWesternSyusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/western_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getWesternFukusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/western_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getWesternShirumono = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/western_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getWesternOthers = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/western_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    //ジャンルが"中華"のデータを全て取得
    const getChinese = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/chinese/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getChineseSyusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/chinese_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getChineseFukusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/chinese_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getChineseShirumono = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/chinese_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getChineseOthers = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/chinese_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getOthers = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getOthersSyusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/others_syusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getOthersFukusai = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/others_fukusai/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getOthersShirumono = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/others_shirumono/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getOthersOthers = useCallback(() => {
        setLoading(true)
        axios.get(`${config.API_ENDPOINT}/api/others_others/`)
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);


    return { getDishes, getJapanese, getJapaneseSyusai, getJapaneseFukusai, getJapaneseShirumono,getJapaneseOthers,
        getWestern, getWesternSyusai, getWesternFukusai, getWesternShirumono, getWesternOthers,
        getChinese, getChineseShirumono, getChineseSyusai, getChineseFukusai,getChineseOthers, getOthers, getOthersSyusai, getOthersFukusai, getOthersShirumono, getOthersOthers, loading, dishes }
}