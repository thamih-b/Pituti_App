import { useState, useEffect } from 'react'
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


const SPECIES_OPTIONS = [
  { value: 'cat'     as Species, emoji: '🐱', label: 'Gato',    color: 'var(--pal-lilac)' },
  { value: 'dog'     as Species, emoji: '🐶', label: 'Perro',   color: 'var(--pal-sky)'   },
  { value: 'bird'    as Species, emoji: '🦜', label: 'Ave',     color: 'var(--pal-candy)' },
  { value: 'rabbit'  as Species, emoji: '🐰', label: 'Conejo',  color: 'var(--pal-mauve)' },
  { value: 'reptile' as Species, emoji: '🦎', label: 'Reptil',  color: 'var(--success-hl)'},
  { value: 'fish'    as Species, emoji: '🐟', label: 'Pez',     color: 'var(--blue-hl)'   },
  { value: 'other'   as Species, emoji: '🐾', label: 'Otro',    color: 'var(--surface-offset)'},
]


export default function EditPetModal({ isOpen, onClose, onSave, pet }: Props) {
  /* ── Existing fields ── */
  const [name,      setName]      = useState(pet.name)
  const [species,   setSpecies]   = useState<Species>(pet.species)
  const [breed,     setBreed]     = useState(pet.breed ?? '')
  const [birthDate, setBirthDate] = useState(pet.birthDate ?? '')
  const [weight,    setWeight]    = useState((pet as any).weight ?? '')
  const [nameErr,   setNameErr]   = useState('')
  const [success,   setSuccess]   = useState(false)

  /* ── New optional fields ── */
  const [color,       setColor]       = useState((pet as any).color       ?? '')
  const [height,      setHeight]      = useState((pet as any).height      ?? '')
  const [petLength,   setPetLength]   = useState((pet as any).petLength   ?? '')
  const [petWidth,    setPetWidth]    = useState((pet as any).petWidth    ?? '')
  const [microchip,   setMicrochip]   = useState((pet as any).microchip   ?? '')
  const [chipCountry, setChipCountry] = useState((pet as any).chipCountry ?? '')
  const [passport,    setPassport]    = useState((pet as any).passport    ?? '')


  /* ── Sync when pet or isOpen changes ── */
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [pet, isOpen])


  const handleClose = () => { setSuccess(false); onClose() }

  const handleSave = () => {
    if (!name.trim()) { setNameErr('El nombre es obligatorio'); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({
        ...pet,
        name: name.trim(),
        species,
        breed:     breed.trim()     || undefined,
        birthDate: birthDate        || undefined,
        /* extra fields — spread only if non-empty */
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${name.trim()} actualizado`)
      setSuccess(false)
      onClose()
    }, 1000)
  }

  const selectedSpecies = SPECIES_OPTIONS.find(o => o.value === species)!


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      /* ── FIX: static action label in the dialog bar; no duplication ── */
      title="Editar mascota"
      icon={selectedSpecies.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero — dynamic: updates as user types name and selects species */}
      <div className="modal-hero" style={{ background: `linear-gradient(135deg,${selectedSpecies.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: 'var(--pal-denim)', color: '#fff', fontSize: '1.5rem' }}>
          {selectedSpecies.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Dynamic title — updates as user types */}
          <div className="modal-hero-title" style={{ fontSize: '1rem' }}>
            {name.trim() || pet.name}
          </div>
          {/* Dynamic sub — updates as user selects species / breed */}
          <div className="modal-hero-sub">
            {selectedSpecies.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>


      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Cambios guardados!</div>
          <div className="modal-success-sub">El perfil de {name} ha sido actualizado</div>
        </div>
      ) : (
        <>
          {/* ── IDENTIDAD ────────────────────────────────────── */}
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
              <span className="mf-prefix">{selectedSpecies.emoji}</span>
              <input className="mf-input"
                placeholder={`Nombre de tu ${selectedSpecies.label.toLowerCase()}`}
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
              <FormDateField value={birthDate} onChange={setBirthDate} placeholder="Selecciona una fecha" label={undefined} />
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

          {/* Medidas — NEW: height + length + width */}
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
            <label className="mf-label">Pasaporte <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder="Nº de pasaporte veterinario / documento"
                value={passport} onChange={e => setPassport(e.target.value)} />
            </div>
          </div>

          {/* ── PREVIEW ───────────────────────────────────────── */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize: '1.5rem' }}>{selectedSpecies.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{name}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                  {selectedSpecies.label}
                  {breed       ? ` · ${breed}`              : ''}
                  {color       ? ` · ${color}`              : ''}
                  {weight      ? ` · ${weight} kg`          : ''}
                  {microchip   ? ` · Chip: ${microchip}`   : ''}
                  {passport    ? ` · Pasaporte: ${passport}`: ''}
                </div>
              </div>
              <span className="badge badge-blue" style={{ marginLeft: 'auto', flexShrink: 0 }}>Editando</span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
