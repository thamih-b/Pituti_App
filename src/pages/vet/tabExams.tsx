// src/pages/vet/TabExams.tsx
import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ExamRecord, ExamType } from '../../context/VetContext';

// ─── Tipos de exame (só value + emoji — labels via t()) ────────────────────────

const EXAM_TYPE_VALUES: { value: ExamType; emoji: string }[] = [
  { value: 'blood',      emoji: '🩸' },
  { value: 'urine',      emoji: '🧪' },
  { value: 'xray',       emoji: '🦴' },
  { value: 'ultrasound', emoji: '📡' },
  { value: 'pathology',  emoji: '🔬' },
  { value: 'other',      emoji: '📋' },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface TabExamsProps {
  petId: string;
  petName: string;
  exams: ExamRecord[];
  onAdd: (exam: Omit<ExamRecord, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, exam: Partial<ExamRecord>) => void;
  onDelete: (id: string) => void;
  showToast: (msg: string) => void;
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function TabExams({
  petId, petName, exams, onAdd, onUpdate, onDelete, showToast,
}: TabExamsProps) {
  const { t } = useTranslation();

  const [showModal,     setShowModal]     = useState(false);
  const [editing,       setEditing]       = useState<ExamRecord | null>(null);
  const [detailItem,    setDetailItem]    = useState<ExamRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // labels resolvidos dentro do componente
  const examTypes = EXAM_TYPE_VALUES.map((et) => ({
    ...et,
    label: t(`vet.exams.types.${et.value}`),
  }));

  const sorted = useMemo(
    () => [...exams]
      .filter((e) => e.petId === petId)
      .sort((a, b) => b.date.localeCompare(a.date)),
    [exams, petId]
  );

  function handleEdit(exam: ExamRecord) {
    setEditing(exam);
    setDetailItem(null);
    setShowModal(true);
  }

  function handleDeleteConfirmed(id: string) {
    onDelete(id);
    setDetailItem(null);
    setConfirmDelete(null);
    showToast(t('vet.exams.toastDeleted'));
  }

  return (
    <div className="tab-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          className="btn btn-primary"
          onClick={() => { setEditing(null); setShowModal(true); }}
        >
          {t('vet.exams.newBtn')}
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔬</div>
          <h3>{t('vet.exams.emptyTitle')}</h3>
          <p>{t('vet.exams.emptyHint', { name: petName })}</p>
          <button
            className="btn btn-primary"
            onClick={() => { setEditing(null); setShowModal(true); }}
          >
            {t('vet.exams.emptyBtn')}
          </button>
        </div>
      ) : (
        <div className="card-list">
          {sorted.map((exam) => {
            const typeInfo = examTypes.find((et) => et.value === exam.type);
            return (
              <div
                key={exam.id}
                className="exam-card"
                onClick={() => setDetailItem(exam)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setDetailItem(exam)}
              >
                <div className="exam-card-icon" data-type={exam.type}>
                  {typeInfo?.emoji ?? '📋'}
                </div>
                <div className="exam-card-body">
                  <div className="exam-card-type">{typeInfo?.label}</div>
                  <div className="exam-card-date">
                    {new Date(exam.date + 'T12:00:00').toLocaleDateString(undefined, {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                    {exam.lab && <span className="exam-card-lab"> · {exam.lab}</span>}
                  </div>
                  {exam.results && (
                    <div className="exam-card-preview">
                      {exam.results.slice(0, 120)}{exam.results.length > 120 ? '…' : ''}
                    </div>
                  )}
                </div>
                {exam.fileUrl && (
                  <span className={`badge badge-file badge-${exam.fileType ?? 'other'}`}>
                    {exam.fileType === 'pdf' ? '📄 PDF' : '🖼️ IMG'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ExamModal
          initial={editing}
          petId={petId}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) {
              onUpdate(editing.id, data);
              showToast(t('vet.exams.toastUpdated'));
            } else {
              onAdd(data);
              showToast(t('vet.exams.toastAdded'));
            }
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}

      {detailItem && (
        <ExamDetailOverlay
          exam={detailItem}
          onClose={() => { setDetailItem(null); setConfirmDelete(null); }}
          onEdit={() => handleEdit(detailItem)}
          onRequestDelete={() => setConfirmDelete(detailItem.id)}
          confirmDeleteId={confirmDelete}
          onConfirmDelete={handleDeleteConfirmed}
          onCancelDelete={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ─── Modal Criar / Editar ──────────────────────────────────────────────────────

function ExamModal({
  initial, petId, onClose, onSave,
}: {
  initial: ExamRecord | null;
  petId: string;
  onClose: () => void;
  onSave: (data: Omit<ExamRecord, 'id' | 'createdAt'>) => void;
}) {
  const { t } = useTranslation();

  const examTypes = EXAM_TYPE_VALUES.map((et) => ({
    ...et,
    label: t(`vet.exams.types.${et.value}`),
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type,      setType]      = useState<ExamType>(initial?.type ?? 'blood');
  const [date,      setDate]      = useState(initial?.date ?? new Date().toISOString().split('T')[0]);
  const [lab,       setLab]       = useState(initial?.lab ?? '');
  const [vetName,   setVetName]   = useState(initial?.vetName ?? '');
  const [results,   setResults]   = useState(initial?.results ?? '');
  const [notes,     setNotes]     = useState(initial?.notes ?? '');
  const [fileUrl,   setFileUrl]   = useState<string | null>(initial?.fileUrl ?? null);
  const [fileName,  setFileName]  = useState<string | null>(initial?.fileName ?? null);
  const [fileType,  setFileType]  = useState<'pdf' | 'image' | null>(initial?.fileType ?? null);
  const [fileError, setFileError] = useState('');
  const [errDate,   setErrDate]   = useState('');
  const [errResults, setErrResults] = useState('');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFileError(t('vet.exams.uploadErrSize'));
      return;
    }
    const isImage = file.type.startsWith('image/');
    const isPDF   = file.type === 'application/pdf';
    if (!isImage && !isPDF) {
      setFileError(t('vet.exams.uploadErrFormat'));
      return;
    }
    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result as string);
      setFileName(file.name);
      setFileType(isPDF ? 'pdf' : 'image');
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!date) {
      setErrDate(t('vet.exams.fieldDateRequired'));
      valid = false;
    } else {
      setErrDate('');
    }
    if (!results.trim()) {
      setErrResults(t('vet.exams.fieldResultsRequired'));
      valid = false;
    } else {
      setErrResults('');
    }
    if (!valid) return;
    onSave({
      petId, type, date,
      lab:      lab.trim()      || null,
      vetName:  vetName.trim()  || null,
      results:  results.trim(),
      notes:    notes.trim()    || null,
      fileUrl, fileName, fileType,
    });
  }

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <span className="modal-title">
            {initial ? t('vet.exams.modalEdit') : t('vet.exams.modalAdd')}
          </span>
          <button className="btn btn-ghost" onClick={onClose} aria-label={t('btn.close')}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo */}
          <div className="field-group" style={{ marginBottom: '1rem' }}>
            <label className="field-label">{t('vet.exams.fieldType')}</label>
            <div className="exam-type-grid">
              {examTypes.map((et) => (
                <button
                  key={et.value}
                  type="button"
                  className={`exam-type-btn${type === et.value ? ' active' : ''}`}
                  onClick={() => setType(et.value)}
                >
                  <span>{et.emoji}</span>
                  <span>{et.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Data */}
          <div className="field-group">
            <label className="field-label">{t('vet.exams.fieldDate')} *</label>
            <input
              type="date"
              className={`field-input${errDate ? ' field-error' : ''}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errDate && <span className="field-error-msg">{errDate}</span>}
          </div>

          {/* Lab + Vet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="field-group">
              <label className="field-label">{t('vet.exams.fieldLab')}</label>
              <input
                type="text"
                className="field-input"
                placeholder={t('vet.exams.fieldLabPh')}
                value={lab}
                onChange={(e) => setLab(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label">{t('vet.exams.fieldVet')}</label>
              <input
                type="text"
                className="field-input"
                placeholder={t('vet.exams.fieldVetPh')}
                value={vetName}
                onChange={(e) => setVetName(e.target.value)}
              />
            </div>
          </div>

          {/* Resultados */}
          <div className="field-group">
            <label className="field-label">{t('vet.exams.fieldResults')} *</label>
            <textarea
              className={`field-input${errResults ? ' field-error' : ''}`}
              style={{ minHeight: 100, resize: 'vertical' }}
              placeholder={t('vet.exams.fieldResultsPh')}
              value={results}
              onChange={(e) => setResults(e.target.value)}
            />
            {errResults && <span className="field-error-msg">{errResults}</span>}
          </div>

          {/* Upload */}
          <div className="field-group">
            <label className="field-label">{t('vet.exams.fieldAttach')}</label>
            <div
              className={`exam-upload-zone${fileUrl ? ' has-file' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  handleFile({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              {fileUrl ? (
                <div className="exam-upload-preview">
                  {fileType === 'pdf'
                    ? <span>📄 <strong>{fileName}</strong></span>
                    : <img src={fileUrl} alt="preview" style={{ maxHeight: 120, borderRadius: 8 }} />
                  }
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm exam-upload-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileUrl(null);
                      setFileName(null);
                      setFileType(null);
                    }}
                  >
                    {t('vet.exams.uploadRemove')}
                  </button>
                </div>
              ) : (
                <>
                  <span className="exam-upload-icon">📎</span>
                  <span className="exam-upload-text">{t('vet.exams.uploadDrag')}</span>
                  <span className="exam-upload-hint">{t('vet.exams.uploadHint')}</span>
                </>
              )}
            </div>
            {fileError && <span className="field-error-msg">{fileError}</span>}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              style={{ display: 'none' }}
              onChange={handleFile}
            />
          </div>

          {/* Notas */}
          <div className="field-group">
            <label className="field-label">{t('vet.exams.fieldNotes')}</label>
            <textarea
              className="field-input"
              style={{ minHeight: 64, resize: 'vertical' }}
              placeholder={t('vet.exams.fieldNotesPh')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('btn.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {initial ? t('btn.saveChanges') : t('vet.exams.emptyBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Overlay de Detalhe ────────────────────────────────────────────────────────

function ExamDetailOverlay({
  exam, onClose, onEdit, onRequestDelete,
  confirmDeleteId, onConfirmDelete, onCancelDelete,
}: {
  exam: ExamRecord;
  onClose: () => void;
  onEdit: () => void;
  onRequestDelete: () => void;
  confirmDeleteId: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}) {
  const { t } = useTranslation();

  const examTypes = EXAM_TYPE_VALUES.map((et) => ({
    ...et,
    label: t(`vet.exams.types.${et.value}`),
  }));

  const typeInfo = examTypes.find((et) => et.value === exam.type);

  function handleViewFile() {
    if (!exam.fileUrl) return;
    const a = document.createElement('a');
    a.href = exam.fileUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (exam.fileType === 'pdf') a.download = exam.fileName ?? 'report.pdf';
    a.click();
  }

  return (
    <div className="detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-sheet">
        <div className="detail-header">
          <div className="detail-icon" style={{ background: 'var(--primary-hl)', fontSize: '1.5rem' }}>
            {typeInfo?.emoji ?? '📋'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{typeInfo?.label}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {new Date(exam.date + 'T12:00:00').toLocaleDateString(undefined, {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </div>
          </div>
          <button className="detail-close" onClick={onClose} aria-label={t('btn.close')}>✕</button>
        </div>

        <div className="detail-body">
          <div className="detail-info-grid">
            {exam.lab && (
              <div className="detail-info-chip">
                <div className="detail-info-label">{t('vet.exams.detailLab')}</div>
                <div className="detail-info-value">{exam.lab}</div>
              </div>
            )}
            {exam.vetName && (
              <div className="detail-info-chip">
                <div className="detail-info-label">{t('vet.exams.detailVet')}</div>
                <div className="detail-info-value">{exam.vetName}</div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div className="detail-info-label" style={{ marginBottom: '0.375rem' }}>
              {t('vet.exams.detailResults')}
            </div>
            <div className="exam-detail-results">{exam.results}</div>
          </div>

          {exam.notes && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="detail-info-label" style={{ marginBottom: '0.375rem' }}>
                {t('vet.exams.detailNotes')}
              </div>
              <div className="exam-detail-results" style={{ color: 'var(--text-muted)' }}>
                {exam.notes}
              </div>
            </div>
          )}

          {exam.fileUrl && (
            <div className="exam-file-preview-wrap">
              {exam.fileType === 'image' && (
                <img
                  src={exam.fileUrl}
                  alt={t('vet.exams.detailResults')}
                  style={{ width: '100%', borderRadius: 8, marginBottom: '0.5rem' }}
                />
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleViewFile}
                style={{ width: '100%' }}
              >
                {exam.fileType === 'pdf' ? t('vet.exams.openPdf') : t('vet.exams.viewImage')}
                {exam.fileName && (
                  <span style={{ marginLeft: '0.5rem', fontWeight: 400, opacity: 0.7 }}>
                    {exam.fileName}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="detail-footer">
          {confirmDeleteId === exam.id ? (
            <>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={() => onConfirmDelete(exam.id)}
              >
                {t('vet.exams.confirmDelete')}
              </button>
              <button className="btn btn-ghost" onClick={onCancelDelete}>
                {t('btn.cancel')}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-warn" onClick={onRequestDelete}>
                {t('btn.delete')}
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onEdit}>
                {t('btn.edit')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}