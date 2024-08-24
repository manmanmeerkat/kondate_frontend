import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Text,
  VStack,
  Input,
} from '@chakra-ui/react';
import config from './config/production';
import useAuthToken from '../../hooks/useAuthToken';

export const DeleteAccountButton = () => {
  // モーダルの表示状態
  const [isConfirming, setIsConfirming] = useState(false);
  // 削除処理のローディング状態
  const [isDeleting, setIsDeleting] = useState(false);
  // パスワードの状態
  const [password, setPassword] = useState('');
  // パスワードエラーの状態
  const [passwordError, setPasswordError] = useState('');
  // ナビゲーションのためのフック
  const navigate = useNavigate();
  // CSRFトークンの状態（未使用のようですが、APIリクエスト時に使う可能性があるため保持しています）
  const [csrfToken, setCsrfToken] = useState<string>('');
  // トースト通知のためのフック
  const toast = useToast();
  // 認証トークンのフック
  const authToken = useAuthToken();  

  // 削除ボタンがクリックされたときにモーダルを表示する処理
  const handleDeleteClick = () => {
    setIsConfirming(true);
  };

  // モーダルが閉じられたときの処理（パスワードとエラーメッセージのリセットも行う）
  const handleCancelClick = () => {
    setIsConfirming(false);
    setPassword('');
    setPasswordError('');
  };

  // アカウント削除を確認する処理
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
  
      // バックエンドに削除リクエストとパスワードを送信
      await axios.delete(`${config.API_ENDPOINT}/api/users/self`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { password }, // パスワードをリクエストデータとして送信
      });
  
      // 削除成功時のトースト表示
      toast({
        title: '成功',
        description: 'アカウントを削除しました',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // ログアウトページにリダイレクト
      navigate('/logout');
  
      // ホーム画面にリダイレクト
      navigate('/');
  
    } catch (error: any) {
      console.error('Error deleting user:', error);
  
      // エラーハンドリング
      if (error.response) {
        if (error.response.status === 401) {
          // パスワードが正しくない場合のエラー処理
          toast({
            title: 'エラー',
            description: 'パスワードが正しくありません',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          // その他のエラー処理
          toast({
            title: 'エラー',
            description: 'アカウント削除に失敗しました',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // レスポンスがない場合のエラー処理
        toast({
          title: 'エラー',
          description: 'アカウント削除に失敗しました',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
  
    } finally {
      setIsDeleting(false);
      setIsConfirming(false);
      setPassword('');
    }
  };

  return (
    <VStack align="center" spacing={4}>
      <Text>
        アカウントを削除すると、関連するデータがすべて失われます。削除後は元に戻せませんので、注意してください。
      </Text>
      <Button colorScheme="red" onClick={handleDeleteClick} isLoading={isDeleting}>
        {isDeleting ? <Spinner size="sm" /> : 'アカウント削除'}
      </Button>

      {/* 削除確認モーダル */}
      <Modal isOpen={isConfirming} onClose={handleCancelClick} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>アカウント削除の確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>本当にアカウントを削除しますか？</Text>
            <Text color="red.500">この操作は取り消せませんので、注意してください。</Text>

            {/* パスワード入力フォーム */}
            <Input
              type="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mt={4}
            />
            
            {/* エラーメッセージ */}
            {passwordError && <Text color="red.500">{passwordError}</Text>}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={handleConfirmDelete} isLoading={isDeleting} isDisabled={!password}>
              はい
            </Button>
            <Button onClick={handleCancelClick} isDisabled={isDeleting}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 戻るボタン */}
      <Button colorScheme="gray" onClick={() => navigate(-1)}>
        戻る
      </Button>
    </VStack>
  );
};
