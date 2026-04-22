import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import FormDateField from './FormDateField'
import { showToast } from './AppLayout'

export interface MedRecord {
  id:        string
  icon:      string
  title:     string
  dose:      string
  frequency: string
  startDate: string
  endDate:   string
  notes:     string
  bg:        string
  color:     string
  badge:     string
  badgeCls:  string
  archived:  boolean
}

interface Props {
  isOpen:   boolean
  onClose:  () => void
  med:      MedRecord | null
  onSave:   (updated: MedRecord) => void
  onDelete: (id: string) => void
}

const FREQ_OPTIONS = ['Diaria','Cada 12 horas','Cada 8 horas','Semanal','Quincenal','Mensual','Cada 3 meses','Única dosis']
const MED_ICONS    = ['💊','💉','🩹','🧪','🫙','🌡️','🩺']

export default function EditMedModal({ isOpen, onClose, med, onSave, onDelete }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [icon,      setIcon]      = useState('💊')
  const [title,     setTitle]     = useState('')
  const [dose,      setDose]      = useState('')
  const [frequency, setFrequency] = useState('Diaria')
  const [startDate, setStartDate] = useState(today)
  const [endDate,   setEndDate]   = useState('')
  const [notes,     setNotes]     = useState('')
  const [errors,    setErrors]    = useState<Record<string,string>>({})
  const [confirmDel, setConfirmDel] = useState(false)

  useEffect(() => {
    if (med && isOpen) {
      setIcon(med.icon || '💊')
      setTitle(med.title)
      setDose(med.dose || '')
      setFrequency(med.frequency || 'Diaria')
      setStartDate(med.startDate || today)
      setEndDate(med.endDate || '')
      setNotes(med.notes || '')
      setErrors({})
      setConfirmDel(false)
    }
  }, [med, isOpen])

  if (!med) return null

  const validate = () => {
    const e: Record<string,string> = {}
    if (!title.trim()) e.title = 'El nombre es obligatorio'
    if (!dose.trim())  e.dose  = 'Indica la dosis'
    return e
  }

  const handleSave = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return }
    onSave({ ...med, icon, title: title.trim(), dose: dose.trim(), frequency, startDate, endDate, notes })
    showToast(`${icon} ${title.trim()} actualizado`)
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDel) { setConfirmDel(true); return }
    onDelete(med.id); onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon=""
      accentBg="var(--warn-hl)"
      accentFg="var(--warn)"
      size="md"
      footer={
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', gap:'.5rem' }}>
          <Button variant="danger" onClick={handleDelete} style={{ minWidth:0 }}>
            {confirmDel ? '¿Confirmar eliminar?' : '🗑 Eliminar'}
          </Button>
          <div style={{ display:'flex', gap:'.5rem' }}>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      }
    >
   <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--warn-hl),var(--surface))' }}>
    <div className="modal-hero-icon" style={{ background:'var(--warn)', fontSize:'1.5rem' }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div className="modal-hero-title">Editar medicamento</div>
      <div className="modal-hero-sub">{med.title}</div>
    </div>
    <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>

      {/* Icon */}
      <div className="modal-section">Tipo</div>
      <div style={{ display:'flex', gap:'.375rem', marginBottom:'1rem' }}>
        {MED_ICONS.map(ic => (
          <button key={ic} type="button"
            className={['emoji-pick-btn', icon===ic?'active':''].join(' ')}
            style={{ width:38, height:38, fontSize:'1.1rem' }}
            onClick={() => setIcon(ic)}>{ic}</button>
        ))}
      </div>

      {/* Name + Dose */}
      <div className="modal-section">Medicamento</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <div className="field-icon-wrap">
            <span className="field-icon" style={{ fontSize:'1rem' }}>{icon}</span>
            <input className={['form-input', errors.title?'form-input--err':''].join(' ')}
              value={title} onChange={e => { setTitle(e.target.value); setErrors(v=>({...v,title:''})) }} autoFocus/>
          </div>
          {errors.title && <span className="form-hint-err">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Dosis *</label>
          <div className="field-icon-wrap">
            <span className="field-icon">⚖️</span>
            <input className={['form-input', errors.dose?'form-input--err':''].join(' ')}
              value={dose} onChange={e => { setDose(e.target.value); setErrors(v=>({...v,dose:''})) }}/>
          </div>
          {errors.dose && <span className="form-hint-err">{errors.dose}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Frecuencia</label>
        <div className="field-icon-wrap">
          <span className="field-icon">🔄</span>
          <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
            {FREQ_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="modal-section">Período</div>
      <div className="form-row">
        <FormDateField label="Inicio" value={startDate} onChange={setStartDate} />
        <FormDateField label="Fin (opcional)" value={endDate} onChange={setEndDate} min={startDate} hint="Dejar vacío si continuo" />
      </div>

      {/* Notes */}
      <div className="modal-section">Notas</div>
      <div className="form-group" style={{ marginBottom:0 }}>
        <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
          <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
          <textarea className="form-input" rows={2}
            placeholder="Instrucciones del veterinario, observaciones…"
            value={notes} onChange={e => setNotes(e.target.value)}
            style={{ resize:'vertical', minHeight:60, fontFamily:'inherit', border:'none' }}/>
        </div>
      </div>
    </Modal>
  )
}
