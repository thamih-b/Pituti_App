// traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import { PfBtn, PfFooter } from './FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  onAdd:   (pet: PetWithAlerts) => void
}

export default function AddPetModal({ isOpen, onClose, onAdd }: Props) {
  const { t } = useTranslation()

  // ✅ labels traduzidos dentro do componente
  const SPECIES_OPTIONS = [
    { value: 'cat'     as Species, emoji: '🐱', label: t('pets.speciesOptions.cat'),     color: 'var(--pal-lilac)'       },
    { value: 'dog'     as Species, emoji: '🐶', label: t('pets.speciesOptions.dog'),     color: 'var(--pal-sky)'         },
    { value: 'bird'    as Species, emoji: '🦜', label: t('pets.speciesOptions.bird'),    color: 'var(--pal-candy)'       },
    { value: 'rabbit'  as Species, emoji: '🐰', label: t('pets.speciesOptions.rabbit'),  color: 'var(--pal-mauve)'       },
    { value: 'reptile' as Species, emoji: '🦎', label: t('pets.speciesOptions.reptile'), color: 'var(--success-hl)'      },
    { value: 'fish'    as Species, emoji: '🐟', label: t('pets.speciesOptions.fish'),    color: 'var(--blue-hl)'         },
    { value: 'other'   as Species, emoji: '🐾', label: t('pets.speciesOptions.other'),   color: 'var(--surface-offset)'  },
  ]

  const [name,        setName]        = useState('')
  const [species,     setSpecies]     = useState<Species>('cat')
  const [breed,       setBreed]       = useState('')
  const [birthDate,   setBirthDate]   = useState('')
  const [weight,      setWeight]      = useState('')
  const [nameErr,     setNameErr]     = useState('')
  const [success,     setSuccess]     = useState(false)
  const [color,       setColor]       = useState('')
  const [height,      setHeight]      = useState('')
  const [petLength,   setPetLength]   = useState('')
  const [petWidth,    setPetWidth]    = useState('')
  const [microchip,   setMicrochip]   = useState('')
  const [chipCountry, setChipCountry] = useState('')
  const [passport,    setPassport]    = useState('')

  const selected = SPECIES_OPTIONS.find(o => o.value === species)!

  const reset = () => {
    setName(''); setSpecies('cat'); setBreed(''); setBirthDate(''); setWeight('')
    setColor(''); setHeight(''); setPetLength(''); setPetWidth('')
    setMicrochip(''); setChipCountry(''); setPassport('')
    setNameErr('')
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!name.trim()) { setNameErr(t('vet.contacts.errName')); return }
    const petName = name.trim()
    setSuccess(true)
    setTimeout(() => {
      onAdd({
        id:          `pet-${Date.now()}`,
        name:        petName,
        species,
        breed:       breed.trim() || undefined,
        birthDate:   birthDate    || undefined,
        photoUrl:    undefined,
        ownerId:     'user.id',
        createdAt:   new Date().toISOString(),
        healthScore: 100,
        alerts:      [],
        vaccCoverage: 100,
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${selected.emoji} ${petName} — ${t('toast.petAdded')}`)
      reset(); setSuccess(false); onClose()
    }, 1000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon={selected.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="add" onClick={handleSubmit}>{t('pets.addBtn')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selected.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background:'var(--pal-denim)', color:'#fff', fontSize:'1.5rem' }}>
          {selected.emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="modal-hero-title" style={{ fontSize:'1rem' }}>
            {name.trim() || t('pets.newPet')}
          </div>
          <div className="modal-hero-sub">
            {selected.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('toast.petAdded')}</div>
          <div className="modal-success-sub">
            <strong>{name}</strong> {t('pets.successSub')}
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
              <span className="mf-prefix">{selected.emoji}</span>
              <input className="mf-input"
                placeholder={t('pets.namePh', { species: selected.label.toLowerCase() })}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                autoFocus/>
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('pets.breed')} <span className="mf-optional">({t('btn.optional')})</span>
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
                {t('pets.birthDate')} <span className="mf-optional">({t('btn.optional')})</span>
              </label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🎂</span>
                <input className="mf-input" type="date"
                  value={birthDate} onChange={e => setBirthDate(e.target.value)}/>
              </div>
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
            <label className="mf-label">{t('pets.passport')}</label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder={t('pets.passportPh')}
                value={passport} onChange={e => setPassport(e.target.value)}/>
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize:'1.5rem' }}>{selected.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{name}</div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>
                  {selected.label}
                  {breed     ? ` · ${breed}`                                : ''}
                  {color     ? ` · ${color}`                                : ''}
                  {weight    ? ` · ${weight} kg`                            : ''}
                  {microchip ? ` · ${t('pets.microchip')}: ${microchip}`   : ''}
                  {passport  ? ` · ${t('pets.passport')}: ${passport}`     : ''}
                </div>
              </div>
              <span className="badge badge-green" style={{ marginLeft:'auto', flexShrink:0 }}>
                {t('pets.badgeNew')}
              </span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}