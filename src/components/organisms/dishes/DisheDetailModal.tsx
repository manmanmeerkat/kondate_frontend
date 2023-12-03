import { memo, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useMessage } from '../../../hooks/useMessage';
import { useNavigate } from 'react-router-dom';

interface DishDetailModalProps {
  dish: {
    id: number;
    name: string;
    genre_id: number;
    category_id: number;
    description: string;
    reference_url: string;
  } | null;
  isOpen: boolean;
  id: number | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = memo((props) => {
  const { dish, isOpen, id, onClose } = props;
  const { showMessage } = useMessage();
  const [name, setName] = useState<string>("");
  const [genre, setGenre] = useState<number>();
  const [category, setCategory] = useState<number>();
  const [memo, setMemo] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ingredients, setIngredients] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const fetchIngredients = async () => {
    if (id) {
      try {
        const response = await axios.get<{ ingredients: { id: number; name: string }[] }>(
          `http://localhost:8000/api/dishes/${id}/ingredients`
        );
        setIngredients(response.data.ingredients);
        setLoading(false);
      } catch (error) {
        console.error("エラー:", error);
        setLoading(false);
      }
    }
  };

  const convertGenreToString = (genre_id:number) => {
    switch (genre_id) {
      case 1:
        return '和食';
      case 2:
        return '洋食';
      case 3:
        return '中華';
      default:
        return 'その他';
    }
  };

  const convertCategoryToString = (category: number | undefined): string => {
    if (category === undefined) {
      return '';
    }
  
    switch (category) {
      case 1:
        return '主菜';
      case 2:
        return '副菜';
      case 3:
        return '汁物';
      case 4:
        return 'その他';
      default:
        return '';
    }
  };
  console.log(dish)
  useEffect(() => {
    setName(dish?.name || "");
    setGenre(dish?.genre_id || undefined);
    setCategory(dish?.category_id || undefined);
    setMemo(dish?.description || "");
    setUrl(dish?.reference_url || "");
  }, [dish]);

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    } else {
      setIngredients([]);
      setLoading(true);
    }
  }, [isOpen, id]);

 

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent pb={6}>
        <ModalHeader>詳細</ModalHeader>
        <ModalCloseButton />
        <ModalBody mx={4}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <Spinner data-testid="spinner" size="lg" color="blue.500" />
            </Box>
          ) : (
            <Stack spacing={4}>
              <form>
                <FormControl>
                  <FormLabel>料理名</FormLabel>
                  <Input value={name} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>ジャンル</FormLabel>
                  <Input value={genre !== undefined ? convertGenreToString(genre) : ''} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>カテゴリー</FormLabel>
                  <Input value={convertCategoryToString(category)} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>メモ</FormLabel>
                  <Textarea value={memo} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>参考URL</FormLabel>
                  <Input value={url} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>材料</FormLabel>
                  {loading ? (
                    <Text>Loading...</Text>
                  ) : (
                    <Textarea
                      value={ingredients.map((ingredient) => ingredient.name).join(', ')}
                      readOnly
                    />
                  )}
                </FormControl>
                <Stack direction="row" spacing={4} justify="space-between" align="center">
                  <Button leftIcon={<EditIcon />} onClick={handleEdit}>
                    編集
                  </Button>
                </Stack>
              </form>
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
