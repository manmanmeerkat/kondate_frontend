import axios from "axios";
import { useEffect, useState } from "react";

interface UserData {
  // ユーザー情報の型定義
  // 必要なプロパティがあれば追加してください
  id: number;
  name: string;
  // 他のプロパティ...
}

export const GetUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null); // ユーザー情報を格納するステート

  useEffect(() => {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得

      if (userId) {
        axios.get<UserData>(`http://localhost:8000/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => setUserData(response.data))
        .catch(error => console.error('ユーザー情報の取得エラー:', error));
      }
    }
  }, []);

  return {
    userData
  };
};
