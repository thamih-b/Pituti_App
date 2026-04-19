import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PitutiProvider } from './context/PitutiContext'
import AppLayout      from './components/AppLayout'
import DashboardPage  from './pages/DashboardPage'
import PetListPage    from './pages/PetListPage'
import PetDetailPage  from './pages/PetDetailPage'
import VaccinesPage   from './pages/VaccinesPage'
import MedicationsPage from './pages/MedicationsPage'
import SymptomsPage   from './pages/SymptomsPage'
import NotesPage      from './pages/NotesPage'
import CaresPage      from './pages/CaresPage'
import SettingsPage   from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <PitutiProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"   element={<DashboardPage />} />
            <Route path="pets"        element={<PetListPage />} />
            <Route path="pets/:petId" element={<PetDetailPage />} />
            <Route path="vaccines"    element={<VaccinesPage />} />
            <Route path="medications" element={<MedicationsPage />} />
            <Route path="symptoms"    element={<SymptomsPage />} />
            <Route path="notes"       element={<NotesPage />} />
            <Route path="cares"       element={<CaresPage />} />
            <Route path="settings"    element={<SettingsPage />} />
          </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </PitutiProvider>
  )
}
