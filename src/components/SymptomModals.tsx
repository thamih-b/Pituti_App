// traduzido e sem mock

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import FormDateField from './FormDateField'
import { showToast } from './AppLayout'
import { PfBtn } from '../components/FooterButtons'

export interface SymptomEntry {
  id:          string
  petId:       string
  description: string
  category:    string
  severity:    string
  date:        string
  notes:       string
  resolved:    boolean
}

// ── Lookup maps (sem labels — vêm do i18n) ─────────────────────────
const CAT_ICON:  Record<string, string> = {
  digestivo: '🤢', respiratorio: '🫁', piel: '🩹',
  comportamiento: '🧠', movimiento: '🦶', ocular: '👁', otro: '❓',
}
const SEV_COLOR: Record<string, string> = {
  leve: 'var(--gold)', moderado: 'var(--warn)', grave: 'var(--err)', emergencia: 'var(--err)',
}
const SEV_BG: Record<string, string> = {
  leve: 'var(--gold-hl)', moderado: 'var(--warn-hl)', grave: 'var(--err-hl)', emergencia: 'var(--err-hl)',
}
const PET_EMOJI: Record<string, string> = { 'pet-1': '🐱', 'pet-2': '🐶', 'pet-3': '🦜' }
const PET_NAME:  Record<string, string> = { 'pet-1': 'Luna', 'pet-2': 'Toby', 'pet-3': 'Kiwi' }

// Chaves tipadas para categorias e severidades — evita template literal dinâmico
const CAT_KEYS = ['digestivo','respiratorio','piel','comportamiento','movimiento','ocular','otro'] as const
const SEV_KEYS = ['leve','moderado','grave','emergencia'] as const

type CatKey = typeof CAT_KEYS[number]
type SevKey = typeof SEV_KEYS[number]

const SEV_STYLE: Record<SevKey, { fg: string; bg: string }> = {
  leve:       { fg: 'var(--gold)', bg: 'var(--gold-hl)'          },
  moderado:   { fg: 'var(--warn)', bg: 'var(--warn-hl)'          },
  grave:      { fg: 'var(--err)',  bg: 'var(--err-hl)'            },
  emergencia: { fg: 'var(--err)',  bg: 'rgba(200,64,106,.25)'    },
}

// ── Detail Overlay ─────────────────────────────────────────────────
interface DetailProps {
  symptom:     SymptomEntry | null
  onClose:     () => void
  onEdit:      (s: SymptomEntry) => void
  onResolve:   (id: string) => void
  onUnresolve: (id: string) => void
}

export function SymptomDetailModal({ symptom, onClose, onEdit, onResolve, onUnresolve }: DetailProps) {
  const { t, i18n } = useTranslation()
  if (!symptom) return null

  const sev = symptom.severity
  const cat = symptom.category

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div className="detail-icon"
            style={{ background: SEV_BG[sev] || 'var(--err-hl)', color: SEV_COLOR[sev] || 'var(--err)', fontSize: '1.375rem' }}>
            {CAT_ICON[cat] || '🌡️'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>
              {symptom.description.length > 50 ? symptom.description.slice(0, 50) + '…' : symptom.description}
            </div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
              {PET_EMOJI[symptom.petId]} {PET_NAME[symptom.petId]} · {t(`symptoms.categoryOptions.${cat}` as `symptoms.categoryOptions.${CatKey}`)}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="detail-body">
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className={`status-pill ${symptom.resolved ? 'resolved' : 'active'}`}>
              {symptom.resolved ? `✓ ${t('symptoms.resolved')}` : `● ${t('symptoms.active')}`}
            </span>
            <span style={{ background: SEV_BG[sev], color: SEV_COLOR[sev], border: `1.5px solid ${SEV_COLOR[sev]}`, borderRadius: 'var(--r-full)', padding: '.25rem .75rem', fontSize: '.75rem', fontWeight: 800 }}>
              {t(`symptom.severity.${sev}` as `symptoms.severityOptions.${SevKey}`)}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">{t('symptoms.fields.category')}</div>
              <div className="detail-info-value">
                {CAT_ICON[cat]} {t(`symptoms.categoryOptions.${cat}` as `symptoms.categoryOptions.${CatKey}`)}
              </div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">{t('symptoms.fields.date')}</div>
              <div className="detail-info-value">
                {new Date(symptom.date + 'T00:00:00').toLocaleDateString(i18n.language, {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-offset)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '.875rem 1rem', marginBottom: symptom.notes ? '1rem' : 0 }}>
            <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-faint)', marginBottom: '.375rem' }}>
              {t('symptoms.fields.description')}
            </div>
            <div style={{ fontSize: '.875rem', color: 'var(--text)', lineHeight: 1.6 }}>{symptom.description}</div>
          </div>

          {symptom.notes && (
            <div style={{ background: 'var(--surface-offset)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '.875rem 1rem', marginTop: '.625rem' }}>
              <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-faint)', marginBottom: '.375rem' }}>
                {t('symptoms.fields.notes')}
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{symptom.notes}</div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          <button className="btn btn-secondary" onClick={() => { onEdit(symptom); onClose() }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
            {t('btn.edit')}
          </button>
          {symptom.resolved ? (
            <button className="btn btn-warn" onClick={() => { onUnresolve(symptom.id); onClose() }}>
              ↩ {t('symptoms.reopen')}
            </button>
          ) : (
            <button className="btn btn-success" onClick={() => { onResolve(symptom.id); onClose() }}>
              ✓ {t('symptoms.markResolved')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Edit Symptom Modal ─────────────────────────────────────────────
interface EditProps {
  isOpen:    boolean
  onClose:   () => void
  symptom:   SymptomEntry | null
  onSave:    (updated: SymptomEntry) => void
  onDelete?: (id: string) => void
}

export function EditSymptomModal({ isOpen, onClose, symptom, onSave, onDelete }: EditProps) {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  const [description,   setDescription]   = useState('')
  const [category,      setCategory]      = useState<CatKey>('digestivo')
  const [severity,      setSeverity]      = useState<SevKey>('leve')
  const [date,          setDate]          = useState(today)
  const [notes,         setNotes]         = useState('')
  const [descErr,       setDescErr]       = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (symptom && isOpen) {
      setDescription(symptom.description)
      setCategory(symptom.category as CatKey)
      setSeverity(symptom.severity as SevKey)
      setDate(symptom.date)
      setNotes(symptom.notes)
      setDescErr('')
      setConfirmDelete(false)
    }
  }, [symptom, isOpen])

  if (!symptom) return null

  const selSev = SEV_STYLE[severity]

  const handleSave = () => {
    if (!description.trim()) { setDescErr(t('symptoms.errDescription')); return }
    onSave({ ...symptom, description: description.trim(), category, severity, date, notes })
    showToast(`🌡️ ${t('symptoms.toastUpdated')}`)
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete?.(symptom.id)
    showToast(`🗑 ${t('symptoms.toastDeleted')}`)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon=""
      accentBg="var(--err-hl)"
      accentFg="var(--err)"
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '.5rem' }}>
          <PfBtn variant="danger" onClick={handleDelete}>
            {confirmDelete ? t('btn.confirm') : `🗑 ${t('btn.delete')}`}
          </PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            {t('btn.saveChanges')}
          </PfBtn>
        </div>
      }
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background: `linear-gradient(135deg,${selSev.bg},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: selSev.fg, fontSize: '1.5rem' }}>
          {CAT_ICON[category]}
        </div>
        <div style={{ flex: 1 }}>
          <div className="modal-hero-title">{t('symptoms.editTitle')}</div>
          <div className="modal-hero-sub">{PET_EMOJI[symptom.petId]} {PET_NAME[symptom.petId]}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label={t('btn.closeModal')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Confirmação de eliminação */}
      {confirmDelete && (
        <div className="note-delete-confirm">
          <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--err)', marginBottom: '.35rem' }}>
            {t('symptoms.deleteConfirmTitle')}
          </div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {t('symptoms.deleteConfirmBody')}{' '}
            <button
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => setConfirmDelete(false)}>
              {t('symptoms.deleteConfirmCancel')}
            </button>.
          </div>
        </div>
      )}

      {/* Descrição */}
      <div className="modal-section">{t('symptoms.fields.description')}</div>
      <div className="form-group">
        <div className={['form-input', descErr ? 'form-input--err' : ''].join(' ')} style={{ padding: 0 }}>
          <textarea
            style={{ width: '100%', padding: '.55rem .875rem', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: '.875rem', resize: 'vertical', minHeight: 72, color: 'var(--text)' }}
            value={description}
            onChange={e => { setDescription(e.target.value); setDescErr('') }}
            autoFocus
          />
        </div>
        {descErr && <span className="form-hint-err">{descErr}</span>}
      </div>

      {/* Categoria */}
      <div className="modal-section">{t('symptoms.fields.category')}</div>
      <div className="symptom-cat-grid" style={{ marginBottom: '1rem' }}>
        {CAT_KEYS.map(key => (
          <button key={key} type="button"
            className={['symptom-cat-btn', category === key ? 'active' : ''].join(' ')}
            onClick={() => setCategory(key)}>
            <span style={{ fontSize: '1.2rem' }}>{CAT_ICON[key]}</span>
            <span style={{ fontSize: '.7rem', fontWeight: 700 }}>
              {t(`symptoms.categoryOptions.${key}`)}
            </span>
          </button>
        ))}
      </div>

      {/* Severidade */}
      <div className="modal-section">{t('symptoms.fields.severity')}</div>
      <div style={{ display: 'flex', gap: '.375rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {SEV_KEYS.map(key => {
          const s = SEV_STYLE[key]
          return (
            <button key={key} type="button"
              style={{
                flex: 1, padding: '.5rem .625rem', borderRadius: 'var(--r-lg)',
                border: `1.5px solid ${severity === key ? s.fg : 'var(--border)'}`,
                background: severity === key ? s.bg : 'var(--surface-offset)',
                cursor: 'pointer', fontWeight: 700, fontSize: '.8125rem',
                color: severity === key ? s.fg : 'var(--text-muted)',
                fontFamily: 'inherit', transition: 'all var(--trans)', minWidth: 70,
              }}
              onClick={() => setSeverity(key)}>
              {t(`symptoms.severityOptions.${key}`)}
            </button>
          )
        })}
      </div>

      {/* Data */}
      <div className="modal-section">{t('symptoms.fields.date')}</div>
      <FormDateField
        label={t('symptoms.dateLabel')}
        value={date}
        onChange={setDate}
        max={today}
      />

      {/* Notas */}
      <div className="modal-section">{t('symptoms.fields.notes')}</div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <div className="field-icon-wrap" style={{ alignItems: 'flex-start' }}>
          <span className="field-icon" style={{ paddingTop: '.55rem' }}>📝</span>
          <textarea className="form-input" rows={2}
            placeholder={t('symptoms.notesPh')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize: 'vertical', minHeight: 56, fontFamily: 'inherit', border: 'none' }}
          />
        </div>
      </div>
    </Modal>
  )
}