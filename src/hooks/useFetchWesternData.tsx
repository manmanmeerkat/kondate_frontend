import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useUserId from './useUserId';
import { Dish } from '../types/Dish';

// 指定されたエンドポイントからデータを取得するカスタムフック
const useFetchWesternData = (endpoint: string) => {
  // ユーザーIDを取得するフック
  const userId = useUserId();
  // データの状態管理
  const [data, setData] = useState<Dish[]>([]);

  // データを取得する非同期関数
  const fetchData = useCallback(async () => {
    try {
      // ユーザーIDが存在しない場合、データ取得を中止
      if (!userId) return;

      // 指定されたエンドポイントからデータを取得
      const response = await axios.get(`/api/user/${userId}/${endpoint}`, {
        withCredentials: true,
      });

      // 取得したデータをステートに設定
      setData(response.data);
    } catch (error) {
      // データ取得エラーのログ
      console.error('データの取得エラー:', error);
    }
  }, [userId, endpoint]); // `userId` と `endpoint` が変更された時に再実行

  // コンポーネントのマウント時および依存関係の変更時にデータ取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data }; // 取得したデータを返す
};

// エンドポイントに基づいてデータ取得フックを生成する関数
const createFetchHook = (endpoint: string) => () => useFetchWesternData(endpoint);

// 各エンドポイントに対応するデータ取得フックをエクスポート
export const useWesternSyusai = createFetchHook('all-my-western-syusai');
export const useWesternShirumono = createFetchHook('all-my-western-shirumono');
export const useWesternFukusai = createFetchHook('all-my-western-fukusai');
export const useWesternDishes = createFetchHook('all-my-western-foods');
export const useWesternOthers = createFetchHook('all-my-western-others');
