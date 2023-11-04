// UsersList.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogoutButton } from '../../atoms/button/LogoutButton';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersListProps {
  csrfToken: string;
  onLogoutSuccess?: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ csrfToken, onLogoutSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

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
          setLoggedIn(true);

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
  const handleDetailsClick = (userId: number) => {
    // ここでユーザーの詳細情報を表示する処理を追加
    console.log(`詳細ボタンがクリックされました。ユーザーID: ${userId}`);
  };

  return (
    <div>
      {loggedIn ? (
        <>
          <h2>ユーザー一覧</h2>
          <LogoutButton csrfToken={csrfToken} onLogoutSuccess={onLogoutSuccess} />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>名前</th>
                <th>Email</th>
                <th>詳細</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleDetailsClick(user.id)}>詳細</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>ログインしていません。</p>
      )}
    </div>
  );
};

export default UsersList;
