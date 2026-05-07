// Página principal do dashboard — sem mock, dados via contexto real

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { usePituti } from '../context/PitutiContext'
import { useCares, isDueOnDate, type CareItem } from '../context/CaresContext'
import CareDetailModal from '../components/CareDetailModal'
import type { CareDetailItem } from '../components/CareDetailModal'
import EditCareModal from '../components/EditCareModal'
import type { CareEditData } from '../components/EditCareModal'
import { SymptomDetailModal } from '../components/SymptomModals'
import type { SymptomEntry } from '../components/SymptomModals'
import { useSymptoms } from '../context/SymptomsContext'
import { useMedications } from '../context/MedicationsContext'
import { useVaccines } from '../context/VaccinesContext'
import type { VaccineWithMeta } from '../context/VaccinesContext'

const PALETTE_COLORS = [
  'var(--pal-lilac)',
  'var(--pal-sky)',
  'var(--pal-candy)',
  'var(--pal-mauve)',
  'var(--pal-denim)',
]

// ── Greeting hook ──────────────────────────────────────────────────────────
function useGreeting() {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState({ saludo: '', date: '' })

  useEffect(() => {
    const now = new Date()
    const h   = now.getHours()

    const saludo =
      h < 12 ? t('dashboard.greeting_morning')
    : h < 19 ? t('dashboard.greeting_afternoon')
    :           t('dashboard.greeting_evening')

    const days   = t('dates.weekdays', { returnObjects: true }) as string[]
    const months = t('dates.months',   { returnObjects: true }) as string[]

    setText({
      saludo: `${saludo}, Thamiris!`,
      date:   `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`,
    })
  }, [t, i18n.language])

  return text
}

// ── Paw layout ─────────────────────────────────────────────────────────────
const SLOT_CLASSES = [
  'paw-bubble paw-main',
  'paw-bubble paw-toe paw-toe-1',
  'paw-bubble paw-toe paw-toe-2',
  'paw-bubble paw-toe paw-toe-3',
  'paw-bubble paw-toe paw-toe-4',
]

function buildSlots(pets: PetWithAlerts[]) {
  return Array.from({ length: 5 }, (_, i) => {
    const pet = pets.length === 1 && i > 0 ? null : (pets[i] ?? null)
    return {
      pet:          pets.length === 1 ? (i === 0 ? pets[0] : null) : pet,
      paletteColor: PALETTE_COLORS[i % PALETTE_COLORS.length],
    }
  })
}

function PawLayout({ pets, onPetClick }: { pets: PetWithAlerts[]; onPetClick: (id: string) => void }) {
  const { t } = useTranslation()

  const photos: Record<string, string> = {}
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith('pet-photo-'))
      .forEach(k => { photos[k.replace('pet-photo-', '')] = localStorage.getItem(k)! })
  } catch {}

  if (!pets.length) return (
    <div className="paw-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="paw-empty">
        <div className="paw-empty-icon">🐾</div>
        <p>{t('dashboard.addFirstPet')}</p>
      </div>
    </div>
  )

  return (
    <div className="paw-layout">
      {buildSlots(pets).map((slot, i) => {
        const photo        = slot.pet ? (photos[slot.pet.id] || null) : null
        const highestAlert = slot.pet?.alerts?.[0] ?? null
        return (
          <div
            key={i}
            className={SLOT_CLASSES[i]}
            style={!slot.pet ? { cursor: 'default' } : undefined}
            onClick={slot.pet ? () => onPetClick(slot.pet!.id) : undefined}
          >
            <div
              className="paw-bubble-clip"
              style={{ background: photo ? undefined : slot.paletteColor, fontSize: i === 0 ? '3rem' : '1.4rem' }}
            >
              {photo
                ? <img src={photo} alt={slot.pet?.name} loading="lazy" />
                : <span>{slot.pet ? SPECIES_EMOJI[slot.pet.species] ?? '🐾' : ''}</span>}
            </div>
            {highestAlert && <div className="paw-dot warn" />}
            {slot.pet && <div className="paw-pet-name">{slot.pet.name}</div>}
          </div>
        )
      })}
    </div>
  )
}

// ── Care strip ─────────────────────────────────────────────────────────────
interface CareStripProps {
  emoji: string; label: string; total?: number; doneInit?: number
  urgent?: boolean; onDoneChange?: (d: number) => void; onClick?: () => void
}

function CareStripItem({ emoji, label, total = 1, doneInit = 0, urgent = false, onDoneChange, onClick }: CareStripProps) {
  const [doneCount, setDoneCount] = useState(doneInit)
  const allDone = doneCount >= total
  const cls     = ['care-strip-item', allDone ? 'done' : urgent && doneCount === 0 ? 'urgent' : ''].join(' ')
  const toggle  = (i: number) => {
    setDoneCount(prev => {
      const next = i === prev ? prev + 1 : i === prev - 1 ? prev - 1 : prev
      onDoneChange?.(next)
      return next
    })
  }
  return (
    <div className={cls} onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <span className="care-emoji">{emoji}</span>
      <span className="care-label">{label}</span>
      <span className="care-dots" onClick={e => e.stopPropagation()}>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} className={['care-dot-btn', i < doneCount ? 'filled' : ''].join(' ')} onClick={() => toggle(i)}>
            {i < doneCount ? '✓' : '○'}
          </button>
        ))}
      </span>
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate          = useNavigate()
  const { state }         = usePituti()
  const { pets, loading } = { pets: state.pets as PetWithAlerts[], loading: state.petsLoading }
  const { t, i18n }       = useTranslation()
  const { saludo, date }  = useGreeting()

  // Sintomas reais
  const { symptoms }    = useSymptoms()
  const activeSymptoms  = symptoms.filter(s => !s.resolved)

  // Vacinas reais — próximas 60 dias
  const today = new Date().toISOString().split('T')[0]
  const in60  = new Date(Date.now() + 60 * 86_400_000).toISOString().split('T')[0]

  const { allVaccines } = useVaccines()
  // ← era `vaccines` (inexistente) — correcto é `allVaccines`
  const upcomingVaccines: VaccineWithMeta[] = allVaccines
    .filter(v => v.nextDate && v.nextDate >= today && v.nextDate <= in60)
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
    .slice(0, 3)

  // Medicamentos reais
  const { medications } = useMedications()
  const activeMeds      = medications.filter(m => !m.archived)

  const allAlerts = pets.flatMap(p =>
    (p.alerts ?? []).map((text: string) => ({
      type:    'warn' as 'warn' | 'err',
      text,
      petName: p.name,
    }))
  )

  // Cuidados de hoje
  const { items: careItems, setCareProgress } = useCares()
  const todayStr  = today
  const dashCares = careItems
    .filter((c: CareItem) => isDueOnDate(c, todayStr))
    .slice(0, 6)

  const [detailItem,    setDetailItem]    = useState<CareDetailItem | null>(null)
  const [editCareItem,  setEditCareItem]  = useState<CareEditData | null>(null)
  const [editCareOpen,  setEditCareOpen]  = useState(false)
  const [symptomDetail, setSymptomDetail] = useState<SymptomEntry | null>(null)

  const handleCareToggle = useCallback((id: string, newDone: number, newState: boolean) => {
    setCareProgress(id, todayStr, newDone, newState)
  }, [setCareProgress, todayStr])

  const openDetail = (c: CareItem) => {
    const prog      = c.doneByDate?.[todayStr]
    const done      = prog?.done      ?? 0
    const doneState = prog?.doneState ?? false
    setDetailItem({
      id: c.id, petId: c.petId, emoji: c.emoji,
      title: c.title, sub: c.sub,
      total: c.total, done, done_state: doneState, bg: c.bg,
    })
  }

  const openCalendarAt = (dateStr: string) =>
    navigate('/vaccines', { state: { initialDate: dateStr } })

  return (
    <div className="dash-mockup-grid">

      {/* ── Left: greeting + paw ── */}
      <div className="dash-col-left">
        <div className="dash-greeting">
          <div className="greeting-name">{saludo}</div>
          <div className="greeting-date">{date}</div>
        </div>
        <div className="paw-wrapper">
          {loading
            ? <div className="paw-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '.875rem' }}>
                {t('btn.loading')}
              </div>
            : <PawLayout pets={pets} onPetClick={id => navigate(`/pets/${id}`)} />
          }
          {allAlerts.length === 0 && <div className="paw-caption">{t('dashboard.allGood')}</div>}
        </div>
      </div>

      {/* ── Centre: today's cares ── */}
      <div className="dash-col-center">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>{t('dashboard.todayCares')}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cares')}>{t('btn.seeAll')} →</button>
        </div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '.625rem' }}>
          {t('dates.today')} —{' '}
          <span style={{ color: 'var(--err)' }}>
            {dashCares.filter((c: CareItem) => (c.doneByDate?.[todayStr]?.done ?? 0) < c.total).length}
          </span>
        </div>
        <div className="dash-care-col">
          {dashCares.length === 0 && (
            <div style={{ color: 'var(--text-faint)', fontSize: '.875rem', textAlign: 'center', padding: '1.5rem 0' }}>
              {t('pets.noPets')}
            </div>
          )}
          {dashCares.map((c: CareItem) => {
            const prog      = c.doneByDate?.[todayStr]
            const done      = prog?.done      ?? 0
            const doneState = prog?.doneState ?? false
            return (
              <CareStripItem
                key={c.id}
                emoji={c.emoji}
                label={c.title}
                total={c.total}
                doneInit={done}
                urgent={done === 0 && c.intervalDays <= 1}
                onDoneChange={d => handleCareToggle(c.id, d, d >= c.total)}
                onClick={() => openDetail(c)}
              />
            )
          })}
        </div>
      </div>

      {/* ── Upcoming events ── */}
      <div className="dash-col-eventos">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>{t('dashboard.upcomingEvents')}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vaccines')}>{t('btn.seeAll')} →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {upcomingVaccines.length === 0 && (
            <div style={{ color: 'var(--text-faint)', fontSize: '.875rem', textAlign: 'center', padding: '1.5rem 0' }}>
              {t('dashboard.noUpcoming')}
            </div>
          )}
          {upcomingVaccines.map((v, i) => {
            const due      = new Date(v.nextDate + 'T00:00:00')
            const daysLeft = Math.round((due.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000)
            const urgent   = daysLeft <= 7
            const day      = String(due.getDate()).padStart(2, '0')
            const mon      = due.toLocaleDateString(i18n.language, { month: 'short' }).toUpperCase()
            return (
              <div
                key={v.name + v.petId + i}
                className={`event-row${urgent ? ' event-urgent' : ''}`}
                onClick={() => openCalendarAt(v.nextDate)}
              >
                <div className="event-date-badge">
                  <div className="edb-day">{day}</div>
                  <div className="edb-mon">{mon}</div>
                </div>
                <div className="event-icon" style={{ background: urgent ? 'var(--err-hl)' : 'var(--warn-hl)', color: urgent ? 'var(--err)' : 'var(--warn)' }}>
                  💉
                </div>
                <div className="event-info">
                  <div className="event-title">{v.name} — {v.petEmoji} {v.petName}</div>
                  <div className="event-sub">
                    {daysLeft === 0 ? t('dates.today') : t('dashboard.inDays', { n: daysLeft })}
                  </div>
                </div>
                <span className={`badge ${urgent ? 'badge-red' : 'badge-yellow'}`}>
                  {urgent ? t('vaccines.expiringSoon') : `${daysLeft}d`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Right: alerts + KPIs ── */}
      <div className="dash-col-right">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>{t('dashboard.alerts')}</div>
        </div>
        <div className="dash-kpi-col">
          {[
            { val: pets.length,           label: t('nav.pets'),        sub: null,                                                                                                                            color: '',                to: '/pets'        },
            { val: allVaccines.length,    label: t('nav.vaccines'),    sub: upcomingVaccines.length > 0 ? `⚠ ${upcomingVaccines.length} ${t('vaccines.expiringSoon')}` : null,                              color: 'var(--warn)',     to: '/vaccines'    },
            { val: activeMeds.length,     label: t('nav.medications'), sub: activeMeds.length > 0      ? `● ${t('status.active')}` : null,                                                                 color: 'var(--success)', to: '/medications' },
            { val: activeSymptoms.length, label: t('nav.symptoms'),    sub: activeSymptoms[0]           ? `● ${pets.find(p => p.id === activeSymptoms[0].petId)?.name ?? ''}` : null,                      color: 'var(--err)',      to: '/symptoms'    },
          ].map(k => (
            <div
              key={k.label}
              className="paw-kpi"
              style={{ cursor: 'pointer' }}
              onClick={() => k.to === '/symptoms' && activeSymptoms[0]
                ? setSymptomDetail(activeSymptoms[0])
                : navigate(k.to)
              }
            >
              <div className="paw-kpi-value">{k.val}</div>
              <div className="paw-kpi-label">{k.label}</div>
              {k.sub && <div className="paw-kpi-sub" style={{ color: k.color }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {allAlerts.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {allAlerts.map((a, i) => (
              <div
                key={i}
                className={`paw-alert ${a.type}`}
                style={{ cursor: a.type === 'err' && activeSymptoms[0] ? 'pointer' : undefined }}
                onClick={() => a.type === 'err' && activeSymptoms[0] ? setSymptomDetail(activeSymptoms[0]) : undefined}
              >
                <span className="paw-alert-icon">{a.type === 'warn' ? '⚠️' : '🔴'}</span>
                <span className="paw-alert-text"><strong>{a.petName} </strong>{a.text}</span>
              </div>
            ))}
          </div>
        )}

        {allAlerts.length === 0 && (
          <div className="paw-caption" style={{ marginTop: '1rem' }}>
            {t('dashboard.noAlerts')}
          </div>
        )}
      </div>

      {/* Care detail overlay */}
      {detailItem && (
        <CareDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggle={(id, newDone, newState) => {
            handleCareToggle(id, newDone, newState)
            setDetailItem(prev => prev ? { ...prev, done: newDone, done_state: newState } : null)
          }}
          onEdit={item => {
            setEditCareItem({
              id: item.id, emoji: item.emoji, title: item.title,
              total: item.total, period: 'day', quantity: '',
              notify: true, bg: item.bg,
            })
            setEditCareOpen(true)
          }}
        />
      )}

      <EditCareModal
        isOpen={editCareOpen}
        onClose={() => setEditCareOpen(false)}
        care={editCareItem}
        onSave={u => { setEditCareOpen(false) }}
        onDelete={() => setEditCareOpen(false)}
      />

      <SymptomDetailModal
        symptom={symptomDetail}
        onClose={() => setSymptomDetail(null)}
        onEdit={() => { setSymptomDetail(null); navigate('/symptoms') }}
        onResolve={() => {
          setSymptomDetail(null)
          import('../components/AppLayout').then(m => m.showToast(t('toast.symptomResolved')))
        }}
        onUnresolve={() => setSymptomDetail(null)}
      />
    </div>
  )
}