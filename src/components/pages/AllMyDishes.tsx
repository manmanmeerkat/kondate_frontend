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
  Text,
  Flex,
} from "@chakra-ui/react";
import { useAllMyDishes } from "../../hooks/useAllMyDishes";
import { DishCard } from "../organisms/dishes/DishCard";
import { useSelectDish } from "../../hooks/useSelectDish";
import { DishDetailModal } from "../organisms/dishes/DisheDetailModal";
import { GenreButton } from "../molecules/GenreButton";
import { SearchIcon } from "@chakra-ui/icons";
import { Header } from "../organisms/layout/Header";
import { useIngredientSearch } from "../../hooks/useIngredientSearch";
import { useFetchUserData } from "../../hooks/useFetchUserData";
import { Dish } from "../../types/Dish";

interface AllMyDishesProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const AllMyDishes: React.FC<AllMyDishesProps> = memo(() => {
  // モーダルの表示制御
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 料理データの取得とローディング状態
  const { getDishes, dishes: apiDishes, loading } = useAllMyDishes();

  // 選択したdishの管理
  const { onSelectDish, selectedDish } = useSelectDish();
  // const { getDish, dishData } = useDishData();

  // ユーザーデータの取得
  const { user } = useFetchUserData();

  // 材料での検索結果と検索処理
  const { searchedDishes, handleIngredientSearch } = useIngredientSearch("all-dish", user?.id);

  // 初回レンダリング時に料理データを取得
  useEffect(() => {
    getDishes();
  }, [getDishes]);

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [searchIngredient, setSearchIngredient] = useState<string>("");
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 1ページあたりのアイテム数

  // 料理がクリックされたときの処理
  const onClickDish = useCallback(
    (id: number) => {
      if (Array.isArray(apiDishes)) {
        onSelectDish({ id, dishes: apiDishes, onOpen });
        setSelectedDishId(id);
      }
    },
    [apiDishes, onSelectDish, onOpen]
  );

  // 検索ボタンがクリックされたときの処理
  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchIngredient);
    if (results.length === 0 && searchIngredient.trim() !== "") {
      setNoSearchResults(true);
    } else {
      setNoSearchResults(false);
    }
    setCurrentPage(1); // 検索後は1ページ目にリセット
  }, [handleIngredientSearch, searchIngredient]);

  // 次のページに移動する処理
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 前のページに移動する処理
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // ページ変更時にスクロール位置をトップに戻す
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 現在表示中の料理のリストを取得
  const currentDishes: Dish[] = searchIngredient.length > 0 ? (Array.isArray(searchedDishes) ? searchedDishes : []) : (Array.isArray(apiDishes) ? apiDishes : []);
  const totalItems = currentDishes.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const selectedDishes = currentDishes.slice(startIndex, endIndex);

  return (
    <div>
      <Header />
      <GenreButton />
      <InputGroup mt={4} mx="auto" w={{ base: "80%", md: "60%" }}>
        <Input
          placeholder="材料で検索"
          value={searchIngredient}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchIngredient(e.target.value)}
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
        <Wrap p={{ base: 4, md: 10 }} justify="flex-start">
          {noSearchResults ? (
            <Flex h="50vh" justify="center" align="center" w="100%">
              <Text textAlign="center">該当するデータがありません。</Text>
            </Flex>
          ) : (
            <>
              {selectedDishes.length > 0 ? (
                selectedDishes.map((dish) => (
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
                <Flex h="50vh" justify="center" align="center" w="100%">
                  <Text textAlign="center">登録している料理はありません。</Text>
                </Flex>
              )}
            </>
          )}
        </Wrap>
      )}
      {!noSearchResults && (
        <>
          <Center mt={1}>
            <Text>{`${startIndex + 1} - ${endIndex} 件目を表示 (全 ${totalItems} 件)`}</Text>
          </Center>
          <Center mt={2}>
            <Button onClick={handlePrevPage} isDisabled={currentPage === 1} mr={2}>前のページ</Button>
            <Button onClick={handleNextPage} isDisabled={endIndex >= totalItems}>次のページ</Button>
          </Center>
        </>
      )}
      <DishDetailModal
        dish={selectedDish as { id: number; name: string; genre_id: number; category_id: number; description: string; reference_url: string } | null}
        isOpen={isOpen}
        onClose={onClose}
        id={selectedDishId}
      />
    </div>
  );
});
