// src/pages/vet/TabDocuments.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { VetDocument, PetMedicalProfile, VetAppointment } from '../../context/VetContext';
import type { VaccineRecord } from '../../context/PetsContext';
import type { MedRecord } from '../../components/EditMedModal';
import type { Pet } from '../../context/PetsContext';
import { CONDITIONS_CATALOG, type ConditionItem } from '../../context/conditionsCatalog';

// ─── DocType local (fonte única — não vem do VetContext) ───────────────────────

export type DocType = 'passport' | 'certificate' | 'report' | 'other';

// ─── Tipos de documento ────────────────────────────────────────────────────────

const DOC_TYPE_VALUES: { value: DocType; emoji: string }[] = [
  { value: 'passport',    emoji: '📗' },
  { value: 'certificate', emoji: '📜' },
  { value: 'report',      emoji: '📋' },
  { value: 'other',       emoji: '📁' },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface TabDocumentsProps {
  pet: Pet;
  documents: VetDocument[];
  vaccines: VaccineRecord[];
  medications: MedRecord[];
  appointments: VetAppointment[];
  profile: PetMedicalProfile;
  onAdd: (doc: Omit<VetDocument, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, doc: Partial<VetDocument>) => void;
  onDelete: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'err') => void;
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function TabDocuments({
  pet, documents, vaccines, medications, appointments,
  profile, onAdd, onUpdate, onDelete,
}: TabDocumentsProps) {
  const { t } = useTranslation();
  const [showModal,    setShowModal]    = useState(false);
  const [editing,      setEditing]      = useState<VetDocument | null>(null);
  const [showPassport, setShowPassport] = useState(false);

  const docTypes = DOC_TYPE_VALUES.map((dt) => ({
    ...dt,
    label: t(`vet.documents.docTypes.${dt.value}`),
  }));

  const petDocs = documents
    .filter((d) => d.petId === pet.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="tab-content">
      {/* Hero do Passaporte Digital */}
      <div
        className="passport-hero-card"
        onClick={() => setShowPassport(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowPassport(true)}
      >
        <div className="passport-hero-icon">📗</div>
        <div className="passport-hero-body">
          <div className="passport-hero-title">{t('vet.documents.heroTitle')} {pet.name}</div>
          <div className="passport-hero-sub">{t('vet.documents.heroSub')}</div>
        </div>
        <div className="passport-hero-arrow">›</div>
      </div>

      <div className="docs-section-title">{t('vet.documents.sectionOther')}</div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          className="btn btn-primary"
          onClick={() => { setEditing(null); setShowModal(true); }}
        >
          {t('vet.documents.newBtn')}
        </button>
      </div>

      {petDocs.length === 0 ? (
        <div className="empty-state" style={{ paddingBlock: '2rem' }}>
          <div className="empty-state-icon">📁</div>
          <h3>{t('vet.documents.empty')}</h3>
          <p>{t('vet.documents.emptyHint')}</p>
        </div>
      ) : (
        <div className="card-list">
          {petDocs.map((doc) => {
            const typeInfo = docTypes.find((d) => d.value === doc.type);
            const daysToExpiry = doc.expiryDate
              ? Math.ceil(
                  (new Date(doc.expiryDate + 'T12:00:00').getTime() - Date.now()) / 86400000
                )
              : null;
            const isExpired  = daysToExpiry !== null && daysToExpiry < 0;
            const isExpiring = daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 30;

            return (
              <div key={doc.id} className="doc-card">
                <div className="doc-card-icon" data-type={doc.type}>{typeInfo?.emoji}</div>
                <div className="doc-card-body">
                  <div className="doc-card-title">{doc.title}</div>
                  <div className="doc-card-meta">
                    {typeInfo?.label}
                    {doc.issuedBy && <span> · {doc.issuedBy}</span>}
                  </div>
                  {doc.expiryDate && (
                    <div className={`doc-card-expiry${isExpired ? ' expired' : isExpiring ? ' expiring' : ''}`}>
                      {isExpired
                        ? `⚠️ ${t('vet.documents.expired')} · `
                        : isExpiring
                        ? `⏳ ${t('vet.documents.expiring')} · `
                        : ''}
                      {new Date(doc.expiryDate + 'T12:00:00').toLocaleDateString(undefined, {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </div>
                  )}
                </div>
                <div className="doc-card-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setEditing(doc); setShowModal(true); }}
                    aria-label={t('btn.edit')}
                  >✏️</button>
                  <button
                    className="btn btn-ghost btn-sm danger"
                    onClick={() => onDelete(doc.id)}
                    aria-label={t('btn.delete')}
                  >🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <DocModal
          initial={editing}
          petId={pet.id}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) { onUpdate(editing.id, data); }
            else         { onAdd(data); }
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}

      {showPassport && (
        <PassportOverlay
          pet={pet}
          profile={profile}
          vaccines={vaccines}
          medications={medications}
          appointments={appointments.filter((a) => a.petId === pet.id)}
          onClose={() => setShowPassport(false)}
        />
      )}
    </div>
  );
}

// ─── Modal: Adicionar / Editar documento ──────────────────────────────────────

function DocModal({
  initial, petId, onClose, onSave,
}: {
  initial: VetDocument | null;
  petId: string;
  onClose: () => void;
  onSave: (data: Omit<VetDocument, 'id' | 'createdAt'>) => void;
}) {
  const { t } = useTranslation();

  const docTypes = DOC_TYPE_VALUES.map((dt) => ({
    ...dt,
    label: t(`vet.documents.docTypes.${dt.value}`),
  }));

  const [type,       setType]       = useState<DocType>(
    (initial?.type as DocType) ?? 'certificate'
  );
  const [title,      setTitle]      = useState(initial?.title ?? '');
  const [issueDate,  setIssueDate]  = useState(initial?.issueDate ?? '');
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? '');
  const [issuedBy,   setIssuedBy]   = useState(initial?.issuedBy ?? '');
  const [notes,      setNotes]      = useState(initial?.notes ?? '');
  const [errTitle,   setErrTitle]   = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) { setErrTitle(t('vet.documents.fieldTitleRequired')); return; }
    onSave({
      petId,
      type,
      title:      title.trim(),
      name:       title.trim(),
      issueDate:  issueDate  || null,
      expiryDate: expiryDate || null,
      issuedBy:   issuedBy.trim() || null,
      notes:      notes.trim()    || null,
      fileUrl:    null,
      fileName:   null,
    });
  }

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">
            {initial ? t('vet.documents.modalEdit') : t('vet.documents.modalAdd')}
          </span>
          <button className="btn btn-ghost" onClick={onClose} aria-label={t('btn.close')}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field-group" style={{ marginBottom: '1rem' }}>
            <label className="field-label">{t('vet.documents.fieldType')}</label>
            <div className="doc-type-grid">
              {docTypes.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  className={`exam-type-btn${type === dt.value ? ' active' : ''}`}
                  onClick={() => setType(dt.value)}
                >
                  <span>{dt.emoji}</span>
                  <span>{dt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">{t('vet.documents.fieldTitle')} *</label>
            <input
              type="text"
              className={`field-input${errTitle ? ' field-error' : ''}`}
              placeholder={t('vet.documents.fieldTitlePh')}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrTitle(''); }}
            />
            {errTitle && <span className="field-error-msg">{errTitle}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">{t('vet.documents.fieldIssuedBy')}</label>
            <input
              type="text"
              className="field-input"
              placeholder={t('vet.documents.fieldIssuedByPh')}
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="field-group">
              <label className="field-label">{t('vet.documents.fieldIssueDate')}</label>
              <input
                type="date"
                className="field-input"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label">{t('vet.documents.fieldExpiry')}</label>
              <input
                type="date"
                className="field-input"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">{t('vet.documents.fieldNotes')}</label>
            <textarea
              className="field-input"
              style={{ minHeight: 72, resize: 'vertical' }}
              placeholder={t('vet.documents.fieldNotesPh')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('btn.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {initial ? t('btn.save') : t('btn.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Passaporte Digital ────────────────────────────────────────────────────────

const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🐦', rabbit: '🐰',
  reptile: '🦎', fish: '🐠', other: '🐾',
};

function PassportOverlay({
  pet, profile, vaccines, medications, appointments, onClose,
}: {
  pet: Pet;                        // ← era ApiPet
  profile: PetMedicalProfile;
  vaccines: VaccineRecord[];       // ← era ApiVaccine[]
  medications: MedRecord[];        // ← era ApiMedication[]
  appointments: VetAppointment[];
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();

  const activeVaccines = vaccines.filter((v) =>
    !v.nextDate || new Date(v.nextDate + 'T12:00:00') >= new Date()
  );

  const activeMeds = medications.filter((m) =>
    !m.endDate || new Date(m.endDate + 'T12:00:00') >= new Date()
  );

  const lastAppt = [...appointments].sort(
    (a, b) => b.date.localeCompare(a.date)
  )[0] ?? null;

  const age = pet.birthDate
    ? Math.floor((Date.now() - new Date(pet.birthDate + 'T12:00:00').getTime()) / 31557600000)
    : null;

  const today = new Date().toLocaleDateString(i18n.language, {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const allergiesText = profile.allergies?.trim() ?? '';

  const allConditions: string[] = [
    ...(profile.chronicConditionIds ?? []).map((id: string) => {
      const found = CONDITIONS_CATALOG.find((item: ConditionItem) => item.id === id);
      return found ? t(found.labelKey) : id;
    }),
    ...(profile.customConditions ?? []),
  ];

  function handleExport() {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(
      generatePassportHTML({
        pet, profile, allergiesText, allConditions,
        vaccines: activeVaccines,
        medications: activeMeds,
        appointments,
        lastAppt,
        today,
        labels: {
          identity:    t('vet.documents.passport.identity'),
          species:     t('vet.documents.passport.species'),
          breed:       t('vet.documents.passport.breed'),
          birthDate:   t('vet.documents.passport.birthDate'),
          bloodType:   t('vet.documents.passport.bloodType'),
          neutered:    t('vet.documents.passport.neutered'),
          neuteredYes: t('vet.documents.passport.neuteredYes'),
          neuteredNo:  t('vet.documents.passport.neuteredNo'),
          sex:         t('vet.documents.passport.sex'),
          health:      t('vet.documents.passport.health'),
          allergies:   t('vet.documents.passport.allergies'),
          conditions:  t('vet.documents.passport.conditions'),
          vaccines:    t('vet.documents.passport.vaccines'),
          vaccinesActive: t('vet.documents.passport.vaccinesActive'),
          noVaccines:  t('vet.documents.passport.noVaccines'),
          medications: t('vet.documents.passport.medications'),
          medicationsActive: t('vet.documents.passport.medicationsActive'),
          noMeds:      t('vet.documents.passport.noMeds'),
          lastAppt:    t('vet.documents.passport.lastAppt'),
          apptDate:    t('vet.documents.passport.apptDate'),
          apptVet:     t('vet.documents.passport.apptVet'),
          apptDiagnosis: t('vet.documents.passport.apptDiagnosis'),
          apptWeight:  t('vet.documents.passport.apptWeight'),
          generatedOn: t('vet.documents.passport.generatedOn'),
        },
      })
    );
    win.document.close();
    setTimeout(() => win.print(), 500);
  }

  return (
    <div className="detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-sheet" style={{ maxWidth: 520 }}>
        <div className="passport-sheet-header">
          <div className="passport-sheet-cover">
            <div className="passport-cover-emoji">{SPECIES_EMOJI[pet.species] ?? '🐾'}</div>
            <div>
              <div className="passport-cover-name">{pet.name}</div>
              <div className="passport-cover-sub">
                {pet.breed ?? pet.species}
                {age !== null ? ` · ${age} ${t('vet.documents.passport.years')}` : ''}
              </div>
            </div>
          </div>
          <button className="detail-close" onClick={onClose} aria-label={t('btn.close')}>✕</button>
        </div>

        <div className="detail-body">
          <div className="passport-section">
            <div className="passport-section-title">
              <span>🪪</span> {t('vet.documents.passport.identity')}
            </div>
            <div className="detail-info-grid">
              <InfoChip label={t('vet.documents.passport.species')}  value={pet.species} />
              {pet.breed     && <InfoChip label={t('vet.documents.passport.breed')}    value={pet.breed} />}
              {pet.birthDate && (
                <InfoChip
                  label={t('vet.documents.passport.birthDate')}
                  value={new Date(pet.birthDate + 'T12:00:00').toLocaleDateString()}
                />
              )}
              {profile.bloodType && (
                <InfoChip label={t('vet.documents.passport.bloodType')} value={profile.bloodType} />
              )}
              <InfoChip
                label={t('vet.documents.passport.neutered')}
                value={
                  profile.neutered === true  ? t('vet.documents.passport.neuteredYes') :
                  profile.neutered === false ? t('vet.documents.passport.neuteredNo') : '—'
                }
              />
              {profile.sex && <InfoChip label={t('vet.documents.passport.sex')} value={profile.sex} />}
            </div>
          </div>

          {(allergiesText || allConditions.length > 0) && (
            <div className="passport-section">
              <div className="passport-section-title">
                <span>💊</span> {t('vet.documents.passport.health')}
              </div>
              {allergiesText && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div className="passport-field-label">{t('vet.documents.passport.allergies')}</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{allergiesText}</p>
                </div>
              )}
              {allConditions.length > 0 && (
                <div>
                  <div className="passport-field-label">{t('vet.documents.passport.conditions')}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {allConditions.map((c, i) => (
                      <span key={i} className="profile-tag"
                        style={{ background: 'var(--warn-hl)', color: 'var(--warn)' }}
                      >{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="passport-section">
            <div className="passport-section-title">
              <span>💉</span> {t('vet.documents.passport.vaccines')} ({activeVaccines.length} {t('vet.documents.passport.vaccinesActive')})
            </div>
            {activeVaccines.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {t('vet.documents.passport.noVaccines')}
              </p>
            ) : (
              <div className="passport-list">
                {activeVaccines.map((v, i) => (
                  <div key={i} className="passport-list-item">
                    <span className="passport-list-name">{v.name}</span>
                    <span className="passport-list-meta">
                      {v.applied}
                      {v.nextDate && (
                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-faint)' }}>
                          → {v.nextDate}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="passport-section">
            <div className="passport-section-title">
              <span>🧴</span> {t('vet.documents.passport.medications')} ({activeMeds.length} {t('vet.documents.passport.medicationsActive')})
            </div>
            {activeMeds.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {t('vet.documents.passport.noMeds')}
              </p>
            ) : (
              <div className="passport-list">
                {activeMeds.map((m) => (
                  <div key={m.id} className="passport-list-item">
                    <span className="passport-list-name">{m.title}</span>
                    <span className="passport-list-meta">{m.dose} · {m.frequency}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {lastAppt && (
            <div className="passport-section">
              <div className="passport-section-title">
                <span>🏥</span> {t('vet.documents.passport.lastAppt')}
              </div>
              <div className="detail-info-grid">
                <InfoChip
                  label={t('vet.documents.passport.apptDate')}
                  value={new Date(lastAppt.date + 'T12:00:00').toLocaleDateString()}
                />
                <InfoChip label={t('vet.documents.passport.apptVet')} value={lastAppt.vetName} />
                {lastAppt.diagnosis && (
                  <InfoChip label={t('vet.documents.passport.apptDiagnosis')} value={lastAppt.diagnosis} />
                )}
                {lastAppt.weightKg != null && (
                  <InfoChip label={t('vet.documents.passport.apptWeight')} value={`${lastAppt.weightKg} kg`} />
                )}
              </div>
            </div>
          )}

          <div className="passport-footer-note">
            {t('vet.documents.passport.generatedOn')} {today} · PITUTI Pet Care
          </div>
        </div>

        <div className="detail-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('btn.close')}</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleExport}>
            📄 {t('vet.documents.passport.exportBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helper: chip de detalhe ───────────────────────────────────────────────────

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-info-chip">
      <div className="detail-info-label">{label}</div>
      <div className="detail-info-value">{value}</div>
    </div>
  );
}

// ─── HTML para exportação PDF ──────────────────────────────────────────────────

interface PassportLabels {
  identity: string; species: string; breed: string; birthDate: string;
  bloodType: string; neutered: string; neuteredYes: string; neuteredNo: string;
  sex: string; health: string; allergies: string; conditions: string;
  vaccines: string; vaccinesActive: string; noVaccines: string;
  medications: string; medicationsActive: string; noMeds: string;
  lastAppt: string; apptDate: string; apptVet: string;
  apptDiagnosis: string; apptWeight: string; generatedOn: string;
}

function generatePassportHTML({
  pet, profile, allergiesText, allConditions,
  vaccines, medications, lastAppt, today, labels,
}: {
  pet: Pet;                         // ← era ApiPet
  profile: PetMedicalProfile;
  allergiesText: string;
  allConditions: string[];
  vaccines: VaccineRecord[];        // ← era ApiVaccine[]
  medications: MedRecord[];         // ← era ApiMedication[]
  appointments: VetAppointment[];
  lastAppt: VetAppointment | null;
  today: string;
  labels: PassportLabels;
}): string {
  const chip = (label: string, value: string) =>
    `<div class="chip"><div class="chip-label">${label}</div><div class="chip-value">${value}</div></div>`;

  const listItem = (name: string, meta: string) =>
    `<div class="list-item"><span class="list-name">${name}</span><span class="list-meta">${meta}</span></div>`;

  const neuteredLabel =
    profile.neutered === true  ? labels.neuteredYes :
    profile.neutered === false ? labels.neuteredNo  : '—';

  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="UTF-8"><title>Passaporte — ${pet.name}</title>
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700,800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Satoshi',sans-serif;color:#1a1714;background:#fff;padding:2rem;max-width:700px;margin:auto}
h1{font-size:2rem;font-weight:800;margin-bottom:.25rem}
.sub{color:#6b6a66;margin-bottom:2rem}
.section{margin-bottom:1.75rem}
.section-title{font-weight:800;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#9b9994;margin-bottom:.75rem;padding-bottom:.375rem;border-bottom:1.5px solid #e8e5e0}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:.625rem}
.chip{background:#f5f3ef;padding:.625rem .875rem;border-radius:.625rem}
.chip-label{font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#9b9994}
.chip-value{font-size:.9rem;font-weight:700;color:#1a1714;margin-top:.125rem}
.list-item{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid #f0ede8}
.list-item:last-child{border-bottom:none}
.list-name{font-weight:700;font-size:.9rem}
.list-meta{font-size:.8125rem;color:#6b6a66}
.tag{display:inline-block;background:#fce4ec;color:#b5174e;padding:.25rem .625rem;border-radius:99px;font-size:.75rem;font-weight:700;margin:.2rem}
.footer{margin-top:2.5rem;padding-top:1rem;border-top:1.5px solid #e8e5e0;color:#9b9994;font-size:.75rem;text-align:center}
@media print{body{padding:1.25rem}}
</style></head><body>
<h1>${pet.name}</h1>
<p class="sub">${pet.breed ?? pet.species}</p>

<div class="section">
  <div class="section-title">${labels.identity}</div>
  <div class="grid">
    ${chip(labels.species, pet.species)}
    ${pet.breed     ? chip(labels.breed, pet.breed) : ''}
    ${pet.birthDate ? chip(labels.birthDate, new Date(pet.birthDate + 'T12:00:00').toLocaleDateString()) : ''}
    ${profile.bloodType ? chip(labels.bloodType, profile.bloodType) : ''}
    ${chip(labels.neutered, neuteredLabel)}
    ${profile.sex   ? chip(labels.sex, profile.sex) : ''}
  </div>
</div>

${allergiesText
  ? `<div class="section"><div class="section-title">${labels.allergies}</div><p style="font-size:.9rem">${allergiesText}</p></div>`
  : ''}

${allConditions.length > 0
  ? `<div class="section"><div class="section-title">${labels.conditions}</div>${allConditions.map((c) => `<span class="tag">${c}</span>`).join('')}</div>`
  : ''}

<div class="section">
  <div class="section-title">${labels.vaccines} (${vaccines.length} ${labels.vaccinesActive})</div>
  ${vaccines.length === 0
    ? `<p style="color:#9b9994;font-size:.9rem">${labels.noVaccines}</p>`
    : vaccines.map((v) =>
        listItem(v.name, [v.applied, v.nextDate ? '→ ' + v.nextDate : ''].filter(Boolean).join(' '))
      ).join('')}
</div>

<div class="section">
  <div class="section-title">${labels.medications} (${medications.length} ${labels.medicationsActive})</div>
  ${medications.length === 0
    ? `<p style="color:#9b9994;font-size:.9rem">${labels.noMeds}</p>`
    : medications.map((m) =>
        listItem(m.title, `${m.dose} · ${m.frequency}`)
      ).join('')}
</div>

${lastAppt ? `
<div class="section">
  <div class="section-title">${labels.lastAppt}</div>
  <div class="grid">
    ${chip(labels.apptDate, new Date(lastAppt.date + 'T12:00:00').toLocaleDateString())}
    ${chip(labels.apptVet, lastAppt.vetName)}
    ${lastAppt.diagnosis ? chip(labels.apptDiagnosis, lastAppt.diagnosis) : ''}
    ${lastAppt.weightKg != null ? chip(labels.apptWeight, `${lastAppt.weightKg} kg`) : ''}
  </div>
</div>` : ''}

<div class="footer">${labels.generatedOn} ${today} · PITUTI Pet Care</div>
</body></html>`;
}
