//traduzido e sem mock

import { useTranslation } from 'react-i18next'
import type { Pet } from '../types'
import type { BadgeStatus } from '../types'
import Avatar from './Avatar'
import Badge from './Badge'
import Card from './Card'

interface PetCardProps {
  pet:       Pet
  onClick?:  (pet: Pet) => void
  isActive?: boolean
}

const speciesStatus: Record<string, BadgeStatus> = {
  dog:     'info',
  cat:     'success',
  bird:    'warning',
  rabbit:  'neutral',
  reptile: 'danger',
  other:   'neutral',
}

function useCalcAge() {
  const { t } = useTranslation()
  return (birthDate?: string): string => {
    if (!birthDate) return t('pet.ageUnknown')
    const birth  = new Date(birthDate)
    const now    = new Date()
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
    if (months < 12) return t('pet.ageMonths', { count: months })
    const years = Math.floor(months / 12)
    return t('pet.ageYears', { count: years })
  }
}

export default function PetCard({ pet, onClick, isActive = false }: PetCardProps) {
  const { t }   = useTranslation()
  const calcAge = useCalcAge()

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
            {pet.breed ?? t('pet.breedUnknown')} · {calcAge(pet.birthDate)}
          </p>
        </div>

        <Badge
          label={t(`pet.species.${pet.species}`, { defaultValue: t('pet.species.other') })}
          status={speciesStatus[pet.species] ?? 'neutral'}
        />
      </div>
    </Card>
  )
}