import { useState } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { MOCK_PETS } from '../hooks/usePets'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface NoteData {
  petId: string; content: string; vet: string; date: string; type: string
}
interface Props { isOpen: boolean; onClose: () => void; onAdd: (d: NoteData) => void; defaultPetId?: string }

const PET_EMOJI: Record<string, string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const NOTE_TYPES = [
  { val:'control',     icon:'🩺', label:'Control',       bg:'var(--blue-hl)',    fg:'var(--blue)'    },
  { val:'observacion', icon:'👁',  label:'Observación',   bg:'var(--primary-hl)', fg:'var(--primary)' },
  { val:'emergencia',  icon:'🚨', label:'Emergencia',    bg:'var(--err-hl)',     fg:'var(--err)'     },
  { val:'vacuna',      icon:'💉', label:'Post-vacuna',   bg:'var(--success-hl)', fg:'var(--success)' },
  { val:'cirugia',     icon:'🔬', label:'Cirugía',       bg:'var(--warn-hl)',    fg:'var(--warn)'    },
  { val:'otro',        icon:'📋', label:'Otro',          bg:'var(--surface-offset)','fg':'var(--text-muted)' },
]

export default function NewNoteModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [petId,   setPetId]   = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [type,    setType]    = useState('control')
  const [contErr, setContErr] = useState('')
  const [success, setSuccess] = useState(false)

  const reset = () => { setContent(''); setVet(''); setDate(today); setType('control'); setContErr('') }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!content.trim()) { setContErr('El contenido de la nota no puede estar vacío'); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, content: content.trim(), vet: vet.trim(), date, type })
      const nt = NOTE_TYPES.find(n => n.val === type)
      showToast(`${nt?.icon ?? '📋'} Nota guardada`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet    = MOCK_PETS.find(p => p.id === petId)
  const selType = NOTE_TYPES.find(n => n.val === type)!

  return (
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title=""
  icon=""
  accentBg="var(--primary-hl)"
  accentFg="var(--primary)"
  size="md"
      footer={!success ? (
        <>
<PfFooter>
  <PfBtn variant="save" onClick={handleSubmit}>Guardar nota</PfBtn>
</PfFooter>
        </>
      ) : <></>}
    >
        {/* Hero */}
  <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
    <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>
      {selType.icon}
    </div>
    <div style={{ flex: 1 }}>
      <div className="modal-hero-title">Nueva nota</div>
      <div className="modal-hero-sub">Registro de {selType.label} · <strong>{pet?.name ?? '—'}</strong></div>
    </div>
    <button className="pm-close" onClick={handleClose}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>

    </button>
  </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Nota guardada!</div>
          <div className="modal-success-sub">Registrada el {new Date(date+'T00:00:00').toLocaleDateString('es-ES')}</div>
        </div>
      ) : (
        <>
          {/* Pet */}
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

          {/* Note type */}
          <div className="modal-section">Tipo de nota</div>
          <div className="note-type-grid">
            {NOTE_TYPES.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type===n.val?'active':''].join(' ')}
                style={type===n.val ? { background: n.bg, borderColor: n.fg, color: n.fg } : {}}
                onClick={() => setType(n.val)}>
                <span style={{ fontSize:'1.1rem' }}>{n.icon}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="modal-section">Contenido</div>
          <div className="form-group">
            <label className="form-label">Nota *</label>
            <div className={['form-input', contErr?'form-input--err':''].join(' ')}
              style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                placeholder="Estado del animal, observaciones, recomendaciones del veterinario, próximos pasos…"
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Vet + date */}
          <div className="modal-section">Detalles</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Veterinario <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input"
                  placeholder="Ej: Dra. García · VetSalud"
                  value={vet}
                  onChange={e => setVet(e.target.value)}
                />
              </div>
            </div>
            <FormDateField
              label="Fecha"
              value={date}
              onChange={setDate}
              max={today}
            />
          </div>
        </>
      )}
    </Modal>
  )
}
