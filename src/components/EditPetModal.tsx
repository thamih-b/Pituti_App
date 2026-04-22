import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

interface Props { isOpen: boolean; onClose: () => void; onSave: (pet: PetWithAlerts) => void; pet: PetWithAlerts }

const SPECIES_OPTIONS: { value: Species; emoji: string; label: string; color: string }[] = [
  { value:'cat',     emoji:'🐱', label:'Gato',   color:'var(--pal-lilac)'      },
  { value:'dog',     emoji:'🐶', label:'Perro',  color:'var(--pal-sky)'        },
  { value:'bird',    emoji:'🦜', label:'Ave',    color:'var(--pal-candy)'      },
  { value:'rabbit',  emoji:'🐰', label:'Conejo', color:'var(--pal-mauve)'      },
  { value:'reptile', emoji:'🦎', label:'Reptil', color:'var(--success-hl)'     },
  { value:'fish',    emoji:'🐟', label:'Pez',    color:'var(--blue-hl)'        },
  { value:'other',   emoji:'🐾', label:'Otro',   color:'var(--surface-offset)' },
]

export default function EditPetModal({ isOpen, onClose, onSave, pet }: Props) {
  const [name,      setName]      = useState(pet.name)
  const [species,   setSpecies]   = useState<Species>(pet.species)
  const [breed,     setBreed]     = useState(pet.breed ?? '')
  const [birthDate, setBirthDate] = useState(pet.birthDate ?? '')
  const [weight,    setWeight]    = useState('')
  const [nameErr,   setNameErr]   = useState('')
  const [success,   setSuccess]   = useState(false)

  // Sync pet when it changes
  useEffect(() => {
    if (isOpen) {
      setName(pet.name); setSpecies(pet.species)
      setBreed(pet.breed ?? ''); setBirthDate(pet.birthDate ?? '')
      setNameErr(''); setSuccess(false)
    }
  }, [pet, isOpen])

  const handleClose = () => { setSuccess(false); onClose() }

  const handleSave = () => {
    if (!name.trim()) { setNameErr('El nombre es obligatorio'); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...pet, name: name.trim(), species, breed: breed.trim() || undefined, birthDate: birthDate || undefined })
      showToast(`✏️ ${name.trim()} actualizado`)
      setSuccess(false); onClose()
    }, 1000)
  }

  const selectedSpecies = SPECIES_OPTIONS.find(o => o.value === species)!

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Editar ${pet.name}`}
      icon="✏️"
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      size="md"
      footer={!success ? (
        
  <PfFooter
    left={<PfBtn variant="cancel" onClick={onClose}>Cancelar</PfBtn>}
    right={<PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>}
  />
) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--pal-lilac),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--pal-denim)', color:'#fff', fontSize:'1.5rem' }}>
          {selectedSpecies.emoji}
        </div>
        <div>
          <div className="modal-hero-title">Editar mascota</div>
          <div className="modal-hero-sub">Actualiza los datos de <strong>{pet.name}</strong></div>
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
          {/* Species */}
          <div className="modal-section">Especie</div>
          <div className="mf-species-grid" style={{ marginBottom:'1rem' }}>
            {SPECIES_OPTIONS.map(o => (
              <button key={o.value} type="button"
                className={['mf-species-card', species===o.value?'active':''].join(' ')}
                style={species===o.value ? { background:o.color, borderColor:'var(--primary)' } : {}}
                onClick={() => setSpecies(o.value)}>
                <span className="mf-species-emoji">{o.emoji}</span>
                <span className="mf-species-label">{o.label}</span>
              </button>
            ))}
          </div>

          {/* Identity */}
          <div className="modal-section">Datos principales</div>
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <div className={['mf-input-wrap', nameErr?'mf-input-wrap--err':''].join(' ')}>
              <span className="mf-prefix">{selectedSpecies.emoji}</span>
              <input className="mf-input" value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                placeholder="Nombre de tu mascota" autoFocus />
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Raza <span className="mf-optional">opcional</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🔬</span>
              <input className="mf-input" value={breed}
                onChange={e => setBreed(e.target.value)}
                placeholder="Ej: Europeo común, Mestizo…" />
            </div>
          </div>

          <div className="mf-row">
<FormDateField
  label={
    <>
      Fecha de nacimiento{' '}
      <span className="mf-optional">opcional</span>
    </>
  }
  value={birthDate}
  onChange={setBirthDate}
  max={new Date().toISOString().split('T')[0]}
/>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Peso <span className="mf-optional">opcional</span></label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="Ej: 4.2" />
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize:'1.5rem' }}>{selectedSpecies.emoji}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{name}</div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>
                  {selectedSpecies.label}
                  {breed ? ` · ${breed}` : ''}
                  {weight ? ` · ${weight} kg` : ''}
                </div>
              </div>
              <span className="badge badge-blue" style={{ marginLeft:'auto' }}>Editando ✏</span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
