// slices/menuSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface Dish {
  id: number;
  name: string;
  description: string;
}

export interface MenuItem {
  id: number;
  date: string;
  dish: Dish;
  
}

interface MenuState {
  items: MenuItem[];
}

const initialState: MenuState = {
  items: [],
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
    },
    deleteMenu: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setMenu, deleteMenu } = menuSlice.actions;

export const selectMenu = (state: RootState) => state.menu.items;

export default menuSlice.reducer;
