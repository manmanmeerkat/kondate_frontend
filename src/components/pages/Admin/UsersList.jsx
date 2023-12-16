import { useState, useEffect } from 'react';
import axios from 'axios';
import { chakra } from '@chakra-ui/react';
import { LogoutButton } from '../../atoms/button/LogoutButton';

export const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 1. CSRF トークンの取得
        await axios.get('http://localhost:8000/api/sanctum/csrf-cookie', { withCredentials: true });

        // 2. ログインユーザー情報の取得
        const userResponse = await axios.get('http://localhost:8000/api/getuser', { withCredentials: true });
        const user = userResponse.data;

        console.log('ログインユーザー情報:', user.user.role);

        // 3. 管理者の場合のみユーザー一覧を取得
        if (user.user.role === 'admin') {
          console.log('管理者としてログインしています。');

          // ログインユーザーが管理者の場合のみユーザー一覧を取得
          const adminResponse = await axios.get('http://localhost:8000/api/admin/getallusers', { withCredentials: true });
          setUsers(adminResponse.data.users);

          console.log('ユーザー一覧:', adminResponse.data);
          console.log('ユーザー:', adminResponse);

        } else {
          console.error('管理者としてログインしていません。');
        }
      } catch (error) {
        console.error('ユーザー取得エラー:', error);
      }
    };

    fetchUsers();
  }, []);

  // 詳細ボタンがクリックされたときのハンドラ
  const handleDetailsClick = (userId) => {
    console.log(`詳細ボタンがクリックされました。ユーザーID: ${userId}`);
  };

  // ログアウト成功時の処理
  const onLogoutSuccess = () => {
    // ここにログアウト成功時の追加の処理を追加できます
    console.log('ログアウトしました。');
  };

  return (
    <div>
      {/* ログアウトボタンを追加 */}
      <LogoutButton onLogoutSuccess={onLogoutSuccess} />
      
      <chakra.h2 fontSize="xl" fontWeight="bold" mb={4}>ユーザー一覧</chakra.h2>
    <chakra.table width="100%" variant="simple" borderWidth="1px" borderRadius="lg">
      <thead>
        <chakra.tr>
          <chakra.th>ID</chakra.th>
          <chakra.th>名前</chakra.th>
          <chakra.th>Email</chakra.th>
          <chakra.th>詳細</chakra.th>
        </chakra.tr>
      </thead>
      <chakra.tbody>
        {users.map((user) => (
          <chakra.tr key={user.id}>
            <chakra.td>{user.id}</chakra.td>
            <chakra.td>{user.name}</chakra.td>
            <chakra.td>{user.email}</chakra.td>
            <chakra.td>
              <chakra.button
                onClick={() => handleDetailsClick(user.id)}
                bg="teal.500"
                color="white"
                px={4}
                py={2}
                borderRadius="md"
                _hover={{ bg: 'teal.600' }}
              >
                詳細
              </chakra.button>
            </chakra.td>
          </chakra.tr>
        ))}
      </chakra.tbody>
    </chakra.table>
    </div>
  );
};

