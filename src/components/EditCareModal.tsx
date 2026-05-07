// traduzido e sem mock

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface CareEditData {
  id:               string
  emoji:            string
  title:            string
  total:            number
  recurrenceType?:  'daily' | 'everyXDays' | 'everyXHours'
  recurrenceValue?: number
  quantity:         string
  notify:           boolean
  time?:            string
  recurring?:       boolean
  bg:               string
  period?:          string
  intervalDays?:    number
}

interface Props {
  isOpen:    boolean
  onClose:   () => void
  care:      CareEditData | null
  onSave:    (updated: CareEditData) => void
  onDelete?: (id: string) => void
}

const CARE_EMOJIS = [
  '🍽️','💧','🪮','🦮','🏃','🛁','💊','💉','🧴','🪥',
  '🐾','🌿','🪺','🐟','🐇','🐦','🧸','🩺','⏰','📅',
]

function inferRecurrence(care: CareEditData): {
  type:  'daily' | 'everyXDays' | 'everyXHours'
  value: number
} {
  if (care.recurrenceType) return { type: care.recurrenceType, value: care.recurrenceValue ?? 1 }
  const days = care.intervalDays ?? 1
  if (days < 1) return { type: 'everyXHours', value: Math.max(1, Math.round(days * 24)) }
  if (days === 1) return { type: 'daily', value: 1 }
  return { type: 'everyXDays', value: days }
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }}/>
    </button>
  )
}

export default function EditCareModal({ isOpen, onClose, care, onSave, onDelete }: Props) {
  const { t } = useTranslation()

  // ✅ RECURRENCE_OPTS dentro do componente para reagir ao idioma
  const RECURRENCE_OPTS = [
    { val: 'daily'       as const, icon: '📅', label: t('cares.edit.recDaily')    },
    { val: 'everyXDays'  as const, icon: '🗓️', label: t('cares.edit.recXDays')   },
    { val: 'everyXHours' as const, icon: '⏰', label: t('cares.edit.recXHours')  },
  ]

  const [emoji,         setEmoji        ] = useState('')
  const [title,         setTitle        ] = useState('')
  const [total,         setTotal        ] = useState('1')
  const [recType,       setRecType      ] = useState<'daily' | 'everyXDays' | 'everyXHours'>('daily')
  const [recValue,      setRecValue     ] = useState(1)
  const [quantity,      setQuantity     ] = useState('')
  const [notify,        setNotify       ] = useState(true)
  const [titleErr,      setTitleErr     ] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

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
    if (!title.trim()) { setTitleErr(t('vet.contacts.errName')); return }
    const rv = Math.max(1, Number(recValue) || 1)
    const intervalDays =
      recType === 'daily'      ? 1  :
      recType === 'everyXDays' ? rv :
      rv / 24

    onSave({
      ...care,
      emoji,
      title:           title.trim(),
      total:           Math.max(1, Number(total) || 1),
      recurrenceType:  recType,
      recurrenceValue: rv,
      quantity,
      notify,
      period:      recType === 'daily' ? 'day' : 'custom',
      intervalDays,
    })
    showToast(`${emoji} ${title.trim()} — ${t('toast.careUpdated')}`)
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete?.(care.id)
    showToast(`🗑️ ${t('toast.careDeleted')}`)
    onClose()
  }

  const pillStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '.35rem',
    padding: '.5rem .875rem', borderRadius: 'var(--r-full)',
    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background: active ? 'var(--primary-hl)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: active ? 700 : 500, fontSize: '.8125rem',
    cursor: 'pointer', transition: 'all var(--trans)',
    whiteSpace: 'nowrap' as const, fontFamily: 'inherit',
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
              {confirmDelete ? t('btn.confirmDelete') : t('btn.delete')}
            </PfBtn>
          </PfFooter>
          <PfFooter>
            <PfBtn variant="save" onClick={handleSave} style={{ minWidth:0 }}>
              {t('btn.saveChanges')}
            </PfBtn>
          </PfFooter>
        </div>
      }
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--primary-hl),var(--surface))', position:'relative' }}>
        <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>{emoji}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('cares.edit.title')}</div>
          <div className="modal-hero-sub">{care.title}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Emoji */}
      <div className="modal-section">{t('cares.edit.sectionIcon')}</div>
      <div className="emoji-picker-grid" style={{ marginBottom:'.875rem' }}>
        {CARE_EMOJIS.map(e => (
          <button key={e} type="button"
            className={['emoji-pick-btn', emoji===e ? 'active' : ''].join(' ')}
            onClick={() => setEmoji(e)}>{e}
          </button>
        ))}
      </div>

      {/* Nome */}
      <div className="modal-section">{t('field.name')}</div>
      <div className="form-group">
        <div className={['mf-input-wrap', titleErr ? 'mf-input-wrap--err' : ''].join(' ')}>
          <span className="mf-prefix">{emoji}</span>
          <input className="mf-input"
            value={title}
            onChange={e => { setTitle(e.target.value); setTitleErr('') }}
            placeholder={t('cares.edit.namePh')}
            autoFocus/>
        </div>
        {titleErr && <span className="mf-err">{titleErr}</span>}
      </div>

      {/* Recorrência */}
      <div className="modal-section">{t('cares.edit.sectionRecurrence')}</div>
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'.875rem' }}>
        {RECURRENCE_OPTS.map(opt => (
          <button key={opt.val} type="button"
            style={pillStyle(recType === opt.val)}
            onClick={() => setRecType(opt.val)}>
            <span style={{ fontSize:'.95rem' }}>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {(recType === 'everyXDays' || recType === 'everyXHours') && (
        <div className="form-group" style={{ marginBottom:'.875rem' }}>
          <label className="form-label">
            {recType === 'everyXDays'
              ? t('cares.edit.intervalDays')
              : t('cares.edit.intervalHours')}
          </label>
          <div style={{ display:'flex', alignItems:'center', gap:'.625rem' }}>
            <input className="form-input" type="number"
              min={1} max={recType === 'everyXHours' ? 168 : 365}
              value={recValue}
              onChange={e => setRecValue(Math.max(1, Number(e.target.value) || 1))}
              style={{ width:90, textAlign:'center', fontWeight:700, fontSize:'1.1rem' }}/>
            <span style={{ color:'var(--text-muted)', fontSize:'.875rem', fontWeight:600 }}>
              {recType === 'everyXDays'
                ? t('cares.schedule.days')
                : t('cares.edit.hours')}
            </span>
            <span style={{
              marginLeft:'auto', fontSize:'.75rem', color:'var(--primary)',
              background:'var(--primary-hl)', padding:'.2rem .5rem',
              borderRadius:'var(--r-full)', fontWeight:700,
            }}>
              {recType === 'everyXDays'
                ? t('cares.edit.previewDays', { n: recValue })
                : t('cares.edit.previewHours', { n: recValue })}
            </span>
          </div>
        </div>
      )}

      {recType === 'daily' && (
        <div className="form-group" style={{ marginBottom:'.875rem' }}>
          <label className="form-label">{t('cares.edit.timesPerDay')}</label>
          <input className="form-input" type="number" min={1} max={10}
            value={total} onChange={e => setTotal(e.target.value)}
            style={{ maxWidth:90 }}/>
        </div>
      )}

      {/* Quantidade */}
      <div className="form-group" style={{ marginTop:'.25rem' }}>
        <label className="form-label">
          {t('cares.edit.quantity')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
        </label>
        <div className="field-icon-wrap">
          <span className="field-icon">⚖️</span>
          <input className="form-input"
            placeholder={t('cares.edit.quantityPh')}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}/>
        </div>
      </div>

      {/* Notificações */}
      <div className="modal-section">{t('cares.edit.sectionPrefs')}</div>
      <div className="toggle-row">
        <div className="toggle-row-info">
          <div className="toggle-row-label">{t('cares.edit.notifyLabel')}</div>
          <div className="toggle-row-sub">{t('cares.edit.notifySub')}</div>
        </div>
        <Toggle on={notify} onChange={setNotify}/>
      </div>
    </Modal>
  )
}