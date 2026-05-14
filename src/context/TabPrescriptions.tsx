import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type DigitalPrescriptionStatus = 'active' | 'expiring' | 'expired' | 'used';

export interface PrescriptionMedicationOption {
  id: string;
  title: string;
  dose: string;
  frequency: string;
  endDate?: string | null;
}

export interface DigitalPrescription {
  id: string;
  petId: string;
  medicationId: string | null;
  medicationName: string;
  dosage: string;
  duration: string;
  prescribedBy: string;
  issuedAt: string;
  expiresAt: string | null;
  instructions: string | null;
  notes: string | null;
  status: DigitalPrescriptionStatus;
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: string;
}

type PrescriptionDraft = Omit<
  DigitalPrescription,
  'id' | 'petId' | 'createdAt'
>;

interface TabPrescriptionsProps {
  petId: string;
  petName: string;
  prescriptions: DigitalPrescription[];
  medications: PrescriptionMedicationOption[];
  onAdd: (data: Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>) => void;
  onUpdate: (
    id: string,
    data: Partial<Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>>
  ) => void;
  onDelete: (id: string) => void;
  onToggleUsed: (id: string, used: boolean) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const CUSTOM_MEDICATION_VALUE = '__custom__';

const toUtcMs = (value: string) => new Date(`${value}T00:00:00Z`).getTime();

function daysUntil(dateStr: string, todayStr: string): number {
  return Math.ceil((toUtcMs(dateStr) - toUtcMs(todayStr)) / 86400000);
}

function resolvePrescriptionStatus(
  item: Pick<DigitalPrescription, 'expiresAt' | 'status'>,
  todayStr: string
): DigitalPrescriptionStatus {
  if (item.status === 'used') return 'used';
  if (!item.expiresAt) return 'active';

  const diff = daysUntil(item.expiresAt, todayStr);
  if (diff < 0) return 'expired';
  if (diff <= 7) return 'expiring';
  return 'active';
}

function formatDate(value: string | null, language: string): string {
  if (!value) return '—';
  return new Date(`${value}T12:00:00`).toLocaleDateString(language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('file-read-error'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function createEmptyDraft(todayStr: string): PrescriptionDraft {
  return {
    medicationId: null,
    medicationName: '',
    dosage: '',
    duration: '',
    prescribedBy: '',
    issuedAt: todayStr,
    expiresAt: null,
    instructions: '',
    notes: '',
    status: 'active',
    attachmentUrl: null,
    attachmentName: null,
  };
}

export default function TabPrescriptions({
  petId,
  petName,
  prescriptions,
  medications,
  onAdd,
  onUpdate,
  onDelete,
  onToggleUsed,
}: TabPrescriptionsProps) {
  const { t, i18n } = useTranslation();
  const todayStr = new Date().toISOString().split('T')[0];

  const [filter, setFilter] = useState<
    'all' | 'active' | 'expiring' | 'expired' | 'used'
  >('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DigitalPrescription | null>(null);
  const [detail, setDetail] = useState<DigitalPrescription | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<PrescriptionDraft>(() => createEmptyDraft(todayStr));

  useEffect(() => {
    if (!modalOpen) return;
    if (editing) {
      setDraft({
        medicationId: editing.medicationId,
        medicationName: editing.medicationName,
        dosage: editing.dosage,
        duration: editing.duration,
        prescribedBy: editing.prescribedBy,
        issuedAt: editing.issuedAt,
        expiresAt: editing.expiresAt,
        instructions: editing.instructions ?? '',
        notes: editing.notes ?? '',
        status: editing.status,
        attachmentUrl: editing.attachmentUrl,
        attachmentName: editing.attachmentName,
      });
      setErrors({});
      return;
    }
    setDraft(createEmptyDraft(todayStr));
    setErrors({});
  }, [editing, modalOpen, todayStr]);

  const items = useMemo(() => {
    return prescriptions
      .map((item) => ({
        ...item,
        effectiveStatus: resolvePrescriptionStatus(item, todayStr),
      }))
      .sort((a, b) => {
        const issued = b.issuedAt.localeCompare(a.issuedAt);
        if (issued !== 0) return issued;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [prescriptions, todayStr]);

  const expiringCount = useMemo(
    () => items.filter((item) => item.effectiveStatus === 'expiring').length,
    [items]
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.effectiveStatus === filter);
  }, [filter, items]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: DigitalPrescription) => {
    setEditing(item);
    setDetail(null);
    setConfirmDeleteId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setErrors({});
    setDraft(createEmptyDraft(todayStr));
  };

  const setField = <K extends keyof PrescriptionDraft>(
    key: K,
    value: PrescriptionDraft[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleMedicationSelect = (value: string) => {
    if (value === CUSTOM_MEDICATION_VALUE) {
      setDraft((prev) => ({
        ...prev,
        medicationId: null,
      }));
      return;
    }

    const selected = medications.find((med) => med.id === value) ?? null;

    setDraft((prev) => ({
      ...prev,
      medicationId: selected?.id ?? null,
      medicationName: selected?.title ?? prev.medicationName,
      dosage: selected?.dose ?? prev.dosage,
    }));
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!draft.medicationName.trim()) next.medicationName = t('vet.prescriptions.errMedicationName');
    if (!draft.dosage.trim()) next.dosage = t('vet.prescriptions.errDosage');
    if (!draft.duration.trim()) next.duration = t('vet.prescriptions.errDuration');
    if (!draft.prescribedBy.trim()) next.prescribedBy = t('vet.prescriptions.errPrescribedBy');
    if (!draft.issuedAt) next.issuedAt = t('vet.prescriptions.errIssuedAt');

    if (draft.expiresAt && draft.issuedAt && draft.expiresAt < draft.issuedAt) {
      next.expiresAt = t('vet.prescriptions.errExpiresAfterIssued');
    }

    return next;
  };

  const handleAttachment = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const accepted =
      file.type === 'application/pdf' || file.type.startsWith('image/');

    if (!accepted) {
      setErrors((prev) => ({
        ...prev,
        attachment: t('vet.prescriptions.errFileType'),
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        attachment: t('vet.prescriptions.errFileSize'),
      }));
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);

    setDraft((prev) => ({
      ...prev,
      attachmentUrl: dataUrl,
      attachmentName: file.name,
    }));
    setErrors((prev) => ({ ...prev, attachment: '' }));

    event.target.value = '';
  };

  const handleSave = () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload: Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'> = {
      medicationId: draft.medicationId,
      medicationName: draft.medicationName.trim(),
      dosage: draft.dosage.trim(),
      duration: draft.duration.trim(),
      prescribedBy: draft.prescribedBy.trim(),
      issuedAt: draft.issuedAt,
      expiresAt: draft.expiresAt || null,
      instructions: draft.instructions?.trim() || null,
      notes: draft.notes?.trim() || null,
      status: draft.status,
      attachmentUrl: draft.attachmentUrl,
      attachmentName: draft.attachmentName,
    };

    if (editing) {
      onUpdate(editing.id, payload);
    } else {
      onAdd(payload);
    }

    closeModal();
  };

  const statusLabel = (status: DigitalPrescriptionStatus) =>
    t(`vet.prescriptions.statuses.${status}`);

  return (
    <div className="tab-content">
      {expiringCount > 0 && (
        <div className="rx-summary-banner">
          <div className="rx-summary-icon">!</div>
          <div className="rx-summary-copy">
            <div className="rx-summary-title">
              {t('vet.prescriptions.summaryExpiring')}
            </div>
            <div className="rx-summary-text">
              {t('vet.prescriptions.summaryExpiringCount', {
                count: expiringCount,
                name: petName,
              })}
            </div>
          </div>
        </div>
      )}

      <div className="rx-toolbar">
        <div className="rx-filter-row">
{(
  [
    { key: 'all',      label: t('vet.prescriptions.filterAll') },
    { key: 'active',   label: t('vet.prescriptions.filterActive') },
    { key: 'expiring', label: t('vet.prescriptions.filterExpiring') },
    { key: 'expired',  label: t('vet.prescriptions.filterExpired') },
    { key: 'used',     label: t('vet.prescriptions.filterUsed') },
  ] as const
).map(({ key, label }) => (
  <button
    key={key}
    type="button"
    className={['rx-filter-btn', filter === key ? 'active' : ''].join(' ')}
    onClick={() => setFilter(key)}
  >
    {label}
  </button>
))}

        </div>

        <button type="button" className="btn btn-primary tab-add-btn" onClick={openCreate}>
          {t('vet.prescriptions.addBtn')}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💊</div>
          <h3>{t('vet.prescriptions.emptyTitle')}</h3>
          <p>{t('vet.prescriptions.emptyText', { name: petName })}</p>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            {t('vet.prescriptions.addBtn')}
          </button>
        </div>
      ) : (
        <div className="card-list">
          {filtered.map((item) => {
            const effectiveStatus = resolvePrescriptionStatus(item, todayStr);
            const isExpired = effectiveStatus === 'expired';
            const isExpiring = effectiveStatus === 'expiring';

            return (
              <button
                key={item.id}
                type="button"
                className="rx-card"
                onClick={() => {
                  setDetail(item);
                  setConfirmDeleteId(null);
                }}
              >
                <div className="rx-card-main">
                  <div className="rx-card-icon" data-status={effectiveStatus}>
                    💊
                  </div>

                  <div className="rx-card-body">
                    <div className="rx-card-top">
                      <div className="rx-card-title">{item.medicationName}</div>
                      <span className="rx-status-chip" data-status={effectiveStatus}>
                        {statusLabel(effectiveStatus)}
                      </span>
                    </div>

                    <div className="rx-card-sub">
                      {item.prescribedBy} · {formatDate(item.issuedAt, i18n.language)}
                    </div>

                    <div className="rx-card-detail">
                      {item.dosage} · {item.duration}
                    </div>

                    <div className="rx-card-meta">
                      {item.expiresAt ? (
                        <span data-tone={isExpired ? 'danger' : isExpiring ? 'warn' : 'neutral'}>
                          {t('vet.prescriptions.validUntil')} {formatDate(item.expiresAt, i18n.language)}
                        </span>
                      ) : (
                        <span>{t('vet.prescriptions.noExpiry')}</span>
                      )}

                      {item.medicationId && (
                        <span data-tone="info">{t('vet.prescriptions.linkedMedication')}</span>
                      )}

                      {item.attachmentUrl && (
                        <span data-tone="info">{t('vet.prescriptions.attachedFile')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div
        className={['modal-backdrop', modalOpen ? 'open' : ''].join(' ')}
        onClick={closeModal}
        aria-hidden={!modalOpen}
      >
        <div
          className="modal rx-modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title">
              {editing
                ? t('vet.prescriptions.editTitle')
                : t('vet.prescriptions.addTitle')}
            </div>

            <button type="button" className="detail-close" onClick={closeModal} aria-label={t('btn.cancel')}>
              ✕
            </button>
          </div>

          <div className="rx-form-block">
            <div className="modal-section">{t('vet.prescriptions.sectionMedication')}</div>

            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.selectMedication')}</label>
              <select
                className="form-input"
                value={draft.medicationId ?? CUSTOM_MEDICATION_VALUE}
                onChange={(e) => handleMedicationSelect(e.target.value)}
              >
                <option value={CUSTOM_MEDICATION_VALUE}>
                  {t('vet.prescriptions.customMedication')}
                </option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('field.name')}</label>
                <input
                  className={['form-input', errors.medicationName ? 'form-input--err' : ''].join(' ')}
                  value={draft.medicationName}
                  onChange={(e) => setField('medicationName', e.target.value)}
                  placeholder={t('vet.prescriptions.medicationPlaceholder')}
                />
                {errors.medicationName && <span className="form-hint-err">{errors.medicationName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('vet.prescriptions.dosage')}</label>
                <input
                  className={['form-input', errors.dosage ? 'form-input--err' : ''].join(' ')}
                  value={draft.dosage}
                  onChange={(e) => setField('dosage', e.target.value)}
                  placeholder={t('vet.prescriptions.dosagePh')}
                />
                {errors.dosage && <span className="form-hint-err">{errors.dosage}</span>}
              </div>
            </div>
          </div>

          <div className="rx-form-block">
            <div className="modal-section">{t('vet.prescriptions.sectionPrescription')}</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('vet.prescriptions.duration')}</label>
                <input
                  className={['form-input', errors.duration ? 'form-input--err' : ''].join(' ')}
                  value={draft.duration}
                  onChange={(e) => setField('duration', e.target.value)}
                  placeholder={t('vet.prescriptions.durationPh')}
                />
                {errors.duration && <span className="form-hint-err">{errors.duration}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('vet.prescriptions.prescribedBy')}</label>
                <input
                  className={['form-input', errors.prescribedBy ? 'form-input--err' : ''].join(' ')}
                  value={draft.prescribedBy}
                  onChange={(e) => setField('prescribedBy', e.target.value)}
                  placeholder={t('vet.prescriptions.prescribedByPh')}
                />
                {errors.prescribedBy && <span className="form-hint-err">{errors.prescribedBy}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('vet.prescriptions.issuedAt')}</label>
                <input
                  type="date"
                  className={['form-input', errors.issuedAt ? 'form-input--err' : ''].join(' ')}
                  value={draft.issuedAt}
                  onChange={(e) => setField('issuedAt', e.target.value)}
                />
                {errors.issuedAt && <span className="form-hint-err">{errors.issuedAt}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('vet.prescriptions.expiresAt')}</label>
                <input
                  type="date"
                  className={['form-input', errors.expiresAt ? 'form-input--err' : ''].join(' ')}
                  value={draft.expiresAt ?? ''}
                  onChange={(e) => setField('expiresAt', e.target.value || null)}
                />
                {errors.expiresAt && <span className="form-hint-err">{errors.expiresAt}</span>}
              </div>
            </div>
          </div>

          <div className="rx-form-block">
            <div className="modal-section">{t('vet.prescriptions.sectionExtra')}</div>

            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.instructions')}</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={draft.instructions ?? ''}
                onChange={(e) => setField('instructions', e.target.value)}
                placeholder={t('vet.prescriptions.instructionsPh')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.notes')}</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={draft.notes ?? ''}
                onChange={(e) => setField('notes', e.target.value)}
                placeholder={t('vet.prescriptions.notesPh')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.attachment')}</label>

              <label className="rx-upload-box">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  hidden
                  onChange={handleAttachment}
                />
                <span className="rx-upload-title">{t('vet.prescriptions.attachmentUpload')}</span>
                <span className="rx-upload-sub">{t('vet.prescriptions.attachmentHint')}</span>
              </label>

              {errors.attachment && <span className="form-hint-err">{errors.attachment}</span>}

              {draft.attachmentUrl && (
                <div className="rx-attachment-row">
                  <span className="rx-attachment-name">{draft.attachmentName}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setDraft((prev) => ({
                        ...prev,
                        attachmentUrl: null,
                        attachmentName: null,
                      }));
                    }}
                  >
                    {t('vet.prescriptions.removeFile')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={closeModal}>
              {t('btn.cancel')}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              {editing ? t('vet.prescriptions.saveBtn') : t('vet.prescriptions.addBtn')}
            </button>
          </div>
        </div>
      </div>

      {detail && (
        <div
          className="detail-overlay"
          onClick={() => {
            setDetail(null);
            setConfirmDeleteId(null);
          }}
        >
          <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <div className="detail-icon rx-detail-icon" data-status={resolvePrescriptionStatus(detail, todayStr)}>
                💊
              </div>

              <div>
                <div className="vet-card-name">{detail.medicationName}</div>
                <div className="vet-card-clinic">
                  {detail.prescribedBy}
                </div>
              </div>

              <button
                type="button"
                className="detail-close"
                onClick={() => {
                  setDetail(null);
                  setConfirmDeleteId(null);
                }}
                aria-label={t('btn.cancel')}
              >
                ✕
              </button>
            </div>

            <div className="detail-body">
              <div className="detail-info-grid">
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('vet.prescriptions.statusLabel')}</div>
                  <div className="detail-info-value">
                    {statusLabel(resolvePrescriptionStatus(detail, todayStr))}
                  </div>
                </div>

                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('vet.prescriptions.dosage')}</div>
                  <div className="detail-info-value">{detail.dosage}</div>
                </div>

                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('vet.prescriptions.duration')}</div>
                  <div className="detail-info-value">{detail.duration}</div>
                </div>

                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('vet.prescriptions.issuedAt')}</div>
                  <div className="detail-info-value">
                    {formatDate(detail.issuedAt, i18n.language)}
                  </div>
                </div>

                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('vet.prescriptions.expiresAt')}</div>
                  <div className="detail-info-value">
                    {detail.expiresAt
                      ? formatDate(detail.expiresAt, i18n.language)
                      : t('vet.prescriptions.noExpiry')}
                  </div>
                </div>

                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('vet.prescriptions.linkedMedication')}</div>
                  <div className="detail-info-value">
                    {detail.medicationId ? t('field.yes') : t('field.no')}
                  </div>
                </div>
              </div>

              {detail.instructions && (
                <div className="rx-detail-block">
                  <div className="rx-detail-label">{t('vet.prescriptions.instructions')}</div>
                  <div className="rx-detail-text">{detail.instructions}</div>
                </div>
              )}

              {detail.notes && (
                <div className="rx-detail-block">
                  <div className="rx-detail-label">{t('vet.prescriptions.notes')}</div>
                  <div className="rx-detail-text">{detail.notes}</div>
                </div>
              )}

              {detail.attachmentUrl && (
                <div className="rx-detail-block">
                  <div className="rx-detail-label">{t('vet.prescriptions.attachedFile')}</div>

                  {detail.attachmentUrl.startsWith('data:image/') ? (
                    <img
                      src={detail.attachmentUrl}
                      alt={detail.attachmentName ?? detail.medicationName}
                      className="rx-preview-image"
                    />
                  ) : null}

                  <a
                    href={detail.attachmentUrl}
                    download={detail.attachmentName ?? `${petId}-prescription`}
                    className="btn btn-secondary btn-sm rx-download-link"
                  >
                    {t('vet.prescriptions.download')}
                  </a>
                </div>
              )}

              {confirmDeleteId === detail.id && (
                <div className="rx-delete-confirm">
                  <div className="rx-delete-question">
                    {t('vet.prescriptions.deleteQuestion')}
                  </div>

                  <div className="confirm-delete">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        onDelete(detail.id);
                        setConfirmDeleteId(null);
                        setDetail(null);
                      }}
                    >
                      {t('btn.confirm')}
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      {t('btn.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="detail-footer">
              <button type="button" className="btn btn-secondary" onClick={() => openEdit(detail)}>
                {t('btn.edit')}
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => onToggleUsed(detail.id, detail.status !== 'used')}
              >
                {detail.status === 'used'
                  ? t('vet.prescriptions.markActive')
                  : t('vet.prescriptions.markUsed')}
              </button>

              <button
                type="button"
                className="btn btn-warn"
                onClick={() => setConfirmDeleteId(detail.id)}
              >
                {t('btn.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}