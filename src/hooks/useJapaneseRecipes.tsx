import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useJapaneseRecipes = () => {
  const [japaneseRecipes, setJapaneseRecipes] = useState([]); // 和食のレシピ情報を格納するステート

  // 和食のレシピ情報を取得
  const getJapaneseRecipes = useCallback(() => {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-japanese-recipes`, {
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の和食のレシピ情報を取得
        const japaneseRecipes = response.data;
        console.log(japaneseRecipes);

        // 和食のレシピ情報をステートにセット
        setJapaneseRecipes(japaneseRecipes);
      })
      .catch(error => console.error('和食のレシピ情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに和食のレシピ情報を取得
  useEffect(() => {
    getJapaneseRecipes();
  }, [getJapaneseRecipes]);

  return { japaneseRecipes };
};
