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
import { useAllMyDishes } from "../../../hooks/useAllMyDishes";
import { useSelectDish } from "../../../hooks/useSelectDish";
import { useIngredientSearch } from "../../../hooks/useIngredientSearch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal";
import { GenreButton } from "../../molecules/GenreButton";
import { Header } from "../../organisms/layout/Header";
import { DishCard } from "../../organisms/dishes/DishCard";
import { Dish } from "../../../types/Dish";
import { SearchIcon } from "@chakra-ui/icons";
import { useFetchUserData } from "../../../hooks/useFetchUserData";
import { useJapaneseShirumono } from "../../../hooks/useFetchJapaneseData";

interface JapaneseProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const JapaneseShirumono: React.FC<JapaneseProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getJapaneseShirumono, dishes, loading } = useAllMyDishes();
  const { data } = useJapaneseShirumono();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { user } = useFetchUserData();
  const { searchedDishes, handleIngredientSearch } = useIngredientSearch("japanese-shirumono", user?.id);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 1ページあたりの項目数

  const totalPages = Math.ceil(dishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedUsers = dishes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // ユーザー選択が変更された場合の処理
  }, [selectedDish]);

  useEffect(() => {
    getJapaneseShirumono();
  }, []);

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [Dishes, setJapaneseDishes] = useState<Dish[]>([]);
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false);

  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchKeyword);
    if (results.length === 0 && searchKeyword.trim() !== "") {
      // 該当するデータがない場合の処理
      setNoSearchResults(true);
      console.log("該当するデータがありません");
    } else {
      setNoSearchResults(false);
      setJapaneseDishes(results);
    }
  }, [handleIngredientSearch, searchKeyword]);

  const onClickDish = useCallback(
    (id: number) => {
      onSelectDish({ id, dishes, onOpen });
      setSelectedDishId(id); // ユーザーIDを保持
    },
    [dishes, onSelectDish, onOpen]
  );



  return (
    <div>
      <Header />
      <GenreButton />
      <InputGroup mt={4} mx="auto" w={{ base: "80%", md: "60%" }}>
        <Input
          placeholder="材料から検索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
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
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {noSearchResults ? (
            <Center h="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <p>該当するデータがありません。</p>
            </Center>
          ) : (
            <Wrap p={{ base: 4, md: 10 }}>
              {(searchKeyword.trim() === "" ? data : Dishes).map((dish: Dish) => (
                <WrapItem key={dish.id} mx="auto">
                  <DishCard
                    id={dish.id}
                    imageUrl={dish.image_path}
                    menuType="JapanesesShirumono"
                    dishName={dish.name}
                    onClick={onClickDish}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </>
      )}
      <DishDetailModal
        dish={selectedDish as { id: number; name: string;  genre_id: number; category_id: number; description: string; reference_url: string } | null}
        isOpen={isOpen}
        onClose={onClose}
        id={selectedDishId}
      />
    </div>
  );
});
