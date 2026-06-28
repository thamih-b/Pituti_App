import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/catAnim.css'
import './i18n/i18n'
import App from './App'
import { UserProvider } from './context/UserContext'
import { PetsProvider  } from './context/PetsContext'
import { VaccinesProvider } from './context/VaccinesContext'
import { VetExamsProvider } from './context/VetExamsContext'
import { VetDocumentsProvider } from './context/VetDocumentsContext'
import { VetPrescriptionsProvider } from './context/VetPrescriptionsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <PetsProvider>
        <VaccinesProvider>
          <VetExamsProvider>
            <VetDocumentsProvider>
              <VetPrescriptionsProvider>
                <App />
              </VetPrescriptionsProvider>
            </VetDocumentsProvider>
          </VetExamsProvider>
        </VaccinesProvider>
      </PetsProvider>
    </UserProvider>
  </StrictMode>
);