import { memo, useCallback, useEffect, useState } from "react";
import { Header } from "../organisms/layout/Header";
import { Center, Spinner, Wrap, WrapItem, useDisclosure } from "@chakra-ui/react";
import { useDishData} from "../../hooks/useDishData";
import { useAllMyDishes } from "../../hooks/useAllMyDishes";
import { DishCard } from "../organisms/dishes/DishCard";
import { useSelectDish } from "../../hooks/useSelectDish";
import { DishDetailModal } from "../organisms/dishes/DisheDetailModal";
import { GenreButton } from "../molecules/GenreButton";
import { Dish } from "../../types/Dish";

interface AllMyDishesProps {}

export const AllMyDishes: React.FC<AllMyDishesProps> = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getDishes, dishes, loading } = useAllMyDishes();
  const { onSelectDish, selectedDish } = useSelectDish();
  const { getDish, dishData } = useDishData();

  useEffect(() => {
    getDish();
  }, []);

  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  const onClickDish = useCallback((id: string) => {
    onSelectDish({ id, dishes, onOpen });
    setSelectedDishId(id);
  }, [dishes, onSelectDish, onOpen]);

  return (
    <div>
      <Header />
      <GenreButton />
      {loading ? (
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <Wrap p={{ base: 4, md: 10 }}>
          {dishData && dishData.recipes && dishData.recipes.length > 0 ? (
            dishData.recipes.map((dish: any) => (
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
            <p>ユーザーデータはありません。</p>
          )}
        </Wrap>
      )}
      <DishDetailModal
      dish={selectedDish as { id: string; name: string; genre: string; reference_url: string } | null}
      isOpen={isOpen}
      onClose={onClose}
      id={selectedDishId}
      />
    </div>
  );
});
