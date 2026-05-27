// src/hooks/useSafePetId.ts
// Hook para gerenciar petId com defensive programming

import { useState, useEffect, useRef } from 'react'
import { usePetsContext } from '../context/PetsContext'

interface UseSafePetIdOptions {
  defaultPetId?: string
  onPetChange?: (petId: string) => void
}

/**
 * Hook que gerencia petId com segurança, garantindo que:
 * - Nunca é undefined/null
 * - Sempre aponta para um pet existente
 * - Se sincroniza quando pets mudam (ex: deleção)
 * - Tem fallback para o primeiro pet disponível
 */
export function useSafePetId(options: UseSafePetIdOptions = {}) {
  const { defaultPetId, onPetChange } = options
  // FIX 1: usePetsContext é o nome correto no projeto, não usePets
  const { pets, loading } = usePetsContext()

  const [petId, setPetId] = useState<string>('')
  const initialized = useRef(false)

  // FIX 2: useRef para initialized — evita re-execuções desnecessárias do effect
  // Inicializar petId quando pets carregar (roda apenas uma vez)
  useEffect(() => {
    if (loading || initialized.current) return
    if (pets.length === 0) {
      initialized.current = true
      return
    }

    // Prioridade: defaultPetId válido > primeiro pet
    const initialId =
      defaultPetId && pets.find(p => p.id === defaultPetId)
        ? defaultPetId
        : pets[0].id

    setPetId(initialId)
    initialized.current = true
  }, [pets, loading, defaultPetId])

  // Sincronizar quando petId selecionado não existe mais (ex: pet deletado)
  useEffect(() => {
    if (!initialized.current || !petId) return
    const petExists = pets.some(p => p.id === petId)
    if (!petExists && pets.length > 0) {
      const newPetId = pets[0].id
      setPetId(newPetId)
      onPetChange?.(newPetId)
    }
  }, [pets, petId, onPetChange])

  // FIX 3: flag para não notificar no mount, apenas em mudanças reais
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (petId) onPetChange?.(petId)
  }, [petId, onPetChange])

  const currentPet = pets.find(p => p.id === petId) ?? null
  const hasPets    = pets.length > 0
  const isValid    = !!petId && !!currentPet

  return {
    petId,
    setPetId,
    currentPet,
    hasPets,
    isValid,
    loading,
    initialized: initialized.current,
  }
}
