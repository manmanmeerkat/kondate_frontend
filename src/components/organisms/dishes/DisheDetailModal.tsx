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
import axios from 'axios';
import { useMessage } from '../../../hooks/useMessage';

interface DishDetailModalProps {
  dish: {
    id: string;
    name: string;
    genre: string;
    reference_url: string;
  } | null;
  isOpen: boolean;
  id: string | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = memo((props) => {
  const { dish, isOpen, id, onClose } = props;
  const { showMessage } = useMessage();

  const [name, setName] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ingredients, setIngredients] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchIngredients = async () => {
    if (id) {
      try {
        const response = await axios.get<{ ingredients: { id: string; name: string }[] }>(`http://localhost:8000/api/recipes/${id}/ingredients`);
        setIngredients(response.data.ingredients);
        setLoading(false);
      } catch (error) {
        console.error("エラー:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setName(dish?.name || "");
    setGenre(dish?.genre || "");
    setUrl(dish?.reference_url || "");
  }, [dish]);

  useEffect(() => {
    if (isOpen) {
      // モーダルが開かれたときに材料を取得
      fetchIngredients();
    } else {
      // モーダルが閉じられたときに材料をクリア
      setIngredients([]);
      setLoading(true); // ローディング状態をリセット
    }
  }, [isOpen, id]);

  const deleteUser = (id: string) => {
    axios
      .delete(`http://localhost:8000/api/menu/${id}`)
      .then((response) => {
        console.log(response);
        showMessage({ title: "削除しました", status: "error" });
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/menu/${id}`, {
        name: name,
        genre: genre,
      });
      console.log("Updated post:", response.data);
      showMessage({ title: "更新しました", status: "success" });
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating post:", error);
      showMessage({ title: "更新に失敗しました", status: "error" });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      autoFocus={false}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent pb={6}>
        <ModalHeader>詳細</ModalHeader>
        <ModalCloseButton />
        <ModalBody mx={4}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <Spinner size="lg" color="blue.500" />
            </Box>
          ) : (
            <Stack spacing={4}>
               <form onSubmit={handleSubmit}>
                <FormControl>
                  <FormLabel>料理名</FormLabel>
                  <Input value={name} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>ジャンル</FormLabel>
                  <Input value={genre} readOnly />
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
                <Button colorScheme="red" size="xs" onClick={() => deleteUser(dish!.id)}>
                  削除
                </Button>
                <Button type="submit">更新</Button>
              </form>
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
