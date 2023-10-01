import { useCallback, useState } from "react";

interface Dish {
  id: string;
  // 他のDishに関するプロパティを追加
}

interface UseSelectDishProps {
  id: string;
  dishes: Dish[];
  onOpen: () => void;
}

interface UseSelectDishResult {
  onSelectDish: (props: UseSelectDishProps) => void;
  selectedDish: Dish | null;
}

export const useSelectDish = (): UseSelectDishResult => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const onSelectDish = useCallback((props: UseSelectDishProps) => {
    const { id, dishes, onOpen } = props;
    const targetDish = dishes.find((dish) => dish.id === id);
    setSelectedDish(targetDish ?? null);
    onOpen();
  }, []);

  return { onSelectDish, selectedDish };
};
