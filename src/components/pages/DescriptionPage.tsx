import React from 'react';

export const DescriptionPage: React.FC = () => {
  return (
    <div>
      <h1>Webアプリの説明ページ</h1>

      <section>
        <h2>セクション1: タイトル1</h2>
        <p>このセクションでは何か重要な情報を説明します。</p>
        <img src="/images/sample1.jpg" alt="サンプル1" />
      </section>

      <section>
        <h2>セクション2: タイトル2</h2>
        <p>ここではもう一つの重要な情報を説明します。</p>
        <img src="/images/sample2.jpg" alt="サンプル2" />
      </section>

      {/* 追加のセクションや画像を必要に応じて追加 */}
    </div>
  );
};

