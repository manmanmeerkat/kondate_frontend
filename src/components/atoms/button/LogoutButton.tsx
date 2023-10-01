import { memo } from "react";
import { Header } from "../organisms/layout/Header";
import { Menu } from "@chakra-ui/react";
// import { UserRegister } from "./UserRegister";
import { LoginPage } from "./Auth/LoginPage";
import { UserRegister } from "./UserRegister";
import axios from 'axios';


export const LogoutButton = memo(() => {
    const handleLogout = () => {
        // ログアウトリクエストを送信
        axios.post('http://localhost:8000/api/logout')
          .then((response) => {
            // ログアウトが成功した場合の処理
            console.log('ログアウト成功:', response.data);
            // ログアウト後の処理を追加（例：ユーザーをログアウト状態にする）
          })
          .catch((error) => {
            // エラーメッセージを表示または処理できます
            console.error('ログアウトエラー:', error.response.data);
          });
      };
    
      return (
        <button onClick={handleLogout}>ログアウト</button>
      );
    });