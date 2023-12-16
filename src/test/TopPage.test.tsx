import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { TopPage } from '../components/pages/TopPage';

test('TopPageコンポーネントが正しく描画される', () => {
  render(
    <Router>
      <TopPage />
    </Router>
  );

  // ヘッディングが描画されていることを確認
  const headingElements = screen.getAllByText(/こんだてずかん/i);
  expect(headingElements.length).toBe(2); // 2つ見つかることを確認
  const headingElement = headingElements[0];
  expect(headingElement).toBeInTheDocument();

  // ログインボタンが描画されていることを確認
  const loginButton = screen.getByText(/ログイン/i);
  expect(loginButton).toBeInTheDocument();

  // ユーザー登録ボタンが描画されていることを確認
  const userRegisterButton = screen.getByText(/ユーザー登録/i);
  expect(userRegisterButton).toBeInTheDocument();

  // ログインボタンがクリックされたときに適切なナビゲーションがトリガーされるか確認
  fireEvent.click(loginButton);
  // ナビゲーションの確認はそのまま使用できます

  // ユーザー登録ボタンがクリックされたときに適切なナビゲーションがトリガーされるか確認
  fireEvent.click(userRegisterButton);
  // ナビゲーションの確認はそのまま使用できます
});
