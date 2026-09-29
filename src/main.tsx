import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LanguageProvider, LanguageToggle } from './i18n/translate'
import { LogoutButton } from './auth/LogoutButton'
import './styles.css'
import './polish.css'
import './world.css'
import './party.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
      <LogoutButton />
      <LanguageToggle />
    </LanguageProvider>
  </StrictMode>,
)
