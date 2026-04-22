import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { showToast } from './AppLayout'
import { MOCK_PETS } from '../hooks/usePets'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Types ───────────────────────────────────────────────
export interface AddCareData {
  petId:    string
  emoji:    string
  title:    string
  total:    number
  period:   string
  quantity: string
  notify:   boolean
}
interface Props {
  isOpen:        boolean
  onClose:       () => void
  onAdd:         (data: AddCareData) => void
  defaultPetId?: string
}

// ── Constants ───────────────────────────────────────────
const CARE_EMOJIS = [
  '🍽️','💧','🏃','✂️','🧹','🛁','💊','🩺','🏠','🎾',
  '🛏️','🧴','🦮','🐾','🌿','🥣','🦴','❤️','⚽','🎀',
]
const PERIODS = [
  { val: 'day',   label: 'Por día'    },
  { val: 'week',  label: 'Por semana' },
  { val: 'month', label: 'Por mes'    },
]
const PET_EMOJI: Record<string, string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill" style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

export default function AddCareModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const [petId,    setPetId]    = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [emoji,    setEmoji]    = useState('🍽️')
  const [title,    setTitle]    = useState('')
  const [total,    setTotal]    = useState('1')
  const [period,   setPeriod]   = useState('day')
  const [quantity, setQuantity] = useState('')
  const [notify,   setNotify]   = useState(true)
  const [titleErr, setTitleErr] = useState('')
  const [success,  setSuccess]  = useState(false)

  const reset = () => {
    setTitle(''); setQuantity(''); setTitleErr('')
    setEmoji('🍽️'); setTotal('1'); setPeriod('day'); setNotify(true)
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!title.trim()) { setTitleErr('El nombre del cuidado es obligatorio'); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, emoji, title: title.trim(), total: Number(total) || 1, period, quantity, notify })
      showToast(`${emoji} Cuidado "${title.trim()}" añadido`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const selectedPet = MOCK_PETS.find(p => p.id === petId)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon="🐾"
      accentBg="var(--success-hl)"
      accentFg="var(--success)"
      footer={!success ? (
        <>
<PfFooter>
  <PfBtn variant="save" onClick={handleSubmit}>Añadir cuidado</PfBtn>
</PfFooter>
        </>
      ) : <></>}
    >
{/* Hero */}
<div className="modal-hero" style={{ background: 'linear-gradient(135deg,var(--success-hl),var(--surface))' }}>
  <div className="modal-hero-icon" style={{ background: 'var(--success)', fontSize: '1.5rem' }}>{emoji}</div>
  <div style={{ flex: 1 }}>
    <div className="modal-hero-title">Nuevo cuidado</div>
    <div className="modal-hero-sub">
      Rutina para <strong>{selectedPet?.name ?? '—'}</strong>
    </div>
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
          <div className="modal-success-title">¡Cuidado añadido!</div>
          <div className="modal-success-sub">{emoji} <strong>{title}</strong> ya aparece en la rutina</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">Mascota</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns: `repeat(${MOCK_PETS.length},1fr)`, marginBottom: '1rem' }}>
            {MOCK_PETS.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId === p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Care identity */}
          <div className="modal-section">Cuidado</div>

          <div className="form-group">
            <label className="form-label">Ícono</label>
            <div className="emoji-picker-grid">
              {CARE_EMOJIS.map(e => (
                <button key={e} type="button"
                  className={['emoji-pick-btn', emoji === e ? 'active' : ''].join(' ')}
                  onClick={() => setEmoji(e)}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <div className="field-icon-wrap">
              <span className="field-icon" style={{ fontSize: '1rem' }}>{emoji}</span>
              <input
                className={['form-input', titleErr ? 'form-input--err' : ''].join(' ')}
                placeholder="Ej: Alimentación, Paseo, Cepillado…"
                value={title}
                onChange={e => { setTitle(e.target.value); setTitleErr('') }}
                autoFocus
              />
            </div>
            {titleErr && <span className="form-hint-err">{titleErr}</span>}
          </div>

          {/* Frequency */}
          <div className="modal-section">Frecuencia</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Veces</label>
              <input className="form-input" type="number" min="1" max="10"
                value={total} onChange={e => setTotal(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Período</label>
              <select className="form-input" value={period} onChange={e => setPeriod(e.target.value)}>
                {PERIODS.map(p => <option key={p.val} value={p.val}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">
              Cantidad o dosis <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span>
            </label>
            <div className="field-icon-wrap">
              <span className="field-icon">⚖️</span>
              <input className="form-input" placeholder="Ej: 80g, 200ml, 2 cucharadas…"
                value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
          </div>

          {/* Preferences */}
          <div className="modal-section">Preferencias</div>
          <div className="toggle-row">
            <div className="toggle-row-info">
              <div className="toggle-row-label">🔔 Notificaciones</div>
              <div className="toggle-row-sub">Recordatorio a la hora del cuidado</div>
            </div>
            <Toggle on={notify} onChange={setNotify} />
          </div>
        </>
      )}
    </Modal>
  )
}
