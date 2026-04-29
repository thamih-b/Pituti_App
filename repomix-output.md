This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/api/.gitkeep
src/App.tsx
src/assets/hero.png
src/assets/react.svg
src/assets/vite.svg
src/components/AddCareModal.tsx
src/components/AddEditAppointmentModal.tsx
src/components/AddEditVetModal.tsx
src/components/AddMedicationModal.tsx
src/components/AddPetModal.tsx
src/components/AppLayout.tsx
src/components/Avatar.tsx
src/components/BackButton.tsx
src/components/Badge.tsx
src/components/Button.tsx
src/components/CalicoAnimation.tsx
src/components/Card.tsx
src/components/CareDetailModal.tsx
src/components/CareScheduleFields.tsx
src/components/DeleteAccountModal.tsx
src/components/EditCareModal.tsx
src/components/EditMedModal.tsx
src/components/EditPetModal.tsx
src/components/EditVaccineModal.tsx
src/components/EmptyState.tsx
src/components/FooterButtons.tsx
src/components/FormDateField.tsx
src/components/Input.tsx
src/components/InviteSentOverlay.tsx
src/components/MedDetailModal.tsx
src/components/MiniVaccRing.tsx
src/components/Modal.tsx
src/components/NewNoteModal.tsx
src/components/NoteModals.tsx
src/components/NotificationPanel.tsx
src/components/OverviewCard.tsx
src/components/PetCard.tsx
src/components/PetChipEditOverlay.tsx
src/components/PetMedicalProfileModal.tsx
src/components/RegisterSymptomModal.tsx
src/components/SkeletonLoader.tsx
src/components/SymptomModals.tsx
src/components/VaccineDetailModal.tsx
src/components/VaccRing.tsx
src/context/CaresContext.tsx
src/context/LanguageContext.tsx
src/context/PitutiContext.tsx
src/context/SymptomsContext.tsx
src/context/VetContext.tsx
src/hooks/usePets.ts
src/i18n/translations.ts
src/index.css
src/main.tsx
src/pages/CalendarPage.tsx
src/pages/CaresPage.tsx
src/pages/DashboardPage.tsx
src/pages/LoginPage.tsx
src/pages/MedicationsPage.tsx
src/pages/NotesPage.tsx
src/pages/NotFoundPage.tsx
src/pages/PetDetailPage.tsx
src/pages/PetListPage.tsx
src/pages/SettingsPage.tsx
src/pages/SymptomsPage.tsx
src/pages/VaccinesPage.tsx
src/pages/VetPage.tsx
src/styles/catAnim.css
src/types/index.ts
src/utils/.gitkeep
```

# Files

## File: src/components/AddEditAppointmentModal.tsx
```typescript
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
```

## File: src/components/AddEditVetModal.tsx
```typescript
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
```

## File: src/components/CalicoAnimation.tsx
```typescript
// ══════════════════════════════════════════════════════════════════
//  src/components/CalicoAnimation.tsx
//
//  Self-contained calico cat SVG for the topbar.
//  Animations live in  src/styles/catAnim.css  (imported in main.tsx).
//
//  Usage:
//    import CalicoAnimation from './CalicoAnimation'
//    <CalicoAnimation />          ← drop anywhere in <header>
// ══════════════════════════════════════════════════════════════════

export default function CalicoAnimation() {
  return (
    <svg
      className="calico-cat"
      width="80"
      height="60"
      viewBox="0 0 96 72"
      fill="none"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      role="presentation"
    >

      {/* ════════════════════════════════════
          WALKING GROUP
      ════════════════════════════════════ */}
      <g className="cat-walk">

        {/* Walking tail — orange, long, curves back */}
        <path
          className="cat-walk-tail"
          d="M66 36 C76 26 88 12 85 2"
          stroke="#E87228" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />

        {/* Body */}
        <path d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32 C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z" fill="white"/>
        <path d="M20 31 C21 18 31 11 45 12 C53 13 57 21 55 33 C53 42 42 47 31 45 C21 43 18 37 20 31 Z" fill="#E87228" opacity="0.90"/>
        <path d="M51 11 C61 10 73 16 76 27 C78 35 73 43 63 45 C54 46 48 39 49 30 C50 19 49 12 51 11 Z" fill="#1E1412" opacity="0.90"/>
        <path d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32 C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.40"/>
        <path d="M24 34 Q31 37 38 35" stroke="white" strokeWidth="1.4" fill="none" opacity="0.50" strokeLinecap="round"/>

        {/* Neck */}
        <path d="M20 34 C17 29 17 22 20 18 C21 16 24 15 26 18 C28 21 27 28 26 33 Z" fill="white"/>

        {/* Head */}
        <circle cx="12" cy="17" r="11.5" fill="white"/>
        <path d="M2 11 C4 3 12 2 16 7 C19 11 18 18 14 20 C9 22 2 19 1 14 C1 12 1 11 2 11 Z" fill="#E87228" opacity="0.90"/>
        <path d="M13 9 C17 5 23 8 22 14 C21 18 17 20 14 18 C11 16 11 10 13 9 Z" fill="#1E1412" opacity="0.90"/>
        <circle cx="12" cy="17" r="11.5" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* Ears */}
        <polygon points="2,9 6,-3 13,9" fill="#E87228"/>
        <polygon points="3.5,8.5 6.5,-0.5 11,8.5" fill="#F4A888" opacity="0.75"/>
        <polygon points="2,9 6,-3 13,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <polygon points="11,9 17,-3 23,9" fill="#1E1412"/>
        <polygon points="12.5,8.5 17,-0.5 21.5,8.5" fill="#5A2030" opacity="0.60"/>
        <polygon points="11,9 17,-3 23,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.32"/>

        {/* Eyes */}
        <circle cx="8.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="8.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="8.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="9.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="17.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="17.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="17.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="18.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>

        {/* Nose + mouth */}
        <path d="M11.2 20 L12 21.5 L12.8 20 Z" fill="#F0A0B8"/>
        <line x1="12" y1="21.5" x2="12" y2="22.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M12 22.5 Q10.2 24 9 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M12 22.5 Q13.8 24 15 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* Whiskers */}
        <line x1="0.5" y1="20.5" x2="10" y2="21.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="0.5" y1="22.2" x2="10" y2="22.5" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="0.5" y1="23.9" x2="10" y2="23.5" stroke="#C8C0B8" strokeWidth="0.72"/>
        <line x1="14"  y1="21.5" x2="23.5" y2="20.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="14"  y1="22.5" x2="23.5" y2="22.2" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="14"  y1="23.5" x2="23.5" y2="23.9" stroke="#C8C0B8" strokeWidth="0.72"/>

        {/* Legs (animated) */}
        <path d="M21 43 Q20 44 20 53 Q20 55 22 55 Q24 55 24.5 53 Q24.5 44 23.5 43 Z"   fill="white"   stroke="#1A1210" strokeWidth="0.85" className="cat-leg-1"/>
        <path d="M29 44 Q28 45 28 53 Q28 55 30 55 Q32 55 32.5 53 Q32.5 45 31.5 44 Z"   fill="#EDE5DD" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-2"/>
        <path d="M55 43 Q54 44 54 52 Q54 54 56 54 Q58 54 58.5 52 Q58.5 44 57.5 43 Z"   fill="white"   stroke="#1A1210" strokeWidth="0.85" className="cat-leg-3"/>
        <path d="M63 44 Q62 45 62 52 Q62 54 64 54 Q66 54 66.5 52 Q66.5 45 65.5 44 Z"   fill="#1E1412" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-4"/>

        {/* Toe beans */}
        <ellipse cx="22.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.70"/>
        <ellipse cx="30.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.58"/>
        <ellipse cx="56.2" cy="53.5" rx="2.3" ry="1.0" fill="#F0A0B8" opacity="0.52"/>
        <ellipse cx="64.2" cy="53.5" rx="2.3" ry="1.0" fill="#7A4858" opacity="0.66"/>
      </g>

      {/* ════════════════════════════════════
          SITTING GROUP  (shifted 8u down to avoid ear clipping)
      ════════════════════════════════════ */}
      <g className="cat-sit" transform="translate(0, 8)">

        {/* Shadow */}
        <ellipse cx="22" cy="55.5" rx="18" ry="2" fill="#00000010"/>

        {/* Sitting tail — happy orange arc */}
        <path
          className="cat-sit-tail"
          d="M32 42 C42 54 26 62 14 56 C6 51 8 42 14 38"
          stroke="#E87228" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />

        {/* Sitting body */}
        <path d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z" fill="white"/>
        <path d="M9 46 C9 33 11 22 20 20 C28 18 32 26 31 38 C30 48 24 54 16 53 C11 52 9 50 9 46 Z" fill="#E87228" opacity="0.88"/>
        <path d="M24 19 C32 19 35 28 35 38 C35 48 30 54 24 54 C22 54 22 46 22 38 C22 28 22 19 24 19 Z" fill="#1E1412" opacity="0.88"/>
        <path d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <path d="M12 40 Q18 43 24 41" stroke="white" strokeWidth="1.3" fill="none" opacity="0.45" strokeLinecap="round"/>

        {/* Sitting paws */}
        <ellipse cx="15" cy="53" rx="5.5" ry="3" fill="white"    stroke="#1A1210" strokeWidth="0.8" opacity="0.80"/>
        <ellipse cx="27" cy="53" rx="5.5" ry="3" fill="#F0E8DF"  stroke="#1A1210" strokeWidth="0.8" opacity="0.72"/>

        {/* Sitting neck */}
        <path d="M14 20 C12 16 12 11 15 8 C16 7 19 7 20 9 C21 11 20 16 19 20 Z" fill="white" opacity="0.90"/>

        {/* Sitting head */}
        <circle cx="17" cy="9" r="11.5" fill="white"/>
        <path d="M7 3 C9 -4 16 -5 20 0 C23 4 22 11 18 13 C13 15 6 12 5 8 C5 6 5 4 7 3 Z" fill="#E87228" opacity="0.88"/>
        <path d="M18 1 C22 -2 28 1 27 7 C26 11 22 13 19 11 C16 9 16 2 18 1 Z" fill="#1E1412" opacity="0.88"/>
        <circle cx="17" cy="9" r="11.5" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* Sitting ears */}
        <polygon points="7,4 11,-8 18,4" fill="#E87228"/>
        <polygon points="8.5,3.5 11.5,-5 16,3.5" fill="#F4A888" opacity="0.72"/>
        <polygon points="7,4 11,-8 18,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.35"/>
        <polygon points="16,4 22,-8 28,4" fill="#1E1412"/>
        <polygon points="17.5,3.5 22,-5 26.5,3.5" fill="#5A2030" opacity="0.58"/>
        <polygon points="16,4 22,-8 28,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.30"/>

        {/* Sitting eyes */}
        <circle cx="13" cy="9" r="4.5" fill="#1A1210"/>
        <circle cx="13" cy="9" r="3.8" fill="#D4A820"/>
        <ellipse cx="13" cy="9" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="14.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="22"   cy="9" r="4.5" fill="#1A1210"/>
        <circle cx="22"   cy="9" r="3.8" fill="#D4A820"/>
        <ellipse cx="22"  cy="9" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="23.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>

        {/* Sitting nose + mouth */}
        <path d="M16.2 12 L17 13.5 L17.8 12 Z" fill="#F0A0B8"/>
        <line x1="17" y1="13.5" x2="17" y2="14.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M17 14.5 Q15.2 16 14 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M17 14.5 Q18.8 16 20 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* Sitting whiskers */}
        <line x1="5"  y1="12.5" x2="15" y2="13.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="5"  y1="14.2" x2="15" y2="14.5" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="5"  y1="15.9" x2="15" y2="15.5" stroke="#C8C0B8" strokeWidth="0.70"/>
        <line x1="19" y1="13.5" x2="29" y2="12.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="19" y1="14.5" x2="29" y2="14.2" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="19" y1="15.5" x2="29" y2="15.9" stroke="#C8C0B8" strokeWidth="0.70"/>
      </g>

    </svg>
  )
}
```

## File: src/components/CareScheduleFields.tsx
```typescript
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

interface Props {
  time:            string
  setTime:         (v: string) => void
  everyXDays:      boolean
  setEveryXDays:   (v: boolean) => void
  intervalDays:    string
  setIntervalDays: (fn: (prev: string) => string) => void
  recurring:       boolean
  setRecurring:    (v: boolean) => void
}

export default function CareScheduleFields({
  time, setTime,
  everyXDays, setEveryXDays,
  intervalDays, setIntervalDays,
  recurring, setRecurring,
}: Props) {
  return (
    <>
      <div className="modal-section">Horario y repetición</div>

      <div className="form-group">
        <label className="form-label">
          Horario <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span>
        </label>
        <div className="field-icon-wrap">
          <span className="field-icon">🕐</span>
          <input className="form-input" type="time" value={time}
            onChange={e => setTime(e.target.value)}
            style={{ colorScheme:'light' }} />
        </div>
      </div>

      <div className="toggle-row">
        <div className="toggle-row-info">
          <div className="toggle-row-label">📅 Repetir cada X días</div>
          <div className="toggle-row-sub">
            {everyXDays ? `Cada ${intervalDays} días` : 'Se repite diariamente'}
          </div>
        </div>
        <Toggle on={everyXDays} onChange={setEveryXDays} />
      </div>

      {everyXDays && (
        <div className="form-group" style={{ marginTop:'.625rem' }}>
          <label className="form-label">Repetir cada</label>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
            <button type="button"
              style={{ width:36, height:36, borderRadius:'var(--r-md)',
                border:'1.5px solid var(--border)', background:'var(--surface-offset)',
                fontSize:'1.1rem', cursor:'pointer' }}
              onClick={() => setIntervalDays(d => String(Math.max(2, Number(d)-1)))}>−
            </button>
            <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)',
              minWidth:32, textAlign:'center' }}>
              {intervalDays}
            </div>
            <button type="button"
              style={{ width:36, height:36, borderRadius:'var(--r-md)',
                border:'1.5px solid var(--border)', background:'var(--surface-offset)',
                fontSize:'1.1rem', cursor:'pointer' }}
              onClick={() => setIntervalDays(d => String(Math.min(60, Number(d)+1)))}>+
            </button>
            <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>días</span>
          </div>
        </div>
      )}

      <div className="toggle-row" style={{ marginTop: everyXDays ? '.75rem' : 0 }}>
        <div className="toggle-row-info">
          <div className="toggle-row-label">🔁 Recurrente</div>
          <div className="toggle-row-sub">
            {recurring ? 'Se repite indefinidamente' : 'Se realiza una sola vez'}
          </div>
        </div>
        <Toggle on={recurring} onChange={setRecurring} />
      </div>
    </>
  )
}
```

## File: src/components/NotificationPanel.tsx
```typescript
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Notification {
  id:      string
  type:    'vaccine' | 'medication' | 'symptom' | 'care' | 'system'
  title:   string
  body:    string
  time:    string
  read:    boolean
  to?:     string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id:'n1', type:'vaccine',    title:'Vacuna vencida — Luna',       body:'Rabia canina venció el 10 mar. Registra la nueva fecha.',       time:'Hoy 09:14',   read:false, to:'/vaccines'    },
  { id:'n2', type:'symptom',    title:'Síntoma activo — Toby',       body:'Tos sin fiebre lleva 7 días sin resolución.',                   time:'Hoy 08:00',   read:false, to:'/symptoms'    },
  { id:'n3', type:'medication', title:'Próxima dosis — Toby',        body:'Pipeta antipulgas: dosis en 5 días (30 abr).',                  time:'Ayer 18:30',  read:false, to:'/medications' },
  { id:'n4', type:'care',       title:'Cuidados pendientes',         body:'Toby tiene 2 cuidados urgentes sin completar hoy.',             time:'Ayer 12:00',  read:true,  to:'/cares'       },
  { id:'n5', type:'vaccine',    title:'Recordatorio — Toby',         body:'Antirrábica programada para el 5 jun. Confirma la cita.',       time:'Hace 2 días', read:true,  to:'/vaccines'    },
  { id:'n6', type:'system',     title:'Invitación aceptada',         body:'Ana Martínez se unió como cuidadora de Luna.',                  time:'Hace 3 días', read:true                     },
]

const TYPE_ICON: Record<string, string> = {
  vaccine:    '💉',
  medication: '💊',
  symptom:    '🌡️',
  care:       '🐾',
  system:     '✉️',
}
const TYPE_COLOR: Record<string, string> = {
  vaccine:    'var(--blue)',
  medication: 'var(--warn)',
  symptom:    'var(--err)',
  care:       'var(--success)',
  system:     'var(--primary)',
}
const TYPE_BG: Record<string, string> = {
  vaccine:    'var(--blue-hl)',
  medication: 'var(--warn-hl)',
  symptom:    'var(--err-hl)',
  care:       'var(--success-hl)',
  system:     'var(--primary-hl)',
}

export default function NotificationsPanel() {
  const [open,       setOpen]       = useState(false)
  const [notifs,     setNotifs]     = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const unread = notifs.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markRead    = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  const dismiss     = (id: string) => setNotifs(n => n.filter(x => x.id !== id))

  const handleClick = (notif: Notification) => {
    markRead(notif.id)
    if (notif.to) { navigate(notif.to); setOpen(false) }
  }

  return (
    <div ref={panelRef} style={{ position: 'relative', display: 'flex' }}>
      {/* Bell button */}
      <button
        className="topbar-icon-btn"
        title="Notificaciones"
        aria-label={`Notificaciones${unread > 0 ? ` · ${unread} sin leer` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{ position: 'relative' }}
      >
        {/* Bell SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {/* Unread badge */}
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--err)', color: '#fff',
            fontSize: '.6rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--nav-bg)',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          zIndex: 500,
          width: 340,
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          boxShadow: '0 8px 32px rgba(44,52,98,.18), 0 24px 60px rgba(44,52,98,.14)',
          animation: 'pm-rise 180ms cubic-bezier(.16,1,.3,1) both',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '.875rem 1rem .75rem',
            borderBottom: '1.5px solid var(--divider)',
            background: 'var(--surface-2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>Notificaciones</span>
              {unread > 0 && (
                <span style={{ background: 'var(--err)', color: '#fff', fontSize: '.65rem', fontWeight: 800, borderRadius: 'var(--r-full)', padding: '.15rem .45rem' }}>
                  {unread} nuevas
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                Marcar todo leído
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-faint)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🔔</div>
                <div style={{ fontSize: '.875rem', fontWeight: 600 }}>Sin notificaciones nuevas</div>
              </div>
            ) : notifs.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  display: 'flex', gap: '.75rem', padding: '.75rem 1rem',
                  borderBottom: '1px solid var(--divider)',
                  background: n.read ? 'transparent' : 'var(--primary-hl)',
                  cursor: n.to ? 'pointer' : 'default',
                  transition: 'background var(--trans)',
                  position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-offset)')}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'var(--primary-hl)')}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div style={{ position: 'absolute', left: '.375rem', top: '50%', marginTop: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}/>
                )}

                {/* Icon */}
                <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: TYPE_BG[n.type], color: TYPE_COLOR[n.type], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  {TYPE_ICON[n.type]}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 600 : 800, fontSize: '.8125rem', color: 'var(--text)', marginBottom: '.15rem' }}>{n.title}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.body}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', marginTop: '.25rem', fontWeight: 600 }}>{n.time}</div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                  style={{ width: 24, height: 24, borderRadius: 'var(--r-sm)', background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.7rem', alignSelf: 'flex-start', marginTop: '.1rem' }}
                  title="Descartar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div style={{ padding: '.625rem 1rem', borderTop: '1.5px solid var(--divider)', background: 'var(--surface-2)', textAlign: 'center' }}>
              <button onClick={() => setOpen(false)} style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

## File: src/components/PetMedicalProfileModal.tsx
```typescript
import { useState, useEffect } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { CONDITIONS_CATALOG, type PetMedicalProfile } from '../context/VetContext'

// ─── LOCAL TYPES ──────────────────────────────────────────────────────────────
type Sex = 'male' | 'female'
type Env = 'apartment' | 'house' | 'both'

interface Surgery {
  id:     string
  name:   string
  date?:  string
  notes?: string
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="modal-section" style={{ marginTop: '1.25rem' }}>{children}</div>
  )
}

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface Props {
  isOpen:  boolean
  onClose: () => void
  pet:     { name: string; species?: string }
  profile: PetMedicalProfile
  onSave:  (profile: PetMedicalProfile) => void
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function PetMedicalProfileModal({
  isOpen, onClose, pet, profile, onSave,
}: Props) {
  // ── Basic ──
  const [sex,          setSex]          = useState<Sex | undefined>(undefined)
  const [neutered,     setNeutered]     = useState<boolean | undefined>(undefined)
  const [neuteredAge,  setNeuteredAge]  = useState('')
  const [bloodType,    setBloodType]    = useState('')
  const [allergies,    setAllergies]    = useState('')
  // ── Conditions ──
  const [condIds,      setCondIds]      = useState<string[]>([])
  const [customConds,  setCustomConds]  = useState<string[]>([])
  const [newCond,      setNewCond]      = useState('')
  // ── Surgeries ──
  const [surgeries,    setSurgeries]    = useState<Surgery[]>([])
  const [newSurgName,  setNewSurgName]  = useState('')
  const [newSurgNotes, setNewSurgNotes] = useState('')
  // ── Environment ──
  const [environment,  setEnvironment]  = useState<Env | undefined>(undefined)
  const [withAnimals,  setWithAnimals]  = useState<boolean | undefined>(undefined)
  const [parasite,     setParasite]     = useState('')
  // ── Vet notes ──
  const [behavior,     setBehavior]     = useState('')
  const [vetQuestions, setVetQuestions] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setSex(profile.sex)
    setNeutered(profile.neutered)
    setNeuteredAge(profile.neuteredAge ?? '')
    setBloodType(profile.bloodType ?? '')
    setAllergies(profile.allergies ?? '')
    setCondIds([...profile.chronicConditionIds])
    setCustomConds([...profile.customConditions])
    setNewCond('')
    setSurgeries(profile.surgeries.map(s => ({ ...s })))
    setNewSurgName(''); setNewSurgNotes('')
    setEnvironment(profile.environment)
    setWithAnimals(profile.livingWithAnimals)
    setParasite(profile.parasiteControl ?? '')
    setBehavior(profile.behavioralNotes ?? '')
    setVetQuestions(profile.vetQuestions ?? '')
  }, [isOpen, profile])

  // ── Conditions ─────────────────────────────────────────────────────────────
  const toggleCondId = (id: string) =>
    setCondIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const addCustomCond = () => {
    const val = newCond.trim()
    if (!val || customConds.includes(val)) return
    setCustomConds(prev => [...prev, val])
    setNewCond('')
  }

  // ── Surgeries ──────────────────────────────────────────────────────────────
  const addSurgery = () => {
    const name = newSurgName.trim()
    if (!name) return
    setSurgeries(prev => [...prev, {
      id:    `surg-${Date.now()}`,
      name,
      notes: newSurgNotes.trim() || undefined,
    }])
    setNewSurgName(''); setNewSurgNotes('')
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const updated: PetMedicalProfile = {
      ...profile,
      sex,
      neutered,
      neuteredAge:         neuteredAge.trim()  || undefined,
      bloodType:           bloodType.trim()    || undefined,
      allergies:           allergies.trim()    || undefined,
      chronicConditionIds: condIds,
      customConditions:    customConds,
      surgeries,
      environment,
      livingWithAnimals:   withAnimals,
      parasiteControl:     parasite.trim()     || undefined,
      behavioralNotes:     behavior.trim()     || undefined,
      vetQuestions:        vetQuestions.trim() || undefined,
      updatedAt:           new Date().toISOString(),
    }
    onSave(updated)
    onClose()
  }

  // ── Shared chip style ──────────────────────────────────────────────────────
  const chip: React.CSSProperties = {
    padding: '.3rem .65rem', borderRadius: 'var(--r-full)',
    fontSize: '.8rem', fontWeight: 700, cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background var(--trans), border-color var(--trans)',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Perfil médico · ${pet.name}`}
      icon="🩺"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>Cancelar</PfBtn>
          <PfBtn variant="save"   onClick={handleSave}>Guardar perfil</PfBtn>
        </PfFooter>
      }
    >
      {/* ── Datos básicos ── */}
      <SectionLabel>Datos básicos</SectionLabel>

      {/* Sexo */}
      <div className="form-group">
        <label className="form-label">Sexo</label>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {(['male', 'female'] as Sex[]).map(s => (
            <button key={s} type="button"
              onClick={() => setSex(sex === s ? undefined : s)}
              style={{
                ...chip,
                border: `1.5px solid ${sex === s ? 'var(--primary)' : 'var(--border)'}`,
                background: sex === s
                  ? 'color-mix(in oklab, var(--primary) 12%, var(--surface))'
                  : 'var(--surface)',
                color: sex === s ? 'var(--primary)' : 'var(--text)',
              }}>
              {s === 'male' ? '♂ Macho' : '♀ Hembra'}
            </button>
          ))}
        </div>
      </div>

      {/* Castrado */}
      <div className="form-group"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          Castrado / Esterilizado
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {neutered == null ? '—' : neutered ? 'Sí' : 'No'}
          </span>
          <Toggle on={!!neutered} onChange={setNeutered} />
        </div>
      </div>

      {neutered && (
        <div className="form-group">
          <label className="form-label">
            Edad en la castración{' '}
            <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
          </label>
          <input className="form-input" value={neuteredAge}
            onChange={e => setNeuteredAge(e.target.value)}
            placeholder="Ej. 6 meses, 1 año…" />
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          Grupo sanguíneo{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <input className="form-input" value={bloodType}
          onChange={e => setBloodType(e.target.value)}
          placeholder="Ej. A, B, AB, DEA 1.1…" />
        <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.25rem' }}>
          Varía según la especie — escribe libremente
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Alergias conocidas{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <textarea className="form-input" rows={2} value={allergies}
          onChange={e => setAllergies(e.target.value)}
          placeholder="Ej. Pollo, penicilina, pólenes…" />
      </div>

      {/* ── Condiciones crónicas ── */}
      <SectionLabel>Condiciones crónicas</SectionLabel>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '.875rem' }}>
        {CONDITIONS_CATALOG.map(c => {
          const active = condIds.includes(c.id)
          return (
            <button key={c.id} type="button" onClick={() => toggleCondId(c.id)}
              style={{
                ...chip,
                border: `1.5px solid ${active ? 'var(--err)' : 'var(--border)'}`,
                background: active
                  ? 'color-mix(in oklab, var(--err) 10%, var(--surface))'
                  : 'var(--surface)',
                color: active ? 'var(--err)' : 'var(--text-muted)',
              }}>
              {active ? '✓ ' : ''}{c.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
        <input className="form-input" value={newCond} style={{ flex: 1 }}
          onChange={e => setNewCond(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomCond()}
          placeholder="Condición personalizada" />
        <button type="button" className="btn btn-secondary btn-sm"
          onClick={addCustomCond}>
          Añadir
        </button>
      </div>

      {customConds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.375rem', marginBottom: '.5rem' }}>
          {customConds.map(c => (
            <span key={c} style={{
              ...chip, cursor: 'default',
              display: 'inline-flex', alignItems: 'center', gap: '.375rem',
              border: '1.5px solid var(--err)',
              background: 'color-mix(in oklab, var(--err) 10%, var(--surface))',
              color: 'var(--err)',
            }}>
              {c}
              <button type="button"
                onClick={() => setCustomConds(p => p.filter(x => x !== c))}
                style={{ background: 'none', border: 'none', color: 'var(--err)',
                  cursor: 'pointer', fontSize: '.9rem', lineHeight: 1, padding: 0 }}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Cirugías ── */}
      <SectionLabel>Cirugías e intervenciones</SectionLabel>

      {surgeries.map(s => (
        <div key={s.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: '.625rem',
          padding: '.5rem .75rem', borderRadius: 'var(--r-md)',
          background: 'var(--surface-offset)', marginBottom: '.375rem',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '.8125rem' }}>{s.name}</div>
            {s.notes && (
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{s.notes}</div>
            )}
          </div>
          <button type="button"
            onClick={() => setSurgeries(p => p.filter(x => x.id !== s.id))}
            style={{ color: 'var(--err)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '.9rem', flexShrink: 0 }}>
            ×
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem', marginTop: '.5rem' }}>
        <input className="form-input" value={newSurgName}
          onChange={e => setNewSurgName(e.target.value)}
          placeholder="Ej. Castración, Extracción dental" />
        <input className="form-input" value={newSurgNotes}
          onChange={e => setNewSurgNotes(e.target.value)}
          placeholder="Observaciones (opcional)" />
        <button type="button" className="btn btn-secondary btn-sm"
          style={{ alignSelf: 'flex-start' }} onClick={addSurgery}>
          + Añadir cirugía
        </button>
      </div>

      {/* ── Entorno ── */}
      <SectionLabel>Entorno y comportamiento</SectionLabel>

      <div className="form-group">
        <label className="form-label">Tipo de hábitat</label>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {([
            { val: 'apartment' as Env, label: '🏢 Piso'  },
            { val: 'house'     as Env, label: '🏠 Casa'  },
            { val: 'both'      as Env, label: '🔄 Ambos' },
          ]).map(o => (
            <button key={o.val} type="button"
              onClick={() => setEnvironment(environment === o.val ? undefined : o.val)}
              style={{
                ...chip,
                border: `1.5px solid ${environment === o.val ? 'var(--primary)' : 'var(--border)'}`,
                background: environment === o.val
                  ? 'color-mix(in oklab, var(--primary) 12%, var(--surface))'
                  : 'var(--surface)',
                color: environment === o.val ? 'var(--primary)' : 'var(--text)',
              }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          Convive con otros animales
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {withAnimals == null ? '—' : withAnimals ? 'Sí' : 'No'}
          </span>
          <Toggle on={!!withAnimals} onChange={setWithAnimals} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Antiparasitario habitual{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <input className="form-input" value={parasite}
          onChange={e => setParasite(e.target.value)}
          placeholder="Ej. Bravecto cada 3 meses, Stronghold mensual…" />
      </div>

      {/* ── Notas para el vet ── */}
      <SectionLabel>Notas para el veterinario</SectionLabel>

      <div className="form-group">
        <label className="form-label">
          Notas de comportamiento{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <textarea className="form-input" rows={2} value={behavior}
          onChange={e => setBehavior(e.target.value)}
          placeholder="Ej. Muy nerviosa en la consulta, morder al manipular orejas…" />
      </div>

      <div className="form-group">
        <label className="form-label">
          Preguntas para el veterinario{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <textarea className="form-input" rows={2} value={vetQuestions}
          onChange={e => setVetQuestions(e.target.value)}
          placeholder="Ej. ¿Cuándo hacer la próxima analítica?" />
      </div>
    </Modal>
  )
}
```

## File: src/context/CaresContext.tsx
```typescript
import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from 'react'
import type { CareEditData } from '../components/EditCareModal'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface CareItem {
  id:           string
  petId:        string
  emoji:        string
  title:        string
  sub:          string
  total:        number
  period:       string    // 'day' | 'week' | 'month' | 'custom'
  intervalDays: number    // 1=diário, 7=semanal, 30=mensal, ou valor custom
  startDate:    string    // YYYY-MM-DD âncora
  quantity:     string
  notify:       boolean
  time:         string
  recurring:    boolean
  bg:           string
  doneByDate:   Record<string, { done: number; doneState: boolean }>
}

// addCare pode omitir o id (gerado automaticamente) e o doneByDate
type NewCareItem = Omit<CareItem, 'id' | 'doneByDate'> & { id?: string; doneByDate?: CareItem['doneByDate'] }

interface CaresContextValue {
  items:          CareItem[]
  setCareProgress:(id: string, dateStr: string, done: number, doneState: boolean) => void
  /** PetDetailPage: actualiza com um CareItem completo já construído */
  editCare:       (care: CareItem) => void
  /** CalendarPage: actualiza a partir do CareEditData do modal */
  updateCare:     (updated: CareEditData) => void
  deleteCare:     (id: string) => void
  addCare:        (item: NewCareItem) => void
}

// ── Funções utilitárias públicas ──────────────────────────────────────────────

/**
 * Devolve todas as datas (YYYY-MM-DD) em que este cuidado ocorre no intervalo
 * [fromStr, toStr], respeitando `intervalDays` e o `startDate` como âncora.
 */
export function getDueDatesInRange(
  care: CareItem, fromStr: string, toStr: string,
): string[] {
  const result: string[] = []
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  const to    = new Date(toStr          + 'T12:00:00')
  let cur = new Date(start)
  while (cur < from) cur.setDate(cur.getDate() + care.intervalDays)
  while (cur <= to) {
    result.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + care.intervalDays)
  }
  return result
}

/**
 * Verifica se o cuidado deve ocorrer numa data específica.
 * Para cuidados diários (intervalDays ≤ 1) devolve sempre true.
 */
export function isDueOnDate(care: CareItem, dateStr: string): boolean {
  if (care.intervalDays <= 1) return true
  return getDueDatesInRange(care, dateStr, dateStr).length > 0
}

/**
 * Devolve a próxima data de ocorrência do cuidado após `fromStr`.
 */
export function getNextDueDate(care: CareItem, fromStr: string): string {
  if (care.intervalDays <= 1) return fromStr
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  let cur = new Date(start)
  // avança até passar `from`
  while (cur <= from) cur.setDate(cur.getDate() + care.intervalDays)
  return cur.toISOString().split('T')[0]
}

// ── Funções internas ──────────────────────────────────────────────────────────

function periodToInterval(period: string): number {
  if (period === 'week')  return 7
  if (period === 'month') return 30
  return 1
}

/**
 * Resolve o intervalDays final a partir do CareEditData.
 * Se period='custom', usa u.intervalDays directamente (mínimo 2 dias).
 */
function resolveIntervalDays(u: CareEditData): number {
  if (u.period === 'custom' && u.intervalDays != null) {
    return Math.max(2, Number(u.intervalDays) || 2)
  }
  return periodToInterval(u.period ?? 'day')
}

/**
 * Constrói o texto "sub" do cuidado (ex: "2 al día · 80g").
 * Suporta period === 'custom' com intervalDays arbitrário.
 */
function buildSub(u: CareEditData): string {
  let freq: string
  const xd = u.intervalDays ?? 2
  switch (u.period ?? 'day') {
    case 'day':    freq = 'al día';                      break
    case 'week':   freq = 'por semana';                  break
    case 'month':  freq = 'por mes';                     break
    case 'custom': freq = `cada ${xd} día${xd !== 1 ? 's' : ''}`; break
    default:       freq = 'al día'
  }
  const qty = u.quantity?.trim() ? ` · ${u.quantity.trim()}` : ''
  return `${u.total} ${freq}${qty}`
}

// ── Dados iniciais ────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const INITIAL: CareItem[] = [
  {
    id:'care-luna-food',  petId:'pet-1', emoji:'🍽️', title:'Alimentación',
    sub:'2 al día · 80g', total:2, period:'day',    intervalDays:1,
    startDate:today, quantity:'80g', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#FFF3DC,#FFE0A0)', doneByDate:{},
  },
  {
    id:'care-luna-brush', petId:'pet-1', emoji:'🪮',  title:'Cepillado',
    sub:'1 por semana',   total:1, period:'week',   intervalDays:7,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#F0E8FF,#DDD0FF)', doneByDate:{},
  },
  {
    id:'care-luna-bath',  petId:'pet-1', emoji:'🛁',  title:'Baño',
    sub:'1 cada 14 días', total:1, period:'custom', intervalDays:14,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E0F8FF,#A8DCFF)', doneByDate:{},
  },
  {
    id:'care-toby-water', petId:'pet-2', emoji:'💧',  title:'Agua fresca',
    sub:'3 al día',       total:3, period:'day',    intervalDays:1,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneByDate:{},
  },
  {
    id:'care-toby-walk',  petId:'pet-2', emoji:'🦮',  title:'Paseo',
    sub:'2 al día',       total:2, period:'day',    intervalDays:1,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E8FFE8,#B8F0B8)', doneByDate:{},
  },
  {
    id:'care-kiwi-water', petId:'pet-3', emoji:'💧',  title:'Agua',
    sub:'2 al día',       total:2, period:'day',    intervalDays:1,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneByDate:{},
  },
]

// ── Context ───────────────────────────────────────────────────────────────────

const CaresContext = createContext<CaresContextValue | null>(null)

export function CaresProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CareItem[]>(INITIAL)

  /** Regista o progresso de um cuidado numa data específica */
  const setCareProgress = useCallback((
    id: string, dateStr: string, done: number, doneState: boolean,
  ) => {
    setItems(prev => prev.map(c =>
      c.id !== id ? c : {
        ...c,
        doneByDate: { ...c.doneByDate, [dateStr]: { done, doneState } },
      }
    ))
  }, [])

  /**
   * PetDetailPage — recebe um CareItem completo já construído e substitui.
   * O sub, intervalDays, period, etc., já vêm calculados pelo chamador.
   */
  const editCare = useCallback((care: CareItem) => {
    setItems(prev => prev.map(c => c.id !== care.id ? c : { ...c, ...care }))
  }, [])

  /**
   * CalendarPage — recebe CareEditData do EditCareModal e recalcula
   * intervalDays e sub internamente, preservando valores custom.
   */
  const updateCare = useCallback((u: CareEditData) => {
    setItems(prev => prev.map(c =>
      c.id !== u.id ? c : {
        ...c,
        emoji:        u.emoji,
        title:        u.title,
        total:        Math.max(1, Number(u.total)),
        period:       u.period ?? 'day',
        intervalDays: resolveIntervalDays(u),
        quantity:     u.quantity ?? '',
        notify:       u.notify ?? true,
        time:         u.time     ?? c.time,
        recurring:    u.recurring ?? c.recurring,
        sub:          buildSub(u),
        bg:           u.bg ?? c.bg,
      }
    ))
  }, [])

  /** Remove um cuidado */
  const deleteCare = useCallback((id: string) => {
    setItems(prev => prev.filter(c => c.id !== id))
  }, [])

  /**
   * Adiciona um cuidado novo.
   * O id pode ser omitido — nesse caso é gerado automaticamente.
   */
  const addCare = useCallback((item: NewCareItem) => {
    const newItem: CareItem = {
      ...item,
      id:         item.id ?? `care-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      doneByDate: item.doneByDate ?? {},
    }
    setItems(prev => [...prev, newItem])
  }, [])

  return (
    <CaresContext.Provider value={{ items, setCareProgress, editCare, updateCare, deleteCare, addCare }}>
      {children}
    </CaresContext.Provider>
  )
}

export function useCares() {
  const ctx = useContext(CaresContext)
  if (!ctx) throw new Error('useCares must be used inside <CaresProvider>')
  return ctx
}

/** Hook para obter apenas os cuidados de uma pet específica */
export function usePetCares(petId: string): CareItem[] {
  const { items } = useCares()
  return items.filter(c => c.petId === petId)
}
```

## File: src/context/LanguageContext.tsx
```typescript
import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from 'react'
import { TRANSLATIONS, LANG_LABELS, type Lang, type Translations } from '../i18n/translations'

// ── Types ────────────────────────────────────────────────────────
interface LanguageContextValue {
  lang:        Lang
  setLang:     (l: Lang) => void
  t:           Translations
  langLabel:   string
}

// ── Context ──────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextValue | null>(null)

// ── Helpers ──────────────────────────────────────────────────────
function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem('pituti-lang')
    if (v === 'es' || v === 'en' || v === 'pt') return v
  } catch { /* ignore */ }
  // Try browser language
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'en') return 'en'
  if (browser === 'pt') return 'pt'
  return 'es'
}

function applyLangToDOM(lang: Lang) {
  document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang)
}

// ── Provider ─────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const l = readStoredLang()
    applyLangToDOM(l)
    return l
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    applyLangToDOM(l)
    try { localStorage.setItem('pituti-lang', l) } catch { /* ignore */ }
  }, [])

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t: TRANSLATIONS[lang],
      langLabel: LANG_LABELS[lang],
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}

/** Convenience shortcut: returns just the translation object */
export function useT() {
  return useLanguage().t
}

export type { Lang }
```

## File: src/context/VetContext.tsx
```typescript
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const CONDITION_GROUPS = {
  endocrine: 'Endócrinas y Metabólicas',
  degenerative: 'Degenerativas y Estructurales',
  viral: 'Virales Incurables',
  neurological: 'Neurológicas y Autoinmunes',
  other: 'Otras Condiciones',
} as const

export interface ConditionItem {
  id: string
  label: string
  group: string
  species?: 'cat' | 'dog'
}

export const CONDITIONS_CATALOG: ConditionItem[] = [
  { id: 'diabetes', label: 'Diabetes Mellitus', group: CONDITION_GROUPS.endocrine },
  { id: 'hypothyroidism', label: 'Hipotiroidismo', group: CONDITION_GROUPS.endocrine, species: 'dog' },
  { id: 'hyperthyroidism', label: 'Hipertiroidismo', group: CONDITION_GROUPS.endocrine, species: 'cat' },
  { id: 'ckd', label: 'Insuficiencia Renal Crónica', group: CONDITION_GROUPS.degenerative },
  { id: 'arthritis', label: 'Artritis y Artrosis', group: CONDITION_GROUPS.degenerative },
  { id: 'hipdysplasia', label: 'Displasia de Cadera', group: CONDITION_GROUPS.degenerative },
  { id: 'cardiopathy', label: 'Cardiopatías Crónicas', group: CONDITION_GROUPS.degenerative },
  { id: 'felv', label: 'FeLV Leucemia Felina', group: CONDITION_GROUPS.viral, species: 'cat' },
  { id: 'fiv', label: 'FIV Inmunodeficiencia Felina', group: CONDITION_GROUPS.viral, species: 'cat' },
  { id: 'epilepsy', label: 'Epilepsia', group: CONDITION_GROUPS.neurological },
  { id: 'lupus', label: 'Lupus y Pénfigo', group: CONDITION_GROUPS.neurological },
  { id: 'atopy', label: 'Atopia y Alergias Crónicas', group: CONDITION_GROUPS.other },
  { id: 'blinddeaf', label: 'Ceguera o Sordera', group: CONDITION_GROUPS.other },
]

export interface Surgery {
  id: string
  name: string
  date?: string
  notes?: string
}

export interface PetMedicalProfile {
  petId: string
  sex?: 'male' | 'female'
  neutered?: boolean
  neuteredAge?: string
  bloodType?: string
  allergies?: string
  chronicConditionIds: string[]
  customConditions: string[]
  surgeries: Surgery[]
  behavioralNotes?: string
  environment?: 'apartment' | 'house' | 'both'
  livingWithAnimals?: boolean
  parasiteControl?: string
  vetQuestions?: string
  updatedAt?: string
}

export type VetType = 'primary' | 'specialist' | 'emergency' | 'other'

export interface VetContact {
  id: string
  name: string
  clinic: string
  type: VetType
  specialty?: string
  phone: string
  phone2?: string
  address?: string
  notes?: string
  petIds: string[]
  createdAt: string
}

export type AppointmentType =
  | 'routine'
  | 'emergency'
  | 'specialist'
  | 'followup'
  | 'exam'
  | 'vaccine'
  | 'other'

export interface VetAppointment {
  id: string
  petId: string
  vetContactId?: string
  vetName: string
  clinic?: string
  date: string
  time?: string
  type: AppointmentType
  reason: string
  diagnosis?: string
  treatment?: string
  nextAppointmentDate?: string
  nextAppointmentNote?: string
  weightKg?: number
  costBrl?: number
  notes?: string
  createdAt: string
}

export interface VetCalendarDate {
  date: string
  petId: string
  label: string
  kind: 'past' | 'next'
}

interface VetContextValue {
  getMedicalProfile: (petId: string) => PetMedicalProfile
  saveMedicalProfile: (profile: PetMedicalProfile) => void
  vets: VetContact[]
  addVet: (v: Omit<VetContact, 'id' | 'createdAt'>) => void
  updateVet: (v: VetContact) => void
  deleteVet: (id: string) => void
  appointments: VetAppointment[]
  addAppointment: (a: Omit<VetAppointment, 'id' | 'createdAt'>) => void
  updateAppointment: (a: VetAppointment) => void
  deleteAppointment: (id: string) => void
  vetCalendarDates: VetCalendarDate[]
}

const VetContext = createContext<VetContextValue | null>(null)

function buildDefaultProfile(petId: string): PetMedicalProfile {
  return {
    petId,
    chronicConditionIds: [],
    customConditions: [],
    surgeries: [],
  }
}

export function VetProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, PetMedicalProfile>>({})
  const [vets, setVets] = useState<VetContact[]>([])
  const [appointments, setAppointments] = useState<VetAppointment[]>([])

  const getMedicalProfile = (petId: string) => profiles[petId] ?? buildDefaultProfile(petId)

  const saveMedicalProfile = (profile: PetMedicalProfile) => {
    setProfiles(prev => ({
      ...prev,
      [profile.petId]: {
        ...profile,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  const addVet = (data: Omit<VetContact, 'id' | 'createdAt'>) => {
    setVets(prev => [
      ...prev,
      { ...data, id: `vet-${Date.now()}`, createdAt: new Date().toISOString() },
    ])
  }

  const updateVet = (vet: VetContact) => {
    setVets(prev => prev.map(v => (v.id === vet.id ? vet : v)))
  }

  const deleteVet = (id: string) => {
    setVets(prev => prev.filter(v => v.id !== id))
  }

  const addAppointment = (data: Omit<VetAppointment, 'id' | 'createdAt'>) => {
    setAppointments(prev => [
      ...prev,
      { ...data, id: `apt-${Date.now()}`, createdAt: new Date().toISOString() },
    ])
  }

  const updateAppointment = (appointment: VetAppointment) => {
    setAppointments(prev => prev.map(a => (a.id === appointment.id ? appointment : a)))
  }

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  const vetCalendarDates = useMemo<VetCalendarDate[]>(() => {
    const result: VetCalendarDate[] = []

    for (const appt of appointments) {
      result.push({
        date: appt.date,
        petId: appt.petId,
        label: appt.reason,
        kind: 'past',
      })

      if (appt.nextAppointmentDate) {
        result.push({
          date: appt.nextAppointmentDate,
          petId: appt.petId,
          label: appt.nextAppointmentNote ?? 'Retorno programado',
          kind: 'next',
        })
      }
    }

    return result
  }, [appointments])

  return (
    <VetContext.Provider
      value={{
        getMedicalProfile,
        saveMedicalProfile,
        vets,
        addVet,
        updateVet,
        deleteVet,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        vetCalendarDates,
      }}
    >
      {children}
    </VetContext.Provider>
  )
}

export function useVet() {
  const ctx = useContext(VetContext)
  if (!ctx) throw new Error('useVet must be used inside VetProvider')
  return ctx
}
```

## File: src/i18n/translations.ts
```typescript
// ══════════════════════════════════════════════════════════════════
// PITUTI — Translations (ES · EN · PT-BR)
// Primary language: Spanish (Castellano)
// ══════════════════════════════════════════════════════════════════
//
// HOW TO ADD A KEY:
//  1. Add the key to the Translations interface (with type)
//  2. Add the value to `es` (primary — required)
//  3. Add the value to `en` and `pt`
//  4. Replace inline `L` objects in components with `t('namespace.key')`
//
// DYNAMIC STRINGS: use "{n}" / "{name}" placeholders and replace at
//   call-site with: t('...').replace('{n}', String(count))
// ══════════════════════════════════════════════════════════════════

export type Lang = 'es' | 'en' | 'pt'

export interface Translations {
  // ── Navigation ──────────────────────────────────────────────────
  nav: {
    main:      string
    health:    string
    account:   string
    dashboard: string
    pets:      string
    cares:     string
    vaccines:  string
    medications: string
    symptoms:  string
    notes:     string
    settings:  string
    calendar:  string
    vet:       string
    collapse:  string
  }
  // ── Common buttons / actions ────────────────────────────────────
  btn: {
    save:        string
    saveChanges: string
    cancel:      string
    close:       string
    edit:        string
    delete:      string
    add:         string
    register:    string
    confirm:     string
    discard:     string
    export:      string
    invite:      string
    share:       string
    back:        string
    seeAll:      string
    loading:     string
    done:        string
    resolve:     string
    archive:     string
    unarchive:   string
    reopen:      string
    new:         string
    update:      string
    optional:    string
  }
  // ── Common field labels ──────────────────────────────────────────
  field: {
    name:        string
    date:        string
    time:        string
    notes:       string
    phone:       string
    address:     string
    specialty:   string
    clinic:      string
    weight:      string
    cost:        string
    yes:         string
    no:          string
  }
  // ── Dashboard ───────────────────────────────────────────────────
  dashboard: {
    greeting_morning:   string
    greeting_afternoon: string
    greeting_evening:   string
    todayCares:       string
    upcomingEvents:   string
    allGood:          string
    alerts:           string
    noAlerts:         string
    noActiveSymptoms: string
    addFirstPet:      string
    pendingTasks:     string
  }
  // ── Pets ────────────────────────────────────────────────────────
  pets: {
    title:       string
    subtitle:    string
    new:         string
    noResults:   string
    noResultsHint: string
    noPets:      string
    noPetsHint:  string
    addPet:      string
    search:      string
    searchHint:  string
    species:     string
    allSpecies:  string
    name:        string
    breed:       string
    birthDate:   string
    weight:      string
    age:         string
    health:      string
    lastActivity: string
    caregivers:  string
    shareCares:  string
    identity:    string
    physicalData: string
    optional:    string
    newPetTitle:    string
    newPetSubtitle: string
    savedPet:    string
    speciesOptions: {
      cat:     string
      dog:     string
      bird:    string
      rabbit:  string
      reptile: string
      fish:    string
      other:   string
    }
  }
  // ── Cares ───────────────────────────────────────────────────────
  cares: {
    title:        string
    subtitle:     string
    addCare:      string
    completed:    string
    all:          string
    urgent:       string
    pending:      string
    done:         string
    dayDone:      string
    registerCare: string
  }
  // ── Vaccines ────────────────────────────────────────────────────
  vaccines: {
    title:          string
    subtitle:       string
    register:       string
    coverage:       string
    upToDate:       string
    expiringSoon:   string
    expired:        string
    lastApplied:    string
    nextDose:       string
    applied:        string
    noVaccines:     string
  }
  // ── Medications ─────────────────────────────────────────────────
  medications: {
    title:        string
    subtitle:     string
    add:          string
    active:       string
    history:      string
    adherence:    string
    nextDoses:    string
    dose:         string
    frequency:    string
    startDate:    string
    endDate:      string
    finished:     string
    unarchive:    string
  }
  // ── Symptoms ────────────────────────────────────────────────────
  symptoms: {
    title:        string
    subtitle:     string
    register:     string
    active:       string
    resolved:     string
    history:      string
    severity:     string
    category:     string
    date:         string
    notes:        string
    noActive:     string
    noResolved:   string
    markResolved: string
    reopen:       string
    severityOptions: {
      leve:       string
      moderado:   string
      grave:      string
      emergencia: string
    }
    categoryOptions: {
      digestivo:      string
      respiratorio:   string
      piel:           string
      comportamiento: string
      movimiento:     string
      ocular:         string
      otro:           string
    }
  }
  // ── Notes ───────────────────────────────────────────────────────
  notes: {
    title:         string
    subtitle:      string
    new:           string
    archived:      string
    noNotes:       string
    content:       string
    vet:           string
    type:          string
    typeOptions: {
      control:     string
      observacion: string
      emergencia:  string
      vacuna:      string
      cirugia:     string
      otro:        string
    }
    deleteNote:    string
    deleteConfirm: string
    deletedNote:   string
  }
  // ── Calendar ────────────────────────────────────────────────────
  calendar: {
    // existing keys
    title:        string
    subtitle:     string
    today:        string
    allEvents:    string
    late:         string
    soon:         string
    upToDate:     string
    medication:   string
    noEvents:     string
    overdueTitle: string
    overdueHint:  string
    monthPrev:    string
    monthNext:    string
    // Alerts banner
    alertsTitle:    string
    alertsWarn:     string
    vacExpiredTag:  string
    vacExpiredSince: string
    // Filters
    filterLabel:         string
    clearFilters:        string
    filterGroupCares:    string
    filterGroupVaccines: string
    filterGroupVet:      string
    filterPending:       string
    filterDone:          string
    filterVaccDue:       string
    filterVaccExpired:   string
    filterVetVisit:      string
    filterVetReturn:     string
    // Day detail
    dayEmpty:      string
    dayCares:      string
    dayVaccines:   string
    dayVetVisits:  string
    editCare:      string
    // Care status
    carePending:   string
    careDone:      string
    careSkipped:   string
    // Vaccine action
    vaccineApply:  string
    // Vet event kinds
    vetVisitKind:  string
    vetReturnKind: string
    // Events count tooltip — use "{n}"
    eventsCount:   string
  }
  // ── Veterinary ──────────────────────────────────────────────────
  vet: {
    // Page header
    pageTitle:    string
    pageSubtitle: string
    // Tabs
    tabs: {
      profile:      string
      vets:         string
      appointments: string
      exams:        string
      documents:    string
    }
    // Coming soon panels
    comingSoon: {
      exams:     string
      documents: string
      label:     string
    }
    // Medical profile — display
    profile: {
      emptyTitle:  string
      emptyText:   string
      emptyBtn:    string
      editBtn:     string
      lastUpdated: string
      noConditions: string
      noSurgeries:  string
      // Field labels (display cards)
      sex:          string
      sexMale:      string
      sexFemale:    string
      neutered:     string
      neuteredYes:  string
      neuteredNo:   string
      neuteredAge:  string
      bloodType:    string
      bloodTypePh:  string
      bloodTypeHint: string
      allergies:        string
      conditions:       string
      surgeries:        string
      environment:      string
      envApartment:     string
      envHouse:         string
      envBoth:          string
      livingWithAnimals: string
      parasiteControl:  string
      behavioralNotes:  string
      vetQuestions:     string
      // Modal
      modalTitle:      string
      editingFor:      string   // "{name}"
      savedSuccess:    string
      savedSuccessFor: string   // "{name}"
      // Form sections
      sectionBasic:       string
      sectionConditions:  string
      sectionSurgeries:   string
      sectionEnvironment: string
      sectionVetNotes:    string
      // Condition form
      customConditionPh: string
      addCondition:      string
      // Surgery form
      surgeryNamePh:  string
      surgeryNotesPh: string
      addSurgery:     string
      removeSurgery:  string
    }
    // Vet contact types
    contactTypes: {
      primary:    string
      specialist: string
      emergency:  string
      other:      string
    }
    // Vet contacts — list & form
    contacts: {
      addBtn:      string
      emptyTitle:  string
      emptyText:   string
      phone2:      string
      deleteConfirm: string
      // Form
      titleAdd:      string
      titleEdit:     string
      subtitleAdd:   string
      subtitleEdit:  string   // "{name}"
      sectionType:    string
      sectionContact: string
      sectionPets:    string
      sectionNotes:   string
      vetNamePh:    string
      clinicPh:     string
      specialtyPh:  string
      phonePh:      string
      phone2Ph:     string
      addressPh:    string
      notesPh:      string
      errName:      string
      errClinic:    string
      errPhone:     string
    }
    // Appointment types
    apptTypes: {
      routine:    string
      emergency:  string
      specialist: string
      followup:   string
      exam:       string
      vaccine:    string
      other:      string
    }
    // Appointments — list & form
    appointments: {
      addBtn:        string
      nextLabel:     string
      historyLabel:  string
      emptyTitle:    string
      emptyText:     string   // "{name}"
      deleteConfirm: string
      // Detail display
      diagnosis:  string
      treatment:  string
      weight:     string
      nextReturn: string
      // Form sections
      sectionDateTime:   string
      sectionVet:        string
      sectionDetails:    string
      sectionFollowUp:   string
      sectionExtra:      string
      // Form fields
      vetContactLabel:   string
      vetContactNone:    string
      vetNamePh:         string
      clinicPh:          string
      reason:            string
      reasonPh:          string
      diagnosisPh:       string
      treatmentPh:       string
      nextDate:          string
      nextNote:          string
      nextNotePh:        string
      weightPh:          string
      cost:              string
      costPh:            string
      notesPh:           string
      // Validation
      errReason:  string
      errVetName: string
      errDate:    string
      // Actions
      register:   string
      update:     string
      // Modal titles
      titleAdd:     string
      titleEdit:    string
      subtitleAdd:  string
      subtitleEdit: string   // "{date}"
    }
    // Toast messages
    toast: {
      vetAdded:     string
      vetUpdated:   string
      vetDeleted:   string
      apptAdded:    string
      apptUpdated:  string
      apptDeleted:  string
      profileSaved: string
    }
    // Relative time labels
    time: {
      today:    string
      tomorrow: string
      inDays:   string   // "En {n} días"
      daysAgo:  string   // "Hace {n} días"
    }
  }
  // ── Settings ────────────────────────────────────────────────────
  settings: {
    title:           string
    subtitle:        string
    personalData:    string
    personalSubtitle: string
    profilePhoto:    string
    photoHint:       string
    changePhoto:     string
    fullName:        string
    email:           string
    phone:           string
    city:            string
    about:           string
    fullNamePlaceholder: string
    phonePlaceholder:    string
    cityPlaceholder:     string
    aboutPlaceholder:    string
    appearance:      string
    theme:           string
    themeHint:       string
    changeTheme:     string
    language:        string
    languageHint:    string
    notifications:   string
    vaccineAlert:    string
    vaccineAlertHint: string
    medAlert:        string
    medAlertHint:    string
    symptomAlert:    string
    symptomAlertHint: string
    weeklyDigest:    string
    weeklyDigestHint: string
    urgentAlerts:    string
    urgentAlertsHint: string
    dangerZone:      string
    exportData:      string
    exportHint:      string
    exportBtn:       string
    deleteAccount:   string
    deleteHint:      string
    deleteBtn:       string
    saved:           string
    deleteModal: {
      title:        string
      subtitle:     string
      willLose:     string
      petProfiles:  string
      vaccines:     string
      medications:  string
      records:      string
      dailyCares:   string
      caregivers:   string
      warning:      string
      continue:     string
      typePrompt:   string
      typeWord:     string
      typeError:    string
      confirmBtn:   string
      finalWarning: string
    }
  }
  // ── Topbar ──────────────────────────────────────────────────────
  topbar: {
    searchPlaceholder: string
    noNotifications:   string
    changeTheme:       string
  }
  // ── Modals / forms ──────────────────────────────────────────────
  modal: {
    close:    string
    editPet:  string
    registerVaccine:  string
    vaccineApplied:   string
    vaccineNext:      string
    vaccineVet:       string
    vaccineNotes:     string
    vaccineSaved:     string
    selectVaccine:    string
    shareCares:            string
    shareInvite:           string
    activeCaregiversLabel: string
    inviteNew:             string
    accessLevel:           string
    sendInvitation:        string
    inviteSent:            string
    inviteExpiry:          string
    understood:            string
    removeCaregiver:       string
    editCare:    string
    addInfo:     string
    frequency:   string
    perDay:      string
    perWeek:     string
    perMonth:    string
    quantity:    string
    notify:      string
    readOnly:        string
    readOnlyHint:    string
    caregiver:       string
    caregiverHint:   string
    fullAccess:      string
    fullAccessHint:  string
  }
  // ── Status labels ───────────────────────────────────────────────
  status: {
    active:    string
    resolved:  string
    archived:  string
    expired:   string
    soon:      string
    upToDate:  string
    finished:  string
    new:       string
  }
  // ── Toast messages ──────────────────────────────────────────────
  toast: {
    changesSaved:      string
    themeChanged:      string
    petAdded:          string
    careRegistered:    string
    inviteSent:        string
    symptomResolved:   string
    symptomReopened:   string
    noteArchived:      string
    noteUnarchived:    string
    noteDeleted:       string
    csvDownloaded:     string
    vaccineRegistered: string
    medAdded:          string
    photoUpdated:      string
    languageChanged:   string
  }
  // ── Dates ───────────────────────────────────────────────────────
  dates: {
    today:         string
    yesterday:     string
    days_ago:      string   // "{n} días" — replace {n}
    months:        string[]
    weekdays:      string[]
    weekdaysShort: string[]
  }
}

// ══════════════════════════════════════════════════════════════════
// ESPAÑOL (primary)
// ══════════════════════════════════════════════════════════════════
const es: Translations = {
  nav: {
    main: 'Principal', health: 'Salud', account: 'Cuenta',
    dashboard: 'Dashboard', pets: 'Mis Mascotas', cares: 'Cuidados',
    vaccines: 'Vacunas', medications: 'Medicamentos', symptoms: 'Síntomas',
    notes: 'Notas', settings: 'Ajustes', calendar: 'Calendario',
    vet: 'Veterinaria', collapse: 'Colapsar',
  },
  btn: {
    save: 'Guardar', saveChanges: 'Guardar cambios', cancel: 'Cancelar',
    close: 'Cerrar', edit: 'Editar', delete: 'Eliminar', add: 'Añadir',
    register: 'Registrar', confirm: 'Confirmar', discard: 'Descartar',
    export: 'Exportar', invite: 'Invitar', share: 'Compartir',
    back: 'Volver', seeAll: 'Ver todos', loading: 'Cargando…',
    done: 'Hecho', resolve: 'Marcar resuelto', archive: 'Archivar',
    unarchive: 'Desarchivar', reopen: 'Reabrir', new: 'Nuevo',
    update: 'Actualizar', optional: 'opcional',
  },
  field: {
    name: 'Nombre', date: 'Fecha', time: 'Hora', notes: 'Notas',
    phone: 'Teléfono', address: 'Dirección', specialty: 'Especialidad',
    clinic: 'Clínica', weight: 'Peso', cost: 'Coste',
    yes: 'Sí', no: 'No',
  },
  dashboard: {
    greeting_morning: '¡Buenos días', greeting_afternoon: '¡Buenas tardes',
    greeting_evening: '¡Buenas noches',
    todayCares: 'Cuidados de hoy', upcomingEvents: 'Próximos eventos',
    allGood: 'Todo al día ✓', alerts: 'Alertas', noAlerts: 'Sin alertas activas ✓',
    noActiveSymptoms: 'Sin síntomas activos', addFirstPet: 'Añade tu primera mascota',
    pendingTasks: 'pendientes',
  },
  pets: {
    title: 'Mis Mascotas', subtitle: 'mascotas registradas', new: 'Nueva mascota',
    noResults: 'Sin resultados', noResultsHint: 'Prueba con otros filtros.',
    noPets: 'No hay mascotas', noPetsHint: 'Añade tu primera mascota para empezar.',
    addPet: 'Añadir mascota', search: 'Buscar',
    searchHint: 'Buscar por nombre, especie o raza…',
    species: 'Especie', allSpecies: 'Todas', name: 'Nombre', breed: 'Raza',
    birthDate: 'Fecha de nacimiento', weight: 'Peso', age: 'Edad', health: 'Salud',
    lastActivity: 'Última actividad', caregivers: 'Cuidadores', shareCares: 'Compartir',
    identity: 'Identidad', physicalData: 'Datos físicos', optional: 'opcional',
    newPetTitle: 'Nueva mascota', newPetSubtitle: 'Completa los datos para registrarla',
    savedPet: 'añadida correctamente 🐾',
    speciesOptions: {
      cat: 'Gato', dog: 'Perro', bird: 'Ave', rabbit: 'Conejo',
      reptile: 'Reptil', fish: 'Pez', other: 'Otro',
    },
  },
  cares: {
    title: 'Cuidados diarios', subtitle: 'Rutina de todas las mascotas · hoy',
    addCare: '+ Añadir cuidado', completed: 'completados', all: 'Todas',
    urgent: 'Urgentes', pending: 'Pendientes', done: 'Hechos',
    dayDone: '% del día completado', registerCare: 'Registrar',
  },
  vaccines: {
    title: 'Vacunas', subtitle: 'Control de vacunación de tus mascotas',
    register: '💉 Registrar vacuna', coverage: 'Cobertura', upToDate: 'Al día',
    expiringSoon: 'Por vencer', expired: 'Vencida', lastApplied: 'Última aplicación',
    nextDose: 'Próxima dosis', applied: 'Aplicada', noVaccines: 'Sin vacunas registradas',
  },
  medications: {
    title: 'Medicamentos', subtitle: 'Tratamientos activos y archivados',
    add: '+ Añadir medicamento', active: 'Activos', history: 'Historial',
    adherence: 'Adherencia al tratamiento', nextDoses: 'Próximas dosis',
    dose: 'Dosis', frequency: 'Frecuencia', startDate: 'Inicio', endDate: 'Fin',
    finished: 'Terminado', unarchive: 'Desarchivar',
  },
  symptoms: {
    title: 'Síntomas', subtitle: 'Observaciones de comportamiento y salud',
    register: '+ Registrar síntoma', active: 'Activos', resolved: 'Resueltos',
    history: 'Historial', severity: 'Severidad', category: 'Categoría',
    date: 'Fecha', notes: 'Notas', noActive: 'Sin síntomas activos ✓',
    noResolved: 'Sin síntomas resueltos', markResolved: 'Marcar resuelto',
    reopen: '↩ Reabrir',
    severityOptions: {
      leve: 'Leve', moderado: 'Moderado', grave: 'Grave', emergencia: 'Emergencia',
    },
    categoryOptions: {
      digestivo: 'Digestivo', respiratorio: 'Respiratorio', piel: 'Piel',
      comportamiento: 'Comportamiento', movimiento: 'Movimiento',
      ocular: 'Ocular', otro: 'Otro',
    },
  },
  notes: {
    title: 'Notas', subtitle: 'Notas veterinarias y observaciones',
    new: '+ Nueva nota', archived: 'Archivadas', noNotes: 'Sin notas',
    content: 'Contenido', vet: 'Veterinario', type: 'Tipo',
    typeOptions: {
      control: 'Control', observacion: 'Observación', emergencia: 'Emergencia',
      vacuna: 'Post-vacuna', cirugia: 'Cirugía', otro: 'Otro',
    },
    deleteNote: 'Eliminar nota',
    deleteConfirm: '¿Eliminar esta nota permanentemente?',
    deletedNote: 'Nota eliminada',
  },
  calendar: {
    // existing
    title: 'Calendario', subtitle: 'Vista mensual de cuidados, vacunas y veterinaria',
    today: 'Hoy', allEvents: 'Todos', late: 'Vencidas', soon: 'Pronto (30d)',
    upToDate: 'Al día', medication: 'Medicamentos',
    noEvents: 'Sin eventos este día', overdueTitle: 'evento(s) vencido(s)',
    overdueHint: 'Ver todos', monthPrev: 'Mes anterior', monthNext: 'Mes siguiente',
    // alerts banner
    alertsTitle: 'Vacunas vencidas',
    alertsWarn: '⚠ Consulta con el veterinario lo antes posible',
    vacExpiredTag: 'VENCIDA',
    vacExpiredSince: 'Venció:',
    // filters
    filterLabel: 'Filtrar calendario',
    clearFilters: 'Limpiar filtros',
    filterGroupCares: 'Cuidados',
    filterGroupVaccines: 'Vacunas',
    filterGroupVet: 'Veterinaria',
    filterPending: 'Pendiente',
    filterDone: 'Realizado',
    filterVaccDue: 'Próxima vacuna',
    filterVaccExpired: 'Vacuna vencida',
    filterVetVisit: 'Consulta veterinaria',
    filterVetReturn: 'Retorno programado',
    // day detail
    dayEmpty: 'Sin eventos este día',
    dayCares: 'Cuidados del día',
    dayVaccines: 'Vacunas',
    dayVetVisits: 'Consultas / Citas',
    editCare: 'Editar cuidado',
    // care status
    carePending: 'Pendiente',
    careDone: 'Realizado',
    careSkipped: 'Omitido',
    // vaccine
    vaccineApply: 'Aplicar ahora',
    // vet event kinds
    vetVisitKind: 'Consulta',
    vetReturnKind: 'Retorno programado',
    // tooltip
    eventsCount: '{n} evento(s)',
  },
  vet: {
    pageTitle: 'Veterinaria',
    pageSubtitle: 'Salud clínica y registros médicos',
    tabs: {
      profile: 'Perfil médico',
      vets: 'Mis veterinarios',
      appointments: 'Consultas',
      exams: 'Exámenes',
      documents: 'Documentos',
    },
    comingSoon: {
      exams: 'Guarda resultados de exámenes, recetas e informes en un solo lugar.',
      documents: 'Pasaporte digital y compartición de datos con tu veterinario.',
      label: 'Próximamente',
    },
    profile: {
      emptyTitle: 'Sin perfil médico',
      emptyText: 'Rellena el perfil de tu mascota para que el veterinario tenga toda la información de un vistazo.',
      emptyBtn: 'Completar perfil',
      editBtn: 'Editar perfil',
      lastUpdated: 'Actualizado',
      noConditions: 'Sin condiciones registradas',
      noSurgeries: 'Sin cirugías registradas',
      sex: 'Sexo',
      sexMale: 'Macho',
      sexFemale: 'Hembra',
      neutered: 'Castrado / Esterilizado',
      neuteredYes: 'Sí',
      neuteredNo: 'No',
      neuteredAge: 'Edad en la castración',
      bloodType: 'Grupo sanguíneo',
      bloodTypePh: 'Ej. A, B, AB, DEA 1.1…',
      bloodTypeHint: 'Varía según la especie — escribe libremente',
      allergies: 'Alergias conocidas',
      conditions: 'Condiciones crónicas',
      surgeries: 'Cirugías',
      environment: 'Tipo de hábitat',
      envApartment: 'Piso / Apartamento',
      envHouse: 'Casa con jardín',
      envBoth: 'Ambos',
      livingWithAnimals: 'Convive con otros animales',
      parasiteControl: 'Antiparasitario habitual',
      behavioralNotes: 'Notas de comportamiento',
      vetQuestions: 'Preguntas para el veterinario',
      modalTitle: 'Perfil médico',
      editingFor: 'Editando perfil de {name}',
      savedSuccess: 'Perfil guardado',
      savedSuccessFor: 'El historial de {name} ha sido actualizado',
      sectionBasic: 'Datos básicos',
      sectionConditions: 'Condiciones crónicas',
      sectionSurgeries: 'Cirugías e intervenciones',
      sectionEnvironment: 'Entorno y comportamiento',
      sectionVetNotes: 'Notas para el veterinario',
      customConditionPh: 'Nombre de la condición',
      addCondition: 'Añadir',
      surgeryNamePh: 'Ej. Castración, Extracción dental',
      surgeryNotesPh: 'Observaciones',
      addSurgery: '+ Añadir cirugía',
      removeSurgery: '×',
    },
    contactTypes: {
      primary: 'Principal',
      specialist: 'Especialista',
      emergency: 'Urgencias',
      other: 'Otro',
    },
    contacts: {
      addBtn: 'Añadir veterinario',
      emptyTitle: 'Sin veterinarios guardados',
      emptyText: 'Guarda el contacto de tu veterinario para acceder rápidamente.',
      phone2: 'Tel. alternativo',
      deleteConfirm: '¿Confirmar eliminación?',
      titleAdd: 'Añadir veterinario',
      titleEdit: 'Editar veterinario',
      subtitleAdd: 'Guarda el contacto de tu veterinario de confianza',
      subtitleEdit: 'Editando contacto de {name}',
      sectionType: 'Tipo de veterinario',
      sectionContact: 'Datos de contacto',
      sectionPets: 'Mascotas asociadas',
      sectionNotes: 'Notas adicionales',
      vetNamePh: 'Ej. Dra. García',
      clinicPh: 'Ej. Clínica VetSalud',
      specialtyPh: 'Ej. Dermatología, Oncología',
      phonePh: 'Ej. +34 612 345 678',
      phone2Ph: 'Ej. +34 611 222 333',
      addressPh: 'Calle, número, ciudad',
      notesPh: 'Horarios, instrucciones especiales…',
      errName: 'El nombre es obligatorio',
      errClinic: 'La clínica es obligatoria',
      errPhone: 'El teléfono es obligatorio',
    },
    apptTypes: {
      routine: 'Revisión',
      emergency: 'Urgencia',
      specialist: 'Especialista',
      followup: 'Retorno',
      exam: 'Exámenes',
      vaccine: 'Vacuna',
      other: 'Otro',
    },
    appointments: {
      addBtn: 'Registrar consulta',
      nextLabel: '📅 Próximo retorno',
      historyLabel: 'Historial de consultas',
      emptyTitle: 'Sin consultas registradas',
      emptyText: 'Registra la primera consulta de {name} para llevar el historial.',
      deleteConfirm: '¿Confirmar eliminación?',
      diagnosis: 'Diagnóstico',
      treatment: 'Tratamiento',
      weight: 'Peso en la visita',
      nextReturn: 'Retorno',
      sectionDateTime: 'Fecha y hora',
      sectionVet: 'Veterinario',
      sectionDetails: 'Detalles de la consulta',
      sectionFollowUp: 'Seguimiento',
      sectionExtra: 'Datos adicionales',
      vetContactLabel: 'Veterinario guardado',
      vetContactNone: 'Introducir manualmente',
      vetNamePh: 'Ej. Dra. García',
      clinicPh: 'Ej. Clínica VetSalud',
      reason: 'Motivo de la consulta',
      reasonPh: 'Ej. Revisión anual, tos persistente…',
      diagnosisPh: 'Diagnóstico del veterinario',
      treatmentPh: 'Medicamentos, dosis, indicaciones…',
      nextDate: 'Fecha de retorno',
      nextNote: 'Nota del retorno',
      nextNotePh: 'Ej. Revisión post-tratamiento',
      weightPh: 'Ej. 4.2',
      cost: 'Coste de la consulta',
      costPh: 'Ej. 45.00',
      notesPh: 'Cualquier observación relevante…',
      errReason: 'El motivo es obligatorio',
      errVetName: 'El nombre del veterinario es obligatorio',
      errDate: 'La fecha es obligatoria',
      register: 'Registrar consulta',
      update: 'Guardar cambios',
      titleAdd: 'Registrar consulta',
      titleEdit: 'Editar consulta',
      subtitleAdd: 'Guarda el historial veterinario de tu mascota',
      subtitleEdit: 'Editando consulta del {date}',
    },
    toast: {
      vetAdded: 'Veterinario añadido ✓',
      vetUpdated: 'Veterinario actualizado ✓',
      vetDeleted: 'Veterinario eliminado',
      apptAdded: 'Consulta registrada ✓',
      apptUpdated: 'Consulta actualizada ✓',
      apptDeleted: 'Consulta eliminada',
      profileSaved: 'Perfil guardado ✓',
    },
    time: {
      today: 'Hoy',
      tomorrow: 'Mañana',
      inDays: 'En {n} días',
      daysAgo: 'Hace {n} días',
    },
  },
  settings: {
    title: 'Ajustes', subtitle: 'Cuenta y preferencias',
    personalData: 'Datos personales', personalSubtitle: 'Tu información en PITUTI',
    profilePhoto: 'Foto de perfil', photoHint: 'JPG, PNG o WebP · Máx. 2 MB',
    changePhoto: 'Cambiar', fullName: 'Nombre completo',
    email: 'Correo electrónico', phone: 'Teléfono', city: 'Ciudad', about: 'Sobre mí',
    fullNamePlaceholder: 'Tu nombre y apellido', phonePlaceholder: '+34 600 000 000',
    cityPlaceholder: 'Madrid, Barcelona…', aboutPlaceholder: 'Cuidador/a de mascotas…',
    appearance: 'Apariencia', theme: 'Tema de la app', themeHint: 'Claro u oscuro',
    changeTheme: 'Cambiar', language: 'Idioma',
    languageHint: 'Español · English · Português', notifications: 'Notificaciones',
    vaccineAlert: 'Vacunas a vencer', vaccineAlertHint: '7 días antes del vencimiento',
    medAlert: 'Dosis de medicamentos', medAlertHint: 'Recordatorio diario de dosis',
    symptomAlert: 'Síntomas sin resolución',
    symptomAlertHint: 'Cuando un síntoma lleva +3 días',
    weeklyDigest: 'Resumen semanal', weeklyDigestHint: 'Cada lunes por email',
    urgentAlerts: 'Alertas urgentes', urgentAlertsHint: 'Push inmediato en emergencias',
    dangerZone: 'Zona de riesgo',
    exportData: 'Exportar datos',
    exportHint: 'Descarga un CSV con todo el historial de tus mascotas, vacunas, medicamentos y síntomas.',
    exportBtn: 'Exportar CSV',
    deleteAccount: 'Eliminar cuenta',
    deleteHint: 'Acción permanente e irreversible. Se borrarán todos tus datos, mascotas e historial.',
    deleteBtn: 'Eliminar cuenta', saved: 'Guardado',
    deleteModal: {
      title: 'Eliminar cuenta permanentemente',
      subtitle: 'Esta acción no se puede deshacer',
      willLose: 'Si eliminas tu cuenta se perderá permanentemente:',
      petProfiles: 'El perfil completo de todas tus mascotas',
      vaccines: 'Historial de vacunas y próximas dosis',
      medications: 'Todos los medicamentos registrados',
      records: 'Síntomas, notas y registros veterinarios',
      dailyCares: 'Cuidados diarios y rutinas configuradas',
      caregivers: 'Acceso compartido con otros cuidadores',
      warning: '⚠ No podrás recuperar estos datos después de eliminar tu cuenta.',
      continue: 'Continuar →',
      typePrompt: 'Para confirmar, escribe',
      typeWord: 'eliminar',
      typeError: 'Escribe exactamente "eliminar" (sin comillas)',
      confirmBtn: 'Eliminar definitivamente',
      finalWarning: 'Al hacer clic en "Eliminar definitivamente" tu cuenta y todos los datos asociados serán borrados permanentemente de los servidores de PITUTI.',
    },
  },
  topbar: {
    searchPlaceholder: 'Buscar mascota, registro…',
    noNotifications: 'Sin notificaciones nuevas',
    changeTheme: 'Cambiar tema',
  },
  modal: {
    close: 'Cerrar', editPet: 'Editar mascota',
    registerVaccine: 'Registrar vacuna', vaccineApplied: 'Fecha de aplicación',
    vaccineNext: 'Próxima dosis', vaccineVet: 'Veterinario (opcional)',
    vaccineNotes: 'Notas (opcional)', vaccineSaved: '¡Registrado!',
    selectVaccine: 'Seleccionar vacuna',
    shareCares: 'Compartir cuidados', shareInvite: 'Invita a cuidadores de',
    activeCaregiversLabel: 'Cuidadores activos', inviteNew: '... Invitar nuevo cuidador',
    accessLevel: 'Nivel de acceso', sendInvitation: '✉ Enviar invitación',
    inviteSent: '¡Invitación enviada!',
    inviteExpiry: '✓ El enlace de invitación expira en 48 horas',
    understood: 'Entendido', removeCaregiver: 'Eliminar',
    editCare: 'Configurar cuidado', addInfo: 'Información adicional',
    frequency: 'Frecuencia', perDay: 'Por día', perWeek: 'Por semana',
    perMonth: 'Por mes', quantity: 'Cantidad (opcional)', notify: 'Activar recordatorio',
    readOnly: 'Solo lectura', readOnlyHint: 'Ver registros, no puede editar',
    caregiver: 'Cuidador', caregiverHint: 'Registrar cuidados y vacunas',
    fullAccess: 'Acceso completo', fullAccessHint: 'Editar perfil y todos los datos',
  },
  status: {
    active: 'Activo', resolved: 'Resuelto', archived: 'Archivado',
    expired: 'Vencida', soon: 'Pronto', upToDate: 'Al día',
    finished: 'Terminado', new: 'Nueva ✓',
  },
  toast: {
    changesSaved: '✓ Cambios guardados correctamente', themeChanged: 'Tema cambiado',
    petAdded: 'añadida correctamente 🐾', careRegistered: 'Cuidado registrado ✓',
    inviteSent: '✉ Invitación enviada a ', symptomResolved: '✓ Síntoma resuelto',
    symptomReopened: '↩ Síntoma reabierto', noteArchived: '📁 Nota archivada',
    noteUnarchived: '✓ Nota desarchivada', noteDeleted: 'Nota eliminada',
    csvDownloaded: '📄 CSV descargado correctamente',
    vaccineRegistered: '💉 Vacuna registrada',
    medAdded: 'Medicamento añadido', photoUpdated: '📸 Foto actualizada',
    languageChanged: 'Idioma actualizado',
  },
  dates: {
    today: 'Hoy', yesterday: 'Ayer', days_ago: 'Hace {n} días',
    months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    weekdays: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    weekdaysShort: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
  },
}

// ══════════════════════════════════════════════════════════════════
// ENGLISH
// ══════════════════════════════════════════════════════════════════
const en: Translations = {
  nav: {
    main: 'Main', health: 'Health', account: 'Account',
    dashboard: 'Dashboard', pets: 'My Pets', cares: 'Daily Care',
    vaccines: 'Vaccines', medications: 'Medications', symptoms: 'Symptoms',
    notes: 'Notes', settings: 'Settings', calendar: 'Calendar',
    vet: 'Vet', collapse: 'Collapse',
  },
  btn: {
    save: 'Save', saveChanges: 'Save changes', cancel: 'Cancel',
    close: 'Close', edit: 'Edit', delete: 'Delete', add: 'Add',
    register: 'Register', confirm: 'Confirm', discard: 'Discard',
    export: 'Export', invite: 'Invite', share: 'Share',
    back: 'Back', seeAll: 'See all', loading: 'Loading…',
    done: 'Done', resolve: 'Mark resolved', archive: 'Archive',
    unarchive: 'Unarchive', reopen: 'Reopen', new: 'New',
    update: 'Update', optional: 'optional',
  },
  field: {
    name: 'Name', date: 'Date', time: 'Time', notes: 'Notes',
    phone: 'Phone', address: 'Address', specialty: 'Specialty',
    clinic: 'Clinic', weight: 'Weight', cost: 'Cost',
    yes: 'Yes', no: 'No',
  },
  dashboard: {
    greeting_morning: 'Good morning', greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    todayCares: "Today's care", upcomingEvents: 'Upcoming events',
    allGood: 'All up to date ✓', alerts: 'Alerts', noAlerts: 'No active alerts ✓',
    noActiveSymptoms: 'No active symptoms', addFirstPet: 'Add your first pet',
    pendingTasks: 'pending',
  },
  pets: {
    title: 'My Pets', subtitle: 'registered pets', new: 'New pet',
    noResults: 'No results', noResultsHint: 'Try different filters.',
    noPets: 'No pets', noPetsHint: 'Add your first pet to get started.',
    addPet: 'Add pet', search: 'Search',
    searchHint: 'Search by name, species or breed…',
    species: 'Species', allSpecies: 'All', name: 'Name', breed: 'Breed',
    birthDate: 'Birth date', weight: 'Weight', age: 'Age', health: 'Health',
    lastActivity: 'Last activity', caregivers: 'Caregivers', shareCares: 'Share',
    identity: 'Identity', physicalData: 'Physical data', optional: 'optional',
    newPetTitle: 'New pet', newPetSubtitle: 'Complete the details to register',
    savedPet: 'added successfully 🐾',
    speciesOptions: {
      cat: 'Cat', dog: 'Dog', bird: 'Bird', rabbit: 'Rabbit',
      reptile: 'Reptile', fish: 'Fish', other: 'Other',
    },
  },
  cares: {
    title: 'Daily care', subtitle: "All pets' routine · today",
    addCare: '+ Add care', completed: 'completed', all: 'All',
    urgent: 'Urgent', pending: 'Pending', done: 'Done',
    dayDone: '% of day completed', registerCare: 'Register',
  },
  vaccines: {
    title: 'Vaccines', subtitle: 'Vaccination tracking for your pets',
    register: '💉 Register vaccine', coverage: 'Coverage', upToDate: 'Up to date',
    expiringSoon: 'Expiring soon', expired: 'Expired', lastApplied: 'Last applied',
    nextDose: 'Next dose', applied: 'Applied', noVaccines: 'No vaccines registered',
  },
  medications: {
    title: 'Medications', subtitle: 'Active and archived treatments',
    add: '+ Add medication', active: 'Active', history: 'History',
    adherence: 'Treatment adherence', nextDoses: 'Next doses',
    dose: 'Dose', frequency: 'Frequency', startDate: 'Start', endDate: 'End',
    finished: 'Finished', unarchive: 'Unarchive',
  },
  symptoms: {
    title: 'Symptoms', subtitle: 'Behaviour and health observations',
    register: '+ Register symptom', active: 'Active', resolved: 'Resolved',
    history: 'History', severity: 'Severity', category: 'Category',
    date: 'Date', notes: 'Notes', noActive: 'No active symptoms ✓',
    noResolved: 'No resolved symptoms', markResolved: 'Mark as resolved',
    reopen: '↩ Reopen',
    severityOptions: {
      leve: 'Mild', moderado: 'Moderate', grave: 'Severe', emergencia: 'Emergency',
    },
    categoryOptions: {
      digestivo: 'Digestive', respiratorio: 'Respiratory', piel: 'Skin',
      comportamiento: 'Behaviour', movimiento: 'Movement',
      ocular: 'Ocular', otro: 'Other',
    },
  },
  notes: {
    title: 'Notes', subtitle: 'Vet notes and observations',
    new: '+ New note', archived: 'Archived', noNotes: 'No notes',
    content: 'Content', vet: 'Veterinarian', type: 'Type',
    typeOptions: {
      control: 'Check-up', observacion: 'Observation', emergencia: 'Emergency',
      vacuna: 'Post-vaccine', cirugia: 'Surgery', otro: 'Other',
    },
    deleteNote: 'Delete note',
    deleteConfirm: 'Delete this note permanently?',
    deletedNote: 'Note deleted',
  },
  calendar: {
    title: 'Calendar', subtitle: 'Monthly view of care, vaccines and vet',
    today: 'Today', allEvents: 'All', late: 'Expired', soon: 'Soon (30d)',
    upToDate: 'Up to date', medication: 'Medications',
    noEvents: 'No events on this day', overdueTitle: 'overdue event(s)',
    overdueHint: 'View all', monthPrev: 'Previous month', monthNext: 'Next month',
    alertsTitle: 'Expired vaccines',
    alertsWarn: '⚠ Contact your vet as soon as possible',
    vacExpiredTag: 'EXPIRED',
    vacExpiredSince: 'Expired:',
    filterLabel: 'Filter calendar',
    clearFilters: 'Clear filters',
    filterGroupCares: 'Care',
    filterGroupVaccines: 'Vaccines',
    filterGroupVet: 'Veterinary',
    filterPending: 'Pending',
    filterDone: 'Done',
    filterVaccDue: 'Upcoming vaccine',
    filterVaccExpired: 'Expired vaccine',
    filterVetVisit: 'Vet appointment',
    filterVetReturn: 'Scheduled return',
    dayEmpty: 'No events on this day',
    dayCares: "Day's care",
    dayVaccines: 'Vaccines',
    dayVetVisits: 'Appointments',
    editCare: 'Edit care',
    carePending: 'Pending',
    careDone: 'Done',
    careSkipped: 'Skipped',
    vaccineApply: 'Apply now',
    vetVisitKind: 'Appointment',
    vetReturnKind: 'Scheduled return',
    eventsCount: '{n} event(s)',
  },
  vet: {
    pageTitle: 'Veterinary',
    pageSubtitle: 'Clinical health and medical records',
    tabs: {
      profile: 'Medical profile',
      vets: 'My vets',
      appointments: 'Appointments',
      exams: 'Exams',
      documents: 'Documents',
    },
    comingSoon: {
      exams: 'Save exam results, prescriptions and reports in one place.',
      documents: 'Digital passport and data sharing with your vet.',
      label: 'Coming soon',
    },
    profile: {
      emptyTitle: 'No medical profile',
      emptyText: 'Fill in your pet\'s profile so the vet has all the information at a glance.',
      emptyBtn: 'Complete profile',
      editBtn: 'Edit profile',
      lastUpdated: 'Updated',
      noConditions: 'No conditions recorded',
      noSurgeries: 'No surgeries recorded',
      sex: 'Sex',
      sexMale: 'Male',
      sexFemale: 'Female',
      neutered: 'Neutered / Spayed',
      neuteredYes: 'Yes',
      neuteredNo: 'No',
      neuteredAge: 'Age at neutering',
      bloodType: 'Blood type',
      bloodTypePh: 'e.g. A, B, AB, DEA 1.1…',
      bloodTypeHint: 'Varies by species — type freely',
      allergies: 'Known allergies',
      conditions: 'Chronic conditions',
      surgeries: 'Surgeries',
      environment: 'Habitat type',
      envApartment: 'Flat / Apartment',
      envHouse: 'House with garden',
      envBoth: 'Both',
      livingWithAnimals: 'Lives with other animals',
      parasiteControl: 'Regular parasite control',
      behavioralNotes: 'Behavioural notes',
      vetQuestions: 'Questions for the vet',
      modalTitle: 'Medical profile',
      editingFor: "Editing {name}'s profile",
      savedSuccess: 'Profile saved',
      savedSuccessFor: "{name}'s history has been updated",
      sectionBasic: 'Basic data',
      sectionConditions: 'Chronic conditions',
      sectionSurgeries: 'Surgeries & procedures',
      sectionEnvironment: 'Environment & behaviour',
      sectionVetNotes: 'Notes for the vet',
      customConditionPh: 'Condition name',
      addCondition: 'Add',
      surgeryNamePh: 'e.g. Neutering, Dental extraction',
      surgeryNotesPh: 'Observations',
      addSurgery: '+ Add surgery',
      removeSurgery: '×',
    },
    contactTypes: {
      primary: 'Primary',
      specialist: 'Specialist',
      emergency: 'Emergency',
      other: 'Other',
    },
    contacts: {
      addBtn: 'Add vet',
      emptyTitle: 'No vets saved',
      emptyText: 'Save your vet\'s contact for quick access.',
      phone2: 'Alt. phone',
      deleteConfirm: 'Confirm deletion?',
      titleAdd: 'Add vet',
      titleEdit: 'Edit vet',
      subtitleAdd: 'Save your trusted vet\'s contact',
      subtitleEdit: "Editing {name}'s contact",
      sectionType: 'Vet type',
      sectionContact: 'Contact details',
      sectionPets: 'Associated pets',
      sectionNotes: 'Additional notes',
      vetNamePh: 'e.g. Dr. Smith',
      clinicPh: 'e.g. City Animal Clinic',
      specialtyPh: 'e.g. Dermatology, Oncology',
      phonePh: 'e.g. +1 555 000 0000',
      phone2Ph: 'e.g. +1 555 111 1111',
      addressPh: 'Street, number, city',
      notesPh: 'Hours, special instructions…',
      errName: 'Name is required',
      errClinic: 'Clinic is required',
      errPhone: 'Phone is required',
    },
    apptTypes: {
      routine: 'Check-up',
      emergency: 'Emergency',
      specialist: 'Specialist',
      followup: 'Follow-up',
      exam: 'Exams',
      vaccine: 'Vaccine',
      other: 'Other',
    },
    appointments: {
      addBtn: 'Register appointment',
      nextLabel: '📅 Next return',
      historyLabel: 'Appointment history',
      emptyTitle: 'No appointments registered',
      emptyText: "Register {name}'s first appointment to start tracking.",
      deleteConfirm: 'Confirm deletion?',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      weight: 'Weight at visit',
      nextReturn: 'Return',
      sectionDateTime: 'Date & time',
      sectionVet: 'Veterinarian',
      sectionDetails: 'Appointment details',
      sectionFollowUp: 'Follow-up',
      sectionExtra: 'Additional data',
      vetContactLabel: 'Saved vet',
      vetContactNone: 'Enter manually',
      vetNamePh: 'e.g. Dr. Smith',
      clinicPh: 'e.g. City Animal Clinic',
      reason: 'Reason for visit',
      reasonPh: 'e.g. Annual check-up, persistent cough…',
      diagnosisPh: 'Vet\'s diagnosis',
      treatmentPh: 'Medications, doses, instructions…',
      nextDate: 'Return date',
      nextNote: 'Return note',
      nextNotePh: 'e.g. Post-treatment review',
      weightPh: 'e.g. 4.2',
      cost: 'Appointment cost',
      costPh: 'e.g. 45.00',
      notesPh: 'Any relevant observation…',
      errReason: 'Reason is required',
      errVetName: "Vet's name is required",
      errDate: 'Date is required',
      register: 'Register appointment',
      update: 'Save changes',
      titleAdd: 'Register appointment',
      titleEdit: 'Edit appointment',
      subtitleAdd: "Save your pet's vet history",
      subtitleEdit: 'Editing appointment on {date}',
    },
    toast: {
      vetAdded: 'Vet added ✓',
      vetUpdated: 'Vet updated ✓',
      vetDeleted: 'Vet removed',
      apptAdded: 'Appointment registered ✓',
      apptUpdated: 'Appointment updated ✓',
      apptDeleted: 'Appointment deleted',
      profileSaved: 'Profile saved ✓',
    },
    time: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      inDays: 'In {n} days',
      daysAgo: '{n} days ago',
    },
  },
  settings: {
    title: 'Settings', subtitle: 'Account and preferences',
    personalData: 'Personal data', personalSubtitle: 'Your info in PITUTI',
    profilePhoto: 'Profile photo', photoHint: 'JPG, PNG or WebP · Max. 2 MB',
    changePhoto: 'Change', fullName: 'Full name',
    email: 'Email address', phone: 'Phone', city: 'City', about: 'About me',
    fullNamePlaceholder: 'Your name and surname', phonePlaceholder: '+1 555 000 0000',
    cityPlaceholder: 'New York, London…', aboutPlaceholder: 'Pet lover and carer…',
    appearance: 'Appearance', theme: 'App theme', themeHint: 'Light or dark',
    changeTheme: 'Change', language: 'Language',
    languageHint: 'Español · English · Português', notifications: 'Notifications',
    vaccineAlert: 'Vaccines expiring', vaccineAlertHint: '7 days before expiry',
    medAlert: 'Medication doses', medAlertHint: 'Daily dose reminder',
    symptomAlert: 'Unresolved symptoms',
    symptomAlertHint: 'When a symptom lasts +3 days',
    weeklyDigest: 'Weekly digest', weeklyDigestHint: 'Every Monday by email',
    urgentAlerts: 'Urgent alerts', urgentAlertsHint: 'Instant push for emergencies',
    dangerZone: 'Danger zone',
    exportData: 'Export data',
    exportHint: "Download a CSV with all your pets' history, vaccines, medications and symptoms.",
    exportBtn: 'Export CSV',
    deleteAccount: 'Delete account',
    deleteHint: 'Permanent and irreversible action. All your data, pets and history will be deleted.',
    deleteBtn: 'Delete account', saved: 'Saved',
    deleteModal: {
      title: 'Permanently delete account',
      subtitle: 'This action cannot be undone',
      willLose: 'If you delete your account you will permanently lose:',
      petProfiles: 'Complete profiles for all your pets',
      vaccines: 'Vaccination history and upcoming doses',
      medications: 'All registered medications',
      records: 'Symptoms, notes and vet records',
      dailyCares: 'Daily care routines and configurations',
      caregivers: 'Shared access with other caregivers',
      warning: '⚠ You will not be able to recover this data after deleting your account.',
      continue: 'Continue →',
      typePrompt: 'To confirm, type',
      typeWord: 'delete',
      typeError: 'Type exactly "delete" (without quotes)',
      confirmBtn: 'Permanently delete',
      finalWarning: 'By clicking "Permanently delete" your account and all associated data will be permanently erased from PITUTI\'s servers.',
    },
  },
  topbar: {
    searchPlaceholder: 'Search pet, record…',
    noNotifications: 'No new notifications',
    changeTheme: 'Change theme',
  },
  modal: {
    close: 'Close', editPet: 'Edit pet',
    registerVaccine: 'Register vaccine', vaccineApplied: 'Application date',
    vaccineNext: 'Next dose', vaccineVet: 'Veterinarian (optional)',
    vaccineNotes: 'Notes (optional)', vaccineSaved: 'Registered!',
    selectVaccine: 'Select vaccine',
    shareCares: 'Share care', shareInvite: 'Invite caregivers for',
    activeCaregiversLabel: 'Active caregivers', inviteNew: 'Invite new caregiver',
    accessLevel: 'Access level', sendInvitation: '✉ Send invitation',
    inviteSent: 'Invitation sent!',
    inviteExpiry: '✓ The invitation link expires in 48 hours',
    understood: 'Got it', removeCaregiver: 'Remove',
    editCare: 'Configure care', addInfo: 'Additional info',
    frequency: 'Frequency', perDay: 'Per day', perWeek: 'Per week',
    perMonth: 'Per month', quantity: 'Quantity (optional)', notify: 'Enable reminder',
    readOnly: 'Read only', readOnlyHint: 'View records, cannot edit',
    caregiver: 'Caregiver', caregiverHint: 'Register care and vaccines',
    fullAccess: 'Full access', fullAccessHint: 'Edit profile and all data',
  },
  status: {
    active: 'Active', resolved: 'Resolved', archived: 'Archived',
    expired: 'Expired', soon: 'Soon', upToDate: 'Up to date',
    finished: 'Finished', new: 'New ✓',
  },
  toast: {
    changesSaved: '✓ Changes saved successfully', themeChanged: 'Theme changed',
    petAdded: 'added successfully 🐾', careRegistered: 'Care registered ✓',
    inviteSent: '✉ Invitation sent to ', symptomResolved: '✓ Symptom resolved',
    symptomReopened: '↩ Symptom reopened', noteArchived: '📁 Note archived',
    noteUnarchived: '✓ Note unarchived', noteDeleted: 'Note deleted',
    csvDownloaded: '📄 CSV downloaded successfully',
    vaccineRegistered: '💉 Vaccine registered',
    medAdded: 'Medication added', photoUpdated: '📸 Photo updated',
    languageChanged: 'Language updated',
  },
  dates: {
    today: 'Today', yesterday: 'Yesterday', days_ago: '{n} days ago',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    weekdaysShort: ['Su','Mo','Tu','We','Th','Fr','Sa'],
  },
}

// ══════════════════════════════════════════════════════════════════
// PORTUGUÊS BRASILEIRO
// ══════════════════════════════════════════════════════════════════
const pt: Translations = {
  nav: {
    main: 'Principal', health: 'Saúde', account: 'Conta',
    dashboard: 'Painel', pets: 'Minhas Mascotes', cares: 'Cuidados',
    vaccines: 'Vacinas', medications: 'Medicamentos', symptoms: 'Sintomas',
    notes: 'Notas', settings: 'Configurações', calendar: 'Calendário',
    vet: 'Veterinária', collapse: 'Recolher',
  },
  btn: {
    save: 'Salvar', saveChanges: 'Salvar alterações', cancel: 'Cancelar',
    close: 'Fechar', edit: 'Editar', delete: 'Excluir', add: 'Adicionar',
    register: 'Registrar', confirm: 'Confirmar', discard: 'Descartar',
    export: 'Exportar', invite: 'Convidar', share: 'Compartilhar',
    back: 'Voltar', seeAll: 'Ver todos', loading: 'Carregando…',
    done: 'Feito', resolve: 'Marcar resolvido', archive: 'Arquivar',
    unarchive: 'Desarquivar', reopen: 'Reabrir', new: 'Novo',
    update: 'Atualizar', optional: 'opcional',
  },
  field: {
    name: 'Nome', date: 'Data', time: 'Hora', notes: 'Notas',
    phone: 'Telefone', address: 'Endereço', specialty: 'Especialidade',
    clinic: 'Clínica', weight: 'Peso', cost: 'Custo',
    yes: 'Sim', no: 'Não',
  },
  dashboard: {
    greeting_morning: 'Bom dia', greeting_afternoon: 'Boa tarde',
    greeting_evening: 'Boa noite',
    todayCares: 'Cuidados de hoje', upcomingEvents: 'Próximos eventos',
    allGood: 'Tudo em dia ✓', alerts: 'Alertas', noAlerts: 'Sem alertas ativos ✓',
    noActiveSymptoms: 'Sem sintomas ativos', addFirstPet: 'Adicione seu primeiro animal',
    pendingTasks: 'pendentes',
  },
  pets: {
    title: 'Minhas Mascotes', subtitle: 'mascotes registradas', new: 'Nova mascote',
    noResults: 'Sem resultados', noResultsHint: 'Tente outros filtros.',
    noPets: 'Sem mascotes', noPetsHint: 'Adicione sua primeira mascote para começar.',
    addPet: 'Adicionar mascote', search: 'Buscar',
    searchHint: 'Buscar por nome, espécie ou raça…',
    species: 'Espécie', allSpecies: 'Todas', name: 'Nome', breed: 'Raça',
    birthDate: 'Data de nascimento', weight: 'Peso', age: 'Idade', health: 'Saúde',
    lastActivity: 'Última atividade', caregivers: 'Cuidadores',
    shareCares: 'Compartilhar',
    identity: 'Identidade', physicalData: 'Dados físicos', optional: 'opcional',
    newPetTitle: 'Nova mascote', newPetSubtitle: 'Preencha os dados para registrá-la',
    savedPet: 'adicionada com sucesso 🐾',
    speciesOptions: {
      cat: 'Gato', dog: 'Cachorro', bird: 'Pássaro', rabbit: 'Coelho',
      reptile: 'Réptil', fish: 'Peixe', other: 'Outro',
    },
  },
  cares: {
    title: 'Cuidados diários', subtitle: 'Rotina de todas as mascotes · hoje',
    addCare: '+ Adicionar cuidado', completed: 'concluídos', all: 'Todas',
    urgent: 'Urgentes', pending: 'Pendentes', done: 'Feitos',
    dayDone: '% do dia concluído', registerCare: 'Registrar',
  },
  vaccines: {
    title: 'Vacinas', subtitle: 'Controle de vacinação das suas mascotes',
    register: '💉 Registrar vacina', coverage: 'Cobertura', upToDate: 'Em dia',
    expiringSoon: 'A vencer', expired: 'Vencida', lastApplied: 'Última aplicação',
    nextDose: 'Próxima dose', applied: 'Aplicada', noVaccines: 'Sem vacinas registradas',
  },
  medications: {
    title: 'Medicamentos', subtitle: 'Tratamentos ativos e arquivados',
    add: '+ Adicionar medicamento', active: 'Ativos', history: 'Histórico',
    adherence: 'Adesão ao tratamento', nextDoses: 'Próximas doses',
    dose: 'Dose', frequency: 'Frequência', startDate: 'Início', endDate: 'Fim',
    finished: 'Concluído', unarchive: 'Desarquivar',
  },
  symptoms: {
    title: 'Sintomas', subtitle: 'Observações de comportamento e saúde',
    register: '+ Registrar sintoma', active: 'Ativos', resolved: 'Resolvidos',
    history: 'Histórico', severity: 'Gravidade', category: 'Categoria',
    date: 'Data', notes: 'Notas', noActive: 'Sem sintomas ativos ✓',
    noResolved: 'Sem sintomas resolvidos', markResolved: 'Marcar resolvido',
    reopen: '↩ Reabrir',
    severityOptions: {
      leve: 'Leve', moderado: 'Moderado', grave: 'Grave', emergencia: 'Emergência',
    },
    categoryOptions: {
      digestivo: 'Digestivo', respiratorio: 'Respiratório', piel: 'Pele',
      comportamiento: 'Comportamento', movimiento: 'Movimento',
      ocular: 'Ocular', otro: 'Outro',
    },
  },
  notes: {
    title: 'Notas', subtitle: 'Notas veterinárias e observações',
    new: '+ Nova nota', archived: 'Arquivadas', noNotes: 'Sem notas',
    content: 'Conteúdo', vet: 'Veterinário', type: 'Tipo',
    typeOptions: {
      control: 'Consulta', observacion: 'Observação', emergencia: 'Emergência',
      vacuna: 'Pós-vacina', cirugia: 'Cirurgia', otro: 'Outro',
    },
    deleteNote: 'Excluir nota',
    deleteConfirm: 'Excluir esta nota permanentemente?',
    deletedNote: 'Nota excluída',
  },
  calendar: {
    title: 'Calendário', subtitle: 'Visão mensal de cuidados, vacinas e veterinária',
    today: 'Hoje', allEvents: 'Todos', late: 'Vencidas', soon: 'Em breve (30d)',
    upToDate: 'Em dia', medication: 'Medicamentos',
    noEvents: 'Sem eventos neste dia', overdueTitle: 'evento(s) vencido(s)',
    overdueHint: 'Ver todos', monthPrev: 'Mês anterior', monthNext: 'Próximo mês',
    alertsTitle: 'Vacinas vencidas',
    alertsWarn: '⚠ Consulte o veterinário o mais rápido possível',
    vacExpiredTag: 'VENCIDA',
    vacExpiredSince: 'Venceu:',
    filterLabel: 'Filtrar calendário',
    clearFilters: 'Limpar filtros',
    filterGroupCares: 'Cuidados',
    filterGroupVaccines: 'Vacinas',
    filterGroupVet: 'Veterinária',
    filterPending: 'Pendente',
    filterDone: 'Realizado',
    filterVaccDue: 'Próxima vacina',
    filterVaccExpired: 'Vacina vencida',
    filterVetVisit: 'Consulta veterinária',
    filterVetReturn: 'Retorno agendado',
    dayEmpty: 'Sem eventos neste dia',
    dayCares: 'Cuidados do dia',
    dayVaccines: 'Vacinas',
    dayVetVisits: 'Consultas / Agendamentos',
    editCare: 'Editar cuidado',
    carePending: 'Pendente',
    careDone: 'Realizado',
    careSkipped: 'Ignorado',
    vaccineApply: 'Aplicar agora',
    vetVisitKind: 'Consulta',
    vetReturnKind: 'Retorno agendado',
    eventsCount: '{n} evento(s)',
  },
  vet: {
    pageTitle: 'Veterinária',
    pageSubtitle: 'Saúde clínica e prontuários médicos',
    tabs: {
      profile: 'Perfil médico',
      vets: 'Meus veterinários',
      appointments: 'Consultas',
      exams: 'Exames',
      documents: 'Documentos',
    },
    comingSoon: {
      exams: 'Guarde resultados de exames, receitas e relatórios em um só lugar.',
      documents: 'Passaporte digital e compartilhamento de dados com seu veterinário.',
      label: 'Em breve',
    },
    profile: {
      emptyTitle: 'Sem perfil médico',
      emptyText: 'Preencha o perfil da sua mascote para que o veterinário tenha todas as informações de um relance.',
      emptyBtn: 'Completar perfil',
      editBtn: 'Editar perfil',
      lastUpdated: 'Atualizado',
      noConditions: 'Sem condições registradas',
      noSurgeries: 'Sem cirurgias registradas',
      sex: 'Sexo',
      sexMale: 'Macho',
      sexFemale: 'Fêmea',
      neutered: 'Castrado / Esterilizado',
      neuteredYes: 'Sim',
      neuteredNo: 'Não',
      neuteredAge: 'Idade na castração',
      bloodType: 'Tipo sanguíneo',
      bloodTypePh: 'Ex. A, B, AB, DEA 1.1…',
      bloodTypeHint: 'Varia conforme a espécie — escreva livremente',
      allergies: 'Alergias conhecidas',
      conditions: 'Condições crônicas',
      surgeries: 'Cirurgias',
      environment: 'Tipo de habitat',
      envApartment: 'Apartamento',
      envHouse: 'Casa com jardim',
      envBoth: 'Ambos',
      livingWithAnimals: 'Convive com outros animais',
      parasiteControl: 'Antipulgas/vermífugo habitual',
      behavioralNotes: 'Notas de comportamento',
      vetQuestions: 'Perguntas para o veterinário',
      modalTitle: 'Perfil médico',
      editingFor: 'Editando perfil de {name}',
      savedSuccess: 'Perfil salvo',
      savedSuccessFor: 'O histórico de {name} foi atualizado',
      sectionBasic: 'Dados básicos',
      sectionConditions: 'Condições crônicas',
      sectionSurgeries: 'Cirurgias e intervenções',
      sectionEnvironment: 'Ambiente e comportamento',
      sectionVetNotes: 'Notas para o veterinário',
      customConditionPh: 'Nome da condição',
      addCondition: 'Adicionar',
      surgeryNamePh: 'Ex. Castração, Extração dental',
      surgeryNotesPh: 'Observações',
      addSurgery: '+ Adicionar cirurgia',
      removeSurgery: '×',
    },
    contactTypes: {
      primary: 'Principal',
      specialist: 'Especialista',
      emergency: 'Emergência',
      other: 'Outro',
    },
    contacts: {
      addBtn: 'Adicionar veterinário',
      emptyTitle: 'Sem veterinários salvos',
      emptyText: 'Salve o contato do seu veterinário para acesso rápido.',
      phone2: 'Tel. alternativo',
      deleteConfirm: 'Confirmar exclusão?',
      titleAdd: 'Adicionar veterinário',
      titleEdit: 'Editar veterinário',
      subtitleAdd: 'Salve o contato do seu veterinário de confiança',
      subtitleEdit: 'Editando contato de {name}',
      sectionType: 'Tipo de veterinário',
      sectionContact: 'Dados de contato',
      sectionPets: 'Mascotes associadas',
      sectionNotes: 'Notas adicionais',
      vetNamePh: 'Ex. Dra. Silva',
      clinicPh: 'Ex. Clínica VetSaúde',
      specialtyPh: 'Ex. Dermatologia, Oncologia',
      phonePh: 'Ex. +55 11 90000-0000',
      phone2Ph: 'Ex. +55 11 91111-1111',
      addressPh: 'Rua, número, cidade',
      notesPh: 'Horários, instruções especiais…',
      errName: 'O nome é obrigatório',
      errClinic: 'A clínica é obrigatória',
      errPhone: 'O telefone é obrigatório',
    },
    apptTypes: {
      routine: 'Consulta',
      emergency: 'Urgência',
      specialist: 'Especialista',
      followup: 'Retorno',
      exam: 'Exames',
      vaccine: 'Vacina',
      other: 'Outro',
    },
    appointments: {
      addBtn: 'Registrar consulta',
      nextLabel: '📅 Próximo retorno',
      historyLabel: 'Histórico de consultas',
      emptyTitle: 'Sem consultas registradas',
      emptyText: 'Registre a primeira consulta de {name} para iniciar o histórico.',
      deleteConfirm: 'Confirmar exclusão?',
      diagnosis: 'Diagnóstico',
      treatment: 'Tratamento',
      weight: 'Peso na visita',
      nextReturn: 'Retorno',
      sectionDateTime: 'Data e hora',
      sectionVet: 'Veterinário',
      sectionDetails: 'Detalhes da consulta',
      sectionFollowUp: 'Acompanhamento',
      sectionExtra: 'Dados adicionais',
      vetContactLabel: 'Veterinário salvo',
      vetContactNone: 'Inserir manualmente',
      vetNamePh: 'Ex. Dra. Silva',
      clinicPh: 'Ex. Clínica VetSaúde',
      reason: 'Motivo da consulta',
      reasonPh: 'Ex. Revisão anual, tosse persistente…',
      diagnosisPh: 'Diagnóstico do veterinário',
      treatmentPh: 'Medicamentos, doses, orientações…',
      nextDate: 'Data de retorno',
      nextNote: 'Nota do retorno',
      nextNotePh: 'Ex. Revisão pós-tratamento',
      weightPh: 'Ex. 4.2',
      cost: 'Custo da consulta',
      costPh: 'Ex. 45.00',
      notesPh: 'Qualquer observação relevante…',
      errReason: 'O motivo é obrigatório',
      errVetName: 'O nome do veterinário é obrigatório',
      errDate: 'A data é obrigatória',
      register: 'Registrar consulta',
      update: 'Salvar alterações',
      titleAdd: 'Registrar consulta',
      titleEdit: 'Editar consulta',
      subtitleAdd: 'Salve o histórico veterinário da sua mascote',
      subtitleEdit: 'Editando consulta de {date}',
    },
    toast: {
      vetAdded: 'Veterinário adicionado ✓',
      vetUpdated: 'Veterinário atualizado ✓',
      vetDeleted: 'Veterinário removido',
      apptAdded: 'Consulta registrada ✓',
      apptUpdated: 'Consulta atualizada ✓',
      apptDeleted: 'Consulta excluída',
      profileSaved: 'Perfil salvo ✓',
    },
    time: {
      today: 'Hoje',
      tomorrow: 'Amanhã',
      inDays: 'Em {n} dias',
      daysAgo: 'Há {n} dias',
    },
  },
  settings: {
    title: 'Configurações', subtitle: 'Conta e preferências',
    personalData: 'Dados pessoais', personalSubtitle: 'Suas informações no PITUTI',
    profilePhoto: 'Foto de perfil', photoHint: 'JPG, PNG ou WebP · Máx. 2 MB',
    changePhoto: 'Alterar', fullName: 'Nome completo',
    email: 'E-mail', phone: 'Telefone', city: 'Cidade', about: 'Sobre mim',
    fullNamePlaceholder: 'Seu nome e sobrenome', phonePlaceholder: '+55 11 90000-0000',
    cityPlaceholder: 'São Paulo, Rio de Janeiro…',
    aboutPlaceholder: 'Apaixonado/a por animais…',
    appearance: 'Aparência', theme: 'Tema do app', themeHint: 'Claro ou escuro',
    changeTheme: 'Alterar', language: 'Idioma',
    languageHint: 'Español · English · Português', notifications: 'Notificações',
    vaccineAlert: 'Vacinas a vencer', vaccineAlertHint: '7 dias antes do vencimento',
    medAlert: 'Doses de medicamentos', medAlertHint: 'Lembrete diário de doses',
    symptomAlert: 'Sintomas sem resolução',
    symptomAlertHint: 'Quando um sintoma dura +3 dias',
    weeklyDigest: 'Resumo semanal', weeklyDigestHint: 'Toda segunda por e-mail',
    urgentAlerts: 'Alertas urgentes', urgentAlertsHint: 'Push imediato em emergências',
    dangerZone: 'Zona de risco',
    exportData: 'Exportar dados',
    exportHint: 'Baixe um CSV com todo o histórico das suas mascotes, vacinas, medicamentos e sintomas.',
    exportBtn: 'Exportar CSV',
    deleteAccount: 'Excluir conta',
    deleteHint: 'Ação permanente e irreversível. Todos os seus dados, mascotes e histórico serão apagados.',
    deleteBtn: 'Excluir conta', saved: 'Salvo',
    deleteModal: {
      title: 'Excluir conta permanentemente',
      subtitle: 'Esta ação não pode ser desfeita',
      willLose: 'Se você excluir sua conta, perderá permanentemente:',
      petProfiles: 'O perfil completo de todas as suas mascotes',
      vaccines: 'Histórico de vacinas e próximas doses',
      medications: 'Todos os medicamentos registrados',
      records: 'Sintomas, notas e registros veterinários',
      dailyCares: 'Cuidados diários e rotinas configuradas',
      caregivers: 'Acesso compartilhado com outros cuidadores',
      warning: '⚠ Você não poderá recuperar esses dados após excluir sua conta.',
      continue: 'Continuar →',
      typePrompt: 'Para confirmar, digite',
      typeWord: 'excluir',
      typeError: 'Digite exatamente "excluir" (sem aspas)',
      confirmBtn: 'Excluir definitivamente',
      finalWarning: 'Ao clicar em "Excluir definitivamente", sua conta e todos os dados associados serão apagados permanentemente dos servidores do PITUTI.',
    },
  },
  topbar: {
    searchPlaceholder: 'Buscar mascote, registro…',
    noNotifications: 'Sem novas notificações',
    changeTheme: 'Alterar tema',
  },
  modal: {
    close: 'Fechar', editPet: 'Editar mascote',
    registerVaccine: 'Registrar vacina', vaccineApplied: 'Data de aplicação',
    vaccineNext: 'Próxima dose', vaccineVet: 'Veterinário (opcional)',
    vaccineNotes: 'Notas (opcional)', vaccineSaved: 'Registrado!',
    selectVaccine: 'Selecionar vacina',
    shareCares: 'Compartilhar cuidados', shareInvite: 'Convide cuidadores de',
    activeCaregiversLabel: 'Cuidadores ativos', inviteNew: 'Convidar novo cuidador',
    accessLevel: 'Nível de acesso', sendInvitation: '✉ Enviar convite',
    inviteSent: 'Convite enviado!',
    inviteExpiry: '✓ O link do convite expira em 48 horas',
    understood: 'Entendido', removeCaregiver: 'Remover',
    editCare: 'Configurar cuidado', addInfo: 'Informações adicionais',
    frequency: 'Frequência', perDay: 'Por dia', perWeek: 'Por semana',
    perMonth: 'Por mês', quantity: 'Quantidade (opcional)', notify: 'Ativar lembrete',
    readOnly: 'Somente leitura', readOnlyHint: 'Ver registros, não pode editar',
    caregiver: 'Cuidador', caregiverHint: 'Registrar cuidados e vacinas',
    fullAccess: 'Acesso completo', fullAccessHint: 'Editar perfil e todos os dados',
  },
  status: {
    active: 'Ativo', resolved: 'Resolvido', archived: 'Arquivado',
    expired: 'Vencida', soon: 'Em breve', upToDate: 'Em dia',
    finished: 'Concluído', new: 'Nova ✓',
  },
  toast: {
    changesSaved: '✓ Alterações salvas com sucesso', themeChanged: 'Tema alterado',
    petAdded: 'adicionada com sucesso 🐾', careRegistered: 'Cuidado registrado ✓',
    inviteSent: '✉ Convite enviado para ', symptomResolved: '✓ Sintoma resolvido',
    symptomReopened: '↩ Sintoma reaberto', noteArchived: '📁 Nota arquivada',
    noteUnarchived: '✓ Nota desarquivada', noteDeleted: 'Nota excluída',
    csvDownloaded: '📄 CSV baixado com sucesso',
    vaccineRegistered: '💉 Vacina registrada',
    medAdded: 'Medicamento adicionado', photoUpdated: '📸 Foto atualizada',
    languageChanged: 'Idioma atualizado',
  },
  dates: {
    today: 'Hoje', yesterday: 'Ontem', days_ago: 'Há {n} dias',
    months: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    weekdays: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    weekdaysShort: ['Do','Se','Te','Qu','Qu','Se','Sa'],
  },
}

// ══════════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════════

export const TRANSLATIONS: Record<Lang, Translations> = { es, en, pt }

export const LANG_LABELS: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
}
```

## File: src/pages/LoginPage.tsx
```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Helpers ───────────────────────────────────────────────────────
function PitutiMark() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="14" fill="url(#logo-grad)"/>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%"   stopColor="#c4b5e0"/>
          <stop offset="100%" stopColor="#8B9FD4"/>
        </linearGradient>
      </defs>
      {/* Cat head silhouette */}
      <circle cx="26" cy="30" r="14" fill="rgba(42,52,98,.85)"/>
      {/* Left ear */}
      <polygon points="14,21 18,10 24,20" fill="rgba(42,52,98,.85)"/>
      <polygon points="15.5,20.5 18.5,12 22.5,19.5" fill="rgba(196,181,224,.5)"/>
      {/* Right ear */}
      <polygon points="28,20 34,10 38,21" fill="rgba(42,52,98,.85)"/>
      <polygon points="29.5,19.5 33.5,12 36.5,20.5" fill="rgba(196,181,224,.5)"/>
      {/* Eyes */}
      <circle cx="21" cy="29" r="3" fill="#D4A820"/>
      <ellipse cx="21" cy="29" rx="1.2" ry="3" fill="#0C0808"/>
      <circle cx="22.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)"/>
      <circle cx="31" cy="29" r="3" fill="#D4A820"/>
      <ellipse cx="31" cy="29" rx="1.2" ry="3" fill="#0C0808"/>
      <circle cx="32.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)"/>
      {/* Nose */}
      <path d="M25 33 L26 34.5 L27 33 Z" fill="#F0A0B8"/>
      {/* Whiskers */}
      <line x1="14" y1="32" x2="22" y2="32.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.8"/>
      <line x1="14" y1="34" x2="22" y2="33.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.7"/>
      <line x1="30" y1="32.5" x2="38" y2="32"  stroke="rgba(255,255,255,.5)" strokeWidth="0.8"/>
      <line x1="30" y1="33.5" x2="38" y2="34"  stroke="rgba(255,255,255,.5)" strokeWidth="0.7"/>
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
    </svg>
  )
}

// ── Input component ───────────────────────────────────────────────
interface FormFieldProps {
  type:        string
  label:       string
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  icon:        React.ReactNode
  error?:      string
  hint?:       string
  extra?:      React.ReactNode
  disabled?:   boolean
}
function FormField({ type, label, value, onChange, placeholder, icon, error, hint, extra, disabled }: FormFieldProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '.875rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'.375rem' }}>
        <label style={{ fontSize:'.8125rem', fontWeight:700, color:'var(--text-muted)' }}>{label}</label>
        {extra}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.5rem',
        background: 'var(--surface)', border: `1.5px solid ${error ? 'var(--err)' : focused ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)', padding: '.625rem .875rem',
        boxShadow: focused ? '0 0 0 3px var(--primary-hl)' : error ? '0 0 0 3px var(--err-hl)' : 'none',
        transition: 'all var(--trans)',
      }}>
        <span style={{ color: error ? 'var(--err)' : focused ? 'var(--primary)' : 'var(--text-faint)', flexShrink:0 }}>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:'inherit', fontSize:'.9rem', color:'var(--text)' }}
        />
      </div>
      {error && <div style={{ fontSize:'.75rem', color:'var(--err)', marginTop:'.3rem', fontWeight:600 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize:'.75rem', color:'var(--text-faint)', marginTop:'.3rem' }}>{hint}</div>}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.75rem', margin:'1.125rem 0' }}>
      <div style={{ flex:1, height:1, background:'var(--divider)' }}/>
      <span style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-faint)' }}>o continuar con</span>
      <div style={{ flex:1, height:1, background:'var(--divider)' }}/>
    </div>
  )
}

// ── Social Button ─────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem',
        padding:'.6rem 1rem', border:`1.5px solid ${hovered?'var(--primary)':'var(--border)'}`,
        borderRadius:'var(--r-lg)', background:hovered?'var(--primary-hl)':'var(--surface)',
        cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:'.8125rem',
        color:'var(--text)', transition:'all var(--trans)', minHeight:44,
      }}
    >
      {icon}{label}
    </button>
  )
}

// ── Main LoginPage ────────────────────────────────────────────────
type Mode = 'login' | 'register' | 'forgot'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')

  // Form state
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [errors,   setErrors]   = useState<Record<string,string>>({})
  const [rememberMe, setRememberMe] = useState(true)

  const clearErrors = () => setErrors({})
  const reset       = () => { setEmail(''); setPassword(''); setConfirm(''); setName(''); clearErrors() }

  // Validation
  const validateLogin = () => {
    const e: Record<string,string> = {}
    if (!email.trim())        e.email    = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email no válido'
    if (!password)            e.password = 'La contraseña es obligatoria'
    return e
  }
  const validateRegister = () => {
    const e: Record<string,string> = {}
    if (!name.trim())         e.name     = 'El nombre es obligatorio'
    if (!email.trim())        e.email    = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email no válido'
    if (!password)            e.password = 'La contraseña es obligatoria'
    else if (password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (password !== confirm) e.confirm  = 'Las contraseñas no coinciden'
    return e
  }
  const validateForgot = () => {
    const e: Record<string,string> = {}
    if (!email.trim())        e.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email no válido'
    return e
  }

  const handleSubmit = () => {
    const errs = mode === 'login' ? validateLogin() : mode === 'register' ? validateRegister() : validateForgot()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === 'forgot') { setSuccess(true); return }
      navigate('/dashboard')
    }, 1200)
  }

  const switchMode = (m: Mode) => { setMode(m); reset(); setSuccess(false) }

  const emailIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
  const nameIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
  const lockIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      background: 'var(--bg)',
    }}>

      {/* ── Left panel — branding (desktop only) ── */}
      <div className="login-brand-panel">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'auto' }}>
            <PitutiMark/>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontStyle:'italic', color:'white', letterSpacing:'-.01em' }}>Pituti</span>
          </div>

          {/* Hero text */}
          <div style={{ marginBottom:'auto' }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,2.75rem)', color:'white', fontWeight:400, lineHeight:1.15, marginBottom:'1rem' }}>
              Cuida a tus<br/>mascotas con<br/>amor ❤️
            </h1>
            <p style={{ fontSize:'1rem', color:'rgba(255,255,255,.72)', lineHeight:1.6, maxWidth:340 }}>
              PITUTI te ayuda a llevar el control de vacunas, medicamentos, cuidados diarios y síntomas de todos tus peludos.
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginTop:'2rem' }}>
            {['💉 Vacunas','💊 Medicamentos','🐾 Cuidados','📋 Notas vet.','📅 Calendario','👥 Comparte'].map(f=>(
              <span key={f} style={{ background:'rgba(255,255,255,.15)', color:'rgba(255,255,255,.9)', borderRadius:'var(--r-full)', padding:'.3rem .875rem', fontSize:'.8125rem', fontWeight:700, border:'1px solid rgba(255,255,255,.2)' }}>
                {f}
              </span>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,.15)', display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ display:'flex' }}>
              {['🐱','🐶','🦜','🐰','🦎'].map((e,i)=>(
                <div key={i} style={{ width:30, height:30, borderRadius:'50%', border:'2px solid rgba(255,255,255,.5)', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.875rem', marginLeft:i>0?-8:0 }}>{e}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:'.875rem', fontWeight:700, color:'white' }}>+2.400 mascotas</div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.6)' }}>cuidadas con amor</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'2rem 1.25rem',
        minHeight:'100dvh',
      }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {/* Mobile logo */}
          <div className="login-mobile-logo">
            <PitutiMark/>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontStyle:'italic', color:'var(--text)' }}>Pituti</span>
          </div>

          {/* Card */}
          <div style={{ background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'var(--r-xl)', padding:'2rem 1.75rem', boxShadow:'var(--sh-lg)' }}>

            {/* Tabs */}
            {mode !== 'forgot' && (
              <div style={{ display:'flex', background:'var(--surface-offset)', borderRadius:'var(--r-lg)', padding:'.25rem', marginBottom:'1.5rem' }}>
                {(['login','register'] as Mode[]).map(m=>(
                  <button key={m} onClick={()=>switchMode(m)}
                    style={{ flex:1, padding:'.5rem', borderRadius:'var(--r-md)', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:'.875rem', transition:'all 160ms',
                      background: mode===m ? 'var(--surface)' : 'transparent',
                      color: mode===m ? 'var(--text)' : 'var(--text-muted)',
                      boxShadow: mode===m ? 'var(--sh-sm)' : 'none',
                    }}>
                    {m === 'login' ? '🔑 Entrar' : '✨ Registrarse'}
                  </button>
                ))}
              </div>
            )}

            {/* ── Forgot password ── */}
            {mode === 'forgot' && (
              <div style={{ marginBottom:'1.25rem' }}>
                <button onClick={()=>switchMode('login')} style={{ display:'flex', alignItems:'center', gap:'.375rem', background:'none', border:'none', color:'var(--primary)', fontWeight:700, fontSize:'.875rem', cursor:'pointer', fontFamily:'inherit', marginBottom:'.875rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Volver al inicio de sesión
                </button>
                <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)', marginBottom:'.375rem' }}>¿Olvidaste tu contraseña?</div>
                <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5 }}>
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                </div>
              </div>
            )}

            {/* ── Success state (forgot) ── */}
            {success && mode === 'forgot' ? (
              <div style={{ textAlign:'center', padding:'1rem 0' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--success-hl)', border:'2px solid var(--success)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.75rem', margin:'0 auto 1rem' }}>✉️</div>
                <div style={{ fontWeight:800, fontSize:'1.125rem', color:'var(--text)', marginBottom:'.5rem' }}>¡Email enviado!</div>
                <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'1.25rem' }}>
                  Revisa tu bandeja de entrada en <strong style={{ color:'var(--text)' }}>{email}</strong>.<br/>El enlace expira en 30 minutos.
                </div>
                <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', minHeight:48 }} onClick={()=>switchMode('login')}>
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <>
                {/* ── Login title ── */}
                {mode === 'login' && (
                  <div style={{ marginBottom:'1.125rem' }}>
                    <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)', marginBottom:'.25rem' }}>¡Bienvenida de vuelta!</div>
                    <div style={{ fontSize:'.875rem', color:'var(--text-muted)' }}>Accede para cuidar a tus mascotas 🐾</div>
                  </div>
                )}
                {mode === 'register' && (
                  <div style={{ marginBottom:'1.125rem' }}>
                    <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)', marginBottom:'.25rem' }}>Crea tu cuenta</div>
                    <div style={{ fontSize:'.875rem', color:'var(--text-muted)' }}>Empieza a cuidar a tus mascotas gratis</div>
                  </div>
                )}

                {/* ── Form fields ── */}
                {mode === 'register' && (
                  <FormField type="text" label="Nombre completo" value={name} onChange={v=>{setName(v);clearErrors()}}
                    placeholder="Thamires Lopes" icon={nameIcon} error={errors.name}/>
                )}
                <FormField type="email" label="Correo electrónico" value={email} onChange={v=>{setEmail(v);clearErrors()}}
                  placeholder="nombre@email.com" icon={emailIcon} error={errors.email}/>
                <FormField type={showPwd?'text':'password'} label="Contraseña" value={password} onChange={v=>{setPassword(v);clearErrors()}}
                  placeholder={mode==='register'?'Mínimo 8 caracteres':'Tu contraseña'}
                  icon={lockIcon}
                  error={errors.password}
                  hint={mode==='register'?'Usa letras, números y símbolos para mayor seguridad':undefined}
                  extra={
                    <button onClick={()=>setShowPwd(p=>!p)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', gap:'.25rem', fontSize:'.75rem', fontWeight:700, fontFamily:'inherit' }}>
                      <EyeIcon open={showPwd}/>{showPwd?'Ocultar':'Ver'}
                    </button>
                  }
                />
                {mode === 'register' && (
                  <FormField type={showPwd?'text':'password'} label="Confirmar contraseña" value={confirm} onChange={v=>{setConfirm(v);clearErrors()}}
                    placeholder="Repite tu contraseña" icon={lockIcon} error={errors.confirm}/>
                )}

                {/* ── Remember + Forgot ── */}
                {mode === 'login' && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', marginTop:'-.25rem' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'.5rem', cursor:'pointer', fontSize:'.8125rem', color:'var(--text-muted)' }}>
                      <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{ accentColor:'var(--primary)', width:16, height:16 }}/>
                      Recordarme
                    </label>
                    <button onClick={()=>switchMode('forgot')} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:700, fontSize:'.8125rem', cursor:'pointer', fontFamily:'inherit' }}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {/* ── T&C for register ── */}
                {mode === 'register' && (
                  <div style={{ fontSize:'.75rem', color:'var(--text-faint)', marginBottom:'1rem', lineHeight:1.5 }}>
                    Al registrarte, aceptas nuestros{' '}
                    <a href="#" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>Términos de uso</a>{' '}y{' '}
                    <a href="#" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>Política de privacidad</a>.
                  </div>
                )}

                {/* ── Submit ── */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width:'100%', minHeight:48,
                    background: loading ? 'var(--primary-hl)' : 'linear-gradient(150deg, var(--primary) 0%, #3a4c80 100%)',
                    color: loading ? 'var(--primary)' : '#fff',
                    border:'none', borderRadius:'var(--r-lg)',
                    fontFamily:'inherit', fontWeight:800, fontSize:'.9375rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'.625rem',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(91,108,158,.4)',
                    transition:'all 160ms',
                    marginBottom:'.875rem',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ width:18, height:18, borderRadius:'50%', border:'2.5px solid var(--primary)', borderTopColor:'transparent', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                      {mode === 'login' ? 'Entrando…' : mode === 'register' ? 'Creando cuenta…' : 'Enviando…'}
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? '🔑 Iniciar sesión' : mode === 'register' ? '✨ Crear cuenta' : '✉️ Enviar enlace'}
                    </>
                  )}
                </button>

                {/* ── Social auth ── */}
                {mode !== 'forgot' && (
                  <>
                    <OrDivider/>
                    <div style={{ display:'flex', gap:'.625rem' }}>
                      <SocialBtn icon={<GoogleIcon/>} label="Google" onClick={()=>{ setLoading(true); setTimeout(()=>{setLoading(false);navigate('/dashboard')},900) }}/>
                      <SocialBtn icon={<AppleIcon/>}  label="Apple"  onClick={()=>{ setLoading(true); setTimeout(()=>{setLoading(false);navigate('/dashboard')},900) }}/>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Bottom link */}
          {!success && (
            <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'.875rem', color:'var(--text-muted)' }}>
              {mode === 'login'
                ? <>¿No tienes cuenta? <button onClick={()=>switchMode('register')} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:800, cursor:'pointer', fontFamily:'inherit', fontSize:'inherit' }}>Regístrate gratis</button></>
                : mode === 'register'
                ? <>¿Ya tienes cuenta? <button onClick={()=>switchMode('login')} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:800, cursor:'pointer', fontFamily:'inherit', fontSize:'inherit' }}>Inicia sesión</button></>
                : null
              }
            </p>
          )}

          {/* Demo shortcut */}
          {mode !== 'forgot' && (
            <div style={{ textAlign:'center', marginTop:'.75rem' }}>
              <button onClick={()=>navigate('/dashboard')} style={{ background:'none', border:'none', color:'var(--text-faint)', fontSize:'.75rem', cursor:'pointer', fontFamily:'inherit', textDecoration:'underline dotted' }}>
                Entrar sin cuenta (demo) →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline styles for login-specific layouts */}
      <style>{`
        .login-brand-panel {
          width: 45%;
          min-height: 100dvh;
          background: linear-gradient(160deg, #2A3462 0%, #1a2050 40%, #3d2a62 100%);
          padding: 3rem 3.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .login-brand-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 60%, rgba(196,181,224,.18) 0%, transparent 60%),
                      radial-gradient(circle at 70% 20%, rgba(139,159,212,.14) 0%, transparent 50%);
        }
        .login-mobile-logo { display: none; }
        @media (max-width: 768px) {
          .login-brand-panel { display: none; }
          .login-mobile-logo {
            display: flex; align-items: center; gap: .625rem;
            justify-content: center; margin-bottom: 1.5rem;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
```

## File: src/pages/VetPage.tsx
```typescript
import { useMemo, useState } from 'react'
import { MOCK_PETS, SPECIES_EMOJI } from '../hooks/usePets'
import {
  useVet,
  CONDITIONS_CATALOG,
  type PetMedicalProfile,
  type VetContact,
  type VetAppointment,
} from '../context/VetContext'
import { VET_TYPES } from '../components/AddEditVetModal'
import { APPOINTMENT_TYPES } from '../components/AddEditAppointmentModal'
import AddEditVetModal from '../components/AddEditVetModal'
import AddEditAppointmentModal from '../components/AddEditAppointmentModal'
import PetMedicalProfileModal from '../components/PetMedicalProfileModal'
import BackButton from '../components/BackButton'
import { showToast } from '../components/AppLayout'

const L = {
  pageTitle: 'Veterinaria',
  pageSubtitle: 'Salud clínica y registros médicos',

  tabProfile: 'Perfil médico',
  tabVets: 'Mis veterinarios',
  tabAppointments: 'Consultas',
  tabExams: 'Exámenes',
  tabDocuments: 'Documentos',

  comingSoonExams: 'Guarda resultados de exámenes, recetas e informes en un solo lugar.',
  comingSoonDocuments: 'Pasaporte digital y compartición de datos con tu veterinario.',
  comingSoonLabel: 'Próximamente',

  profileEmptyTitle: 'Sin perfil médico',
  profileEmptyText: 'Rellena el perfil de tu mascota para que el veterinario tenga toda la información de un vistazo.',
  profileEmptyBtn: 'Completar perfil',
  profileEditBtn: 'Editar perfil',

  profileSex: 'Sexo',
  profileSexMale: 'Macho',
  profileSexFemale: 'Hembra',
  profileNeutered: 'Castrado',
  profileNeuteredYes: 'Sí',
  profileNeuteredNo: 'No',
  profileNeuteredAge: 'Edad castración',
  profileBloodType: 'Grupo sanguíneo',
  profileAllergies: 'Alergias',
  profileConditions: 'Condiciones crónicas',
  profileSurgeries: 'Cirugías',
  profileEnvironment: 'Hábitat',
  profileParasite: 'Antiparasitario',
  profileBehavior: 'Comportamiento',
  profileVetQuestions: 'Preguntas para el vet',
  profileEnvApartment: 'Piso',
  profileEnvHouse: 'Casa',
  profileEnvBoth: 'Ambos',
  profileNoConditions: 'Sin condiciones registradas',
  profileNoSurgeries: 'Sin cirugías registradas',
  profileLastUpdated: 'Actualizado',

  vetAddBtn: 'Añadir veterinario',
  vetEmptyTitle: 'Sin veterinarios guardados',
  vetEmptyText: 'Guarda el contacto de tu veterinario para acceder rápidamente.',
  vetSpecialty: 'Especialidad',
  vetAssocPets: 'Mascotas',
  vetEdit: 'Editar',
  vetDelete: 'Eliminar',
  vetDeleteConfirm: 'Confirmar eliminación',
  vetDeleteCancel: 'Cancelar',

  apptAddBtn: 'Registrar consulta',
  apptNextLabel: 'Próximo retorno',
  apptHistoryLabel: 'Historial de consultas',
  apptEmptyTitle: 'Sin consultas registradas',
  apptEmptyText: (name: string) => `Registra la primera consulta de ${name} para llevar el historial.`,
  apptEdit: 'Editar',
  apptDelete: 'Eliminar',
  apptDeleteConfirm: 'Confirmar eliminación',
  apptDeleteCancel: 'Cancelar',
  apptDiagnosis: 'Diagnóstico',
  apptTreatment: 'Tratamiento',
  apptWeight: 'Peso',
  apptNextReturn: 'Retorno',

  today: 'Hoy',
  tomorrow: 'Mañana',
  inDays: (n: number) => `En ${n} días`,

  toastVetAdded: 'Veterinario añadido',
  toastVetUpdated: 'Veterinario actualizado',
  toastVetDeleted: 'Veterinario eliminado',
  toastApptAdded: 'Consulta registrada',
  toastApptUpdated: 'Consulta actualizada',
  toastApptDeleted: 'Consulta eliminada',
} as const

const TABS = [
  { key: 'profile', label: L.tabProfile },
  { key: 'vets', label: L.tabVets },
  { key: 'appointments', label: L.tabAppointments },
  { key: 'exams', label: L.tabExams },
  { key: 'documents', label: L.tabDocuments },
] as const

type TabKey = (typeof TABS)[number]['key']

const COMING_SOON: Record<'exams' | 'documents', { icon: string; text: string }> = {
  exams: { icon: '🧪', text: L.comingSoonExams },
  documents: { icon: '📄', text: L.comingSoonDocuments },
}

export default function VetPage() {
  const [selectedPetId, setSelectedPetId] = useState(MOCK_PETS[0]?.id ?? '')
  const [activeTab, setActiveTab] = useState<TabKey>('profile')
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [vetModalOpen, setVetModalOpen] = useState(false)
  const [editingVet, setEditingVet] = useState<VetContact | null>(null)
  const [apptModalOpen, setApptModalOpen] = useState(false)
  const [editingAppt, setEditingAppt] = useState<VetAppointment | null>(null)
  const [confirmDeleteVet, setConfirmDeleteVet] = useState<string | null>(null)
  const [confirmDeleteAppt, setConfirmDeleteAppt] = useState<string | null>(null)

  const {
    getMedicalProfile,
    saveMedicalProfile,
    vets,
    addVet,
    updateVet,
    deleteVet,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useVet()

  const pet = useMemo(
    () => MOCK_PETS.find((item) => item.id === selectedPetId) ?? MOCK_PETS[0] ?? null,
    [selectedPetId]
  )

  if (!pet) {
    return (
      <div className="page">
        <BackButton />
        <div className="empty-state">
          <div className="empty-state-icon">🐾</div>
          <h3>No hay mascotas disponibles</h3>
          <p>Necesitas al menos una mascota para usar el módulo de veterinaria.</p>
        </div>
      </div>
    )
  }

  const profile = getMedicalProfile(pet.id)

  const hasProfileData = Boolean(
    profile.bloodType ||
      profile.allergies ||
      profile.chronicConditionIds.length ||
      profile.customConditions.length ||
      profile.sex !== undefined ||
      profile.neutered !== undefined ||
      profile.surgeries.length ||
      profile.behavioralNotes ||
      profile.environment ||
      profile.parasiteControl ||
      profile.vetQuestions
  )

  const petAppointments = appointments
    .filter((item) => item.petId === pet.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="page">
      <BackButton />

      <div className="page-header">
        <h1 className="page-title">{L.pageTitle}</h1>
        <p className="page-subtitle">{L.pageSubtitle}</p>
      </div>

      <div className="pet-selector">
        {MOCK_PETS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pet-chip ${pet.id === item.id ? 'active' : ''}`}
            onClick={() => setSelectedPetId(item.id)}
          >
            {SPECIES_EMOJI[item.species ?? ''] ?? '🐾'} {item.name}
          </button>
        ))}
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <TabMedicalProfile
          profile={profile}
          hasData={hasProfileData}
          onEdit={() => setEditProfileOpen(true)}
        />
      )}

      {activeTab === 'vets' && (
        <TabVets
          vets={vets}
          confirmDeleteId={confirmDeleteVet}
          onAdd={() => {
            setEditingVet(null)
            setVetModalOpen(true)
          }}
          onEdit={(item) => {
            setEditingVet(item)
            setVetModalOpen(true)
          }}
          onRequestDelete={setConfirmDeleteVet}
          onCancelDelete={() => setConfirmDeleteVet(null)}
          onConfirmDelete={(id) => {
            deleteVet(id)
            setConfirmDeleteVet(null)
            showToast(L.toastVetDeleted)
          }}
        />
      )}

      {activeTab === 'appointments' && (
        <TabAppointments
          petName={pet.name}
          appointments={petAppointments}
          confirmDeleteId={confirmDeleteAppt}
          onAdd={() => {
            setEditingAppt(null)
            setApptModalOpen(true)
          }}
          onEdit={(item) => {
            setEditingAppt(item)
            setApptModalOpen(true)
          }}
          onRequestDelete={setConfirmDeleteAppt}
          onCancelDelete={() => setConfirmDeleteAppt(null)}
          onConfirmDelete={(id) => {
            deleteAppointment(id)
            setConfirmDeleteAppt(null)
            showToast(L.toastApptDeleted)
          }}
        />
      )}

      {(activeTab === 'exams' || activeTab === 'documents') && <ComingSoonCard tab={activeTab} />}

      <PetMedicalProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        pet={pet}
        profile={profile}
        onSave={saveMedicalProfile}
      />

      <AddEditVetModal
        isOpen={vetModalOpen}
        onClose={() => setVetModalOpen(false)}
        onSave={(item) => {
          addVet(item)
          showToast(L.toastVetAdded)
        }}
        onUpdate={(item) => {
          updateVet(item)
          showToast(L.toastVetUpdated)
        }}
        initial={editingVet}
      />

      <AddEditAppointmentModal
        isOpen={apptModalOpen}
        onClose={() => setApptModalOpen(false)}
        onSave={(item) => {
          addAppointment(item)
          showToast(L.toastApptAdded)
        }}
        onUpdate={(item) => {
          updateAppointment(item)
          showToast(L.toastApptUpdated)
        }}
        initial={editingAppt}
        defaultPetId={pet.id}
      />
    </div>
  )
}

function TabMedicalProfile({
  profile,
  hasData,
  onEdit,
}: {
  profile: PetMedicalProfile
  hasData: boolean
  onEdit: () => void
}) {
  if (!hasData) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🩺</div>
        <h3>{L.profileEmptyTitle}</h3>
        <p>{L.profileEmptyText}</p>
        <button className="btn btn-primary" onClick={onEdit}>
          {L.profileEmptyBtn}
        </button>
      </div>
    )
  }

  const conditionLabels = profile.chronicConditionIds.map(
    (id) => CONDITIONS_CATALOG.find((item) => item.id === id)?.label ?? id
  )

  const allConditions = [...conditionLabels, ...profile.customConditions]

  const envLabel: Record<string, string> = {
    apartment: L.profileEnvApartment,
    house: L.profileEnvHouse,
    both: L.profileEnvBoth,
  }

  return (
    <div className="tab-content">
      <div className="profile-view">
        <button className="btn btn-secondary btn-sm profile-edit-btn" onClick={onEdit}>
          ✏️ {L.profileEditBtn}
        </button>

        <div className="profile-grid">
          <ProfileRow
            label={L.profileSex}
            value={
              profile.sex === 'male'
                ? L.profileSexMale
                : profile.sex === 'female'
                  ? L.profileSexFemale
                  : undefined
            }
          />
          <ProfileRow
            label={L.profileNeutered}
            value={
              profile.neutered === true
                ? L.profileNeuteredYes
                : profile.neutered === false
                  ? L.profileNeuteredNo
                  : undefined
            }
          />
          {profile.neutered && profile.neuteredAge && (
            <ProfileRow label={L.profileNeuteredAge} value={profile.neuteredAge} />
          )}
          <ProfileRow label={L.profileBloodType} value={profile.bloodType} />
          <ProfileRow label={L.profileAllergies} value={profile.allergies} />
          {profile.environment && (
            <ProfileRow label={L.profileEnvironment} value={envLabel[profile.environment]} />
          )}
          {profile.livingWithAnimals != null && (
            <ProfileRow
              label="Convive con animales"
              value={profile.livingWithAnimals ? 'Sí' : 'No'}
            />
          )}
          {profile.parasiteControl && (
            <ProfileRow label={L.profileParasite} value={profile.parasiteControl} />
          )}
        </div>

        <div className="profile-section-title">{L.profileConditions}</div>
        {allConditions.length === 0 ? (
          <p className="profile-empty-row">{L.profileNoConditions}</p>
        ) : (
          <div className="profile-tags">
            {allConditions.map((condition) => (
              <span key={condition} className="profile-tag">
                {condition}
              </span>
            ))}
          </div>
        )}

        <div className="profile-section-title">{L.profileSurgeries}</div>
        {profile.surgeries.length === 0 ? (
          <p className="profile-empty-row">{L.profileNoSurgeries}</p>
        ) : (
          profile.surgeries.map((surgery) => (
            <div key={surgery.id} className="profile-surgery-row">
              <span className="profile-surgery-name">{surgery.name}</span>
              {surgery.date && (
                <span className="profile-surgery-date">
                  {new Date(`${surgery.date}T12:00:00`).toLocaleDateString('es-ES')}
                </span>
              )}
              {surgery.notes && <span className="profile-surgery-notes">{surgery.notes}</span>}
            </div>
          ))
        )}

        {(profile.behavioralNotes || profile.vetQuestions) && (
          <div className="profile-notes-section">
            {profile.behavioralNotes && (
              <ProfileRow label={L.profileBehavior} value={profile.behavioralNotes} />
            )}
            {profile.vetQuestions && (
              <ProfileRow label={L.profileVetQuestions} value={profile.vetQuestions} />
            )}
          </div>
        )}

        {profile.updatedAt && (
          <p className="profile-updated">
            {L.profileLastUpdated} {new Date(profile.updatedAt).toLocaleDateString('es-ES')}
          </p>
        )}
      </div>
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null

  return (
    <div className="profile-row">
      <span className="profile-row-label">{label}</span>
      <span className="profile-row-value">{value}</span>
    </div>
  )
}

function TabVets({
  vets,
  confirmDeleteId,
  onAdd,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  vets: VetContact[]
  confirmDeleteId: string | null
  onAdd: () => void
  onEdit: (item: VetContact) => void
  onRequestDelete: (id: string) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: string) => void
}) {
  return (
    <div className="tab-content">
      <button className="btn btn-primary tab-add-btn" onClick={onAdd}>
        {L.vetAddBtn}
      </button>

      {vets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🩺</div>
          <h3>{L.vetEmptyTitle}</h3>
          <p>{L.vetEmptyText}</p>
          <button className="btn btn-primary" onClick={onAdd}>
            {L.vetAddBtn}
          </button>
        </div>
      ) : (
        <div className="card-list">
          {vets.map((item) => {
            const typeInfo = VET_TYPES.find((typeItem) => typeItem.value === item.type)

            return (
              <div key={item.id} className="vet-card">
                <div className="vet-card-icon">{typeInfo?.emoji ?? '🩺'}</div>

                <div className="vet-card-body">
                  <div className="vet-card-name">{item.name}</div>
                  <div className="vet-card-clinic">
                    {typeInfo?.label} · {item.clinic}
                  </div>

                  {item.specialty && (
                    <div className="vet-card-detail">
                      {L.vetSpecialty}: {item.specialty}
                    </div>
                  )}

                  <div className="vet-card-phones">
                    <span>{item.phone}</span>
                    {item.phone2 && <span>{item.phone2}</span>}
                  </div>

                  {item.address && <div className="vet-card-detail">{item.address}</div>}

                  {item.petIds.length > 0 && (
                    <div className="vet-card-detail">
                      {L.vetAssocPets}:{' '}
                      {MOCK_PETS.filter((pet) => item.petIds.includes(pet.id))
                        .map((pet) => pet.name)
                        .join(', ')}
                    </div>
                  )}
                </div>

                <div className="vet-card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                    {L.vetEdit}
                  </button>

                  {confirmDeleteId === item.id ? (
                    <div className="confirm-delete">
                      <button className="btn btn-danger btn-sm" onClick={() => onConfirmDelete(item.id)}>
                        {L.vetDeleteConfirm}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                        {L.vetDeleteCancel}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm danger"
                      onClick={() => onRequestDelete(item.id)}
                    >
                      {L.vetDelete}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TabAppointments({
  petName,
  appointments,
  confirmDeleteId,
  onAdd,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  petName: string
  appointments: VetAppointment[]
  confirmDeleteId: string | null
  onAdd: () => void
  onEdit: (item: VetAppointment) => void
  onRequestDelete: (id: string) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: string) => void
}) {
  const todayDate = new Date().toISOString().split('T')[0]
  const upcoming = appointments.filter(
    (item) => item.nextAppointmentDate && item.nextAppointmentDate >= todayDate
  )

  return (
    <div className="tab-content">
      <button className="btn btn-primary tab-add-btn" onClick={onAdd}>
        {L.apptAddBtn}
      </button>

      {upcoming.length > 0 && (
        <div className="upcoming-section">
          <div className="section-label">{L.apptNextLabel}</div>
          {upcoming.map((item) => (
            <NextReturnBanner key={item.id} appointment={item} />
          ))}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>{L.apptEmptyTitle}</h3>
          <p>{L.apptEmptyText(petName)}</p>
          <button className="btn btn-primary" onClick={onAdd}>
            {L.apptAddBtn}
          </button>
        </div>
      ) : (
        <div className="card-list">
          {appointments.map((item) => {
            const typeInfo = APPOINTMENT_TYPES.find((typeItem) => typeItem.value === item.type)
            const dateLabel = new Date(`${item.date}T12:00:00`).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })

            return (
              <div key={item.id} className="appt-card">
                <div className="appt-card-icon">{typeInfo?.emoji ?? '📋'}</div>

                <div className="appt-card-body">
                  <div className="appt-card-reason">{item.reason}</div>
                  <div className="appt-card-date">{dateLabel}</div>
                  <div className="appt-card-vet">
                    {item.vetName}
                    {item.clinic ? ` · ${item.clinic}` : ''}
                  </div>

                  {item.diagnosis && (
                    <div className="appt-card-detail">
                      {L.apptDiagnosis}: {item.diagnosis}
                    </div>
                  )}

                  {item.treatment && (
                    <div className="appt-card-detail">
                      {L.apptTreatment}: {item.treatment}
                    </div>
                  )}

                  <div className="appt-card-meta">
                    {item.weightKg != null && <span>{L.apptWeight}: {item.weightKg} kg</span>}
                    {item.nextAppointmentDate && (
                      <span>
                        {L.apptNextReturn}:{' '}
                        {new Date(`${item.nextAppointmentDate}T12:00:00`).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="appt-card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                    {L.apptEdit}
                  </button>

                  {confirmDeleteId === item.id ? (
                    <div className="confirm-delete">
                      <button className="btn btn-danger btn-sm" onClick={() => onConfirmDelete(item.id)}>
                        {L.apptDeleteConfirm}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                        {L.apptDeleteCancel}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm danger"
                      onClick={() => onRequestDelete(item.id)}
                    >
                      {L.apptDelete}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NextReturnBanner({ appointment }: { appointment: VetAppointment }) {
  if (!appointment.nextAppointmentDate) return null

  const returnDate = new Date(`${appointment.nextAppointmentDate}T12:00:00`)
  const now = new Date()
  const diffDays = Math.ceil((returnDate.getTime() - now.getTime()) / 86400000)
  const urgency = diffDays <= 3

  const timeLabel =
    diffDays <= 0 ? L.today : diffDays === 1 ? L.tomorrow : L.inDays(diffDays)

  return (
    <div className={`return-banner ${urgency ? 'urgent' : ''}`}>
      <span className="return-banner-icon">🔄</span>

      <div className="return-banner-body">
        <div className="return-banner-note">
          {appointment.nextAppointmentNote ?? 'Retorno programado'}
        </div>
        <div className="return-banner-vet">
          {appointment.vetName}
          {appointment.clinic ? ` · ${appointment.clinic}` : ''}
        </div>
      </div>

      <div className="return-banner-time">
        <div className="return-banner-label">{timeLabel}</div>
        <div className="return-banner-date">
          {returnDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
        </div>
      </div>
    </div>
  )
}

function ComingSoonCard({ tab }: { tab: 'exams' | 'documents' }) {
  const info = COMING_SOON[tab]

  return (
    <div className="coming-soon-card">
      <div className="coming-soon-icon">{info.icon}</div>
      <div className="coming-soon-label">{L.comingSoonLabel}</div>
      <p className="coming-soon-text">{info.text}</p>
    </div>
  )
}
```

## File: src/styles/catAnim.css
```css
/* ══════════════════════════════════════════════════════════════════
   PITUTI — Cat Animation Styles
   src/styles/catAnim.css
   
   Import in main.tsx:  import './styles/catAnim.css'
   
   Contains ALL animation logic for the calico cat in the topbar.
   Edit here, changes propagate automatically — no more JS string.
   ══════════════════════════════════════════════════════════════════ */

/* ── Topbar: allow overflow so ears/tail aren't clipped ───────── */
.topbar { overflow: visible !important; }

/* ── Pituti title letter-by-letter reveal ─────────────────────── */
export const ANIM_CSS = `
.pituti-anim-wrap {
  display: flex;
  font-style: italic;
}
.pituti-anim-wrap span {
  display: inline-block;
  opacity: 0;
  animation: letterAppear 0.75s cubic-bezier(.16,1,.3,1) forwards;
  animation-delay: calc(var(--i, 0) * 220ms);
}
@keyframes letterAppear {
  from { opacity: 0; transform: translateX(-8px) translateY(3px); }
  to   { opacity: 1; transform: translateX(0) translateY(0); }
}

/* Collapsed sidebar: hide text + cat */
.sidebar-collapsed .topbar-logo .pituti-anim-wrap {
  opacity: 0;
  transform: translateX(-8px);
  pointer-events: none;
  width: 0;
  overflow: hidden;
  transition: opacity 200ms, transform 200ms, width 200ms;
}
.sidebar-collapsed .calico-cat {
  opacity: 0 !important;
  transition: opacity 200ms;
}

/* ── Cat container ────────────────────────────────────────────── */
.calico-cat {
  position: absolute;
  left: 148px;
  top: 50%;
  margin-top: -22px;
  z-index: 10;
  pointer-events: none;
  overflow: visible;
  transform-origin: center bottom;
  animation: catJourney 5.6s cubic-bezier(.08, 0, .6, 1) 0.4s forwards;
}

/* Mobile: shift cat further right so it never overlaps "Pituti" text */
@media (max-width: 768px) {
  .calico-cat {
    left: auto;
    right: 72px;   /* stays safely before the action buttons */
    animation: catJourneyMobile 5.6s cubic-bezier(.08, 0, .6, 1) 0.4s forwards;
  }
}

/* ── Desktop journey: slides from right edge to rest ─────────── */
@keyframes catJourney {
  0%   { transform: translateX(calc(50vw - 148px)); opacity: 0; }
  2%   { opacity: 1; }
  8%   { transform: translateX(calc(50vw * .46)) rotate(-0.5deg); }
  16%  { transform: translateX(calc(50vw * .38)) rotate(-0.5deg); }
  24%  { transform: translateX(calc(50vw * .30)) rotate(-0.5deg); }
  32%  { transform: translateX(calc(50vw * .22)) rotate(-0.5deg); }
  40%  { transform: translateX(calc(50vw * .15)) rotate(-0.5deg); }
  48%  { transform: translateX(calc(50vw * .09)) rotate(-0.5deg); }
  56%  { transform: translateX(calc(50vw * .05)) rotate(-0.4deg); }
  63%  { transform: translateX(calc(50vw * .02)) rotate(-0.3deg); }
  70%  { transform: translateX(16px) rotate(-0.2deg); }
  76%  { transform: translateX(8px)  rotate(-0.1deg); }
  80%  { transform: translateX(4px)  rotate(0deg); }
  85%  { transform: translateX(2px)  translateY(2px); }
  90%  { transform: translateX(2px)  translateY(-1px); }
  95%  { transform: translateX(2px)  translateY(0px); }
  100% { transform: translateX(2px)  translateY(0px); opacity: 1; }
}

/* ── Mobile journey: slides from far right, stops at right: 72px ─ */
@keyframes catJourneyMobile {
  0%   { transform: translateX(120px); opacity: 0; }
  2%   { opacity: 1; }
  30%  { transform: translateX(90px) rotate(-0.5deg); }
  55%  { transform: translateX(40px) rotate(-0.4deg); }
  72%  { transform: translateX(16px) rotate(-0.2deg); }
  82%  { transform: translateX(4px)  rotate(0deg); }
  87%  { transform: translateX(2px)  translateY(2px); }
  92%  { transform: translateX(2px)  translateY(-1px); }
  96%  { transform: translateX(2px)  translateY(0px); }
  100% { transform: translateX(2px)  translateY(0px); opacity: 1; }
}

/* ── Walk → Sit crossfade at 5.05s ───────────────────────────── */
.cat-walk {
  animation: walkFade 0.65s ease-in-out 5.05s forwards;
}
.cat-sit {
  opacity: 0;
  animation: sitFade  0.65s ease-in-out 5.05s forwards;
}
@keyframes walkFade { to { opacity: 0; } }
@keyframes sitFade  { to { opacity: 1; } }

/* ── Legs: sprite-sheet steps(8) ─────────────────────────────── */
.cat-leg-1, .cat-leg-2, .cat-leg-3, .cat-leg-4 {
  transform-box: fill-box;
  transform-origin: top center;
}
.cat-leg-1 { animation: legCycle 0.56s steps(8, end) 0.40s 9 forwards; }
.cat-leg-4 { animation: legCycle 0.56s steps(8, end) 0.40s 9 forwards; }
.cat-leg-2 { animation: legCycle 0.56s steps(8, end) 0.68s 9 forwards; }
.cat-leg-3 { animation: legCycle 0.56s steps(8, end) 0.68s 9 forwards; }

@keyframes legCycle {
  0%    { transform: rotate(0deg)    translateY(0px);  }
  12.5% { transform: rotate(-18deg)  translateY(0px);  }
  25%   { transform: rotate(-28deg)  translateY(0px);  }
  37.5% { transform: rotate(-16deg)  translateY(-7px); }
  50%   { transform: rotate(4deg)    translateY(-10px);}
  62.5% { transform: rotate(22deg)   translateY(-7px); }
  75%   { transform: rotate(26deg)   translateY(-3px); }
  87.5% { transform: rotate(16deg)   translateY(0px);  }
  100%  { transform: rotate(0deg)    translateY(0px);  }
}

/* ── Walking tail ─────────────────────────────────────────────── */
.cat-walk-tail {
  transform-box: fill-box;
  transform-origin: 0% 100%;
  animation: tailSway 0.9s ease-in-out 0.4s 6 forwards;
}
@keyframes tailSway {
  0%   { transform: rotate(0deg);  }
  25%  { transform: rotate(8deg);  }
  75%  { transform: rotate(-8deg); }
  100% { transform: rotate(0deg);  }
}

/* ── Sitting tail — happy slow sway ──────────────────────────── */
.cat-sit-tail {
  transform-box: fill-box;
  transform-origin: 30% 20%;
  animation: sitTailSway 2.2s ease-in-out 5.8s infinite;
}
@keyframes sitTailSway {
  0%, 100% { transform: rotate(0deg);  }
  40%      { transform: rotate(4deg);  }
  70%      { transform: rotate(-3deg); }
}

/* ── Reduced motion: stop everything ─────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .calico-cat,
  .cat-walk, .cat-sit,
  .cat-walk-tail, .cat-sit-tail,
  .cat-leg-1, .cat-leg-2, .cat-leg-3, .cat-leg-4,
  .pituti-anim-wrap span {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .calico-cat { left: 148px; }
}
```

## File: src/api/.gitkeep
```

```

## File: src/assets/react.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

## File: src/assets/vite.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
```

## File: src/components/Avatar.tsx
```typescript
import { useState } from 'react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  photoUrl?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export default function Avatar({ name, photoUrl, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={[
        'relative flex shrink-0 items-center justify-center rounded-full',
        'bg-teal-100 font-semibold text-teal-800 overflow-hidden',
        sizeClasses[size],
        className,
      ].join(' ')}
      aria-label={name}
    >
      {photoUrl && !imgError ? (
        <img
          src={photoUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}
```

## File: src/components/BackButton.tsx
```typescript
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?:    string        // specific route; if omitted uses navigate(-1)
  label?: string
}

export default function BackButton({ to, label = 'Volver' }: BackButtonProps) {
  const navigate = useNavigate()
  return (
    <button
      className="back-btn"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      type="button"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {label}
    </button>
  )
}
```

## File: src/components/Badge.tsx
```typescript
import type { BadgeStatus } from '../types'

interface BadgeProps {
  label: string
  status?: BadgeStatus
  className?: string
}

const statusClasses: Record<BadgeStatus, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-800',
  neutral: 'bg-stone-100 text-stone-600',
}

export default function Badge({ label, status = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusClasses[status],
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
```

## File: src/components/Button.tsx
```typescript
import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant, ButtonSize } from '../types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900',
  secondary: 'bg-stone-100 text-stone-900 border border-stone-300 hover:bg-stone-200 active:bg-stone-300',
  ghost:     'bg-transparent text-stone-700 hover:bg-stone-100 active:bg-stone-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  ariaLabel,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
```

## File: src/components/Card.tsx
```typescript
import type { ReactNode } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  padding?: CardPadding
  onClick?: () => void
  className?: string
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export default function Card({ children, padding = 'md', onClick, className = '' }: CardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white shadow-sm',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
        paddingClasses[padding],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
```

## File: src/components/CareDetailModal.tsx
```typescript
import { useState } from 'react'
import { PfBtn, PfFooter } from './FooterButtons'

export interface CareDetailItem {
  id: string; petId: string; emoji: string; title: string; sub: string
  total: number; done: number; done_state: boolean; bg: string
}

interface Props {
  item:     CareDetailItem | null
  onClose:  () => void
  onToggle: (id: string, newDone: number, newState: boolean) => void
  onEdit:   (item: CareDetailItem) => void
}

export default function CareDetailModal({ item, onClose, onToggle, onEdit }: Props) {
  const [localDone, setLocalDone] = useState<number | null>(null)

  if (!item) return null

  const done   = localDone !== null ? localDone : item.done
  const isDone = done >= item.total

  const clickDot = (i: number) => {
    const newDone = i < done ? i : i + 1
    setLocalDone(newDone)
    onToggle(item.id, newDone, newDone >= item.total)
  }

  const handleMarkDone = () => {
    const newDone = isDone ? 0 : item.total
    setLocalDone(newDone)
    onToggle(item.id, newDone, !isDone)
  }

  return (
    <div className="care-detail-overlay" onClick={onClose}>
      <div className="care-detail-sheet" onClick={e => e.stopPropagation()}>

        {/* ── Hero ── */}
        <div className="care-detail-hero">
          <div className="care-detail-emoji" style={{ background: item.bg }}>{item.emoji}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)' }}>{item.title}</div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.1rem' }}>{item.sub}</div>
          </div>
          <button
            style={{ width:32, height:32, borderRadius:'var(--r-md)', background:'var(--surface-offset)',
              border:'1.5px solid var(--border)', display:'flex', alignItems:'center',
              justifyContent:'center', color:'var(--text-muted)', cursor:'pointer', flexShrink:0 }}
            onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="care-detail-body">

          {/* Progress dots */}
          <div className="care-detail-progress-row">
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'.5rem' }}>
                Progreso de hoy — {done} de {item.total}
              </div>
              <div className="care-detail-dots">
                {Array.from({ length: item.total }).map((_, i) => (
                  <button key={i}
                    className={['care-detail-dot-btn', i < done ? 'filled' : ''].join(' ')}
                    onClick={() => clickDot(i)}
                    title={i < done ? 'Marcar como pendiente' : 'Marcar como hecho'}>
                    {i < done ? '✓' : '○'}
                  </button>
                ))}
              </div>
            </div>
            {isDone && (
              <div style={{ background:'var(--success-hl)', border:'1.5px solid var(--success)',
                borderRadius:'var(--r-full)', padding:'.25rem .75rem', fontSize:'.75rem',
                fontWeight:800, color:'var(--success)', flexShrink:0 }}>
                Completado ✓
              </div>
            )}
          </div>

          {/* Meta chips */}
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            {[
              { label:'Frecuencia', value: item.sub },
              { label:'Estado',    value: isDone ? 'Completado' : 'Pendiente',
                color: isDone ? 'var(--success)' : 'var(--warn)' },
            ].map(c => (
              <div key={c.label} style={{ background:'var(--surface-offset)', border:'1.5px solid var(--border)',
                borderRadius:'var(--r-lg)', padding:'.5rem .875rem', flex:1 }}>
                <div style={{ fontSize:'.65rem', color:'var(--text-faint)', fontWeight:800,
                  textTransform:'uppercase', letterSpacing:'.07em' }}>{c.label}</div>
                <div style={{ fontSize:'.875rem', fontWeight:700, marginTop:'.2rem',
                  color: c.color ?? 'var(--text)' }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>


{/* ── Footer ── */}
<div className="detail-footer">
  <button className="btn btn-secondary" onClick={() => { onEdit(item); onClose() }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
    </svg>
    Editar
  </button>
  <button
    className={isDone ? 'btn btn-secondary' : 'btn btn-success'}
    onClick={handleMarkDone}>
    {isDone ? '↩ Desmarcar' : '✓ Marcar hecho'}
  </button>
</div>

      </div>
    </div>
  )
}
```

## File: src/components/DeleteAccountModal.tsx
```typescript
import { useState } from 'react'
import { PfBtn } from './FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: Props) {
  const [step, setStep]     = useState(1)   // 1 = warning, 2 = confirm
  const [typed, setTyped]   = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (typed.toLowerCase() !== 'eliminar') return
    setLoading(true)
    setTimeout(() => {
      setLoading(false); onConfirm()
    }, 1200)
  }

  const reset = () => { setStep(1); setTyped(''); setLoading(false); onClose() }

  return (
    <div className="delete-account-overlay" onClick={reset}>
      <div className="delete-account-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="delete-account-header">
          <div className="delete-account-warning-icon">⚠️</div>
          <div style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--err)', marginBottom:'.375rem' }}>
            Eliminar cuenta permanentemente
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>
            Esta acción no se puede deshacer
          </div>
        </div>

        {step === 1 ? (
          /* ── Step 1: What will be lost ── */
          <div style={{ padding:'1.25rem 1.5rem' }}>
            <div style={{ fontWeight:700, fontSize:'.875rem', color:'var(--text)', marginBottom:'.875rem' }}>
              Si eliminas tu cuenta se perderá permanentemente:
            </div>
            {[
              { icon:'🐾', text:'El perfil completo de todas tus mascotas' },
              { icon:'💉', text:'Historial de vacunas y próximas dosis' },
              { icon:'💊', text:'Todos los medicamentos registrados' },
              { icon:'🌡️', text:'Síntomas, notas y registros veterinarios' },
              { icon:'📋', text:'Cuidados diarios y rutinas configuradas' },
              { icon:'👥', text:'Acceso compartido con otros cuidadores' },
            ].map(item => (
              <div key={item.text} style={{ display:'flex', alignItems:'flex-start', gap:'.625rem', marginBottom:'.5rem' }}>
                <span style={{ fontSize:'.875rem', flexShrink:0, marginTop:'.05rem' }}>{item.icon}</span>
                <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>{item.text}</span>
              </div>
            ))}
            <div style={{ background:'var(--err-hl)', border:'1.5px solid rgba(200,64,106,.3)', borderRadius:'var(--r-lg)', padding:'.75rem 1rem', marginTop:'.875rem', fontSize:'.8125rem', color:'var(--err)', fontWeight:700 }}>
              ⚠ No podrás recuperar estos datos después de eliminar tu cuenta.
            </div>
          </div>
        ) : (
          /* ── Step 2: Type confirmation ── */
          <div style={{ padding:'1.25rem 1.5rem' }}>
            <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'1rem' }}>
              Para confirmar, escribe <strong style={{ color:'var(--text)', fontFamily:'monospace', background:'var(--surface-offset)', padding:'.1rem .35rem', borderRadius:'var(--r-sm)' }}>eliminar</strong> en el campo de abajo:
            </div>
            <input
              className="form-input"
              placeholder="eliminar"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              style={{ borderColor: typed && typed.toLowerCase()!=='eliminar' ? 'var(--err)' : 'var(--border)', marginBottom:'.875rem' }}
              autoFocus
            />
            {typed && typed.toLowerCase() !== 'eliminar' && (
              <div style={{ fontSize:'.75rem', color:'var(--err)', marginTop:'-.625rem', marginBottom:'.875rem', fontWeight:700 }}>
                Escribe exactamente "eliminar" (sin comillas)
              </div>
            )}
            <div style={{ fontSize:'.75rem', color:'var(--text-faint)', lineHeight:1.5 }}>
              Al hacer clic en "Eliminar definitivamente" tu cuenta y todos los datos asociados serán borrados permanentemente de los servidores de PITUTI.
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'space-between', gap:'.5rem', padding:'.875rem 1.5rem 1.125rem', borderTop:'1.5px solid var(--divider)', background:'var(--surface-2)' }}>
          <PfBtn variant="cancel" onClick={reset}>Cancelar</PfBtn>
          {step === 1 ? (
            <PfBtn variant="delete" onClick={() => setStep(2)}>Continuar →</PfBtn>
          ) : (
            <PfBtn
              variant="delete"
              loading={loading}
              disabled={typed.toLowerCase() !== 'eliminar'}
              onClick={handleConfirm}
            >
              Eliminar definitivamente
            </PfBtn>
          )}
        </div>
      </div>
    </div>
  )
}
```

## File: src/components/EditVaccineModal.tsx
```typescript
import { useState, useEffect } from 'react'
import Modal from './Modal'
import type { VaccineRecord } from '../hooks/usePets'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from '../components/FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  vaccine: VaccineRecord | null
  onSave:  (updated: VaccineRecord) => void
}

export default function EditVaccineModal({ isOpen, onClose, vaccine, onSave }: Props) {
  const [name,      setName]      = useState('')
  const [applied,   setApplied]   = useState('')
  const [nextDate,  setNextDate]  = useState('')
  const [nameErr,   setNameErr]   = useState('')
  const [nextErr,   setNextErr]   = useState('')
  const [success,   setSuccess]   = useState(false)

  useEffect(() => {
    if (vaccine && isOpen) {
      setName(vaccine.name)
      setApplied(vaccine.applied)
      setNextDate(vaccine.nextDate)
      setNameErr(''); setNextErr(''); setSuccess(false)
    }
  }, [vaccine, isOpen])

  if (!vaccine) return null

  const handleSave = () => {
    if (!name.trim()) { setNameErr('El nombre es obligatorio'); return }
    if (!nextDate)    { setNextErr('La próxima dosis es obligatoria'); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...vaccine, name: name.trim(), applied, nextDate })
      showToast(`💉 ${name.trim()} actualizada`)
      setSuccess(false); onClose()
    }, 900)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon=""
      accentBg="var(--blue-hl)"
      accentFg="var(--blue)"
      footer={!success
        ? 
        <PfFooter>
  <PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>
</PfFooter>
        
        
        : <></>
      }
    >
<div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--blue-hl),var(--surface))' }}>
  <div className="modal-hero-icon" style={{ background:'var(--blue)', fontSize:'1.5rem' }}>💉</div>
  <div style={{ flex:1 }}>
    <div className="modal-hero-title">Editar vacuna</div>
    <div className="modal-hero-sub">{vaccine.name}</div>
  </div>
  <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  </button>
</div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">Vacuna actualizada</div>
        </div>
      ) : (
        <>
          <div className="modal-section">Nombre</div>
          <div className="form-group">
            <div className="field-icon-wrap">
              <span className="field-icon">💉</span>
              <input className={['form-input', nameErr ? 'form-input--err' : ''].join(' ')}
                value={name} onChange={e => { setName(e.target.value); setNameErr('') }}
                placeholder="Nombre de la vacuna" autoFocus/>
            </div>
            {nameErr && <span className="form-hint-err">{nameErr}</span>}
          </div>

          <div className="modal-section">Fechas</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Última aplicación</label>
              <input type="text" className="form-input" value={applied}
                onChange={e => setApplied(e.target.value)}
                placeholder="Ej: 15 abr 2026"/>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Próxima dosis *</label>
              <input type="date" className={['form-input', nextErr ? 'form-input--err' : ''].join(' ')}
                value={nextDate} onChange={e => { setNextDate(e.target.value); setNextErr('') }}/>
              {nextErr && <span className="form-hint-err">{nextErr}</span>}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/EmptyState.tsx
```typescript
import type { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

const DefaultIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9h.01M15 9h.01M9 15s1 2 3 2 3-2 3-2" strokeLinecap="round" />
  </svg>
)

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <span className="text-stone-400">{icon ?? <DefaultIcon />}</span>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-stone-800">{title}</h3>
        {description && <p className="max-w-xs text-sm text-stone-500">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
```

## File: src/components/FooterButtons.tsx
```typescript
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type PfVariant =
  | 'close' | 'cancel'
  | 'save' | 'primary'
  | 'register' | 'add'
  | 'done'
  | 'edit'
  | 'archive'
  | 'resolve'
  | 'delete' | 'danger'
  | 'warn'

type PfSize = 'sm' | 'md' | 'lg'

interface PfBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant:  PfVariant
  size?:    PfSize
  icon?:    ReactNode
  full?:    boolean
  loading?: boolean
  children: ReactNode
}

// ── SVG Icon helpers ──────────────────────────────────────────
function SaveIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }
function CloseIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg> }
function EditIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg> }
function CheckIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> }
function AddIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg> }
function TrashIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> }
function ArchiveIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg> }
function SpinIcon()     { return <span style={{ display:'inline-block', width:14, height:14, borderRadius:'50%', border:'2.5px solid currentColor', borderTopColor:'transparent', animation:'spin .7s linear infinite' }}/> }

const DEFAULT_ICONS: Partial<Record<PfVariant, ReactNode>> = {
  save:     <SaveIcon/>,
  primary:  <SaveIcon/>,
  close:    <CloseIcon/>,
  cancel:   <CloseIcon/>,
  edit:     <EditIcon/>,
  done:     <CheckIcon/>,
  register: <CheckIcon/>,
  add:      <AddIcon/>,
  resolve:  <CheckIcon/>,
  delete:   <TrashIcon/>,
  danger:   <TrashIcon/>,
  archive:  <ArchiveIcon/>,
}

/**
 * PfBtn — Professional Footer Button
 * Uses .pf-btn CSS system for consistent appearance across all modals and forms.
 */
export function PfBtn({
  variant,
  size = 'md',
  icon,
  full = false,
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: PfBtnProps) {
  const classes = [
    'pf-btn',
    `pf-btn--${variant}`,
    size !== 'md' ? `pf-btn--${size}` : '',
    full ? 'pf-btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  const displayIcon = icon ?? DEFAULT_ICONS[variant]

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? <SpinIcon/> : (displayIcon && <span className="pf-btn-icon">{displayIcon}</span>)}
      {children}
    </button>
  )
}

/**
 * PfFooter — Professional Footer container
 * place=start puts destructive action on left, actions on right (default pattern)
 */
interface PfFooterProps {
  left?:  ReactNode
  right?: ReactNode
  children?: ReactNode
  className?: string
}
export function PfFooter({ left, right, children, className = '' }: PfFooterProps) {
  if (children) {
    return (
      <div className={`pf-footer ${className}`}>
        {children}
      </div>
    )
  }
  return (
    <div className={`pf-footer pf-footer--spread ${className}`}>
      {left  && <div className="pf-footer__left">{left}</div>}
      {right && <div className="pf-footer__right">{right}</div>}
    </div>
  )
}

/** Preset footer: Cancel + Primary CTA */
export function FooterCancelSave({
  onCancel,
  onSave,
  cancelLabel = 'Cancelar',
  saveLabel   = 'Guardar cambios',
  loading     = false,
  variant     = 'save',
}: {
  onCancel:     () => void
  onSave?:      () => void
  cancelLabel?: string
  saveLabel?:   string
  loading?:     boolean
  variant?:     PfVariant
}) {
  return (
    <PfFooter>
      <PfBtn variant="cancel" onClick={onCancel}>{cancelLabel}</PfBtn>
      {onSave
        ? <PfBtn variant={variant} onClick={onSave} loading={loading}>{saveLabel}</PfBtn>
        : <PfBtn variant={variant} type="submit" loading={loading}>{saveLabel}</PfBtn>}
    </PfFooter>
  )
}

/** Preset: Cancel + Edit + Done */
export function FooterDetailActions({
  onClose,
  onEdit,
  onDone,
  doneLabel = 'Marcar hecho',
  doneVariant = 'done',
}: {
  onClose:      () => void
  onEdit:       () => void
  onDone?:      () => void
  doneLabel?:   string
  doneVariant?: PfVariant
}) {
  return (
    <PfFooter>
      <PfBtn variant="cancel" size="sm" onClick={onClose}>Cerrar</PfBtn>
      <div style={{ display:'flex', gap:'.5rem', marginLeft:'auto' }}>
        <PfBtn variant="edit" onClick={onEdit}>Editar</PfBtn>
        {onDone && <PfBtn variant={doneVariant} onClick={onDone}>{doneLabel}</PfBtn>}
      </div>
    </PfFooter>
  )
}
```

## File: src/components/Input.tsx
```typescript
import { useId, type ChangeEvent } from 'react'

interface InputProps {
  label: string
  name: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel'
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  disabled = false,
  required = false,
  className = '',
}: InputProps) {
  const id = useId()

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={[
          'w-full rounded-xl border px-3 py-2 text-sm text-stone-900',
          'placeholder:text-stone-400 focus:outline-none focus:ring-2',
          'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-400 focus:ring-red-500 bg-red-50'
            : 'border-stone-300 focus:ring-teal-600 bg-white',
        ].join(' ')}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">{error}</p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="text-xs text-stone-500">{hint}</p>
      )}
    </div>
  )
}
```

## File: src/components/InviteSentOverlay.tsx
```typescript
interface Props {
  email:   string
  onClose: () => void
}

export default function InviteSentOverlay({ email, onClose }: Props) {
  return (
    <div className="invite-sent-overlay" onClick={onClose}>
      <div className="invite-sent-card" onClick={e => e.stopPropagation()}>
        <div className="invite-sent-icon">✉</div>

        <div style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--text)', marginBottom:'.5rem' }}>
          ¡Invitación enviada!
        </div>
        <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'1.25rem' }}>
          Se ha enviado una invitación a<br/>
          <strong style={{ color:'var(--text)' }}>{email}</strong><br/>
          para unirse como cuidador.
        </div>

        <div style={{ background:'var(--success-hl)', border:'1.5px solid var(--success)', borderRadius:'var(--r-lg)', padding:'.625rem 1rem', marginBottom:'1.25rem', fontSize:'.8125rem', color:'var(--success)', fontWeight:700 }}>
          ✓ El enlace de invitación expira en 48 horas
        </div>

        <button className="pf-btn pf-btn--primary pf-btn--full" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  )
}
```

## File: src/components/MedDetailModal.tsx
```typescript
import { useState } from 'react'
import type { MedRecord } from './EditMedModal'

interface Props {
  med:     MedRecord | null
  onClose: () => void
  onEdit:  (med: MedRecord) => void
  onMarkAdministered: (med: MedRecord, date: string) => void
}

export default function MedDetailModal({ med, onClose, onEdit, onMarkAdministered }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [markMode,  setMarkMode]  = useState(false)
  const [adminDate, setAdminDate] = useState(today)

  if (!med) return null

  const handleMark = () => {
    onMarkAdministered(med, adminDate)
    onClose()
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div className="detail-icon" style={{ background: med.bg || 'var(--warn-hl)', color: med.color || 'var(--warn)', fontSize: '1.375rem' }}>
            {med.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{med.title}</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
              {med.dose} · {med.frequency}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="detail-body">
          <div style={{ marginBottom: '1rem' }}>
            <span className={`status-pill ${med.archived ? 'archived' : 'ok'}`}>
              {med.archived ? '📁 Archivado' : '✓ Activo'}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Dosis</div>
              <div className="detail-info-value">{med.dose}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Frecuencia</div>
              <div className="detail-info-value">{med.frequency}</div>
            </div>
            {med.startDate && (
              <div className="detail-info-chip">
                <div className="detail-info-label">Inicio</div>
                <div className="detail-info-value">
                  {new Date(med.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}
            {med.endDate && (
              <div className="detail-info-chip">
                <div className="detail-info-label">Fin</div>
                <div className="detail-info-value">
                  {new Date(med.endDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>

          {med.notes && (
            <div style={{ background: 'var(--surface-offset)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '.75rem 1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-faint)', marginBottom: '.375rem' }}>Notas</div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{med.notes}</div>
            </div>
          )}

          {/* Mark administered form */}
          {markMode && (
            <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)', borderRadius: 'var(--r-xl)', padding: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--success)', marginBottom: '.75rem' }}>✓ Registrar administración</div>
              <div className="detail-date-row">
                <label>Administrado el</label>
                <input type="date" value={adminDate}
                  onChange={e => setAdminDate(e.target.value)}
                  max={today}/>
              </div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          {!markMode ? (
            <>
              <button className="btn btn-secondary" onClick={() => { onEdit(med); onClose() }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
                Editar
              </button>
              {!med.archived && (
                <button className="btn btn-success" onClick={() => setMarkMode(true)}>
                  💊 Marcar administrado
                </button>
              )}
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setMarkMode(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={handleMark}>✓ Confirmar</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

## File: src/components/MiniVaccRing.tsx
```typescript
interface MiniVaccRingProps {
  coverage: number
  size?: number
  strokeWidth?: number
}

export default function MiniVaccRing({ coverage, size = 48, strokeWidth = 5 }: MiniVaccRingProps) {
  const r     = (size - strokeWidth) / 2
  const c     = 2 * Math.PI * r
  const color = coverage >= 80 ? 'var(--success)' : coverage >= 50 ? 'var(--warn)' : 'var(--err)'
  const track = 'var(--surface-offset)'

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem', flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={track} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - coverage / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition:'stroke-dashoffset .5s cubic-bezier(.16,1,.3,1)' }}
        />
        <text x={size/2} y={size/2 + 3.5}
          textAnchor="middle"
          fontFamily="Nunito,sans-serif"
          fontWeight="800"
          fontSize={size * 0.24}
          fill={color}>
          {coverage}%
        </text>
      </svg>
      <span style={{ fontSize:'.55rem', fontWeight:800, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'.05em' }}>
        Vacunas
      </span>
    </div>
  )
}
```

## File: src/components/NoteModals.tsx
```typescript
import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from './FooterButtons'


/* ═══════════════════════════════════════════════════════════════
   CURRENT USER MOCK — substitua pelo contexto de auth real
══════════════════════════════════════════════════════════════════ */
export const CURRENT_USER = {
  id:       'user-1',
  name:     'Tú',
  avatar:   'TL',
  color:    'var(--primary-hl)',
  colorFg:  'var(--primary)',
}


/* ═══════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════ */
export interface NoteReply {
  id:           string
  authorId:     string
  authorName:   string
  authorAvatar: string
  authorColor:  string   /* background */
  authorColorFg:string   /* texto */
  content:      string
  date:         string   /* ISO YYYY-MM-DD */
}

export interface NoteEntry {
  id:       string
  petId:    string
  content:  string
  vet:      string
  date:     string
  type:     string
  archived: boolean
  /* Author */
  authorId?:     string
  authorName?:   string
  authorAvatar?: string
  authorColor?:  string
  authorColorFg?:string
  /* Thread */
  replies?: NoteReply[]
}


/* ═══════════════════════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════════════════════════ */
const TYPEICON:  Record<string,string> = {
  control:'🩺', observacion:'👁', emergencia:'🚨', vacuna:'💉', cirugia:'🔬', otro:'📋',
}
const TYPEBG:    Record<string,string> = {
  control:'var(--blue-hl)', observacion:'var(--primary-hl)', emergencia:'var(--err-hl)',
  vacuna:'var(--success-hl)', cirugia:'var(--warn-hl)', otro:'var(--surface-offset)',
}
const TYPEFG:    Record<string,string> = {
  control:'var(--blue)', observacion:'var(--primary)', emergencia:'var(--err)',
  vacuna:'var(--success)', cirugia:'var(--warn)', otro:'var(--text-muted)',
}
const TYPELABEL: Record<string,string> = {
  control:'Control', observacion:'Observación', emergencia:'Emergencia',
  vacuna:'Post-vacuna', cirugia:'Cirugía', otro:'Nota',
}
const PETMETA: Record<string,{ emoji:string; name:string }> = {
  'pet-1':{ emoji:'🐱', name:'Luna' },
  'pet-2':{ emoji:'🐶', name:'Toby' },
  'pet-3':{ emoji:'🦜', name:'Kiwi' },
}
const NOTE_TYPES_EDIT = [
  { val:'control',     icon:'🩺', label:'Control'     },
  { val:'observacion', icon:'👁', label:'Observación' },
  { val:'emergencia',  icon:'🚨', label:'Emergencia'  },
  { val:'vacuna',      icon:'💉', label:'Post-vacuna' },
  { val:'cirugia',     icon:'🔬', label:'Cirugía'     },
  { val:'otro',        icon:'📋', label:'Otro'        },
]


/* ═══════════════════════════════════════════════════════════════
   AVATAR INLINE
══════════════════════════════════════════════════════════════════ */
function Avatar({ name, avatar, color, colorFg, size = 28 }: {
  name:string; avatar:string; color:string; colorFg:string; size?:number
}) {
  return (
    <div title={name} style={{
      width:size, height:size, borderRadius:'50%',
      background:color, color:colorFg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size * 0.36, fontWeight:800, flexShrink:0, letterSpacing:'-0.02em',
    }}>
      {avatar}
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   REPLY BUBBLE — "nota dentro da nota"
══════════════════════════════════════════════════════════════════ */
function ReplyBubble({ reply, isOwn }: { reply:NoteReply; isOwn:boolean }) {
  const dateStr = new Date(reply.date + 'T12:00:00').toLocaleDateString('es-ES', {
    day:'2-digit', month:'short',
  })
  return (
    <div style={{
      border:'1.5px solid var(--border)',
      borderLeft:`3px solid ${reply.authorColor}`,
      borderRadius:'var(--r-lg)',
      background: isOwn ? 'color-mix(in oklch,var(--primary-hl) 30%,var(--surface))' : 'var(--surface)',
      padding:'.625rem .875rem',
      marginBottom:'.5rem',
    }}>
      {/* mini header */}
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.4rem' }}>
        <Avatar
          name={reply.authorName} avatar={reply.authorAvatar}
          color={reply.authorColor} colorFg={reply.authorColorFg} size={24}
        />
        <span style={{ fontWeight:800, fontSize:'.8125rem', color:reply.authorColorFg }}>
          {reply.authorName}
        </span>
        {isOwn && (
          <span className="badge badge-blue" style={{ fontSize:'.6rem', padding:'.1rem .35rem' }}>Tú</span>
        )}
        <span style={{ marginLeft:'auto', fontSize:'.72rem', color:'var(--text-faint)' }}>
          {dateStr}
        </span>
      </div>
      {/* content */}
      <p style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6, margin:0 }}>
        {reply.content}
      </p>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   NOTE DETAIL MODAL
══════════════════════════════════════════════════════════════════ */
interface DetailProps {
  note:        NoteEntry | null
  onClose:     () => void
  onEdit:      (n: NoteEntry) => void
  onArchive:   (id: string) => void
  onUnarchive: (id: string) => void
  onDelete?:   (id: string) => void
  onAddReply?: (noteId: string, reply: NoteReply) => void
}

export function NoteDetailModal({
  note, onClose, onEdit, onArchive, onUnarchive, onDelete, onAddReply, 
}: DetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [replyText,     setReplyText]     = useState('')
  

  useEffect(() => {
    if (!note) { setConfirmDelete(false); setReplyText('') }
  }, [note])

  if (!note) return null

  const pm   = PETMETA[note.petId] ?? { emoji:'🐾', name:'Mascota' }
  const fg   = TYPEFG[note.type]   ?? 'var(--text-muted)'
  const bg   = TYPEBG[note.type]   ?? 'var(--surface-offset)'
  const ic   = TYPEICON[note.type] ?? '📋'
  const lbl  = TYPELABEL[note.type]?? 'Nota'
  const replies = note.replies ?? []
  const dateStr = new Date(note.date + 'T12:00:00').toLocaleDateString('es-ES', {
    day:'2-digit', month:'short', year:'numeric',
  })

  const handleAddReply = () => {
    if (!replyText.trim() || !onAddReply) return
    const reply: NoteReply = {
      id:           `reply-${Date.now()}`,
      authorId:     CURRENT_USER.id,
      authorName:   CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      authorColor:  CURRENT_USER.color,
      authorColorFg:CURRENT_USER.colorFg,
      content:      replyText.trim(),
      date:         new Date().toISOString().split('T')[0],
    }
    onAddReply(note.id, reply)
    setReplyText('')
    showToast('📝 Nota añadida')
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" style={{ maxWidth:460 }} onClick={e => e.stopPropagation()}>

        {/* ── Header ──────────────────────────────────── */}
        <div className="detail-header">
          <div className="detail-icon" style={{ background:bg, color:fg, fontSize:'1.375rem' }}>
            {ic}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', lineHeight:1.2 }}>
              {lbl}
            </div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.15rem' }}>
              {pm.emoji} {pm.name} · {dateStr}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Body ────────────────────────────────────── */}
        <div className="detail-body" style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>

          {/* Status + arquivo */}
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            <span className="status-pill ok">{lbl}</span>
            {note.archived && <span className="badge badge-gray">📁 Archivada</span>}
          </div>

          {/* Autor da nota */}
          {note.authorName && (
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
              <Avatar
                name={note.authorName}
                avatar={note.authorAvatar ?? note.authorName.slice(0,2).toUpperCase()}
                color={note.authorColor  ?? 'var(--primary-hl)'}
                colorFg={note.authorColorFg ?? 'var(--primary)'}
                size={26}
              />
              <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>
                Añadida por{' '}
                <strong style={{ color:'var(--text)' }}>{note.authorName}</strong>
              </span>
              {note.vet && (
                <span style={{ fontSize:'.8125rem', color:'var(--text-faint)' }}>
                  · 🩺 {note.vet}
                </span>
              )}
            </div>
          )}

          {/* Conteúdo principal da nota */}
          <div style={{
            background:'var(--surface-offset)',
            border:'1.5px solid var(--border)',
            borderLeft:`3px solid ${fg}`,
            borderRadius:'var(--r-lg)',
            padding:'.875rem 1rem',
          }}>
            <p style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6, margin:0 }}>
              {note.content}
            </p>
          </div>

          {/* ── Thread de respostas ("notas dentro da nota") ── */}
          {(replies.length > 0 || onAddReply) && (
            <div>
              {/* Separador + contador */}
              {replies.length > 0 && (
                <div style={{
                  display:'flex', alignItems:'center', gap:'.625rem',
                  marginBottom:'.75rem',
                  fontSize:'.72rem', fontWeight:800, textTransform:'uppercase',
                  letterSpacing:'.07em', color:'var(--text-faint)',
                }}>
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                  {replies.length} {replies.length === 1 ? 'respuesta' : 'respuestas'}
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                </div>
              )}

              {/* Cada resposta = nota dentro da nota */}
              {replies.map(r => (
                <ReplyBubble key={r.id} reply={r} isOwn={r.authorId === CURRENT_USER.id} />
              ))}

              {/* Input para adicionar nova resposta */}
              {onAddReply && (
                <div style={{
                  marginTop: replies.length > 0 ? '.375rem' : 0,
                  border:'1.5px solid var(--border)',
                  borderRadius:'var(--r-lg)',
                  background:'var(--surface)',
                  overflow:'hidden',
                }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'.625rem', padding:'.625rem .875rem' }}>
                    <Avatar
                      name={CURRENT_USER.name} avatar={CURRENT_USER.avatar}
                      color={CURRENT_USER.color} colorFg={CURRENT_USER.colorFg} size={26}
                    />
                    <textarea
                      style={{
                        flex:1, border:'none', background:'transparent', outline:'none',
                        fontFamily:'inherit', fontSize:'.875rem', resize:'none',
                        minHeight:52, color:'var(--text)', lineHeight:1.6, paddingTop:'.1rem',
                      }}
                      placeholder="Añadir una nota…"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddReply() }}
                    />
                  </div>
                  {replyText.trim() && (
                    <div style={{
                      padding:'.375rem .875rem .625rem',
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      borderTop:'1px solid var(--divider)',
                    }}>
                      <span style={{ fontSize:'.72rem', color:'var(--text-faint)' }}>
                        Ctrl + Enter para enviar
                      </span>
                      <button className="btn btn-primary btn-sm" onClick={handleAddReply}>
                        📝 Añadir nota
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div className="detail-footer">
          {confirmDelete ? (
            <>
              <span style={{ fontSize:'.8125rem', color:'var(--err)', flex:1 }}>
                ¿Eliminar esta nota permanentemente?
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>
                No
              </button>
              <button
                className="btn btn-sm"
                style={{ background:'var(--err)', color:'#fff' }}
                onClick={() => { onDelete?.(note.id); onClose() }}
              >
                Sí, eliminar
              </button>
            </>
          ) : (
            <>
              {onDelete && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color:'var(--err)' }}
                  onClick={() => setConfirmDelete(true)}
                >
                  🗑 Eliminar
                </button>
              )}
              <div style={{ marginLeft:'auto', display:'flex', gap:'.5rem' }}>
                {note.archived
                  ? <button className="btn btn-secondary btn-sm" onClick={() => { onUnarchive(note.id); onClose() }}>✓ Restaurar</button>
                  : <button className="btn btn-secondary btn-sm" onClick={() => { onArchive(note.id); onClose() }}>📁 Archivar</button>
                }
                <button className="btn btn-secondary btn-sm" onClick={() => { onEdit(note); onClose() }}>
                  ✏ Editar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   EDIT NOTE MODAL
══════════════════════════════════════════════════════════════════ */
interface EditProps {
  isOpen:  boolean
  onClose: () => void
  note:    NoteEntry | null
  onSave:  (updated: NoteEntry) => void
}

export function EditNoteModal({ isOpen, onClose, note, onSave }: EditProps) {
  const today = new Date().toISOString().split('T')[0]
  const [type,    setType]    = useState('control')
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [contErr, setContErr] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (note && isOpen) {
      setType(note.type); setContent(note.content)
      setVet(note.vet); setDate(note.date)
      setContErr(''); setSuccess(false)
    }
  }, [note, isOpen])

  if (!note) return null

  const selType = NOTE_TYPES_EDIT.find(n => n.val === type)!

  const handleSave = () => {
    if (!content.trim()) { setContErr('El contenido no puede estar vacío'); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...note, type, content: content.trim(), vet: vet.trim(), date })
      showToast('📋 Nota actualizada')
      setSuccess(false); onClose()
    }, 900)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar nota"
      icon={selType.icon}
      accentBg={TYPEBG[type] ?? 'var(--primary-hl)'}
      accentFg={TYPEFG[type] ?? 'var(--primary)'}
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${TYPEBG[type] ?? 'var(--primary-hl)'},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: TYPEFG[type] ?? 'var(--primary)', color:'#fff', fontSize:'1.5rem' }}>
          {selType.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="modal-hero-title" style={{ fontSize:'1rem' }}>
            {TYPELABEL[type] ?? 'Nota'}
          </div>
          {note.authorName && (
            <div className="modal-hero-sub">
              por {note.authorName}{note.vet ? ` · 🩺 ${note.vet}` : ''}
            </div>
          )}
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Nota actualizada!</div>
        </div>
      ) : (
        <>
          {/* Tipo */}
          <div className="modal-section">Tipo de nota</div>
          <div className="note-type-grid" style={{ marginBottom:'1rem' }}>
            {NOTE_TYPES_EDIT.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type === n.val ? 'active' : ''].join(' ')}
                style={type === n.val ? { background:TYPEBG[n.val], borderColor:TYPEFG[n.val], color:TYPEFG[n.val] } : {}}
                onClick={() => setType(n.val)}>
                <span style={{ fontSize:'1.1rem' }}>{n.icon}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Contenido */}
          <div className="modal-section">Contenido</div>
          <div className="form-group">
            <div className={['form-input', contErr ? 'form-input--err' : ''].join(' ')} style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent',
                  outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical',
                  minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                placeholder="Contenido de la nota…"
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Vet + fecha */}
          <div className="modal-section">Detalles</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Veterinario <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input" placeholder="Dra. García · VetSalud"
                  value={vet} onChange={e => setVet(e.target.value)} />
              </div>
            </div>
            <FormDateField label="Fecha" value={date} onChange={setDate} max={today} />
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/OverviewCard.tsx
```typescript
import type { ReactNode } from 'react'
import type { BadgeStatus } from '../types'
import Badge from './Badge'

interface OverviewCardProps {
  title: string
  value: string | number
  description?: string
  status?: BadgeStatus
  statusLabel?: string
  icon?: ReactNode
  onClick?: () => void
}

export default function OverviewCard({
  title, value, description, status, statusLabel, icon, onClick,
}: OverviewCardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white p-5 shadow-sm flex flex-col gap-3',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-600">{title}</p>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>

      <p className="text-3xl font-bold tabular-nums text-stone-900">{value}</p>

      {description && <p className="text-xs text-stone-500">{description}</p>}

      {status && statusLabel && (
        <Badge label={statusLabel} status={status} />
      )}
    </div>
  )
}
```

## File: src/components/PetCard.tsx
```typescript
import type { Pet } from '../types'
import Avatar from './Avatar'
import Badge, { } from './Badge'
import Card from './Card'
import type { BadgeStatus } from '../types'

interface PetCardProps {
  pet: Pet
  onClick?: (pet: Pet) => void
  isActive?: boolean
}

const speciesLabel: Record<string, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  reptile: 'Reptil',
  other: 'Otro',
}

const speciesStatus: Record<string, BadgeStatus> = {
  dog: 'info',
  cat: 'success',
  bird: 'warning',
  rabbit: 'neutral',
  reptile: 'danger',
  other: 'neutral',
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return 'Edad desconocida'
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
  if (months < 12) return `${months} mes${months === 1 ? '' : 'es'}`
  const years = Math.floor(months / 12)
  return `${years} año${years === 1 ? '' : 's'}`
}

export default function PetCard({ pet, onClick, isActive = false }: PetCardProps) {
  return (
    <Card
      padding="md"
      onClick={onClick ? () => onClick(pet) : undefined}
      className={isActive ? 'ring-2 ring-teal-600 border-teal-300' : ''}
    >
      <div className="flex items-center gap-3">
        <Avatar name={pet.name} photoUrl={pet.photoUrl} size="md" />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 truncate">{pet.name}</p>
          <p className="text-xs text-stone-500 truncate">
            {pet.breed ?? 'Raza desconocida'} · {calcAge(pet.birthDate)}
          </p>
        </div>

        <Badge
          label={speciesLabel[pet.species] ?? 'Otro'}
          status={speciesStatus[pet.species] ?? 'neutral'}
        />
      </div>
    </Card>
  )
}
```

## File: src/components/PetChipEditOverlay.tsx
```typescript
import { useState, useEffect } from 'react'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import { showToast } from './AppLayout'
import { PfBtn } from './FooterButtons'

type ChipField = 'species' | 'birthDate' | 'weight' | 'caregivers'

interface Props {
  pet:     PetWithAlerts
  field:   ChipField | null
  onClose: () => void
  onSave:  (updated: Partial<PetWithAlerts>) => void
}

const SPECIES_OPTIONS: { value: Species; emoji: string; label: string; color: string }[] = [
  { value:'cat',     emoji:'🐱', label:'Gato',   color:'var(--pal-lilac)'      },
  { value:'dog',     emoji:'🐶', label:'Perro',  color:'var(--pal-sky)'        },
  { value:'bird',    emoji:'🦜', label:'Ave',    color:'var(--pal-candy)'      },
  { value:'rabbit',  emoji:'🐰', label:'Conejo', color:'var(--pal-mauve)'      },
  { value:'reptile', emoji:'🦎', label:'Reptil', color:'var(--success-hl)'     },
  { value:'fish',    emoji:'🐟', label:'Pez',    color:'var(--blue-hl)'        },
  { value:'other',   emoji:'🐾', label:'Otro',   color:'var(--surface-offset)' },
]

const FIELD_META: Record<ChipField, { icon: string; label: string }> = {
  species:    { icon:'🐾', label:'Especie'         },
  birthDate:  { icon:'🎂', label:'Fecha de nacimiento' },
  weight:     { icon:'⚖️', label:'Peso'            },
  caregivers: { icon:'👥', label:'Cuidadores'       },
}

interface MockCaregiver { id:string; initials:string; name:string; role:string; bg:string; color:string; removable:boolean }
const INITIAL_CAREGIVERS: MockCaregiver[] = [
  { id:'tl', initials:'TL', name:'Thamires Lopes', role:'Propietaria',          bg:'var(--pal-lilac)', color:'var(--nav-bg)', removable:false },
  { id:'am', initials:'AM', name:'Ana Martínez',   role:'Cuidadora',            bg:'var(--blue-hl)',  color:'var(--blue)',   removable:true  },
]

export default function PetChipEditOverlay({ pet, field, onClose, onSave }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [species,   setSpecies]   = useState<Species>(pet.species)
  const [birthDate, setBirthDate] = useState(pet.birthDate ?? '')
  const [weight,    setWeight]    = useState('')
  const [caregivers, setCaregivers] = useState<MockCaregiver[]>(INITIAL_CAREGIVERS)
  const [newEmail,  setNewEmail]  = useState('')
  const [emailErr,  setEmailErr]  = useState('')

  useEffect(() => {
    if (field) {
      setSpecies(pet.species)
      setBirthDate(pet.birthDate ?? '')
      setWeight('')
      setEmailErr('')
      setNewEmail('')
    }
  }, [field, pet])

  if (!field) return null

  const meta = FIELD_META[field]

  const handleSave = () => {
    if (field === 'species')   onSave({ species })
    if (field === 'birthDate') onSave({ birthDate: birthDate || undefined })
    if (field === 'weight')    { showToast(`⚖️ Peso actualizado${weight ? ': ' + weight + ' kg' : ''}`); onClose(); return }
    if (field === 'caregivers'){ showToast('👥 Cuidadores actualizados'); onClose(); return }
    showToast('✓ Actualizado')
    onClose()
  }

  const handleAddCaregiver = () => {
    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) { setEmailErr('Introduce un email válido'); return }
    const initials = newEmail.split('@')[0].slice(0,2).toUpperCase()
    setCaregivers(prev => [...prev, { id:Date.now().toString(), initials, name:newEmail, role:'Cuidador', bg:'var(--gold-hl)', color:'var(--gold)', removable:true }])
    setNewEmail(''); setEmailErr('')
    showToast(`✉ Invitación enviada a ${newEmail}`)
  }

  return (
    <div className="chip-edit-overlay" onClick={onClose}>
      <div className="chip-edit-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="chip-edit-header">
          <div className="chip-edit-icon">{meta.icon}</div>
          <div className="chip-edit-title">Editar {meta.label}</div>
          <button style={{ width:30,height:30,borderRadius:'var(--r-md)',background:'rgba(0,0,0,.08)',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-muted)' }} onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="chip-edit-body">

          {/* Species */}
          {field === 'species' && (
            <div className="mf-species-grid">
              {SPECIES_OPTIONS.map(o => (
                <button key={o.value} type="button"
                  className={['mf-species-card', species===o.value?'active':''].join(' ')}
                  style={species===o.value?{background:o.color,borderColor:'var(--primary)'}:{}}
                  onClick={() => setSpecies(o.value)}>
                  <span className="mf-species-emoji">{o.emoji}</span>
                  <span className="mf-species-label">{o.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Birth date */}
          {field === 'birthDate' && (
            <div>
              <label className="form-label" style={{ marginBottom:'.5rem',display:'block' }}>Fecha de nacimiento</label>
              <input type="date" className="form-input"
                value={birthDate}
                max={today}
                onChange={e => setBirthDate(e.target.value)}
                autoFocus
              />
              {birthDate && (
                <div style={{ marginTop:'.625rem', fontSize:'.8125rem', color:'var(--text-muted)' }}>
                  📅 {new Date(birthDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'long',year:'numeric'})}
                </div>
              )}
            </div>
          )}

          {/* Weight */}
          {field === 'weight' && (
            <div>
              <label className="form-label" style={{ marginBottom:'.5rem',display:'block' }}>Peso actual</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input type="number" className="mf-input" step="0.1" min="0"
                  placeholder="Ej: 4.2" value={weight} onChange={e => setWeight(e.target.value)} autoFocus/>
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          )}

          {/* Caregivers */}
          {field === 'caregivers' && (
            <div>
              <div style={{ fontWeight:700,fontSize:'.8125rem',color:'var(--text-muted)',marginBottom:'.625rem' }}>Cuidadores actuales</div>
              <div style={{ display:'flex',flexDirection:'column',gap:'.375rem',marginBottom:'1rem' }}>
                {caregivers.map(c => (
                  <div key={c.id} style={{ display:'flex',alignItems:'center',gap:'.625rem',padding:'.5rem .75rem',background:'var(--surface-offset)',border:'1.5px solid var(--border)',borderRadius:'var(--r-lg)' }}>
                    <div style={{ width:32,height:32,borderRadius:'50%',background:c.bg,color:c.color,fontSize:'.65rem',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{c.initials}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'.8125rem',fontWeight:700,color:'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize:'.7rem',color:'var(--text-muted)' }}>{c.role}</div>
                    </div>
                    {c.removable && (
                      <button style={{ width:26,height:26,borderRadius:'var(--r-md)',background:'var(--err-hl)',color:'var(--err)',border:'1px solid rgba(200,64,106,.25)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.65rem',fontWeight:800 }}
                        onClick={() => setCaregivers(prev => prev.filter(x=>x.id!==c.id))}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontWeight:700,fontSize:'.8125rem',color:'var(--text-muted)',marginBottom:'.5rem' }}>Añadir cuidador</div>
              <div style={{ display:'flex',gap:'.375rem' }}>
                <div className="field-icon-wrap" style={{ flex:1 }}>
                  <span className="field-icon">✉</span>
                  <input className={['form-input',emailErr?'form-input--err':''].join(' ')} type="email"
                    placeholder="Email del cuidador"
                    value={newEmail} onChange={e=>{setNewEmail(e.target.value);setEmailErr('')}}
                    style={{ flex:1 }}/>
                </div>
                <button className="pf-btn pf-btn--add pf-btn--sm" onClick={handleAddCaregiver}>
                  Invitar
                </button>
              </div>
              {emailErr && <div style={{ fontSize:'.75rem',color:'var(--err)',marginTop:'.25rem',fontWeight:700 }}>{emailErr}</div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="chip-edit-footer">
          <PfBtn variant="cancel" size="sm" onClick={onClose}>Cancelar</PfBtn>
          <PfBtn variant="save" size="sm" onClick={handleSave}>Guardar</PfBtn>
        </div>
      </div>
    </div>
  )
}
```

## File: src/components/SkeletonLoader.tsx
```typescript
interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={['rounded-lg bg-stone-200 skeleton-shimmer', className].join(' ')}
      aria-hidden="true"
    />
  )
}

export function SkeletonPetCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-stone-200">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonOverviewCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  )
}
```

## File: src/components/SymptomModals.tsx
```typescript
import { useState, useEffect } from 'react'
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

// ── Lookup maps ────────────────────────────────────────────────────
const CAT_ICON:  Record<string,string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }
const SEV_COLOR: Record<string,string> = { leve:'var(--gold)', moderado:'var(--warn)', grave:'var(--err)', emergencia:'var(--err)' }
const SEV_BG:    Record<string,string> = { leve:'var(--gold-hl)', moderado:'var(--warn-hl)', grave:'var(--err-hl)', emergencia:'var(--err-hl)' }
const SEV_LABEL: Record<string,string> = { leve:'Leve', moderado:'Moderado', grave:'Grave', emergencia:'Emergencia' }
const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }

// ── Constantes do formulário ───────────────────────────────────────
const CATEGORIES = [
  { val:'digestivo',      icon:'🤢', label:'Digestivo'     },
  { val:'respiratorio',   icon:'🫁', label:'Respiratorio'  },
  { val:'piel',           icon:'🩹', label:'Piel'          },
  { val:'comportamiento', icon:'🧠', label:'Comportamiento' },
  { val:'movimiento',     icon:'🦶', label:'Movimiento'    },
  { val:'ocular',         icon:'👁',  label:'Ocular'        },
  { val:'otro',           icon:'❓', label:'Otro'          },
]
const SEVERITIES = [
  { val:'leve',       label:'Leve',       fg:'var(--gold)', bg:'var(--gold-hl)'         },
  { val:'moderado',   label:'Moderado',   fg:'var(--warn)', bg:'var(--warn-hl)'         },
  { val:'grave',      label:'Grave',      fg:'var(--err)',  bg:'var(--err-hl)'           },
  { val:'emergencia', label:'Emergencia', fg:'var(--err)',  bg:'rgba(200,64,106,.25)'   },
]

// ── Detail Overlay ─────────────────────────────────────────────────
interface DetailProps {
  symptom:     SymptomEntry | null
  onClose:     () => void
  onEdit:      (s: SymptomEntry) => void
  onResolve:   (id: string) => void
  onUnresolve: (id: string) => void
}

export function SymptomDetailModal({ symptom, onClose, onEdit, onResolve, onUnresolve }: DetailProps) {
  if (!symptom) return null
  const sev = symptom.severity
  const cat = symptom.category

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div className="detail-icon"
            style={{ background:SEV_BG[sev] || 'var(--err-hl)', color:SEV_COLOR[sev] || 'var(--err)', fontSize:'1.375rem' }}>
            {CAT_ICON[cat] || '🌡️'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', lineHeight:1.2 }}>
              {symptom.description.length > 50 ? symptom.description.slice(0,50) + '…' : symptom.description}
            </div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.2rem' }}>
              {PET_EMOJI[symptom.petId]} {PET_NAME[symptom.petId]} · {symptom.category}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="detail-body">
          <div style={{ display:'flex', gap:'.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
            <span className={`status-pill ${symptom.resolved ? 'resolved' : 'active'}`}>
              {symptom.resolved ? '✓ Resuelto' : '● Activo'}
            </span>
            <span style={{ background:SEV_BG[sev], color:SEV_COLOR[sev], border:`1.5px solid ${SEV_COLOR[sev]}`, borderRadius:'var(--r-full)', padding:'.25rem .75rem', fontSize:'.75rem', fontWeight:800 }}>
              {SEV_LABEL[sev] || sev}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Categoría</div>
              <div className="detail-info-value">{CAT_ICON[cat]} {cat}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Fecha</div>
              <div className="detail-info-value">
                {new Date(symptom.date+'T00:00:00').toLocaleDateString('es-ES',{ day:'2-digit', month:'short', year:'numeric' })}
              </div>
            </div>
          </div>

          <div style={{ background:'var(--surface-offset)', border:'1.5px solid var(--border)', borderRadius:'var(--r-lg)', padding:'.875rem 1rem', marginBottom:symptom.notes?'1rem':0 }}>
            <div style={{ fontSize:'.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--text-faint)', marginBottom:'.375rem' }}>Descripción</div>
            <div style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6 }}>{symptom.description}</div>
          </div>

          {symptom.notes && (
            <div style={{ background:'var(--surface-offset)', border:'1.5px solid var(--border)', borderRadius:'var(--r-lg)', padding:'.875rem 1rem', marginTop:'.625rem' }}>
              <div style={{ fontSize:'.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--text-faint)', marginBottom:'.375rem' }}>Notas</div>
              <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5 }}>{symptom.notes}</div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          <button className="btn btn-secondary" onClick={() => { onEdit(symptom); onClose() }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
            Editar
          </button>
          {symptom.resolved ? (
            <button className="btn btn-warn" onClick={() => { onUnresolve(symptom.id); onClose() }}>↩ Reabrir</button>
          ) : (
            <button className="btn btn-success" onClick={() => { onResolve(symptom.id); onClose() }}>✓ Marcar resuelto</button>
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
  const today = new Date().toISOString().split('T')[0]
  const [description,   setDescription]   = useState('')
  const [category,      setCategory]      = useState('digestivo')
  const [severity,      setSeverity]      = useState('leve')
  const [date,          setDate]          = useState(today)
  const [notes,         setNotes]         = useState('')
  const [descErr,       setDescErr]       = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (symptom && isOpen) {
      setDescription(symptom.description)
      setCategory(symptom.category)
      setSeverity(symptom.severity)
      setDate(symptom.date)
      setNotes(symptom.notes)
      setDescErr('')
      setConfirmDelete(false)
    }
  }, [symptom, isOpen])

  if (!symptom) return null

  const selSev = SEVERITIES.find(s => s.val === severity)!

  const handleSave = () => {
    if (!description.trim()) { setDescErr('La descripción es obligatoria'); return }
    onSave({ ...symptom, description:description.trim(), category, severity, date, notes })
    showToast('🌡️ Síntoma actualizado')
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete?.(symptom.id)
    showToast('🗑 Síntoma eliminado')
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
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', gap:'.5rem' }}>
          <PfBtn variant="danger" onClick={handleDelete}>
            {confirmDelete ? '¿Confirmar?' : '🗑 Eliminar'}
          </PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            Guardar cambios
          </PfBtn>
        </div>
      }
    >
      {/* Hero com título dinâmico e botão close */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selSev.bg},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background:selSev.fg, fontSize:'1.5rem' }}>
          {CAT_ICON[category]}
        </div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">Editar síntoma</div>
          <div className="modal-hero-sub">{PET_EMOJI[symptom.petId]} {PET_NAME[symptom.petId]}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Aviso de confirmação de eliminação */}
      {confirmDelete && (
        <div className="note-delete-confirm">
          <div style={{ fontWeight:800, fontSize:'.875rem', color:'var(--err)', marginBottom:'.35rem' }}>
            ¿Eliminar este síntoma permanentemente?
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', lineHeight:1.5 }}>
            Esta acción no se puede deshacer. Pulsa de nuevo "<strong>¿Confirmar?</strong>" o{' '}
            <button
              style={{ background:'none', border:'none', color:'var(--primary)',
                fontWeight:700, cursor:'pointer', padding:0, fontSize:'inherit' }}
              onClick={() => setConfirmDelete(false)}>
              cancela aquí
            </button>.
          </div>
        </div>
      )}

      {/* Descripción */}
      <div className="modal-section">Descripción</div>
      <div className="form-group">
        <div className={['form-input', descErr?'form-input--err':''].join(' ')} style={{ padding:0 }}>
          <textarea
            style={{ width:'100%', padding:'.55rem .875rem', border:'none', background:'transparent',
              outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical',
              minHeight:72, color:'var(--text)' }}
            value={description}
            onChange={e => { setDescription(e.target.value); setDescErr('') }}
            autoFocus
          />
        </div>
        {descErr && <span className="form-hint-err">{descErr}</span>}
      </div>

      {/* Categoría */}
      <div className="modal-section">Categoría</div>
      <div className="symptom-cat-grid" style={{ marginBottom:'1rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.val} type="button"
            className={['symptom-cat-btn', category===c.val?'active':''].join(' ')}
            onClick={() => setCategory(c.val)}>
            <span style={{ fontSize:'1.2rem' }}>{c.icon}</span>
            <span style={{ fontSize:'.7rem', fontWeight:700 }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Severidad */}
      <div className="modal-section">Severidad</div>
      <div style={{ display:'flex', gap:'.375rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        {SEVERITIES.map(s => (
          <button key={s.val} type="button"
            style={{
              flex:1, padding:'.5rem .625rem', borderRadius:'var(--r-lg)',
              border:`1.5px solid ${severity===s.val ? s.fg : 'var(--border)'}`,
              background:severity===s.val ? s.bg : 'var(--surface-offset)',
              cursor:'pointer', fontWeight:700, fontSize:'.8125rem',
              color:severity===s.val ? s.fg : 'var(--text-muted)',
              fontFamily:'inherit', transition:'all var(--trans)', minWidth:70,
            }}
            onClick={() => setSeverity(s.val)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Fecha */}
      <div className="modal-section">Fecha</div>
      <FormDateField label="Fecha del síntoma" value={date} onChange={setDate} max={today}/>

      {/* Notas */}
      <div className="modal-section">Notas</div>
      <div className="form-group" style={{ marginBottom:0 }}>
        <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
          <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
          <textarea className="form-input" rows={2}
            placeholder="Observaciones adicionales…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize:'vertical', minHeight:56, fontFamily:'inherit', border:'none' }}
          />
        </div>
      </div>
    </Modal>
  )
}
```

## File: src/components/VaccineDetailModal.tsx
```typescript
import { useState } from 'react'
import type { VaccineRecord } from '../hooks/usePets'

interface Props {
  vaccine:  (VaccineRecord & { cls: 'ok' | 'soon' | 'late'; petName: string; petEmoji: string }) | null
  onClose:  () => void
  onEdit:   (v: VaccineRecord) => void
  onMarkApplied: (v: VaccineRecord, appliedDate: string, nextDate: string) => void
}

const STATUS_LABEL: Record<string, string> = { ok: 'Al día', soon: 'Por vencer', late: 'Vencida' }
const STATUS_CLASS: Record<string, string> = { ok: 'ok', soon: 'soon', late: 'late' }

export default function VaccineDetailModal({ vaccine, onClose, onEdit, onMarkApplied }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [markMode,   setMarkMode]   = useState(false)
  const [appliedDate, setAppliedDate] = useState(today)
  const [nextDate,   setNextDate]   = useState('')
  const [nextErr,    setNextErr]    = useState('')

  if (!vaccine) return null
  const { cls } = vaccine

  const handleApply = () => {
    if (!nextDate) { setNextErr('Indica la próxima dosis'); return }
    if (nextDate <= appliedDate) { setNextErr('Debe ser posterior a la aplicación'); return }
    onMarkApplied(vaccine, appliedDate, nextDate)
    onClose()
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="detail-header">
          <div className="detail-icon" style={{
            background: cls === 'ok' ? 'var(--success-hl)' : cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
            color:      cls === 'ok' ? 'var(--success)'    : cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
            fontSize: '1.5rem',
          }}>💉</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{vaccine.name}</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
              {vaccine.petEmoji} {vaccine.petName}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="detail-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1rem' }}>
            <span className={`status-pill ${STATUS_CLASS[cls]}`}>
              {cls === 'ok' ? '✓' : cls === 'soon' ? '⚠' : '✕'} {STATUS_LABEL[cls]}
            </span>
            <span className={`badge ${vaccine.badgeCls}`}>{vaccine.badge}</span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Última aplicación</div>
              <div className="detail-info-value">{vaccine.applied}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Próxima dosis</div>
              <div className="detail-info-value" style={{ color: cls === 'late' ? 'var(--err)' : cls === 'soon' ? 'var(--warn)' : 'var(--success)' }}>
                {new Date(vaccine.nextDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Mark as applied form */}
          {markMode && (
            <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)', borderRadius: 'var(--r-xl)', padding: '1rem', marginTop: '.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--success)', marginBottom: '.75rem' }}>
                ✓ Registrar aplicación
              </div>
              <div className="detail-date-row">
                <label>Aplicada el</label>
                <input type="date" value={appliedDate}
                  onChange={e => setAppliedDate(e.target.value)}
                  max={today}/>
              </div>
              <div className="detail-date-row">
                <label>Próxima dosis</label>
                <input type="date" value={nextDate}
                  onChange={e => { setNextDate(e.target.value); setNextErr('') }}
                  min={appliedDate}
                  style={{ borderColor: nextErr ? 'var(--err)' : undefined }}/>
              </div>
              {nextErr && <div style={{ fontSize: '.75rem', color: 'var(--err)', fontWeight: 700, marginTop: '.25rem' }}>{nextErr}</div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="detail-footer">
          {!markMode ? (
            <>
              <button className="btn btn-secondary" onClick={() => { onEdit(vaccine); onClose() }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
                Editar
              </button>
              <button className="btn btn-success" onClick={() => setMarkMode(true)}>
                💉 Marcar aplicada
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-success" onClick={handleApply}>✓ Confirmar aplicación</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

## File: src/components/VaccRing.tsx
```typescript
interface VaccRingProps {
  coverage: number  
  size?: number      
  strokeWidth?: number
}

export default function VaccRing({ coverage, size = 64, strokeWidth = 6 }: VaccRingProps) {
  const r   = (size - strokeWidth) / 2
  const c   = 2 * Math.PI * r
  const color = coverage >= 80 ? 'var(--success)' : coverage >= 50 ? 'var(--warn)' : 'var(--err)'
  const label = coverage >= 80 ? '💉' : coverage >= 50 ? '⚠' : '✕'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.2rem', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--surface-offset)" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - coverage / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)' }}
        />
        {/* Texto central */}
        <text
          x={size / 2} y={size / 2 + 4}
          textAnchor="middle"
          fontFamily="Nunito, sans-serif"
          fontWeight="800"
          fontSize={size * 0.22}
          fill="var(--text)"
        >
          {coverage}%
        </text>
      </svg>
      <span style={{ fontSize: '.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
        {label} Vacunas
      </span>
    </div>
  )
}
```

## File: src/context/PitutiContext.tsx
```typescript
import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { PetWithAlerts } from '../hooks/usePets'
import { MOCK_PETS } from '../hooks/usePets'

// ── Tipos ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark'

export interface CareEntry {
  id: string        // ex: "pet-1_food"
  petId: string
  emoji: string
  label: string
  total: number
  done: number
}

export interface PitutiState {
  // Mascotas
  pets: PetWithAlerts[]
  petsLoading: boolean
  // Tema
  theme: Theme
  // Alertas globais
  toastMessage: string
  toastType: 'success' | 'err'
  toastVisible: boolean
  // Cuidados do dia
  cares: CareEntry[]
}

// ── Acciones ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_PETS'; payload: PetWithAlerts[] }
  | { type: 'SET_PETS_LOADING'; payload: boolean }
  | { type: 'ADD_PET'; payload: PetWithAlerts }
  | { type: 'REMOVE_PET'; payload: string }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SHOW_TOAST'; payload: { message: string; kind: 'success' | 'err' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_CARE_DONE'; payload: { id: string; done: number } }
  | { type: 'SET_CARES'; payload: CareEntry[] }

// ── Estado inicial ────────────────────────────────────────────────────────────

const DEFAULT_CARES: CareEntry[] = [
  { id: 'pet-1_food',   petId: 'pet-1', emoji: '🍽️', label: 'Luna · comida',    total: 2, done: 0 },
  { id: 'pet-2_water',  petId: 'pet-2', emoji: '💧', label: 'Toby · agua',      total: 3, done: 2 },
  { id: 'pet-2_walk',   petId: 'pet-2', emoji: '🏃', label: 'Toby · paseo',     total: 2, done: 0 },
  { id: 'pet-3_water',  petId: 'pet-3', emoji: '💧', label: 'Kiwi · agua',      total: 2, done: 2 },
  { id: 'pet-1_brush',  petId: 'pet-1', emoji: '✂️', label: 'Luna · cepillado', total: 1, done: 0 },
  { id: 'pet-1_water',  petId: 'pet-1', emoji: '💧', label: 'Luna · agua',      total: 2, done: 1 },
]

const initialState: PitutiState = {
  pets: [],
  petsLoading: true,
  theme: (localStorage.getItem('pituti-theme') as Theme) ?? 'light',
  toastMessage: '',
  toastType: 'success',
  toastVisible: false,
  cares: DEFAULT_CARES,
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: PitutiState, action: Action): PitutiState {
  switch (action.type) {
    case 'SET_PETS':
      return { ...state, pets: action.payload }
    case 'SET_PETS_LOADING':
      return { ...state, petsLoading: action.payload }
    case 'ADD_PET':
      return { ...state, pets: [action.payload, ...state.pets] }
    case 'REMOVE_PET':
      return { ...state, pets: state.pets.filter(p => p.id !== action.payload) }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload.message, toastType: action.payload.kind, toastVisible: true }
    case 'HIDE_TOAST':
      return { ...state, toastVisible: false }
    case 'SET_CARE_DONE':
      return {
        ...state,
        cares: state.cares.map(c =>
          c.id === action.payload.id ? { ...c, done: action.payload.done } : c
        ),
      }
    case 'SET_CARES':
      return { ...state, cares: action.payload }
    default:
      return state
  }
}

// ── Contexto ──────────────────────────────────────────────────────────────────

interface PitutiContextValue {
  state: PitutiState
  // Mascotas
  addPet: (pet: PetWithAlerts) => void
  removePet: (id: string) => void
  // Tema
  toggleTheme: () => void
  // Toast
  showToast: (message: string, kind?: 'success' | 'err') => void
  hideToast: () => void
  // Cuidados
  setCaredone: (id: string, done: number) => void
}

const PitutiContext = createContext<PitutiContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function PitutiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Carregar pets ao montar
  useEffect(() => {
    dispatch({ type: 'SET_PETS_LOADING', payload: true })
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_PETS', payload: MOCK_PETS })
      dispatch({ type: 'SET_PETS_LOADING', payload: false })
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // Sincronizar tema com DOM e localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('pituti-theme', state.theme)
  }, [state.theme])

  // Auto-ocultar toast após 3.2 s
  useEffect(() => {
    if (!state.toastVisible) return
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3200)
    return () => clearTimeout(t)
  }, [state.toastVisible, state.toastMessage])

  const addPet    = useCallback((pet: PetWithAlerts) => dispatch({ type: 'ADD_PET', payload: pet }), [])
  const removePet = useCallback((id: string) => dispatch({ type: 'REMOVE_PET', payload: id }), [])

  const toggleTheme = useCallback(() =>
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' }), [state.theme])

  const showToast = useCallback((message: string, kind: 'success' | 'err' = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, kind } })
  }, [])

  const setCaredone = useCallback((id: string, done: number) =>
    dispatch({ type: 'SET_CARE_DONE', payload: { id, done } }), [])

  const hideToast = useCallback(() => dispatch({ type: 'HIDE_TOAST' }), [])

  return (
    <PitutiContext.Provider value={{ state, addPet, removePet, toggleTheme, showToast, hideToast, setCaredone }}>
      {children}
    </PitutiContext.Provider>
  )
}

// ── Hook de consumo ───────────────────────────────────────────────────────────

export function usePituti() {
  const ctx = useContext(PitutiContext)
  if (!ctx) throw new Error('usePituti deve ser usado dentro de <PitutiProvider>')
  return ctx
}

// Atalhos convenientes
export const usePets       = () => { const { state } = usePituti(); return { pets: state.pets, loading: state.petsLoading } }
export const useTheme      = () => { const { state, toggleTheme } = usePituti(); return { theme: state.theme, toggleTheme } }
export const useCares      = () => { const { state, setCaredone } = usePituti(); return { cares: state.cares, setCaredone } }
export const useAppToast   = () => { const { showToast } = usePituti(); return showToast }
```

## File: src/context/SymptomsContext.tsx
```typescript
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

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

interface SymptomsContextValue {
  symptoms:    SymptomEntry[]
  addSymptom:  (s: Omit<SymptomEntry, 'id'>) => void
  saveSymptom: (s: SymptomEntry) => void
  resolve:     (id: string) => void
  unresolve:   (id: string) => void
}

const SymptomsContext = createContext<SymptomsContextValue | null>(null)

const INITIAL: SymptomEntry[] = [
  { id:'s-1', petId:'pet-2', description:'Tos suave sin fiebre. Parece cansado desde hace 3 días.', category:'respiratorio', severity:'moderado', date:'2026-04-18', notes:'No tiene fiebre. Come normal.', resolved:false },
  { id:'r-1', petId:'pet-1', description:'Inapetencia durante varios días sin causa aparente.',      category:'digestivo',    severity:'leve',     date:'2026-02-10', notes:'Se resolvió sola en 4 días.', resolved:true },
  { id:'r-2', petId:'pet-2', description:'Cojera leve en la pata trasera derecha.',                 category:'movimiento',  severity:'leve',     date:'2026-01-15', notes:'Desapareció tras reposo.',    resolved:true },
]

export function SymptomsProvider({ children }: { children: ReactNode }) {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(INITIAL)

  const addSymptom = useCallback((s: Omit<SymptomEntry,'id'>) => {
    setSymptoms(prev => [...prev, { ...s, id:`s-${Date.now()}` }])
  }, [])

  const saveSymptom = useCallback((updated: SymptomEntry) => {
    setSymptoms(prev => prev.map(s => s.id === updated.id ? updated : s))
  }, [])

  const resolve = useCallback((id: string) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, resolved:true } : s))
  }, [])

  const unresolve = useCallback((id: string) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, resolved:false } : s))
  }, [])

  return (
    <SymptomsContext.Provider value={{ symptoms, addSymptom, saveSymptom, resolve, unresolve }}>
      {children}
    </SymptomsContext.Provider>
  )
}

export function useSymptoms() {
  const ctx = useContext(SymptomsContext)
  if (!ctx) throw new Error('useSymptoms must be used within <SymptomsProvider>')
  return ctx
}

export function usePetSymptoms(petId: string) {
  const { symptoms } = useSymptoms()
  return {
    active:   symptoms.filter(s => s.petId === petId && !s.resolved),
    resolved: symptoms.filter(s => s.petId === petId &&  s.resolved),
    all:      symptoms.filter(s => s.petId === petId),
  }
}
```

## File: src/pages/CalendarPage.tsx
```typescript
import { useState, useMemo, useEffect, useRef } from 'react'
import { useCares } from '../context/CaresContext'
import { MOCK_PETS, VACCINES_BY_PET, SPECIES_EMOJI } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { useVet } from '../context/VetContext'
import type { CareEditData } from '../components/EditCareModal'
import EditCareModal from '../components/EditCareModal'

const L = {
  pageTitle:    'Calendario',
  pageSubtitle: 'Vista mensual de cuidados, vacunas y veterinaria',

  alertsTitle:    'Vacunas vencidas',
  alertsWarn:     '⚠ Consulta con el veterinario lo antes posible',
  vacExpiredTag:  'VENCIDA',
  vacExpiredSince:'Venció:',

  today:        'Hoy',
  filterLabel:  'Filtrar calendario',
  clearFilters: 'Limpiar filtros',

  filterGroupCares:    'Cuidados',
  filterGroupVaccines: 'Vacunas',
  filterGroupVet:      'Veterinaria',

  filterPending:     'Pendiente',
  filterDone:        'Realizado',
  filterVaccDue:     'Próxima vacuna',
  filterVaccExpired: 'Vacuna vencida',
  filterVetVisit:    'Consulta veterinaria',
  filterVetReturn:   'Retorno programado',

  dayEmpty:    'Sin eventos este día',
  dayCares:    'Cuidados del día',
  dayVaccines: 'Vacunas',
  dayVetVisits:'Consultas / Citas',
  editCare:    'Editar cuidado',

  carePending: 'Pendiente',
  careDone:    'Realizado',
  careSkipped: 'Omitido',

  vaccineApply:   'Aplicar ahora',
  vaccineApplied: 'Aplicada',

  vetVisitKind:  'Consulta',
  vetReturnKind: 'Retorno programado',

  eventsCount: (n: number) => `${n} evento${n !== 1 ? 's' : ''}`,
  monthPrev:   'Mes anterior',
  monthNext:   'Mes siguiente',

  weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
} as const

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface FilterChip { key: string; label: string; color: string; bg: string; emoji: string }

const FILTER_GROUPS: { id: string; label: string; filters: FilterChip[] }[] = [
  {
    id: 'cares', label: L.filterGroupCares,
    filters: [
      { key: 'pending', label: L.filterPending, color: 'var(--warn)',    bg: 'var(--warn-hl)',    emoji: '⏳' },
      { key: 'done',    label: L.filterDone,    color: 'var(--success)', bg: 'var(--success-hl)', emoji: '✅' },
    ],
  },
  {
    id: 'vaccines', label: L.filterGroupVaccines,
    filters: [
      { key: 'vacc_due',     label: L.filterVaccDue,     color: 'var(--blue)', bg: 'var(--blue-hl)', emoji: '💉' },
      { key: 'vacc_expired', label: L.filterVaccExpired, color: 'var(--err)',  bg: 'var(--err-hl)',  emoji: '🚨' },
    ],
  },
  {
    id: 'vet', label: L.filterGroupVet,
    filters: [
      { key: 'vet_visit',  label: L.filterVetVisit,  color: 'var(--primary)', bg: 'var(--primary-hl)', emoji: '🩺' },
      { key: 'vet_return', label: L.filterVetReturn, color: 'var(--blue)',    bg: 'var(--blue-hl)',    emoji: '📅' },
    ],
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000)

const intervalToDays = (period: string, total: number) => {
  if (period === 'month') return Math.round(30 / total)
  if (period === 'week')  return Math.round(7  / total)
  return Math.max(1, Math.round(1 / total))
}

// ─── STATUS HELPER ────────────────────────────────────────────────────────────
// CareItem.doneByDate: Record<string, { done: number; doneState: boolean }>

type DoneByDate = Record<string, { done: number; doneState: boolean }>
type CareStatus = 'done' | 'skip' | 'pending'

function getCareStatus(doneByDate: DoneByDate | undefined, day: string): CareStatus {
  const rec = doneByDate?.[day]
  if (!rec)          return 'pending'
  if (rec.doneState) return 'done'
  return 'skip'
}

// ─── LOCAL VACCINE TYPE ───────────────────────────────────────────────────────

interface VaccEntry { vaccKey: string; expired: boolean }

// Vaccine enriched with pet metadata (built locally — no VaccinesContext exists)
interface VaccWithMeta extends VaccineRecord { petId: string; petName: string; petEmoji: string }


// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today    = new Date()
  const todayStr = toDateStr(today)

  // ── Context ───────────────────────────────────────────────────────────────
  const { items: careItems, setCareProgress, updateCare, deleteCare } = useCares()
  // ── Local extra vaccines (registered on this page) ────────────────────
  const [extraVacc, setExtraVacc] = useState<Record<string, VaccineRecord[]>>({})

  const allVaccines = useMemo((): VaccWithMeta[] =>
    MOCK_PETS.flatMap(p =>
      [...(VACCINES_BY_PET[p.id] ?? []), ...(extraVacc[p.id] ?? [])].map(v => ({
        ...v,
        petId:    p.id,
        petName:  p.name,
        petEmoji: SPECIES_EMOJI[p.species ?? ''] ?? '🐾',
      }))
    ), [extraVacc])

  // Helper: mark a vaccine as applied (updates extraVacc so calendar reacts)
  const handleVaccineApplied = (vaccKey: string, appliedDate: string) => {
    const [petId, ...nameParts] = vaccKey.split('::')
    const name = nameParts.join('::')
    const existing = allVaccines.find(v => v.petId === petId && v.name === name)
    if (!existing) return
    const lbl = new Date(appliedDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    setExtraVacc(prev => ({
      ...prev,
      [petId]: [
        ...(prev[petId] ?? []).filter(v => v.name !== name),
        { ...existing, applied: lbl, nextDate: appliedDate, badge: 'APLICADA', badgeCls: 'badge-green' },
      ],
    }))
  }
  const { vetCalendarDates } = useVet()

  // ── Local vet-event element type (inferred from context, no import needed) ─
  type VetEv = (typeof vetCalendarDates)[number]

  // ── State ─────────────────────────────────────────────────────────────────
  const [viewMonth,     setViewMonth]     = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay,   setSelectedDay]   = useState(todayStr)
  const [jumpMonth,     setJumpMonth]     = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
  )
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [editCareItem,  setEditCareItem]  = useState<CareEditData | null>(null)
  const [editCareOpen,  setEditCareOpen]  = useState(false)
  const [careExpandIdx, setCareExpandIdx] = useState<number | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth < 768) detailRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedDay])

  // ── Care event dates ──────────────────────────────────────────────────────

  const careEventDates = useMemo(() => {
    const result: Record<string, { careId: string; seq: number }[]> = {}
    const monthStart = viewMonth
    const monthEnd   = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0)

    for (const care of careItems) {
      const daysInterval = care.intervalDays > 0
        ? care.intervalDays
        : intervalToDays(care.period ?? 'day', care.total)

      let cursor = addDays(monthStart, -90)
      let seq    = 0

      while (cursor <= addDays(monthEnd, 30)) {
        const d = toDateStr(cursor)
        if (d >= toDateStr(monthStart) && d <= toDateStr(monthEnd)) {
          if (!result[d]) result[d] = []
          result[d].push({ careId: care.id, seq })
        }
        cursor = addDays(cursor, daysInterval)
        seq++
      }
    }
    return result
  }, [careItems, viewMonth])

  // ── Vaccine event dates ───────────────────────────────────────────────────
  // Tipagem explícita de VaccEntry para que os callbacks .some(v => v.expired)
  // não recebam 'v' implicitamente como any.

  const vaccineEventDates = useMemo((): Record<string, VaccEntry[]> => {
    const map: Record<string, VaccEntry[]> = {}
    for (const vac of allVaccines) {
      if (!vac.nextDate) continue
      if (!map[vac.nextDate]) map[vac.nextDate] = []
      map[vac.nextDate].push({ vaccKey: `${vac.petId}::${vac.name}`, expired: vac.nextDate < todayStr })
    }
    return map
  }, [allVaccines, todayStr])

  // ── Vet event dates ───────────────────────────────────────────────────────
  // Usa (typeof vetCalendarDates)[number] como elemento para que os callbacks
  // .some(v => v.kind === ...) não recebam 'v' implicitamente como any.

  const vetEventDates = useMemo((): Record<string, VetEv[]> => {
    const map: Record<string, VetEv[]> = {}
    for (const ev of vetCalendarDates) {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    }
    return map
  }, [vetCalendarDates])

  // ── Month counts ──────────────────────────────────────────────────────────

  const monthCounts = useMemo(() => {
    const counts = { pending: 0, done: 0, vacc_due: 0, vacc_expired: 0, vet_visit: 0, vet_return: 0 }
    const year  = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const days  = new Date(year, month + 1, 0).getDate()

    for (let d = 1; d <= days; d++) {
      const key   = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const cares = careEventDates[key] ?? []

      for (const { careId } of cares) {
        const care = careItems.find(c => c.id === careId)
        if (!care) continue
        getCareStatus(care.doneByDate, key) === 'done' ? counts.done++ : counts.pending++
      }

      const vaccDay: VaccEntry[] = vaccineEventDates[key] ?? []
      for (const entry of vaccDay) {
        entry.expired ? counts.vacc_expired++ : counts.vacc_due++
      }

      const vetDay: VetEv[] = vetEventDates[key] ?? []
      for (const ev of vetDay) {
        ev.kind === 'past' ? counts.vet_visit++ : counts.vet_return++
      }
    }
    return counts
  }, [careEventDates, careItems, vaccineEventDates, vetEventDates, viewMonth])

  // ── Filters ───────────────────────────────────────────────────────────────

  const toggleFilter  = (key: string) =>
    setActiveFilters(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  const clearFilters  = () => setActiveFilters(new Set())

  const dayPassesFilter = (day: string): boolean => {
    if (!activeFilters.size) return true

    const cares = careEventDates[day] ?? []

    if (activeFilters.has('pending') &&
      cares.some(({ careId }) => {
        const c = careItems.find(x => x.id === careId)
        return c && getCareStatus(c.doneByDate, day) === 'pending'
      })) return true

    if (activeFilters.has('done') &&
      cares.some(({ careId }) => {
        const c = careItems.find(x => x.id === careId)
        return c && getCareStatus(c.doneByDate, day) === 'done'
      })) return true

    const vaccDay: VaccEntry[] = vaccineEventDates[day] ?? []
    if (activeFilters.has('vacc_due')     && vaccDay.some((entry: VaccEntry) => !entry.expired)) return true
    if (activeFilters.has('vacc_expired') && vaccDay.some((entry: VaccEntry) =>  entry.expired)) return true

    const vetDay: VetEv[] = vetEventDates[day] ?? []
    if (activeFilters.has('vet_visit')  && vetDay.some((ev: VetEv) => ev.kind === 'past')) return true
    if (activeFilters.has('vet_return') && vetDay.some((ev: VetEv) => ev.kind === 'next')) return true

    return false
  }

  // ── Calendar grid ─────────────────────────────────────────────────────────

  const year         = viewMonth.getFullYear()
  const month        = viewMonth.getMonth()
  const totalDays    = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const calendarCells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  const handleJumpChange = (val: string) => {
    setJumpMonth(val)
    const [y, m] = val.split('-').map(Number)
    if (y && m) setViewMonth(new Date(y, m - 1, 1))
  }

  // ── Day dots ──────────────────────────────────────────────────────────────

  const getDayDots = (day: string) => {
    const dots: { color: string; key: string }[] = []
    const cares = careEventDates[day] ?? []

    const hasPending = cares.some(({ careId }) => {
      const c = careItems.find(x => x.id === careId)
      return c && getCareStatus(c.doneByDate, day) === 'pending'
    })
    const hasDone = cares.some(({ careId }) => {
      const c = careItems.find(x => x.id === careId)
      return c && getCareStatus(c.doneByDate, day) === 'done'
    })
    if (hasPending) dots.push({ color: 'var(--warn)',    key: 'pending' })
    if (hasDone)    dots.push({ color: 'var(--success)', key: 'done'    })

    const vaccDay: VaccEntry[] = vaccineEventDates[day] ?? []
    for (const entry of vaccDay) {
      dots.push({ color: entry.expired ? 'var(--err)' : 'var(--blue)', key: `vacc-${entry.expired}` })
    }

    const vetDay: VetEv[] = vetEventDates[day] ?? []
    for (const ev of vetDay) {
      dots.push({ color: ev.kind === 'past' ? 'var(--primary)' : 'var(--blue)', key: `vet-${ev.kind}-${ev.petId}` })
    }
    return dots
  }

  // ── Selected day data ─────────────────────────────────────────────────────

  const selectedDayCares:    { careId: string; seq: number }[]  = careEventDates[selectedDay]    ?? []
  const selectedDayVaccines: VaccEntry[]                        = vaccineEventDates[selectedDay] ?? []
  const selectedDayVet:      VetEv[]                            = vetEventDates[selectedDay]     ?? []

  // ── Expired vaccines banner ───────────────────────────────────────────────

  const expiredVaccines = allVaccines.filter(v => v.nextDate && v.nextDate < todayStr)

  // ── Edit care ─────────────────────────────────────────────────────────────

  const openEditCare = (careId: string) => {
    const care = careItems.find(c => c.id === careId)
    if (!care) return
    setEditCareItem({
      id:           care.id,
      emoji:        care.emoji,
      title:        care.title,
      total:        care.total,
      period:       care.period,
      intervalDays: care.intervalDays,
      quantity:     care.quantity ?? '',
      notify:       care.notify,
      time:         care.time,
      recurring:    care.recurring,
      bg:           care.bg,
    })
    setEditCareOpen(true)
  }

  const handleSaveEdit = (updated: CareEditData) => {
    updateCare(updated)
    setEditCareOpen(false)
    setCareExpandIdx(null)
  }

  const handleDeleteCare = (id: string) => {
    deleteCare(id)
    setEditCareOpen(false)
    setCareExpandIdx(null)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="page-container">

      {/* ── Expired vaccines alert banner ─────────────────────────────── */}
      {expiredVaccines.length > 0 && (
        <div className="alert-banner alert-banner--err">
          <div className="alert-banner__title">🚨 {L.alertsTitle}</div>
          <div className="alert-banner__list">
            {expiredVaccines.map(vac => (
              <div key={`${vac.petId}::${vac.name}`} className="alert-banner__item">
                <span>{vac.petEmoji} {vac.petName}</span>
                <span className="alert-banner__name">{vac.name}</span>
                <span className="badge badge--err">{L.vacExpiredTag}</span>
                {vac.nextDate && (
                  <span className="alert-banner__date">{L.vacExpiredSince} {vac.nextDate}</span>
                )}
              </div>
            ))}
          </div>
          <div className="alert-banner__warn">{L.alertsWarn}</div>
        </div>
      )}

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="cal-toolbar">
        <input
          type="month"
          className="form-input cal-jump"
          value={jumpMonth}
          onChange={e => handleJumpChange(e.target.value)}
        />
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))
            setSelectedDay(todayStr)
          }}
        >
          {L.today}
        </button>

        <div className="cal-filters">
          <span className="cal-filters__label">{L.filterLabel}</span>
          {activeFilters.size > 0 && (
            <button className="btn btn-ghost btn-xs" onClick={clearFilters}>{L.clearFilters}</button>
          )}
          {FILTER_GROUPS.map(group => (
            <div key={group.id} className="cal-filter-group">
              <span className="cal-filter-group__label">{group.label}</span>
              {group.filters.map(f => {
                const isOn  = activeFilters.has(f.key)
                const count = monthCounts[f.key as keyof typeof monthCounts]
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleFilter(f.key)}
                    title={isOn ? `Desactivar "${f.label}"` : `Filtrar por "${f.label}"`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '.3rem',
                      padding: '.3rem .6rem', borderRadius: 'var(--r-full)',
                      border:     `1.5px solid ${isOn ? f.color : 'var(--border)'}`,
                      background: isOn ? f.bg    : 'var(--surface)',
                      color:      isOn ? f.color : 'var(--text-muted)',
                      fontWeight: isOn ? 800     : 600, fontSize: '.75rem',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {f.emoji} {f.label}
                    {count > 0 && (
                      <span style={{
                        background: isOn ? f.color : 'var(--text-faint)',
                        color: 'var(--text-inverse)',
                        borderRadius: 'var(--r-full)', padding: '0 .35rem',
                        fontSize: '.7rem', fontWeight: 800,
                      }}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Calendar + Day detail ──────────────────────────────────────── */}
      <div className="cal-layout">

        {/* Month grid */}
        <div className="cal-grid-wrap">
          <div className="cal-month-header">
            <button className="btn btn-ghost btn-icon" onClick={prevMonth} aria-label={L.monthPrev}>‹</button>
            <span className="cal-month-label">{L.months[month]} {year}</span>
            <button className="btn btn-ghost btn-icon" onClick={nextMonth} aria-label={L.monthNext}>›</button>
          </div>

          <div className="cal-grid cal-grid--header">
            {L.weekdays.map(wd => <div key={wd} className="cal-cell cal-cell--wd">{wd}</div>)}
          </div>

          <div className="cal-grid">
            {calendarCells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} className="cal-cell cal-cell--empty" />
              const key        = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isToday    = key === todayStr
              const isSelected = key === selectedDay
              const passes     = dayPassesFilter(key)
              const dots       = getDayDots(key)

              return (
                <button
                  key={key}
                  className={['cal-cell', isToday ? 'cal-cell--today' : '', isSelected ? 'cal-cell--selected' : '', !passes ? 'cal-cell--dimmed' : ''].join(' ')}
                  onClick={() => setSelectedDay(key)}
                  aria-label={`${day} ${L.months[month]} ${year}`}
                  aria-pressed={isSelected}
                >
                  {day}
                  {dots.length > 0 && (
                    <span className="cal-dots">
                      {dots.slice(0, 4).map((dot, di) => (
                        <span key={`${dot.key}-${di}`} className="cal-dot" style={{ background: dot.color }} />
                      ))}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div ref={detailRef} className="cal-detail">
          <div className="cal-detail__date">
            {(() => {
              const [y, m, d] = selectedDay.split('-').map(Number)
              return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
                weekday: 'long', day: 'numeric', month: 'long',
              })
            })()}
          </div>

          {selectedDayCares.length === 0 && selectedDayVaccines.length === 0 && selectedDayVet.length === 0 ? (
            <div className="cal-detail__empty">{L.dayEmpty}</div>
          ) : (
            <>
              {/* ── Cares ─────────────────────────────────────────────── */}
              {selectedDayCares.length > 0 && (
                <section className="cal-detail__section">
                  <h3 className="cal-detail__section-title">{L.dayCares}</h3>
                  {selectedDayCares.map(({ careId }, listIdx) => {
                    const care = careItems.find(c => c.id === careId)
                    if (!care) return null
                    const status   = getCareStatus(care.doneByDate, selectedDay)
                    const isDone   = status === 'done'
                    const isSkip   = status === 'skip'
                    const expanded = careExpandIdx === listIdx

                    return (
                      <div key={`${careId}-${listIdx}`} className="care-row">
                        <button
                          className="care-row__header"
                          onClick={() => setCareExpandIdx(expanded ? null : listIdx)}
                        >
                          <span className="care-row__emoji">{care.emoji}</span>
                          <span className="care-row__info">
                            <span className="care-row__title">{care.title}</span>
                            {care.sub && <span className="care-row__sub">{care.sub}</span>}
                          </span>
                          {isDone  && <span className="badge badge--success">✓ {L.careDone}</span>}
                          {isSkip  && <span className="badge badge--muted">{L.careSkipped}</span>}
                          {!isDone && !isSkip && <span className="badge badge--warn">{L.carePending}</span>}
                        </button>

                        {expanded && (
                          <div className="care-row__actions">
                            {!isDone && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => setCareProgress(careId, selectedDay, care.total, true)}
                              >
                                ✓ {L.careDone}
                              </button>
                            )}
                            {isDone && (
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => setCareProgress(careId, selectedDay, 0, false)}
                              >
                                ↺ {L.carePending}
                              </button>
                            )}
                            {!isSkip && !isDone && (
                              <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => setCareProgress(careId, selectedDay, 0, false)}
                              >
                                {L.careSkipped}
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => openEditCare(careId)}
                            >
                              ✏️ {L.editCare}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </section>
              )}

              {/* ── Vaccines ──────────────────────────────────────────── */}
              {selectedDayVaccines.length > 0 && (
                <section className="cal-detail__section">
                  <h3 className="cal-detail__section-title">{L.dayVaccines}</h3>
                  {selectedDayVaccines.map((entry: VaccEntry) => {
                    const vacc = allVaccines.find(v => `${v.petId}::${v.name}` === entry.vaccKey)
                    if (!vacc) return null
                    return (
                      <div key={entry.vaccKey} className="vacc-row">
                        <span className="vacc-row__icon">💉</span>
                        <span className="vacc-row__info">
                          <span className="vacc-row__name">{vacc.name}</span>
                          <span className="vacc-row__pet">{vacc.petEmoji} {vacc.petName}</span>
                        </span>
                        {entry.expired ? (
                          <span className="badge badge--err">🚨 {L.vacExpiredTag}</span>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleVaccineApplied(entry.vaccKey, selectedDay)}
                          >
                            💉 {L.vaccineApply}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </section>
              )}

              {/* ── Vet events ────────────────────────────────────────── */}
              {selectedDayVet.length > 0 && (
                <section className="cal-detail__section">
                  <h3 className="cal-detail__section-title">{L.dayVetVisits}</h3>
                  {selectedDayVet.map((ev: VetEv, idx: number) => (
                    <div key={`${ev.date}-${idx}`} className="vet-row">
                      <span className="vet-row__icon">{ev.kind === 'past' ? '🩺' : '📅'}</span>
                      <span className="vet-row__info">
                        <span className="vet-row__label">{ev.label}</span>
                        <span className="vet-row__kind">
                          {ev.kind === 'past' ? L.vetVisitKind : L.vetReturnKind}
                        </span>
                      </span>
                      <span className="vet-row__badge">{ev.kind === 'past' ? '🩺' : '🔄'}</span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Edit care modal ──────────────────────────────────────────────── */}
      <EditCareModal
        isOpen={editCareOpen}
        onClose={() => { setEditCareOpen(false); setCareExpandIdx(null) }}
        care={editCareItem}
        onSave={handleSaveEdit}
        onDelete={handleDeleteCare}
      />

    </div>
  )
}
```

## File: src/pages/NotFoundPage.tsx
```typescript
import { useNavigate, useLocation } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate   = useNavigate()
  const { pathname } = useLocation()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font)',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', lineHeight: 1 }}>🐾</div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
        404
      </h1>

      <p style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
        Página não encontrada
      </p>

      <p style={{
        fontSize: '.875rem',
        color: 'var(--text-muted)',
        maxWidth: 320,
        margin: 0,
      }}>
        A rota <code style={{
          background: 'var(--surface)',
          padding: '.1rem .4rem',
          borderRadius: 4,
          fontFamily: 'monospace',
          fontSize: '.82rem',
        }}>{pathname}</code> não existe no Pituti.
      </p>

      <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Ir ao Dashboard
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          ← Voltar
        </button>
      </div>
    </div>
  )
}
```

## File: src/utils/.gitkeep
```

```

## File: src/components/AddCareModal.tsx
```typescript
import { useState } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { MOCK_PETS, type PetWithAlerts } from '../hooks/usePets'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface AddCareData {
  petId:            string
  emoji:            string
  title:            string
  total:            number
  recurrenceType:   'daily' | 'everyXDays' | 'everyXHours'
  recurrenceValue:  number
  quantity:         string
  notify:           boolean
  // compat legado / campos opcionais usados pelo PetDetailPage
  period?:          string
  intervalDays?:    number
  time?:            string
  recurring?:       boolean
}

interface Props {
  isOpen:         boolean
  onClose:        () => void
  onAdd:          (data: AddCareData) => void
  defaultPetId?:  string
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

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🐦', rabbit:'🐰', reptile:'🦎', fish:'🐠', other:'🐾',
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

// ── Componente ────────────────────────────────────────────────────────────────

export default function AddCareModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const [petId,    setPetId   ] = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [emoji,    setEmoji   ] = useState('')
  const [title,    setTitle   ] = useState('')
  const [total,    setTotal   ] = useState(1)
  const [recType,  setRecType ] = useState<'daily' | 'everyXDays' | 'everyXHours'>('daily')
  const [recValue, setRecValue] = useState(1)
  const [quantity, setQuantity] = useState('')
  const [notify,   setNotify  ] = useState(true)
  const [titleErr, setTitleErr] = useState('')
  const [success,  setSuccess ] = useState(false)

  const reset = () => {
    setTitle(''); setQuantity(''); setTitleErr('')
    setEmoji(''); setTotal(1)
    setRecType('daily'); setRecValue(1)
    setNotify(true)
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!title.trim()) { setTitleErr('El nombre del cuidado es obligatorio'); return }
    const rv = Math.max(1, Number(recValue) || 1)
    const intervalDays =
      recType === 'daily'       ? 1 :
      recType === 'everyXDays'  ? rv :
      rv / 24

    setSuccess(true)
    setTimeout(() => {
      onAdd({
        petId,
        emoji,
        title: title.trim(),
        total: Math.max(1, Number(total) || 1),
        recurrenceType:  recType,
        recurrenceValue: rv,
        quantity,
        notify,
        period:      recType === 'daily' ? 'day' : 'custom',
        intervalDays,
      })
      showToast(`${emoji} Cuidado "${title.trim()}" añadido`)
      reset()
      setSuccess(false)
      onClose()
    }, 1100)
  }

  const selectedPet = MOCK_PETS.find((p: PetWithAlerts) => p.id === petId)

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
      onClose={handleClose}
      title=""
      icon="🐾"
      accentBg="var(--success-hl)"
      accentFg="var(--success)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>Añadir cuidado</PfBtn>
        </PfFooter>
      ) : undefined}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--success-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--success)', fontSize:'1.5rem' }}>{emoji}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">Nuevo cuidado</div>
          <div className="modal-hero-sub">
            Rutina para <strong>{selectedPet?.name ?? '—'}</strong>
          </div>
        </div>
        <button className="pm-close" onClick={handleClose} aria-label="Cerrar modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✅</div>
          <div className="modal-success-title">¡Cuidado añadido!</div>
          <div className="modal-success-sub">{emoji} <strong>{title}</strong> ya aparece en la rutina</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">Mascota</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${MOCK_PETS.length},1fr)`, marginBottom:'1rem' }}>
            {MOCK_PETS.map((p: PetWithAlerts) => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId === p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}
              >
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Cuidado — icono + nombre */}
          <div className="modal-section">Cuidado</div>
          <div className="form-group">
            <label className="form-label">Icono</label>
            <div className="emoji-picker-grid">
              {CARE_EMOJIS.map(e => (
                <button key={e} type="button"
                  className={['emoji-pick-btn', emoji === e ? 'active' : ''].join(' ')}
                  onClick={() => setEmoji(e)}
                >{e}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <div className="field-icon-wrap">
              <span className="field-icon" style={{ fontSize:'1rem' }}>{emoji}</span>
              <input
                className={['form-input', titleErr ? 'form-input--err' : ''].join(' ')}
                placeholder="Ej. Alimentación, Paseo, Cepillado"
                value={title}
                onChange={e => { setTitle(e.target.value); setTitleErr('') }}
                autoFocus
              />
            </div>
            {titleErr && <span className="form-hint-err">{titleErr}</span>}
          </div>

          {/* ── Recurrencia — Pills ──────────────────────────────────────── */}
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

          {/* X input — só para everyXDays / everyXHours */}
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
                  marginLeft:'auto', fontSize:'.75rem', color:'var(--success)',
                  background:'var(--success-hl)', padding:'.2rem .5rem',
                  borderRadius:'var(--r-full)', fontWeight:700,
                }}>
                  {recType === 'everyXDays'
                    ? `📅 cada ${recValue} día${recValue !== 1 ? 's' : ''}`
                    : `⏰ cada ${recValue}h`}
                </span>
              </div>
            </div>
          )}

          {/* Veces al día — só quando 'daily' */}
          {recType === 'daily' && (
            <div className="form-group" style={{ marginBottom:'.875rem' }}>
              <label className="form-label">Veces al día</label>
              <input
                className="form-input"
                type="number" min={1} max={10}
                value={total}
                onChange={e => setTotal(Number(e.target.value))}
                style={{ maxWidth:90 }}
              />
            </div>
          )}

          {/* Cantidad / dosis */}
          <div className="form-group" style={{ marginTop:'.25rem' }}>
            <label className="form-label">
              Cantidad o dosis{' '}
              <span style={{ color:'var(--text-faint)', fontWeight:500 }}>opcional</span>
            </label>
            <div className="field-icon-wrap">
              <span className="field-icon">⚖️</span>
              <input
                className="form-input"
                placeholder="Ej. 80g, 200ml, 2 cucharadas"
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
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/AddMedicationModal.tsx
```typescript
import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { showToast } from './AppLayout'
import { MOCK_PETS } from '../hooks/usePets'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Types ───────────────────────────────────────────────
export interface AddMedData {
  petId:     string
  name:      string
  dose:      string
  frequency: string
  startDate: string
  endDate:   string
  notes:     string
}
interface Props { isOpen: boolean; onClose: () => void; onAdd: (d: AddMedData) => void; defaultPetId?: string }

const PET_EMOJI: Record<string, string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const FREQ_OPTIONS = [
  { val: 'Diaria',          label: 'Diaria (1× al día)'        },
  { val: 'Cada 12 horas',   label: 'Cada 12 horas'             },
  { val: 'Cada 8 horas',    label: 'Cada 8 horas'              },
  { val: 'Semanal',         label: 'Semanal (1× a la semana)'  },
  { val: 'Quincenal',       label: 'Quincenal'                 },
  { val: 'Mensual',         label: 'Mensual'                   },
  { val: 'Cada 3 meses',    label: 'Cada 3 meses'              },
  { val: 'Única dosis',     label: 'Única dosis'               },
]

const MED_ICONS = ['💊', '💉', '🩹', '🧪', '🫙', '🌡️', '🩺']

export default function AddMedicationModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [petId,     setPetId]     = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [medIcon,   setMedIcon]   = useState('💊')
  const [name,      setName]      = useState('')
  const [dose,      setDose]      = useState('')
  const [frequency, setFrequency] = useState('Diaria')
  const [startDate, setStartDate] = useState(today)
  const [endDate,   setEndDate]   = useState('')
  const [notes,     setNotes]     = useState('')
  const [errors,    setErrors]    = useState<Record<string,string>>({})
  const [success,   setSuccess]   = useState(false)

  const reset = () => {
    setName(''); setDose(''); setFrequency('Diaria')
    setStartDate(today); setEndDate(''); setNotes('')
    setMedIcon('💊'); setErrors({})
  }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const validate = () => {
    const e: Record<string,string> = {}
    if (!name.trim())  e.name  = 'El nombre del medicamento es obligatorio'
    if (!dose.trim())  e.dose  = 'Indica la dosis'
    if (!startDate)    e.start = 'La fecha de inicio es obligatoria'
    if (endDate && endDate < startDate) e.end = 'La fecha de fin debe ser posterior al inicio'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, name: name.trim(), dose: dose.trim(), frequency, startDate, endDate, notes })
      showToast(`${medIcon} Medicamento "${name.trim()}" registrado`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet = MOCK_PETS.find(p => p.id === petId)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon=""
      accentBg="var(--warn-hl)"
      accentFg="var(--warn)"
      size="md"
      footer={!success ? (
        <>
        <PfFooter>
  <PfBtn variant="save" onClick={handleSubmit}>Guardar medicamento</PfBtn>
</PfFooter>

        </>
      ) : <></>}
    >
{/* Hero */}
<div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--warn-hl),var(--surface))' }}>
  <div className="modal-hero-icon" style={{ background:'var(--warn)', fontSize:'1.5rem' }}>{medIcon}</div>
  <div style={{ flex: 1 }}>
    <div className="modal-hero-title">Nuevo medicamento</div>
    <div className="modal-hero-sub">Tratamiento para <strong>{pet?.name ?? '—'}</strong></div>
  </div>
  <button className="pm-close" onClick={handleClose} aria-label="Cerrar modal">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  </button>
</div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Medicamento registrado!</div>
          <div className="modal-success-sub">{medIcon} <strong>{name}</strong> añadido al historial</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">Mascota</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${MOCK_PETS.length},1fr)`, marginBottom:'1rem' }}>
            {MOCK_PETS.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id?'active':''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species]??'🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Medication identity */}
          <div className="modal-section">Medicamento</div>

          {/* Icon row */}
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <div style={{ display:'flex', gap:'.375rem' }}>
              {MED_ICONS.map(ic => (
                <button key={ic} type="button"
                  className={['emoji-pick-btn', medIcon===ic?'active':''].join(' ')}
                  style={{ width:38, height:38, fontSize:'1.1rem' }}
                  onClick={() => setMedIcon(ic)}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre del medicamento *</label>
              <div className="field-icon-wrap">
                <span className="field-icon" style={{ fontSize:'1rem' }}>{medIcon}</span>
                <input className={['form-input', errors.name?'form-input--err':''].join(' ')}
                  placeholder="Ej: Bravecto, Amoxicilina…"
                  value={name} onChange={e => { setName(e.target.value); setErrors(v=>({...v,name:''})) }} autoFocus />
              </div>
              {errors.name && <span className="form-hint-err">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Dosis *</label>
              <div className="field-icon-wrap">
                <span className="field-icon">⚖️</span>
                <input className={['form-input', errors.dose?'form-input--err':''].join(' ')}
                  placeholder="Ej: 1 comprimido, 2.5ml…"
                  value={dose} onChange={e => { setDose(e.target.value); setErrors(v=>({...v,dose:''})) }} />
              </div>
              {errors.dose && <span className="form-hint-err">{errors.dose}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Frecuencia</label>
            <div className="field-icon-wrap">
              <span className="field-icon">🔄</span>
              <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                {FREQ_OPTIONS.map(f => <option key={f.val} value={f.val}>{f.label}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="modal-section">Período de tratamiento</div>
          <div className="form-row">
            <FormDateField
              label="Fecha de inicio *"
              value={startDate}
              onChange={v => { setStartDate(v); setErrors(e=>({...e,start:''})) }}
              max={new Date().toISOString().split('T')[0]}
              error={errors.start}
            />
            <FormDateField
              label="Fecha de fin (opcional)"
              value={endDate}
              onChange={v => { setEndDate(v); setErrors(e=>({...e,end:''})) }}
              min={startDate}
              error={errors.end}
              hint="Dejar vacío si es tratamiento continuo"
            />
          </div>

          {/* Notes */}
          <div className="modal-section">Notas adicionales</div>
          <div className="form-group" style={{ marginBottom:0 }}>
            <label className="form-label">Observaciones <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
            <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
              <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
              <textarea className="form-input" rows={3}
                placeholder="Reacciones, instrucciones del veterinario, número de lote…"
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize:'vertical', minHeight:72, fontFamily:'inherit', border:'none' }}
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/EditCareModal.tsx
```typescript
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
```

## File: src/components/EditMedModal.tsx
```typescript
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
```

## File: src/components/EditPetModal.tsx
```typescript
import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'


interface Props {
  isOpen:  boolean
  onClose: () => void
  onSave:  (pet: PetWithAlerts) => void
  pet:     PetWithAlerts
}


const SPECIES_OPTIONS = [
  { value: 'cat'     as Species, emoji: '🐱', label: 'Gato',    color: 'var(--pal-lilac)' },
  { value: 'dog'     as Species, emoji: '🐶', label: 'Perro',   color: 'var(--pal-sky)'   },
  { value: 'bird'    as Species, emoji: '🦜', label: 'Ave',     color: 'var(--pal-candy)' },
  { value: 'rabbit'  as Species, emoji: '🐰', label: 'Conejo',  color: 'var(--pal-mauve)' },
  { value: 'reptile' as Species, emoji: '🦎', label: 'Reptil',  color: 'var(--success-hl)'},
  { value: 'fish'    as Species, emoji: '🐟', label: 'Pez',     color: 'var(--blue-hl)'   },
  { value: 'other'   as Species, emoji: '🐾', label: 'Otro',    color: 'var(--surface-offset)'},
]


export default function EditPetModal({ isOpen, onClose, onSave, pet }: Props) {
  /* ── Existing fields ── */
  const [name,      setName]      = useState(pet.name)
  const [species,   setSpecies]   = useState<Species>(pet.species)
  const [breed,     setBreed]     = useState(pet.breed ?? '')
  const [birthDate, setBirthDate] = useState(pet.birthDate ?? '')
  const [weight,    setWeight]    = useState((pet as any).weight ?? '')
  const [nameErr,   setNameErr]   = useState('')
  const [success,   setSuccess]   = useState(false)

  /* ── New optional fields ── */
  const [color,       setColor]       = useState((pet as any).color       ?? '')
  const [height,      setHeight]      = useState((pet as any).height      ?? '')
  const [petLength,   setPetLength]   = useState((pet as any).petLength   ?? '')
  const [petWidth,    setPetWidth]    = useState((pet as any).petWidth    ?? '')
  const [microchip,   setMicrochip]   = useState((pet as any).microchip   ?? '')
  const [chipCountry, setChipCountry] = useState((pet as any).chipCountry ?? '')
  const [passport,    setPassport]    = useState((pet as any).passport    ?? '')


  /* ── Sync when pet or isOpen changes ── */
  useEffect(() => {
    if (isOpen) {
      setName(pet.name)
      setSpecies(pet.species)
      setBreed(pet.breed ?? '')
      setBirthDate(pet.birthDate ?? '')
      setWeight((pet as any).weight ?? '')
      setColor((pet as any).color ?? '')
      setHeight((pet as any).height ?? '')
      setPetLength((pet as any).petLength ?? '')
      setPetWidth((pet as any).petWidth ?? '')
      setMicrochip((pet as any).microchip ?? '')
      setChipCountry((pet as any).chipCountry ?? '')
      setPassport((pet as any).passport ?? '')
      setNameErr('')
      setSuccess(false)
    }
  }, [pet, isOpen])


  const handleClose = () => { setSuccess(false); onClose() }

  const handleSave = () => {
    if (!name.trim()) { setNameErr('El nombre es obligatorio'); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({
        ...pet,
        name: name.trim(),
        species,
        breed:     breed.trim()     || undefined,
        birthDate: birthDate        || undefined,
        /* extra fields — spread only if non-empty */
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${name.trim()} actualizado`)
      setSuccess(false)
      onClose()
    }, 1000)
  }

  const selectedSpecies = SPECIES_OPTIONS.find(o => o.value === species)!


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      /* ── FIX: static action label in the dialog bar; no duplication ── */
      title="Editar mascota"
      icon={selectedSpecies.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero — dynamic: updates as user types name and selects species */}
      <div className="modal-hero" style={{ background: `linear-gradient(135deg,${selectedSpecies.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: 'var(--pal-denim)', color: '#fff', fontSize: '1.5rem' }}>
          {selectedSpecies.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Dynamic title — updates as user types */}
          <div className="modal-hero-title" style={{ fontSize: '1rem' }}>
            {name.trim() || pet.name}
          </div>
          {/* Dynamic sub — updates as user selects species / breed */}
          <div className="modal-hero-sub">
            {selectedSpecies.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>


      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Cambios guardados!</div>
          <div className="modal-success-sub">El perfil de {name} ha sido actualizado</div>
        </div>
      ) : (
        <>
          {/* ── IDENTIDAD ────────────────────────────────────── */}
          <div className="modal-section">Identidad</div>

          {/* Species */}
          <div className="mf-species-grid" style={{ marginBottom: '1rem' }}>
            {SPECIES_OPTIONS.map(o => (
              <button key={o.value} type="button"
                className={['mf-species-card', species === o.value ? 'active' : ''].join(' ')}
                style={species === o.value ? { background: o.color, borderColor: 'var(--primary)' } : {}}
                onClick={() => setSpecies(o.value)}>
                <span className="mf-species-emoji">{o.emoji}</span>
                <span className="mf-species-label">{o.label}</span>
              </button>
            ))}
          </div>

          {/* Name */}
          <div className="mf-field">
            <label className="mf-label">Nombre</label>
            <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
              <span className="mf-prefix">{selectedSpecies.emoji}</span>
              <input className="mf-input"
                placeholder={`Nombre de tu ${selectedSpecies.label.toLowerCase()}`}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                autoFocus />
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          {/* Breed */}
          <div className="mf-field">
            <label className="mf-label">Raza <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🏷️</span>
              <input className="mf-input" placeholder="Ej: Europeo común, Mestizo…"
                value={breed} onChange={e => setBreed(e.target.value)} />
            </div>
          </div>

          {/* Color — NEW */}
          <div className="mf-field">
            <label className="mf-label">Color <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🎨</span>
              <input className="mf-input" placeholder="Ej: Naranja, Blanco y negro, Tricolor…"
                value={color} onChange={e => setColor(e.target.value)} />
            </div>
          </div>

          {/* ── DATOS FÍSICOS ─────────────────────────────────── */}
          <div className="modal-section">Datos físicos</div>

          {/* Birth date + Weight */}
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Fecha de nacimiento <span className="mf-optional">(opcional)</span></label>
              <FormDateField value={birthDate} onChange={setBirthDate} placeholder="Selecciona una fecha" label={undefined} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Peso <span className="mf-optional">(opcional)</span></label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ej: 4.2" />
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          </div>

          {/* Medidas — NEW: height + length + width */}
          <label className="mf-label" style={{ display: 'block', marginBottom: '.5rem' }}>
            Medidas <span className="mf-optional">(opcional)</span>
          </label>
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Altura</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">↕</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={height} onChange={e => setHeight(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Longitud</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">↔</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={petLength} onChange={e => setPetLength(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Anchura</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⟺</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={petWidth} onChange={e => setPetWidth(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
          </div>

          {/* ── IDENTIFICACIÓN ────────────────────────────────── */}
          <div className="modal-section">Identificación <span className="mf-optional">(opcional)</span></div>

          {/* Microchip + Country */}
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Nº de microchip</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">📡</span>
                <input className="mf-input" placeholder="15 dígitos ISO 11784"
                  value={microchip} onChange={e => setMicrochip(e.target.value)} maxLength={20} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">País correspondiente</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🌍</span>
                <input className="mf-input" placeholder="Ej: España, Argentina…"
                  value={chipCountry} onChange={e => setChipCountry(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Passport */}
          <div className="mf-field">
            <label className="mf-label">Pasaporte <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder="Nº de pasaporte veterinario / documento"
                value={passport} onChange={e => setPassport(e.target.value)} />
            </div>
          </div>

          {/* ── PREVIEW ───────────────────────────────────────── */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize: '1.5rem' }}>{selectedSpecies.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{name}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                  {selectedSpecies.label}
                  {breed       ? ` · ${breed}`              : ''}
                  {color       ? ` · ${color}`              : ''}
                  {weight      ? ` · ${weight} kg`          : ''}
                  {microchip   ? ` · Chip: ${microchip}`   : ''}
                  {passport    ? ` · Pasaporte: ${passport}`: ''}
                </div>
              </div>
              <span className="badge badge-blue" style={{ marginLeft: 'auto', flexShrink: 0 }}>Editando</span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/FormDateField.tsx
```typescript
import { useRef, type ReactNode } from 'react'

interface FormDateFieldProps {
  label:    ReactNode
  value:    string
  onChange: (val: string) => void
  min?:     string
  max?:     string
  required?: boolean
  hint?:    string
  error?:   string
  placeholder?: string
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

const MONTHS_ES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
]

function formatDate(val: string): string {
  if (!val) return ''
  const d = new Date(val + 'T00:00:00')
  if (isNaN(d.getTime())) return val
  const day  = d.getDate()
  const mon  = MONTHS_ES[d.getMonth()]
  const year = d.getFullYear()
  return `${day} de ${mon}, ${year}`
}

export default function FormDateField({
  label, value, onChange, min, max, required, hint, error, placeholder = 'Selecciona una fecha',
}: FormDateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const trigger = () => {
    try { inputRef.current?.showPicker?.() }
    catch { inputRef.current?.click() }
  }

  return (
    <div className="fdf-wrap">
      <label className="fdf-label">
        {label}
        {required && <span className="fdf-required">*</span>}
      </label>

      {/* Clickable display row */}
      <div
        className={['fdf-row', error ? 'fdf-row--err' : ''].join(' ')}
        onClick={trigger}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && trigger()}
      >
        <span className="fdf-icon"><CalendarIcon /></span>
        <span className={['fdf-display', !value ? 'fdf-placeholder' : ''].join(' ')}>
          {value ? formatDate(value) : placeholder}
        </span>
        {value && (
          <button
            className="fdf-clear"
            onClick={e => { e.stopPropagation(); onChange('') }}
            title="Limpiar fecha"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
        {/* Hidden native input */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={e => onChange(e.target.value)}
          className="fdf-native"
          tabIndex={-1}
        />
      </div>

      {error  && <span className="fdf-msg fdf-msg--err">{error}</span>}
      {!error && hint && <span className="fdf-msg fdf-msg--hint">{hint}</span>}
    </div>
  )
}
```

## File: src/components/NewNoteModal.tsx
```typescript
import { useState } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { MOCK_PETS } from '../hooks/usePets'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface NoteData {
  petId: string; content: string; vet: string; date: string; type: string
}
interface Props { isOpen: boolean; onClose: () => void; onAdd: (d: NoteData) => void; defaultPetId?: string }

const PET_EMOJI: Record<string, string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const NOTE_TYPES = [
  { val:'control',     icon:'🩺', label:'Control',       bg:'var(--blue-hl)',    fg:'var(--blue)'    },
  { val:'observacion', icon:'👁',  label:'Observación',   bg:'var(--primary-hl)', fg:'var(--primary)' },
  { val:'emergencia',  icon:'🚨', label:'Emergencia',    bg:'var(--err-hl)',     fg:'var(--err)'     },
  { val:'vacuna',      icon:'💉', label:'Post-vacuna',   bg:'var(--success-hl)', fg:'var(--success)' },
  { val:'cirugia',     icon:'🔬', label:'Cirugía',       bg:'var(--warn-hl)',    fg:'var(--warn)'    },
  { val:'otro',        icon:'📋', label:'Otro',          bg:'var(--surface-offset)','fg':'var(--text-muted)' },
]

export default function NewNoteModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [petId,   setPetId]   = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [type,    setType]    = useState('control')
  const [contErr, setContErr] = useState('')
  const [success, setSuccess] = useState(false)

  const reset = () => { setContent(''); setVet(''); setDate(today); setType('control'); setContErr('') }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!content.trim()) { setContErr('El contenido de la nota no puede estar vacío'); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, content: content.trim(), vet: vet.trim(), date, type })
      const nt = NOTE_TYPES.find(n => n.val === type)
      showToast(`${nt?.icon ?? '📋'} Nota guardada`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet    = MOCK_PETS.find(p => p.id === petId)
  const selType = NOTE_TYPES.find(n => n.val === type)!

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
        <>
<PfFooter>
  <PfBtn variant="save" onClick={handleSubmit}>Guardar nota</PfBtn>
</PfFooter>
        </>
      ) : <></>}
    >
        {/* Hero */}
  <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
    <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>
      {selType.icon}
    </div>
    <div style={{ flex: 1 }}>
      <div className="modal-hero-title">Nueva nota</div>
      <div className="modal-hero-sub">Registro de {selType.label} · <strong>{pet?.name ?? '—'}</strong></div>
    </div>
    <button className="pm-close" onClick={handleClose}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>

    </button>
  </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Nota guardada!</div>
          <div className="modal-success-sub">Registrada el {new Date(date+'T00:00:00').toLocaleDateString('es-ES')}</div>
        </div>
      ) : (
        <>
          {/* Pet */}
          <div className="modal-section">Mascota</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${MOCK_PETS.length},1fr)`, marginBottom:'1rem' }}>
            {MOCK_PETS.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id?'active':''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species]??'🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Note type */}
          <div className="modal-section">Tipo de nota</div>
          <div className="note-type-grid">
            {NOTE_TYPES.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type===n.val?'active':''].join(' ')}
                style={type===n.val ? { background: n.bg, borderColor: n.fg, color: n.fg } : {}}
                onClick={() => setType(n.val)}>
                <span style={{ fontSize:'1.1rem' }}>{n.icon}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="modal-section">Contenido</div>
          <div className="form-group">
            <label className="form-label">Nota *</label>
            <div className={['form-input', contErr?'form-input--err':''].join(' ')}
              style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                placeholder="Estado del animal, observaciones, recomendaciones del veterinario, próximos pasos…"
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Vet + date */}
          <div className="modal-section">Detalles</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Veterinario <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input"
                  placeholder="Ej: Dra. García · VetSalud"
                  value={vet}
                  onChange={e => setVet(e.target.value)}
                />
              </div>
            </div>
            <FormDateField
              label="Fecha"
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
```

## File: src/components/RegisterSymptomModal.tsx
```typescript
import { useState } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { MOCK_PETS } from '../hooks/usePets'
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
interface Props { isOpen: boolean; onClose: () => void; onAdd: (d: SymptomData) => void; defaultPetId?: string }

const PET_EMOJI: Record<string, string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const CATEGORIES = [
  { val:'digestivo',     icon:'🤢', label:'Digestivo'    },
  { val:'respiratorio',  icon:'🫁', label:'Respiratorio' },
  { val:'piel',          icon:'🩹', label:'Piel'         },
  { val:'comportamiento',icon:'🧠', label:'Comportamiento'},
  { val:'movimiento',    icon:'🦶', label:'Movimiento'   },
  { val:'ocular',        icon:'👁',  label:'Ocular'       },
  { val:'otro',          icon:'❓', label:'Otro'         },
]

const SEVERITIES = [
  { val:'leve',       icon:'🟡', label:'Leve',      sub:'Sin urgencia',        bg:'var(--gold-hl)',    fg:'var(--gold)'    },
  { val:'moderado',   icon:'🟠', label:'Moderado',  sub:'Observar de cerca',   bg:'var(--warn-hl)',    fg:'var(--warn)'    },
  { val:'grave',      icon:'🔴', label:'Grave',     sub:'Visita veterinaria',  bg:'var(--err-hl)',     fg:'var(--err)'     },
  { val:'emergencia', icon:'🚨', label:'Emergencia',sub:'Urgente ahora',       bg:'rgba(200,64,106,.25)',fg:'var(--err)'   },
]

export default function RegisterSymptomModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [petId,       setPetId]       = useState(defaultPetId ?? MOCK_PETS[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('digestivo')
  const [severity,    setSeverity]    = useState('leve')
  const [date,        setDate]        = useState(today)
  const [notes,       setNotes]       = useState('')
  const [descErr,     setDescErr]     = useState('')
  const [success,     setSuccess]     = useState(false)

  const reset = () => { setDescription(''); setCategory('digestivo'); setSeverity('leve'); setDate(today); setNotes(''); setDescErr('') }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!description.trim()) { setDescErr('Describe el síntoma observado'); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, description: description.trim(), category, severity, date, notes })
      const sev = SEVERITIES.find(s => s.val === severity)
      showToast(`${sev?.icon ?? '🌡️'} Síntoma registrado`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet         = MOCK_PETS.find(p => p.id === petId)
  const selSeverity = SEVERITIES.find(s => s.val === severity)!
  const selCategory = CATEGORIES.find(c => c.val === category)!

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar síntoma"
      icon="🌡️"
      accentBg="var(--err-hl)"
      accentFg="var(--err)"
      size="md"
      footer={!success ? (
        <>
        
<PfFooter>
  <PfBtn variant="save" onClick={handleSubmit}>Registrar</PfBtn>
</PfFooter>
        </>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selSeverity.bg},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: selSeverity.fg, fontSize:'1.5rem' }}>
          {selCategory.icon}
        </div>
        <div>
          <div className="modal-hero-title">Síntoma observado</div>
          <div className="modal-hero-sub">
            En <strong>{pet?.name ?? '—'}</strong> · {selSeverity.label}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon" style={{ background: selSeverity.fg }}>✓</div>
          <div className="modal-success-title">Síntoma registrado</div>
          <div className="modal-success-sub">Quedará bajo seguimiento en el historial de {pet?.name}</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">Mascota</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${MOCK_PETS.length},1fr)`, marginBottom:'1rem' }}>
            {MOCK_PETS.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id?'active':''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species]??'🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Síntoma */}
          <div className="modal-section">Descripción</div>
          <div className="form-group">
            <label className="form-label">¿Qué observaste? *</label>
            <div className={['form-input', descErr?'form-input--err':''].join(' ')}
              style={{ padding:0, border: descErr ? '1.5px solid var(--err)' : undefined }}>
              <textarea
                style={{ width:'100%', padding:'.55rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:88, color:'var(--text)' }}
                placeholder="Ej: Tos seca desde ayer por la mañana. No tiene fiebre pero parece cansado…"
                value={description}
                onChange={e => { setDescription(e.target.value); setDescErr('') }}
                autoFocus
              />
            </div>
            {descErr && <span className="form-hint-err">{descErr}</span>}
          </div>

          {/* Category */}
          <div className="modal-section">Categoría</div>
          <div className="symptom-cat-grid">
            {CATEGORIES.map(c => (
              <button key={c.val} type="button"
                className={['symptom-cat-btn', category===c.val?'active':''].join(' ')}
                onClick={() => setCategory(c.val)}>
                <span style={{ fontSize:'1.2rem' }}>{c.icon}</span>
                <span style={{ fontSize:'.7rem', fontWeight:700 }}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Severity */}
          <div className="modal-section">Severidad</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.375rem', marginBottom:'1rem' }}>
            {SEVERITIES.map(s => (
              <button key={s.val} type="button"
                className="severity-btn"
                style={{ borderColor: severity===s.val ? s.fg : 'var(--border)', background: severity===s.val ? s.bg : 'var(--surface-offset)' }}
                onClick={() => setSeverity(s.val)}>
                <span style={{ fontSize:'1.1rem' }}>{s.icon}</span>
                <div style={{ flex:1, textAlign:'left' }}>
                  <div style={{ fontWeight:800, fontSize:'.875rem', color: severity===s.val ? s.fg : 'var(--text)' }}>{s.label}</div>
                  <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{s.sub}</div>
                </div>
                <div className={['mf-radio', severity===s.val?'checked':''].join(' ')}
                  style={severity===s.val ? { borderColor:s.fg, background:s.fg } : {}} />
              </button>
            ))}
          </div>

          {/* Date + notes */}
          <div className="modal-section">Detalles</div>
          <FormDateField
            label="Fecha de inicio"
            value={date}
            onChange={setDate}
            max={today}
          />
          <div className="form-group" style={{ marginBottom:0, marginTop:'.75rem' }}>
            <label className="form-label">Notas adicionales <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
            <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
              <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
              <textarea className="form-input" rows={2}
                placeholder="Medicamentos que toma actualmente, cambios de comportamiento…"
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
```

## File: src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import './styles/catAnim.css'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

## File: src/types/index.ts
```typescript
// ─────────────────────────────────────────────
// Tipos de dominio — PITUTI
// ─────────────────────────────────────────────

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other'
export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type HabitatType = 'indoor' | 'outdoor' | 'litter_box' | 'cage' | 'aquarium' | 'terrarium'
export type CarePeriod = 'day' | 'week' | 'month'

// Usuario
export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  createdAt: string
}

// Mascota
export interface Pet {
  id: string
  name: string
  species: Species
  breed?: string
  birthDate?: string
  photoUrl?: string
  ownerId: string
  createdAt: string
}

// Cuidador compartido
export interface Caregiver {
  id: string
  petId: string
  userId: string
  name: string
  email: string
  role: 'owner' | 'caregiver' | 'readonly'
  joinedAt: string
}

// Vacuna
export interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDueDate?: string
  veterinary?: string
  notes?: string
}

// Medicamento
export interface Medication {
  id: string
  petId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
}

// Síntoma
export interface Symptom {
  id: string
  petId: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  resolved: boolean
}

// Registro de alimentación
export interface FeedingLog {
  id: string
  petId: string
  date: string
  food: string
  amount?: string
  notes?: string
}

// Nota
export interface Note {
  id: string
  petId: string
  content: string
  veterinary?: string
  createdAt: string
}

// Documento
export interface DocumentFile {
  id: string
  petId: string
  name: string
  url: string
  type: string
  uploadedAt: string
}

// Actividad del log
export interface ActivityLog {
  id: string
  petId: string
  action: string
  description: string
  timestamp: string
}

// Cuidado diario
export interface CareItem {
  id: string
  petId: string
  name: string
  emoji: string
  habitatType: HabitatType
  timesPerPeriod: number
  period: CarePeriod
  quantity?: string
  notifyPush: boolean
  notifyEmail: boolean
  notifyCaregivers: boolean
}

// Registro de cuidado diario (check-in)
export interface CareLog {
  id: string
  careItemId: string
  petId: string
  doneAt: string
  doneBy: string
}

// Alerta para el dashboard
export interface PetAlert {
  type: 'warn' | 'err' | 'info'
  text: string
}
```

## File: src/components/AddPetModal.tsx
```typescript
import { useState } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import { PfBtn, PfFooter } from './FooterButtons'


/* ─── Types ─────────────────────────────────────────────────── */
interface Props {
  isOpen:  boolean
  onClose: () => void
  onAdd:   (pet: PetWithAlerts) => void
}

const SPECIES_OPTIONS = [
  { value: 'cat'     as Species, emoji: '🐱', label: 'Gato',   color: 'var(--pal-lilac)' },
  { value: 'dog'     as Species, emoji: '🐶', label: 'Perro',  color: 'var(--pal-sky)'   },
  { value: 'bird'    as Species, emoji: '🦜', label: 'Ave',    color: 'var(--pal-candy)' },
  { value: 'rabbit'  as Species, emoji: '🐰', label: 'Conejo', color: 'var(--pal-mauve)' },
  { value: 'reptile' as Species, emoji: '🦎', label: 'Reptil', color: 'var(--success-hl)'},
  { value: 'fish'    as Species, emoji: '🐟', label: 'Pez',    color: 'var(--blue-hl)'   },
  { value: 'other'   as Species, emoji: '🐾', label: 'Otro',   color: 'var(--surface-offset)'},
]


/* ─── Component ─────────────────────────────────────────────── */
export default function AddPetModal({ isOpen, onClose, onAdd }: Props) {
  /* Existing fields */
  const [name,      setName]      = useState('')
  const [species,   setSpecies]   = useState<Species>('cat')
  const [breed,     setBreed]     = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [weight,    setWeight]    = useState('')
  const [nameErr,   setNameErr]   = useState('')
  const [success,   setSuccess]   = useState(false)

  /* New optional fields */
  const [color,       setColor]       = useState('')
  const [height,      setHeight]      = useState('')
  const [petLength,   setPetLength]   = useState('')
  const [petWidth,    setPetWidth]    = useState('')
  const [microchip,   setMicrochip]   = useState('')
  const [chipCountry, setChipCountry] = useState('')
  const [passport,    setPassport]    = useState('')

  const selected = SPECIES_OPTIONS.find(o => o.value === species)!

  const reset = () => {
    setName(''); setSpecies('cat'); setBreed(''); setBirthDate(''); setWeight('')
    setColor(''); setHeight(''); setPetLength(''); setPetWidth('')
    setMicrochip(''); setChipCountry(''); setPassport('')
    setNameErr('')
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!name.trim()) { setNameErr('El nombre es obligatorio'); return }
    const petName = name.trim()
    setSuccess(true)
    setTimeout(() => {
      onAdd({
        id: `pet-${Date.now()}`,
        name: petName,
        species,
        breed:     breed.trim()  || undefined,
        birthDate: birthDate     || undefined,
        photoUrl:  undefined,
        ownerId:   'user-1',
        createdAt: new Date().toISOString(),
        healthScore: 100,
        alerts: [],
        vaccCoverage: 100,
        /* extra fields */
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${petName} añadida correctamente`)
      reset()
      setSuccess(false)
      onClose()
    }, 1000)
  }


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva mascota"
      icon={selected.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="add" onClick={handleSubmit}>Guardar mascota</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero — dynamic */}
      <div className="modal-hero" style={{ background: `linear-gradient(135deg,${selected.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: 'var(--pal-denim)', color: '#fff', fontSize: '1.5rem' }}>
          {selected.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="modal-hero-title" style={{ fontSize: '1rem' }}>
            {name.trim() || 'Nueva mascota'}
          </div>
          <div className="modal-hero-sub">
            {selected.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>


      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Mascota añadida!</div>
          <div className="modal-success-sub">{name} ya está en tu lista de mascotas</div>
        </div>
      ) : (
        <>
          {/* ── IDENTIDAD ─────────────────────────────────────── */}
          <div className="modal-section">Identidad</div>

          {/* Species */}
          <div className="mf-species-grid" style={{ marginBottom: '1rem' }}>
            {SPECIES_OPTIONS.map(o => (
              <button key={o.value} type="button"
                className={['mf-species-card', species === o.value ? 'active' : ''].join(' ')}
                style={species === o.value ? { background: o.color, borderColor: 'var(--primary)' } : {}}
                onClick={() => setSpecies(o.value)}>
                <span className="mf-species-emoji">{o.emoji}</span>
                <span className="mf-species-label">{o.label}</span>
              </button>
            ))}
          </div>

          {/* Name */}
          <div className="mf-field">
            <label className="mf-label">Nombre</label>
            <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
              <span className="mf-prefix">{selected.emoji}</span>
              <input className="mf-input"
                placeholder={`Nombre de tu ${selected.label.toLowerCase()}`}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                autoFocus />
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          {/* Breed */}
          <div className="mf-field">
            <label className="mf-label">Raza <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🏷️</span>
              <input className="mf-input" placeholder="Ej: Europeo común, Mestizo…"
                value={breed} onChange={e => setBreed(e.target.value)} />
            </div>
          </div>

          {/* Color — NEW */}
          <div className="mf-field">
            <label className="mf-label">Color <span className="mf-optional">(opcional)</span></label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🎨</span>
              <input className="mf-input" placeholder="Ej: Naranja, Blanco y negro, Tricolor…"
                value={color} onChange={e => setColor(e.target.value)} />
            </div>
          </div>

          {/* ── DATOS FÍSICOS ─────────────────────────────────── */}
          <div className="modal-section">Datos físicos</div>

          {/* Birth date + Weight */}
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Fecha de nacimiento <span className="mf-optional">(opcional)</span></label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🎂</span>
                <input className="mf-input" type="date"
                  value={birthDate} onChange={e => setBirthDate(e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Peso <span className="mf-optional">(opcional)</span></label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ej: 4.2" />
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          </div>

          {/* Medidas — NEW: altura + longitud + anchura */}
          <label className="mf-label" style={{ display: 'block', marginBottom: '.5rem' }}>
            Medidas <span className="mf-optional">(opcional)</span>
          </label>
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Altura</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">↕</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={height} onChange={e => setHeight(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Longitud</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">↔</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={petLength} onChange={e => setPetLength(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Anchura</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⟺</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={petWidth} onChange={e => setPetWidth(e.target.value)} placeholder="0.0" />
                <span className="mf-suffix">cm</span>
              </div>
            </div>
          </div>

          {/* ── IDENTIFICACIÓN ────────────────────────────────── */}
          <div className="modal-section">Identificación <span className="mf-optional">(opcional)</span></div>

          {/* Microchip + Country */}
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">Nº de microchip</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">📡</span>
                <input className="mf-input" placeholder="15 dígitos ISO 11784"
                  value={microchip} onChange={e => setMicrochip(e.target.value)} maxLength={20} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="mf-label">País correspondiente</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🌍</span>
                <input className="mf-input" placeholder="Ej: España, Argentina…"
                  value={chipCountry} onChange={e => setChipCountry(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Passport */}
          <div className="mf-field">
            <label className="mf-label">Pasaporte</label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder="Nº de pasaporte veterinario / documento"
                value={passport} onChange={e => setPassport(e.target.value)} />
            </div>
          </div>

          {/* ── PREVIEW ───────────────────────────────────────── */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize: '1.5rem' }}>{selected.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{name}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                  {selected.label}
                  {breed       ? ` · ${breed}`               : ''}
                  {color       ? ` · ${color}`               : ''}
                  {weight      ? ` · ${weight} kg`           : ''}
                  {microchip   ? ` · Chip: ${microchip}`    : ''}
                  {passport    ? ` · Pasaporte: ${passport}` : ''}
                </div>
              </div>
              <span className="badge badge-green" style={{ marginLeft: 'auto', flexShrink: 0 }}>Nueva</span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/AppLayout.tsx
```typescript
import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { usePituti } from '../context/PitutiContext'
import CalicoAnimation from './CalicoAnimation'
import NotificationsPanel from './NotificationPanel'
// catAnim.css must be imported in main.tsx: import './styles/catAnim.css'

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function PitutiLogo() {
  return (
    <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.18)' }}>
      <img src="logo-cat.jpg" alt="Pituti" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
    </div>
  )
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2.5"/><rect x="14" y="3" width="7" height="7" rx="2.5"/>
      <rect x="14" y="14" width="7" height="7" rx="2.5"/><rect x="3" y="14" width="7" height="7" rx="2.5"/>
    </svg>
  ),
  pets: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="9" cy="7" rx="2.2" ry="2.8"/><ellipse cx="15" cy="7" rx="2.2" ry="2.8"/>
      <ellipse cx="5" cy="13" rx="1.8" ry="2.3"/><ellipse cx="19" cy="13" rx="1.8" ry="2.3"/>
      <path d="M12 11c-3.5 0-6 2.2-6 5.5 0 2.8 2.5 4.5 6 4.5s6-1.7 6-4.5c0-3.3-2.5-5.5-6-5.5z"/>
    </svg>
  ),
  cares: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  vaccines: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2 6 14"/><path d="m2 22 4-4"/><path d="m7 17 10-10"/>
      <path d="M8 9.5 14.5 16"/><path d="m16.5 6-9 9"/><circle cx="19" cy="5" r="2.5"/>
    </svg>
  ),
  medications: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5-7-7a5 5 0 1 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"/>
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
    </svg>
  ),
  symptoms: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
    </svg>
  ),
  notes: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  calendar: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  settings: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  chevron: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  closeX: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  vet: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
    </svg>
  ),
}

// ─── NAV COMPONENTS ───────────────────────────────────────────────────────────
interface NavItemProps {
  to:        string
  icon:      React.ReactNode
  label:     string
  badge?:    string
  collapsed: boolean
  onClick?:  () => void
}

function NavItem({ to, icon, label, badge, collapsed, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['nav-item', isActive ? 'active' : ''].join(' ')}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      {icon}
      <span className="nav-label">{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </NavLink>
  )
}

function MobileNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['mobile-nav-item', isActive ? 'active' : ''].join(' ')}
    >
      <span className="mobile-nav-icon">{icon}</span>
      <span className="mobile-nav-label">{label}</span>
    </NavLink>
  )
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
interface ToastState {
  show:    boolean
  message: string
  type?:   'success' | 'err'
}

let _setToast: ((s: ToastState) => void) | null = null

export function showToast(message: string, type: 'success' | 'err' = 'success') {
  _setToast?.({ show: true, message, type })
  setTimeout(() => _setToast?.({ show: false, message, type: 'success' }), 3200)
}

// ─── APP LAYOUT ───────────────────────────────────────────────────────────────
export default function AppLayout() {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { state, toggleTheme } = usePituti()
  const theme = state.theme

  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' })

  useEffect(() => {
    _setToast = setToast
    return () => { _setToast = null }
  }, [setToast])

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className={['app', collapsed ? 'sidebar-collapsed' : ''].join(' ')}>

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <button className="mobile-menu-btn" aria-label="Abrir menú" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? icons.closeX : icons.menu}
        </button>

        <div className="topbar-logo" onClick={() => navigate('dashboard')} style={{ cursor: 'pointer' }}>
          <PitutiLogo />
          <div className="pituti-anim-wrap">
            {'Pituti'.split('').map((char, i) => (
              <span key={i} style={{ '--i': i } as React.CSSProperties}>{char}</span>
            ))}
          </div>
          <CalicoAnimation />
        </div>

        <div className="topbar-search">
          {icons.search}
          <input placeholder="Buscar mascota, registro..." aria-label="Buscar" />
          <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.1)', padding: '.1rem .35rem', borderRadius: '.25rem' }}>K</span>
        </div>

        <div className="topbar-actions">
          <NotificationsPanel />
          <button className="topbar-icon-btn" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'light' ? icons.moon : icons.sun}
          </button>
        </div>

        <div className="topbar-avatar" title="Thamires Lopes" onClick={() => navigate('settings')} role="button" tabIndex={0}>TL</div>
      </header>

      {mobileOpen && (
        <div className="mobile-sidebar-backdrop" onClick={closeMobile} aria-hidden="true" />
      )}

      {/* ── SIDEBAR ── */}
      <nav className={['sidebar', mobileOpen ? 'mobile-open' : ''].join(' ')} aria-label="Navegación principal">

        <div className="sidebar-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <PitutiLogo />
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.125rem', color: 'var(--nav-text-active)' }}>Pituti</span>
          </div>
          <button className="sidebar-mobile-close" onClick={closeMobile} aria-label="Cerrar menú">{icons.closeX}</button>
        </div>

        <div className="sidebar-section-label">Principal</div>
        <NavItem to="dashboard" icon={icons.dashboard} label="Dashboard"    collapsed={collapsed} />
        <NavItem to="pets"      icon={icons.pets}      label="Mis Mascotas" collapsed={collapsed} badge="3" />
        <NavItem to="cares"     icon={icons.cares}     label="Cuidados"     collapsed={collapsed} />
        <NavItem to="calendar"  icon={icons.calendar}  label="Calendario"   collapsed={collapsed} />

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Salud</div>
        <NavItem to="vaccines"    icon={icons.vaccines}    label="Vacunas"      collapsed={collapsed} />
        <NavItem to="medications" icon={icons.medications} label="Medicamentos" collapsed={collapsed} />
        <NavItem to="symptoms"    icon={icons.symptoms}    label="Síntomas"     collapsed={collapsed} />
        <NavItem to="notes"       icon={icons.notes}       label="Notas"        collapsed={collapsed} />
        <NavItem to="vet"         icon={icons.vet}         label="Veterinaria"  collapsed={collapsed} />

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Cuenta</div>
        <NavItem to="settings" icon={icons.settings} label="Ajustes" collapsed={collapsed} />

        <div className="sidebar-toggle">
          <button
            className="nav-item"
            style={{ width: '100%' }}
            onClick={() => setCollapsed(c => !c)}
            title="Colapsar menú"
          >
            <span style={{ transform: collapsed ? 'rotate(180deg)' : undefined, transition: 'transform 200ms', display: 'flex' }}>
              {icons.chevron}
            </span>
            <span className="nav-label">Colapsar</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
        <MobileNavItem to="dashboard" icon={icons.dashboard} label="Inicio"      />
        <MobileNavItem to="pets"      icon={icons.pets}      label="Mascotas"    />
        <MobileNavItem to="cares"     icon={icons.cares}     label="Cuidados"    />
        <MobileNavItem to="vet"       icon={icons.vet}       label="Veterinaria" />
        <MobileNavItem to="calendar"  icon={icons.calendar}  label="Calendario"  />
        <MobileNavItem to="settings"  icon={icons.settings}  label="Ajustes"     />
      </nav>

      {/* ── MAIN ── */}
      <main className="main" id="main-content">
        <Outlet />
      </main>

      {/* ── TOAST ── */}
      <div className={['toast', toast.show ? 'show' : ''].join(' ')} role="alert" aria-live="polite">
        <div
          className="toast-icon"
          style={{
            background: toast.type === 'err' ? 'var(--err-hl)'  : 'var(--success-hl)',
            color:      toast.type === 'err' ? 'var(--err)'     : 'var(--success)',
          }}
        >
          {toast.type === 'err' ? '✕' : '✓'}
        </div>
        <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '.875rem' }}>
          {toast.message}
        </div>
        <button
          style={{
            marginLeft: '.5rem', width: 32, height: 32, borderRadius: 'var(--r-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer',
          }}
          onClick={() => setToast(t => ({ ...t, show: false }))}
        >
          {icons.closeX}
        </button>
      </div>

    </div>
  )
}
```

## File: src/components/Modal.tsx
```typescript
import { useEffect, type ReactNode, type ReactElement } from 'react'
import { createPortal } from 'react-dom'


type ModalSize = 'sm' | 'md' | 'lg'


interface ModalProps {
  isOpen:    boolean
  onClose:   () => void
  title:     string
  subtitle?: string
  children:  ReactNode
  footer?:   ReactNode
  size?:     ModalSize
  icon?:     string
  accentBg?: string
  accentFg?: string
}


const maxWidths: Record<ModalSize, string> = {
  sm: '400px',
  md: '520px',
  lg: '680px',
}


export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size     = 'md',
  icon     = '✦',
  accentBg = 'var(--primary-hl)',
  accentFg = 'var(--primary)',
}: ModalProps): ReactElement | null {
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [isOpen, onClose])


  if (!isOpen) return null


  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="pm-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="pm-sheet" style={{ maxWidth: maxWidths[size] }}>

        {/* ── Single hero header ── */}
        {title && (
          <div
            className="pm-hero-header"
            style={{ background: `linear-gradient(135deg, ${accentBg} 0%, var(--surface) 100%)` }}
          >
            <div className="pm-hero-icon" style={{ background: accentFg, color: '#fff' }}>
              {icon}
            </div>
            <div className="pm-hero-text">
              <h2 id="modal-title" className="pm-hero-title">{title}</h2>
              {subtitle && <p className="pm-hero-subtitle">{subtitle}</p>}
            </div>
            <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div className="pm-body">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="pm-footer pm-footer--right">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
```

## File: src/hooks/usePets.ts
```typescript
import { useCallback, useEffect, useState } from 'react'
import type { Pet, PetAlert, Species } from '../types'

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface PetWithAlerts extends Pet {
  alerts: PetAlert[]
  healthScore: number
  vaccCoverage: number   // % baseado só nas vacinas 'ok' (não vencidas, não próximas)
}

interface UsePetsResult {
  pets: PetWithAlerts[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  addPet: (pet: PetWithAlerts) => void
  removePet: (petId: string) => void
}

export interface VaccineRecord {
  name:     string
  applied:  string
  nextDate: string   // ISO yyyy-mm-dd
  badge:    string
  badgeCls: string
}

// ── Constante: dias até vencer para considerar "soon" ────────────────────────
const WARN_DAYS = 30

// ── Helper: calcula o status da vacina em runtime ────────────────────────────
export function getVaccStatus(nextDate: string): 'ok' | 'soon' | 'late' {
  const d     = new Date(nextDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const delta = Math.floor((d.getTime() - today.getTime()) / 86_400_000)
  if (delta < 0)           return 'late'
  if (delta <= WARN_DAYS)  return 'soon'
  return 'ok'
}

// ── VACCINES_BY_PET ───────────────────────────────────────────────────────────
// cls é calculado em runtime via getVaccStatus — não hardcodado aqui
export const VACCINES_BY_PET: Record<string, VaccineRecord[]> = {
  'pet-1': [
    { name: 'Antirrábica',       applied: '15 abr 2024', nextDate: '2026-04-23', badge: 'URGENTE',    badgeCls: 'badge-red'    },
    { name: 'Trivalente felina', applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',     badgeCls: 'badge-green'  },
    { name: 'Leucemia felina',   applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',     badgeCls: 'badge-green'  },
    { name: 'Calicivirus',       applied: '03 mar 2025', nextDate: '2026-06-01', badge: 'EN 2 MESES', badgeCls: 'badge-yellow' },
  ],
  'pet-2': [
    { name: 'Rabia canina',  applied: '10 mar 2025', nextDate: '2026-03-10', badge: 'VENCIDA',  badgeCls: 'badge-red'    },
    { name: 'Moquillo',      applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',   badgeCls: 'badge-green'  },
    { name: 'Parvovirus',    applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',   badgeCls: 'badge-green'  },
    { name: 'Leptospirosis', applied: '05 feb 2026', nextDate: '2026-05-15', badge: 'EN 1 MES', badgeCls: 'badge-yellow' },
  ],
  'pet-3': [
    { name: 'Newcastle',     applied: '01 feb 2026', nextDate: '2027-02-01', badge: 'AL DÍA', badgeCls: 'badge-green' },
    { name: 'Viruela aviar', applied: '01 feb 2026', nextDate: '2027-02-01', badge: 'AL DÍA', badgeCls: 'badge-green' },
  ],
}

// ── calcVaccCoverage: conta só as 'ok' (não vencidas, não próximas) ───────────
function calcVaccCoverage(petId: string): number {
  const vaccines = VACCINES_BY_PET[petId] ?? []
  if (vaccines.length === 0) return 100
  const ok = vaccines.filter(v => getVaccStatus(v.nextDate) === 'ok').length
  return Math.round((ok / vaccines.length) * 100)
}

// ── MOCK_PETS ─────────────────────────────────────────────────────────────────
export const MOCK_PETS: PetWithAlerts[] = [
  {
    id: 'pet-1', name: 'Luna', species: 'cat' as Species,
    breed: 'Europeo común', birthDate: '2021-05-14',
    photoUrl: '', ownerId: 'user-1', createdAt: '2026-04-01T10:00:00.000Z',
    healthScore: 75, vaccCoverage: calcVaccCoverage('pet-1'),
    alerts: [{ type: 'warn', text: 'Vacuna antirrábica vence en 3 días' }],
  },
  {
    id: 'pet-2', name: 'Toby', species: 'dog' as Species,
    breed: 'Mestizo', birthDate: '2020-10-01',
    photoUrl: '', ownerId: 'user-1', createdAt: '2026-04-02T10:00:00.000Z',
    healthScore: 60, vaccCoverage: calcVaccCoverage('pet-2'),
    alerts: [{ type: 'err', text: '1 Síntoma bajo observación — tos suave' }],
  },
  {
    id: 'pet-3', name: 'Kiwi', species: 'bird' as Species,
    breed: 'Periquito', birthDate: '2023-02-18',
    photoUrl: '', ownerId: 'user-1', createdAt: '2026-04-03T10:00:00.000Z',
    healthScore: 95, vaccCoverage: calcVaccCoverage('pet-3'),
    alerts: [],
  },
]

// ── Constantes ────────────────────────────────────────────────────────────────
export const PALETTE_COLORS = ['#CCA1C9', '#FFD3DD', '#F3A0AD', '#BED1E3', '#92A1C3']

export const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🦜', rabbit: '🐰',
  reptile: '🦎', fish: '🐟', other: '🐾',
}

// ── usePets hook ──────────────────────────────────────────────────────────────
export function usePets(): UsePetsResult {
  const [pets,    setPets]    = useState<PetWithAlerts[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      setPets(MOCK_PETS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPet    = useCallback((pet: PetWithAlerts) => setPets(prev => [pet, ...prev]), [])
  const removePet = useCallback((petId: string)       => setPets(prev => prev.filter(p => p.id !== petId)), [])

  useEffect(() => { reload() }, [reload])

  return { pets, loading, error, reload, addPet, removePet }
}
```

## File: src/pages/CaresPage.tsx
```typescript
import { useState, useMemo } from 'react'
import { showToast } from '../components/AppLayout'
import { useCares, isDueOnDate, getNextDueDate, type CareItem } from '../context/CaresContext'
import AddCareModal  from '../components/AddCareModal'
import EditCareModal, { type CareEditData } from '../components/EditCareModal'
import CareDetailModal, { type CareDetailItem } from '../components/CareDetailModal'

const PETS_META = [
  { id:'pet-1', emoji:'🐱', name:'Luna' },
  { id:'pet-2', emoji:'🐶', name:'Toby' },
  { id:'pet-3', emoji:'🦜', name:'Kiwi' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function CareCard({ item, done, doneState, onToggle, onClick }: {
  item: CareItem; done: number; doneState: boolean
  onToggle: () => void; onClick: () => void
}) {
  return (
    <div className={['care-card', doneState ? 'done' : ''].join(' ')}
      onClick={onClick} style={{ cursor:'pointer' }}>
      <div className="care-header">
        <div className="care-emoji" style={{ background: item.bg }}>{item.emoji}</div>
        <div>
          <div className="care-title">{item.title}</div>
          <div className="care-sub">{item.sub}</div>
        </div>
      </div>
      <div className="care-progress">
        <div className="care-dots">
          {Array.from({ length: Math.min(item.total, 7) }).map((_, j) => (
            <div key={j} className={`care-dot ${j < done ? 'done' : ''}`} />
          ))}
        </div>
        <span>{doneState
          ? <span style={{ color:'var(--success)' }}>Hecho ✓</span>
          : `${done}/${item.total}`}
        </span>
      </div>
      <div className="care-actions" onClick={e => e.stopPropagation()}>
        <button className={`care-btn-do ${doneState ? 'done-btn' : ''}`} onClick={onToggle}>
          ✓ {doneState ? 'Hecho' : 'Registrar'}
        </button>
      </div>
    </div>
  )
}

function ScheduledRow({ item, nextDate, onClick }: {
  item: CareItem; nextDate: string; onClick: () => void
}) {
  const dateLabel = new Date(nextDate + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday:'short', day:'numeric', month:'short'
  })
  const daysFromNow = Math.round(
    (new Date(nextDate + 'T00:00:00').getTime() - new Date().setHours(0,0,0,0)) / 86400000
  )
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.875rem', padding:'.625rem .25rem',
      borderBottom:'1px solid var(--divider)', cursor:'pointer' }}
      onClick={onClick}>
      <div style={{ background:item.bg, width:36, height:36, borderRadius:'var(--r-md)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'1.1rem', flexShrink:0 }}>{item.emoji}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:'.875rem', color:'var(--text)' }}>{item.title}</div>
        <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.1rem' }}>{item.sub}</div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontSize:'.8125rem', fontWeight:800, color:'var(--primary)' }}>{dateLabel}</div>
        <div style={{ fontSize:'.65rem', color:'var(--text-faint)', marginTop:'.1rem' }}>
          {daysFromNow === 0 ? 'Hoy' : `en ${daysFromNow}d`}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CaresPage() {
  const { items, addCare, editCare, deleteCare, setCareProgress } = useCares()
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const [selPet,   setSelPet]   = useState('all')
  const [detail,   setDetail]   = useState<CareItem | null>(null)
  const [editItem, setEditItem] = useState<CareEditData | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen,  setAddOpen]  = useState(false)

  const getDone = (item: CareItem) =>
    item.doneByDate[today] ?? { done: 0, doneState: false }

  const getDailyCares = (petId: string) =>
    items.filter(i => i.petId === petId && isDueOnDate(i, today))

  const getScheduled = (petId: string) => {
    const toDate = new Date(); toDate.setDate(toDate.getDate() + 30)
    const toStr  = toDate.toISOString().split('T')[0]
    return items
      .filter(i => i.petId === petId && i.intervalDays > 1 && !isDueOnDate(i, today))
      .map(i => ({ item: i, nextDate: getNextDueDate(i, today) }))
      .filter(x => x.nextDate <= toStr)
      .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
  }

  const toDetailItem = (item: CareItem): CareDetailItem => {
    const d = getDone(item)
    return { id:item.id, petId:item.petId, emoji:item.emoji, title:item.title,
      sub:item.sub, total:item.total, done:d.done, done_state:d.doneState, bg:item.bg }
  }

  const toEditData = (item: CareItem): CareEditData => ({
    id:item.id, emoji:item.emoji, title:item.title, total:item.total,
    period:item.period, quantity:item.quantity, notify:item.notify, bg:item.bg,
    time:item.time, intervalDays:item.intervalDays, recurring:item.recurring,
  })

  const visiblePets = selPet === 'all' ? PETS_META : PETS_META.filter(p => p.id === selPet)

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.125rem' }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.375rem', fontWeight:400, color:'var(--text)' }}>
            Cuidados de hoy
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.2rem' }}>
            {new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' })}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Añadir cuidado
        </button>
      </div>

      {/* Pet filter pills */}
      <div style={{ display:'flex', gap:'.375rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {[{ id:'all', emoji:'🐾', name:'Todos' }, ...PETS_META].map(p => (
          <button key={p.id} type="button"
            style={{ display:'flex', alignItems:'center', gap:'.375rem', padding:'.4rem .875rem',
              borderRadius:'var(--r-full)',
              border:`1.5px solid ${selPet===p.id?'var(--primary)':'var(--border)'}`,
              background:selPet===p.id?'var(--primary-hl)':'var(--surface-offset)',
              color:selPet===p.id?'var(--primary)':'var(--text-muted)',
              fontWeight:700, fontSize:'.8125rem', cursor:'pointer', fontFamily:'inherit',
              minHeight:40, transition:'all 180ms' }}
            onClick={() => setSelPet(p.id)}>
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      {/* Content per pet */}
      {visiblePets.map(pet => {
        const daily     = getDailyCares(pet.id)
        const scheduled = getScheduled(pet.id)
        if (daily.length === 0 && scheduled.length === 0) return null
        const doneCount = daily.filter(c => getDone(c).doneState).length

        return (
          <div key={pet.id} style={{ marginBottom:'2rem' }}>

            {/* Pet header */}
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.875rem' }}>
              <span style={{ fontSize:'1.25rem' }}>{pet.emoji}</span>
              <span style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)' }}>{pet.name}</span>
              <span className={`badge ${doneCount===daily.length?'badge-green':'badge-yellow'}`}>
                {doneCount}/{daily.length} hoy
              </span>
            </div>

            {/* Daily care grid */}
            <div className="care-grid">
              {daily.map(item => {
                const d = getDone(item)
                return (
                  <CareCard key={item.id} item={item} done={d.done} doneState={d.doneState}
                    onToggle={() => {
                      const ns = !getDone(item).doneState
                      setCareProgress(item.id, today, ns ? item.total : 0, ns)
                      showToast(ns ? `✓ ${item.title} completado` : `↩ ${item.title} desmarcado`)
                    }}
                    onClick={() => setDetail(item)}
                  />
                )
              })}
            </div>

            {/* Scheduled section */}
            {scheduled.length > 0 && (
              <div style={{ marginTop:'1rem', background:'var(--surface)',
                border:'1.5px solid var(--border)', borderRadius:'var(--r-xl)',
                padding:'.875rem 1rem' }}>
                <div style={{ fontSize:'.75rem', fontWeight:800, color:'var(--text-muted)',
                  textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.25rem' }}>
                  📅 Próximos cuidados programados
                </div>
                {scheduled.map(({ item, nextDate }) => (
                  <ScheduledRow key={item.id} item={item} nextDate={nextDate}
                    onClick={() => setDetail(item)} />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Modals ── */}

      {detail && (
        <CareDetailModal
          item={toDetailItem(detail)}
          onClose={() => setDetail(null)}
          onToggle={(id, newDone, newState) => {
            setCareProgress(id, today, newDone, newState)
            const u = items.find(i => i.id === id)
            if (u) setDetail({ ...u })
          }}
          onEdit={di => {
            setDetail(null)
            const item = items.find(i => i.id === di.id)
            if (item) { setEditItem(toEditData(item)); setEditOpen(true) }
          }}
        />
      )}

      <AddCareModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={d => {
          addCare({
            petId: d.petId, emoji: d.emoji, title: d.title,
            sub: `${d.total}× ${d.period==='day'?'día':'semana'}${d.quantity?' · '+d.quantity:''}`,
            total: d.total, period: d.period, quantity: d.quantity, notify: d.notify,
            bg: '', time: d.time ?? '',
            intervalDays: d.intervalDays ?? 1,
            recurring: (d as any).recurring ?? true,
            startDate: today,
          })
        }}
      />

      <EditCareModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        care={editItem}
        onSave={updated => {
          const item = items.find(i => i.id === updated.id)
          if (!item) return
          editCare({
            ...item,
            emoji: updated.emoji, title: updated.title, total: updated.total,
            period: updated.period, quantity: updated.quantity ?? '', notify: updated.notify,
            sub: `${updated.total}× ${updated.period==='day'?'día':'semana'}${updated.quantity?' · '+updated.quantity:''}`,
            time: updated.time, intervalDays: updated.intervalDays ?? 1,
            recurring: (updated as any).recurring ?? true,
          })
          showToast(`${updated.emoji} ${updated.title} actualizado`)
          setEditOpen(false)
        }}
        onDelete={id => { deleteCare(id); setEditOpen(false); showToast('Cuidado eliminado') }}
      />
    </div>
  )
}
```

## File: src/pages/MedicationsPage.tsx
```typescript
import { useState } from 'react'
import { showToast } from '../components/AppLayout'
import AddMedicationModal from '../components/AddMedicationModal'
import EditMedModal from '../components/EditMedModal'
import MedDetailModal from '../components/MedDetailModal'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord } from '../components/EditMedModal'
import BackButton  from '../components/BackButton'

const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }

// Pencil icon
function PencilIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
    </svg>
  )
}

const INITIAL_ACTIVE: MedRecord[] = [
  { id:'m1', icon:'💊', title:'Bravecto — Luna',          dose:'1 comprimido', frequency:'Cada 3 meses', startDate:'2026-01-10', endDate:'', notes:'Antiparasitario oral.', bg:'var(--warn-hl)', color:'var(--warn)', badge:'Activo', badgeCls:'badge-green', archived:false },
  { id:'m2', icon:'💉', title:'Pipeta antipulgas — Toby', dose:'1 pipeta',     frequency:'Mensual',      startDate:'2026-03-30', endDate:'', notes:'Aplicar en la nuca.', bg:'var(--blue-hl)', color:'var(--blue)', badge:'Esta semana', badgeCls:'badge-yellow', archived:false },
]
const INITIAL_HISTORY: MedRecord[] = [
  { id:'h1', icon:'💊', title:'Amoxicilina — Luna',         dose:'1 comprimido / 12h', frequency:'Cada 12 horas', startDate:'2026-02-01', endDate:'2026-02-07', notes:'Infección leve. 7 días.', bg:'', color:'', badge:'Terminado', badgeCls:'badge-gray', archived:true },
  { id:'h2', icon:'💊', title:'Cortisona inyectable — Toby', dose:'2ml', frequency:'Única dosis', startDate:'2026-01-15', endDate:'2026-01-15', notes:'3 aplicaciones en total.', bg:'', color:'', badge:'Terminado', badgeCls:'badge-gray', archived:true },
]

interface DoseRecord { id:string; medId:string; icon:string; bg:string; color:string; title:string; date:string; badge:string; badgeCls:string; daysLeft:number }
const INITIAL_DOSES: DoseRecord[] = [
  { id:'d1', medId:'m2', icon:'💊', bg:'var(--warn-hl)', color:'var(--warn)', title:'Pipeta antipulgas · Toby', date:'30 abr 2026', badge:'17d', badgeCls:'badge-yellow', daysLeft:17 },
  { id:'d2', medId:'m1', icon:'💊', bg:'var(--blue-hl)', color:'var(--blue)', title:'Bravecto · Luna',           date:'10 jul 2026', badge:'89d', badgeCls:'badge-green',  daysLeft:89 },
]

export default function MedicationsPage() {
  const [active,      setActive]      = useState<MedRecord[]>(INITIAL_ACTIVE)
  const [history,     setHistory]     = useState<MedRecord[]>(INITIAL_HISTORY)
  const [addOpen,     setAddOpen]     = useState(false)
  const [editOpen,    setEditOpen]    = useState(false)
  const [editMed,     setEditMed]     = useState<MedRecord | null>(null)
  const [detailMed,   setDetailMed]   = useState<MedRecord | null>(null)

  const openEdit  = (med: MedRecord) => { setEditMed(med); setEditOpen(true) }
  const openDetail = (med: MedRecord) => setDetailMed(med)

  const handleAdd = (d: AddMedData) => {
    const petName  = PET_NAME[d.petId] ?? 'Mascota'
    const petEmoji = PET_EMOJI[d.petId] ?? '🐾'
    setActive(prev => [...prev, {
      id: `m${Date.now()}`, icon:'💊', title:`${d.name} — ${petEmoji} ${petName}`,
      dose:d.dose, frequency:d.frequency, startDate:d.startDate, endDate:d.endDate, notes:d.notes,
      bg:'var(--warn-hl)', color:'var(--warn)', badge:'Activo', badgeCls:'badge-green', archived:false,
    }])
  }

  const handleSaveEdit = (updated: MedRecord) => {
    if (updated.archived) {
      setHistory(prev => prev.map(m => m.id === updated.id ? updated : m))
    } else {
      setActive(prev => prev.map(m => m.id === updated.id ? updated : m))
    }
    showToast('Medicamento actualizado')
  }

  const handleDelete = (id: string) => {
    setActive(prev => prev.filter(m => m.id !== id))
    setHistory(prev => prev.filter(m => m.id !== id))
    showToast('Medicamento eliminado')
  }

  const archiveMed = (id: string) => {
    const med = active.find(m => m.id === id); if (!med) return
    setActive(prev => prev.filter(m => m.id !== id))
    setHistory(prev => [...prev, { ...med, archived:true, badge:'Terminado', badgeCls:'badge-gray' }])
    showToast('Medicamento archivado')
  }

  const unarchiveMed = (id: string) => {
    const med = history.find(m => m.id === id); if (!med) return
    setHistory(prev => prev.filter(m => m.id !== id))
    setActive(prev => [...prev, { ...med, archived:false, badge:'Activo', badgeCls:'badge-green' }])
    showToast('Medicamento desarchivado ✓')
  }

  const handleMarkAdministered = (med: MedRecord, date: string) => {
    const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' })
    showToast(`✓ ${med.title} administrado el ${dateStr}`)
  }

  // Edit from detail
  const handleDetailEdit = (med: MedRecord) => { setDetailMed(null); openEdit(med) }

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Medicamentos</div><div className="page-subtitle">Tratamientos activos y archivados</div></div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Añadir medicamento
        </button>
      </div>

      <div className="grid-2">
        {/* Active */}
        <div className="card">
          <div className="card-title">
            Activos
            {active.length > 0 && <span className="badge badge-green">{active.length}</span>}
          </div>
          {active.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>Sin medicamentos activos</div>
            : active.map(m => (
              <div key={m.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">{m.dose} · {m.frequency}</div>
                </div>
                <div className="med-row-actions">
                  <span className={`badge ${m.badgeCls}`}>{m.badge}</span>
                  <button className="med-archive-btn" title="Archivar"
                    onClick={e => { e.stopPropagation(); archiveMed(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/>
                      <line x1="10" y1="12" x2="14" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        {/* History */}
        <div className="card">
          <div className="card-title">Historial</div>
          {history.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>Sin historial</div>
            : history.map(m => (
              <div key={m.id} className="list-item" style={{ opacity:.7, cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:'var(--surface-offset)', color:'var(--text-faint)' }}>{m.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">
                    {m.dose}
                    {m.startDate ? ` · ${new Date(m.startDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})}` : ''}
                    {m.endDate   ? ` → ${new Date(m.endDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})}` : ''}
                  </div>
                </div>
                <div className="med-row-actions">
                  <span className="badge badge-gray">Terminado</span>
                  {/* Unarchive */}
                  <button className="med-edit-btn" title="Desarchivar" style={{ background:'var(--success-hl)', color:'var(--success)' }}
                    onClick={e => { e.stopPropagation(); unarchiveMed(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/>
                      <polyline points="10 12 12 10 14 12"/><line x1="12" y1="10" x2="12" y2="16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Adherence + Doses */}
      <div className="grid-2" style={{ marginTop:'1.125rem' }}>
        <div className="card">
          <div className="card-title">Adherencia al tratamiento</div>
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', padding:'.5rem 0' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink:0 }}>
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--surface-offset)" strokeWidth="9"/>
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--success)" strokeWidth="9"
                strokeDasharray="226.2" strokeDashoffset="34" strokeLinecap="round" transform="rotate(-90 45 45)"/>
              <text x="45" y="50" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="800" fontSize="20" fill="var(--text)">85%</text>
            </svg>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'.625rem' }}>
              {[
                { label:'BRAVECTO — LUNA', pct:100, color:'success', sub:'Al día ✓',           subColor:'var(--success)' },
                { label:'PIPETA — TOBY',   pct:70,  color:'warn',    sub:'Próxima en 17 días', subColor:'var(--warn)'    },
              ].map(b=>(
                <div key={b.label}>
                  <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'.3rem' }}>{b.label}</div>
                  <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/></div>
                  <div style={{ fontSize:'.7rem', color:b.subColor, marginTop:'.2rem', fontWeight:700 }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Próximas dosis</div>
          {INITIAL_DOSES.map(d => {
            const linked = [...active, ...history].find(m => m.id === d.medId)
            return (
              <div key={d.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => linked && openDetail(linked)}>
                <div className="list-item-icon" style={{ background:d.bg, color:d.color }}>{d.icon}</div>
                <div className="list-item-info"><div className="list-item-title">{d.title}</div><div className="list-item-sub">{d.date}</div></div>
                <div className="med-row-actions">
                  <span className={`badge ${d.badgeCls}`}>{d.badge}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AddMedicationModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>
      <EditMedModal isOpen={editOpen} onClose={() => setEditOpen(false)} med={editMed} onSave={handleSaveEdit} onDelete={handleDelete}/>
      <MedDetailModal med={detailMed} onClose={() => setDetailMed(null)} onEdit={handleDetailEdit} onMarkAdministered={handleMarkAdministered}/>
    </div>
  )
}
```

## File: src/pages/NotesPage.tsx
```typescript
import { useState } from 'react'
import NewNoteModal from '../components/NewNoteModal'
import { NoteDetailModal, EditNoteModal, CURRENT_USER } from '../components/NoteModals'
import type { NoteEntry, NoteReply } from '../components/NoteModals'
import type { NoteData } from '../components/NewNoteModal'
import BackButton from '../components/BackButton'
import { showToast } from '../components/AppLayout'


/* ═══════════════════════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════════════════════════ */
const PET_META: Record<string,{ emoji:string; name:string; borderColor:string; bg:string }> = {
  'pet-1':{ emoji:'🐱', name:'Luna', borderColor:'var(--pal-lilac)', bg:'var(--pal-lilac)' },
  'pet-2':{ emoji:'🐶', name:'Toby', borderColor:'var(--pal-sky)',   bg:'var(--pal-sky)'   },
  'pet-3':{ emoji:'🦜', name:'Kiwi', borderColor:'var(--pal-mauve)', bg:'var(--pal-mauve)' },
}
const TYPE_ICON:  Record<string,string> = {
  control:'🩺', observacion:'👁', emergencia:'🚨', vacuna:'💉', cirugia:'🔬', otro:'📋',
}
const TYPE_BADGE: Record<string,{ label:string; cls:string }> = {
  control:     { label:'Control',     cls:'badge-blue'   },
  observacion: { label:'Observación', cls:'badge-gray'   },
  emergencia:  { label:'Emergencia',  cls:'badge-red'    },
  vacuna:      { label:'Post-vacuna', cls:'badge-green'  },
  cirugia:     { label:'Cirugía',     cls:'badge-yellow' },
  otro:        { label:'Nota',        cls:'badge-gray'   },
}

/* Cuidador secundário de demo */
const ANA_M = {
  id:'user-am', name:'Ana M.', avatar:'AM',
  color:'var(--blue-hl)', colorFg:'var(--blue)',
}


/* ═══════════════════════════════════════════════════════════════
   INITIAL NOTES — com autores e respostas de exemplo
══════════════════════════════════════════════════════════════════ */
const INITIAL_NOTES: NoteEntry[] = [
  {
    id:'n-1', petId:'pet-1', type:'control', vet:'Dra. Martínez', date:'2026-01-10',
    content:'Luna en buen estado. Peso estable 4.2 kg. Revisar vacuna antirrábica próximamente. Se recomienda dieta balanceada.',
    archived:false,
    authorId:CURRENT_USER.id, authorName:CURRENT_USER.name,
    authorAvatar:CURRENT_USER.avatar, authorColor:CURRENT_USER.color, authorColorFg:CURRENT_USER.colorFg,
    replies:[
      {
        id:'r-1-1', authorId:ANA_M.id, authorName:ANA_M.name,
        authorAvatar:ANA_M.avatar, authorColor:ANA_M.color, authorColorFg:ANA_M.colorFg,
        content:'Programé la cita para la vacuna antirrábica el 15 de febrero. ¡Confirmado con la clínica!',
        date:'2026-01-12',
      },
    ],
  },
  {
    id:'n-2', petId:'pet-2', type:'emergencia', vet:'Dr. Sánchez', date:'2026-04-04',
    content:'Tos leve sin fiebre. Posible irritación traqueal. Mantener en observación 5-7 días. Si persiste, radiografía de tórax.',
    archived:false,
    authorId:ANA_M.id, authorName:ANA_M.name,
    authorAvatar:ANA_M.avatar, authorColor:ANA_M.color, authorColorFg:ANA_M.colorFg,
    replies:[
      {
        id:'r-2-1', authorId:CURRENT_USER.id, authorName:CURRENT_USER.name,
        authorAvatar:CURRENT_USER.avatar, authorColor:CURRENT_USER.color, authorColorFg:CURRENT_USER.colorFg,
        content:'Vi que esta tarde ya está más activo. La tos disminuyó bastante. Le daré otro día antes de llamar.',
        date:'2026-04-06',
      },
    ],
  },
  {
    id:'n-3', petId:'pet-3', type:'control', vet:'Dra. López', date:'2026-03-20',
    content:'Plumaje brillante, comportamiento activo. Peso 32g dentro del rango normal. Vacuna polyomavirus aplicada. Próxima revisión en 1 año.',
    archived:false,
    authorId:CURRENT_USER.id, authorName:CURRENT_USER.name,
    authorAvatar:CURRENT_USER.avatar, authorColor:CURRENT_USER.color, authorColorFg:CURRENT_USER.colorFg,
    replies:[],
  },
]


/* ═══════════════════════════════════════════════════════════════
   NOTE CARD
══════════════════════════════════════════════════════════════════ */
function NoteCard({ note, onClick, archived = false }: {
  note:NoteEntry; onClick:() => void; archived?:boolean
}) {
  const pm  = PET_META[note.petId]
  const tb  = TYPE_BADGE[note.type] ?? TYPE_BADGE.otro
  const ti  = TYPE_ICON[note.type]  ?? '📋'
  const replies = note.replies ?? []
  if (!pm) return null

  return (
    <div
      className={['card', archived ? 'note-card-archived' : ''].join(' ')}
      style={{ borderLeft:`4px solid ${archived ? 'var(--border)' : pm.borderColor}`, cursor:'pointer' }}
      onClick={onClick}
    >
      {/* ── Pet + tipo ──────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', gap:'.625rem', marginBottom:'.75rem' }}>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background: archived ? 'var(--surface-offset)' : pm.bg,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.1rem', flexShrink:0,
        }}>
          {pm.emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:'.875rem', color:'var(--text)' }}>{pm.name}</div>
          <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{ti} {note.vet || 'Sin veterinario'}</div>
        </div>
        <span style={{ fontSize:'.75rem', color:'var(--text-faint)', flexShrink:0 }}>
          {new Date(note.date + 'T12:00:00').toLocaleDateString('es-ES')}
        </span>
      </div>

      {/* ── Contenido ───────────────────────────────── */}
      <p style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.6 }}>
        {note.content.length > 140 ? note.content.slice(0,140) + '…' : note.content}
      </p>

      {/* ── Footer: autor + badges + replies ────────── */}
      <div style={{ marginTop:'.75rem', display:'flex', alignItems:'center', gap:'.375rem', flexWrap:'wrap' }}>
        {/* Autor */}
        {note.authorName && (
          <div style={{
            display:'flex', alignItems:'center', gap:'.3rem',
            background:'var(--surface-offset)', border:'1px solid var(--border)',
            borderRadius:'var(--r-full)', padding:'.15rem .5rem .15rem .25rem',
          }}>
            <div style={{
              width:18, height:18, borderRadius:'50%',
              background: note.authorColor ?? 'var(--primary-hl)',
              color: note.authorColorFg ?? 'var(--primary)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'.55rem', fontWeight:800,
            }}>
              {note.authorAvatar ?? note.authorName.slice(0,2)}
            </div>
            <span style={{ fontSize:'.72rem', fontWeight:700, color:'var(--text-muted)' }}>
              {note.authorId === CURRENT_USER.id ? 'Tú' : note.authorName}
            </span>
          </div>
        )}

        {/* Tipo */}
        <span className={`badge ${tb.cls}`}>{tb.label}</span>

        {/* Replies badge */}
        {replies.length > 0 && (
          <span className="badge badge-gray" style={{ marginLeft:'auto' }}>
            💬 {replies.length}
          </span>
        )}

        {archived && (
          <span className="badge badge-gray" style={{ opacity:.65 }}>📁 Archivada</span>
        )}
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   NOTES PAGE
══════════════════════════════════════════════════════════════════ */
export default function NotesPage() {
  const [notes,      setNotes]      = useState<NoteEntry[]>(INITIAL_NOTES)
  const [addOpen,    setAddOpen]    = useState(false)
  const [detailNote, setDetailNote] = useState<NoteEntry | null>(null)
  const [editNote,   setEditNote]   = useState<NoteEntry | null>(null)
  const [editOpen,   setEditOpen]   = useState(false)

  const active   = notes.filter(n => !n.archived)
  const archived = notes.filter(n =>  n.archived)

  /* ── Handlers ──────────────────────────────────────── */
  const handleAdd = (d: NoteData) => {
    const newNote: NoteEntry = {
      ...d,
      id:           `n-${Date.now()}`,
      archived:     false,
      replies:      [],
      /* Author = current user */
      authorId:     CURRENT_USER.id,
      authorName:   CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      authorColor:  CURRENT_USER.color,
      authorColorFg:CURRENT_USER.colorFg,
    }
    setNotes(prev => [newNote, ...prev])
  }

  const handleSaveEdit = (updated: NoteEntry) => {
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
  }

  const handleArchive   = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived:true  } : n))
    showToast('📁 Nota archivada')
  }
  const handleUnarchive = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived:false } : n))
    showToast('✓ Nota desarchivada')
  }
  const handleDelete    = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    showToast('🗑 Nota eliminada')
  }

  /* ── Reply: adiciona uma "nota dentro da nota" ───── */
  const handleAddReply = (noteId: string, reply: NoteReply) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId
        ? { ...n, replies: [...(n.replies ?? []), reply] }
        : n
    ))
    /* Actualiza o detalhe se estiver aberto */
    setDetailNote(prev =>
      prev?.id === noteId
        ? { ...prev, replies: [...(prev.replies ?? []), reply] }
        : prev
    )
  }


  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div>
          <div className="page-title">Notas</div>
          <div className="page-subtitle">Notas veterinarias y observaciones</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nueva nota
        </button>
      </div>

      {/* ── Notas activas ──────────────────────────────── */}
      <div className="grid-auto">
        {active.map(n => (
          <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} />
        ))}

        {/* Tarjeta añadir */}
        <div
          className="note-add-card"
          onClick={() => setAddOpen(true)}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setAddOpen(true)}
        >
          <div className="note-add-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="note-add-card-label">Nueva nota</div>
          <div className="note-add-card-sub">Control, observación o emergencia</div>
        </div>
      </div>

      {/* ── Archivadas ─────────────────────────────────── */}
      {archived.length > 0 && (
        <div className="notes-archived-section">
          <div className="notes-archived-title">
            <span>📁 Archivadas ({archived.length})</span>
          </div>
          <div className="grid-auto">
            {archived.map(n => (
              <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} archived />
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────── */}
      <NewNoteModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <NoteDetailModal
        note={detailNote}
        onClose={() => setDetailNote(null)}
        onEdit={n => { setDetailNote(null); setEditNote(n); setEditOpen(true) }}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
        onAddReply={handleAddReply}
      />

      <EditNoteModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        note={editNote}
        onSave={updated => { handleSaveEdit(updated); setEditOpen(false) }}
      />
    </div>
  )
}
```

## File: src/pages/SettingsPage.tsx
```typescript
import { useState, useRef } from 'react'
import { showToast } from '../components/AppLayout'
import { PfBtn } from '../components/FooterButtons'
import BackButton from '../components/BackButton'
import { useLanguage } from '../context/LanguageContext'
import { LANG_LABELS, type Lang } from '../i18n/translations'
import DeleteAccountModal from '../components/DeleteAccountModal'

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <button
      role="switch"
      aria-checked={on}
      style={{ width:40, height:22, borderRadius:99, background:on?'var(--primary)':'var(--border)', cursor:'pointer', position:'relative', flexShrink:0, transition:'background 200ms', border:'none' }}
      onClick={() => setOn(v => !v)}
    >
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:on?'calc(100% - 19px)':3, transition:'left 200ms' }}/>
    </button>
  )
}

function SettingsField({ icon, label, type='text', value, onChange, placeholder, multiline=false }: {
  icon:string; label:string; type?:string; value:string; onChange:(v:string)=>void; placeholder?:string; multiline?:boolean
}) {
  return (
    <div className="settings-form-field">
      <div className="settings-form-field-icon">{icon}</div>
      <div className="settings-form-field-inner">
        <div className="settings-form-field-label">{label}</div>
        {multiline
          ? <textarea className="settings-form-field-input" style={{ resize:'none', minHeight:52 }} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={2}/>
          : <input type={type} className="settings-form-field-input" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
        }
      </div>
    </div>
  )
}

function exportCSV(name: string, email: string) {
  const rows = [
    ['Campo','Valor'],['Nombre',name],['Email',email],['Mascotas','3'],
    ['Luna — Gato','Europeo común · 4 años · 4.2kg'],['Toby — Perro','Mestizo · 5 años · 12.4kg'],['Kiwi — Ave','Periquito · 2 años · 32g'],
    ['Vacunas registradas','8'],['Medicamentos activos','2'],['Síntomas en observación','1'],['Notas','3'],
    ['Exportado el',new Date().toLocaleString()],
  ]
  const csv  = rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href=url; a.download='pituti-datos.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ── Language Selector ─────────────────────────────────────────────
function LanguageSelector() {
  const { lang, setLang, t } = useLanguage()

  const langs: { code: Lang; flag: string; label: string }[] = [
    { code:'es', flag:'🇪🇸', label:'Español'   },
    { code:'en', flag:'🇬🇧', label:'English'   },
    { code:'pt', flag:'🇧🇷', label:'Português' },
  ]

  const handleChange = (code: Lang) => {
    setLang(code)
    showToast(t.toast.languageChanged)
  }

  return (
    <div style={{ display:'flex', gap:'.375rem', flexWrap:'wrap' }}>
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => handleChange(l.code)}
          style={{
            display: 'flex', alignItems: 'center', gap: '.375rem',
            padding: '.4rem .875rem',
            borderRadius: 'var(--r-full)',
            border: `1.5px solid ${lang===l.code ? 'var(--primary)' : 'var(--border)'}`,
            background: lang===l.code ? 'var(--primary-hl)' : 'var(--surface-offset)',
            color: lang===l.code ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: lang===l.code ? 800 : 600,
            fontSize: '.8125rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all var(--trans)',
            minHeight: 40,
          }}
        >
          <span style={{ fontSize:'1rem' }}>{l.flag}</span>
          {l.label}
          {lang===l.code && <span style={{ fontSize:'.65rem' }}>✓</span>}
        </button>
      ))}
    </div>
  )
}

export default function SettingsPage() {
  const { t, lang } = useLanguage()
  const s = t.settings

  const [name,   setName]   = useState('Thamires Lopes')
  const [email,  setEmail]  = useState('thamires@email.com')
  const [phone,  setPhone]  = useState('+34 600 000 000')
  const [bio,    setBio]    = useState('')
  const [city,   setCity]   = useState('Madrid, España')
  const [photoUrl,setPhotoUrl]=useState<string|null>(null)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [deleteOpen,setDeleteOpen]=useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]; if(!file)return
    const reader=new FileReader()
    reader.onload=ev=>{const r=ev.target?.result as string; if(r){setPhotoUrl(r);showToast(t.toast.photoUpdated)}}
    reader.readAsDataURL(file)
  }

  const handleSave=()=>{
    if(!name.trim())return; setSaving(true)
    setTimeout(()=>{setSaving(false);setSaved(true);showToast(t.toast.changesSaved);setTimeout(()=>setSaved(false),3000)},800)
  }

  const handleDeleteAccount=()=>{
    setDeleteOpen(false)
    showToast('Hasta pronto.','err')
    setTimeout(()=>{try{localStorage.clear()}catch{}},2000)
  }

  const initials=name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('')

  return (
    <div>
      <BackButton label={t.btn.back}/>
      <div className="page-header">
        <div><div className="page-title">{s.title}</div><div className="page-subtitle">{s.subtitle}</div></div>
      </div>

      {/* Profile hero */}
      <div className="settings-profile-hero">
        <div className="settings-avatar-wrap">
          <div className="settings-avatar">{photoUrl?<img src={photoUrl} alt={name}/>:<span>{initials}</span>}</div>
          <button className="settings-avatar-btn" onClick={()=>photoRef.current?.click()} title={s.changePhoto}>📷</button>
          <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange}/>
        </div>
        <div className="settings-profile-info">
          <div className="settings-profile-name">{name||s.fullNamePlaceholder}</div>
          <div className="settings-profile-email">{email}</div>
          <div className="settings-profile-joined">{city&&`📍 ${city} · `}{lang==='es'?'Miembro desde enero 2026 · 3 mascotas':lang==='en'?'Member since January 2026 · 3 pets':'Membro desde janeiro 2026 · 3 mascotes'}</div>
        </div>
        <div style={{ display:'flex',gap:'.5rem',flexDirection:'column',alignSelf:'flex-start',flexShrink:0 }}>
          <span className="badge badge-green">✓ {lang==='es'?'Cuenta activa':lang==='en'?'Active account':'Conta ativa'}</span>
          <span className="badge badge-blue">🐾 3 {lang==='es'?'mascotas':lang==='en'?'pets':'mascotes'}</span>
        </div>
      </div>

      <div className="settings-layout">
        {/* ── Datos personales ── */}
        <div className="settings-card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'1rem 1.375rem .875rem', borderBottom:'1.5px solid var(--divider)', display:'flex', alignItems:'center', gap:'.625rem', background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
            <div style={{ width:34,height:34,borderRadius:'var(--r-md)',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem' }}>👤</div>
            <div>
              <div style={{ fontWeight:800,fontSize:'.9375rem',color:'var(--text)' }}>{s.personalData}</div>
              <div style={{ fontSize:'.75rem',color:'var(--text-muted)' }}>{s.personalSubtitle}</div>
            </div>
          </div>
          {/* Photo row */}
          <div style={{ display:'flex',alignItems:'center',gap:'1rem',padding:'.875rem 1.375rem',borderBottom:'1px solid var(--divider)',background:'var(--bg)' }}>
            <div style={{ width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,var(--pal-lilac),var(--pal-denim))',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:800,color:'var(--nav-bg)',flexShrink:0 }}>
              {photoUrl?<img src={photoUrl} alt={name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:initials}
            </div>
            <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:'.875rem',color:'var(--text)' }}>{s.profilePhoto}</div><div style={{ fontSize:'.75rem',color:'var(--text-muted)' }}>{s.photoHint}</div></div>
            <PfBtn variant="edit" size="sm" onClick={()=>photoRef.current?.click()}>{s.changePhoto}</PfBtn>
          </div>
          {/* Fields */}
          <div style={{ display:'flex',flexDirection:'column' }}>
            <SettingsField icon="🪪" label={s.fullName} value={name} onChange={setName} placeholder={s.fullNamePlaceholder}/>
            <SettingsField icon="✉️" label={s.email} type="email" value={email} onChange={setEmail} placeholder="nombre@email.com"/>
            <SettingsField icon="📱" label={s.phone} type="tel" value={phone} onChange={setPhone} placeholder={s.phonePlaceholder}/>
            <SettingsField icon="📍" label={s.city} value={city} onChange={setCity} placeholder={s.cityPlaceholder}/>
            <SettingsField icon="💬" label={s.about} value={bio} onChange={setBio} placeholder={s.aboutPlaceholder} multiline/>
          </div>
          {/* Footer */}
          <div style={{ padding:'.875rem 1.375rem',borderTop:'1.5px solid var(--divider)',background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'.5rem' }}>
            {saved&&<div style={{ display:'flex',alignItems:'center',gap:'.375rem',fontSize:'.8125rem',color:'var(--success)',fontWeight:700,marginRight:'auto' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
              {s.saved}
            </div>}
            <PfBtn variant="cancel" size="sm" onClick={()=>{setName('Thamires Lopes');setEmail('thamires@email.com');setPhone('+34 600 000 000');setBio('');setCity('Madrid, España')}}>{t.btn.discard}</PfBtn>
            <PfBtn variant="save" size="sm" loading={saving} onClick={handleSave}>{t.btn.saveChanges}</PfBtn>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex',flexDirection:'column',gap:'1.125rem' }}>
          <div className="settings-card">
            <div className="settings-card-title"><span>🎨</span> {s.appearance}</div>
            <div className="notif-row">
              <div className="notif-row-info"><div className="notif-row-label">{s.theme}</div><div className="notif-row-sub">{s.themeHint}</div></div>
              <button className="btn btn-secondary btn-sm" style={{ minHeight:40 }} onClick={()=>{const d=document.documentElement;d.setAttribute('data-theme',d.getAttribute('data-theme')==='dark'?'light':'dark');showToast(t.toast.themeChanged)}}>{s.changeTheme}</button>
            </div>
            {/* ── Language switcher — FUNCTIONAL ── */}
            <div className="notif-row" style={{ borderBottom:'none', flexWrap:'wrap', gap:'.75rem' }}>
              <div className="notif-row-info" style={{ flexShrink:0 }}>
                <div className="notif-row-label">{s.language}</div>
                <div className="notif-row-sub">{s.languageHint}</div>
              </div>
              <LanguageSelector/>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title"><span>🔔</span> {s.notifications}</div>
            {[
              { label:s.vaccineAlert,  sub:s.vaccineAlertHint,  on:true  },
              { label:s.medAlert,      sub:s.medAlertHint,      on:true  },
              { label:s.symptomAlert,  sub:s.symptomAlertHint,  on:true  },
              { label:s.weeklyDigest,  sub:s.weeklyDigestHint,  on:false },
              { label:s.urgentAlerts,  sub:s.urgentAlertsHint,  on:true  },
            ].map(n=>(
              <div key={n.label} className="notif-row">
                <div className="notif-row-info"><div className="notif-row-label">{n.label}</div><div className="notif-row-sub">{n.sub}</div></div>
                <Toggle initial={n.on}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings-card" style={{ marginTop:'1.125rem', borderColor:'rgba(200,64,106,.25)' }}>
        <div className="settings-card-title" style={{ color:'var(--err)' }}><span>⚠️</span> {s.dangerZone}</div>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--divider)',marginBottom:'1rem',flexWrap:'wrap' }}>
          <div style={{ flex:1,minWidth:200 }}><div style={{ fontSize:'.875rem',fontWeight:700,color:'var(--text)' }}>{s.exportData}</div><div style={{ fontSize:'.75rem',color:'var(--text-muted)',marginTop:'.2rem' }}>{s.exportHint}</div></div>
          <PfBtn variant="archive" size="sm" onClick={()=>{exportCSV(name,email);showToast(t.toast.csvDownloaded)}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {s.exportBtn}
          </PfBtn>
        </div>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap' }}>
          <div style={{ flex:1,minWidth:200 }}><div style={{ fontSize:'.875rem',fontWeight:700,color:'var(--err)' }}>{s.deleteAccount}</div><div style={{ fontSize:'.75rem',color:'var(--text-muted)',marginTop:'.2rem' }}>{s.deleteHint}</div></div>
          <PfBtn variant="delete" size="sm" onClick={()=>setDeleteOpen(true)}>{s.deleteBtn}</PfBtn>
        </div>
      </div>

      <DeleteAccountModal isOpen={deleteOpen} onClose={()=>setDeleteOpen(false)} onConfirm={handleDeleteAccount}/>
    </div>
  )
}
```

## File: src/pages/SymptomsPage.tsx
```typescript
import { useState } from 'react'
import { showToast } from '../components/AppLayout'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import { useSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'
import type { SymptomData } from '../components/RegisterSymptomModal'
import BackButton from '../components/BackButton'

const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }
const SEV_ICON:  Record<string,string> = { leve:'🟡', moderado:'🟠', grave:'🔴', emergencia:'🚨' }
const SEV_BADGE: Record<string,string> = { leve:'badge-yellow', moderado:'badge-yellow', grave:'badge-red', emergencia:'badge-red' }
const CAT_ICON:  Record<string,string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }
const SEV_COLOR: Record<string,string> = { leve:'var(--gold)', moderado:'var(--warn)', grave:'var(--err)', emergencia:'var(--err)' }
const SEV_BG:    Record<string,string> = { leve:'var(--gold-hl)', moderado:'var(--warn-hl)', grave:'var(--err-hl)', emergencia:'var(--err-hl)' }

function PencilIcon({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}

export default function SymptomsPage() {
  const { symptoms, addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const [addOpen,   setAddOpen]   = useState(false)
  const [detailSym, setDetailSym] = useState<SymptomEntry | null>(null)
  const [editSym,   setEditSym]   = useState<SymptomEntry | null>(null)
  const [editOpen,  setEditOpen]  = useState(false)

  const active   = symptoms.filter(s => !s.resolved)
  const resolved = symptoms.filter(s =>  s.resolved)

  const openEdit = (s: SymptomEntry) => { setEditSym(s); setEditOpen(true) }

  const handleAdd = (d: SymptomData) => {
    addSymptom({ ...d, resolved: false })
    showToast(`${SEV_ICON[d.severity]??'🌡️'} Síntoma registrado`)
  }

  const SymptomRow = ({ s, dim = false }: { s: SymptomEntry; dim?: boolean }) => (
    <div className="list-item symptom-row-clickable" style={{ opacity:dim?.7:1 }} onClick={() => setDetailSym(s)}>
      <div className="list-item-icon" style={{ background:dim?'var(--surface-offset)':SEV_BG[s.severity]||'var(--err-hl)', color:dim?'var(--text-faint)':SEV_COLOR[s.severity]||'var(--err)' }}>
        {CAT_ICON[s.category]??'🌡️'}
      </div>
      <div className="list-item-info">
        <div className="list-item-title">
          {SEV_ICON[s.severity]} {s.description.slice(0,40)}{s.description.length>40?'…':''} — {PET_EMOJI[s.petId]} {PET_NAME[s.petId]}
        </div>
        <div className="list-item-sub">
          {new Date(s.date+'T12:00:00').toLocaleDateString('es-ES')} · {s.category}{s.resolved?' · Resuelto':' · En observación'}
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'.25rem',alignItems:'flex-end',flexShrink:0 }}>
        <span className={`badge ${s.resolved?'badge-gray':SEV_BADGE[s.severity]??'badge-yellow'}`}>
          {s.resolved?'Resuelto':'Activo'}
        </span>
        <button className="med-edit-btn" style={{ width:26,height:26 }} title="Editar"
          onClick={e=>{e.stopPropagation();openEdit(s)}}>
          <PencilIcon size={12}/>
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Síntomas</div><div className="page-subtitle">Observaciones de comportamiento y salud</div></div>
        <button className="btn btn-primary" onClick={()=>setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Registrar síntoma
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Activos {active.length>0&&<span className="badge badge-red">{active.length} en obs.</span>}</div>
          {active.length===0
            ?<div style={{ textAlign:'center',padding:'2rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin síntomas activos ✓</div>
            :active.map(s=><SymptomRow key={s.id} s={s}/>)
          }
        </div>
        <div className="card">
          <div className="card-title">Resueltos</div>
          {resolved.length===0
            ?<div style={{ textAlign:'center',padding:'2rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin síntomas resueltos</div>
            :resolved.map(s=><SymptomRow key={s.id} s={s} dim/>)
          }
        </div>
      </div>

      <div className="card" style={{ marginTop:'1.125rem' }}>
        <div className="card-title">Historial</div>
        <div className="timeline">
          {[...active,...resolved].slice(0,8).map(s=>(
            <div key={s.id} className="timeline-item symptom-row-clickable" onClick={()=>setDetailSym(s)}>
              <div className="tl-icon symptom">{CAT_ICON[s.category]??'🌡️'}</div>
              <div style={{ flex:1 }}>
                <div className="tl-title">{s.description.slice(0,50)}{s.description.length>50?'…':''} · {PET_EMOJI[s.petId]} {PET_NAME[s.petId]}</div>
                <div className="tl-meta">{s.resolved?'Resuelto':'En observación'} · {s.category}</div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'.25rem' }}>
                <div className="tl-time">{new Date(s.date+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short'})}</div>
                <button className="med-edit-btn" style={{ width:24,height:24 }} onClick={e=>{e.stopPropagation();openEdit(s)}}><PencilIcon size={11}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegisterSymptomModal isOpen={addOpen} onClose={()=>setAddOpen(false)} onAdd={handleAdd}/>

      <SymptomDetailModal
        symptom={detailSym}
        onClose={()=>setDetailSym(null)}
        onEdit={s=>{setDetailSym(null);openEdit(s)}}
        onResolve={id=>{resolve(id);showToast('✓ Síntoma resuelto')}}
        onUnresolve={id=>{unresolve(id);showToast('↩ Síntoma reabierto')}}
      />

      <EditSymptomModal
        isOpen={editOpen}
        onClose={()=>setEditOpen(false)}
        symptom={editSym}
        onSave={updated=>{saveSymptom(updated);setEditOpen(false)}}
      />
    </div>
  )
}
```

## File: src/pages/DashboardPage.tsx
```typescript
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PALETTE_COLORS, SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { usePituti, useCares } from '../context/PitutiContext'
import CareDetailModal from '../components/CareDetailModal'
import type { CareDetailItem } from '../components/CareDetailModal'
import EditCareModal from '../components/EditCareModal'
import type { CareEditData } from '../components/EditCareModal'
import { SymptomDetailModal } from '../components/SymptomModals'
import type { SymptomEntry } from '../components/SymptomModals'

function useGreeting() {
  const [text, setText] = useState({ saludo:'¡Bienvenida, Thamires!', date:'' })
  useEffect(() => {
    const now=new Date(); const h=now.getHours()
    const saludo=h<12?'¡Buenos días':h<19?'¡Buenas tardes':'¡Buenas noches'
    const days=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
    const months=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    setText({ saludo:`${saludo}, Thamires!`, date:`${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}` })
  }, [])
  return text
}

const SLOT_CLASSES = ['paw-bubble paw-main','paw-bubble paw-toe paw-toe-1','paw-bubble paw-toe paw-toe-2','paw-bubble paw-toe paw-toe-3','paw-bubble paw-toe paw-toe-4']

function buildSlots(pets: PetWithAlerts[]) {
  return Array.from({ length:5 }, (_,i) => {
    const pet = pets.length===1 && i>0 ? null : (pets[i]??null)
    return { pet: pets.length===1?(i===0?pets[0]:null):pet, paletteColor:PALETTE_COLORS[i%PALETTE_COLORS.length] }
  })
}

function PawLayout({ pets, onPetClick }: { pets: PetWithAlerts[]; onPetClick: (id:string)=>void }) {
  const photos: Record<string,string> = {}
  try { Object.keys(localStorage).filter(k=>k.startsWith('pet-photo-')).forEach(k=>{ photos[k.replace('pet-photo-','')] = localStorage.getItem(k)! }) } catch {}

  if (!pets.length) return (
    <div className="paw-layout" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="paw-empty"><div className="paw-empty-icon">🐾</div><p>Añade tu primera mascota</p></div>
    </div>
  )
  return (
    <div className="paw-layout">
      {buildSlots(pets).map((slot, i) => {
        const photo = slot.pet ? (photos[slot.pet.id] || null) : null
        const highestAlert = slot.pet?.alerts.find(a=>a.type==='err') ?? slot.pet?.alerts[0]
        return (
          <div key={i} className={SLOT_CLASSES[i]} style={!slot.pet?{cursor:'default'}:undefined}
            onClick={slot.pet ? () => onPetClick(slot.pet!.id) : undefined}>
            <div className="paw-bubble-clip" style={{ background:photo?undefined:slot.paletteColor, fontSize:i===0?'3rem':'1.4rem' }}>
              {photo ? <img src={photo} alt={slot.pet?.name} loading="lazy"/> : <span>{slot.pet?SPECIES_EMOJI[slot.pet.species]??'🐾':''}</span>}
            </div>
            {highestAlert && <div className={`paw-dot ${highestAlert.type}`}/>}
            {slot.pet && <div className="paw-pet-name">{slot.pet.name}</div>}
          </div>
        )
      })}
    </div>
  )
}

interface CareStripProps { emoji:string; label:string; total?:number; doneInit?:number; urgent?:boolean; onDoneChange?:(d:number)=>void; onClick?:()=>void }
function CareStripItem({ emoji, label, total=1, doneInit=0, urgent=false, onDoneChange, onClick }: CareStripProps) {
  const [doneCount, setDoneCount] = useState(doneInit)
  const allDone = doneCount >= total
  const cls = ['care-strip-item', allDone?'done':urgent&&doneCount===0?'urgent':''].join(' ')
  const toggle = (i:number) => { setDoneCount(prev=>{ const next=i===prev?prev+1:i===prev-1?prev-1:prev; onDoneChange?.(next); return next }) }
  return (
    <div className={cls} onClick={onClick} style={{ cursor:onClick?'pointer':undefined }}>
      <span className="care-emoji">{emoji}</span>
      <span className="care-label">{label}</span>
      <span className="care-dots" onClick={e=>e.stopPropagation()}>
        {Array.from({length:total}).map((_,i)=>(
          <button key={i} className={['care-dot-btn',i<doneCount?'filled':''].join(' ')} onClick={()=>toggle(i)}>
            {i<doneCount?'✓':'○'}
          </button>
        ))}
      </span>
    </div>
  )
}

interface DashCareItem { id:string; petId:string; emoji:string; label:string; total:number; done:number; title:string; sub:string; bg:string; done_state:boolean }
const INITIAL: DashCareItem[] = [
  { id:'pet-1_food', petId:'pet-1', emoji:'🍽️', label:'Luna · comida',    title:'Alimentación', sub:'2× día · 80g', total:2, done:0, bg:'linear-gradient(135deg,#FFF3DC,#FFE0A0)', done_state:false },
  { id:'pet-2_water',petId:'pet-2', emoji:'💧', label:'Toby · agua',      title:'Agua',         sub:'3× día',       total:3, done:2, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state:false },
  { id:'pet-2_walk', petId:'pet-2', emoji:'🏃', label:'Toby · paseo',     title:'Paseo',        sub:'2× día',       total:2, done:0, bg:'linear-gradient(135deg,#E8FFE8,#B8F0B8)', done_state:false },
  { id:'pet-3_water',petId:'pet-3', emoji:'💧', label:'Kiwi · agua',      title:'Agua',         sub:'2× día',       total:2, done:2, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state:true  },
  { id:'pet-1_brush',petId:'pet-1', emoji:'✂️', label:'Luna · cepillado', title:'Cepillado',    sub:'1× semana',    total:1, done:0, bg:'linear-gradient(135deg,#F0E8FF,#DDD0FF)', done_state:false },
  { id:'pet-1_water',petId:'pet-1', emoji:'💧', label:'Luna · agua',      title:'Agua',         sub:'2× día',       total:2, done:1, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state:false },
]

// Mock active symptom for dashboard
const MOCK_SYMPTOM: SymptomEntry = {
  id:'s-1', petId:'pet-2', description:'Tos suave sin fiebre. Parece cansado desde hace 3 días.', category:'respiratorio', severity:'moderado', date:'2026-04-18', notes:'No tiene fiebre. Come normal.', resolved:false,
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { state } = usePituti()
  const { pets, loading } = { pets:state.pets, loading:state.petsLoading }
  const { setCaredone } = useCares()
  const { saludo, date } = useGreeting()
  const allAlerts = pets.flatMap(p => p.alerts.map(a => ({ ...a, petName:p.name })))

  const [dashCares,    setDashCares]    = useState<DashCareItem[]>(INITIAL)
  const [detailItem,   setDetailItem]   = useState<CareDetailItem | null>(null)
  const [editCareItem, setEditCareItem] = useState<CareEditData | null>(null)
  const [editCareOpen, setEditCareOpen] = useState(false)
  const [symptomDetail,setSymptomDetail]= useState<SymptomEntry | null>(null)

  const handleCareToggle = useCallback((id:string, newDone:number, newState:boolean) => {
    setDashCares(prev => prev.map(c => c.id!==id?c:{...c,done:newDone,done_state:newState}))
    setCaredone(id, newDone)
  }, [setCaredone])

  const openDetail = (c: DashCareItem) => {
    setDetailItem({ id:c.id, petId:c.petId, emoji:c.emoji, title:c.title, sub:c.sub, total:c.total, done:c.done, done_state:c.done_state, bg:c.bg })
  }

  const handleSaveCare = (updated: CareEditData) => {
    setDashCares(prev => prev.map(c => c.id!==updated.id?c:{ ...c, emoji:updated.emoji, title:updated.title, total:updated.total, label:`${c.label.split('·')[0].trim()} · ${updated.title.toLowerCase()}`, sub:`${updated.total}× ${updated.period==='day'?'día':'semana'}${updated.quantity?' · '+updated.quantity:''}` }))
  }

  const openCalendarAt = (dateStr: string) => navigate('/vaccines', { state: { initialDate:dateStr } })

  return (
    <div className="dash-mockup-grid">

      <div className="dash-col-left">
        <div className="dash-greeting">
          <div className="greeting-name">{saludo}</div>
          <div className="greeting-date">{date}</div>
        </div>
        <div className="paw-wrapper">
          {loading
            ? <div className="paw-layout" style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontSize:'.875rem' }}>Cargando…</div>
            : <PawLayout pets={pets} onPetClick={id => navigate(`/pets/${id}`)}/>
          }
          {allAlerts.length===0 && <div className="paw-caption">Todo en día ✓</div>}
        </div>
      </div>

      <div className="dash-col-center">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom:0 }}>Cuidados de hoy</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cares')}>Ver todos →</button>
        </div>
        <div style={{ fontSize:'.75rem', color:'var(--text-muted)', fontWeight:700, marginBottom:'.625rem' }}>
          Hoy — <span style={{ color:'var(--err)' }}>{dashCares.filter(c=>!c.done_state).length} pendientes</span>
        </div>
        <div className="dash-care-col">
          {dashCares.map(c => (
            <CareStripItem key={c.id} emoji={c.emoji} label={c.label} total={c.total} doneInit={c.done}
              urgent={c.done===0&&(c.id.includes('food')||c.id.includes('walk'))}
              onDoneChange={done => handleCareToggle(c.id, done, done>=c.total)}
              onClick={() => openDetail(c)}
            />
          ))}
        </div>
      </div>

      <div className="dash-col-eventos">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom:0 }}>Próximos eventos</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vaccines')}>Ver todos →</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {[
            { day:'23', mon:'ABR', icon:'💉', bg:'var(--err-hl)',  color:'var(--err)',  title:'Vacuna antirrábica — Luna', sub:'Vence pronto',  badge:'URGENTE', badgeCls:'badge-red',    urgent:true, date:'2026-04-23' },
            { day:'30', mon:'ABR', icon:'💊', bg:'var(--warn-hl)', color:'var(--warn)', title:'Pipeta antipulgas — Toby',  sub:'17 días',        badge:'EN 17d',  badgeCls:'badge-yellow',             date:'2026-04-30' },
            { day:'05', mon:'JUN', icon:'💉', bg:'var(--gold-hl)', color:'var(--gold)', title:'Antirrábica — Toby',        sub:'53 días',        badge:'2 MESES', badgeCls:'badge-yellow',             date:'2026-06-05' },
          ].map((ev,i) => (
            <div key={i} className={`event-row${ev.urgent?' event-urgent':''}`}
              onClick={() => openCalendarAt(ev.date)} title="Ver en calendario">
              <div className="event-date-badge"><div className="edb-day">{ev.day}</div><div className="edb-mon">{ev.mon}</div></div>
              <div className="event-icon" style={{ background:ev.bg, color:ev.color }}>{ev.icon}</div>
              <div className="event-info"><div className="event-title">{ev.title}</div><div className="event-sub">{ev.sub}</div></div>
              <span className={`badge ${ev.badgeCls}`}>{ev.badge}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-col-right">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom:0 }}>Alertas</div>
        </div>
        <div className="dash-kpi-col">
          {[
            { val:pets.length, label:'Mascotas',     sub:null,           color:'',              to:'/pets'        },
            { val:8,           label:'Vacunas',      sub:'⚠ 1 a vencer', color:'var(--warn)',   to:'/vaccines'    },
            { val:2,           label:'Medicamentos', sub:'● Activos',     color:'var(--success)',to:'/medications' },
            { val:1,           label:'Síntomas',     sub:'● Toby',        color:'var(--err)',    to:'/symptoms'    },
          ].map(k => (
            <div key={k.label} className="paw-kpi" style={{ cursor:'pointer' }}
              onClick={() => k.label==='Síntomas' ? setSymptomDetail(MOCK_SYMPTOM) : navigate(k.to)}>
              <div className="paw-kpi-value">{k.val}</div>
              <div className="paw-kpi-label">{k.label}</div>
              {k.sub && <div className="paw-kpi-sub" style={{ color:k.color }}>{k.sub}</div>}
            </div>
          ))}
        </div>
        {allAlerts.length > 0 && (
          <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {allAlerts.map((a,i) => (
              <div key={i} className={`paw-alert ${a.type}`}
                style={{ cursor: a.type==='err'?'pointer':undefined }}
                onClick={() => a.type==='err' ? setSymptomDetail(MOCK_SYMPTOM) : undefined}>
                <span className="paw-alert-icon">{a.type==='warn'?'⚠️':'🔴'}</span>
                <span className="paw-alert-text"><strong>{a.petName} </strong>{a.text}</span>
              </div>
            ))}
          </div>
        )}
        {allAlerts.length===0 && <div className="paw-caption" style={{ marginTop:'1rem' }}>Sin alertas activas ✓</div>}
      </div>

      {/* Care detail overlay */}
      {detailItem && (
        <CareDetailModal item={detailItem} onClose={() => setDetailItem(null)}
          onToggle={(id,newDone,newState) => { handleCareToggle(id,newDone,newState); setDetailItem(prev=>prev?{...prev,done:newDone,done_state:newState}:null) }}
          onEdit={item => { setEditCareItem({id:item.id,emoji:item.emoji,title:item.title,total:item.total,period:'day',quantity:'',notify:true,bg:item.bg}); setEditCareOpen(true) }}
        />
      )}

      {/* Edit care */}
      <EditCareModal isOpen={editCareOpen} onClose={() => setEditCareOpen(false)} care={editCareItem}
        onSave={u => { handleSaveCare(u); setEditCareOpen(false) }}
        onDelete={id => { setDashCares(prev=>prev.filter(c=>c.id!==id)); setEditCareOpen(false) }}
      />

      {/* Symptom detail overlay */}
      <SymptomDetailModal
        symptom={symptomDetail}
        onClose={() => setSymptomDetail(null)}
        onEdit={() => { setSymptomDetail(null); navigate('/symptoms') }}
        onResolve={() => { setSymptomDetail(null); import('../components/AppLayout').then(m=>m.showToast('✓ Síntoma marcado como resuelto')) }}
        onUnresolve={() => setSymptomDetail(null)}
      />
    </div>
  )
}
```

## File: src/pages/VaccinesPage.tsx
```typescript
import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MOCK_PETS, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { RegisterVaccineModal } from './PetDetailPage'
import VaccRing from '../components/VaccRing'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import BackButton from '../components/BackButton'

const PET_EMOJI: Record<string,string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

// ── Fixed date builder — avoids UTC timezone shifts ───────────────
const pad = (n: number) => String(n).padStart(2, '0')
const buildDateStr = (y: number, m: number, d: number) => `${y}-${pad(m+1)}-${pad(d)}`

// ── "Vence pronto" is now amber/yellow ───────────────────────────
const STATUS_COLOR = {
  late: 'var(--err)',
  soon: '#d48e00',    // amber, clearly yellow-toned
  ok:   'var(--success)',
  med:  'var(--blue)',
}
const STATUS_BG = {
  late: 'var(--err-hl)',
  soon: '#fff8d6',
  ok:   'var(--success-hl)',
  med:  'var(--blue-hl)',
}

const HARDCODED_MEDS = [
  { date:'2026-04-30', petId:'pet-2', label:'Pipeta antipulgas' },
  { date:'2026-07-10', petId:'pet-1', label:'Bravecto'          },
]

const WEEKDAYS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface CalEvent {
  type:    'vaccine'|'medication'
  petName: string; petEmoji: string; label: string
  status:  'ok'|'soon'|'late'; color: string; bgColor: string;   careId?: string 
}

type VaccineWithMeta = VaccineRecord & { cls:'ok'|'soon'|'late'; petName:string; petEmoji:string; petId:string }

// ── Build color given status ──────────────────────────────────────
const eventColor  = (s: 'ok'|'soon'|'late') => s==='late'?STATUS_COLOR.late:s==='soon'?STATUS_COLOR.soon:STATUS_COLOR.ok
const eventBg     = (s: 'ok'|'soon'|'late') => s==='late'?STATUS_BG.late  :s==='soon'?STATUS_BG.soon  :STATUS_BG.ok

function VaccinesCalendar({ allVaccines, extraVacc, initialDate }: {
  allVaccines: VaccineWithMeta[]
  extraVacc: Record<string,VaccineRecord[]>
  initialDate?: string
}) {
  const today    = new Date()
  const todayStr = buildDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewMonth,   setViewMonth]   = useState(() => {
    if (initialDate) { const [y,m]=initialDate.split('-').map(Number); return new Date(y,m-1,1) }
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string|null>(initialDate??null)

  useEffect(() => {
    if (initialDate) {
      const [y,m] = initialDate.split('-').map(Number)
      setViewMonth(new Date(y,m-1,1)); setSelectedDay(initialDate)
    }
  }, [initialDate])

  const eventMap = useMemo(() => {
    const map: Record<string,CalEvent[]> = {}
    const add = (ds:string, ev:CalEvent) => { if(!map[ds]) map[ds]=[]; map[ds].push(ev) }
    for (const v of allVaccines) {
      if (!v.nextDate) continue
      add(v.nextDate, { type:'vaccine', petName:v.petName, petEmoji:v.petEmoji, label:v.name, status:v.cls, color:eventColor(v.cls), bgColor:eventBg(v.cls) })
    }
    for (const m of HARDCODED_MEDS) {
      const pet=MOCK_PETS.find(p=>p.id===m.petId); if(!pet) continue
      add(m.date, { type:'medication', petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:m.label, status:'ok', color:STATUS_COLOR.med, bgColor:STATUS_BG.med })
    }
    return map
  }, [allVaccines])

  const cells = useMemo(() => {
    const year=viewMonth.getFullYear(), month=viewMonth.getMonth()
    const firstDow=(new Date(year,month,1).getDay()+6)%7
    const days=new Date(year,month+1,0).getDate()
    const result:(null|{d:number;dateStr:string})[] = []
    for(let i=0;i<firstDow;i++) result.push(null)
    for(let d=1;d<=days;d++) result.push({ d, dateStr:buildDateStr(year,month,d) })
    return result
  }, [viewMonth])

  const selectedEvents = selectedDay ? (eventMap[selectedDay]??[]) : []

  return (
    <div className="vacc-cal">
      <div className="vacc-cal-header">
        <button className="vacc-cal-nav" onClick={()=>setViewMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="vacc-cal-month-title">{MONTHS_ES[viewMonth.getMonth()]} {viewMonth.getFullYear()}</div>
        <button className="vacc-cal-nav" onClick={()=>setViewMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <button className="vacc-cal-today-btn" onClick={()=>{setViewMonth(new Date(today.getFullYear(),today.getMonth(),1));setSelectedDay(todayStr)}}>Hoy</button>
      </div>

      <div className="vacc-cal-weekdays">{WEEKDAYS.map(d=><div key={d} className="vacc-cal-wd">{d}</div>)}</div>

      <div className="vacc-cal-grid">
        {cells.map((cell,i) => {
          if (!cell) return <div key={`p${i}`} className="vacc-cal-pad"/>
          const evts=eventMap[cell.dateStr]??[]; const isToday=cell.dateStr===todayStr; const isSel=cell.dateStr===selectedDay
          return (
            <div key={cell.dateStr}
              className={['vacc-cal-day',isToday?'is-today':'',isSel?'is-selected':'',evts.length>0?'has-events':''].join(' ')}
              onClick={()=>setSelectedDay(isSel?null:cell.dateStr)}>
              <span className={['vacc-cal-day-num',isToday?'today-circle':''].join(' ')}>{cell.d}</span>
              {evts.length>0 && (
                <div className="vacc-cal-dots">
                  {evts.slice(0,4).map((e,j)=><span key={j} className="vacc-cal-dot" style={{ background:e.color }}/>)}
                  {evts.length>4&&<span style={{ fontSize:'.5rem',color:'var(--text-faint)',fontWeight:800 }}>+{evts.length-4}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend with yellow for soon */}
      <div className="vacc-cal-legend">
        {[
          { color:STATUS_COLOR.late, label:'Vencida / Urgente'  },
          { color:STATUS_COLOR.soon, label:'Vence pronto (30d)' },
          { color:STATUS_COLOR.ok,   label:'Al día'             },
          { color:STATUS_COLOR.med,  label:'Medicamento'        },
        ].map(l=>(
          <div key={l.label} className="vacc-cal-legend-item">
            <span className="vacc-cal-dot" style={{ background:l.color,width:8,height:8 }}/>{l.label}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="vacc-cal-panel">
          <div className="vacc-cal-panel-header">
            <span className="vacc-cal-panel-date">
              {new Date(selectedDay+'T12:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}
            </span>
            <button className="vacc-cal-panel-close" onClick={()=>setSelectedDay(null)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {selectedEvents.length===0
            ?<div style={{ padding:'1.25rem',textAlign:'center',color:'var(--text-faint)',fontSize:'.875rem' }}>Sin eventos este día ✓</div>
            :<div className="vacc-cal-event-list">
              {selectedEvents.map((ev,i)=>(
                <div key={i} className="vacc-cal-event-row">
                  <div className="vacc-cal-event-type-dot" style={{ background:ev.color }}/>
                  <div className="vacc-cal-event-icon" style={{ background:ev.bgColor }}>{ev.type==='vaccine'?'💉':'💊'}</div>
                  <div style={{ flex:1 }}><div className="vacc-cal-event-label">{ev.label}</div><div className="vacc-cal-event-pet">{ev.petEmoji} {ev.petName}</div></div>
                  <span className="badge" style={{ background:ev.bgColor, color:ev.color, fontSize:'.65rem', border:`1px solid ${ev.color}44` }}>
                    {ev.type==='vaccine'?(ev.status==='late'?'Vencida':ev.status==='soon'?'Pronto':'Al día'):'Med.'}
                  </span>
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  )
}

function PencilIcon({ size=13 }: { size?:number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}

export default function VaccinesPage() {
  const location    = useLocation()
  const initialDate = (location.state as {initialDate?:string}|null)?.initialDate

  const [selectedPetId, setSelectedPetId] = useState(MOCK_PETS[0].id)
  const [registerOpen,  setRegisterOpen]  = useState(false)
  const [extraVacc,     setExtraVacc]     = useState<Record<string,VaccineRecord[]>>({})
  const [detailVaccine, setDetailVaccine] = useState<(VaccineRecord&{cls:'ok'|'soon'|'late';petName:string;petEmoji:string})|null>(null)
  const [editVaccine,   setEditVaccine]   = useState<VaccineRecord|null>(null)
  const [editOpen,      setEditOpen]      = useState(false)

  const getVacc = (petId:string) => [...(VACCINES_BY_PET[petId]??[]), ...(extraVacc[petId]??[])]
  const pet        = MOCK_PETS.find(p=>p.id===selectedPetId)??MOCK_PETS[0]
  const vaccines   = getVacc(selectedPetId)
  const withStatus = vaccines.map(v=>({...v, cls:getVaccStatus(v.nextDate) as 'ok'|'soon'|'late'}))

  // ALL pets vaccines for calendar — this is what fixes Toby's antirrábica visibility
  const allVaccinesForCalendar: VaccineWithMeta[] = MOCK_PETS.flatMap(p =>
    getVacc(p.id).map(v => ({
      ...v,
      cls:      getVaccStatus(v.nextDate) as 'ok'|'soon'|'late',
      petName:  p.name,
      petEmoji: PET_EMOJI[p.species]??'🐾',
      petId:    p.id,
    }))
  )

  const okCount   = withStatus.filter(v=>v.cls==='ok').length
  const alDia     = withStatus.filter(v=>v.cls==='ok'||v.cls==='soon').length
  const pending   = withStatus.filter(v=>v.cls==='soon'||v.cls==='late').length
  const total     = vaccines.length
  const cov       = total>0?Math.round(okCount/total*100):100
  const alPct     = total>0?Math.round(alDia/total*100):100
  const penPct    = total>0?Math.round(pending/total*100):0

  const handleRegister = ({name,date,nextDate}:{name:string;date:string;nextDate:string;vet:string;notes:string}) => {
    const lbl = new Date(nextDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
    const cls = getVaccStatus(nextDate)
    setExtraVacc(prev => ({
      ...prev,
      [selectedPetId]: [...(prev[selectedPetId]??[]), {
        name, applied:new Date(date+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}),
        nextDate,
        badge:    cls==='ok'?'AL DÍA':cls==='soon'?'POR VENCER':'VENCIDA',
        badgeCls: cls==='ok'?'badge-green':cls==='soon'?'badge-yellow':'badge-red',
      }],
    }))
  }

  const handleOpenDetail = (v: VaccineRecord&{cls:'ok'|'soon'|'late'}) =>
    setDetailVaccine({...v, petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾'})

  const handleSaveVaccine = (updated: VaccineRecord) => {
    const petId = selectedPetId
    const isBase = (VACCINES_BY_PET[petId]??[]).some(v=>v.name===updated.name)
    setExtraVacc(prev => {
      const existing = prev[petId]??[]
      if (isBase) {
        const alreadyExtra = existing.find(v=>v.name===updated.name)
        if (alreadyExtra) return { ...prev, [petId]:existing.map(v=>v.name===updated.name?updated:v) }
        return { ...prev, [petId]:[...existing,updated] }
      }
      return { ...prev, [petId]:existing.map(v=>v.name===updated.name?updated:v) }
    })
  }

  const handleMarkApplied = (v:VaccineRecord, appliedDate:string, nextDate:string) => {
    const lbl = new Date(appliedDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
    const cls = getVaccStatus(nextDate)
    handleSaveVaccine({...v, applied:lbl, nextDate, badge:cls==='ok'?'AL DÍA':cls==='soon'?'POR VENCER':'VENCIDA', badgeCls:cls==='ok'?'badge-green':cls==='soon'?'badge-yellow':'badge-red'})
  }

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Vacunas</div><div className="page-subtitle">Control de vacunación de tus mascotas</div></div>
        <button className="btn btn-primary" onClick={()=>setRegisterOpen(true)}>💉 Registrar vacuna</button>
      </div>

      <div style={{ display:'flex',gap:'.5rem',marginBottom:'1.25rem',flexWrap:'wrap' }}>
        {MOCK_PETS.map(p=>(
          <button key={p.id} className={['btn',selectedPetId===p.id?'btn-primary':'btn-secondary'].join(' ')} onClick={()=>setSelectedPetId(p.id)}>
            {PET_EMOJI[p.species]??'🐾'} {p.name}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            Vacunas de {pet.name}
            <button className="btn btn-primary btn-sm" onClick={()=>setRegisterOpen(true)}>💉 Registrar</button>
          </div>
          {withStatus.length===0
            ?<div style={{ textAlign:'center',padding:'2rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin vacunas registradas</div>
            :withStatus.map(v=>(
              <div key={v.name+v.nextDate}
                style={{ display:'flex',alignItems:'center',gap:'.875rem',padding:'.75rem 0',borderBottom:'1.5px solid var(--divider)',cursor:'pointer' }}
                onClick={()=>handleOpenDetail(v)}>
                <div className="vaccine-icon" style={{ background:eventBg(v.cls), color:eventColor(v.cls) }}>💉</div>
                <div style={{ flex:1 }}>
                  <div className="vaccine-name">{v.name}</div>
                  <div className="vaccine-date">Aplicada {v.applied}</div>
                </div>
                <div style={{ textAlign:'right',marginRight:'.5rem' }}>
                  <div className="vaccine-next" style={{ color:eventColor(v.cls) }}>
                    {v.cls==='late'
                      ?`Vencida · ${new Date(v.nextDate+'T12:00:00').toLocaleDateString('es-ES')}`
                      :`Próxima ${new Date(v.nextDate+'T12:00:00').toLocaleDateString('es-ES')}`}
                  </div>
                  <span className="badge" style={{ background:eventBg(v.cls), color:eventColor(v.cls), fontSize:'.6rem' }}>{v.badge}</span>
                </div>

              </div>
            ))
          }
        </div>

        <div className="card">
          <div className="card-title">Cobertura de {pet.name}</div>
          <div style={{ display:'flex',justifyContent:'center',margin:'1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8}/>
          </div>
          {[{label:'Cobertura vacunal',pct:cov,color:''},{label:'Vacunas al día',pct:alPct,color:'success'},{label:'Pendientes/vencidas',pct:penPct,color:penPct>0?'warn':'success'}].map(b=>(
            <div key={b.label} style={{ marginBottom:'.875rem' }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:'.8125rem',marginBottom:'.375rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{b.label}</span><span style={{ fontWeight:700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar — shows ALL pets vaccines including Toby's late ones */}
      <div style={{ marginTop:'1.5rem' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem' }}>
          <div>
            <div className="page-title" style={{ fontSize:'1.125rem' }}>Calendario de eventos</div>
            <div className="page-subtitle">Vacunas y medicamentos de todas tus mascotas</div>
          </div>
        </div>
        <VaccinesCalendar allVaccines={allVaccinesForCalendar} extraVacc={extraVacc} initialDate={initialDate}/>
      </div>

      <RegisterVaccineModal petName={pet.name} isOpen={registerOpen} onClose={()=>setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister}/>
      <VaccineDetailModal vaccine={detailVaccine} onClose={()=>setDetailVaccine(null)} onEdit={v=>{setEditVaccine(v);setEditOpen(true)}} onMarkApplied={handleMarkApplied}/>
      <EditVaccineModal isOpen={editOpen} onClose={()=>setEditOpen(false)} vaccine={editVaccine} onSave={v=>{handleSaveVaccine(v);setEditOpen(false)}}/>
    </div>
  )
}
```

## File: src/pages/PetDetailPage.tsx
```typescript
import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_PETS, SPECIES_EMOJI, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord, PetWithAlerts } from '../hooks/usePets'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import VaccRing from '../components/VaccRing'
import AddCareModal from '../components/AddCareModal'
import AddMedicationModal from '../components/AddMedicationModal'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import NewNoteModal from '../components/NewNoteModal'
import EditPetModal from '../components/EditPetModal'
import EditCareModal from '../components/EditCareModal'
import PetChipEditOverlay from '../components/PetChipEditOverlay'
import { PfBtn, PfFooter } from '../components/FooterButtons'
import InviteSentOverlay from '../components/InviteSentOverlay'
import type { AddCareData } from '../components/AddCareModal'
import type { AddMedData } from '../components/AddMedicationModal'
import type { CareEditData } from '../components/EditCareModal'
import type { SymptomData } from '../components/RegisterSymptomModal'
import { useSymptoms, usePetSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'
import CareDetailModal from '../components/CareDetailModal'
import type { CareDetailItem } from '../components/CareDetailModal'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import MedDetailModal from '../components/MedDetailModal'
import EditMedModal from '../components/EditMedModal'
import type { MedRecord } from '../components/EditMedModal'
import { NoteDetailModal, EditNoteModal } from '../components/NoteModals'
import type { NoteEntry } from '../components/NoteModals'
import { usePetCares, isDueOnDate, getNextDueDate, useCares } from '../context/CaresContext'


type ChipField = 'species' | 'birthDate' | 'weight' | 'caregivers'

const NOTE_ICON: Record<string, string> = { control: '🩺', observacion: '📝', emergencia: '🚨', vacuna: '💉', cirugia: '🏥', otro: '📋' }
const NOTE_BG: Record<string, string>   = { control: 'var(--blue-hl)', observacion: 'var(--primary-hl)', emergencia: 'var(--err-hl)', vacuna: 'var(--success-hl)', cirugia: 'var(--warn-hl)', otro: 'var(--surface-offset)' }
const NOTE_COLOR: Record<string, string>= { control: 'var(--blue)', observacion: 'var(--primary)', emergencia: 'var(--err)', vacuna: 'var(--success)', cirugia: 'var(--warn)', otro: 'var(--text-muted)' }
const NOTE_LABEL: Record<string, string>= { control: 'Control', observacion: 'Observación', emergencia: 'Emergencia', vacuna: 'Post-vacuna', cirugia: 'Cirugía', otro: 'Nota' }


function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill" style={{ background: on ? 'var(--primary)' : 'var(--border)' }} onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}


/* ── REGISTER VACCINE MODAL (exported) ── */
export function RegisterVaccineModal({ petName, isOpen, onClose, vaccines, onRegister }: {
  petName: string; isOpen: boolean; onClose: () => void
  vaccines: VaccineRecord[]
  onRegister: (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const set = (k: keyof typeof form, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }
  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.selected) e.selected = 'Selecciona una vacuna'
    if (!form.date) e.date = 'Fecha obligatoria'
    if (!form.nextDate) e.next = 'Próxima dosis obligatoria'
    else if (new Date(form.nextDate) <= new Date(form.date)) e.next = 'Debe ser posterior'
    return e
  }
  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSuccess(true)
    setTimeout(() => {
      onRegister({ name: form.selected, date: form.date, nextDate: form.nextDate, vet: form.vet, notes: form.notes })
      showToast(`💉 "${form.selected}" registrada`)
      setSuccess(false)
      setForm({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
      setErrors({})
      onClose()
    }, 1000)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar vacuna" subtitle={`Aplicación en ${petName}`}
      icon="💉" accentBg="var(--blue-hl)" accentFg="var(--blue)"
      footer={!success
        ? <PfFooter><PfBtn variant="register" onClick={handleSave}>Registrar aplicación</PfBtn></PfFooter>
        : <></>}>
      {success
        ? <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <div className="modal-success-title">¡Registrado!</div>
            <div className="modal-success-sub">Vacuna añadida al historial de {petName}</div>
          </div>
        : <>
            <div className="modal-section">Vacuna</div>
            <div className="form-group">
              <label className="form-label">Seleccionar *</label>
              <select className={['form-input', errors.selected ? 'form-input--err' : ''].join(' ')} value={form.selected} onChange={e => set('selected', e.target.value)}>
                <option value="">Elige…</option>
                {vaccines.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
              {errors.selected && <span className="form-hint-err">{errors.selected}</span>}
            </div>
            <div className="modal-section">Fechas</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Aplicación *</label>
                <input type="date" className={['form-input', errors.date ? 'form-input--err' : ''].join(' ')} value={form.date} onChange={e => set('date', e.target.value)} />
                {errors.date && <span className="form-hint-err">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Próxima *</label>
                <input type="date" className={['form-input', errors.next ? 'form-input--err' : ''].join(' ')} value={form.nextDate} onChange={e => set('nextDate', e.target.value)} />
                {errors.next && <span className="form-hint-err">{errors.next}</span>}
              </div>
            </div>
            <div className="modal-section">Info adicional</div>
            <div className="form-group">
              <label className="form-label">Veterinario (opcional)</label>
              <div className="field-icon-wrap"><span className="field-icon">🩺</span><input className="form-input" placeholder="Dra. García" value={form.vet} onChange={e => set('vet', e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Notas (opcional)</label>
              <textarea className="form-input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
            </div>
          </>}
    </Modal>
  )
}


/* ── SHARE MODAL ── */
function ShareModal({ petName, isOpen, onClose }: { petName: string; isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('caregiver')
  const [emailErr, setEmailErr] = useState('')
  const [caregivers, setCaregivers] = useState([
    { id: 'tl', initials: 'TL', name: 'Thamires Lopes', role: 'Propietaria · acceso completo', bg: 'var(--pal-lilac)', color: 'var(--nav-bg)', badge: 'Tú', removable: false },
    { id: 'am', initials: 'AM', name: 'Ana Martínez', role: 'Cuidadora · puede registrar', bg: 'var(--blue-hl)', color: 'var(--blue)', badge: null as string | null, removable: true },
  ])
  const [inviteSent, setInviteSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const ACCESS = [
    { val: 'readonly', icon: '👁', label: 'Solo lectura', sub: 'Ver registros' },
    { val: 'caregiver', icon: '✏️', label: 'Cuidador', sub: 'Registrar cuidados y vacunas' },
    { val: 'full', icon: '⚙️', label: 'Acceso completo', sub: 'Editar perfil y todos los datos' },
  ]
  const handleInvite = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setEmailErr('Introduce un email válido'); return }
    const initials = email.split('@')[0].slice(0, 2).toUpperCase()
    const roleLabel = ACCESS.find(a => a.val === role)?.label ?? role
    setCaregivers(p => [...p, { id: Date.now().toString(), initials, name: email, role: roleLabel, bg: 'var(--gold-hl)', color: 'var(--gold)', badge: null, removable: true }])
    setSentEmail(email); setEmail(''); setEmailErr(''); setInviteSent(true)
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Compartir cuidados" subtitle={`Invita a cuidadores de ${petName}`}
        icon="👥" accentBg="var(--blue-hl)" accentFg="var(--blue)" size="md"
        footer={<PfFooter><PfBtn variant="add" onClick={handleInvite}>Enviar invitación</PfBtn></PfFooter>}>
        <div className="modal-section">Cuidadores activos <span className="badge badge-gray">{caregivers.length}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.5rem' }}>
          {caregivers.map(u => (
            <div key={u.id} className="caregiver-row">
              <div className="caregiver-row-avatar" style={{ background: u.bg, color: u.color }}>{u.initials}</div>
              <div style={{ flex: 1 }}><div className="caregiver-row-name">{u.name}</div><div className="caregiver-row-role">{u.role}</div></div>
              {u.badge
                ? <span className="badge badge-green">{u.badge}</span>
                : <PfBtn variant="delete" size="sm" onClick={() => { setCaregivers(p => p.filter(c => c.id !== u.id)); showToast('Cuidador eliminado') }}>Eliminar</PfBtn>}
            </div>
          ))}
        </div>
        <div className="modal-section">Invitar nuevo cuidador</div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Email *</label>
          <div className="field-icon-wrap" style={{ width: '100%' }}>
            <span className="field-icon">✉</span>
            <input className={['form-input', emailErr ? 'form-input--err' : ''].join(' ')} type="email" placeholder="nombre@email.com"
              value={email} onChange={e => { setEmail(e.target.value); setEmailErr('') }} style={{ width: '100%' }} />
          </div>
          {emailErr && <span className="form-hint-err">{emailErr}</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Nivel de acceso</label>
          <div className="access-options">
            {ACCESS.map(a => (
              <div key={a.val} className={['access-option', role === a.val ? 'selected' : ''].join(' ')} onClick={() => setRole(a.val)}>
                <div className="access-option-icon">{a.icon}</div>
                <div style={{ flex: 1 }}><div className="access-option-label">{a.label}</div><div className="access-option-sub">{a.sub}</div></div>
                <div className="access-radio" />
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {inviteSent && <InviteSentOverlay email={sentEmail} onClose={() => setInviteSent(false)} />}
    </>
  )
}


/* ── TAB CARES ── */
function TabCares({ petId, petName }: { petId: string; petName: string }) {
  const petItems = usePetCares(petId)
  const { addCare, editCare, deleteCare, setCareProgress } = useCares()
  const today = new Date().toISOString().split('T')[0]

  // Cuidados de hoje
  const daily = petItems.filter(i => isDueOnDate(i, today))

  // Próximos (cada X dias, não hoje)
  const scheduled = petItems
    .filter(i => i.intervalDays > 1 && !isDueOnDate(i, today))
    .map(i => ({ item: i, nextDate: getNextDueDate(i, today) }))
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))

  const [editItem, setEditItem] = useState<CareEditData | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<CareDetailItem | null>(null)

  const getDone = (item: ReturnType<typeof usePetCares>[0]) =>
    item.doneByDate[today] ?? { done: 0, doneState: false }

  const toDetailItem = (item: ReturnType<typeof usePetCares>[0]): CareDetailItem => {
    const d = getDone(item)
    return {
      id: item.id, petId, emoji: item.emoji, title: item.title,
      sub: item.sub, total: item.total, done: d.done, done_state: d.doneState, bg: item.bg,
    }
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Cuidados de hoy</div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {daily.filter(i => getDone(i).doneState).length} de {daily.length} completados
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Añadir
        </button>
      </div>

      {/* Care grid — usa context */}
      <div className="care-grid">
        {daily.map(item => {
          const d = getDone(item)
          return (
            <div key={item.id}
              className={['care-card', d.doneState ? 'done' : ''].join(' ')}
              onClick={() => setDetailItem(toDetailItem(item))}
              style={{ cursor: 'pointer' }}>
              <div className="care-header">
                <div className="care-emoji" style={{ background: item.bg }}>{item.emoji}</div>
                <div>
                  <div className="care-title">{item.title}</div>
                  <div className="care-sub">{item.sub}</div>
                </div>
              </div>
              <div className="care-progress">
                <div className="care-dots">
                  {Array.from({ length: Math.min(item.total, 7) }).map((_, j) => (
                    <div key={j} className={`care-dot ${j < d.done ? 'done' : ''}`} />
                  ))}
                </div>
                <span>
                  {d.doneState
                    ? <span style={{ color: 'var(--success)' }}>Hecho ✓</span>
                    : `${d.done}/${item.total}`}
                </span>
              </div>
              <div className="care-actions" onClick={e => e.stopPropagation()}>
                <button
                  className={`care-btn-do ${d.doneState ? 'done-btn' : ''}`}
                  onClick={() => {
                    const ns = !getDone(item).doneState
                    setCareProgress(item.id, today, ns ? item.total : 0, ns)
                    showToast(ns ? `✓ ${item.title} completado` : `↩ ${item.title} desmarcado`)
                  }}>
                  {d.doneState ? 'Hecho ✓' : 'Registrar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Secção próximos cuidados */}
      {scheduled.length > 0 && (
        <div style={{
          marginTop: '1rem', background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '.875rem 1rem',
        }}>
          <div style={{
            fontSize: '.75rem', fontWeight: 800, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem',
          }}>
            📅 Próximos cuidados programados
          </div>
          {scheduled.map(({ item, nextDate }) => {
            const daysFromNow = Math.round(
              (new Date(nextDate + 'T00:00:00').getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
            )
            const dateLabel = new Date(nextDate + 'T12:00:00').toLocaleDateString('es-ES', {
              weekday: 'short', day: 'numeric', month: 'short',
            })
            return (
              <div key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.625rem .25rem',
                  borderBottom: '1px solid var(--divider)', cursor: 'pointer',
                }}
                onClick={() => setDetailItem(toDetailItem(item))}>
                <div style={{
                  background: item.bg, width: 36, height: 36, borderRadius: 'var(--r-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0,
                }}>{item.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)' }}>{item.title}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{item.sub}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '.8125rem', fontWeight: 800, color: 'var(--primary)' }}>{dateLabel}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', marginTop: '.1rem' }}>
                    {daysFromNow === 0 ? 'Hoy' : `en ${daysFromNow}d`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {detailItem && (
        <CareDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggle={(id, newDone, newState) => {
            setCareProgress(id, today, newDone, newState)
            setDetailItem(prev => prev ? { ...prev, done: newDone, done_state: newState } : null)
          }}
          onEdit={detail => {
            setDetailItem(null)
            const item = petItems.find(i => i.id === detail.id)
            if (item) {
              setEditItem({
                id: item.id, emoji: item.emoji, title: item.title, total: item.total,
                period: item.period, quantity: item.quantity, notify: item.notify, bg: item.bg,
                time: item.time, intervalDays: item.intervalDays, recurring: item.recurring,
              })
              setEditOpen(true)
            }
          }}
        />
      )}

      {/* Edit modal — sincronizado com CaresContext */}
      <EditCareModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        care={editItem}
        onSave={updated => {
          const item = petItems.find(i => i.id === updated.id)
          if (!item) return
          editCare({
            ...item,
            emoji: updated.emoji,
            title: updated.title,
            total: updated.total,
            period: updated.period ?? 'day',
            quantity: updated.quantity ?? '',
            notify: updated.notify,
            sub: `${updated.total}× ${updated.period === 'day' ? 'día' : 'semana'}${updated.quantity ? ' · ' + updated.quantity : ''}`,
            time: updated.time ?? '',
            intervalDays: updated.intervalDays ?? 1,
            recurring: updated.recurring ?? true,
          })
          showToast(`${updated.emoji} ${updated.title} actualizado`)
          setEditOpen(false)
        }}
        onDelete={id => {
          deleteCare(id)
          setEditOpen(false)
          showToast('Cuidado eliminado')
        }}
      />

      {/* Add modal */}
      <AddCareModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        defaultPetId={petId}
        onAdd={d => {
          addCare({
            petId: d.petId,
            emoji: d.emoji,
            title: d.title,
            sub: `${d.total}× ${d.period === 'day' ? 'día' : 'semana'}${d.quantity ? ' · ' + d.quantity : ''}`,
            total: d.total,
            period: d.period ?? 'day',
            quantity: d.quantity,
            notify: d.notify,
            bg: '',
            time: d.time ?? '',
            intervalDays: d.intervalDays ?? 1,
            recurring: d.recurring ?? true,
            startDate: today,
          })
          showToast(`${d.emoji} ${d.title} añadido`)
        }}
      />
    </>
  )
}


/* ── TAB VACCINES (compact) ── */
function TabVaccines({ petId, petName }: { petId: string; petName: string }) {
  const [registerOpen, setRegisterOpen] = useState(false)
  const [extraVacc, setExtraVacc] = useState<VaccineRecord[]>([])
  const [vaccDetail, setVaccDetail] = useState<(VaccineRecord & { cls: 'ok' | 'soon' | 'late' }) | null>(null)
  const [editVacc, setEditVacc] = useState<VaccineRecord | null>(null)
  const [editVaccOpen, setEditVaccOpen] = useState(false)
  const base = VACCINES_BY_PET[petId] ?? []
  const vaccines = [...base, ...extraVacc]
  const withStatus = vaccines.map(v => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late' }))
  const okCount = withStatus.filter(v => v.cls === 'ok').length
  const alDia = withStatus.filter(v => v.cls === 'ok' || v.cls === 'soon').length
  const pending = withStatus.filter(v => v.cls === 'soon' || v.cls === 'late').length
  const total = vaccines.length
  const cov = total > 0 ? Math.round(okCount / total * 100) : 100
  const alPct = total > 0 ? Math.round(alDia / total * 100) : 100
  const penPct = total > 0 ? Math.round(pending / total * 100) : 0

  const handleRegister = ({ name, date, nextDate }: { name: string; date: string; nextDate: string; vet: string; notes: string }) => {
    const lbl = new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    const cls = getVaccStatus(nextDate)
    setExtraVacc(prev => [...prev, {
      name, applied: lbl, nextDate,
      badge: cls === 'ok' ? 'AL DÍA' : cls === 'soon' ? 'POR VENCER' : 'VENCIDA',
      badgeCls: cls === 'ok' ? 'badge-green' : cls === 'soon' ? 'badge-yellow' : 'badge-red',
    }])
  }

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            Vacunas
            <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>💉 Registrar</button>
          </div>
          {withStatus.length === 0
            ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin vacunas</div>
            : withStatus.map(v => (
                <div key={v.name + v.nextDate} className="vaccine-row"
                  onClick={() => setVaccDetail(v)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.75rem 0', borderBottom: '1.5px solid var(--divider)', cursor: 'pointer' }}>
                  <div className="vaccine-icon" style={{
                    background: v.cls === 'ok' ? 'var(--success-hl)' : v.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                    color: v.cls === 'ok' ? 'var(--success)' : v.cls === 'soon' ? 'var(--gold)' : 'var(--err)',
                  }}>💉</div>
                  <div style={{ flex: 1 }}>
                    <div className="vaccine-name">{v.name}</div>
                    <div className="vaccine-date">Aplicada {v.applied}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`vaccine-next ${v.cls}`}>
                      {v.cls === 'late'
                        ? `Vencida · ${new Date(v.nextDate + 'T12:00:00').toLocaleDateString('es-ES')}`
                        : `Próxima ${new Date(v.nextDate + 'T12:00:00').toLocaleDateString('es-ES')}`}
                    </div>
                    <span className={`badge ${v.badgeCls}`} style={{ fontSize: '.6rem' }}>{v.badge}</span>
                  </div>
                </div>
              ))}
        </div>
        <div className="card">
          <div className="card-title">Cobertura</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8} />
          </div>
          {[
            { label: 'Cobertura vacunal', pct: cov, color: '' },
            { label: 'Vacunas al día', pct: alPct, color: 'success' },
            { label: 'Pendientes/vencidas', pct: penPct, color: penPct > 0 ? 'warn' : 'success' },
          ].map(b => (
            <div key={b.label} style={{ marginBottom: '.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8125rem', marginBottom: '.375rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{b.label}</span>
                <span style={{ fontWeight: 700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width: `${b.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <RegisterVaccineModal petName={petName} isOpen={registerOpen} onClose={() => setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister} />
      <VaccineDetailModal
        vaccine={vaccDetail ? { ...vaccDetail, petName, petEmoji: SPECIES_EMOJI[petId] ?? '🐾' } : null}
        onClose={() => setVaccDetail(null)}
        onEdit={v => { setVaccDetail(null); setEditVacc(v); setEditVaccOpen(true) }}
        onMarkApplied={(v, appliedDate, nextDate) => {
          const lbl = new Date(appliedDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          const cls = getVaccStatus(nextDate)
          const badge = cls === 'ok' ? 'AL DÍA' : cls === 'soon' ? 'POR VENCER' : 'VENCIDA'
          const badgeCls = cls === 'ok' ? 'badge-green' : cls === 'soon' ? 'badge-yellow' : 'badge-red'
          const updated: VaccineRecord = { ...v, applied: lbl, nextDate, badge, badgeCls }
          setExtraVacc(prev => {
            const exists = prev.find(x => x.name === v.name)
            return exists ? prev.map(x => x.name === v.name ? updated : x) : [...prev, updated]
          })
          setVaccDetail(null)
          showToast('💉 Aplicación registrada')
        }}
      />
      <EditVaccineModal
        isOpen={editVaccOpen}
        onClose={() => setEditVaccOpen(false)}
        vaccine={editVacc}
        onSave={updated => {
          setExtraVacc(prev => {
            const exists = prev.find(x => x.name === updated.name)
            return exists ? prev.map(x => x.name === updated.name ? updated : x) : [...prev, updated]
          })
          setEditVaccOpen(false)
          showToast('💉 Vacuna actualizada')
        }}
      />
    </>
  )
}


/* ══ PET DETAIL PAGE ══ */
const TABS = ['🐾 Cuidados', 'Vacunas', 'Medicamentos', 'Síntomas', 'Notas', 'Historial']

export default function PetDetailPage() {
  const { petId } = useParams<{ petId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addMedOpen, setAddMedOpen] = useState(false)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [addSymptomOpen, setAddSymptomOpen] = useState(false)
  const [chipField, setChipField] = useState<ChipField | null>(null)
  const [petData, setPetData] = useState<PetWithAlerts>(MOCK_PETS.find(p => p.id === petId) ?? MOCK_PETS[0])
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    try { return localStorage.getItem('pet-photo-' + (petId ?? MOCK_PETS[0].id)) } catch { return null }
  })

  // Synced symptoms
  const { addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const { active: activeSymptoms, resolved: resolvedSymptoms } = usePetSymptoms(petData.id)
  const [detailSym, setDetailSym] = useState<SymptomEntry | null>(null)
  const [editSym, setEditSym] = useState<SymptomEntry | null>(null)
  const [editSymOpen, setEditSymOpen] = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)
  const [localMeds, setLocalMeds] = useState<MedRecord[]>([{
    id: 'm1', icon: '💊', bg: 'var(--warn-hl)', color: 'var(--warn)',
    title: 'Antiparasitario — Bravecto',
    dose: '1 comprimido',
    frequency: 'cada 3 meses',
    startDate: '',
    endDate: '2026-07-10',
    notes: '',
    badge: 'Activo', badgeCls: 'badge-green',
    archived: false,
  }])
  const [medDetail, setMedDetail] = useState<MedRecord | null>(null)
  const [editMed, setEditMed] = useState<MedRecord | null>(null)
  const [editMedOpen, setEditMedOpen] = useState(false)
  const [localNotes, setLocalNotes] = useState<NoteEntry[]>([{
    id: 'note-1', petId: petData.id,
    content: `${petData.name} en buen estado. Peso estable. Revisar vacuna antirrábica.`,
    vet: 'Dra. Martínez', date: '2026-01-10', type: 'control', archived: false,
  }])
  const [noteDetail, setNoteDetail] = useState<NoteEntry | null>(null)
  const [editNote, setEditNote]     = useState<NoteEntry | null>(null)
  const [editNoteOpen, setEditNoteOpen] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const r = ev.target?.result as string
      if (r) {
        setPhotoUrl(r)
        try { localStorage.setItem('pet-photo-' + petData.id, r) } catch {}
        showToast('📸 Foto actualizada')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChipSave = (updated: Partial<PetWithAlerts>) => {
    setPetData(prev => ({ ...prev, ...updated }))
    setChipField(null)
  }

  type HistItem = { cls: string; icon: string; title: string; meta: string; time: string; medId?: string; noteId?: string }
  const [histDetail, setHistDetail] = useState<HistItem | null>(null)
  const SEV_COLOR: Record<string, string> = { leve: 'var(--gold)', moderado: 'var(--warn)', grave: 'var(--err)', emergencia: 'var(--err)' }
  const SEV_BG: Record<string, string> = { leve: 'var(--gold-hl)', moderado: 'var(--warn-hl)', grave: 'var(--err-hl)', emergencia: 'var(--err-hl)' }
  const CAT_ICON: Record<string, string> = { digestivo: '🤢', respiratorio: '🫁', piel: '🩹', comportamiento: '🧠', movimiento: '🦶', ocular: '👁', otro: '❓' }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }} onClick={() => navigate('/pets')}>← Mis mascotas</button>

      {/* Pet hero */}
      <div className="pet-profile-hero">
        <div className="pet-photo-wrap">
          <div className="pet-photo-circle">
            {photoUrl ? <img src={photoUrl} alt={petData.name} /> : <span>{SPECIES_EMOJI[petData.species] ?? '🐾'}</span>}
          </div>
          <button className="pet-photo-btn" onClick={() => photoRef.current?.click()} title="Cambiar foto">📷</button>
          <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>{petData.name}</h1>
            <span style={{ fontSize: '1.1rem' }}>{SPECIES_EMOJI[petData.species]}</span>
            <span className="badge badge-green" style={{ marginLeft: '.25rem' }}>Saludable</span>
          </div>
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{petData.breed ?? 'Raza desconocida'} · 4 años</p>
          <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
            {petData.alerts.map((a, i) => (
              <span key={i} className={`badge ${a.type === 'err' ? 'badge-red' : 'badge-yellow'}`}>
                {a.type === 'warn' ? '⚠️' : '🔴'} {a.text.slice(0, 28)}…
              </span>
            ))}
            <span className="badge badge-blue">💊 Med. activo</span>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}>✏ Editar</button>
      </div>

      {/* Clickable stat chips */}
      <div className="stat-row">
        {([
          { label: 'Especie', field: 'species' as ChipField, value: petData.species === 'cat' ? 'Gato 🐱' : petData.species === 'dog' ? 'Perro 🐶' : 'Ave 🦜' },
          { label: 'Nacimiento', field: 'birthDate' as ChipField, value: petData.birthDate ? new Date(petData.birthDate + 'T12:00:00').toLocaleDateString('es-ES') : '—' },
          { label: 'Peso', field: 'weight' as ChipField, value: petData.species === 'cat' ? '4.2 kg' : petData.species === 'dog' ? '12.4 kg' : '32 g' },
          { label: 'Cuidadores', field: 'caregivers' as ChipField, value: null },
        ] as const).map(s => (
          <div key={s.label} className="stat-chip clickable" onClick={() => setChipField(s.field)} title={`Editar ${s.label}`}>
            <span className="stat-chip-edit-hint">✏</span>
            <div className="stat-chip-label">{s.label}</div>
            {s.value
              ? <div className="stat-chip-value" style={{ fontSize: '1rem' }}>{s.value}</div>
              : <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem' }}>TL</div>
                  {petData.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
                </div>}
          </div>
        ))}
      </div>

      {/* Caregivers bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1.125rem', padding: '.75rem 1rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-sm)' }}>
        <span style={{ fontSize: '.8125rem', fontWeight: 700, color: 'var(--text-muted)', flex: 1 }}>Cuidadores compartidos</span>
        <div className="caregiver-avatars">
          <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem' }}>TL</div>
          {petData.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShareOpen(true)}>👥 Compartir</button>
      </div>

      <div className="tabs">
        {TABS.map((t, i) => <div key={t} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>)}
      </div>

      {activeTab === 0 && <TabCares petId={petData.id} petName={petData.name} />}
      {activeTab === 1 && <TabVaccines petId={petData.id} petName={petData.name} />}

      {activeTab === 2 && (
        <div className="card">
          <div className="card-title">
            Medicamentos activos
            <button className="btn btn-primary btn-sm" onClick={() => setAddMedOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Añadir
            </button>
          </div>
          {localMeds.map(m => (
            <div key={m.id} className="list-item" onClick={() => setMedDetail(m)} style={{ cursor: 'pointer' }}>
              <div className="list-item-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
              <div className="list-item-info">
                <div className="list-item-title">{m.title}</div>
                <div className="list-item-sub">{[m.dose, m.frequency].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="list-item-right"><span className={`badge ${m.badgeCls}`}>{m.badge}</span></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 3 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Síntomas de {petData.name}</div>
            <button className="btn btn-primary btn-sm" onClick={() => setAddSymptomOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Registrar
            </button>
          </div>
          {activeSymptoms.length === 0 && resolvedSymptoms.length === 0
            ? <div className="empty-state" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🐾</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.375rem' }}>{petData.name} está bien</div>
                <div style={{ fontSize: '.875rem', marginBottom: '1.25rem' }}>Registra cualquier cambio de comportamiento aquí.</div>
              </div>
            : <div className="grid-2">
                <div className="card">
                  <div className="card-title">Activos {activeSymptoms.length > 0 && <span className="badge badge-red">{activeSymptoms.length}</span>}</div>
                  {activeSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin síntomas activos ✓</div>
                    : activeSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: SEV_BG[s.severity] || 'var(--err-hl)', color: SEV_COLOR[s.severity] || 'var(--err)' }}>{CAT_ICON[s.category] ?? '🌡️'}</div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · {new Date(s.date + 'T12:00:00').toLocaleDateString('es-ES')}</div>
                          </div>
                          <span className="badge badge-yellow" style={{ flexShrink: 0 }}>Activo</span>
                        </div>
                      ))}
                </div>
                <div className="card">
                  <div className="card-title">Resueltos</div>
                  {resolvedSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin síntomas resueltos</div>
                    : resolvedSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" style={{ opacity: .7 }} onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: 'var(--surface-offset)', color: 'var(--text-faint)' }}>{CAT_ICON[s.category] ?? '🌡️'}</div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · Resuelto</div>
                          </div>
                          <span className="badge badge-gray" style={{ flexShrink: 0 }}>Resuelto</span>
                        </div>
                      ))}
                </div>
              </div>}
        </div>
      )}

      {activeTab === 4 && (
        <div className="card">
          <div className="card-title">
            Notas
            <button className="btn btn-primary btn-sm" onClick={() => setAddNoteOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Nueva
            </button>
          </div>
          {localNotes.length === 0
            ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin notas aún</div>
            : localNotes.map(n => (
                <div key={n.id} className="list-item" onClick={() => setNoteDetail(n)} style={{ cursor: 'pointer' }}>
                  <div className="list-item-icon" style={{ background: NOTE_BG[n.type] ?? 'var(--primary-hl)', color: NOTE_COLOR[n.type] ?? 'var(--primary)' }}>
                    {NOTE_ICON[n.type] ?? '📋'}
                  </div>
                  <div className="list-item-info">
                    <div className="list-item-title">{NOTE_LABEL[n.type] ?? 'Nota'}{n.vet ? ` — ${n.vet}` : ''}</div>
                    <div className="list-item-sub">{n.content.slice(0, 70)}{n.content.length > 70 ? '…' : ''}</div>
                  </div>
                  <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
                    {n.date ? new Date(n.date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : ''}
                  </span>
                </div>
              ))}
        </div>
      )}

      {activeTab === 5 && (
        <div className="card">
          <div className="card-title">Historial completo</div>
          <div className="timeline">
            {[
              { cls: 'vaccine', icon: '💉', title: 'Vacuna antirrábica aplicada', meta: 'Dra. García · VetSalud', time: 'Hoy', medId: undefined, noteId: undefined },
              { cls: 'med',     icon: '💊', title: 'Bravecto', meta: '1 comprimido', time: 'Hace 3d', medId: 'm1', noteId: undefined },
              { cls: 'note',    icon: '📋', title: 'Control anual', meta: 'Peso 4.2 kg', time: '10 ene', medId: undefined, noteId: 'note-1' },
            ].map(e => (
              <div key={e.title} className="timeline-item" onClick={() => setHistDetail(e)} style={{ cursor: 'pointer' }}>
                <div className={`tl-icon ${e.cls}`}>{e.icon}</div>
                <div style={{ flex: 1 }}><div className="tl-title">{e.title}</div><div className="tl-meta">{e.meta}</div></div>
                <div className="tl-time">{e.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ShareModal petName={petData.name} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <EditPetModal isOpen={editOpen} onClose={() => setEditOpen(false)} onSave={setPetData} pet={petData} />
      <AddMedicationModal
        isOpen={addMedOpen}
        onClose={() => setAddMedOpen(false)}
        onAdd={(d: AddMedData) => {
          setLocalMeds(p => [...p, {
            id: `m${Date.now()}`, icon: '💊', bg: 'var(--warn-hl)', color: 'var(--warn)',
            title: d.name, dose: d.dose, frequency: d.frequency,
            startDate: '', endDate: '', notes: '',
            badge: 'Activo', badgeCls: 'badge-green', archived: false,
          }])
          setAddMedOpen(false)
        }}
        defaultPetId={petData.id}
      />
      <NewNoteModal
        isOpen={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        onAdd={d => {
          setLocalNotes(p => [{
            id: `n${Date.now()}`, petId: petData.id,
            content: d.content, vet: d.vet || '', date: d.date, type: d.type, archived: false,
          }, ...p])
          setAddNoteOpen(false)
          showToast('📋 Nota guardada')
        }}
        defaultPetId={petData.id}
      />
      <RegisterSymptomModal
        isOpen={addSymptomOpen}
        onClose={() => setAddSymptomOpen(false)}
        onAdd={(d: SymptomData) => { addSymptom({ ...d, resolved: false }); setAddSymptomOpen(false); showToast('🌡️ Síntoma registrado') }}
        defaultPetId={petData.id}
      />
      <SymptomDetailModal symptom={detailSym} onClose={() => setDetailSym(null)}
        onEdit={s => { setDetailSym(null); setEditSym(s); setEditSymOpen(true) }}
        onResolve={id => { resolve(id); setDetailSym(null); showToast('✓ Síntoma resuelto') }}
        onUnresolve={id => { unresolve(id); setDetailSym(null); showToast('↩ Síntoma reabierto') }} />
      <EditSymptomModal isOpen={editSymOpen} onClose={() => setEditSymOpen(false)} symptom={editSym}
        onSave={updated => { saveSymptom(updated); setEditSymOpen(false); showToast('🌡️ Síntoma actualizado') }} />

      {/* Medicamentos modals */}
      <MedDetailModal
        med={medDetail}
        onClose={() => setMedDetail(null)}
        onEdit={m => { setMedDetail(null); setEditMed(m); setEditMedOpen(true) }}
        onMarkAdministered={(m, _date) => { showToast(`💊 ${m.title} administrado`); setMedDetail(null) }}
      />
      <EditMedModal
        isOpen={editMedOpen}
        onClose={() => setEditMedOpen(false)}
        med={editMed}
        onSave={updated => {
          setLocalMeds(prev => prev.map(m => m.id === updated.id ? updated : m))
          setEditMedOpen(false)
          showToast('💊 Medicamento actualizado')
        }}
        onDelete={id => {
          setLocalMeds(prev => prev.filter(m => m.id !== id))
          setEditMedOpen(false)
          showToast('🗑 Medicamento eliminado')
        }}
      />

      {/* Historial detail overlay */}
      {histDetail && (
        <div className="detail-overlay" onClick={() => setHistDetail(null)}>
          <div className="detail-sheet" onClick={e => e.stopPropagation()}>
            <div className="detail-header">
              <div className="detail-icon" style={{
                background: histDetail.cls === 'vaccine' ? 'var(--blue-hl)' : histDetail.cls === 'med' ? 'var(--warn-hl)' : 'var(--primary-hl)',
                color: histDetail.cls === 'vaccine' ? 'var(--blue)' : histDetail.cls === 'med' ? 'var(--warn)' : 'var(--primary)',
                fontSize: '1.375rem',
              }}>{histDetail.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{histDetail.title}</div>
                <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{histDetail.meta}</div>
              </div>
              <button className="detail-close" onClick={() => setHistDetail(null)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="detail-body">
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="status-pill ok">{histDetail.time}</span>
                <span className="badge badge-blue" style={{ fontSize: '.72rem' }}>
                  {histDetail.cls === 'vaccine' ? '💉 Vacuna' : histDetail.cls === 'med' ? '💊 Medicamento' : '📋 Nota'}
                </span>
              </div>
              <div className="detail-info-grid">
                <div className="detail-info-chip">
                  <div className="detail-info-label">Evento</div>
                  <div className="detail-info-value">{histDetail.title}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">Detalle</div>
                  <div className="detail-info-value">{histDetail.meta}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">Fecha</div>
                  <div className="detail-info-value">{histDetail.time}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">Mascota</div>
                  <div className="detail-info-value">{SPECIES_EMOJI[petData.species] ?? '🐾'} {petData.name}</div>
                </div>
              </div>
            </div>
            <div className="detail-footer">
              {histDetail.cls === 'vaccine' && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setActiveTab(1); setHistDetail(null); showToast('💉 Edita desde la pestaña Vacunas') }}>
                  ✏ Ir a Vacunas
                </button>
              )}
              {histDetail.cls === 'med' && histDetail.medId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const m = localMeds.find(x => x.id === histDetail.medId)
                  if (m) { setEditMed(m); setEditMedOpen(true); setHistDetail(null) }
                }}>✏ Editar med.</button>
              )}
              {histDetail.cls === 'note' && histDetail.noteId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const n = localNotes.find(x => x.id === histDetail.noteId)
                  if (n) { setEditNote(n); setEditNoteOpen(true); setHistDetail(null) }
                }}>✏ Editar nota</button>
              )}
              <button className="btn btn-secondary" onClick={() => setHistDetail(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Notas modals */}
      <NoteDetailModal
        note={noteDetail}
        onClose={() => setNoteDetail(null)}
        onEdit={n => { setNoteDetail(null); setEditNote(n); setEditNoteOpen(true) }}
        onArchive={id => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: true } : n)); setNoteDetail(null); showToast('📦 Nota archivada') }}
        onUnarchive={id => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: false } : n)); setNoteDetail(null); showToast('📋 Nota restaurada') }}
        onDelete={id => { setLocalNotes(p => p.filter(n => n.id !== id)); setNoteDetail(null); showToast('🗑 Nota eliminada') }}
      />
      <EditNoteModal
        isOpen={editNoteOpen}
        onClose={() => setEditNoteOpen(false)}
        note={editNote}
        onSave={updated => { setLocalNotes(p => p.map(n => n.id === updated.id ? updated : n)); setEditNoteOpen(false); showToast('📋 Nota actualizada') }}
      />

      {/* Chip edit overlay */}
      <PetChipEditOverlay pet={petData} field={chipField} onClose={() => setChipField(null)} onSave={handleChipSave} />
    </div>
  )
}
```

## File: src/pages/PetListPage.tsx
```typescript
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePets, SPECIES_EMOJI, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import Button from '../components/Button'
import MiniVaccRing from '../components/MiniVaccRing'
import type { Species } from '../types'
import BackButton from '../components/BackButton'
import { PfBtn, PfFooter } from '../components/FooterButtons'

function usePetPhotos() {
  const [photos, setPhotos] = useState<Record<string,string>>(() => {
    const m: Record<string,string> = {}
    try { Object.keys(localStorage).filter(k=>k.startsWith('pet-photo-')).forEach(k=>{ m[k.replace('pet-photo-','')] = localStorage.getItem(k)! }) } catch {}
    return m
  })
  const setPhoto = useCallback((petId:string, dataUrl:string) => {
    setPhotos(prev=>({...prev,[petId]:dataUrl}))
    try { localStorage.setItem('pet-photo-'+petId, dataUrl) } catch {}
  }, [])
  return { photos, setPhoto }
}

function calcVaccCoverage(petId: string): number {
  const vaccines = VACCINES_BY_PET[petId] ?? []
  if (!vaccines.length) return 100
  const ok = vaccines.filter(v => getVaccStatus(v.nextDate) === 'ok').length
  return Math.round((ok / vaccines.length) * 100)
}

// ── Pet Card ──────────────────────────────────────────────────────
interface PetCardProps { pet: PetWithAlerts; onClick: () => void; photo?: string }
function PetCard({ pet, onClick, photo }: PetCardProps) {
  const bDate  = pet.birthDate ? new Date(pet.birthDate) : null
  const months = bDate ? (new Date().getFullYear()-bDate.getFullYear())*12+(new Date().getMonth()-bDate.getMonth()) : null
  const age    = months===null ? 'Edad desconocida' : months<12 ? `${months} meses` : `${Math.floor(months/12)} años`
  const vaccCov = calcVaccCoverage(pet.id)

  return (
    <div className="pet-card" onClick={onClick}>
      <div className="pet-card-header">
        <div className="pet-avatar-photo">
          {photo ? <img src={photo} alt={pet.name}/> : <span style={{ fontSize:'1.5rem' }}>{SPECIES_EMOJI[pet.species]??'🐾'}</span>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="pet-card-name">{pet.name}</div>
          <div className="pet-card-breed">{pet.breed??'Raza desconocida'} · {age}</div>
        </div>
        {pet.alerts.length > 0 && <span className={`badge ${pet.alerts[0].type==='err'?'badge-red':'badge-yellow'}`}>⚠</span>}
      </div>

      {/* Stat row with vacc ring instead of health % */}
      <div style={{ display:'flex', gap:'.625rem', alignItems:'center' }}>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'.375rem' }}>
          {[
            { label:'Especie', value:pet.species==='cat'?'Gato':pet.species==='dog'?'Perro':pet.species==='bird'?'Ave':pet.species },
            { label:'Edad',    value:age },
          ].map(s=>(
            <div key={s.label} className="stat-chip" style={{ padding:'.45rem .625rem' }}>
              <div className="stat-chip-label">{s.label}</div>
              <div className="stat-chip-value" style={{ fontSize:'.875rem' }}>{s.value}</div>
            </div>
          ))}
        </div>
        {/* Vaccine coverage ring */}
        <MiniVaccRing coverage={vaccCov} size={52} strokeWidth={5}/>
      </div>

      <div className="pet-card-footer">
        <div className="caregiver-avatars">
          <div className="caregiver-avatar">TL</div>
          {pet.id==='pet-1' && <div className="caregiver-avatar" style={{ background:'var(--blue-hl)', color:'var(--blue)' }}>AM</div>}
        </div>
        <span className="last-activity">{pet.id==='pet-1'?'Hoy 10:22':pet.id==='pet-2'?'Ayer':'Hace 2d'}</span>
      </div>
    </div>
  )
}

// ── Species filter ────────────────────────────────────────────────
const SPECIES_FILTERS: { val: Species|'all'; emoji: string; label: string }[] = [
  { val:'all',     emoji:'🐾', label:'Todas'  },
  { val:'cat',     emoji:'🐱', label:'Gatos'  },
  { val:'dog',     emoji:'🐶', label:'Perros' },
  { val:'bird',    emoji:'🦜', label:'Aves'   },
  { val:'rabbit',  emoji:'🐰', label:'Conejos'},
  { val:'reptile', emoji:'🦎', label:'Reptiles'},
  { val:'other',   emoji:'🐾', label:'Otros'  },
]

const SPECIES_OPTIONS: { value: Species; emoji: string; label: string; color: string }[] = [
  { value:'cat',     emoji:'🐱', label:'Gato',   color:'var(--pal-lilac)'      },
  { value:'dog',     emoji:'🐶', label:'Perro',  color:'var(--pal-sky)'        },
  { value:'bird',    emoji:'🦜', label:'Ave',    color:'var(--pal-candy)'      },
  { value:'rabbit',  emoji:'🐰', label:'Conejo', color:'var(--pal-mauve)'      },
  { value:'reptile', emoji:'🦎', label:'Reptil', color:'var(--success-hl)'     },
  { value:'fish',    emoji:'🐟', label:'Pez',    color:'var(--blue-hl)'        },
  { value:'other',   emoji:'🐾', label:'Otro',   color:'var(--surface-offset)' },
]

// ── AddPetModal ───────────────────────────────────────────────────
function AddPetModal({ isOpen, onClose, onAdd }: { isOpen:boolean; onClose:()=>void; onAdd:(p:PetWithAlerts)=>void }) {
  const [form, setForm]     = useState({ name:'', species:'cat' as Species, breed:'', birthDate:'', weight:'' })
  const [nameErr, setNameErr] = useState('')
  const set = (k: string, v: string) => setForm(f=>({...f,[k]:v}))
  const handleSubmit = () => {
    if (!form.name.trim()) { setNameErr('El nombre es obligatorio'); return }
    const petName = form.name.trim()
    onAdd({ id:`pet-${Date.now()}`, name:petName, species:form.species, breed:form.breed.trim()||undefined, birthDate:form.birthDate||undefined, photoUrl:undefined, ownerId:'user-1', createdAt:new Date().toISOString(), healthScore:100, alerts:[], vaccCoverage:100 })
    setForm({ name:'', species:'cat', breed:'', birthDate:'', weight:'' }); setNameErr(''); onClose()
    showToast(`${petName} añadida correctamente 🐾`)
  }
  const selected = SPECIES_OPTIONS.find(o=>o.value===form.species)!
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva mascota" icon="🐾" accentBg="var(--pal-lilac)" accentFg="var(--nav-bg)"
      footer={<><PfFooter>
  <PfBtn variant="save" onClick={handleSubmit}>Guardar mascota</PfBtn>
</PfFooter></>}>
      <p className="mf-section-label">Identidad</p>
      <div className="mf-field">
        <label className="mf-label">Nombre *</label>
        <div className={['mf-input-wrap',nameErr?'mf-input-wrap--err':''].join(' ')}>
          <span className="mf-prefix">{selected.emoji}</span>
          <input className="mf-input" placeholder={`Nombre de tu ${selected.label.toLowerCase()}`} value={form.name}
            onChange={e=>{set('name',e.target.value);setNameErr('')}} autoFocus/>
        </div>
        {nameErr && <span className="mf-err">{nameErr}</span>}
      </div>
      <div className="mf-field">
        <label className="mf-label">Especie</label>
        <div className="mf-species-grid">
          {SPECIES_OPTIONS.map(o=>(
            <button key={o.value} type="button" className={['mf-species-card',form.species===o.value?'active':''].join(' ')}
              style={form.species===o.value?{background:o.color,borderColor:'var(--primary)'}:{}} onClick={()=>set('species',o.value)}>
              <span className="mf-species-emoji">{o.emoji}</span><span className="mf-species-label">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mf-field">
        <label className="mf-label">Raza <span className="mf-optional">opcional</span></label>
        <div className="mf-input-wrap"><span className="mf-prefix">🔬</span><input className="mf-input" placeholder="Ej: Europeo común…" value={form.breed} onChange={e=>set('breed',e.target.value)}/></div>
      </div>
      <p className="mf-section-label" style={{ marginTop:'1.25rem' }}>Datos físicos</p>
      <div className="mf-row">
        <div className="mf-field">
          <label className="mf-label">Nacimiento <span className="mf-optional">opcional</span></label>
          <div className="mf-input-wrap"><span className="mf-prefix">🎂</span><input className="mf-input" type="date" value={form.birthDate} onChange={e=>set('birthDate',e.target.value)}/></div>
        </div>
        <div className="mf-field">
          <label className="mf-label">Peso <span className="mf-optional">opcional</span></label>
          <div className="mf-input-wrap"><span className="mf-prefix">⚖️</span><input className="mf-input" type="number" placeholder="Ej: 4.2" value={form.weight} onChange={e=>set('weight',e.target.value)}/><span className="mf-suffix">kg</span></div>
        </div>
      </div>
      {form.name.trim() && (
        <div className="mf-preview">
          <span style={{ fontSize:'1.5rem' }}>{selected.emoji}</span>
          <div><div style={{ fontWeight:800,fontSize:'.9375rem',color:'var(--text)' }}>{form.name}</div><div style={{ fontSize:'.75rem',color:'var(--text-muted)' }}>{selected.label}{form.breed?` · ${form.breed}`:''}</div></div>
          <span className="badge badge-green" style={{ marginLeft:'auto' }}>Nueva ✓</span>
        </div>
      )}
    </Modal>
  )
}

// ── PetListPage ───────────────────────────────────────────────────
export default function PetListPage() {
  const navigate                           = useNavigate()
  const { pets, loading, error, addPet, reload } = usePets()
  const { photos }                         = usePetPhotos()
  const [search,     setSearch]     = useState('')
  const [specFilter, setSpecFilter] = useState<Species|'all'>('all')
  const [modalOpen,  setModalOpen]  = useState(false)
  const [viewMode,   setViewMode]   = useState<'grid'|'list'>('grid')

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...pets]
      .filter(p =>
        (specFilter==='all' || p.species===specFilter) &&
        (!term || p.name.toLowerCase().includes(term) || p.species.includes(term) || p.breed?.toLowerCase().includes(term))
      )
      .sort((a,b) => a.name.localeCompare(b.name))
  }, [pets, search, specFilter])

  const presentSpecies = useMemo(() => {
    const s = new Set(pets.map(p=>p.species))
    return SPECIES_FILTERS.filter(f => f.val==='all' || s.has(f.val as Species))
  }, [pets])

  const hasFilters = search || specFilter !== 'all'

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Mis Mascotas</div><div className="page-subtitle">{pets.length} mascotas registradas</div></div>
        <button className="btn btn-primary" onClick={()=>setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Nueva mascota
        </button>
      </div>

      {/* Toolbar — no sort filters */}
      <div className="petlist-toolbar">
        <div className="petlist-search-row">
          <div className="petlist-search-wrap">
            <span className="petlist-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input placeholder="Buscar por nombre, especie o raza…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search && <button className="petlist-search-clear" onClick={()=>setSearch('')}>✕</button>}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={reload} title="Recargar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
          <div className="petlist-view-toggle">
            <div className={`petlist-view-btn ${viewMode==='grid'?'active':''}`} onClick={()=>setViewMode('grid')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div className={`petlist-view-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg>
            </div>
          </div>
        </div>

        {/* Species only — no sort */}
        <div className="petlist-filter-row">
          <span className="petlist-filter-label">Especie:</span>
          {presentSpecies.map(f=>(
            <button key={f.val} className={`petlist-filter-pill ${specFilter===f.val?'active':''}`} onClick={()=>setSpecFilter(f.val)}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="petlist-results-bar">
        <span className="petlist-results-count">
          {filteredPets.length===pets.length ? `${pets.length} mascota${pets.length!==1?'s':''}` : `${filteredPets.length} de ${pets.length}`}
          {hasFilters && <button style={{ marginLeft:'.625rem',fontSize:'.75rem',color:'var(--primary)',fontWeight:700,cursor:'pointer' }} onClick={()=>{setSearch('');setSpecFilter('all')}}>Limpiar ✕</button>}
        </span>
      </div>

      {error && <div style={{ borderRadius:'var(--r-lg)',border:'1px solid var(--err-hl)',background:'var(--err-hl)',padding:'.75rem 1rem',fontSize:'.875rem',color:'var(--err)',marginBottom:'1rem' }}>{error}</div>}

      {loading ? (
        <div className="grid-auto">{[1,2,3].map(i=><SkeletonPetCard key={i}/>)}</div>
      ) : filteredPets.length===0 ? (
        <div className="card" style={{ textAlign:'center',padding:'3rem' }}>
          <div style={{ fontSize:'3rem',marginBottom:'1rem' }}>🐾</div>
          <div style={{ fontWeight:800,fontSize:'1rem',color:'var(--text)',marginBottom:'.375rem' }}>{hasFilters?'Sin resultados':'No hay mascotas'}</div>
          <div style={{ fontSize:'.875rem',color:'var(--text-muted)',marginBottom:'1.25rem' }}>{hasFilters?'Prueba con otros filtros.':'Añade tu primera mascota para empezar.'}</div>
          {!hasFilters && <button className="btn btn-primary" onClick={()=>setModalOpen(true)}>Añadir mascota</button>}
        </div>
      ) : viewMode==='grid' ? (
        <div className="grid-auto">
          {filteredPets.map(pet=><PetCard key={pet.id} pet={pet} onClick={()=>navigate(`/pets/${pet.id}`)} photo={photos[pet.id]}/>)}
          <div className="pet-card" style={{ borderStyle:'dashed',justifyContent:'center',alignItems:'center',minHeight:200,opacity:.6 }}
            onClick={()=>setModalOpen(true)} onMouseOver={e=>(e.currentTarget.style.opacity='1')} onMouseOut={e=>(e.currentTarget.style.opacity='.6')}>
            <div style={{ fontSize:'2rem',color:'var(--primary)' }}>＋</div>
            <div style={{ fontSize:'.875rem',color:'var(--text-muted)',marginTop:'.5rem' }}>Añadir mascota</div>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:'.5rem' }}>
          {filteredPets.map(pet=>(
            <div key={pet.id} className="list-item" style={{ background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-xl)',padding:'.875rem 1.25rem',cursor:'pointer' }}
              onClick={()=>navigate(`/pets/${pet.id}`)}>
              <div className="pet-avatar-photo" style={{ width:48,height:48,fontSize:'1.375rem' }}>
                {photos[pet.id]?<img src={photos[pet.id]} alt={pet.name}/>:<span>{SPECIES_EMOJI[pet.species]??'🐾'}</span>}
              </div>
              <div className="list-item-info"><div className="list-item-title">{pet.name}</div><div className="list-item-sub">{pet.breed??'Raza desconocida'} · {pet.species}</div></div>
              <div style={{ display:'flex',gap:'.375rem',alignItems:'center' }}>
                {pet.alerts.length>0 && <span className={`badge ${pet.alerts[0].type==='err'?'badge-red':'badge-yellow'}`}>⚠</span>}
                <MiniVaccRing coverage={calcVaccCoverage(pet.id)} size={38} strokeWidth={4}/>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPetModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} onAdd={addPet}/>
    </div>
  )
}
```

## File: src/App.tsx
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PitutiProvider } from './context/PitutiContext'
import { SymptomsProvider } from './context/SymptomsContext'
import { LanguageProvider } from './context/LanguageContext'
import { CaresProvider } from './context/CaresContext'
import { VetProvider } from './context/VetContext'

import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import PetListPage from './pages/PetListPage'
import PetDetailPage from './pages/PetDetailPage'
import VaccinesPage from './pages/VaccinesPage'
import MedicationsPage from './pages/MedicationsPage'
import SymptomsPage from './pages/SymptomsPage'
import NotesPage from './pages/NotesPage'
import CaresPage from './pages/CaresPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'
import VetPage from './pages/VetPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <LanguageProvider>
      <PitutiProvider>
        <SymptomsProvider>
          <CaresProvider>
            <VetProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="pets" element={<PetListPage />} />
                    <Route path="pets/:petId" element={<PetDetailPage />} />
                    <Route path="vaccines" element={<VaccinesPage />} />
                    <Route path="medications" element={<MedicationsPage />} />
                    <Route path="symptoms" element={<SymptomsPage />} />
                    <Route path="notes" element={<NotesPage />} />
                    <Route path="cares" element={<CaresPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="vet" element={<VetPage />} />
                  </Route>

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </VetProvider>
          </CaresProvider>
        </SymptomsProvider>
      </PitutiProvider>
    </LanguageProvider>
  )
}
```

## File: src/index.css
```css
@import "tailwindcss";

/* ═══════════════════════════════════════════════════════════
   PITUTI Design
   Paleta: Lilac Fizz / Cotton Candy / Mauvelous / Polar Sky / Denim
   ═══════════════════════════════════════════════════════════ */

:root, [data-theme="light"] {
  --pal-lilac:  #CCA1C9;
  --pal-candy:  #FFD3DD;
  --pal-mauve:  #F3A0AD;
  --pal-sky:    #BED1E3;
  --pal-denim:  #92A1C3;

  --bg:            #FBF7F5;
  --surface:       #FFFFFF;
  --surface-2:     #FEF9F7;
  --surface-offset:#F5EFEB;
  --divider:       #EDE4DF;
  --border:        #E2D8D2;

  --text:          #28211D;
  --text-muted:    #8A7E77;
  --text-faint:    #C5BAB4;
  --text-inv:      #FFFFFF;

  --primary:       #5B6C9E;
  --primary-h:     #3E4F7F;
  --primary-hl:    #EAEDf8;

  --warn:          #B86012;
  --warn-hl:       #FEF1E6;
  --err:           #C8406A;
  --err-hl:        #FDEAEF;
  --success:       #558060;
  --success-hl:    #E2F0E6;
  --gold:          #9A7800;
  --gold-hl:       #FFF4D4;
  --blue:          #466CB0;
  --blue-hl:       #E4EDF8;

  --nav-bg:          #2A3462;
  --nav-text:        rgba(230,225,255,.72);
  --nav-text-active: #FFFFFF;
  --nav-active:      rgba(255,255,255,.13);
  --nav-hover:       rgba(255,255,255,.07);
  --nav-label:       rgba(200,195,240,.40);
  --topbar-bg:       #2A3462;
  --topbar-border:   rgba(255,255,255,.10);

  --r-sm:.4rem; --r-md:.625rem; --r-lg:1rem; --r-xl:1.375rem; --r-full:9999px;

  --sh-sm: 0 2px 8px rgba(44,52,98,.07);
  --sh-md: 0 6px 20px rgba(44,52,98,.11);
  --sh-lg: 0 16px 40px rgba(44,52,98,.16);

  --trans: 200ms cubic-bezier(.16,1,.3,1);
  --font-body:    'Nunito', system-ui, sans-serif;
  --font-display: 'Fraunces', Georgia, serif;
  --sidebar-w:    224px;
  --topbar-h:     60px;
}

[data-theme="dark"] {
  --bg:#13111F; --surface:#1C1929; --surface-2:#231F33;
  --surface-offset:#2A2640; --divider:#312D48; --border:#3E3A58;
  --text:#F0ECFF; --text-muted:#9D96C4; --text-faint:#6860A0; --text-inv:#13111F;
  --primary:#9AAAE0; --primary-h:#B4C0EC; --primary-hl:#1E2448;
  --warn:#F0A050; --warn-hl:#2E1A06; --err:#F07898; --err-hl:#30101E;
  --success:#88C890; --success-hl:#0C2210; --gold:#EDD050; --gold-hl:#281A00;
  --blue:#8AB4E8; --blue-hl:#0C1E30;
  --sh-sm:0 2px 8px rgba(0,0,0,.38); --sh-md:0 6px 20px rgba(0,0,0,.52); --sh-lg:0 16px 40px rgba(0,0,0,.68);
}

/* ── Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}
body {
  font-family: var(--font-body);
  font-size: .9375rem;
  color: var(--text);
  background: var(--bg);
  min-height: 100dvh;
  line-height: 1.5;
}
button { cursor: pointer; background: none; border: none; font: inherit; color: inherit }
a { color: inherit; text-decoration: none }
img { display: block; max-width: 100% }
ul { list-style: none }
input, select, textarea { font: inherit; color: inherit }
*:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; border-radius: var(--r-sm) }

/* ── App Shell ──────────────────────────────────────────── */
.app {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  grid-template-rows: var(--topbar-h) 1fr;
  min-height: 100vh;
  transition: grid-template-columns var(--trans);
}
.app.sidebar-collapsed { --sidebar-w: 64px }

/* ── Topbar ─────────────────────────────────────────────── */
.topbar {
  grid-column: 1/-1;
  display: flex; align-items: center; gap: 1rem;
  padding: 0 1.25rem;
  background: var(--topbar-bg);
  border-bottom: 1px solid var(--topbar-border);
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,.18);
}
.topbar-logo {
  display: flex; align-items: center; gap: .625rem;
  font-family: var(--font-display); font-size: 1.35rem;
  color: #fff;
  min-width: calc(var(--sidebar-w) - 2rem);
  white-space: nowrap; overflow: hidden;
}
.topbar-logo span { font-style: italic; transition: opacity var(--trans), transform var(--trans) }
.sidebar-collapsed .topbar-logo span { opacity: 0; transform: translateX(-8px); pointer-events: none; width: 0; overflow: hidden }
.topbar-search {
  flex: 1; max-width: 360px;
  display: flex; align-items: center; gap: .5rem;
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: var(--r-full);
  padding: .38rem .875rem;
  color: rgba(255,255,255,.6);
  font-size: .875rem;
  transition: background var(--trans), border-color var(--trans);
}
.topbar-search:focus-within { background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.28) }
.topbar-search input { background: none; border: none; outline: none; flex: 1; color: #fff }
.topbar-search input::placeholder { color: rgba(255,255,255,.45) }
.topbar-actions { margin-left: auto; display: flex; align-items: center; gap: .5rem }
.topbar-icon-btn {
  width: 36px; height: 36px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.65);
  transition: background var(--trans), color var(--trans);
}
.topbar-icon-btn:hover { background: rgba(255,255,255,.1); color: #fff }
.topbar-avatar {
  width: 34px; height: 34px; border-radius: var(--r-full);
  background: var(--pal-lilac); color: var(--nav-bg);
  font-size: .75rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid rgba(255,255,255,.3);
}
.notif-dot { position: relative }
.notif-dot::after {
  content: ''; position: absolute; top: 6px; right: 6px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--pal-mauve); border: 2px solid var(--topbar-bg);
}

/* ── Sidebar ────────────────────────────────────────────── */
.sidebar {
  position: sticky;
  background: var(--nav-bg);
  padding: .875rem .625rem;
  display: flex; flex-direction: column; gap: .2rem;
  overflow: hidden;
  box-shadow: 4px 0 20px rgba(0,0,0,.12);
  top: 0;
  height: 100vh;
}

.sidebar-section-label {
  font-size: .625rem; font-weight: 800; letter-spacing: .12em;
  text-transform: uppercase; color: var(--nav-label);
  padding: .625rem .625rem .25rem;
  white-space: nowrap; overflow: hidden;
  transition: opacity var(--trans);
}
.sidebar-collapsed .sidebar-section-label { opacity: 0 }
.nav-item {
  display: flex; align-items: center; gap: .625rem;
  padding: .55rem .75rem; border-radius: var(--r-lg);
  font-size: .875rem; color: var(--nav-text);
  cursor: pointer; white-space: nowrap;
  transition: background var(--trans), color var(--trans);
  position: relative; font-weight: 600;
}
.nav-item:hover { background: var(--nav-hover); color: #fff }
.nav-item.active { background: var(--nav-active); color: var(--nav-text-active) }
.nav-label { transition: opacity var(--trans), width var(--trans) }
.sidebar-collapsed .nav-label { opacity: 0; width: 0; overflow: hidden }
.nav-badge {
  margin-left: auto; background: var(--pal-mauve); color: #fff;
  font-size: .6rem; font-weight: 800;
  padding: .1rem .4rem; border-radius: var(--r-full);
  transition: opacity var(--trans);
}
.sidebar-collapsed .nav-badge { opacity: 0 }
.sidebar-toggle { margin-top: auto; padding: .5rem .625rem }
.sidebar-divider { height: 1px; background: rgba(255,255,255,.08); margin: .4rem .625rem }

/* ── Main ───────────────────────────────────────────────── */
.main { overflow-y: auto; background: var(--bg); padding: 1.75rem 2rem }
.page { display: none }
.page.active { display: block }

/* ── Page Header ────────────────────────────────────────── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
}
.page-title { font-size: 1.375rem; font-weight: 800; color: var(--text); font-family: var(--font-display) }
.page-subtitle { font-size: .875rem; color: var(--text-muted); margin-top: .125rem }

/* ── Buttons ────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .5rem 1.125rem; border-radius: var(--r-lg);
  font-size: .875rem; font-weight: 700; cursor: pointer; border: none;
  transition: background var(--trans), color var(--trans), box-shadow var(--trans), transform var(--trans);
}
.btn:active { transform: scale(.97) }
.btn-primary { background: var(--primary); color: #fff }
.btn-primary:hover { background: var(--primary-h); box-shadow: var(--sh-md) }
.btn-secondary { background: var(--surface-2); color: var(--text); border: 1.5px solid var(--border) }
.btn-secondary:hover { background: var(--surface-offset) }
.btn-ghost { color: var(--text-muted) }
.btn-ghost:hover { background: var(--surface-offset); color: var(--text) }
.btn-sm { padding: .3rem .75rem; font-size: .8125rem }
.btn-danger { background: var(--err-hl); color: var(--err) }
.btn-danger:hover { background: var(--err); color: #fff }

/* ── Cards ──────────────────────────────────────────────── */
.card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--r-xl); padding: 1.375rem;
  box-shadow: var(--sh-sm);
}
.card-title {
  font-size: .9375rem; font-weight: 800; color: var(--text);
  margin-bottom: .875rem;
  display: flex; align-items: center; gap: .5rem; justify-content: space-between;
}

/* ── Grid Utils ─────────────────────────────────────────── */
.grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.125rem }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.125rem }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.125rem }
.grid-auto { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 1.125rem }
@media(max-width:900px) { .grid-4,.grid-3 { grid-template-columns: repeat(2,1fr) } .grid-2 { grid-template-columns: 1fr } }

/* ── KPI Cards ──────────────────────────────────────────── */
.kpi {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--r-xl); padding: 1rem 1.25rem;
  box-shadow: var(--sh-sm); display: flex; flex-direction: column; gap: .25rem;
}
.kpi-label { font-size: .75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .07em }
.kpi-value { font-size: 1.75rem; font-weight: 800; color: var(--text); line-height: 1; font-variant-numeric: tabular-nums }
.kpi-sub { font-size: .75rem; color: var(--text-muted); display: flex; align-items: center; gap: .25rem; margin-top: .125rem }
.kpi-icon { width: 36px; height: 36px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; margin-bottom: .25rem }

/* ── Badge ──────────────────────────────────────────────── */
.badge {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .2rem .65rem; border-radius: var(--r-full);
  font-size: .6875rem; font-weight: 800;
}
.badge-green  { background: var(--success-hl); color: var(--success) }
.badge-yellow { background: var(--gold-hl);    color: var(--gold) }
.badge-red    { background: var(--err-hl);     color: var(--err) }
.badge-blue   { background: var(--blue-hl);    color: var(--blue) }
.badge-gray   { background: var(--surface-offset); color: var(--text-muted) }

/* ── Tabs ───────────────────────────────────────────────── */
.tabs { display: flex; gap: .25rem; border-bottom: 1.5px solid var(--divider); margin-bottom: 1.25rem; flex-wrap: wrap }
.tab {
  padding: .625rem 1rem; font-size: .875rem; font-weight: 600;
  color: var(--text-muted); cursor: pointer;
  border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
  transition: color var(--trans), border-color var(--trans);
}
.tab:hover { color: var(--text) }
.tab.active { color: var(--primary); border-bottom-color: var(--primary) }

/* ── Timeline ───────────────────────────────────────────── */
.timeline { display: flex; flex-direction: column; gap: 0 }
.timeline-item { display: flex; gap: .875rem; padding: .875rem 0; border-bottom: 1.5px solid var(--divider) }
.timeline-item:last-child { border-bottom: none }
.tl-icon { width: 34px; height: 34px; border-radius: var(--r-full); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: .1rem }
.tl-icon.vaccine  { background: var(--blue-hl);    color: var(--blue) }
.tl-icon.med      { background: var(--warn-hl);    color: var(--warn) }
.tl-icon.symptom  { background: var(--err-hl);     color: var(--err) }
.tl-icon.note     { background: var(--primary-hl); color: var(--primary) }
.tl-title { font-size: .875rem; font-weight: 700; color: var(--text) }
.tl-meta  { font-size: .75rem; color: var(--text-muted) }
.tl-time  { font-size: .75rem; color: var(--text-faint); margin-left: auto; white-space: nowrap }

/* ── List Items ─────────────────────────────────────────── */
.list-item { display: flex; align-items: center; gap: .875rem; padding: .875rem .75rem; border-radius: var(--r-lg); transition: background var(--trans); cursor: pointer }
.list-item:hover { background: var(--surface-offset) }
.list-item-icon { width: 38px; height: 38px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
.list-item-info { flex: 1; min-width: 0 }
.list-item-title { font-size: .875rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
.list-item-sub   { font-size: .75rem; color: var(--text-muted) }
.list-item-right { display: flex; align-items: center; gap: .5rem; flex-shrink: 0 }

/* ── Progress Bar ───────────────────────────────────────── */
.progress-wrap { background: var(--surface-offset); border-radius: var(--r-full); height: 7px; overflow: hidden }
.progress-bar  { height: 100%; border-radius: var(--r-full); background: var(--primary); transition: width .6s cubic-bezier(.16,1,.3,1) }
.progress-bar.warn    { background: var(--warn) }
.progress-bar.err     { background: var(--err) }
.progress-bar.success { background: var(--success) }

/* ── Stat Row / Chips ───────────────────────────────────── */
.stat-row { display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap }
.stat-chip { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-lg); padding: .625rem 1rem; flex: 1; min-width: 100px }
.stat-chip-label { font-size: .6875rem; text-transform: uppercase; letter-spacing: .07em; color: var(--text-faint); font-weight: 700; margin-bottom: .2rem }
.stat-chip-value { font-size: 1.1rem; font-weight: 800; color: var(--text) }

/* ── Divider ────────────────────────────────────────────── */
.divider { height: 1.5px; background: var(--divider); margin: 1rem 0 }

/* ── Vaccine Row ────────────────────────────────────────── */
.vaccine-row { display: flex; align-items: center; gap: .875rem; padding: .75rem 0; border-bottom: 1.5px solid var(--divider) }
.vaccine-row:last-child { border-bottom: none }
.vaccine-icon { width: 38px; height: 38px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
.vaccine-name { font-size: .875rem; font-weight: 700; color: var(--text) }
.vaccine-date { font-size: .75rem; color: var(--text-muted) }
.vaccine-next { font-size: .75rem; font-weight: 700 }
.vaccine-next.ok   { color: var(--success) }
.vaccine-next.soon { color: var(--warn) }
.vaccine-next.late { color: var(--err) }

/* ── Reminder Banner ────────────────────────────────────── */
.reminder-banner {
  background: linear-gradient(135deg, var(--warn-hl), var(--surface));
  border: 1.5px solid rgba(184,96,18,.2); border-radius: var(--r-xl);
  padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;
}

/* ── Table ──────────────────────────────────────────────── */
.table-wrap { overflow-x: auto; border-radius: var(--r-lg); border: 1.5px solid var(--border) }
table { width: 100%; border-collapse: collapse; font-size: .875rem }
thead th { background: var(--surface-offset); padding: .625rem 1rem; text-align: left; font-weight: 800; font-size: .75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; border-bottom: 1.5px solid var(--border) }
tbody tr { border-bottom: 1px solid var(--divider); transition: background var(--trans); cursor: pointer }
tbody tr:last-child { border-bottom: none }
tbody tr:hover { background: var(--surface-offset) }
tbody td { padding: .75rem 1rem; color: var(--text); vertical-align: middle }

/* ── Form ───────────────────────────────────────────────── */
.form-group { display: flex; flex-direction: column; gap: .375rem; margin-bottom: 1rem }
.form-label { font-size: .8125rem; font-weight: 700; color: var(--text-muted) }
.form-input { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-md); padding: .5rem .875rem; font-size: .875rem; color: var(--text); transition: border-color var(--trans), box-shadow var(--trans); outline: none }
.form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl) }
.form-input::placeholder { color: var(--text-faint) }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem }

/* ── Modal ──────────────────────────────────────────────── */
.modal-backdrop { position: fixed; inset: 0; background: rgba(20,16,36,.55); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity var(--trans) }
.modal-backdrop.open { opacity: 1; pointer-events: all }
.modal { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.625rem; width: 100%; max-width: 490px; box-shadow: var(--sh-lg); transform: scale(.96) translateY(8px); transition: transform var(--trans) }
.modal-backdrop.open .modal { transform: scale(1) translateY(0) }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem }
.modal-title  { font-size: 1rem; font-weight: 800; color: var(--text) }
.modal-footer { display: flex; justify-content: flex-end; gap: .5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1.5px solid var(--divider) }

/* ── Toast ──────────────────────────────────────────────── */
.toast { position: fixed; bottom: 1.5rem; right: 1.5rem; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: .875rem 1.125rem; box-shadow: var(--sh-lg); display: flex; align-items: center; gap: .75rem; font-size: .875rem; z-index: 300; transform: translateY(8px); opacity: 0; transition: transform var(--trans), opacity var(--trans); max-width: 340px }
.toast.show { transform: translateY(0); opacity: 1 }
.toast-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }

/* ── Empty State ────────────────────────────────────────── */
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 3rem 1.5rem; color: var(--text-muted) }
.empty h3 { font-size: .9375rem; font-weight: 700; color: var(--text); margin-bottom: .375rem }
.empty p  { font-size: .875rem; max-width: 30ch; margin-bottom: 1.25rem }

/* ── Pet Card ───────────────────────────────────────────── */
.pet-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.25rem; box-shadow: var(--sh-sm); cursor: pointer; transition: box-shadow var(--trans), border-color var(--trans), transform var(--trans); display: flex; flex-direction: column; gap: .875rem }
.pet-card:hover { box-shadow: var(--sh-md); border-color: var(--pal-denim); transform: translateY(-2px) }
.pet-card.selected { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl), var(--sh-md) }
.pet-avatar { width: 56px; height: 56px; border-radius: var(--r-full); object-fit: cover; background: var(--primary-hl); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0 }
.pet-card-header { display: flex; align-items: flex-start; gap: .75rem }
.pet-card-name { font-weight: 800; font-size: 1rem; color: var(--text) }
.pet-card-breed { font-size: .8125rem; color: var(--text-muted) }
.pet-card-footer { display: flex; align-items: center; gap: .5rem; padding-top: .75rem; border-top: 1.5px solid var(--divider) }
.last-activity { font-size: .75rem; color: var(--text-faint); margin-left: auto }

/* ── Pet Profile Detail ─────────────────────────────────── */
.pet-profile-hero { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.5rem; box-shadow: var(--sh-sm); display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.25rem; flex-wrap: wrap }
.pet-profile-avatar { width: 90px; height: 90px; border-radius: var(--r-full); background: linear-gradient(135deg, var(--pal-lilac), var(--pal-denim)); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; flex-shrink: 0; border: 3px solid var(--pal-sky) }

/* ── Caregiver Avatars ──────────────────────────────────── */
.caregiver-avatars { display: flex }
.caregiver-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--primary-hl); color: var(--primary); font-size: .5rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid var(--surface); margin-left: -5px }
.caregiver-avatar:first-child { margin-left: 0 }

/* ═══════════════════════════════════════════════════════════
   PAW DASHBOARD
   ═══════════════════════════════════════════════════════════ */

.dash-greeting { text-align: center; margin-bottom: 1.75rem }
.dash-greeting .greeting-name { font-family: var(--font-display); font-size: 1.75rem; font-weight: 400; color: var(--text); line-height: 1.2 }
.dash-greeting .greeting-date { font-size: .8125rem; color: var(--text-muted); margin-top: .3rem }
.dash-section-label { font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); margin-bottom: .625rem }

.paw-wrapper { display: flex; flex-direction: column; align-items: center; gap: 1.5rem }

/* ── Pata orgânica e realista ── */
.paw-layout { position: relative; width: 320px; height: 300px; flex-shrink: 0 }

.paw-bubble { position: absolute; border-radius: 50%; border: 4px solid var(--bg); box-shadow: var(--sh-md); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 200ms cubic-bezier(.16,1,.3,1), box-shadow 200ms; background: var(--surface-offset) }
.paw-bubble-clip { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative }
.paw-bubble-clip img { width: 100%; height: 100%; object-fit: cover; display: block }
.paw-bubble:hover { transform: scale(1.08); box-shadow: var(--sh-lg) }

/* Palma — grande, circular, frente de todos */
.paw-main { width: 164px; height: 164px; bottom: 0; left: 50%; transform: translateX(-50%); border-width: 5px; font-size: 3rem; border-radius: 50%; z-index: 2 }
.paw-main:hover { transform: translateX(-50%) scale(1.05) }
.paw-main .paw-bubble-clip { border-radius: 50% }

/* Dedos — layout SIMÉTRICO como no modelo:
   toe-1 e toe-2: mesma altura no topo, centrados, quase se tocando
   toe-3 e toe-4: mesma altura nas laterais, um nível abaixo            */
.paw-toe { font-size: 1.25rem; z-index: 1 }

.paw-toe-1 { width: 84px; height: 84px; top: 10px; left: 68px  }
.paw-toe-2 { width: 84px; height: 84px; top: 10px; right: 68px }
.paw-toe-3 { width: 76px; height: 76px; top: 96px; left: 0     }
.paw-toe-4 { width: 76px; height: 76px; top: 96px; right: 0    }

.paw-dot { position: absolute; top: 5px; right: 5px; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid var(--bg); z-index: 3; pointer-events: none }
.paw-dot.warn  { background: var(--warn) }
.paw-dot.err   { background: var(--err) }
.paw-dot.ok    { background: var(--success) }

.paw-pet-name { position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); font-size: .6rem; font-weight: 800; color: var(--text); white-space: nowrap; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-full); padding: .1rem .45rem; pointer-events: none; box-shadow: var(--sh-sm) }

.paw-caption { font-size: .875rem; color: var(--text-muted); text-align: center; font-weight: 600; letter-spacing: .01em }

.paw-alerts { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: .5rem }
.paw-alert { display: flex; align-items: flex-start; gap: .625rem; padding: .7rem 1rem; border-radius: var(--r-lg); font-size: .875rem; line-height: 1.4 }
.paw-alert.warn { background: var(--warn-hl); color: var(--warn); border: 1.5px solid rgba(184,96,18,.15) }
.paw-alert.err  { background: var(--err-hl);  color: var(--err);  border: 1.5px solid rgba(200,64,106,.15) }
.paw-alert-text { color: var(--text); flex: 1 }
.paw-alert-text strong { color: var(--text); display: block }

.paw-kpis { display: flex; gap: .625rem; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 440px }
.paw-kpi { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: .75rem 1rem; box-shadow: var(--sh-sm); text-align: center; flex: 1; min-width: 90px }
.paw-kpi-value { font-size: 1.5rem; font-weight: 800; color: var(--text); line-height: 1; font-variant-numeric: tabular-nums }
.paw-kpi-label { font-size: .6875rem; color: var(--text-muted); margin-top: .2rem; text-transform: uppercase; letter-spacing: .07em; font-weight: 700 }
.paw-kpi-sub   { font-size: .6875rem; margin-top: .2rem; font-weight: 700 }

.paw-see-all { font-size: .8125rem; color: var(--primary); cursor: pointer; text-align: center; font-weight: 700 }
.paw-see-all:hover { text-decoration: underline }

.paw-empty { display: flex; flex-direction: column; align-items: center; gap: .75rem; padding: 2rem; text-align: center; color: var(--text-muted) }
.paw-empty-icon { font-size: 3rem }

/* ── Quick Action Grid ──────────────────────────────────── */
.quick-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .875rem; width: 100%; max-width: 440px }
@media(max-width:600px) { .quick-grid { grid-template-columns: repeat(2,1fr) } }

.quick-card { border-radius: var(--r-xl); padding: 1rem .875rem; display: flex; flex-direction: column; align-items: flex-start; gap: .5rem; cursor: pointer; border: none; text-align: left; transition: transform var(--trans), box-shadow var(--trans); box-shadow: var(--sh-sm); position: relative; overflow: hidden }
.quick-card:hover { transform: translateY(-3px); box-shadow: var(--sh-md) }
.quick-card:active { transform: scale(.97) }
.quick-icon { width: 42px; height: 42px; border-radius: var(--r-lg); background: rgba(255,255,255,.35); display: flex; align-items: center; justify-content: center; font-size: 1.3rem }
.quick-label { font-size: .8rem; font-weight: 800; color: rgba(40,30,24,.75); line-height: 1.2 }
.quick-sub   { font-size: .7rem; color: rgba(40,30,24,.55); font-weight: 600 }

.qc-vacunas  { background: linear-gradient(140deg, var(--pal-candy), #FFC8D8) }
.qc-meds     { background: linear-gradient(140deg, var(--pal-sky), #A8C4E0) }
.qc-sintomas { background: linear-gradient(140deg, var(--pal-mauve), #F08898) }
.qc-notas    { background: linear-gradient(140deg, var(--pal-lilac), #B888C0) }
.qc-agenda   { background: linear-gradient(140deg, #C8D8F0, var(--pal-sky)) }
.qc-mascotas { background: linear-gradient(140deg, var(--pal-denim), #7888B8) }

/* ── Event Row ──────────────────────────────────────────── */
.event-row { display: flex; align-items: center; gap: .875rem; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: .875rem 1.125rem; box-shadow: var(--sh-sm); cursor: pointer; transition: box-shadow var(--trans), border-color var(--trans), transform var(--trans) }
.event-row:hover { box-shadow: var(--sh-md); border-color: var(--pal-denim); transform: translateY(-1px) }
.event-row.event-urgent { border-color: rgba(200,64,106,.35); background: var(--err-hl) }
.event-date-badge { display: flex; flex-direction: column; align-items: center; min-width: 36px; text-align: center }
.edb-day { font-size: 1.25rem; font-weight: 800; line-height: 1; color: var(--text) }
.edb-mon { font-size: .6rem; font-weight: 800; letter-spacing: .08em; color: var(--text-faint); text-transform: uppercase }
.event-icon { width: 40px; height: 40px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0 }
.event-info { flex: 1; min-width: 0 }
.event-title { font-size: .875rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
.event-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }

/* ── Care System ────────────────────────────────────────── */
.care-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem }

.care-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.125rem; box-shadow: var(--sh-sm); display: flex; flex-direction: column; gap: .75rem; transition: box-shadow var(--trans), border-color var(--trans) }
.care-card:hover { box-shadow: var(--sh-md) }
.care-card.done { border-color: var(--success); background: linear-gradient(135deg, var(--surface), var(--success-hl)) }
.care-card.done .care-title { color: var(--success) }

.care-header { display: flex; align-items: center; gap: .75rem }
.care-emoji  { width: 48px; height: 48px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: var(--sh-sm) }
.care-title { font-size: .9rem; font-weight: 800; color: var(--text) }
.care-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }

.care-progress { display: flex; align-items: center; gap: .5rem; font-size: .75rem; font-weight: 700; color: var(--text-muted) }
.care-dots { display: flex; gap: .3rem }
.care-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--surface-offset); border: 1.5px solid var(--border); transition: background var(--trans), border-color var(--trans) }
.care-dot.done { background: var(--success); border-color: var(--success) }

.care-actions { display: flex; gap: .5rem; margin-top: .25rem }
.care-btn-do { flex: 1; padding: .5rem; border-radius: var(--r-lg); background: var(--primary); color: #fff; font-size: .8125rem; font-weight: 800; cursor: pointer; border: none; transition: background var(--trans), transform var(--trans), box-shadow var(--trans); display: flex; align-items: center; justify-content: center; gap: .375rem }
.care-btn-do:hover { background: var(--primary-h); box-shadow: var(--sh-sm) }
.care-btn-do:active { transform: scale(.96) }
.care-btn-do.done-btn { background: var(--success) }
.care-btn-cfg { width: 36px; height: 36px; border-radius: var(--r-lg); background: var(--surface-offset); color: var(--text-muted); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: .8rem; transition: background var(--trans) }
.care-btn-cfg:hover { background: var(--primary-hl); color: var(--primary) }

.dash-care-strip { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1rem 1.25rem; box-shadow: var(--sh-sm); width: 100% }
.care-strip-items { display: flex; gap: .625rem; flex-wrap: wrap; margin-top: .625rem }
.care-strip-item { display: flex; align-items: center; gap: .375rem; background: var(--surface-offset); border: 1.5px solid var(--border); border-radius: var(--r-full); padding: .3rem .75rem; font-size: .8rem; font-weight: 700; color: var(--text-muted); cursor: pointer; transition: background var(--trans), border-color var(--trans), color var(--trans) }
.care-strip-item:hover { background: var(--primary-hl); border-color: var(--primary); color: var(--primary) }
.care-strip-item.done { background: var(--success-hl); border-color: var(--success); color: var(--success) }
.care-strip-item.urgent { background: var(--err-hl); border-color: var(--err); color: var(--err) }

/* ── Share ──────────────────────────────────────────────── */
.shared-user { display: flex; align-items: center; gap: .75rem; padding: .625rem .75rem; border-radius: var(--r-lg); background: var(--surface-offset) }
.shared-user-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 800; flex-shrink: 0 }
.shared-user-name  { font-size: .875rem; font-weight: 700; color: var(--text) }
.shared-user-role  { font-size: .75rem; color: var(--text-muted) }

/* ── Notes Cards ────────────────────────────────────────── */
.note-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.125rem; box-shadow: var(--sh-sm) }

/* ── Scrollbar ──────────────────────────────────────────── */
::-webkit-scrollbar { width: 5px; height: 5px }
::-webkit-scrollbar-track { background: transparent }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px }
::-webkit-scrollbar-thumb:hover { background: var(--text-faint) }

/* ── Skeleton ───────────────────────────────────────────── */
@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
.skeleton-shimmer {
  background: linear-gradient(90deg, var(--surface-offset) 25%, var(--divider) 50%, var(--surface-offset) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD MOCKUP — grid 3 colunas com eventos abaixo do centro
═══════════════════════════════════════════════════════ */

.dash-mockup-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.3fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "left  center right"
    "left  events right";
  gap: 1.25rem;
  align-items: start;
  width: 100%;
  padding: 1.25rem 1.5rem 2rem;
  box-sizing: border-box;
}

.dash-col-left    { grid-area: left;   display: flex; flex-direction: column; gap: 1.25rem; }
.dash-col-center  { grid-area: center; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1rem 1rem 1.25rem; }
.dash-col-eventos { grid-area: events; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1rem; }
.dash-col-right   { grid-area: right;  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1rem; }

/* Cuidados — lista vertical */
.dash-care-col {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}
.care-strip-item {
  padding: .55rem .875rem;
  border-radius: var(--r-md);
  background: var(--bg);
  border: 1px solid var(--border);
  font-size: .85rem;
  cursor: pointer;
  transition: background 140ms, border-color 140ms, opacity 140ms;
  display: flex;
  align-items: center;
  gap: .5rem;
  user-select: none;
}
.care-strip-item:hover      { background: var(--surface-offset); }
.care-strip-item.urgent     { border-left: 3px solid var(--err); }
.care-strip-item.urgent .care-label { color: var(--err); }
.care-strip-item.done       { opacity: .52; }
.care-strip-item.done .care-label { text-decoration: line-through; }
.care-check { font-size: .8rem; color: var(--text-muted); min-width: 14px; }
.care-strip-item.done .care-check { color: var(--success); font-weight: 700; }
.care-emoji  { font-size: 1rem; }
.care-label  { flex: 1; color: var(--text); font-size: .84rem; }
.care-qty    {
  font-size: .72rem; font-weight: 700;
  color: var(--text-muted);
  background: var(--surface-offset);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  padding: .1rem .45rem;
  min-width: 28px;
  text-align: center;
}
.care-strip-item.urgent .care-qty { color: var(--err); border-color: var(--err); background: var(--err-hl); }
.care-strip-item.done .care-qty   { opacity: .5; }

/* ── Care dots — círculos de ocorrência ── */
.care-dots {
  display: flex;
  gap: .28rem;
  align-items: center;
  margin-left: auto;
  flex-shrink: 0;
}
.care-dot-btn {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  font-size: .65rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 120ms, border-color 120ms, color 120ms;
  padding: 0;
  line-height: 1;
}
.care-dot-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.care-dot-btn.filled {
  background: var(--success-hl);
  border-color: var(--success);
  color: var(--success);
  font-weight: 700;
}
.care-strip-item.urgent .care-dot-btn:not(.filled) {
  border-color: var(--err);
  color: var(--err);
}

/* KPIs na coluna direita */
.dash-kpi-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .625rem;
  margin-bottom: .5rem;
}
.dash-kpi-col .paw-kpi {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: .75rem .875rem;
  transition: border-color 150ms, box-shadow 150ms;
}
.dash-kpi-col .paw-kpi:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-hl);
}

/* Responsive — tablet */
@media (max-width: 900px) {
  .dash-mockup-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "left   center"
      "left   events"
      "right  right";
  }
}
@media (max-width: 600px) {
  .dash-mockup-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "left" "center" "events" "right";
    padding: .75rem;
  }
}


/* ── Formulários — validação ─────────────────────────────── */
.form-error {
  display: block;
  font-size: .75rem;
  color: var(--err);
  font-weight: 600;
  margin-top: .3rem;
  animation: fadeIn .18s ease;
}

.form-input.input-error {
  border-color: var(--err) !important;
  box-shadow: 0 0 0 3px rgba(200,64,106,.13);
}

.form-input.input-error:focus {
  outline-color: var(--err);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}


/* ═══════════════════════════════════════════════════════════
   APM — Add Pet Modal & Shared Popup System
   Usar em: RegisterVaccineModal, ShareModal, CareSettingsModal
═══════════════════════════════════════════════════════════ */

/* Overlay — fundo desfocado */
.apm-overlay {
  position: fixed; inset: 0;
  background: rgba(20,16,36,.55);
  backdrop-filter: blur(6px);
  z-index: 400;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: apm-fade-in 180ms ease both;
}
@keyframes apm-fade-in { from { opacity: 0 } to { opacity: 1 } }

/* Sheet — o card branco central */
.apm-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  width: 100%; max-width: 480px;
  box-shadow: var(--sh-lg);
  display: flex; flex-direction: column;
  max-height: 92dvh;
  overflow: hidden;
  animation: apm-slide-in 220ms cubic-bezier(.16,1,.3,1) both;
}
@keyframes apm-slide-in {
  from { opacity: 0; transform: scale(.96) translateY(10px) }
  to   { opacity: 1; transform: scale(1)  translateY(0) }
}

/* Header */
.apm-header {
  display: flex; align-items: center; gap: .875rem;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1.5px solid var(--divider);
  flex-shrink: 0;
}
.apm-header-icon {
  width: 44px; height: 44px; border-radius: var(--r-lg);
  background: var(--primary-hl); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.375rem; flex-shrink: 0;
}
.apm-header-title {
  font-size: 1rem; font-weight: 800; color: var(--text);
  font-family: var(--font-display);
}
.apm-header-sub {
  font-size: .8125rem; color: var(--text-muted); margin-top: .125rem;
}
.apm-close {
  margin-left: auto; width: 32px; height: 32px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); font-size: .875rem;
  transition: background var(--trans), color var(--trans);
  flex-shrink: 0;
}
.apm-close:hover { background: var(--surface-offset); color: var(--text) }

/* Body — scrollável */
.apm-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.apm-footer {
  display: flex; justify-content: flex-end; gap: .5rem;
  padding: .875rem 1.5rem;
  border-top: 1.5px solid var(--divider);
  flex-shrink: 0;
}
.apm-btn-cancel {
  padding: .45rem 1rem; border-radius: var(--r-lg);
  font-size: .875rem; font-weight: 700;
  color: var(--text-muted);
  transition: background var(--trans);
}
.apm-btn-cancel:hover { background: var(--surface-offset) }
.apm-btn-save {
  padding: .45rem 1.25rem; border-radius: var(--r-lg);
  background: var(--primary); color: #fff;
  font-size: .875rem; font-weight: 700;
  transition: background var(--trans), box-shadow var(--trans), transform var(--trans);
}
.apm-btn-save:hover { background: var(--primary-h); box-shadow: var(--sh-md) }
.apm-btn-save:active { transform: scale(.97) }

/* Fields */
.apm-field { display: flex; flex-direction: column; gap: .3rem; margin-bottom: .875rem }
.apm-label {
  font-size: .8rem; font-weight: 800;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em;
}
.apm-input {
  width: 100%;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: .55rem .875rem;
  font-size: .875rem; color: var(--text);
  outline: none;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.apm-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl) }
.apm-input::placeholder { color: var(--text-faint) }
.apm-input--err { border-color: var(--err) !important; box-shadow: 0 0 0 3px var(--err-hl) !important }
.apm-row { display: grid; grid-template-columns: 1fr 1fr; gap: .875rem }
@media(max-width:480px) { .apm-row { grid-template-columns: 1fr } }

/* Error hint */
.apm-error {
  display: flex; align-items: center; gap: .375rem;
  font-size: .75rem; color: var(--err); font-weight: 700; margin-top: .25rem;
}
.apm-error-dot {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--err); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .625rem; font-weight: 900; flex-shrink: 0;
}

/* Success banner */
.apm-success {
  display: flex; flex-direction: column; align-items: center;
  gap: .875rem; padding: 2.5rem 1rem; text-align: center;
}
.apm-success-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--success); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; font-weight: 900;
  animation: apm-pop .35s cubic-bezier(.16,1,.3,1);
}
@keyframes apm-pop { from { transform: scale(.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
.apm-success-text { font-size: 1rem; font-weight: 800; color: var(--text) }

/* ── Form error hint ────────────────────────────────────── */
.form-hint-err {
  display: block;
  font-size: .75rem; font-weight: 700;
  color: var(--err);
  margin-top: .25rem;
}
.form-input.form-input--err {
  border-color: var(--err) !important;
  box-shadow: 0 0 0 3px var(--err-hl) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROFESSIONAL MODAL INTERNALS
   Estilos para conteúdo interno dos modais — compatível com
   o componente <Modal> nativo do projeto.
═══════════════════════════════════════════════════════════ */

/* Hero banner interno do modal */
.modal-hero {
  display: flex; align-items: center; gap: .875rem;
  padding: 1rem 1.25rem 1rem;
  margin: -1.625rem -1.625rem 1.25rem;  /* sangra até a borda do .modal */
  background: linear-gradient(135deg, var(--primary-hl), var(--surface));
  border-bottom: 1.5px solid var(--divider);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
}
.modal-hero-icon {
  width: 48px; height: 48px; border-radius: var(--r-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; flex-shrink: 0;
  background: var(--primary); box-shadow: var(--sh-sm);
}
.modal-hero-title {
  font-family: var(--font-display);
  font-size: 1.0625rem; font-weight: 700; color: var(--text);
  line-height: 1.2;
}
.modal-hero-sub {
  font-size: .8rem; color: var(--text-muted); margin-top: .15rem;
}

/* Section label dentro do modal */
.modal-section {
  font-size: .7rem; font-weight: 800;
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--text-faint);
  margin: 1.125rem 0 .625rem;
  display: flex; align-items: center; gap: .5rem;
}
.modal-section::after {
  content: ''; flex: 1; height: 1px; background: var(--divider);
}

/* Campo com ícone prefixo */
.field-icon-wrap { position: relative }
.field-icon-wrap .field-icon {
  position: absolute; left: .75rem; top: 50%;
  transform: translateY(-50%);
  font-size: .9rem; pointer-events: none;
  color: var(--text-faint);
}
.field-icon-wrap .form-input { padding-left: 2.25rem }

/* Erro inline */
.form-hint-err {
  display: flex; align-items: center; gap: .375rem;
  font-size: .75rem; font-weight: 700; color: var(--err);
  margin-top: .25rem;
}
.form-hint-err::before {
  content: '!';
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--err); color: #fff;
  font-size: .6rem; font-weight: 900; flex-shrink: 0;
}
.form-input--err {
  border-color: var(--err) !important;
  box-shadow: 0 0 0 3px var(--err-hl) !important;
}

/* Cuidador row aprimorado */
.caregiver-row {
  display: flex; align-items: center; gap: .75rem;
  padding: .625rem .875rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  transition: border-color var(--trans);
}
.caregiver-row:hover { border-color: var(--pal-denim) }
.caregiver-row-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 800; flex-shrink: 0;
}
.caregiver-row-name  { font-size: .875rem; font-weight: 700; color: var(--text) }
.caregiver-row-role  { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }

/* Opções de acesso (radio visual) */
.access-options { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .875rem }
.access-option {
  display: flex; align-items: center; gap: .75rem;
  padding: .625rem .875rem;
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: border-color var(--trans), background var(--trans);
}
.access-option:hover { background: var(--surface-offset) }
.access-option.selected {
  border-color: var(--primary);
  background: var(--primary-hl);
}
.access-option-icon {
  width: 32px; height: 32px; border-radius: var(--r-md);
  background: var(--surface-offset);
  display: flex; align-items: center; justify-content: center;
  font-size: .95rem; flex-shrink: 0;
}
.access-option.selected .access-option-icon { background: var(--primary); }
.access-option-label { font-size: .875rem; font-weight: 700; color: var(--text) }
.access-option-sub   { font-size: .75rem; color: var(--text-muted) }
.access-radio {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid var(--border);
  margin-left: auto; flex-shrink: 0;
  transition: border-color var(--trans), background var(--trans);
  display: flex; align-items: center; justify-content: center;
}
.access-option.selected .access-radio {
  border-color: var(--primary);
  background: var(--primary);
}
.access-option.selected .access-radio::after {
  content: ''; width: 6px; height: 6px;
  border-radius: 50%; background: #fff;
}

/* Toggle row */
.toggle-row {
  display: flex; align-items: center; gap: .75rem;
  padding: .75rem .875rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: .875rem;
}
.toggle-row-info { flex: 1 }
.toggle-row-label { font-size: .875rem; font-weight: 700; color: var(--text) }
.toggle-row-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }
.toggle-pill {
  width: 44px; height: 24px; border-radius: 99px;
  border: none; cursor: pointer; position: relative;
  flex-shrink: 0; transition: background .2s;
}
.toggle-pill-thumb {
  position: absolute; top: 2px;
  width: 20px; height: 20px; border-radius: 50%;
  background: #fff; transition: left .2s;
}

/* Sucesso inline no modal */
.modal-success {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 2rem 1rem; text-align: center;
}
.modal-success-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: var(--success); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  animation: modal-success-pop .4s cubic-bezier(.16,1,.3,1);
}
@keyframes modal-success-pop {
  from { transform: scale(.4); opacity: 0 }
  to   { transform: scale(1);  opacity: 1 }
}
.modal-success-title { font-size: 1rem; font-weight: 800; color: var(--text) }
.modal-success-sub   { font-size: .875rem; color: var(--text-muted); max-width: 28ch }


/* ═══════════════════════════════════════════════════════════
   MODAL — pm-*
   Overlay + sheet com header rico, body scrollável, footer fixo
   ═══════════════════════════════════════════════════════════ */

/* Overlay / backdrop */
.pm-overlay {
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(20, 16, 44, 0.60);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  /* entrada */
  animation: pm-fade-in 180ms cubic-bezier(.16,1,.3,1) both;
}

@keyframes pm-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Sheet / card */
.pm-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow:
    0 2px 8px  rgba(44,52,98,.08),
    0 8px 32px rgba(44,52,98,.18),
    0 32px 80px rgba(44,52,98,.22);
  width: 100%;
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* entrada com leve rise */
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}

@keyframes pm-rise {
  from { opacity: 0; transform: scale(.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1)   translateY(0);    }
}

/* ════════════════════════════════════════════════════════════
   MODAL HERO HEADER — single header, no duplication
   ════════════════════════════════════════════════════════════ */

/* Remove the old pm-header */
.pm-header { display: none !important; }

/* New hero header — replaces pm-header */
.pm-hero-header {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: 1.25rem 1.5rem 1.125rem;
  border-bottom: 1.5px solid var(--divider);
  flex-shrink: 0;
  border-radius: var(--r-xl) var(--r-xl) 0 0;
}

.pm-hero-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.15);
}

.pm-hero-text {
  flex: 1;
  min-width: 0;
}

.pm-hero-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
  font-family: var(--font-display);
  margin: 0;
}

.pm-hero-subtitle {
  font-size: .8125rem;
  color: var(--text-muted);
  margin: .2rem 0 0;
}

/* Close button — same style as before */
.pm-close {
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  background: rgba(0,0,0,.07);
  border: 1.5px solid rgba(0,0,0,.08);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--trans), color var(--trans), border-color var(--trans), transform var(--trans);
}
.pm-close:hover { background: var(--err-hl); color: var(--err); border-color: rgba(200,64,106,.25); }
.pm-close:active { transform: scale(.92); }

/* ── Body (scrollável) ── */
.pm-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.375rem 1.5rem;
  scroll-behavior: smooth;
}

/* scrollbar fina dentro do body */
.pm-body::-webkit-scrollbar { width: 4px; }
.pm-body::-webkit-scrollbar-track { background: transparent; }
.pm-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* ── Footer ── */
.pm-footer {
  display: flex;
  justify-content: flex-end;
  gap: .625rem;
  padding: 0.625rem 0.875rem 0.75rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
  flex-shrink: 0;
}

/* Botão primário dentro do footer — largura mínima */
.pm-footer .btn-primary { min-width: 140px; justify-content: center; }

/* ── Utilitários de formulário dentro do modal ── */
.pm-section-label {
  font-size: .6875rem;
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 1rem 0 .625rem;
}

.pm-divider {
  height: 1.5px;
  background: var(--divider);
  margin: 1rem 0;
}

/* Error hint abaixo de inputs */
.form-hint-err {
  display: block;
  font-size: .75rem;
  font-weight: 700;
  color: var(--err);
  margin-top: .25rem;
}
.form-input.form-input--err {
  border-color: var(--err) !important;
  box-shadow: 0 0 0 3px var(--err-hl) !important;
}

/* Toggle switch reutilizável */
.pm-toggle-row {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border-radius: var(--r-lg);
  border: 1.5px solid var(--border);
}
.pm-toggle-row .list-item-info { flex: 1; }

/* ── Manter compatibilidade com o modal antigo ── */
/* (caso alguma página ainda use .modal-backdrop / .modal) */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(20,16,36,.55);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity var(--trans);
}
.modal-backdrop.open { opacity: 1; pointer-events: all; }
.modal {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.625rem;
  width: 100%; max-width: 490px;
  box-shadow: var(--sh-lg);
  transform: scale(.96) translateY(8px);
  transition: transform var(--trans);
}
.modal-backdrop.open .modal { transform: scale(1) translateY(0); }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
.modal-title  { font-size: 1rem; font-weight: 800; color: var(--text); }
.modal-footer { display: flex; justify-content: flex-end; gap: .5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1.5px solid var(--divider); }



/* ═══════════════════════════════════════════════════════════════
   MODAL FORMS — mf-*
   Campos com prefix, species-grid, access-cards, caregiver-row
   ═══════════════════════════════════════════════════════════════ */

/* Rótulo de seção */
.mf-section-label {
  font-size: .6875rem;
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0 0 .625rem;
}
.mf-divider { height: 1.5px; background: var(--divider); margin: 1.125rem 0; }

/* Campo genérico */
.mf-field { display: flex; flex-direction: column; gap: .325rem; margin-bottom: .875rem; }
.mf-field:last-child { margin-bottom: 0; }
.mf-label { font-size: .8125rem; font-weight: 700; color: var(--text-muted); }
.mf-optional { font-size: .7rem; font-weight: 600; color: var(--text-faint); }

/* Input wrapper com prefix/suffix */
.mf-input-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.mf-input-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-hl);
}
.mf-input-wrap--err {
  border-color: var(--err) !important;
  box-shadow: 0 0 0 3px var(--err-hl) !important;
}
.mf-input-wrap--textarea { align-items: flex-start; }

.mf-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  font-size: 1rem;
  color: var(--text-muted);
  background: var(--surface-offset);
  border-right: 1.5px solid var(--border);
  align-self: stretch;
  flex-shrink: 0;
}
.mf-suffix {
  display: flex;
  align-items: center;
  padding: 0 .625rem;
  font-size: .8125rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--surface-offset);
  border-left: 1.5px solid var(--border);
  align-self: stretch;
  flex-shrink: 0;
}

.mf-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: .5625rem .75rem;
  font-size: .9rem;
  color: var(--text);
  outline: none;
  font-family: inherit;
  min-width: 0;
}
.mf-input::placeholder { color: var(--text-faint); }
.mf-select { appearance: none; cursor: pointer; }

.mf-err {
  font-size: .75rem;
  font-weight: 700;
  color: var(--err);
  display: flex;
  align-items: center;
  gap: .25rem;
}
.mf-err::before { content: '⚠'; font-size: .7rem; }

/* Dois campos lado a lado */
.mf-row { display: grid; grid-template-columns: 1fr 1fr; gap: .875rem; }
@media (max-width: 460px) { .mf-row { grid-template-columns: 1fr; } }

/* ── Species grid ── */
.mf-species-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .5rem;
}
@media (max-width: 400px) { .mf-species-grid { grid-template-columns: repeat(3, 1fr); } }

.mf-species-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .25rem;
  padding: .625rem .375rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: background var(--trans), border-color var(--trans), transform var(--trans);
  font-family: inherit;
}
.mf-species-card:hover { background: var(--primary-hl); border-color: var(--primary); }
.mf-species-card.active { border-color: var(--primary); box-shadow: 0 0 0 2.5px var(--primary-hl); }
.mf-species-card:active { transform: scale(.94); }
.mf-species-emoji { font-size: 1.375rem; line-height: 1; }
.mf-species-label { font-size: .65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: .04em; }

/* ── Preview card ── */
.mf-preview {
  display: flex;
  align-items: center;
  gap: .75rem;
  margin-top: 1rem;
  padding: .875rem 1rem;
  background: var(--success-hl);
  border: 1.5px solid var(--success);
  border-radius: var(--r-lg);
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}

/* ── Caregiver row ── */
.mf-caregiver-row {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  transition: background var(--trans);
}
.mf-caregiver-row:hover { background: var(--surface); }
.mf-caregiver-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 800;
  flex-shrink: 0;
  box-shadow: var(--sh-sm);
}

/* ── Access level cards ── */
.mf-access-card {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  font-family: inherit;
  transition: background var(--trans), border-color var(--trans);
  text-align: left;
  width: 100%;
}
.mf-access-card:hover { background: var(--primary-hl); border-color: var(--primary); }
.mf-access-card.active { background: var(--primary-hl); border-color: var(--primary); box-shadow: 0 0 0 2.5px var(--primary-hl); }
.mf-access-icon { font-size: 1.25rem; flex-shrink: 0; width: 32px; text-align: center; }

/* Radio indicator */
.mf-radio {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
  transition: border-color var(--trans), background var(--trans);
  position: relative;
}
.mf-radio.checked {
  border-color: var(--primary);
  background: var(--primary);
}
.mf-radio.checked::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: #fff;
}

/* ── Toggle row ── */
.mf-toggle-row {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: .875rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
}

/* ── Improved Buttons ──────────────────────────────────────── */

.btn-primary {
  background: linear-gradient(150deg, var(--primary) 0%, #3d4f82 100%);
  box-shadow: 0 2px 8px rgba(91,108,158,.28), inset 0 1px 0 rgba(255,255,255,.12);
  border: none;
}
.btn-primary:hover {
  background: linear-gradient(150deg, #4a5a8f 0%, var(--primary-h) 100%);
  box-shadow: 0 5px 18px rgba(91,108,158,.44), inset 0 1px 0 rgba(255,255,255,.15);
  transform: translateY(-1px) !important;
}
.btn-primary:active { transform: scale(.97) translateY(0) !important; }

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1.5px solid var(--border);
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.btn-secondary:hover {
  background: var(--surface-offset);
  border-color: var(--text-faint);
  box-shadow: 0 2px 8px rgba(0,0,0,.10);
}

/* Ghost is used for "Cancelar / Cerrar" — give it a clear border so it's not invisible */
.btn-ghost {
  color: var(--text-muted);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  background: transparent;
  transition: all var(--trans);
}
.btn-ghost:hover {
  background: var(--surface-offset);
  color: var(--text);
  border-color: var(--text-faint);
}

.btn-danger {
  background: var(--err-hl);
  color: var(--err);
  border: 1.5px solid rgba(200,64,106,.3);
}
.btn-danger:hover {
  background: var(--err);
  color: #fff;
  box-shadow: 0 4px 14px rgba(200,64,106,.35);
  border-color: transparent;
}

/* Footer buttons always have min-width so they look proportional */
.pm-footer .btn,
.apm-footer .btn {
  min-width: 120px;
  justify-content: center;
}
.pm-footer .btn-ghost,
.apm-footer .btn-ghost { min-width: 90px; }

/* ── FormDateField ─────────────────────────────────────────── */

.fdf-wrap { display: flex; flex-direction: column; gap: .375rem; }
.fdf-label { font-size: .8125rem; font-weight: 700; color: var(--text-muted); }
.fdf-required { color: var(--err); margin-left: .2rem; }

.fdf-row {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  cursor: pointer;
  overflow: hidden;
  transition: border-color var(--trans), box-shadow var(--trans);
  position: relative;
  min-height: 40px;
}
.fdf-row:hover   { border-color: var(--text-faint); }
.fdf-row:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl); }
.fdf-row--err    { border-color: var(--err) !important; box-shadow: 0 0 0 3px var(--err-hl) !important; }

.fdf-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  color: var(--primary);
  background: var(--primary-hl);
  border-right: 1.5px solid var(--border);
  align-self: stretch;
  flex-shrink: 0;
}

.fdf-display {
  flex: 1;
  padding: .5rem .75rem;
  font-size: .875rem;
  color: var(--text);
  font-weight: 500;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fdf-placeholder { color: var(--text-faint); font-weight: 400; }

.fdf-clear {
  width: 28px; height: 28px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-faint);
  flex-shrink: 0;
  margin-right: .25rem;
  transition: background var(--trans), color var(--trans);
}
.fdf-clear:hover { background: var(--err-hl); color: var(--err); }

.fdf-native {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  pointer-events: none; /* click handled by wrapper */
}

.fdf-msg { font-size: .75rem; font-weight: 600; margin-top: .2rem; }
.fdf-msg--err  { color: var(--err); }
.fdf-msg--hint { color: var(--text-faint); }

/* ── Emoji Picker Grid ─────────────────────────────────────── */

.emoji-picker-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: .3rem;
  margin-bottom: .625rem;
}
@media(max-width:460px) { .emoji-picker-grid { grid-template-columns: repeat(6, 1fr); } }

.emoji-pick-btn {
  width: 36px; height: 36px;
  border-radius: var(--r-md);
  border: 1.5px solid var(--border);
  background: var(--surface-offset);
  font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background var(--trans), border-color var(--trans), transform var(--trans);
}
.emoji-pick-btn:hover  { background: var(--primary-hl); border-color: var(--primary); transform: scale(1.12); }
.emoji-pick-btn.active { background: var(--primary-hl); border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-hl); transform: scale(1.1); }

/* ── Symptom category grid ─────────────────────────────────── */

.symptom-cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .5rem;
  margin-bottom: 1rem;
}
@media(max-width:400px) { .symptom-cat-grid { grid-template-columns: repeat(3, 1fr); } }

.symptom-cat-btn {
  display: flex; flex-direction: column; align-items: center; gap: .25rem;
  padding: .625rem .375rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: all var(--trans);
  font-family: inherit;
}
.symptom-cat-btn:hover  { background: var(--primary-hl); border-color: var(--primary); }
.symptom-cat-btn.active { background: var(--primary-hl); border-color: var(--primary); box-shadow: 0 0 0 2.5px var(--primary-hl); }

/* ── Severity buttons ──────────────────────────────────────── */

.severity-btn {
  display: flex; align-items: center; gap: .75rem;
  width: 100%; padding: .75rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  font-family: inherit;
  transition: background var(--trans), border-color var(--trans);
  text-align: left;
}
.severity-btn:hover { filter: brightness(.97); }

/* ── Note type grid ────────────────────────────────────────── */

.note-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .5rem;
  margin-bottom: 1rem;
}
@media(max-width:400px) { .note-type-grid { grid-template-columns: repeat(2, 1fr); } }

.note-type-btn {
  display: flex; flex-direction: column; align-items: center; gap: .25rem;
  padding: .625rem .375rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: all var(--trans);
  font-family: inherit;
}
.note-type-btn:hover  { background: var(--primary-hl); border-color: var(--primary); }
.note-type-btn.active { box-shadow: 0 0 0 2.5px var(--primary-hl); }

/* ═══════════════════════════════════════════════════════════════
   VACCINES CALENDAR
   ═══════════════════════════════════════════════════════════════ */

.vacc-cal {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.375rem;
  box-shadow: var(--sh-sm);
}

/* Header */
.vacc-cal-header {
  display: flex;
  align-items: center;
  gap: .625rem;
  margin-bottom: 1.125rem;
}
.vacc-cal-month-title {
  flex: 1;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: var(--text);
  text-transform: capitalize;
  font-family: var(--font-display);
}
.vacc-cal-nav {
  width: 34px; height: 34px;
  border-radius: var(--r-md);
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: background var(--trans), color var(--trans), border-color var(--trans);
  flex-shrink: 0;
}
.vacc-cal-nav:hover { background: var(--primary-hl); color: var(--primary); border-color: var(--primary); }

.vacc-cal-today-btn {
  padding: .3rem .75rem;
  border-radius: var(--r-full);
  background: var(--primary-hl);
  color: var(--primary);
  font-size: .75rem;
  font-weight: 800;
  border: 1.5px solid var(--primary);
  cursor: pointer;
  transition: background var(--trans);
  white-space: nowrap;
}
.vacc-cal-today-btn:hover { background: var(--primary); color: #fff; }

/* Weekday headers */
.vacc-cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: .25rem;
}
.vacc-cal-wd {
  text-align: center;
  font-size: .625rem;
  font-weight: 800;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: .3rem 0;
}

/* Day grid */
.vacc-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}
.vacc-cal-pad { min-height: 52px; }

.vacc-cal-day {
  min-height: 52px;
  border-radius: var(--r-md);
  padding: .375rem .25rem .3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: background var(--trans), border-color var(--trans), box-shadow var(--trans);
  position: relative;
  user-select: none;
}
.vacc-cal-day:hover { background: var(--surface-offset); }
.vacc-cal-day.has-events { background: rgba(91,108,158,.06); }
.vacc-cal-day.is-selected { border-color: var(--primary); background: var(--primary-hl); box-shadow: 0 0 0 2px var(--primary-hl); }
.vacc-cal-day.has-events:hover { background: var(--primary-hl); }

.vacc-cal-day-num {
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  font-size: .8125rem; font-weight: 700; color: var(--text);
  border-radius: 50%;
  transition: background var(--trans), color var(--trans);
}
.today-circle {
  background: var(--primary);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(91,108,158,.4);
}

.vacc-cal-dots {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 28px;
}
.vacc-cal-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Legend */
.vacc-cal-legend {
  display: flex;
  gap: .875rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: .875rem;
  border-top: 1.5px solid var(--divider);
}
.vacc-cal-legend-item {
  display: flex;
  align-items: center;
  gap: .375rem;
  font-size: .75rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Selected day panel */
.vacc-cal-panel {
  margin-top: 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  overflow: hidden;
  animation: pm-rise 200ms cubic-bezier(.16,1,.3,1) both;
}
.vacc-cal-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .875rem 1.125rem;
  border-bottom: 1.5px solid var(--divider);
  background: var(--surface);
}
.vacc-cal-panel-date {
  font-size: .9rem;
  font-weight: 800;
  color: var(--text);
  text-transform: capitalize;
}
.vacc-cal-panel-close {
  width: 28px; height: 28px;
  border-radius: var(--r-md);
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-muted);
  transition: background var(--trans);
}
.vacc-cal-panel-close:hover { background: var(--err-hl); color: var(--err); }

.vacc-cal-event-list { padding: .75rem 1.125rem; display: flex; flex-direction: column; gap: .5rem; }
.vacc-cal-event-row {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .625rem .875rem;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  transition: border-color var(--trans);
}
.vacc-cal-event-row:hover { border-color: var(--pal-denim); }
.vacc-cal-event-type-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.vacc-cal-event-icon {
  width: 36px; height: 36px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.vacc-cal-event-label { font-size: .875rem; font-weight: 700; color: var(--text); }
.vacc-cal-event-pet   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem; }

/* ── Care Detail Overlay ───────────────────────────────────── */
.care-detail-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(20,16,44,.55);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 180ms ease both;
}
.care-detail-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-lg);
  width: 100%; max-width: 380px;
  overflow: hidden;
  animation: pm-rise 200ms cubic-bezier(.16,1,.3,1) both;
}
.care-detail-hero {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.25rem 1.375rem 1rem;
  border-bottom: 1.5px solid var(--divider);
}
.care-detail-emoji {
  width: 56px; height: 56px; border-radius: var(--r-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; flex-shrink: 0; box-shadow: var(--sh-sm);
}
.care-detail-body { padding: 1.125rem 1.375rem; }
.care-detail-progress-row {
  display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg); padding: .75rem 1rem;
}
.care-detail-dots {
  display: flex; gap: .375rem; flex-wrap: wrap; flex: 1;
}
.care-detail-dot-btn {
  width: 30px; height: 30px; border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  font-size: .8rem; cursor: pointer;
  transition: all 160ms;
}
.care-detail-dot-btn:hover  { border-color: var(--primary); color: var(--primary); }
.care-detail-dot-btn.filled { background: var(--success-hl); border-color: var(--success); color: var(--success); font-weight: 700; }
.care-detail-footer {
  display: flex; gap: .5rem;
  padding: .875rem 1.375rem 1.25rem;
  border-top: 1.5px solid var(--divider);
}

/* ── Pet Photo Upload ───────────────────────────────────────── */
.pet-photo-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}
.pet-photo-btn {
  position: absolute; bottom: 0; right: 0;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2.5px solid var(--surface);
  cursor: pointer; font-size: .75rem;
  transition: background var(--trans), transform var(--trans);
  box-shadow: var(--sh-sm);
}
.pet-photo-btn:hover { background: var(--primary-h); transform: scale(1.1); }
.pet-photo-btn.removing { background: var(--err); }
.pet-photo-circle {
  width: 90px; height: 90px; border-radius: 50%;
  overflow: hidden; flex-shrink: 0;
  background: linear-gradient(135deg,var(--pal-lilac),var(--pal-denim));
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem;
  border: 3px solid var(--pal-sky);
}
.pet-photo-circle img { width:100%; height:100%; object-fit:cover; display:block; }

/* Pet list card photo */
.pet-avatar-photo {
  width: 56px; height: 56px; border-radius: 50%;
  overflow: hidden; flex-shrink: 0;
  background: var(--primary-hl);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}
.pet-avatar-photo img { width:100%; height:100%; object-fit:cover; }

/* Paw layout photo */
.paw-bubble-clip img { width:100%; height:100%; object-fit:cover; }

/* ── Settings Page ─────────────────────────────────────────── */
.settings-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.125rem;
}
@media(max-width:860px) { .settings-layout { grid-template-columns: 1fr; } }

.settings-profile-hero {
  display: flex; align-items: center; gap: 1.375rem;
  padding: 1.375rem;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  margin-bottom: 1.25rem;
}
.settings-avatar-wrap { position: relative; flex-shrink: 0; }
.settings-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, var(--pal-lilac), var(--pal-denim));
  color: var(--nav-bg);
  font-size: 1.5rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 3px solid var(--pal-sky);
  box-shadow: var(--sh-sm);
}
.settings-avatar img { width:100%; height:100%; object-fit:cover; }
.settings-avatar-btn {
  position: absolute; bottom: 0; right: 0;
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--surface);
  cursor: pointer; font-size: .65rem;
  transition: background var(--trans), transform var(--trans);
}
.settings-avatar-btn:hover { background: var(--primary-h); transform: scale(1.1); }
.settings-profile-info { flex: 1; }
.settings-profile-name { font-size: 1.125rem; font-weight: 800; color: var(--text); }
.settings-profile-email { font-size: .8125rem; color: var(--text-muted); margin-top: .2rem; }
.settings-profile-joined { font-size: .75rem; color: var(--text-faint); margin-top: .375rem; }

/* Settings card */
.settings-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.375rem;
  box-shadow: var(--sh-sm);
}
.settings-card-title {
  font-size: .875rem; font-weight: 800; color: var(--text);
  margin-bottom: 1rem;
  display: flex; align-items: center; gap: .5rem;
  padding-bottom: .75rem;
  border-bottom: 1.5px solid var(--divider);
}
.settings-card-title span { font-size: 1.1rem; }

/* Notification row */
.notif-row {
  display: flex; align-items: center; gap: .875rem;
  padding: .75rem 0;
  border-bottom: 1px solid var(--divider);
}
.notif-row:last-child { border-bottom: none; padding-bottom: 0; }
.notif-row-info { flex: 1; }
.notif-row-label { font-size: .875rem; font-weight: 700; color: var(--text); }
.notif-row-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem; }

/* ── Pet List Filter ────────────────────────────────────────── */
.petlist-toolbar {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.125rem;
  box-shadow: var(--sh-sm);
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: .875rem;
}
.petlist-search-row {
  display: flex; gap: .625rem; align-items: center;
}
.petlist-search-wrap {
  flex: 1;
  display: flex; align-items: center; gap: .5rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: .45rem .875rem;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.petlist-search-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-hl);
}
.petlist-search-wrap input {
  background: none; border: none; outline: none;
  font: inherit; color: var(--text); flex: 1; font-size: .9rem;
}
.petlist-search-wrap input::placeholder { color: var(--text-faint); }
.petlist-search-icon { color: var(--text-faint); flex-shrink: 0; }
.petlist-search-clear {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--surface-offset); color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem; cursor: pointer; flex-shrink: 0;
  border: 1px solid var(--border);
  transition: background var(--trans);
}
.petlist-search-clear:hover { background: var(--err-hl); color: var(--err); }

.petlist-filter-row {
  display: flex; gap: .375rem; flex-wrap: wrap; align-items: center;
}
.petlist-filter-label {
  font-size: .7rem; font-weight: 800; color: var(--text-faint);
  text-transform: uppercase; letter-spacing: .08em;
  margin-right: .25rem; flex-shrink: 0;
}
.petlist-filter-pill {
  display: flex; align-items: center; gap: .3rem;
  padding: .3rem .7rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface-offset);
  font-size: .78rem; font-weight: 700; color: var(--text-muted);
  cursor: pointer;
  transition: all var(--trans);
}
.petlist-filter-pill:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-hl); }
.petlist-filter-pill.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.petlist-sort-row {
  display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;
}
.petlist-sort-label {
  font-size: .7rem; font-weight: 800; color: var(--text-faint);
  text-transform: uppercase; letter-spacing: .08em; flex-shrink: 0;
}
.petlist-sort-btn {
  padding: .25rem .625rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface-offset);
  font-size: .75rem; font-weight: 700; color: var(--text-muted);
  cursor: pointer; transition: all var(--trans); white-space: nowrap;
}
.petlist-sort-btn:hover { border-color: var(--primary); color: var(--primary); }
.petlist-sort-btn.active { background: var(--primary-hl); color: var(--primary); border-color: var(--primary); }

.petlist-results-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: .75rem;
}
.petlist-results-count {
  font-size: .8125rem; color: var(--text-muted); font-weight: 600;
}

/* View toggle */
.petlist-view-toggle {
  display: flex; gap: .25rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg); padding: .2rem;
}
.petlist-view-btn {
  width: 28px; height: 28px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-faint);
  transition: all var(--trans);
}
.petlist-view-btn.active { background: var(--surface); color: var(--primary); box-shadow: var(--sh-sm); }

/* ── Medication Edit ────────────────────────────────────────── */
.med-row-actions {
  display: flex; gap: .375rem; align-items: center; flex-shrink: 0;
}
.med-edit-btn {
  width: 30px; height: 30px; border-radius: var(--r-md);
  background: var(--primary-hl); color: var(--primary);
  border: 1.5px solid transparent;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; cursor: pointer;
  transition: all var(--trans);
}
.med-edit-btn:hover { background: var(--primary); color: #fff; }
.med-archive-btn {
  width: 30px; height: 30px; border-radius: var(--r-md);
  background: var(--surface-offset); color: var(--text-muted);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; cursor: pointer;
  transition: all var(--trans);
}
.med-archive-btn:hover { background: var(--warn-hl); color: var(--warn); border-color: var(--warn); }

/* ── Share modal fixes ─────────────────────────────────────── */
.share-email-wide .field-icon-wrap { width: 100%; }
.caregiver-row + .caregiver-row { margin-top: .5rem; }

/* ── Notes add card ─────────────────────────────────────────── */
.note-add-card {
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--r-xl);
  padding: 1.375rem;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: .625rem; cursor: pointer;
  min-height: 180px;
  transition: border-color var(--trans), background var(--trans), opacity var(--trans);
  opacity: .65;
  text-align: center;
}
.note-add-card:hover { border-color: var(--primary); background: var(--primary-hl); opacity: 1; }
.note-add-card-icon {
  width: 44px; height: 44px; border-radius: var(--r-lg);
  background: var(--primary-hl); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.375rem; transition: background var(--trans);
}
.note-add-card:hover .note-add-card-icon { background: var(--primary); color: #fff; }
.note-add-card-label { font-size: .875rem; font-weight: 800; color: var(--text-muted); }
.note-add-card-sub   { font-size: .75rem; color: var(--text-faint); }

/* ════════════════════════════════════════════════════════════
   MODAL FOOTER — always flush right
   ════════════════════════════════════════════════════════════ */

.pm-footer {
  display: flex;
  align-items: center;
  gap: .625rem;
  padding: .875rem 1.5rem 1.125rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
  flex-shrink: 0;
}

/* Default: right-align everything */
.pm-footer--right {
  justify-content: flex-end;
}

/* When there's a left destructive action */
.pm-footer--spread {
  justify-content: space-between;
}

/* PfBtn inside pm-footer also get right-align */
.pm-footer .pf-btn,
.pm-footer .btn {
  flex-shrink: 0;
}

/* The cancel/ghost button is always visually first (leftmost of right group) */
.pm-footer > .pf-btn--cancel,
.pm-footer > .pf-btn--close,
.pm-footer > .btn-ghost {
  order: -1;
}

/* All footer buttons get minimum width for visual balance */
.apm-footer .btn {
  min-width: 110px;
  justify-content: center;
  font-size: .875rem;
  font-weight: 700;
  padding: .55rem 1.25rem;
  border-radius: var(--r-lg);
  transition: all 180ms cubic-bezier(.16,1,.3,1);
}

/* Cancel/Close - always subtle but clearly tappable */
.pm-footer .btn-ghost,
.apm-footer .btn-ghost {
  min-width: 90px;
  background: var(--surface-offset);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
}
.pm-footer .btn-ghost:hover,
.apm-footer .btn-ghost:hover {
  background: var(--surface);
  color: var(--text);
  border-color: var(--text-faint);
}

/* Primary CTA - bold gradient */
.pm-footer .btn-primary,
.apm-footer .btn-primary {
  background: linear-gradient(150deg, var(--primary) 0%, #3d4f82 100%);
  box-shadow: 0 3px 12px rgba(91,108,158,.35), inset 0 1px 0 rgba(255,255,255,.12);
  border: none;
  color: #fff;
  letter-spacing: .01em;
}
.pm-footer .btn-primary:hover,
.apm-footer .btn-primary:hover {
  background: linear-gradient(150deg, #4a5a8f 0%, var(--primary-h) 100%);
  box-shadow: 0 6px 20px rgba(91,108,158,.45);
  transform: translateY(-1px);
}

/* Danger in footer */
.pm-footer .btn-danger,
.apm-footer .btn-danger {
  background: var(--err-hl);
  color: var(--err);
  border: 1.5px solid rgba(200,64,106,.3);
  min-width: 90px;
}
.pm-footer .btn-danger:hover {
  background: var(--err);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(200,64,106,.35);
}

/* Success state in footer */
.pm-footer .btn-success {
  background: linear-gradient(150deg, var(--success) 0%, #3d7a4a 100%);
  color: #fff;
  border: none;
  box-shadow: 0 3px 12px rgba(85,128,96,.35);
}
.pm-footer .btn-success:hover {
  box-shadow: 0 6px 20px rgba(85,128,96,.45);
  transform: translateY(-1px);
}

/* Footer left area for destructive actions */
.pm-footer-left {
  margin-right: auto;
  display: flex;
  gap: .5rem;
}

/* ── Detail Overlay (vaccine, med, symptom, note) ──────────── */
.detail-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(16,12,36,.6);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 160ms ease both;
}
.detail-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow:
    0 4px 16px rgba(44,52,98,.10),
    0 12px 40px rgba(44,52,98,.20),
    0 40px 80px rgba(44,52,98,.20);
  width: 100%;
  max-width: 420px;
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}
.detail-header {
  display: flex; align-items: center; gap: .875rem;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1.5px solid var(--divider);
  flex-shrink: 0;
}
.detail-icon {
  width: 48px; height: 48px; border-radius: var(--r-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.375rem; flex-shrink: 0; box-shadow: var(--sh-sm);
}
.detail-close {
  margin-left: auto;
  width: 32px; height: 32px;
  border-radius: var(--r-md);
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all var(--trans);
}
.detail-close:hover { background: var(--err-hl); color: var(--err); }

.detail-body {
  padding: 1.125rem 1.5rem;
  overflow-y: auto; flex: 1;
}
.detail-body::-webkit-scrollbar { width: 4px; }
.detail-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* ════════════════════════════════════════════════════════════
   DETAIL OVERLAY FOOTER — same right-align fix
   ════════════════════════════════════════════════════════════ */

.detail-footer {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .875rem 1.5rem 1.125rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
  flex-shrink: 0;
  justify-content: flex-end;
}

.detail-footer .btn {
  flex: 1;
  justify-content: center;
  font-size: .875rem;
  font-weight: 700;
  padding: .6rem 1rem;
  border-radius: var(--r-lg);
  transition: all 180ms cubic-bezier(.16,1,.3,1);
}
.detail-footer .btn-primary {
  background: linear-gradient(150deg, var(--primary) 0%, #3d4f82 100%);
  box-shadow: 0 3px 10px rgba(91,108,158,.3);
  color: #fff; border: none;
}
.detail-footer .btn-primary:hover { box-shadow: 0 5px 16px rgba(91,108,158,.45); transform: translateY(-1px); }
.detail-footer .btn-secondary {
  background: var(--surface);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
}
.detail-footer .btn-secondary:hover { background: var(--surface-offset); color: var(--text); }
.detail-footer .btn-success {
  background: linear-gradient(150deg, var(--success) 0%, #3d7a4a 100%);
  color: #fff; border: none;
  box-shadow: 0 3px 10px rgba(85,128,96,.3);
}
.detail-footer .btn-success:hover { box-shadow: 0 5px 16px rgba(85,128,96,.4); transform: translateY(-1px); }
.detail-footer .btn-warn {
  background: var(--warn-hl);
  color: var(--warn);
  border: 1.5px solid rgba(184,96,18,.25);
}
.detail-footer .btn-warn:hover { background: var(--warn); color: #fff; }

/* ── Detail Info Rows ────────────────────────────────────────── */
.detail-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .625rem;
  margin-bottom: 1rem;
}
.detail-info-chip {
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: .625rem .875rem;
}
.detail-info-label {
  font-size: .65rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--text-faint); margin-bottom: .25rem;
}
.detail-info-value {
  font-size: .875rem; font-weight: 700; color: var(--text);
}

/* ── Status Pill ─────────────────────────────────────────────── */
.status-pill {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .3rem .875rem;
  border-radius: var(--r-full);
  font-size: .75rem; font-weight: 800;
}
.status-pill.ok      { background: var(--success-hl); color: var(--success); border: 1.5px solid var(--success); }
.status-pill.soon    { background: var(--gold-hl);    color: var(--gold);    border: 1.5px solid var(--gold); }
.status-pill.late    { background: var(--err-hl);     color: var(--err);     border: 1.5px solid var(--err); }
.status-pill.active  { background: var(--err-hl);     color: var(--err);     border: 1.5px solid var(--err); }
.status-pill.resolved{ background: var(--success-hl); color: var(--success); border: 1.5px solid var(--success); }
.status-pill.archived{ background: var(--surface-offset); color: var(--text-faint); border: 1.5px solid var(--border); }

/* ── Vaccine/Med row clickable ───────────────────────────────── */
.vaccine-row { cursor: pointer; transition: background var(--trans), box-shadow var(--trans); border-radius: var(--r-lg); }
.vaccine-row:hover { background: var(--surface-offset); }

/* ── Modern Edit Icon ─────────────────────────────────────────── */
.icon-edit-pen {
  display: inline-flex;
}

/* ── Symptoms edit/detail ─────────────────────────────────────── */
.symptom-row-clickable {
  cursor: pointer;
  border-radius: var(--r-lg);
  transition: background var(--trans);
}
.symptom-row-clickable:hover { background: var(--surface-offset); }

/* ── Notes archived section ───────────────────────────────────── */
.notes-archived-section {
  margin-top: 2rem;
}
.notes-archived-title {
  display: flex; align-items: center; gap: .625rem;
  font-size: .75rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: .09em;
  color: var(--text-faint);
  margin-bottom: 1rem;
}
.notes-archived-title::after {
  content: ''; flex: 1; height: 1.5px; background: var(--divider);
}
.note-card-archived {
  opacity: .6;
  border-style: dashed;
  filter: grayscale(.3);
}
.note-card-archived:hover { opacity: .85; }

/* ── Settings Datos Personales ────────────────────────────────── */
.settings-field-group {
  display: flex; flex-direction: column; gap: .625rem;
  padding: 1rem;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: .875rem;
}
.settings-field-row {
  display: flex; align-items: center; gap: .75rem;
}
.settings-field-icon {
  width: 32px; height: 32px;
  border-radius: var(--r-md);
  background: var(--primary-hl);
  color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; flex-shrink: 0;
}
.settings-input-modern {
  flex: 1;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: .55rem .875rem;
  font-size: .9rem; color: var(--text);
  outline: none; font-family: inherit;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.settings-input-modern:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-hl);
}
.settings-input-modern::placeholder { color: var(--text-faint); }

/* ── Date input in detail overlay ───────────────────────────── */
.detail-date-row {
  display: flex; align-items: center; gap: .5rem;
  padding: .625rem .875rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: .875rem;
}
.detail-date-row label {
  font-size: .75rem; font-weight: 700; color: var(--text-muted);
  white-space: nowrap; flex-shrink: 0;
}
.detail-date-row input[type="date"] {
  flex: 1;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: .35rem .625rem;
  font-size: .8125rem; color: var(--text);
  outline: none; font-family: inherit;
  transition: border-color var(--trans);
}
.detail-date-row input[type="date"]:focus {
  border-color: var(--primary);
}

/* Container for footer button groups */
.pf-footer {
  display: flex;
  align-items: center;
  gap: .625rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
  flex-shrink: 0;
}
.pf-footer--spread { justify-content: space-between; }
.pf-footer--end    { justify-content: flex-end; }
.pf-footer__left   { display: flex; gap: .5rem; margin-right: auto; }
.pf-footer__right  { display: flex; gap: .5rem; margin-left: auto; }

/* Base button */
.pf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  padding: .6rem 1.25rem;
  border-radius: var(--r-lg);
  font-family: inherit;
  font-size: .875rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  letter-spacing: .01em;
  white-space: nowrap;
  min-width: 100px;
  transition:
    background 160ms cubic-bezier(.16,1,.3,1),
    box-shadow 160ms cubic-bezier(.16,1,.3,1),
    transform  100ms cubic-bezier(.16,1,.3,1),
    color      160ms;
  user-select: none;
  -webkit-user-select: none;
}
.pf-btn:active { transform: scale(.96); }
.pf-btn:disabled { opacity: .45; cursor: not-allowed; transform: none !important; }
.pf-btn svg { flex-shrink: 0; }

/* ── Variants ── */

/* Close / Cancel */
.pf-btn--close,
.pf-btn--cancel {
  background: var(--surface-offset);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
  min-width: 90px;
}
.pf-btn--close:hover,
.pf-btn--cancel:hover {
  background: var(--surface);
  color: var(--text);
  border-color: var(--text-faint);
}

/* Save / Primary action */
.pf-btn--save,
.pf-btn--primary {
  background: linear-gradient(150deg, var(--primary) 0%, #3a4c80 100%);
  color: #fff;
  box-shadow: 0 3px 10px rgba(91,108,158,.32), inset 0 1px 0 rgba(255,255,255,.14);
  border: none;
}
.pf-btn--save:hover,
.pf-btn--primary:hover {
  background: linear-gradient(150deg, #4a5a90 0%, var(--primary-h) 100%);
  box-shadow: 0 6px 20px rgba(91,108,158,.44);
  transform: translateY(-1px) scale(1);
}

/* Register / Add */
.pf-btn--register,
.pf-btn--add {
  background: linear-gradient(150deg, var(--success) 0%, #3d7a4a 100%);
  color: #fff;
  box-shadow: 0 3px 10px rgba(85,128,96,.32);
  border: none;
}
.pf-btn--register:hover,
.pf-btn--add:hover {
  box-shadow: 0 6px 20px rgba(85,128,96,.44);
  transform: translateY(-1px) scale(1);
}

/* Mark done / Applied */
.pf-btn--done {
  background: linear-gradient(150deg, #2d9e62 0%, #1e7a4a 100%);
  color: #fff;
  box-shadow: 0 3px 10px rgba(45,158,98,.3);
  border: none;
}
.pf-btn--done:hover {
  box-shadow: 0 6px 20px rgba(45,158,98,.42);
  transform: translateY(-1px) scale(1);
}

/* Edit */
.pf-btn--edit {
  background: var(--primary-hl);
  color: var(--primary);
  border: 1.5px solid rgba(91,108,158,.25);
  min-width: 90px;
}
.pf-btn--edit:hover {
  background: var(--primary);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(91,108,158,.35);
  transform: translateY(-1px) scale(1);
}

/* Archive */
.pf-btn--archive {
  background: var(--surface-offset);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
  min-width: 90px;
}
.pf-btn--archive:hover {
  background: var(--gold-hl);
  color: var(--gold);
  border-color: var(--gold);
}

/* Resolve */
.pf-btn--resolve {
  background: var(--success-hl);
  color: var(--success);
  border: 1.5px solid rgba(85,128,96,.3);
}
.pf-btn--resolve:hover {
  background: var(--success);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(85,128,96,.35);
  transform: translateY(-1px) scale(1);
}

/* Delete / Danger */
.pf-btn--delete,
.pf-btn--danger {
  background: var(--err-hl);
  color: var(--err);
  border: 1.5px solid rgba(200,64,106,.25);
  min-width: 90px;
}
.pf-btn--delete:hover,
.pf-btn--danger:hover {
  background: var(--err);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(200,64,106,.38);
  transform: translateY(-1px) scale(1);
}

/* Warn / Reopen */
.pf-btn--warn {
  background: var(--warn-hl);
  color: var(--warn);
  border: 1.5px solid rgba(184,96,18,.25);
}
.pf-btn--warn:hover {
  background: var(--warn);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(184,96,18,.35);
  transform: translateY(-1px) scale(1);
}

/* Size variants */
.pf-btn--sm {
  padding: .4rem .875rem;
  font-size: .8125rem;
  min-width: 70px;
  border-radius: var(--r-md);
}
.pf-btn--lg {
  padding: .75rem 1.75rem;
  font-size: .9375rem;
  min-width: 140px;
  border-radius: var(--r-xl);
}

/* Full width */
.pf-btn--full { width: 100%; }

/* Icon only */
.pf-btn--icon {
  width: 36px; height: 36px;
  min-width: unset;
  padding: 0;
  border-radius: var(--r-md);
}

/* ── Back Button ─────────────────────────────────────────── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  padding: .35rem .75rem;
  border-radius: var(--r-full);
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  font-size: .8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--trans);
  margin-bottom: 1rem;
  flex-shrink: 0;
}
.back-btn:hover {
  background: var(--surface);
  color: var(--primary);
  border-color: var(--primary);
}

/* ── Calendar Page ───────────────────────────────────────── */
.cal-page-toolbar {
  display: flex;
  align-items: center;
  gap: .875rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1rem 1.25rem;
  box-shadow: var(--sh-sm);
}
.cal-date-jump {
  display: flex;
  align-items: center;
  gap: .5rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: .4rem .875rem;
  flex: 1;
  max-width: 260px;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.cal-date-jump:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-hl);
}
.cal-date-jump input[type="month"],
.cal-date-jump input[type="date"] {
  background: none; border: none; outline: none;
  font: inherit; color: var(--text); font-size: .875rem;
  flex: 1;
}
.cal-filter-pills {
  display: flex;
  gap: .375rem;
  flex-wrap: wrap;
}
.cal-filter-pill {
  display: flex; align-items: center; gap: .3rem;
  padding: .3rem .7rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface-offset);
  font-size: .78rem; font-weight: 700; color: var(--text-muted);
  cursor: pointer; transition: all var(--trans);
}
.cal-filter-pill:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-hl); }
.cal-filter-pill.active { border-color: var(--primary); background: var(--primary); color: #fff; }
.cal-dot-filter { width: 8px; height: 8px; border-radius: 50%; }

/* ── Vacc Ring in PetCard ────────────────────────────────── */
.pet-card-vacc-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .1rem;
}
.pet-card-vacc-ring-label {
  font-size: .6rem;
  font-weight: 800;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: .06em;
  white-space: nowrap;
}

/* ── Overdued Events Banner in Calendar ─────────────────── */
.cal-overdue-banner {
  background: var(--err-hl);
  border: 1.5px solid rgba(200,64,106,.25);
  border-radius: var(--r-xl);
  padding: .875rem 1.125rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: .875rem;
  cursor: pointer;
  transition: background var(--trans);
}
.cal-overdue-banner:hover { background: rgba(200,64,106,.12); }

/* ── Pet Detail Expandable Chip ─────────────────────────── */
.stat-chip.clickable {
  cursor: pointer;
  transition: all var(--trans);
  position: relative;
}
.stat-chip.clickable:hover {
  border-color: var(--primary);
  background: var(--primary-hl);
  box-shadow: 0 0 0 2px var(--primary-hl);
}
.stat-chip.clickable:hover .stat-chip-label { color: var(--primary); }
.stat-chip-edit-hint {
  position: absolute;
  top: .375rem; right: .5rem;
  color: var(--text-faint);
  opacity: 0;
  transition: opacity var(--trans);
  font-size: .6rem;
}
.stat-chip.clickable:hover .stat-chip-edit-hint { opacity: 1; }

/* ── Settings Datos Personales v2 ───────────────────────── */
.settings-form-section {
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-bottom: 1rem;
}
.settings-form-section-header {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border-bottom: 1.5px solid var(--border);
  font-size: .75rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .07em;
}
.settings-form-field {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: .75rem 1rem;
  border-bottom: 1px solid var(--divider);
  transition: background var(--trans);
}
.settings-form-field:last-child { border-bottom: none; }
.settings-form-field:focus-within { background: var(--primary-hl); }
.settings-form-field-icon {
  width: 32px; height: 32px;
  border-radius: var(--r-md);
  background: var(--primary-hl);
  color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; flex-shrink: 0;
  transition: background var(--trans);
}
.settings-form-field:focus-within .settings-form-field-icon {
  background: var(--primary);
  color: #fff;
}
.settings-form-field-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: .1rem;
}
.settings-form-field-label {
  font-size: .7rem;
  font-weight: 800;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: .07em;
}
.settings-form-field-input {
  background: none;
  border: none;
  outline: none;
  font: inherit;
  font-size: .9rem;
  color: var(--text);
  padding: 0;
  width: 100%;
}
.settings-form-field-input::placeholder { color: var(--text-faint); }

/* ════════════════════════════════════════════════════════════
   PET DETAIL CHIP EDIT OVERLAY
   ════════════════════════════════════════════════════════════ */

.chip-edit-overlay {
  position: fixed;
  inset: 0;
  z-index: 600;
  background: rgba(16,12,36,.62);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 160ms ease both;
}

.chip-edit-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: 0 8px 32px rgba(44,52,98,.25), 0 32px 80px rgba(44,52,98,.2);
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  animation: pm-rise 200ms cubic-bezier(.16,1,.3,1) both;
}

.chip-edit-header {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1rem 1.25rem .875rem;
  border-bottom: 1.5px solid var(--divider);
  background: var(--primary-hl);
}

.chip-edit-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .9rem;
  flex-shrink: 0;
}

.chip-edit-title {
  font-size: .9375rem;
  font-weight: 800;
  color: var(--text);
  flex: 1;
}

.chip-edit-body {
  padding: 1.125rem 1.25rem;
}

.chip-edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: .5rem;
  padding: .875rem 1.25rem 1rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
}

/* ════════════════════════════════════════════════════════════
   INVITATION SENT OVERLAY
   ════════════════════════════════════════════════════════════ */

.invite-sent-overlay {
  position: fixed;
  inset: 0;
  z-index: 700;
  background: rgba(16,12,36,.55);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 180ms ease both;
}

.invite-sent-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-lg);
  max-width: 340px;
  width: 100%;
  text-align: center;
  padding: 2rem 1.75rem 1.5rem;
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}

.invite-sent-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--success-hl);
  border: 3px solid var(--success);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.25rem;
  animation: apm-pop .4s cubic-bezier(.16,1,.3,1);
}

/* ════════════════════════════════════════════════════════════
   DELETE ACCOUNT MODAL (danger style)
   ════════════════════════════════════════════════════════════ */

.delete-account-overlay {
  position: fixed;
  inset: 0;
  z-index: 700;
  background: rgba(16,12,36,.72);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 180ms ease both;
}

.delete-account-sheet {
  background: var(--surface);
  border: 2px solid rgba(200,64,106,.35);
  border-radius: var(--r-xl);
  box-shadow: 0 8px 40px rgba(200,64,106,.25), var(--sh-lg);
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}

.delete-account-header {
  padding: 1.5rem 1.5rem 1.25rem;
  text-align: center;
  background: linear-gradient(135deg, var(--err-hl) 0%, var(--surface) 100%);
  border-bottom: 1.5px solid rgba(200,64,106,.2);
}

.delete-account-warning-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--err);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin: 0 auto .875rem;
  animation: apm-pop .35s cubic-bezier(.16,1,.3,1);
}

/* ════════════════════════════════════════════════════════════
   GLOBAL spin animation (for loading buttons)
   ════════════════════════════════════════════════════════════ */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ════════════════════════════════════════════════════════════
   NOTE DELETE CONFIRMATION inside note detail
   ════════════════════════════════════════════════════════════ */
.note-delete-confirm {
  background: var(--err-hl);
  border: 1.5px solid rgba(200,64,106,.3);
  border-radius: var(--r-lg);
  padding: .875rem 1rem;
  margin-top: .875rem;
}

/* ════════════════════════════════════════════════════════════
   CSS CUSTOM PROPERTIES — mobile values
   ════════════════════════════════════════════════════════════ */
:root {
  --mobile-bottom-nav-h: 64px;
  --topbar-h:            60px;
  --sidebar-w:           224px;
  --sidebar-collapsed-w: 64px;
}

/* ════════════════════════════════════════════════════════════
   MOBILE MENU BUTTON — shown only on mobile
   ════════════════════════════════════════════════════════════ */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  background: rgba(255,255,255,.1);
  border: 1.5px solid rgba(255,255,255,.15);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--trans);
}
.mobile-menu-btn:hover { background: rgba(255,255,255,.18); }

/* ════════════════════════════════════════════════════════════
   MOBILE SIDEBAR EXTRAS
   ════════════════════════════════════════════════════════════ */
.sidebar-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.125rem .875rem;
  border-bottom: 1.5px solid var(--nav-hover);
  margin-bottom: .5rem;
}
.sidebar-mobile-close {
  width: 36px; height: 36px;
  border-radius: var(--r-md);
  background: rgba(255,255,255,.1);
  border: none; color: var(--nav-text-active);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background var(--trans);
}
.sidebar-mobile-close:hover { background: rgba(255,255,255,.2); }

.mobile-sidebar-backdrop {
  display: none;
  position: fixed; inset: 0;
  z-index: 149;
  background: rgba(16,12,36,.55);
  backdrop-filter: blur(4px);
  animation: pm-fade-in 160ms ease both;
}

/* ════════════════════════════════════════════════════════════
   MOBILE BOTTOM NAVIGATION
   ════════════════════════════════════════════════════════════ */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--mobile-bottom-nav-h);
  background: var(--nav-bg);
  border-top: 1.5px solid var(--nav-hover);
  padding: 0 .25rem env(safe-area-inset-bottom, 0);
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4px 20px rgba(42,52,98,.25);
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .25rem;
  flex: 1;
  height: 100%;
  padding: .375rem .25rem;
  color: var(--nav-text);
  text-decoration: none;
  border-radius: var(--r-md);
  transition: color var(--trans), background var(--trans);
  min-width: 44px;
  min-height: 44px;
}
.mobile-nav-item.active { color: var(--nav-text-active); }
.mobile-nav-item.active .mobile-nav-icon {
  background: var(--nav-active);
  border-radius: var(--r-md);
}
.mobile-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 26px;
  border-radius: var(--r-sm);
  transition: background var(--trans);
}
.mobile-nav-label {
  font-size: .6rem;
  font-weight: 700;
  text-align: center;
  line-height: 1;
  max-width: 56px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ════════════════════════════════════════════════════════════
   RESPONSIVE GRID HELPERS
   ════════════════════════════════════════════════════════════ */
/* Mobile-friendly card grids */
@media (max-width: 640px) {
  .grid-2    { grid-template-columns: 1fr !important; }
  .grid-auto { grid-template-columns: 1fr !important; }
  .grid-3    { grid-template-columns: 1fr !important; }
}

/* ════════════════════════════════════════════════════════════
   BREAKPOINT: TABLET  ≤ 1024px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  :root {
    --sidebar-w: 64px;
  }

  .sidebar { width: 64px; }
  .sidebar .nav-label,
  .sidebar .nav-badge,
  .sidebar .sidebar-section-label,
  .sidebar .sidebar-toggle .nav-label { display: none; }
  .sidebar .nav-item { justify-content: center; padding: .625rem; }
  .sidebar .sidebar-section-label { display: none; }

  .main { padding: 1.5rem 1.25rem; }
}

/* ════════════════════════════════════════════════════════════
   BREAKPOINT: MOBILE  ≤ 768px
   Full mobile layout with bottom nav
   ════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {

  /* ── Layout ── */
  .app {
    grid-template-columns: 1fr !important;
    grid-template-rows: var(--topbar-h) 1fr !important;
    grid-template-areas:
      "topbar"
      "main"  !important;
  }

  /* Hide desktop sidebar */
  .sidebar {
    position: fixed !important;
    top: 0; left: 0; bottom: 0;
    z-index: 150;
    width: 280px !important;
    transform: translateX(-100%);
    transition: transform 280ms cubic-bezier(.16,1,.3,1), box-shadow 280ms;
    box-shadow: none;
    overflow-y: auto;
    /* Show all labels in mobile drawer */
  }
  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 40px rgba(16,12,36,.35);
  }

  /* Restore labels inside mobile drawer */
  .sidebar .nav-label { display: inline !important; }
  .sidebar .nav-badge { display: inline-flex !important; }
  .sidebar .sidebar-section-label { display: block !important; }
  .sidebar .nav-item { justify-content: flex-start !important; padding: .75rem 1rem !important; }
  .sidebar .sidebar-toggle { display: none; }

  /* Show mobile-only elements */
  .mobile-menu-btn        { display: flex; }
  .mobile-bottom-nav      { display: flex; }
  .mobile-sidebar-backdrop { display: block; }
  .sidebar-mobile-header  { display: flex; }

  /* ── Topbar ── */
  .topbar {
    padding: 0 1rem;
    gap: .5rem;
  }
  .topbar-search { display: none; }
  .topbar-logo .pituti-anim-wrap { display: flex !important; width: auto !important; opacity: 1 !important; }

  /* ── Main ── */
  .main {
    padding: 1rem .875rem calc(var(--mobile-bottom-nav-h) + 1rem) !important;
    margin: 0 !important;
  }

  /* ── Page headers ── */
  .page-header {
    flex-direction: column;
    gap: .875rem;
    margin-bottom: 1.25rem;
  }
  .page-header .btn { align-self: flex-start; width: 100%; justify-content: center; }

  /* ── Cards ── */
  .card { border-radius: var(--r-lg); padding: .875rem; }
  .card-title { font-size: .875rem; margin-bottom: .75rem; }

  /* ── Dashboard ── */
  .dash-mockup-grid {
    grid-template-columns: 1fr !important;
    grid-template-areas:
      "left"
      "center"
      "right"
      "eventos" !important;
    gap: 1rem;
  }
  .dash-col-left,
  .dash-col-center,
  .dash-col-right,
  .dash-col-eventos { grid-column: 1 !important; }

  .paw-layout {
    width: 200px !important;
    height: 200px !important;
  }
  .paw-main  { width: 90px !important; height: 90px !important; }
  .paw-toe   { width: 50px !important; height: 50px !important; }
  .paw-toe-1 { bottom: 60px !important; right: 22px !important; }
  .paw-toe-2 { bottom: 60px !important; left: 22px !important; }
  .paw-toe-3 { bottom: 100px !important; right: 8px !important; }
  .paw-toe-4 { bottom: 100px !important; left: 8px !important; }

  /* ── Stat row chips ── */
  .stat-row { grid-template-columns: 1fr 1fr; gap: .5rem; }
  .stat-chip { padding: .625rem; }
  .stat-chip-value { font-size: 1rem !important; }

  /* ── Tabs ── */
  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: .25rem;
    padding-bottom: .25rem;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { white-space: nowrap; padding: .5rem .875rem; font-size: .8125rem; }

  /* ── Modal ── */
  .pm-overlay {
    align-items: flex-end !important;
    padding: 0 !important;
  }
  .pm-sheet {
    max-width: 100% !important;
    width: 100% !important;
    border-radius: var(--r-xl) var(--r-xl) 0 0 !important;
    max-height: 92dvh;
    animation: sheet-slide-up 240ms cubic-bezier(.16,1,.3,1) both !important;
  }
  @keyframes sheet-slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }

  /* ── Detail overlay ── */
  .detail-overlay {
    align-items: flex-end !important;
    padding: 0 !important;
  }
  .detail-sheet {
    max-width: 100% !important;
    border-radius: var(--r-xl) var(--r-xl) 0 0 !important;
    animation: sheet-slide-up 240ms cubic-bezier(.16,1,.3,1) both !important;
  }

  /* ── Chip edit overlay ── */
  .chip-edit-overlay {
    align-items: flex-end !important;
    padding: 0 !important;
  }
  .chip-edit-sheet {
    max-width: 100% !important;
    border-radius: var(--r-xl) var(--r-xl) 0 0 !important;
    animation: sheet-slide-up 220ms cubic-bezier(.16,1,.3,1) both !important;
  }

  /* ── Invite / delete overlays ── */
  .invite-sent-overlay,
  .delete-account-overlay {
    padding: 1rem !important;
  }
  .invite-sent-card,
  .delete-account-sheet {
    max-width: 100% !important;
  }

  /* ── Pet list / detail ── */
  .pet-card { border-radius: var(--r-lg); }
  .pet-profile-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: .875rem;
    padding: 1rem;
  }
  .pet-photo-circle {
    width: 72px !important;
    height: 72px !important;
    font-size: 2rem !important;
  }

  /* ── Settings ── */
  .settings-layout {
    grid-template-columns: 1fr !important;
    gap: 1rem;
  }
  .settings-profile-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }

  /* ── Petlist toolbar ── */
  .petlist-toolbar {
    flex-direction: column;
    gap: .625rem;
  }
  .petlist-search-row { flex-wrap: wrap; }
  .petlist-filter-row { flex-wrap: wrap; }
  .petlist-sort-row   { flex-wrap: wrap; }

  /* ── Calendar ── */
  .cal-page-toolbar {
    flex-direction: column;
    gap: .625rem;
  }
  .cal-date-jump { max-width: 100% !important; }
  .cal-filter-pills { justify-content: flex-start; }

  /* ── Buttons ── */
  .pf-btn { min-width: 80px; font-size: .8125rem; padding: .55rem 1rem; }

  /* ── Form rows ── */
  .form-row { flex-direction: column; }

  /* ── Vacc calendar ── */
  .vacc-cal-grid { gap: 2px !important; }
  .vacc-cal-day-num { font-size: .75rem !important; }

  /* ── Timeline ── */
  .timeline-item { flex-wrap: wrap; }

  /* ── Toast ── */
  .toast {
    bottom: calc(var(--mobile-bottom-nav-h) + .875rem) !important;
    left: .875rem !important;
    right: .875rem !important;
    max-width: none !important;
    border-radius: var(--r-xl) !important;
  }

  /* ── Back button ── */
  .back-btn { margin-bottom: .75rem; }

  /* ── Cares grid ── */
  .care-grid { grid-template-columns: 1fr 1fr !important; gap: .625rem !important; }
}

/* ════════════════════════════════════════════════════════════
   BREAKPOINT: SMALL MOBILE  ≤ 390px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 390px) {
  :root { font-size: 15px; }
  .main { padding: .75rem .75rem calc(var(--mobile-bottom-nav-h) + .875rem) !important; }
  .card { padding: .75rem; }
  .stat-row { grid-template-columns: 1fr 1fr; }
  .care-grid { grid-template-columns: 1fr !important; }
  .mobile-nav-label { font-size: .55rem; }
  .paw-layout { width: 180px !important; height: 180px !important; }
  .paw-main { width: 80px !important; height: 80px !important; }
}

/* ════════════════════════════════════════════════════════════
   SAFE AREA — iPhone notch / home indicator
   ════════════════════════════════════════════════════════════ */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-bottom-nav {
    padding-bottom: calc(env(safe-area-inset-bottom) + .25rem);
    height: calc(var(--mobile-bottom-nav-h) + env(safe-area-inset-bottom));
  }
  .main {
    padding-bottom: calc(var(--mobile-bottom-nav-h) + env(safe-area-inset-bottom) + 1rem);
  }
}

/* ════════════════════════════════════════════════════════════
   TOUCH TARGETS — minimum 44×44 px for all interactive items
   ════════════════════════════════════════════════════════════ */
@media (pointer: coarse) {
  .btn, .pf-btn, .nav-item, .tab, .care-btn-do, .care-btn-cfg,
  .back-btn, .cal-filter-pill, .petlist-filter-pill,
  .vacc-cal-nav, .vacc-cal-day, .toggle-pill,
  .topbar-icon-btn, .topbar-avatar,
  input[type="checkbox"], input[type="radio"] {
    min-height: 44px;
    min-width: 44px;
  }

  /* Larger touch areas on pet/vaccine rows */
  .vaccine-row, .list-item, .care-card,
  .timeline-item, .note-card, .pet-card { cursor: pointer; }

  /* More spacing between tappable items */
  .list-item + .list-item { margin-top: .25rem; }
}

/* ════════════════════════════════════════════════════════════
   FOCUS VISIBLE — keyboard accessibility
   ════════════════════════════════════════════════════════════ */
:focus-visible {
  outline: 2.5px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--r-sm);
}
.btn:focus-visible, .pf-btn:focus-visible {
  outline-offset: 3px;
}

/* ════════════════════════════════════════════════════════════
   PRINT — hide nav, show content cleanly
   ════════════════════════════════════════════════════════════ */
@media print {
  .sidebar, .topbar, .mobile-bottom-nav, .toast { display: none !important; }
  .main { margin: 0 !important; padding: 1rem !important; }
  .card { box-shadow: none; border: 1px solid #ccc; }
}

/* ════════════════════════════════════════════════════════════
   REDUCED MOTION
   ════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .calico-cat { animation: none !important; opacity: 1; transform: translateX(2px) translateY(0); }
  .pituti-anim-wrap span { opacity: 1 !important; animation: none !important; }
}

/* VET*/
@keyframes vet-day-pulse {
  0%, 100% {
    background:   color-mix(in oklab, var(--pal-lilac) 12%, var(--surface));
    border-color: color-mix(in oklab, var(--pal-denim) 35%, transparent);
  }
  50% {
    background:   color-mix(in oklab, var(--pal-lilac) 26%, var(--surface));
    border-color: var(--pal-denim);
  }
}

/* Célula do calendário com retorno marcado */
.vacc-cal-day.has-vet-appt {
  animation: vet-day-pulse 2.2s ease-in-out infinite;
  border-width: 1.5px;
}

/* Dark mode: sem animação pulsante (luz não contrasta bem), usar cor fixa */
[data-theme="dark"] .vacc-cal-day.has-vet-appt {
  animation: none;
  background:   rgba(146, 161, 195, 0.15);
  border-color: rgba(146, 161, 195, 0.45);
}

/* Banner de retorno iminente (usado em NextApptBanner no VetPage) */
@keyframes appt-banner-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(146, 161, 195, 0.25); }
  50%       { box-shadow: 0 0 0 5px rgba(146, 161, 195, 0);  }
}

.vacc-cal-day.has-vet-appt .vacc-cal-day-num {
  color: var(--pal-denim);
  font-weight: 900;
}

/* =========================
   Veterinaria
   ========================= */

.pet-selector {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-bottom: 1rem;
}

.pet-chip {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  padding: .45rem .9rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-weight: 700;
  transition: all var(--trans);
}

.pet-chip.active {
  background: var(--primary-hl);
  color: var(--primary);
  border-color: var(--primary);
}

.tabs {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tab {
  padding: .55rem .95rem;
  border-radius: var(--r-lg);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-weight: 700;
  transition: all var(--trans);
}

.tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tab-add-btn {
  align-self: flex-start;
}

.card-list {
  display: grid;
  gap: 1rem;
}

.vet-card,
.appt-card {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 1rem;
  align-items: start;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1rem;
  box-shadow: var(--sh-sm);
}

.vet-card-icon,
.appt-card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-offset);
  font-size: 1.5rem;
}

.vet-card-body,
.appt-card-body {
  min-width: 0;
}

.vet-card-name,
.appt-card-reason {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text);
}

.vet-card-clinic,
.appt-card-date,
.appt-card-vet {
  margin-top: .2rem;
  color: var(--text-muted);
  font-size: .85rem;
}

.vet-card-detail,
.appt-card-detail {
  margin-top: .45rem;
  color: var(--text);
  font-size: .85rem;
  line-height: 1.5;
}

.vet-card-phones,
.appt-card-meta {
  margin-top: .5rem;
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  color: var(--text-faint);
  font-size: .8rem;
}

.vet-card-actions,
.appt-card-actions {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  align-items: flex-end;
}

.confirm-delete {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.profile-view {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1rem;
  box-shadow: var(--sh-sm);
}

.profile-edit-btn {
  margin-bottom: 1rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .75rem;
}

.profile-row {
  display: flex;
  flex-direction: column;
  gap: .2rem;
  padding: .8rem .9rem;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
}

.profile-row-label {
  font-size: .75rem;
  color: var(--text-faint);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.profile-row-value {
  font-size: .9rem;
  color: var(--text);
  line-height: 1.45;
}

.profile-section-title {
  margin-top: 1rem;
  margin-bottom: .6rem;
  font-weight: 800;
  color: var(--text);
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.profile-tag {
  padding: .35rem .7rem;
  border-radius: var(--r-full);
  background: var(--err-hl);
  color: var(--err);
  font-size: .8rem;
  font-weight: 700;
}

.profile-empty-row,
.profile-updated {
  color: var(--text-muted);
  font-size: .85rem;
}

.profile-surgery-row {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  padding: .75rem .9rem;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
  margin-bottom: .5rem;
}

.profile-surgery-name {
  font-weight: 800;
  color: var(--text);
}

.profile-surgery-date,
.profile-surgery-notes {
  color: var(--text-muted);
  font-size: .85rem;
}

.profile-notes-section {
  margin-top: 1rem;
  display: grid;
  gap: .75rem;
}

.upcoming-section {
  display: grid;
  gap: .75rem;
}

.section-label {
  font-weight: 800;
  color: var(--text);
}

.return-banner {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: .75rem;
  align-items: center;
  padding: .9rem 1rem;
  border-radius: var(--r-xl);
  border: 1.5px solid var(--blue);
  background: var(--blue-hl);
}

.return-banner.urgent {
  border-color: var(--warn);
  background: var(--warn-hl);
}

.return-banner-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,.55);
  font-size: 1.1rem;
}

.return-banner-note {
  font-weight: 800;
  color: var(--text);
}

.return-banner-vet,
.return-banner-date {
  color: var(--text-muted);
  font-size: .82rem;
}

.return-banner-label {
  font-weight: 800;
  color: var(--text);
  text-align: right;
}

.coming-soon-card {
  display: grid;
  place-items: center;
  text-align: center;
  gap: .5rem;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--r-xl);
  padding: 2rem 1rem;
}

.coming-soon-icon {
  font-size: 2rem;
}

.coming-soon-label {
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--primary);
}

.coming-soon-text {
  color: var(--text-muted);
  max-width: 42ch;
}

/* =========================
   Calendario
   ========================= */

.cal-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, .9fr);
  gap: 1rem;
  align-items: start;
}

.cal-panel,
.cal-detail {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
}

.cal-panel {
  padding: 1rem;
}

.cal-detail {
  padding: 1rem;
  position: sticky;
  top: calc(var(--topbar-h) + 1rem);
}

.cal-toolbar,
.cal-filters,
.cal-weekdays,
.cal-grid {
  display: grid;
  gap: .75rem;
}

.cal-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .75rem;
  margin-bottom: 1rem;
}

.cal-month-title {
  font-weight: 800;
  color: var(--text);
}

.cal-weekdays {
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: .5rem;
}

.cal-weekday {
  text-align: center;
  font-size: .75rem;
  font-weight: 800;
  color: var(--text-faint);
  text-transform: uppercase;
}

.cal-grid {
  grid-template-columns: repeat(7, 1fr);
  gap: .5rem;
}

.cal-day {
  min-height: 96px;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
  padding: .45rem;
  display: flex;
  flex-direction: column;
  gap: .35rem;
  transition: all var(--trans);
}

.cal-day:hover {
  border-color: var(--primary);
}

.cal-day.is-today {
  box-shadow: inset 0 0 0 2px var(--primary);
}

.cal-day.is-selected {
  background: var(--primary-hl);
  border-color: var(--primary);
}

.cal-day.is-outside {
  opacity: .45;
}

.cal-day-number {
  font-size: .8rem;
  font-weight: 800;
  color: var(--text);
}

.cal-day-dots {
  display: flex;
  flex-wrap: wrap;
  gap: .25rem;
}

.cal-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
}

.cal-dot--care { background: var(--warn); }
.cal-dot--vaccine { background: var(--blue); }
.cal-dot--vet { background: var(--primary); }
.cal-dot--expired { background: var(--err); }
.cal-dot--done { background: var(--success); }

.cal-detail__header {
  margin-bottom: 1rem;
}

.cal-detail__title {
  font-weight: 800;
  color: var(--text);
}

.cal-detail__subtitle {
  color: var(--text-muted);
  font-size: .85rem;
  margin-top: .2rem;
}

.cal-detail__section {
  margin-top: 1rem;
}

.cal-detail__section-title {
  font-weight: 800;
  color: var(--text);
  margin-bottom: .6rem;
}

.vet-row {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  gap: .75rem;
  align-items: center;
  padding: .75rem .85rem;
  border-radius: var(--r-lg);
  background: var(--surface-2);
  border: 1.5px solid var(--divider);
  margin-bottom: .5rem;
}

.vet-row__icon,
.vet-row__badge {
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-hl);
}

.vet-row__info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.vet-row__label {
  font-weight: 800;
  color: var(--text);
}

.vet-row__kind {
  font-size: .8rem;
  color: var(--text-muted);
}

@media (max-width: 980px) {
  .cal-layout {
    grid-template-columns: 1fr;
  }

  .cal-detail {
    position: static;
  }
}

@media (max-width: 720px) {
  .profile-grid,
  .vet-card,
  .appt-card,
  .return-banner {
    grid-template-columns: 1fr;
  }

  .vet-card-actions,
  .appt-card-actions {
    align-items: stretch;
  }

  .cal-grid {
    gap: .35rem;
  }

  .cal-day {
    min-height: 82px;
  }
}
```
