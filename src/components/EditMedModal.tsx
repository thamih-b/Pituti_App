// Traduzido e sem mock

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import Button from './Button'
import FormDateField from './FormDateField'
import { showToast } from './AppLayout'

// ✅ petId adicionado ao tipo
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
  petId:     string
}

interface Props {
  isOpen:   boolean
  onClose:  () => void
  med:      MedRecord | null
  onSave:   (updated: MedRecord) => void
  onDelete: (id: string) => void
}

const MED_ICONS = ['💊','💉','🩹','🧪','🫙','🌡️','🩺']

export default function EditMedModal({ isOpen, onClose, med, onSave, onDelete }: Props) {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  // ✅ valores de `frequency` alinhados com as chaves do contexto (daily, weekly…)
  const FREQ_OPTIONS = [
    { value: 'daily',    label: t('medications.freq.daily')     },
    { value: 'every12h', label: t('medications.freq.every12h')  },
    { value: 'every8h',  label: t('medications.freq.every8h')   },
    { value: 'weekly',   label: t('medications.freq.weekly')    },
    { value: 'biweekly', label: t('medications.freq.biweekly')  },
    { value: 'monthly',  label: t('medications.freq.monthly')   },
    { value: 'every3m',  label: t('medications.freq.every3m')   },
    { value: 'single',   label: t('medications.freq.single')    },
  ]

  const [icon,       setIcon]       = useState('💊')
  const [title,      setTitle]      = useState('')
  const [dose,       setDose]       = useState('')
  const [frequency,  setFrequency]  = useState('daily')
  const [startDate,  setStartDate]  = useState(today)
  const [endDate,    setEndDate]    = useState('')
  const [notes,      setNotes]      = useState('')
  const [errors,     setErrors]     = useState<Record<string,string>>({})
  const [confirmDel, setConfirmDel] = useState(false)

  useEffect(() => {
    if (med && isOpen) {
      setIcon(med.icon || '💊')
      setTitle(med.title)
      setDose(med.dose || '')
      setFrequency(med.frequency || 'daily')
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
    if (!title.trim()) e.title = t('medications.edit.errName')
    if (!dose.trim())  e.dose  = t('medications.edit.errDose')
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ ...med, icon, title: title.trim(), dose: dose.trim(), frequency, startDate, endDate, notes })
    showToast(`${icon} ${title.trim()} — ${t('toast.medSaved')}`)
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
            {confirmDel ? t('btn.confirmDelete') : t('btn.delete')}
          </Button>
          <div style={{ display:'flex', gap:'.5rem' }}>
            <Button variant="ghost" onClick={onClose}>{t('btn.cancel')}</Button>
            <Button onClick={handleSave}>{t('btn.save')}</Button>
          </div>
        </div>
      }
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--warn-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--warn)', fontSize:'1.5rem' }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('medications.edit.title')}</div>
          <div className="modal-hero-sub">{med.title}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Tipo */}
      <div className="modal-section">{t('medications.edit.sectionType')}</div>
      <div style={{ display:'flex', gap:'.375rem', marginBottom:'1rem' }}>
        {MED_ICONS.map(ic => (
          <button key={ic} type="button"
            className={['emoji-pick-btn', icon===ic ? 'active' : ''].join(' ')}
            style={{ width:38, height:38, fontSize:'1.1rem' }}
            onClick={() => setIcon(ic)}>{ic}
          </button>
        ))}
      </div>

      {/* Nome + Dose */}
      <div className="modal-section">{t('medications.edit.sectionMed')}</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('field.name')} *</label>
          <div className="field-icon-wrap">
            <span className="field-icon" style={{ fontSize:'1rem' }}>{icon}</span>
            <input
              className={['form-input', errors.title ? 'form-input--err' : ''].join(' ')}
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(v => ({...v, title:''})) }}
              autoFocus/>
          </div>
          {errors.title && <span className="form-hint-err">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">{t('medications.dose')} *</label>
          <div className="field-icon-wrap">
            <span className="field-icon">⚖️</span>
            <input
              className={['form-input', errors.dose ? 'form-input--err' : ''].join(' ')}
              value={dose}
              onChange={e => { setDose(e.target.value); setErrors(v => ({...v, dose:''})) }}/>
          </div>
          {errors.dose && <span className="form-hint-err">{errors.dose}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('medications.frequency')}</label>
        <div className="field-icon-wrap">
          <span className="field-icon">🔄</span>
          <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
            {FREQ_OPTIONS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Período */}
      <div className="modal-section">{t('medications.startDate')} / {t('medications.endDate')}</div>
      <div className="form-row">
        <FormDateField
          label={t('medications.startDate')}
          value={startDate}
          onChange={setStartDate}
        />
        <FormDateField
          label={`${t('medications.endDate')} (${t('btn.optional')})`}
          value={endDate}
          onChange={setEndDate}
          min={startDate}
          hint={t('medications.edit.endHint')}
        />
      </div>

      {/* Notas */}
      <div className="modal-section">{t('field.notes')}</div>
      <div className="form-group" style={{ marginBottom:0 }}>
        <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
          <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
          <textarea
            className="form-input"
            rows={2}
            placeholder={t('medications.edit.notesPh')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize:'vertical', minHeight:60, fontFamily:'inherit', border:'none' }}
          />
        </div>
      </div>
    </Modal>
  )
}