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
import { SearchIcon } from "@chakra-ui/icons";
import { Header } from "../organisms/layout/Header";
import { useIngredientSearch } from "../../hooks/useIngredientSearch";
import { useFetchUserData } from "../../hooks/useFetchUserData";

interface AllMyDishesProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const AllMyDishes: React.FC<AllMyDishesProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getDishes, dishes, loading } = useAllMyDishes();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { getDish, dishData } = useDishData();
  const { user } = useFetchUserData();
  const { searchedDishes, handleIngredientSearch } = useIngredientSearch("all-dish", user?.id);
  
  useEffect(() => {
   
    getDishes();
    getDish();
    
  }, []);


  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [searchIngredient, setSearchIngredient] = useState<string>("");
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const onClickDish = useCallback(
    (id: number) => {
      if (dishes !== null) {
        onSelectDish({ id, dishes, onOpen });
        setSelectedDishId(id);
      }
    },
    [dishes, onSelectDish, onOpen]
  );
  

  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchIngredient);
    setNoSearchResults(results.length === 0 && searchIngredient.trim() !== "");
  }, [handleIngredientSearch, searchIngredient]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const currentDishes = searchedDishes.length > 0 ? searchedDishes : dishes;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedDishes = currentDishes.slice(startIndex, startIndex + itemsPerPage);

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
              {searchedDishes.length > 0 ? (
                searchedDishes.map((dish) => (
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
               dishes.length > 0 ? (
                  dishes.map((dish: any) => (
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
                    <p>登録している料理はありません。</p>
                  </Center>
                )
              )}
            </>
          )}
        </Wrap>
      )}

      <Center mt={4}>
        <Button onClick={handlePrevPage} isDisabled={currentPage === 1} mr={2}>前のページ</Button>
        <Button onClick={handleNextPage} isDisabled={startIndex + itemsPerPage >= currentDishes.length}>次のページ</Button>
      </Center>
      <DishDetailModal
        dish={selectedDish as { id: number; name: string; genre_id: number; category_id: number; description: string; reference_url: string } | null}
        isOpen={isOpen}
        onClose={onClose}
        id={selectedDishId}
      />
    </div>
  );
});
