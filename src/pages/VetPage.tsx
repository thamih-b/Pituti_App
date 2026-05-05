import { useMemo, useState } from 'react'
import { MOCK_PETS, SPECIES_EMOJI } from '../hooks/usePets'
import {
  useVet,
  CONDITIONS_CATALOG,
  type PetMedicalProfile,
  type VetContact,
  type VetAppointment,
} from '../context/VetContext'
import { VET_TYPES } from '../components/AddEditVetModal'
import { APPOINTMENT_TYPES } from '../components/AddEditAppointmentModal'
import AddEditVetModal from '../components/AddEditVetModal'
import AddEditAppointmentModal from '../components/AddEditAppointmentModal'
import PetMedicalProfileModal from '../components/PetMedicalProfileModal'
import BackButton from '../components/BackButton'
import { showToast } from '../components/AppLayout'
import { useT } from '../context/LanguageContext'

export default function VetPage() {
  const t = useT()
  const v = t.vet

  const [selectedPetId, setSelectedPetId] = useState(MOCK_PETS[0]?.id ?? '')
  const [activeTab, setActiveTab] = useState<TabKey>('profile')
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [vetModalOpen, setVetModalOpen] = useState(false)
  const [editingVet, setEditingVet] = useState<VetContact | null>(null)
  const [apptModalOpen, setApptModalOpen] = useState(false)
  const [editingAppt, setEditingAppt] = useState<VetAppointment | null>(null)
  const [confirmDeleteVet, setConfirmDeleteVet] = useState<string | null>(null)
  const [confirmDeleteAppt, setConfirmDeleteAppt] = useState<string | null>(null)

  const {
    getMedicalProfile,
    saveMedicalProfile,
    vets,
    addVet,
    updateVet,
    deleteVet,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useVet()

  const TABS = [
    { key: 'profile',      label: v.tabs.profile },
    { key: 'vets',         label: v.tabs.vets },
    { key: 'appointments', label: v.tabs.appointments },
    { key: 'exams',        label: v.tabs.exams },
    { key: 'documents',    label: v.tabs.documents },
  ] as const

  type TabKey = (typeof TABS)[number]['key']

  const COMING_SOON: Record<'exams' | 'documents', { icon: string; text: string }> = {
    exams:     { icon: '🧪', text: v.comingSoon.exams },
    documents: { icon: '📄', text: v.comingSoon.documents },
  }

  const pet = useMemo(
    () => MOCK_PETS.find((item) => item.id === selectedPetId) ?? MOCK_PETS[0] ?? null,
    [selectedPetId],
  )

  if (!pet) {
    return (
      <div>
        <BackButton />
        <div className="empty-state">
          <div className="empty-state-icon">🐾</div>
          <h3>{t.pets.noPets}</h3>
          <p>{t.pets.noPetsHint}</p>
        </div>
      </div>
    )
  }

  const profile = getMedicalProfile(pet.id)

  const hasProfileData = Boolean(
    profile.bloodType ||
      profile.allergies ||
      profile.chronicConditionIds.length ||
      profile.customConditions.length ||
      profile.sex !== undefined ||
      profile.neutered !== undefined ||
      profile.surgeries.length ||
      profile.behavioralNotes ||
      profile.environment ||
      profile.parasiteControl ||
      profile.vetQuestions,
  )

  const petAppointments = appointments
    .filter((item) => item.petId === pet.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <BackButton />

      <div className="page-header">
        <h1 className="page-title">{v.pageTitle}</h1>
        <p className="page-subtitle">{v.pageSubtitle}</p>
      </div>

      <div className="pet-selector">
        {MOCK_PETS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pet-chip ${pet.id === item.id ? 'active' : ''}`}
            onClick={() => setSelectedPetId(item.id)}
          >
            {SPECIES_EMOJI[item.species ?? ''] ?? '🐾'} {item.name}
          </button>
        ))}
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <TabMedicalProfile
          profile={profile}
          hasData={hasProfileData}
          onEdit={() => setEditProfileOpen(true)}
          v={v}
        />
      )}

      {activeTab === 'vets' && (
        <TabVets
          vets={vets}
          confirmDeleteId={confirmDeleteVet}
          v={v}
          t={t}
          onAdd={() => { setEditingVet(null); setVetModalOpen(true) }}
          onEdit={(item) => { setEditingVet(item); setVetModalOpen(true) }}
          onRequestDelete={setConfirmDeleteVet}
          onCancelDelete={() => setConfirmDeleteVet(null)}
          onConfirmDelete={(id) => {
            deleteVet(id)
            setConfirmDeleteVet(null)
            showToast(v.toast.vetDeleted)
          }}
        />
      )}

      {activeTab === 'appointments' && (
        <TabAppointments
          petName={pet.name}
          appointments={petAppointments}
          confirmDeleteId={confirmDeleteAppt}
          v={v}
          t={t}
          onAdd={() => { setEditingAppt(null); setApptModalOpen(true) }}
          onEdit={(item) => { setEditingAppt(item); setApptModalOpen(true) }}
          onRequestDelete={setConfirmDeleteAppt}
          onCancelDelete={() => setConfirmDeleteAppt(null)}
          onConfirmDelete={(id) => {
            deleteAppointment(id)
            setConfirmDeleteAppt(null)
            showToast(v.toast.apptDeleted)
          }}
        />
      )}

      {(activeTab === 'exams' || activeTab === 'documents') && (
        <ComingSoonCard tab={activeTab} info={COMING_SOON[activeTab]} comingSoonLabel={v.comingSoon.label} />
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
        onSave={(item) => { addVet(item); showToast(v.toast.vetAdded) }}
        onUpdate={(item) => { updateVet(item); showToast(v.toast.vetUpdated) }}
        initial={editingVet}
      />

      <AddEditAppointmentModal
        isOpen={apptModalOpen}
        onClose={() => setApptModalOpen(false)}
        onSave={(item) => { addAppointment(item); showToast(v.toast.apptAdded) }}
        onUpdate={(item) => { updateAppointment(item); showToast(v.toast.apptUpdated) }}
        initial={editingAppt}
        defaultPetId={pet.id}
      />
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TabMedicalProfile({
  profile, hasData, onEdit, v,
}: {
  profile: PetMedicalProfile
  hasData: boolean
  onEdit: () => void
  v: any
}) {
  if (!hasData) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🩺</div>
        <h3>{v.profile.emptyTitle}</h3>
        <p>{v.profile.emptyText}</p>
        <button className="btn btn-primary" onClick={onEdit}>{v.profile.emptyBtn}</button>
      </div>
    )
  }

  const conditionLabels = profile.chronicConditionIds.map(
    (id) => CONDITIONS_CATALOG.find((item) => item.id === id)?.label ?? id,
  )
  const allConditions = [...conditionLabels, ...profile.customConditions]

  const envLabel: Record<string, string> = {
    apartment: v.profile.envApartment,
    house:     v.profile.envHouse,
    both:      v.profile.envBoth,
  }

  return (
    <div className="tab-content">
      <div className="profile-view">
        <button className="btn btn-secondary btn-sm profile-edit-btn" onClick={onEdit}>
          ✏️ {v.profile.editBtn}
        </button>

        <div className="profile-grid">
          <ProfileRow label={v.profile.sex} value={
            profile.sex === 'male' ? v.profile.sexMale
            : profile.sex === 'female' ? v.profile.sexFemale
            : undefined
          } />
          <ProfileRow label={v.profile.neutered} value={
            profile.neutered === true ? v.profile.neuteredYes
            : profile.neutered === false ? v.profile.neuteredNo
            : undefined
          } />
          {profile.neutered && profile.neuteredAge && (
            <ProfileRow label={v.profile.neuteredAge} value={profile.neuteredAge} />
          )}
          <ProfileRow label={v.profile.bloodType}   value={profile.bloodType} />
          <ProfileRow label={v.profile.allergies}   value={profile.allergies} />
          {profile.environment && (
            <ProfileRow label={v.profile.environment} value={envLabel[profile.environment]} />
          )}
          {profile.livingWithAnimals != null && (
            <ProfileRow
              label={v.profile.livingWithAnimals}
              value={profile.livingWithAnimals ? v.profile.neuteredYes : v.profile.neuteredNo}
            />
          )}
          {profile.parasiteControl && (
            <ProfileRow label={v.profile.parasiteControl} value={profile.parasiteControl} />
          )}
        </div>

        <div className="profile-section-title">{v.profile.conditions}</div>
        {allConditions.length === 0 ? (
          <p className="profile-empty-row">{v.profile.noConditions}</p>
        ) : (
          <div className="profile-tags">
            {allConditions.map((c) => (
              <span key={c} className="profile-tag">{c}</span>
            ))}
          </div>
        )}

        <div className="profile-section-title">{v.profile.surgeries}</div>
        {profile.surgeries.length === 0 ? (
          <p className="profile-empty-row">{v.profile.noSurgeries}</p>
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
              <ProfileRow label={v.profile.behavioralNotes} value={profile.behavioralNotes} />
            )}
            {profile.vetQuestions && (
              <ProfileRow label={v.profile.vetQuestions} value={profile.vetQuestions} />
            )}
          </div>
        )}

        {profile.updatedAt && (
          <p className="profile-updated">
            {v.profile.lastUpdated}{' '}
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

function TabVets({
  vets, confirmDeleteId, onAdd, onEdit, onRequestDelete, onCancelDelete, onConfirmDelete, v, t,
}: {
  vets: VetContact[]
  confirmDeleteId: string | null
  onAdd: () => void
  onEdit: (item: VetContact) => void
  onRequestDelete: (id: string) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: string) => void
  v: any
  t: any
}) {
  return (
    <div className="tab-content">
      {vets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🩺</div>
          <h3>{v.contacts.emptyTitle}</h3>
          <p>{v.contacts.emptyText}</p>
          <button className="btn btn-primary" onClick={onAdd}>{v.contacts.addBtn}</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={onAdd}>{v.contacts.addBtn}</button>
          </div>
          <div className="card-list">
            {vets.map((item) => {
              const typeInfo = VET_TYPES.find((t) => t.value === item.type)
              return (
                <div key={item.id} className="vet-card">
                  <div className="vet-card-main">
                    <div className="vet-card-icon" data-type={item.type ?? 'other'}>
                      {typeInfo?.emoji ?? '🩺'}
                    </div>
                    <div className="vet-card-body">
                      <div className="vet-card-name">{item.name}</div>
                      <div className="vet-card-clinic">{typeInfo?.label} · {item.clinic}</div>
                      {item.specialty && (
                        <div className="vet-card-detail">{t.field.specialty}: {item.specialty}</div>
                      )}
                      <div className="vet-card-phones">
                        <span>{item.phone}</span>
                        {item.phone2 && <span>{item.phone2}</span>}
                      </div>
                      {item.address && <div className="vet-card-detail">{item.address}</div>}
                      {item.petIds.length > 0 && (
                        <div className="vet-card-detail">
                          {v.contacts.sectionPets}:{' '}
                          {MOCK_PETS.filter((p) => item.petIds.includes(p.id))
                            .map((p) => p.name)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="vet-card-footer">
                    <div className="vet-card-footer-info">{v.contacts.titleAdd}</div>
                    <div className="vet-card-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                        {t.btn.edit}
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="confirm-delete">
                          <button className="btn btn-danger btn-sm" onClick={() => onConfirmDelete(item.id)}>
                            {t.btn.confirm}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                            {t.btn.cancel}
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-ghost btn-sm danger" onClick={() => onRequestDelete(item.id)}>
                          {t.btn.delete}
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
  onAdd, onEdit, onRequestDelete, onCancelDelete, onConfirmDelete, v, t,
}: {
  petName: string
  appointments: VetAppointment[]
  confirmDeleteId: string | null
  onAdd: () => void
  onEdit: (item: VetAppointment) => void
  onRequestDelete: (id: string) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: string) => void
  v: any
  t: any
}) {
  const todayDate = new Date().toISOString().split('T')[0]
  const upcoming = appointments.filter(
    (item) => item.nextAppointmentDate && item.nextAppointmentDate >= todayDate,
  )

  return (
    <div className="tab-content">
      {upcoming.length > 0 && (
        <div className="upcoming-section">
          <div className="section-label">{v.appointments.nextLabel}</div>
          {upcoming.map((item) => (
            <NextReturnBanner key={item.id} appointment={item} v={v} t={t} />
          ))}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>{v.appointments.emptyTitle}</h3>
          <p>{v.appointments.emptyText.replace('name', petName)}</p>
          <button className="btn btn-primary" onClick={onAdd}>{v.appointments.addBtn}</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={onAdd}>{v.appointments.addBtn}</button>
          </div>
          <div className="card-list">
            {appointments.map((item) => {
              const typeInfo = APPOINTMENT_TYPES.find((appt) => appt.value === item.type)
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
                        <div className="appt-card-detail">{v.appointments.diagnosis}: {item.diagnosis}</div>
                      )}
                      {item.treatment && (
                        <div className="appt-card-detail">{v.appointments.treatment}: {item.treatment}</div>
                      )}
                      <div className="appt-card-meta">
                        {item.weightKg != null && (
                          <span>{v.appointments.weight}: {item.weightKg} kg</span>
                        )}
                        {item.nextAppointmentDate && (
                          <span>
                            {v.appointments.nextReturn}:{' '}
                            {new Date(`${item.nextAppointmentDate}T12:00:00`).toLocaleDateString(undefined, {
                              day: '2-digit', month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="appt-card-footer">
                    <div className="appt-card-footer-info">{v.appointments.historyLabel}</div>
                    <div className="appt-card-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                        {t.btn.edit}
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="confirm-delete">
                          <button className="btn btn-danger btn-sm" onClick={() => onConfirmDelete(item.id)}>
                            {t.btn.confirm}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                            {t.btn.cancel}
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-ghost btn-sm danger" onClick={() => onRequestDelete(item.id)}>
                          {t.btn.delete}
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

function NextReturnBanner({ appointment, v, t }: { appointment: VetAppointment; v: any; t: any }) {
  if (!appointment.nextAppointmentDate) return null

  const returnDate = new Date(`${appointment.nextAppointmentDate}T12:00:00`)
  const diffDays   = Math.ceil((returnDate.getTime() - Date.now()) / 86_400_000)
  const urgency    = diffDays <= 3

  const timeLabel =
    diffDays <= 0 ? t.vet.time.today
    : diffDays === 1 ? t.vet.time.tomorrow
    : t.vet.time.inDays.replace('n', String(diffDays))

  return (
    <div className={`return-banner ${urgency ? 'urgent' : ''}`}>
      <span className="return-banner-icon">🔄</span>
      <div className="return-banner-body">
        <div className="return-banner-note">
          {appointment.nextAppointmentNote ?? v.appointments.nextLabel}
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