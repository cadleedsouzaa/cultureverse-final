import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from "./components/ThemeProvider"
import './global.css'
import './i18n'; // <--- ADD THIS LINE HERE

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="culture-lens-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)