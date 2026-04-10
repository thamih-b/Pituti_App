import { useCallback, useMemo, useState } from 'react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Input from '../components/Input'
import PetCard from '../components/PetCard'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import type { Pet } from '../types'
import { usePets } from '../hooks/usePets'

export default function PetListPage() {
  const { pets, loading, error, addPet, removePet, reload } = usePets()
  const [search, setSearch] = useState('')
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    []
  )

  const handleSelectPet = useCallback((pet: Pet) => {
    setSelectedPetId((prev) => (prev === pet.id ? null : pet.id))
  }, [])

  const handleAddMockPet = useCallback(() => {
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: 'Milo',
      species: 'dog',
      breed: 'Labrador',
      birthDate: '2022-01-12',
      photoUrl: '',
      ownerId: 'user-1',
      createdAt: new Date().toISOString(),
    }
    addPet(newPet)
  }, [addPet])

  const handleDeleteSelected = useCallback(() => {
    if (!selectedPetId) return
    removePet(selectedPetId)
    setSelectedPetId(null)
  }, [removePet, selectedPetId])

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...pets]
      .filter((pet) => {
        if (!term) return true
        return (
          pet.name.toLowerCase().includes(term) ||
          pet.species.toLowerCase().includes(term) ||
          pet.breed?.toLowerCase().includes(term)
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [pets, search])

  return (
    <section className="min-h-screen bg-stone-50 px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">

        {/* Header */}
        <header className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">PITUTI</p>
            <h1 className="mt-1 text-2xl font-bold text-stone-900">Mis mascotas</h1>
            <p className="mt-1 text-sm text-stone-500">Gestiona tu familia peluda.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reload}>Recargar</Button>
            <Button onClick={handleAddMockPet}>+ Añadir mascota</Button>
          </div>
        </header>

        {/* Filtros */}
        <div className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-end">
          <Input
            label="Buscar mascota"
            name="search"
            placeholder="Nombre, especie o raza..."
            value={search}
            onChange={handleSearchChange}
          />
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-stone-100 px-3 py-2 text-sm font-medium text-stone-600">
              {filteredPets.length} resultado(s)
            </span>
            <Button
              variant="danger"
              onClick={handleDeleteSelected}
              disabled={!selectedPetId}
            >
              Eliminar
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonPetCard key={i} />)}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <EmptyState
              title="No hay mascotas"
              description="Añade una mascota para empezar."
              actionLabel="Añadir mascota"
              onAction={handleAddMockPet}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={handleSelectPet}
                isActive={selectedPetId === pet.id}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
