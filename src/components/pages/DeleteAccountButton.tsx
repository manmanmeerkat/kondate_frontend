import React, { useState } from 'react';
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
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const toast = useToast();
  const authToken = useAuthToken();  

  const handleDeleteClick = () => {
    setIsConfirming(true);
  };

  const handleCancelClick = () => {
    setIsConfirming(false);
    setPassword(''); // モーダルが閉じられたときにパスワードをリセット
    setPasswordError(''); // エラーメッセージもリセット
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
  
      // バックエンドに削除リクエストとパスワードを送信
      await axios.delete(`${config.API_ENDPOINT}/api/users/self`, {
        // headers: {
        //   'X-XSRF-TOKEN': csrfToken,
        // },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { password }, // パスワードをリクエストのデータとして送信
      });
  
      // アカウント削除が成功した場合のトースター表示
      toast({
        title: '成功',
        description: 'アカウントを削除しました',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // ログアウト
      navigate('/logout');
  
      // ユーザーをホーム画面にリダイレクト
      navigate('/');
  
    } catch (error: any) {
      console.error('Error deleting user:', error);
  
      if (error.response) {
        if (error.response.status === 401) {
          // パスワードが違う場合のエラー
          toast({
            title: 'エラー',
            description: 'パスワードが正しくありません',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          // その他のエラーに対するトースト表示などの処理
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
      setPassword(''); // パスワードをリセット
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
    </VStack>
  );
};
