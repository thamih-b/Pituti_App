//traduzido e sem mock

import { useState, useEffect, type FC } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { usePetsContext } from '../context/PetsContext'
import type { VetContact } from '../context/VetContext'
import { useTranslation } from 'react-i18next'

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

export const VET_TYPES = [
  { value: 'primary',    key: 'primary',    emoji: '🩺', color: 'var(--primary)'    },
  { value: 'specialist', key: 'specialist', emoji: '🔬', color: 'var(--blue)'       },
  { value: 'emergency',  key: 'emergency',  emoji: '🚨', color: 'var(--err)'        },
  { value: 'other',      key: 'other',      emoji: '📋', color: 'var(--text-muted)' },
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
  const { t }    = useTranslation()
  const { pets } = usePetsContext()
  const isEdit   = !!initial

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
    if (!name.trim())   { setNameErr(t('vet.contacts.errName'));    ok = false }
    if (!clinic.trim()) { setClinicErr(t('vet.contacts.errClinic')); ok = false }
    if (!phone.trim())  { setPhoneErr(t('vet.contacts.errPhone'));   ok = false }
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
    if (isEdit && initial) onUpdate({ ...data, id: initial.id })
    else onSave(data)
    onClose()
  }

  const togglePet = (id: string) =>
    setPetIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? t('vet.contacts.subtitleEdit', { name: initial?.name ?? '' })
          : t('vet.contacts.titleAdd')
      }
      icon="🩺"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>{t('btn.cancel')}</PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            {isEdit ? t('btn.saveChanges') : t('vet.contacts.addBtn')}
          </PfBtn>
        </PfFooter>
      }
    >
      {/* Tipo de veterinário */}
      <div className="modal-section">{t('vet.contacts.sectionType')}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'.5rem', marginBottom:'1rem' }}>
        {VET_TYPES.map(vt => (
          <button key={vt.value} type="button" onClick={() => setType(vt.value)}
            style={{
              padding:'.625rem .75rem', borderRadius:'var(--r-md)', cursor:'pointer',
              fontFamily:'inherit', fontWeight:700, fontSize:'.8125rem',
              border:`1.5px solid ${type === vt.value ? vt.color : 'var(--border)'}`,
              background: type === vt.value
                ? `color-mix(in oklab, ${vt.color} 10%, var(--surface))`
                : 'var(--surface)',
              display:'flex', alignItems:'center', gap:'.5rem',
              color: type === vt.value ? vt.color : 'var(--text)',
            }}>
            <span>{vt.emoji}</span>
            {/* ✅ label via i18n em vez de hardcode ES */}
            <span>{t(`vet.contactTypes.${vt.key}`)}</span>
          </button>
        ))}
      </div>

      {/* Dados de contacto */}
      <div className="modal-section">{t('vet.contacts.sectionContact')}</div>

      <div className="form-group">
        <label className="form-label">{t('field.name')} *</label>
        <input className={`form-input${nameErr ? ' input-err' : ''}`}
          value={name} onChange={e => { setName(e.target.value); setNameErr('') }}
          placeholder={t('vet.contacts.vetNamePh')}/>
        {nameErr && <div className="form-error">{nameErr}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('field.clinic')} *</label>
        <input className={`form-input${clinicErr ? ' input-err' : ''}`}
          value={clinic} onChange={e => { setClinic(e.target.value); setClinicErr('') }}
          placeholder={t('vet.contacts.clinicPh')}/>
        {clinicErr && <div className="form-error">{clinicErr}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('field.specialty')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <input className="form-input" value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          placeholder={t('vet.contacts.specialtyPh')}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
        <div className="form-group">
          <label className="form-label">{t('field.phone')} *</label>
          <input type="tel" className={`form-input${phoneErr ? ' input-err' : ''}`}
            value={phone} onChange={e => { setPhone(e.target.value); setPhoneErr('') }}
            placeholder={t('vet.contacts.phonePh')}/>
          {phoneErr && <div className="form-error">{phoneErr}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            {t('vet.contacts.phone2')}{' '}
            <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
          </label>
          <input type="tel" className="form-input" value={phone2}
            onChange={e => setPhone2(e.target.value)}
            placeholder={t('vet.contacts.phone2Ph')}/>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('field.address')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <input className="form-input" value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder={t('vet.contacts.addressPh')}/>
      </div>

      {/* ✅ pets via contexto */}
      <div className="modal-section">{t('vet.contacts.sectionPets')}</div>
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1rem' }}>
        {pets.map(p => (
          <button key={p.id} type="button"
            className={`btn btn-sm ${petIds.includes(p.id) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => togglePet(p.id)}>
            {PET_EMOJI[p.species ?? ''] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      {/* Notas */}
      <div className="modal-section">{t('vet.contacts.sectionNotes')}</div>
      <div className="form-group">
        <textarea className="form-input" rows={2} value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t('vet.contacts.notesPh')}/>
      </div>
    </Modal>
  )
}

export default AddEditVetModal