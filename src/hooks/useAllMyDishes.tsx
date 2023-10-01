import axios from "axios"
import { useCallback, useState } from "react"

import { useMessage } from "./useMessage"
export const useAllMyDishes = () => {
    const { showMessage } = useMessage()

    const [loading, setLoading] = useState(false);
    const [dishes, setDishes] = useState([]);

    //全てのメニューを取得
    const getDishes = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/menu")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);


    //ジャンルが"和食"のデータを全て取得
    const getJapanese = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/japanese/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getJapaneseSyusai = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/japanese_syusai/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getJapaneseFukusai = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/japanese_fukusai/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getJapaneseSoup = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/japanese_soup/")
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
        axios.get("http://localhost:8000/api/western/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getWesternSyusai = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/western_syusai/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getWesternFukusai = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/western_fukusai/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getWesternSoup = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/western_soup/")
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
        axios.get("http://localhost:8000/api/chinese/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getChineseSyusai = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/chinese_syusai/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getChineseFukusai = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/chinese_fukusai/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    const getChineseSoup = useCallback(() => {
        setLoading(true)
        axios.get("http://localhost:8000/api/chinese_soup/")
        .then((res) => setDishes(res.data))
        .catch(() => {
            showMessage({ title: "データ取得に失敗しました", status:"error" })
        }).finally(() => {
            setLoading(false)
        });
    }, []);

    return { getDishes, getJapanese, getJapaneseSyusai, getJapaneseFukusai, getJapaneseSoup,
        getWestern, getWesternSyusai, getWesternFukusai, getWesternSoup, 
        getChinese, getChineseSoup, getChineseSyusai, getChineseFukusai, loading, dishes }
}