import { useState } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import { PfBtn, PfFooter } from './FooterButtons'


/* ─── Types ─────────────────────────────────────────────────── */
interface Props {
  isOpen:  boolean
  onClose: () => void
  onAdd:   (pet: PetWithAlerts) => void
}

const SPECIES_OPTIONS = [
  { value: 'cat'     as Species, emoji: '🐱', label: 'Gato',   color: 'var(--pal-lilac)' },
  { value: 'dog'     as Species, emoji: '🐶', label: 'Perro',  color: 'var(--pal-sky)'   },
  { value: 'bird'    as Species, emoji: '🦜', label: 'Ave',    color: 'var(--pal-candy)' },
  { value: 'rabbit'  as Species, emoji: '🐰', label: 'Conejo', color: 'var(--pal-mauve)' },
  { value: 'reptile' as Species, emoji: '🦎', label: 'Reptil', color: 'var(--success-hl)'},
  { value: 'fish'    as Species, emoji: '🐟', label: 'Pez',    color: 'var(--blue-hl)'   },
  { value: 'other'   as Species, emoji: '🐾', label: 'Otro',   color: 'var(--surface-offset)'},
]


/* ─── Component ─────────────────────────────────────────────── */
export default function AddPetModal({ isOpen, onClose, onAdd }: Props) {
  /* Existing fields */
  const [name,      setName]      = useState('')
  const [species,   setSpecies]   = useState<Species>('cat')
  const [breed,     setBreed]     = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [weight,    setWeight]    = useState('')
  const [nameErr,   setNameErr]   = useState('')
  const [success,   setSuccess]   = useState(false)

  /* New optional fields */
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
    if (!name.trim()) { setNameErr('El nombre es obligatorio'); return }
    const petName = name.trim()
    setSuccess(true)
    setTimeout(() => {
      onAdd({
        id: `pet-${Date.now()}`,
        name: petName,
        species,
        breed:     breed.trim()  || undefined,
        birthDate: birthDate     || undefined,
        photoUrl:  undefined,
        ownerId:   'user-1',
        createdAt: new Date().toISOString(),
        healthScore: 100,
        alerts: [],
        vaccCoverage: 100,
        /* extra fields */
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${petName} añadida correctamente`)
      reset()
      setSuccess(false)
      onClose()
    }, 1000)
  }


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva mascota"
      icon={selected.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="add" onClick={handleSubmit}>Guardar mascota</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero — dynamic */}
      <div className="modal-hero" style={{ background: `linear-gradient(135deg,${selected.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: 'var(--pal-denim)', color: '#fff', fontSize: '1.5rem' }}>
          {selected.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="modal-hero-title" style={{ fontSize: '1rem' }}>
            {name.trim() || 'Nueva mascota'}
          </div>
          <div className="modal-hero-sub">
            {selected.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>


      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Mascota añadida!</div>
          <div className="modal-success-sub">{name} ya está en tu lista de mascotas</div>
        </div>
      ) : (
        <>
          {/* ── IDENTIDAD ─────────────────────────────────────── */}
          <div className="modal-section">Identidad</div>

          {/* Species */}
          <div className="mf-species-grid" style={{ marginBottom: '1rem' }}>
            {SPECIES_OPTIONS.map(o => (
              <button key={o.value} type="button"
                className={['mf-species-card', species === o.value ? 'active' : ''].join(' ')}
                style={species === o.value ? { background: o.color, borderColor: 'var(--primary)' } : {}}
                onClick={() => setSpecies(o.value)}>
                <span className="mf-species-emoji">{o.emoji}</span>
                <span className="mf-species-label">{o.label}</span>
              </button>
            ))}
          </div>

          {/* Name */}
          <div className="mf-field">
            <label className="mf-label">Nombre</label>
            <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
              <span className="mf-prefix">{selected.emoji}</span>
              <input className="mf-input"
                placeholder={`Nombre de tu ${selected.label.toLowerCase()}`}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                autoFocus />
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          {/* Breed */}
          <div className="mf-field">
            <label className="mf-label">Raza <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🏷️</span>
              <input className="mf-input" placeholder="Ej: Europeo común, Mestizo…"
                value={breed} onChange={e => setBreed(e.target.value)} />
            </div>
          </div>

          {/* Color — NEW */}
          <div className="mf-field">
            <label className="mf-label">Color <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🎨</span>
              <input className="mf-input" placeholder="Ej: Naranja, Blanco y negro, Tricolor…"
                value={color} onChange={e => setColor(e.target.value)} />
            </div>
          </div>

          {/* ── DATOS FÍSICOS ─────────────────────────────────── */}
          <div className="modal-section">Datos físicos</div>

          {/* Birth date + Weight */}
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Fecha de nacimiento <span className="mf-optional">(opcional)</span></label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🎂</span>
                <input className="mf-input" type="date"
                  value={birthDate} onChange={e => setBirthDate(e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Peso <span className="mf-optional">(opcional)</span></label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ej: 4.2" />
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          </div>

          {/* Medidas — NEW: altura + longitud + anchura */}
          <label className="mf-label" style={{ display: 'block', marginBottom: '.5rem' }}>
            Medidas <span className="mf-optional">(opcional)</span>
          </label>
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Altura</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">↕</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={height} onChange={e => setHeight(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Longitud</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">↔</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={petLength} onChange={e => setPetLength(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Anchura</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⟺</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={petWidth} onChange={e => setPetWidth(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
          </div>

          {/* ── IDENTIFICACIÓN ────────────────────────────────── */}
          <div className="modal-section">Identificación <span className="mf-optional">(opcional)</span></div>

          {/* Microchip + Country */}
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Nº de microchip</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">📡</span>
                <input className="mf-input" placeholder="15 dígitos ISO 11784"
                  value={microchip} onChange={e => setMicrochip(e.target.value)} maxLength={20} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">País correspondiente</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🌍</span>
                <input className="mf-input" placeholder="Ej: España, Argentina…"
                  value={chipCountry} onChange={e => setChipCountry(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Passport */}
          <div className="mf-field">
            <label className="mf-label">Pasaporte</label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder="Nº de pasaporte veterinario / documento"
                value={passport} onChange={e => setPassport(e.target.value)} />
            </div>
          </div>

          {/* ── PREVIEW ───────────────────────────────────────── */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize: '1.5rem' }}>{selected.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{name}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                  {selected.label}
                  {breed       ? ` · ${breed}`               : ''}
                  {color       ? ` · ${color}`               : ''}
                  {weight      ? ` · ${weight} kg`           : ''}
                  {microchip   ? ` · Chip: ${microchip}`    : ''}
                  {passport    ? ` · Pasaporte: ${passport}` : ''}
                </div>
              </div>
              <span className="badge badge-green" style={{ marginLeft: 'auto', flexShrink: 0 }}>Nueva</span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
