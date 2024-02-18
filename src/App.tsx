import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { Router } from "./components/router/Router"
import { BrowserRouter } from "react-router-dom"
import { Provider, useDispatch, useSelector } from "react-redux"
import store, { AppDispatch, RootState } from "./store"
import axios from 'axios';
import config from './components/pages/config/production';
import { logoutSuccess } from "./store/slices/authSlice"


axios.defaults.baseURL = config.API_ENDPOINT;

export const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  React.useEffect(() => {
    const checkAuthentication = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get('/api/user');
          // 認証が成功した場合は何もしない
        } catch (error) {
          dispatch(logoutSuccess());
        }
      }
    };

    checkAuthentication();
  }, [dispatch, isAuthenticated]);

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
