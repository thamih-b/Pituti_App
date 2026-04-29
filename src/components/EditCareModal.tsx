import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface CareEditData {
  id:                string
  emoji:             string
  title:             string
  total:             number
  recurrenceType?:   'daily' | 'everyXDays' | 'everyXHours'   // opcional — inferido de intervalDays se ausente
  recurrenceValue?:  number                                     // X em "a cada X dias/horas"
  quantity:          string
  notify:            boolean
  time?:             string
  recurring?:        boolean
  bg:                string
  period?:           string
  intervalDays?:     number
}

interface Props {
  isOpen:    boolean
  onClose:   () => void
  care:      CareEditData | null
  onSave:    (updated: CareEditData) => void
  onDelete?: (id: string) => void
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function inferRecurrence(care: CareEditData): {
  type:  'daily' | 'everyXDays' | 'everyXHours'
  value: number
} {
  // Prefere campos novos se presentes
  if (care.recurrenceType) return { type: care.recurrenceType, value: care.recurrenceValue ?? 1 }
  const days = care.intervalDays ?? 1
  if (days < 1) {
    const h = Math.round(days * 24)
    return { type: 'everyXHours', value: Math.max(1, h) }
  }
  if (days === 1) return { type: 'daily', value: 1 }
  return { type: 'everyXDays', value: days }
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

// ── Componente principal ──────────────────────────────────────────────────────

export default function EditCareModal({ isOpen, onClose, care, onSave, onDelete }: Props) {
  const [emoji,          setEmoji        ] = useState('')
  const [title,          setTitle        ] = useState('')
  const [total,          setTotal        ] = useState('1')
  const [recType,        setRecType      ] = useState<'daily' | 'everyXDays' | 'everyXHours'>('daily')
  const [recValue,       setRecValue     ] = useState(1)
  const [quantity,       setQuantity     ] = useState('')
  const [notify,         setNotify       ] = useState(true)
  const [titleErr,       setTitleErr     ] = useState('')
  const [confirmDelete,  setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!care || !isOpen) return
    setEmoji(care.emoji)
    setTitle(care.title)
    setTotal(String(care.total))
    setQuantity(care.quantity ?? '')
    setNotify(care.notify ?? true)
    setTitleErr('')
    setConfirmDelete(false)
    const { type, value } = inferRecurrence(care)
    setRecType(type)
    setRecValue(value)
  }, [care, isOpen])

  if (!care) return null

  const handleSave = () => {
    if (!title.trim()) { setTitleErr('El nombre es obligatorio'); return }
    const rv = Math.max(1, Number(recValue) || 1)
    const intervalDays =
      recType === 'daily'       ? 1 :
      recType === 'everyXDays'  ? rv :
      rv / 24   // horas → fração de dia

    onSave({
      ...care,
      emoji,
      title:           title.trim(),
      total:           Math.max(1, Number(total) || 1),
      recurrenceType:  recType,
      recurrenceValue: rv,
      quantity,
      notify,
      period:          recType === 'daily' ? 'day' : 'custom',
      intervalDays,
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
      onClose={onClose}
      title=""
      icon="✏️"
      accentBg="var(--primary-hl)"
      accentFg="var(--primary)"
      footer={
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', gap:'.5rem' }}>
          <PfFooter>
            <PfBtn variant="danger" onClick={handleDelete} style={{ minWidth:0 }}>
              {confirmDelete ? '¿Confirmar?' : 'Eliminar'}
            </PfBtn>
          </PfFooter>
          <PfFooter>
            <PfBtn variant="save" onClick={handleSave} style={{ minWidth:0 }}>
              Guardar cambios
            </PfBtn>
          </PfFooter>
        </div>
      }
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--primary-hl),var(--surface))', position:'relative' }}>
        <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>{emoji}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">Editar cuidado</div>
          <div className="modal-hero-sub">{care.title}</div>
        </div>
        <button
          className="pm-close"
          onClick={onClose}
          aria-label="Cerrar modal"
          title="Cerrar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Emoji */}
      <div className="modal-section">Icono</div>
      <div className="emoji-picker-grid" style={{ marginBottom:'.875rem' }}>
        {CARE_EMOJIS.map(e => (
          <button key={e} type="button"
            className={['emoji-pick-btn', emoji === e ? 'active' : ''].join(' ')}
            onClick={() => setEmoji(e)}
          >{e}</button>
        ))}
      </div>

      {/* Nombre */}
      <div className="modal-section">Nombre</div>
      <div className="form-group">
        <div className={['mf-input-wrap', titleErr ? 'mf-input-wrap--err' : ''].join(' ')}>
          <span className="mf-prefix">{emoji}</span>
          <input
            className="mf-input"
            value={title}
            onChange={e => { setTitle(e.target.value); setTitleErr('') }}
            placeholder="Nombre del cuidado"
            autoFocus
          />
        </div>
        {titleErr && <span className="mf-err">{titleErr}</span>}
      </div>

      {/* ── Recurrencia — Pills ───────────────────────────────────────────── */}
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

      {/* ── X input — só aparece para everyXDays / everyXHours ──────────── */}
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
              marginLeft:'auto', fontSize:'.75rem', color:'var(--primary)',
              background:'var(--primary-hl)', padding:'.2rem .5rem',
              borderRadius:'var(--r-full)', fontWeight:700,
            }}>
              {recType === 'everyXDays'
                ? `📅 cada ${recValue} día${recValue !== 1 ? 's' : ''}`
                : `⏰ cada ${recValue}h`}
            </span>
          </div>
        </div>
      )}

      {/* ── Veces por día — só quando 'daily' ───────────────────────────── */}
      {recType === 'daily' && (
        <div className="form-group" style={{ marginBottom:'.875rem' }}>
          <label className="form-label">Veces al día</label>
          <input
            className="form-input"
            type="number"
            min={1}
            max={10}
            value={total}
            onChange={e => setTotal(e.target.value)}
            style={{ maxWidth:90 }}
          />
        </div>
      )}

      {/* Cantidad / dosis */}
      <div className="form-group" style={{ marginTop:'.25rem' }}>
        <label className="form-label">
          Cantidad / dosis{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:500 }}>opcional</span>
        </label>
        <div className="field-icon-wrap">
          <span className="field-icon">⚖️</span>
          <input
            className="form-input"
            placeholder="Ej. 80g, 200ml, 1 comp."
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
    </Modal>
  )
}
