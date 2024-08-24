export const useCookie = () => {
  // クッキーを設定する関数
  const setCookie = (name: string, value: string, days: number): void => {
    // 有効期限を設定
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // クッキーを設定
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  // クッキーを取得する関数
  const getCookie = (name: string): string | null => {
    // クッキーの文字列を取得
    const cookies = document.cookie;
    // クッキーをセミコロンで分割
    const cookieArray = cookies.split(';');

    // 各クッキーを確認
    for (const cookie of cookieArray) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      // 名前が一致するクッキーを返す
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }

    // クッキーが見つからない場合は null を返す
    return null;
  };

  // クッキーを削除する関数
  const deleteCookie = (name: string): void => {
    // 有効期限を過去に設定
    const expires = new Date();
    expires.setTime(expires.getTime() - 1);

    // クッキーを削除
    document.cookie = `${name}=;expires=${expires.toUTCString()};path=/`;
  };

  // 関数を返す
  return { setCookie, getCookie, deleteCookie };
};
