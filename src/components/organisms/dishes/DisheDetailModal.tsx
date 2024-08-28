import { memo, useEffect, useState } from 'react';
import {
  Badge,
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
import { useDispatch, useSelector } from 'react-redux';
import { useMenuForDate } from '../../../hooks/useMenuForDate';
import { setMenu } from '../../../store/slices/menuSlice';
import config from '../../pages/config/production';

interface DishDetailModalProps {
  dish: {
    id: number;
    name: string;
    genre_id: number;
    category_id: number;
    description: string;
    reference_url: string;
  } | null; // 料理の詳細情報
  isOpen: boolean; // モーダルの表示状態
  id: number | null; // 料理のID
  onClose: () => void; // モーダルを閉じるための関数
}

// Memoized DishDetailModal component
export const DishDetailModal: React.FC<DishDetailModalProps> = memo((props) => {
  const { dish, isOpen, id, onClose } = props;
  const { showMessage } = useMessage(); // メッセージ表示のカスタムフック
  const [name, setName] = useState<string>(""); // 料理名
  const [genre, setGenre] = useState<number>(); // ジャンルID
  const [category, setCategory] = useState<number>(); // カテゴリーID
  const [memo, setMemo] = useState<string>(""); // メモ
  const [url, setUrl] = useState<string>(""); // 参照URL
  const [ingredients, setIngredients] = useState<{ id: number; name: string; quantity: string }[]>([]); // 材料リスト
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態
  const selectedDate = useSelector((state: { selectedDate: string | null }) => state.selectedDate); // 選択された日付
  const { getMenuForDate } = useMenuForDate(); // 日付に基づくメニュー取得のカスタムフック
  const dispatch = useDispatch(); // Reduxのディスパッチ
  const navigate = useNavigate(); // React Routerのナビゲート

  // 材料を取得する非同期関数
  const fetchIngredients = async () => {
    if (id) {
      try {
        const response = await axios.get<{ ingredients: { id: number; name: string; quantity: string }[] }>(
          `/api/dishes/${id}/ingredients`
        );
        setIngredients(response.data.ingredients); // 材料リストを設定
        setLoading(false); // ローディングを終了
      } catch (error) {
        console.error("エラー:", error);
        setLoading(false); // エラーが発生してもローディングを終了
      }
    }
  };

  // ジャンルIDを文字列に変換する関数
  const convertGenreToString = (genre_id: number) => {
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

  // カテゴリーIDを文字列に変換する関数
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
  
  // dishが変更されたときに入力フィールドを更新
  useEffect(() => {
    setName(dish?.name || "");
    setGenre(dish?.genre_id || undefined);
    setCategory(dish?.category_id || undefined);
    setMemo(dish?.description || "");
    setUrl(dish?.reference_url || "");
  }, [dish]);

  // モーダルが開いたとき、またはIDが変更されたときに材料を取得
  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    } else {
      setIngredients([]);
      setLoading(true); // モーダルが閉じられたときはローディング状態をリセット
    }
  }, [isOpen, id]);

  // 編集ページに遷移するための関数
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  // 仮のgetCookie関数の例（クッキーから指定した名前の値を取得）
  const getCookie = (name: string) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  // CSRFトークンを取得するための関数
  const getCSRFToken = async () => {
    await axios.get(`/api/sanctum/csrf-cookie`);
  };

  // メニューを登録するための関数
  const handleMenuRegistration = async () => {
    try {
      setLoading(true); // ローディングを開始
      await getCSRFToken(); // CSRFトークンの取得

      // XSRF-TOKEN Cookieからトークンを取得
      const xsrfToken = getCookie('XSRF-TOKEN');

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
        `${config.API_ENDPOINT}/api/menus`,
        {
          dish_id: dish?.id,
          date: formattedDate,
        },
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken, // XSRFトークンをヘッダーに設定
          },
          withCredentials: true, // クッキーを送信するための設定
        }
      );

      showMessage({ title: 'メニューを登録しました。', status: 'success' }); // 成功メッセージを表示
      onClose(); // モーダルを閉じる

      // メニューの登録が成功したら即座に画面を更新
      const updatedMenu = await getMenuForDate(new Date(formattedDate || new Date()));
      dispatch(setMenu(updatedMenu)); // Reduxストアのメニューを更新
    } catch (error) {
      console.error('メニューの登録に失敗しました。', error);
      showMessage({ title: 'こんだて作成モードにしてください。', status: 'error' }); // エラーメッセージを表示
    } finally {
      setLoading(false); // ローディングを終了
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} motionPreset="slideInBottom">
  <ModalOverlay />
  <ModalContent pb={6} bg="white" borderRadius="md">
    <ModalHeader bg="green" color="white" borderBottomWidth="1px" borderBottomColor="green">
      詳細
    </ModalHeader>
    <ModalCloseButton />
    <ModalBody mx={4}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner data-testid="spinner" size="lg" color="green" />
        </Box>
      ) : (
        <Stack spacing={4}>
          <form>
            <FormControl>
              <FormLabel fontSize="lg" color="green">料理名</FormLabel>
              <Input value={name} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="green">ジャンル</FormLabel>
              <Input value={genre !== undefined ? convertGenreToString(genre) : ''} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="green">カテゴリー</FormLabel>
              <Input value={convertCategoryToString(category)} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="green">メモ</FormLabel>
              <Textarea value={memo !== "null" ? memo : ""} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="green">参考URL</FormLabel>
              <Input value={url !== "null" ? url : ""} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="lg" color="green">材料</FormLabel>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <Box>
                  {ingredients.map((ingredient, index) => (
                    <Box key={ingredient.id} display="inline-block" mr={2} mb={2}>
                      <Badge colorScheme="green" fontSize="md" mb={1}>
                        {ingredient.name}
                      </Badge>
                      <Text display="inline" fontSize="md">{`: ${ingredient.quantity}`}</Text>
                    </Box>
                  ))}
                </Box>
              )}
            </FormControl>
            <Stack direction="row" spacing={4} justify="space-between" align="center">
              <Button leftIcon={<EditIcon />} colorScheme="green" variant="outline" onClick={handleEdit}>
                編集
              </Button>
              <Button rightIcon={<EditIcon />} colorScheme="green" onClick={handleMenuRegistration} isDisabled={loading}>
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
