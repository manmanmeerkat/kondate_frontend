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
import { useAllMyDishes } from "../../../hooks/useAllMyDishes"; // 自分の料理データを取得するカスタムフック
import { useSelectDish } from "../../../hooks/useSelectDish"; // 料理を選択するためのカスタムフック
import { useIngredientSearch } from "../../../hooks/useIngredientSearch"; // 材料で料理を検索するカスタムフック
import { useNavigate } from "react-router-dom";
import { GenreButton } from "../../molecules/GenreButton"; // ジャンル選択ボタンのコンポーネント
import { Header } from "../../organisms/layout/Header"; // ヘッダーコンポーネント
import { DishCard } from "../../organisms/dishes/DishCard"; // 料理カードコンポーネント
import { Dish } from "../../../types/Dish"; // 料理データの型定義
import { SearchIcon } from "@chakra-ui/icons";
import { useFetchUserData } from "../../../hooks/useFetchUserData"; // ユーザーデータを取得するカスタムフック
import { useOthersSyusai } from "../../../hooks/useFetchOthersData"; // 他のユーザーの主菜データを取得するカスタムフック
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal"; // 料理詳細モーダルコンポーネント

interface OthersProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const OthersSyusai: React.FC<OthersProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダルの開閉状態を管理するフック
  const { getOthersSyusai, dishes, loading } = useAllMyDishes(); // 主菜データを取得するためのカスタムフック
  const { data } = useOthersSyusai(); // 他のユーザーの主菜データを管理するフック
  const { onSelectDish, selectedDish } = useSelectDish(); // 料理を選択するロジックを管理するフック
  const { user } = useFetchUserData(); // ユーザー情報を取得するフック
  const { handleIngredientSearch } = useIngredientSearch("others-syusai", user?.id); // 材料での検索機能を提供するフック
  
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null); // 選択された料理のIDを管理する状態
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 検索キーワードを管理する状態
  const [Dishes, setDishes] = useState<Dish[]>([]); // 検索結果の料理データを管理する状態
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false); // 検索結果がない場合のフラグ
  const [currentPage, setCurrentPage] = useState(1); // 現在のページを管理する状態
  const itemsPerPage = 10; // 1ページあたりの表示項目数

  useEffect(() => {
    getOthersSyusai();
  }, [getOthersSyusai]);

  // ページが変更された際にスクロールをトップに戻す
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 検索ボタンがクリックされたときの処理
  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchKeyword); // 材料での検索を実行
    if (results.length === 0 && searchKeyword.trim() !== "") {
      setNoSearchResults(true); // 検索結果がない場合
    } else {
      setNoSearchResults(false);
      setDishes(results); // 検索結果をセット
    }
    setCurrentPage(1); // ページをリセット
  }, [handleIngredientSearch, searchKeyword]);

  // 料理カードがクリックされたときの処理
  const onClickDish = useCallback(
    (id: number) => {
      onSelectDish({ id, dishes, onOpen }); // 選択された料理をセットし、モーダルを開く
      setSelectedDishId(id); // 選択された料理のIDをセット
    },
    [dishes, onSelectDish, onOpen]
  );

  // 次のページへ移動するための処理
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 前のページへ移動するための処理
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 現在のページに表示する料理データを決定
  const currentDishes = searchKeyword.trim() === "" ? data : Dishes;
  const totalItems = currentDishes.length; // 総アイテム数
  const startIndex = (currentPage - 1) * itemsPerPage; // 現在のページの最初のアイテムのインデックス
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems); // 現在のページの最後のアイテムのインデックス
  const selectedDishes = currentDishes.slice(startIndex, endIndex); // 現在のページに表示する料理の配列

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
        // ローディングスピナーを表示
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
              {/* 検索結果またはデフォルトの料理データを表示 */}
              <Wrap p={{ base: 4, md: 10 }}>
                {selectedDishes.map((dish: Dish) => (
                  <WrapItem key={dish.id} mx="auto">
                    <DishCard
                      id={dish.id}
                      imageUrl={dish.image_path}
                      menuType="OthersSyusai"
                      dishName={dish.name}
                      onClick={onClickDish} // 料理がクリックされたときの処理を呼び出す
                    />
                  </WrapItem>
                ))}
              </Wrap>
              <Center mt={1}>
                <Text>{`${startIndex + 1} - ${endIndex} 件目を表示 (全 ${totalItems} 件)`}</Text>
              </Center>
              <Center mt={2}>
                {/* ページネーションボタン */}
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
