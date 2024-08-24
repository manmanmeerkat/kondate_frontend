import { Route, Routes } from "react-router-dom";
import { memo } from "react";

// 各ページコンポーネントのインポート
import { TopPage } from "../pages/TopPage";
import { UserRegister } from "../pages/Auth/UserRegister";
import { AllMyDishes } from "../pages/AllMyDishes";
import { CreateDish } from "../pages/CreateDish";
import { Japanese } from "../pages/JapaneseFood/Japanese";
import { JapaneseFukusai } from "../pages/JapaneseFood/JapaneseFukusai";
import { JapaneseSyusai } from "../pages/JapaneseFood/JapaneseSyusai";
import { JapaneseShirumono } from "../pages/JapaneseFood/JapaneseShirumono";
import { Western } from "../pages/WesternFood/Western";
import { WesternSyusai } from "../pages/WesternFood/WesternSyusai";
import { WesternShirumono } from "../pages/WesternFood/WesternShirumono";
import { Chinese } from "../pages/ChineseFood/Chinese";
import { ChineseSyusai } from "../pages/ChineseFood/ChineseSyusai";
import { ChineseFukusai } from "../pages/ChineseFood/ChineseFukusai";
import { ChineseShirumono } from "../pages/ChineseFood/ChineseShirumono";
import { EditDish } from "../pages/EditDish";
import { WesternFukusai } from "../pages/WesternFood/WesternFukusai";
import { JapaneseOthers } from "../pages/JapaneseFood/JapaneseOthers";
import { WesternOthers } from "../pages/WesternFood/WesternOthers";
import { ChineseOthers } from "../pages/ChineseFood/ChineseOthers";
import { Others } from "../pages/OthersFood/Others";
import { OthersSyusai } from "../pages/OthersFood/OthersSyusai";
import { OthersFukusai } from "../pages/OthersFood/OthersFukusai";
import { OthersShirumono } from "../pages/OthersFood/OthersShirumono";
import { OthersOthers } from "../pages/OthersFood/OthersOthers";
import { LoginPage } from "../pages/Auth/LoginPage";
import { UsersList } from "../pages/Admin/UsersList";
import MenuForDate from "../pages/MenuForDate";
import { IngredientsList } from "../pages/IngredientLists";
import { DeleteAccountButton } from "../pages/DeleteAccountButton";
import ChangePasswordForm from "../pages/ChangePasswordForm";
import { About } from "../pages/About";
import MenuCalendar from "../pages/MenuCalendar";


export const Router = memo(() => {
    return (
        <Routes>
            {/* トップページ */}
            <Route path="/" element={<TopPage />} />
            
            {/* 管理者向けページ */}
            <Route path="/admin" element={<UsersList />} />
            
            {/* ユーザー関連ページ */}
            <Route path="users/self" element={<DeleteAccountButton />} />
            <Route path="/change_password" element={<ChangePasswordForm />} />
            
            {/* その他のページ */}
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<MenuForDate />} />
            <Route path="/menu_calendar" element={<MenuCalendar />} />
            <Route path="/ingredients_list" element={<IngredientsList />} />
            
            {/* 認証関連ページ */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<UserRegister />} />
            
            {/* レシピ関連ページ */}
            <Route path="/all_my_dishes" element={<AllMyDishes />} />
            <Route path="/create" element={<CreateDish />} />
            <Route path="/edit/:dishId" element={<EditDish />} />
            
            {/* 和食関連ページ */}
            <Route path="/all_my_japanese_foods" element={<Japanese />} />
            <Route path="all_my_japanese_syusai" element={<JapaneseSyusai />} />
            <Route path="/all_my_japanese_fukusai" element={<JapaneseFukusai />} />
            <Route path="/all_my_japanese_shirumono" element={<JapaneseShirumono />} />
            <Route path="/all_my_japanese_others" element={<JapaneseOthers />} />
            
            {/* 洋食関連ページ */}
            <Route path="/all_my_western_foods" element={<Western />} />
            <Route path="/all_my_western_syusai" element={<WesternSyusai />} />
            <Route path="/all_my_western_fukusai" element={<WesternFukusai />} />
            <Route path="/all_my_western_shirumono" element={<WesternShirumono />} />
            <Route path="/all_my_western_others" element={<WesternOthers />} />
            
            {/* 中華料理関連ページ */}
            <Route path="/all_my_chinese_foods" element={<Chinese />} />
            <Route path="/all_my_chinese_syusai" element={<ChineseSyusai />} />
            <Route path="/all_my_chinese_fukusai" element={<ChineseFukusai />} />
            <Route path="/all_my_chinese_shirumono" element={<ChineseShirumono />} />
            <Route path="/all_my_chinese_others" element={<ChineseOthers />} />
            
            {/* その他の料理関連ページ */}
            <Route path="/all_my_others_foods" element={<Others />} />
            <Route path="/all_my_others_syusai" element={<OthersSyusai />} />
            <Route path="/all_my_others_fukusai" element={<OthersFukusai />} />
            <Route path="/all_my_others_shirumono" element={<OthersShirumono />} />
            <Route path="/all_my_others_others" element={<OthersOthers />} />
        </Routes>
    );
});
