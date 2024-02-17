import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthUserType } from "../../types/AuthUserType";
import { RootState } from "..";
import { useEffect, useState } from "react";
import config from "../../components/pages/config/production";

// stateの初期値
const initialState: AuthUserType = {
    user: undefined,
    isLoading: false,
    error: undefined,
};

const [csrfToken, setCsrfToken] = useState<string>('');

useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const csrfToken = response.data.csrfToken;
        setCsrfToken(csrfToken);
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        console.log('CSRFトークンを取得しました', csrfToken);
      } catch (error) {
        console.error('CSRFトークンの取得に失敗しました', error);
      }
    };

    fetchCsrfToken(); // 非同期処理の完了を待つ
  }, []);

// ログイン中のユーザー情報を取得するAPIを叩く関数
export const fetchAuthUser = createAsyncThunk(
    "auth/fetchAuthUser",
    async () => {
        const response = await axios.get("/api/user", {
            withCredentials: true, // クッキーを使うための設定
            headers: {
                'X-CSRF-TOKEN': csrfToken,
              },
            });
        return response.data;
    }
);
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthUser.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(fetchAuthUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload; // fetchAuthUserが実行され、返り値がstateに入る
                state.error = undefined;
            })
            .addCase(fetchAuthUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;