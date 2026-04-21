import { useState, useRef, useEffect } from 'react'
import type { Species } from '../types'
import type { PetWithAlerts } from '../hooks/usePets'

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface FormFields {
  name:      string
  species:   Species
  breed:     string
  birthDate: string
  weight:    string
}
interface FormErrors { name?: string; birthDate?: string; weight?: string }

interface AddPetModalProps {
  isOpen:  boolean
  onClose: () => void
  onAdd:   (pet: PetWithAlerts) => void
}

// ── Constantes ─────────────────────────────────────────────────────────────────
const SPECIES_OPTIONS: { value: Species; label: string; emoji: string }[] = [
  { value: 'cat',     label: 'Gato',    emoji: '🐱' },
  { value: 'dog',     label: 'Perro',   emoji: '🐶' },
  { value: 'bird',    label: 'Ave',     emoji: '🐦' },
  { value: 'rabbit',  label: 'Conejo',  emoji: '🐰' },
  { value: 'reptile', label: 'Reptil',  emoji: '🦎' },
  { value: 'fish',    label: 'Pez',     emoji: '🐠' },
  { value: 'other',   label: 'Otro',    emoji: '🐾' },
]

const EMPTY: FormFields = { name: '', species: 'cat', breed: '', birthDate: '', weight: '' }

// ── Validação pura ─────────────────────────────────────────────────────────────
function validate(f: FormFields): FormErrors {
  const e: FormErrors = {}

  // nome
  if (!f.name.trim())
    e.name = 'El nombre es obligatorio.'
  else if (f.name.trim().length < 2)
    e.name = 'Mínimo 2 caracteres.'

  // data de nascimento
  if (f.birthDate) {
    const d = new Date(f.birthDate + 'T00:00:00')   // evita UTC offset
    if (isNaN(d.getTime()))
      e.birthDate = 'Fecha inválida.'
    else if (d > new Date())
      e.birthDate = 'No puede ser una fecha futura.'
  }

  // peso
  if (f.weight.trim() !== '') {
    const w = parseFloat(f.weight)
    if (isNaN(w) || w <= 0)
      e.weight = 'El peso debe ser mayor que 0.'
    else if (w > 200)
      e.weight = 'El peso parece inválido (máx. 200 kg).'
  }

  return e
}

// ── Componente ─────────────────────────────────────────────────────────────────
export default function AddPetModal({ isOpen, onClose, onAdd }: AddPetModalProps) {
  const [form,    setForm]    = useState<FormFields>(EMPTY)
  const [errors,  setErrors]  = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<keyof FormFields>>(new Set())
  const [success, setSuccess] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  // foco automático ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameRef.current?.focus(), 60)
    }
  }, [isOpen])

  // fechar com Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  if (!isOpen) return null

  // ── helpers ──
  const touch = (key: keyof FormFields) =>
    setTouched(prev => new Set(prev).add(key))

  const setField = (key: keyof FormFields, value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched.has(key)) setErrors(validate(next))
  }

  const handleBlur = (key: keyof FormFields) => {
    touch(key)
    setErrors(validate(form))
  }

  const hasError = (key: keyof FormErrors) =>
    touched.has(key) && !!errors[key]

  const inputClass = (key: keyof FormErrors) =>
    ['apm-input', hasError(key) ? 'apm-input--error' : ''].join(' ').trim()

  const handleSubmit = () => {
    // marcar todos os campos como tocados
    const allKeys: (keyof FormFields)[] = ['name', 'species', 'birthDate', 'weight']
    setTouched(new Set(allKeys))
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    onAdd({
      id:          `pet-${Date.now()}`,
      name:        form.name.trim(),
      species:     form.species,
      breed:       form.breed.trim() || undefined,
      birthDate:   form.birthDate   || undefined,
      photoUrl:    '',
      ownerId:     'user-1',
      createdAt:   new Date().toISOString(),
      healthScore: 100,
      alerts:      [],
    })

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setForm(EMPTY)
      setErrors({})
      setTouched(new Set())
      onClose()
    }, 1600)
  }

  const handleClose = () => {
    setForm(EMPTY)
    setErrors({})
    setTouched(new Set())
    setSuccess(false)
    onClose()
  }

  const selectedSpecies = SPECIES_OPTIONS.find(o => o.value === form.species)!

  // ── render ──
  return (
    <div className="apm-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="apm-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="apm-header">
          <div className="apm-header-icon">🐾</div>
          <div>
            <h2 className="apm-title">Nueva mascota</h2>
            <p className="apm-subtitle">Completa los datos para registrarla</p>
          </div>
          <button className="apm-close" onClick={handleClose} aria-label="Cerrar">✕</button>
        </div>

        {/* ── Banner de sucesso ───────────────────────────────────────── */}
        {success && (
          <div className="apm-success-banner">
            <span className="apm-success-icon">✓</span>
            <span><strong>{form.name}</strong> añadida con éxito</span>
          </div>
        )}

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="apm-body">

          {/* Selector de espécie — visual */}
          <div className="apm-field">
            <label className="apm-label">Especie</label>
            <div className="apm-species-grid">
              {SPECIES_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={['apm-species-btn', form.species === opt.value ? 'apm-species-btn--active' : ''].join(' ')}
                  onClick={() => setField('species', opt.value)}
                >
                  <span className="apm-species-emoji">{opt.emoji}</span>
                  <span className="apm-species-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div className="apm-field">
            <label className="apm-label">
              Nombre <span className="apm-required">*</span>
            </label>
            <div className="apm-input-wrap">
              <span className="apm-input-prefix">{selectedSpecies.emoji}</span>
              <input
                ref={nameRef}
                className={inputClass('name')}
                name="name"
                value={form.name}
                placeholder={`Nombre de tu ${selectedSpecies.label.toLowerCase()}`}
                onChange={e => setField('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                autoComplete="off"
              />
            </div>
            {hasError('name') && <span className="apm-error">{errors.name}</span>}
          </div>

          {/* Raça + Data */}
          <div className="apm-row">
            <div className="apm-field">
              <label className="apm-label">Raza</label>
              <input
                className="apm-input"
                name="breed"
                value={form.breed}
                placeholder="Ej.: Europeo común"
                onChange={e => setField('breed', e.target.value)}
              />
            </div>

            <div className="apm-field">
              <label className="apm-label">Fecha de nacimiento</label>
              <input
                className={inputClass('birthDate')}
                name="birthDate"
                type="date"
                value={form.birthDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setField('birthDate', e.target.value)}
                onBlur={() => handleBlur('birthDate')}
              />
              {hasError('birthDate') && <span className="apm-error">{errors.birthDate}</span>}
            </div>
          </div>

          {/* Peso */}
          <div className="apm-field apm-field--half">
            <label className="apm-label">Peso (kg)</label>
            <div className="apm-input-wrap">
              <input
                className={inputClass('weight')}
                name="weight"
                type="number"
                step="0.1"
                min="0"
                value={form.weight}
                placeholder="Ej.: 4.2"
                onChange={e => setField('weight', e.target.value)}
                onBlur={() => handleBlur('weight')}
              />
              <span className="apm-input-suffix">kg</span>
            </div>
            {hasError('weight') && <span className="apm-error">{errors.weight}</span>}
          </div>

        </div>{/* /apm-body */}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="apm-footer">
          <button className="btn btn-ghost" onClick={handleClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Guardar mascota
          </button>
        </div>

      </div>
    </div>
  )
}
