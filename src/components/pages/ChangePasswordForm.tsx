import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません');
      return;
    }

    if (currentPassword === newPassword) {
      setError('新しいパスワードは現在のパスワードと異なるものを設定してください');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/change_password',
        { current_password: currentPassword, new_password: newPassword },
        { withCredentials: true }
      );

      // パスワード変更成功時の処理
      toast({
        title: 'パスワード変更成功',
        status: 'success',
        duration: 5000, // 5秒間表示
        isClosable: true,
      });

      // ページを元に戻す処理
      navigate(-1);
    } catch (error: any) {
      // エラー処理
      console.error('パスワード変更エラー:', error.response?.data);
      setError('パスワードの変更に失敗しました');
    }
  };

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Heading size="md" mb="4">
        パスワード変更
      </Heading>
      <VStack align="stretch" spacing="4">
        <FormControl>
          <FormLabel>現在のパスワード</FormLabel>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>新しいパスワード</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>新しいパスワード（確認）</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        {error && (
          <Box color="red.500" fontSize="sm">
            {error}
          </Box>
        )}
        <Button colorScheme="teal" onClick={handleChangePassword}>
          パスワード変更
        </Button>
      </VStack>
    </Box>
  );
};

export default ChangePasswordForm;
