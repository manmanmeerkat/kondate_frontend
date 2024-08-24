import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';

// 日本料理データを取得するカスタムフック
const useFetchJapaneseData = (endpoint: string) => {
  // ユーザーIDを取得するカスタムフック
  const userId = useUserId();
  // データを管理するステート
  const [data, setData] = useState<string[]>([]);

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
const createFetchHook = (endpoint: string) => () => useFetchJapaneseData(endpoint);

// 各エンドポイントに対応するカスタムフックをエクスポート
export const useJapaneseSyusai = createFetchHook('all-my-japanese-syusai');
export const useJapaneseShirumono = createFetchHook('all-my-japanese-shirumono');
export const useJapaneseFukusai = createFetchHook('all-my-japanese-fukusai');
export const useJapaneseDishes = createFetchHook('all-my-japanese-foods');
export const useJapaneseOthers = createFetchHook('all-my-japanese-others');
