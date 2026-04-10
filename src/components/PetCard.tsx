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
