// src/context/VetPrescriptionsContext.tsx — versão completa corrigida

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';



// src/context/VetPrescriptionsContext.tsx

export type DigitalPrescriptionStatus = 'active' | 'expiring' | 'expired' | 'used';

export interface DigitalPrescription {
  id: string;
  petId: string;
  medicationId: string | null;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  issuedAt: string;
  expiresAt: string | null;
  instructions: string | null;
  notes: string | null;
  status: DigitalPrescriptionStatus;  // ← usa o tipo exportado
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: string;
}


interface VetPrescriptionsContextValue {
  prescriptions:           DigitalPrescription[];
  getPrescriptionsByPetId: (petId: string) => DigitalPrescription[];
  addPrescription:         (petId: string, rx: Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>) => void;
  updatePrescription:      (id: string, data: Partial<Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>>) => void;
  deletePrescription:      (id: string) => void;
  togglePrescriptionUsed:  (id: string, used: boolean) => void;
}

const VetPrescriptionsContext = createContext<VetPrescriptionsContextValue | null>(null);

export function VetPrescriptionsProvider({ children }: { children: ReactNode }) {
  const [prescriptions, setPrescriptions] = useState<DigitalPrescription[]>([]);

  const getPrescriptionsByPetId = useCallback(
    (petId: string) => prescriptions.filter(r => r.petId === petId),
    [prescriptions]
  );

  const addPrescription = useCallback(
    (petId: string, rx: Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>) => {
      setPrescriptions(prev => [{
        ...rx,
        id:        crypto.randomUUID(),
        petId,
        createdAt: new Date().toISOString(),
      }, ...prev]);
    }, []
  );

  const updatePrescription = useCallback(
    (id: string, data: Partial<Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>>) => {
      setPrescriptions(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    }, []
  );

  const deletePrescription = useCallback(
    (id: string) => setPrescriptions(prev => prev.filter(r => r.id !== id)),
    []
  );

  const togglePrescriptionUsed = useCallback(
    (id: string, used: boolean) => {
      setPrescriptions(prev => prev.map(r =>
        r.id === id ? { ...r, status: used ? 'used' : 'active' } : r
      ));
    }, []
  );

  const value = useMemo(() => ({
    prescriptions,
    getPrescriptionsByPetId,
    addPrescription,
    updatePrescription,
    deletePrescription,
    togglePrescriptionUsed,
  }), [prescriptions, getPrescriptionsByPetId, addPrescription, updatePrescription, deletePrescription, togglePrescriptionUsed]);

  return (
    <VetPrescriptionsContext.Provider value={value}>
      {children}
    </VetPrescriptionsContext.Provider>
  );
}

export function useVetPrescriptions() {
  const ctx = useContext(VetPrescriptionsContext);
  if (!ctx) throw new Error('useVetPrescriptions must be used inside VetPrescriptionsProvider');
  return ctx;
}