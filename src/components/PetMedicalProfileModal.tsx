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
