import { Route, Routes } from "react-router-dom";
import { memo } from "react";
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
import { AllDishImage } from "../pages/Admin/AllDishImage";
import { Calendar } from "../pages/Calendar";
import MenuForDate from "../pages/MenuForDate";
import { IngredientsList } from "../pages/IngredientLists";
import { DeleteAccountButton } from "../pages/DeleteAccountButton";
import ChangePasswordForm from "../pages/ChangePasswordForm";

export const Router = memo(() => {
    
    return (
        <Routes>
            <Route path="/" element={<TopPage />}/>
            <Route path="/admin" element={<UsersList />}/>
            <Route path="users/self" element={<DeleteAccountButton />}/>
            <Route path="/change_password" element={<ChangePasswordForm />}/>
            <Route path="/about" element={<MenuForDate/>}/>
            <Route path="/menu" element={<MenuForDate />} />
            <Route path="/ingredients_list" element={<IngredientsList />} />
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<UserRegister />}/>
            <Route path="/all_my_dishes" element={<AllMyDishes />}/>
            <Route path="/create" element={<CreateDish />}/>
            <Route path="/edit/:dishId" element={<EditDish />} />
            <Route path="/all_my_japanese_foods" element={<Japanese />}/>
            <Route path="all_my_japanese_syusai" element={<JapaneseSyusai />}/>
            <Route path="/all_my_japanese_fukusai" element={<JapaneseFukusai />}/>
            <Route path="/all_my_japanese_shirumono" element={<JapaneseShirumono />}/>
            <Route path="/all_my_japanese_others" element={<JapaneseOthers />}/>
            <Route path="/all_my_western_foods" element={<Western />}/>
            <Route path="/all_my_western_syusai" element={<WesternSyusai />}/>
            <Route path="/all_my_western_fukusai" element={<WesternFukusai />}/>
            <Route path="/all_my_western_shirumono" element={<WesternShirumono />}/>
            <Route path="/all_my_western_others" element={<WesternOthers />}/>
            <Route path="/all_my_chinese_foods" element={<Chinese />}/>
            <Route path="/all_my_chinese_syusai" element={<ChineseSyusai />}/>
            <Route path="/all_my_chinese_fukusai" element={<ChineseFukusai />}/>
            <Route path="/all_my_chinese_shirumono" element={<ChineseShirumono />}/>
            <Route path="/all_my_chinese_others" element={<ChineseOthers />}/>
            <Route path="/all_my_others_foods" element={<Others />}/>
            <Route path="/all_my_others_syusai" element={<OthersSyusai />}/>
            <Route path="/all_my_others_fukusai" element={<OthersFukusai />}/>
            <Route path="/all_my_others_shirumono" element={<OthersShirumono />}/>
            <Route path="/all_my_others_others" element={<OthersOthers />}/>
        </Routes>

        );
    });