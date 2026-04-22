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
