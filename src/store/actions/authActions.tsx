// actions/authActions.ts

import { AppThunk } from '..';
import axios from 'axios';
import { loginSuccess } from '../slices/authSlice';

export const loginUser = (userData: { password: string, email: string }): AppThunk => async (dispatch) => {
  try {
    const response = await axios.post('/api/login', userData);
    const token = response.data.token;
    dispatch(loginSuccess(token));
  } catch (error) {
    // エラー処理
  }
};
