import * as React from "react"
import { ChakraProvider, theme } from "@chakra-ui/react"
import { Router } from "./components/router/Router"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"
import axios from 'axios';
import config from './components/pages/config/production';
import { fetchAuthUser, loadAuthUser } from "./store/slices/authSlice"

axios.defaults.baseURL = config.API_ENDPOINT;

export const App = () => {
  React.useEffect(() => {
    store.dispatch(loadAuthUser());
  }, []);

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
