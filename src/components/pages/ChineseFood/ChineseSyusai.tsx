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
import { GenreButton } from "../../molecules/GenreButton";
import { Header } from "../../organisms/layout/Header";
import { DishCard } from "../../organisms/dishes/DishCard";
import { Dish } from "../../../types/Dish";
import { SearchIcon } from "@chakra-ui/icons";
import { useFetchUserData } from "../../../hooks/useFetchUserData";
import { useChineseSyusai } from "../../../hooks/useFetchChineseData";
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal";

interface ChineseProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const ChineseSyusai: React.FC<ChineseProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダルの開閉状態を管理
  const { getChineseSyusai, dishes, loading } = useAllMyDishes(); // 中華主菜のデータ取得フック
  const { data } = useChineseSyusai(); // 中華主菜のデータを取得
  const { onSelectDish, selectedDish } = useSelectDish(); // 料理を選択するフック
  const { user } = useFetchUserData(); // ユーザー情報を取得
  const { handleIngredientSearch } = useIngredientSearch("chinese-syusai", user?.id); // 材料検索フック

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null); // 選択された料理のID
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 検索キーワード
  const [Dishes, setDishes] = useState<Dish[]>([]); // 検索結果として表示する料理のリスト
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false); // 検索結果がない場合のフラグ
  const [currentPage, setCurrentPage] = useState(1); // 現在のページ
  const itemsPerPage = 10; // 1ページあたりのアイテム数

  // コンポーネントがマウントされたときに中華主菜のデータを取得
  useEffect(() => {
    getChineseSyusai();
  }, [getChineseSyusai]);

  // ページが変更されたときにスクロールをトップに移動
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 検索ボタンがクリックされたときの処理
  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchKeyword);
    if (results.length === 0 && searchKeyword.trim() !== "") {
      setNoSearchResults(true); // 検索結果がない場合のフラグを設定
    } else {
      setNoSearchResults(false);
      setDishes(results); // 検索結果を設定
    }
    setCurrentPage(1); // 検索後はページを1にリセット
  }, [handleIngredientSearch, searchKeyword]);

  // 料理がクリックされたときの処理
  const onClickDish = useCallback(
    (id: number) => {
      onSelectDish({ id, dishes, onOpen }); // 選択された料理を設定し、モーダルを開く
      setSelectedDishId(id);
    },
    [dishes, onSelectDish, onOpen]
  );

  // 次のページに進む処理
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 前のページに戻る処理
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 現在の検索キーワードに基づいて表示する料理を決定
  const currentDishes = searchKeyword.trim() === "" ? data : Dishes;
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
      {loading ? (
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {noSearchResults ? (
            <Flex h="50vh" justify="center" align="center" w="100%">
              <Text textAlign="center">該当するデータがありません。</Text>
            </Flex>
          ) : (
            <>
              <Wrap p={{ base: 4, md: 10 }}>
                {selectedDishes.map((dish: Dish) => (
                  <WrapItem key={dish.id} mx="auto">
                    <DishCard
                      id={dish.id}
                      imageUrl={dish.image_path}
                      menuType="ChineseSyusai"
                      dishName={dish.name}
                      onClick={onClickDish}
                    />
                  </WrapItem>
                ))}
              </Wrap>
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
      <DishDetailModal
        dish={selectedDish as { id: number; name: string; genre_id: number; category_id: number; description: string; reference_url: string } | null}
        isOpen={isOpen}
        onClose={onClose}
        id={selectedDishId}
      />
    </div>
  );
});
