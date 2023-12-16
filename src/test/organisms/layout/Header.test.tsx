import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../../../components/organisms/layout/Header';

jest.mock('axios'); // axiosをモック化

describe('Headerコンポーネント', () => {
  test('レンダリングとホームへの遷移が正常に動作する', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // ヘッダーが正しく表示されていることを確認
    const headingElement = screen.getByText(/こんだてずかん/i);
    expect(headingElement).toBeInTheDocument();

    // ホームへのリンクがクリックされた時に適切に遷移するか確認
    fireEvent.click(headingElement);
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  test('料理一覧への遷移が正常に動作する', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // すべての料理へのリンクがクリックされた時に適切に遷移するか確認
    const allDishesLink = screen.getByText(/すべての料理/i);
    fireEvent.click(allDishesLink);
    await waitFor(() => {
      expect(window.location.pathname).toBe('/all_my_dishes');
    });
  });

  test('新規登録への遷移が正常に動作する', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // 新規登録へのリンクがクリックされた時に適切に遷移するか確認
    const registerLink = screen.getByText(/新規登録/i);
    fireEvent.click(registerLink);
    await waitFor(() => {
      expect(window.location.pathname).toBe('/create');
    });
  });

  // 他のテストケースも同様に記述
});
