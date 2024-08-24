import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';
import { Dish } from '../types/Dish';

// 汎用的なデータ取得フック
const useFetchOthersData = (endpoint: string) => {
  // ユーザーIDを取得するカスタムフック
  const userId = useUserId();
  // データを管理するステート
  const [data, setData] = useState<Dish[]>([]);

  // データ取得関数
  const fetchData = useCallback(async () => {
    try {
      // ユーザーIDがない場合はデータ取得を行わない
      if (!userId) return;

      // APIからデータを取得
      const response = await axios.get(`/api/user/${userId}/${endpoint}`, {
        withCredentials: true,
      });

      // 取得したデータをステートに設定
      setData(response.data);
    } catch (error) {
      // エラーが発生した場合のログ
      console.error('データの取得エラー:', error);
    }
  }, [userId, endpoint]);

  // コンポーネントのマウント時および依存値の変更時にデータを取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // データを返す
  return { data };
};

// フックを生成するための関数
const createFetchHook = (endpoint: string) => () => useFetchOthersData(endpoint);

// 各エンドポイントに対応するカスタムフックをエクスポート
export const useOthersSyusai = createFetchHook('all-my-others-syusai');
export const useOthersShirumono = createFetchHook('all-my-others-shirumono');
export const useOthersFukusai = createFetchHook('all-my-others-fukusai');
export const useOthersDishes = createFetchHook('all-my-others-foods');
export const useOthersOthers = createFetchHook('all-my-others-others');
