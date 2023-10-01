import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useJapaneseFukusai = () => { // ここを変更
  const [JapaneseFukusai, setJapaneseFukusai] = useState([]); // ここを変更

  // 和食の副菜情報を取得
  const getJapaneseFukusai = useCallback(() => { // ここを変更
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-japanese-fukusai`, { // ここを変更
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の和食の副菜情報を取得
        const JapaneseFukusai = response.data; // ここを変更

        // 和食の副菜情報をステートにセット
        setJapaneseFukusai(JapaneseFukusai); // ここを変更
      })
      .catch(error => console.error('和食の副菜情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに和食の副菜情報を取得
  useEffect(() => {
    getJapaneseFukusai();
  }, [getJapaneseFukusai]);

  return { JapaneseFukusai }; // ここを変更
};
