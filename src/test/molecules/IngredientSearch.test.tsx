import { render, screen, fireEvent } from '@testing-library/react';
import { IngredientSearch } from '../../components/molecules/IngredientSearch';

describe('IngredientSearch', () => {
  test('calls onSearch prop with the correct ingredient when search button is clicked', () => {
    const mockOnSearch = jest.fn();

    render(<IngredientSearch onSearch={mockOnSearch} />);

    // Input要素を取得してテキストを入力
    const inputElement = screen.getByPlaceholderText('材料で検索');
    fireEvent.change(inputElement, { target: { value: 'Carrot' } });

    // 検索ボタンをクリック
    const searchButton = screen.getByText('検索');
    fireEvent.click(searchButton);

    // onSearchが正しく呼び出されたことを確認
    expect(mockOnSearch).toHaveBeenCalledWith('Carrot');
  });

  test('updates the searchIngredient state when input value changes', () => {
    render(<IngredientSearch onSearch={() => {}} />);

    // Input要素を取得してテキストを入力
    const inputElement = screen.getByPlaceholderText('材料で検索');
    fireEvent.change(inputElement, { target: { value: 'Onion' } });

    // stateが正しく更新されたことを確認
    expect(inputElement).toHaveValue('Onion');
  });
});
