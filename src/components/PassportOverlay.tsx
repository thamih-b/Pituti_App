// PassportOverlay.tsx - Passaporte digital completo (microchip, número, viagem, antiparasitários, vet signature)
import { useTranslation } from 'react-i18next';
import type { VaccineRecord } from '../utils/vaccUtils';
import type { MedRecord } from '../context/MedicationsContext';
import type { PetMedicalProfile } from '../context/VetContext';
import { CONDITIONSCATALOG } from '../context/conditionsCatalog';
import type { ConditionItem } from '../context/conditionsCatalog';

const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🦜', rabbit: '🐰',
  reptile: '🦎', fish: '🐠', other: '🐾',
};

interface Pet {
  id: string; name: string; species: string; breed?: string | null;
  birthDate?: string | null; photoUrl?: string | null;
  microchip?: string | null; passport?: string | null;
  color?: string | null;
}

interface VetAppointment {
  id: string; petId: string; date: string; vetName: string;
  clinic?: string | null; reason: string; diagnosis?: string | null;
  weightKg?: number | null; nextAppointmentDate?: string | null;
}

interface InfoChipProps { label: string; value?: string | number | null; }

function InfoChip({ label, value }: InfoChipProps) {
  if (!value) return null;
  return (
    <div className="detail-info-chip">
      <div className="detail-info-label">{label}</div>
      <div className="detail-info-value">{value}</div>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: string; children: string }) {
  return (
    <div className="passport-section-title">
      <span style={{ marginRight: '.375rem' }}>{icon}</span>
      {children}
    </div>
  );
}

interface Props {
  pet: Pet;
  profile: PetMedicalProfile;
  vaccines: VaccineRecord[];
  medications: MedRecord[];
  appointments: VetAppointment[];
  onClose: () => void;
}

export function PassportOverlay({ pet, profile, vaccines, medications, appointments, onClose }: Props) {
  const { t, i18n } = useTranslation();

  const today = new Date().toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' });
  const now = new Date();

  // Só vacinas vigentes (nextDate no futuro)
  const activeVaccines = vaccines.filter((v) => !v.nextDate || new Date(`${v.nextDate}T12:00:00`) >= now);
  // Vacina da raiva (obrigatória para viagem)
  const rabiesVaccine = vaccines.find((v) => /raiva|rabia|rabies/i.test(v.name));

  const activeMeds = medications.filter((m) => !m.endDate || new Date(`${m.endDate}T12:00:00`) >= now);
  const lastAppt = [...appointments].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
  const nextAppt = appointments
    .filter((a) => a.nextAppointmentDate && a.nextAppointmentDate >= now.toISOString().split('T')[0])
    .sort((a, b) => (a.nextAppointmentDate ?? '').localeCompare(b.nextAppointmentDate ?? ''))[0] ?? null;

  const age = pet.birthDate
    ? Math.floor((Date.now() - new Date(`${pet.birthDate}T12:00:00`).getTime()) / 31_557_600_000)
    : null;

  const allergiesText = profile.allergies?.trim() ?? '';
  const allConditions = [
    ...(profile.chronicConditionIds ?? []).map((id) => {
      const found = CONDITIONSCATALOG.find((item: ConditionItem) => item.id === id);
      return found ? t(found.labelKey as never) : id;
    }),
    ...(profile.customConditions ?? []),
  ];

  const fmt = (dateStr: string) =>
    new Date(`${dateStr}T12:00:00`).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' });

  // ── Export HTML ──────────────────────────────────────────────────────────────
  const handleExport = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(generatePassportHTML({
      pet, profile, age, allergiesText, allConditions,
      vaccines: activeVaccines, rabiesVaccine: rabiesVaccine ?? null,
      medications: activeMeds, lastAppt, nextAppt, today, i18n,
    }));
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-sheet" style={{ maxWidth: 560, padding: 0, overflow: 'hidden' }}>
        {/* Capa */}
        <div className="passport-sheet-header">
          <div className="passport-sheet-cover">
            <div className="passport-cover-emoji">{SPECIES_EMOJI[pet.species] ?? '🐾'}</div>
          </div>
          <div className="passport-cover-name">{pet.name}</div>
          <div className="passport-cover-sub">
            {pet.breed ?? pet.species}
            {age !== null ? ` · ${age} ${t('vet.documents.passport.years')}` : ''}
          </div>
          <button className="detail-close" onClick={onClose} aria-label={t('btn.close')}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="detail-body" style={{ overflowY: 'auto', maxHeight: 'calc(90dvh - 180px)' }}>

          {/* 1. Identidade */}
          <div className="passport-section">
            <SectionTitle icon="🪪">{t('vet.documents.passport.identity')}</SectionTitle>
            <div className="detail-info-grid">
              <InfoChip label={t('vet.documents.passport.species')} value={pet.species} />
              {pet.breed && <InfoChip label={t('vet.documents.passport.breed')} value={pet.breed} />}
              {pet.birthDate && <InfoChip label={t('vet.documents.passport.birthDate')} value={fmt(pet.birthDate)} />}
              {age !== null && <InfoChip label={t('pet.ageYears', { count: age })} value={`${age} ${t('vet.documents.passport.years')}`} />}
              {pet.color && <InfoChip label={t('pets.color', { defaultValue: 'Cor' })} value={pet.color} />}
              <InfoChip label={t('vet.documents.passport.sex')} value={
                profile.sex === 'male' ? t('vet.profile.sexMale') : profile.sex === 'female' ? t('vet.profile.sexFemale') : undefined
              } />
              <InfoChip label={t('vet.documents.passport.neutered')} value={
                profile.neutered === true ? t('vet.documents.passport.neuteredYes')
                : profile.neutered === false ? t('vet.documents.passport.neuteredNo') : undefined
              } />
              {profile.bloodType && <InfoChip label={t('vet.documents.passport.bloodType')} value={profile.bloodType} />}
            </div>
          </div>

          {/* 2. Identificação electrónica */}
          {(pet.microchip || pet.passport) && (
            <div className="passport-section">
              <SectionTitle icon="📡">{t('pets.sectionId', { defaultValue: 'Identificação' })}</SectionTitle>
              <div className="detail-info-grid">
                {pet.microchip && (
                  <InfoChip label={t('pets.microchip')} value={pet.microchip} />
                )}
                {pet.passport && (
                  <InfoChip label={t('pets.passport')} value={pet.passport} />
                )}
              </div>
            </div>
          )}

          {/* 3. Saúde */}
          {(allergiesText || allConditions.length > 0) && (
            <div className="passport-section">
              <SectionTitle icon="🏥">{t('vet.documents.passport.health')}</SectionTitle>
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
                      <span key={i} className="profile-tag" style={{ background: 'var(--warn-hl)', color: 'var(--warn)' }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Vacinas */}
          <div className="passport-section">
            <SectionTitle icon="💉">
              {t('vet.documents.passport.vaccines')} {activeVaccines.length > 0 ? `(${activeVaccines.length} ${t('vet.documents.passport.vaccinesActive')})` : ''}
            </SectionTitle>
            {/* Raiva em destaque */}
            {rabiesVaccine && (
              <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)',
                            borderRadius: 'var(--r-lg)', padding: '.625rem .875rem', marginBottom: '.625rem',
                            display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ fontSize: '1rem' }}>⭐</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--success)' }}>{rabiesVaccine.name}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                    {t('pet.vacc.applied')} {rabiesVaccine.applied}
                    {rabiesVaccine.nextDate ? ` · ${t('pet.vacc.next')} ${new Date(`${rabiesVaccine.nextDate}T12:00:00`).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
                  </div>
                </div>
                <span style={{ fontSize: '.65rem', fontWeight: 800, color: 'var(--success)', background: 'var(--surface)', padding: '.1rem .4rem', borderRadius: 'var(--r-full)', border: '1px solid var(--success)' }}>
                  ✈️ Viagem
                </span>
              </div>
            )}
            {activeVaccines.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('vet.documents.passport.noVaccines')}</p>
            ) : (
              <div className="passport-list">
                {activeVaccines.map((v, i) => (
                  <div key={i} className="passport-list-item">
                    <span className="passport-list-name">{v.name}</span>
                    <span className="passport-list-meta">
                      {v.applied}
                      {v.nextDate && (
                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-faint)' }}>
                          → {new Date(`${v.nextDate}T12:00:00`).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Tratamentos antiparasitários */}
          {profile.parasiteControl && (
            <div className="passport-section">
              <SectionTitle icon="🔬">{t('vet.profile.parasiteControl', { defaultValue: 'Antiparasitários' })}</SectionTitle>
              <p style={{ fontSize: '.875rem', color: 'var(--text)' }}>{profile.parasiteControl}</p>
            </div>
          )}

          {/* 6. Medicamentos activos */}
          <div className="passport-section">
            <SectionTitle icon="💊">
              {t('vet.documents.passport.medications')} {activeMeds.length > 0 ? `(${activeMeds.length} ${t('vet.documents.passport.medicationsActive')})` : ''}
            </SectionTitle>
            {activeMeds.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('vet.documents.passport.noMeds')}</p>
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

          {/* 7. Última consulta */}
          {lastAppt && (
            <div className="passport-section">
              <SectionTitle icon="🩺">{t('vet.documents.passport.lastAppt')}</SectionTitle>
              <div className="detail-info-grid">
                <InfoChip label={t('vet.documents.passport.apptDate')} value={fmt(lastAppt.date)} />
                <InfoChip label={t('vet.documents.passport.apptVet')} value={lastAppt.vetName} />
                {lastAppt.clinic && <InfoChip label={t('field.clinic')} value={lastAppt.clinic} />}
                {lastAppt.diagnosis && <InfoChip label={t('vet.documents.passport.apptDiagnosis')} value={lastAppt.diagnosis} />}
                {lastAppt.weightKg != null && <InfoChip label={t('vet.documents.passport.apptWeight')} value={`${lastAppt.weightKg} kg`} />}
              </div>
            </div>
          )}

          {/* 8. Próxima consulta */}
          {nextAppt && (
            <div className="passport-section">
              <SectionTitle icon="📅">{t('vet.appointments.nextLabel', { defaultValue: 'Próxima consulta' })}</SectionTitle>
              <div className="detail-info-grid">
                {nextAppt.nextAppointmentDate && (
                  <InfoChip label={t('vet.documents.passport.apptDate')} value={fmt(nextAppt.nextAppointmentDate)} />
                )}
                <InfoChip label={t('vet.documents.passport.apptVet')} value={nextAppt.vetName} />
              </div>
            </div>
          )}

          {/* Rodapé */}
          <div className="passport-footer-note">
            {t('vet.documents.passport.generatedOn')} {today} · PITUTI Pet Care
          </div>
        </div>

        {/* Footer */}
        <div className="detail-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('btn.close')}</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleExport}>
            📄 {t('vet.documents.passport.exportBtn', { defaultValue: 'Exportar / Imprimir' })}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Gerador HTML para impressão ───────────────────────────────────────────────
function generatePassportHTML({ pet, profile, age, allergiesText, allConditions, vaccines, rabiesVaccine, medications, lastAppt, nextAppt, today, i18n }: any): string {
  const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' });
  const chip = (label: string, value: string) => `<div class="chip"><div class="chip-label">${label}</div><div class="chip-value">${value}</div></div>`;
  const listItem = (name: string, meta: string) => `<div class="list-item"><span class="list-name">${name}</span><span class="list-meta">${meta}</span></div>`;

  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<title>Passaporte · ${pet.name}</title>
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700,800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Satoshi,sans-serif;color:#1a1714;background:#fff;padding:2rem;max-width:740px;margin:auto}
  h1{font-size:2rem;font-weight:800;margin-bottom:.25rem}
  .sub{color:#6b6a66;margin-bottom:.25rem;font-size:.95rem}
  .badge-travel{display:inline-block;background:#d4edda;color:#1a6b3a;padding:.2rem .6rem;border-radius:99px;font-size:.75rem;font-weight:800;margin-left:.5rem}
  .section{margin-bottom:1.75rem}
  .section-title{font-weight:800;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#9b9994;margin-bottom:.75rem;padding-bottom:.375rem;border-bottom:1.5px solid #e8e5e0;display:flex;align-items:center;gap:.375rem}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:.625rem}
  .chip{background:#f5f3ef;padding:.625rem .875rem;border-radius:.625rem}
  .chip-label{font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#9b9994}
  .chip-value{font-size:.9rem;font-weight:700;color:#1a1714;margin-top:.125rem}
  .list-item{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid #f0ede8}
  .list-item:last-child{border-bottom:none}
  .list-name{font-weight:700;font-size:.9rem}
  .list-meta{font-size:.8125rem;color:#6b6a66;text-align:right}
  .rabies-box{background:#d4edda;border:1.5px solid #1a6b3a;border-radius:.75rem;padding:.75rem 1rem;margin-bottom:.75rem;display:flex;align-items:center;gap:.5rem}
  .rabies-name{font-weight:800;font-size:.9rem;color:#1a6b3a}
  .rabies-meta{font-size:.8rem;color:#2d6a4f}
  .tag{display:inline-block;background:#fce4ec;color:#b5174e;padding:.25rem .625rem;border-radius:99px;font-size:.75rem;font-weight:700;margin:.2rem}
  .footer{margin-top:2.5rem;padding-top:1rem;border-top:1.5px solid #e8e5e0;color:#9b9994;font-size:.75rem;text-align:center}
  @media print{body{padding:1.25rem}}
</style>
</head>
<body>
  <h1>${pet.name}</h1>
  <p class="sub">${pet.breed ?? pet.species}${age != null ? ` · ${age} anos` : ''}${pet.microchip ? ` · 📡 ${pet.microchip}` : ''}${pet.passport ? ` · 🪪 ${pet.passport}` : ''}</p>

  <div class="section">
    <div class="section-title">🪪 Identidade</div>
    <div class="grid">
      ${chip('Espécie', pet.species)}
      ${pet.breed ? chip('Raça', pet.breed) : ''}
      ${pet.birthDate ? chip('Data nasc.', fmt(pet.birthDate)) : ''}
      ${pet.color ? chip('Cor', pet.color) : ''}
      ${profile.sex ? chip('Sexo', profile.sex === 'male' ? 'Macho' : 'Fêmea') : ''}
      ${profile.neutered != null ? chip('Castrado', profile.neutered ? 'Sim' : 'Não') : ''}
      ${profile.bloodType ? chip('Grupo sanguíneo', profile.bloodType) : ''}
    </div>
  </div>

  ${(pet.microchip || pet.passport) ? `
  <div class="section">
    <div class="section-title">📡 Identificação electrónica</div>
    <div class="grid">
      ${pet.microchip ? chip('Microchip', pet.microchip) : ''}
      ${pet.passport ? chip('N.º Passaporte', pet.passport) : ''}
    </div>
  </div>` : ''}

  ${(allergiesText || allConditions.length > 0) ? `
  <div class="section">
    <div class="section-title">🏥 Saúde</div>
    ${allergiesText ? `<div style="margin-bottom:.5rem"><div class="chip-label" style="margin-bottom:.25rem">Alergias</div><p style="font-size:.9rem">${allergiesText}</p></div>` : ''}
    ${allConditions.length > 0 ? `<div>${allConditions.map((c: string) => `<span class="tag">${c}</span>`).join('')}</div>` : ''}
  </div>` : ''}

  <div class="section">
    <div class="section-title">💉 Vacinas${vaccines.length > 0 ? ` (${vaccines.length} em dia)` : ''}</div>
    ${rabiesVaccine ? `
    <div class="rabies-box">
      <span style="font-size:1.1rem">⭐</span>
      <div>
        <div class="rabies-name">${rabiesVaccine.name} <span style="font-size:.7rem;background:#1a6b3a;color:#fff;padding:.1rem .4rem;border-radius:99px">✈️ Viagem</span></div>
        <div class="rabies-meta">Aplicada: ${rabiesVaccine.applied}${rabiesVaccine.nextDate ? ` · Próxima: ${new Date(rabiesVaccine.nextDate + 'T12:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}</div>
      </div>
    </div>` : ''}
    ${vaccines.length === 0 ? '<p style="color:#9b9994;font-size:.9rem">Sem vacinas registadas</p>' : vaccines.map((v: any) => listItem(v.name, v.applied + (v.nextDate ? ` → ${new Date(v.nextDate + 'T12:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''))).join('')}
  </div>

  ${profile.parasiteControl ? `
  <div class="section">
    <div class="section-title">🔬 Antiparasitários</div>
    <p style="font-size:.9rem">${profile.parasiteControl}</p>
  </div>` : ''}

  <div class="section">
    <div class="section-title">💊 Medicamentos activos${medications.length > 0 ? ` (${medications.length})` : ''}</div>
    ${medications.length === 0 ? '<p style="color:#9b9994;font-size:.9rem">Sem medicamentos activos</p>' : medications.map((m: any) => listItem(m.title, `${m.dose} · ${m.frequency}`)).join('')}
  </div>

  ${lastAppt ? `
  <div class="section">
    <div class="section-title">🩺 Última consulta</div>
    <div class="grid">
      ${chip('Data', fmt(lastAppt.date))}
      ${chip('Veterinário', lastAppt.vetName)}
      ${lastAppt.clinic ? chip('Clínica', lastAppt.clinic) : ''}
      ${lastAppt.diagnosis ? chip('Diagnóstico', lastAppt.diagnosis) : ''}
      ${lastAppt.weightKg != null ? chip('Peso', `${lastAppt.weightKg} kg`) : ''}
    </div>
  </div>` : ''}

  ${nextAppt ? `
  <div class="section">
    <div class="section-title">📅 Próxima consulta</div>
    <div class="grid">
      ${nextAppt.nextAppointmentDate ? chip('Data', fmt(nextAppt.nextAppointmentDate)) : ''}
      ${chip('Veterinário', nextAppt.vetName)}
    </div>
  </div>` : ''}

  <div class="footer">Gerado em ${today} · PITUTI Pet Care</div>
</body>
</html>`;
}
