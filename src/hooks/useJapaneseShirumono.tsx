import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useJapaneseShirumono = () => { // ここを変更
  const [JapaneseShirumono, setJapaneseShirumono] = useState([]); // ここを変更

  // 和食の汁物情報を取得
  const getJapaneseShirumono = useCallback(() => { // ここを変更
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-japanese-shirumono`, { // ここを変更
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の和食の汁物情報を取得
        const JapaneseShirumono = response.data; // ここを変更

        // 和食の汁物情報をステートにセット
        setJapaneseShirumono(JapaneseShirumono); // ここを変更
      })
      .catch(error => console.error('和食の汁物情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに和食の汁物情報を取得
  useEffect(() => {
    getJapaneseShirumono();
  }, [getJapaneseShirumono]);

  return { JapaneseShirumono }; // ここを変更
};
