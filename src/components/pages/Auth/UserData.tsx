import axios from "axios";
import { useEffect, useState } from "react";
import config from "../config/production";

interface UserData {
  id: number;
  name: string;
}

export const GetUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null); 

  useEffect(() => {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');

    // トークンが存在するかチェック
    if (token) {
      // ログインユーザーのユーザーID (userId) を取得
      const userId = localStorage.getItem('userId'); // またはセッションから取得

      if (userId) {
        axios.get<UserData>(`${config.API_ENDPOINT}/api/user/${userId}`, {
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
