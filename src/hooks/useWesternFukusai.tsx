import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useWesternFukusai = () => { // ここを変更
  const [WesternFukusai, setWesternFukusai] = useState([]); // ここを変更

  // 洋食の副菜情報を取得
  const getWesternFukusai = useCallback(() => { // ここを変更
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-western-fukusai`, { // ここを変更
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の洋食の副菜情報を取得
        const WesternFukusai = response.data; // ここを変更

        // 洋食の副菜情報をステートにセット
        setWesternFukusai(WesternFukusai); // ここを変更
      })
      .catch(error => console.error('洋食の副菜情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに洋食の副菜情報を取得
  useEffect(() => {
    getWesternFukusai();
  }, [getWesternFukusai]);

  return { WesternFukusai }; // ここを変更
};
