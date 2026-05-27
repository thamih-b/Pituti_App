// src/pages/VaccinesPage.tsx

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePetsContext } from '../context/PetsContext'
import { useVaccinesContext } from '../context/VaccinesContext'
import { RegisterVaccineModal } from './PetDetailPage'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import { getVaccStatus } from '../utils/vaccUtils'

const PETEMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  bird: '🦜',
  rabbit: '🐰',
  reptile: '🦎',
  fish: '🐟',
  other: '🐾',
}

export default function VaccinesPage() {
  const { t } = useTranslation()
  const { pets, loading: petsLoading } = usePetsContext()
  const {
    vaccinesByPet,
    loading: vaccinesLoading,
    addVaccine,
    updateVaccine,
    deleteVaccine,
  } = useVaccinesContext()

  const VACCBADGE = {
    ok: { badge: t('pet.vacc.badgeOk'), cls: 'badge-green' },
    soon: { badge: t('pet.vacc.badgeSoon'), cls: 'badge-yellow' },
    late: { badge: t('pet.vacc.badgeLate'), cls: 'badge-red' },
  }

  // ✅ Inicialização segura
  const [selectedPetId, setSelectedPetId] = useState('')
  const [registerOpen, setRegisterOpen] = useState(false)
  const [detailVaccine, setDetailVaccine] = useState<any>(null)
  const [editVaccine, setEditVaccine] = useState<any>(null)

  // ✅ Sincroniza quando pets carregam
  useEffect(() => {
    if (!petsLoading && pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0]?.id ?? '')
    }
  }, [pets, petsLoading, selectedPetId])

  // ✅ Sincroniza quando o pet selecionado deixa de existir
  useEffect(() => {
    if (selectedPetId && !pets.find((p) => p.id === selectedPetId)) {
      setSelectedPetId(pets[0]?.id ?? '')
    }
  }, [pets, selectedPetId])

  const selectedPet = useMemo(() => {
    return pets.find((p) => p.id === selectedPetId) ?? null
  }, [pets, selectedPetId])

  const petVaccines = useMemo(() => {
    if (!selectedPetId) return []
    return vaccinesByPet[selectedPetId] ?? []
  }, [vaccinesByPet, selectedPetId])

  // ✅ Guards de render
  if (petsLoading || vaccinesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    )
  }

  if (!pets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-gray-500">{t('pets.noPets')}</div>
        <button
          onClick={() => {
            window.location.href = '/pets'
          }}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          {t('pets.addPet')}
        </button>
      </div>
    )
  }

  if (!selectedPetId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">{t('vaccines.selectPet')}</div>
      </div>
    )
  }

  if (!selectedPet) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">{t('vaccines.petNotFound')}</div>
      </div>
    )
  }

  const handleAddVaccine = () => {
    setRegisterOpen(true)
  }

  const handleDeleteVaccine = async (vaccineId: string) => {
    if (!confirm(t('vaccines.confirmDelete'))) return

    try {
      await deleteVaccine(selectedPetId, vaccineId)
      if (detailVaccine?.id === vaccineId) {
        setDetailVaccine(null)
      }
    } catch (error) {
      console.error('Error deleting vaccine:', error)
      alert(t('vaccines.deleteError'))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{t('vaccines.title')}</h1>
        <p className="text-gray-600">
          {t('vaccines.for')} {selectedPet.name}
        </p>
      </div>

      <div className="mb-4">
        <select
          value={selectedPetId}
          onChange={(e) => setSelectedPetId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name} ({pet.species})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddVaccine}
        className="mb-4 px-4 py-2 bg-primary text-white rounded"
      >
        {t('vaccines.add')}
      </button>

      {petVaccines.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {t('vaccines.noVaccines')}
        </div>
      ) : (
        <div className="space-y-2">
          {petVaccines.map((vaccine) => (
            <div
              key={vaccine.id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{vaccine.name}</h3>
                <p className="text-sm text-gray-600">{vaccine.applied}</p>

                {vaccine.nextDate && (
                  <p className="text-sm text-gray-500">
                    {t('vaccines.nextDose')}:{' '}
                    {new Date(
                      vaccine.nextDate + 'T00:00:00'
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDetailVaccine(vaccine)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  {t('common.view')}
                </button>

                <button
                  onClick={() => setEditVaccine(vaccine)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                >
                  {t('common.edit')}
                </button>

                <button
                  onClick={() => handleDeleteVaccine(vaccine.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {registerOpen && selectedPet && (
        <RegisterVaccineModal
          isOpen={registerOpen}
          onClose={() => setRegisterOpen(false)}
          petName={selectedPet.name}
          vaccines={petVaccines}
          onRegister={(v) => {
            addVaccine(selectedPetId, {
              id: '',
              name: v.name,
              applied: v.date,
              nextDate: v.nextDate,
              badge: '',
              badgeCls: '',
            })
            setRegisterOpen(false)
          }}
        />
      )}

      {detailVaccine && selectedPet && (
        <VaccineDetailModal
          vaccine={{
            ...detailVaccine,
            cls: getVaccStatus(detailVaccine.nextDate) as 'ok' | 'soon' | 'late',
            petName: selectedPet.name,
            petEmoji: PETEMOJI[selectedPet.species] ?? '🐾',
          }}
          onClose={() => setDetailVaccine(null)}
          onEdit={(v) => {
            setDetailVaccine(null)
            setEditVaccine(v)
          }}
          onMarkApplied={(v, appliedDate, nextDate) => {
            const cls = getVaccStatus(nextDate) as 'ok' | 'soon' | 'late'
            updateVaccine(selectedPetId, {
              ...v,
              applied: new Date(appliedDate + 'T12:00:00').toLocaleDateString(
                undefined,
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }
              ),
              nextDate,
              badge: VACCBADGE[cls].badge,
              badgeCls: VACCBADGE[cls].cls,
            })
            setDetailVaccine(null)
          }}
        />
      )}

      {editVaccine && (
        <EditVaccineModal
          isOpen={!!editVaccine}
          vaccine={editVaccine}
          onClose={() => setEditVaccine(null)}
          onSave={(updated) => {
            updateVaccine(selectedPetId, updated)
            setEditVaccine(null)
          }}
        />
      )}
    </div>
  )
}
