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
};

// Redux ToolkitのSliceを作成
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

// Selectorを定義
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;

// ログイン中のユーザー情報を取得するAPIを叩くThunk
export const fetchAuthUser = createAsyncThunk(
    "auth/fetchAuthUser",
    async () => {
        try {
            // CSRFトークンを取得
            await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
                withCredentials: true,
            });

            // ユーザー情報を取得
            const response = await axios.get("/api/user", {
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            // エラーハンドリング
            throw error;
        }
    }
);

// CSRFトークンを取得する関数
const fetchCsrfToken = async () => {
    try {
        const response = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`, {
            withCredentials: true,
        });
        const csrfToken = response.data.csrfToken;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        console.log('CSRFトークンを取得しました', csrfToken);
    } catch (error) {
        console.error('CSRFトークンの取得に失敗しました', error);
    }
};

// CSRFトークンを取得
fetchCsrfToken();
