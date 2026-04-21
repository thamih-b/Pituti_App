import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { showToast } from './AppLayout'
import { MOCK_PETS } from '../hooks/usePets'
import FormDateField from './FormDateField'

export interface SymptomData {
  petId:       string
  description: string
  category:    string
  severity:    string
  date:        string
  notes:       string
}
interface Props { isOpen: boolean; onClose: () => void; onAdd: (d: SymptomData) => void; defaultPetId?: string }

const PET_EMOJI: Record<string, string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const CATEGORIES = [
  { val:'digestivo',     icon:'🤢', label:'Digestivo'    },
  { val:'respiratorio',  icon:'🫁', label:'Respiratorio' },
  { val:'piel',          icon:'🩹', label:'Piel'         },
  { val:'comportamiento',icon:'🧠', label:'Comportamiento'},
  { val:'movimiento',    icon:'🦶', label:'Movimiento'   },
  { val:'ocular',        icon:'👁',  label:'Ocular'       },
  { val:'otro',          icon:'❓', label:'Otro'         },
]

const SEVERITIES = [
  { val:'leve',       icon:'🟡', label:'Leve',      sub:'Sin urgencia',        bg:'var(--gold-hl)',    fg:'var(--gold)'    },
  { val:'moderado',   icon:'🟠', label:'Moderado',  sub:'Observar de cerca',   bg:'var(--warn-hl)',    fg:'var(--warn)'    },
  { val:'grave',      icon:'🔴', label:'Grave',     sub:'Visita veterinaria',  bg:'var(--err-hl)',     fg:'var(--err)'     },
  { val:'emergencia', icon:'🚨', label:'Emergencia',sub:'Urgente ahora',       bg:'rgba(200,64,106,.25)',fg:'var(--err)'   },
]

export default function RegisterSymptomModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [petId,       setPetId]       = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('digestivo')
  const [severity,    setSeverity]    = useState('leve')
  const [date,        setDate]        = useState(today)
  const [notes,       setNotes]       = useState('')
  const [descErr,     setDescErr]     = useState('')
  const [success,     setSuccess]     = useState(false)

  const reset = () => { setDescription(''); setCategory('digestivo'); setSeverity('leve'); setDate(today); setNotes(''); setDescErr('') }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!description.trim()) { setDescErr('Describe el síntoma observado'); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, description: description.trim(), category, severity, date, notes })
      const sev = SEVERITIES.find(s => s.val === severity)
      showToast(`${sev?.icon ?? '🌡️'} Síntoma registrado`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet         = MOCK_PETS.find(p => p.id === petId)
  const selSeverity = SEVERITIES.find(s => s.val === severity)!
  const selCategory = CATEGORIES.find(c => c.val === category)!

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar síntoma"
      icon="🌡️"
      accentBg="var(--err-hl)"
      accentFg="var(--err)"
      size="md"
      footer={!success ? (
        <>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} style={{ background: selSeverity.fg }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Registrar síntoma
          </Button>
        </>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selSeverity.bg},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: selSeverity.fg, fontSize:'1.5rem' }}>
          {selCategory.icon}
        </div>
        <div>
          <div className="modal-hero-title">Síntoma observado</div>
          <div className="modal-hero-sub">
            En <strong>{pet?.name ?? '—'}</strong> · {selSeverity.label}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon" style={{ background: selSeverity.fg }}>✓</div>
          <div className="modal-success-title">Síntoma registrado</div>
          <div className="modal-success-sub">Quedará bajo seguimiento en el historial de {pet?.name}</div>
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

          {/* Síntoma */}
          <div className="modal-section">Descripción</div>
          <div className="form-group">
            <label className="form-label">¿Qué observaste? *</label>
            <div className={['form-input', descErr?'form-input--err':''].join(' ')}
              style={{ padding:0, border: descErr ? '1.5px solid var(--err)' : undefined }}>
              <textarea
                style={{ width:'100%', padding:'.55rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:88, color:'var(--text)' }}
                placeholder="Ej: Tos seca desde ayer por la mañana. No tiene fiebre pero parece cansado…"
                value={description}
                onChange={e => { setDescription(e.target.value); setDescErr('') }}
                autoFocus
              />
            </div>
            {descErr && <span className="form-hint-err">{descErr}</span>}
          </div>

          {/* Category */}
          <div className="modal-section">Categoría</div>
          <div className="symptom-cat-grid">
            {CATEGORIES.map(c => (
              <button key={c.val} type="button"
                className={['symptom-cat-btn', category===c.val?'active':''].join(' ')}
                onClick={() => setCategory(c.val)}>
                <span style={{ fontSize:'1.2rem' }}>{c.icon}</span>
                <span style={{ fontSize:'.7rem', fontWeight:700 }}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Severity */}
          <div className="modal-section">Severidad</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.375rem', marginBottom:'1rem' }}>
            {SEVERITIES.map(s => (
              <button key={s.val} type="button"
                className="severity-btn"
                style={{ borderColor: severity===s.val ? s.fg : 'var(--border)', background: severity===s.val ? s.bg : 'var(--surface-offset)' }}
                onClick={() => setSeverity(s.val)}>
                <span style={{ fontSize:'1.1rem' }}>{s.icon}</span>
                <div style={{ flex:1, textAlign:'left' }}>
                  <div style={{ fontWeight:800, fontSize:'.875rem', color: severity===s.val ? s.fg : 'var(--text)' }}>{s.label}</div>
                  <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{s.sub}</div>
                </div>
                <div className={['mf-radio', severity===s.val?'checked':''].join(' ')}
                  style={severity===s.val ? { borderColor:s.fg, background:s.fg } : {}} />
              </button>
            ))}
          </div>

          {/* Date + notes */}
          <div className="modal-section">Detalles</div>
          <FormDateField
            label="Fecha de inicio"
            value={date}
            onChange={setDate}
            max={today}
          />
          <div className="form-group" style={{ marginBottom:0, marginTop:'.75rem' }}>
            <label className="form-label">Notas adicionales <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
            <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
              <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
              <textarea className="form-input" rows={2}
                placeholder="Medicamentos que toma actualmente, cambios de comportamiento…"
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize:'vertical', minHeight:60, fontFamily:'inherit', border:'none' }}
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
