// traduzido e sem mock

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

  const [name,        setName]        = useState(pet.name)
  const [species,     setSpecies]     = useState<Species>(pet.species)
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
    setSpecies(pet.species)
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon={selectedSpecies.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>{t('btn.saveChanges')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selectedSpecies.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background:'var(--pal-denim)', color:'#fff', fontSize:'1.5rem' }}>
          {selectedSpecies.emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="modal-hero-title" style={{ fontSize:'1rem' }}>
            {name.trim() || pet.name}
          </div>
          <div className="modal-hero-sub">
            {selectedSpecies.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('btn.saveChanges')} ✓</div>
          <div className="modal-success-sub">
            <strong>{name}</strong> — {t('toast.changesSaved')}
          </div>
        </div>
      ) : (
        <>
          {/* Identidade */}
          <div className="modal-section">{t('pets.sectionIdentity')}</div>

          <div className="mf-species-grid" style={{ marginBottom:'1rem' }}>
            {SPECIES_OPTIONS.map(o => (
              <button key={o.value} type="button"
                className={['mf-species-card', species===o.value ? 'active' : ''].join(' ')}
                style={species===o.value ? { background: o.color, borderColor:'var(--primary)' } : {}}
                onClick={() => setSpecies(o.value)}>
                <span className="mf-species-emoji">{o.emoji}</span>
                <span className="mf-species-label">{o.label}</span>
              </button>
            ))}
          </div>

          <div className="mf-field">
            <label className="mf-label">{t('field.name')}</label>
            <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
              <span className="mf-prefix">{selectedSpecies.emoji}</span>
              <input className="mf-input"
               // continua a funcionar — label já vem traduzido do array
placeholder={t('pets.namePh', { species: selectedSpecies.label.toLowerCase() })}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                autoFocus/>
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('field.breed')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🏷️</span>
              <input className="mf-input" placeholder={t('pets.breedPh')}
                value={breed} onChange={e => setBreed(e.target.value)}/>
            </div>
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('pets.color')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🎨</span>
              <input className="mf-input" placeholder={t('pets.colorPh')}
                value={color} onChange={e => setColor(e.target.value)}/>
            </div>
          </div>

          {/* Dados físicos */}
          <div className="modal-section">{t('pets.sectionPhysical')}</div>

          <div className="form-row" style={{ marginBottom:'1rem' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">
                {t('field.birthDate')} <span className="mf-optional">({t('btn.optional')})</span>
              </label>
              <FormDateField
                value={birthDate}
                onChange={setBirthDate}
                label={undefined}/>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">
                {t('pets.weight')} <span className="mf-optional">({t('btn.optional')})</span>
              </label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder={t('pets.weightPh')}/>
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          </div>

          <label className="mf-label" style={{ display:'block', marginBottom:'.5rem' }}>
            {t('pets.measurements')} <span className="mf-optional">({t('btn.optional')})</span>
          </label>
          <div className="form-row" style={{ marginBottom:'1rem' }}>
            {[
              { label: t('pets.height'),  val: height,    set: setHeight,    prefix:'↕' },
              { label: t('pets.length'),  val: petLength, set: setPetLength, prefix:'↔' },
              { label: t('pets.width'),   val: petWidth,  set: setPetWidth,  prefix:'⟺' },
            ].map(field => (
              <div key={field.label} className="form-group" style={{ marginBottom:0 }}>
                <label className="mf-label" style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{field.label}</label>
                <div className="mf-input-wrap">
                  <span className="mf-prefix">{field.prefix}</span>
                  <input className="mf-input" type="number" step="0.1" min="0"
                    value={field.val} onChange={e => field.set(e.target.value)} placeholder="0.0"/>
                  <span className="mf-suffix">cm</span>
                </div>
              </div>
            ))}
          </div>

          {/* Identificação */}
          <div className="modal-section">
            {t('pets.sectionId')} <span className="mf-optional">({t('btn.optional')})</span>
          </div>

          <div className="form-row" style={{ marginBottom:'1rem' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">{t('pets.microchip')}</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">📡</span>
                <input className="mf-input" placeholder={t('pets.microchipPh')}
                  value={microchip} onChange={e => setMicrochip(e.target.value)} maxLength={20}/>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">{t('pets.chipCountry')}</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🌍</span>
                <input className="mf-input" placeholder={t('pets.chipCountryPh')}
                  value={chipCountry} onChange={e => setChipCountry(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('pets.passport')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder={t('pets.passportPh')}
                value={passport} onChange={e => setPassport(e.target.value)}/>
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize:'1.5rem' }}>{selectedSpecies.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{name}</div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>
                  {selectedSpecies.label}
                  {breed     ? ` · ${breed}`                                : ''}
                  {color     ? ` · ${color}`                                : ''}
                  {weight    ? ` · ${weight} kg`                            : ''}
                  {microchip ? ` · ${t('pets.microchip')}: ${microchip}`   : ''}
                  {passport  ? ` · ${t('pets.passport')}: ${passport}`     : ''}
                </div>
              </div>
              <span className="badge badge-blue" style={{ marginLeft:'auto', flexShrink:0 }}>
                {t('modal.editPet')}
              </span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}