import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useChineseRecipes = () => {
  const [chineseRecipes, setChineseRecipes] = useState([]); // 中国料理のレシピ情報を格納するステート

  // 中国料理のレシピ情報を取得
  const getChineseRecipes = useCallback(() => {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得
      console.log(userId);

      axios.get(`http://localhost:8000/api/user/${userId}/all-my-chinese-recipes`, {
        headers: {
          Authorization: `Bearer ${token}` // トークンをヘッダーに追加
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の中国料理のレシピ情報を取得
        const chineseRecipes = response.data;
        console.log(chineseRecipes);

        // 中国料理のレシピ情報をステートにセット
        setChineseRecipes(chineseRecipes);
      })
      .catch(error => console.error('中国料理のレシピ情報の取得エラー:', error));
    }
  }, []);

  // コンポーネントがマウントされたときに中国料理のレシピ情報を取得
  useEffect(() => {
    getChineseRecipes();
  }, [getChineseRecipes]);

  return { chineseRecipes };
};
