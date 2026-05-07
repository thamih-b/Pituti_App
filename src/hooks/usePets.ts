// Hook de mascotas — sin mocks, datos reales via PitutiContext
import { usePituti } from '../context/PitutiContext';
import type { Pet } from '../context/PetsContext';

// PetWithAlerts: campos opcionais até o backend os fornecer
export interface PetWithAlerts extends Pet {
  createdAt: any;
  healthScore?: number;
  alerts?: string[];
  vaccCoverage?: number;
}

export const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  bird: '🐦',
  rabbit: '🐰',
  reptile: '🦎',
  fish: '🐟',
  other: '🐾',
};

// Mantido como alias para compatibilidade com importações existentes
export const SPECIESEMOJI = SPECIES_EMOJI;

export type { VaccineRecord } from '../utils/vaccUtils'
export { getVaccStatus }      from '../utils/vaccUtils'

export function usePets() {
  const { state, refetchPets } = usePituti();
  return {
    pets: state.pets as PetWithAlerts[],
    loading: state.petsLoading,
    error: state.petsError,
    refetch: refetchPets,
  };
}