import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePets } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { SPECIES_EMOJI } from '../hooks/usePets'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import { showToast } from '../components/AppLayout'
import AddPetModal from '../components/AddPetModal'
import VaccRing from '../components/VaccRing'
import { getVaccStatus, VACCINES_BY_PET } from '../hooks/usePets'

// ── Pet Card ───────────────────────────────────────────────────────────────────
interface PetCardProps { pet: PetWithAlerts; isActive: boolean; onClick: () => void }

function PetCard({ pet, isActive, onClick }: PetCardProps) {
  const birthDate = pet.birthDate ? new Date(pet.birthDate) : null
  const ageMonths = birthDate
    ? (new Date().getFullYear() - birthDate.getFullYear()) * 12
      + new Date().getMonth() - birthDate.getMonth()
    : null
  const age = ageMonths === null
    ? 'Edad desconocida'
    : ageMonths < 12 ? `${ageMonths} meses` : `${Math.floor(ageMonths / 12)} años`

  // Alertas
  const urgentAlerts  = pet.alerts.filter(a => a.type === 'err')
  const warningAlerts = pet.alerts.filter(a => a.type === 'warn')

  // Recalcula cobertura em runtime (só vacinas 'ok' contam)
  const petVaccines  = VACCINES_BY_PET[pet.id] ?? []
  const okCount      = petVaccines.filter(v => getVaccStatus(v.nextDate) === 'ok').length
  const vaccCoverage = petVaccines.length > 0
    ? Math.round((okCount / petVaccines.length) * 100)
    : (pet.vaccCoverage ?? 100)

  return (
    <div
      className={['pet-card', isActive ? 'selected' : ''].join(' ')}
      onClick={onClick}
    >
      {/* Header */}
      <div className="pet-card-header">
        <div className="pet-avatar">{SPECIES_EMOJI[pet.species] ?? '🐾'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pet-card-name">{pet.name}</div>
          <div className="pet-card-breed">{pet.breed ?? 'Raza desconocida'} · {age}</div>
        </div>
        {/* Espécie badge */}
        <span className="badge badge-gray" style={{ fontSize: '.6rem', alignSelf: 'flex-start' }}>
          {pet.species === 'cat' ? 'Gato'
            : pet.species === 'dog' ? 'Perro'
            : pet.species === 'bird' ? 'Ave'
            : pet.species}
        </span>
      </div>

      {/* Alertas */}
      {pet.alerts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.375rem' }}>
          {urgentAlerts.map((a, i) => (
            <span key={i} className="badge badge-red" style={{ fontSize: '.6875rem' }}>
              ⚠ {a.text.slice(0, 32)}
            </span>
          ))}
          {warningAlerts.map((a, i) => (
            <span key={i} className="badge badge-yellow" style={{ fontSize: '.6875rem' }}>
              {a.text.slice(0, 32)}
            </span>
          ))}
        </div>
      )}

      {/* Cobertura vacinal — ring */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.25rem', padding: '.25rem 0' }}>
        <span style={{ fontSize: '.6rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '.07em' }}>Cobertura vacunal</span>
        <VaccRing coverage={vaccCoverage} size={80} strokeWidth={7} />
      </div>

      {/* Footer */}
      <div className="pet-card-footer">
        <div className="caregiver-avatars">
          <div className="caregiver-avatar">TL</div>
          {pet.id === 'pet-1' && (
            <div className="caregiver-avatar" style={{ background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>
          )}
        </div>
        <span className="last-activity">
          {pet.id === 'pet-1' ? 'Hoy 10:22' : pet.id === 'pet-2' ? 'Ayer' : 'Hace 2d'}
        </span>
      </div>
    </div>
  )
}

// ── PetListPage ────────────────────────────────────────────────────────────────
export default function PetListPage() {
  const navigate    = useNavigate()
  const { pets, loading, error, addPet, removePet, reload } = usePets()
  const [search,     setSearch]     = useState('')
  const [specFilter, setSpecFilter] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modalOpen,  setModalOpen]  = useState(false)

  const handleSelect = useCallback((pet: PetWithAlerts) => {
    setSelectedId(prev => prev === pet.id ? null : pet.id)
  }, [])

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...pets]
      .filter(p => specFilter === 'all' || p.species === specFilter)
      .filter(p =>
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.species.includes(term) ||
        p.breed?.toLowerCase().includes(term)
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [pets, search, specFilter])

  // Espécies presentes para os filtros
  const speciesInList = useMemo(() => {
    const map: Record<string, string> = {
      cat: '🐱 Gatos', dog: '🐶 Perros', bird: '🐦 Aves',
      rabbit: '🐰 Conejos', reptile: '🦎 Reptiles', fish: '🐠 Peces', other: '🐾 Otros',
    }
    const present = [...new Set(pets.map(p => p.species))]
    return present.map(s => ({ value: s, label: map[s] ?? s }))
  }, [pets])

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Mis Mascotas</div>
          <div className="page-subtitle">{pets.length} mascotas registradas</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nueva mascota
        </button>
      </div>

      {/* ── Barra de busca profissional ──────────────────────────── */}
      <div className="plp-search-bar">
        {/* Ícone lupa */}
        <svg className="plp-search-icon" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>

        <input
          className="plp-search-input"
          placeholder="Buscar por nombre, raza o especie…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Filtros de espécie como pills */}
        {speciesInList.length > 0 && (
          <div className="plp-filter-pills">
            <button
              className={['plp-pill', specFilter === 'all' ? 'plp-pill--active' : ''].join(' ')}
              onClick={() => setSpecFilter('all')}
            >
              Todas
            </button>
            {speciesInList.map(s => (
              <button
                key={s.value}
                className={['plp-pill', specFilter === s.value ? 'plp-pill--active' : ''].join(' ')}
                onClick={() => setSpecFilter(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Ações à direita */}
        <div className="plp-search-actions">
          {selectedId && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (selectedId) { removePet(selectedId); setSelectedId(null); showToast('Mascota eliminada') }
              }}
            >
              Eliminar
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={reload}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Contagem de resultados */}
      {(search || specFilter !== 'all') && (
        <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginBottom: '.75rem', marginTop: '-.25rem' }}>
          {filteredPets.length === 0 ? 'Ningún resultado' : `${filteredPets.length} resultado${filteredPets.length !== 1 ? 's' : ''}`}
          {(search || specFilter !== 'all') && (
            <button
              style={{ marginLeft: '.5rem', color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8125rem' }}
              onClick={() => { setSearch(''); setSpecFilter('all') }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--err-hl)', background: 'var(--err-hl)', padding: '.75rem 1rem', fontSize: '.875rem', color: 'var(--err)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid-auto">
          {[1,2,3].map(i => <SkeletonPetCard key={i} />)}
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.375rem' }}>
            {search || specFilter !== 'all' ? 'Sin resultados' : 'No hay mascotas'}
          </div>
          <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {search || specFilter !== 'all'
              ? 'Prueba con otro nombre o especie.'
              : 'Añade tu primera mascota para empezar.'}
          </div>
          {!(search || specFilter !== 'all') && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Añadir mascota</button>
          )}
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
          {/* Card de adicionar */}
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
