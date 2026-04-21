import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePets, SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import Button from '../components/Button'
import type { Species } from '../types'

// ── Pet photos (session + localStorage) ──────────────────
function usePetPhotos() {
  const [photos, setPhotos] = useState<Record<string,string>>(() => {
    const m: Record<string,string> = {}
    try { Object.keys(localStorage).filter(k=>k.startsWith('pet-photo-')).forEach(k=>{ m[k.replace('pet-photo-','')] = localStorage.getItem(k)! }) } catch {}
    return m
  })
  const setPhoto = useCallback((petId: string, dataUrl: string) => {
    setPhotos(prev => ({...prev, [petId]: dataUrl}))
    try { localStorage.setItem('pet-photo-' + petId, dataUrl) } catch {}
  }, [])
  const removePhoto = useCallback((petId: string) => {
    setPhotos(prev => { const n = {...prev}; delete n[petId]; return n })
    try { localStorage.removeItem('pet-photo-' + petId) } catch {}
  }, [])
  return { photos, setPhoto, removePhoto }
}

// ── Pet Card ─────────────────────────────────────────────
interface PetCardProps { pet: PetWithAlerts; isActive: boolean; onClick: () => void; photo?: string }
function PetCard({ pet, isActive, onClick, photo }: PetCardProps) {
  const birthDate = pet.birthDate ? new Date(pet.birthDate) : null
  const ageMonths = birthDate
    ? (new Date().getFullYear() - birthDate.getFullYear()) * 12 + (new Date().getMonth() - birthDate.getMonth())
    : null
  const age  = ageMonths === null ? 'Edad desconocida' : ageMonths < 12 ? `${ageMonths} meses` : `${Math.floor(ageMonths/12)} años`
  const score = pet.healthScore
  const scoreColor = score > 80 ? 'var(--success)' : score > 60 ? 'var(--warn)' : 'var(--err)'
  return (
    <div className={['pet-card', isActive?'selected':''].join(' ')} onClick={onClick}>
      <div className="pet-card-header">
        <div className="pet-avatar-photo">
          {photo ? <img src={photo} alt={pet.name}/> : <span style={{ fontSize:'1.5rem' }}>{SPECIES_EMOJI[pet.species]??'🐾'}</span>}
        </div>
        <div style={{ flex:1 }}>
          <div className="pet-card-name">{pet.name}</div>
          <div className="pet-card-breed">{pet.breed??'Raza desconocida'} · {age}</div>
        </div>
        {pet.alerts.length > 0 && <span className={`badge ${pet.alerts[0].type==='err'?'badge-red':'badge-yellow'}`}>⚠</span>}
      </div>
      <div className="stat-row" style={{ marginBottom:0 }}>
        {[
          { label:'Especie', value:pet.species==='cat'?'Gato':pet.species==='dog'?'Perro':pet.species==='bird'?'Ave':pet.species },
          { label:'Edad',    value:age },
          { label:'Salud',   value:String(score) },
        ].map(s=>(
          <div key={s.label} className="stat-chip" style={{ padding:'.5rem .625rem' }}>
            <div className="stat-chip-label">{s.label}</div>
            <div className="stat-chip-value" style={{ fontSize:'.9375rem' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.7rem', marginBottom:'.3rem' }}>
          <span style={{ color:'var(--text-faint)', fontWeight:700 }}>SALUD</span>
          <span style={{ color:scoreColor, fontWeight:800 }}>{score}</span>
        </div>
        <div className="progress-wrap"><div className="progress-bar" style={{ width:`${score}%`, background:scoreColor }}/></div>
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

// ── Species filter data ───────────────────────────────────
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

type SortKey = 'name' | 'age' | 'health' | 'alerts'
const SORT_OPTIONS: { val: SortKey; label: string }[] = [
  { val:'name',   label:'Nombre A→Z' },
  { val:'age',    label:'Más joven'  },
  { val:'health', label:'Más sano'   },
  { val:'alerts', label:'Alertas'    },
]

// ── AddPetModal ───────────────────────────────────────────
function AddPetModal({ isOpen, onClose, onAdd }: { isOpen:boolean; onClose:()=>void; onAdd:(p:PetWithAlerts)=>void }) {
  const [form, setForm]     = useState({ name:'', species:'cat' as Species, breed:'', birthDate:'', weight:'' })
  const [nameErr, setNameErr] = useState('')
  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}))
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
      footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button onClick={handleSubmit}>Guardar mascota</Button></>}>
      <p className="mf-section-label">Identidad</p>
      <div className="mf-field">
        <label className="mf-label">Nombre *</label>
        <div className={['mf-input-wrap', nameErr?'mf-input-wrap--err':''].join(' ')}>
          <span className="mf-prefix">{selected.emoji}</span>
          <input className="mf-input" placeholder={`Nombre de tu ${selected.label.toLowerCase()}`} value={form.name} onChange={e=>{set('name',e.target.value);setNameErr('')}} autoFocus/>
        </div>
        {nameErr && <span className="mf-err">{nameErr}</span>}
      </div>
      <div className="mf-field">
        <label className="mf-label">Especie</label>
        <div className="mf-species-grid">
          {SPECIES_OPTIONS.map(o=>(
            <button key={o.value} type="button" className={['mf-species-card', form.species===o.value?'active':''].join(' ')}
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
          <div><div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{form.name}</div><div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{selected.label}{form.breed?` · ${form.breed}`:''}</div></div>
          <span className="badge badge-green" style={{ marginLeft:'auto' }}>Nueva ✓</span>
        </div>
      )}
    </Modal>
  )
}

// ── PetListPage ───────────────────────────────────────────
export default function PetListPage() {
  const navigate                                            = useNavigate()
  const { pets, loading, error, addPet, removePet, reload } = usePets()
  const { photos, setPhoto }                                = usePetPhotos()
  const [search,      setSearch]      = useState('')
  const [specFilter,  setSpecFilter]  = useState<Species|'all'>('all')
  const [sortKey,     setSortKey]     = useState<SortKey>('name')
  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [viewMode,    setViewMode]    = useState<'grid'|'list'>('grid')

  // Photo upload handler
  const handlePhotoUpload = useCallback((petId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      if (result) { setPhoto(petId, result); showToast('📸 Foto actualizada') }
    }
    reader.readAsDataURL(file)
  }, [setPhoto])

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...pets]
      .filter(p =>
        (specFilter === 'all' || p.species === specFilter) &&
        (!term || p.name.toLowerCase().includes(term) || p.species.includes(term) || p.breed?.toLowerCase().includes(term))
      )
      .sort((a, b) => {
        if (sortKey === 'name')   return a.name.localeCompare(b.name)
        if (sortKey === 'health') return b.healthScore - a.healthScore
        if (sortKey === 'alerts') return b.alerts.length - a.alerts.length
        if (sortKey === 'age') {
          const da = a.birthDate ? new Date(a.birthDate).getTime() : 0
          const db = b.birthDate ? new Date(b.birthDate).getTime() : 0
          return db - da // more recent birth = younger = first
        }
        return 0
      })
  }, [pets, search, specFilter, sortKey])

  // Species present in pets
  const presentSpecies = useMemo(() => {
    const s = new Set(pets.map(p => p.species))
    return SPECIES_FILTERS.filter(f => f.val === 'all' || s.has(f.val as Species))
  }, [pets])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Mis Mascotas</div>
          <div className="page-subtitle">{pets.length} mascotas registradas</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Nueva mascota
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="petlist-toolbar">
        {/* Search row */}
        <div className="petlist-search-row">
          <div className="petlist-search-wrap">
            <span className="petlist-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              placeholder="Buscar por nombre, especie o raza…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="petlist-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={reload} title="Recargar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
          <button className="btn btn-danger btn-sm" disabled={!selectedId}
            onClick={() => { if(selectedId){ removePet(selectedId); setSelectedId(null); showToast('Mascota eliminada') } }}>
            Eliminar
          </button>
          {/* View toggle */}
          <div className="petlist-view-toggle">
            <div className={`petlist-view-btn ${viewMode==='grid'?'active':''}`} onClick={()=>setViewMode('grid')} title="Vista cuadrícula">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div className={`petlist-view-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')} title="Vista lista">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Species filter */}
        <div className="petlist-filter-row">
          <span className="petlist-filter-label">Especie:</span>
          {presentSpecies.map(f => (
            <button key={f.val} className={`petlist-filter-pill ${specFilter===f.val?'active':''}`}
              onClick={() => setSpecFilter(f.val)}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="petlist-sort-row">
          <span className="petlist-sort-label">Ordenar:</span>
          {SORT_OPTIONS.map(s => (
            <button key={s.val} className={`petlist-sort-btn ${sortKey===s.val?'active':''}`}
              onClick={() => setSortKey(s.val)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results bar */}
      <div className="petlist-results-bar">
        <span className="petlist-results-count">
          {filteredPets.length === pets.length
            ? `${pets.length} mascota${pets.length !== 1 ? 's' : ''}`
            : `${filteredPets.length} de ${pets.length} mascotas`}
          {(search || specFilter !== 'all') && (
            <button style={{ marginLeft:'.625rem', fontSize:'.75rem', color:'var(--primary)', fontWeight:700, cursor:'pointer' }}
              onClick={() => { setSearch(''); setSpecFilter('all') }}>
              Limpiar filtros ✕
            </button>
          )}
        </span>
      </div>

      {error && (
        <div style={{ borderRadius:'var(--r-lg)', border:'1px solid var(--err-hl)', background:'var(--err-hl)', padding:'.75rem 1rem', fontSize:'.875rem', color:'var(--err)', marginBottom:'1rem' }}>{error}</div>
      )}

      {loading ? (
        <div className="grid-auto">{[1,2,3].map(i=><SkeletonPetCard key={i}/>)}</div>
      ) : filteredPets.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🐾</div>
          <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', marginBottom:'.375rem' }}>
            {search || specFilter !== 'all' ? 'Sin resultados' : 'No hay mascotas'}
          </div>
          <div style={{ fontSize:'.875rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>
            {search || specFilter !== 'all' ? 'Prueba con otros filtros de búsqueda.' : 'Añade tu primera mascota para empezar.'}
          </div>
          {!(search || specFilter !== 'all') && <button className="btn btn-primary" onClick={()=>setModalOpen(true)}>Añadir mascota</button>}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid-auto">
          {filteredPets.map(pet => (
            <div key={pet.id} style={{ position:'relative' }}>
              <PetCard
                pet={pet}
                isActive={selectedId===pet.id}
                onClick={() => navigate(`/pets/${pet.id}`)}
                photo={photos[pet.id]}
              />
              {/* Photo upload overlay button */}
              <label
                htmlFor={`photo-${pet.id}`}
                style={{ position:'absolute', top:12, right:12, width:28, height:28, borderRadius:50, background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'.7rem', boxShadow:'var(--sh-sm)', border:'2px solid var(--surface)', zIndex:2 }}
                title="Cambiar foto"
                onClick={e => e.stopPropagation()}
              >
                📷
                <input id={`photo-${pet.id}`} type="file" accept="image/*" style={{ display:'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if(f) handlePhotoUpload(pet.id, f) }} />
              </label>
            </div>
          ))}
          {/* Add card */}
          <div className="pet-card" style={{ borderStyle:'dashed', justifyContent:'center', alignItems:'center', minHeight:200, opacity:.6 }}
            onClick={()=>setModalOpen(true)}
            onMouseOver={e=>(e.currentTarget.style.opacity='1')}
            onMouseOut={e=>(e.currentTarget.style.opacity='.6')}>
            <div style={{ fontSize:'2rem', color:'var(--primary)' }}>＋</div>
            <div style={{ fontSize:'.875rem', color:'var(--text-muted)', marginTop:'.5rem' }}>Añadir mascota</div>
          </div>
        </div>
      ) : (
        /* List view */
        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {filteredPets.map(pet => (
            <div key={pet.id} className="list-item" style={{ background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'var(--r-xl)', padding:'.875rem 1.25rem', cursor:'pointer' }}
              onClick={() => navigate(`/pets/${pet.id}`)}>
              <div className="pet-avatar-photo" style={{ width:48, height:48, fontSize:'1.375rem' }}>
                {photos[pet.id] ? <img src={photos[pet.id]} alt={pet.name}/> : <span>{SPECIES_EMOJI[pet.species]??'🐾'}</span>}
              </div>
              <div className="list-item-info">
                <div className="list-item-title">{pet.name}</div>
                <div className="list-item-sub">{pet.breed??'Raza desconocida'} · {pet.species}</div>
              </div>
              <div style={{ display:'flex', gap:'.375rem', alignItems:'center' }}>
                {pet.alerts.length > 0 && <span className={`badge ${pet.alerts[0].type==='err'?'badge-red':'badge-yellow'}`}>⚠</span>}
                <span className="badge badge-gray" style={{ fontVariantNumeric:'tabular-nums' }}>{pet.healthScore}%</span>
                <label htmlFor={`photo-list-${pet.id}`} style={{ width:28, height:28, borderRadius:'var(--r-md)', background:'var(--primary-hl)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'.7rem', border:'1.5px solid var(--border)' }}
                  title="Cambiar foto" onClick={e=>e.stopPropagation()}>
                  📷
                  <input id={`photo-list-${pet.id}`} type="file" accept="image/*" style={{ display:'none' }}
                    onChange={e=>{ const f=e.target.files?.[0]; if(f) handlePhotoUpload(pet.id,f) }}/>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPetModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} onAdd={addPet}/>
    </div>
  )
}
