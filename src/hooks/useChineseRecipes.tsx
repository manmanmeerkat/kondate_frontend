import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useFetchUserData from './useFetchUserData';

export const useChineseRecipes = () => {
  const [ChineseRecipes, setChineseRecipes] = useState([]);
  const { user } = useFetchUserData();  // useFetchUserData フックを使ってユーザー情報を取得


const getChineseRecipes = useCallback(() => {
  // ログインユーザーのユーザーID (userId) を取得
  const userId = user?.id;  // もしくは user?.user_id に変更するか、実際のデータ構造に合わせて変更
  console.log(userId);

  // ユーザーIDが存在するかチェック
  if (userId) {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      axios.get(`http://localhost:8000/api/user/${userId}/all-my-chinese-recipes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        // レスポンスのdataプロパティ内の中国料理のレシピ情報を取得
        const ChineseRecipes = response.data;

        // 中国料理のレシピ情報をステートにセット
        setChineseRecipes(ChineseRecipes);
      })
      .catch(error => console.error('中国料理のレシピ情報の取得エラー:', error));
    }
  }
}, [user]);


  // コンポーネントがマウントされたときに中国料理のレシピ情報を取得
  useEffect(() => {
    getChineseRecipes();
  }, [getChineseRecipes]);

  return { ChineseRecipes };
};
