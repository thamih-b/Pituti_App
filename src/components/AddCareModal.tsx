import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface AddCareData {
  petId: string
  emoji: string
  title: string
  total: number
  recurrenceType: 'daily' | 'everyXDays' | 'everyXHours'
  recurrenceValue: number
  quantity: string
  notify: boolean
  period?: string
  intervalDays?: number
  time?: string
  recurring?: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: AddCareData) => void
  defaultPetId?: string
}

// ── Constantes ────────────────────────────────────────────────────────────────

const CARE_EMOJIS = [
  '🍽️', '💧', '🪮', '🦮', '🏃', '🛁', '💊', '💉', '🧴', '🪥',
  '🐾', '🌿', '🪺', '🐟', '🐇', '🐦', '🧸', '🩺', '⏰', '📅',
]

const PET_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  bird: '🐦',
  rabbit: '🐰',
  reptile: '🦎',
  fish: '🐠',
  other: '🐾',
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}
    >
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function AddCareModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t } = useTranslation()
  const { pets } = usePetsContext()

  const RECURRENCE_OPTS = [
    { val: 'daily' as const, icon: '📅', label: t('cares.add.recDaily') },
    { val: 'everyXDays' as const, icon: '🗓️', label: t('cares.add.recXDays') },
    { val: 'everyXHours' as const, icon: '⏰', label: t('cares.add.recXHours') },
  ]

  const [petId, setPetId] = useState('')
  const [emoji, setEmoji] = useState('')
  const [title, setTitle] = useState('')
  const [total, setTotal] = useState(1)
  const [recType, setRecType] = useState<'daily' | 'everyXDays' | 'everyXHours'>('daily')
  const [recValue, setRecValue] = useState(1)
  const [quantity, setQuantity] = useState('')
  const [notify, setNotify] = useState(true)
  const [titleErr, setTitleErr] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const defaultPetExists =
      defaultPetId && pets.some((p) => p.id === defaultPetId)

    const initialPetId = defaultPetExists
      ? defaultPetId
      : (pets[0]?.id ?? '')

    setPetId(initialPetId)
  }, [isOpen, defaultPetId, pets])

  useEffect(() => {
    if (!isOpen) return

    if (!pets.length) {
      setPetId('')
      return
    }

    if (petId && !pets.some((p) => p.id === petId)) {
      setPetId(pets[0]?.id ?? '')
    }
  }, [pets, petId, isOpen])

  const reset = () => {
    setTitle('')
    setQuantity('')
    setTitleErr('')
    setEmoji('')
    setTotal(1)
    setRecType('daily')
    setRecValue(1)
    setNotify(true)
  }

  const handleClose = () => {
    reset()
    setSuccess(false)
    onClose()
  }

  const handleSubmit = () => {
    if (!pets.length) {
      console.error('No pets available')
      return
    }

    if (!petId) {
      console.error('Pet not selected')
      return
    }

    if (!title.trim()) {
      setTitleErr(t('cares.add.errTitle'))
      return
    }

    const pet = pets.find((p) => p.id === petId)
    if (!pet) {
      console.error('Pet not found')
      return
    }

    const rv = Math.max(1, Number(recValue) || 1)
    const intervalDays =
      recType === 'daily'
        ? 1
        : recType === 'everyXDays'
          ? rv
          : rv / 24

    setSuccess(true)

    setTimeout(() => {
      onAdd({
        petId: pet.id,
        emoji,
        title: title.trim(),
        total: Math.max(1, Number(total) || 1),
        recurrenceType: recType,
        recurrenceValue: rv,
        quantity,
        notify,
        period: recType === 'daily' ? 'day' : 'custom',
        intervalDays,
      })

      showToast(`${emoji} ${t('cares.add.toast', { title: title.trim() })}`)
      reset()
      setSuccess(false)
      onClose()
    }, 1100)
  }

  const selectedPet = pets.find((p) => p.id === petId) ?? null

  const pillStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '.35rem',
    padding: '.5rem .875rem',
    borderRadius: 'var(--r-full)',
    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background: active ? 'var(--primary-hl)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: active ? 700 : 500,
    fontSize: '.8125rem',
    cursor: 'pointer',
    transition: 'all var(--trans)',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  })

  if (!pets.length) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title=""
        icon="🐾"
        accentBg="var(--success-hl)"
        accentFg="var(--success)"
        footer={
          <PfFooter>
            <PfBtn variant="cancel" onClick={handleClose}>
              {t('btn.close')}
            </PfBtn>
          </PfFooter>
        }
      >
        <div
          className="modal-success"
          style={{ paddingTop: '1.5rem', paddingBottom: '1rem' }}
        >
          <div className="modal-success-icon">🐾</div>
          <div className="modal-success-title">{t('pets.noPets')}</div>
          <div className="modal-success-sub">{t('vet.noPetsHint')}</div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon="🐾"
      accentBg="var(--success-hl)"
      accentFg="var(--success)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>
            {t('cares.add.submitBtn')}
          </PfBtn>
        </PfFooter>
      ) : undefined}
    >
      <div
        className="modal-hero"
        style={{ background: 'linear-gradient(135deg,var(--success-hl),var(--surface))' }}
      >
        <div className="modal-hero-icon" style={{ background: 'var(--success)', fontSize: '1.5rem' }}>
          {emoji || '🐾'}
        </div>
        <div style={{ flex: 1 }}>
          <div className="modal-hero-title">{t('cares.add.heroTitle')}</div>
          <div className="modal-hero-sub">
            {t('cares.add.heroSub')} <strong>{selectedPet?.name ?? '—'}</strong>
          </div>
        </div>
        <button className="pm-close" onClick={handleClose} aria-label={t('modal.close')}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✅</div>
          <div className="modal-success-title">{t('cares.add.successTitle')}</div>
          <div className="modal-success-sub">
            {emoji} <strong>{title}</strong> {t('cares.add.successSub')}
          </div>
        </div>
      ) : (
        <>
          <div className="modal-section">{t('cares.add.sectionPet')}</div>
          <div
            className="mf-species-grid"
            style={{ gridTemplateColumns: `repeat(${pets.length},1fr)`, marginBottom: '1rem' }}
          >
            {pets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={['mf-species-card', petId === p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}
              >
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="modal-section">{t('cares.add.sectionCare')}</div>
          <div className="form-group">
            <label className="form-label">{t('cares.add.labelIcon')}</label>
            <div className="emoji-picker-grid">
              {CARE_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={['emoji-pick-btn', emoji === e ? 'active' : ''].join(' ')}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('field.name')}</label>
            <div className="field-icon-wrap">
              <span className="field-icon" style={{ fontSize: '1rem' }}>
                {emoji || '🐾'}
              </span>
              <input
                className={['form-input', titleErr ? 'form-input--err' : ''].join(' ')}
                placeholder={t('cares.add.namePh')}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setTitleErr('')
                }}
                autoFocus
              />
            </div>
            {titleErr && <span className="form-hint-err">{titleErr}</span>}
          </div>

          <div className="modal-section">{t('cares.add.sectionRecurrence')}</div>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.875rem' }}>
            {RECURRENCE_OPTS.map((opt) => (
              <button
                key={opt.val}
                type="button"
                style={pillStyle(recType === opt.val)}
                onClick={() => setRecType(opt.val)}
              >
                <span style={{ fontSize: '.95rem' }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {(recType === 'everyXDays' || recType === 'everyXHours') && (
            <div className="form-group" style={{ marginBottom: '.875rem' }}>
              <label className="form-label">
                {recType === 'everyXDays'
                  ? t('cares.add.intervalDays')
                  : t('cares.add.intervalHours')}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={recType === 'everyXHours' ? 168 : 365}
                  value={recValue}
                  onChange={(e) => setRecValue(Math.max(1, Number(e.target.value) || 1))}
                  style={{ width: 90, textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '.875rem', fontWeight: 600 }}>
                  {recType === 'everyXDays'
                    ? t('cares.add.unitDays')
                    : t('cares.add.unitHours')}
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '.75rem',
                    color: 'var(--success)',
                    background: 'var(--success-hl)',
                    padding: '.2rem .5rem',
                    borderRadius: 'var(--r-full)',
                    fontWeight: 700,
                  }}
                >
                  {recType === 'everyXDays'
                    ? t('cares.add.previewDays', { count: recValue })
                    : t('cares.add.previewHours', { count: recValue })}
                </span>
              </div>
            </div>
          )}

          {recType === 'daily' && (
            <div className="form-group" style={{ marginBottom: '.875rem' }}>
              <label className="form-label">{t('cares.add.timesPerDay')}</label>
              <input
                className="form-input"
                type="number"
                min={1}
                max={10}
                value={total}
                onChange={(e) => setTotal(Math.max(1, Number(e.target.value) || 1))}
                style={{ maxWidth: 90 }}
              />
            </div>
          )}

          <div className="form-group" style={{ marginTop: '.25rem' }}>
            <label className="form-label">
              {t('cares.add.labelQuantity')}{' '}
              <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>
                {t('btn.optional')}
              </span>
            </label>
            <div className="field-icon-wrap">
              <span className="field-icon">⚖️</span>
              <input
                className="form-input"
                placeholder={t('cares.add.quantityPh')}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-section">{t('cares.add.sectionPrefs')}</div>
          <div className="toggle-row">
            <div className="toggle-row-info">
              <div className="toggle-row-label">{t('cares.add.notifyLabel')}</div>
              <div className="toggle-row-sub">{t('cares.add.notifySub')}</div>
            </div>
            <Toggle on={notify} onChange={setNotify} />
          </div>
        </>
      )}
    </Modal>
  )
}