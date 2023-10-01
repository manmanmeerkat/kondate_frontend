import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useJapaneseSyusai = () => { // ここを変更
  const [JapaneseSyusai, setJapaneseSyusai] = useState([]); // ここを変更

  // 和食の主菜情報を取得
  const getJapaneseSyusai = useCallback(() => { // ここを変更
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-japanese-syusai`, { // ここを変更
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の和食の主菜情報を取得
        const JapaneseSyusai = response.data; // ここを変更

        // 和食の主菜情報をステートにセット
        setJapaneseSyusai(JapaneseSyusai); // ここを変更
      })
      .catch(error => console.error('和食の主菜情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに和食の主菜情報を取得
  useEffect(() => {
    getJapaneseSyusai();
  }, [getJapaneseSyusai]);

  return { JapaneseSyusai }; // ここを変更
};
