import { useState, useEffect, type FC } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { MOCK_PETS, SPECIES_EMOJI } from '../hooks/usePets'
import type { VetContact } from '../context/VetContext'


// ─── VET TYPES ────────────────────────────────────────────────────────────────
export const VET_TYPES = [
  { value: 'primary',    label: 'Principal',    emoji: '🩺', color: 'var(--primary)'    },
  { value: 'specialist', label: 'Especialista', emoji: '🔬', color: 'var(--blue)'       },
  { value: 'emergency',  label: 'Urgencias',    emoji: '🚨', color: 'var(--err)'        },
  { value: 'other',      label: 'Otro',         emoji: '📋', color: 'var(--text-muted)' },
] as const


type VetType = typeof VET_TYPES[number]['value']


interface Props {
  isOpen:   boolean
  onClose:  () => void
  onSave:   (v: Omit<VetContact, 'id'>) => void
  onUpdate: (v: VetContact) => void
  initial:  VetContact | null
}


const AddEditVetModal: FC<Props> = ({ isOpen, onClose, onSave, onUpdate, initial }) => {
  const isEdit = !!initial

  const [type,      setType]      = useState<VetType>('primary')
  const [name,      setName]      = useState('')
  const [clinic,    setClinic]    = useState('')
  const [specialty, setSpecialty] = useState('')
  const [phone,     setPhone]     = useState('')
  const [phone2,    setPhone2]    = useState('')
  const [address,   setAddress]   = useState('')
  const [notes,     setNotes]     = useState('')
  const [petIds,    setPetIds]    = useState<string[]>([])
  const [nameErr,   setNameErr]   = useState('')
  const [clinicErr, setClinicErr] = useState('')
  const [phoneErr,  setPhoneErr]  = useState('')

  useEffect(() => {
    if (initial) {
      setType((initial.type as VetType) ?? 'primary')
      setName(initial.name)
      setClinic(initial.clinic)
      setSpecialty(initial.specialty ?? '')
      setPhone(initial.phone)
      setPhone2(initial.phone2 ?? '')
      setAddress(initial.address ?? '')
      setNotes(initial.notes ?? '')
      setPetIds(initial.petIds)
    } else {
      setType('primary'); setName(''); setClinic(''); setSpecialty('')
      setPhone(''); setPhone2(''); setAddress(''); setNotes(''); setPetIds([])
    }
    setNameErr(''); setClinicErr(''); setPhoneErr('')
  }, [initial, isOpen])

  const validate = () => {
    let ok = true
    if (!name.trim())   { setNameErr('El nombre es obligatorio');    ok = false }
    if (!clinic.trim()) { setClinicErr('La clínica es obligatoria'); ok = false }
    if (!phone.trim())  { setPhoneErr('El teléfono es obligatorio'); ok = false }
    return ok
  }

  const handleSave = () => {
    if (!validate()) return
    const data: Omit<VetContact, 'id'> = {
      name:      name.trim(),
      clinic:    clinic.trim(),
      type,
      specialty: specialty.trim() || undefined,
      phone:     phone.trim(),
      phone2:    phone2.trim()  || undefined,
      address:   address.trim() || undefined,
      notes:     notes.trim()   || undefined,
      petIds,
      createdAt: initial?.createdAt ?? '',
    }
    if (isEdit && initial) {
      onUpdate({ ...data, id: initial.id })
    } else {
      onSave(data)
    }
    onClose()
  }

  const togglePet = (id: string) =>
    setPetIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar veterinario' : 'Añadir veterinario'}
      icon="🩺"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>Cancelar</PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            {isEdit ? 'Guardar cambios' : 'Añadir veterinario'}
          </PfBtn>
        </PfFooter>
      }
    >
      <div className="modal-section">Tipo de veterinario</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.5rem', marginBottom: '1rem' }}>
        {VET_TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            style={{
              padding: '.625rem .75rem', borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 700, fontSize: '.8125rem',
              border: `1.5px solid ${type === t.value ? t.color : 'var(--border)'}`,
              background: type === t.value
                ? `color-mix(in oklab, ${t.color} 10%, var(--surface))`
                : 'var(--surface)',
              display: 'flex', alignItems: 'center', gap: '.5rem',
              color: type === t.value ? t.color : 'var(--text)',
            }}
          >
            <span>{t.emoji}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="modal-section">Datos de contacto</div>

      <div className="form-group">
        <label className="form-label">Nombre del veterinario *</label>
        <input
          className={`form-input${nameErr ? ' input-err' : ''}`}
          value={name}
          onChange={e => { setName(e.target.value); setNameErr('') }}
          placeholder="Ej. Dra. García"
        />
        {nameErr && <div className="form-error">{nameErr}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Clínica *</label>
        <input
          className={`form-input${clinicErr ? ' input-err' : ''}`}
          value={clinic}
          onChange={e => { setClinic(e.target.value); setClinicErr('') }}
          placeholder="Ej. Clínica VetSalud"
        />
        {clinicErr && <div className="form-error">{clinicErr}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">
          Especialidad <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <input
          className="form-input"
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          placeholder="Ej. Dermatología, Oncología"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        <div className="form-group">
          <label className="form-label">Teléfono *</label>
          <input
            type="tel"
            className={`form-input${phoneErr ? ' input-err' : ''}`}
            value={phone}
            onChange={e => { setPhone(e.target.value); setPhoneErr('') }}
            placeholder="+34 612 345 678"
          />
          {phoneErr && <div className="form-error">{phoneErr}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            Tel. alternativo <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
          </label>
          <input
            type="tel"
            className="form-input"
            value={phone2}
            onChange={e => setPhone2(e.target.value)}
            placeholder="+34 611 222 333"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Dirección <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <input
          className="form-input"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Calle, número, ciudad"
        />
      </div>

      <div className="modal-section">Mascotas asociadas</div>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {MOCK_PETS.map(p => (
          <button
            key={p.id}
            type="button"
            className={`btn btn-sm ${petIds.includes(p.id) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => togglePet(p.id)}
          >
            {SPECIES_EMOJI[p.species ?? ''] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      <div className="modal-section">Notas adicionales</div>
      <div className="form-group">
        <textarea
          className="form-input"
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Horarios, instrucciones especiales…"
        />
      </div>
    </Modal>
  )
}

export default AddEditVetModal
