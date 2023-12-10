// slices/dateSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface DateState {
  selectedDate: string | null;
}

const initialState: DateState = {
  selectedDate: null,
};

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedDate } = dateSlice.actions;

export const selectSelectedDate = (state: RootState) => state.date.selectedDate;

export default dateSlice.reducer;
