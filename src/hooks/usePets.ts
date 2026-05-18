// src/hooks/usePets.ts — sem mocks, dados reais via PitutiContext
import { usePituti } from '../context/PitutiContext';
import type { Pet } from '../context/PetsContext';
 
// PetWithAlerts: alerts permanece string[] para compatibilidade com
// DashboardPage e PetListPage que o tratam como texto simples.
// PetDetailPage faz o cast para PetAlert[] inline onde precisar de .type/.text.
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
 
// Alias de compatibilidade com importações existentes
export const SPECIESEMOJI = SPECIES_EMOJI;


// export type { VaccineRecord } from '../utils/vaccUtils'
// export { getVaccStatus }      from '../utils/vaccUtils'

export function usePets() {
  const { state, refetchPets } = usePituti();
  return {
    pets: state.pets as PetWithAlerts[],
    loading: state.petsLoading,
    error: state.petsError,
    refetch: refetchPets,
  };
}
