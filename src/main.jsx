import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import './index.css'
import App from './App.jsx'

// MUI surfaces (bhakta dashboard, staff drawer) follow the site's type instead of Roboto
const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-body)',
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
