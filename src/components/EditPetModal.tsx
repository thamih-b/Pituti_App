// src/components/EditPetModal.tsx — traduzido e sem mock
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  onSave:  (pet: PetWithAlerts) => void
  pet:     PetWithAlerts
}

export default function EditPetModal({ isOpen, onClose, onSave, pet }: Props) {
  const { t } = useTranslation()

  const SPECIES_OPTIONS = [
    { value: 'cat'     as Species, emoji: '🐱', label: t('pets.speciesOptions.cat'),     color: 'var(--pal-lilac)'      },
    { value: 'dog'     as Species, emoji: '🐶', label: t('pets.speciesOptions.dog'),     color: 'var(--pal-sky)'        },
    { value: 'bird'    as Species, emoji: '🦜', label: t('pets.speciesOptions.bird'),    color: 'var(--pal-candy)'      },
    { value: 'rabbit'  as Species, emoji: '🐰', label: t('pets.speciesOptions.rabbit'),  color: 'var(--pal-mauve)'      },
    { value: 'reptile' as Species, emoji: '🦎', label: t('pets.speciesOptions.reptile'), color: 'var(--success-hl)'     },
    { value: 'fish'    as Species, emoji: '🐟', label: t('pets.speciesOptions.fish'),    color: 'var(--blue-hl)'        },
    { value: 'other'   as Species, emoji: '🐾', label: t('pets.speciesOptions.other'),   color: 'var(--surface-offset)' },
  ]

  // ✅ pet.species llega como string desde la API — se castea a Species para useState
  const [name,        setName]        = useState(pet.name)
  const [species,     setSpecies]     = useState<Species>((pet.species as Species) ?? 'other')
  const [breed,       setBreed]       = useState(pet.breed ?? '')
  const [birthDate,   setBirthDate]   = useState(pet.birthDate ?? '')
  const [weight,      setWeight]      = useState((pet as any).weight ?? '')
  const [nameErr,     setNameErr]     = useState('')
  const [success,     setSuccess]     = useState(false)
  const [color,       setColor]       = useState((pet as any).color       ?? '')
  const [height,      setHeight]      = useState((pet as any).height      ?? '')
  const [petLength,   setPetLength]   = useState((pet as any).petLength   ?? '')
  const [petWidth,    setPetWidth]    = useState((pet as any).petWidth    ?? '')
  const [microchip,   setMicrochip]   = useState((pet as any).microchip   ?? '')
  const [chipCountry, setChipCountry] = useState((pet as any).chipCountry ?? '')
  const [passport,    setPassport]    = useState((pet as any).passport    ?? '')

  useEffect(() => {
    if (!isOpen) return
    setName(pet.name)
    setSpecies((pet.species as Species) ?? 'other')  // ✅ cast correcto
    setBreed(pet.breed ?? '')
    setBirthDate(pet.birthDate ?? '')
    setWeight((pet as any).weight ?? '')
    setColor((pet as any).color ?? '')
    setHeight((pet as any).height ?? '')
    setPetLength((pet as any).petLength ?? '')
    setPetWidth((pet as any).petWidth ?? '')
    setMicrochip((pet as any).microchip ?? '')
    setChipCountry((pet as any).chipCountry ?? '')
    setPassport((pet as any).passport ?? '')
    setNameErr('')
    setSuccess(false)
  }, [pet, isOpen])

  const handleClose = () => { setSuccess(false); onClose() }

  const handleSave = () => {
    if (!name.trim()) { setNameErr(t('vet.contacts.errName')); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({
        ...pet,
        name:      name.trim(),
        species,
        breed:     breed.trim() || undefined,
        birthDate: birthDate    || undefined,
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${name.trim()} — ${t('toast.changesSaved')}`)
      setSuccess(false)
      onClose()
    }, 1000)
  }

  const selectedSpecies = SPECIES_OPTIONS.find(o => o.value === species)!

  // ── Render ────────────────────────────────────────────────────────────────

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title={t("modal.editPet")} icon="✏️">
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <h3>{t('btn.saveChanges')}</h3>
          <p>{t('toast.changesSaved')}</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("modal.editPet")} icon="✏️">

      <div className="modal-section-label">{t('pets.sectionIdentity')}</div>

      {/* Espécie */}
      <div className="species-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem', marginBottom: '1rem' }}>
        {SPECIES_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`species-chip${species === opt.value ? ' active' : ''}`}
            style={{ background: species === opt.value ? opt.color : undefined }}
            onClick={() => setSpecies(opt.value)}
          >
            <span>{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Nombre */}
      <div className="form-group">
        <label className="form-label">{t('field.name')}</label>
        <input
          className={`form-input${nameErr ? ' input-error' : ''}`}
          value={name}
          onChange={e => { setName(e.target.value); setNameErr('') }}
          placeholder={t('pets.namePh', { species: selectedSpecies?.label ?? '' })}
        />
        {nameErr && <div className="form-error">{nameErr}</div>}
      </div>

      {/* Raza */}
      <div className="form-group">
        <label className="form-label">
          {t('field.breed')} <span className="form-optional">{t('btn.optional')}</span>
        </label>
        <input className="form-input" value={breed}
          onChange={e => setBreed(e.target.value)} placeholder={t('pets.breedPh')} />
      </div>

      {/* Color */}
      <div className="form-group">
        <label className="form-label">
          {t('pets.color')} <span className="form-optional">{t('btn.optional')}</span>
        </label>
        <input className="form-input" value={color}
          onChange={e => setColor(e.target.value)} placeholder={t('pets.colorPh')} />
      </div>

      <div className="modal-section-label">{t('pets.sectionPhysical')}</div>

      {/* Fecha de nacimiento */}
      <div className="form-group">
        <label className="form-label">
          {t('field.birthDate')} <span className="form-optional">{t('btn.optional')}</span>
        </label>
        <FormDateField label={t("field.birthDate")} value={birthDate} onChange={setBirthDate} />
      </div>

      {/* Peso */}
      <div className="form-group">
        <label className="form-label">
          {t('pets.weight')} <span className="form-optional">{t('btn.optional')}</span>
        </label>
        <input className="form-input" type="number" step="0.1" min="0"
          value={weight} onChange={e => setWeight(e.target.value)} placeholder={t('pets.weightPh')} />
      </div>

      {/* Medidas */}
      <div className="form-group">
        <label className="form-label">
          {t('pets.measurements')} <span className="form-optional">{t('btn.optional')}</span>
        </label>
        <div className="mf-row">
          <input className="form-input" value={height}    onChange={e => setHeight(e.target.value)}    placeholder={t('pets.height')} />
          <input className="form-input" value={petLength} onChange={e => setPetLength(e.target.value)} placeholder={t('pets.length')} />
          <input className="form-input" value={petWidth}  onChange={e => setPetWidth(e.target.value)}  placeholder={t('pets.width')} />
        </div>
      </div>

      <div className="modal-section-label">
        {t('pets.sectionId')} <span className="form-optional">{t('btn.optional')}</span>
      </div>

      {/* Microchip */}
      <div className="form-group">
        <label className="form-label">{t('pets.microchip')}</label>
        <input className="form-input" value={microchip}
          onChange={e => setMicrochip(e.target.value)} placeholder={t('pets.microchipPh')} />
      </div>

      <div className="form-group">
        <label className="form-label">{t('pets.chipCountry')}</label>
        <input className="form-input" value={chipCountry}
          onChange={e => setChipCountry(e.target.value)} placeholder={t('pets.chipCountryPh')} />
      </div>

      {/* Pasaporte */}
      <div className="form-group">
        <label className="form-label">
          {t('pets.passport')} <span className="form-optional">{t('btn.optional')}</span>
        </label>
        <input className="form-input" value={passport}
          onChange={e => setPassport(e.target.value)} placeholder={t('pets.passportPh')} />
      </div>

      {/* Resumen chips */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {microchip && <span className="badge badge-blue">🔷 {t('pets.microchip')}: {microchip}</span>}
        {passport  && <span className="badge badge-green">📘 {t('pets.passport')}: {passport}</span>}
        {!microchip && !passport && (
          <span className="badge badge-gray">{t('pets.badgeNew')}</span>
        )}
      </div>

      <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          {t('btn.cancel')}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          {t('btn.saveChanges')}
        </button>
      </div>
    </Modal>
  )
}
