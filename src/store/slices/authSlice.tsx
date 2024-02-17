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

// ログイン中のユーザー情報を取得するAPIを叩く関数
export const fetchAuthUser = createAsyncThunk(
    "auth/fetchAuthUser",
    async () => {
        try {
            // CSRFトークンを取得
            const csrfTokenResponse = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
                withCredentials: true,
            });
            const csrfToken = csrfTokenResponse.data.csrfToken;
            
            // ユーザー情報を取得
            const response = await axios.get(`${config.API_ENDPOINT}/api/user`, {
                withCredentials: true, // クッキーを使うための設定
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            
            return response.data;
        } catch (error) {
            // エラーハンドリング
            throw error;
        }
    }
);
