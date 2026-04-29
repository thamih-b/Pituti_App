import { useState, useEffect } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { MOCK_PETS, SPECIES_EMOJI } from '../hooks/usePets'
import { useVet, type VetAppointment } from '../context/VetContext'

// ─── APPOINTMENT TYPES ────────────────────────────────────────────────────────
export const APPOINTMENT_TYPES = [
  { value: 'routine',    label: 'Revisión',     emoji: '🩺', color: 'var(--primary)'  },
  { value: 'emergency',  label: 'Urgencia',     emoji: '🚨', color: 'var(--err)'      },
  { value: 'specialist', label: 'Especialista', emoji: '🔬', color: 'var(--blue)'     },
  { value: 'followup',   label: 'Retorno',      emoji: '🔄', color: 'var(--warn)'     },
  { value: 'exam',       label: 'Exámenes',     emoji: '🧪', color: 'var(--purple)'   },
  { value: 'vaccine',    label: 'Vacuna',       emoji: '💉', color: 'var(--success)'  },
  { value: 'other',      label: 'Otro',         emoji: '📋', color: 'var(--text-muted)' },
] as const

type ApptType = typeof APPOINTMENT_TYPES[number]['value']

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

  // Auto-fill from saved vet contact
  useEffect(() => {
    if (!vetContactId) return
    const vet = vets.find(v => v.id === vetContactId)
    if (vet) { setVetName(vet.name); setClinic(vet.clinic) }
  }, [vetContactId, vets])

  const validate = () => {
    let ok = true
    if (!reason.trim())  { setReasonErr('El motivo es obligatorio');           ok = false }
    if (!vetName.trim()) { setVetNameErr('El nombre del vet. es obligatorio'); ok = false }
    if (!date)           { setDateErr('La fecha es obligatoria');              ok = false }
    return ok
  }

  const handleSave = () => {
    if (!validate()) return
    const now = new Date().toISOString()
    const data: Omit<VetAppointment, 'id'> = {
      petId,
      type,
      date,
      createdAt: initial?.createdAt ?? now,
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
      title={isEdit ? 'Editar consulta' : 'Registrar consulta'}
      icon="📋"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>Cancelar</PfBtn>
          <PfBtn variant="save"   onClick={handleSave}>
            {isEdit ? 'Guardar cambios' : 'Registrar consulta'}
          </PfBtn>
        </PfFooter>
      }
    >
      {/* ── Mascota ── */}
      <div className="modal-section">Mascota</div>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {MOCK_PETS.map(p => (
          <button key={p.id} type="button"
            className={`btn btn-sm ${petId === p.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPetId(p.id)}>
            {SPECIES_EMOJI[p.species ?? ''] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      {/* ── Tipo ── */}
      <div className="modal-section">Tipo de consulta</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.5rem', marginBottom: '1rem' }}>
        {APPOINTMENT_TYPES.map(t => (
          <button key={t.value} type="button" onClick={() => setType(t.value)}
            style={{
              padding: '.5rem .75rem', borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 700, fontSize: '.8rem',
              border: `1.5px solid ${type === t.value ? t.color : 'var(--border)'}`,
              background: type === t.value
                ? `color-mix(in oklab, ${t.color} 10%, var(--surface))`
                : 'var(--surface)',
              display: 'flex', alignItems: 'center', gap: '.5rem',
              color: type === t.value ? t.color : 'var(--text)',
            }}>
            <span>{t.emoji}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Fecha ── */}
      <div className="modal-section">Fecha</div>
      <div className="form-group">
        <label className="form-label">Fecha de la consulta *</label>
        <input type="date" className={`form-input${dateErr ? ' input-err' : ''}`}
          value={date} onChange={e => { setDate(e.target.value); setDateErr('') }} />
        {dateErr && <div className="form-error">{dateErr}</div>}
      </div>

      {/* ── Veterinario ── */}
      <div className="modal-section">Veterinario</div>
      {vets.length > 0 && (
        <div className="form-group">
          <label className="form-label">Contacto guardado</label>
          <select className="form-input" value={vetContactId}
            onChange={e => setVetContactId(e.target.value)}>
            <option value="">— Introducir manualmente —</option>
            {vets.map(v => (
              <option key={v.id} value={v.id}>{v.name} · {v.clinic}</option>
            ))}
          </select>
        </div>
      )}
      <div className="form-group">
        <label className="form-label">Nombre del veterinario *</label>
        <input className={`form-input${vetNameErr ? ' input-err' : ''}`}
          value={vetName} onChange={e => { setVetName(e.target.value); setVetNameErr('') }}
          placeholder="Ej. Dra. García" />
        {vetNameErr && <div className="form-error">{vetNameErr}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">
          Clínica{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <input className="form-input" value={clinic}
          onChange={e => setClinic(e.target.value)} placeholder="Ej. Clínica VetSalud" />
      </div>

      {/* ── Detalles ── */}
      <div className="modal-section">Detalles de la consulta</div>
      <div className="form-group">
        <label className="form-label">Motivo de la consulta *</label>
        <input className={`form-input${reasonErr ? ' input-err' : ''}`}
          value={reason} onChange={e => { setReason(e.target.value); setReasonErr('') }}
          placeholder="Ej. Revisión anual, tos persistente…" />
        {reasonErr && <div className="form-error">{reasonErr}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">
          Diagnóstico{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <textarea className="form-input" rows={2} value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          placeholder="Diagnóstico del veterinario" />
      </div>
      <div className="form-group">
        <label className="form-label">
          Tratamiento{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <textarea className="form-input" rows={2} value={treatment}
          onChange={e => setTreatment(e.target.value)}
          placeholder="Medicamentos, dosis, indicaciones…" />
      </div>

      {/* ── Seguimiento ── */}
      <div className="modal-section">Seguimiento</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Fecha de retorno</label>
          <input type="date" className="form-input"
            value={nextDate} onChange={e => setNextDate(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Nota del retorno</label>
          <input className="form-input" value={nextNote}
            onChange={e => setNextNote(e.target.value)}
            placeholder="Ej. Revisión post-tratamiento" />
        </div>
      </div>

      {/* ── Datos adicionales ── */}
      <div className="modal-section">Datos adicionales</div>
      <div className="form-group">
        <label className="form-label">Peso en la visita (kg)</label>
        <input type="number" className="form-input" step=".1" min="0"
          value={weightKg} onChange={e => setWeightKg(e.target.value)}
          placeholder="Ej. 4.2" />
      </div>
      <div className="form-group">
        <label className="form-label">
          Notas{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <textarea className="form-input" rows={2} value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Cualquier observación relevante…" />
      </div>
    </Modal>
  )
}
