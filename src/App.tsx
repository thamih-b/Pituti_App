import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PitutiProvider } from './context/PitutiContext'
import { SymptomsProvider } from './context/SymptomsContext'
import { LanguageProvider } from './context/LanguageContext'
import { CaresProvider } from './context/CaresContext'
import { VetProvider } from './context/VetContext'

import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import PetListPage from './pages/PetListPage'
import PetDetailPage from './pages/PetDetailPage'
import VaccinesPage from './pages/VaccinesPage'
import MedicationsPage from './pages/MedicationsPage'
import SymptomsPage from './pages/SymptomsPage'
import NotesPage from './pages/NotesPage'
import CaresPage from './pages/CaresPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'
import VetPage from './pages/VetPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import { MedicationsProvider } from './context/MedicationsContext'

export default function App() {
  return (
    <LanguageProvider>
      <PitutiProvider>
        <SymptomsProvider>
          <CaresProvider>
            <MedicationsProvider>
            <VetProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="pets" element={<PetListPage />} />
                    <Route path="pets/:petId" element={<PetDetailPage />} />
                    <Route path="vaccines" element={<VaccinesPage />} />
                    <Route path="medications" element={<MedicationsPage />} />
                    <Route path="symptoms" element={<SymptomsPage />} />
                    <Route path="notes" element={<NotesPage />} />
                    <Route path="cares" element={<CaresPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="vet" element={<VetPage />} />
                  </Route>

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </VetProvider>
            </MedicationsProvider>
          </CaresProvider>
        </SymptomsProvider>
      </PitutiProvider>
    </LanguageProvider>
  )
}