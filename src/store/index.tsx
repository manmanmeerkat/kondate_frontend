// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import dateReducer from './reducers/dateReducer';

const store = configureStore({
  reducer: {
    selectedDate: dateReducer,
    // 他の reducer も追加可能
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
