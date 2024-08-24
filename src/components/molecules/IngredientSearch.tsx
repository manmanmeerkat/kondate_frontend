import React, { useState } from "react";
import { Input, Button } from "@chakra-ui/react";

interface IngredientSearchProps {
  onSearch: (ingredient: string) => void; // 親コンポーネントに検索キーワードを渡す関数
}

export const IngredientSearch: React.FC<IngredientSearchProps> = ({ onSearch }) => {
  const [searchIngredient, setSearchIngredient] = useState(""); // 検索キーワードを管理する状態

  // 検索ボタンがクリックされたときに呼ばれる関数
  const handleSearch = () => {
    onSearch(searchIngredient); // 親コンポーネントのonSearch関数を呼び出す
  };

  return (
    <div>
      <Input
        type="text"
        value={searchIngredient} // 入力値としてsearchIngredientを使用
        onChange={(e) => setSearchIngredient(e.target.value)} // 入力変更時にsearchIngredientを更新
        placeholder="材料で検索" // 入力フィールドのプレースホルダー
      />
      <Button
        backgroundColor="black" // ボタンの背景色を黒に設定
        color="white" // ボタンのテキスト色を白に設定
        ml="2" // ボタンと入力フィールドの間にマージンを追加
        onClick={handleSearch} // ボタンクリック時にhandleSearch関数を呼び出す
      >
        検索
      </Button>
    </div>
  );
};
