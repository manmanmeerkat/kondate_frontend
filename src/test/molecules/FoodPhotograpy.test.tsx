import { render, screen } from '@testing-library/react';
import { FoodPhotography } from '../../components/molecules/FoodPhotograpy';

describe('FoodPhotography', () => {
  test('renders image with correct style when imageFileName is provided', () => {
    const imageFileName = 'example.jpg';
    const defaultImage = 'default.jpg';

    render(<FoodPhotography imageFileName={imageFileName} defaultImage={defaultImage} />);

    const image = screen.getByAltText('Uploaded Image');
    expect(image).toBeInTheDocument();
    
    // 画像のスタイルが正しく適用されていることを確認
    expect(image).toHaveStyle({ width: '160px', height: '160px' });
  });

  test('renders default image with correct style when imageFileName is not provided', () => {
    const defaultImage = 'default.jpg';

    render(<FoodPhotography defaultImage={defaultImage} />);

    const image = screen.getByAltText('Uploaded Image');
    expect(image).toBeInTheDocument();

    // デフォルト画像のスタイルが正しく適用されていることを確認
    expect(image).toHaveStyle({ width: '160px', height: '160px' });
  });

  test('does not render image when neither imageFileName nor defaultImage is provided', () => {
    render(<FoodPhotography />);

    // 画像が表示されていないことを確認
    expect(screen.queryByAltText('Uploaded Image')).toBeNull();
  });
});
