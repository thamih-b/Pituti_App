import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { showToast } from './AppLayout'
import { MOCK_PETS } from '../hooks/usePets'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Types ───────────────────────────────────────────────
export interface AddMedData {
  petId:     string
  name:      string
  dose:      string
  frequency: string
  startDate: string
  endDate:   string
  notes:     string
}
interface Props { isOpen: boolean; onClose: () => void; onAdd: (d: AddMedData) => void; defaultPetId?: string }

const PET_EMOJI: Record<string, string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const FREQ_OPTIONS = [
  { val: 'Diaria',          label: 'Diaria (1× al día)'        },
  { val: 'Cada 12 horas',   label: 'Cada 12 horas'             },
  { val: 'Cada 8 horas',    label: 'Cada 8 horas'              },
  { val: 'Semanal',         label: 'Semanal (1× a la semana)'  },
  { val: 'Quincenal',       label: 'Quincenal'                 },
  { val: 'Mensual',         label: 'Mensual'                   },
  { val: 'Cada 3 meses',    label: 'Cada 3 meses'              },
  { val: 'Única dosis',     label: 'Única dosis'               },
]

const MED_ICONS = ['💊', '💉', '🩹', '🧪', '🫙', '🌡️', '🩺']

export default function AddMedicationModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [petId,     setPetId]     = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [medIcon,   setMedIcon]   = useState('💊')
  const [name,      setName]      = useState('')
  const [dose,      setDose]      = useState('')
  const [frequency, setFrequency] = useState('Diaria')
  const [startDate, setStartDate] = useState(today)
  const [endDate,   setEndDate]   = useState('')
  const [notes,     setNotes]     = useState('')
  const [errors,    setErrors]    = useState<Record<string,string>>({})
  const [success,   setSuccess]   = useState(false)

  const reset = () => {
    setName(''); setDose(''); setFrequency('Diaria')
    setStartDate(today); setEndDate(''); setNotes('')
    setMedIcon('💊'); setErrors({})
  }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const validate = () => {
    const e: Record<string,string> = {}
    if (!name.trim())  e.name  = 'El nombre del medicamento es obligatorio'
    if (!dose.trim())  e.dose  = 'Indica la dosis'
    if (!startDate)    e.start = 'La fecha de inicio es obligatoria'
    if (endDate && endDate < startDate) e.end = 'La fecha de fin debe ser posterior al inicio'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, name: name.trim(), dose: dose.trim(), frequency, startDate, endDate, notes })
      showToast(`${medIcon} Medicamento "${name.trim()}" registrado`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet = MOCK_PETS.find(p => p.id === petId)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon=""
      accentBg="var(--warn-hl)"
      accentFg="var(--warn)"
      size="md"
      footer={!success ? (
        <>
        <PfFooter>
  <PfBtn variant="save" onClick={handleSubmit}>Guardar medicamento</PfBtn>
</PfFooter>

        </>
      ) : <></>}
    >
{/* Hero */}
<div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--warn-hl),var(--surface))' }}>
  <div className="modal-hero-icon" style={{ background:'var(--warn)', fontSize:'1.5rem' }}>{medIcon}</div>
  <div style={{ flex: 1 }}>
    <div className="modal-hero-title">Nuevo medicamento</div>
    <div className="modal-hero-sub">Tratamiento para <strong>{pet?.name ?? '—'}</strong></div>
  </div>
  <button className="pm-close" onClick={handleClose} aria-label="Cerrar modal">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  </button>
</div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Medicamento registrado!</div>
          <div className="modal-success-sub">{medIcon} <strong>{name}</strong> añadido al historial</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">Mascota</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${MOCK_PETS.length},1fr)`, marginBottom:'1rem' }}>
            {MOCK_PETS.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id?'active':''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species]??'🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Medication identity */}
          <div className="modal-section">Medicamento</div>

          {/* Icon row */}
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <div style={{ display:'flex', gap:'.375rem' }}>
              {MED_ICONS.map(ic => (
                <button key={ic} type="button"
                  className={['emoji-pick-btn', medIcon===ic?'active':''].join(' ')}
                  style={{ width:38, height:38, fontSize:'1.1rem' }}
                  onClick={() => setMedIcon(ic)}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre del medicamento *</label>
              <div className="field-icon-wrap">
                <span className="field-icon" style={{ fontSize:'1rem' }}>{medIcon}</span>
                <input className={['form-input', errors.name?'form-input--err':''].join(' ')}
                  placeholder="Ej: Bravecto, Amoxicilina…"
                  value={name} onChange={e => { setName(e.target.value); setErrors(v=>({...v,name:''})) }} autoFocus />
              </div>
              {errors.name && <span className="form-hint-err">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Dosis *</label>
              <div className="field-icon-wrap">
                <span className="field-icon">⚖️</span>
                <input className={['form-input', errors.dose?'form-input--err':''].join(' ')}
                  placeholder="Ej: 1 comprimido, 2.5ml…"
                  value={dose} onChange={e => { setDose(e.target.value); setErrors(v=>({...v,dose:''})) }} />
              </div>
              {errors.dose && <span className="form-hint-err">{errors.dose}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Frecuencia</label>
            <div className="field-icon-wrap">
              <span className="field-icon">🔄</span>
              <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                {FREQ_OPTIONS.map(f => <option key={f.val} value={f.val}>{f.label}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="modal-section">Período de tratamiento</div>
          <div className="form-row">
            <FormDateField
              label="Fecha de inicio *"
              value={startDate}
              onChange={v => { setStartDate(v); setErrors(e=>({...e,start:''})) }}
              max={new Date().toISOString().split('T')[0]}
              error={errors.start}
            />
            <FormDateField
              label="Fecha de fin (opcional)"
              value={endDate}
              onChange={v => { setEndDate(v); setErrors(e=>({...e,end:''})) }}
              min={startDate}
              error={errors.end}
              hint="Dejar vacío si es tratamiento continuo"
            />
          </div>

          {/* Notes */}
          <div className="modal-section">Notas adicionales</div>
          <div className="form-group" style={{ marginBottom:0 }}>
            <label className="form-label">Observaciones <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
            <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
              <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
              <textarea className="form-input" rows={3}
                placeholder="Reacciones, instrucciones del veterinario, número de lote…"
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize:'vertical', minHeight:72, fontFamily:'inherit', border:'none' }}
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
