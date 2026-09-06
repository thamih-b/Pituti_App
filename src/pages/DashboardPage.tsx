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
import { useVaccinesContext } from '../context/VaccinesContext'
import type { VaccineWithMeta } from '../context/VaccinesContext'
import AddPetModal from '../components/AddPetModal'

const PALETTE_COLORS = [
  'var(--pal-lilac)',
  'var(--pal-sky)',
  'var(--pal-candy)',
  'var(--pal-mauve)',
  'var(--pal-denim)',
] as const

interface GreetingText {
  saludo: string
  date: string
}

interface PawLayoutProps {
  pets: PetWithAlerts[]
  onPetClick: (id: string) => void
  onAddPet?: () => void
}

interface DashboardAlert {
  type: 'warn' | 'err'
  text: string
  petName: string
}

function useGreeting(): GreetingText {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState<GreetingText>({ saludo: '', date: '' })

  useEffect(() => {
    const now = new Date()
    const h = now.getHours()

    const saludo =
      h < 12
        ? t('dashboard.greeting_morning')
        : h < 19
          ? t('dashboard.greeting_afternoon')
          : t('dashboard.greeting_evening')

    const days = t('dates.weekdays', { returnObjects: true }) as string[]
    const months = t('dates.months', { returnObjects: true }) as string[]

    setText({
      saludo: `${saludo}, Thamiris!`,
      date: `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`,
    })
  }, [t, i18n.language])

  return text
}

const SLOT_CLASSES = [
  'paw-bubble paw-main',
  'paw-bubble paw-toe paw-toe-1',
  'paw-bubble paw-toe paw-toe-2',
  'paw-bubble paw-toe paw-toe-3',
  'paw-bubble paw-toe paw-toe-4',
]

function buildSlots(pets: PetWithAlerts[]) {
  return Array.from({ length: 5 }, (_, i) => ({
    pet: pets[i] ?? null,
    paletteColor: PALETTE_COLORS[i % PALETTE_COLORS.length],
  }))
}

function PawLayout({
  pets,
  onPetClick,
  onAddPet,
}: PawLayoutProps) {
  const { t } = useTranslation()

  const photos: Record<string, string> = {}

  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('pet-photo-'))
      .forEach((key) => {
        const value = localStorage.getItem(key)

        if (value) {
          photos[key.replace('pet-photo-', '')] = value
        }
      })
  } catch {}

  pets.forEach((pet) => {
    if ((pet as any).photoUrl) {
      photos[pet.id] = (pet as any).photoUrl
    }
  })

  if (!pets.length) {
    return (
      <div
        className="paw-layout"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="paw-empty">
          <div className="paw-empty-icon">🐾</div>
          <p>{t('dashboard.addFirstPet')}</p>
        </div>
      </div>
    )
  }

  const pawPets = pets.slice(0, 5)
  const extraPets = pets.slice(5)

  return (
    <>
      <div className="paw-layout">
        {buildSlots(pawPets).map((slot, i) => {
          const photo = slot.pet ? photos[slot.pet.id] || null : null
          const highestAlert = slot.pet?.alerts?.[0] ?? null
          const isEmpty = !slot.pet

          return (
            <div
              key={i}
              className={[
                SLOT_CLASSES[i],
                isEmpty ? 'paw-bubble-empty' : '',
              ].join(' ')}
              style={
                isEmpty
                  ? { cursor: onAddPet ? 'pointer' : 'default' }
                  : undefined
              }
              onClick={(event) => {
                event.stopPropagation()

                if (isEmpty) {
                  onAddPet?.()
                } else if (slot.pet?.id) {
                  onPetClick(slot.pet.id)
                }
              }}
            >
              {isEmpty ? (
                <div className="paw-plus-hint">＋</div>
              ) : (
                <div
                  className="paw-bubble-clip"
                  style={{
                    background: photo ? undefined : slot.paletteColor,
                    fontSize: i === 0 ? '3rem' : '1.4rem',
                  }}
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={slot.pet?.name ?? 'Pet'}
                      loading="lazy"
                    />
                  ) : (
                    <span>
                      {SPECIES_EMOJI[slot.pet?.species ?? 'other'] ?? '🐾'}
                    </span>
                  )}
                </div>
              )}

              {highestAlert && <div className="paw-dot warn" />}
              {slot.pet && (
                <div className="paw-pet-name">{slot.pet.name}</div>
              )}
            </div>
          )
        })}
      </div>

      {extraPets.length > 0 && (
        <div className="paw-extra-row">
          {extraPets.map((pet, idx) => {
            const photo = photos[pet.id] || null

            return (
              <div
                key={pet.id}
                className="paw-extra-bubble"
                onClick={() => onPetClick(pet.id)}
              >
                <div
                  className="paw-bubble-clip"
                  style={{
                    background: photo
                      ? undefined
                      : PALETTE_COLORS[
                          (idx + 5) % PALETTE_COLORS.length
                        ],
                    fontSize: '1.3rem',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                  }}
                >
                  {photo ? (
                    <img src={photo} alt={pet.name} loading="lazy" />
                  ) : (
                    <span>{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>
                  )}
                </div>

                {(pet.alerts ?? []).length > 0 && (
                  <div
                    className="paw-dot warn"
                    style={{ top: 2, right: 2 }}
                  />
                )}

                <div className="paw-pet-name">{pet.name}</div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

interface CareStripProps {
  emoji: string
  label: string
  total?: number
  doneInit?: number
  urgent?: boolean
  onDoneChange?: (done: number) => void
  onClick?: () => void
}

function CareStripItem({
  emoji,
  label,
  total = 1,
  doneInit = 0,
  urgent = false,
  onDoneChange,
  onClick,
}: CareStripProps) {
  const [doneCount, setDoneCount] = useState(doneInit)

  useEffect(() => {
    setDoneCount(doneInit)
  }, [doneInit])

  const allDone = doneCount >= total
  const cls = [
    'care-strip-item',
    allDone ? 'done' : urgent && doneCount === 0 ? 'urgent' : '',
  ].join(' ')

  const toggle = (i: number) => {
    setDoneCount((prev) => {
      const next =
        i === prev ? prev + 1 : i === prev - 1 ? prev - 1 : prev

      onDoneChange?.(next)

      return next
    })
  }

  return (
    <div
      className={cls}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <span className="care-emoji">{emoji}</span>
      <span className="care-label">{label}</span>

      <span className="care-dots" onClick={(event) => event.stopPropagation()}>
        {Array.from({ length: total }).map((_, i) => (
          <button
            type="button"
            key={i}
            className={[
              'care-dot-btn',
              i < doneCount ? 'filled' : '',
            ].join(' ')}
            onClick={() => toggle(i)}
          >
            {i < doneCount ? '✓' : '○'}
          </button>
        ))}
      </span>
    </div>
  )
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { state, addPet } = usePituti()
  const { pets = [], petsLoading: loading } = state

  const { saludo, date } = useGreeting()

  const today = new Date().toISOString().split('T')[0]
  const in60 = new Date(Date.now() + 60 * 86_400_000)
    .toISOString()
    .split('T')[0]

  const {
    allVaccines: allVaccinesRaw,
    loading: vaccinesLoading = loading,
  } = useVaccinesContext() as any

  const allVaccines = allVaccinesRaw ?? []

  const upcomingVaccines: VaccineWithMeta[] = allVaccines
    .filter((v: VaccineWithMeta) =>
      !!v?.nextDate && v.nextDate >= today && v.nextDate <= in60,
    )
    .sort((a: VaccineWithMeta, b: VaccineWithMeta) =>
      a.nextDate.localeCompare(b.nextDate),
    )
    .slice(0, 3)

  const {
    medications: medicationsRaw,
    loading: medsLoading = loading,
  } = useMedications() as any

  const medications = medicationsRaw ?? []
  const activeMeds = medications.filter((med: any) => !med.archived)

  const symptomsCtx = useSymptoms()
  const symptomsLoading = (symptomsCtx as any).loading ?? loading
  const symptomsList =
    (symptomsCtx as { symptoms?: SymptomEntry[] }).symptoms ?? []

  const activeSymptoms = symptomsList.filter((symptom) => !symptom.resolved)

  const allAlerts: DashboardAlert[] = pets.flatMap((pet) =>
    (pet.alerts ?? []).map((text: string) => ({
      type: 'warn',
      text,
      petName: pet.name,
    })),
  )

  const {
    items: careItems = [],
    setCareProgress,
    loading: caresLoading,
  } = useCares()

  const todayStr = today

  const dashCares = careItems
    .filter((care: CareItem) => isDueOnDate(care, todayStr))
    .slice(0, 6)

  const [detailItem, setDetailItem] = useState<CareDetailItem | null>(null)
  const [editCareItem, setEditCareItem] = useState<CareEditData | null>(null)
  const [editCareOpen, setEditCareOpen] = useState(false)
  const [symptomDetail, setSymptomDetail] = useState<SymptomEntry | null>(null)
  const [addPetOpen, setAddPetOpen] = useState(false)

  const handleCareToggle = useCallback(
    (id: string, newDone: number, newState: boolean) => {
      setCareProgress(id, todayStr, newDone, newState)
    },
    [setCareProgress, todayStr],
  )

  const openDetail = (care: CareItem) => {
    const prog = care.doneByDate?.[todayStr]
    const done = prog?.done ?? 0
    const doneState = prog?.doneState ?? false

    setDetailItem({
      id: care.id,
      petId: care.petId,
      emoji: care.emoji,
      title: care.title,
      sub: care.sub,
      total: care.total,
      done,
      done_state: doneState,
      bg: care.bg,
    })
  }

  const openCalendarAt = (dateStr: string) =>
    navigate('/vaccines', { state: { initialDate: dateStr } })

  return (
    <div className="dash-mockup-grid">
      <div className="dash-col-left">
        <div className="dash-greeting">
          <div className="greeting-name">{saludo}</div>
          <div className="greeting-date">{date}</div>
        </div>

        <div className="paw-wrapper">
          {loading ? (
            <div
              className="paw-layout"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-faint)',
                fontSize: '.875rem',
              }}
            >
              {t('btn.loading')}
            </div>
          ) : (
            <PawLayout
              pets={pets}
              onPetClick={(id) => navigate(`/pets/${id}`)}
              onAddPet={() => setAddPetOpen(true)}
            />
          )}

          {!loading && allAlerts.length === 0 && (
            <div className="paw-caption">{t('dashboard.allGood')}</div>
          )}
        </div>
      </div>

      <div className="dash-col-center">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '.75rem',
          }}
        >
          <div className="dash-section-label" style={{ marginBottom: 0 }}>
            {t('dashboard.todayCares')}
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/cares')}
          >
            {t('btn.seeAll')} →
          </button>
        </div>

        <div
          style={{
            fontSize: '.75rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            marginBottom: '.625rem',
          }}
        >
          {t('dates.today')} —{' '}
          <span style={{ color: 'var(--err)' }}>
            {
              dashCares.filter(
                (care: CareItem) =>
                  (care.doneByDate?.[todayStr]?.done ?? 0) < care.total,
              ).length
            }
          </span>
        </div>

        <div className="dash-care-col">
          {caresLoading ? (
            <div
              style={{
                color: 'var(--text-faint)',
                fontSize: '.875rem',
                textAlign: 'center',
                padding: '1.5rem 0',
              }}
            >
              {t('btn.loading')}
            </div>
          ) : dashCares.length === 0 ? (
            <div
              style={{
                color: 'var(--text-faint)',
                fontSize: '.875rem',
                textAlign: 'center',
                padding: '1.5rem 0',
              }}
            >
              {t('dashboard.noCaresToday', {
                defaultValue: 'Sem cuidados para hoje',
              })}
            </div>
          ) : (
            dashCares.map((care: CareItem) => (
              <CareStripItem
                key={care.id}
                emoji={care.emoji}
                label={care.title}
                total={care.total}
                doneInit={care.doneByDate?.[todayStr]?.done ?? 0}
                urgent={
                  (care.doneByDate?.[todayStr]?.done ?? 0) === 0 &&
                  care.intervalDays <= 1
                }
                onDoneChange={(done) =>
                  handleCareToggle(care.id, done, done >= care.total)
                }
                onClick={() => openDetail(care)}
              />
            ))
          )}
        </div>
      </div>

      <div className="dash-col-eventos">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '.75rem',
          }}
        >
          <div className="dash-section-label" style={{ marginBottom: 0 }}>
            {t('dashboard.upcomingEvents')}
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/vaccines')}
          >
            {t('btn.seeAll')} →
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.5rem',
          }}
        >
          {upcomingVaccines.length === 0 && (
            <div
              style={{
                color: 'var(--text-faint)',
                fontSize: '.875rem',
                textAlign: 'center',
                padding: '1.5rem 0',
              }}
            >
              {t('dashboard.noUpcoming')}
            </div>
          )}

          {upcomingVaccines.map((vaccine, i) => {
            if (!vaccine.nextDate) return null

            const due = new Date(`${vaccine.nextDate}T00:00:00`)
            const daysLeft = Math.round(
              (due.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000,
            )
            const urgent = daysLeft <= 7
            const day = String(due.getDate()).padStart(2, '0')
            const mon = due
              .toLocaleDateString(i18n.language, { month: 'short' })
              .toUpperCase()

            return (
              <div
                key={vaccine.id ?? `${vaccine.name}-${vaccine.petId}-${i}`}
                className={`event-row${urgent ? ' event-urgent' : ''}`}
                onClick={() => openCalendarAt(vaccine.nextDate!)}
              >
                <div className="event-date-badge">
                  <div className="edb-day">{day}</div>
                  <div className="edb-mon">{mon}</div>
                </div>

                <div
                  className="event-icon"
                  style={{
                    background: urgent ? 'var(--err-hl)' : 'var(--warn-hl)',
                    color: urgent ? 'var(--err)' : 'var(--warn)',
                  }}
                >
                  💉
                </div>

                <div className="event-info">
                  <div className="event-title">
                    {vaccine.name} — {vaccine.petEmoji} {vaccine.petName}
                  </div>

                  <div className="event-sub">
                    {daysLeft === 0
                      ? t('dates.today')
                      : t('dashboard.inDays', { n: daysLeft })}
                  </div>
                </div>

                <span
                  className={`badge ${
                    urgent ? 'badge-red' : 'badge-yellow'
                  }`}
                >
                  {urgent ? t('vaccines.expiringSoon') : `${daysLeft}d`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="dash-col-right">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '.75rem',
          }}
        >
          <div className="dash-section-label" style={{ marginBottom: 0 }}>
            {t('dashboard.alerts')}
          </div>
        </div>

        <div className="dash-kpi-col">
          {[
            {
              val: loading ? '…' : pets.length,
              label: t('nav.pets'),
              sub: null,
              color: '',
              to: '/pets',
            },
            {
              val: vaccinesLoading ? '…' : allVaccines.length,
              label: t('nav.vaccines'),
              sub:
                upcomingVaccines.length > 0
                  ? `⚠ ${upcomingVaccines.length} ${t(
                      'vaccines.expiringSoon',
                    )}`
                  : null,
              color: 'var(--warn)',
              to: '/vaccines',
            },
            {
              val: medsLoading ? '…' : activeMeds.length,
              label: t('nav.medications'),
              sub:
                activeMeds.length > 0 ? `● ${t('status.active')}` : null,
              color: 'var(--success)',
              to: '/medications',
            },
            {
              val: symptomsLoading ? '…' : activeSymptoms.length,
              label: t('nav.symptoms'),
              sub: activeSymptoms[0]
                ? `● ${
                    pets.find(
                      (pet) => pet.id === activeSymptoms[0].petId,
                    )?.name ?? ''
                  }`
                : null,
              color: 'var(--err)',
              to: '/symptoms',
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="paw-kpi"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                kpi.to === '/symptoms' && activeSymptoms[0]
                  ? setSymptomDetail(activeSymptoms[0])
                  : navigate(kpi.to)
              }
            >
              <div className="paw-kpi-value">{kpi.val}</div>
              <div className="paw-kpi-label">{kpi.label}</div>

              {kpi.sub && (
                <div className="paw-kpi-sub" style={{ color: kpi.color }}>
                  {kpi.sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {allAlerts.length > 0 && (
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '.5rem',
            }}
          >
            {allAlerts.map((alert, i) => (
              <div
                key={i}
                className={`paw-alert ${alert.type}`}
                style={{
                  cursor:
                    alert.type === 'err' && activeSymptoms[0]
                      ? 'pointer'
                      : undefined,
                }}
                onClick={() =>
                  alert.type === 'err' && activeSymptoms[0]
                    ? setSymptomDetail(activeSymptoms[0])
                    : undefined
                }
              >
                <span className="paw-alert-icon">
                  {alert.type === 'warn' ? '⚠️' : '🔴'}
                </span>

                <span className="paw-alert-text">
                  <strong>{alert.petName} </strong>
                  {alert.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="paw-caption" style={{ marginTop: '1rem' }}>
            {t('btn.loading')}
          </div>
        ) : allAlerts.length === 0 ? (
          <div className="paw-caption" style={{ marginTop: '1rem' }}>
            {t('dashboard.noAlerts')}
          </div>
        ) : null}
      </div>

      {detailItem && (
        <CareDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggle={(id, newDone, newState) => {
            handleCareToggle(id, newDone, newState)

            setDetailItem((prev) =>
              prev
                ? {
                    ...prev,
                    done: newDone,
                    done_state: newState,
                  }
                : null,
            )
          }}
          onEdit={(item) => {
            setEditCareItem({
              id: item.id,
              emoji: item.emoji,
              title: item.title,
              total: item.total,
              period: 'day',
              quantity: '',
              notify: true,
              bg: item.bg,
            })

            setEditCareOpen(true)
          }}
        />
      )}

      <EditCareModal
        isOpen={editCareOpen}
        onClose={() => setEditCareOpen(false)}
        care={editCareItem}
        onSave={() => setEditCareOpen(false)}
        onDelete={() => setEditCareOpen(false)}
      />

      <SymptomDetailModal
        symptom={symptomDetail}
        onClose={() => setSymptomDetail(null)}
        onEdit={() => {
          setSymptomDetail(null)
          navigate('/symptoms')
        }}
        onResolve={() => {
          setSymptomDetail(null)

          import('../components/AppLayout').then((module) =>
            module.showToast(t('toast.symptomResolved')),
          )
        }}
        onUnresolve={() => setSymptomDetail(null)}
      />

      <AddPetModal
        isOpen={addPetOpen}
        onClose={() => setAddPetOpen(false)}
        onAdd={(pet) => {
          addPet(pet)
          setAddPetOpen(false)
        }}
      />
    </div>
  )
}