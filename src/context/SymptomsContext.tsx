import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface SymptomEntry {
  id:          string
  petId:       string
  description: string
  category:    string
  severity:    string
  date:        string
  notes:       string
  resolved:    boolean
}

interface SymptomsContextValue {
  symptoms:    SymptomEntry[]
  addSymptom:  (s: Omit<SymptomEntry, 'id'>) => void
  saveSymptom: (s: SymptomEntry) => void
  resolve:     (id: string) => void
  unresolve:   (id: string) => void
}

const SymptomsContext = createContext<SymptomsContextValue | null>(null)

const INITIAL: SymptomEntry[] = [
  { id:'s-1', petId:'pet-2', description:'Tos suave sin fiebre. Parece cansado desde hace 3 días.', category:'respiratorio', severity:'moderado', date:'2026-04-18', notes:'No tiene fiebre. Come normal.', resolved:false },
  { id:'r-1', petId:'pet-1', description:'Inapetencia durante varios días sin causa aparente.',      category:'digestivo',    severity:'leve',     date:'2026-02-10', notes:'Se resolvió sola en 4 días.', resolved:true },
  { id:'r-2', petId:'pet-2', description:'Cojera leve en la pata trasera derecha.',                 category:'movimiento',  severity:'leve',     date:'2026-01-15', notes:'Desapareció tras reposo.',    resolved:true },
]

export function SymptomsProvider({ children }: { children: ReactNode }) {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(INITIAL)

  const addSymptom = useCallback((s: Omit<SymptomEntry,'id'>) => {
    setSymptoms(prev => [...prev, { ...s, id:`s-${Date.now()}` }])
  }, [])

  const saveSymptom = useCallback((updated: SymptomEntry) => {
    setSymptoms(prev => prev.map(s => s.id === updated.id ? updated : s))
  }, [])

  const resolve = useCallback((id: string) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, resolved:true } : s))
  }, [])

  const unresolve = useCallback((id: string) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, resolved:false } : s))
  }, [])

  return (
    <SymptomsContext.Provider value={{ symptoms, addSymptom, saveSymptom, resolve, unresolve }}>
      {children}
    </SymptomsContext.Provider>
  )
}

export function useSymptoms() {
  const ctx = useContext(SymptomsContext)
  if (!ctx) throw new Error('useSymptoms must be used within <SymptomsProvider>')
  return ctx
}

export function usePetSymptoms(petId: string) {
  const { symptoms } = useSymptoms()
  return {
    active:   symptoms.filter(s => s.petId === petId && !s.resolved),
    resolved: symptoms.filter(s => s.petId === petId &&  s.resolved),
    all:      symptoms.filter(s => s.petId === petId),
  }
}
