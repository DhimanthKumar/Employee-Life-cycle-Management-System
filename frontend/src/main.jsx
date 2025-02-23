import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './components/authcontext.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <ChakraProvider>
      <AuthProvider>
    <App /></AuthProvider></ChakraProvider>
  </StrictMode></BrowserRouter>,
)
