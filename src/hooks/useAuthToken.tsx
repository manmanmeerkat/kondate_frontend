import { useState, useEffect } from 'react';
import { useCookie } from './useCookie';

// useAuthToken フック
export const useAuthToken = () => {
  const { getCookie } = useCookie(); // useCookie フックから getCookie 関数を取得
  const [authToken, setAuthToken] = useState<string | null>(getCookie('authToken')); // 初期値としてクッキーからトークンを取得

  useEffect(() => {
    // ページがロードされたときにトークンを取得する
    setAuthToken(getCookie('authToken')); // クッキーからトークンを取得し、状態を更新
  }, [getCookie]); // getCookie 関数が変更されると再実行

  return authToken; // 現在のトークンを返す
};

export default useAuthToken;
