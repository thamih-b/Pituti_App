import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePets } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { SPECIES_EMOJI } from '../hooks/usePets'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Input from '../components/Input'
import type { Species } from '../types'

// ── Pet Card ──────────────────────────────────────────────
interface PetCardProps { pet: PetWithAlerts; isActive: boolean; onClick: () => void }
function PetCard({ pet, isActive, onClick }: PetCardProps) {
  const birthDate = pet.birthDate ? new Date(pet.birthDate) : null
  const ageMonths = birthDate ? (new Date().getFullYear() - birthDate.getFullYear()) * 12 + new Date().getMonth() - birthDate.getMonth() : null
  const age = ageMonths === null ? 'Edad desconocida' : ageMonths < 12 ? `${ageMonths} meses` : `${Math.floor(ageMonths / 12)} años`
  const hasAlert = pet.alerts.length > 0
  const alertType = pet.alerts[0]?.type ?? 'info'

  const score = pet.healthScore
  const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warn)' : 'var(--err)'

  return (
    <div
      className={['pet-card', isActive ? 'selected' : ''].join(' ')}
      onClick={onClick}
    >
      <div className="pet-card-header">
        <div className="pet-avatar">{SPECIES_EMOJI[pet.species] ?? '🐾'}</div>
        <div style={{ flex: 1 }}>
          <div className="pet-card-name">{pet.name}</div>
          <div className="pet-card-breed">{pet.breed ?? 'Raza desconocida'} · {age}</div>
        </div>
        {hasAlert && <span className={`badge ${alertType === 'err' ? 'badge-red' : 'badge-yellow'}`}>⚠</span>}
      </div>

      <div className="stat-row" style={{ marginBottom: 0 }}>
        {[
          { label: 'Especie', value: pet.species === 'cat' ? 'Gato' : pet.species === 'dog' ? 'Perro' : pet.species === 'bird' ? 'Ave' : pet.species },
          { label: 'Edad',    value: age },
          { label: 'Estado',  value: `${score}%` },
        ].map(s => (
          <div key={s.label} className="stat-chip" style={{ padding: '.5rem .625rem' }}>
            <div className="stat-chip-label">{s.label}</div>
            <div className="stat-chip-value" style={{ fontSize: '.9375rem' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Health bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem', marginBottom: '.3rem' }}>
          <span style={{ color: 'var(--text-faint)', fontWeight: 700 }}>SALUD</span>
          <span style={{ color: scoreColor, fontWeight: 800 }}>{score}%</span>
        </div>
        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${score}%`, background: scoreColor }} />
        </div>
      </div>

      <div className="pet-card-footer">
        <div className="caregiver-avatars">
          <div className="caregiver-avatar">TL</div>
          {pet.id === 'pet-1' && <div className="caregiver-avatar" style={{ background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
        </div>
        <span className="last-activity">{pet.id === 'pet-1' ? 'Hoy 10:22' : pet.id === 'pet-2' ? 'Ayer' : 'Hace 2d'}</span>
      </div>
    </div>
  )
}

// ── AddPetModal ───────────────────────────────────────────
interface AddPetModalProps { isOpen: boolean; onClose: () => void; onAdd: (pet: PetWithAlerts) => void }
function AddPetModal({ isOpen, onClose, onAdd }: AddPetModalProps) {
  const [form, setForm] = useState({ name: '', species: 'cat' as Species, breed: '', birthDate: '', weight: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name.trim()) return
    onAdd({
      id: `pet-${Date.now()}`,
      name: form.name,
      species: form.species,
      breed: form.breed || undefined,
      birthDate: form.birthDate || undefined,
      photoUrl: '',
      ownerId: 'user-1',
      createdAt: new Date().toISOString(),
      healthScore: 100,
      alerts: [],
    })
    onClose()
    showToast(`${form.name} añadida correctamente 🐾`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🐾 Nueva mascota"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar mascota</Button>
        </>
      }
    >
      <div className="form-row">
        <Input label="Nombre *" name="name" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Ej: Luna" />
        <div className="form-group">
          <label className="form-label">Especie *</label>
          <select className="form-input" value={form.species} onChange={e => set('species', e.target.value)}>
            <option value="cat">🐱 Gato</option>
            <option value="dog">🐶 Perro</option>
            <option value="bird">🦜 Ave</option>
            <option value="rabbit">🐰 Conejo</option>
            <option value="reptile">🦎 Reptil</option>
            <option value="fish">🐟 Pez</option>
            <option value="other">🐾 Otro</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <Input label="Raza" name="breed" value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="Ej: Europeo común" />
        <Input label="Fecha de nacimiento" name="birthDate" type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)} />
      </div>
      <Input label="Peso (kg)" name="weight" type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="Ej: 4.2" />
    </Modal>
  )
}

// ── PetListPage ───────────────────────────────────────────
export default function PetListPage() {
  const navigate = useNavigate()
  const { pets, loading, error, addPet, removePet, reload } = usePets()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSelect = useCallback((pet: PetWithAlerts) => {
    setSelectedId(prev => prev === pet.id ? null : pet.id)
  }, [])

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...pets]
      .filter(p => !term || p.name.toLowerCase().includes(term) || p.species.includes(term) || p.breed?.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [pets, search])

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

      {/* Search + actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.125rem', boxShadow: 'var(--sh-sm)', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
        <Input label="Buscar mascota" name="search" placeholder="Nombre, especie o raza..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={reload}>↺ Recargar</button>
          <button className="btn btn-danger btn-sm" disabled={!selectedId} onClick={() => { if (selectedId) { removePet(selectedId); setSelectedId(null); showToast('Mascota eliminada') } }}>
            Eliminar
          </button>
        </div>
      </div>

      {error && <div style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--err-hl)', background: 'var(--err-hl)', padding: '.75rem 1rem', fontSize: '.875rem', color: 'var(--err)', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="grid-auto">{[1,2,3].map(i => <SkeletonPetCard key={i} />)}</div>
      ) : filteredPets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.375rem' }}>No hay mascotas</div>
          <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Añade tu primera mascota para empezar.</div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Añadir mascota</button>
        </div>
      ) : (
        <div className="grid-auto">
          {filteredPets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              isActive={selectedId === pet.id}
              onClick={() => { handleSelect(pet); navigate(`/pets/${pet.id}`) }}
            />
          ))}
          {/* Add new card */}
          <div
            className="pet-card"
            style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', minHeight: 200, opacity: .6 }}
            onClick={() => setModalOpen(true)}
            onMouseOver={e => (e.currentTarget.style.opacity = '1')}
            onMouseOut={e => (e.currentTarget.style.opacity = '.6')}
          >
            <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>＋</div>
            <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.5rem' }}>Añadir mascota</div>
          </div>
        </div>
      )}

      <AddPetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={addPet} />
    </div>
  )
}
