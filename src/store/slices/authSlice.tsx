import { createAsyncThunk, createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthUserType } from "../../types/AuthUserType";
import { RootState } from "..";

// stateの初期値
const initialState: AuthUserType = {
    user: undefined,
    isLoading: false,
    error: undefined,
};

// 認証情報を取得する非同期Thunkアクション
export const fetchAuthUser = createAsyncThunk(
    "auth/fetchAuthUser",
    async () => {
        try {
            const response = await axios.get("/api/user", {
                withCredentials: true, // クッキーを使うための設定
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
    },
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

// ページのロード時に認証情報を読み込む
export const loadAuthUser = () => async (dispatch: Dispatch<any>) => {
    try {
        // ロード中のUIを表示するためにローディング状態を設定
        dispatch(fetchAuthUser.pending);

        // 認証情報を取得する非同期アクションを実行
        const resultAction = await dispatch(fetchAuthUser());

        // 非同期アクションが成功した場合、認証情報をReduxストアに保存
        if (fetchAuthUser.fulfilled.match(resultAction)) {
            const authUser = resultAction.payload;
            dispatch(authSlice.actions.setAuthUser(authUser));
        }
    } catch (error) {
        // エラーが発生した場合、エラーメッセージをログに記録
        console.error('認証情報の読み込みに失敗しました', error);
    }
};


