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
import { useWesternSyusai } from "../../../hooks/useFetchWesternData";
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal";

interface WesternProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const WesternSyusai: React.FC<WesternProps> = memo(() => {
  // モーダルの開閉を管理するChakra UIのフック
  const { isOpen, onOpen, onClose } = useDisclosure();

  // カスタムフックを使用して西洋料理の主菜データを取得
  const { getWestern, dishes, loading } = useAllMyDishes();
  const { data } = useWesternSyusai();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { user } = useFetchUserData();

  // 材料検索のカスタムフックを使用
  const { handleIngredientSearch } = useIngredientSearch("western-syusai", user?.id);
  const navigate = useNavigate();

  // コンポーネント内で使用するstateを定義
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [Dishes, setDishes] = useState<Dish[]>([]);
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // コンポーネントが初回レンダリングされる際に西洋料理データを取得
  useEffect(() => {
    getWestern();
  }, [getWestern]);

  // ページが変わるごとに画面をトップにスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 検索ボタンがクリックされた際に呼び出される関数
  const handleSearchButtonClick = useCallback(async () => {
    // 検索結果を取得
    const results = await handleIngredientSearch(searchKeyword);
    if (results.length === 0 && searchKeyword.trim() !== "") {
      // 結果がない場合
      setNoSearchResults(true);
    } else {
      // 結果がある場合
      setNoSearchResults(false);
      setDishes(results);
    }
    setCurrentPage(1); // ページをリセット
  }, [handleIngredientSearch, searchKeyword]);

  // 料理がクリックされた際に呼び出される関数
  const onClickDish = useCallback(
    (id: number) => {
      // 料理の詳細を選択し、モーダルを開く
      onSelectDish({ id, dishes, onOpen });
      setSelectedDishId(id);
    },
    [dishes, onSelectDish, onOpen]
  );

  // 次のページボタンがクリックされた際のハンドラ
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 前のページボタンがクリックされた際のハンドラ
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 検索キーワードがない場合は全データ、ある場合は検索結果を使用
  const currentDishes = searchKeyword.trim() === "" ? data : Dishes;
  const totalItems = currentDishes.length;

  // 現在のページに表示する料理を計算
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const selectedDishes = currentDishes.slice(startIndex, endIndex);

  return (
    <div>
      <Header />
      <GenreButton />
      {/* 材料検索用のインプットフィールド */}
      <InputGroup mt={4} mx="auto" w={{ base: "80%", md: "60%" }}>
        <Input
          placeholder="材料から検索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button colorScheme="yellow" onClick={handleSearchButtonClick} size="sm">
            <SearchIcon />
            検索
          </Button>
        </InputRightElement>
      </InputGroup>
      {loading ? (
        // データ読み込み中のスピナー表示
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {noSearchResults ? (
            // 検索結果がない場合のメッセージ表示
            <Flex h="50vh" justify="center" align="center" w="100%">
              <Text textAlign="center">該当するデータがありません。</Text>
            </Flex>
          ) : (
            <>
              {/* 料理のリストを表示 */}
              <Wrap p={{ base: 4, md: 10 }}>
                {selectedDishes.map((dish: Dish) => (
                  <WrapItem key={dish.id} mx="auto">
                    <DishCard
                      id={dish.id}
                      imageUrl={dish.image_path}
                      menuType="WesternSyusai"
                      dishName={dish.name}
                      onClick={onClickDish}
                    />
                  </WrapItem>
                ))}
              </Wrap>
              {/* ページネーション */}
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
      {/* 料理詳細モーダルの表示 */}
      <DishDetailModal
        dish={selectedDish as { id: number; name: string; genre_id: number; category_id: number; description: string; reference_url: string } | null}
        isOpen={isOpen}
        onClose={onClose}
        id={selectedDishId}
      />
    </div>
  );
});
