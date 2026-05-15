// src/pages/vet/TabPrescriptions.tsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DigitalPrescription, DigitalPrescriptionStatus } from '../../context/VetPrescriptionsContext'
import { computePrescriptionStatus } from '../../context/VetContext';

export type { DigitalPrescriptionStatus }

export interface MedicationOption {
  id:        string;
  name:      string;
  dosage:    string;
  frequency: string;
  petId:     string;
  endDate:   string | null;
}

const STATUS_STYLE: Record<DigitalPrescriptionStatus, { color: string; bg: string; emoji: string }> = {
  active:   { color: 'var(--success)',    bg: 'var(--success-hl)',     emoji: '✅' },
  expiring: { color: 'var(--warn)',       bg: 'var(--warn-hl)',        emoji: '⏳' },
  expired:  { color: 'var(--err)',        bg: 'var(--err-hl)',         emoji: '❌' },
  used:     { color: 'var(--text-muted)', bg: 'var(--surface-offset)', emoji: '✔️' },
};

interface TabPrescriptionsProps {
  petId: string;
  petName: string;
  prescriptions: DigitalPrescription[];
  medications: MedicationOption[];
  onAdd: (data: Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>) => void;
  onUpdate: (id: string, data: Partial<Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  onToggleUsed: (id: string, used: boolean) => void;
}

export default function TabPrescriptions({
  petId, petName, prescriptions, medications,
  onAdd, onUpdate, onDelete, onToggleUsed,
}: TabPrescriptionsProps) {
  const { t } = useTranslation();

  const [showModal,     setShowModal]     = useState(false);
  const [editing,       setEditing]       = useState<DigitalPrescription | null>(null);
  const [detailItem,    setDetailItem]    = useState<DigitalPrescription | null>(null);
  const [filterStatus,  setFilterStatus]  = useState<DigitalPrescriptionStatus | 'all'>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const ORDER: Record<DigitalPrescriptionStatus, number> = { active: 0, expiring: 1, expired: 2, used: 3 };

  const sorted = useMemo(() =>
    prescriptions
      .filter((p) => p.petId === petId)
      .map((p) => ({ ...p, status: computePrescriptionStatus(p) }))
      .filter((p) => filterStatus === 'all' || p.status === filterStatus)
      .sort((a, b) => ORDER[a.status] - ORDER[b.status] || b.issuedAt.localeCompare(a.issuedAt)),
    [prescriptions, petId, filterStatus]
  );

  const counts = useMemo(() => {
    const all = prescriptions
      .filter((p) => p.petId === petId)
      .map((p) => computePrescriptionStatus(p));
    return {
      all:      all.length,
      active:   all.filter((s) => s === 'active').length,
      expiring: all.filter((s) => s === 'expiring').length,
      expired:  all.filter((s) => s === 'expired').length,
      used:     all.filter((s) => s === 'used').length,
    };
  }, [prescriptions, petId]);

  function handleEdit(p: DigitalPrescription) {
    setEditing(p);
    setDetailItem(null);
    setShowModal(true);
  }

  function handleDeleteConfirmed(id: string) {
    onDelete(id);
    setDetailItem(null);
    setConfirmDelete(null);
  }

  const petMeds = medications.filter((m) => m.petId === petId);

  const filters: [DigitalPrescriptionStatus | 'all', string][] = [
    ['all',      t('vet.prescriptions.filterAll',      { count: counts.all })],
    ['active',   t('vet.prescriptions.filterActive',   { count: counts.active })],
    ['expiring', t('vet.prescriptions.filterExpiring', { count: counts.expiring })],
    ['expired',  t('vet.prescriptions.filterExpired',  { count: counts.expired })],
    ['used',     t('vet.prescriptions.filterUsed',     { count: counts.used })],
  ];

  return (
    <div className="tab-content">
      {counts.expiring > 0 && (
        <div className="rx-alert-banner">
          <span>⏳</span>
          <div>
            <div className="rx-alert-title">
              {t('vet.prescriptions.alertTitle', { count: counts.expiring })}{' '}
              {t('vet.prescriptions.alertDays')}
            </div>
            <div className="rx-alert-sub">{t('vet.prescriptions.alertSub')}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '.5rem' }}>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}>
          {t('vet.prescriptions.newBtn')}
        </button>
      </div>

      {counts.all > 0 && (
        <div className="rx-filter-bar">
          {filters.map(([val, label]) => (
            <button
              key={val} type="button"
              className={`rx-filter-btn${filterStatus === val ? ' active' : ''}`}
              onClick={() => setFilterStatus(val)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {counts.all === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>{t('vet.prescriptions.emptyTitle')}</h3>
          <p>{t('vet.prescriptions.emptyHint', { name: petName })}</p>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}>
            {t('vet.prescriptions.emptyBtn')}
          </button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty-state" style={{ paddingBlock: '1.5rem' }}>
          <div className="empty-state-icon">🔍</div>
          <h3>{t('vet.prescriptions.emptyFilterTitle')}</h3>
        </div>
      ) : (
        <div className="card-list">
          {sorted.map((p) => {
            const sc = STATUS_STYLE[p.status];
            const statusLabel = t(`vet.prescriptions.status.${p.status}`);
            const linked = medications.find((m) => m.id === p.medicationId);
            const daysLeft = p.expiresAt
              ? Math.ceil((new Date(p.expiresAt + 'T12:00:00').getTime() - Date.now()) / 86400000)
              : null;
            const daysLeftLabel = daysLeft === null ? null
              : daysLeft < 0   ? t('vet.prescriptions.expiredAgo',  { days: Math.abs(daysLeft) })
              : daysLeft === 0  ? t('vet.prescriptions.expiresToday')
              :                   t('vet.prescriptions.daysLeft',    { days: daysLeft });

            return (
              <div
                key={p.id} className="rx-card"
                onClick={() => setDetailItem(p)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setDetailItem(p)}
              >
                <span className="rx-status-badge" style={{ color: sc.color, background: sc.bg }}>
                  {sc.emoji} {statusLabel}
                </span>
                <div className="rx-card-header">
                  <div className="rx-card-icon">💊</div>
                  <div className="rx-card-main">
                    <div className="rx-card-name">{p.medicationName}</div>
                    <div className="rx-card-dosage">{p.dosage}{p.frequency ? ` · ${p.frequency}` : ''}</div>
                  </div>
                </div>
                <div className="rx-card-meta">
                  <span>🩺 {p.prescribedBy}</span>
                  <span>📅 {new Date(p.issuedAt + 'T12:00:00').toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  {daysLeftLabel && <span style={{ color: sc.color }}>{daysLeftLabel}</span>}
                </div>
                {linked && (
                  <div className="rx-linked-med">
                    🔗 {t('vet.prescriptions.linkedTo')} <strong>{linked.name}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <PrescriptionModal
          initial={editing} petId={petId} medications={petMeds}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) { onUpdate(editing.id, data); }
            else         { onAdd(data); }
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}

      {detailItem && (
        <PrescriptionDetailOverlay
          prescription={{ ...detailItem, status: computePrescriptionStatus(detailItem) }}
          linkedMed={medications.find((m) => m.id === detailItem.medicationId) ?? null}
          onClose={() => { setDetailItem(null); setConfirmDelete(null); }}
          onEdit={() => handleEdit(detailItem)}
          onMarkUsed={() => { onToggleUsed(detailItem.id, true); setDetailItem(null); }}
          onMarkActive={() => { onToggleUsed(detailItem.id, false); setDetailItem(null); }}
          onRequestDelete={() => setConfirmDelete(detailItem.id)}
          confirmDeleteId={confirmDelete}
          onConfirmDelete={handleDeleteConfirmed}
          onCancelDelete={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ─── Modal: Adicionar / Editar receita ────────────────────────────────────────

type PrescriptionFormData = Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>;

const RX_FORM_ID = 'rx-prescription-form';

function PrescriptionModal({
  initial, petId: _petId, medications, onClose, onSave,
}: {
  initial: DigitalPrescription | null;
  petId: string;
  medications: MedicationOption[];
  onClose: () => void;
  onSave: (data: PrescriptionFormData) => void;
}) {
  const { t } = useTranslation();

  const [medicationId,   setMedicationId]   = useState<string | null>(initial?.medicationId ?? null);
  const [medicationName, setMedicationName] = useState(initial?.medicationName ?? '');
  const [dosage,         setDosage]         = useState(initial?.dosage ?? '');
  const [frequency,      setFrequency]      = useState(initial?.frequency ?? '');
  const [duration,       setDuration]       = useState(initial?.duration ?? '');
  const [prescribedBy,   setPrescribedBy]   = useState(initial?.prescribedBy ?? '');
  const [issuedAt,       setIssuedAt]       = useState(initial?.issuedAt ?? new Date().toISOString().split('T')[0]);
  const [expiresAt,      setExpiresAt]      = useState(initial?.expiresAt ?? '');
  const [instructions,   setInstructions]   = useState(initial?.instructions ?? '');
  const [notes,          setNotes]          = useState(initial?.notes ?? '');
  const [errName,        setErrName]        = useState('');
  const [errDosage,      setErrDosage]      = useState('');
  const [errPrescribed,  setErrPrescribed]  = useState('');

  function handleMedSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (!val) { setMedicationId(null); return; }
    const med = medications.find((m) => m.id === val);
    if (med) {
      setMedicationId(med.id);
      setMedicationName(med.name);
      setDosage(med.dosage ?? '');
      setFrequency(med.frequency ?? '');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!medicationName.trim()) { setErrName(t('vet.prescriptions.fieldMedRequired'));       valid = false; }
    if (!dosage.trim())         { setErrDosage(t('vet.prescriptions.fieldDoseRequired'));    valid = false; }
    if (!prescribedBy.trim())   { setErrPrescribed(t('vet.prescriptions.fieldVetRequired')); valid = false; }
    if (!valid) return;
    onSave({
      medicationId, medicationName: medicationName.trim(),
      dosage: dosage.trim(), frequency: frequency.trim(),
      duration: duration.trim(), prescribedBy: prescribedBy.trim(),
      issuedAt, expiresAt: expiresAt || null,
      instructions: instructions.trim() || null,
      notes: notes.trim() || null,
      status: 'active', attachmentUrl: null, attachmentName: null,
    });
  }

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <span style={{ fontSize: '1.25rem' }}>💊</span>
          <span className="modal-title">
            {initial ? t('vet.prescriptions.modalEdit') : t('vet.prescriptions.modalAdd')}
          </span>
          <button className="modal-close" onClick={onClose} aria-label={t('btn.close')}>✕</button>
        </div>

        <form id={RX_FORM_ID} className="modal-body" onSubmit={handleSubmit} noValidate>
          {medications.length > 0 && (
            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.fieldImport')}</label>
              <select className="form-input" value={medicationId ?? ''} onChange={handleMedSelect}>
                <option value="">{t('vet.prescriptions.fieldImportNone')}</option>
                {medications.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{t('vet.prescriptions.fieldMed')} *</label>
            <input
              className={`form-input${errName ? ' input-error' : ''}`}
              value={medicationName}
              onChange={(e) => { setMedicationName(e.target.value); setErrName(''); }}
              placeholder={t('vet.prescriptions.fieldMedPh')}
            />
            {errName && <div className="form-error">{errName}</div>}
          </div>

          <div className="mf-row">
            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.fieldDose')} *</label>
              <input
                className={`form-input${errDosage ? ' input-error' : ''}`}
                value={dosage}
                onChange={(e) => { setDosage(e.target.value); setErrDosage(''); }}
                placeholder={t('vet.prescriptions.fieldDosePh')}
              />
              {errDosage && <div className="form-error">{errDosage}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.fieldFreq')}</label>
              <input
                className="form-input" value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder={t('vet.prescriptions.fieldFreqPh')}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('vet.prescriptions.fieldDuration')}</label>
            <input className="form-input" value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder={t('vet.prescriptions.fieldDurationPh')} />
          </div>

          <div className="form-group">
            <label className="form-label">{t('vet.prescriptions.fieldVet')} *</label>
            <input
              className={`form-input${errPrescribed ? ' input-error' : ''}`}
              value={prescribedBy}
              onChange={(e) => { setPrescribedBy(e.target.value); setErrPrescribed(''); }}
              placeholder={t('vet.prescriptions.fieldVetPh')}
            />
            {errPrescribed && <div className="form-error">{errPrescribed}</div>}
          </div>

          <div className="mf-row">
            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.fieldIssueDate')}</label>
              <input type="date" className="form-input" value={issuedAt}
                onChange={(e) => setIssuedAt(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('vet.prescriptions.fieldExpiry')}</label>
              <input type="date" className="form-input" value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('vet.prescriptions.fieldInstructions')}</label>
            <textarea className="form-input" rows={2} value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t('vet.prescriptions.fieldInstructionsPh')} />
          </div>

          <div className="form-group">
            <label className="form-label">{t('vet.prescriptions.fieldNotes')}</label>
            <textarea className="form-input" rows={2} value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('vet.prescriptions.fieldNotesPh')} />
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('btn.cancel')}
          </button>
          <button type="submit" form={RX_FORM_ID} className="btn btn-primary">
            {initial ? t('btn.save') : t('btn.register')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Overlay de detalhe ────────────────────────────────────────────────────────

function PrescriptionDetailOverlay({
  prescription, linkedMed, onClose, onEdit,
  onMarkUsed, onMarkActive, onRequestDelete,
  confirmDeleteId, onConfirmDelete, onCancelDelete,
}: {
  prescription: DigitalPrescription;
  linkedMed: MedicationOption | null;
  onClose: () => void;
  onEdit: () => void;
  onMarkUsed: () => void;
  onMarkActive: () => void;
  onRequestDelete: () => void;
  confirmDeleteId: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}) {
  const { t } = useTranslation();
  const p  = prescription;
  const sc = STATUS_STYLE[p.status];
  const statusLabel = t(`vet.prescriptions.status.${p.status}`);

  const daysLeft = p.expiresAt
    ? Math.ceil((new Date(p.expiresAt + 'T12:00:00').getTime() - Date.now()) / 86400000)
    : null;

  const daysLeftLabel = daysLeft === null ? null
    : daysLeft < 0   ? t('vet.prescriptions.expiredAgo',  { days: Math.abs(daysLeft) })
    : daysLeft === 0  ? t('vet.prescriptions.expiresToday')
    :                   t('vet.prescriptions.daysLeft',    { days: daysLeft });

  const fmt = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-sheet">
        <div className="detail-header">
          <div className="detail-icon" style={{ background: 'var(--primary-hl)' }}>💊</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.medicationName}
            </div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>
              {p.dosage}{p.frequency ? ` · ${p.frequency}` : ''}
            </div>
          </div>
          <button className="detail-close" onClick={onClose} aria-label={t('btn.close')}>✕</button>
        </div>

        <div className="detail-body">
          <div style={{ marginBottom: '1rem' }}>
            <span className="rx-status-badge" style={{ color: sc.color, background: sc.bg, fontSize: '.875rem', padding: '.3rem .75rem' }}>
              {sc.emoji} {statusLabel}
            </span>
          </div>

          <div className="detail-grid">
            <div className="detail-row">
              <span className="detail-label">{t('vet.prescriptions.detailDose')}</span>
              <span>{p.dosage}</span>
            </div>
            {p.frequency && (
              <div className="detail-row">
                <span className="detail-label">{t('vet.prescriptions.detailFreq')}</span>
                <span>{p.frequency}</span>
              </div>
            )}
            {p.duration && (
              <div className="detail-row">
                <span className="detail-label">{t('vet.prescriptions.detailDuration')}</span>
                <span>{p.duration}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">{t('vet.prescriptions.detailVet')}</span>
              <span>{p.prescribedBy}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('vet.prescriptions.detailIssued')}</span>
              <span>{fmt(p.issuedAt)}</span>
            </div>
            {p.expiresAt && (
              <div className="detail-row">
                <span className="detail-label">{t('vet.prescriptions.detailExpiry')}</span>
                <span style={{ color: sc.color }}>
                  {fmt(p.expiresAt)}
                  {daysLeftLabel && <span style={{ marginLeft: '.5rem', fontSize: '.8rem' }}>({daysLeftLabel})</span>}
                </span>
              </div>
            )}
            {linkedMed && (
              <div className="detail-row">
                <span className="detail-label">{t('vet.prescriptions.detailLinkedMed')}</span>
                <span>🔗 {linkedMed.name}</span>
              </div>
            )}
            {p.instructions && (
              <div className="detail-row">
                <span className="detail-label">{t('vet.prescriptions.detailInstructions')}</span>
                <span>{p.instructions}</span>
              </div>
            )}
            {p.notes && (
              <div className="detail-row">
                <span className="detail-label">{t('vet.prescriptions.detailNotes')}</span>
                <span>{p.notes}</span>
              </div>
            )}
          </div>

          {confirmDeleteId === p.id && (
            <div className="confirm-delete-bar">
              <span>{t('vet.prescriptions.confirmDeleteTitle')}</span>
              <button className="btn btn-danger btn-sm" onClick={() => onConfirmDelete(p.id)}>
                {t('btn.delete')}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={onCancelDelete}>
                {t('btn.cancel')}
              </button>
            </div>
          )}
        </div>

        <div className="detail-footer">
          {confirmDeleteId !== p.id ? (
            <>
              {p.status !== 'used' && (
                <button className="btn btn-success btn-sm" onClick={onMarkUsed}>
                  {t('vet.prescriptions.markUsed')}
                </button>
              )}
              {p.status === 'used' && (
                <button className="btn btn-secondary btn-sm" onClick={onMarkActive}>
                  {t('vet.prescriptions.reactivate')}
                </button>
              )}
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onEdit}>
                ✏️ {t('btn.edit')}
              </button>
              <button className="btn btn-warn btn-sm" onClick={onRequestDelete}>
                🗑 {t('btn.delete')}
              </button>
            </>
          ) : (
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onClose}>
              {t('btn.close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
