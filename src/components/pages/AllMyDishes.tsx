// AllMyDishes.tsx
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Center,
  Spinner,
  Wrap,
  WrapItem,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useDishData } from "../../hooks/useDishData";
import { useAllMyDishes } from "../../hooks/useAllMyDishes";
import { DishCard } from "../organisms/dishes/DishCard";
import { useSelectDish } from "../../hooks/useSelectDish";
import { DishDetailModal } from "../organisms/dishes/DisheDetailModal";
import { GenreButton } from "../molecules/GenreButton";
import { Dish } from "../../types/Dish";
import { SearchIcon } from "@chakra-ui/icons";
import { useIngredientSearch } from "../../hooks/useIngredientSearch";
import { Header } from "../organisms/layout/Header";

interface AllMyDishesProps {}

export const AllMyDishes: React.FC<AllMyDishesProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getDishes, dishes, loading } = useAllMyDishes();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { getDish, dishData } = useDishData();
  const { searchedRecipes, handleIngredientSearch } = useIngredientSearch();

  useEffect(() => {
    getDish();
  }, []);

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [searchIngredient, setSearchIngredient] = useState<string>("");
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false);

  const onClickDish = useCallback(
    (id: number) => {
      onSelectDish({ id, dishes, onOpen });
      setSelectedDishId(id);
    },
    [dishes, onSelectDish, onOpen]
  );

  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchIngredient);
    setNoSearchResults(results.length === 0 && searchIngredient.trim() !== "");
  }, [handleIngredientSearch, searchIngredient]);

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
          <Button colorScheme="teal" onClick={handleSearchButtonClick} size="sm">
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
          {noSearchResults ? (
            <Center h="50vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <p>該当するデータがありません。</p>
            </Center>
          ) : (
            <>
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
              ) : (
                dishData && dishData.recipes && dishData.recipes.length > 0 ? (
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
                )
              )}
            </>
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
