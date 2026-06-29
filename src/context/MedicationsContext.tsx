import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { petsApi, medicationsApi } from '../api'
import { useUser } from './UserContext'

export interface MedRecord {
  id: string
  petId: string
  icon: string
  title: string
  dose: string
  frequency: string
  startDate: string
  endDate: string
  notes: string
  bg: string
  color: string
  badge: string
  badgeCls: string
  archived: boolean
}

interface MedicationsContextValue {
  getMedicationsByPetId: (petId: string) => MedRecord[]
  medications: MedRecord[]
  getActiveMedicationsByPetId: (petId: string) => MedRecord[]
  active: MedRecord[]
  history: MedRecord[]
  loading: boolean
  error: string | null
  addMedication: (
    petId: string,
    data: Omit<MedRecord, 'id' | 'icon' | 'bg' | 'color' | 'badge' | 'badgeCls' | 'archived'>
  ) => Promise<MedRecord>
  updateMedication: (updated: MedRecord) => Promise<void>
  deleteMedication: (id: string) => Promise<void>
  archiveMedication: (id: string) => void
  unarchiveMedication: (id: string) => void
  markMedicationAdministered: (med: MedRecord, date: string, locale?: string) => string
  refetch: () => void
}

const ICONS = ['💊', '💉', '🩺', '🌡️', '🧪']
const BGCOLORS = [
  'linear-gradient(135deg,#FFF3DC,#FFE0A0)',
  'linear-gradient(135deg,#E0F4FF,#B8E0FF)',
  'linear-gradient(135deg,#E8FFE8,#B8F0B8)',
  'linear-gradient(135deg,#F0E8FF,#DDD0FF)',
]

function deriveBadge(endDate: string): { badge: string; badgeCls: string } {
  if (!endDate) return { badge: 'Em curso', badgeCls: 'badge-green' }
  const msLeft = new Date(endDate + 'T12:00:00').getTime() - Date.now()
  if (msLeft < 0) return { badge: 'Concluído', badgeCls: 'badge-grey' }
  if (msLeft < 7 * 24 * 3600 * 1000) return { badge: 'A terminar', badgeCls: 'badge-yellow' }
  return { badge: 'Em curso', badgeCls: 'badge-green' }
}

function mapApiMedToRecord(api: any, petId: string): MedRecord {
  const { badge, badgeCls } = deriveBadge(api.endDate ?? '')
  return {
    id: api.id,
    petId,
    icon: ICONS[Math.abs(api.id.charCodeAt(0)) % ICONS.length],
    title: api.name ?? '',
    dose: api.dosage ?? '',
    frequency: api.frequency ?? '',
    startDate: api.startDate ?? '',
    endDate: api.endDate ?? '',
    notes: api.notes ?? '',
    bg: BGCOLORS[Math.abs(api.id.charCodeAt(0)) % BGCOLORS.length],
    color: 'var(--primary)',
    badge,
    badgeCls,
    archived: false,
  }
}

function loadMeds(userId: string): MedRecord[] {
  if (!userId) return []
  try {
    return JSON.parse(localStorage.getItem(`pituti-meds-${userId}`) ?? 'null') ?? []
  } catch {
    return []
  }
}

function saveMeds(userId: string, meds: MedRecord[]): void {
  if (!userId) return
  try {
    localStorage.setItem(`pituti-meds-${userId}`, JSON.stringify(meds))
  } catch { /* ignore */ }
}

const MedicationsContext = createContext<MedicationsContextValue | null>(null)

export function MedicationsProvider({ children }: { children: React.ReactNode }) {
  // FIX: incluir `ready` — sem ele, carrega com user.id='' e usa chave localStorage errada
  const { user, isAuthenticated, ready } = useUser()
  const [meds, setMeds] = useState<MedRecord[]>([])
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  // FIX: dep array inclui `ready`
  useEffect(() => {
    if (!ready || !isAuthenticated || !user.id) return

    // 1. localStorage imediato com chave correcta
    const stored = loadMeds(user.id)
    if (stored.length) setMeds(stored)

    // 2. API em background
    let cancelled = false
    petsApi
      .getAll(user.id)
      .then(async petsRes => {
        const pets = petsRes.data as any[]
        const results = await Promise.all(
          pets.map(p =>
            medicationsApi
              .getAll(p.id)
              .then(r => (r.data as any[]).map(m => mapApiMedToRecord(m, p.id)))
              .catch(() => [] as MedRecord[])
          )
        )
        if (!cancelled) {
          const apiMeds = results.flat()
          if (apiMeds.length) {
            setMeds(apiMeds)
            saveMeds(user.id, apiMeds)
          }
        }
      })
      .catch(() => { /* fica com localStorage */ })

    return () => { cancelled = true }
  }, [ready, isAuthenticated, user.id, tick])

  const active = useMemo(() => meds.filter(m => !archivedIds.has(m.id)), [meds, archivedIds])
  const history = useMemo(() => meds.filter(m => archivedIds.has(m.id)), [meds, archivedIds])

  const addMedication = useCallback(async (
    petId: string,
    data: Omit<MedRecord, 'id' | 'icon' | 'bg' | 'color' | 'badge' | 'badgeCls' | 'archived'>
  ): Promise<MedRecord> => {
    const localMed: MedRecord = {
      ...data,
      id: `local-${Date.now()}`,
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      bg: BGCOLORS[Math.floor(Math.random() * BGCOLORS.length)],
      color: 'var(--primary)',
      archived: false,
      ...deriveBadge(data.endDate ?? ''),
    }
    setMeds(prev => {
      const next = [localMed, ...prev]
      if (user.id) saveMeds(user.id, next)
      return next
    })
    medicationsApi
      .create(petId, { name: data.title, dosage: data.dose, frequency: data.frequency, startDate: data.startDate, endDate: data.endDate || undefined, notes: data.notes || undefined } as any)
      .then(res => {
        const serverMed = mapApiMedToRecord(res.data, petId)
        setMeds(prev => {
          const next = prev.map(m => (m.id === localMed.id ? serverMed : m))
          if (user.id) saveMeds(user.id, next)
          return next
        })
      })
      .catch(() => { /* fica com ID local */ })
    return localMed
  }, [user.id])

  const updateMedication = useCallback(async (updated: MedRecord): Promise<void> => {
    setMeds(prev => {
      const next = prev.map(m => (m.id === updated.id ? updated : m))
      if (user.id) saveMeds(user.id, next)
      return next
    })
    if (!updated.id.startsWith('local-')) {
      medicationsApi
        .update(updated.petId, updated.id, { name: updated.title, dosage: updated.dose, frequency: updated.frequency, startDate: updated.startDate, endDate: updated.endDate || undefined, notes: updated.notes || undefined } as any)
        .catch(() => { /* silencia */ })
    }
  }, [user.id])

  const deleteMedication = useCallback(async (id: string): Promise<void> => {
    const med = meds.find(m => m.id === id)
    setMeds(prev => {
      const next = prev.filter(m => m.id !== id)
      if (user.id) saveMeds(user.id, next)
      return next
    })
    setArchivedIds(prev => { const s = new Set(prev); s.delete(id); return s })
    if (med && !med.id.startsWith('local-')) {
      medicationsApi.delete(med.petId, id).catch(() => { /* silencia */ })
    }
  }, [meds, user.id])

  const archiveMedication = useCallback((id: string) => {
    setArchivedIds(prev => new Set([...prev, id]))
  }, [])

  const unarchiveMedication = useCallback((id: string) => {
    setArchivedIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }, [])

  const markMedicationAdministered = useCallback(
    (med: MedRecord, date: string, locale = 'pt') =>
      new Date(date + 'T12:00:00').toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }),
    []
  )

  const getActiveMedicationsByPetId = useCallback(
    (petId: string) => meds.filter(m => m.petId === petId && !archivedIds.has(m.id)),
    [meds, archivedIds]
  )

  const getMedicationsByPetId = useCallback(
    (petId: string) => meds.filter(m => m.petId === petId),
    [meds]
  )

  return (
    <MedicationsContext.Provider value={{ medications: meds, getMedicationsByPetId, getActiveMedicationsByPetId, active, history, loading, error, addMedication, updateMedication, deleteMedication, archiveMedication, unarchiveMedication, markMedicationAdministered, refetch }}>
      {children}
    </MedicationsContext.Provider>
  )
}

export function useMedications(): MedicationsContextValue {
  const ctx = useContext(MedicationsContext)
  if (!ctx) throw new Error('useMedications must be used within MedicationsProvider')
  return ctx
}
