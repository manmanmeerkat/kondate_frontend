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
import config from './config/production';
import useAuthToken from '../../hooks/useAuthToken';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 新しい状態を追加
  const authToken = useAuthToken();

  const navigate = useNavigate();
  const toast = useToast();

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません');
      return false;
    }

    if (currentPassword === newPassword) {
      setError('新しいパスワードは現在のパスワードと異なるものを設定してください');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsSubmitting(true); // 送信中に設定

    try {
      await axios.post(
        `${config.API_ENDPOINT}/api/change_password`,
        { current_password: currentPassword, new_password: newPassword },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      handleSuccess();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false); // 送信が完了したらリセット
    }
  };

  const handleSuccess = () => {
    toast({
      title: 'パスワード変更成功',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    navigate(-1);
  };

  const handleError = (error: any) => {
    console.error('パスワード変更エラー:', error.response?.data);
    setError('パスワードの変更に失敗しました');
  };

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Heading size="md" mb="4">
        パスワード変更
      </Heading>
      <VStack align="stretch" spacing="4">
        {renderPasswordField('現在のパスワード', currentPassword, setCurrentPassword)}
        {renderPasswordField('新しいパスワード', newPassword, setNewPassword)}
        {renderPasswordField('新しいパスワード（確認）', confirmPassword, setConfirmPassword)}
        {error && (
          <Box color="red.500" fontSize="sm">
            {error}
          </Box>
        )}
        <Button colorScheme="teal" onClick={handleChangePassword}>
          パスワード変更
        </Button>
        <Button colorScheme="gray" onClick={() => navigate(-1)}>
          戻る
        </Button>
      </VStack>
    </Box>
  );
};

const renderPasswordField = (label: string, value: string, onChange: (value: string) => void) => (
  <FormControl key={label}>
    <FormLabel>{label}</FormLabel>
    <Input type="password" value={value} onChange={(e) => onChange(e.target.value)} />
  </FormControl>
);

export default ChangePasswordForm;
