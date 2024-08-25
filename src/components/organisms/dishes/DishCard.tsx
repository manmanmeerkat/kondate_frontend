import { Box, Text } from "@chakra-ui/react";
import { memo } from "react";
import { FoodPhotography } from "../../molecules/FoodPhotograpy";

interface DishCardProps {
  id: number; // 料理のID
  imageUrl: string; // 料理の画像URL
  menuType: string; // メニュータイプ（例: 和食、洋食など）
  dishName: string; // 料理名
  onClick: (id: number) => void; // クリック時に呼ばれる関数
}

// Memoized DishCard component
export const DishCard = memo((props: DishCardProps) => {
  const { id, imageUrl, dishName, onClick } = props;

  return (
    <Box
      w={{ base: "160px", md: "240px" }}  // レスポンシブデザインに基づく幅
      h={{ base: "200px", md: "280px" }}  // レスポンシブデザインに基づく高さ
      bg="white"  // 背景色を白に設定
      borderRadius="10px"  // 角を丸くする
      shadow="md"  // 中程度のシャドウを追加
      p={4}  // パディングを設定
      _hover={{ cursor: "pointer", opacity: 0.8 }}  // ホバー時のスタイル
      onClick={() => onClick(id)}  // クリック時にonClick関数を呼び出す
      display="flex"  // フレックスボックスでレイアウトを構成
      flexDirection="column"  // 縦方向に配置
      alignItems="center"  // 中央に配置
      justifyContent="center"  // 中央に配置
    >
      <FoodPhotography  
        imageFileName={imageUrl || "https://kondate-zukan.s3.ap-northeast-1.amazonaws.com/noimage.jpg"}  // 画像URLが指定されていない場合はデフォルト画像を使用
        alt={dishName}  // 画像の代替テキストとして料理名を設定
      />
      <Text 
        fontSize={{ base: "sm", md: "lg" }}  // レスポンシブデザインに基づくフォントサイズ
        mt={{ base: "10px", md: "20px" }}  // レスポンシブデザインに基づくマージン上
        fontWeight="bold"  // 太字
        textAlign="center"  // テキストを中央揃え
        overflow="hidden"  // テキストがボックスからはみ出ないようにする
        textOverflow="ellipsis"  // はみ出たテキストに省略記号を追加
        whiteSpace="nowrap"  // テキストを折り返さず一行で表示
        maxWidth="100%"  // 最大幅を100%に設定
      >
        {dishName}  
      </Text>
    </Box>
  );
});
