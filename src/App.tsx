import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { Router } from "./components/router/Router"
import { BrowserRouter } from "react-router-dom"
import { Provider, useDispatch } from "react-redux"
import store from "./store"
import axios from 'axios';
import config from './components/pages/config/production';
import { fetchAuthUser } from "./store/slices/authSlice"
import { AsyncThunkAction } from "@reduxjs/toolkit"


axios.defaults.baseURL = config.API_ENDPOINT;

export const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    store.dispatch(fetchAuthUser() as unknown as AsyncThunkAction<unknown, unknown, {}>
    );
  }, [dispatch]);

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Router/>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  );
}
