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
import { useAllMyDishes } from "../../../hooks/useAllMyDishes";
import { useSelectDish } from "../../../hooks/useSelectDish";
import { useIngredientSearch } from "../../../hooks/useIngredientSearch";
import { useNavigate } from "react-router-dom";
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal";
import { GenreButton } from "../../molecules/GenreButton";
import { Header } from "../../organisms/layout/Header";
import { DishCard } from "../../organisms/dishes/DishCard";
import { SearchIcon } from "@chakra-ui/icons";
import { useFetchUserData } from "../../../hooks/useFetchUserData";
import { useWesternDishes } from "../../../hooks/useFetchWesternData";
import { Dish } from "../../../types/Dish";

interface WesternProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const Western: React.FC<WesternProps> = memo(() => {
  // モーダルの開閉状態を管理
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // データ取得のためのカスタムフックの使用
  const { getWestern, dishes, loading } = useAllMyDishes();
  const { data } = useWesternDishes();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { user } = useFetchUserData();
  const { handleIngredientSearch } = useIngredientSearch("western-food", user?.id);
  const navigate = useNavigate();

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [Dishes, setDishes] = useState<Dish[]>([]);
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 1ページあたりに表示するアイテム数

  // Westernデータの取得
  useEffect(() => {
    getWestern();
  }, []);

  // ページ変更時にスクロールをトップに戻す
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 検索ボタンがクリックされたときの処理
  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchKeyword);
    if (results.length === 0 && searchKeyword.trim() !== "") {
      setNoSearchResults(true); // 検索結果がない場合にフラグを立てる
      console.log("該当するデータがありません");
    } else {
      setNoSearchResults(false);
      setDishes(results);
    }
    setCurrentPage(1); // ページ番号をリセット
  }, [handleIngredientSearch, searchKeyword]);

  // 料理カードがクリックされたときの処理
  const onClickDish = useCallback(
    (id: number) => {
      onSelectDish({ id, dishes, onOpen });
      setSelectedDishId(id);
    },
    [dishes, onSelectDish, onOpen]
  );

  // ページネーションの次ページボタンの処理
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // ページネーションの前ページボタンの処理
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 現在のページに表示する料理の計算
  const currentDishes = searchKeyword.trim() === "" ? data : Dishes;
  const totalItems = currentDishes.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const selectedDishes = currentDishes.slice(startIndex, endIndex);

  return (
    <div>
      <Header />
      <GenreButton />
      {/* 検索バー */}
      <InputGroup mt={4} mx="auto" w={{ base: "80%", md: "60%" }}>
        <Input
          placeholder="材料から検索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button colorScheme="teal" onClick={handleSearchButtonClick} size="sm">
            <SearchIcon />
            検索
          </Button>
        </InputRightElement>
      </InputGroup>
      {/* 読み込み中スピナー */}
      {loading ? (
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {/* 検索結果がない場合のメッセージ表示 */}
          {noSearchResults ? (
            <Flex h="50vh" justify="center" align="center" w="100%">
              <Text textAlign="center">該当するデータがありません。</Text>
            </Flex>
          ) : (
            <>
              {/* 料理カードの表示 */}
              <Wrap p={{ base: 4, md: 10 }}>
                {selectedDishes.map((dish: Dish) => (
                  <WrapItem key={dish.id} mx="auto">
                    <DishCard
                      id={dish.id}
                      imageUrl={dish.image_path}
                      menuType="Western"
                      dishName={dish.name}
                      onClick={onClickDish}
                    />
                  </WrapItem>
                ))}
              </Wrap>
              {/* 現在の表示範囲とページネーション */}
              <Center mt={1}>
                <Text>{`${startIndex + 1} - ${endIndex} 件目を表示 (全 ${totalItems} 件)`}</Text>
              </Center>
              <Center mt={2}>
                <Button onClick={handlePrevPage} isDisabled={currentPage === 1} mr={2}>
                  前のページ
                </Button>
                <Button onClick={handleNextPage} isDisabled={endIndex >= totalItems}>
                  次のページ
                </Button>
              </Center>
            </>
          )}
        </>
      )}
      {/* 料理詳細モーダル */}
      <DishDetailModal
        dish={selectedDish as { id: number; name: string; genre_id: number; category_id: number; description: string; reference_url: string } | null}
        isOpen={isOpen}
        onClose={onClose}
        id={selectedDishId}
      />
    </div>
  );
});
