import { Route, Routes } from "react-router-dom";
import { memo } from "react";
import { TopPage } from "../pages/TopPage";
import { LoginPage } from "../pages/Auth/LoginPage";
import { UserRegister } from "../pages/Auth/UserRegister";
import { AllMyDishes } from "../pages/AllMyDishes";
import { CreateDish } from "../pages/CreateDish";
import { Japanese } from "../pages/JapaneseFood/Japanese";
import { JapaneseFukusai } from "../pages/JapaneseFood/JapaneseFukusai";
import { JapaneseSyusai } from "../pages/JapaneseFood/JapaneseSyusai";
import { JapaneseShirumono } from "../pages/JapaneseFood/JapaneseShirumono";
import { Western } from "../pages/WesternFood/Western";
import { WesternSyusai } from "../pages/WesternFood/WesternSyusai";
import { WesternFukusai } from "../pages/WesternFood/WesternFukusai";
import { WesternShirumono } from "../pages/WesternFood/WesternShirumono";
import { Chinese } from "../pages/ChineseFood/Chinese";
import { ChineseSyusai } from "../pages/ChineseFood/ChineseSyusai";
import { ChineseFukusai } from "../pages/ChineseFood/ChineseFukusai";
import { ChineseShirumono } from "../pages/ChineseFood/ChineseShirumono";
import { EditDish } from "../pages/EditDish";

export const Router = memo(() => {
    return (
        <Routes>
            <Route path="/" element={<TopPage />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<UserRegister />}/>
            <Route path="/all_my_dishes" element={<AllMyDishes />}/>
            <Route path="/create" element={<CreateDish />}/>
            <Route path="/edit/:dishId" element={<EditDish />} />
            <Route path="/all_my_japanese" element={<Japanese />}/>
            <Route path="all_my_japanese_syusai" element={<JapaneseSyusai />}/>
            <Route path="/all_my_japanese_fukusai" element={<JapaneseFukusai />}/>
            <Route path="/all_my_japanese_shirumono" element={<JapaneseShirumono />}/>
            <Route path="/all_my_western_recipes" element={<Western />}/>
            <Route path="/all_my_western_syusai" element={<WesternSyusai />}/>
            <Route path="/all_my_western_fukusai" element={<WesternFukusai />}/>
            <Route path="/all_my_western_shirumono" element={<WesternShirumono />}/>

            <Route path="/all_my_chinese_recipes" element={<Chinese />}/>
            <Route path="/all_my_chinese_syusai" element={<ChineseSyusai />}/>
            <Route path="/all_my_chinese_fukusai" element={<ChineseFukusai />}/>
            <Route path="/all_my_chinese_shirumono" element={<ChineseShirumono />}/>
        </Routes>

        );
    });