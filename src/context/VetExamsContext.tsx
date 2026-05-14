// src/context/VetExamsContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ExamType = 'blood' | 'urine' | 'xray' | 'ultrasound'  | 'ecg'       | 'pathology' | 'other';

export interface ExamRecord {
  id: string;
  petId: string;
  type: ExamType;
  date: string;
  lab: string | null;
  vetName: string | null;
  results: string;
  notes: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileType: 'pdf' | 'image' | null;
  createdAt: string;
}

interface VetExamsContextValue {
  exams: ExamRecord[];
  addExam:    (exam: Omit<ExamRecord, 'id' | 'createdAt'>) => void;
updateExam: (id: string, exam: Partial<ExamRecord>) => void;
  deleteExam: (id: string) => void;
}

const VetExamsContext = createContext<VetExamsContextValue | null>(null);

export function VetExamsProvider({ children }: { children: ReactNode }) {
  const [exams, setExams] = useState<ExamRecord[]>([]);

  const addExam = useCallback((exam: Omit<ExamRecord, 'id' | 'createdAt'>) => {
    setExams(prev => [{
      ...exam,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, []);

const updateExam = useCallback(
  (id: string, exam: Partial<ExamRecord>) =>
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...exam } : e)),
  []
);

  const deleteExam = useCallback((id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <VetExamsContext.Provider value={{ exams, addExam, updateExam, deleteExam }}>
      {children}
    </VetExamsContext.Provider>
  );
}

export function useVetExams() {
  const ctx = useContext(VetExamsContext);
  if (!ctx) throw new Error('useVetExams must be used inside VetExamsProvider');
  return ctx;
}