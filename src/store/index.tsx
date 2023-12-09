// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import dateReducer from './reducers/dateReducer';
import menuReducer from './slices/menuSlice';

const store = configureStore({
  reducer: {
    selectedDate: dateReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
