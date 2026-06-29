// VaccinesPage.tsx - Layout corrigido, catálogo por espécie + vacina customizada
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePetsContext } from '../context/PetsContext';
import { useVaccinesContext } from '../context/VaccinesContext';
import VaccineDetailModal from "../components/VaccineDetailModal";
import EditVaccineModal from "../components/EditVaccineModal";
import { getVaccStatus } from '../utils/vaccUtils';
import type { Species } from '../types';
import type { VaccineRecord } from '../utils/vaccUtils';


const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🦜', rabbit: '🐰',
  reptile: '🦎', fish: '🐠', other: '🐾',
};

// Catálogo de vacinas por espécie (EN / translatable keys)
const VACCINES_BY_SPECIES: Record<string, string[]> = {
  dog: [
    'Raiva', 'Parvovirose', 'Cinomose', 'Hepatite', 'Parainfluenza',
    'Leptospirose', 'Tosse do Canil (Bordetella)', 'Leishmaniose', 'Giardíase',
  ],
  cat: [
    'Raiva', 'Panleucopenia', 'Herpesvírus Felino', 'Calicivírus',
    'Leucemia Felina (FeLV)', 'Clamidiose', 'Peritonite Infecciosa Felina (PIF)',
  ],
  bird: [
    'Doença de Newcastle', 'Varíola Aviária', 'Polyomavírus', 'Psitacose',
  ],
  rabbit: [
    'Mixomatose', 'Doença Hemorrágica Viral (VHD)', 'VHD-2',
  ],
  reptile: [],
  fish: [],
  other: [],
};

function getVaccinesForSpecies(species: string): string[] {
  return VACCINES_BY_SPECIES[species] ?? [];
}

// ── Componente de registro de vacina ──────────────────────────────────────────
interface RegisterVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  petSpecies: string;
  vaccines: VaccineRecord[];
  onRegister: (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => void;
}

function RegisterVaccineModal({ isOpen, onClose, petName, petSpecies, vaccines, onRegister }: RegisterVaccineModalProps) {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];
  const catalogVaccines = getVaccinesForSpecies(petSpecies);

  const [selectedName, setSelectedName] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [date, setDate] = useState(today);
  const [nextDate, setNextDate] = useState('');
  const [vet, setVet] = useState('');
  const [notes, setNotes] = useState('');
  const [errName, setErrName] = useState('');
  const [errDate, setErrDate] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedName(''); setCustomName(''); setIsCustom(false);
      setDate(today); setNextDate(''); setVet(''); setNotes('');
      setErrName(''); setErrDate(''); setSuccess(false);
    }
  }, [isOpen, today]);

  if (!isOpen) return null;

  const finalName = isCustom ? customName.trim() : selectedName;

  const handleSubmit = () => {
    let valid = true;
    if (!finalName) { setErrName(t('pet.vacc.errSelect')); valid = false; }
    if (!date) { setErrDate(t('pet.vacc.errDate')); valid = false; }
    if (!valid) return;
    setSuccess(true);
    setTimeout(() => {
      onRegister({ name: finalName, date, nextDate, vet, notes });
      setSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-sheet" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-header">
          <div className="detail-icon" style={{ background: 'var(--success-hl)', color: 'var(--success)', fontSize: '1.375rem' }}>💉</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              {t('pet.vacc.modalTitle')}
            </div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>
              {t('pet.vacc.modalSubtitle', { name: petName })}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="modal-success">
            <div className="modal-success-icon" style={{ background: 'var(--success)' }}>✓</div>
            <div className="modal-success-title">{t('pet.vacc.successTitle')}</div>
            <div className="modal-success-sub">{t('pet.vacc.successSub', { name: petName })}</div>
          </div>
        ) : (
          <div className="detail-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Selecção por catálogo */}
            <div className="modal-section">{t('pet.vacc.sectionVaccine')}</div>

            {/* Toggle catálogo / customizada */}
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.25rem' }}>
              <button
                type="button"
                style={{ padding: '.3rem .75rem', borderRadius: 'var(--r-full)', fontSize: '.8125rem',
                         fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                         border: `1.5px solid ${!isCustom ? 'var(--primary)' : 'var(--border)'}`,
                         background: !isCustom ? 'var(--primary-hl)' : 'var(--surface)',
                         color: !isCustom ? 'var(--primary)' : 'var(--text-muted)' }}
                onClick={() => setIsCustom(false)}>
                📋 {t('pet.vacc.selectLabel', { defaultValue: 'Catálogo' })}
              </button>
              <button
                type="button"
                style={{ padding: '.3rem .75rem', borderRadius: 'var(--r-full)', fontSize: '.8125rem',
                         fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                         border: `1.5px solid ${isCustom ? 'var(--primary)' : 'var(--border)'}`,
                         background: isCustom ? 'var(--primary-hl)' : 'var(--surface)',
                         color: isCustom ? 'var(--primary)' : 'var(--text-muted)' }}
                onClick={() => setIsCustom(true)}>
                ✏️ {t('pet.vacc.customLabel', { defaultValue: 'Escrever nome' })}
              </button>
            </div>

            {!isCustom ? (
              catalogVaccines.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.375rem' }}>
                  {catalogVaccines.map((v) => (
                    <button
                      key={v}
                      type="button"
                      style={{
                        padding: '.5rem .75rem', borderRadius: 'var(--r-lg)', fontSize: '.8125rem',
                        fontWeight: selectedName === v ? 800 : 600, cursor: 'pointer', textAlign: 'left',
                        fontFamily: 'inherit', transition: 'all var(--trans)',
                        border: `1.5px solid ${selectedName === v ? 'var(--success)' : 'var(--border)'}`,
                        background: selectedName === v ? 'var(--success-hl)' : 'var(--surface)',
                        color: selectedName === v ? 'var(--success)' : 'var(--text)',
                      }}
                      onClick={() => { setSelectedName(v); setErrName(''); }}>
                      {v}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)',
                              fontSize: '.875rem', background: 'var(--surface-offset)',
                              borderRadius: 'var(--r-lg)', border: '1.5px solid var(--border)' }}>
                  {t('pet.vacc.noCatalog', { defaultValue: 'Sem catálogo para esta espécie. Use "Escrever nome".' })}
                </div>
              )
            ) : (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('pet.vacc.customName', { defaultValue: 'Nome da vacina' })}</label>
                <input
                  className={`form-input${errName && isCustom ? ' input-error' : ''}`}
                  value={customName}
                  onChange={(e) => { setCustomName(e.target.value); setErrName(''); }}
                  placeholder={t('pet.vacc.customNamePh', { defaultValue: 'Ex: Raiva, Panleucopenia…' })}
                  autoFocus
                />
                {errName && isCustom && <span className="form-hint-err">{errName}</span>}
              </div>
            )}

            {errName && !isCustom && <span className="form-hint-err">{errName}</span>}

            {/* Datas */}
            <div className="modal-section">{t('pet.vacc.sectionDates')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('pet.vacc.dateApplied')} *</label>
                <input
                  type="date"
                  className={`form-input${errDate ? ' input-error' : ''}`}
                  value={date}
                  max={today}
                  onChange={(e) => { setDate(e.target.value); setErrDate(''); }}
                />
                {errDate && <span className="form-hint-err">{errDate}</span>}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  {t('pet.vacc.dateNext')}{' '}
                  <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>{t('btn.optional')}</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={nextDate}
                  min={date || today}
                  onChange={(e) => setNextDate(e.target.value)}
                />
              </div>
            </div>

            {/* Info extra */}
            <div className="modal-section">{t('pet.vacc.sectionExtra')}</div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {t('field.vet')}{' '}
                <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>{t('btn.optional')}</span>
              </label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input
                  className="form-input"
                  placeholder={t('pet.vacc.vetPh')}
                  value={vet}
                  onChange={(e) => setVet(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {t('field.notes')}{' '}
                <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>{t('btn.optional')}</span>
              </label>
              <textarea
                className="form-input"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical', minHeight: 56, fontFamily: 'inherit' }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        {!success && (
          <div className="detail-footer">
            <button className="pf-btn pf-btn--cancel" onClick={onClose}>{t('btn.cancel')}</button>
            <button className="pf-btn pf-btn--register" onClick={handleSubmit} style={{ flex: 1 }}>
              💉 {t('btn.register')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── VaccRing ──────────────────────────────────────────────────────────────────
function VaccRing({ coverage, size = 96, strokeWidth = 8 }: { coverage: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (coverage / 100) * circ;
  const color = coverage >= 80 ? 'var(--success)' : coverage >= 50 ? 'var(--gold)' : 'var(--err)';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        style={{ fontSize: size * 0.22, fontWeight: 800, fill: color }}>
        {coverage}%
      </text>
    </svg>
  );
}

// ── VaccinesPage principal ────────────────────────────────────────────────────
export default function VaccinesPage() {
  const { t, i18n } = useTranslation();
  const { pets } = usePetsContext();
  const { vaccinesByPet, loading: vaccinesLoading, addVaccine, updateVaccine, deleteVaccine } = useVaccinesContext();

  const VACCBADGE = {
    ok:   { badge: t('pet.vacc.badgeOk'),   cls: 'badge-green' },
    soon: { badge: t('pet.vacc.badgeSoon'), cls: 'badge-yellow' },
    late: { badge: t('pet.vacc.badgeLate'), cls: 'badge-red' },
  } as const;

  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [detailVaccine, setDetailVaccine] = useState<VaccineRecord & { cls: 'ok' | 'soon' | 'late' } | null>(null);
  const [editVaccine, setEditVaccine] = useState<VaccineRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (pets.length && !selectedPetId) setSelectedPetId(pets[0]?.id);
  }, [pets, selectedPetId]);

  useEffect(() => {
    if (selectedPetId && !pets.find((p) => p.id === selectedPetId)) {
      setSelectedPetId(pets[0]?.id);
    }
  }, [pets, selectedPetId]);

  const selectedPet = useMemo(() => pets.find((p) => p.id === selectedPetId) ?? null, [pets, selectedPetId]);
  const petVaccines = useMemo(() => vaccinesByPet[selectedPetId ?? ''] ?? [], [vaccinesByPet, selectedPetId]);
  const withStatus = useMemo(
    () => petVaccines.map((v) => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late' })),
    [petVaccines],
  );

  const okCount  = withStatus.filter((v) => v.cls === 'ok' || v.cls === 'soon').length;
  const pending  = withStatus.filter((v) => v.cls === 'soon' || v.cls === 'late').length;
  const total    = petVaccines.length;
  const cov      = total > 0 ? Math.round((okCount / total) * 100) : 100;
  const alDia    = total > 0 ? Math.round((withStatus.filter((v) => v.cls === 'ok').length / total) * 100) : 100;
  const penPct   = total > 0 ? Math.round((pending / total) * 100) : 0;

  const handleRegister = (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => {
    if (!selectedPetId) return;
    const lbl = new Date(`${v.date}T12:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    const cls = getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late';
    addVaccine(selectedPetId, {
      id: '', name: v.name, applied: lbl, nextDate: v.nextDate,
      badge: VACCBADGE[cls].badge, badgeCls: VACCBADGE[cls].cls,
    });
    setRegisterOpen(false);
  };

  // Loading / sem pets
  if (pets.length === 0) {
    return (
      <div>
        <div className="page-header">
          <div><h1 className="page-title">{t('pet.vacc.title')}</h1></div>
        </div>
        <div className="empty-state" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🐾</div>
          <h3>{t('pets.noPets')}</h3>
          <p>{t('pets.noPetsHint')}</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/pets'}>
            {t('pets.addPet')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pet.vacc.title')}</h1>
          <p className="page-subtitle">
            {selectedPet ? `${SPECIES_EMOJI[selectedPet.species] ?? '🐾'} ${selectedPet.name}` : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setRegisterOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('pet.vacc.registerBtn')}
        </button>
      </div>

      {/* Selector de pet */}
      <div className="pet-selector" style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {pets.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`pet-chip${selectedPetId === p.id ? ' active' : ''}`}
            onClick={() => setSelectedPetId(p.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '.375rem' }}>
            {SPECIES_EMOJI[p.species] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      {vaccinesLoading ? (
        <div className="empty-state"><p>{t('common.loading')}</p></div>
      ) : (
        <div className="grid-2">
          {/* Lista de vacinas */}
          <div className="card">
            <div className="card-title">
              {t('pet.vacc.title')}
              <span style={{ marginLeft: 'auto', fontSize: '.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {okCount}/{total}
              </span>
            </div>
            {withStatus.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {t('pet.vacc.empty')}
              </div>
            ) : (
              withStatus.map((vacc) => (
                <div
                  key={`${vacc.name}-${vacc.applied}`}
                  className="vaccine-row"
                  onClick={() => setDetailVaccine(vacc)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.75rem 0',
                            borderBottom: '1.5px solid var(--divider)', cursor: 'pointer' }}>
                  <div className="vaccine-icon"
                    style={{ width: 36, height: 36, borderRadius: 'var(--r-lg)', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: vacc.cls === 'ok' ? 'var(--success-hl)' : vacc.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                              color: vacc.cls === 'ok' ? 'var(--success)' : vacc.cls === 'soon' ? 'var(--gold)' : 'var(--err)' }}>
                    💉
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="vaccine-name" style={{ fontWeight: 700, fontSize: '.875rem' }}>{vacc.name}</div>
                    <div className="vaccine-date" style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                      {t('pet.vacc.applied')} {vacc.applied}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {vacc.nextDate && (
                      <div className="vaccine-next" style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginBottom: '.2rem' }}>
                        {vacc.cls === 'late' ? t('pet.vacc.expired') : t('pet.vacc.next')}{' '}
                        {new Date(`${vacc.nextDate}T12:00:00`).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' })}
                      </div>
                    )}
                    <span className={`badge ${vacc.badgeCls}`} style={{ fontSize: '.6rem' }}>{vacc.badge}</span>
                  </div>
                </div>
              ))
            )}
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setRegisterOpen(true)}>
              + {t('pet.vacc.registerBtn')}
            </button>
          </div>

          {/* Cobertura */}
          <div className="card">
            <div className="card-title">{t('pet.vacc.coverage')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
              <VaccRing coverage={cov} size={96} strokeWidth={8} />
            </div>
            {[
              { label: t('pet.vacc.coverageTotal'), pct: cov,    color: '' },
              { label: t('pet.vacc.coverageOk'),    pct: alDia,  color: 'success' },
              { label: t('pet.vacc.coveragePending'), pct: penPct, color: penPct > 0 ? 'warn' : 'success' },
            ].map((b) => (
              <div key={b.label} style={{ marginBottom: '.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8125rem', marginBottom: '.375rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{b.label}</span>
                  <span style={{ fontWeight: 700 }}>{b.pct}%</span>
                </div>
                <div className="progress-wrap">
                  <div className={`progress-bar ${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modais */}
      {registerOpen && selectedPet && (
        <RegisterVaccineModal
          isOpen={registerOpen}
          onClose={() => setRegisterOpen(false)}
          petName={selectedPet.name}
          petSpecies={selectedPet.species}
          vaccines={petVaccines}
          onRegister={handleRegister}
        />
      )}

      {detailVaccine && selectedPet && (
        <VaccineDetailModal
          vaccine={{ ...detailVaccine, petName: selectedPet.name, petEmoji: SPECIES_EMOJI[selectedPet.species] ?? '🐾' }}
          onClose={() => setDetailVaccine(null)}
          onEdit={(v) => { setDetailVaccine(null); setEditVaccine(v); setEditOpen(true); }}
          onMarkApplied={(v, appliedDate, nextDate) => {
            const cls = getVaccStatus(nextDate) as 'ok' | 'soon' | 'late';
            updateVaccine(selectedPetId!, {
              ...v,
              applied: new Date(`${appliedDate}T12:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
              nextDate,
              badge: VACCBADGE[cls].badge,
              badgeCls: VACCBADGE[cls].cls,
            });
            setDetailVaccine(null);
          }}
        />
      )}

      {editOpen && editVaccine && selectedPet && (
        <EditVaccineModal
          isOpen={editOpen}
          onClose={() => { setEditOpen(false); setEditVaccine(null); }}
          vaccine={editVaccine}
          onSave={(updated) => {
            updateVaccine(selectedPetId!, updated);
            setEditOpen(false);
            setEditVaccine(null);
          }}
        />
      )}
    </div>
  );
}
