import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/major-mono-display'
import '@fontsource/inter-tight/300.css'
import '@fontsource/inter-tight/500.css'
import '@fontsource/inter-tight/800.css'
import '@fontsource/ibm-plex-sans-arabic/700.css'
import './styles.css'
import './pillars.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
