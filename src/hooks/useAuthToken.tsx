// useAuthToken.js

import { useState, useEffect } from 'react';
import { useCookie } from './useCookie';

export const useAuthToken = () => {
  const { getCookie } = useCookie();
  const [authToken, setAuthToken] = useState(getCookie('authToken'));

  useEffect(() => {
    // ページがロードされたときにトークンを取得する
    setAuthToken(getCookie('authToken'));
  }, []);

  return authToken;
};

export default useAuthToken;
