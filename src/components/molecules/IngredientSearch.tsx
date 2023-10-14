// IngredientSearch.tsx
import React, { useState } from "react";

interface IngredientSearchProps {
  onSearch: (ingredient: string) => void;
}

const IngredientSearch: React.FC<IngredientSearchProps> = ({ onSearch }) => {
  const [searchIngredient, setSearchIngredient] = useState("");

  const handleSearch = () => {
    onSearch(searchIngredient);
  };

  return (
    <div>
      <input
        type="text"
        value={searchIngredient}
        onChange={(e) => setSearchIngredient(e.target.value)}
        placeholder="材料で検索"
      />
      <button onClick={handleSearch}>検索</button>
    </div>
  );
};

export default IngredientSearch;
