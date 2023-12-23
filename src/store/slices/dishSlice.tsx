// slices/dishSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface Dish {
  id: number;
  name: string;
  genre_id: number;
  category_id: number;
  description: string;
  reference_url: string;
}

interface DishState {
  selectedDish: Dish | null;
}

const initialState: DishState = {
  selectedDish: null,
};

export const dishSlice = createSlice({
  name: 'dish',
  initialState,
  reducers: {
    selectDish: (state, action: PayloadAction<Dish | null>) => {
      state.selectedDish = action.payload;
    },
  },
});

export const { selectDish } = dishSlice.actions;

export const selectSelectedDish = (state: RootState) => state.dish.selectedDish;

export default dishSlice.reducer;