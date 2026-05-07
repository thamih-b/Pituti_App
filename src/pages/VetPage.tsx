// traduzido e sem mock
import { useMemo, useState } from 'react';
import { SPECIESEMOJI } from '../hooks/usePets';
import { usePetsContext } from '../context/PetsContext';       
import { useVet, type PetMedicalProfile, type VetContact, type VetAppointment } from '../context/VetContext';
import { VET_TYPES } from '../components/AddEditVetModal';
import { APPOINTMENT_TYPES } from '../components/AddEditAppointmentModal';
import AddEditVetModal from '../components/AddEditVetModal';
import AddEditAppointmentModal from '../components/AddEditAppointmentModal';
import PetMedicalProfileModal from '../components/PetMedicalProfileModal';
import BackButton from '../components/BackButton';
import { showToast } from '../components/AppLayout';
import { useTranslation } from 'react-i18next';
import { CONDITIONS_CATALOG } from '../context/conditionsCatalog'

// ─── Tab types ────────────────────────────────────────────────────────────────
const TAB_KEYS = ['profile', 'vets', 'appointments', 'exams', 'documents'] as const;
type TabKey = typeof TAB_KEYS[number];


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VetPage() {
  const { t } = useTranslation();
  const { pets } = usePetsContext();                              // ← real
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [vetModalOpen, setVetModalOpen] = useState(false);
  const [editingVet, setEditingVet] = useState<VetContact | null>(null);
  const [apptModalOpen, setApptModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<VetAppointment | null>(null);
  const [confirmDeleteVet, setConfirmDeleteVet] = useState<string | null>(null);
  const [confirmDeleteAppt, setConfirmDeleteAppt] = useState<string | null>(null);

  const {
    getMedicalProfile, saveMedicalProfile,
    vets, addVet, updateVet, deleteVet,
    appointments, addAppointment, updateAppointment, deleteAppointment,
  } = useVet();


const TABS = [
    { key: 'profile',      label: t('vet.tabs.profile') },
    { key: 'vets',         label: t('vet.tabs.vets') },
    { key: 'appointments', label: t('vet.tabs.appointments') },
    { key: 'exams',        label: t('vet.tabs.exams') },
    { key: 'documents',    label: t('vet.tabs.documents') },
  ] as const;

  const COMING_SOON: Record<'exams' | 'documents', { icon: string; text: string }> = {
    exams:     { icon: '🔬', text: t('vet.comingSoon.exams') },
    documents: { icon: '📄', text: t('vet.comingSoon.documents') },
  };


    const pet = useMemo(
    () => pets.find(item => item.id === selectedPetId) ?? pets[0] ?? null,
    [selectedPetId, pets],                                        
  );


  if (!pet) return (
    <div>
      <BackButton />
      <div className="empty-state">
        <div className="empty-state-icon">🐾</div>
        <h3>{t('pets.noPets')}</h3>
        <p>{t('pets.noPetsHint')}</p>
      </div>
    </div>
  );


   const profile = getMedicalProfile(pet.id);
  const hasProfileData = Boolean(
    profile.bloodType || profile.allergies ||
    profile.chronicConditionIds.length || profile.customConditions.length ||
    profile.sex !== undefined || profile.neutered !== undefined ||
    profile.surgeries.length || profile.behavioralNotes ||
    profile.environment || profile.parasiteControl || profile.vetQuestions,
  );

  const petAppointments = appointments
    .filter(item => item.petId === pet.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <BackButton />
      <div className="page-header">
        <h1 className="page-title">{t('vet.pageTitle')}</h1>
        <p className="page-subtitle">{t('vet.pageSubtitle')}</p>
      </div>

      {/* Selector de mascota — usa pets reales */}
      <div className="pet-selector">
        {pets.map(item => (
          <button
            key={item.id}
            type="button"
            className={`pet-chip${pet.id === item.id ? ' active' : ''}`}
            onClick={() => setSelectedPetId(item.id)}
          >
            {SPECIESEMOJI[item.species] ?? '🐾'} {item.name}
          </button>
        ))}
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key as TabKey)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <TabMedicalProfile profile={profile} hasData={hasProfileData} onEdit={() => setEditProfileOpen(true)} t={t} />
      )}
      {activeTab === 'vets' && (
        <TabVets
          vets={vets}
          pets={pets}                                             // ← passa pets reais
          confirmDeleteId={confirmDeleteVet}
          t={t}
          onAdd={() => { setEditingVet(null); setVetModalOpen(true); }}
          onEdit={item => { setEditingVet(item); setVetModalOpen(true); }}
          onRequestDelete={setConfirmDeleteVet}
          onCancelDelete={() => setConfirmDeleteVet(null)}
          onConfirmDelete={id => { deleteVet(id); setConfirmDeleteVet(null); showToast(t('vet.toast.vetDeleted')); }}
        />
      )}
      {activeTab === 'appointments' && (
        <TabAppointments
          petName={pet.name}
          appointments={petAppointments}
          confirmDeleteId={confirmDeleteAppt}
          t={t}
          onAdd={() => { setEditingAppt(null); setApptModalOpen(true); }}
          onEdit={item => { setEditingAppt(item); setApptModalOpen(true); }}
          onRequestDelete={setConfirmDeleteAppt}
          onCancelDelete={() => setConfirmDeleteAppt(null)}
          onConfirmDelete={id => { deleteAppointment(id); setConfirmDeleteAppt(null); showToast(t('vet.toast.apptDeleted')); }}
        />
      )}
      {(activeTab === 'exams' || activeTab === 'documents') && (
        <ComingSoonCard tab={activeTab} info={COMING_SOON[activeTab]} comingSoonLabel={t('vet.comingSoon.label')} />
      )}

      <PetMedicalProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        pet={pet}
        profile={profile}
        onSave={saveMedicalProfile}
      />
      <AddEditVetModal
        isOpen={vetModalOpen}
        onClose={() => setVetModalOpen(false)}
        onSave={item => { addVet(item); showToast(t('vet.toast.vetAdded')); }}
        onUpdate={item => { updateVet(item); showToast(t('vet.toast.vetUpdated')); }}
        initial={editingVet}
      />
      <AddEditAppointmentModal
        isOpen={apptModalOpen}
        onClose={() => setApptModalOpen(false)}
        onSave={item => { addAppointment(item); showToast(t('vet.toast.apptAdded')); }}
        onUpdate={item => { updateAppointment(item); showToast(t('vet.toast.apptUpdated')); }}
        initial={editingAppt}
        defaultPetId={pet.id}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabMedicalProfile({
  profile, hasData, onEdit, t,
}: {
  profile: PetMedicalProfile
  hasData: boolean
  onEdit: () => void
  t: any
}) {
  if (!hasData) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🩺</div>
        <h3>{t('vet.profile.emptyTitle')}</h3>
        <p>{t('vet.profile.emptyText')}</p>
        <button className="btn btn-primary" onClick={onEdit}>
          {t('vet.profile.emptyBtn')}
        </button>
      </div>
    )
  }
type ConditionId = (typeof CONDITIONS_CATALOG)[number]['id']

const conditionsById = new Map<ConditionId, (typeof CONDITIONS_CATALOG)[number]>(
  CONDITIONS_CATALOG.map((item) => [item.id, item]),
)

const conditionLabels = (profile.chronicConditionIds as ConditionId[]).map((id) => {
  const condition = conditionsById.get(id)
  return condition ? t(condition.labelKey) : id
})

  const allConditions = [...conditionLabels, ...profile.customConditions]

  const envLabel: Record<string, string> = {
    apartment: t('vet.profile.envApartment'),
    house:     t('vet.profile.envHouse'),
    both:      t('vet.profile.envBoth'),
  }

  return (
    <div className="tab-content">
      <div className="profile-view">
        <button className="btn btn-secondary btn-sm profile-edit-btn" onClick={onEdit}>
          ✏️ {t('vet.profile.editBtn')}
        </button>

        <div className="profile-grid">
          <ProfileRow label={t('vet.profile.sex')} value={
            profile.sex === 'male'   ? t('vet.profile.sexMale')
            : profile.sex === 'female' ? t('vet.profile.sexFemale')
            : undefined
          } />
          <ProfileRow label={t('vet.profile.neutered')} value={
            profile.neutered === true  ? t('vet.profile.neuteredYes')
            : profile.neutered === false ? t('vet.profile.neuteredNo')
            : undefined
          } />
          {profile.neutered && profile.neuteredAge && (
            <ProfileRow label={t('vet.profile.neuteredAge')} value={profile.neuteredAge} />
          )}
          <ProfileRow label={t('vet.profile.bloodType')} value={profile.bloodType} />
          <ProfileRow label={t('vet.profile.allergies')} value={profile.allergies} />
          {profile.environment && (
            <ProfileRow label={t('vet.profile.environment')} value={envLabel[profile.environment]} />
          )}
          {profile.livingWithAnimals != null && (
            <ProfileRow
              label={t('vet.profile.livingWithAnimals')}
              value={profile.livingWithAnimals ? t('vet.profile.neuteredYes') : t('vet.profile.neuteredNo')}
            />
          )}
          {profile.parasiteControl && (
            <ProfileRow label={t('vet.profile.parasiteControl')} value={profile.parasiteControl} />
          )}
        </div>

        <div className="profile-section-title">{t('vet.profile.conditions')}</div>
        {allConditions.length === 0 ? (
          <p className="profile-empty-row">{t('vet.profile.noConditions')}</p>
        ) : (
          <div className="profile-tags">
            {allConditions.map((c) => (
              <span key={c} className="profile-tag">{c}</span>
            ))}
          </div>
        )}

        <div className="profile-section-title">{t('vet.profile.surgeries')}</div>
        {profile.surgeries.length === 0 ? (
          <p className="profile-empty-row">{t('vet.profile.noSurgeries')}</p>
        ) : (
          profile.surgeries.map((surgery) => (
            <div key={surgery.id} className="profile-surgery-row">
              <span className="profile-surgery-name">{surgery.name}</span>
              {surgery.date && (
                <span className="profile-surgery-date">
                  {new Date(`${surgery.date}T12:00:00`).toLocaleDateString()}
                </span>
              )}
              {surgery.notes && (
                <span className="profile-surgery-notes">{surgery.notes}</span>
              )}
            </div>
          ))
        )}

        {(profile.behavioralNotes || profile.vetQuestions) && (
          <div className="profile-notes-section">
            {profile.behavioralNotes && (
              <ProfileRow label={t('vet.profile.behavioralNotes')} value={profile.behavioralNotes} />
            )}
            {profile.vetQuestions && (
              <ProfileRow label={t('vet.profile.vetQuestions')} value={profile.vetQuestions} />
            )}
          </div>
        )}

        {profile.updatedAt && (
          <p className="profile-updated">
            {t('vet.profile.lastUpdated')}{' '}
            {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="profile-row">
      <span className="profile-row-label">{label}</span>
      <span className="profile-row-value">{value}</span>
    </div>
  )
}

function TabVets({ vets, pets, confirmDeleteId, onAdd, onEdit, onRequestDelete, onCancelDelete, onConfirmDelete, t }: {
  vets: VetContact[];
  pets: { id: string; name: string; species: string }[];        // ← tipo explícito, sem MOCKPETS
  confirmDeleteId: string | null;
  onAdd: () => void;
  onEdit: (item: VetContact) => void;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
  t: any;
}) {
  return (
    <div className="tab-content">
      {vets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🩺</div>
          <h3>{t('vet.contacts.emptyTitle')}</h3>
          <p>{t('vet.contacts.emptyText')}</p>
          <button className="btn btn-primary" onClick={onAdd}>
            {t('vet.contacts.addBtn')}
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={onAdd}>
              {t('vet.contacts.addBtn')}
            </button>
          </div>
          <div className="card-list">
            {vets.map((item) => {
             const typeInfo = VET_TYPES.find(vt => vt.value === item.type);
const typeLabel = typeInfo ? t(`vet.vetTypes.${typeInfo.key}`) : '';
              return (
                <div key={item.id} className="vet-card">
                  <div className="vet-card-main">
                      <div className="vet-card-icon" data-type={item.type ?? 'other'}>
                        {typeInfo?.emoji ?? '🩺'}
                      </div>
                      <div className="vet-card-body">
                        <div className="vet-card-name">{item.name}</div>
                        <div className="vet-card-clinic">{typeLabel} · {item.clinic}</div>
                        {item.specialty && (
                          // ✅ era t.field.specialty
                          <div className="vet-card-detail">
                            {t('field.specialty')}: {item.specialty}
                          </div>
                        )}
                        <div className="vet-card-phones">
                          <span>{item.phone}</span>
                          {item.phone2 && <span>{item.phone2}</span>}
                        </div>
                      {item.address && (
                        <div className="vet-card-detail">{item.address}</div>
                      )}
                      {item.petIds.length > 0 && (
                        <div className="vet-card-detail">
                          {t('vet.contacts.sectionPets')}:{' '}
                          {pets.filter(p => item.petIds.includes(p.id)).map(p => p.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="vet-card-footer">
                    <div className="vet-card-footer-info">{t('vet.contacts.titleAdd')}</div>
                    <div className="vet-card-actions">
                      {/* ✅ era t.btn.edit */}
                      <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                        {t('btn.edit')}
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="confirm-delete">
                          <button className="btn btn-danger btn-sm" onClick={() => onConfirmDelete(item.id)}>
                            {t('btn.confirm')}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                            {t('btn.cancel')}
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-ghost btn-sm danger" onClick={() => onRequestDelete(item.id)}>
                          {t('btn.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function TabAppointments({
  petName, appointments, confirmDeleteId,
  onAdd, onEdit, onRequestDelete, onCancelDelete, onConfirmDelete, t,
}: {
  petName: string
  appointments: VetAppointment[]
  confirmDeleteId: string | null
  onAdd: () => void
  onEdit: (item: VetAppointment) => void
  onRequestDelete: (id: string) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: string) => void
  t: any
}) {
  const todayDate = new Date().toISOString().split('T')[0]
  const upcoming  = appointments.filter(
    (item) => item.nextAppointmentDate && item.nextAppointmentDate >= todayDate,
  )

  return (
    <div className="tab-content">
      {upcoming.length > 0 && (
        <div className="upcoming-section">
          <div className="section-label">{t('vet.appointments.nextLabel')}</div>
          {upcoming.map((item) => (
            <NextReturnBanner key={item.id} appointment={item} t={t} />
          ))}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>{t('vet.appointments.emptyTitle')}</h3>
          {/* ✅ era .replace('name', petName) — agora interpolação nativa */}
          <p>{t('vet.appointments.emptyText', { name: petName })}</p>
          <button className="btn btn-primary" onClick={onAdd}>
            {t('vet.appointments.addBtn')}
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={onAdd}>
              {t('vet.appointments.addBtn')}
            </button>
          </div>
          <div className="card-list">
            {appointments.map((item) => {
              const typeInfo  = APPOINTMENT_TYPES.find((appt) => appt.value === item.type)
              const dateLabel = new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, {
                day: '2-digit', month: 'short', year: 'numeric',
              })
              return (
                <div key={item.id} className="appt-card">
                  <div className="appt-card-main">
                    <div className="appt-card-icon" data-type={item.type ?? 'other'}>
                      {typeInfo?.emoji ?? '📋'}
                    </div>
                    <div className="appt-card-body">
                      <div className="appt-card-reason">{item.reason}</div>
                      <div className="appt-card-date">{dateLabel}</div>
                      <div className="appt-card-vet">
                        {item.vetName}{item.clinic ? ` · ${item.clinic}` : ''}
                      </div>
                      {item.diagnosis && (
                        <div className="appt-card-detail">
                          {t('vet.appointments.diagnosis')}: {item.diagnosis}
                        </div>
                      )}
                      {item.treatment && (
                        <div className="appt-card-detail">
                          {t('vet.appointments.treatment')}: {item.treatment}
                        </div>
                      )}
                      <div className="appt-card-meta">
                        {item.weightKg != null && (
                          <span>{t('vet.appointments.weight')}: {item.weightKg} kg</span>
                        )}
                        {item.nextAppointmentDate && (
                          <span>
                            {t('vet.appointments.nextReturn')}:{' '}
                            {new Date(`${item.nextAppointmentDate}T12:00:00`).toLocaleDateString(undefined, {
                              day: '2-digit', month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="appt-card-footer">
                    <div className="appt-card-footer-info">
                      {t('vet.appointments.historyLabel')}
                    </div>
                    <div className="appt-card-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                        {t('btn.edit')}
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="confirm-delete">
                          <button className="btn btn-danger btn-sm" onClick={() => onConfirmDelete(item.id)}>
                            {t('btn.confirm')}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                            {t('btn.cancel')}
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm danger"
                          onClick={() => onRequestDelete(item.id)}
                        >
                          {/* ✅ era t.('btn.delete') — sintaxe inválida */}
                          {t('btn.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function NextReturnBanner({ appointment, t }: { appointment: VetAppointment; t: any }) {
  if (!appointment.nextAppointmentDate) return null

  const returnDate = new Date(`${appointment.nextAppointmentDate}T12:00:00`)
  const diffDays   = Math.ceil((returnDate.getTime() - Date.now()) / 86_400_000)
  const urgency    = diffDays <= 3

  // ✅ era t.vet.time.today + .replace('n', ...) sem as chavetas
  const timeLabel =
    diffDays <= 0 ? t('vet.time.today')
    : diffDays === 1 ? t('vet.time.tomorrow')
    : t('vet.time.inDays', { n: String(diffDays) })

  return (
    <div className={`return-banner ${urgency ? 'urgent' : ''}`}>
      <span className="return-banner-icon">🔄</span>
      <div className="return-banner-body">
        <div className="return-banner-note">
          {appointment.nextAppointmentNote ?? t('vet.appointments.nextLabel')}
        </div>
        <div className="return-banner-vet">
          {appointment.vetName}{appointment.clinic ? ` · ${appointment.clinic}` : ''}
        </div>
      </div>
      <div className="return-banner-time">
        <div className="return-banner-label">{timeLabel}</div>
        <div className="return-banner-date">
          {returnDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
        </div>
      </div>
    </div>
  )
}

function ComingSoonCard({
  tab, info, comingSoonLabel,
}: {
  tab: 'exams' | 'documents'
  info: { icon: string; text: string }
  comingSoonLabel: string
}) {
  return (
    <div className="coming-soon-card">
      <div className="coming-soon-icon">{info.icon}</div>
      <div className="coming-soon-label">{comingSoonLabel}</div>
      <p className="coming-soon-text">{info.text}</p>
    </div>
  )
}