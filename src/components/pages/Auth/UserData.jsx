import axios from "axios";
import { memo, useEffect, useState } from "react";

export const GetUserData = memo(() => {
    const [userData, setUserData] = useState(null); // ユーザー情報を格納するステート

    useEffect(() => {
      // トークンをローカルストレージから取得
      const token = localStorage.getItem('token');
  
      // トークンが存在するかチェック
      if (token) {
        // ログインユーザーのユーザーID (useId) を取得
        const userId = localStorage.getItem('userId'); // またはセッションから取得
        console.log(userId);
  
        fetch(`http://localhost:8000/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // yourAuthTokenに実際のトークンを設定
            }
        })
        .then(response => response.json())
        .then(data => setUserData(data.user))
        .catch(error => console.error('ユーザー情報の取得エラー:', error));
    }
    }, []);
  
    return {
        GetUserProfile,userData
}
});
