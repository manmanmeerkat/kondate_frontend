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
import { useOthersDishes } from "../../../hooks/useFetchOthersData";
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal";

interface OthersProps {
  id?: number;
  name?: string;
  genre_id?: number;
  category_id?: number;
  description?: string;
  reference_url?: string;
}

export const Others: React.FC<OthersProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダルの開閉状態を管理するためのフック
  const { getOthers, dishes, loading } = useAllMyDishes(); // データ取得やローディング状態を管理
  const { data } = useOthersDishes(); // その他の料理データを取得
  const { onSelectDish, selectedDish } = useSelectDish(); // 選択された料理を管理
  const { user } = useFetchUserData(); // ユーザーデータを取得
  const { handleIngredientSearch } = useIngredientSearch("others-food", user?.id); // 材料検索用のカスタムフック

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null); // 選択された料理のIDを保持
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 検索キーワードを保持
  const [Dishes, setDishes] = useState<Dish[]>([]); // フィルタリングされた料理リストを保持
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false); // 検索結果がない場合のフラグ
  const [currentPage, setCurrentPage] = useState(1); // 現在のページを保持
  const itemsPerPage = 8; // 1ページあたりの表示アイテム数

  // コンポーネントがマウントされた時に「その他の料理」データを取得
  useEffect(() => {
    getOthers();
  }, [getOthers]);

  // ページが切り替わる際にスクロールをトップに戻す
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 検索ボタンがクリックされた際の処理
  const handleSearchButtonClick = useCallback(async () => {
    const results = await handleIngredientSearch(searchKeyword); // 材料で検索
    if (results.length === 0 && searchKeyword.trim() !== "") {
      setNoSearchResults(true); // 検索結果がない場合
      console.log("該当するデータがありません");
    } else {
      setNoSearchResults(false); // 検索結果がある場合
      setDishes(results); // フィルタリングされた料理リストを更新
    }
    setCurrentPage(1); // 検索後、ページを最初にリセット
  }, [handleIngredientSearch, searchKeyword]);

  // 料理カードがクリックされた時の処理
  const onClickDish = useCallback(
    (id: number) => {
      onSelectDish({ id, dishes, onOpen }); // 料理を選択し、モーダルを開く
      setSelectedDishId(id); // 選択された料理のIDを更新
    },
    [dishes, onSelectDish, onOpen]
  );

  // 次のページへの遷移処理
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 前のページへの遷移処理
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 現在のページに表示する料理リストを決定
  const currentDishes = searchKeyword.trim() === "" ? data : Dishes;
  const totalItems = currentDishes.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const selectedDishes = currentDishes.slice(startIndex, endIndex);

  return (
    <div>
      <Header /> {/* ヘッダーコンポーネントの表示 */}
      <GenreButton /> {/* ジャンルボタンの表示 */}
      <InputGroup mt={4} mx="auto" w={{ base: "80%", md: "60%" }}>
        <Input
          placeholder="材料から検索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)} // 検索キーワードの更新
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
          <Spinner /> {/* データ読み込み中に表示されるスピナー */}
        </Center>
      ) : (
        <>
          {noSearchResults ? (
            <Flex h="50vh" justify="center" align="center" w="100%">
              <Text textAlign="center">該当するデータがありません。</Text> {/* 検索結果がない場合のメッセージ */}
            </Flex>
          ) : (
            <>
              <Wrap p={{ base: 4, md: 10 }}>
                {selectedDishes.map((dish: Dish) => (
                  <WrapItem key={dish.id} mx="auto">
                    <DishCard
                      id={dish.id}
                      imageUrl={dish.image_path}
                      menuType="Others"
                      dishName={dish.name}
                      onClick={onClickDish} // 料理カードがクリックされた時の処理
                    />
                  </WrapItem>
                ))}
              </Wrap>
              <Center mt={1}>
                <Text>{`${startIndex + 1} - ${endIndex} 件目を表示 (全 ${totalItems} 件)`}</Text> {/* ページ内の表示範囲 */}
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
        id={selectedDishId} // 選択された料理のIDを渡す
      />
    </div>
  );
});
