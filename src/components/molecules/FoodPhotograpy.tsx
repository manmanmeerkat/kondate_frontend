import React, { useState, useEffect } from "react";

interface FoodPhotographyProps {
  imageFileName?: string;
  defaultImage?: string;
}

export const FoodPhotography: React.FC<FoodPhotographyProps> = ({ imageFileName, defaultImage }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // 画像が存在する場合の処理
    if (imageFileName) {
      const publicUrl = `http://localhost:8000/storage/${imageFileName}`;
      setImageUrl(publicUrl);
console.log(imageFileName)
      // 画像のリサイズスタイルを設定
      const imageSizeStyle: React.CSSProperties = {
        width: "160px", // 幅を100pxに設定
        height: "160px", // 高さを100pxに設定
      };
      setImageStyle(imageSizeStyle);
    } else if (defaultImage) {
      // 画像が存在しない場合、defaultImage を表示
      setImageUrl(defaultImage);

      // デフォルト画像のリサイズスタイルを設定
      const imageSizeStyle: React.CSSProperties = {
        width: "160px", // 幅を100pxに設定
        height: "160px", // 高さを100pxに設定
      };
      setImageStyle(imageSizeStyle);
    }
  }, [imageFileName, defaultImage]);

  return (
    <div>
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded Image" style={imageStyle} />
      )}
    </div>
  );
};
