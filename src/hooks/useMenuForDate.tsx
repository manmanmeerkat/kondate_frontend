import { useState } from "react";
import axios from "axios";
import { MenuItem } from "../store/slices/menuSlice";
import useAuthToken from "./useAuthToken";

// 日付に基づくメニューを取得するためのカスタムフック
export const useMenuForDate = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]); // メニューアイテムのステート。初期値は空の配列。
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態を管理するステート。初期値は false。
  const [error, setError] = useState<string | null>(null); // エラーメッセージを管理するステート。初期値は null。
  const authToken = useAuthToken(); // 認証トークンを取得するカスタムフックを使用

  // 指定された日付のメニューを取得する関数
  const getMenuForDate = async (date: Date | null): Promise<MenuItem[]> => {
    setLoading(true); // メニュー取得処理開始時にローディング状態を true に設定
    try {
      // 日付を "YYYY-MM-DD" 形式にフォーマット
      const formattedDate = date?.toLocaleDateString("en-CA");

      // API からメニューを取得
      const response = await axios.get<MenuItem[]>(
        `/api/recipes/${formattedDate}`, // APIエンドポイントに日付を含める
        {
          withCredentials: true, // クッキーをリクエストに含める（認証などのため）
          headers: {
            Authorization: `Bearer ${authToken}`, // 認証トークンをヘッダーに追加
          },
        }
      );
      setMenu(response.data); // 取得したデータをメニューのステートに保存
      setError(null); // エラーが発生しなかった場合、エラーを null に設定
      return response.data; // 取得したメニューを返す
    } catch (error) {
      console.error("Error fetching menu data:", error); // エラーが発生した場合のログ出力
      setMenu([]); // エラーが発生した場合、メニューを空に設定
      setError("Error fetching menu data"); // エラーメッセージを設定
      return []; // 空の配列を返す
    } finally {
      setLoading(false); // データ取得処理終了時にローディング状態を false に設定
    }
  };

  return { menu, loading, error, getMenuForDate }; // ステートと関数を返す
};
