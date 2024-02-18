import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthUserType } from "../../types/AuthUserType";
import { RootState } from "..";
import config from "../../components/pages/config/production";

// stateの初期値
const initialState: AuthUserType = {
    user: undefined,
    isLoading: false,
    error: undefined,
    token: '',
};

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
                state.user = action.payload.user; // ユーザー情報をpayloadから取得
                state.token = action.payload.token; // トークンをpayloadから取得
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

// ログイン中のユーザー情報とトークンを取得するAPIを叩く関数
export const fetchAuthUser = createAsyncThunk(
    "auth/fetchAuthUser",
    async () => {
        try {
            // ユーザー情報とトークンを取得
            const response = await axios.get(`${config.API_ENDPOINT}/api/user`, {
                withCredentials: true, // クッキーを使うための設定
            });
            
            return response.data;
        } catch (error) {
            // エラーハンドリング
            throw error;
        }
    }
);
