//traduzido

import { useState, useEffect } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { type PetMedicalProfile } from '../context/VetContext'
import { useTranslation } from 'react-i18next'
import { CONDITIONS_CATALOG } from '../context/conditionsCatalog'

type Sex = 'male' | 'female'
type Env = 'apartment' | 'house' | 'both'

interface Surgery {
  id:     string
  name:   string
  date?:  string
  notes?: string
}

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

interface Props {
  isOpen:  boolean
  onClose: () => void
  pet:     { name: string; species?: string }
  profile: PetMedicalProfile
  onSave:  (profile: PetMedicalProfile) => void
}

export default function PetMedicalProfileModal({
  isOpen, onClose, pet, profile, onSave,
}: Props) {
  const { t } = useTranslation()

  const [sex,          setSex]          = useState<Sex | undefined>(undefined)
  const [neutered,     setNeutered]     = useState<boolean | undefined>(undefined)
  const [neuteredAge,  setNeuteredAge]  = useState('')
  const [bloodType,    setBloodType]    = useState('')
  const [allergies,    setAllergies]    = useState('')
  const [condIds,      setCondIds]      = useState<string[]>([])
  const [customConds,  setCustomConds]  = useState<string[]>([])
  const [newCond,      setNewCond]      = useState('')
  const [surgeries,    setSurgeries]    = useState<Surgery[]>([])
  const [newSurgName,  setNewSurgName]  = useState('')
  const [newSurgNotes, setNewSurgNotes] = useState('')
  const [environment,  setEnvironment]  = useState<Env | undefined>(undefined)
  const [withAnimals,  setWithAnimals]  = useState<boolean | undefined>(undefined)
  const [parasite,     setParasite]     = useState('')
  const [behavior,     setBehavior]     = useState('')
  const [vetQuestions, setVetQuestions] = useState('')
  
  const conditionsById = new Map(CONDITIONS_CATALOG.map((item) => [item.id, item]))

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

  const toggleCondId = (id: string) =>
    setCondIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const addCustomCond = () => {
    const val = newCond.trim()
    if (!val || customConds.includes(val)) return
    setCustomConds(prev => [...prev, val])
    setNewCond('')
  }

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
      title={t('vet.profile.modalTitle')}
      icon="🩺"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>{t('btn.cancel')}</PfBtn>
          <PfBtn variant="save"   onClick={handleSave}>{t('btn.save')}</PfBtn>
        </PfFooter>
      }
    >
      {/* ── Datos básicos ── */}
      {/* ✅ todas as v.profile.* → t('vet.profile.*') */}
      <SectionLabel>{t('vet.profile.sectionBasic')}</SectionLabel>

      {/* Sexo */}
      <div className="form-group">
        <label className="form-label">{t('vet.profile.sex')}</label>
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
              {s === 'male' ? `♂ ${t('vet.profile.sexMale')}` : `♀ ${t('vet.profile.sexFemale')}`}
            </button>
          ))}
        </div>
      </div>

      {/* Castrado */}
      <div className="form-group"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {t('vet.profile.neutered')}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {neutered == null ? '—' : neutered
              ? t('vet.profile.neuteredYes')
              : t('vet.profile.neuteredNo')}
          </span>
          <Toggle on={!!neutered} onChange={setNeutered} />
        </div>
      </div>

      {neutered && (
        <div className="form-group">
          <label className="form-label">
            {t('vet.profile.neuteredAge')}{' '}
            {/* ✅ era t.btn.optional */}
            <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
              ({t('btn.optional')})
            </span>
          </label>
          <input className="form-input" value={neuteredAge}
            onChange={e => setNeuteredAge(e.target.value)}
            placeholder={t('vet.profile.neuteredAge')} />
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.bloodType')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <input className="form-input" value={bloodType}
          onChange={e => setBloodType(e.target.value)}
          placeholder={t('vet.profile.bloodTypePh')} />
        <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.25rem' }}>
          {t('vet.profile.bloodTypeHint')}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.allergies')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <textarea className="form-input" rows={2} value={allergies}
          onChange={e => setAllergies(e.target.value)}
          placeholder={t('vet.profile.allergies')} />
      </div>

      {/* ── Condiciones crónicas ── */}
      <SectionLabel>{t('vet.profile.sectionConditions')}</SectionLabel>

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
              {active ? '✓ ' : ''}{t(c.labelKey)}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
        <input className="form-input" value={newCond} style={{ flex: 1 }}
          onChange={e => setNewCond(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomCond()}
          placeholder={t('vet.profile.customConditionPh')} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={addCustomCond}>
          {t('vet.profile.addCondition')}
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
      <SectionLabel>{t('vet.profile.sectionSurgeries')}</SectionLabel>

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
            {t('vet.profile.removeSurgery')}
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem', marginTop: '.5rem' }}>
        <input className="form-input" value={newSurgName}
          onChange={e => setNewSurgName(e.target.value)}
          placeholder={t('vet.profile.surgeryNamePh')} />
        <input className="form-input" value={newSurgNotes}
          onChange={e => setNewSurgNotes(e.target.value)}
          placeholder={t('vet.profile.surgeryNotesPh')} />
        <button type="button" className="btn btn-secondary btn-sm"
          style={{ alignSelf: 'flex-start' }} onClick={addSurgery}>
          {t('vet.profile.addSurgery')}
        </button>
      </div>

      {/* ── Entorno ── */}
      <SectionLabel>{t('vet.profile.sectionEnvironment')}</SectionLabel>

      <div className="form-group">
        <label className="form-label">{t('vet.profile.environment')}</label>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {([
            { val: 'apartment' as Env, label: `🏢 ${t('vet.profile.envApartment')}` },
            { val: 'house'     as Env, label: `🏠 ${t('vet.profile.envHouse')}` },
            { val: 'both'      as Env, label: `🔄 ${t('vet.profile.envBoth')}` },
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
          {t('vet.profile.livingWithAnimals')}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {withAnimals == null ? '—' : withAnimals
              ? t('vet.profile.neuteredYes')
              : t('vet.profile.neuteredNo')}
          </span>
          <Toggle on={!!withAnimals} onChange={setWithAnimals} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.parasiteControl')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <input className="form-input" value={parasite}
          onChange={e => setParasite(e.target.value)}
          placeholder={t('vet.profile.parasiteControl')} />
      </div>

      {/* ── Notas para el vet ── */}
      <SectionLabel>{t('vet.profile.sectionVetNotes')}</SectionLabel>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.behavioralNotes')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <textarea className="form-input" rows={2} value={behavior}
          onChange={e => setBehavior(e.target.value)}
          placeholder={t('vet.profile.behavioralNotes')} />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.vetQuestions')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <textarea className="form-input" rows={2} value={vetQuestions}
          onChange={e => setVetQuestions(e.target.value)}
          placeholder={t('vet.profile.vetQuestions')} />
      </div>
    </Modal>
  )
}