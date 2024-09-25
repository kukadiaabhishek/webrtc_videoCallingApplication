import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import { SocketProvider } from './Context/SocketProvider.jsx'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SocketProvider>
    <App />
    </SocketProvider>
    </BrowserRouter>
  </StrictMode>
)
