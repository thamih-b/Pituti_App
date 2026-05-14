// src/context/VetDocumentsContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface VetDocument {
  id: string;
  petId: string;
  name: string;
  title: string;            
  type: 'passport' | 'certificate' | 'insurance' | 'report' | 'other';
  issueDate: string | null;  
  expiryDate: string | null; 
  issuedBy: string | null;   
  fileUrl: string | null;
  fileName: string | null;
  notes: string | null;
  createdAt: string;
}

interface VetDocumentsContextValue {
  documents:      VetDocument[];
  addDocument:    (doc: Omit<VetDocument, 'id' | 'createdAt'>) => void;
  updateDocument: (id: string, data: Partial<VetDocument>) => void;  // ← adicionar
  deleteDocument: (id: string) => void;
}

const VetDocumentsContext = createContext<VetDocumentsContextValue | null>(null);

export function VetDocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<VetDocument[]>([]);

  const addDocument = useCallback((doc: Omit<VetDocument, 'id' | 'createdAt'>) => {
    setDocuments(prev => [{
      ...doc,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const updateDocument = useCallback(
  (id: string, data: Partial<VetDocument>) =>
    setDocuments(prev =>
      prev.map(d => d.id === id ? { ...d, ...data } : d)
    ),
  []
);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <VetDocumentsContext.Provider
  value={{ documents, addDocument, updateDocument, deleteDocument }}
>
      {children}
    </VetDocumentsContext.Provider>
  );
}

export function useVetDocuments() {
  const ctx = useContext(VetDocumentsContext);
  if (!ctx) throw new Error('useVetDocuments must be used inside VetDocumentsProvider');
  return ctx;
}