import React, { memo, useCallback, useEffect, useState } from "react";
import { Center, Spinner, Wrap, WrapItem, useDisclosure } from "@chakra-ui/react";
import { useAllMyDishes } from "../../../hooks/useAllMyDishes";
import { useSelectDish } from "../../../hooks/useSelectDish";
import { useJapaneseRecipes } from "../../../hooks/useJapaneseRecipes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DishDetailModal } from "../../organisms/dishes/DisheDetailModal";
import { GenreButton } from "../../molecules/GenreButton";
import { Header } from "../../organisms/layout/Header";
import { DishCard } from "../../organisms/dishes/DishCard";
import { JapaneseRecipe } from "../../../types/JapaneseRecipe";
import { useJapaneseFukusai } from "../../../hooks/useJapaneseFukusai";
import { useJapaneseShirumono } from "../../../hooks/useJapaneseShirumono";

interface JapaneseProps {}

export const JapaneseShirumono: React.FC<JapaneseProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getJapanese, dishes, loading } = useAllMyDishes();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { JapaneseShirumono } = useJapaneseShirumono();
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
    getJapanese();
  }, []);

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);

  const onClickDish = useCallback((id: number) => {
    onSelectDish({ id, dishes, onOpen });
    setSelectedDishId(id); // ユーザーIDを保持
  }, [dishes, onSelectDish, onOpen]);

  const handleLogout = () => {
    axios
      .get('http://localhost:8000/api/logout')
      .then((response) => {
        console.log('ログアウト成功:', response.data);
        navigate("/home/");
      })
      .catch((error) => {
        console.error('ログアウトエラー:', error.response.data);
      });
  };

  return (
    <div>
      <Header />
      <button onClick={handleLogout}>ログアウト</button>
      <GenreButton />
      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      /> */}
      {loading ? (
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <Wrap p={{ base: 4, md: 10 }}>
          {JapaneseShirumono.map((dish: JapaneseRecipe) => (
            <WrapItem key={dish.id} mx="auto">
              <DishCard
                id={dish.id}
                imageUrl={dish.image_path}
                menuType="Japanese"
                dishName={dish.name}
                onClick={onClickDish}
              />
            </WrapItem>
          ))}
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
