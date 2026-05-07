import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/catAnim.css'
import './i18n/i18n'
import App from './App'
import { PitutiProvider } from './context/PitutiContext'
import { PetsProvider  } from './context/PetsContext'
import { UserProvider } from './context/UserContext'
import { CaresProvider } from './context/CaresContext'
import { VaccinesProvider } from './context/VaccinesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <PitutiProvider>
        <PetsProvider >
          <CaresProvider>
            <VaccinesProvider>
              <App />
            </VaccinesProvider>
          </CaresProvider>
        </PetsProvider >
      </PitutiProvider>
    </UserProvider>
  </StrictMode>
)