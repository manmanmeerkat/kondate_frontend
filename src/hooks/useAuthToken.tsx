// useAuthToken.js

import { useState, useEffect } from 'react';
import { useCookie } from './useCookie';

export const useAuthToken = () => {
  const { getCookie } = useCookie();
  const [authToken, setAuthToken] = useState(getCookie('laravel_session'));

  useEffect(() => {
    // ページがロードされたときにトークンを取得する
    setAuthToken(getCookie('laravel_session'));
  }, []);

  return authToken;
};

export default useAuthToken;
