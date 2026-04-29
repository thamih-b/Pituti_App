import { useState } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { MOCK_PETS, type PetWithAlerts } from '../hooks/usePets'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface AddCareData {
  petId:            string
  emoji:            string
  title:            string
  total:            number
  recurrenceType:   'daily' | 'everyXDays' | 'everyXHours'
  recurrenceValue:  number
  quantity:         string
  notify:           boolean
  // compat legado / campos opcionais usados pelo PetDetailPage
  period?:          string
  intervalDays?:    number
  time?:            string
  recurring?:       boolean
}

interface Props {
  isOpen:         boolean
  onClose:        () => void
  onAdd:          (data: AddCareData) => void
  defaultPetId?:  string
}

// ── Constantes ────────────────────────────────────────────────────────────────

const CARE_EMOJIS = [
  '🍽️','💧','🪮','🦮','🏃','🛁','💊','💉','🧴','🪥',
  '🐾','🌿','🪺','🐟','🐇','🐦','🧸','🩺','⏰','📅',
]

const RECURRENCE_OPTS = [
  { val: 'daily'       as const, icon: '📅', label: 'Diário'         },
  { val: 'everyXDays'  as const, icon: '🗓️', label: 'A cada X días'  },
  { val: 'everyXHours' as const, icon: '⏰', label: 'A cada X horas' },
]

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🐦', rabbit:'🐰', reptile:'🦎', fish:'🐠', other:'🐾',
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}
    >
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function AddCareModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const [petId,    setPetId   ] = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [emoji,    setEmoji   ] = useState('')
  const [title,    setTitle   ] = useState('')
  const [total,    setTotal   ] = useState(1)
  const [recType,  setRecType ] = useState<'daily' | 'everyXDays' | 'everyXHours'>('daily')
  const [recValue, setRecValue] = useState(1)
  const [quantity, setQuantity] = useState('')
  const [notify,   setNotify  ] = useState(true)
  const [titleErr, setTitleErr] = useState('')
  const [success,  setSuccess ] = useState(false)

  const reset = () => {
    setTitle(''); setQuantity(''); setTitleErr('')
    setEmoji(''); setTotal(1)
    setRecType('daily'); setRecValue(1)
    setNotify(true)
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!title.trim()) { setTitleErr('El nombre del cuidado es obligatorio'); return }
    const rv = Math.max(1, Number(recValue) || 1)
    const intervalDays =
      recType === 'daily'       ? 1 :
      recType === 'everyXDays'  ? rv :
      rv / 24

    setSuccess(true)
    setTimeout(() => {
      onAdd({
        petId,
        emoji,
        title: title.trim(),
        total: Math.max(1, Number(total) || 1),
        recurrenceType:  recType,
        recurrenceValue: rv,
        quantity,
        notify,
        period:      recType === 'daily' ? 'day' : 'custom',
        intervalDays,
      })
      showToast(`${emoji} Cuidado "${title.trim()}" añadido`)
      reset()
      setSuccess(false)
      onClose()
    }, 1100)
  }

  const selectedPet = MOCK_PETS.find((p: PetWithAlerts) => p.id === petId)

  const pillStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '.35rem',
    padding: '.5rem .875rem',
    borderRadius: 'var(--r-full)',
    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background: active ? 'var(--primary-hl)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: active ? 700 : 500,
    fontSize: '.8125rem',
    cursor: 'pointer',
    transition: 'all var(--trans)',
    whiteSpace: 'nowrap' as const,
    fontFamily: 'inherit',
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon="🐾"
      accentBg="var(--success-hl)"
      accentFg="var(--success)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>Añadir cuidado</PfBtn>
        </PfFooter>
      ) : undefined}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--success-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--success)', fontSize:'1.5rem' }}>{emoji}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">Nuevo cuidado</div>
          <div className="modal-hero-sub">
            Rutina para <strong>{selectedPet?.name ?? '—'}</strong>
          </div>
        </div>
        <button className="pm-close" onClick={handleClose} aria-label="Cerrar modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✅</div>
          <div className="modal-success-title">¡Cuidado añadido!</div>
          <div className="modal-success-sub">{emoji} <strong>{title}</strong> ya aparece en la rutina</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">Mascota</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${MOCK_PETS.length},1fr)`, marginBottom:'1rem' }}>
            {MOCK_PETS.map((p: PetWithAlerts) => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId === p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}
              >
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Cuidado — icono + nombre */}
          <div className="modal-section">Cuidado</div>
          <div className="form-group">
            <label className="form-label">Icono</label>
            <div className="emoji-picker-grid">
              {CARE_EMOJIS.map(e => (
                <button key={e} type="button"
                  className={['emoji-pick-btn', emoji === e ? 'active' : ''].join(' ')}
                  onClick={() => setEmoji(e)}
                >{e}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <div className="field-icon-wrap">
              <span className="field-icon" style={{ fontSize:'1rem' }}>{emoji}</span>
              <input
                className={['form-input', titleErr ? 'form-input--err' : ''].join(' ')}
                placeholder="Ej. Alimentación, Paseo, Cepillado"
                value={title}
                onChange={e => { setTitle(e.target.value); setTitleErr('') }}
                autoFocus
              />
            </div>
            {titleErr && <span className="form-hint-err">{titleErr}</span>}
          </div>

          {/* ── Recurrencia — Pills ──────────────────────────────────────── */}
          <div className="modal-section">Recurrencia</div>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'.875rem' }}>
            {RECURRENCE_OPTS.map(opt => (
              <button key={opt.val} type="button"
                style={pillStyle(recType === opt.val)}
                onClick={() => setRecType(opt.val)}
              >
                <span style={{ fontSize:'.95rem' }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {/* X input — só para everyXDays / everyXHours */}
          {(recType === 'everyXDays' || recType === 'everyXHours') && (
            <div className="form-group" style={{ marginBottom:'.875rem' }}>
              <label className="form-label">
                {recType === 'everyXDays' ? 'Intervalo (días)' : 'Intervalo (horas)'}
              </label>
              <div style={{ display:'flex', alignItems:'center', gap:'.625rem' }}>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={recType === 'everyXHours' ? 168 : 365}
                  value={recValue}
                  onChange={e => setRecValue(Math.max(1, Number(e.target.value) || 1))}
                  style={{ width:90, textAlign:'center', fontWeight:700, fontSize:'1.1rem' }}
                />
                <span style={{ color:'var(--text-muted)', fontSize:'.875rem', fontWeight:600 }}>
                  {recType === 'everyXDays' ? 'día(s)' : 'hora(s)'}
                </span>
                <span style={{
                  marginLeft:'auto', fontSize:'.75rem', color:'var(--success)',
                  background:'var(--success-hl)', padding:'.2rem .5rem',
                  borderRadius:'var(--r-full)', fontWeight:700,
                }}>
                  {recType === 'everyXDays'
                    ? `📅 cada ${recValue} día${recValue !== 1 ? 's' : ''}`
                    : `⏰ cada ${recValue}h`}
                </span>
              </div>
            </div>
          )}

          {/* Veces al día — só quando 'daily' */}
          {recType === 'daily' && (
            <div className="form-group" style={{ marginBottom:'.875rem' }}>
              <label className="form-label">Veces al día</label>
              <input
                className="form-input"
                type="number" min={1} max={10}
                value={total}
                onChange={e => setTotal(Number(e.target.value))}
                style={{ maxWidth:90 }}
              />
            </div>
          )}

          {/* Cantidad / dosis */}
          <div className="form-group" style={{ marginTop:'.25rem' }}>
            <label className="form-label">
              Cantidad o dosis{' '}
              <span style={{ color:'var(--text-faint)', fontWeight:500 }}>opcional</span>
            </label>
            <div className="field-icon-wrap">
              <span className="field-icon">⚖️</span>
              <input
                className="form-input"
                placeholder="Ej. 80g, 200ml, 2 cucharadas"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>
          </div>

          {/* Notificaciones */}
          <div className="modal-section">Preferencias</div>
          <div className="toggle-row">
            <div className="toggle-row-info">
              <div className="toggle-row-label">Notificaciones</div>
              <div className="toggle-row-sub">Recordatorio a la hora del cuidado</div>
            </div>
            <Toggle on={notify} onChange={setNotify} />
          </div>
        </>
      )}
    </Modal>
  )
}
