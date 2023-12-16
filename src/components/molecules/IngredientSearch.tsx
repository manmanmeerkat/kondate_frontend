import React, { useState } from "react";
import { Input, Button } from "@chakra-ui/react";

interface IngredientSearchProps {
  onSearch: (ingredient: string) => void;
}

export const IngredientSearch: React.FC<IngredientSearchProps> = ({ onSearch }) => {
  const [searchIngredient, setSearchIngredient] = useState("");

  const handleSearch = () => {
    onSearch(searchIngredient);
  };

  return (
    <div>
      <Input
        type="text"
        value={searchIngredient}
        onChange={(e) => setSearchIngredient(e.target.value)}
        placeholder="材料で検索"
      />
      <Button
        colorScheme="black"
        ml="2"
        onClick={handleSearch}
      >
        検索
      </Button>
    </div>
  );
};
