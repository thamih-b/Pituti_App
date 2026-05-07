// traduzio e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface SymptomData {
  petId:       string
  description: string
  category:    string
  severity:    string
  date:        string
  notes:       string
}

interface Props {
  isOpen:        boolean
  onClose:       () => void
  onAdd:         (d: SymptomData) => void
  defaultPetId?: string
}

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

const CAT_ICONS: Record<string, string> = {
  digestivo:'🤢', respiratorio:'🫁', piel:'🩹',
  comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓',
}

const SEV_ICON: Record<string, string> = {
  leve:'🟡', moderado:'🟠', grave:'🔴', emergencia:'🚨',
}
const SEV_BG: Record<string, string> = {
  leve:'var(--gold-hl)', moderado:'var(--warn-hl)',
  grave:'var(--err-hl)', emergencia:'rgba(200,64,106,.25)',
}
const SEV_FG: Record<string, string> = {
  leve:'var(--gold)', moderado:'var(--warn)',
  grave:'var(--err)', emergencia:'var(--err)',
}

export default function RegisterSymptomModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t }    = useTranslation()
  const { pets } = usePetsContext()

  // ✅ labels traduzidos dentro do componente
  const CATEGORIES = [
    { val:'digestivo',      label: t('symptoms.categoryOptions.digestivo')      },
    { val:'respiratorio',   label: t('symptoms.categoryOptions.respiratorio')   },
    { val:'piel',           label: t('symptoms.categoryOptions.piel')           },
    { val:'comportamiento', label: t('symptoms.categoryOptions.comportamiento') },
    { val:'movimiento',     label: t('symptoms.categoryOptions.movimiento')     },
    { val:'ocular',         label: t('symptoms.categoryOptions.ocular')         },
    { val:'otro',           label: t('symptoms.categoryOptions.otro')           },
  ]

  const SEVERITIES = [
    { val:'leve',       label: t('symptoms.severityOptions.leve'),       sub: t('symptoms.severitySub.leve')       },
    { val:'moderado',   label: t('symptoms.severityOptions.moderado'),   sub: t('symptoms.severitySub.moderado')   },
    { val:'grave',      label: t('symptoms.severityOptions.grave'),      sub: t('symptoms.severitySub.grave')      },
    { val:'emergencia', label: t('symptoms.severityOptions.emergencia'), sub: t('symptoms.severitySub.emergencia') },
  ]

  const today = new Date().toISOString().split('T')[0]

  const [petId,       setPetId]       = useState(defaultPetId ?? pets[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('digestivo')
  const [severity,    setSeverity]    = useState('leve')
  const [date,        setDate]        = useState(today)
  const [notes,       setNotes]       = useState('')
  const [descErr,     setDescErr]     = useState('')
  const [success,     setSuccess]     = useState(false)

  const reset = () => {
    setDescription(''); setCategory('digestivo'); setSeverity('leve')
    setDate(today); setNotes(''); setDescErr('')
  }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!description.trim()) { setDescErr(t('symptoms.errDescription')); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, description: description.trim(), category, severity, date, notes })
      showToast(`${SEV_ICON[severity] ?? '🌡️'} ${t('pet.symptoms.toastAdded')}`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet         = pets.find(p => p.id === petId)
  const selSevLabel = SEVERITIES.find(s => s.val === severity)?.label ?? ''

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('symptoms.register')}
      icon="🌡️"
      accentBg="var(--err-hl)"
      accentFg="var(--err)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>{t('symptoms.register')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${SEV_BG[severity]},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: SEV_FG[severity], fontSize:'1.5rem' }}>
          {CAT_ICONS[category] ?? '🌡️'}
        </div>
        <div>
          <div className="modal-hero-title">{t('symptoms.register')}</div>
          <div className="modal-hero-sub">
            <strong>{pet?.name ?? '—'}</strong> · {selSevLabel}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon" style={{ background: SEV_FG[severity] }}>✓</div>
          <div className="modal-success-title">{t('pet.symptoms.toastAdded')}</div>
          <div className="modal-success-sub">
            <div className="modal-success-sub">
  {pet?.name && `${pet.name} · `}{t('pet.symptoms.toastAdded')}
</div>
          </div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
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

          {/* Descrição */}
          <div className="modal-section">{t('symptoms.description')}</div>
          <div className="form-group">
            <label className="form-label">{t('symptoms.whatObserved')} *</label>
            <div className={['form-input', descErr ? 'form-input--err' : ''].join(' ')}
              style={{ padding:0, border: descErr ? '1.5px solid var(--err)' : undefined }}>
              <textarea
                style={{ width:'100%', padding:'.55rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:88, color:'var(--text)' }}
                placeholder={t('symptoms.descriptionPh')}
                value={description}
                onChange={e => { setDescription(e.target.value); setDescErr('') }}
                autoFocus
              />
            </div>
            {descErr && <span className="form-hint-err">{descErr}</span>}
          </div>

          {/* Categoria */}
          <div className="modal-section">{t('symptoms.category')}</div>
          <div className="symptom-cat-grid">
            {CATEGORIES.map(c => (
              <button key={c.val} type="button"
                className={['symptom-cat-btn', category===c.val ? 'active' : ''].join(' ')}
                onClick={() => setCategory(c.val)}>
                <span style={{ fontSize:'1.2rem' }}>{CAT_ICONS[c.val]}</span>
                <span style={{ fontSize:'.7rem', fontWeight:700 }}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Severidade */}
          <div className="modal-section">{t('symptoms.severity')}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.375rem', marginBottom:'1rem' }}>
            {SEVERITIES.map(s => (
              <button key={s.val} type="button" className="severity-btn"
                style={{ borderColor: severity===s.val ? SEV_FG[s.val] : 'var(--border)', background: severity===s.val ? SEV_BG[s.val] : 'var(--surface-offset)' }}
                onClick={() => setSeverity(s.val)}>
                <span style={{ fontSize:'1.1rem' }}>{SEV_ICON[s.val]}</span>
                <div style={{ flex:1, textAlign:'left' }}>
                  <div style={{ fontWeight:800, fontSize:'.875rem', color: severity===s.val ? SEV_FG[s.val] : 'var(--text)' }}>{s.label}</div>
                  <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{s.sub}</div>
                </div>
                <div className={['mf-radio', severity===s.val ? 'checked' : ''].join(' ')}
                  style={severity===s.val ? { borderColor: SEV_FG[s.val], background: SEV_FG[s.val] } : {}}/>
              </button>
            ))}
          </div>

          {/* Data + notas */}
          <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
          <FormDateField
            label={t('symptoms.startDate')}
            value={date}
            onChange={setDate}
            max={today}
          />
          <div className="form-group" style={{ marginBottom:0, marginTop:'.75rem' }}>
            <label className="form-label">
              {t('field.notes')}{' '}
              <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
            </label>
            <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
              <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
              <textarea className="form-input" rows={2}
                placeholder={t('symptoms.notesPh')}
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