import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';
import { Dish } from '../types/Dish';

// 中華料理データを取得するカスタムフック
const useFetchChineseData = (endpoint: string) => {
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
const createFetchHook = (endpoint: string) => () => useFetchChineseData(endpoint);

// 各エンドポイントに対応するカスタムフックをエクスポート
export const useChineseSyusai = createFetchHook('all-my-chinese-syusai');
export const useChineseShirumono = createFetchHook('all-my-chinese-shirumono');
export const useChineseFukusai = createFetchHook('all-my-chinese-fukusai');
export const useChineseDishes = createFetchHook('all-my-chinese-foods');
export const useChineseOthers = createFetchHook('all-my-chinese-others');
