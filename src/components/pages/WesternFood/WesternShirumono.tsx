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
import { useAllMyDishes } from "../../../hooks/useAllMyDishes"; // 全ての料理を取得するためのカスタムフック
import { useSelectDish } from "../../../hooks/useSelectDish"; // 料理を選択するためのカスタムフック
import { useIngredientSearch } from "../../../hooks/useIngredientSearch"; // 材料検索用のカスタムフック
import { useNavigate } from "react-router-dom";
import { GenreButton } from "../../molecules/GenreButton"; // ジャンルボタンのコンポーネント
import { Header } from "../../organisms/layout/Header"; // ヘッダーコンポーネント
import { DishCard } from "../../organisms/dishes/DishCard"; // 料理カードのコンポーネント
import { Dish } from "../../../types/Dish"; // Dish型のインターフェース
import { SearchIcon } from "@chakra-ui/icons";
import { useFetchUserData } from "../../../hooks/useFetchUserData"; // ユーザーデータ取得用フック
import { useWesternShirumono } from "../../../hooks/useFetchWesternData"; // WesternShirumono データ取得用フック
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal"; // 料理の詳細を表示するモーダルコンポーネント

interface WesternProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const WesternShirumono: React.FC<WesternProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダルの開閉を管理するフック
  const { getWestern, dishes, loading } = useAllMyDishes(); // 料理データ取得とロード状態を管理するフック
  const { data } = useWesternShirumono(); // WesternShirumono カテゴリのデータ取得
  const { onSelectDish, selectedDish } = useSelectDish(); // 料理の選択と詳細表示の管理
  const { user } = useFetchUserData(); // ユーザー情報の取得

  const { handleIngredientSearch } = useIngredientSearch("western-shirumono", user?.id); // 材料検索機能

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null); // 選択された料理のID
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 検索キーワード
  const [Dishes, setDishes] = useState<Dish[]>([]); // 検索結果の料理リスト
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false); // 検索結果がないかどうかのフラグ
  const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
  const itemsPerPage = 8; // 1ページに表示するアイテムの数

  useEffect(() => {
    getWestern(); // Western カテゴリの料理を取得する
  }, [getWestern]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // ページが変わるたびにスクロールをトップに戻す
  }, [currentPage]);

  // 検索ボタンがクリックされた際の処理
  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchKeyword);
    if (results.length === 0 && searchKeyword.trim() !== "") {
      setNoSearchResults(true); // 検索結果がない場合
    } else {
      setNoSearchResults(false);
      setDishes(results);
    }
    setCurrentPage(1); // 検索後は最初のページに戻る
  }, [handleIngredientSearch, searchKeyword]);

  // 料理カードがクリックされた際の処理
  const onClickDish = useCallback(
    (id: number) => {
      onSelectDish({ id, dishes, onOpen }); // 選択された料理の詳細を表示
      setSelectedDishId(id);
    },
    [dishes, onSelectDish, onOpen]
  );

  // 次のページボタンがクリックされた際の処理
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 前のページボタンがクリックされた際の処理
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 現在表示する料理のリストを取得
  const currentDishes = searchKeyword.trim() === "" ? data : Dishes;
  const totalItems = currentDishes.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const selectedDishes = currentDishes.slice(startIndex, endIndex);

  return (
    <div>
      <Header /> {/* ヘッダーの表示 */}
      <GenreButton /> {/* ジャンルボタンの表示 */}
      
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

      {/* ローディングスピナー */}
      {loading ? (
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {/* 検索結果がない場合 */}
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
                      menuType="WesternShirumono"
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
