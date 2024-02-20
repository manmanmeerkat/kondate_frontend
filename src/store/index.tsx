// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import dateReducer from './slices/dateSlice';
import menuReducer from './slices/menuSlice';
import upDateReducer from './slices/upDateMenuSlice';
import dishReducer from './slices/dishSlice';

const store = configureStore({
  reducer: {
    selectedDate: dateReducer,
    date: dateReducer,
    menu: menuReducer,
    // upDate: upDateReducer,
    dish: dishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
