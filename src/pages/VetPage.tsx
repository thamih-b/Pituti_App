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

const L = {
  pageTitle: 'Veterinaria',
  pageSubtitle: 'Salud clínica y registros médicos',

  tabProfile: 'Perfil médico',
  tabVets: 'Mis veterinarios',
  tabAppointments: 'Consultas',
  tabExams: 'Exámenes',
  tabDocuments: 'Documentos',

  comingSoonExams: 'Guarda resultados de exámenes, recetas e informes en un solo lugar.',
  comingSoonDocuments: 'Pasaporte digital y compartición de datos con tu veterinario.',
  comingSoonLabel: 'Próximamente',

  profileEmptyTitle: 'Sin perfil médico',
  profileEmptyText:
    'Rellena el perfil de tu mascota para que el veterinario tenga toda la información de un vistazo.',
  profileEmptyBtn: 'Completar perfil',
  profileEditBtn: 'Editar perfil',

  profileSex: 'Sexo',
  profileSexMale: 'Macho',
  profileSexFemale: 'Hembra',
  profileNeutered: 'Castrado',
  profileNeuteredYes: 'Sí',
  profileNeuteredNo: 'No',
  profileNeuteredAge: 'Edad castración',
  profileBloodType: 'Grupo sanguíneo',
  profileAllergies: 'Alergias',
  profileConditions: 'Condiciones crónicas',
  profileSurgeries: 'Cirugías',
  profileEnvironment: 'Hábitat',
  profileParasite: 'Antiparasitario',
  profileBehavior: 'Comportamiento',
  profileVetQuestions: 'Preguntas para el vet',
  profileEnvApartment: 'Piso',
  profileEnvHouse: 'Casa',
  profileEnvBoth: 'Ambos',
  profileNoConditions: 'Sin condiciones registradas',
  profileNoSurgeries: 'Sin cirugías registradas',
  profileLastUpdated: 'Actualizado',

  vetAddBtn: 'Añadir veterinario',
  vetEmptyTitle: 'Sin veterinarios guardados',
  vetEmptyText: 'Guarda el contacto de tu veterinario para acceder rápidamente.',
  vetSpecialty: 'Especialidad',
  vetAssocPets: 'Mascotas',
  vetEdit: 'Editar',
  vetDelete: 'Eliminar',
  vetDeleteConfirm: 'Confirmar eliminación',
  vetDeleteCancel: 'Cancelar',

  apptAddBtn: 'Registrar consulta',
  apptNextLabel: 'Próximo retorno',
  apptHistoryLabel: 'Historial de consultas',
  apptEmptyTitle: 'Sin consultas registradas',
  apptEmptyText: (name: string) =>
    `Registra la primera consulta de ${name} para llevar el historial.`,
  apptEdit: 'Editar',
  apptDelete: 'Eliminar',
  apptDeleteConfirm: 'Confirmar eliminación',
  apptDeleteCancel: 'Cancelar',
  apptDiagnosis: 'Diagnóstico',
  apptTreatment: 'Tratamiento',
  apptWeight: 'Peso',
  apptNextReturn: 'Retorno',

  noPets: 'No hay mascotas disponibles',
  noPetsHint: 'Necesitas al menos una mascota para usar el módulo de veterinaria.',

  today: 'Hoy',
  tomorrow: 'Mañana',
  inDays: (n: number) => `En ${n} días`,

  toastVetAdded: 'Veterinario añadido',
  toastVetUpdated: 'Veterinario actualizado',
  toastVetDeleted: 'Veterinario eliminado',
  toastApptAdded: 'Consulta registrada',
  toastApptUpdated: 'Consulta actualizada',
  toastApptDeleted: 'Consulta eliminada',
} as const

const TABS = [
  { key: 'profile', label: L.tabProfile },
  { key: 'vets', label: L.tabVets },
  { key: 'appointments', label: L.tabAppointments },
  { key: 'exams', label: L.tabExams },
  { key: 'documents', label: L.tabDocuments },
] as const

type TabKey = (typeof TABS)[number]['key']

const COMING_SOON: Record<'exams' | 'documents', { icon: string; text: string }> = {
  exams: { icon: '🧪', text: L.comingSoonExams },
  documents: { icon: '📄', text: L.comingSoonDocuments },
}

export default function VetPage() {
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
          <h3>{L.noPets}</h3>
          <p>{L.noPetsHint}</p>
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
        <h1 className="page-title">{L.pageTitle}</h1>
        <p className="page-subtitle">{L.pageSubtitle}</p>
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
        />
      )}

      {activeTab === 'vets' && (
        <TabVets
          vets={vets}
          confirmDeleteId={confirmDeleteVet}
          onAdd={() => {
            setEditingVet(null)
            setVetModalOpen(true)
          }}
          onEdit={(item) => {
            setEditingVet(item)
            setVetModalOpen(true)
          }}
          onRequestDelete={setConfirmDeleteVet}
          onCancelDelete={() => setConfirmDeleteVet(null)}
          onConfirmDelete={(id) => {
            deleteVet(id)
            setConfirmDeleteVet(null)
            showToast(L.toastVetDeleted)
          }}
        />
      )}

      {activeTab === 'appointments' && (
        <TabAppointments
          petName={pet.name}
          appointments={petAppointments}
          confirmDeleteId={confirmDeleteAppt}
          onAdd={() => {
            setEditingAppt(null)
            setApptModalOpen(true)
          }}
          onEdit={(item) => {
            setEditingAppt(item)
            setApptModalOpen(true)
          }}
          onRequestDelete={setConfirmDeleteAppt}
          onCancelDelete={() => setConfirmDeleteAppt(null)}
          onConfirmDelete={(id) => {
            deleteAppointment(id)
            setConfirmDeleteAppt(null)
            showToast(L.toastApptDeleted)
          }}
        />
      )}

      {(activeTab === 'exams' || activeTab === 'documents') && (
        <ComingSoonCard tab={activeTab} />
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
        onSave={(item) => {
          addVet(item)
          showToast(L.toastVetAdded)
        }}
        onUpdate={(item) => {
          updateVet(item)
          showToast(L.toastVetUpdated)
        }}
        initial={editingVet}
      />

      <AddEditAppointmentModal
        isOpen={apptModalOpen}
        onClose={() => setApptModalOpen(false)}
        onSave={(item) => {
          addAppointment(item)
          showToast(L.toastApptAdded)
        }}
        onUpdate={(item) => {
          updateAppointment(item)
          showToast(L.toastApptUpdated)
        }}
        initial={editingAppt}
        defaultPetId={pet.id}
      />
    </div>
  )
}

function TabMedicalProfile({
  profile,
  hasData,
  onEdit,
}: {
  profile: PetMedicalProfile
  hasData: boolean
  onEdit: () => void
}) {
  if (!hasData) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🩺</div>
        <h3>{L.profileEmptyTitle}</h3>
        <p>{L.profileEmptyText}</p>
        <button className="btn btn-primary" onClick={onEdit}>
          {L.profileEmptyBtn}
        </button>
      </div>
    )
  }

  const conditionLabels = profile.chronicConditionIds.map(
    (id) => CONDITIONS_CATALOG.find((item) => item.id === id)?.label ?? id,
  )
  const allConditions = [...conditionLabels, ...profile.customConditions]

  const envLabel: Record<string, string> = {
    apartment: L.profileEnvApartment,
    house: L.profileEnvHouse,
    both: L.profileEnvBoth,
  }

  return (
    <div className="tab-content">
      <div className="profile-view">
        <button className="btn btn-secondary btn-sm profile-edit-btn" onClick={onEdit}>
          ✏️ {L.profileEditBtn}
        </button>

        <div className="profile-grid">
          <ProfileRow
            label={L.profileSex}
            value={
              profile.sex === 'male'
                ? L.profileSexMale
                : profile.sex === 'female'
                  ? L.profileSexFemale
                  : undefined
            }
          />
          <ProfileRow
            label={L.profileNeutered}
            value={
              profile.neutered === true
                ? L.profileNeuteredYes
                : profile.neutered === false
                  ? L.profileNeuteredNo
                  : undefined
            }
          />
          {profile.neutered && profile.neuteredAge && (
            <ProfileRow label={L.profileNeuteredAge} value={profile.neuteredAge} />
          )}
          <ProfileRow label={L.profileBloodType} value={profile.bloodType} />
          <ProfileRow label={L.profileAllergies} value={profile.allergies} />
          {profile.environment && (
            <ProfileRow label={L.profileEnvironment} value={envLabel[profile.environment]} />
          )}
          {profile.livingWithAnimals != null && (
            <ProfileRow
              label="Convive con animales"
              value={profile.livingWithAnimals ? 'Sí' : 'No'}
            />
          )}
          {profile.parasiteControl && (
            <ProfileRow label={L.profileParasite} value={profile.parasiteControl} />
          )}
        </div>

        <div className="profile-section-title">{L.profileConditions}</div>
        {allConditions.length === 0 ? (
          <p className="profile-empty-row">{L.profileNoConditions}</p>
        ) : (
          <div className="profile-tags">
            {allConditions.map((condition) => (
              <span key={condition} className="profile-tag">
                {condition}
              </span>
            ))}
          </div>
        )}

        <div className="profile-section-title">{L.profileSurgeries}</div>
        {profile.surgeries.length === 0 ? (
          <p className="profile-empty-row">{L.profileNoSurgeries}</p>
        ) : (
          profile.surgeries.map((surgery) => (
            <div key={surgery.id} className="profile-surgery-row">
              <span className="profile-surgery-name">{surgery.name}</span>
              {surgery.date && (
                <span className="profile-surgery-date">
                  {new Date(`${surgery.date}T12:00:00`).toLocaleDateString('es-ES')}
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
              <ProfileRow label={L.profileBehavior} value={profile.behavioralNotes} />
            )}
            {profile.vetQuestions && (
              <ProfileRow label={L.profileVetQuestions} value={profile.vetQuestions} />
            )}
          </div>
        )}

        {profile.updatedAt && (
          <p className="profile-updated">
            {L.profileLastUpdated} {new Date(profile.updatedAt).toLocaleDateString('es-ES')}
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
  vets,
  confirmDeleteId,
  onAdd,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  vets: VetContact[]
  confirmDeleteId: string | null
  onAdd: () => void
  onEdit: (item: VetContact) => void
  onRequestDelete: (id: string) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: string) => void
}) {
  return (
    <div className="tab-content">


      {vets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🩺</div>
          <h3>{L.vetEmptyTitle}</h3>
          <p>{L.vetEmptyText}</p>
          <button className="btn btn-primary" onClick={onAdd}>
            {L.vetAddBtn}
          </button>
        </div>
      ) : (
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
                    <div className="vet-card-clinic">
                      {typeInfo?.label} · {item.clinic}
                    </div>

                    {item.specialty && (
                      <div className="vet-card-detail">
                        {L.vetSpecialty}: {item.specialty}
                      </div>
                    )}

                    <div className="vet-card-phones">
                      <span>{item.phone}</span>
                      {item.phone2 && <span>{item.phone2}</span>}
                    </div>

                    {item.address && <div className="vet-card-detail">{item.address}</div>}

                    {item.petIds.length > 0 && (
                      <div className="vet-card-detail">
                        {L.vetAssocPets}:{' '}
                        {MOCK_PETS.filter((p) => item.petIds.includes(p.id))
                          .map((p) => p.name)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="vet-card-footer">
                  <div className="vet-card-footer-info">Contacto veterinario</div>

                  <div className="vet-card-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                      {L.vetEdit}
                    </button>

                    {confirmDeleteId === item.id ? (
                      <div className="confirm-delete">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onConfirmDelete(item.id)}
                        >
                          {L.vetDeleteConfirm}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                          {L.vetDeleteCancel}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm danger"
                        onClick={() => onRequestDelete(item.id)}
                      >
                        {L.vetDelete}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TabAppointments({
  petName,
  appointments,
  confirmDeleteId,
  onAdd,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  petName: string
  appointments: VetAppointment[]
  confirmDeleteId: string | null
  onAdd: () => void
  onEdit: (item: VetAppointment) => void
  onRequestDelete: (id: string) => void
  onCancelDelete: () => void
  onConfirmDelete: (id: string) => void
}) {
  const todayDate = new Date().toISOString().split('T')[0]
  const upcoming = appointments.filter(
    (item) => item.nextAppointmentDate && item.nextAppointmentDate >= todayDate,
  )

  return (
    <div className="tab-content">


      {upcoming.length > 0 && (
        <div className="upcoming-section">
          <div className="section-label">{L.apptNextLabel}</div>
          {upcoming.map((item) => (
            <NextReturnBanner key={item.id} appointment={item} />
          ))}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>{L.apptEmptyTitle}</h3>
          <p>{L.apptEmptyText(petName)}</p>
          <button className="btn btn-primary" onClick={onAdd}>
            {L.apptAddBtn}
          </button>
        </div>
      ) : (
        <div className="card-list">
          {appointments.map((item) => {
            const typeInfo = APPOINTMENT_TYPES.find((t) => t.value === item.type)
            const dateLabel = new Date(`${item.date}T12:00:00`).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
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
                      {item.vetName}
                      {item.clinic ? ` · ${item.clinic}` : ''}
                    </div>

                    {item.diagnosis && (
                      <div className="appt-card-detail">
                        {L.apptDiagnosis}: {item.diagnosis}
                      </div>
                    )}

                    {item.treatment && (
                      <div className="appt-card-detail">
                        {L.apptTreatment}: {item.treatment}
                      </div>
                    )}

                    <div className="appt-card-meta">
                      {item.weightKg != null && (
                        <span>{L.apptWeight}: {item.weightKg} kg</span>
                      )}
                      {item.nextAppointmentDate && (
                        <span>
                          {L.apptNextReturn}:{' '}
                          {new Date(`${item.nextAppointmentDate}T12:00:00`).toLocaleDateString(
                            'es-ES',
                            { day: '2-digit', month: 'short' },
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="appt-card-footer">
                  <div className="appt-card-footer-info">Registro clínico</div>

                  <div className="appt-card-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                      {L.apptEdit}
                    </button>

                    {confirmDeleteId === item.id ? (
                      <div className="confirm-delete">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onConfirmDelete(item.id)}
                        >
                          {L.apptDeleteConfirm}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={onCancelDelete}>
                          {L.apptDeleteCancel}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm danger"
                        onClick={() => onRequestDelete(item.id)}
                      >
                        {L.apptDelete}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NextReturnBanner({ appointment }: { appointment: VetAppointment }) {
  if (!appointment.nextAppointmentDate) return null

  const returnDate = new Date(`${appointment.nextAppointmentDate}T12:00:00`)
  const now = new Date()
  const diffDays = Math.ceil((returnDate.getTime() - now.getTime()) / 86_400_000)
  const urgency = diffDays <= 3

  const timeLabel =
    diffDays <= 0 ? L.today : diffDays === 1 ? L.tomorrow : L.inDays(diffDays)

  return (
    <div className={`return-banner ${urgency ? 'urgent' : ''}`}>
      <span className="return-banner-icon">🔄</span>

      <div className="return-banner-body">
        <div className="return-banner-note">
          {appointment.nextAppointmentNote ?? 'Retorno programado'}
        </div>
        <div className="return-banner-vet">
          {appointment.vetName}
          {appointment.clinic ? ` · ${appointment.clinic}` : ''}
        </div>
      </div>

      <div className="return-banner-time">
        <div className="return-banner-label">{timeLabel}</div>
        <div className="return-banner-date">
          {returnDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
        </div>
      </div>
    </div>
  )
}

function ComingSoonCard({ tab }: { tab: 'exams' | 'documents' }) {
  const info = COMING_SOON[tab]

  return (
    <div className="coming-soon-card">
      <div className="coming-soon-icon">{info.icon}</div>
      <div className="coming-soon-label">{L.comingSoonLabel}</div>
      <p className="coming-soon-text">{info.text}</p>
    </div>
  )
}