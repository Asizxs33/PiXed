import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LanguageProvider, LanguageToggle } from './i18n/translate'
import './styles.css'
import './polish.css'
import './world.css'
import './party.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
      <LanguageToggle />
    </LanguageProvider>
  </StrictMode>,
)
