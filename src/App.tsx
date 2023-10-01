import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { Router } from "./components/router/Router"
import { BrowserRouter } from "react-router-dom"



export const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  </ChakraProvider>
)
