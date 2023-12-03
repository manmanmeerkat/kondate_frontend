import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import { DishDetailModal } from '../../../components/organisms/dishes/DisheDetailModal';

const mock = new MockAdapter(axios);

describe('DishDetailModal', () => {
  const mockDish = {
    id: 1,
    name: 'Test Dish',
    genre_id: 1,
    category_id: 1,
    description: 'Test description',
    reference_url: 'http://example.com',
  };

  it('renders DishDetailModal with dish details', async () => {
    // axiosのモックの設定
    mock.onGet('http://localhost:8000/api/dishes/1/ingredients').reply(200, {
      ingredients: [{ id: 1, name: 'Ingredient 1' }],
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <DishDetailModal dish={mockDish} isOpen={true} id={1} onClose={() => {}} handleEdit={() => {}} />
        </MemoryRouter>
      );

      // ローディングスピナーが表示されていることを確認
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      // axiosの非同期処理が完了するまで待機
      await waitFor(() => expect(mock.history.get.length).toBe(1));

      // ローディングスピナーが消え、料理名が表示されていることを確認
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

      expect(screen.getByLabelText(/料理名/i)).toHaveValue('Test Dish');
      // 他のデータも同様に確認

      // 編集ボタンが存在することを確認
      expect(screen.getByText(/編集/i)).toBeInTheDocument();
    });
  });

  it('calls handleEdit when the Edit button is clicked', async () => {
    // handleEdit関数のモック
    const mockHandleEdit = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <DishDetailModal dish={mockDish} isOpen={true} id={1} onClose={() => {}} handleEdit={mockHandleEdit} />
        </MemoryRouter>
      );

      // 編集ボタンをクリック
      fireEvent.click(screen.getByText(/編集/i));
    });

    // handleEdit関数が呼ばれたことを確認
    expect(mockHandleEdit).toHaveBeenCalled();
  });
});
