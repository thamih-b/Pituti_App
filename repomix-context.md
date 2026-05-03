This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/context/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
src/context/CaresContext.tsx
src/context/LanguageContext.tsx
src/context/MedicationsContext.tsx
src/context/PitutiContext.tsx
src/context/SymptomsContext.tsx
src/context/VetContext-api.tsx
src/context/VetContext.tsx
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="src/context/VetContext-api.tsx">
/**
 *
 * DIFERENÇAS vs versão localStorage:
 *   - useState com array vazio (sem dados hard-coded)
 *   - useEffect busca os dados na API ao montar
 *   - loading + error expostos no Context
 *   - Todas as mutações (add/update/delete) chamam a API e fazem refetch
 */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { vetsApi, appointmentsApi }   from '../api';
import type { ApiVet, ApiAppointment, CreateVetDto, UpdateVetDto, CreateAppointmentDto, UpdateAppointmentDto } from '../api/types';

// Re-export da interface de domínio (mantém compatibilidade com componentes existentes)
export type { ApiVet as VetContact, ApiAppointment as VetAppointment };

interface VetContextValue {
  vets:         ApiVet[];
  appointments: ApiAppointment[];
  loading:      boolean;
  error:        string | null;
  refetch:      () => void;

  addVet:        (dto: CreateVetDto)                               => Promise<void>;
  updateVet:     (id: string, dto: UpdateVetDto)                   => Promise<void>;
  deleteVet:     (id: string)                                      => Promise<void>;

  addAppointment:    (vetId: string, dto: CreateAppointmentDto)              => Promise<void>;
  updateAppointment: (vetId: string, id: string, dto: UpdateAppointmentDto) => Promise<void>;
  deleteAppointment: (vetId: string, id: string)                            => Promise<void>;
}

const VetContext = createContext<VetContextValue | null>(null);

export function VetProvider({ children }: { children: ReactNode }) {
  const [vets,         setVets]         = useState<ApiVet[]>([]);
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [tick,         setTick]         = useState(0);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  // ── Load all vets + their appointments on mount/refetch ────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    vetsApi.getAll()
      .then(async res => {
        if (cancelled) return;
        setVets(res.data);

        // Load appointments for each vet in parallel
        const apptResults = await Promise.all(
          res.data.map(v => appointmentsApi.getAll(v.id).then(r => r.data))
        );
        if (!cancelled) setAppointments(apptResults.flat());
      })
      .catch(err => { if (!cancelled) setError(err.message ?? 'Error al cargar veterinarios'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [tick]);

  // ── Vet mutations ──────────────────────────────────────────────────────────
  const addVet = useCallback(async (dto: CreateVetDto) => {
    await vetsApi.create(dto);
    refetch();
  }, [refetch]);

  const updateVet = useCallback(async (id: string, dto: UpdateVetDto) => {
    await vetsApi.update(id, dto);
    refetch();
  }, [refetch]);

  const deleteVet = useCallback(async (id: string) => {
    await vetsApi.delete(id);
    refetch();
  }, [refetch]);

  // ── Appointment mutations ──────────────────────────────────────────────────
  const addAppointment = useCallback(async (vetId: string, dto: CreateAppointmentDto) => {
    await appointmentsApi.create(vetId, dto);
    refetch();
  }, [refetch]);

  const updateAppointment = useCallback(async (vetId: string, id: string, dto: UpdateAppointmentDto) => {
    await appointmentsApi.update(vetId, id, dto);
    refetch();
  }, [refetch]);

  const deleteAppointment = useCallback(async (vetId: string, id: string) => {
    await appointmentsApi.delete(vetId, id);
    refetch();
  }, [refetch]);

  return (
    <VetContext.Provider value={{
      vets, appointments, loading, error, refetch,
      addVet, updateVet, deleteVet,
      addAppointment, updateAppointment, deleteAppointment,
    }}>
      {children}
    </VetContext.Provider>
  );
}

export function useVet() {
  const ctx = useContext(VetContext);
  if (!ctx) throw new Error('useVet must be used inside VetProvider');
  return ctx;
}
</file>

<file path="src/context/CaresContext.tsx">
import {
  createContext, useContext, useState, useCallback, useEffect,
  type ReactNode,
} from 'react'
import type { CareEditData } from '../components/EditCareModal'

export interface CareItem {
  id:           string
  petId:        string
  emoji:        string
  title:        string
  sub:          string
  total:        number
  period:       string
  intervalDays: number
  startDate:    string
  quantity:     string
  notify:       boolean
  time:         string
  recurring:    boolean
  bg:           string
  doneByDate:   Record<string, { done: number; doneState: boolean }>
}

type NewCareItem = Omit<CareItem, 'id' | 'doneByDate'> & { id?: string; doneByDate?: CareItem['doneByDate'] }

interface CaresContextValue {
  items:           CareItem[]
  setCareProgress: (id: string, dateStr: string, done: number, doneState: boolean) => void
  editCare:        (care: CareItem) => void
  updateCare:      (updated: CareEditData) => void
  deleteCare:      (id: string) => void
  addCare:         (item: NewCareItem) => void
}

export function getDueDatesInRange(care: CareItem, fromStr: string, toStr: string): string[] {
  const result: string[] = []
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  const to    = new Date(toStr          + 'T12:00:00')
  let cur = new Date(start)
  while (cur < from) cur.setDate(cur.getDate() + care.intervalDays)
  while (cur <= to) {
    result.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + care.intervalDays)
  }
  return result
}

export function isDueOnDate(care: CareItem, dateStr: string): boolean {
  if (care.intervalDays <= 1) return true
  return getDueDatesInRange(care, dateStr, dateStr).length > 0
}

export function getNextDueDate(care: CareItem, fromStr: string): string {
  if (care.intervalDays <= 1) return fromStr
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  let cur = new Date(start)
  while (cur <= from) cur.setDate(cur.getDate() + care.intervalDays)
  return cur.toISOString().split('T')[0]
}

function periodToInterval(period: string): number {
  if (period === 'week')  return 7
  if (period === 'month') return 30
  return 1
}

function resolveIntervalDays(u: CareEditData): number {
  if (u.period === 'custom' && u.intervalDays != null) return Math.max(2, Number(u.intervalDays) || 2)
  return periodToInterval(u.period ?? 'day')
}

function buildSub(u: CareEditData): string {
  let freq: string
  const xd = u.intervalDays ?? 2
  switch (u.period ?? 'day') {
    case 'day':    freq = 'al día';                        break
    case 'week':   freq = 'por semana';                    break
    case 'month':  freq = 'por mes';                       break
    case 'custom': freq = `cada ${xd} día${xd !== 1 ? 's' : ''}`; break
    default:       freq = 'al día'
  }
  const qty = u.quantity?.trim() ? ` · ${u.quantity.trim()}` : ''
  return `${u.total} ${freq}${qty}`
}

const today = new Date().toISOString().split('T')[0]

const INITIAL: CareItem[] = [
  { id:'care-luna-food',  petId:'pet-1', emoji:'🍽️', title:'Alimentación', sub:'2 al día · 80g', total:2, period:'day',    intervalDays:1,  startDate:today, quantity:'80g', notify:true, time:'', recurring:true, bg:'linear-gradient(135deg,#FFF3DC,#FFE0A0)', doneByDate:{} },
  { id:'care-luna-brush', petId:'pet-1', emoji:'🪮',  title:'Cepillado',   sub:'1 por semana',   total:1, period:'week',   intervalDays:7,  startDate:today, quantity:'',    notify:true, time:'', recurring:true, bg:'linear-gradient(135deg,#F0E8FF,#DDD0FF)', doneByDate:{} },
  { id:'care-luna-bath',  petId:'pet-1', emoji:'🛁',  title:'Baño',        sub:'1 cada 14 días', total:1, period:'custom', intervalDays:14, startDate:today, quantity:'',    notify:true, time:'', recurring:true, bg:'linear-gradient(135deg,#E0F8FF,#A8DCFF)', doneByDate:{} },
  { id:'care-toby-water', petId:'pet-2', emoji:'💧',  title:'Agua fresca', sub:'3 al día',       total:3, period:'day',    intervalDays:1,  startDate:today, quantity:'',    notify:true, time:'', recurring:true, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneByDate:{} },
  { id:'care-toby-walk',  petId:'pet-2', emoji:'🦮',  title:'Paseo',       sub:'2 al día',       total:2, period:'day',    intervalDays:1,  startDate:today, quantity:'',    notify:true, time:'', recurring:true, bg:'linear-gradient(135deg,#E8FFE8,#B8F0B8)', doneByDate:{} },
  { id:'care-kiwi-water', petId:'pet-3', emoji:'💧',  title:'Agua',        sub:'2 al día',       total:2, period:'day',    intervalDays:1,  startDate:today, quantity:'',    notify:true, time:'', recurring:true, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneByDate:{} },
]

const CaresContext = createContext<CaresContextValue | null>(null)

export function CaresProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CareItem[]>(INITIAL)

  // Carregar cuidados da API ao montar
  useEffect(() => {
    fetch('http://localhost:3001/api/cares')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const apiCares: CareItem[] = data.data.map((c: any) => ({
            id: c.id,
            petId: c.petId,
            emoji: c.emoji ?? '🐾',
            title: c.title ?? c.name,
            sub: c.sub ?? c.frequency ?? '',
            total: c.total ?? 1,
            period: c.period ?? 'day',
            intervalDays: c.intervalDays ?? 1,
            startDate: c.startDate ?? today,
            quantity: c.quantity ?? '',
            notify: c.notify ?? true,
            time: c.time ?? '',
            recurring: c.recurring ?? true,
            bg: c.bg ?? 'linear-gradient(135deg,#E0F4FF,#B8E0FF)',
            doneByDate: {},
          }))
          setItems(prev => [...prev, ...apiCares])
        }
      })
      .catch(() => {})
  }, [])

  const setCareProgress = useCallback((id: string, dateStr: string, done: number, doneState: boolean) => {
    setItems(prev => prev.map(c =>
      c.id !== id ? c : { ...c, doneByDate: { ...c.doneByDate, [dateStr]: { done, doneState } } }
    ))
  }, [])

  const editCare = useCallback((care: CareItem) => {
    setItems(prev => prev.map(c => c.id !== care.id ? c : { ...c, ...care }))
  }, [])

  const updateCare = useCallback((u: CareEditData) => {
    setItems(prev => prev.map(c =>
      c.id !== u.id ? c : {
        ...c,
        emoji: u.emoji, title: u.title,
        total: Math.max(1, Number(u.total)),
        period: u.period ?? 'day',
        intervalDays: resolveIntervalDays(u),
        quantity: u.quantity ?? '',
        notify: u.notify ?? true,
        time: u.time ?? c.time,
        recurring: u.recurring ?? c.recurring,
        sub: buildSub(u),
        bg: u.bg ?? c.bg,
      }
    ))
  }, [])

  const deleteCare = useCallback((id: string) => {
    setItems(prev => prev.filter(c => c.id !== id))
  }, [])

  const addCare = useCallback((item: NewCareItem) => {
    const newItem: CareItem = {
      ...item,
      id: item.id ?? `care-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      doneByDate: item.doneByDate ?? {},
    }
    setItems(prev => [...prev, newItem])
  }, [])

  return (
    <CaresContext.Provider value={{ items, setCareProgress, editCare, updateCare, deleteCare, addCare }}>
      {children}
    </CaresContext.Provider>
  )
}

export function useCares() {
  const ctx = useContext(CaresContext)
  if (!ctx) throw new Error('useCares must be used inside <CaresProvider>')
  return ctx
}

export function usePetCares(petId: string): CareItem[] {
  const { items } = useCares()
  return items.filter(c => c.petId === petId)
}
</file>

<file path="src/context/LanguageContext.tsx">
import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from 'react'
import { TRANSLATIONS, LANG_LABELS, type Lang, type Translations } from '../i18n/translations'

// ── Types ────────────────────────────────────────────────────────
interface LanguageContextValue {
  lang:        Lang
  setLang:     (l: Lang) => void
  t:           Translations
  langLabel:   string
}

// ── Context ──────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextValue | null>(null)

// ── Helpers ──────────────────────────────────────────────────────
function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem('pituti-lang')
    if (v === 'es' || v === 'en' || v === 'pt') return v
  } catch { /* ignore */ }
  // Try browser language
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'en') return 'en'
  if (browser === 'pt') return 'pt'
  return 'es'
}

function applyLangToDOM(lang: Lang) {
  document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang)
}

// ── Provider ─────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const l = readStoredLang()
    applyLangToDOM(l)
    return l
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    applyLangToDOM(l)
    try { localStorage.setItem('pituti-lang', l) } catch { /* ignore */ }
  }, [])

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t: TRANSLATIONS[lang],
      langLabel: LANG_LABELS[lang],
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}

/** Convenience shortcut: returns just the translation object */
export function useT() {
  return useLanguage().t
}

export type { Lang }
</file>

<file path="src/context/MedicationsContext.tsx">
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord } from '../components/EditMedModal'

const PET_EMOJI: Record<string, string> = {
  'pet-demo-001': '🐱',
  'pet-1': '🐱',
  'pet-2': '🐶',
  'pet-3': '🦜',
}

const PET_NAME: Record<string, string> = {
  'pet-demo-001': 'Luna',
  'pet-1': 'Luna',
  'pet-2': 'Toby',
  'pet-3': 'Kiwi',
}

const INITIAL_MEDICATIONS: MedRecord[] = [
  {
    id: 'm1', icon: '💊',
    title: 'Bravecto 🐱 Luna', dose: '1 comprimido', frequency: 'Cada 3 meses',
    startDate: '2026-01-10', endDate: '', notes: 'Antiparasitario oral.',
    bg: 'var(--warn-hl)', color: 'var(--warn)', badge: 'Activo', badgeCls: 'badge-green', archived: false,
  },
  {
    id: 'm2', icon: '🧴',
    title: 'Pipeta antipulgas 🐶 Toby', dose: '1 pipeta', frequency: 'Mensual',
    startDate: '2026-03-30', endDate: '', notes: 'Aplicar en la nuca.',
    bg: 'var(--blue-hl)', color: 'var(--blue)', badge: 'Esta semana', badgeCls: 'badge-yellow', archived: false,
  },
]

type MedicationsContextValue = {
  medications: MedRecord[]
  active: MedRecord[]
  history: MedRecord[]
  addMedication: (data: AddMedData) => MedRecord
  updateMedication: (updated: MedRecord) => void
  deleteMedication: (id: string) => void
  archiveMedication: (id: string) => void
  unarchiveMedication: (id: string) => void
  markMedicationAdministered: (med: MedRecord, date: string) => string
  getMedicationById: (id: string) => MedRecord | undefined
  getMedicationsByPetId: (petId: string) => MedRecord[]
  getActiveMedicationsByPetId: (petId: string) => MedRecord[]
}

const MedicationsContext = createContext<MedicationsContextValue | null>(null)

function inferPetIdFromMedication(med: MedRecord): string | undefined {
  if (med.title.includes('Luna')) return 'pet-1'
  if (med.title.includes('Toby')) return 'pet-2'
  if (med.title.includes('Kiwi')) return 'pet-3'
  return undefined
}

export function MedicationsProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<MedRecord[]>(INITIAL_MEDICATIONS)

  // Carregar medicamentos da API ao montar
  useEffect(() => {
    fetch('http://localhost:3001/api/medications')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Mapear formato da API para MedRecord
          const apiMeds: MedRecord[] = data.data.map((m: any) => ({
            id: m.id,
            icon: '💊',
            title: m.name,
            dose: m.dose,
            frequency: m.frequency,
            startDate: m.startDate ?? '',
            endDate: m.endDate ?? '',
            notes: m.notes ?? '',
            bg: 'var(--warn-hl)',
            color: 'var(--warn)',
            badge: 'Activo',
            badgeCls: 'badge-green',
            archived: false,
          }))
          setMedications(prev => [...prev, ...apiMeds])
        }
      })
      .catch(() => {}) // mantém dados locais se API falhar
  }, [])

  const active = useMemo(() => medications.filter((m) => !m.archived), [medications])
  const history = useMemo(() => medications.filter((m) => m.archived), [medications])

  const addMedication = useCallback((data: AddMedData) => {
    const petName = PET_NAME[data.petId] ?? 'Mascota'
    const petEmoji = PET_EMOJI[data.petId] ?? '🐾'
    const newMed: MedRecord = {
      id: `m-${Date.now()}`,
      icon: '💊',
      title: `${data.name} ${petEmoji} ${petName}`,
      dose: data.dose,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes,
      bg: 'var(--warn-hl)',
      color: 'var(--warn)',
      badge: 'Activo',
      badgeCls: 'badge-green',
      archived: false,
    }
    setMedications((prev) => [newMed, ...prev])
    return newMed
  }, [])

  const updateMedication = useCallback((updated: MedRecord) => {
    setMedications((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
  }, [])

  const deleteMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const archiveMedication = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, archived: true, badge: 'Terminado', badgeCls: 'badge-gray' } : m
      )
    )
  }, [])

  const unarchiveMedication = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, archived: false, badge: 'Activo', badgeCls: 'badge-green' } : m
      )
    )
  }, [])

  const markMedicationAdministered = useCallback((med: MedRecord, date: string) => {
    return new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }, [])

  const getMedicationById = useCallback(
    (id: string) => medications.find((m) => m.id === id),
    [medications]
  )

  const getMedicationsByPetId = useCallback(
    (petId: string) => medications.filter((m) => inferPetIdFromMedication(m) === petId),
    [medications]
  )

  const getActiveMedicationsByPetId = useCallback(
    (petId: string) => medications.filter((m) => !m.archived && inferPetIdFromMedication(m) === petId),
    [medications]
  )

  const value = useMemo(
    () => ({
      medications, active, history,
      addMedication, updateMedication, deleteMedication,
      archiveMedication, unarchiveMedication, markMedicationAdministered,
      getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId,
    }),
    [medications, active, history, addMedication, updateMedication, deleteMedication,
     archiveMedication, unarchiveMedication, markMedicationAdministered,
     getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId]
  )

  return (
    <MedicationsContext.Provider value={value}>
      {children}
    </MedicationsContext.Provider>
  )
}

export function useMedications() {
  const ctx = useContext(MedicationsContext)
  if (!ctx) throw new Error('useMedications must be used within MedicationsProvider')
  return ctx
}
</file>

<file path="src/context/PitutiContext.tsx">
import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { PetWithAlerts } from '../hooks/usePets'
import { MOCK_PETS } from '../hooks/usePets'

// ── Tipos ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark'

export interface CareEntry {
  id: string        // ex: "pet-1_food"
  petId: string
  emoji: string
  label: string
  total: number
  done: number
}

export interface PitutiState {
  // Mascotas
  pets: PetWithAlerts[]
  petsLoading: boolean
  // Tema
  theme: Theme
  // Alertas globais
  toastMessage: string
  toastType: 'success' | 'err'
  toastVisible: boolean
  // Cuidados do dia
  cares: CareEntry[]
}

// ── Acciones ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_PETS'; payload: PetWithAlerts[] }
  | { type: 'SET_PETS_LOADING'; payload: boolean }
  | { type: 'ADD_PET'; payload: PetWithAlerts }
  | { type: 'REMOVE_PET'; payload: string }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SHOW_TOAST'; payload: { message: string; kind: 'success' | 'err' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_CARE_DONE'; payload: { id: string; done: number } }
  | { type: 'SET_CARES'; payload: CareEntry[] }

// ── Estado inicial ────────────────────────────────────────────────────────────

const DEFAULT_CARES: CareEntry[] = [
  { id: 'pet-1_food',   petId: 'pet-1', emoji: '🍽️', label: 'Luna · comida',    total: 2, done: 0 },
  { id: 'pet-2_water',  petId: 'pet-2', emoji: '💧', label: 'Toby · agua',      total: 3, done: 2 },
  { id: 'pet-2_walk',   petId: 'pet-2', emoji: '🏃', label: 'Toby · paseo',     total: 2, done: 0 },
  { id: 'pet-3_water',  petId: 'pet-3', emoji: '💧', label: 'Kiwi · agua',      total: 2, done: 2 },
  { id: 'pet-1_brush',  petId: 'pet-1', emoji: '✂️', label: 'Luna · cepillado', total: 1, done: 0 },
  { id: 'pet-1_water',  petId: 'pet-1', emoji: '💧', label: 'Luna · agua',      total: 2, done: 1 },
]

const initialState: PitutiState = {
  pets: [],
  petsLoading: true,
  theme: (localStorage.getItem('pituti-theme') as Theme) ?? 'light',
  toastMessage: '',
  toastType: 'success',
  toastVisible: false,
  cares: DEFAULT_CARES,
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: PitutiState, action: Action): PitutiState {
  switch (action.type) {
    case 'SET_PETS':
      return { ...state, pets: action.payload }
    case 'SET_PETS_LOADING':
      return { ...state, petsLoading: action.payload }
    case 'ADD_PET':
      return { ...state, pets: [action.payload, ...state.pets] }
    case 'REMOVE_PET':
      return { ...state, pets: state.pets.filter(p => p.id !== action.payload) }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload.message, toastType: action.payload.kind, toastVisible: true }
    case 'HIDE_TOAST':
      return { ...state, toastVisible: false }
    case 'SET_CARE_DONE':
      return {
        ...state,
        cares: state.cares.map(c =>
          c.id === action.payload.id ? { ...c, done: action.payload.done } : c
        ),
      }
    case 'SET_CARES':
      return { ...state, cares: action.payload }
    default:
      return state
  }
}

// ── Contexto ──────────────────────────────────────────────────────────────────

interface PitutiContextValue {
  state: PitutiState
  // Mascotas
  addPet: (pet: PetWithAlerts) => void
  removePet: (id: string) => void
  // Tema
  toggleTheme: () => void
  // Toast
  showToast: (message: string, kind?: 'success' | 'err') => void
  hideToast: () => void
  // Cuidados
  setCaredone: (id: string, done: number) => void
}

const PitutiContext = createContext<PitutiContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function PitutiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

// NOVO — dados reais da API
useEffect(() => {
  dispatch({ type: 'SET_PETS_LOADING', payload: true })
  fetch('http://localhost:3001/api/pets')
    .then(r => r.json())
    .then(data => {
      dispatch({ type: 'SET_PETS', payload: data.data })
      dispatch({ type: 'SET_PETS_LOADING', payload: false })
    })
    .catch(() => {
      dispatch({ type: 'SET_PETS', payload: MOCK_PETS }) // fallback se API cair
      dispatch({ type: 'SET_PETS_LOADING', payload: false })
    })
}, [])

  // Sincronizar tema com DOM e localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('pituti-theme', state.theme)
  }, [state.theme])

  // Auto-ocultar toast após 3.2 s
  useEffect(() => {
    if (!state.toastVisible) return
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3200)
    return () => clearTimeout(t)
  }, [state.toastVisible, state.toastMessage])

  const addPet    = useCallback((pet: PetWithAlerts) => dispatch({ type: 'ADD_PET', payload: pet }), [])
  const removePet = useCallback((id: string) => dispatch({ type: 'REMOVE_PET', payload: id }), [])

  const toggleTheme = useCallback(() =>
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' }), [state.theme])

  const showToast = useCallback((message: string, kind: 'success' | 'err' = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, kind } })
  }, [])

  const setCaredone = useCallback((id: string, done: number) =>
    dispatch({ type: 'SET_CARE_DONE', payload: { id, done } }), [])

  const hideToast = useCallback(() => dispatch({ type: 'HIDE_TOAST' }), [])

  return (
    <PitutiContext.Provider value={{ state, addPet, removePet, toggleTheme, showToast, hideToast, setCaredone }}>
      {children}
    </PitutiContext.Provider>
  )
}

// ── Hook de consumo ───────────────────────────────────────────────────────────

export function usePituti() {
  const ctx = useContext(PitutiContext)
  if (!ctx) throw new Error('usePituti deve ser usado dentro de <PitutiProvider>')
  return ctx
}

// Atalhos convenientes
export const usePets       = () => { const { state } = usePituti(); return { pets: state.pets, loading: state.petsLoading } }
export const useTheme      = () => { const { state, toggleTheme } = usePituti(); return { theme: state.theme, toggleTheme } }
export const useCares      = () => { const { state, setCaredone } = usePituti(); return { cares: state.cares, setCaredone } }
export const useAppToast   = () => { const { showToast } = usePituti(); return showToast }
</file>

<file path="src/context/SymptomsContext.tsx">
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

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

  // Carregar sintomas da API ao montar
  useEffect(() => {
    fetch('http://localhost:3001/api/symptoms')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const apiSymptoms: SymptomEntry[] = data.data.map((s: any) => ({
            id: s.id,
            petId: s.petId,
            description: s.description,
            category: s.category ?? 'general',
            severity: s.severity ?? 'leve',
            date: s.date,
            notes: s.notes ?? '',
            resolved: s.resolved ?? false,
          }))
          setSymptoms(prev => [...prev, ...apiSymptoms])
        }
      })
      .catch(() => {}) // mantém dados locais se API falhar
  }, [])

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
</file>

<file path="src/context/VetContext.tsx">
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useEffect } from 'react'

const CONDITION_GROUPS = {
  endocrine: 'Endócrinas y Metabólicas',
  degenerative: 'Degenerativas y Estructurales',
  viral: 'Virales Incurables',
  neurological: 'Neurológicas y Autoinmunes',
  other: 'Otras Condiciones',
} as const

export interface ConditionItem {
  id: string
  label: string
  group: string
  species?: 'cat' | 'dog'
}

export const CONDITIONS_CATALOG: ConditionItem[] = [
  { id: 'diabetes', label: 'Diabetes Mellitus', group: CONDITION_GROUPS.endocrine },
  { id: 'hypothyroidism', label: 'Hipotiroidismo', group: CONDITION_GROUPS.endocrine, species: 'dog' },
  { id: 'hyperthyroidism', label: 'Hipertiroidismo', group: CONDITION_GROUPS.endocrine, species: 'cat' },
  { id: 'ckd', label: 'Insuficiencia Renal Crónica', group: CONDITION_GROUPS.degenerative },
  { id: 'arthritis', label: 'Artritis y Artrosis', group: CONDITION_GROUPS.degenerative },
  { id: 'hipdysplasia', label: 'Displasia de Cadera', group: CONDITION_GROUPS.degenerative },
  { id: 'cardiopathy', label: 'Cardiopatías Crónicas', group: CONDITION_GROUPS.degenerative },
  { id: 'felv', label: 'FeLV Leucemia Felina', group: CONDITION_GROUPS.viral, species: 'cat' },
  { id: 'fiv', label: 'FIV Inmunodeficiencia Felina', group: CONDITION_GROUPS.viral, species: 'cat' },
  { id: 'epilepsy', label: 'Epilepsia', group: CONDITION_GROUPS.neurological },
  { id: 'lupus', label: 'Lupus y Pénfigo', group: CONDITION_GROUPS.neurological },
  { id: 'atopy', label: 'Atopia y Alergias Crónicas', group: CONDITION_GROUPS.other },
  { id: 'blinddeaf', label: 'Ceguera o Sordera', group: CONDITION_GROUPS.other },
]

export interface Surgery {
  id: string
  name: string
  date?: string
  notes?: string
}

export interface PetMedicalProfile {
  petId: string
  sex?: 'male' | 'female'
  neutered?: boolean
  neuteredAge?: string
  bloodType?: string
  allergies?: string
  chronicConditionIds: string[]
  customConditions: string[]
  surgeries: Surgery[]
  behavioralNotes?: string
  environment?: 'apartment' | 'house' | 'both'
  livingWithAnimals?: boolean
  parasiteControl?: string
  vetQuestions?: string
  updatedAt?: string
}

export type VetType = 'primary' | 'specialist' | 'emergency' | 'other'

export interface VetContact {
  id: string
  name: string
  clinic: string
  type: VetType
  specialty?: string
  phone: string
  phone2?: string
  address?: string
  notes?: string
  petIds: string[]
  createdAt: string
}

export type AppointmentType =
  | 'routine'
  | 'emergency'
  | 'specialist'
  | 'followup'
  | 'exam'
  | 'vaccine'
  | 'other'

export interface VetAppointment {
  id: string
  petId: string
  vetContactId?: string
  vetName: string
  clinic?: string
  date: string
  time?: string
  type: AppointmentType
  reason: string
  diagnosis?: string
  treatment?: string
  nextAppointmentDate?: string
  nextAppointmentNote?: string
  weightKg?: number
  costBrl?: number
  notes?: string
  createdAt: string
}

export interface VetCalendarDate {
  date: string
  petId: string
  label: string
  kind: 'past' | 'next'
}

interface VetContextValue {
  getMedicalProfile: (petId: string) => PetMedicalProfile
  saveMedicalProfile: (profile: PetMedicalProfile) => void
  vets: VetContact[]
  addVet: (v: Omit<VetContact, 'id' | 'createdAt'>) => void
  updateVet: (v: VetContact) => void
  deleteVet: (id: string) => void
  appointments: VetAppointment[]
  addAppointment: (a: Omit<VetAppointment, 'id' | 'createdAt'>) => void
  updateAppointment: (a: VetAppointment) => void
  deleteAppointment: (id: string) => void
  vetCalendarDates: VetCalendarDate[]
}

const VetContext = createContext<VetContextValue | null>(null)

function buildDefaultProfile(petId: string): PetMedicalProfile {
  return {
    petId,
    chronicConditionIds: [],
    customConditions: [],
    surgeries: [],
  }
}

export function VetProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, PetMedicalProfile>>({})
  const [vets, setVets] = useState<VetContact[]>([])
  useEffect(() => {
  fetch('http://localhost:3001/api/vets')
    .then(r => r.json())
    .then(data => setVets(data.data))
    .catch(() => {}) // silencia erro se API estiver fora
}, [])
  const [appointments, setAppointments] = useState<VetAppointment[]>([])
  useEffect(() => {
  fetch('http://localhost:3001/api/appointments')
    .then(r => r.json())
    .then(data => setAppointments(data.data))
    .catch(() => {})
}, [])

  const getMedicalProfile = (petId: string) => profiles[petId] ?? buildDefaultProfile(petId)

  const saveMedicalProfile = (profile: PetMedicalProfile) => {
    setProfiles(prev => ({
      ...prev,
      [profile.petId]: {
        ...profile,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  const addVet = (data: Omit<VetContact, 'id' | 'createdAt'>) => {
    setVets(prev => [
      ...prev,
      { ...data, id: `vet-${Date.now()}`, createdAt: new Date().toISOString() },
    ])
  }

  const updateVet = (vet: VetContact) => {
    setVets(prev => prev.map(v => (v.id === vet.id ? vet : v)))
  }

  const deleteVet = (id: string) => {
    setVets(prev => prev.filter(v => v.id !== id))
  }

  const addAppointment = (data: Omit<VetAppointment, 'id' | 'createdAt'>) => {
    setAppointments(prev => [
      ...prev,
      { ...data, id: `apt-${Date.now()}`, createdAt: new Date().toISOString() },
    ])
  }

  const updateAppointment = (appointment: VetAppointment) => {
    setAppointments(prev => prev.map(a => (a.id === appointment.id ? appointment : a)))
  }

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  const vetCalendarDates = useMemo<VetCalendarDate[]>(() => {
    const result: VetCalendarDate[] = []

    for (const appt of appointments) {
      result.push({
        date: appt.date,
        petId: appt.petId,
        label: appt.reason,
        kind: 'past',
      })

      if (appt.nextAppointmentDate) {
        result.push({
          date: appt.nextAppointmentDate,
          petId: appt.petId,
          label: appt.nextAppointmentNote ?? 'Retorno programado',
          kind: 'next',
        })
      }
    }

    return result
  }, [appointments])

  return (
    <VetContext.Provider
      value={{
        getMedicalProfile,
        saveMedicalProfile,
        vets,
        addVet,
        updateVet,
        deleteVet,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        vetCalendarDates,
      }}
    >
      {children}
    </VetContext.Provider>
  )
}

export function useVet() {
  const ctx = useContext(VetContext)
  if (!ctx) throw new Error('useVet must be used inside VetProvider')
  return ctx
}
</file>

</files>
