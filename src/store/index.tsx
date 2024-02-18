// src/store/index.ts
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import dateReducer from './slices/dateSlice';
import menuReducer from './slices/menuSlice';
import upDateReducer from './slices/upDateMenuSlice';
import dishReducer from './slices/dishSlice';
import authReducer from './slices/authSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedDate: dateReducer,
    date: dateReducer,
    menu: menuReducer,
    // upDate: upDateReducer,
    dish: dishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
