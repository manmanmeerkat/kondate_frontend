import { memo, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
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
import { useDispatch, useSelector } from 'react-redux';
import { useMenuForDate } from '../../../hooks/useMenuForDate';
import { setMenu } from '../../../store/slices/menuSlice';

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
  const [ingredients, setIngredients] = useState<{ id: number; name: string; quantity: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const selectedDate = useSelector((state: { selectedDate: string | null }) => state.selectedDate);
  const { getMenuForDate } = useMenuForDate();
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const fetchIngredients = async () => {
    if (id) {
      try {
        const response = await axios.get<{ ingredients: { id: number; name: string; quantity: string }[] }>(
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

// 仮の getCookie 関数の例
const getCookie = (name:string) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

const getCSRFToken = async () => {
  await axios.get('http://localhost:8000/api/sanctum/csrf-cookie');
};

const handleMenuRegistration = async () => {
  try {
    // CSRF トークンの取得
    await getCSRFToken();

    // XSRF-TOKEN Cookieからトークンを取得
    const xsrfToken = getCookie('XSRF-TOKEN');

   // 日付のフォーマット変換
// 日付のフォーマット変換
let formattedDate = null;
if (selectedDate && typeof selectedDate === 'object' && 'selectedDate' in selectedDate) {
  const dateString = (selectedDate as { selectedDate: string }).selectedDate;

  // "/" を "-" に変換
  const isoDateString = dateString.replace(/\//g, '-');

  // 月と日が一桁の場合に前に0を付ける
  const [year, month, day] = isoDateString.split('-');
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  const correctedIsoDateString = `${year}-${paddedMonth}-${paddedDay}`;

  // タイムゾーンのオフセットを取得
  const timezoneOffsetMinutes = new Date().getTimezoneOffset();
  
  // 日本時間に変換
  const japanTime = new Date(`${correctedIsoDateString}T00:00:00.000`);
  japanTime.setMinutes(japanTime.getMinutes() + timezoneOffsetMinutes + 9 * 60); // タイムゾーンの補正

  if (!isNaN(japanTime.valueOf())) {
    // 手動で日付をフォーマット
    const formattedYear = japanTime.getFullYear();
    const formattedMonth = (japanTime.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = japanTime.getDate().toString().padStart(2, '0');
    formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
  } else {
    console.error('Invalid date format. Japan Time:', japanTime);
    throw new Error('Invalid date format');
  }
}


    // 実際のメニュー登録リクエスト
    const response = await axios.post(
      'http://localhost:8000/api/menus',
      {
        dish_id: dish?.id,
        date: formattedDate,
      },
      {
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
        },
        withCredentials: true,
      }
    );


    showMessage({ title: 'メニューを登録しました。', status: 'success' });
    
    onClose();  // モーダルを閉じる

     // メニューの登録が成功したら即座に画面を更新
     const updatedMenu = await getMenuForDate(new Date(formattedDate || new Date()));
     dispatch(setMenu(updatedMenu));
  } catch (error) {
    console.error('メニューの登録に失敗しました。', error);
    showMessage({ title: 'メニューの登録に失敗しました。', status: 'error' });
  }
};



  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} motionPreset="slideInBottom">
  <ModalOverlay />
  <ModalContent pb={6} bg="white" borderRadius="md">
    <ModalHeader bg="teal.500" color="white" borderBottomWidth="1px" borderBottomColor="teal.600">
      詳細
    </ModalHeader>
    <ModalCloseButton />
    <ModalBody mx={4}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner data-testid="spinner" size="lg" color="teal.500" />
        </Box>
      ) : (
        <Stack spacing={4}>
          <form>
            <FormControl>
              <FormLabel fontSize="lg" color="teal.600">料理名</FormLabel>
              <Input value={name} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="teal.600">ジャンル</FormLabel>
              <Input value={genre !== undefined ? convertGenreToString(genre) : ''} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="teal.600">カテゴリー</FormLabel>
              <Input value={convertCategoryToString(category)} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="teal.600">メモ</FormLabel>
              <Textarea value={memo !== "null" ? memo : ""} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="teal.600">参考URL</FormLabel>
              <Input value={url !== "null" ? url : ""} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="teal.600">材料</FormLabel>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <Box>
                  {ingredients.map((ingredient, index) => (
                    <Box key={ingredient.id} display="inline-block" mr={2} mb={2}>
                      <Badge colorScheme="teal" fontSize="md" mb={1}>
                        {ingredient.name}
                      </Badge>
                      <Text display="inline" fontSize="md">{`: ${ingredient.quantity}`}</Text>
                    </Box>
                  ))}
                </Box>
              )}
            </FormControl>
            <Stack direction="row" spacing={4} justify="space-between" align="center">
              <Button leftIcon={<EditIcon />} colorScheme="teal" variant="outline" onClick={handleEdit}>
                編集
              </Button>
              <Button rightIcon={<EditIcon />} colorScheme="teal" onClick={handleMenuRegistration}>
                こんだてに登録
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
