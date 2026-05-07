// traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface NoteData {
  petId: string; content: string; vet: string; date: string; type: string
}

interface Props {
  isOpen:        boolean
  onClose:       () => void
  onAdd:         (d: NoteData) => void
  defaultPetId?: string
}

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

const NOTE_TYPE_ICONS: Record<string, string> = {
  control:     '🩺',
  observacion: '👁',
  emergencia:  '🚨',
  vacuna:      '💉',
  cirugia:     '🔬',
  otro:        '📋',
}
const NOTE_TYPE_BG: Record<string, string> = {
  control:     'var(--blue-hl)',
  observacion: 'var(--primary-hl)',
  emergencia:  'var(--err-hl)',
  vacuna:      'var(--success-hl)',
  cirugia:     'var(--warn-hl)',
  otro:        'var(--surface-offset)',
}
const NOTE_TYPE_FG: Record<string, string> = {
  control:     'var(--blue)',
  observacion: 'var(--primary)',
  emergencia:  'var(--err)',
  vacuna:      'var(--success)',
  cirugia:     'var(--warn)',
  otro:        'var(--text-muted)',
}

export default function NewNoteModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t }    = useTranslation()
  const { pets } = usePetsContext()

  // ✅ tipos traduzidos dentro do componente para reagir ao idioma
  const NOTE_TYPES = [
    { val:'control',     label: t('notes.typeOptions.control')     },
    { val:'observacion', label: t('notes.typeOptions.observacion') },
    { val:'emergencia',  label: t('notes.typeOptions.emergencia')  },
    { val:'vacuna',      label: t('notes.typeOptions.vacuna')      },
    { val:'cirugia',     label: t('notes.typeOptions.cirugia')     },
    { val:'otro',        label: t('notes.typeOptions.otro')        },
  ]

  const today = new Date().toISOString().split('T')[0]

  const [petId,   setPetId]   = useState(defaultPetId ?? pets[0]?.id ?? '')
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [type,    setType]    = useState('control')
  const [contErr, setContErr] = useState('')
  const [success, setSuccess] = useState(false)

  const reset = () => { setContent(''); setVet(''); setDate(today); setType('control'); setContErr('') }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!content.trim()) { setContErr(t('notes.errContent')); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, content: content.trim(), vet: vet.trim(), date, type })
      showToast(`${NOTE_TYPE_ICONS[type] ?? '📋'} ${t('pet.notes.toastAdded')}`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet      = pets.find(p => p.id === petId)
  const selLabel = NOTE_TYPES.find(n => n.val === type)?.label ?? ''
  const selIcon  = NOTE_TYPE_ICONS[type] ?? '📋'

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
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>{t('notes.new')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>
          {selIcon}
        </div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('notes.new')}</div>
          <div className="modal-hero-sub">
            {selLabel} · <strong>{pet?.name ?? '—'}</strong>
          </div>
        </div>
        <button className="pm-close" onClick={handleClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('pet.notes.toastAdded')}</div>
          <div className="modal-success-sub">
            {new Date(date+'T12:00:00').toLocaleDateString(t('dates.locale'))}
          </div>
        </div>
      ) : (
        <>
          {/* Pet */}
          <div className="modal-section">{t('cares.add.sectionPet')}</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${pets.length},1fr)`, marginBottom:'1rem' }}>
            {pets.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Tipo de nota */}
          <div className="modal-section">{t('notes.type')}</div>
          <div className="note-type-grid">
            {NOTE_TYPES.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type===n.val ? 'active' : ''].join(' ')}
                style={type===n.val ? { background: NOTE_TYPE_BG[n.val], borderColor: NOTE_TYPE_FG[n.val], color: NOTE_TYPE_FG[n.val] } : {}}
                onClick={() => setType(n.val)}>
                <span style={{ fontSize:'1.1rem' }}>{NOTE_TYPE_ICONS[n.val]}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          <div className="modal-section">{t('notes.content')}</div>
          <div className="form-group">
            <label className="form-label">{t('field.notes')} *</label>
            <div className={['form-input', contErr ? 'form-input--err' : ''].join(' ')} style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                placeholder={t('notes.addHint')}
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Veterinário + data */}
          <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">
                {t('field.vet')}{' '}
                <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
              </label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input"
                  placeholder={t('vet.appointments.vetNamePh')}
                  value={vet}
                  onChange={e => setVet(e.target.value)}/>
              </div>
            </div>
            <FormDateField
              label={t('field.date')}
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