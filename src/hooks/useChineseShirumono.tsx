import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useChineseShirumono = () => { // ここを変更
  const [ChineseShirumono, setChineseShirumono] = useState([]); // ここを変更

  // 中国料理の汁物情報を取得
  const getChineseShirumono = useCallback(() => { // ここを変更
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-chinese-shirumono`, { // ここを変更
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の中国料理の汁物情報を取得
        const ChineseShirumono = response.data; // ここを変更

        // 中国料理の汁物情報をステートにセット
        setChineseShirumono(ChineseShirumono); // ここを変更
      })
      .catch(error => console.error('中国料理の汁物情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに中国料理の汁物情報を取得
  useEffect(() => {
    getChineseShirumono();
  }, [getChineseShirumono]);

  return { ChineseShirumono }; // ここを変更
};
