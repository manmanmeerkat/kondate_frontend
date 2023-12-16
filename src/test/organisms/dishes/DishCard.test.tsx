import { render, screen, fireEvent } from '@testing-library/react';
import { DishCard } from '../../../components/organisms/dishes/DishCard';

// onClickのモック関数
const mockOnClick = jest.fn();

// サンプルのプロパティ
const sampleProps = {
  id: 1,
  imageUrl: 'sample.jpg',
  menuType: 'sampleMenuType',
  dishName: 'サンプル料理',
  onClick: mockOnClick,
};

test('DishCardが正しくレンダリングされ、クリックが処理される', () => {
  // サンプルのプロパティでDishCardをレンダリング
  render(<DishCard {...sampleProps} />);

  // DishCardが正しく表示されているか確認
  expect(screen.getByAltText('サンプル料理')).toBeInTheDocument(); // 画像に対して適切なaltテキストがある場合

  const dishNameElement = screen.getByText('サンプル料理');
  expect(dishNameElement).toBeInTheDocument();

  // DishCardをクリックするイベントをシミュレート
  fireEvent.click(screen.getByRole('img'));

  // onClick関数が正しいIDで呼ばれたか確認
  expect(mockOnClick).toHaveBeenCalledWith(1);
});
