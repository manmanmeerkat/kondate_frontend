import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthUserType } from "../../types/AuthUserType";
import { RootState } from "..";
import { tr } from "date-fns/locale";
import config from "../../components/pages/config/production";

// stateの初期値
const initialState: AuthUserType = {
    user: undefined,
    isLoading: false,
    error: undefined,
    token: "",
};

// ログイン中のユーザー情報を取得するAPIを叩く関数
export const fetchAuthUser = createAsyncThunk(
    "auth/fetchAuthUser",
    async () => {

        try {

            const csrfResponse = await axios.get(`${config.API_ENDPOINT}/api/sanctum/csrf-cookie`,
            {
                withCredentials: true,
                }
                );
            const csrfToken = csrfResponse.data.csrfToken;
            console.log(csrfToken);

            const response = await axios.get(`/api/user`,{
                withCredentials: true,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            }); console.log(response.data);
            return response.data;
           
        } catch (error) {
            console.error("ユーザー情報の取得エラー:", error);
            throw error;
        }
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
                state.token = action.payload.token;
            })
            .addCase(fetchAuthUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;