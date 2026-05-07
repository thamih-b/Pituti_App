// traduzido sem mock

import { useState, useEffect } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { usePetsContext } from '../context/PetsContext'
import { useVet, type VetAppointment } from '../context/VetContext'
import { useTranslation } from 'react-i18next'

// ─── APPOINTMENT TYPES ────────────────────────────────────────────────────────

export const APPOINTMENT_TYPES = [
  { value: 'routine',    key: 'routine',    emoji: '🩺', color: 'var(--primary)'    },
  { value: 'emergency',  key: 'emergency',  emoji: '🚨', color: 'var(--err)'        },
  { value: 'specialist', key: 'specialist', emoji: '🔬', color: 'var(--blue)'       },
  { value: 'followup',   key: 'followup',   emoji: '🔄', color: 'var(--warn)'       },
  { value: 'exam',       key: 'exam',       emoji: '🧪', color: 'var(--purple)'     },
  { value: 'vaccine',    key: 'vaccine',    emoji: '💉', color: 'var(--success)'    },
  { value: 'other',      key: 'other',      emoji: '📋', color: 'var(--text-muted)' },
] as const

type ApptType = typeof APPOINTMENT_TYPES[number]['value']

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🐦', rabbit:'🐰', reptile:'🦎', fish:'🐠', other:'🐾',
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen:       boolean
  onClose:      () => void
  onSave:       (a: Omit<VetAppointment, 'id'>) => void
  onUpdate:     (a: VetAppointment) => void
  initial:      VetAppointment | null
  defaultPetId: string
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AddEditAppointmentModal({
  isOpen, onClose, onSave, onUpdate, initial, defaultPetId,
}: Props) {
  const isEdit = !!initial
  const { vets } = useVet()
  const { t } = useTranslation()
  const { pets } = usePetsContext()

  const [petId,        setPetId]        = useState(defaultPetId)
  const [type,         setType]         = useState<ApptType>('routine')
  const [date,         setDate]         = useState('')
  const [vetContactId, setVetContactId] = useState('')
  const [vetName,      setVetName]      = useState('')
  const [clinic,       setClinic]       = useState('')
  const [reason,       setReason]       = useState('')
  const [diagnosis,    setDiagnosis]    = useState('')
  const [treatment,    setTreatment]    = useState('')
  const [nextDate,     setNextDate]     = useState('')
  const [nextNote,     setNextNote]     = useState('')
  const [weightKg,     setWeightKg]     = useState('')
  const [notes,        setNotes]        = useState('')
  const [reasonErr,    setReasonErr]    = useState('')
  const [vetNameErr,   setVetNameErr]   = useState('')
  const [dateErr,      setDateErr]      = useState('')

  useEffect(() => {
    if (initial) {
      setPetId(initial.petId)
      setType((initial.type as ApptType) ?? 'routine')
      setDate(initial.date)
      setVetContactId(initial.vetContactId ?? '')
      setVetName(initial.vetName)
      setClinic(initial.clinic ?? '')
      setReason(initial.reason)
      setDiagnosis(initial.diagnosis ?? '')
      setTreatment(initial.treatment ?? '')
      setNextDate(initial.nextAppointmentDate ?? '')
      setNextNote(initial.nextAppointmentNote ?? '')
      setWeightKg(initial.weightKg != null ? String(initial.weightKg) : '')
      setNotes(initial.notes ?? '')
    } else {
      setPetId(defaultPetId)
      setType('routine')
      setDate(new Date().toISOString().split('T')[0])
      setVetContactId(''); setVetName(''); setClinic('')
      setReason(''); setDiagnosis(''); setTreatment('')
      setNextDate(''); setNextNote(''); setWeightKg(''); setNotes('')
    }
    setReasonErr(''); setVetNameErr(''); setDateErr('')
  }, [initial, isOpen, defaultPetId])

  useEffect(() => {
    if (!vetContactId) return
    const vet = vets.find(v => v.id === vetContactId)
    if (vet) { setVetName(vet.name); setClinic(vet.clinic) }
  }, [vetContactId, vets])

  const validate = () => {
    let ok = true
    if (!reason.trim())  { setReasonErr(t('vet.appointments.errReason'));  ok = false }
    if (!vetName.trim()) { setVetNameErr(t('vet.appointments.errVetName')); ok = false }
    if (!date)           { setDateErr(t('vet.appointments.errDate'));       ok = false }
    return ok
  }

  const handleSave = () => {
    if (!validate()) return
    const now = new Date().toISOString()
    const data: Omit<VetAppointment, 'id'> = {
      petId, type, date,
      createdAt:           initial?.createdAt ?? now,
      vetContactId:        vetContactId  || undefined,
      vetName:             vetName.trim(),
      clinic:              clinic.trim() || undefined,
      reason:              reason.trim(),
      diagnosis:           diagnosis.trim()  || undefined,
      treatment:           treatment.trim()  || undefined,
      nextAppointmentDate: nextDate          || undefined,
      nextAppointmentNote: nextNote.trim()   || undefined,
      weightKg:            weightKg ? parseFloat(weightKg) : undefined,
      notes:               notes.trim()      || undefined,
    }
    if (isEdit && initial) onUpdate({ ...data, id: initial.id })
    else onSave(data)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t('vet.appointments.titleEdit') : t('vet.appointments.titleAdd')}
      icon="📋"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>{t('btn.cancel')}</PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            {isEdit ? t('vet.appointments.update') : t('vet.appointments.register')}
          </PfBtn>
        </PfFooter>
      }
    >
      {/* ── Mascota ── */}
      <div className="modal-section">{t('field.vet')}</div>
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1rem' }}>
        {pets.map(p => (
          <button key={p.id} type="button"
            className={`btn btn-sm ${petId === p.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPetId(p.id)}>
            {PET_EMOJI[p.species ?? ''] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      {/* ── Tipo ── */}
      <div className="modal-section">{t('vet.appointments.addBtn')}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'.5rem', marginBottom:'1rem' }}>
        {APPOINTMENT_TYPES.map(appt => (
          <button key={appt.value} type="button" onClick={() => setType(appt.value)}
            style={{
              padding:'.5rem .75rem', borderRadius:'var(--r-md)', cursor:'pointer',
              fontFamily:'inherit', fontWeight:700, fontSize:'.8rem',
              border:`1.5px solid ${type === appt.value ? appt.color : 'var(--border)'}`,
              background: type === appt.value
                ? `color-mix(in oklab, ${appt.color} 10%, var(--surface))`
                : 'var(--surface)',
              display:'flex', alignItems:'center', gap:'.5rem',
              color: type === appt.value ? appt.color : 'var(--text)',
            }}>
            <span>{appt.emoji}</span>
            <span>{t(`vet.apptTypes.${appt.key}`)}</span>
          </button>
        ))}
      </div>

      {/* ── Fecha ── */}
      <div className="modal-section">{t('field.date')}</div>
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.sectionDateTime')} *</label>
        <input type="date" className={`form-input${dateErr ? ' input-err' : ''}`}
          value={date} onChange={e => { setDate(e.target.value); setDateErr('') }}/>
        {dateErr && <div className="form-error">{dateErr}</div>}
      </div>

      {/* ── Veterinario ── */}
      <div className="modal-section">{t('field.vet')}</div>
      {vets.length > 0 && (
        <div className="form-group">
          <label className="form-label">{t('vet.appointments.vetContactLabel')}</label>
          <select className="form-input" value={vetContactId}
            onChange={e => setVetContactId(e.target.value)}>
            <option value="">— {t('vet.appointments.vetContactNone')} —</option>
            {vets.map(v => (
              <option key={v.id} value={v.id}>{v.name} · {v.clinic}</option>
            ))}
          </select>
        </div>
      )}
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.sectionVet')} *</label>
        <input className={`form-input${vetNameErr ? ' input-err' : ''}`}
          value={vetName} onChange={e => { setVetName(e.target.value); setVetNameErr('') }}
          placeholder={t('vet.appointments.vetNamePh')}/>
        {vetNameErr && <div className="form-error">{vetNameErr}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('field.clinic')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <input className="form-input" value={clinic}
          onChange={e => setClinic(e.target.value)}
          placeholder={t('vet.appointments.clinicPh')}/>
      </div>

      {/* ── Detalles ── */}
      <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.reason')} *</label>
        <input className={`form-input${reasonErr ? ' input-err' : ''}`}
          value={reason} onChange={e => { setReason(e.target.value); setReasonErr('') }}
          placeholder={t('vet.appointments.reasonPh')}/>
        {reasonErr && <div className="form-error">{reasonErr}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('vet.appointments.diagnosis')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <textarea className="form-input" rows={2} value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          placeholder={t('vet.appointments.diagnosisPh')}/>
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('vet.appointments.treatment')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <textarea className="form-input" rows={2} value={treatment}
          onChange={e => setTreatment(e.target.value)}
          placeholder={t('vet.appointments.treatmentPh')}/>
      </div>

      {/* ── Seguimiento ── */}
      <div className="modal-section">{t('vet.appointments.sectionFollowUp')}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem', marginBottom:'1rem' }}>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">{t('vet.appointments.nextDate')}</label>
          <input type="date" className="form-input"
            value={nextDate} onChange={e => setNextDate(e.target.value)}/>
        </div>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">{t('vet.appointments.nextNote')}</label>
          <input className="form-input" value={nextNote}
            onChange={e => setNextNote(e.target.value)}
            placeholder={t('vet.appointments.nextNotePh')}/>
        </div>
      </div>

      {/* ── Datos adicionales ── */}
      <div className="modal-section">{t('vet.appointments.sectionExtra')}</div>
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.weight')}</label>
        <input type="number" className="form-input" step=".1" min="0"
          value={weightKg} onChange={e => setWeightKg(e.target.value)}
          placeholder={t('vet.appointments.weightPh')}/>
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('field.notes')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <textarea className="form-input" rows={2} value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t('vet.appointments.notesPh')}/>
      </div>
    </Modal>
  )
}
