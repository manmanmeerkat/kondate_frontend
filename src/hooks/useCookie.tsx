
import { useState } from 'react';

export const useCookie = () => {
  const setCookie = (name: string, value: string, days: number): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name: string): string | null => {
    const cookies = document.cookie;
    const cookieArray = cookies.split(';');

    for (const cookie of cookieArray) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  };

  const deleteCookie = (name: string): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() - 1);
    document.cookie = `${name}=;expires=${expires.toUTCString()};path=/`;
  };

  return { setCookie, getCookie, deleteCookie };
};
