// AllMyDishes.tsx
import React, { memo, useCallback, useEffect, useState } from "react";
import { Header } from "../organisms/layout/Header";
import { Center, Spinner, Wrap, WrapItem, useDisclosure, Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { useDishData } from "../../hooks/useDishData";
import { useAllMyDishes } from "../../hooks/useAllMyDishes";
import { DishCard } from "../organisms/dishes/DishCard";
import { useSelectDish } from "../../hooks/useSelectDish";
import { DishDetailModal } from "../organisms/dishes/DisheDetailModal";
import { GenreButton } from "../molecules/GenreButton";
import { Dish } from "../../types/Dish";
import { SearchIcon } from "@chakra-ui/icons";

interface AllMyDishesProps {}

export const AllMyDishes: React.FC<AllMyDishesProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getDishes, dishes, loading } = useAllMyDishes();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { getDish, dishData } = useDishData();

  useEffect(() => {
    getDish();
  }, []);

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [searchIngredient, setSearchIngredient] = useState<string>("");
  const [searchedRecipes, setSearchedRecipes] = useState<Dish[]>([]);

  const onClickDish = useCallback((id: number) => {
    onSelectDish({ id, dishes, onOpen });
    setSelectedDishId(id);
  }, [dishes, onSelectDish, onOpen]);

  const handleIngredientSearch = async () => {
    try {
      if (searchIngredient.trim() === "") {
        // 検索条件が空の場合、すべてのレシピを表示
        setSearchedRecipes([]);
      } else {
        const response = await fetch(`http://localhost:8000/api/recipes/search?ingredient=${searchIngredient}`);
        const data = await response.json();
  
        if (response.ok) {
          setSearchedRecipes(data.recipes);
        } else {
          console.error("検索に失敗しました。");
        }
      }
    } catch (error) {
      console.error("通信エラー:", error);
    }
  };


return (
  <div>
    <Header />
    <GenreButton />
    <InputGroup mt={4} mx="auto" w={{ base: "80%", md: "60%" }}>
      <Input
        placeholder="材料で検索"
        value={searchIngredient}
        onChange={(e) => setSearchIngredient(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        {/* 検索ボタン */}
        <Button colorScheme="teal" onClick={handleIngredientSearch} size="sm">
          <SearchIcon />
          検索
        </Button>
      </InputRightElement>
    </InputGroup>
    {loading ? (
      <Center h="50vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Spinner />
      </Center>
    ) : (
      <Wrap p={{ base: 4, md: 10 }} justify="center">
        {searchedRecipes.length > 0 ? (
          searchedRecipes.map((dish) => (
            <WrapItem key={dish.id} mx="auto">
              <DishCard
                id={dish.id}
                imageUrl={dish.image_path}
                menuType="Japanese"
                dishName={dish.name}
                onClick={onClickDish}
              />
            </WrapItem>
          ))
        ) : dishData && dishData.recipes && dishData.recipes.length > 0 ? (
          dishData.recipes.map((dish: any) => (
            <WrapItem key={dish.id} mx="auto">
              <DishCard
                id={dish.id}
                imageUrl={dish.image_path}
                menuType="Japanese"
                dishName={dish.name}
                onClick={onClickDish}
              />
            </WrapItem>
          ))
        ) : (
          <Center h="50vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Spinner />
          </Center>
        )}
      </Wrap>
    )}
    <DishDetailModal
      dish={selectedDish as { id: number; name: string; genre: string; reference_url: string } | null}
      isOpen={isOpen}
      onClose={onClose}
      id={selectedDishId}
    />
  </div>
);

});
