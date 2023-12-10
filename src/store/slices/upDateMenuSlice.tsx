// slices/upDateSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface UpDateState {
  calendarKey: number;
}

const initialState: UpDateState = {
  calendarKey: 0,
};

const upDateSlice = createSlice({
  name: 'upDate',
  initialState,
  reducers: {
    incrementCalendarKey: (state) => {
      state.calendarKey += 1;
    },
  },
});

export const { incrementCalendarKey } = upDateSlice.actions;
export default upDateSlice.reducer;
