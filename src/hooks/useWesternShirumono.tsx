import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useWesternShirumono = () => { // ここを変更
  const [WesternShirumono, setWesternShirumono] = useState([]); // ここを変更

  // 洋食の汁物情報を取得
  const getWesternShirumono = useCallback(() => { // ここを変更
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-western-shirumono`, { // ここを変更
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の洋食の汁物情報を取得
        const WesternShirumono = response.data; // ここを変更

        // 洋食の汁物情報をステートにセット
        setWesternShirumono(WesternShirumono); // ここを変更
      })
      .catch(error => console.error('洋食の汁物情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに洋食の汁物情報を取得
  useEffect(() => {
    getWesternShirumono();
  }, [getWesternShirumono]);

  return { WesternShirumono }; // ここを変更
};
