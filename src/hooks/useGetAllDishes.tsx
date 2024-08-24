import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../components/pages/config/production';

// 管理者がすべての料理データを取得するカスタムフック
export const useGetAllDishes = () => {
  // 料理データの状態管理（初期値は空の配列を持つオブジェクト）
  const [dishData, setDishData] = useState({ dishes: [] });
  // データのロード状態を管理するステート
  const [loading, setLoading] = useState(true);

  // コンポーネントのマウント時にデータを取得
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        // 料理データを取得するAPIリクエスト
        const response = await axios.get(`${config.API_ENDPOINT}/api/admin/getdish`);
        // レスポンスデータをステートに設定
        setDishData(response.data); // response.dataがオブジェクトであることを仮定
        setLoading(false); // データ取得完了、ロード状態を解除
      } catch (error) {
        console.error("データ取得エラー:", error);
        setLoading(false); // エラーが発生してもロード状態を解除
      }
    };

    fetchDishes(); // データ取得関数を呼び出す
  }, []); // 空の依存配列により、マウント時にのみ実行される

  return { dishData, loading }; // 取得したデータとロード状態を返す
};
