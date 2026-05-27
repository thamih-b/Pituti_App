import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface AddMedData {
  petId: string
  petSpecies: string
  name: string
  dose: string
  frequency: string
  startDate: string
  endDate: string
  notes: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (d: AddMedData) => void
  defaultPetId?: string
}

const PET_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  bird: '🦜',
  rabbit: '🐰',
  reptile: '🦎',
  fish: '🐟',
  other: '🐾',
}

const MED_ICONS = ['💊', '💉', '🩹', '🧪', '🫙', '🌡️', '🩺']

export default function AddMedicationModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t } = useTranslation()
  const { pets } = usePetsContext()

  const FREQ_OPTIONS = [
    { val: 'daily', label: t('pet.cares.periodDay') },
    { val: 'every12h', label: `${t('cares.add.recXHours')} (12h)` },
    { val: 'every8h', label: `${t('cares.add.recXHours')} (8h)` },
    { val: 'weekly', label: t('pet.cares.periodWeek') },
    { val: 'biweekly', label: t('medications.freq.biweekly') },
    { val: 'monthly', label: t('medications.freq.monthly') },
    { val: 'every3m', label: t('medications.freq.every3m') },
    { val: 'single', label: t('medications.freq.single') },
  ]

  const today = new Date().toISOString().split('T')[0]

  const [petId, setPetId] = useState('')
  const [medIcon, setMedIcon] = useState('💊')
  const [name, setName] = useState('')
  const [dose, setDose] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
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
    if (!isOpen) {
      setPetId('')
      setMedIcon('💊')
      setName('')
      setDose('')
      setFrequency('daily')
      setStartDate(today)
      setEndDate('')
      setNotes('')
      setErrors({})
      setSuccess(false)
      return
    }

    if (!pets.length) {
      setPetId('')
      return
    }

    if (petId && !pets.some((p) => p.id === petId)) {
      setPetId(pets[0]?.id ?? '')
    }
  }, [isOpen, pets, petId, today])

  const reset = () => {
    setName('')
    setDose('')
    setFrequency('daily')
    setStartDate(today)
    setEndDate('')
    setNotes('')
    setMedIcon('💊')
    setErrors({})
  }

  const handleClose = () => {
    reset()
    setSuccess(false)
    onClose()
  }

  const validate = () => {
    const e: Record<string, string> = {}

    if (!name.trim()) e.name = t('medications.edit.errName')
    if (!dose.trim()) e.dose = t('medications.edit.errDose')
    if (!startDate) e.start = t('medications.edit.errStart')
    if (endDate && endDate < startDate) e.end = t('medications.edit.errEnd')
    if (!petId) e.pet = t('common.selectPet')

    const pet = pets.find((p) => p.id === petId)
    if (petId && !pet) e.pet = t('pets.noPets')

    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }

    const pet = pets.find((p) => p.id === petId)
    if (!pet) {
      console.error('Pet not found')
      return
    }

    setSuccess(true)

    setTimeout(() => {
      onAdd({
        petId: pet.id,
        petSpecies: pet.species ?? '',
        name: name.trim(),
        dose: dose.trim(),
        frequency,
        startDate,
        endDate,
        notes: notes.trim(),
      })

      showToast(`${medIcon} ${t('toast.medAdded')}`)
      reset()
      setSuccess(false)
      onClose()
    }, 1100)
  }

  if (!isOpen) return null

  if (pets.length === 0) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title=""
        icon=""
        accentBg="var(--warn-hl)"
        accentFg="var(--warn)"
        size="md"
        footer={
          <PfFooter>
            <PfBtn variant="cancel" onClick={handleClose}>
              {t('btn.close')}
            </PfBtn>
          </PfFooter>
        }
      >
        <div className="modal-success">
          <div className="modal-success-icon">🐾</div>
          <div className="modal-success-title">{t('pets.noPets')}</div>
          <div className="modal-success-sub">{t('vet.noPetsHint')}</div>
        </div>
      </Modal>
    )
  }

  const pet = pets.find((p) => p.id === petId) ?? null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon=""
      accentBg="var(--warn-hl)"
      accentFg="var(--warn)"
      size="md"
      footer={
        !success ? (
          <PfFooter>
            <PfBtn variant="save" onClick={handleSubmit} disabled={!petId}>
              {t('medications.add')}
            </PfBtn>
          </PfFooter>
        ) : <></>
      }
    >
      <div
        className="modal-hero"
        style={{ background: 'linear-gradient(135deg,var(--warn-hl),var(--surface))' }}
      >
        <div className="modal-hero-icon" style={{ background: 'var(--warn)', fontSize: '1.5rem' }}>
          {medIcon}
        </div>
        <div style={{ flex: 1 }}>
          <div className="modal-hero-title">{t('medications.add')}</div>
          <div className="modal-hero-sub">
            {t('cares.add.heroSub')} <strong>{pet?.name ?? '—'}</strong>
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
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('toast.medAdded')}</div>
          <div className="modal-success-sub">
            {medIcon} <strong>{name}</strong> {t('pet.vacc.successSub')}
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
                onClick={() => {
                  setPetId(p.id)
                  setErrors((v) => ({ ...v, pet: '' }))
                }}
              >
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>
          {errors.pet && <span className="form-hint-err">{errors.pet}</span>}

          <div className="modal-section">{t('medications.title')}</div>

          <div className="form-group">
            <label className="form-label">{t('medications.dose')}</label>
            <div style={{ display: 'flex', gap: '.375rem' }}>
              {MED_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={['emoji-pick-btn', medIcon === ic ? 'active' : ''].join(' ')}
                  style={{ width: 38, height: 38, fontSize: '1.1rem' }}
                  onClick={() => setMedIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('field.name')} *</label>
              <div className="field-icon-wrap">
                <span className="field-icon" style={{ fontSize: '1rem' }}>{medIcon}</span>
                <input
                  className={['form-input', errors.name ? 'form-input--err' : ''].join(' ')}
                  placeholder={t('medications.edit.namePh')}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setErrors((v) => ({ ...v, name: '' }))
                  }}
                  autoFocus
                />
              </div>
              {errors.name && <span className="form-hint-err">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('medications.dose')} *</label>
              <div className="field-icon-wrap">
                <span className="field-icon">⚖️</span>
                <input
                  className={['form-input', errors.dose ? 'form-input--err' : ''].join(' ')}
                  placeholder={t('medications.edit.dosePh')}
                  value={dose}
                  onChange={(e) => {
                    setDose(e.target.value)
                    setErrors((v) => ({ ...v, dose: '' }))
                  }}
                />
              </div>
              {errors.dose && <span className="form-hint-err">{errors.dose}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('medications.frequency')}</label>
            <div className="field-icon-wrap">
              <span className="field-icon">🔄</span>
              <select
                className="form-input"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f.val} value={f.val}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-section">
            {t('medications.startDate')} / {t('medications.endDate')}
          </div>

          <div className="form-row">
            <FormDateField
              label={`${t('medications.startDate')} *`}
              value={startDate}
              onChange={(v) => {
                setStartDate(v)
                setErrors((e) => ({ ...e, start: '' }))
              }}
              max={today}
              error={errors.start}
            />

            <FormDateField
              label={`${t('medications.endDate')} (${t('btn.optional')})`}
              value={endDate}
              onChange={(v) => {
                setEndDate(v)
                setErrors((e) => ({ ...e, end: '' }))
              }}
              min={startDate}
              error={errors.end}
              hint={t('medications.edit.endHint')}
            />
          </div>

          <div className="modal-section">{t('field.notes')}</div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              {t('field.notes')}{' '}
              <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>
                ({t('btn.optional')})
              </span>
            </label>
            <div className="field-icon-wrap" style={{ alignItems: 'flex-start' }}>
              <span className="field-icon" style={{ paddingTop: '.55rem' }}>📝</span>
              <textarea
                className="form-input"
                rows={3}
                placeholder={t('medications.edit.notesPh')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical', minHeight: 72, fontFamily: 'inherit', border: 'none' }}
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}