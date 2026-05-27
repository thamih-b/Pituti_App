import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePets, SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import MiniVaccRing from '../components/MiniVaccRing'
import type { Species } from '../types'
import BackButton from '../components/BackButton'
import { PfBtn, PfFooter } from '../components/FooterButtons'
import { usePituti } from '../context/PitutiContext'

function usePetPhotos() {
  const [photos, setPhotos] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('pet-photo-'))
        .forEach((k) => {
          const value = localStorage.getItem(k)
          if (value) m[k.replace('pet-photo-', '')] = value
        })
    } catch {}
    return m
  })

  const setPhoto = useCallback((petId: string, dataUrl: string) => {
    setPhotos((prev) => ({ ...prev, [petId]: dataUrl }))
    try {
      localStorage.setItem(`pet-photo-${petId}`, dataUrl)
    } catch {}
  }, [])

  return { photos, setPhoto }
}

interface PetCardProps {
  pet: PetWithAlerts
  onClick: () => void
  photo?: string
}

function PetCard({ pet, onClick, photo }: PetCardProps) {
  const { t } = useTranslation()

  const bDate = pet.birthDate ? new Date(pet.birthDate) : null
  const months = bDate
    ? (new Date().getFullYear() - bDate.getFullYear()) * 12 + (new Date().getMonth() - bDate.getMonth())
    : null

  const age =
    months === null
      ? t('pets.ageUnknown')
      : months < 12
        ? `${months} ${t('pets.months')}`
        : `${Math.floor(months / 12)} ${t('pet.years')}`

  const speciesLabel: Record<Species, string> = {
    cat: t('pets.speciesOptions.cat'),
    dog: t('pets.speciesOptions.dog'),
    bird: t('pets.speciesOptions.bird'),
    rabbit: t('pets.speciesOptions.rabbit'),
    reptile: t('pets.speciesOptions.reptile'),
    fish: t('pets.speciesOptions.fish'),
    other: t('pets.speciesOptions.other'),
  }

  const alerts = pet.alerts ?? []

  return (
    <div className="pet-card" onClick={onClick}>
      <div className="pet-card-header">
        <div className="pet-avatar-photo">
          {photo ? (
            <img src={photo} alt={pet.name} />
          ) : (
            <span style={{ fontSize: '1.5rem' }}>{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pet-card-name">{pet.name}</div>
          <div className="pet-card-breed">
            {pet.breed ?? t('pet.unknownBreed')} · {age}
          </div>
        </div>

        {alerts.length > 0 && (
          <span className={`badge ${alerts[0] === 'err' ? 'badge-red' : 'badge-yellow'}`}>⚠</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '.625rem', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
          {[
            { label: t('pet.chipSpecies'), value: speciesLabel[pet.species as Species] ?? pet.species },
            { label: t('pets.age'), value: age },
          ].map((s) => (
            <div key={s.label} className="stat-chip" style={{ padding: '.45rem .625rem' }}>
              <div className="stat-chip-label">{s.label}</div>
              <div className="stat-chip-value" style={{ fontSize: '.875rem' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <MiniVaccRing coverage={pet.vaccCoverage ?? 100} size={52} strokeWidth={5} />
      </div>

      <div className="pet-card-footer">
        <span className="last-activity">
          {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : ''}
        </span>
      </div>
    </div>
  )
}

function useSpeciesFilters() {
  const { t } = useTranslation()

  const SPECIES_FILTERS: { val: Species | 'all'; emoji: string; label: string }[] = [
    { val: 'all', emoji: '🐾', label: t('pets.allSpecies') },
    { val: 'cat', emoji: '🐱', label: t('pets.speciesOptions.cat') },
    { val: 'dog', emoji: '🐶', label: t('pets.speciesOptions.dog') },
    { val: 'bird', emoji: '🦜', label: t('pets.speciesOptions.bird') },
    { val: 'rabbit', emoji: '🐰', label: t('pets.speciesOptions.rabbit') },
    { val: 'reptile', emoji: '🦎', label: t('pets.speciesOptions.reptile') },
    { val: 'other', emoji: '🐾', label: t('pets.speciesOptions.other') },
  ]

  const SPECIES_OPTIONS: { value: Species; emoji: string; label: string; color: string }[] = [
    { value: 'cat', emoji: '🐱', label: t('pets.speciesOptions.cat'), color: 'var(--pal-lilac)' },
    { value: 'dog', emoji: '🐶', label: t('pets.speciesOptions.dog'), color: 'var(--pal-sky)' },
    { value: 'bird', emoji: '🦜', label: t('pets.speciesOptions.bird'), color: 'var(--pal-candy)' },
    { value: 'rabbit', emoji: '🐰', label: t('pets.speciesOptions.rabbit'), color: 'var(--pal-mauve)' },
    { value: 'reptile', emoji: '🦎', label: t('pets.speciesOptions.reptile'), color: 'var(--success-hl)' },
    { value: 'fish', emoji: '🐟', label: t('pets.speciesOptions.fish'), color: 'var(--blue-hl)' },
    { value: 'other', emoji: '🐾', label: t('pets.speciesOptions.other'), color: 'var(--surface-offset)' },
  ]

  return { SPECIES_FILTERS, SPECIES_OPTIONS }
}

function AddPetModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: {
    name: string
    species: Species
    breed?: string
    birthDate?: string
    weightKg?: number
  }) => Promise<unknown> | unknown
}) {
  const { t } = useTranslation()
  const { SPECIES_OPTIONS } = useSpeciesFilters()

  const [form, setForm] = useState({
    name: '',
    species: 'cat' as Species,
    breed: '',
    birthDate: '',
    weight: '',
  })
  const [nameErr, setNameErr] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setNameErr(t('vet.contacts.errName'))
      return
    }

    const petName = form.name.trim()

    try {
      setSaving(true)

      await onAdd({
        name: petName,
        species: form.species,
        breed: form.breed.trim() || undefined,
        birthDate: form.birthDate || undefined,
        weightKg: form.weight ? parseFloat(form.weight) : undefined,
      })

      setForm({ name: '', species: 'cat', breed: '', birthDate: '', weight: '' })
      setNameErr('')
      onClose()
      showToast(`${petName} ${t('pets.savedPet')}`)
    } catch (err) {
      console.error('Failed to create pet', err)
      setNameErr(t('pet.notFound'))
    } finally {
      setSaving(false)
    }
  }

  const selected = SPECIES_OPTIONS.find((o) => o.value === form.species)
  if (!selected) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pets.newPetTitle')}
      icon="🐾"
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      footer={
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit} disabled={saving}>
            {saving ? t('common.loading') : t('pets.savePet')}
          </PfBtn>
        </PfFooter>
      }
    >
      <p className="mf-section-label">{t('pets.identity')}</p>

      <div className="mf-field">
        <label className="mf-label">{t('pets.name')} *</label>
        <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
          <span className="mf-prefix">{selected.emoji}</span>
          <input
            className="mf-input"
            placeholder={`${t('pets.namePh')} ${selected.label.toLowerCase()}`}
            value={form.name}
            onChange={(e) => {
              set('name', e.target.value)
              setNameErr('')
            }}
            autoFocus
          />
        </div>
        {nameErr && <span className="mf-err">{nameErr}</span>}
      </div>

      <div className="mf-field">
        <label className="mf-label">{t('pets.species')}</label>
        <div className="mf-species-grid">
          {SPECIES_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              className={['mf-species-card', form.species === o.value ? 'active' : ''].join(' ')}
              style={form.species === o.value ? { background: o.color, borderColor: 'var(--primary)' } : {}}
              onClick={() => set('species', o.value)}
            >
              <span className="mf-species-emoji">{o.emoji}</span>
              <span className="mf-species-label">{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mf-field">
        <label className="mf-label">
          {t('pets.breed')} <span className="mf-optional">{t('pets.optional')}</span>
        </label>
        <div className="mf-input-wrap">
          <span className="mf-prefix">🔬</span>
          <input
            className="mf-input"
            placeholder={t('pets.breedPh')}
            value={form.breed}
            onChange={(e) => set('breed', e.target.value)}
          />
        </div>
      </div>

      <p className="mf-section-label" style={{ marginTop: '1.25rem' }}>
        {t('pets.physicalData')}
      </p>

      <div className="mf-row">
        <div className="mf-field">
          <label className="mf-label">
            {t('pets.birthDate')} <span className="mf-optional">{t('pets.optional')}</span>
          </label>
          <div className="mf-input-wrap">
            <span className="mf-prefix">🎂</span>
            <input
              className="mf-input"
              type="date"
              value={form.birthDate}
              onChange={(e) => set('birthDate', e.target.value)}
            />
          </div>
        </div>

        <div className="mf-field">
          <label className="mf-label">
            {t('pets.weight')} <span className="mf-optional">{t('pets.optional')}</span>
          </label>
          <div className="mf-input-wrap">
            <span className="mf-prefix">⚖️</span>
            <input
              className="mf-input"
              type="number"
              placeholder={t('pets.weightPh')}
              value={form.weight}
              onChange={(e) => set('weight', e.target.value)}
            />
            <span className="mf-suffix">kg</span>
          </div>
        </div>
      </div>

      {form.name.trim() && (
        <div className="mf-preview">
          <span style={{ fontSize: '1.5rem' }}>{selected.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{form.name}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
              {selected.label}
              {form.breed ? ` · ${form.breed}` : ''}
            </div>
          </div>
          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
            {t('status.new')}
          </span>
        </div>
      )}
    </Modal>
  )
}

export default function PetListPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { pets, loading, error, refetch } = usePets()
  const { addPet } = usePituti()
  const { photos } = usePetPhotos()
  const { SPECIES_FILTERS } = useSpeciesFilters()

  const [search, setSearch] = useState('')
  const [specFilter, setSpecFilter] = useState<Species | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()

    return [...pets]
      .filter(
        (p) =>
          (specFilter === 'all' || p.species === specFilter) &&
          (!term ||
            p.name.toLowerCase().includes(term) ||
            p.species.includes(term) ||
            p.breed?.toLowerCase().includes(term))
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [pets, search, specFilter])

  const presentSpecies = useMemo(() => {
    const s = new Set(pets.map((p) => p.species))
    return SPECIES_FILTERS.filter((f) => f.val === 'all' || s.has(f.val as Species))
  }, [pets, SPECIES_FILTERS])

  const hasFilters = Boolean(search) || specFilter !== 'all'

  return (
    <div>
      <BackButton label={t('btn.back')} />

      <div className="page-header">
        <div>
          <div className="page-title">{t('pets.title')}</div>
          <div className="page-subtitle">
            {pets.length} {t('pets.subtitle')}
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('pets.new')}
        </button>
      </div>

      <div className="petlist-toolbar">
        <div className="petlist-search-row">
          <div className="petlist-search-wrap">
            <span className="petlist-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>

            <input
              placeholder={t('pets.searchHint')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button className="petlist-search-clear" onClick={() => setSearch('')}>
                ✕
              </button>
            )}
          </div>

          <button className="btn btn-secondary btn-sm" onClick={refetch} title={t('petlist.reload')}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>

          <div className="petlist-view-toggle">
            <div
              className={`petlist-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>

            <div
              className={`petlist-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <circle cx="3" cy="6" r="1" fill="currentColor" />
                <circle cx="3" cy="12" r="1" fill="currentColor" />
                <circle cx="3" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        <div className="petlist-filter-row">
          <span className="petlist-filter-label">{t('pets.species')}:</span>
          {presentSpecies.map((f) => (
            <button
              key={f.val}
              className={`petlist-filter-pill ${specFilter === f.val ? 'active' : ''}`}
              onClick={() => setSpecFilter(f.val)}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="petlist-results-bar">
        <span className="petlist-results-count">
          {filteredPets.length === pets.length
            ? `${pets.length} ${t('petlist.petCount', { count: pets.length })}`
            : `${filteredPets.length} ${t('petlist.of')} ${pets.length}`}

          {hasFilters && (
            <button
              style={{
                marginLeft: '.625rem',
                fontSize: '.75rem',
                color: 'var(--primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => {
                setSearch('')
                setSpecFilter('all')
              }}
            >
              {t('petlist.clearFilters')} ✕
            </button>
          )}
        </span>
      </div>

      {error && (
        <div
          style={{
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--err-hl)',
            background: 'var(--err-hl)',
            padding: '.75rem 1rem',
            fontSize: '.875rem',
            color: 'var(--err)',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid-auto">
          {[1, 2, 3].map((i) => (
            <SkeletonPetCard key={i} />
          ))}
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
          <div
            style={{
              fontWeight: 800,
              fontSize: '1rem',
              color: 'var(--text)',
              marginBottom: '.375rem',
            }}
          >
            {hasFilters ? t('pets.noResults') : t('pets.noPets')}
          </div>
          <div
            style={{
              fontSize: '.875rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
            }}
          >
            {hasFilters ? t('pets.noResultsHint') : t('pets.noPetsHint')}
          </div>

          {!hasFilters && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              {t('pets.addPet')}
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid-auto">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onClick={() => navigate(`/pets/${pet.id}`)} photo={photos[pet.id]} />
          ))}

          <div
            className="pet-card"
            style={{
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
              opacity: 0.6,
            }}
            onClick={() => setModalOpen(true)}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '.6'
            }}
          >
            <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>＋</div>
            <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.5rem' }}>
              {t('pets.addPet')}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="list-item"
              style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-xl)',
                padding: '.875rem 1.25rem',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/pets/${pet.id}`)}
            >
              <div className="pet-avatar-photo" style={{ width: 48, height: 48, fontSize: '1.375rem' }}>
                {photos[pet.id] ? <img src={photos[pet.id]} alt={pet.name} /> : <span>{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>}
              </div>

              <div className="list-item-info">
                <div className="list-item-title">{pet.name}</div>
                <div className="list-item-sub">
                  {pet.breed ?? t('pet.unknownBreed')} · {pet.species}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '.375rem', alignItems: 'center' }}>
                <MiniVaccRing coverage={pet.vaccCoverage ?? 100} size={38} strokeWidth={4} />
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={addPet} />
    </div>
  )
}