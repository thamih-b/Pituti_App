import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import { showToast } from './AppLayout'

export interface CareEditData {
  id:       string
  emoji:    string
  title:    string
  total:    number
  period:   string
  quantity: string
  notify:   boolean
  bg:       string
}

interface Props {
  isOpen:  boolean
  onClose: () => void
  care:    CareEditData | null
  onSave:  (updated: CareEditData) => void
  onDelete?: (id: string) => void
}

const CARE_EMOJIS = ['🍽️','💧','🏃','✂️','🧹','🛁','💊','🩺','🏠','🎾','🛏️','🧴','🦮','🐾','🌿','🥣','🦴','❤️','⚽','🎀']
const PERIODS    = [{ val:'day',label:'Por día' },{ val:'week',label:'Por semana' },{ val:'month',label:'Por mes' }]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill" style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

export default function EditCareModal({ isOpen, onClose, care, onSave, onDelete }: Props) {
  const [emoji,    setEmoji]    = useState('')
  const [title,    setTitle]    = useState('')
  const [total,    setTotal]    = useState('1')
  const [period,   setPeriod]   = useState('day')
  const [quantity, setQuantity] = useState('')
  const [notify,   setNotify]   = useState(true)
  const [titleErr, setTitleErr] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (care && isOpen) {
      setEmoji(care.emoji)
      setTitle(care.title)
      setTotal(String(care.total))
      setPeriod(care.period ?? 'day')
      setQuantity(care.quantity ?? '')
      setNotify(care.notify ?? true)
      setTitleErr('')
      setConfirmDelete(false)
    }
  }, [care, isOpen])

  if (!care) return null

  const handleSave = () => {
    if (!title.trim()) { setTitleErr('El nombre es obligatorio'); return }
    onSave({
      ...care,
      emoji, title: title.trim(), total: Number(total) || 1, period, quantity, notify,
    })
    showToast(`${emoji} ${title.trim()} actualizado`)
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete?.(care.id)
    showToast('Cuidado eliminado')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar cuidado"
      icon={emoji || '✏️'}
      accentBg="var(--primary-hl)"
      accentFg="var(--primary)"
      footer={
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', gap:'.5rem' }}>
          {onDelete && (
            <Button variant="danger" onClick={handleDelete} style={{ minWidth: 0 }}>
              {confirmDelete ? '¿Confirmar?' : '🗑 Eliminar'}
            </Button>
          )}
          <div style={{ display:'flex', gap:'.5rem', marginLeft:'auto' }}>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar cambios</Button>
          </div>
        </div>
      }
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,var(--primary-hl),var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>{emoji}</div>
        <div>
          <div className="modal-hero-title">Editar cuidado</div>
          <div className="modal-hero-sub">{care.title}</div>
        </div>
      </div>

      {/* Emoji */}
      <div className="modal-section">Ícono</div>
      <div className="emoji-picker-grid" style={{ marginBottom:'.875rem' }}>
        {CARE_EMOJIS.map(e => (
          <button key={e} type="button"
            className={['emoji-pick-btn', emoji===e?'active':''].join(' ')}
            onClick={() => setEmoji(e)}>{e}</button>
        ))}
      </div>

      {/* Name */}
      <div className="modal-section">Nombre</div>
      <div className="form-group">
        <div className={['mf-input-wrap', titleErr?'mf-input-wrap--err':''].join(' ')}>
          <span className="mf-prefix">{emoji}</span>
          <input className="mf-input" value={title}
            onChange={e => { setTitle(e.target.value); setTitleErr('') }}
            placeholder="Nombre del cuidado" autoFocus />
        </div>
        {titleErr && <span className="mf-err">{titleErr}</span>}
      </div>

      {/* Frequency */}
      <div className="modal-section">Frecuencia</div>
      <div className="form-row">
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">Veces</label>
          <input className="form-input" type="number" min="1" max="10" value={total}
            onChange={e => setTotal(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">Período</label>
          <select className="form-input" value={period} onChange={e => setPeriod(e.target.value)}>
            {PERIODS.map(p => <option key={p.val} value={p.val}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginTop:'.875rem' }}>
        <label className="form-label">Cantidad / dosis <span style={{ color:'var(--text-faint)',fontWeight:500 }}>(opcional)</span></label>
        <div className="field-icon-wrap">
          <span className="field-icon">⚖️</span>
          <input className="form-input" placeholder="Ej: 80g, 200ml…"
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
    </Modal>
  )
}
