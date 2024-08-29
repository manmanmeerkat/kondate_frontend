import React, { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";

interface FoodPhotographyProps {
  imageFileName?: string;  // 表示する画像ファイル名のプロパティ
  defaultImage?: string;   // デフォルト画像のプロパティ
  alt?: string;            // 画像のaltテキストのプロパティ
}


export const FoodPhotography: React.FC<FoodPhotographyProps> = ({ imageFileName, defaultImage, alt }) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  // コンポーネントがマウントされたとき、もしくはpropsが変更されたときに実行
  useEffect(() => {
    if (imageFileName) {
      const publicUrl = `${imageFileName}`;  // 画像ファイル名を使用してURLを作成
      setImageUrl(publicUrl);
    } else if (defaultImage) {
      setImageUrl(defaultImage);  // デフォルト画像を設定
    }
  }, [imageFileName, defaultImage]);

  return (
    <Box
      w={{ base: "100px", md: "160px" }}  // スクリーンサイズに応じた幅の指定
      h={{ base: "100px", md: "160px" }}  // スクリーンサイズに応じた高さの指定
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={alt || "Uploaded Image"}  // 画像のaltテキスト、指定がなければ"Uploaded Image"を使用
          boxSize="100%"  // 画像をボックスサイズに合わせる
          objectFit="cover"  // 画像の表示方法を設定、切り抜きで全体を表示
          borderRadius="10px" 
        />
      )}
    </Box>
  );
};
