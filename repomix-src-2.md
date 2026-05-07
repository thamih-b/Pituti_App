This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/api/appointments.ts
src/api/cares.ts
src/api/client.ts
src/api/index.ts
src/api/medicalProfiles.ts
src/api/medications.ts
src/api/notes.ts
src/api/pets.ts
src/api/symptoms.ts
src/api/types.ts
src/api/users.ts
src/api/vaccines.ts
src/api/vets.ts
src/App.tsx
src/assets/care-hand-paw.jpg
src/assets/hero.png
src/assets/icon-pituti-app.png
src/assets/mano-pata.jpg
src/assets/react.svg
src/assets/vite.svg
src/components/AddCareModal.tsx
src/components/AddEditAppointmentModal.tsx
src/components/AddEditVetModal.tsx
src/components/AddMedicationModal.tsx
src/components/AddPetModal.tsx
src/components/AppLayout.tsx
src/components/Avatar.tsx
src/components/BackButton.tsx
src/components/Badge.tsx
src/components/Button.tsx
src/components/CalicoAnimation.tsx
src/components/Card.tsx
src/components/CareDetailModal.tsx
src/components/CareScheduleFields.tsx
src/components/DeleteAccountModal.tsx
src/components/EditCareModal.tsx
src/components/EditMedModal.tsx
src/components/EditPetModal.tsx
src/components/EditVaccineModal.tsx
src/components/EmptyState.tsx
src/components/FooterButtons.tsx
src/components/FormDateField.tsx
src/components/Input.tsx
src/components/InviteSentOverlay.tsx
src/components/MedDetailModal.tsx
src/components/MiniVaccRing.tsx
src/components/Modal.tsx
src/components/NetworkError.tsx
src/components/NewNoteModal.tsx
src/components/NoteModals.tsx
src/components/NotificationPanel.tsx
src/components/OverviewCard.tsx
src/components/PetCard.tsx
src/components/PetChipEditOverlay.tsx
src/components/PetMedicalProfileModal.tsx
src/components/RegisterSymptomModal.tsx
src/components/SkeletonLoader.tsx
src/components/SymptomModals.tsx
src/components/VaccineDetailModal.tsx
src/components/VaccRing.tsx
src/context/CaresContext.tsx
src/context/conditionsCatalog.tsx
src/context/LanguageContext.tsx
src/context/MedicationsContext.tsx
src/context/PetsContext.tsx
src/context/PitutiContext.tsx
src/context/SymptomsContext.tsx
src/context/UserContext.tsx
src/context/VetContext.tsx
src/hooks/useApi.ts
src/hooks/useApiMutation.ts
src/hooks/usePets.ts
src/i18n/i18n-types.d.ts
src/i18n/i18n.ts
src/i18n/locales/en.json
src/i18n/locales/es.json
src/i18n/locales/pt.json
src/i18n/locales/types.ts
src/main.tsx
src/pages/CalendarPage.tsx
src/pages/CaresPage.tsx
src/pages/DashboardPage.tsx
src/pages/LoginPage.tsx
src/pages/MedicationsPage.tsx
src/pages/NotesPage.tsx
src/pages/NotFoundPage.tsx
src/pages/PetDetailPage.tsx
src/pages/PetListPage.tsx
src/pages/SettingsPage.tsx
src/pages/SymptomsPage.tsx
src/pages/VaccinesPage.tsx
src/pages/VetPage.tsx
src/styles/base.css
src/styles/catAnim.css
src/styles/components/badges.css
src/styles/components/buttons.css
src/styles/components/cards.css
src/styles/components/empty-state.css
src/styles/components/forms.css
src/styles/components/modals.css
src/styles/components/progress.css
src/styles/components/table.css
src/styles/components/tabs.css
src/styles/components/timeline.css
src/styles/components/toast.css
src/styles/index.css
src/styles/layout.css
src/styles/pages/calendar.css
src/styles/pages/care.css
src/styles/pages/dashboard.css
src/styles/pages/medications.css
src/styles/pages/pets.css
src/styles/pages/settings.css
src/styles/pages/vet.css
src/styles/responsive.css
src/styles/tokens.css
src/types/index.ts
src/utils/.gitkeep
```

# Files

## File: src/context/PetsContext.tsx
```typescript
// traduzido e mock

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface Pet {
  id:        string
  name:      string
  species:   string
  breed?:    string
  birthDate?: string
  weightKg?: number
  photoUrl?: string
}

export interface VaccineRecord {
  name:     string
  applied:  string
  nextDate: string
  badge:    string
  badgeCls: string
}

interface PetsContextValue {
  pets:            Pet[]
  vaccinesByPet:   Record<string, VaccineRecord[]>
  // ✅ métodos com intenção clara em vez de setState raw
  addPet:          (pet: Pet) => void
  updatePet:       (pet: Pet) => void
  removePet:       (id: string) => void
  setVaccinesByPet: React.Dispatch<React.SetStateAction<Record<string, VaccineRecord[]>>>
}

const PetsContext = createContext<PetsContextValue | null>(null)

export function PetsProvider({ children }: { children: ReactNode }) {
  const [pets,          setPets]          = useState<Pet[]>([])
  const [vaccinesByPet, setVaccinesByPet] = useState<Record<string, VaccineRecord[]>>({})

  const addPet    = useCallback((pet: Pet) => setPets(prev => [...prev, pet]), [])
  const updatePet = useCallback((pet: Pet) => setPets(prev => prev.map(p => p.id === pet.id ? pet : p)), [])
  const removePet = useCallback((id: string) => setPets(prev => prev.filter(p => p.id !== id)), [])

  return (
    <PetsContext.Provider value={{ pets, vaccinesByPet, addPet, updatePet, removePet, setVaccinesByPet }}>
      {children}
    </PetsContext.Provider>
  )
}

export function usePetsContext() {
  const ctx = useContext(PetsContext)
  if (!ctx) throw new Error('usePetsContext must be used inside PetsProvider')
  return ctx
}
```

## File: src/context/UserContext.tsx
```typescript
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  photoUrl: string | null;
  avatar: string;       // iniciales derivadas del nombre
  color: string;        // color de fondo del avatar
  colorFg: string;      // color del texto del avatar
}

// Deriva las iniciales de hasta 2 palabras del nombre
export function deriveAvatar(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const EMPTY_USER: UserProfile = {
  name: '',
  email: '',
  phone: '',
  city: '',
  bio: '',
  photoUrl: null,
  avatar: '?',
  color: 'var(--primary-hl)',
  colorFg: 'var(--primary)',
};

interface UserContextValue {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(EMPTY_USER);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
```

## File: src/i18n/i18n-types.d.ts
```typescript
import type es from './locales/es.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof es
    }
  }
}
```

## File: src/i18n/i18n.ts
```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import pt from './locales/pt.json'

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    pt: { translation: pt },
  },
  lng: (localStorage.getItem('lang') as string) ?? 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

/*USO NOS COMPONENTES:
import { useTranslation } from 'react-i18next'

export default function VetPage() {
  const { t } = useTranslation()

  return <h1>{t('vet.pageTitle')}</h1>
}
// Strings dinâmicas (substituição de n)

O i18next tem interpolação nativa — em vez de .replace('n', petName):
es.json
{ "notFound": { "hint": "La ruta {{path}} no existe en Pituti" } }  
 PARA:
 t('notFound.hint', { path: pathname })

*/
```

## File: src/i18n/locales/en.json
```json
{
  "nav": {
    "main": "Main",
    "health": "Health",
    "account": "Account",
    "dashboard": "Dashboard",
    "pets": "My Pets",
    "cares": "Daily Care",
    "vaccines": "Vaccines",
    "medications": "Medications",
    "symptoms": "Symptoms",
    "notes": "Notes",
    "settings": "Settings",
    "calendar": "Calendar",
    "vet": "Vet",
    "collapse": "Collapse"
  },
  "btn": {
    "save": "Save",
    "saveChanges": "Save changes",
    "cancel": "Cancel",
    "close": "Close",
    "edit": "Edit",
    "delete": "Delete",
    "add": "Add",
    "register": "Register",
    "confirm": "Confirm",
    "discard": "Discard",
    "export": "Export",
    "invite": "Invite",
    "share": "Share",
    "back": "Back",
    "seeAll": "See all",
    "loading": "Loading…",
    "done": "Done",
    "resolve": "Mark resolved",
    "archive": "Archive",
    "unarchive": "Unarchive",
    "reopen": "Reopen",
    "new": "New",
    "update": "Update",
    "optional": "optional",
        "confirmDelete": "Confirm delete?",
        "no": "No"
  },
  "field": {
    "name": "Name",
    "date": "Date",
    "time": "Time",
    "notes": "Notes",
    "phone": "Phone",
    "address": "Address",
    "specialty": "Specialty",
    "clinic": "Clinic",
    "weight": "Weight",
    "cost": "Cost",
    "email": "Email",
    "vet": "Veterinarian",
    "yes": "Yes",
    "no": "No",
    "birthDate": "Date of birth",
"breed":     "Breed"
  },
  "dashboard": {
    "greeting_morning": "Good morning",
    "greeting_afternoon": "Good afternoon",
    "greeting_evening": "Good evening",
    "todayCares": "Today's care",
    "upcomingEvents": "Upcoming events",
    "allGood": "All up to date ✓",
    "alerts": "Alerts",
    "noAlerts": "No active alerts ✓",
    "noActiveSymptoms": "No active symptoms",
    "addFirstPet": "Add your first pet",
    "pendingTasks": "pending"
  },
  "pets": {
    "title": "My Pets",
    "subtitle": "registered pets",
    "new": "New pet",
    "noResults": "No results",
    "noResultsHint": "Try different filters.",
    "noPets": "No pets",
    "noPetsHint": "Add your first pet to get started.",
    "addPet": "Add pet",
    "search": "Search",
    "searchHint": "Search by name, species or breed…",
    "species": "Species",
    "allSpecies": "All",
    "name": "Name",
    "breed": "Breed",
    "birthDate": "Birth date",
    "age": "Age",
    "health": "Health",
    "lastActivity": "Last activity",
    "caregivers": "Caregivers",
    "shareCares": "Share",
    "identity": "Identity",
    "physicalData": "Physical data",
    "optional": "optional",
    "newPetTitle": "New pet",
    "newPetSubtitle": "Complete the details to register",
    "savedPet": "added successfully 🐾",
    "speciesOptions": {
      "cat": "Cat",
      "dog": "Dog",
      "bird": "Bird",
      "rabbit": "Rabbit",
      "reptile": "Reptile",
      "fish": "Fish",
      "other": "Other"
    },
    "newPet":        "New pet",
"addBtn":        "Save pet",
"successSub":    "has been added to your list",
"sectionIdentity": "Identity",
"sectionPhysical": "Physical data",
"sectionId":     "Identification",
"namePh":        "Your {{species}}'s name",
"breedPh":       "E.g. Common European, Mixed breed…",
"color":         "Color",
"colorPh":       "E.g. Orange, Black and white, Tricolor…",
"weight":        "Weight",
"weightPh":      "E.g. 4.2",
"measurements":  "Measurements",
"height":        "Height",
"length":        "Length",
"width":         "Width",
"microchip":     "Microchip no.",
"microchipPh":   "15 digits ISO 11784",
"chipCountry":   "Country",
"chipCountryPh": "E.g. Spain, Argentina…",
"passport":      "Passport",
"passportPh":    "Vet passport / document number",
"badgeNew":      "New",
  "ageUnknown": "Unknown age",
  "months":     "months",
  "savePet":    "Save pet"
},
"petlist": {
  "reload":       "Reload",
  "petCount":     "pet(s)",
  "of":           "of",
  "clearFilters": "Clear"
  },
  "pet": {
    "backToList": "My Pets",
    "changePhoto": "Change photo",
    "toastPhoto": "📸 Photo updated",
    "statusHealthy": "Healthy",
    "unknownBreed": "Unknown breed",
    "years": "years",
    "activeMed": "Active med.",
    "sharedCaregivers": "Shared caregivers",
    "speciesCat": "Cat",
    "speciesDog": "Dog",
    "speciesBird": "Bird",
    "chipSpecies": "Species",
    "chipBirth": "Birth date",
    "chipWeight": "Weight",
    "chipCaregivers": "Caregivers",
    "tabs": {
      "cares": "Care",
      "vaccines": "Vaccines",
      "medications": "Medications",
      "symptoms": "Symptoms",
      "notes": "Notes",
      "history": "History"
    },
    "vacc": {
      "title": "Vaccines",
      "registerBtn": "Register application",
      "empty": "No vaccines",
      "applied": "Applied",
      "next": "Next",
      "expired": "Expired",
      "coverage": "Coverage",
      "coverageTotal": "Vaccine coverage",
      "coverageOk": "Up to date",
      "coveragePending": "Pending / expired",
      "badgeOk": "UP TO DATE",
      "badgeSoon": "EXPIRING SOON",
      "badgeLate": "EXPIRED",
      "toastRegistered": "registered",
      "toastApplied": "💉 Application registered",
      "toastUpdated": "💉 Vaccine updated",
      "modalTitle": "Register vaccine",
      "modalSubtitle": "Application for {{name}}",
      "successTitle": "Registered!",
      "successSub": "Vaccine added to {{name}}'s history",
      "sectionVaccine": "Vaccine",
      "sectionDates": "Dates",
      "sectionExtra": "Additional info",
      "selectLabel": "Select",
      "selectPh": "Choose…",
      "dateApplied": "Application",
      "dateNext": "Next dose",
      "vetPh": "Dr. Smith",
      "errSelect": "Select a vaccine",
      "errDate": "Date is required",
      "errNext": "Next dose is required",
      "errNextAfter": "Must be after the application date"
    },
    "share": {
      "title": "Share care",
      "subtitle": "Invite caregivers for {{name}}",
      "openBtn": "Share",
      "activeCaregivers": "Active caregivers",
      "inviteTitle": "Invite new caregiver",
      "sendBtn": "Send invitation",
      "emailPh": "name@email.com",
      "accessLevel": "Access level",
      "accessReadonly": "Read only",
      "accessReadonlySub": "View records",
      "accessCaregiver": "Caregiver",
      "accessCaregiverSub": "Register care and vaccines",
      "accessFull": "Full access",
      "accessFullSub": "Edit profile and all data",
      "roleOwner": "Owner · full access",
      "roleCaregiver": "Caregiver · can register",
      "badgeYou": "You",
      "errEmail": "Enter a valid email",
      "toastRemoved": "Caregiver removed"
    },
    "cares": {
      "todayTitle": "Today's care",
      "todayProgress": "{{done}} of {{total}} completed",
      "scheduled": "Upcoming scheduled care",
      "done": "Done ✓",
      "register": "Register",
      "periodDay": "day",
      "periodWeek": "week",
      "toastDone": "completed",
      "toastUndone": "unmarked",
      "toastAdded": "added",
      "toastUpdated": "updated",
      "toastDeleted": "Care deleted"
    },
    "symptoms": {
      "title": "{{name}}'s symptoms",
      "registerBtn": "Register",
      "emptyTitle": "{{name}} is doing well",
      "emptyText": "Record any behaviour changes here.",
      "active": "Active",
      "resolved": "Resolved",
      "noneActive": "No active symptoms ✓",
      "noneResolved": "No resolved symptoms",
      "statusActive": "Active",
      "statusResolved": "Resolved",
      "toastAdded": "🌡️ Symptom registered",
      "toastResolved": "✓ Symptom resolved",
      "toastReopened": "↩ Symptom reopened",
      "toastUpdated": "🌡️ Symptom updated"
    },
"notes": {
  "newBtn":        "New",
  "empty":         "No notes yet",
  "toastAdded":    "📋 Note saved",
  "toastArchived": "📦 Note archived",
  "toastRestored": "📋 Note restored",
  "toastDeleted":  "🗑 Note deleted",
  "toastUpdated":  "📋 Note updated"
  

},
    "noteType": {
      "control": "Check-up",
      "observacion": "Observation",
      "emergencia": "Emergency",
      "vacuna": "Post-vaccine",
      "cirugia": "Surgery",
      "otro": "Note"
    },
    "med": {
      "toastAdministered": "administered",
      "toastUpdated": "Medication updated",
      "toastDeleted": "Medication deleted"
    },
    "history": {
      "title": "Full history",
      "event": "Event",
      "detail": "Detail",
      "date": "Date",
      "pet": "Pet",
      "item1Title": "Rabies vaccine applied",
      "3daysAgo": "3 days ago",
      "goVaccines": "Go to Vaccines",
      "editMed": "Edit med.",
      "editNote": "Edit note",
      "toastGoVaccines": "💉 Edit from the Vaccines tab"
    }
  },
  "cares": {
  "title": "Daily cares",
  "subtitle": "All pets routine · today",
  "addCare": "Add care",
  "completed": "completed",
  "all": "All",
  "urgent": "Urgent",
  "pending": "Pending",
  "done": "Done",
  "dayDone": "% of day completed",
  "registerCare": "Register",
  "todayProgress": "{{done}} of {{total}} completed",
  "add": {
    "heroTitle": "New care",
    "heroSub": "Routine for",
    "submitBtn": "Add care",
    "successTitle": "Care added!",
    "successSub": "now appears in the routine",
    "sectionPet": "Pet",
    "sectionCare": "Care",
    "sectionRecurrence": "Recurrence",
    "sectionPrefs": "Preferences",
    "labelIcon": "Icon",
    "labelQuantity": "Quantity or dose",
    "namePh": "E.g. Feeding, Walk, Brushing",
    "quantityPh": "E.g. 80g, 200ml, 2 tablespoons",
    "errTitle": "Care name is required",
    "toast": "Care \"{{title}}\" added",
    "recDaily": "Daily",
    "recXDays": "Every X days",
    "recXHours": "Every X hours",
    "intervalDays": "Interval (days)",
    "intervalHours": "Interval (hours)",
    "unitDays": "day(s)",
    "unitHours": "hour(s)",
    "previewDays": "📅 every {{count}} day(s)",
    "previewHours": "⏰ every {{count}}h",
    "timesPerDay": "Times per day",
    "notifyLabel": "Notifications",
    "notifySub": "Reminder at care time"
  },
  "schedule": {
    "section":         "Schedule & repeat",
    "time":            "Time",
    "everyXDaysLabel": "Repeat every X days",
    "everyXDaysSub":   "Every {{n}} days",
    "dailySub":        "Repeats daily",
    "repeatEvery":     "Repeat every",
    "days":            "days",
    "recurringLabel":  "Recurring",
    "recurringSub":    "Repeats indefinitely",
    "onceSub":         "Done only once"
  },
  "edit": {
    "title":             "Edit care",
    "sectionIcon":       "Icon",
    "sectionRecurrence": "Recurrence",
    "sectionPrefs":      "Preferences",
    "namePh":            "Care name",
    "recDaily":          "Daily",
    "recXDays":          "Every X days",
    "recXHours":         "Every X hours",
    "intervalDays":      "Interval (days)",
    "intervalHours":     "Interval (hours)",
    "hours":             "hour(s)",
    "previewDays":       "📅 every {{n}} day(s)",
    "previewHours":      "⏰ every {{n}}h",
    "timesPerDay":       "Times per day",
    "quantity":          "Quantity / dose",
    "quantityPh":        "E.g. 80g, 200ml, 1 tab.",
    "notifyLabel":       "Notifications",
    "notifySub":         "Reminder at care time"
  },"scheduled": "Upcoming scheduled"
},
  "vaccines": {
    "title": "Vaccines",
    "subtitle": "Vaccination tracking for your pets",
    "register": "💉 Register vaccine",
    "coverage": "Coverage",
    "upToDate": "Up to date",
    "expiringSoon": "Expiring soon",
    "expired": "Expired",
    "lastApplied": "Last applied",
    "nextDose": "Next dose",
    "applied": "Applied",
    "noVaccines": "No vaccines registered",
    "edit": {
  "title": "Edit vaccine",
  "saveBtn": "Save changes",
  "successTitle": "Vaccine updated",
  "sectionDates": "Dates",
  "labelApplied": "Last application",
  "labelNext": "Next dose *",
  "namePh": "Vaccine name",
  "appliedPh": "E.g. 15 Apr 2026",
  "errNext": "Next dose is required",
  "toastUpdated": "updated"


},
"calSubtitle": "Vaccines and medications for all your pets"
  },
  "medications": {
    "title": "Medications",
    "subtitle": "Active and archived treatments",
    "add": "+ Add medication",
    "active": "Active",
    "history": "History",
    "adherence": "Treatment adherence",
    "nextDoses": "Next doses",
    "dose": "Dose",
    "frequency": "Frequency",
    "startDate": "Start",
    "endDate": "End",
    "finished": "Finished",
      "emptyActive":   "No active medications",
  "emptyHistory":  "No medication history",
  "nextDose":      "Next dose",
  "unarchive":     "Reactivate",
  "edit": {
  "title": "Edit medication",
  "sectionType": "Type",
  "sectionMed": "Medication",
  "sectionPeriod": "Period",
  "labelDose": "Dose",
  "labelFreq": "Frequency",
  "labelStart": "Start",
  "labelEnd": "End (optional)",
  "endHint": "Leave empty if ongoing",
  "confirmDelete": "Confirm delete?",
  "toastUpdated": "updated",
  "freqBiweekly": "Biweekly",
"freqMonthly":  "Monthly",
"freqEvery3m":  "Every 3 months",
"freqSingle":   "Single dose",
"errName":      "Medication name is required",
"errDose":      "Please enter the dose",
"errStart":     "Start date is required",
"errEnd":       "End date must be after start date",
"namePh":       "E.g. Bravecto, Amoxicillin…",
"dosePh":       "E.g. 1 tablet, 2.5ml…",
"notesPh":      "Reactions, vet instructions, batch number…"

},
"freq": {
  "daily": "Daily",
  "every12h": "Every 12 hours",
  "every8h": "Every 8 hours",
  "weekly": "Weekly",
  "biweekly": "Biweekly",
  "monthly": "Monthly",
  "every3months": "Every 3 months",
  "single": "Single dose",
    "every3m":  "Every 3 months"
}
  },
  "symptoms": {
    "title": "Symptoms",
    "subtitle": "Behaviour and health observations",
    "register": "+ Register symptom",
    "active": "Active",
    "resolved": "Resolved",
    "history": "History",
    "severity": "Severity",
    "category": "Category",
    "date": "Date",
    "notes": "Notes",
    "noActive": "No active symptoms ✓",
    "noResolved": "No resolved symptoms",
    "markResolved": "Mark as resolved",
    "reopen": "↩ Reopen",
    "severityOptions": {
      "leve": "Mild",
      "moderado": "Moderate",
      "grave": "Severe",
      "emergencia": "Emergency"
    },
    "categoryOptions": {
      "digestivo": "Digestive",
      "respiratorio": "Respiratory",
      "piel": "Skin",
      "comportamiento": "Behaviour",
      "movimiento": "Movement",
      "ocular": "Ocular",
      "otro": "Other"
    },
    "page": {
  "inObservation": "Under observation",
  "inObs": "obs."
},
"errDescription":  "Please describe the observed symptom",
"whatObserved":    "What did you observe?",
"descriptionPh":   "E.g. Dry cough since yesterday morning. No fever but seems tired…",
"description":     "Description",
"startDate":       "Start date",
"notesPh":         "Current medications, behavioural changes…",
"severitySub": {
  "leve":       "No urgency",
  "moderado":   "Monitor closely",
  "grave":      "Vet visit needed",
  "emergencia": "Urgent — act now"
}
  },
  "notes": {
    "title": "Notes",
    "subtitle": "Vet notes and observations",
    "new": "New note",
    "archived": "Archived",
    "noNotes": "No notes",
    "content": "Content",
    "vet": "Veterinarian",

    "typeOptions": {
      "control": "Check-up",
      "observacion": "Observation",
      "emergencia": "Emergency",
      "vacuna": "Post-vaccine",
      "cirugia": "Surgery",
      "otro": "Other"
    },
    "deleteNote": "Delete note",
    "deleteConfirm": "Delete this note permanently?",
    "deletedNote": "Note deleted",
      "addHint":       "Record a new observation",
      "errContent": "Note content cannot be empty",
"type": "Note type",
"editTitle": "Edit note",
"editSuccess": "Note updated!",
"editBy": "by {{name}}",
"addedBy": "Added by",
"archivedBadge": "📁 Archived",
"replyYou": "You",
"replyAdded": "📝 Note added",
"replyPlaceholder": "Add a note…",
"replyHint": "Ctrl + Enter to send",
"replyBtn": "📝 Add note",
"replySingular": "reply",
"replyPlural": "replies",
"deleteConfirmYes": "Yes, delete"
  },
  "calendar": {
    "title": "Calendar",
    "subtitle": "Monthly view of care, vaccines and vet",
    "today": "Today",
    "allEvents": "All",
    "late": "Expired",
    "soon": "Soon (30d)",
    "upToDate": "Up to date",
    "medication": "Medications",
    "noEvents": "No events on this day",
    "overdueTitle": "overdue event(s)",
    "overdueHint": "View all",
    "monthPrev": "Previous month",
    "monthNext": "Next month",
    "alertsTitle": "Expired vaccines",
    "alertsWarn": "⚠ Contact your vet as soon as possible",
    "vacExpiredTag": "EXPIRED",
    "vacExpiredSince": "Expired:",
    "filterLabel": "Filter calendar",
    "clearFilters": "Clear filters",
    "filterGroupCares": "Care",
    "filterGroupVaccines": "Vaccines",
    "filterGroupVet": "Veterinary",
    "filterPending": "Pending",
    "filterDone": "Done",
    "filterVaccDue": "Upcoming vaccine",
    "filterVaccExpired": "Expired vaccine",
    "filterVetVisit": "Vet appointment",
    "filterVetReturn": "Scheduled return",
    "dayEmpty": "No events on this day",
    "dayCares": "Day's care",
    "dayVaccines": "Vaccines",
    "dayMedications": "Medications",
    "dayVetVisits": "Appointments",
    "editCare": "Edit care",
    "carePending": "Pending",
    "careDone": "Done",
    "careSkipped": "Skipped",
    "vaccineApply": "Apply now",
    "vetVisitKind": "Appointment",
    "vetReturnKind": "Scheduled return",
    "eventsCount": "{{n}} event(s)"
  },
  "vet": {
    "pageTitle": "Veterinary",
    "pageSubtitle": "Clinical health and medical records",
    "tabs": {
      "profile": "Medical profile",
      "vets": "My vets",
      "appointments": "Appointments",
      "exams": "Exams",
      "documents": "Documents"
    },
"vetTypes": {
  "primary": "Primary care",
  "specialist": "Specialist",
  "emergency": "Emergency",
  "other": "Other"
},
    "comingSoon": {
      "exams": "Save exam results, prescriptions and reports in one place.",
      "documents": "Digital passport and data sharing with your vet.",
      "label": "Coming soon"
    },
    "profile": {
      "emptyTitle": "No medical profile",
      "emptyText": "Fill in your pet's profile so the vet has all the information at a glance.",
      "emptyBtn": "Complete profile",
      "editBtn": "Edit profile",
      "lastUpdated": "Updated",
      "noConditions": "No conditions recorded",
      "noSurgeries": "No surgeries recorded",
      "sex": "Sex",
      "sexMale": "Male",
      "sexFemale": "Female",
      "neutered": "Neutered / Spayed",
      "neuteredYes": "Yes",
      "neuteredNo": "No",
      "neuteredAge": "Age at neutering",
      "bloodType": "Blood type",
      "bloodTypePh": "e.g. A, B, AB, DEA 1.1…",
      "bloodTypeHint": "Varies by species — type freely",
      "allergies": "Known allergies",
      "conditions": "Chronic conditions",
      "surgeries": "Surgeries",
      "environment": "Habitat type",
      "envApartment": "Flat / Apartment",
      "envHouse": "House with garden",
      "envBoth": "Both",
      "livingWithAnimals": "Lives with other animals",
      "parasiteControl": "Regular parasite control",
      "behavioralNotes": "Behavioural notes",
      "vetQuestions": "Questions for the vet",
      "modalTitle": "Medical profile",
      "editingFor": "Editing {{name}}'s profile",
      "savedSuccess": "Profile saved",
      "savedSuccessFor": "{{name}}'s history has been updated",
      "sectionBasic": "Basic data",
      "sectionConditions": "Chronic conditions",
      "sectionSurgeries": "Surgeries & procedures",
      "sectionEnvironment": "Environment & behaviour",
      "sectionVetNotes": "Notes for the vet",
      "customConditionPh": "Condition name",
      "addCondition": "Add",
      "surgeryNamePh": "e.g. Neutering, Dental extraction",
      "surgeryNotesPh": "Observations",
      "addSurgery": "+ Add surgery",
      "removeSurgery": "×"
    },
    "contactTypes": {
      "primary": "Primary",
      "specialist": "Specialist",
      "emergency": "Emergency",
      "other": "Other"
    },
    "contacts": {
      "addBtn": "Add vet",
      "emptyTitle": "No vets saved",
      "emptyText": "Save your vet's contact for quick access.",
      "phone2": "Alt. phone",
      "deleteConfirm": "Confirm deletion?",
      "titleAdd": "Add vet",
      "titleEdit": "Edit vet",
      "subtitleAdd": "Save your trusted vet's contact",
      "subtitleEdit": "Editing {{name}}'s contact",
      "sectionType": "Vet type",
      "sectionContact": "Contact details",
      "sectionPets": "Associated pets",
      "sectionNotes": "Additional notes",
      "vetNamePh": "e.g. Dr. Smith",
      "clinicPh": "e.g. City Animal Clinic",
      "specialtyPh": "e.g. Dermatology, Oncology",
      "phonePh": "e.g. +1 555 000 0000",
      "phone2Ph": "e.g. +1 555 111 1111",
      "addressPh": "Street, number, city",
      "notesPh": "Hours, special instructions…",
      "errName": "Name is required",
      "errClinic": "Clinic is required",
      "errPhone": "Phone is required"
    },
    "apptTypes": {
      "routine": "Check-up",
      "emergency": "Emergency",
      "specialist": "Specialist",
      "followup": "Follow-up",
      "exam": "Exams",
      "vaccine": "Vaccine",
      "other": "Other"
    },
    "appointments": {
      "addBtn": "Register appointment",
      "nextLabel": "📅 Next return",
      "historyLabel": "Appointment history",
      "emptyTitle": "No appointments registered",
      "emptyText": "Register {{name}}'s first appointment to start tracking.",
      "deleteConfirm": "Confirm deletion?",
      "diagnosis": "Diagnosis",
      "treatment": "Treatment",
      "weight": "Weight at visit",
      "nextReturn": "Return",
      "sectionDateTime": "Date & time",
      "sectionVet": "Veterinarian",
      "sectionDetails": "Appointment details",
      "sectionFollowUp": "Follow-up",
      "sectionExtra": "Additional data",
      "vetContactLabel": "Saved vet",
      "vetContactNone": "Enter manually",
      "vetNamePh": "e.g. Dr. Smith",
      "clinicPh": "e.g. City Animal Clinic",
      "reason": "Reason for visit",
      "reasonPh": "e.g. Annual check-up, persistent cough…",
      "diagnosisPh": "Vet's diagnosis",
      "treatmentPh": "Medications, doses, instructions…",
      "nextDate": "Return date",
      "nextNote": "Return note",
      "nextNotePh": "e.g. Post-treatment review",
      "weightPh": "e.g. 4.2",
      "cost": "Appointment cost",
      "costPh": "e.g. 45.00",
      "notesPh": "Any relevant observation…",
      "errReason": "Reason is required",
      "errVetName": "Vet's name is required",
      "errDate": "Date is required",
      "register": "Register appointment",
      "update": "Save changes",
      "titleAdd": "Register appointment",
      "titleEdit": "Edit appointment",
      "subtitleAdd": "Save your pet's vet history",
      "subtitleEdit": "Editing appointment on {{date}}"
    },
    "toast": {
      "vetAdded": "Vet added ✓",
      "vetUpdated": "Vet updated ✓",
      "vetDeleted": "Vet removed",
      "apptAdded": "Appointment registered ✓",
      "apptUpdated": "Appointment updated ✓",
      "apptDeleted": "Appointment deleted",
      "profileSaved": "Profile saved ✓"
    },
    "time": {
      "today": "Today",
      "tomorrow": "Tomorrow",
      "inDays": "In {{n}} days",
      "daysAgo": "{{n}} days ago"
    }
  },
  "settings": {
    "title": "Settings",
    "subtitle": "Account and preferences",
    "personalData": "Personal data",
    "personalSubtitle": "Your info in PITUTI",
    "profilePhoto": "Profile photo",
    "photoHint": "JPG, PNG or WebP · Max. 2 MB",
    "changePhoto": "Change",
    "fullName": "Full name",
    "email": "Email address",
    "phone": "Phone",
    "city": "City",
    "about": "About me",
    "fullNamePlaceholder": "Your name and surname",
    "phonePlaceholder": "+1 555 000 0000",
    "cityPlaceholder": "New York, London…",
    "aboutPlaceholder": "Pet lover and carer…",
    "appearance": "Appearance",
    "theme": "App theme",
    "themeHint": "Light or dark",
    "changeTheme": "Change",
    "language": "Language",
    "languageHint": "Español · English · Português",
    "notifications": "Notifications",
    "vaccineAlert": "Vaccines expiring",
    "vaccineAlertHint": "7 days before expiry",
    "medAlert": "Medication doses",
    "medAlertHint": "Daily dose reminder",
    "symptomAlert": "Unresolved symptoms",
    "symptomAlertHint": "When a symptom lasts +3 days",
    "weeklyDigest": "Weekly digest",
    "weeklyDigestHint": "Every Monday by email",
    "urgentAlerts": "Urgent alerts",
    "urgentAlertsHint": "Instant push for emergencies",
    "dangerZone": "Danger zone",
    "exportData": "Export data",
    "exportHint": "Download a CSV with all your pets' history, vaccines, medications and symptoms.",
    "exportBtn": "Export CSV",
    "deleteAccount": "Delete account",
    "deleteHint": "Permanent and irreversible action. All your data, pets and history will be deleted.",
    "deleteBtn": "Delete account",
    "saved": "Saved",
    "deleteModal": {
      "title": "Permanently delete account",
      "subtitle": "This action cannot be undone",
      "willLose": "If you delete your account you will permanently lose:",
      "petProfiles": "Complete profiles for all your pets",
      "vaccines": "Vaccination history and upcoming doses",
      "medications": "All registered medications",
      "records": "Symptoms, notes and vet records",
      "dailyCares": "Daily care routines and configurations",
      "caregivers": "Shared access with other caregivers",
      "warning": "⚠ You will not be able to recover this data after deleting your account.",
      "continue": "Continue →",
      "typePrompt": "To confirm, type",
      "typeWord": "delete",
      "typeError": "Type exactly \"delete\" (without quotes)",
      "confirmBtn": "Permanently delete",
      "finalWarning": "By clicking \"Permanently delete\" your account and all associated data will be permanently erased from PITUTI's servers."},
        "memberSince":   "Member since January 2026 · {{count}} pets",
  "activeAccount": "Active account",
  "petsCount":     "pets",
  "deleteToast":   "Goodbye."
    
  },
  "topbar": {
    "searchPlaceholder": "Search pet, record…",
    "noNotifications": "No new notifications",
    "changeTheme": "Change theme"
  },
  "modal": {
    "close": "Close",
    "editPet": "Edit pet",
    "registerVaccine": "Register vaccine",
    "vaccineApplied": "Application date",
    "vaccineNext": "Next dose",
    "vaccineVet": "Veterinarian (optional)",
    "vaccineNotes": "Notes (optional)",
    "vaccineSaved": "Registered!",
    "selectVaccine": "Select vaccine",
    "shareCares": "Share care",
    "shareInvite": "Invite caregivers for",
    "activeCaregiversLabel": "Active caregivers",
    "inviteNew": "Invite new caregiver",
    "accessLevel": "Access level",
    "sendInvitation": "✉ Send invitation",
    "inviteSent": "Invitation sent!",
    "inviteExpiry": "✓ The invitation link expires in 48 hours",
    "understood": "Got it",
    "removeCaregiver": "Remove",
    "editCare": "Configure care",
    "addInfo": "Additional info",
    "frequency": "Frequency",
    "perDay": "Per day",
    "perWeek": "Per week",
    "perMonth": "Per month",
    "quantity": "Quantity (optional)",
    "notify": "Enable reminder",
    "readOnly": "Read only",
    "readOnlyHint": "View records, cannot edit",
    "caregiver": "Caregiver",
    "caregiverHint": "Register care and vaccines",
    "fullAccess": "Full access",
    "fullAccessHint": "Edit profile and all data",
    "changePhoto": "Change photo",
  "status": "Status"
  },
  "status": {
    "active": "Active",
    "resolved": "Resolved",
    "archived": "Archived",
    "expired": "Expired",
    "soon": "Soon",
    "upToDate": "Up to date",
    "finished": "Finished",
    "new": "New ✓"
  },
  "toast": {
    "changesSaved": "✓ Changes saved successfully",
    "themeChanged": "Theme changed",
    "petAdded": "added successfully 🐾",
    "careRegistered": "Care registered ✓",
    "inviteSent": "✉ Invitation sent to ",
    "symptomResolved": "✓ Symptom resolved",
    "symptomReopened": "↩ Symptom reopened",
    "noteArchived": "📁 Note archived",
    "noteUnarchived": "✓ Note unarchived",
    "noteDeleted": "Note deleted",
    "csvDownloaded": "📄 CSV downloaded successfully",
    "vaccineRegistered": "💉 Vaccine registered",
    "medAdded": "Medication added",
    "photoUpdated": "📸 Photo updated",
    "languageChanged": "Language updated",
      "medSaved":      "Medication saved ✓",
  "medDeleted":    "Medication deleted",
  "medArchived":   "Medication archived ✓",
  "medUnarchived": "Medication reactivated ✓",
  "careUpdated": "updated",
"careDeleted": "Care deleted"
  },
  "dates": {
    "today": "Today",
    "yesterday": "Yesterday",
    "days_ago": "{{n}} days ago",
    "months": [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    "weekdays": [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    "weekdaysShort": [
      "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"
    ],
      "locale": "en-GB"
  },
  "notFound": {
    "title": "Page not found",
    "hint": "The route {{path}} does not exist in Pituti"
  },
  "login": {
    "passwordHint": "Minimum 8 characters",
  "heroTitle": "Care for your\npets with\nlove ❤️",
  "heroSubtitle": "PITUTI helps you track vaccines, medications, daily care and symptoms for all your furry friends.",
  "socialProof": "pets cared for with love",
  "orContinueWith": "or continue with",
  "rememberMe": "Remember me",
  "forgotPassword": "Forgot password?",
  "backToLogin": "Back to login",
  "forgotTitle": "Forgot your password?",
  "forgotSubtitle": "Enter your email and we'll send you a link to reset your password.",
  "emailSentTitle": "Email sent!",
  "emailSentBody": "Check your inbox at {{email}}. The link expires in 30 minutes.",
  "loginTitle": "Welcome back! 👋",
  "loginSubtitle": "Sign in to take care of your pets 🐾",
  "registerTitle": "Create your account 🐾",
  "registerSubtitle": "Start caring for your pets for free",
  "tabLogin": "🔑 Sign in",
  "tabRegister": "✨ Register",
  "submitLogin": "🔑 Sign in",
  "submitRegister": "✨ Create account",
  "submitForgot": "✉️ Send link",
  "submittingLogin": "Signing in…",
  "submittingRegister": "Creating account…",
  "submittingForgot": "Sending…",
  "noAccount": "Don't have an account?",
  "registerFree": "Register for free",
  "hasAccount": "Already have an account?",
  "signIn": "Sign in",
  "enterDemo": "Continue without account (demo) →",
  "termsPrefix": "By registering, you agree to our",
  "termsLink": "Terms of use",
  "termsAnd": "and",
  "privacyLink": "Privacy policy",
  "labelPassword": "Password",
  "labelConfirm": "Confirm password",
  "labelRemember": "Remember me",
  "showPassword": "Show",
  "hidePassword": "Hide",
  "errEmailRequired": "Email is required",
  "errEmailInvalid": "Invalid email",
  "errPasswordRequired": "Password is required",
  "errPasswordMin": "Minimum 8 characters",
  "errPasswordMatch": "Passwords do not match",
  "errNameRequired": "Name is required"
}
}
```

## File: src/i18n/locales/es.json
```json
{
  "nav": {
    "main": "Principal",
    "health": "Salud",
    "account": "Cuenta",
    "dashboard": "Inicio",
    "pets": "Mis mascotas",
    "cares": "Cuidados diarios",
    "vaccines": "Vacunas",
    "medications": "Medicamentos",
    "symptoms": "Síntomas",
    "notes": "Notas",
    "settings": "Ajustes",
    "calendar": "Calendario",
    "vet": "Veterinario",
    "collapse": "Contraer"
  },
  "btn": {
    "save": "Guardar",
    "saveChanges": "Guardar cambios",
    "cancel": "Cancelar",
    "close": "Cerrar",
    "edit": "Editar",
    "delete": "Eliminar",
    "add": "Añadir",
    "register": "Registrar",
    "confirm": "Confirmar",
    "discard": "Descartar",
    "export": "Exportar",
    "invite": "Invitar",
    "share": "Compartir",
    "back": "Volver",
    "seeAll": "Ver todo",
    "loading": "Cargando…",
    "done": "Hecho",
    "resolve": "Marcar resuelto",
    "archive": "Archivar",
    "unarchive": "Desarchivar",
    "reopen": "Reabrir",
    "new": "Nuevo",
    "update": "Actualizar",
    "optional": "opcional",
    "confirmDelete": "¿Confirmar eliminar?",
    "no": "No"
  },
  "field": {
    "name": "Nombre",
    "date": "Fecha",
    "time": "Hora",
    "notes": "Notas",
    "phone": "Teléfono",
    "address": "Dirección",
    "specialty": "Especialidad",
    "clinic": "Clínica",
    "weight": "Peso",
    "cost": "Coste",
    "email": "Email",
    "vet": "Veterinario",
    "yes": "Sí",
    "no": "No",
    "birthDate": "Fecha de nacimiento",
"breed":     "Raza"
  },
  "dashboard": {
    "greeting_morning": "Buenos días",
    "greeting_afternoon": "Buenas tardes",
    "greeting_evening": "Buenas noches",
    "todayCares": "Cuidados de hoy",
    "upcomingEvents": "Próximos eventos",
    "allGood": "Todo al día ✓",
    "alerts": "Alertas",
    "noAlerts": "Sin alertas activas ✓",
    "noActiveSymptoms": "Sin síntomas activos",
    "addFirstPet": "Añade tu primera mascota",
    "pendingTasks": "pendientes"
  },
  "pets": {
    "title": "Mis mascotas",
    "subtitle": "mascotas registradas",
    "new": "Nueva mascota",
    "noResults": "Sin resultados",
    "noResultsHint": "Prueba con otros filtros.",
    "noPets": "Sin mascotas",
    "noPetsHint": "Añade tu primera mascota para empezar.",
    "addPet": "Añadir mascota",
    "search": "Buscar",
    "searchHint": "Buscar por nombre, especie o raza…",
    "species": "Especie",
    "allSpecies": "Todas",
    "name": "Nombre",
    "breed": "Raza",
    "birthDate": "Fecha de nacimiento",
    "weight": "Peso",
    "age": "Edad",
    "health": "Salud",
    "lastActivity": "Última actividad",
    "caregivers": "Cuidadores",
    "shareCares": "Compartir",
    "identity": "Identidad",
    "physicalData": "Datos físicos",
    "optional": "opcional",
    "newPetTitle": "Nueva mascota",
    "newPetSubtitle": "Completa los datos para registrar",
    "savedPet": "añadida con éxito 🐾",
    "speciesOptions": {
      "cat": "Gato",
      "dog": "Perro",
      "bird": "Ave",
      "rabbit": "Conejo",
      "reptile": "Reptil",
      "fish": "Pez",
      "other": "Otro"
    },
  "ageUnknown": "Edad desconocida",
  "months":     "meses",
  "weightPh":   "Ej: 4.2",
  "savePet":    "Guardar mascota",
  "newPet":        "Nueva mascota",
"addBtn":        "Guardar mascota",
"successSub":    "ya está en tu lista de mascotas",
"sectionIdentity": "Identidad",
"sectionPhysical": "Datos físicos",
"sectionId":     "Identificación",
"namePh":        "Nombre de tu {{species}}",
"breedPh":       "Ej: Europeo común, Mestizo…",
"color":         "Color",
"colorPh":       "Ej: Naranja, Blanco y negro, Tricolor…",
"measurements":  "Medidas",
"height":        "Altura",
"length":        "Longitud",
"width":         "Anchura",
"microchip":     "Nº de microchip",
"microchipPh":   "15 dígitos ISO 11784",
"chipCountry":   "País correspondiente",
"chipCountryPh": "Ej: España, Argentina…",
"passport":      "Pasaporte",
"passportPh":    "Nº de pasaporte veterinario / documento",
"badgeNew":      "Nueva"
},
"petlist": {
  "reload":       "Recargar",
  "petCount":     "mascota(s)",
  "of":           "de",
  "clearFilters": "Limpiar"
},
  "pet": {
    "backToList": "Mis mascotas",
    "changePhoto": "Cambiar foto",
    "toastPhoto": "📸 Foto actualizada",
    "statusHealthy": "Saludable",
    "unknownBreed": "Raza desconocida",
    "years": "años",
    "activeMed": "Med. activo",
    "sharedCaregivers": "Cuidadores compartidos",
    "speciesCat": "Gato",
    "speciesDog": "Perro",
    "speciesBird": "Ave",
    "chipSpecies": "Especie",
    "chipBirth": "Nacimiento",
    "chipWeight": "Peso",
    "chipCaregivers": "Cuidadores",
    "tabs": {
      "cares": "Cuidados",
      "vaccines": "Vacunas",
      "medications": "Medicamentos",
      "symptoms": "Síntomas",
      "notes": "Notas",
      "history": "Historial"
    },
    "vacc": {
      "title": "Vacunas",
      "registerBtn": "Registrar aplicación",
      "empty": "Sin vacunas",
      "applied": "Aplicada",
      "next": "Próxima",
      "expired": "Vencida",
      "coverage": "Cobertura",
      "coverageTotal": "Cobertura vacunal",
      "coverageOk": "Vacunas al día",
      "coveragePending": "Pendientes/vencidas",
      "badgeOk": "AL DÍA",
      "badgeSoon": "POR VENCER",
      "badgeLate": "VENCIDA",
      "toastRegistered": "registrada",
      "toastApplied": "💉 Aplicación registrada",
      "toastUpdated": "💉 Vacuna actualizada",
      "modalTitle": "Registrar vacuna",
      "modalSubtitle": "Aplicación en {{name}}",
      "successTitle": "¡Registrado!",
      "successSub": "Vacuna añadida al historial de {{name}}",
      "sectionVaccine": "Vacuna",
      "sectionDates": "Fechas",
      "sectionExtra": "Info adicional",
      "selectLabel": "Seleccionar",
      "selectPh": "Elige…",
      "dateApplied": "Aplicación",
      "dateNext": "Próxima",
      "vetPh": "Dra. García",
      "errSelect": "Selecciona una vacuna",
      "errDate": "Fecha obligatoria",
      "errNext": "Próxima dosis obligatoria",
      "errNextAfter": "Debe ser posterior"
    },
    "share": {
      "title": "Compartir cuidados",
      "subtitle": "Invita a cuidadores de {{name}}",
      "openBtn": "Compartir",
      "activeCaregivers": "Cuidadores activos",
      "inviteTitle": "Invitar nuevo cuidador",
      "sendBtn": "Enviar invitación",
      "emailPh": "nombre@email.com",
      "accessLevel": "Nivel de acceso",
      "accessReadonly": "Solo lectura",
      "accessReadonlySub": "Ver registros",
      "accessCaregiver": "Cuidador",
      "accessCaregiverSub": "Registrar cuidados y vacunas",
      "accessFull": "Acceso completo",
      "accessFullSub": "Editar perfil y todos los datos",
      "roleOwner": "Propietaria · acceso completo",
      "roleCaregiver": "Cuidadora · puede registrar",
      "badgeYou": "Tú",
      "errEmail": "Introduce un email válido",
      "toastRemoved": "Cuidador eliminado"
    },
    "cares": {
      "todayTitle": "Cuidados de hoy",
      "todayProgress": "{{done}} de {{total}} completados",
      "scheduled": "Próximos cuidados programados",
      "done": "Hecho ✓",
      "register": "Registrar",
      "periodDay": "día",
      "periodWeek": "semana",
      "toastDone": "completado",
      "toastUndone": "desmarcado",
      "toastAdded": "añadido",
      "toastUpdated": "actualizado",
      "toastDeleted": "Cuidado eliminado"
    },
    "symptoms": {
      "title": "Síntomas de {{name}}",
      "registerBtn": "Registrar",
      "emptyTitle": "{{name}} está bien",
      "emptyText": "Registra cualquier cambio de comportamiento aquí.",
      "active": "Activos",
      "resolved": "Resueltos",
      "noneActive": "Sin síntomas activos ✓",
      "noneResolved": "Sin síntomas resueltos",
      "statusActive": "Activo",
      "statusResolved": "Resuelto",
      "toastAdded": "🌡️ Síntoma registrado",
      "toastResolved": "✓ Síntoma resuelto",
      "toastReopened": "↩ Síntoma reabierto",
      "toastUpdated": "🌡️ Síntoma actualizado"
    },
    "notes": {
      "newBtn": "Nueva",
      "empty": "Sin notas aún",
      "toastAdded": "📋 Nota guardada",
      "toastArchived": "📦 Nota archivada",
      "toastRestored": "📋 Nota restaurada",
      "toastDeleted": "🗑 Nota eliminada",
      "toastUpdated": "📋 Nota actualizada"

    },
    "noteType": {
      "control": "Control",
      "observacion": "Observación",
      "emergencia": "Emergencia",
      "vacuna": "Post-vacuna",
      "cirugia": "Cirugía",
      "otro": "Nota"
    },
    "med": {
      "toastAdministered": "administrado",
      "toastUpdated": "Medicamento actualizado",
      "toastDeleted": "Medicamento eliminado"
    },
    "history": {
      "title": "Historial completo",
      "event": "Evento",
      "detail": "Detalle",
      "date": "Fecha",
      "pet": "Mascota",
      "item1Title": "Vacuna antirrábica aplicada",
      "3daysAgo": "Hace 3d",
      "goVaccines": "Ir a Vacunas",
      "editMed": "Editar med.",
      "editNote": "Editar nota",
      "toastGoVaccines": "💉 Edita desde la pestaña Vacunas"
    }
  },
"cares": {
  "title": "Cuidados diarios",
  "subtitle": "Rutina de todas las mascotas · hoy",
  "addCare": "Añadir cuidado",
  "completed": "completado",
  "all": "Todos",
  "urgent": "Urgente",
  "pending": "Pendiente",
  "done": "Hecho",
  "dayDone": "% del día completado",
  "registerCare": "Registrar",
  "todayProgress": "{{done}} de {{total}} completado",
  "add": {
    "heroTitle": "Nuevo cuidado",
    "heroSub": "Rutina para",
    "submitBtn": "Añadir cuidado",
    "successTitle": "¡Cuidado añadido!",
    "successSub": "ya aparece en la rutina",
    "sectionPet": "Mascota",
    "sectionCare": "Cuidado",
    "sectionRecurrence": "Recurrencia",
    "sectionPrefs": "Preferencias",
    "labelIcon": "Icono",
    "labelQuantity": "Cantidad o dosis",
    "namePh": "Ej. Alimentación, Paseo, Cepillado",
    "quantityPh": "Ej. 80g, 200ml, 2 cucharadas",
    "errTitle": "El nombre del cuidado es obligatorio",
    "toast": "Cuidado \"{{title}}\" añadido",
    "recDaily": "Diario",
    "recXDays": "A cada X días",
    "recXHours": "A cada X horas",
    "intervalDays": "Intervalo (días)",
    "intervalHours": "Intervalo (horas)",
    "unitDays": "día(s)",
    "unitHours": "hora(s)",
    "previewDays": "📅 cada {{count}} día(s)",
    "previewHours": "⏰ cada {{count}}h",
    "timesPerDay": "Veces al día",
    "notifyLabel": "Notificaciones",
    "notifySub": "Recordatorio a la hora del cuidado"
  },
  "schedule": {
    "section":         "Horario y repetición",
    "time":            "Horario",
    "everyXDaysLabel": "Repetir cada X días",
    "everyXDaysSub":   "Cada {{n}} días",
    "dailySub":        "Se repite diariamente",
    "repeatEvery":     "Repetir cada",
    "days":            "días",
    "recurringLabel":  "Recurrente",
    "recurringSub":    "Se repite indefinidamente",
    "onceSub":         "Se realiza una sola vez"
  },
  "edit": {
    "title":             "Editar cuidado",
    "sectionIcon":       "Icono",
    "sectionRecurrence": "Recurrencia",
    "sectionPrefs":      "Preferencias",
    "namePh":            "Nombre del cuidado",
    "recDaily":          "Diario",
    "recXDays":          "Cada X días",
    "recXHours":         "Cada X horas",
    "intervalDays":      "Intervalo (días)",
    "intervalHours":     "Intervalo (horas)",
    "hours":             "hora(s)",
    "previewDays":       "📅 cada {{n}} día(s)",
    "previewHours":      "⏰ cada {{n}}h",
    "timesPerDay":       "Veces al día",
    "quantity":          "Cantidad / dosis",
    "quantityPh":        "Ej. 80g, 200ml, 1 comp.",
    "notifyLabel":       "Notificaciones",
    "notifySub":         "Recordatorio a la hora del cuidado"
  },
"scheduled": "Próximos programados"
},
  "vaccines": {
    "title": "Vacunas",
    "subtitle": "Seguimiento vacunal de tus mascotas",
    "register": "💉 Registrar vacuna",
    "coverage": "Cobertura",
    "upToDate": "Al día",
    "expiringSoon": "Por vencer",
    "expired": "Vencida",
    "lastApplied": "Última aplicación",
    "nextDose": "Próxima dosis",
    "applied": "Aplicada",
    "noVaccines": "Sin vacunas registradas",
    "edit": {
  "title": "Editar vacuna",
  "saveBtn": "Guardar cambios",
  "successTitle": "Vacuna actualizada",
  "sectionDates": "Fechas",
  "labelApplied": "Última aplicación",
  "labelNext": "Próxima dosis *",
  "namePh": "Nombre de la vacuna",
  "appliedPh": "Ej: 15 abr 2026",
  "errNext": "La próxima dosis es obligatoria",
  "toastUpdated": "actualizada"

},
  "calSubtitle": "Vacunas y medicamentos de todas tus mascotas"

  },
  "medications": {
    "title": "Medicamentos",
    "subtitle": "Tratamientos activos y archivados",
    "add": "+ Añadir medicamento",
    "active": "Activos",
    "history": "Historial",
    "adherence": "Adherencia al tratamiento",
    "nextDoses": "Próximas dosis",
    "dose": "Dosis",
    "frequency": "Frecuencia",
    "startDate": "Inicio",
    "endDate": "Fin",
    "finished": "Finalizado",
      "emptyActive":   "Sin medicamentos activos",
  "emptyHistory":  "Sin historial de medicamentos",
  "nextDose":      "Próxima dosis",
  "unarchive":     "Reactivar",
  "edit": {
  "title": "Editar medicamento",
  "sectionType": "Tipo",
  "sectionMed": "Medicamento",
  "sectionPeriod": "Período",
  "labelDose": "Dosis",
  "labelFreq": "Frecuencia",
  "labelStart": "Inicio",
  "labelEnd": "Fin (opcional)",
  "endHint": "Dejar vacío si continuo",
  "errDose": "Indica la dosis",
  "confirmDelete": "¿Confirmar eliminar?",
  "toastUpdated": "actualizado",
  "freqBiweekly": "Quincenal",
"freqMonthly":  "Mensual",
"freqEvery3m":  "Cada 3 meses",
"freqSingle":   "Única dosis",
"errName":      "El nombre del medicamento es obligatorio",
"errStart":     "La fecha de inicio es obligatoria",
"errEnd":       "La fecha de fin debe ser posterior al inicio",
"namePh":       "Ej: Bravecto, Amoxicilina…",
"dosePh":       "Ej: 1 comprimido, 2.5ml…",
"notesPh":      "Reacciones, instrucciones del veterinario, número de lote…"
},
"freq": {
  "daily": "Diaria",
  "every12h": "Cada 12 horas",
  "every8h": "Cada 8 horas",
  "weekly": "Semanal",
  "biweekly": "Quincenal",
  "monthly": "Mensual",
  "every3months": "Cada 3 meses",
  "single": "Única dosis",
  "every3m":  "Cada 3 meses"

}
  },
  "symptoms": {
    "title": "Síntomas",
    "subtitle": "Observaciones de comportamiento y salud",
    "register": "+ Registrar síntoma",
    "active": "Activos",
    "resolved": "Resueltos",
    "history": "Historial",
    "severity": "Gravedad",
    "category": "Categoría",
    "date": "Fecha",
    "notes": "Notas",
    "noActive": "Sin síntomas activos ✓",
    "noResolved": "Sin síntomas resueltos",
    "markResolved": "Marcar como resuelto",
    "reopen": "↩ Reabrir",
    "severityOptions": {
      "leve": "Leve",
      "moderado": "Moderado",
      "grave": "Grave",
      "emergencia": "Emergencia"
    },
    "categoryOptions": {
      "digestivo": "Digestivo",
      "respiratorio": "Respiratorio",
      "piel": "Piel",
      "comportamiento": "Comportamiento",
      "movimiento": "Movimiento",
      "ocular": "Ocular",
      "otro": "Otro"
    },
    "page": {
  "inObservation": "En observación",
  "inObs": "en obs."
}, "errDescription":  "Describe el síntoma observado",
"whatObserved":    "¿Qué observaste?",
"descriptionPh":   "Ej: Tos seca desde ayer por la mañana. No tiene fiebre pero parece cansado…",
"description":     "Descripción",
"startDate":       "Fecha de inicio",
"notesPh":         "Medicamentos que toma actualmente, cambios de comportamiento…",
"severitySub": {
  "leve":       "Sin urgencia",
  "moderado":   "Observar de cerca",
  "grave":      "Visita veterinaria",
  "emergencia": "Urgente ahora"
}
  },
  "notes": {
    "title": "Notas",
    "subtitle": "Notas veterinarias y observaciones",
    "new": "Nueva nota",
    "archived": "Archivadas",
    "noNotes": "Sin notas",
    "content": "Contenido",
    "vet": "Veterinario",
    "typeOptions": {
      "control": "Control",
      "observacion": "Observación",
      "emergencia": "Emergencia",
      "vacuna": "Post-vacuna",
      "cirugia": "Cirugía",
      "otro": "Otra"
    },
    
    "deleteNote": "Eliminar nota",
    "deleteConfirm": "¿Eliminar esta nota permanentemente?",
    "deletedNote": "Nota eliminada",
      "addHint": "Registra una nueva observación",
      "errContent": "El contenido de la nota no puede estar vacío",
"type": "Tipo de nota",
"editTitle": "Editar nota",
"editSuccess": "¡Nota actualizada!",
"editBy": "por {{name}}",
"addedBy": "Añadida por",
"archivedBadge": "📁 Archivada",
"replyYou": "Tú",
"replyAdded": "📝 Nota añadida",
"replyPlaceholder": "Añadir una nota…",
"replyHint": "Ctrl + Enter para enviar",
"replyBtn": "📝 Añadir nota",
"replySingular": "respuesta",
"replyPlural": "respuestas",
"deleteConfirmYes": "Sí, eliminar"


  },
  "calendar": {
    "title": "Calendario",
    "subtitle": "Vista mensual de cuidados, vacunas y veterinario",
    "today": "Hoy",
    "allEvents": "Todos",
    "late": "Vencido",
    "soon": "Próximo (30d)",
    "upToDate": "Al día",
    "medication": "Medicamentos",
    "noEvents": "Sin eventos este día",
    "overdueTitle": "evento(s) vencido(s)",
    "overdueHint": "Ver todos",
    "monthPrev": "Mes anterior",
    "monthNext": "Mes siguiente",
    "alertsTitle": "Vacunas vencidas",
    "alertsWarn": "⚠ Contacta con tu veterinario lo antes posible",
    "vacExpiredTag": "VENCIDA",
    "vacExpiredSince": "Vencida:",
    "filterLabel": "Filtrar calendario",
    "clearFilters": "Limpiar filtros",
    "filterGroupCares": "Cuidados",
    "filterGroupVaccines": "Vacunas",
    "filterGroupVet": "Veterinario",
    "filterPending": "Pendiente",
    "filterDone": "Hecho",
    "filterVaccDue": "Vacuna próxima",
    "filterVaccExpired": "Vacuna vencida",
    "filterVetVisit": "Consulta veterinaria",
    "filterVetReturn": "Retorno programado",
    "dayEmpty": "Sin eventos este día",
    "dayCares": "Cuidados del día",
    "dayVaccines": "Vacunas",
    "dayMedications": "Medicamentos",
    "dayVetVisits": "Consultas",
    "editCare": "Editar cuidado",
    "carePending": "Pendiente",
    "careDone": "Hecho",
    "careSkipped": "Omitido",
    "vaccineApply": "Aplicar ahora",
    "vetVisitKind": "Consulta",
    "vetReturnKind": "Retorno programado",
    "eventsCount": "{{n}} evento(s)"
  },
  "vet": {
    "pageTitle": "Veterinario",
    "pageSubtitle": "Salud clínica e historial médico",
    "tabs": {
      "profile": "Perfil médico",
      "vets": "Mis vets",
      "appointments": "Consultas",
      "exams": "Exámenes",
      "documents": "Documentos"
    },
      "vetTypes": {
    "primary": "Clínica principal",
    "specialist": "Especialista",
    "emergency": "Urgencias",
    "other": "Otro"
  },
    "comingSoon": {
      "exams": "Guarda resultados de exámenes, recetas e informes en un solo lugar.",
      "documents": "Pasaporte digital y compartición de datos con tu veterinario.",
      "label": "Próximamente"
    },
    "profile": {
      "emptyTitle": "Sin perfil médico",
      "emptyText": "Rellena el perfil de tu mascota para que el veterinario tenga toda la información de un vistazo.",
      "emptyBtn": "Completar perfil",
      "editBtn": "Editar perfil",
      "lastUpdated": "Actualizado",
      "noConditions": "Sin condiciones registradas",
      "noSurgeries": "Sin cirugías registradas",
      "sex": "Sexo",
      "sexMale": "Macho",
      "sexFemale": "Hembra",
      "neutered": "Castrado / Esterilizado",
      "neuteredYes": "Sí",
      "neuteredNo": "No",
      "neuteredAge": "Edad al castrar",
      "bloodType": "Grupo sanguíneo",
      "bloodTypePh": "p. ej. A, B, AB, DEA 1.1…",
      "bloodTypeHint": "Varía según la especie — escribe libremente",
      "allergies": "Alergias conocidas",
      "conditions": "Condiciones crónicas",
      "surgeries": "Cirugías",
      "environment": "Tipo de hábitat",
      "envApartment": "Piso / Apartamento",
      "envHouse": "Casa con jardín",
      "envBoth": "Ambos",
      "livingWithAnimals": "Convive con otros animales",
      "parasiteControl": "Control antiparasitario regular",
      "behavioralNotes": "Notas de comportamiento",
      "vetQuestions": "Preguntas para el veterinario",
      "modalTitle": "Perfil médico",
      "editingFor": "Editando el perfil de {{name}}",
      "savedSuccess": "Perfil guardado",
      "savedSuccessFor": "El historial de {{name}} ha sido actualizado",
      "sectionBasic": "Datos básicos",
      "sectionConditions": "Condiciones crónicas",
      "sectionSurgeries": "Cirugías y procedimientos",
      "sectionEnvironment": "Entorno y comportamiento",
      "sectionVetNotes": "Notas para el veterinario",
      "customConditionPh": "Nombre de la condición",
      "addCondition": "Añadir",
      "surgeryNamePh": "p. ej. Castración, Extracción dental",
      "surgeryNotesPh": "Observaciones",
      "addSurgery": "+ Añadir cirugía",
      "removeSurgery": "×"
    },
    "contactTypes": {
      "primary": "Principal",
      "specialist": "Especialista",
      "emergency": "Urgencias",
      "other": "Otro"
    },
    "contacts": {
      "addBtn": "Añadir veterinario",
      "emptyTitle": "Sin veterinarios guardados",
      "emptyText": "Guarda el contacto de tu veterinario para acceso rápido.",
      "phone2": "Teléfono alternativo",
      "deleteConfirm": "¿Confirmar eliminación?",
      "titleAdd": "Añadir veterinario",
      "titleEdit": "Editar veterinario",
      "subtitleAdd": "Guarda el contacto de tu veterinario de confianza",
      "subtitleEdit": "Editando el contacto de {{name}}",
      "sectionType": "Tipo de veterinario",
      "sectionContact": "Datos de contacto",
      "sectionPets": "Mascotas asociadas",
      "sectionNotes": "Notas adicionales",
      "vetNamePh": "p. ej. Dr. García",
      "clinicPh": "p. ej. Clínica Veterinaria Ciudad",
      "specialtyPh": "p. ej. Dermatología, Oncología",
      "phonePh": "p. ej. +34 600 000 000",
      "phone2Ph": "p. ej. +34 611 111 111",
      "addressPh": "Calle, número, ciudad",
      "notesPh": "Horarios, instrucciones especiales…",
      "errName": "El nombre es obligatorio",
      "errClinic": "La clínica es obligatoria",
      "errPhone": "El teléfono es obligatorio"
    },
    "apptTypes": {
      "routine": "Revisión",
      "emergency": "Urgencia",
      "specialist": "Especialista",
      "followup": "Seguimiento",
      "exam": "Exámenes",
      "vaccine": "Vacuna",
      "other": "Otro"
    },
    "appointments": {
      "addBtn": "Registrar consulta",
      "nextLabel": "📅 Próxima revisión",
      "historyLabel": "Historial de consultas",
      "emptyTitle": "Sin consultas registradas",
      "emptyText": "Registra la primera consulta de {{name}} para empezar el seguimiento.",
      "deleteConfirm": "¿Confirmar eliminación?",
      "diagnosis": "Diagnóstico",
      "treatment": "Tratamiento",
      "weight": "Peso en consulta",
      "nextReturn": "Retorno",
      "sectionDateTime": "Fecha y hora",
      "sectionVet": "Veterinario",
      "sectionDetails": "Detalles de la consulta",
      "sectionFollowUp": "Seguimiento",
      "sectionExtra": "Datos adicionales",
      "vetContactLabel": "Veterinario guardado",
      "vetContactNone": "Introducir manualmente",
      "vetNamePh": "p. ej. Dr. García",
      "clinicPh": "p. ej. Clínica Veterinaria Ciudad",
      "reason": "Motivo de la consulta",
      "reasonPh": "p. ej. Revisión anual, tos persistente…",
      "diagnosisPh": "Diagnóstico del veterinario",
      "treatmentPh": "Medicamentos, dosis, instrucciones…",
      "nextDate": "Fecha de retorno",
      "nextNote": "Nota de retorno",
      "nextNotePh": "p. ej. Revisión post-tratamiento",
      "weightPh": "p. ej. 4.2",
      "cost": "Coste de la consulta",
      "costPh": "p. ej. 45.00",
      "notesPh": "Cualquier observación relevante…",
      "errReason": "El motivo es obligatorio",
      "errVetName": "El nombre del veterinario es obligatorio",
      "errDate": "La fecha es obligatoria",
      "register": "Registrar consulta",
      "update": "Guardar cambios",
      "titleAdd": "Registrar consulta",
      "titleEdit": "Editar consulta",
      "subtitleAdd": "Guarda el historial veterinario de tu mascota",
      "subtitleEdit": "Editando consulta del {{date}}"
    },
    "toast": {
      "vetAdded": "Veterinario añadido ✓",
      "vetUpdated": "Veterinario actualizado ✓",
      "vetDeleted": "Veterinario eliminado",
      "apptAdded": "Consulta registrada ✓",
      "apptUpdated": "Consulta actualizada ✓",
      "apptDeleted": "Consulta eliminada",
      "profileSaved": "Perfil guardado ✓"
    },
    "time": {
      "today": "Hoy",
      "tomorrow": "Mañana",
      "inDays": "En {{n}} días",
      "daysAgo": "Hace {{n}} días"
    }
  },
  "settings": {
    "title": "Ajustes",
    "subtitle": "Cuenta y preferencias",
    "personalData": "Datos personales",
    "personalSubtitle": "Tu información en PITUTI",
    "profilePhoto": "Foto de perfil",
    "photoHint": "JPG, PNG o WebP · Máx. 2 MB",
    "changePhoto": "Cambiar",
    "fullName": "Nombre completo",
    "email": "Correo electrónico",
    "phone": "Teléfono",
    "city": "Ciudad",
    "about": "Sobre mí",
    "fullNamePlaceholder": "Tu nombre y apellidos",
    "phonePlaceholder": "+34 600 000 000",
    "cityPlaceholder": "Madrid, Barcelona…",
    "aboutPlaceholder": "Amante de los animales…",
    "appearance": "Apariencia",
    "theme": "Tema de la app",
    "themeHint": "Claro u oscuro",
    "changeTheme": "Cambiar",
    "language": "Idioma",
    "languageHint": "Español · English · Português",
    "notifications": "Notificaciones",
    "vaccineAlert": "Vacunas por vencer",
    "vaccineAlertHint": "7 días antes del vencimiento",
    "medAlert": "Dosis de medicamentos",
    "medAlertHint": "Recordatorio de dosis diaria",
    "symptomAlert": "Síntomas sin resolver",
    "symptomAlertHint": "Cuando un síntoma dura +3 días",
    "weeklyDigest": "Resumen semanal",
    "weeklyDigestHint": "Cada lunes por email",
    "urgentAlerts": "Alertas urgentes",
    "urgentAlertsHint": "Push inmediato para emergencias",
    "dangerZone": "Zona de peligro",
    "exportData": "Exportar datos",
    "exportHint": "Descarga un CSV con todo el historial de tus mascotas, vacunas, medicamentos y síntomas.",
    "exportBtn": "Exportar CSV",
    "deleteAccount": "Eliminar cuenta",
    "deleteHint": "Acción permanente e irreversible. Se eliminarán todos tus datos, mascotas e historial.",
    "deleteBtn": "Eliminar cuenta",
    "saved": "Guardado",
    "deleteModal": {
      "title": "Eliminar cuenta permanentemente",
      "subtitle": "Esta acción no se puede deshacer",
      "willLose": "Si eliminas tu cuenta perderás permanentemente:",
      "petProfiles": "Perfiles completos de todas tus mascotas",
      "vaccines": "Historial vacunal y próximas dosis",
      "medications": "Todos los medicamentos registrados",
      "records": "Síntomas, notas y registros veterinarios",
      "dailyCares": "Rutinas de cuidados diarios y configuraciones",
      "caregivers": "Acceso compartido con otros cuidadores",
      "warning": "⚠ No podrás recuperar estos datos tras eliminar tu cuenta.",
      "continue": "Continuar →",
      "typePrompt": "Para confirmar, escribe",
      "typeWord": "eliminar",
      "typeError": "Escribe exactamente \"eliminar\" (sin comillas)",
      "confirmBtn": "Eliminar permanentemente",
      "finalWarning": "Al hacer clic en \"Eliminar permanentemente\" tu cuenta y todos los datos asociados serán borrados para siempre de los servidores de PITUTI."
    },
      "memberSince":   "Miembro desde enero 2026 · {{count}} mascotas",
  "activeAccount": "Cuenta activa",
  "petsCount":     "mascotas",
  "deleteToast":   "Hasta pronto."
  },
  "topbar": {
    "searchPlaceholder": "Buscar mascota, registro…",
    "noNotifications": "Sin notificaciones nuevas",
    "changeTheme": "Cambiar tema"
  },
  "modal": {
    "close": "Cerrar",
    "editPet": "Editar mascota",
    "registerVaccine": "Registrar vacuna",
    "vaccineApplied": "Fecha de aplicación",
    "vaccineNext": "Próxima dosis",
    "vaccineVet": "Veterinario (opcional)",
    "vaccineNotes": "Notas (opcional)",
    "vaccineSaved": "¡Registrado!",
    "selectVaccine": "Seleccionar vacuna",
    "shareCares": "Compartir cuidados",
    "shareInvite": "Invita a cuidadores de",
    "activeCaregiversLabel": "Cuidadores activos",
    "inviteNew": "Invitar nuevo cuidador",
    "accessLevel": "Nivel de acceso",
    "sendInvitation": "✉ Enviar invitación",
    "inviteSent": "¡Invitación enviada!",
    "inviteExpiry": "✓ El enlace de invitación caduca en 48 horas",
    "understood": "Entendido",
    "removeCaregiver": "Eliminar",
    "editCare": "Configurar cuidado",
    "addInfo": "Info adicional",
    "frequency": "Frecuencia",
    "perDay": "Por día",
    "perWeek": "Por semana",
    "perMonth": "Por mes",
    "quantity": "Cantidad (opcional)",
    "notify": "Activar recordatorio",
    "readOnly": "Solo lectura",
    "readOnlyHint": "Ver registros, sin editar",
    "caregiver": "Cuidador",
    "caregiverHint": "Registrar cuidados y vacunas",
    "fullAccess": "Acceso completo",
    "fullAccessHint": "Editar perfil y todos los datos",
    "changePhoto": "Cambiar foto",
  "status": "Estado"
  },
  "status": {
    "active": "Activo",
    "resolved": "Resuelto",
    "archived": "Archivado",
    "expired": "Vencido",
    "soon": "Próximo",
    "upToDate": "Al día",
    "finished": "Finalizado",
    "new": "Nuevo ✓"
  },
  "toast": {
    "changesSaved": "✓ Cambios guardados correctamente",
    "themeChanged": "Tema cambiado",
    "petAdded": "añadida con éxito 🐾",
    "careRegistered": "Cuidado registrado ✓",
    "inviteSent": "✉ Invitación enviada a ",
    "symptomResolved": "✓ Síntoma resuelto",
    "symptomReopened": "↩ Síntoma reabierto",
    "noteArchived": "📁 Nota archivada",
    "noteUnarchived": "✓ Nota desarchivada",
    "noteDeleted": "Nota eliminada",
    "csvDownloaded": "📄 CSV descargado correctamente",
    "vaccineRegistered": "💉 Vacuna registrada",
    "medAdded": "Medicamento añadido",
    "photoUpdated": "📸 Foto actualizada",
    "languageChanged": "Idioma actualizado",
      "medSaved":          "Medicamento guardado ✓",
  "medDeleted":        "Medicamento eliminado",
  "medArchived":       "Medicamento archivado ✓",
  "medUnarchived":     "Medicamento reactivado ✓",
  "careUpdated": "actualizado",
"careDeleted": "Cuidado eliminado"
  },
  "dates": {
    "today": "Hoy",
    "yesterday": "Ayer",
    "days_ago": "Hace {{n}} días",
    "months": [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],
    "weekdays": [
      "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    ],
    "weekdaysShort": [
      "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"
    ],
      "locale": "es-ES"
  },
  "notFound": {
    "title": "Página no encontrada",
    "hint": "La ruta {path} no existe en Pituti"
  },
  "login": {
    "passwordHint": "Mínimo 8 caracteres",
  "heroTitle": "Cuida a tus\nmascotas con\namor ❤️",
  "heroSubtitle": "PITUTI te ayuda a llevar el control de vacunas, medicamentos, cuidados diarios y síntomas de todos tus peludos.",
  "socialProof": "mascotas cuidadas con amor",
  "orContinueWith": "o continuar con",
  "rememberMe": "Recordarme",
  "forgotPassword": "¿Olvidaste tu contraseña?",
  "backToLogin": "Volver al inicio de sesión",
  "forgotTitle": "¿Olvidaste tu contraseña?",
  "forgotSubtitle": "Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.",
  "emailSentTitle": "¡Email enviado!",
  "emailSentBody": "Revisa tu bandeja de entrada en {{email}}. El enlace expira en 30 minutos.",
  "loginTitle": "¡Bienvenida de vuelta! 👋",
  "loginSubtitle": "Accede para cuidar a tus mascotas 🐾",
  "registerTitle": "Crea tu cuenta 🐾",
  "registerSubtitle": "Empieza a cuidar a tus mascotas gratis",
  "tabLogin": "🔑 Entrar",
  "tabRegister": "✨ Registrarse",
  "submitLogin": "🔑 Iniciar sesión",
  "submitRegister": "✨ Crear cuenta",
  "submitForgot": "✉️ Enviar enlace",
  "submittingLogin": "Entrando…",
  "submittingRegister": "Creando cuenta…",
  "submittingForgot": "Enviando…",
  "noAccount": "¿No tienes cuenta?",
  "registerFree": "Regístrate gratis",
  "hasAccount": "¿Ya tienes cuenta?",
  "signIn": "Inicia sesión",
  "enterDemo": "Entrar sin cuenta (demo) →",
  "termsPrefix": "Al registrarte, aceptas nuestros",
  "termsLink": "Términos de uso",
  "termsAnd": "y",
  "privacyLink": "Política de privacidad",
  "labelPassword": "Contraseña",
  "labelConfirm": "Confirmar contraseña",
  "labelRemember": "Recordarme",
  "showPassword": "Ver",
  "hidePassword": "Ocultar",
  "errEmailRequired": "El email es obligatorio",
  "errEmailInvalid": "Email no válido",
  "errPasswordRequired": "La contraseña es obligatoria",
  "errPasswordMin": "Mínimo 8 caracteres",
  "errPasswordMatch": "Las contraseñas no coinciden",
  "errNameRequired": "El nombre es obligatorio"
}
}
```

## File: src/i18n/locales/pt.json
```json
{
  "nav": {
    "main": "Principal",
    "health": "Saúde",
    "account": "Conta",
    "dashboard": "Painel",
    "pets": "Minhas Mascotes",
    "cares": "Cuidados",
    "vaccines": "Vacinas",
    "medications": "Medicamentos",
    "symptoms": "Sintomas",
    "notes": "Notas",
    "settings": "Configurações",
    "calendar": "Calendário",
    "vet": "Veterinária",
    "collapse": "Recolher"
  },
  "btn": {
    "save": "Salvar",
    "saveChanges": "Salvar alterações",
    "cancel": "Cancelar",
    "close": "Fechar",
    "edit": "Editar",
    "delete": "Excluir",
    "add": "Adicionar",
    "register": "Registrar",
    "confirm": "Confirmar",
    "discard": "Descartar",
    "export": "Exportar",
    "invite": "Convidar",
    "share": "Compartilhar",
    "back": "Voltar",
    "seeAll": "Ver todos",
    "loading": "Carregando…",
    "done": "Feito",
    "resolve": "Marcar resolvido",
    "archive": "Arquivar",
    "unarchive": "Desarquivar",
    "reopen": "Reabrir",
    "new": "Novo",
    "update": "Atualizar",
    "optional": "opcional",
        "confirmDelete": "Confirmar eliminação?",
        "no": "Não"
  },
  "field": {
    "name": "Nome",
    "date": "Data",
    "time": "Hora",
    "notes": "Notas",
    "phone": "Telefone",
    "address": "Endereço",
    "specialty": "Especialidade",
    "clinic": "Clínica",
    "weight": "Peso",
    "cost": "Custo",
    "email": "E-mail",
    "vet": "Veterinário",
    "yes": "Sim",
    "no": "Não",
    "birthDate": "Data de nascimento",
"breed":     "Raça"
  },
  "dashboard": {
    "greeting_morning": "Bom dia",
    "greeting_afternoon": "Boa tarde",
    "greeting_evening": "Boa noite",
    "todayCares": "Cuidados de hoje",
    "upcomingEvents": "Próximos eventos",
    "allGood": "Tudo em dia ✓",
    "alerts": "Alertas",
    "noAlerts": "Sem alertas ativos ✓",
    "noActiveSymptoms": "Sem sintomas ativos",
    "addFirstPet": "Adicione seu primeiro animal",
    "pendingTasks": "pendentes"
  },
  "pets": {
    "title": "Minhas Mascotes",
    "subtitle": "mascotes registradas",
    "new": "Nova mascote",
    "noResults": "Sem resultados",
    "noResultsHint": "Tente outros filtros.",
    "noPets": "Sem mascotes",
    "noPetsHint": "Adicione sua primeira mascote para começar.",
    "addPet": "Adicionar mascote",
    "search": "Buscar",
    "searchHint": "Buscar por nome, espécie ou raça…",
    "species": "Espécie",
    "allSpecies": "Todas",
    "name": "Nome",
    "breed": "Raça",
    "birthDate": "Data de nascimento",
    "weight": "Peso",
    "age": "Idade",
    "health": "Saúde",
    "lastActivity": "Última atividade",
    "caregivers": "Cuidadores",
    "shareCares": "Compartilhar",
    "identity": "Identidade",
    "physicalData": "Dados físicos",
    "optional": "opcional",
    "newPetTitle": "Nova mascote",
    "newPetSubtitle": "Preencha os dados para registrá-la",
    "savedPet": "adicionada com sucesso 🐾",
    "speciesOptions": {
      "cat": "Gato",
      "dog": "Cachorro",
      "bird": "Pássaro",
      "rabbit": "Coelho",
      "reptile": "Réptil",
      "fish": "Peixe",
      "other": "Outro"
    },
    "newPet":        "Nova mascota",
"addBtn":        "Guardar mascota",
"successSub":    "já está na tua lista de mascotas",
"sectionIdentity": "Identidade",
"sectionPhysical": "Dados físicos",
"sectionId":     "Identificação",
"namePh":        "Nome do teu {{species}}",
"color":         "Cor",
"colorPh":       "Ex: Laranja, Preto e branco, Tricolor…",
"measurements":  "Medidas",
"height":        "Altura",
"length":        "Comprimento",
"width":         "Largura",
"microchip":     "Nº de microchip",
"microchipPh":   "15 dígitos ISO 11784",
"chipCountry":   "País correspondente",
"chipCountryPh": "Ex: Portugal, Brasil…",
"passport":      "Passaporte",
"passportPh":    "Nº de passaporte veterinário / documento",
"badgeNew":      "Nova",

  "ageUnknown": "Idade desconhecida",
  "months":     "meses",
  "breedPh":    "Ex: Europeu comum…",
  "weightPh":   "Ex: 4.2",
  "savePet":    "Guardar animal"
},
"petlist": {
  "reload":       "Recarregar",
  "petCount":     "animal(is)",
  "of":           "de",
  "clearFilters": "Limpar"

  },
  "pet": {
    "backToList": "Minhas Mascotes",
    "changePhoto": "Alterar foto",
    "toastPhoto": "📸 Foto atualizada",
    "statusHealthy": "Saudável",
    "unknownBreed": "Raça desconhecida",
    "years": "anos",
    "activeMed": "Med. ativo",
    "sharedCaregivers": "Cuidadores compartilhados",
    "speciesCat": "Gato",
    "speciesDog": "Cachorro",
    "speciesBird": "Pássaro",
    "chipSpecies": "Espécie",
    "chipBirth": "Nascimento",
    "chipWeight": "Peso",
    "chipCaregivers": "Cuidadores",
    "tabs": {
      "cares": "Cuidados",
      "vaccines": "Vacinas",
      "medications": "Medicamentos",
      "symptoms": "Sintomas",
      "notes": "Notas",
      "history": "Histórico"
    },
    "vacc": {
      "title": "Vacinas",
      "registerBtn": "Registrar aplicação",
      "empty": "Sem vacinas",
      "applied": "Aplicada",
      "next": "Próxima",
      "expired": "Vencida",
      "coverage": "Cobertura",
      "coverageTotal": "Cobertura vacinal",
      "coverageOk": "Vacinas em dia",
      "coveragePending": "Pendentes/vencidas",
      "badgeOk": "EM DIA",
      "badgeSoon": "A VENCER",
      "badgeLate": "VENCIDA",
      "toastRegistered": "registrada",
      "toastApplied": "💉 Aplicação registrada",
      "toastUpdated": "💉 Vacina atualizada",
      "modalTitle": "Registrar vacina",
      "modalSubtitle": "Aplicação em {{name}}",
      "successTitle": "Registrado!",
      "successSub": "Vacina adicionada ao histórico de {{name}}",
      "sectionVaccine": "Vacina",
      "sectionDates": "Datas",
      "sectionExtra": "Informações adicionais",
      "selectLabel": "Selecionar",
      "selectPh": "Escolha…",
      "dateApplied": "Aplicação",
      "dateNext": "Próxima",
      "vetPh": "Dra. Silva",
      "errSelect": "Selecione uma vacina",
      "errDate": "Data obrigatória",
      "errNext": "Próxima dose obrigatória",
      "errNextAfter": "Deve ser posterior à aplicação"
    },
    "share": {
      "title": "Compartilhar cuidados",
      "subtitle": "Convide cuidadores de {{name}}",
      "openBtn": "Compartilhar",
      "activeCaregivers": "Cuidadores ativos",
      "inviteTitle": "Convidar novo cuidador",
      "sendBtn": "Enviar convite",
      "emailPh": "nome@email.com",
      "accessLevel": "Nível de acesso",
      "accessReadonly": "Somente leitura",
      "accessReadonlySub": "Ver registros",
      "accessCaregiver": "Cuidador",
      "accessCaregiverSub": "Registrar cuidados e vacinas",
      "accessFull": "Acesso completo",
      "accessFullSub": "Editar perfil e todos os dados",
      "roleOwner": "Proprietária · acesso completo",
      "roleCaregiver": "Cuidadora · pode registrar",
      "badgeYou": "Você",
      "errEmail": "Insira um e-mail válido",
      "toastRemoved": "Cuidador removido"
    },
    "cares": {
      "todayTitle": "Cuidados de hoje",
      "todayProgress": "{{done}} de {{total}} concluídos",
      "scheduled": "Próximos cuidados agendados",
      "done": "Feito ✓",
      "register": "Registrar",
      "periodDay": "dia",
      "periodWeek": "semana",
      "toastDone": "concluído",
      "toastUndone": "desmarcado",
      "toastAdded": "adicionado",
      "toastUpdated": "atualizado",
      "toastDeleted": "Cuidado excluído"
    },
    "symptoms": {
      "title": "Sintomas de {{name}}",
      "registerBtn": "Registrar",
      "emptyTitle": "{{name}} está bem",
      "emptyText": "Registre qualquer mudança de comportamento aqui.",
      "active": "Ativos",
      "resolved": "Resolvidos",
      "noneActive": "Sem sintomas ativos ✓",
      "noneResolved": "Sem sintomas resolvidos",
      "statusActive": "Ativo",
      "statusResolved": "Resolvido",
      "toastAdded": "🌡️ Sintoma registrado",
      "toastResolved": "✓ Sintoma resolvido",
      "toastReopened": "↩ Sintoma reaberto",
      "toastUpdated": "🌡️ Sintoma atualizado"
    },
    "notes": {
      "newBtn": "Nova",
      "empty": "Sem notas ainda",
      "toastAdded": "📋 Nota salva",
      "toastArchived": "📦 Nota arquivada",
      "toastRestored": "📋 Nota restaurada",
      "toastDeleted": "🗑 Nota excluída",
      "toastUpdated": "📋 Nota atualizada"

    },
    "noteType": {
      "control": "Consulta",
      "observacion": "Observação",
      "emergencia": "Emergência",
      "vacuna": "Pós-vacina",
      "cirugia": "Cirurgia",
      "otro": "Nota"
    },
    "med": {
      "toastAdministered": "administrado",
      "toastUpdated": "Medicamento atualizado",
      "toastDeleted": "Medicamento excluído"
    },
    "history": {
      "title": "Histórico completo",
      "event": "Evento",
      "detail": "Detalhe",
      "date": "Data",
      "pet": "Mascote",
      "item1Title": "Vacina antirrábica aplicada",
      "3daysAgo": "Há 3d",
      "goVaccines": "Ir para Vacinas",
      "editMed": "Editar med.",
      "editNote": "Editar nota",
      "toastGoVaccines": "💉 Edite na aba Vacinas"
    }
  },
"cares": {
  "title": "Cuidados diários",
  "subtitle": "Rotina de todas as mascotas · hoje",
  "addCare": "Adicionar cuidado",
  "completed": "concluído",
  "all": "Todos",
  "urgent": "Urgente",
  "pending": "Pendente",
  "done": "Feito",
  "dayDone": "% do dia concluído",
  "registerCare": "Registar",
  "todayProgress": "{{done}} de {{total}} concluído",
  "add": {
    "heroTitle": "Novo cuidado",
    "heroSub": "Rotina para",
    "submitBtn": "Adicionar cuidado",
    "successTitle": "Cuidado adicionado!",
    "successSub": "já aparece na rotina",
    "sectionPet": "Mascota",
    "sectionCare": "Cuidado",
    "sectionRecurrence": "Recorrência",
    "sectionPrefs": "Preferências",
    "labelIcon": "Ícone",
    "labelQuantity": "Quantidade ou dose",
    "namePh": "Ex. Alimentação, Passeio, Escovagem",
    "quantityPh": "Ex. 80g, 200ml, 2 colheres",
    "errTitle": "O nome do cuidado é obrigatório",
    "toast": "Cuidado \"{{title}}\" adicionado",
    "recDaily": "Diário",
    "recXDays": "A cada X dias",
    "recXHours": "A cada X horas",
    "intervalDays": "Intervalo (dias)",
    "intervalHours": "Intervalo (horas)",
    "unitDays": "dia(s)",
    "unitHours": "hora(s)",
    "previewDays": "📅 a cada {{count}} dia(s)",
    "previewHours": "⏰ a cada {{count}}h",
    "timesPerDay": "Vezes por dia",
    "notifyLabel": "Notificações",
    "notifySub": "Lembrete na hora do cuidado"
  },
  "schedule": {
    "section":         "Horário e repetição",
    "time":            "Horário",
    "everyXDaysLabel": "Repetir a cada X dias",
    "everyXDaysSub":   "A cada {{n}} dias",
    "dailySub":        "Repete diariamente",
    "repeatEvery":     "Repetir a cada",
    "days":            "dias",
    "recurringLabel":  "Recorrente",
    "recurringSub":    "Repete indefinidamente",
    "onceSub":         "Realizado apenas uma vez"
  },
  "edit": {
    "title":             "Editar cuidado",
    "sectionIcon":       "Ícone",
    "sectionRecurrence": "Recorrência",
    "sectionPrefs":      "Preferências",
    "namePh":            "Nome do cuidado",
    "recDaily":          "Diário",
    "recXDays":          "A cada X dias",
    "recXHours":         "A cada X horas",
    "intervalDays":      "Intervalo (dias)",
    "intervalHours":     "Intervalo (horas)",
    "hours":             "hora(s)",
    "previewDays":       "📅 a cada {{n}} dia(s)",
    "previewHours":      "⏰ a cada {{n}}h",
    "timesPerDay":       "Vezes por dia",
    "quantity":          "Quantidade / dose",
    "quantityPh":        "Ex. 80g, 200ml, 1 comp.",
    "notifyLabel":       "Notificações",
    "notifySub":         "Lembrete na hora do cuidado"
  },
  "scheduled": "Próximos agendados"
},
"vaccines": {
  "title": "Vacinas",
  "subtitle": "Controlo vacinal das suas mascotes",
  "register": "Registrar vacina",
  "coverage": "Cobertura",
  "upToDate": "Em dia",
  "expiringSoon": "A vencer",
  "expired": "Vencida",
  "lastApplied": "Última aplicação",
  "nextDose": "Próxima dose",
  "applied": "Aplicada",
  "noVaccines": "Sem vacinas registradas",
  "edit": {
    "title": "Editar vacina",
    "saveBtn": "Salvar alterações",
    "successTitle": "Vacina atualizada",
    "sectionDates": "Datas",
    "labelApplied": "Última aplicação",
    "labelNext": "Próxima dose",
    "namePh": "Nome da vacina",
    "appliedPh": "Ex. 15 abr 2026",
    "errNext": "A próxima dose é obrigatória",
    "toastUpdated": "atualizada"
  },
  "calSubtitle": "Vacinas e medicamentos de todas as mascotes"
},
  "medications": {
    "title": "Medicamentos",
    "subtitle": "Tratamentos ativos e arquivados",
    "add": "+ Adicionar medicamento",
    "active": "Ativos",
    "history": "Histórico",
    "adherence": "Adesão ao tratamento",
    "nextDoses": "Próximas doses",
    "dose": "Dose",
    "frequency": "Frequência",
    "startDate": "Início",
    "endDate": "Fim",
    "finished": "Concluído",
    "unarchive": "Reativar",
  "emptyActive":   "Nenhum medicamento activo",
  "emptyHistory":  "Nenhum medicamento no histórico",
  "nextDose":      "Próxima dose",
  
  "edit": {
  "title": "Editar medicamento",
  "sectionType": "Tipo",
  "sectionMed": "Medicamento",
  "sectionPeriod": "Período",
  "labelDose": "Dose",
  "labelFreq": "Frequência",
  "labelStart": "Início",
  "labelEnd": "Fim (opcional)",
  "confirmDelete": "¿Confirmar eliminar?",
  "toastUpdated": "atualizado",
  "freqBiweekly": "Quinzenal",
"freqMonthly":  "Mensal",
"freqEvery3m":  "A cada 3 meses",
"freqSingle":   "Dose única",
"errName":      "O nome do medicamento é obrigatório",
"errDose":      "Indique a dose",
"errStart":     "A data de início é obrigatória",
"errEnd":       "A data de fim deve ser posterior ao início",
"namePh":       "Ex: Bravecto, Amoxicilina…",
"dosePh":       "Ex: 1 comprimido, 2,5ml…",
"endHint":      "Deixar vazio se for tratamento contínuo",
"notesPh":      "Reações, instruções do veterinário, número de lote…"
},
"freq": {
  "daily": "Diária",
  "every12h": "Cada 12 horas",
  "every8h": "Cada 8 horas",
  "weekly": "Semanal",
  "biweekly": "Quinzenal",
  "monthly": "Mensal",
  "every3months": "Cada 3 meses",
  "single": "Dose única",
    "every3m":  "A cada 3 meses"
}
  },
  "symptoms": {
    "title": "Sintomas",
    "subtitle": "Observações de comportamento e saúde",
    "register": "+ Registrar sintoma",
    "active": "Ativos",
    "resolved": "Resolvidos",
    "history": "Histórico",
    "severity": "Gravidade",
    "category": "Categoria",
    "date": "Data",
    "notes": "Notas",
    "noActive": "Sem sintomas ativos ✓",
    "noResolved": "Sem sintomas resolvidos",
    "markResolved": "Marcar resolvido",
    "reopen": "↩ Reabrir",
    "severityOptions": {
      "leve": "Leve",
      "moderado": "Moderado",
      "grave": "Grave",
      "emergencia": "Emergência"
    },
    "categoryOptions": {
      "digestivo": "Digestivo",
      "respiratorio": "Respiratório",
      "piel": "Pele",
      "comportamiento": "Comportamento",
      "movimiento": "Movimento",
      "ocular": "Ocular",
      "otro": "Outro"
    },
    "page": {
  "inObservation": "Em observação",
  "inObs": "em obs.",
  "errDescription":  "Descreva o sintoma observado",
"whatObserved":    "O que observou?",
"descriptionPh":   "Ex: Tosse seca desde ontem de manhã. Sem febre mas parece cansado…",
"description":     "Descrição",
"startDate":       "Data de início",
"notesPh":         "Medicamentos actuais, alterações de comportamento…",
"severitySub": {
  "leve":       "Sem urgência",
  "moderado":   "Observar de perto",
  "grave":      "Visita ao veterinário",
  "emergencia": "Urgente — agir agora"
}
}
  },
  "notes": {
    "title": "Notas",
    "subtitle": "Notas veterinárias e observações",
    "new": "Nova nota",
    "archived": "Arquivadas",
    "noNotes": "Sem notas",
    "content": "Conteúdo",
    "vet": "Veterinário",
    "typeOptions": {
      "control": "Consulta",
      "observacion": "Observação",
      "emergencia": "Emergência",
      "vacuna": "Pós-vacina",
      "cirugia": "Cirurgia",
      "otro": "Outro"
    },
    "deleteNote": "Excluir nota",
    "deleteConfirm": "Excluir esta nota permanentemente?",
    "deletedNote": "Nota excluída",
          "addHint": "Registra uma nova observação",
          "errContent": "O conteúdo da nota não pode estar vazio",
"type": "Tipo de nota",
"editTitle": "Editar nota",
"editSuccess": "Nota atualizada!",
"editBy": "por {{name}}",
"addedBy": "Adicionada por",
"archivedBadge": "📁 Arquivada",
"replyYou": "Você",
"replyAdded": "📝 Nota adicionada",
"replyPlaceholder": "Adicionar uma nota…",
"replyHint": "Ctrl + Enter para enviar",
"replyBtn": "📝 Adicionar nota",
"replySingular": "resposta",
"replyPlural": "respostas",
"deleteConfirmYes": "Sim, eliminar"
  },
  "calendar": {
    "title": "Calendário",
    "subtitle": "Visão mensal de cuidados, vacinas e veterinária",
    "today": "Hoje",
    "allEvents": "Todos",
    "late": "Vencidas",
    "soon": "Em breve (30d)",
    "upToDate": "Em dia",
    "medication": "Medicamentos",
    "noEvents": "Sem eventos neste dia",
    "overdueTitle": "evento(s) vencido(s)",
    "overdueHint": "Ver todos",
    "monthPrev": "Mês anterior",
    "monthNext": "Próximo mês",
    "alertsTitle": "Vacinas vencidas",
    "alertsWarn": "⚠ Consulte o veterinário o mais rápido possível",
    "vacExpiredTag": "VENCIDA",
    "vacExpiredSince": "Venceu:",
    "filterLabel": "Filtrar calendário",
    "clearFilters": "Limpar filtros",
    "filterGroupCares": "Cuidados",
    "filterGroupVaccines": "Vacinas",
    "filterGroupVet": "Veterinária",
    "filterPending": "Pendente",
    "filterDone": "Realizado",
    "filterVaccDue": "Próxima vacina",
    "filterVaccExpired": "Vacina vencida",
    "filterVetVisit": "Consulta veterinária",
    "filterVetReturn": "Retorno agendado",
    "dayEmpty": "Sem eventos neste dia",
    "dayCares": "Cuidados do dia",
    "dayVaccines": "Vacinas",
    "dayMedications": "Medicamentos",
    "dayVetVisits": "Consultas / Agendamentos",
    "editCare": "Editar cuidado",
    "carePending": "Pendente",
    "careDone": "Realizado",
    "careSkipped": "Ignorado",
    "vaccineApply": "Aplicar agora",
    "vetVisitKind": "Consulta",
    "vetReturnKind": "Retorno agendado",
    "eventsCount": "{{n}} evento(s)"
  },
  "vet": {
    "pageTitle": "Veterinária",
    "pageSubtitle": "Saúde clínica e prontuários médicos",
    "tabs": {
      "profile": "Perfil médico",
      "vets": "Meus veterinários",
      "appointments": "Consultas",
      "exams": "Exames",
      "documents": "Documentos"
    },
    "comingSoon": {
      "exams": "Guarde resultados de exames, receitas e relatórios em um só lugar.",
      "documents": "Passaporte digital e compartilhamento de dados com seu veterinário.",
      "label": "Em breve"
    },
    "vetTypes": {
  "primary": "Clínica principal",
  "specialist": "Especialista",
  "emergency": "Urgências",
  "other": "Outro"
},
    "profile": {
      "emptyTitle": "Sem perfil médico",
      "emptyText": "Preencha o perfil da sua mascote para que o veterinário tenha todas as informações de um relance.",
      "emptyBtn": "Completar perfil",
      "editBtn": "Editar perfil",
      "lastUpdated": "Atualizado",
      "noConditions": "Sem condições registradas",
      "noSurgeries": "Sem cirurgias registradas",
      "sex": "Sexo",
      "sexMale": "Macho",
      "sexFemale": "Fêmea",
      "neutered": "Castrado / Esterilizado",
      "neuteredYes": "Sim",
      "neuteredNo": "Não",
      "neuteredAge": "Idade na castração",
      "bloodType": "Tipo sanguíneo",
      "bloodTypePh": "Ex. A, B, AB, DEA 1.1…",
      "bloodTypeHint": "Varia conforme a espécie — escreva livremente",
      "allergies": "Alergias conhecidas",
      "conditions": "Condições crônicas",
      "surgeries": "Cirurgias",
      "environment": "Tipo de habitat",
      "envApartment": "Apartamento",
      "envHouse": "Casa com jardim",
      "envBoth": "Ambos",
      "livingWithAnimals": "Convive com outros animais",
      "parasiteControl": "Antipulgas/vermífugo habitual",
      "behavioralNotes": "Notas de comportamento",
      "vetQuestions": "Perguntas para o veterinário",
      "modalTitle": "Perfil médico",
      "editingFor": "Editando perfil de {{name}}",
      "savedSuccess": "Perfil salvo",
      "savedSuccessFor": "O histórico de {{name}} foi atualizado",
      "sectionBasic": "Dados básicos",
      "sectionConditions": "Condições crônicas",
      "sectionSurgeries": "Cirurgias e intervenções",
      "sectionEnvironment": "Ambiente e comportamento",
      "sectionVetNotes": "Notas para o veterinário",
      "customConditionPh": "Nome da condição",
      "addCondition": "Adicionar",
      "surgeryNamePh": "Ex. Castração, Extração dental",
      "surgeryNotesPh": "Observações",
      "addSurgery": "+ Adicionar cirurgia",
      "removeSurgery": "×"
    },
    "contactTypes": {
      "primary": "Principal",
      "specialist": "Especialista",
      "emergency": "Emergência",
      "other": "Outro"
    },
    "contacts": {
      "addBtn": "Adicionar veterinário",
      "emptyTitle": "Sem veterinários salvos",
      "emptyText": "Salve o contato do seu veterinário para acesso rápido.",
      "phone2": "Tel. alternativo",
      "deleteConfirm": "Confirmar exclusão?",
      "titleAdd": "Adicionar veterinário",
      "titleEdit": "Editar veterinário",
      "subtitleAdd": "Salve o contato do seu veterinário de confiança",
      "subtitleEdit": "Editando contato de {{name}}",
      "sectionType": "Tipo de veterinário",
      "sectionContact": "Dados de contato",
      "sectionPets": "Mascotes associadas",
      "sectionNotes": "Notas adicionais",
      "vetNamePh": "Ex. Dra. Silva",
      "clinicPh": "Ex. Clínica VetSaúde",
      "specialtyPh": "Ex. Dermatologia, Oncologia",
      "phonePh": "Ex. +55 11 90000-0000",
      "phone2Ph": "Ex. +55 11 91111-1111",
      "addressPh": "Rua, número, cidade",
      "notesPh": "Horários, instruções especiais…",
      "errName": "O nome é obrigatório",
      "errClinic": "A clínica é obrigatória",
      "errPhone": "O telefone é obrigatório"
    },
    "apptTypes": {
      "routine": "Consulta",
      "emergency": "Urgência",
      "specialist": "Especialista",
      "followup": "Retorno",
      "exam": "Exames",
      "vaccine": "Vacina",
      "other": "Outro"
    },
    "appointments": {
      "addBtn": "Registrar consulta",
      "nextLabel": "📅 Próximo retorno",
      "historyLabel": "Histórico de consultas",
      "emptyTitle": "Sem consultas registradas",
      "emptyText": "Registre a primeira consulta de {{name}} para iniciar o histórico.",
      "deleteConfirm": "Confirmar exclusão?",
      "diagnosis": "Diagnóstico",
      "treatment": "Tratamento",
      "weight": "Peso na visita",
      "nextReturn": "Retorno",
      "sectionDateTime": "Data e hora",
      "sectionVet": "Veterinário",
      "sectionDetails": "Detalhes da consulta",
      "sectionFollowUp": "Acompanhamento",
      "sectionExtra": "Dados adicionais",
      "vetContactLabel": "Veterinário salvo",
      "vetContactNone": "Inserir manualmente",
      "vetNamePh": "Ex. Dra. Silva",
      "clinicPh": "Ex. Clínica VetSaúde",
      "reason": "Motivo da consulta",
      "reasonPh": "Ex. Revisão anual, tosse persistente…",
      "diagnosisPh": "Diagnóstico do veterinário",
      "treatmentPh": "Medicamentos, doses, orientações…",
      "nextDate": "Data de retorno",
      "nextNote": "Nota do retorno",
      "nextNotePh": "Ex. Revisão pós-tratamento",
      "weightPh": "Ex. 4.2",
      "cost": "Custo da consulta",
      "costPh": "Ex. 45.00",
      "notesPh": "Qualquer observação relevante…",
      "errReason": "O motivo é obrigatório",
      "errVetName": "O nome do veterinário é obrigatório",
      "errDate": "A data é obrigatória",
      "register": "Registrar consulta",
      "update": "Salvar alterações",
      "titleAdd": "Registrar consulta",
      "titleEdit": "Editar consulta",
      "subtitleAdd": "Salve o histórico veterinário da sua mascote",
      "subtitleEdit": "Editando consulta de {{date}}"
    },
    "toast": {
      "vetAdded": "Veterinário adicionado ✓",
      "vetUpdated": "Veterinário atualizado ✓",
      "vetDeleted": "Veterinário removido",
      "apptAdded": "Consulta registrada ✓",
      "apptUpdated": "Consulta atualizada ✓",
      "apptDeleted": "Consulta excluída",
      "profileSaved": "Perfil salvo ✓"
    },
    "time": {
      "today": "Hoje",
      "tomorrow": "Amanhã",
      "inDays": "Em {{n}} dias",
      "daysAgo": "Há {{n}} dias"
    }
  },
  "settings": {
    "title": "Configurações",
    "subtitle": "Conta e preferências",
    "personalData": "Dados pessoais",
    "personalSubtitle": "Suas informações no PITUTI",
    "profilePhoto": "Foto de perfil",
    "photoHint": "JPG, PNG ou WebP · Máx. 2 MB",
    "changePhoto": "Alterar",
    "fullName": "Nome completo",
    "email": "E-mail",
    "phone": "Telefone",
    "city": "Cidade",
    "about": "Sobre mim",
    "fullNamePlaceholder": "Seu nome e sobrenome",
    "phonePlaceholder": "+55 11 90000-0000",
    "cityPlaceholder": "São Paulo, Rio de Janeiro…",
    "aboutPlaceholder": "Apaixonado/a por animais…",
    "appearance": "Aparência",
    "theme": "Tema do app",
    "themeHint": "Claro ou escuro",
    "changeTheme": "Alterar",
    "language": "Idioma",
    "languageHint": "Español · English · Português",
    "notifications": "Notificações",
    "vaccineAlert": "Vacinas a vencer",
    "vaccineAlertHint": "7 dias antes do vencimento",
    "medAlert": "Doses de medicamentos",
    "medAlertHint": "Lembrete diário de doses",
    "symptomAlert": "Sintomas sem resolução",
    "symptomAlertHint": "Quando um sintoma dura +3 dias",
    "weeklyDigest": "Resumo semanal",
    "weeklyDigestHint": "Toda segunda por e-mail",
    "urgentAlerts": "Alertas urgentes",
    "urgentAlertsHint": "Push imediato em emergências",
    "dangerZone": "Zona de risco",
    "exportData": "Exportar dados",
    "exportHint": "Baixe um CSV com todo o histórico das suas mascotes, vacinas, medicamentos e sintomas.",
    "exportBtn": "Exportar CSV",
    "deleteAccount": "Excluir conta",
    "deleteHint": "Ação permanente e irreversível. Todos os seus dados, mascotes e histórico serão apagados.",
    "deleteBtn": "Excluir conta",
    "saved": "Salvo",
    "deleteModal": {
      "title": "Excluir conta permanentemente",
      "subtitle": "Esta ação não pode ser desfeita",
      "willLose": "Se você excluir sua conta, perderá permanentemente:",
      "petProfiles": "O perfil completo de todas as suas mascotes",
      "vaccines": "Histórico de vacinas e próximas doses",
      "medications": "Todos os medicamentos registrados",
      "records": "Sintomas, notas e registros veterinários",
      "dailyCares": "Cuidados diários e rotinas configuradas",
      "caregivers": "Acesso compartilhado com outros cuidadores",
      "warning": "⚠ Você não poderá recuperar esses dados após excluir sua conta.",
      "continue": "Continuar →",
      "typePrompt": "Para confirmar, digite",
      "typeWord": "excluir",
      "typeError": "Digite exatamente \"excluir\" (sem aspas)",
      "confirmBtn": "Excluir definitivamente",
      "finalWarning": "Ao clicar em \"Excluir definitivamente\", sua conta e todos os dados associados serão apagados permanentemente dos servidores do PITUTI.",
        "memberSince":   "Membro desde janeiro 2026 · {{count}} animais"},
  "activeAccount": "Conta ativa",
  "petsCount":     "animais",
  "deleteToast":   "Até logo."
    
  },
  "topbar": {
    "searchPlaceholder": "Buscar mascote, registro…",
    "noNotifications": "Sem novas notificações",
    "changeTheme": "Alterar tema"
  },
  "modal": {
    "close": "Fechar",
    "editPet": "Editar mascote",
    "registerVaccine": "Registrar vacina",
    "vaccineApplied": "Data de aplicação",
    "vaccineNext": "Próxima dose",
    "vaccineVet": "Veterinário (opcional)",
    "vaccineNotes": "Notas (opcional)",
    "vaccineSaved": "Registrado!",
    "selectVaccine": "Selecionar vacina",
    "shareCares": "Compartilhar cuidados",
    "shareInvite": "Convide cuidadores de",
    "activeCaregiversLabel": "Cuidadores ativos",
    "inviteNew": "Convidar novo cuidador",
    "accessLevel": "Nível de acesso",
    "sendInvitation": "✉ Enviar convite",
    "inviteSent": "Convite enviado!",
    "inviteExpiry": "✓ O link do convite expira em 48 horas",
    "understood": "Entendido",
    "removeCaregiver": "Remover",
    "editCare": "Configurar cuidado",
    "addInfo": "Informações adicionais",
    "frequency": "Frequência",
    "perDay": "Por dia",
    "perWeek": "Por semana",
    "perMonth": "Por mês",
    "quantity": "Quantidade (opcional)",
    "notify": "Ativar lembrete",
    "readOnly": "Somente leitura",
    "readOnlyHint": "Ver registros, não pode editar",
    "caregiver": "Cuidador",
    "caregiverHint": "Registrar cuidados e vacinas",
    "fullAccess": "Acesso completo",
    "fullAccessHint": "Editar perfil e todos os dados",
    "changePhoto": "Alterar foto",
      "status": "Estado"
  },
  "status": {
    "active": "Ativo",
    "resolved": "Resolvido",
    "archived": "Arquivado",
    "expired": "Vencida",
    "soon": "Em breve",
    "upToDate": "Em dia",
    "finished": "Concluído",
    "new": "Nova ✓"
  },
  "toast": {
    "changesSaved": "✓ Alterações salvas com sucesso",
    "themeChanged": "Tema alterado",
    "petAdded": "adicionada com sucesso 🐾",
    "careRegistered": "Cuidado registrado ✓",
    "inviteSent": "✉ Convite enviado para ",
    "symptomResolved": "✓ Sintoma resolvido",
    "symptomReopened": "↩ Sintoma reaberto",
    "noteArchived": "📁 Nota arquivada",
    "noteUnarchived": "✓ Nota desarquivada",
    "noteDeleted": "Nota excluída",
    "csvDownloaded": "📄 CSV baixado com sucesso",
    "vaccineRegistered": "💉 Vacina registrada",
    "medAdded": "Medicamento adicionado",
    "photoUpdated": "📸 Foto atualizada",
    "languageChanged": "Idioma atualizado",
      "medSaved":      "Medicamento guardado ✓",
  "medDeleted":    "Medicamento eliminado",
  "medArchived":   "Medicamento arquivado ✓",
  "medUnarchived": "Medicamento reativado ✓",
  "careUpdated": "actualizado",
"careDeleted": "Cuidado eliminado"
  },
  "dates": {
    "today": "Hoje",
    "yesterday": "Ontem",
    "days_ago": "Há {{n}} dias",
    "months": [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    "weekdays": [
      "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
    ],
    "weekdaysShort": [
      "Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"
    ],
      "locale": "pt-PT"
  },
  "notFound": {
    "title": "Página não encontrada",
    "hint": "A rota {path} não existe no Pituti"
  },
  "login": {
    "passwordHint": "Mínimo 8 caracteres",
  "heroTitle": "Cuide dos seus\nanimais com\namor ❤️",
  "heroSubtitle": "O PITUTI ajuda você a controlar vacinas, medicamentos, cuidados diários e sintomas de todos os seus peludos.",
  "socialProof": "animais cuidados com amor",
  "orContinueWith": "ou continuar com",
  "rememberMe": "Lembrar de mim",
  "forgotPassword": "Esqueceu a senha?",
  "backToLogin": "Voltar ao login",
  "forgotTitle": "Esqueceu a senha?",
  "forgotSubtitle": "Insira seu e-mail e enviaremos um link para redefinir sua senha.",
  "emailSentTitle": "E-mail enviado!",
  "emailSentBody": "Verifique sua caixa de entrada em {{email}}. O link expira em 30 minutos.",
  "loginTitle": "Bem-vinda de volta! 👋",
  "loginSubtitle": "Entre para cuidar dos seus animais 🐾",
  "registerTitle": "Crie sua conta 🐾",
  "registerSubtitle": "Comece a cuidar dos seus animais gratuitamente",
  "tabLogin": "🔑 Entrar",
  "tabRegister": "✨ Cadastrar",
  "submitLogin": "🔑 Entrar",
  "submitRegister": "✨ Criar conta",
  "submitForgot": "✉️ Enviar link",
  "submittingLogin": "Entrando…",
  "submittingRegister": "Criando conta…",
  "submittingForgot": "Enviando…",
  "noAccount": "Não tem conta?",
  "registerFree": "Cadastre-se grátis",
  "hasAccount": "Já tem conta?",
  "signIn": "Entrar",
  "enterDemo": "Entrar sem conta (demo) →",
  "termsPrefix": "Ao se cadastrar, você aceita nossos",
  "termsLink": "Termos de uso",
  "termsAnd": "e",
  "privacyLink": "Política de privacidade",
  "labelPassword": "Senha",
  "labelConfirm": "Confirmar senha",
  "labelRemember": "Lembrar de mim",
  "showPassword": "Ver",
  "hidePassword": "Ocultar",
  "errEmailRequired": "O e-mail é obrigatório",
  "errEmailInvalid": "E-mail inválido",
  "errPasswordRequired": "A senha é obrigatória",
  "errPasswordMin": "Mínimo 8 caracteres",
  "errPasswordMatch": "As senhas não coincidem",
  "errNameRequired": "O nome é obrigatório"
}

}
```

## File: src/i18n/locales/types.ts
```typescript
export type Lang = 'es' | 'en' | 'pt'
```

## File: src/api/appointments.ts
```typescript
import { api } from './client';
import type { ApiAppointment, CreateAppointmentDto, UpdateAppointmentDto } from './types';

export const appointmentsApi = {
  getAll:  (vetId: string)                                        => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`),
  getById: (vetId: string, id: string)                            => api.get<ApiAppointment>(`/vets/${vetId}/appointments/${id}`),
  create:  (vetId: string, dto: CreateAppointmentDto)             => api.post<ApiAppointment>(`/vets/${vetId}/appointments`, dto),
  update:  (vetId: string, id: string, dto: UpdateAppointmentDto) => api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, dto),
  delete:  (vetId: string, id: string)                            => api.delete<void>(`/vets/${vetId}/appointments/${id}`),
};
```

## File: src/api/cares.ts
```typescript
import { api } from './client';
import type { ApiCare, CreateCareDto, UpdateCareDto } from './types';

export const caresApi = {
  getAll:  (petId: string)                               => api.get<ApiCare[]>(`/pets/${petId}/cares`),
  getById: (petId: string, id: string)                   => api.get<ApiCare>(`/pets/${petId}/cares/${id}`),
  create:  (petId: string, dto: CreateCareDto)           => api.post<ApiCare>(`/pets/${petId}/cares`, dto),
  update:  (petId: string, id: string, dto: UpdateCareDto) => api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, dto),
  delete:  (petId: string, id: string)                   => api.delete<void>(`/pets/${petId}/cares/${id}`),
};
```

## File: src/api/index.ts
```typescript
export {
  api,
  petsApi,
  vetsApi,
  appointmentsApi,
  medicationsApi,
  symptomsApi,
  caresApi,
  vaccinesApi,
  BASE_URL,
} from './client'

export type {
  ApiResponse,
  ApiError,
  ApiPet,
  ApiVet,
  ApiAppointment,
  ApiMedication,
  ApiSymptom,
  ApiCare,
  ApiVaccine,
} from './client'
```

## File: src/api/medicalProfiles.ts
```typescript
import { api } from './client';
import type { ApiMedicalProfile, UpsertMedicalProfileDto } from './types';

export const medicalProfilesApi = {
  get:    (petId: string)                          => api.get<ApiMedicalProfile>(`/pets/${petId}/medical-profile`),
  upsert: (petId: string, dto: UpsertMedicalProfileDto) => api.put<ApiMedicalProfile>(`/pets/${petId}/medical-profile`, dto),
};
```

## File: src/api/medications.ts
```typescript
import { api } from './client';
import type { ApiMedication, CreateMedicationDto, UpdateMedicationDto } from './types';

export const medicationsApi = {
  getAll:  (petId: string)                                    => api.get<ApiMedication[]>(`/pets/${petId}/medications`),
  getById: (petId: string, id: string)                        => api.get<ApiMedication>(`/pets/${petId}/medications/${id}`),
  create:  (petId: string, dto: CreateMedicationDto)          => api.post<ApiMedication>(`/pets/${petId}/medications`, dto),
  update:  (petId: string, id: string, dto: UpdateMedicationDto) => api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, dto),
  delete:  (petId: string, id: string)                        => api.delete<void>(`/pets/${petId}/medications/${id}`),
};
```

## File: src/api/notes.ts
```typescript
import { api } from './client';
import type { ApiNote, CreateNoteDto, UpdateNoteDto } from './types';

export const notesApi = {
  getAll:  (petId: string)                               => api.get<ApiNote[]>(`/pets/${petId}/notes`),
  getById: (petId: string, id: string)                   => api.get<ApiNote>(`/pets/${petId}/notes/${id}`),
  create:  (petId: string, dto: CreateNoteDto)           => api.post<ApiNote>(`/pets/${petId}/notes`, dto),
  update:  (petId: string, id: string, dto: UpdateNoteDto) => api.patch<ApiNote>(`/pets/${petId}/notes/${id}`, dto),
  delete:  (petId: string, id: string)                   => api.delete<void>(`/pets/${petId}/notes/${id}`),
};
```

## File: src/api/symptoms.ts
```typescript
import { api } from './client';
import type { ApiSymptom, CreateSymptomDto, UpdateSymptomDto } from './types';

export const symptomsApi = {
  getAll:  (petId: string)                                  => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`),
  getById: (petId: string, id: string)                      => api.get<ApiSymptom>(`/pets/${petId}/symptoms/${id}`),
  create:  (petId: string, dto: CreateSymptomDto)           => api.post<ApiSymptom>(`/pets/${petId}/symptoms`, dto),
  update:  (petId: string, id: string, dto: UpdateSymptomDto) => api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, dto),
  delete:  (petId: string, id: string)                      => api.delete<void>(`/pets/${petId}/symptoms/${id}`),
};
```

## File: src/api/types.ts
```typescript
/**
 * API contract types — aligned with backend validators and store shapes.
 * These are the "wire types" returned by the API (all ids are strings, dates are strings).
 * Import these in api modules and cast to domain types when needed.
 */

// ── Users ─────────────────────────────────────────────────────────────────────
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  createdAt: string;
}
export type CreateUserDto  = Omit<ApiUser, 'id' | 'createdAt'>;
export type UpdateUserDto  = Partial<CreateUserDto>;

// ── Pets ──────────────────────────────────────────────────────────────────────
export type ApiSpecies = 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other';
export interface ApiPet {
  id: string;
  name: string;
  species: ApiSpecies;
  breed?: string;
  birthDate?: string;
  photoUrl: string | null;
  ownerId: string;
  createdAt: string;
}
export type CreatePetDto = Omit<ApiPet, 'id' | 'createdAt'>;
export type UpdatePetDto = Partial<Omit<CreatePetDto, 'ownerId'>>;

// ── Vaccines ──────────────────────────────────────────────────────────────────
export interface ApiVaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDueDate?: string | null;
  veterinary?: string | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateVaccineDto = Omit<ApiVaccine, 'id' | 'petId' | 'createdAt'>;
export type UpdateVaccineDto = Partial<CreateVaccineDto>;

// ── Medications ───────────────────────────────────────────────────────────────
export interface ApiMedication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateMedicationDto = Omit<ApiMedication, 'id' | 'petId' | 'createdAt'>;
export type UpdateMedicationDto = Partial<CreateMedicationDto>;

// ── Symptoms ──────────────────────────────────────────────────────────────────
export type ApiSeverity = 'mild' | 'moderate' | 'severe';
export interface ApiSymptom {
  id: string;
  petId: string;
  description: string;
  severity: ApiSeverity;
  date: string;
  notes?: string | null;
  resolved: boolean;
  createdAt: string;
}
export type CreateSymptomDto = Omit<ApiSymptom, 'id' | 'petId' | 'createdAt'>;
export type UpdateSymptomDto = Partial<CreateSymptomDto>;

// ── Cares ─────────────────────────────────────────────────────────────────────
export type ApiPeriodType = 'day' | 'week' | 'month';
export type ApiCareStatus = 'pending' | 'done' | 'skipped';
export interface ApiCare {
  id: string;
  petId: string;
  name: string;
  type: string;
  frequency?: number;
  periodType?: ApiPeriodType;
  time?: string | null;
  notes?: string | null;
  status: ApiCareStatus;
  createdAt: string;
}
export type CreateCareDto = Omit<ApiCare, 'id' | 'petId' | 'createdAt'>;
export type UpdateCareDto = Partial<CreateCareDto>;

// ── Notes ─────────────────────────────────────────────────────────────────────
export type ApiNoteType = 'control' | 'observacion' | 'emergencia' | 'vacuna' | 'cirugia' | 'otro';
export interface ApiNote {
  id: string;
  petId: string;
  content: string;
  veterinary?: string | null;
  type: ApiNoteType;
  createdAt: string;
}
export type CreateNoteDto = Omit<ApiNote, 'id' | 'petId' | 'createdAt'>;
export type UpdateNoteDto = Partial<CreateNoteDto>;

// ── Medical Profile ───────────────────────────────────────────────────────────
export interface ApiCondition { name: string; notes?: string; }
export interface ApiSurgery   { name: string; notes?: string; }
export interface ApiMedicalProfile {
  petId: string;
  sex?: 'male' | 'female' | 'unknown';
  neutered?: boolean | null;
  neuteredAge?: string | null;
  bloodType?: string | null;
  allergies: string[];
  conditions: ApiCondition[];
  surgeries: ApiSurgery[];
  environment?: 'apartment' | 'house' | 'both' | null;
  livingWithAnimals?: boolean | null;
  behavioralNotes?: string | null;
  vetQuestions?: string | null;
  updatedAt: string | null;
}
export type UpsertMedicalProfileDto = Omit<ApiMedicalProfile, 'petId' | 'updatedAt'>;

// ── Vets ──────────────────────────────────────────────────────────────────────
export type ApiVetType = 'primary' | 'specialist' | 'emergency' | 'other';
export interface ApiVet {
  id: string;
  name: string;
  clinic: string;
  type: ApiVetType;
  specialty?: string | null;
  phone: string;
  phone2?: string | null;
  address?: string | null;
  notes?: string | null;
  petIds: string[];
  createdAt: string;
}
export type CreateVetDto = Omit<ApiVet, 'id' | 'createdAt'>;
export type UpdateVetDto = Partial<CreateVetDto>;

// ── Appointments ──────────────────────────────────────────────────────────────
export type ApiAppointmentType = 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other';
export interface ApiAppointment {
  id: string;
  petId: string;
  vetContactId?: string | null;
  vetName: string;
  clinic?: string | null;
  type: ApiAppointmentType;
  date: string;
  reason: string;
  diagnosis?: string | null;
  treatment?: string | null;
  nextAppointmentDate?: string | null;
  nextAppointmentNote?: string | null;
  weightKg?: number | null;
  cost?: number | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateAppointmentDto = Omit<ApiAppointment, 'id' | 'vetContactId' | 'createdAt'>;
export type UpdateAppointmentDto = Partial<CreateAppointmentDto>;

// ── Health ────────────────────────────────────────────────────────────────────
export interface ApiHealth {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}
```

## File: src/api/users.ts
```typescript
import { api } from './client';
import type { ApiUser, CreateUserDto, UpdateUserDto } from './types';

export const usersApi = {
  getAll:  ()                               => api.get<ApiUser[]>('/users'),
  getById: (id: string)                     => api.get<ApiUser>(`/users/${id}`),
  create:  (dto: CreateUserDto)             => api.post<ApiUser>('/users', dto),
  update:  (id: string, dto: UpdateUserDto) => api.patch<ApiUser>(`/users/${id}`, dto),
  delete:  (id: string)                     => api.delete<void>(`/users/${id}`),
};
```

## File: src/api/vaccines.ts
```typescript
import { api } from './client';
import type { ApiVaccine, CreateVaccineDto, UpdateVaccineDto } from './types';

export const vaccinesApi = {
  getAll:  (petId: string)                             => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`),
  getById: (petId: string, id: string)                 => api.get<ApiVaccine>(`/pets/${petId}/vaccines/${id}`),
  create:  (petId: string, dto: CreateVaccineDto)      => api.post<ApiVaccine>(`/pets/${petId}/vaccines`, dto),
  update:  (petId: string, id: string, dto: UpdateVaccineDto) => api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, dto),
  delete:  (petId: string, id: string)                 => api.delete<void>(`/pets/${petId}/vaccines/${id}`),
};
```

## File: src/api/vets.ts
```typescript
import { api } from './client';
import type { ApiVet, CreateVetDto, UpdateVetDto } from './types';

export const vetsApi = {
  getAll:  ()                               => api.get<ApiVet[]>('/vets'),
  getById: (vetId: string)                  => api.get<ApiVet>(`/vets/${vetId}`),
  create:  (dto: CreateVetDto)              => api.post<ApiVet>('/vets', dto),
  update:  (vetId: string, dto: UpdateVetDto) => api.patch<ApiVet>(`/vets/${vetId}`, dto),
  delete:  (vetId: string)                  => api.delete<void>(`/vets/${vetId}`),
};
```

## File: src/assets/react.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

## File: src/assets/vite.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
```

## File: src/components/Avatar.tsx
```typescript
import { useState } from 'react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  photoUrl?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export default function Avatar({ name, photoUrl, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={[
        'relative flex shrink-0 items-center justify-center rounded-full',
        'bg-teal-100 font-semibold text-teal-800 overflow-hidden',
        sizeClasses[size],
        className,
      ].join(' ')}
      aria-label={name}
    >
      {photoUrl && !imgError ? (
        <img
          src={photoUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}
```

## File: src/components/Badge.tsx
```typescript
import type { BadgeStatus } from '../types'

interface BadgeProps {
  label: string
  status?: BadgeStatus
  className?: string
}

const statusClasses: Record<BadgeStatus, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-800',
  neutral: 'bg-stone-100 text-stone-600',
}

export default function Badge({ label, status = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusClasses[status],
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
```

## File: src/components/Button.tsx
```typescript
import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant, ButtonSize } from '../types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900',
  secondary: 'bg-stone-100 text-stone-900 border border-stone-300 hover:bg-stone-200 active:bg-stone-300',
  ghost:     'bg-transparent text-stone-700 hover:bg-stone-100 active:bg-stone-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  ariaLabel,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
```

## File: src/components/CalicoAnimation.tsx
```typescript
// ══════════════════════════════════════════════════════════════════
//  src/components/CalicoAnimation.tsx
//
//  Self-contained calico cat SVG for the topbar.
//  Animations live in  src/styles/catAnim.css  (imported in main.tsx).
//
//  Usage:
//    import CalicoAnimation from './CalicoAnimation'
//    <CalicoAnimation />          ← drop anywhere in <header>
// ══════════════════════════════════════════════════════════════════

export default function CalicoAnimation() {
  return (
    <svg
      className="calico-cat"
      width="80"
      height="60"
      viewBox="0 0 96 72"
      fill="none"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      role="presentation"
    >

      {/* ════════════════════════════════════
          WALKING GROUP
      ════════════════════════════════════ */}
      <g className="cat-walk">

        {/* Walking tail — orange, long, curves back */}
        <path
          className="cat-walk-tail"
          d="M66 36 C76 26 88 12 85 2"
          stroke="#E87228" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />

        {/* Body */}
        <path d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32 C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z" fill="white"/>
        <path d="M20 31 C21 18 31 11 45 12 C53 13 57 21 55 33 C53 42 42 47 31 45 C21 43 18 37 20 31 Z" fill="#E87228" opacity="0.90"/>
        <path d="M51 11 C61 10 73 16 76 27 C78 35 73 43 63 45 C54 46 48 39 49 30 C50 19 49 12 51 11 Z" fill="#1E1412" opacity="0.90"/>
        <path d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32 C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.40"/>
        <path d="M24 34 Q31 37 38 35" stroke="white" strokeWidth="1.4" fill="none" opacity="0.50" strokeLinecap="round"/>

        {/* Neck */}
        <path d="M20 34 C17 29 17 22 20 18 C21 16 24 15 26 18 C28 21 27 28 26 33 Z" fill="white"/>

        {/* Head */}
        <circle cx="12" cy="17" r="11.5" fill="white"/>
        <path d="M2 11 C4 3 12 2 16 7 C19 11 18 18 14 20 C9 22 2 19 1 14 C1 12 1 11 2 11 Z" fill="#E87228" opacity="0.90"/>
        <path d="M13 9 C17 5 23 8 22 14 C21 18 17 20 14 18 C11 16 11 10 13 9 Z" fill="#1E1412" opacity="0.90"/>
        <circle cx="12" cy="17" r="11.5" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* Ears */}
        <polygon points="2,9 6,-3 13,9" fill="#E87228"/>
        <polygon points="3.5,8.5 6.5,-0.5 11,8.5" fill="#F4A888" opacity="0.75"/>
        <polygon points="2,9 6,-3 13,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <polygon points="11,9 17,-3 23,9" fill="#1E1412"/>
        <polygon points="12.5,8.5 17,-0.5 21.5,8.5" fill="#5A2030" opacity="0.60"/>
        <polygon points="11,9 17,-3 23,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.32"/>

        {/* Eyes */}
        <circle cx="8.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="8.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="8.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="9.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="17.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="17.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="17.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="18.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>

        {/* Nose + mouth */}
        <path d="M11.2 20 L12 21.5 L12.8 20 Z" fill="#F0A0B8"/>
        <line x1="12" y1="21.5" x2="12" y2="22.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M12 22.5 Q10.2 24 9 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M12 22.5 Q13.8 24 15 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* Whiskers */}
        <line x1="0.5" y1="20.5" x2="10" y2="21.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="0.5" y1="22.2" x2="10" y2="22.5" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="0.5" y1="23.9" x2="10" y2="23.5" stroke="#C8C0B8" strokeWidth="0.72"/>
        <line x1="14"  y1="21.5" x2="23.5" y2="20.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="14"  y1="22.5" x2="23.5" y2="22.2" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="14"  y1="23.5" x2="23.5" y2="23.9" stroke="#C8C0B8" strokeWidth="0.72"/>

        {/* Legs (animated) */}
        <path d="M21 43 Q20 44 20 53 Q20 55 22 55 Q24 55 24.5 53 Q24.5 44 23.5 43 Z"   fill="white"   stroke="#1A1210" strokeWidth="0.85" className="cat-leg-1"/>
        <path d="M29 44 Q28 45 28 53 Q28 55 30 55 Q32 55 32.5 53 Q32.5 45 31.5 44 Z"   fill="#EDE5DD" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-2"/>
        <path d="M55 43 Q54 44 54 52 Q54 54 56 54 Q58 54 58.5 52 Q58.5 44 57.5 43 Z"   fill="white"   stroke="#1A1210" strokeWidth="0.85" className="cat-leg-3"/>
        <path d="M63 44 Q62 45 62 52 Q62 54 64 54 Q66 54 66.5 52 Q66.5 45 65.5 44 Z"   fill="#1E1412" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-4"/>

        {/* Toe beans */}
        <ellipse cx="22.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.70"/>
        <ellipse cx="30.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.58"/>
        <ellipse cx="56.2" cy="53.5" rx="2.3" ry="1.0" fill="#F0A0B8" opacity="0.52"/>
        <ellipse cx="64.2" cy="53.5" rx="2.3" ry="1.0" fill="#7A4858" opacity="0.66"/>
      </g>

      {/* ════════════════════════════════════
          SITTING GROUP  (shifted 8u down to avoid ear clipping)
      ════════════════════════════════════ */}
      <g className="cat-sit" transform="translate(0, 8)">

        {/* Shadow */}
        <ellipse cx="22" cy="55.5" rx="18" ry="2" fill="#00000010"/>

        {/* Sitting tail — happy orange arc */}
        <path
          className="cat-sit-tail"
          d="M32 42 C42 54 26 62 14 56 C6 51 8 42 14 38"
          stroke="#E87228" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />

        {/* Sitting body */}
        <path d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z" fill="white"/>
        <path d="M9 46 C9 33 11 22 20 20 C28 18 32 26 31 38 C30 48 24 54 16 53 C11 52 9 50 9 46 Z" fill="#E87228" opacity="0.88"/>
        <path d="M24 19 C32 19 35 28 35 38 C35 48 30 54 24 54 C22 54 22 46 22 38 C22 28 22 19 24 19 Z" fill="#1E1412" opacity="0.88"/>
        <path d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <path d="M12 40 Q18 43 24 41" stroke="white" strokeWidth="1.3" fill="none" opacity="0.45" strokeLinecap="round"/>

        {/* Sitting paws */}
        <ellipse cx="15" cy="53" rx="5.5" ry="3" fill="white"    stroke="#1A1210" strokeWidth="0.8" opacity="0.80"/>
        <ellipse cx="27" cy="53" rx="5.5" ry="3" fill="#F0E8DF"  stroke="#1A1210" strokeWidth="0.8" opacity="0.72"/>

        {/* Sitting neck */}
        <path d="M14 20 C12 16 12 11 15 8 C16 7 19 7 20 9 C21 11 20 16 19 20 Z" fill="white" opacity="0.90"/>

        {/* Sitting head */}
        <circle cx="17" cy="9" r="11.5" fill="white"/>
        <path d="M7 3 C9 -4 16 -5 20 0 C23 4 22 11 18 13 C13 15 6 12 5 8 C5 6 5 4 7 3 Z" fill="#E87228" opacity="0.88"/>
        <path d="M18 1 C22 -2 28 1 27 7 C26 11 22 13 19 11 C16 9 16 2 18 1 Z" fill="#1E1412" opacity="0.88"/>
        <circle cx="17" cy="9" r="11.5" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* Sitting ears */}
        <polygon points="7,4 11,-8 18,4" fill="#E87228"/>
        <polygon points="8.5,3.5 11.5,-5 16,3.5" fill="#F4A888" opacity="0.72"/>
        <polygon points="7,4 11,-8 18,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.35"/>
        <polygon points="16,4 22,-8 28,4" fill="#1E1412"/>
        <polygon points="17.5,3.5 22,-5 26.5,3.5" fill="#5A2030" opacity="0.58"/>
        <polygon points="16,4 22,-8 28,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.30"/>

        {/* Sitting eyes */}
        <circle cx="13" cy="9" r="4.5" fill="#1A1210"/>
        <circle cx="13" cy="9" r="3.8" fill="#D4A820"/>
        <ellipse cx="13" cy="9" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="14.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="22"   cy="9" r="4.5" fill="#1A1210"/>
        <circle cx="22"   cy="9" r="3.8" fill="#D4A820"/>
        <ellipse cx="22"  cy="9" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="23.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>

        {/* Sitting nose + mouth */}
        <path d="M16.2 12 L17 13.5 L17.8 12 Z" fill="#F0A0B8"/>
        <line x1="17" y1="13.5" x2="17" y2="14.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M17 14.5 Q15.2 16 14 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M17 14.5 Q18.8 16 20 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* Sitting whiskers */}
        <line x1="5"  y1="12.5" x2="15" y2="13.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="5"  y1="14.2" x2="15" y2="14.5" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="5"  y1="15.9" x2="15" y2="15.5" stroke="#C8C0B8" strokeWidth="0.70"/>
        <line x1="19" y1="13.5" x2="29" y2="12.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="19" y1="14.5" x2="29" y2="14.2" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="19" y1="15.5" x2="29" y2="15.9" stroke="#C8C0B8" strokeWidth="0.70"/>
      </g>

    </svg>
  )
}
```

## File: src/components/Card.tsx
```typescript
import type { ReactNode } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  padding?: CardPadding
  onClick?: () => void
  className?: string
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export default function Card({ children, padding = 'md', onClick, className = '' }: CardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white shadow-sm',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
        paddingClasses[padding],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
```

## File: src/components/CareScheduleFields.tsx
```typescript
// traduzido e sem mock

import { useTranslation } from 'react-i18next'

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

interface Props {
  time:            string
  setTime:         (v: string) => void
  everyXDays:      boolean
  setEveryXDays:   (v: boolean) => void
  intervalDays:    string
  setIntervalDays: (fn: (prev: string) => string) => void
  recurring:       boolean
  setRecurring:    (v: boolean) => void
}

export default function CareScheduleFields({
  time, setTime,
  everyXDays, setEveryXDays,
  intervalDays, setIntervalDays,
  recurring, setRecurring,
}: Props) {
  const { t } = useTranslation()

  return (
    <>
      <div className="modal-section">{t('cares.schedule.section')}</div>

      <div className="form-group">
        <label className="form-label">
          {t('cares.schedule.time')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
        </label>
        <div className="field-icon-wrap">
          <span className="field-icon">🕐</span>
          <input className="form-input" type="time" value={time}
            onChange={e => setTime(e.target.value)}
            style={{ colorScheme:'light' }}/>
        </div>
      </div>

      <div className="toggle-row">
        <div className="toggle-row-info">
          <div className="toggle-row-label">📅 {t('cares.schedule.everyXDaysLabel')}</div>
          <div className="toggle-row-sub">
            {everyXDays
              ? t('cares.schedule.everyXDaysSub', { n: intervalDays })
              : t('cares.schedule.dailySub')}
          </div>
        </div>
        <Toggle on={everyXDays} onChange={setEveryXDays} />
      </div>

      {everyXDays && (
        <div className="form-group" style={{ marginTop:'.625rem' }}>
          <label className="form-label">{t('cares.schedule.repeatEvery')}</label>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
            <button type="button"
              style={{ width:36, height:36, borderRadius:'var(--r-md)',
                border:'1.5px solid var(--border)', background:'var(--surface-offset)',
                fontSize:'1.1rem', cursor:'pointer' }}
              onClick={() => setIntervalDays(d => String(Math.max(2, Number(d)-1)))}>−
            </button>
            <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)',
              minWidth:32, textAlign:'center' }}>
              {intervalDays}
            </div>
            <button type="button"
              style={{ width:36, height:36, borderRadius:'var(--r-md)',
                border:'1.5px solid var(--border)', background:'var(--surface-offset)',
                fontSize:'1.1rem', cursor:'pointer' }}
              onClick={() => setIntervalDays(d => String(Math.min(60, Number(d)+1)))}>+
            </button>
            <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>
              {t('cares.schedule.days')}
            </span>
          </div>
        </div>
      )}

      <div className="toggle-row" style={{ marginTop: everyXDays ? '.75rem' : 0 }}>
        <div className="toggle-row-info">
          <div className="toggle-row-label">🔁 {t('cares.schedule.recurringLabel')}</div>
          <div className="toggle-row-sub">
            {recurring
              ? t('cares.schedule.recurringSub')
              : t('cares.schedule.onceSub')}
          </div>
        </div>
        <Toggle on={recurring} onChange={setRecurring} />
      </div>
    </>
  )
}
```

## File: src/components/EmptyState.tsx
```typescript
import type { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

const DefaultIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9h.01M15 9h.01M9 15s1 2 3 2 3-2 3-2" strokeLinecap="round" />
  </svg>
)

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <span className="text-stone-400">{icon ?? <DefaultIcon />}</span>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-stone-800">{title}</h3>
        {description && <p className="max-w-xs text-sm text-stone-500">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
```

## File: src/components/Input.tsx
```typescript
import { useId, type ChangeEvent } from 'react'

interface InputProps {
  label: string
  name: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel'
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  disabled = false,
  required = false,
  className = '',
}: InputProps) {
  const id = useId()

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={[
          'w-full rounded-xl border px-3 py-2 text-sm text-stone-900',
          'placeholder:text-stone-400 focus:outline-none focus:ring-2',
          'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-400 focus:ring-red-500 bg-red-50'
            : 'border-stone-300 focus:ring-teal-600 bg-white',
        ].join(' ')}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">{error}</p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="text-xs text-stone-500">{hint}</p>
      )}
    </div>
  )
}
```

## File: src/components/InviteSentOverlay.tsx
```typescript
interface Props {
  email:   string
  onClose: () => void
}

export default function InviteSentOverlay({ email, onClose }: Props) {
  return (
    <div className="invite-sent-overlay" onClick={onClose}>
      <div className="invite-sent-card" onClick={e => e.stopPropagation()}>
        <div className="invite-sent-icon">✉</div>

        <div style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--text)', marginBottom:'.5rem' }}>
          ¡Invitación enviada!
        </div>
        <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'1.25rem' }}>
          Se ha enviado una invitación a<br/>
          <strong style={{ color:'var(--text)' }}>{email}</strong><br/>
          para unirse como cuidador.
        </div>

        <div style={{ background:'var(--success-hl)', border:'1.5px solid var(--success)', borderRadius:'var(--r-lg)', padding:'.625rem 1rem', marginBottom:'1.25rem', fontSize:'.8125rem', color:'var(--success)', fontWeight:700 }}>
          ✓ El enlace de invitación expira en 48 horas
        </div>

        <button className="pf-btn pf-btn--primary pf-btn--full" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  )
}
```

## File: src/components/MiniVaccRing.tsx
```typescript
interface MiniVaccRingProps {
  coverage: number
  size?: number
  strokeWidth?: number
}

export default function MiniVaccRing({ coverage, size = 48, strokeWidth = 5 }: MiniVaccRingProps) {
  const r     = (size - strokeWidth) / 2
  const c     = 2 * Math.PI * r
  const color = coverage >= 80 ? 'var(--success)' : coverage >= 50 ? 'var(--warn)' : 'var(--err)'
  const track = 'var(--surface-offset)'

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem', flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={track} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - coverage / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition:'stroke-dashoffset .5s cubic-bezier(.16,1,.3,1)' }}
        />
        <text x={size/2} y={size/2 + 3.5}
          textAnchor="middle"
          fontFamily="Nunito,sans-serif"
          fontWeight="800"
          fontSize={size * 0.24}
          fill={color}>
          {coverage}%
        </text>
      </svg>
      <span style={{ fontSize:'.55rem', fontWeight:800, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:'.05em' }}>
        Vacunas
      </span>
    </div>
  )
}
```

## File: src/components/NetworkError.tsx
```typescript
/**
 * Reusable error state component for network failures.
 * Shows the error message + an optional retry button.
 */
interface Props {
  message: string;
  onRetry?: () => void;
}

export default function NetworkError({ message, onRetry }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '1rem', padding: '3rem 1.5rem',
      textAlign: 'center',
    }}>
      <span style={{ fontSize: '2rem' }}>⚠️</span>
      <p style={{ fontSize: '.875rem', color: 'var(--err)', fontWeight: 700, margin: 0 }}>
        {message}
      </p>
      {onRetry && (
        <button
          className="pf-btn pf-btn--primary"
          onClick={onRetry}
        >
          🔄 Reintentar
        </button>
      )}
    </div>
  );
}
```

## File: src/components/NotificationPanel.tsx
```typescript
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Notification {
  id:      string
  type:    'vaccine' | 'medication' | 'symptom' | 'care' | 'system'
  title:   string
  body:    string
  time:    string
  read:    boolean
  to?:     string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id:'n1', type:'vaccine',    title:'Vacuna vencida — Luna',       body:'Rabia canina venció el 10 mar. Registra la nueva fecha.',       time:'Hoy 09:14',   read:false, to:'/vaccines'    },
  { id:'n2', type:'symptom',    title:'Síntoma activo — Toby',       body:'Tos sin fiebre lleva 7 días sin resolución.',                   time:'Hoy 08:00',   read:false, to:'/symptoms'    },
  { id:'n3', type:'medication', title:'Próxima dosis — Toby',        body:'Pipeta antipulgas: dosis en 5 días (30 abr).',                  time:'Ayer 18:30',  read:false, to:'/medications' },
  { id:'n4', type:'care',       title:'Cuidados pendientes',         body:'Toby tiene 2 cuidados urgentes sin completar hoy.',             time:'Ayer 12:00',  read:true,  to:'/cares'       },
  { id:'n5', type:'vaccine',    title:'Recordatorio — Toby',         body:'Antirrábica programada para el 5 jun. Confirma la cita.',       time:'Hace 2 días', read:true,  to:'/vaccines'    },
  { id:'n6', type:'system',     title:'Invitación aceptada',         body:'Ana Martínez se unió como cuidadora de Luna.',                  time:'Hace 3 días', read:true                     },
]

const TYPE_ICON: Record<string, string> = {
  vaccine:    '💉',
  medication: '💊',
  symptom:    '🌡️',
  care:       '🐾',
  system:     '✉️',
}
const TYPE_COLOR: Record<string, string> = {
  vaccine:    'var(--blue)',
  medication: 'var(--warn)',
  symptom:    'var(--err)',
  care:       'var(--success)',
  system:     'var(--primary)',
}
const TYPE_BG: Record<string, string> = {
  vaccine:    'var(--blue-hl)',
  medication: 'var(--warn-hl)',
  symptom:    'var(--err-hl)',
  care:       'var(--success-hl)',
  system:     'var(--primary-hl)',
}

export default function NotificationsPanel() {
  const [open,       setOpen]       = useState(false)
  const [notifs,     setNotifs]     = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const unread = notifs.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markRead    = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  const dismiss     = (id: string) => setNotifs(n => n.filter(x => x.id !== id))

  const handleClick = (notif: Notification) => {
    markRead(notif.id)
    if (notif.to) { navigate(notif.to); setOpen(false) }
  }

  return (
    <div ref={panelRef} style={{ position: 'relative', display: 'flex' }}>
      {/* Bell button */}
      <button
        className="topbar-icon-btn"
        title="Notificaciones"
        aria-label={`Notificaciones${unread > 0 ? ` · ${unread} sin leer` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{ position: 'relative' }}
      >
        {/* Bell SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {/* Unread badge */}
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--err)', color: '#fff',
            fontSize: '.6rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--nav-bg)',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          zIndex: 500,
          width: 340,
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          boxShadow: '0 8px 32px rgba(44,52,98,.18), 0 24px 60px rgba(44,52,98,.14)',
          animation: 'pm-rise 180ms cubic-bezier(.16,1,.3,1) both',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '.875rem 1rem .75rem',
            borderBottom: '1.5px solid var(--divider)',
            background: 'var(--surface-2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>Notificaciones</span>
              {unread > 0 && (
                <span style={{ background: 'var(--err)', color: '#fff', fontSize: '.65rem', fontWeight: 800, borderRadius: 'var(--r-full)', padding: '.15rem .45rem' }}>
                  {unread} nuevas
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                Marcar todo leído
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-faint)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🔔</div>
                <div style={{ fontSize: '.875rem', fontWeight: 600 }}>Sin notificaciones nuevas</div>
              </div>
            ) : notifs.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  display: 'flex', gap: '.75rem', padding: '.75rem 1rem',
                  borderBottom: '1px solid var(--divider)',
                  background: n.read ? 'transparent' : 'var(--primary-hl)',
                  cursor: n.to ? 'pointer' : 'default',
                  transition: 'background var(--trans)',
                  position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-offset)')}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'var(--primary-hl)')}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div style={{ position: 'absolute', left: '.375rem', top: '50%', marginTop: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}/>
                )}

                {/* Icon */}
                <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: TYPE_BG[n.type], color: TYPE_COLOR[n.type], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  {TYPE_ICON[n.type]}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 600 : 800, fontSize: '.8125rem', color: 'var(--text)', marginBottom: '.15rem' }}>{n.title}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.body}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', marginTop: '.25rem', fontWeight: 600 }}>{n.time}</div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                  style={{ width: 24, height: 24, borderRadius: 'var(--r-sm)', background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.7rem', alignSelf: 'flex-start', marginTop: '.1rem' }}
                  title="Descartar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div style={{ padding: '.625rem 1rem', borderTop: '1.5px solid var(--divider)', background: 'var(--surface-2)', textAlign: 'center' }}>
              <button onClick={() => setOpen(false)} style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

## File: src/components/OverviewCard.tsx
```typescript
import type { ReactNode } from 'react'
import type { BadgeStatus } from '../types'
import Badge from './Badge'

interface OverviewCardProps {
  title: string
  value: string | number
  description?: string
  status?: BadgeStatus
  statusLabel?: string
  icon?: ReactNode
  onClick?: () => void
}

export default function OverviewCard({
  title, value, description, status, statusLabel, icon, onClick,
}: OverviewCardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white p-5 shadow-sm flex flex-col gap-3',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-600">{title}</p>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>

      <p className="text-3xl font-bold tabular-nums text-stone-900">{value}</p>

      {description && <p className="text-xs text-stone-500">{description}</p>}

      {status && statusLabel && (
        <Badge label={statusLabel} status={status} />
      )}
    </div>
  )
}
```

## File: src/components/PetCard.tsx
```typescript
import type { Pet } from '../types'
import Avatar from './Avatar'
import Badge, { } from './Badge'
import Card from './Card'
import type { BadgeStatus } from '../types'

interface PetCardProps {
  pet: Pet
  onClick?: (pet: Pet) => void
  isActive?: boolean
}

const speciesLabel: Record<string, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  reptile: 'Reptil',
  other: 'Otro',
}

const speciesStatus: Record<string, BadgeStatus> = {
  dog: 'info',
  cat: 'success',
  bird: 'warning',
  rabbit: 'neutral',
  reptile: 'danger',
  other: 'neutral',
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return 'Edad desconocida'
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
  if (months < 12) return `${months} mes${months === 1 ? '' : 'es'}`
  const years = Math.floor(months / 12)
  return `${years} año${years === 1 ? '' : 's'}`
}

export default function PetCard({ pet, onClick, isActive = false }: PetCardProps) {
  return (
    <Card
      padding="md"
      onClick={onClick ? () => onClick(pet) : undefined}
      className={isActive ? 'ring-2 ring-teal-600 border-teal-300' : ''}
    >
      <div className="flex items-center gap-3">
        <Avatar name={pet.name} photoUrl={pet.photoUrl} size="md" />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 truncate">{pet.name}</p>
          <p className="text-xs text-stone-500 truncate">
            {pet.breed ?? 'Raza desconocida'} · {calcAge(pet.birthDate)}
          </p>
        </div>

        <Badge
          label={speciesLabel[pet.species] ?? 'Otro'}
          status={speciesStatus[pet.species] ?? 'neutral'}
        />
      </div>
    </Card>
  )
}
```

## File: src/components/SkeletonLoader.tsx
```typescript
interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={['rounded-lg bg-stone-200 skeleton-shimmer', className].join(' ')}
      aria-hidden="true"
    />
  )
}

export function SkeletonPetCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-stone-200">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonOverviewCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  )
}
```

## File: src/components/VaccRing.tsx
```typescript
interface VaccRingProps {
  coverage: number  
  size?: number      
  strokeWidth?: number
}

export default function VaccRing({ coverage, size = 64, strokeWidth = 6 }: VaccRingProps) {
  const r   = (size - strokeWidth) / 2
  const c   = 2 * Math.PI * r
  const color = coverage >= 80 ? 'var(--success)' : coverage >= 50 ? 'var(--warn)' : 'var(--err)'
  const label = coverage >= 80 ? '💉' : coverage >= 50 ? '⚠' : '✕'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.2rem', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--surface-offset)" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - coverage / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)' }}
        />
        {/* Texto central */}
        <text
          x={size / 2} y={size / 2 + 4}
          textAnchor="middle"
          fontFamily="Nunito, sans-serif"
          fontWeight="800"
          fontSize={size * 0.22}
          fill="var(--text)"
        >
          {coverage}%
        </text>
      </svg>
      <span style={{ fontSize: '.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
        {label} Vacunas
      </span>
    </div>
  )
}
```

## File: src/context/conditionsCatalog.tsx
```typescript
export const CONDITION_GROUPS = {
  endocrine:    'Endócrinas y Metabólicas',
  degenerative: 'Degenerativas y Estructurales',
  viral:        'Virales Incurables',
  neurological: 'Neurológicas y Autoinmunes',
  other:        'Otras Condiciones',
} as const

export interface ConditionItem {
  id: string; label: string; group: string; species?: 'cat' | 'dog'
}

export const CONDITIONS_CATALOG: ConditionItem[] = [
  { id: 'diabetes',        label: 'Diabetes Mellitus',            group: CONDITION_GROUPS.endocrine },
  { id: 'hypothyroidism',  label: 'Hipotiroidismo',               group: CONDITION_GROUPS.endocrine,    species: 'dog' },
  { id: 'hyperthyroidism', label: 'Hipertiroidismo',              group: CONDITION_GROUPS.endocrine,    species: 'cat' },
  { id: 'ckd',             label: 'Insuficiencia Renal Crónica',  group: CONDITION_GROUPS.degenerative },
  { id: 'arthritis',       label: 'Artritis y Artrosis',          group: CONDITION_GROUPS.degenerative },
  { id: 'hipdysplasia',    label: 'Displasia de Cadera',          group: CONDITION_GROUPS.degenerative },
  { id: 'cardiopathy',     label: 'Cardiopatías Crónicas',        group: CONDITION_GROUPS.degenerative },
  { id: 'felv',            label: 'FeLV Leucemia Felina',         group: CONDITION_GROUPS.viral,        species: 'cat' },
  { id: 'fiv',             label: 'FIV Inmunodeficiencia Felina', group: CONDITION_GROUPS.viral,        species: 'cat' },
  { id: 'epilepsy',        label: 'Epilepsia',                    group: CONDITION_GROUPS.neurological },
  { id: 'lupus',           label: 'Lupus y Pénfigo',              group: CONDITION_GROUPS.neurological },
  { id: 'atopy',           label: 'Atopia y Alergias Crónicas',   group: CONDITION_GROUPS.other },
  { id: 'blinddeaf',       label: 'Ceguera o Sordera',            group: CONDITION_GROUPS.other },
]
```

## File: src/context/LanguageContext.tsx
```typescript
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import i18n from '../i18n/i18n'
import type { Lang } from '../i18n/locales/types'

interface LanguageContextValue {
  lang:    Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es', setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang) ?? 'es'
  )

  const setLang = (l: Lang) => {
    setLangState(l)
    i18n.changeLanguage(l)
    localStorage.setItem('lang', l)
  }

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
```

## File: src/styles/base.css
```css
/* ── Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  font-size: .9375rem;
  color: var(--text);
  background: var(--bg);
  min-height: 100dvh;
  line-height: 1.5;
}

button  { cursor: pointer; background: none; border: none; font: inherit; color: inherit }
a       { color: inherit; text-decoration: none }
img     { display: block; max-width: 100% }
ul      { list-style: none }
input, select, textarea { font: inherit; color: inherit }

/* ── Focus visible — keyboard accessibility ─────────────── */
:focus-visible {
  outline: 2.5px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--r-sm);
}

/* ── Scrollbar ──────────────────────────────────────────── */
::-webkit-scrollbar              { width: 5px; height: 5px }
::-webkit-scrollbar-track        { background: transparent }
::-webkit-scrollbar-thumb        { background: var(--border); border-radius: 99px }
::-webkit-scrollbar-thumb:hover  { background: var(--text-faint) }

/* ── Global animations ──────────────────────────────────── */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## File: src/styles/catAnim.css
```css
/* ══════════════════════════════════════════════════════════════════
   PITUTI — Cat Animation Styles
   src/styles/catAnim.css
   
   Import in main.tsx:  import './styles/catAnim.css'
   
   Contains ALL animation logic for the calico cat in the topbar.
   Edit here, changes propagate automatically — no more JS string.
   ══════════════════════════════════════════════════════════════════ */

/* ── Topbar: allow overflow so ears/tail aren't clipped ───────── */
.topbar { overflow: visible !important; }

/* ── Pituti title letter-by-letter reveal ─────────────────────── */
export const ANIM_CSS = `
.pituti-anim-wrap {
  display: flex;
  font-style: italic;
}
.pituti-anim-wrap span {
  display: inline-block;
  opacity: 0;
  animation: letterAppear 0.75s cubic-bezier(.16,1,.3,1) forwards;
  animation-delay: calc(var(--i, 0) * 220ms);
}
@keyframes letterAppear {
  from { opacity: 0; transform: translateX(-8px) translateY(3px); }
  to   { opacity: 1; transform: translateX(0) translateY(0); }
}

/* Collapsed sidebar: hide text + cat */
.sidebar-collapsed .topbar-logo .pituti-anim-wrap {
  opacity: 0;
  transform: translateX(-8px);
  pointer-events: none;
  width: 0;
  overflow: hidden;
  transition: opacity 200ms, transform 200ms, width 200ms;
}
.sidebar-collapsed .calico-cat {
  opacity: 0 !important;
  transition: opacity 200ms;
}

/* ── Cat container ────────────────────────────────────────────── */
.calico-cat {
  position: absolute;
  left: 148px;
  top: 50%;
  margin-top: -22px;
  z-index: 10;
  pointer-events: none;
  overflow: visible;
  transform-origin: center bottom;
  animation: catJourney 5.6s cubic-bezier(.08, 0, .6, 1) 0.4s forwards;
}

/* Mobile: shift cat further right so it never overlaps "Pituti" text */
@media (max-width: 768px) {
  .calico-cat {
    left: auto;
    right: 72px;   /* stays safely before the action buttons */
    animation: catJourneyMobile 5.6s cubic-bezier(.08, 0, .6, 1) 0.4s forwards;
  }
}

/* ── Desktop journey: slides from right edge to rest ─────────── */
@keyframes catJourney {
  0%   { transform: translateX(calc(50vw - 148px)); opacity: 0; }
  2%   { opacity: 1; }
  8%   { transform: translateX(calc(50vw * .46)) rotate(-0.5deg); }
  16%  { transform: translateX(calc(50vw * .38)) rotate(-0.5deg); }
  24%  { transform: translateX(calc(50vw * .30)) rotate(-0.5deg); }
  32%  { transform: translateX(calc(50vw * .22)) rotate(-0.5deg); }
  40%  { transform: translateX(calc(50vw * .15)) rotate(-0.5deg); }
  48%  { transform: translateX(calc(50vw * .09)) rotate(-0.5deg); }
  56%  { transform: translateX(calc(50vw * .05)) rotate(-0.4deg); }
  63%  { transform: translateX(calc(50vw * .02)) rotate(-0.3deg); }
  70%  { transform: translateX(16px) rotate(-0.2deg); }
  76%  { transform: translateX(8px)  rotate(-0.1deg); }
  80%  { transform: translateX(4px)  rotate(0deg); }
  85%  { transform: translateX(2px)  translateY(2px); }
  90%  { transform: translateX(2px)  translateY(-1px); }
  95%  { transform: translateX(2px)  translateY(0px); }
  100% { transform: translateX(2px)  translateY(0px); opacity: 1; }
}

/* ── Mobile journey: slides from far right, stops at right: 72px ─ */
@keyframes catJourneyMobile {
  0%   { transform: translateX(120px); opacity: 0; }
  2%   { opacity: 1; }
  30%  { transform: translateX(90px) rotate(-0.5deg); }
  55%  { transform: translateX(40px) rotate(-0.4deg); }
  72%  { transform: translateX(16px) rotate(-0.2deg); }
  82%  { transform: translateX(4px)  rotate(0deg); }
  87%  { transform: translateX(2px)  translateY(2px); }
  92%  { transform: translateX(2px)  translateY(-1px); }
  96%  { transform: translateX(2px)  translateY(0px); }
  100% { transform: translateX(2px)  translateY(0px); opacity: 1; }
}

/* ── Walk → Sit crossfade at 5.05s ───────────────────────────── */
.cat-walk {
  animation: walkFade 0.65s ease-in-out 5.05s forwards;
}
.cat-sit {
  opacity: 0;
  animation: sitFade  0.65s ease-in-out 5.05s forwards;
}
@keyframes walkFade { to { opacity: 0; } }
@keyframes sitFade  { to { opacity: 1; } }

/* ── Legs: sprite-sheet steps(8) ─────────────────────────────── */
.cat-leg-1, .cat-leg-2, .cat-leg-3, .cat-leg-4 {
  transform-box: fill-box;
  transform-origin: top center;
}
.cat-leg-1 { animation: legCycle 0.56s steps(8, end) 0.40s 9 forwards; }
.cat-leg-4 { animation: legCycle 0.56s steps(8, end) 0.40s 9 forwards; }
.cat-leg-2 { animation: legCycle 0.56s steps(8, end) 0.68s 9 forwards; }
.cat-leg-3 { animation: legCycle 0.56s steps(8, end) 0.68s 9 forwards; }

@keyframes legCycle {
  0%    { transform: rotate(0deg)    translateY(0px);  }
  12.5% { transform: rotate(-18deg)  translateY(0px);  }
  25%   { transform: rotate(-28deg)  translateY(0px);  }
  37.5% { transform: rotate(-16deg)  translateY(-7px); }
  50%   { transform: rotate(4deg)    translateY(-10px);}
  62.5% { transform: rotate(22deg)   translateY(-7px); }
  75%   { transform: rotate(26deg)   translateY(-3px); }
  87.5% { transform: rotate(16deg)   translateY(0px);  }
  100%  { transform: rotate(0deg)    translateY(0px);  }
}

/* ── Walking tail ─────────────────────────────────────────────── */
.cat-walk-tail {
  transform-box: fill-box;
  transform-origin: 0% 100%;
  animation: tailSway 0.9s ease-in-out 0.4s 6 forwards;
}
@keyframes tailSway {
  0%   { transform: rotate(0deg);  }
  25%  { transform: rotate(8deg);  }
  75%  { transform: rotate(-8deg); }
  100% { transform: rotate(0deg);  }
}

/* ── Sitting tail — happy slow sway ──────────────────────────── */
.cat-sit-tail {
  transform-box: fill-box;
  transform-origin: 30% 20%;
  animation: sitTailSway 2.2s ease-in-out 5.8s infinite;
}
@keyframes sitTailSway {
  0%, 100% { transform: rotate(0deg);  }
  40%      { transform: rotate(4deg);  }
  70%      { transform: rotate(-3deg); }
}

/* ── Reduced motion: stop everything ─────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .calico-cat,
  .cat-walk, .cat-sit,
  .cat-walk-tail, .cat-sit-tail,
  .cat-leg-1, .cat-leg-2, .cat-leg-3, .cat-leg-4,
  .pituti-anim-wrap span {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .calico-cat { left: 148px; }
}
```

## File: src/styles/components/badges.css
```css
/* ── Badge ──────────────────────────────────────────────── */
.badge {
  display: inline-flex; align-items: center; gap: .25rem;
  padding: .2rem .65rem; border-radius: var(--r-full);
  font-size: .6875rem; font-weight: 800;
}
.badge-green  { background: var(--success-hl); color: var(--success) }
.badge-yellow { background: var(--gold-hl);    color: var(--gold) }
.badge-red    { background: var(--err-hl);     color: var(--err) }
.badge-blue   { background: var(--blue-hl);    color: var(--blue) }
.badge-gray   { background: var(--surface-offset); color: var(--text-muted) }

/* ── Status Pill ─────────────────────────────────────────────── */
.status-pill {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .3rem .875rem;
  border-radius: var(--r-full);
  font-size: .75rem; font-weight: 800;
}
.status-pill.ok      { background: var(--success-hl); color: var(--success); border: 1.5px solid var(--success); }
.status-pill.soon    { background: var(--gold-hl);    color: var(--gold);    border: 1.5px solid var(--gold); }
.status-pill.late    { background: var(--err-hl);     color: var(--err);     border: 1.5px solid var(--err); }
.status-pill.active  { background: var(--err-hl);     color: var(--err);     border: 1.5px solid var(--err); }
.status-pill.resolved{ background: var(--success-hl); color: var(--success); border: 1.5px solid var(--success); }
.status-pill.archived{ background: var(--surface-offset); color: var(--text-faint); border: 1.5px solid var(--border); }
```

## File: src/styles/components/buttons.css
```css
/* ── Buttons ────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .5rem 1.125rem; border-radius: var(--r-lg);
  font-size: .875rem; font-weight: 700; cursor: pointer; border: none;
  transition: background var(--trans), color var(--trans), box-shadow var(--trans), transform var(--trans);
}
.btn:active { transform: scale(.97) }
.btn-sm     { padding: .3rem .75rem; font-size: .8125rem }
.btn-xs     { padding: .2rem .55rem; font-size: .75rem; border-radius: var(--r-md) }
.btn-icon   { padding: .25rem .5rem; font-size: 1.25rem; line-height: 1; border-radius: var(--r-md); min-width: 32px; justify-content: center }

.btn-primary {
  background: linear-gradient(150deg, var(--primary) 0%, #3d4f82 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(91,108,158,.28), inset 0 1px 0 rgba(255,255,255,.12);
  border: none;
}
.btn-primary:hover {
  background: linear-gradient(150deg, #4a5a8f 0%, var(--primary-h) 100%);
  box-shadow: 0 5px 18px rgba(91,108,158,.44), inset 0 1px 0 rgba(255,255,255,.15);
  transform: translateY(-1px);
}
.btn-primary:active { transform: scale(.97) translateY(0) }

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1.5px solid var(--border);
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.btn-secondary:hover {
  background: var(--surface-offset);
  border-color: var(--text-faint);
  box-shadow: 0 2px 8px rgba(0,0,0,.10);
}

/* Ghost — usado para Cancelar/Cerrar, com borda visível */
.btn-ghost {
  color: var(--text-muted);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  background: transparent;
  transition: all var(--trans);
}
.btn-ghost:hover {
  background: var(--surface-offset);
  color: var(--text);
  border-color: var(--text-faint);
}

.btn-danger {
  background: var(--err-hl);
  color: var(--err);
  border: 1.5px solid rgba(200,64,106,.3);
}
.btn-danger:hover {
  background: var(--err);
  color: #fff;
  box-shadow: 0 4px 14px rgba(200,64,106,.35);
  border-color: transparent;
}

/* Success — marcar cuidado como feito, aplicar vacina */
.btn-success { background: var(--success); color: #fff }
.btn-success:hover {
  background: color-mix(in oklab, var(--success) 85%, black);
  box-shadow: var(--sh-md);
}

/* ── Modern Edit Icon ────────────────────────────────────── */
.icon-edit-pen { display: inline-flex }

/* ── Footer de modal — grupos de botões ─────────────────── */
.pf-footer {
  display: flex; align-items: center;
  gap: .625rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
  flex-shrink: 0;
}
.pf-footer--spread  { justify-content: space-between }
.pf-footer--end     { justify-content: flex-end }
.pf-footer__left    { display: flex; gap: .5rem; margin-right: auto }
.pf-footer__right   { display: flex; gap: .5rem; margin-left: auto }

/* ── pf-btn (botões de modal/overlay) ───────────────────── */
.pf-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: .4rem; padding: .6rem 1.25rem; border-radius: var(--r-lg);
  font-family: inherit; font-size: .875rem; font-weight: 700;
  cursor: pointer; border: none; letter-spacing: .01em;
  white-space: nowrap; min-width: 100px;
  transition:
    background 160ms cubic-bezier(.16,1,.3,1),
    box-shadow  160ms cubic-bezier(.16,1,.3,1),
    transform   100ms cubic-bezier(.16,1,.3,1),
    color       160ms;
  user-select: none; -webkit-user-select: none;
}
.pf-btn:active   { transform: scale(.96) }
.pf-btn:disabled { opacity: .45; cursor: not-allowed; transform: none !important }
.pf-btn svg      { flex-shrink: 0 }

/* Variantes */
.pf-btn--close,
.pf-btn--cancel   { background: var(--surface-offset); color: var(--text-muted); border: 1.5px solid var(--border); min-width: 90px }
.pf-btn--close:hover,
.pf-btn--cancel:hover { background: var(--surface); color: var(--text); border-color: var(--text-faint) }

.pf-btn--save,
.pf-btn--primary  { background: linear-gradient(150deg, var(--primary) 0%, #3a4c80 100%); color: #fff; box-shadow: 0 3px 10px rgba(91,108,158,.32), inset 0 1px 0 rgba(255,255,255,.14); border: none }
.pf-btn--save:hover,
.pf-btn--primary:hover { background: linear-gradient(150deg, #4a5a90 0%, var(--primary-h) 100%); box-shadow: 0 6px 20px rgba(91,108,158,.44); transform: translateY(-1px) }

.pf-btn--register,
.pf-btn--add      { background: linear-gradient(150deg, var(--success) 0%, #3d7a4a 100%); color: #fff; box-shadow: 0 3px 10px rgba(85,128,96,.32); border: none }
.pf-btn--register:hover,
.pf-btn--add:hover { box-shadow: 0 6px 20px rgba(85,128,96,.44); transform: translateY(-1px) }

.pf-btn--done     { background: linear-gradient(150deg, #2d9e62 0%, #1e7a4a 100%); color: #fff; box-shadow: 0 3px 10px rgba(45,158,98,.3); border: none }
.pf-btn--done:hover { box-shadow: 0 6px 20px rgba(45,158,98,.42); transform: translateY(-1px) }

.pf-btn--edit     { background: var(--primary-hl); color: var(--primary); border: 1.5px solid rgba(91,108,158,.25); min-width: 90px }
.pf-btn--edit:hover { background: var(--primary); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(91,108,158,.35); transform: translateY(-1px) }

.pf-btn--archive  { background: var(--surface-offset); color: var(--text-muted); border: 1.5px solid var(--border); min-width: 90px }
.pf-btn--archive:hover { background: var(--gold-hl); color: var(--gold); border-color: var(--gold) }

.pf-btn--resolve  { background: var(--success-hl); color: var(--success); border: 1.5px solid rgba(85,128,96,.3) }
.pf-btn--resolve:hover { background: var(--success); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(85,128,96,.35); transform: translateY(-1px) }

.pf-btn--delete,
.pf-btn--danger   { background: var(--err-hl); color: var(--err); border: 1.5px solid rgba(200,64,106,.25); min-width: 90px }
.pf-btn--delete:hover,
.pf-btn--danger:hover { background: var(--err); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(200,64,106,.38); transform: translateY(-1px) }

.pf-btn--warn     { background: var(--warn-hl); color: var(--warn); border: 1.5px solid rgba(184,96,18,.25) }
.pf-btn--warn:hover { background: var(--warn); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(184,96,18,.35); transform: translateY(-1px) }

/* Tamanhos */
.pf-btn--sm   { padding: .4rem .875rem; font-size: .8125rem; min-width: 70px;  border-radius: var(--r-md) }
.pf-btn--lg   { padding: .75rem 1.75rem; font-size: .9375rem; min-width: 140px; border-radius: var(--r-xl) }
.pf-btn--full { width: 100% }
.pf-btn--icon { width: 36px; height: 36px; min-width: unset; padding: 0; border-radius: var(--r-md) }

/* ── Back Button ─────────────────────────────────────────── */
.back-btn {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .35rem .75rem; border-radius: var(--r-full);
  background: var(--surface-offset); border: 1.5px solid var(--border);
  color: var(--text-muted); font-size: .8125rem; font-weight: 700;
  cursor: pointer; transition: all var(--trans);
  margin-bottom: 1rem; flex-shrink: 0;
}
.back-btn:hover { background: var(--surface); color: var(--primary); border-color: var(--primary) }

/* ── Focus visible ───────────────────────────────────────── */
.btn:focus-visible,
.pf-btn:focus-visible { outline-offset: 3px }  /* ← } adicionado */
```

## File: src/styles/components/cards.css
```css
/* ── Cards ──────────────────────────────────────────────── */
.card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--r-xl); padding: 1.375rem;
  box-shadow: var(--sh-sm);
}
.card-title {
  font-size: .9375rem; font-weight: 800; color: var(--text);
  margin-bottom: .875rem;
  display: flex; align-items: center; gap: .5rem; justify-content: space-between;
}

/* ── KPI Cards ──────────────────────────────────────────── */
.kpi {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--r-xl); padding: 1rem 1.25rem;
  box-shadow: var(--sh-sm); display: flex; flex-direction: column; gap: .25rem;
}
.kpi-label { font-size: .75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .07em }
.kpi-value { font-size: 1.75rem; font-weight: 800; color: var(--text); line-height: 1; font-variant-numeric: tabular-nums }
.kpi-sub { font-size: .75rem; color: var(--text-muted); display: flex; align-items: center; gap: .25rem; margin-top: .125rem }
.kpi-icon { width: 36px; height: 36px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; margin-bottom: .25rem }

/* ── Stat Row / Chips ───────────────────────────────────── */
.stat-row { display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap }
.stat-chip { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-lg); padding: .625rem 1rem; flex: 1; min-width: 100px }
.stat-chip-label { font-size: .6875rem; text-transform: uppercase; letter-spacing: .07em; color: var(--text-faint); font-weight: 700; margin-bottom: .2rem }
.stat-chip-value { font-size: 1.1rem; font-weight: 800; color: var(--text) }




/* ── Pet Detail Expandable Chip ─────────────────────────── */
.stat-chip.clickable {
  cursor: pointer;
  transition: all var(--trans);
  position: relative;
}
.stat-chip.clickable:hover {
  border-color: var(--primary);
  background: var(--primary-hl);
  box-shadow: 0 0 0 2px var(--primary-hl);
}
.stat-chip.clickable:hover .stat-chip-label { color: var(--primary); }
.stat-chip-edit-hint {
  position: absolute;
  top: .375rem; right: .5rem;
  color: var(--text-faint);
  opacity: 0;
  transition: opacity var(--trans);
  font-size: .6rem;
}
.stat-chip.clickable:hover .stat-chip-edit-hint { opacity: 1; }

/* ── Grid Utils ─────────────────────────────────────────── */
.grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.125rem }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.125rem }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.125rem }
.grid-auto { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 1.125rem }

/* ── List Items ─────────────────────────────────────────── */
.list-item { display: flex; align-items: center; gap: .875rem; padding: .875rem .75rem; border-radius: var(--r-lg); transition: background var(--trans); cursor: pointer }
.list-item:hover { background: var(--surface-offset) }
.list-item-icon { width: 38px; height: 38px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
.list-item-info { flex: 1; min-width: 0 }
.list-item-title { font-size: .875rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
.list-item-sub   { font-size: .75rem; color: var(--text-muted) }
.list-item-right { display: flex; align-items: center; gap: .5rem; flex-shrink: 0 }





/* ── Divider ────────────────────────────────────────────── */
.divider { height: 1.5px; background: var(--divider); margin: 1rem 0 }
```

## File: src/styles/components/empty-state.css
```css
/* ── Empty State ────────────────────────────────────────── */
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 3rem 1.5rem; color: var(--text-muted) }
.empty h3 { font-size: .9375rem; font-weight: 700; color: var(--text); margin-bottom: .375rem }
.empty p  { font-size: .875rem; max-width: 30ch; margin-bottom: 1.25rem }

/* ── Skeleton ───────────────────────────────────────────── */
@keyframes shimmer {
  0%   { background-position: -200% 0 }
  100% { background-position:  200% 0 }
}

.skeleton-shimmer {
  background: linear-gradient(90deg, var(--surface-offset) 25%, var(--divider) 50%, var(--surface-offset) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

## File: src/styles/components/forms.css
```css
/* ── Form ───────────────────────────────────────────────── */
.form-group { display: flex; flex-direction: column; gap: .375rem; margin-bottom: 1rem }
.form-label { font-size: .8125rem; font-weight: 700; color: var(--text-muted) }
.form-input {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--r-md); padding: .5rem .875rem;
  font-size: .875rem; color: var(--text); outline: none;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.form-input:focus       { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl) }
.form-input::placeholder { color: var(--text-faint) }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem }

/* ── Validação ───────────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px) }
  to   { opacity: 1; transform: translateY(0) }
}

.form-error {
  display: block;
  font-size: .75rem; font-weight: 600;
  color: var(--err);
  margin-top: .3rem;
  animation: fadeIn .18s ease;
}

.form-input.input-error        { border-color: var(--err) !important; box-shadow: 0 0 0 3px rgba(200,64,106,.13) }
.form-input.input-error:focus  { outline-color: var(--err) }

/* ── Error hint (com ícone !) ────────────────────────────── */
.form-hint-err {
  display: flex; align-items: center; gap: .375rem;
  font-size: .75rem; font-weight: 700;
  color: var(--err);
  margin-top: .25rem;
}
.form-hint-err::before {
  content: '!';
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--err); color: #fff;
  font-size: .6rem; font-weight: 900; flex-shrink: 0;
}

.form-input--err,
.form-input.form-input--err { border-color: var(--err) !important; box-shadow: 0 0 0 3px var(--err-hl) !important }

/* ── FormDateField ───────────────────────────────────────── */
.fdf-wrap     { display: flex; flex-direction: column; gap: .375rem }
.fdf-label    { font-size: .8125rem; font-weight: 700; color: var(--text-muted) }
.fdf-required { color: var(--err); margin-left: .2rem }

.fdf-row {
  display: flex; align-items: center; gap: 0;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--r-md); cursor: pointer;
  overflow: hidden; position: relative; min-height: 40px;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.fdf-row:hover        { border-color: var(--text-faint) }
.fdf-row:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl) }
.fdf-row--err         { border-color: var(--err) !important; box-shadow: 0 0 0 3px var(--err-hl) !important }

.fdf-icon {
  display: flex; align-items: center; justify-content: center;
  width: 40px; color: var(--primary); background: var(--primary-hl);
  border-right: 1.5px solid var(--border);
  align-self: stretch; flex-shrink: 0;
}
.fdf-display {
  flex: 1; padding: .5rem .75rem;
  font-size: .875rem; font-weight: 500; color: var(--text);
  user-select: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.fdf-placeholder { color: var(--text-faint); font-weight: 400 }

.fdf-clear {
  width: 28px; height: 28px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-faint); flex-shrink: 0; margin-right: .25rem;
  transition: background var(--trans), color var(--trans);
}
.fdf-clear:hover { background: var(--err-hl); color: var(--err) }

.fdf-native { position: absolute; inset: 0; opacity: 0; cursor: pointer; pointer-events: none }

.fdf-msg       { font-size: .75rem; font-weight: 600; margin-top: .2rem }
.fdf-msg--err  { color: var(--err) }
.fdf-msg--hint { color: var(--text-faint) }

/* ── Campo com ícone prefixo ─────────────────────────────── */
.field-icon-wrap { position: relative }
.field-icon-wrap .field-icon {
  position: absolute; left: .75rem; top: 50%;
  transform: translateY(-50%);
  font-size: .9rem; pointer-events: none; color: var(--text-faint);
}
.field-icon-wrap .form-input { padding-left: 2.25rem }

/* ── Emoji Picker ────────────────────────────────────────── */
.emoji-picker-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: .3rem; margin-bottom: .625rem }
.emoji-pick-btn {
  width: 36px; height: 36px; border-radius: var(--r-md);
  border: 1.5px solid var(--border); background: var(--surface-offset);
  font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background var(--trans), border-color var(--trans), transform var(--trans);
}
.emoji-pick-btn:hover  { background: var(--primary-hl); border-color: var(--primary); transform: scale(1.12) }
.emoji-pick-btn.active { background: var(--primary-hl); border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-hl); transform: scale(1.1) }

/* ── Symptom category grid ───────────────────────────────── */
.symptom-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; margin-bottom: 1rem }
.symptom-cat-btn {
  display: flex; flex-direction: column; align-items: center; gap: .25rem;
  padding: .625rem .375rem;
  background: var(--surface-offset); border: 1.5px solid var(--border);
  border-radius: var(--r-lg); cursor: pointer; font-family: inherit;
  transition: all var(--trans);
}
.symptom-cat-btn:hover  { background: var(--primary-hl); border-color: var(--primary) }
.symptom-cat-btn.active { background: var(--primary-hl); border-color: var(--primary); box-shadow: 0 0 0 2.5px var(--primary-hl) }
```

## File: src/styles/components/modals.css
```css
/* ═══════════════════════════════════════════════════════════
APM — Add Pet Modal & Shared Popup System
Usar em: RegisterVaccineModal, ShareModal, CareSettingsModal
═══════════════════════════════════════════════════════════ */

/* Overlay — fundo desfocado */
.apm-overlay {
  position: fixed; inset: 0;
  background: rgba(20,16,36,.55);
  backdrop-filter: blur(6px);
  z-index: 400;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: apm-fade-in 180ms ease both;
}
@keyframes apm-fade-in { from { opacity: 0 } to { opacity: 1 } }

/* Sheet — o card branco central */
.apm-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  width: 100%; max-width: 480px;
  box-shadow: var(--sh-lg);
  display: flex; flex-direction: column;
  max-height: 92dvh;
  overflow: hidden;
  animation: apm-slide-in 220ms cubic-bezier(.16,1,.3,1) both;
}
@keyframes apm-slide-in {
  from { opacity: 0; transform: scale(.96) translateY(10px) }
  to   { opacity: 1; transform: scale(1) translateY(0) }
}

/* Header */
.apm-header {
  display: flex; align-items: center; gap: .875rem;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1.5px solid var(--divider);
  flex-shrink: 0;
}
.apm-header-icon {
  width: 44px; height: 44px; border-radius: var(--r-lg);
  background: var(--primary-hl); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.375rem; flex-shrink: 0;
}
.apm-header-title {
  font-size: 1rem; font-weight: 800; color: var(--text);
  font-family: var(--font-display);
}
.apm-header-sub {
  font-size: .8125rem; color: var(--text-muted); margin-top: .125rem;
}
.apm-close {
  margin-left: auto; width: 32px; height: 32px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); font-size: .875rem;
  transition: background var(--trans), color var(--trans);
  flex-shrink: 0;
}
.apm-close:hover { background: var(--surface-offset); color: var(--text) }

/* Body — scrollável */
.apm-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.apm-footer {
  display: flex; justify-content: flex-end; gap: .5rem;
  padding: .875rem 1.5rem;
  border-top: 1.5px solid var(--divider);
  flex-shrink: 0;
}
.apm-btn-cancel {
  padding: .45rem 1rem; border-radius: var(--r-lg);
  font-size: .875rem; font-weight: 700;
  color: var(--text-muted);
  transition: background var(--trans);
}
.apm-btn-cancel:hover { background: var(--surface-offset) }
.apm-btn-save {
  padding: .45rem 1.25rem; border-radius: var(--r-lg);
  background: var(--primary); color: #fff;
  font-size: .875rem; font-weight: 700;
  transition: background var(--trans), box-shadow var(--trans), transform var(--trans);
}
.apm-btn-save:hover  { background: var(--primary-h); box-shadow: var(--sh-md) }
.apm-btn-save:active { transform: scale(.97) }

/* Fields */
.apm-field { display: flex; flex-direction: column; gap: .3rem; margin-bottom: .875rem }
.apm-label {
  font-size: .8rem; font-weight: 800;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em;
}
.apm-input {
  width: 100%;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: .55rem .875rem;
  font-size: .875rem; color: var(--text);
  outline: none;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.apm-input:focus       { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl) }
.apm-input::placeholder { color: var(--text-faint) }
.apm-input--err        { border-color: var(--err) !important; box-shadow: 0 0 0 3px var(--err-hl) !important }
.apm-row { display: grid; grid-template-columns: 1fr 1fr; gap: .875rem }
@media(max-width:480px) { .apm-row { grid-template-columns: 1fr } }

/* Error hint */
.apm-error {
  display: flex; align-items: center; gap: .375rem;
  font-size: .75rem; color: var(--err); font-weight: 700; margin-top: .25rem;
}
.apm-error-dot {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--err); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .625rem; font-weight: 900; flex-shrink: 0;
}

/* Success banner */
.apm-success {
  display: flex; flex-direction: column; align-items: center;
  gap: .875rem; padding: 2.5rem 1rem; text-align: center;
}
.apm-success-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--success); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; font-weight: 900;
  animation: apm-pop .35s cubic-bezier(.16,1,.3,1);
}
@keyframes apm-pop { from { transform: scale(.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
.apm-success-text { font-size: 1rem; font-weight: 800; color: var(--text) }

/* ═══════════════════════════════════════════════════════════
PROFESSIONAL MODAL INTERNALS
Estilos para conteúdo interno dos modais — compatível com
o componente nativo do projeto.
═══════════════════════════════════════════════════════════ */

/* Hero banner interno do modal */
.modal-hero {
  display: flex; align-items: center; gap: .875rem;
  padding: 1rem 1.25rem 1rem;
  margin: -1.625rem -1.625rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-hl), var(--surface));
  border-bottom: 1.5px solid var(--divider);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
}
.modal-hero-icon {
  width: 48px; height: 48px; border-radius: var(--r-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; flex-shrink: 0;
  background: var(--primary); box-shadow: var(--sh-sm);
}
.modal-hero-title {
  font-family: var(--font-display);
  font-size: 1.0625rem; font-weight: 700; color: var(--text);
  line-height: 1.2;
}
.modal-hero-sub {
  font-size: .8rem; color: var(--text-muted); margin-top: .15rem;
}

/* Section label dentro do modal */
.modal-section {
  font-size: .7rem; font-weight: 800;
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--text-faint);
  margin: 1.125rem 0 .625rem;
  display: flex; align-items: center; gap: .5rem;
}
.modal-section::after {
  content: ''; flex: 1; height: 1px; background: var(--divider);
}

/* Sucesso inline no modal */
.modal-success {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 2rem 1rem; text-align: center;
}
.modal-success-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: var(--success); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  animation: modal-success-pop .4s cubic-bezier(.16,1,.3,1);
}
@keyframes modal-success-pop {
  from { transform: scale(.4); opacity: 0 }
  to   { transform: scale(1); opacity: 1 }
}
.modal-success-title { font-size: 1rem; font-weight: 800; color: var(--text) }
.modal-success-sub   { font-size: .875rem; color: var(--text-muted); max-width: 28ch }

/* ═══════════════════════════════════════════════════════════
MODAL — pm-*
Overlay + sheet com header rico, body scrollável, footer fixo
═══════════════════════════════════════════════════════════ */

.pm-overlay {
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(20, 16, 44, 0.60);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 180ms cubic-bezier(.16,1,.3,1) both;
}
@keyframes pm-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.pm-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow:
    0 2px  8px rgba(44,52,98,.08),
    0 8px 32px rgba(44,52,98,.18),
    0 32px 80px rgba(44,52,98,.22);
  width: 100%;
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}
@keyframes pm-rise {
  from { opacity: 0; transform: scale(.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ═══════════════════════════════════════════════════════════════
MODAL FORMS — mf-*
═══════════════════════════════════════════════════════════════ */

.mf-section-label {
  font-size: .6875rem;
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0 0 .625rem;
}
.mf-divider { height: 1.5px; background: var(--divider); margin: 1.125rem 0; }

.mf-field { display: flex; flex-direction: column; gap: .325rem; margin-bottom: .875rem; }
.mf-field:last-child { margin-bottom: 0; }
.mf-label    { font-size: .8125rem; font-weight: 700; color: var(--text-muted); }
.mf-optional { font-size: .7rem; font-weight: 600; color: var(--text-faint); }

.mf-input-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.mf-input-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-hl);
}
.mf-input-wrap--err {
  border-color: var(--err) !important;
  box-shadow: 0 0 0 3px var(--err-hl) !important;
}
.mf-input-wrap--textarea { align-items: flex-start; }

.mf-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  font-size: 1rem;
  color: var(--text-muted);
  background: var(--surface-offset);
  border-right: 1.5px solid var(--border);
  align-self: stretch;
  flex-shrink: 0;
}
.mf-suffix {
  display: flex;
  align-items: center;
  padding: 0 .625rem;
  font-size: .8125rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--surface-offset);
  border-left: 1.5px solid var(--border);
  align-self: stretch;
  flex-shrink: 0;
}

.mf-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: .5625rem .75rem;
  font-size: .9rem;
  color: var(--text);
  outline: none;
  font-family: inherit;
  min-width: 0;
}
.mf-input::placeholder { color: var(--text-faint); }
.mf-select { appearance: none; cursor: pointer; }

.mf-err {
  font-size: .75rem;
  font-weight: 700;
  color: var(--err);
  display: flex;
  align-items: center;
  gap: .25rem;
}
.mf-err::before { content: '⚠'; font-size: .7rem; }

.mf-row { display: grid; grid-template-columns: 1fr 1fr; gap: .875rem; }
@media (max-width: 460px) { .mf-row { grid-template-columns: 1fr; } }

/* Species grid */
.mf-species-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .5rem;
}
@media (max-width: 400px) { .mf-species-grid { grid-template-columns: repeat(3, 1fr); } }

.mf-species-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .25rem;
  padding: .625rem .375rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: background var(--trans), border-color var(--trans), transform var(--trans);
  font-family: inherit;
}
.mf-species-card:hover  { background: var(--primary-hl); border-color: var(--primary); }
.mf-species-card.active { border-color: var(--primary); box-shadow: 0 0 0 2.5px var(--primary-hl); }
.mf-species-card:active { transform: scale(.94); }
.mf-species-emoji { font-size: 1.375rem; line-height: 1; }
.mf-species-label { font-size: .65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: .04em; }

/* Preview card */
.mf-preview {
  display: flex;
  align-items: center;
  gap: .75rem;
  margin-top: 1rem;
  padding: .875rem 1rem;
  background: var(--success-hl);
  border: 1.5px solid var(--success);
  border-radius: var(--r-lg);
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}

/* Caregiver row */
.mf-caregiver-row {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  transition: background var(--trans);
}
.mf-caregiver-row:hover { background: var(--surface); }
.mf-caregiver-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 800;
  flex-shrink: 0;
  box-shadow: var(--sh-sm);
}

/* Access level cards */
.mf-access-card {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  font-family: inherit;
  transition: background var(--trans), border-color var(--trans);
  text-align: left;
  width: 100%;
}
.mf-access-card:hover  { background: var(--primary-hl); border-color: var(--primary); }
.mf-access-card.active { background: var(--primary-hl); border-color: var(--primary); box-shadow: 0 0 0 2.5px var(--primary-hl); }
.mf-access-icon { font-size: 1.25rem; flex-shrink: 0; width: 32px; text-align: center; }

/* Radio indicator */
.mf-radio {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
  transition: border-color var(--trans), background var(--trans);
  position: relative;
}
.mf-radio.checked {
  border-color: var(--primary);
  background: var(--primary);
}
.mf-radio.checked::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: #fff;
}

/* Toggle row */
.mf-toggle-row {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: .875rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
}

/* ════════════════════════════════════════════════════════════
MODAL HERO HEADER
════════════════════════════════════════════════════════════ */

/* Oculta pm-header legado — usar pm-hero-header */
.pm-header { display: none !important; }

.pm-hero-header {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: 1.25rem 1.5rem 1.125rem;
  border-bottom: 1.5px solid var(--divider);
  flex-shrink: 0;
  border-radius: var(--r-xl) var(--r-xl) 0 0;
}
.pm-hero-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.15);
}
.pm-hero-text  { flex: 1; min-width: 0; }
.pm-hero-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
  font-family: var(--font-display);
  margin: 0;
}
.pm-hero-subtitle {
  font-size: .8125rem;
  color: var(--text-muted);
  margin: .2rem 0 0;
}

/* Close button */
.pm-close {
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  background: rgba(0,0,0,.07);
  border: 1.5px solid rgba(0,0,0,.08);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--trans), color var(--trans), border-color var(--trans), transform var(--trans);
}
.pm-close:hover  { background: var(--err-hl); color: var(--err); border-color: rgba(200,64,106,.25); }
.pm-close:active { transform: scale(.92); }

/* Body */
.pm-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.375rem 1.5rem;
  scroll-behavior: smooth;
}
.pm-body::-webkit-scrollbar       { width: 4px; }
.pm-body::-webkit-scrollbar-track { background: transparent; }
.pm-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* Form utilities */
.pm-section-label {
  font-size: .6875rem;
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 1rem 0 .625rem;
}
.pm-divider {
  height: 1.5px;
  background: var(--divider);
  margin: 1rem 0;
}
.pm-toggle-row {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border-radius: var(--r-lg);
  border: 1.5px solid var(--border);
}
.pm-toggle-row .list-item-info { flex: 1; }

/* ════════════════════════════════════════════════════════════
MODAL FOOTER — definição única corrigida
════════════════════════════════════════════════════════════ */

.pm-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* fusão das duas definições anteriores */
  gap: .625rem;
  padding: .875rem 1.5rem 1.125rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
  flex-shrink: 0;
}
.pm-footer--right  { justify-content: flex-end; }
.pm-footer--spread { justify-content: space-between; }

/* Cancel/ghost sempre visualmente à esquerda do grupo */
.pm-footer > .pf-btn--cancel,
.pm-footer > .pf-btn--close,
.pm-footer > .btn-ghost { order: -1; }

/* Área esquerda para ações destrutivas */
.pm-footer-left {
  margin-right: auto;
  display: flex;
  gap: .5rem;
}

/* Botões genéricos no footer */
.pm-footer .pf-btn,
.pm-footer .btn { flex-shrink: 0; }

/* apm-footer .btn — definição completa única */
.apm-footer .btn {
  min-width: 110px;
  justify-content: center;
  font-size: .875rem;
  font-weight: 700;
  padding: .55rem 1.25rem;
  border-radius: var(--r-lg);
  transition: all 180ms cubic-bezier(.16,1,.3,1);
}

/* Cancel/ghost */
.pm-footer .btn-ghost,
.apm-footer .btn-ghost {
  min-width: 90px;
  background: var(--surface-offset);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
}
.pm-footer .btn-ghost:hover,
.apm-footer .btn-ghost:hover {
  background: var(--surface);
  color: var(--text);
  border-color: var(--text-faint);
}

/* Primary CTA — definição única: gradient + min-width + justify-content */
.pm-footer .btn-primary,
.apm-footer .btn-primary {
  min-width: 140px;
  justify-content: center;
  background: linear-gradient(150deg, var(--primary) 0%, #3d4f82 100%);
  box-shadow: 0 3px 12px rgba(91,108,158,.35), inset 0 1px 0 rgba(255,255,255,.12);
  border: none;
  color: #fff;
  letter-spacing: .01em;
}
.pm-footer .btn-primary:hover,
.apm-footer .btn-primary:hover {
  background: linear-gradient(150deg, #4a5a8f 0%, var(--primary-h) 100%);
  box-shadow: 0 6px 20px rgba(91,108,158,.45);
  transform: translateY(-1px);
}

/* Danger */
.pm-footer .btn-danger,
.apm-footer .btn-danger {
  background: var(--err-hl);
  color: var(--err);
  border: 1.5px solid rgba(200,64,106,.3);
  min-width: 90px;
}
.pm-footer .btn-danger:hover {
  background: var(--err);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(200,64,106,.35);
}

/* Success */
.pm-footer .btn-success {
  background: linear-gradient(150deg, var(--success) 0%, #3d7a4a 100%);
  color: #fff;
  border: none;
  box-shadow: 0 3px 12px rgba(85,128,96,.35);
}
.pm-footer .btn-success:hover {
  box-shadow: 0 6px 20px rgba(85,128,96,.45);
  transform: translateY(-1px);
}

/* ── Manter compatibilidade com o modal legado ── */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(20,16,36,.55);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity var(--trans);
}
.modal-backdrop.open { opacity: 1; pointer-events: all; }
.modal {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.625rem;
  width: 100%; max-width: 490px;
  box-shadow: var(--sh-lg);
  transform: scale(.96) translateY(8px);
  transition: transform var(--trans);
}
.modal-backdrop.open .modal { transform: scale(1) translateY(0); }
.modal-header  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
.modal-title   { font-size: 1rem; font-weight: 800; color: var(--text); }
.modal-footer  { display: flex; justify-content: flex-end; gap: .5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1.5px solid var(--divider); }

/* ── Caregiver Avatars ──────────────────────────────────── */
.caregiver-avatars { display: flex }
.caregiver-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--primary-hl); color: var(--primary);
  font-size: .5rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--surface); margin-left: -5px;
}
.caregiver-avatar:first-child { margin-left: 0 }

/* ── Share ──────────────────────────────────────────────── */
.shared-user {
  display: flex; align-items: center; gap: .75rem;
  padding: .625rem .75rem; border-radius: var(--r-lg);
  background: var(--surface-offset);
}
.shared-user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 800; flex-shrink: 0;
}
.shared-user-name { font-size: .875rem; font-weight: 700; color: var(--text) }
.shared-user-role { font-size: .75rem; color: var(--text-muted) }

/* Caregiver row aprimorado */
.caregiver-row {
  display: flex; align-items: center; gap: .75rem;
  padding: .625rem .875rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  transition: border-color var(--trans);
}
.caregiver-row:hover { border-color: var(--pal-denim) }
.caregiver-row + .caregiver-row { margin-top: .5rem; }
.caregiver-row-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 800; flex-shrink: 0;
}
.caregiver-row-name { font-size: .875rem; font-weight: 700; color: var(--text) }
.caregiver-row-role { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }

/* Opções de acesso */
.access-options { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .875rem }
.access-option {
  display: flex; align-items: center; gap: .75rem;
  padding: .625rem .875rem;
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: border-color var(--trans), background var(--trans);
}
.access-option:hover    { background: var(--surface-offset) }
.access-option.selected { border-color: var(--primary); background: var(--primary-hl); }
.access-option-icon {
  width: 32px; height: 32px; border-radius: var(--r-md);
  background: var(--surface-offset);
  display: flex; align-items: center; justify-content: center;
  font-size: .95rem; flex-shrink: 0;
}
.access-option.selected .access-option-icon { background: var(--primary); }
.access-option-label { font-size: .875rem; font-weight: 700; color: var(--text) }
.access-option-sub   { font-size: .75rem; color: var(--text-muted) }
.access-radio {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid var(--border);
  margin-left: auto; flex-shrink: 0;
  transition: border-color var(--trans), background var(--trans);
  display: flex; align-items: center; justify-content: center;
}
.access-option.selected .access-radio {
  border-color: var(--primary);
  background: var(--primary);
}
.access-option.selected .access-radio::after {
  content: ''; width: 6px; height: 6px;
  border-radius: 50%; background: #fff;
}

/* ── Severity buttons ──────────────────────────────────────── */
.severity-btn {
  display: flex; align-items: center; gap: .75rem;
  width: 100%; padding: .75rem 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  font-family: inherit;
  transition: background var(--trans), border-color var(--trans);
  text-align: left;
}
.severity-btn:hover { filter: brightness(.97); }

/* ── Note type grid ── */
.note-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .5rem;
  margin-bottom: 1rem;
}
.note-type-btn {
  display: flex; flex-direction: column; align-items: center; gap: .25rem;
  padding: .625rem .375rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition: all var(--trans);
  font-family: inherit;
}
.note-type-btn:hover  { background: var(--primary-hl); border-color: var(--primary); }
.note-type-btn.active { box-shadow: 0 0 0 2.5px var(--primary-hl); }

/* ── Share modal fixes ── */
.share-email-wide .field-icon-wrap { width: 100%; }

/* ── Detail Overlay (vaccine, med, symptom, note) ──────────── */
.detail-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(16,12,36,.6);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 160ms ease both;
}
.detail-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow:
    0 4px  16px rgba(44,52,98,.10),
    0 12px 40px rgba(44,52,98,.20),
    0 40px 80px rgba(44,52,98,.20);
  width: 100%;
  max-width: 420px;
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}
.detail-header {
  display: flex; align-items: center; gap: .875rem;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1.5px solid var(--divider);
  flex-shrink: 0;
}
.detail-icon {
  width: 48px; height: 48px; border-radius: var(--r-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.375rem; flex-shrink: 0; box-shadow: var(--sh-sm);
}
.detail-close {
  margin-left: auto;
  width: 32px; height: 32px;
  border-radius: var(--r-md);
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all var(--trans);
}
.detail-close:hover { background: var(--err-hl); color: var(--err); }

.detail-body {
  padding: 1.125rem 1.5rem;
  overflow-y: auto; flex: 1;
}
.detail-body::-webkit-scrollbar       { width: 4px; }
.detail-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

.detail-footer {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .875rem 1.5rem 1.125rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
  flex-shrink: 0;
  justify-content: flex-end;
}
.detail-footer .btn {
  flex: 1;
  justify-content: center;
  font-size: .875rem;
  font-weight: 700;
  padding: .6rem 1rem;
  border-radius: var(--r-lg);
  transition: all 180ms cubic-bezier(.16,1,.3,1);
}
.detail-footer .btn-primary {
  background: linear-gradient(150deg, var(--primary) 0%, #3d4f82 100%);
  box-shadow: 0 3px 10px rgba(91,108,158,.3);
  color: #fff; border: none;
}
.detail-footer .btn-primary:hover  { box-shadow: 0 5px 16px rgba(91,108,158,.45); transform: translateY(-1px); }
.detail-footer .btn-secondary {
  background: var(--surface);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
}
.detail-footer .btn-secondary:hover { background: var(--surface-offset); color: var(--text); }
.detail-footer .btn-success {
  background: linear-gradient(150deg, var(--success) 0%, #3d7a4a 100%);
  color: #fff; border: none;
  box-shadow: 0 3px 10px rgba(85,128,96,.3);
}
.detail-footer .btn-success:hover { box-shadow: 0 5px 16px rgba(85,128,96,.4); transform: translateY(-1px); }
.detail-footer .btn-warn {
  background: var(--warn-hl);
  color: var(--warn);
  border: 1.5px solid rgba(184,96,18,.25);
}
.detail-footer .btn-warn:hover { background: var(--warn); color: #fff; }

/* Detail Info Grid */
.detail-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .625rem;
  margin-bottom: 1rem;
}
.detail-info-chip {
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: .625rem .875rem;
}
.detail-info-label {
  font-size: .65rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--text-faint); margin-bottom: .25rem;
}
.detail-info-value {
  font-size: .875rem; font-weight: 700; color: var(--text);
}

/* Date input in detail overlay */
.detail-date-row {
  display: flex; align-items: center; gap: .5rem;
  padding: .625rem .875rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: .875rem;
}
.detail-date-row label {
  font-size: .75rem; font-weight: 700; color: var(--text-muted);
  white-space: nowrap; flex-shrink: 0;
}
.detail-date-row input[type="date"] {
  flex: 1;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: .35rem .625rem;
  font-size: .8125rem; color: var(--text);
  outline: none; font-family: inherit;
  transition: border-color var(--trans);
}
.detail-date-row input[type="date"]:focus { border-color: var(--primary); }

/* ════════════════════════════════════════════════════════════
PET DETAIL CHIP EDIT OVERLAY
════════════════════════════════════════════════════════════ */
.chip-edit-overlay {
  position: fixed;
  inset: 0;
  z-index: 600;
  background: rgba(16,12,36,.62);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 160ms ease both;
}
.chip-edit-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: 0 8px 32px rgba(44,52,98,.25), 0 32px 80px rgba(44,52,98,.2);
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  animation: pm-rise 200ms cubic-bezier(.16,1,.3,1) both;
}
.chip-edit-header {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1rem 1.25rem .875rem;
  border-bottom: 1.5px solid var(--divider);
  background: var(--primary-hl);
}
.chip-edit-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .9rem;
  flex-shrink: 0;
}
.chip-edit-title {
  font-size: .9375rem;
  font-weight: 800;
  color: var(--text);
  flex: 1;
}
.chip-edit-body   { padding: 1.125rem 1.25rem; }
.chip-edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: .5rem;
  padding: .875rem 1.25rem 1rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface-2);
}

/* ════════════════════════════════════════════════════════════
INVITATION SENT OVERLAY
════════════════════════════════════════════════════════════ */
.invite-sent-overlay {
  position: fixed;
  inset: 0;
  z-index: 700;
  background: rgba(16,12,36,.55);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 180ms ease both;
}
.invite-sent-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-lg);
  max-width: 340px;
  width: 100%;
  text-align: center;
  padding: 2rem 1.75rem 1.5rem;
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}
.invite-sent-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--success-hl);
  border: 3px solid var(--success);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.25rem;
  animation: apm-pop .4s cubic-bezier(.16,1,.3,1);
}

/* ════════════════════════════════════════════════════════════
NOTE DELETE CONFIRMATION inside note detail
════════════════════════════════════════════════════════════ */
.note-delete-confirm {
  background: var(--err-hl);
  border: 1.5px solid rgba(200,64,106,.3);
  border-radius: var(--r-lg);
  padding: .875rem 1rem;
  margin-top: .875rem;
}
```

## File: src/styles/components/progress.css
```css
/* ── Progress Bar ───────────────────────────────────────── */
.progress-wrap { background: var(--surface-offset); border-radius: var(--r-full); height: 7px; overflow: hidden }
.progress-bar  { height: 100%; border-radius: var(--r-full); background: var(--primary); transition: width .6s cubic-bezier(.16,1,.3,1) }
.progress-bar.warn    { background: var(--warn) }
.progress-bar.err     { background: var(--err) }
.progress-bar.success { background: var(--success) }
```

## File: src/styles/components/table.css
```css
/* ── Table ──────────────────────────────────────────────── */
.table-wrap { overflow-x: auto; border-radius: var(--r-lg); border: 1.5px solid var(--border) }
table { width: 100%; border-collapse: collapse; font-size: .875rem }
thead th { background: var(--surface-offset); padding: .625rem 1rem; text-align: left; font-weight: 800; font-size: .75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; border-bottom: 1.5px solid var(--border) }
tbody tr { border-bottom: 1px solid var(--divider); transition: background var(--trans); cursor: pointer }
tbody tr:last-child { border-bottom: none }
tbody tr:hover { background: var(--surface-offset) }
tbody td { padding: .75rem 1rem; color: var(--text); vertical-align: middle }
```

## File: src/styles/components/tabs.css
```css
/* ── Tabs ───────────────────────────────────────────────── */
.tabs { display: flex; gap: .25rem; border-bottom: 1.5px solid var(--divider); margin-bottom: 1.25rem; flex-wrap: wrap }
.tab {
  padding: .625rem 1rem; font-size: .875rem; font-weight: 600;
  color: var(--text-muted); cursor: pointer;
  border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
  transition: color var(--trans), border-color var(--trans);
}
.tab:hover { color: var(--text) }
.tab.active { color: var(--primary); border-bottom-color: var(--primary) }
```

## File: src/styles/components/timeline.css
```css
/* ── Timeline ───────────────────────────────────────────── */
.timeline      { display: flex; flex-direction: column; gap: 0 }
.timeline-item { display: flex; gap: .875rem; padding: .875rem 0; border-bottom: 1.5px solid var(--divider) }
.timeline-item:last-child { border-bottom: none }

.tl-icon         { width: 34px; height: 34px; border-radius: var(--r-full); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: .1rem }
.tl-icon.vaccine { background: var(--blue-hl);    color: var(--blue)    }
.tl-icon.med     { background: var(--warn-hl);    color: var(--warn)    }
.tl-icon.symptom { background: var(--err-hl);     color: var(--err)     }
.tl-icon.note    { background: var(--primary-hl); color: var(--primary) }

.tl-title { font-size: .875rem; font-weight: 700; color: var(--text) }
.tl-meta  { font-size: .75rem;  color: var(--text-muted) }
.tl-time  { font-size: .75rem;  color: var(--text-faint); margin-left: auto; white-space: nowrap }

/* ── Rows compartilhados ─────────────────────────────────── */
.vet-row,
.vacc-row,
.med-row,
.care-row {
  background: rgba(245,239,235,.7);
  border: 1px solid rgba(91,108,158,.08);
  border-radius: 1.15rem;
  margin-bottom: .7rem;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
}

.vet-row,
.vacc-row,
.med-row {
  display: flex;
  align-items: center;
  gap: .85rem;
  padding: .95rem 1rem;
}

.vet-row__icon,
.vacc-row__icon,
.med-row__icon {
  width: 42px; height: 42px;
  border-radius: 14px;
  display: grid; place-items: center;
  flex-shrink: 0;
  font-size: 1rem;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.65);
}

.vet-row__info,
.vacc-row__info,
.med-row__info {
  display: flex; flex-direction: column;
  gap: .1rem; min-width: 0; flex: 1;
}

.vet-row__label,
.vacc-row__name,
.med-row__name {
  font-size: .92rem; font-weight: 900;
  color: var(--text); letter-spacing: -.01em;
}

.vet-row__kind,
.vacc-row__pet,
.med-row__pet {
  font-size: .78rem;
  color: var(--text-muted);
}

.care-row__header {
  width: 100%;
  display: flex; align-items: center;
  gap: .85rem; padding: .95rem 1rem;
  background: transparent; border: 0; text-align: left;
}

.care-row__actions {
  display: flex; flex-wrap: wrap;
  gap: .55rem;
  padding: 0 1rem 1rem;
}
```

## File: src/styles/components/toast.css
```css
/* ── Toast ──────────────────────────────────────────────── */
.toast { position: fixed; bottom: 1.5rem; right: 1.5rem; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: .875rem 1.125rem; box-shadow: var(--sh-lg); display: flex; align-items: center; gap: .75rem; font-size: .875rem; z-index: 300; transform: translateY(8px); opacity: 0; transition: transform var(--trans), opacity var(--trans); max-width: 340px }
.toast.show { transform: translateY(0); opacity: 1 }
.toast-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
```

## File: src/styles/index.css
```css
/* src/styles/index.css */
@import "tailwindcss";


/* 1. Fundação — sempre primeiro */
@import './tokens.css';
@import './base.css';
@import './layout.css';

/* 2. Componentes reutilizáveis */
@import './components/buttons.css';
@import './components/badges.css';
@import './components/cards.css';
@import './components/tabs.css';
@import './components/forms.css';
@import './components/modals.css';
@import './components/toast.css';
@import './components/timeline.css';
@import './components/progress.css';
@import './components/table.css';
@import './components/empty-state.css';

/* 3. Páginas */
@import './pages/dashboard.css';
@import './pages/calendar.css';
@import './pages/vet.css';
@import './pages/pets.css';
@import './pages/medications.css';
@import './pages/care.css';
@import './pages/settings.css';

/* 4. Responsive — sempre por último */
@import './responsive.css';
```

## File: src/styles/layout.css
```css
/* ── App Shell ──────────────────────────────────────────── */
.app {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  grid-template-rows: var(--topbar-h) 1fr;
  min-height: 100vh;
  transition: grid-template-columns var(--trans);
}
.app.sidebar-collapsed { --sidebar-w: 64px }

/* ── Topbar ─────────────────────────────────────────────── */
.topbar {
  grid-column: 1/-1;
  display: flex; align-items: center; gap: 1rem;
  padding: 0 1.25rem;
  background: var(--topbar-bg);
  border-bottom: 1px solid var(--topbar-border);
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,.18);
}
.topbar-logo {
  display: flex; align-items: center; gap: .625rem;
  font-family: var(--font-display); font-size: 1.35rem;
  color: #fff;
  min-width: calc(var(--sidebar-w) - 2rem);
  white-space: nowrap; overflow: hidden;
}
.topbar-logo span { font-style: italic; transition: opacity var(--trans), transform var(--trans) }
.sidebar-collapsed .topbar-logo span { opacity: 0; transform: translateX(-8px); pointer-events: none; width: 0; overflow: hidden }
.topbar-search {
  flex: 1; max-width: 360px;
  display: flex; align-items: center; gap: .5rem;
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: var(--r-full);
  padding: .38rem .875rem;
  color: rgba(255,255,255,.6);
  font-size: .875rem;
  transition: background var(--trans), border-color var(--trans);
}
.topbar-search:focus-within { background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.28) }
.topbar-search input { background: none; border: none; outline: none; flex: 1; color: #fff }
.topbar-search input::placeholder { color: rgba(255,255,255,.45) }
.topbar-actions { margin-left: auto; display: flex; align-items: center; gap: .5rem }
.topbar-icon-btn {
  width: 36px; height: 36px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.65);
  transition: background var(--trans), color var(--trans);
}
.topbar-icon-btn:hover { background: rgba(255,255,255,.1); color: #fff }
.topbar-avatar {
  width: 34px; height: 34px; border-radius: var(--r-full);
  background: var(--pal-lilac); color: var(--nav-bg);
  font-size: .75rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid rgba(255,255,255,.3);
}
.notif-dot { position: relative }
.notif-dot::after {
  content: ''; position: absolute; top: 6px; right: 6px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--pal-mauve); border: 2px solid var(--topbar-bg);
}

/* ── Sidebar ────────────────────────────────────────────── */
.sidebar {
  position: sticky;
  background: var(--nav-bg);
  padding: .875rem .625rem;
  display: flex; flex-direction: column; gap: .2rem;
  overflow: hidden;
  box-shadow: 4px 0 20px rgba(0,0,0,.12);
  top: 0;
  height: 100vh;
}

.sidebar-section-label {
  font-size: .625rem; font-weight: 800; letter-spacing: .12em;
  text-transform: uppercase; color: var(--nav-label);
  padding: .625rem .625rem .25rem;
  white-space: nowrap; overflow: hidden;
  transition: opacity var(--trans);
}
.sidebar-collapsed .sidebar-section-label { opacity: 0 }
.nav-item {
  display: flex; align-items: center; gap: .625rem;
  padding: .55rem .75rem; border-radius: var(--r-lg);
  font-size: .875rem; color: var(--nav-text);
  cursor: pointer; white-space: nowrap;
  transition: background var(--trans), color var(--trans);
  position: relative; font-weight: 600;
}
.nav-item:hover { background: var(--nav-hover); color: #fff }
.nav-item.active { background: var(--nav-active); color: var(--nav-text-active) }
.nav-label { transition: opacity var(--trans), width var(--trans) }
.sidebar-collapsed .nav-label { opacity: 0; width: 0; overflow: hidden }
.nav-badge {
  margin-left: auto; background: var(--pal-mauve); color: #fff;
  font-size: .6rem; font-weight: 800;
  padding: .1rem .4rem; border-radius: var(--r-full);
  transition: opacity var(--trans);
}
.sidebar-collapsed .nav-badge { opacity: 0 }
.sidebar-toggle { margin-top: auto; padding: .5rem .625rem }
.sidebar-divider { height: 1px; background: rgba(255,255,255,.08); margin: .4rem .625rem }

/* ── Main ───────────────────────────────────────────────── */
.main {
  overflow-y: auto;
  background: var(--bg);
  padding: 1.75rem 2rem;
}

/* ── Page Header ────────────────────────────────────────── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
}
.page-title { font-size: 1.375rem; font-weight: 800; color: var(--text); font-family: var(--font-display) }
.page-subtitle { font-size: .875rem; color: var(--text-muted); margin-top: .125rem }
```

## File: src/styles/pages/care.css
```css
/* ── Care System ────────────────────────────────────────── */
.care-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem }

.care-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.125rem; box-shadow: var(--sh-sm); display: flex; flex-direction: column; gap: .75rem; transition: box-shadow var(--trans), border-color var(--trans) }
.care-card:hover { box-shadow: var(--sh-md) }
.care-card.done { border-color: var(--success); background: linear-gradient(135deg, var(--surface), var(--success-hl)) }
.care-card.done .care-title { color: var(--success) }

.care-header { display: flex; align-items: center; gap: .75rem }
.care-emoji  { width: 48px; height: 48px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: var(--sh-sm) }
.care-title { font-size: .9rem; font-weight: 800; color: var(--text) }
.care-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }

.care-progress { display: flex; align-items: center; gap: .5rem; font-size: .75rem; font-weight: 700; color: var(--text-muted) }
.care-dots { display: flex; gap: .3rem }
.care-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--surface-offset); border: 1.5px solid var(--border); transition: background var(--trans), border-color var(--trans) }
.care-dot.done { background: var(--success); border-color: var(--success) }

.care-actions { display: flex; gap: .5rem; margin-top: .25rem }
.care-btn-do { flex: 1; padding: .5rem; border-radius: var(--r-lg); background: var(--primary); color: #fff; font-size: .8125rem; font-weight: 800; cursor: pointer; border: none; transition: background var(--trans), transform var(--trans), box-shadow var(--trans); display: flex; align-items: center; justify-content: center; gap: .375rem }
.care-btn-do:hover { background: var(--primary-h); box-shadow: var(--sh-sm) }
.care-btn-do:active { transform: scale(.96) }
.care-btn-do.done-btn { background: var(--success) }
.care-btn-cfg { width: 36px; height: 36px; border-radius: var(--r-lg); background: var(--surface-offset); color: var(--text-muted); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: .8rem; transition: background var(--trans) }
.care-btn-cfg:hover { background: var(--primary-hl); color: var(--primary) }

.dash-care-strip { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1rem 1.25rem; box-shadow: var(--sh-sm); width: 100% }
.care-strip-items { display: flex; gap: .625rem; flex-wrap: wrap; margin-top: .625rem }
.care-strip-item { display: flex; align-items: center; gap: .375rem; background: var(--surface-offset); border: 1.5px solid var(--border); border-radius: var(--r-full); padding: .3rem .75rem; font-size: .8rem; font-weight: 700; color: var(--text-muted); cursor: pointer; transition: background var(--trans), border-color var(--trans), color var(--trans) }
.care-strip-item:hover { background: var(--primary-hl); border-color: var(--primary); color: var(--primary) }
.care-strip-item.done { background: var(--success-hl); border-color: var(--success); color: var(--success) }
.care-strip-item.urgent { background: var(--err-hl); border-color: var(--err); color: var(--err) }


/* Cuidados — lista vertical */
.dash-care-col {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}
.care-strip-item {
  padding: .55rem .875rem;
  border-radius: var(--r-md);
  background: var(--bg);
  border: 1px solid var(--border);
  font-size: .85rem;
  cursor: pointer;
  transition: background 140ms, border-color 140ms, opacity 140ms;
  display: flex;
  align-items: center;
  gap: .5rem;
  user-select: none;
}
.care-strip-item:hover      { background: var(--surface-offset); }
.care-strip-item.urgent     { border-left: 3px solid var(--err); }
.care-strip-item.urgent .care-label { color: var(--err); }
.care-strip-item.done       { opacity: .52; }
.care-strip-item.done .care-label { text-decoration: line-through; }
.care-check { font-size: .8rem; color: var(--text-muted); min-width: 14px; }
.care-strip-item.done .care-check { color: var(--success); font-weight: 700; }
.care-emoji  { font-size: 1rem; }
.care-label  { flex: 1; color: var(--text); font-size: .84rem; }
.care-qty    {
  font-size: .72rem; font-weight: 700;
  color: var(--text-muted);
  background: var(--surface-offset);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  padding: .1rem .45rem;
  min-width: 28px;
  text-align: center;
}
.care-strip-item.urgent .care-qty { color: var(--err); border-color: var(--err); background: var(--err-hl); }
.care-strip-item.done .care-qty   { opacity: .5; }

/* ── Care dots — círculos de ocorrência ── */
.care-dots {
  display: flex;
  gap: .28rem;
  align-items: center;
  margin-left: auto;
  flex-shrink: 0;
}
.care-dot-btn {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  font-size: .65rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 120ms, border-color 120ms, color 120ms;
  padding: 0;
  line-height: 1;
}
.care-dot-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.care-dot-btn.filled {
  background: var(--success-hl);
  border-color: var(--success);
  color: var(--success);
  font-weight: 700;
}
.care-strip-item.urgent .care-dot-btn:not(.filled) {
  border-color: var(--err);
  color: var(--err);
}

/* ── Care Detail Overlay ───────────────────────────────────── */
.care-detail-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(20,16,44,.55);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 180ms ease both;
}
.care-detail-sheet {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-lg);
  width: 100%; max-width: 380px;
  overflow: hidden;
  animation: pm-rise 200ms cubic-bezier(.16,1,.3,1) both;
}
.care-detail-hero {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.25rem 1.375rem 1rem;
  border-bottom: 1.5px solid var(--divider);
}
.care-detail-emoji {
  width: 56px; height: 56px; border-radius: var(--r-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; flex-shrink: 0; box-shadow: var(--sh-sm);
}
.care-detail-body { padding: 1.125rem 1.375rem; }
.care-detail-progress-row {
  display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg); padding: .75rem 1rem;
}
.care-detail-dots {
  display: flex; gap: .375rem; flex-wrap: wrap; flex: 1;
}
.care-detail-dot-btn {
  width: 30px; height: 30px; border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  font-size: .8rem; cursor: pointer;
  transition: all 160ms;
}
.care-detail-dot-btn:hover  { border-color: var(--primary); color: var(--primary); }
.care-detail-dot-btn.filled { background: var(--success-hl); border-color: var(--success); color: var(--success); font-weight: 700; }
.care-detail-footer {
  display: flex; gap: .5rem;
  padding: .875rem 1.375rem 1.25rem;
  border-top: 1.5px solid var(--divider);
}

/* ──────────────────────────────────────────────────────────────
   Care row — expandable care item in day-detail
   ────────────────────────────────────────────────────────────── */

.care-row {
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-bottom: .5rem;
  background: var(--surface-2);
}

/* Clickable header that toggles expand */
.care-row__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: .625rem;
  padding: .6rem .75rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background var(--trans);
}
.care-row__header:hover {
  background: var(--surface-offset);
}

.care-row__emoji {
  font-size: 1.25rem;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}

.care-row__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.care-row__title {
  font-weight: 700;
  font-size: .875rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.care-row__sub {
  font-size: .75rem;
  color: var(--text-muted);
}

/* Action buttons shown when care row is expanded */
.care-row__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .375rem;
  padding: .5rem .75rem .65rem;
  border-top: 1.5px solid var(--divider);
  background: var(--surface);
}

/* ── Symptoms edit/detail ─────────────────────────────────────── */
.symptom-row-clickable {
  cursor: pointer;
  border-radius: var(--r-lg);
  transition: background var(--trans);
}
.symptom-row-clickable:hover { background: var(--surface-offset); }
```

## File: src/styles/pages/dashboard.css
```css
/* ═══════════════════════════════════════════════════════════
   PAW DASHBOARD
   ═══════════════════════════════════════════════════════════ */

.dash-greeting { text-align: center; margin-bottom: 1.75rem }
.dash-greeting .greeting-name { font-family: var(--font-display); font-size: 1.75rem; font-weight: 400; color: var(--text); line-height: 1.2 }
.dash-greeting .greeting-date { font-size: .8125rem; color: var(--text-muted); margin-top: .3rem }
.dash-section-label { font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); margin-bottom: .625rem }

.paw-wrapper { display: flex; flex-direction: column; align-items: center; gap: 1.5rem }

/* ── Pata orgânica e realista ── */
.paw-layout { position: relative; width: 320px; height: 300px; flex-shrink: 0 }

.paw-bubble { position: absolute; border-radius: 50%; border: 4px solid var(--bg); box-shadow: var(--sh-md); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 200ms cubic-bezier(.16,1,.3,1), box-shadow 200ms; background: var(--surface-offset) }
.paw-bubble-clip { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative }
.paw-bubble-clip img { width: 100%; height: 100%; object-fit: cover; display: block }
.paw-bubble:hover { transform: scale(1.08); box-shadow: var(--sh-lg) }

/* Palma — grande, circular, frente de todos */
.paw-main { width: 164px; height: 164px; bottom: 0; left: 50%; transform: translateX(-50%); border-width: 5px; font-size: 3rem; border-radius: 50%; z-index: 2 }
.paw-main:hover { transform: translateX(-50%) scale(1.05) }
.paw-main .paw-bubble-clip { border-radius: 50% }

/* Dedos — layout SIMÉTRICO como no modelo:
   toe-1 e toe-2: mesma altura no topo, centrados, quase se tocando
   toe-3 e toe-4: mesma altura nas laterais, um nível abaixo            */
.paw-toe { font-size: 1.25rem; z-index: 1 }

.paw-toe-1 { width: 84px; height: 84px; top: 10px; left: 68px  }
.paw-toe-2 { width: 84px; height: 84px; top: 10px; right: 68px }
.paw-toe-3 { width: 76px; height: 76px; top: 96px; left: 0     }
.paw-toe-4 { width: 76px; height: 76px; top: 96px; right: 0    }

.paw-dot { position: absolute; top: 5px; right: 5px; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid var(--bg); z-index: 3; pointer-events: none }
.paw-dot.warn  { background: var(--warn) }
.paw-dot.err   { background: var(--err) }
.paw-dot.ok    { background: var(--success) }

.paw-pet-name { position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); font-size: .6rem; font-weight: 800; color: var(--text); white-space: nowrap; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-full); padding: .1rem .45rem; pointer-events: none; box-shadow: var(--sh-sm) }

.paw-caption { font-size: .875rem; color: var(--text-muted); text-align: center; font-weight: 600; letter-spacing: .01em }

.paw-alerts { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: .5rem }
.paw-alert { display: flex; align-items: flex-start; gap: .625rem; padding: .7rem 1rem; border-radius: var(--r-lg); font-size: .875rem; line-height: 1.4 }
.paw-alert.warn { background: var(--warn-hl); color: var(--warn); border: 1.5px solid rgba(184,96,18,.15) }
.paw-alert.err  { background: var(--err-hl);  color: var(--err);  border: 1.5px solid rgba(200,64,106,.15) }
.paw-alert-text { color: var(--text); flex: 1 }
.paw-alert-text strong { color: var(--text); display: block }

.paw-kpis { display: flex; gap: .625rem; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 440px }
.paw-kpi { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: .75rem 1rem; box-shadow: var(--sh-sm); text-align: center; flex: 1; min-width: 90px }
.paw-kpi-value { font-size: 1.5rem; font-weight: 800; color: var(--text); line-height: 1; font-variant-numeric: tabular-nums }
.paw-kpi-label { font-size: .6875rem; color: var(--text-muted); margin-top: .2rem; text-transform: uppercase; letter-spacing: .07em; font-weight: 700 }
.paw-kpi-sub   { font-size: .6875rem; margin-top: .2rem; font-weight: 700 }

.paw-see-all { font-size: .8125rem; color: var(--primary); cursor: pointer; text-align: center; font-weight: 700 }
.paw-see-all:hover { text-decoration: underline }

.paw-empty { display: flex; flex-direction: column; align-items: center; gap: .75rem; padding: 2rem; text-align: center; color: var(--text-muted) }
.paw-empty-icon { font-size: 3rem }

/* ── Quick Action Grid ──────────────────────────────────── */
.quick-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .875rem; width: 100%; max-width: 440px }
@media(max-width:600px) { .quick-grid { grid-template-columns: repeat(2,1fr) } }

.quick-card { border-radius: var(--r-xl); padding: 1rem .875rem; display: flex; flex-direction: column; align-items: flex-start; gap: .5rem; cursor: pointer; border: none; text-align: left; transition: transform var(--trans), box-shadow var(--trans); box-shadow: var(--sh-sm); position: relative; overflow: hidden }
.quick-card:hover { transform: translateY(-3px); box-shadow: var(--sh-md) }
.quick-card:active { transform: scale(.97) }
.quick-icon { width: 42px; height: 42px; border-radius: var(--r-lg); background: rgba(255,255,255,.35); display: flex; align-items: center; justify-content: center; font-size: 1.3rem }
.quick-label { font-size: .8rem; font-weight: 800; color: rgba(40,30,24,.75); line-height: 1.2 }
.quick-sub   { font-size: .7rem; color: rgba(40,30,24,.55); font-weight: 600 }

.qc-vacunas  { background: linear-gradient(140deg, var(--pal-candy), #FFC8D8) }
.qc-meds     { background: linear-gradient(140deg, var(--pal-sky), #A8C4E0) }
.qc-sintomas { background: linear-gradient(140deg, var(--pal-mauve), #F08898) }
.qc-notas    { background: linear-gradient(140deg, var(--pal-lilac), #B888C0) }
.qc-agenda   { background: linear-gradient(140deg, #C8D8F0, var(--pal-sky)) }
.qc-mascotas { background: linear-gradient(140deg, var(--pal-denim), #7888B8) }

/* ═══════════════════════════════════════════════════════
   DASHBOARD MOCKUP — grid 3 colunas com eventos abaixo do centro
═══════════════════════════════════════════════════════ */

.dash-mockup-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.3fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "left  center right"
    "left  events right";
  gap: 1.25rem;
  align-items: start;
  width: 100%;
  padding: 1.25rem 1.5rem 2rem;
  box-sizing: border-box;
}

.dash-col-left    { grid-area: left;   display: flex; flex-direction: column; gap: 1.25rem; }
.dash-col-center  { grid-area: center; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1rem 1rem 1.25rem; }
.dash-col-eventos { grid-area: events; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1rem; }
.dash-col-right   { grid-area: right;  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1rem; }

/* KPIs na coluna direita */
.dash-kpi-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .625rem;
  margin-bottom: .5rem;
}
.dash-kpi-col .paw-kpi {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: .75rem .875rem;
  transition: border-color 150ms, box-shadow 150ms;
}
.dash-kpi-col .paw-kpi:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-hl);
}

/* Paw layout photo */
.paw-bubble-clip img { width:100%; height:100%; object-fit:cover; }
```

## File: src/styles/pages/medications.css
```css
/* ── Medication Edit ────────────────────────────────────────── */
.med-row-actions {
  display: flex; gap: .375rem; align-items: center; flex-shrink: 0;
}
.med-edit-btn {
  width: 30px; height: 30px; border-radius: var(--r-md);
  background: var(--primary-hl); color: var(--primary);
  border: 1.5px solid transparent;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; cursor: pointer;
  transition: all var(--trans);
}
.med-edit-btn:hover { background: var(--primary); color: #fff; }
.med-archive-btn {
  width: 30px; height: 30px; border-radius: var(--r-md);
  background: var(--surface-offset); color: var(--text-muted);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; cursor: pointer;
  transition: all var(--trans);
}
.med-archive-btn:hover { background: var(--warn-hl); color: var(--warn); border-color: var(--warn); }

/* ── Vaccine/Med row clickable ───────────────────────────────── */
.vaccine-row { cursor: pointer; transition: background var(--trans), box-shadow var(--trans); border-radius: var(--r-lg); }
.vaccine-row:hover { background: var(--surface-offset); }


/* ──────────────────────────────────────────────────────────────
   Vaccine row — vaccine item in day-detail
   ────────────────────────────────────────────────────────────── */

.vacc-row {
  display: flex;
  align-items: center;
  gap: .625rem;
  padding: .6rem .75rem;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
  margin-bottom: .5rem;
}

.vacc-row__icon {
  font-size: 1.2rem;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}

.vacc-row__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.vacc-row__name {
  font-weight: 700;
  font-size: .875rem;
  color: var(--text);
}

.vacc-row__pet {
  font-size: .75rem;
  color: var(--text-muted);
}

/* ── Vaccine Row ────────────────────────────────────────── */
.vaccine-row { display: flex; align-items: center; gap: .875rem; padding: .75rem 0; border-bottom: 1.5px solid var(--divider) }
.vaccine-row:last-child { border-bottom: none }
.vaccine-icon { width: 38px; height: 38px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
.vaccine-name { font-size: .875rem; font-weight: 700; color: var(--text) }
.vaccine-date { font-size: .75rem; color: var(--text-muted) }
.vaccine-next { font-size: .75rem; font-weight: 700 }
.vaccine-next.ok   { color: var(--success) }
.vaccine-next.soon { color: var(--warn) }
.vaccine-next.late { color: var(--err) }
```

## File: src/styles/pages/pets.css
```css
/* ── Pet Profile Detail ─────────────────────────────────── */
.pet-profile-hero { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.5rem; box-shadow: var(--sh-sm); display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.25rem; flex-wrap: wrap }
.pet-profile-avatar { width: 90px; height: 90px; border-radius: var(--r-full); background: linear-gradient(135deg, var(--pal-lilac), var(--pal-denim)); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; flex-shrink: 0; border: 3px solid var(--pal-sky) }

/* ── Pet List Filter ────────────────────────────────────────── */
.petlist-toolbar {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.125rem;
  box-shadow: var(--sh-sm);
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: .875rem;
}
.petlist-search-row {
  display: flex; gap: .625rem; align-items: center;
}
.petlist-search-wrap {
  flex: 1;
  display: flex; align-items: center; gap: .5rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: .45rem .875rem;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.petlist-search-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-hl);
}
.petlist-search-wrap input {
  background: none; border: none; outline: none;
  font: inherit; color: var(--text); flex: 1; font-size: .9rem;
}
.petlist-search-wrap input::placeholder { color: var(--text-faint); }
.petlist-search-icon { color: var(--text-faint); flex-shrink: 0; }
.petlist-search-clear {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--surface-offset); color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem; cursor: pointer; flex-shrink: 0;
  border: 1px solid var(--border);
  transition: background var(--trans);
}
.petlist-search-clear:hover { background: var(--err-hl); color: var(--err); }

.petlist-filter-row {
  display: flex; gap: .375rem; flex-wrap: wrap; align-items: center;
}
.petlist-filter-label {
  font-size: .7rem; font-weight: 800; color: var(--text-faint);
  text-transform: uppercase; letter-spacing: .08em;
  margin-right: .25rem; flex-shrink: 0;
}
.petlist-filter-pill {
  display: flex; align-items: center; gap: .3rem;
  padding: .3rem .7rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface-offset);
  font-size: .78rem; font-weight: 700; color: var(--text-muted);
  cursor: pointer;
  transition: all var(--trans);
}
.petlist-filter-pill:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-hl); }
.petlist-filter-pill.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.petlist-sort-row {
  display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;
}
.petlist-sort-label {
  font-size: .7rem; font-weight: 800; color: var(--text-faint);
  text-transform: uppercase; letter-spacing: .08em; flex-shrink: 0;
}
.petlist-sort-btn {
  padding: .25rem .625rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface-offset);
  font-size: .75rem; font-weight: 700; color: var(--text-muted);
  cursor: pointer; transition: all var(--trans); white-space: nowrap;
}
.petlist-sort-btn:hover { border-color: var(--primary); color: var(--primary); }
.petlist-sort-btn.active { background: var(--primary-hl); color: var(--primary); border-color: var(--primary); }

.petlist-results-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: .75rem;
}
.petlist-results-count {
  font-size: .8125rem; color: var(--text-muted); font-weight: 600;
}

/* View toggle */
.petlist-view-toggle {
  display: flex; gap: .25rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg); padding: .2rem;
}
.petlist-view-btn {
  width: 28px; height: 28px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-faint);
  transition: all var(--trans);
}
.petlist-view-btn.active { background: var(--surface); color: var(--primary); box-shadow: var(--sh-sm); }

/* ── Pet Photo Upload ───────────────────────────────────────── */
.pet-photo-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}
.pet-photo-btn {
  position: absolute; bottom: 0; right: 0;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2.5px solid var(--surface);
  cursor: pointer; font-size: .75rem;
  transition: background var(--trans), transform var(--trans);
  box-shadow: var(--sh-sm);
}
.pet-photo-btn:hover { background: var(--primary-h); transform: scale(1.1); }
.pet-photo-btn.removing { background: var(--err); }
.pet-photo-circle {
  width: 90px; height: 90px; border-radius: 50%;
  overflow: hidden; flex-shrink: 0;
  background: linear-gradient(135deg,var(--pal-lilac),var(--pal-denim));
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem;
  border: 3px solid var(--pal-sky);
}
.pet-photo-circle img { width:100%; height:100%; object-fit:cover; display:block; }

/* Pet list card photo */
.pet-avatar-photo {
  width: 56px; height: 56px; border-radius: 50%;
  overflow: hidden; flex-shrink: 0;
  background: var(--primary-hl);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}
.pet-avatar-photo img { width:100%; height:100%; object-fit:cover; }

/* ── Notes Cards ────────────────────────────────────────── */
.note-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.125rem; box-shadow: var(--sh-sm) }

/* ── Notes add card ─────────────────────────────────────────── */
.note-add-card {
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--r-xl);
  padding: 1.375rem;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: .625rem; cursor: pointer;
  min-height: 180px;
  transition: border-color var(--trans), background var(--trans), opacity var(--trans);
  opacity: .65;
  text-align: center;
}
.note-add-card:hover { border-color: var(--primary); background: var(--primary-hl); opacity: 1; }
.note-add-card-icon {
  width: 44px; height: 44px; border-radius: var(--r-lg);
  background: var(--primary-hl); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.375rem; transition: background var(--trans);
}
.note-add-card:hover .note-add-card-icon { background: var(--primary); color: #fff; }
.note-add-card-label { font-size: .875rem; font-weight: 800; color: var(--text-muted); }
.note-add-card-sub   { font-size: .75rem; color: var(--text-faint); }
/* ── Notes archived section ───────────────────────────────────── */
.notes-archived-section {
  margin-top: 2rem;
}
.notes-archived-title {
  display: flex; align-items: center; gap: .625rem;
  font-size: .75rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: .09em;
  color: var(--text-faint);
  margin-bottom: 1rem;
}
.notes-archived-title::after {
  content: ''; flex: 1; height: 1.5px; background: var(--divider);
}
.note-card-archived {
  opacity: .6;
  border-style: dashed;
  filter: grayscale(.3);
}
.note-card-archived:hover { opacity: .85; }

/* ── Pet Card ───────────────────────────────────────────── */
.pet-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 1.25rem; box-shadow: var(--sh-sm); cursor: pointer; transition: box-shadow var(--trans), border-color var(--trans), transform var(--trans); display: flex; flex-direction: column; gap: .875rem }
.pet-card:hover { box-shadow: var(--sh-md); border-color: var(--pal-denim); transform: translateY(-2px) }
.pet-card.selected { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-hl), var(--sh-md) }
.pet-avatar { width: 56px; height: 56px; border-radius: var(--r-full); object-fit: cover; background: var(--primary-hl); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0 }
.pet-card-header { display: flex; align-items: flex-start; gap: .75rem }
.pet-card-name { font-weight: 800; font-size: 1rem; color: var(--text) }
.pet-card-breed { font-size: .8125rem; color: var(--text-muted) }
.pet-card-footer { display: flex; align-items: center; gap: .5rem; padding-top: .75rem; border-top: 1.5px solid var(--divider) }
.last-activity { font-size: .75rem; color: var(--text-faint); margin-left: auto }
```

## File: src/styles/pages/settings.css
```css
/* ── Settings Page ─────────────────────────────────────────── */
.settings-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.125rem;
}

.settings-profile-hero {
  display: flex; align-items: center; gap: 1.375rem;
  padding: 1.375rem;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  margin-bottom: 1.25rem;
}
.settings-avatar-wrap { position: relative; flex-shrink: 0; }
.settings-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, var(--pal-lilac), var(--pal-denim));
  color: var(--nav-bg);
  font-size: 1.5rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 3px solid var(--pal-sky);
  box-shadow: var(--sh-sm);
}
.settings-avatar img { width:100%; height:100%; object-fit:cover; }
.settings-avatar-btn {
  position: absolute; bottom: 0; right: 0;
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--surface);
  cursor: pointer; font-size: .65rem;
  transition: background var(--trans), transform var(--trans);
}
.settings-avatar-btn:hover { background: var(--primary-h); transform: scale(1.1); }
.settings-profile-info { flex: 1; }
.settings-profile-name { font-size: 1.125rem; font-weight: 800; color: var(--text); }
.settings-profile-email { font-size: .8125rem; color: var(--text-muted); margin-top: .2rem; }
.settings-profile-joined { font-size: .75rem; color: var(--text-faint); margin-top: .375rem; }

/* Settings card */
.settings-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.375rem;
  box-shadow: var(--sh-sm);
}
.settings-card-title {
  font-size: .875rem; font-weight: 800; color: var(--text);
  margin-bottom: 1rem;
  display: flex; align-items: center; gap: .5rem;
  padding-bottom: .75rem;
  border-bottom: 1.5px solid var(--divider);
}
.settings-card-title span { font-size: 1.1rem; }

/* ── Settings Datos Personales ────────────────────────────────── */
.settings-field-group {
  display: flex; flex-direction: column; gap: .625rem;
  padding: 1rem;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: .875rem;
}
.settings-field-row {
  display: flex; align-items: center; gap: .75rem;
}
.settings-field-icon {
  width: 32px; height: 32px;
  border-radius: var(--r-md);
  background: var(--primary-hl);
  color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; flex-shrink: 0;
}
.settings-input-modern {
  flex: 1;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: .55rem .875rem;
  font-size: .9rem; color: var(--text);
  outline: none; font-family: inherit;
  transition: border-color var(--trans), box-shadow var(--trans);
}
.settings-input-modern:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-hl);
}
.settings-input-modern::placeholder { color: var(--text-faint); }


/* ── Settings Datos Personales v2 ───────────────────────── */
.settings-form-section {
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-bottom: 1rem;
}
.settings-form-section-header {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1rem;
  background: var(--surface-offset);
  border-bottom: 1.5px solid var(--border);
  font-size: .75rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .07em;
}
.settings-form-field {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: .75rem 1rem;
  border-bottom: 1px solid var(--divider);
  transition: background var(--trans);
}
.settings-form-field:last-child { border-bottom: none; }
.settings-form-field:focus-within { background: var(--primary-hl); }
.settings-form-field-icon {
  width: 32px; height: 32px;
  border-radius: var(--r-md);
  background: var(--primary-hl);
  color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; flex-shrink: 0;
  transition: background var(--trans);
}
.settings-form-field:focus-within .settings-form-field-icon {
  background: var(--primary);
  color: #fff;
}
.settings-form-field-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: .1rem;
}
.settings-form-field-label {
  font-size: .7rem;
  font-weight: 800;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: .07em;
}
.settings-form-field-input {
  background: none;
  border: none;
  outline: none;
  font: inherit;
  font-size: .9rem;
  color: var(--text);
  padding: 0;
  width: 100%;
}
.settings-form-field-input::placeholder { color: var(--text-faint); }

/* Toggle row */
.toggle-row {
  display: flex; align-items: center; gap: .75rem;
  padding: .75rem .875rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: .875rem;
}
.toggle-row-info { flex: 1 }
.toggle-row-label { font-size: .875rem; font-weight: 700; color: var(--text) }
.toggle-row-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }
.toggle-pill {
  width: 44px; height: 24px; border-radius: 99px;
  border: none; cursor: pointer; position: relative;
  flex-shrink: 0; transition: background .2s;
}
.toggle-pill-thumb {
  position: absolute; top: 2px;
  width: 20px; height: 20px; border-radius: 50%;
  background: #fff; transition: left .2s;
}

/* Notification row */
.notif-row {
  display: flex; align-items: center; gap: .875rem;
  padding: .75rem 0;
  border-bottom: 1px solid var(--divider);
}
.notif-row:last-child { border-bottom: none; padding-bottom: 0; }
.notif-row-info { flex: 1; }
.notif-row-label { font-size: .875rem; font-weight: 700; color: var(--text); }
.notif-row-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem; }

/* ════════════════════════════════════════════════════════════
   DELETE ACCOUNT MODAL (danger style)
   ════════════════════════════════════════════════════════════ */

.delete-account-overlay {
  position: fixed;
  inset: 0;
  z-index: 700;
  background: rgba(16,12,36,.72);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: pm-fade-in 180ms ease both;
}

.delete-account-sheet {
  background: var(--surface);
  border: 2px solid rgba(200,64,106,.35);
  border-radius: var(--r-xl);
  box-shadow: 0 8px 40px rgba(200,64,106,.25), var(--sh-lg);
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  animation: pm-rise 220ms cubic-bezier(.16,1,.3,1) both;
}

.delete-account-header {
  padding: 1.5rem 1.5rem 1.25rem;
  text-align: center;
  background: linear-gradient(135deg, var(--err-hl) 0%, var(--surface) 100%);
  border-bottom: 1.5px solid rgba(200,64,106,.2);
}

.delete-account-warning-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--err);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin: 0 auto .875rem;
  animation: apm-pop .35s cubic-bezier(.16,1,.3,1);
}
```

## File: src/styles/pages/vet.css
```css
/* =========================
   Veterinaria
   ========================= */

.pet-selector {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-bottom: 1rem;
}

.pet-chip {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  padding: .45rem .9rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-weight: 700;
  transition: all var(--trans);
}

.pet-chip.active {
  background: var(--primary-hl);
  color: var(--primary);
  border-color: var(--primary);
}

.tabs {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tab {
  padding: .55rem .95rem;
  border-radius: var(--r-lg);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-weight: 700;
  transition: all var(--trans);
}

.tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tab-add-btn {
  align-self: flex-start;
}

.card-list {
  display: grid;
  gap: 1rem;
}

.vet-card,
.appt-card {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 1rem;
  align-items: start;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1rem;
  box-shadow: var(--sh-sm);
}

.vet-card-icon,
.appt-card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-offset);
  font-size: 1.5rem;
}

.vet-card-body,
.appt-card-body {
  min-width: 0;
}

.vet-card-name,
.appt-card-reason {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text);
}

.vet-card-clinic,
.appt-card-date,
.appt-card-vet {
  margin-top: .2rem;
  color: var(--text-muted);
  font-size: .85rem;
}

.vet-card-detail,
.appt-card-detail {
  margin-top: .45rem;
  color: var(--text);
  font-size: .85rem;
  line-height: 1.5;
}

.vet-card-phones,
.appt-card-meta {
  margin-top: .5rem;
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  color: var(--text-faint);
  font-size: .8rem;
}

.vet-card-actions,
.appt-card-actions {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  align-items: flex-end;
}

.confirm-delete {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.profile-view {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1rem;
  box-shadow: var(--sh-sm);
}

.profile-edit-btn {
  margin-bottom: 1rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .75rem;
}

.profile-row {
  display: flex;
  flex-direction: column;
  gap: .2rem;
  padding: .8rem .9rem;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
}

.profile-row-label {
  font-size: .75rem;
  color: var(--text-faint);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.profile-row-value {
  font-size: .9rem;
  color: var(--text);
  line-height: 1.45;
}

.profile-section-title {
  margin-top: 1rem;
  margin-bottom: .6rem;
  font-weight: 800;
  color: var(--text);
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.profile-tag {
  padding: .35rem .7rem;
  border-radius: var(--r-full);
  background: var(--err-hl);
  color: var(--err);
  font-size: .8rem;
  font-weight: 700;
}

.profile-empty-row,
.profile-updated {
  color: var(--text-muted);
  font-size: .85rem;
}

.profile-surgery-row {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  padding: .75rem .9rem;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
  margin-bottom: .5rem;
}

.profile-surgery-name {
  font-weight: 800;
  color: var(--text);
}

.profile-surgery-date,
.profile-surgery-notes {
  color: var(--text-muted);
  font-size: .85rem;
}

.profile-notes-section {
  margin-top: 1rem;
  display: grid;
  gap: .75rem;
}

.upcoming-section {
  display: grid;
  gap: .75rem;
}

.section-label {
  font-weight: 800;
  color: var(--text);
}

.return-banner {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: .75rem;
  align-items: center;
  padding: .9rem 1rem;
  border-radius: var(--r-xl);
  border: 1.5px solid var(--blue);
  background: var(--blue-hl);
}

.return-banner.urgent {
  border-color: var(--warn);
  background: var(--warn-hl);
}

.return-banner-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,.55);
  font-size: 1.1rem;
}

.return-banner-note {
  font-weight: 800;
  color: var(--text);
}

.return-banner-vet,
.return-banner-date {
  color: var(--text-muted);
  font-size: .82rem;
}

.return-banner-label {
  font-weight: 800;
  color: var(--text);
  text-align: right;
}

.coming-soon-card {
  display: grid;
  place-items: center;
  text-align: center;
  gap: .5rem;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--r-xl);
  padding: 2rem 1rem;
}

.coming-soon-icon {
  font-size: 2rem;
}

.coming-soon-label {
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--primary);
}

.coming-soon-text {
  color: var(--text-muted);
  max-width: 42ch;
}


/* ──────────────────────────────────────────────────────────────
   Vet / Appointment page layout classes
   (pet selector, tabs with pill style, profile, cards)
   ────────────────────────────────────────────────────────────── */

.pet-selector {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.pet-chip {
  padding: .375rem .875rem;
  border-radius: var(--r-full);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: .8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--trans);
}
.pet-chip:hover { border-color: var(--primary); color: var(--primary) }
.pet-chip.active {
  background: var(--primary-hl);
  color: var(--primary);
  border-color: var(--primary);
}

/* Pill-style tab bar (VetPage uses border-radius tabs, not underline) */
.tabs {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.tab {
  padding: .55rem .95rem;
  border-radius: var(--r-lg);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: .8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--trans);
}
.tab:hover { border-color: var(--primary); color: var(--primary) }
.tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tab-add-btn {
  align-self: flex-start;
}

/* Card list grid */
.card-list {
  display: grid;
  gap: 1rem;
}

/* Vet / appointment cards */
/* ── Vet & Appt cards — visual mais próximo de "Mis Mascotas" ── */
.vet-card,
.appt-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1rem 1.1rem;
  box-shadow: var(--sh-sm);
  transition: box-shadow var(--trans), border-color var(--trans), transform var(--trans);
  display: flex;
  flex-direction: column;
  gap: .85rem;
}

.vet-card:hover,
.appt-card:hover {
  box-shadow: var(--sh-md);
  border-color: color-mix(in oklab, var(--primary) 22%, var(--border));
  transform: translateY(-1px);
}

.vet-card-main,
.appt-card-main {
  display: flex;
  align-items: flex-start;
  gap: .8rem;
  min-width: 0;
}

.vet-card-icon,
.appt-card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--r-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
  box-shadow: var(--sh-sm);
  border: 1.5px solid color-mix(in oklab, var(--text) 8%, transparent);
  background: var(--surface-offset);
}

.vet-card-icon[data-type="primary"]    { background: var(--primary-hl); }
.vet-card-icon[data-type="specialist"] { background: var(--blue-hl); }
.vet-card-icon[data-type="emergency"]  { background: var(--err-hl); }
.vet-card-icon[data-type="other"]      { background: var(--surface-offset); }

.appt-card-icon[data-type="routine"]    { background: var(--primary-hl); }
.appt-card-icon[data-type="emergency"]  { background: var(--err-hl); }
.appt-card-icon[data-type="specialist"] { background: var(--blue-hl); }
.appt-card-icon[data-type="followup"]   { background: var(--warn-hl); }
.appt-card-icon[data-type="exam"]       { background: color-mix(in oklab, var(--purple) 10%, var(--surface)); }
.appt-card-icon[data-type="vaccine"]    { background: var(--success-hl); }
.appt-card-icon[data-type="other"]      { background: var(--surface-offset); }

.vet-card-body,
.appt-card-body {
  min-width: 0;
  flex: 1;
}

.vet-card-name,
.appt-card-reason {
  font-weight: 800;
  font-size: .98rem;
  color: var(--text);
  line-height: 1.25;
}

.vet-card-clinic,
.appt-card-date,
.appt-card-vet {
  margin-top: .18rem;
  color: var(--text-muted);
  font-size: .8125rem;
}

.vet-card-detail,
.appt-card-detail {
  margin-top: .4rem;
  color: var(--text);
  font-size: .83rem;
  line-height: 1.45;
}

.vet-card-phones,
.appt-card-meta {
  margin-top: .55rem;
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
}

/* chips estilo detalhe de mascota */
.vet-card-phones span,
.appt-card-meta span {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .38rem .62rem;
  border-radius: var(--r-full);
  background: var(--surface-2);
  border: 1.5px solid var(--divider);
  color: var(--text-muted);
  font-size: .76rem;
  font-weight: 700;
  line-height: 1;
}

.vet-card-footer,
.appt-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding-top: .75rem;
  border-top: 1.5px solid var(--divider);
}

.vet-card-footer-info,
.appt-card-footer-info {
  min-width: 0;
  color: var(--text-faint);
  font-size: .75rem;
}

.vet-card-actions,
.appt-card-actions {
  display: flex;
  gap: .45rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.confirm-delete {
  display: flex;
  gap: .45rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Banner de retorno iminente (usado em NextApptBanner no VetPage) */
@keyframes appt-banner-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(146, 161, 195, 0.25); }
  50%       { box-shadow: 0 0 0 5px rgba(146, 161, 195, 0);  }
}

/* chips estilo detalhe de mascota */
.vet-card-phones span,
.appt-card-meta span {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .38rem .62rem;
  border-radius: var(--r-full);
  background: var(--surface-2);
  border: 1.5px solid var(--divider);
  color: var(--text-muted);
  font-size: .76rem;
  font-weight: 700;
  line-height: 1;
}

.vet-card-footer,
.appt-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding-top: .75rem;
  border-top: 1.5px solid var(--divider);
}

.vet-card-footer-info,
.appt-card-footer-info {
  min-width: 0;
  color: var(--text-faint);
  font-size: .75rem;
}

.vet-card-actions,
.appt-card-actions {
  display: flex;
  gap: .45rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.confirm-delete {
  display: flex;
  gap: .45rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}



/* Medical profile view */
.profile-view {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1rem;
  box-shadow: var(--sh-sm);
}
.profile-edit-btn { margin-bottom: 1rem }

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .75rem;
}

.profile-row {
  display: flex;
  flex-direction: column;
  gap: .2rem;
  padding: .8rem .9rem;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
}
.profile-row-label {
  font-size: .75rem;
  color: var(--text-faint);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.profile-row-value { font-size: .9rem; color: var(--text); line-height: 1.45 }

.profile-section-title {
  margin-top: 1rem;
  margin-bottom: .6rem;
  font-weight: 800;
  color: var(--text);
}

.profile-tags { display: flex; flex-wrap: wrap; gap: .5rem }
.profile-tag {
  padding: .35rem .7rem;
  border-radius: var(--r-full);
  background: var(--err-hl);
  color: var(--err);
  font-size: .8rem;
  font-weight: 700;
}

.profile-empty-row,
.profile-updated { color: var(--text-muted); font-size: .85rem }

.profile-surgery-row {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  padding: .75rem .9rem;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
  margin-bottom: .5rem;
}
.profile-surgery-name { font-weight: 800; color: var(--text) }
.profile-surgery-date,
.profile-surgery-notes { color: var(--text-muted); font-size: .85rem }

.profile-notes-section { margin-top: 1rem; display: grid; gap: .75rem }

/* Upcoming return section */
.upcoming-section { display: grid; gap: .75rem }
.section-label { font-weight: 800; color: var(--text) }

/* Return banner */
.return-banner {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: .75rem;
  align-items: center;
  padding: .9rem 1rem;
  border-radius: var(--r-xl);
  border: 1.5px solid var(--blue);
  background: var(--blue-hl);
}
.return-banner.urgent { border-color: var(--warn); background: var(--warn-hl) }

.return-banner-icon {
  width: 40px; height: 40px;
  border-radius: var(--r-lg);
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.55);
  font-size: 1.1rem;
}
.return-banner-note { font-weight: 800; color: var(--text) }
.return-banner-vet,
.return-banner-date { color: var(--text-muted); font-size: .82rem }
.return-banner-label { font-weight: 800; color: var(--text); text-align: right }

/* Coming-soon placeholder card */
.coming-soon-card {
  display: grid;
  place-items: center;
  text-align: center;
  gap: .5rem;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--r-xl);
  padding: 2rem 1rem;
}
.coming-soon-icon { font-size: 2rem }
.coming-soon-label {
  font-size: .72rem; font-weight: 800;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--primary);
}
.coming-soon-text { color: var(--text-muted); max-width: 42ch }
```

## File: src/styles/tokens.css
```css
/* ═══════════════════════════════════════════════════════════
   PITUTI Design
   Paleta: Lilac Fizz / Cotton Candy / Mauvelous / Polar Sky / Denim
═══════════════════════════════════════════════════════════ */

:root, [data-theme="light"] {
  --pal-lilac: #CCA1C9;
  --pal-candy: #FFD3DD;
  --pal-mauve: #F3A0AD;
  --pal-sky:   #BED1E3;
  --pal-denim: #92A1C3;
  --purple:    #7C5CC4;
  --purple-hl: #EFE9FB;

  --bg:              #FBF7F5;
  --surface:         #FFFFFF;
  --surface-2:       #FEF9F7;
  --surface-offset:  #F5EFEB;
  --divider:         #EDE4DF;
  --border:          #E2D8D2;

  --text:       #28211D;
  --text-muted: #8A7E77;
  --text-faint: #C5BAB4;
  --text-inv:   #FFFFFF;

  --primary:    #5B6C9E;
  --primary-h:  #3E4F7F;
  --primary-hl: #EAEDF8;   /* ← corrigido: f → F */

  --warn:       #B86012;
  --warn-hl:    #FEF1E6;
  --err:        #C8406A;
  --err-hl:     #FDEAEF;
  --success:    #558060;
  --success-hl: #E2F0E6;
  --gold:       #9A7800;
  --gold-hl:    #FFF4D4;
  --blue:       #466CB0;
  --blue-hl:    #E4EDF8;

  --nav-bg:          #2A3462;
  --nav-text:        rgba(230,225,255,.72);
  --nav-text-active: #FFFFFF;
  --nav-active:      rgba(255,255,255,.13);
  --nav-hover:       rgba(255,255,255,.07);
  --nav-label:       rgba(200,195,240,.40);
  --topbar-bg:       #2A3462;
  --topbar-border:   rgba(255,255,255,.10);

  --r-sm:   .4rem;
  --r-md:   .625rem;
  --r-lg:   1rem;
  --r-xl:   1.375rem;
  --r-full: 9999px;

  --sh-sm: 0 2px  8px rgba(44,52,98,.07);
  --sh-md: 0 6px 20px rgba(44,52,98,.11);
  --sh-lg: 0 16px 40px rgba(44,52,98,.16);

  --trans:        200ms cubic-bezier(.16,1,.3,1);
  --font-body:    'Nunito', system-ui, sans-serif;
  --font-display: 'Fraunces', Georgia, serif;
  --sidebar-w:    224px;
  --topbar-h:     60px;
}

[data-theme="dark"] {
  --bg:            #13111F;
  --surface:       #1C1929;
  --surface-2:     #231F33;
  --surface-offset:#2A2640;
  --divider:       #312D48;
  --border:        #3E3A58;

  --text:       #F0ECFF;
  --text-muted: #9D96C4;
  --text-faint: #6860A0;
  --text-inv:   #13111F;

  --primary:    #9AAAE0;
  --primary-h:  #B4C0EC;
  --primary-hl: #1E2448;

  --warn:       #F0A050;
  --warn-hl:    #2E1A06;
  --err:        #F07898;
  --err-hl:     #30101E;
  --success:    #88C890;
  --success-hl: #0C2210;
  --gold:       #EDD050;
  --gold-hl:    #281A00;
  --blue:       #8AB4E8;
  --blue-hl:    #0C1E30;
  --purple:     #B59AF2;
  --purple-hl:  #2A2140;

  --sh-sm: 0 2px  8px rgba(0,0,0,.38);
  --sh-md: 0 6px 20px rgba(0,0,0,.52);
  --sh-lg: 0 16px 40px rgba(0,0,0,.68);
}
```

## File: src/utils/.gitkeep
```

```

## File: src/api/pets.ts
```typescript
import { api } from './client';
import type { ApiPet, CreatePetDto, UpdatePetDto } from './types';

export const petsApi = {
  getAll:  (ownerId?: string) => api.get<ApiPet[]>(`/pets${ownerId ? `?ownerId=${ownerId}` : ''}`),
  getById: (petId: string)    => api.get<ApiPet>(`/pets/${petId}`),
  create:  (dto: CreatePetDto)             => api.post<ApiPet>('/pets', dto),
  update:  (petId: string, dto: UpdatePetDto) => api.patch<ApiPet>(`/pets/${petId}`, dto),
  delete:  (petId: string)                 => api.delete<void>(`/pets/${petId}`),
};
```

## File: src/components/AddEditAppointmentModal.tsx
```typescript
// traduzido sem mock

import { useState, useEffect } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { usePetsContext } from '../context/PetsContext'
import { useVet, type VetAppointment } from '../context/VetContext'
import { useTranslation } from 'react-i18next'

// ─── APPOINTMENT TYPES ────────────────────────────────────────────────────────

export const APPOINTMENT_TYPES = [
  { value: 'routine',    key: 'routine',    emoji: '🩺', color: 'var(--primary)'    },
  { value: 'emergency',  key: 'emergency',  emoji: '🚨', color: 'var(--err)'        },
  { value: 'specialist', key: 'specialist', emoji: '🔬', color: 'var(--blue)'       },
  { value: 'followup',   key: 'followup',   emoji: '🔄', color: 'var(--warn)'       },
  { value: 'exam',       key: 'exam',       emoji: '🧪', color: 'var(--purple)'     },
  { value: 'vaccine',    key: 'vaccine',    emoji: '💉', color: 'var(--success)'    },
  { value: 'other',      key: 'other',      emoji: '📋', color: 'var(--text-muted)' },
] as const

type ApptType = typeof APPOINTMENT_TYPES[number]['value']

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🐦', rabbit:'🐰', reptile:'🦎', fish:'🐠', other:'🐾',
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen:       boolean
  onClose:      () => void
  onSave:       (a: Omit<VetAppointment, 'id'>) => void
  onUpdate:     (a: VetAppointment) => void
  initial:      VetAppointment | null
  defaultPetId: string
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AddEditAppointmentModal({
  isOpen, onClose, onSave, onUpdate, initial, defaultPetId,
}: Props) {
  const isEdit = !!initial
  const { vets } = useVet()
  const { t } = useTranslation()
  const { pets } = usePetsContext()

  const [petId,        setPetId]        = useState(defaultPetId)
  const [type,         setType]         = useState<ApptType>('routine')
  const [date,         setDate]         = useState('')
  const [vetContactId, setVetContactId] = useState('')
  const [vetName,      setVetName]      = useState('')
  const [clinic,       setClinic]       = useState('')
  const [reason,       setReason]       = useState('')
  const [diagnosis,    setDiagnosis]    = useState('')
  const [treatment,    setTreatment]    = useState('')
  const [nextDate,     setNextDate]     = useState('')
  const [nextNote,     setNextNote]     = useState('')
  const [weightKg,     setWeightKg]     = useState('')
  const [notes,        setNotes]        = useState('')
  const [reasonErr,    setReasonErr]    = useState('')
  const [vetNameErr,   setVetNameErr]   = useState('')
  const [dateErr,      setDateErr]      = useState('')

  useEffect(() => {
    if (initial) {
      setPetId(initial.petId)
      setType((initial.type as ApptType) ?? 'routine')
      setDate(initial.date)
      setVetContactId(initial.vetContactId ?? '')
      setVetName(initial.vetName)
      setClinic(initial.clinic ?? '')
      setReason(initial.reason)
      setDiagnosis(initial.diagnosis ?? '')
      setTreatment(initial.treatment ?? '')
      setNextDate(initial.nextAppointmentDate ?? '')
      setNextNote(initial.nextAppointmentNote ?? '')
      setWeightKg(initial.weightKg != null ? String(initial.weightKg) : '')
      setNotes(initial.notes ?? '')
    } else {
      setPetId(defaultPetId)
      setType('routine')
      setDate(new Date().toISOString().split('T')[0])
      setVetContactId(''); setVetName(''); setClinic('')
      setReason(''); setDiagnosis(''); setTreatment('')
      setNextDate(''); setNextNote(''); setWeightKg(''); setNotes('')
    }
    setReasonErr(''); setVetNameErr(''); setDateErr('')
  }, [initial, isOpen, defaultPetId])

  useEffect(() => {
    if (!vetContactId) return
    const vet = vets.find(v => v.id === vetContactId)
    if (vet) { setVetName(vet.name); setClinic(vet.clinic) }
  }, [vetContactId, vets])

  const validate = () => {
    let ok = true
    if (!reason.trim())  { setReasonErr(t('vet.appointments.errReason'));  ok = false }
    if (!vetName.trim()) { setVetNameErr(t('vet.appointments.errVetName')); ok = false }
    if (!date)           { setDateErr(t('vet.appointments.errDate'));       ok = false }
    return ok
  }

  const handleSave = () => {
    if (!validate()) return
    const now = new Date().toISOString()
    const data: Omit<VetAppointment, 'id'> = {
      petId, type, date,
      createdAt:           initial?.createdAt ?? now,
      vetContactId:        vetContactId  || undefined,
      vetName:             vetName.trim(),
      clinic:              clinic.trim() || undefined,
      reason:              reason.trim(),
      diagnosis:           diagnosis.trim()  || undefined,
      treatment:           treatment.trim()  || undefined,
      nextAppointmentDate: nextDate          || undefined,
      nextAppointmentNote: nextNote.trim()   || undefined,
      weightKg:            weightKg ? parseFloat(weightKg) : undefined,
      notes:               notes.trim()      || undefined,
    }
    if (isEdit && initial) onUpdate({ ...data, id: initial.id })
    else onSave(data)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t('vet.appointments.titleEdit') : t('vet.appointments.titleAdd')}
      icon="📋"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>{t('btn.cancel')}</PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            {isEdit ? t('vet.appointments.update') : t('vet.appointments.register')}
          </PfBtn>
        </PfFooter>
      }
    >
      {/* ── Mascota ── */}
      <div className="modal-section">{t('field.vet')}</div>
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1rem' }}>
        {pets.map(p => (
          <button key={p.id} type="button"
            className={`btn btn-sm ${petId === p.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPetId(p.id)}>
            {PET_EMOJI[p.species ?? ''] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      {/* ── Tipo ── */}
      <div className="modal-section">{t('vet.appointments.addBtn')}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'.5rem', marginBottom:'1rem' }}>
        {APPOINTMENT_TYPES.map(appt => (
          <button key={appt.value} type="button" onClick={() => setType(appt.value)}
            style={{
              padding:'.5rem .75rem', borderRadius:'var(--r-md)', cursor:'pointer',
              fontFamily:'inherit', fontWeight:700, fontSize:'.8rem',
              border:`1.5px solid ${type === appt.value ? appt.color : 'var(--border)'}`,
              background: type === appt.value
                ? `color-mix(in oklab, ${appt.color} 10%, var(--surface))`
                : 'var(--surface)',
              display:'flex', alignItems:'center', gap:'.5rem',
              color: type === appt.value ? appt.color : 'var(--text)',
            }}>
            <span>{appt.emoji}</span>
            <span>{t(`vet.apptTypes.${appt.key}`)}</span>
          </button>
        ))}
      </div>

      {/* ── Fecha ── */}
      <div className="modal-section">{t('field.date')}</div>
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.sectionDateTime')} *</label>
        <input type="date" className={`form-input${dateErr ? ' input-err' : ''}`}
          value={date} onChange={e => { setDate(e.target.value); setDateErr('') }}/>
        {dateErr && <div className="form-error">{dateErr}</div>}
      </div>

      {/* ── Veterinario ── */}
      <div className="modal-section">{t('field.vet')}</div>
      {vets.length > 0 && (
        <div className="form-group">
          <label className="form-label">{t('vet.appointments.vetContactLabel')}</label>
          <select className="form-input" value={vetContactId}
            onChange={e => setVetContactId(e.target.value)}>
            <option value="">— {t('vet.appointments.vetContactNone')} —</option>
            {vets.map(v => (
              <option key={v.id} value={v.id}>{v.name} · {v.clinic}</option>
            ))}
          </select>
        </div>
      )}
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.sectionVet')} *</label>
        <input className={`form-input${vetNameErr ? ' input-err' : ''}`}
          value={vetName} onChange={e => { setVetName(e.target.value); setVetNameErr('') }}
          placeholder={t('vet.appointments.vetNamePh')}/>
        {vetNameErr && <div className="form-error">{vetNameErr}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('field.clinic')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <input className="form-input" value={clinic}
          onChange={e => setClinic(e.target.value)}
          placeholder={t('vet.appointments.clinicPh')}/>
      </div>

      {/* ── Detalles ── */}
      <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.reason')} *</label>
        <input className={`form-input${reasonErr ? ' input-err' : ''}`}
          value={reason} onChange={e => { setReason(e.target.value); setReasonErr('') }}
          placeholder={t('vet.appointments.reasonPh')}/>
        {reasonErr && <div className="form-error">{reasonErr}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('vet.appointments.diagnosis')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <textarea className="form-input" rows={2} value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          placeholder={t('vet.appointments.diagnosisPh')}/>
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('vet.appointments.treatment')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <textarea className="form-input" rows={2} value={treatment}
          onChange={e => setTreatment(e.target.value)}
          placeholder={t('vet.appointments.treatmentPh')}/>
      </div>

      {/* ── Seguimiento ── */}
      <div className="modal-section">{t('vet.appointments.sectionFollowUp')}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem', marginBottom:'1rem' }}>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">{t('vet.appointments.nextDate')}</label>
          <input type="date" className="form-input"
            value={nextDate} onChange={e => setNextDate(e.target.value)}/>
        </div>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">{t('vet.appointments.nextNote')}</label>
          <input className="form-input" value={nextNote}
            onChange={e => setNextNote(e.target.value)}
            placeholder={t('vet.appointments.nextNotePh')}/>
        </div>
      </div>

      {/* ── Datos adicionales ── */}
      <div className="modal-section">{t('vet.appointments.sectionExtra')}</div>
      <div className="form-group">
        <label className="form-label">{t('vet.appointments.weight')}</label>
        <input type="number" className="form-input" step=".1" min="0"
          value={weightKg} onChange={e => setWeightKg(e.target.value)}
          placeholder={t('vet.appointments.weightPh')}/>
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('field.notes')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <textarea className="form-input" rows={2} value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t('vet.appointments.notesPh')}/>
      </div>
    </Modal>
  )
}
```

## File: src/components/AddMedicationModal.tsx
```typescript
// traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

// ── Types ───────────────────────────────────────────────

export interface AddMedData {
  petId:     string
  petSpecies: string
  name:      string
  dose:      string
  frequency: string
  startDate: string
  endDate:   string
  notes:     string
}

interface Props {
  isOpen:        boolean
  onClose:       () => void
  onAdd:         (d: AddMedData) => void
  defaultPetId?: string
}

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

const MED_ICONS = ['💊', '💉', '🩹', '🧪', '🫙', '🌡️', '🩺']

export default function AddMedicationModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t } = useTranslation()
  const { pets } = usePetsContext()

  // ✅ frequências traduzidas dentro do componente
const FREQ_OPTIONS = [
  { val: 'daily',    label: t('pet.cares.periodDay')       },
  { val: 'every12h', label: `${t('cares.add.recXHours')} (12h)` },
  { val: 'every8h',  label: `${t('cares.add.recXHours')} (8h)`  },
  { val: 'weekly',   label: t('pet.cares.periodWeek')      },
  { val: 'biweekly', label: t('medications.freq.biweekly') },
  { val: 'monthly',  label: t('medications.freq.monthly')  },
  { val: 'every3m',  label: t('medications.freq.every3m')  },
  { val: 'single',   label: t('medications.freq.single')   },
]

  const today = new Date().toISOString().split('T')[0]

  const [petId,     setPetId]     = useState(defaultPetId ?? pets[0]?.id ?? '')
  const [medIcon,   setMedIcon]   = useState('💊')
  const [name,      setName]      = useState('')
  const [dose,      setDose]      = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [startDate, setStartDate] = useState(today)
  const [endDate,   setEndDate]   = useState('')
  const [notes,     setNotes]     = useState('')
  const [errors,    setErrors]    = useState<Record<string, string>>({})
  const [success,   setSuccess]   = useState(false)

  const reset = () => {
    setName(''); setDose(''); setFrequency('daily')
    setStartDate(today); setEndDate(''); setNotes('')
    setMedIcon('💊'); setErrors({})
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name  = t('medications.edit.errName')
    if (!dose.trim()) e.dose  = t('medications.edit.errDose')
    if (!startDate)   e.start = t('medications.edit.errStart')
    if (endDate && endDate < startDate) e.end = t('medications.edit.errEnd')
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, petSpecies: pet?.species ?? '',name: name.trim(), dose: dose.trim(), frequency, startDate, endDate, notes })
      showToast(`${medIcon} ${t('toast.medAdded')}`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet = pets.find(p => p.id === petId)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon=""
      accentBg="var(--warn-hl)"
      accentFg="var(--warn)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>{t('medications.add')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--warn-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--warn)', fontSize:'1.5rem' }}>{medIcon}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('medications.add')}</div>
          <div className="modal-hero-sub">
            {t('cares.add.heroSub')} <strong>{pet?.name ?? '—'}</strong>
          </div>
        </div>
        <button className="pm-close" onClick={handleClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('toast.medAdded')}</div>
          <div className="modal-success-sub">{medIcon} <strong>{name}</strong> {t('pet.vacc.successSub')}</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">{t('cares.add.sectionPet')}</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${pets.length},1fr)`, marginBottom:'1rem' }}>
            {pets.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Medication identity */}
          <div className="modal-section">{t('medications.title')}</div>

          <div className="form-group">
            <label className="form-label">{t('medications.dose')}</label>
            <div style={{ display:'flex', gap:'.375rem' }}>
              {MED_ICONS.map(ic => (
                <button key={ic} type="button"
                  className={['emoji-pick-btn', medIcon===ic ? 'active' : ''].join(' ')}
                  style={{ width:38, height:38, fontSize:'1.1rem' }}
                  onClick={() => setMedIcon(ic)}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('field.name')} *</label>
              <div className="field-icon-wrap">
                <span className="field-icon" style={{ fontSize:'1rem' }}>{medIcon}</span>
                <input className={['form-input', errors.name ? 'form-input--err' : ''].join(' ')}
                  placeholder={t('medications.edit.namePh')}
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(v => ({...v, name:''})) }}
                  autoFocus/>
              </div>
              {errors.name && <span className="form-hint-err">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">{t('medications.dose')} *</label>
              <div className="field-icon-wrap">
                <span className="field-icon">⚖️</span>
                <input className={['form-input', errors.dose ? 'form-input--err' : ''].join(' ')}
                  placeholder={t('medications.edit.dosePh')}
                  value={dose}
                  onChange={e => { setDose(e.target.value); setErrors(v => ({...v, dose:''})) }}/>
              </div>
              {errors.dose && <span className="form-hint-err">{errors.dose}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('medications.frequency')}</label>
            <div className="field-icon-wrap">
              <span className="field-icon">🔄</span>
              <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                {FREQ_OPTIONS.map(f => <option key={f.val} value={f.val}>{f.label}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="modal-section">{t('medications.startDate')} / {t('medications.endDate')}</div>
          <div className="form-row">
            <FormDateField
              label={`${t('medications.startDate')} *`}
              value={startDate}
              onChange={v => { setStartDate(v); setErrors(e => ({...e, start:''})) }}
              max={today}
              error={errors.start}
            />
            <FormDateField
              label={`${t('medications.endDate')} (${t('btn.optional')})`}
              value={endDate}
              onChange={v => { setEndDate(v); setErrors(e => ({...e, end:''})) }}
              min={startDate}
              error={errors.end}
              hint={t('medications.edit.endHint')}
            />
          </div>

          {/* Notes */}
          <div className="modal-section">{t('field.notes')}</div>
          <div className="form-group" style={{ marginBottom:0 }}>
            <label className="form-label">
              {t('field.notes')}{' '}
              <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
            </label>
            <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
              <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
              <textarea className="form-input" rows={3}
                placeholder={t('medications.edit.notesPh')}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ resize:'vertical', minHeight:72, fontFamily:'inherit', border:'none' }}/>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/BackButton.tsx
```typescript
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface BackButtonProps {
  to?:    string        // specific route; if omitted uses navigate(-1)
  label?: string
}

export default function BackButton({ to, label }: BackButtonProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()  
  return (
    <button
      className="back-btn"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      type="button"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {label ?? t.btn.back}
    </button>
  )
}
```

## File: src/components/CareDetailModal.tsx
```typescript
// traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PfBtn, PfFooter } from './FooterButtons'

export interface CareDetailItem {
  id: string; petId: string; emoji: string; title: string; sub: string
  total: number; done: number; done_state: boolean; bg: string
}

interface Props {
  item:     CareDetailItem | null
  onClose:  () => void
  onToggle: (id: string, newDone: number, newState: boolean) => void
  onEdit:   (item: CareDetailItem) => void
}

export default function CareDetailModal({ item, onClose, onToggle, onEdit }: Props) {
  const { t } = useTranslation()
  const [localDone, setLocalDone] = useState<number | null>(null)

  if (!item) return null

  const done   = localDone !== null ? localDone : item.done
  const isDone = done >= item.total

  const clickDot = (i: number) => {
    const newDone = i < done ? i : i + 1
    setLocalDone(newDone)
    onToggle(item.id, newDone, newDone >= item.total)
  }

  const handleMarkDone = () => {
    const newDone = isDone ? 0 : item.total
    setLocalDone(newDone)
    onToggle(item.id, newDone, !isDone)
  }

  return (
    <div className="care-detail-overlay" onClick={onClose}>
      <div className="care-detail-sheet" onClick={e => e.stopPropagation()}>

        {/* ── Hero ── */}
        <div className="care-detail-hero">
          <div className="care-detail-emoji" style={{ background: item.bg }}>{item.emoji}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)' }}>{item.title}</div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.1rem' }}>{item.sub}</div>
          </div>
          <button
            style={{ width:32, height:32, borderRadius:'var(--r-md)', background:'var(--surface-offset)',
              border:'1.5px solid var(--border)', display:'flex', alignItems:'center',
              justifyContent:'center', color:'var(--text-muted)', cursor:'pointer', flexShrink:0 }}
            onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="care-detail-body">

          {/* Progress dots */}
          <div className="care-detail-progress-row">
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'.5rem' }}>
                {t('cares.todayProgress', { done, total: item.total })}
              </div>
              <div className="care-detail-dots">
                {Array.from({ length: item.total }).map((_, i) => (
                  <button key={i}
                    className={['care-detail-dot-btn', i < done ? 'filled' : ''].join(' ')}
                    onClick={() => clickDot(i)}
                    title={i < done ? t('btn.unarchive') : t('btn.done')}>
                    {i < done ? '✓' : '○'}
                  </button>
                ))}
              </div>
            </div>
            {isDone && (
              <div style={{ background:'var(--success-hl)', border:'1.5px solid var(--success)',
                borderRadius:'var(--r-full)', padding:'.25rem .75rem', fontSize:'.75rem',
                fontWeight:800, color:'var(--success)', flexShrink:0 }}>
                {t('status.finished')} ✓
              </div>
            )}
          </div>

          {/* Meta chips */}
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            {[
              { label: t('modal.frequency'),  value: item.sub },
              { label: t('modal.status'),
                value: isDone ? t('status.finished') : t('cares.pending'),
                color: isDone ? 'var(--success)' : 'var(--warn)' },
            ].map(c => (
              <div key={c.label} style={{ background:'var(--surface-offset)', border:'1.5px solid var(--border)',
                borderRadius:'var(--r-lg)', padding:'.5rem .875rem', flex:1 }}>
                <div style={{ fontSize:'.65rem', color:'var(--text-faint)', fontWeight:800,
                  textTransform:'uppercase', letterSpacing:'.07em' }}>{c.label}</div>
                <div style={{ fontSize:'.875rem', fontWeight:700, marginTop:'.2rem',
                  color: c.color ?? 'var(--text)' }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="detail-footer">
          <button className="btn btn-secondary" onClick={() => { onEdit(item); onClose() }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
            {t('btn.edit')}
          </button>
          <button
            className={isDone ? 'btn btn-secondary' : 'btn btn-success'}
            onClick={handleMarkDone}>
            {isDone ? `↩ ${t('btn.unarchive')}` : `✓ ${t('cares.done')}`}
          </button>
        </div>

      </div>
    </div>
  )
}
```

## File: src/components/DeleteAccountModal.tsx
```typescript
//traduzida

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PfBtn } from './FooterButtons'

interface Props {
  isOpen:    boolean
  onClose:   () => void
  onConfirm: () => void
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: Props) {
  const { t } = useTranslation()
  const [step, setStep]       = useState(1)
  const [typed, setTyped]     = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const typeWord = t('settings.deleteModal.typeWord')

  const handleConfirm = () => {
    if (typed.toLowerCase() !== typeWord) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onConfirm()
    }, 1200)
  }

  const reset = () => { setStep(1); setTyped(''); setLoading(false); onClose() }

  const LOSS_ITEMS = [
    { icon: '🐾', text: t('settings.deleteModal.petProfiles')  },
    { icon: '💉', text: t('settings.deleteModal.vaccines')     },
    { icon: '💊', text: t('settings.deleteModal.medications')  },
    { icon: '🌡️', text: t('settings.deleteModal.records')      },
    { icon: '📋', text: t('settings.deleteModal.dailyCares')   },
    { icon: '👥', text: t('settings.deleteModal.caregivers')   },
  ]

  return (
    <div className="delete-account-overlay" onClick={reset}>
      <div className="delete-account-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="delete-account-header">
          <div className="delete-account-warning-icon">⚠️</div>
          <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--err)', marginBottom: '.375rem' }}>
            {t('settings.deleteModal.title')}
          </div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {t('settings.deleteModal.subtitle')}
          </div>
        </div>

        {step === 1 ? (
          /* ── Step 1: What will be lost ── */
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)', marginBottom: '.875rem' }}>
              {t('settings.deleteModal.willLose')}
            </div>
            {LOSS_ITEMS.map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '.625rem', marginBottom: '.5rem' }}>
                <span style={{ fontSize: '.875rem', flexShrink: 0, marginTop: '.05rem' }}>{item.icon}</span>
                <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>{item.text}</span>
              </div>
            ))}
            <div style={{ background: 'var(--err-hl)', border: '1.5px solid rgba(200,64,106,.3)', borderRadius: 'var(--r-lg)', padding: '.75rem 1rem', marginTop: '.875rem', fontSize: '.8125rem', color: 'var(--err)', fontWeight: 700 }}>
              {t('settings.deleteModal.warning')}
            </div>
          </div>
        ) : (
          /* ── Step 2: Type confirmation ── */
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {t('settings.deleteModal.typePrompt')}{' '}
              <strong style={{ color: 'var(--text)', fontFamily: 'monospace', background: 'var(--surface-offset)', padding: '.1rem .35rem', borderRadius: 'var(--r-sm)' }}>
                {typeWord}
              </strong>{' '}
              {t('modal.addInfo') ? '' : ''}
            </div>
            <input
              className="form-input"
              placeholder={typeWord}
              value={typed}
              onChange={e => setTyped(e.target.value)}
              style={{
                borderColor: typed && typed.toLowerCase() !== typeWord ? 'var(--err)' : 'var(--border)',
                marginBottom: '.875rem',
              }}
              autoFocus
            />
            {typed && typed.toLowerCase() !== typeWord && (
              <div style={{ fontSize: '.75rem', color: 'var(--err)', marginTop: '-.625rem', marginBottom: '.875rem', fontWeight: 700 }}>
                {t('settings.deleteModal.typeError')}
              </div>
            )}
            <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>
              {t('settings.deleteModal.finalWarning')}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', padding: '.875rem 1.5rem 1.125rem', borderTop: '1.5px solid var(--divider)', background: 'var(--surface-2)' }}>
          <PfBtn variant="cancel" onClick={reset}>{t('btn.cancel')}</PfBtn>
          {step === 1 ? (
            <PfBtn variant="delete" onClick={() => setStep(2)}>
              {t('settings.deleteModal.continue')}
            </PfBtn>
          ) : (
            <PfBtn
              variant="delete"
              loading={loading}
              disabled={typed.toLowerCase() !== typeWord}
              onClick={handleConfirm}
            >
              {t('settings.deleteModal.confirmBtn')}
            </PfBtn>
          )}
        </div>

      </div>
    </div>
  )
}
```

## File: src/components/FooterButtons.tsx
```typescript
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type PfVariant =
  | 'close' | 'cancel'
  | 'save' | 'primary'
  | 'register' | 'add'
  | 'done'
  | 'edit'
  | 'archive'
  | 'resolve'
  | 'delete' | 'danger'
  | 'warn'

type PfSize = 'sm' | 'md' | 'lg'

interface PfBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant:  PfVariant
  size?:    PfSize
  icon?:    ReactNode
  full?:    boolean
  loading?: boolean
  children: ReactNode
}

// ── SVG Icon helpers ──────────────────────────────────────────
function SaveIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }
function CloseIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg> }
function EditIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg> }
function CheckIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> }
function AddIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg> }
function TrashIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> }
function ArchiveIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg> }
function SpinIcon()     { return <span style={{ display:'inline-block', width:14, height:14, borderRadius:'50%', border:'2.5px solid currentColor', borderTopColor:'transparent', animation:'spin .7s linear infinite' }}/> }

const DEFAULT_ICONS: Partial<Record<PfVariant, ReactNode>> = {
  save:     <SaveIcon/>,
  primary:  <SaveIcon/>,
  close:    <CloseIcon/>,
  cancel:   <CloseIcon/>,
  edit:     <EditIcon/>,
  done:     <CheckIcon/>,
  register: <CheckIcon/>,
  add:      <AddIcon/>,
  resolve:  <CheckIcon/>,
  delete:   <TrashIcon/>,
  danger:   <TrashIcon/>,
  archive:  <ArchiveIcon/>,
}


export function PfBtn({
  variant,
  size = 'md',
  icon,
  full = false,
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: PfBtnProps) {
  const classes = [
    'pf-btn',
    `pf-btn--${variant}`,
    size !== 'md' ? `pf-btn--${size}` : '',
    full ? 'pf-btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  const displayIcon = icon ?? DEFAULT_ICONS[variant]

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? <SpinIcon/> : (displayIcon && <span className="pf-btn-icon">{displayIcon}</span>)}
      {children}
    </button>
  )
}

/**
 * PfFooter — Professional Footer container
 * place=start puts destructive action on left, actions on right (default pattern)
 */
interface PfFooterProps {
  left?:  ReactNode
  right?: ReactNode
  children?: ReactNode
  className?: string
}
export function PfFooter({ left, right, children, className = '' }: PfFooterProps) {
  if (children) {
    return (
      <div className={`pf-footer ${className}`}>
        {children}
      </div>
    )
  }
  return (
    <div className={`pf-footer pf-footer--spread ${className}`}>
      {left  && <div className="pf-footer__left">{left}</div>}
      {right && <div className="pf-footer__right">{right}</div>}
    </div>
  )
}

/** Preset footer: Cancel + Primary CTA */
export function FooterCancelSave({
  onCancel,
  onSave,
  cancelLabel = 'Cancelar',
  saveLabel   = 'Guardar cambios',
  loading     = false,
  variant     = 'save',
}: {
  onCancel:     () => void
  onSave?:      () => void
  cancelLabel?: string
  saveLabel?:   string
  loading?:     boolean
  variant?:     PfVariant
}) {
  return (
    <PfFooter>
      <PfBtn variant="cancel" onClick={onCancel}>{cancelLabel}</PfBtn>
      {onSave
        ? <PfBtn variant={variant} onClick={onSave} loading={loading}>{saveLabel}</PfBtn>
        : <PfBtn variant={variant} type="submit" loading={loading}>{saveLabel}</PfBtn>}
    </PfFooter>
  )
}

/** Preset: Cancel + Edit + Done */
export function FooterDetailActions({
  onClose,
  onEdit,
  onDone,
  doneLabel = 'Marcar hecho',
  doneVariant = 'done',
}: {
  onClose:      () => void
  onEdit:       () => void
  onDone?:      () => void
  doneLabel?:   string
  doneVariant?: PfVariant
}) {
  return (
    <PfFooter>
      <PfBtn variant="cancel" size="sm" onClick={onClose}>t('btn.close')</PfBtn>
      <div style={{ display:'flex', gap:'.5rem', marginLeft:'auto' }}>
        <PfBtn variant="edit" onClick={onEdit}>t('btn.edit')</PfBtn>
        {onDone && <PfBtn variant={doneVariant} onClick={onDone}>{doneLabel}</PfBtn>}
      </div>
    </PfFooter>
  )
}
```

## File: src/components/FormDateField.tsx
```typescript
import { useRef, type ReactNode } from 'react'

interface FormDateFieldProps {
  label:    ReactNode
  value:    string
  onChange: (val: string) => void
  min?:     string
  max?:     string
  required?: boolean
  hint?:    string
  error?:   string
  placeholder?: string
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

const MONTHS_ES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
]

function formatDate(val: string): string {
  if (!val) return ''
  const d = new Date(val + 'T00:00:00')
  if (isNaN(d.getTime())) return val
  const day  = d.getDate()
  const mon  = MONTHS_ES[d.getMonth()]
  const year = d.getFullYear()
  return `${day} de ${mon}, ${year}`
}

export default function FormDateField({
  label, value, onChange, min, max, required, hint, error, placeholder = 'Selecciona una fecha',
}: FormDateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const trigger = () => {
    try { inputRef.current?.showPicker?.() }
    catch { inputRef.current?.click() }
  }

  return (
    <div className="fdf-wrap">
      <label className="fdf-label">
        {label}
        {required && <span className="fdf-required">*</span>}
      </label>

      {/* Clickable display row */}
      <div
        className={['fdf-row', error ? 'fdf-row--err' : ''].join(' ')}
        onClick={trigger}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && trigger()}
      >
        <span className="fdf-icon"><CalendarIcon /></span>
        <span className={['fdf-display', !value ? 'fdf-placeholder' : ''].join(' ')}>
          {value ? formatDate(value) : placeholder}
        </span>
        {value && (
          <button
            className="fdf-clear"
            onClick={e => { e.stopPropagation(); onChange('') }}
            title="Limpiar fecha"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
        {/* Hidden native input */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={e => onChange(e.target.value)}
          className="fdf-native"
          tabIndex={-1}
        />
      </div>

      {error  && <span className="fdf-msg fdf-msg--err">{error}</span>}
      {!error && hint && <span className="fdf-msg fdf-msg--hint">{hint}</span>}
    </div>
  )
}
```

## File: src/components/MedDetailModal.tsx
```typescript
import { useState } from 'react'
import type { MedRecord } from './EditMedModal'

interface Props {
  med:     MedRecord | null
  onClose: () => void
  onEdit:  (med: MedRecord) => void
  onMarkAdministered: (med: MedRecord, date: string) => void
}

export default function MedDetailModal({ med, onClose, onEdit, onMarkAdministered }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [markMode,  setMarkMode]  = useState(false)
  const [adminDate, setAdminDate] = useState(today)

  if (!med) return null

  const handleMark = () => {
    onMarkAdministered(med, adminDate)
    onClose()
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div className="detail-icon" style={{ background: med.bg || 'var(--warn-hl)', color: med.color || 'var(--warn)', fontSize: '1.375rem' }}>
            {med.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{med.title}</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
              {med.dose} · {med.frequency}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="detail-body">
          <div style={{ marginBottom: '1rem' }}>
            <span className={`status-pill ${med.archived ? 'archived' : 'ok'}`}>
              {med.archived ? '📁 Archivado' : '✓ Activo'}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Dosis</div>
              <div className="detail-info-value">{med.dose}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Frecuencia</div>
              <div className="detail-info-value">{med.frequency}</div>
            </div>
            {med.startDate && (
              <div className="detail-info-chip">
                <div className="detail-info-label">Inicio</div>
                <div className="detail-info-value">
                  {new Date(med.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}
            {med.endDate && (
              <div className="detail-info-chip">
                <div className="detail-info-label">Fin</div>
                <div className="detail-info-value">
                  {new Date(med.endDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>

          {med.notes && (
            <div style={{ background: 'var(--surface-offset)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '.75rem 1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-faint)', marginBottom: '.375rem' }}>Notas</div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{med.notes}</div>
            </div>
          )}

          {/* Mark administered form */}
          {markMode && (
            <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)', borderRadius: 'var(--r-xl)', padding: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--success)', marginBottom: '.75rem' }}>✓ Registrar administración</div>
              <div className="detail-date-row">
                <label>Administrado el</label>
                <input type="date" value={adminDate}
                  onChange={e => setAdminDate(e.target.value)}
                  max={today}/>
              </div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          {!markMode ? (
            <>
              <button className="btn btn-secondary" onClick={() => { onEdit(med); onClose() }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
                Editar
              </button>
              {!med.archived && (
                <button className="btn btn-success" onClick={() => setMarkMode(true)}>
                  💊 Marcar administrado
                </button>
              )}
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setMarkMode(false)}>{t.btn.cancel}</button>
              <button className="btn btn-success" onClick={handleMark}>✓ Confirmar</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

## File: src/components/NewNoteModal.tsx
```typescript
// traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface NoteData {
  petId: string; content: string; vet: string; date: string; type: string
}

interface Props {
  isOpen:        boolean
  onClose:       () => void
  onAdd:         (d: NoteData) => void
  defaultPetId?: string
}

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

const NOTE_TYPE_ICONS: Record<string, string> = {
  control:     '🩺',
  observacion: '👁',
  emergencia:  '🚨',
  vacuna:      '💉',
  cirugia:     '🔬',
  otro:        '📋',
}
const NOTE_TYPE_BG: Record<string, string> = {
  control:     'var(--blue-hl)',
  observacion: 'var(--primary-hl)',
  emergencia:  'var(--err-hl)',
  vacuna:      'var(--success-hl)',
  cirugia:     'var(--warn-hl)',
  otro:        'var(--surface-offset)',
}
const NOTE_TYPE_FG: Record<string, string> = {
  control:     'var(--blue)',
  observacion: 'var(--primary)',
  emergencia:  'var(--err)',
  vacuna:      'var(--success)',
  cirugia:     'var(--warn)',
  otro:        'var(--text-muted)',
}

export default function NewNoteModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t }    = useTranslation()
  const { pets } = usePetsContext()

  // ✅ tipos traduzidos dentro do componente para reagir ao idioma
  const NOTE_TYPES = [
    { val:'control',     label: t('notes.typeOptions.control')     },
    { val:'observacion', label: t('notes.typeOptions.observacion') },
    { val:'emergencia',  label: t('notes.typeOptions.emergencia')  },
    { val:'vacuna',      label: t('notes.typeOptions.vacuna')      },
    { val:'cirugia',     label: t('notes.typeOptions.cirugia')     },
    { val:'otro',        label: t('notes.typeOptions.otro')        },
  ]

  const today = new Date().toISOString().split('T')[0]

  const [petId,   setPetId]   = useState(defaultPetId ?? pets[0]?.id ?? '')
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [type,    setType]    = useState('control')
  const [contErr, setContErr] = useState('')
  const [success, setSuccess] = useState(false)

  const reset = () => { setContent(''); setVet(''); setDate(today); setType('control'); setContErr('') }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!content.trim()) { setContErr(t('notes.errContent')); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, content: content.trim(), vet: vet.trim(), date, type })
      showToast(`${NOTE_TYPE_ICONS[type] ?? '📋'} ${t('pet.notes.toastAdded')}`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet      = pets.find(p => p.id === petId)
  const selLabel = NOTE_TYPES.find(n => n.val === type)?.label ?? ''
  const selIcon  = NOTE_TYPE_ICONS[type] ?? '📋'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon=""
      accentBg="var(--primary-hl)"
      accentFg="var(--primary)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>{t('notes.new')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>
          {selIcon}
        </div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('notes.new')}</div>
          <div className="modal-hero-sub">
            {selLabel} · <strong>{pet?.name ?? '—'}</strong>
          </div>
        </div>
        <button className="pm-close" onClick={handleClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('pet.notes.toastAdded')}</div>
          <div className="modal-success-sub">
            {new Date(date+'T12:00:00').toLocaleDateString(t('dates.locale'))}
          </div>
        </div>
      ) : (
        <>
          {/* Pet */}
          <div className="modal-section">{t('cares.add.sectionPet')}</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${pets.length},1fr)`, marginBottom:'1rem' }}>
            {pets.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Tipo de nota */}
          <div className="modal-section">{t('notes.type')}</div>
          <div className="note-type-grid">
            {NOTE_TYPES.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type===n.val ? 'active' : ''].join(' ')}
                style={type===n.val ? { background: NOTE_TYPE_BG[n.val], borderColor: NOTE_TYPE_FG[n.val], color: NOTE_TYPE_FG[n.val] } : {}}
                onClick={() => setType(n.val)}>
                <span style={{ fontSize:'1.1rem' }}>{NOTE_TYPE_ICONS[n.val]}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          <div className="modal-section">{t('notes.content')}</div>
          <div className="form-group">
            <label className="form-label">{t('field.notes')} *</label>
            <div className={['form-input', contErr ? 'form-input--err' : ''].join(' ')} style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                placeholder={t('notes.addHint')}
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Veterinário + data */}
          <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">
                {t('field.vet')}{' '}
                <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
              </label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input"
                  placeholder={t('vet.appointments.vetNamePh')}
                  value={vet}
                  onChange={e => setVet(e.target.value)}/>
              </div>
            </div>
            <FormDateField
              label={t('field.date')}
              value={date}
              onChange={setDate}
              max={today}
            />
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/NoteModals.tsx
```typescript
// traduzido e sem mock
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from './FooterButtons'
import { useUser } from '../context/UserContext'
import { usePetsContext } from '../context/PetsContext'
import { SPECIES_EMOJI } from '../hooks/usePets'

/* ═══════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════ */
export interface NoteReply {
  id:            string
  authorId:      string
  authorName:    string
  authorAvatar:  string
  authorColor:   string
  authorColorFg: string
  content:       string
  date:          string
}

export interface NoteEntry {
  id:       string
  petId:    string
  content:  string
  vet:      string
  date:     string
  type:     string
  archived: boolean
  authorId?:     string
  authorName?:   string
  authorAvatar?: string
  authorColor?:  string
  authorColorFg?:string
  replies?: NoteReply[]
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTES — sem labels hardcoded, usadas só para cores/ícones
══════════════════════════════════════════════════════════════════ */
const TYPEICON: Record<string, string> = {
  control:'🩺', observacion:'👁', emergencia:'🚨',
  vacuna:'💉', cirugia:'🔬', otro:'📋',
}
const TYPEBG: Record<string, string> = {
  control:'var(--blue-hl)', observacion:'var(--primary-hl)', emergencia:'var(--err-hl)',
  vacuna:'var(--success-hl)', cirugia:'var(--warn-hl)', otro:'var(--surface-offset)',
}
const TYPEFG: Record<string, string> = {
  control:'var(--blue)', observacion:'var(--primary)', emergencia:'var(--err)',
  vacuna:'var(--success)', cirugia:'var(--warn)', otro:'var(--text-muted)',
}

// NOTE_TYPES_EDIT sem labels — gerados via t() dentro dos componentes
const NOTE_TYPE_KEYS = ['control','observacion','emergencia','vacuna','cirugia','otro'] as const
type NoteTypeKey = typeof NOTE_TYPE_KEYS[number]

/* ═══════════════════════════════════════════════════════════════
   AVATAR INLINE
══════════════════════════════════════════════════════════════════ */
function Avatar({ name, avatar, color, colorFg, size = 28 }: {
  name: string; avatar: string; color: string; colorFg: string; size?: number
}) {
  return (
    <div title={name} style={{
      width:size, height:size, borderRadius:'50%',
      background:color, color:colorFg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size * 0.36, fontWeight:800, flexShrink:0, letterSpacing:'-0.02em',
    }}>
      {avatar}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   REPLY BUBBLE
══════════════════════════════════════════════════════════════════ */
function ReplyBubble({ reply, isOwn }: { reply: NoteReply; isOwn: boolean }) {
  const { t, i18n } = useTranslation()
  const dateStr = new Date(reply.date + 'T12:00:00').toLocaleDateString(i18n.language, {
    day:'2-digit', month:'short',
  })
  return (
    <div style={{
      border:'1.5px solid var(--border)',
      borderLeft:`3px solid ${reply.authorColor}`,
      borderRadius:'var(--r-lg)',
      background: isOwn ? 'color-mix(in oklch,var(--primary-hl) 30%,var(--surface))' : 'var(--surface)',
      padding:'.625rem .875rem',
      marginBottom:'.5rem',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.4rem' }}>
        <Avatar
          name={reply.authorName} avatar={reply.authorAvatar}
          color={reply.authorColor} colorFg={reply.authorColorFg} size={24}
        />
        <span style={{ fontWeight:800, fontSize:'.8125rem', color:reply.authorColorFg }}>
          {reply.authorName}
        </span>
        {isOwn && (
          <span className="badge badge-blue" style={{ fontSize:'.6rem', padding:'.1rem .35rem' }}>
            {t('notes.replyYou')}
          </span>
        )}
        <span style={{ marginLeft:'auto', fontSize:'.72rem', color:'var(--text-faint)' }}>
          {dateStr}
        </span>
      </div>
      <p style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6, margin:0 }}>
        {reply.content}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   NOTE DETAIL MODAL
══════════════════════════════════════════════════════════════════ */
interface DetailProps {
  note:        NoteEntry | null
  onClose:     () => void
  onEdit:      (n: NoteEntry) => void
  onArchive:   (id: string) => void
  onUnarchive: (id: string) => void
  onDelete?:   (id: string) => void
  onAddReply?: (noteId: string, reply: NoteReply) => void
}

export function NoteDetailModal({
  note, onClose, onEdit, onArchive, onUnarchive, onDelete, onAddReply,
}: DetailProps) {
  const { t, i18n } = useTranslation()
  const { user } = useUser()
  const { pets } = usePetsContext()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (!note) { setConfirmDelete(false); setReplyText('') }
  }, [note])

  if (!note) return null

  // Derivado de contextos reais — sem PETMETA mock
  const petMatch = pets.find(p => p.id === note.petId)
  const pm = {
    emoji: SPECIES_EMOJI[petMatch?.species ?? ''] ?? '🐾',
    name:  petMatch?.name ?? t('pets.noPets'),
  }

  const fg  = TYPEFG[note.type]   ?? 'var(--text-muted)'
  const bg  = TYPEBG[note.type]   ?? 'var(--surface-offset)'
  const ic  = TYPEICON[note.type] ?? '📋'
  const lbl = t(`notes.typeOptions.${note.type}` as never, { defaultValue: note.type })

  const replies = note.replies ?? []
  const dateStr = new Date(note.date + 'T12:00:00').toLocaleDateString(i18n.language, {
    day:'2-digit', month:'short', year:'numeric',
  })

  // CURRENT_USER derivado do contexto real — sem mock
  const currentUser = {
    id:       user.email,
    name:     user.name || '?',
    avatar:   user.avatar,
    color:    user.color,
    colorFg:  user.colorFg,
  }

  const handleAddReply = () => {
    if (!replyText.trim() || !onAddReply) return
    const reply: NoteReply = {
      id:            `reply-${Date.now()}`,
      authorId:      currentUser.id,
      authorName:    currentUser.name,
      authorAvatar:  currentUser.avatar,
      authorColor:   currentUser.color,
      authorColorFg: currentUser.colorFg,
      content:       replyText.trim(),
      date:          new Date().toISOString().split('T')[0],
    }
    onAddReply(note.id, reply)
    setReplyText('')
    showToast(t('notes.replyAdded'))
  }

  const replyCount = replies.length
  const replyLabel = replyCount === 1
    ? t('notes.replySingular')
    : t('notes.replyPlural', { count: replyCount })

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" style={{ maxWidth:460 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="detail-header">
          <div className="detail-icon" style={{ background:bg, color:fg, fontSize:'1.375rem' }}>
            {ic}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', lineHeight:1.2 }}>
              {lbl}
            </div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.15rem' }}>
              {pm.emoji} {pm.name} · {dateStr}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="detail-body" style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>

          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            <span className="status-pill ok">{lbl}</span>
            {note.archived && (
              <span className="badge badge-gray">{t('notes.archivedBadge')}</span>
            )}
          </div>

          {note.authorName && (
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
              <Avatar
                name={note.authorName}
                avatar={note.authorAvatar ?? note.authorName.slice(0,2).toUpperCase()}
                color={note.authorColor   ?? 'var(--primary-hl)'}
                colorFg={note.authorColorFg ?? 'var(--primary)'}
                size={26}
              />
              <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>
                {t('notes.addedBy')}{' '}
                <strong style={{ color:'var(--text)' }}>{note.authorName}</strong>
              </span>
              {note.vet && (
                <span style={{ fontSize:'.8125rem', color:'var(--text-faint)' }}>
                  · 🩺 {note.vet}
                </span>
              )}
            </div>
          )}

          <div style={{
            background:'var(--surface-offset)',
            border:'1.5px solid var(--border)',
            borderLeft:`3px solid ${fg}`,
            borderRadius:'var(--r-lg)',
            padding:'.875rem 1rem',
          }}>
            <p style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6, margin:0 }}>
              {note.content}
            </p>
          </div>

          {(replies.length > 0 || onAddReply) && (
            <div>
              {replies.length > 0 && (
                <div style={{
                  display:'flex', alignItems:'center', gap:'.625rem', marginBottom:'.75rem',
                  fontSize:'.72rem', fontWeight:800, textTransform:'uppercase',
                  letterSpacing:'.07em', color:'var(--text-faint)',
                }}>
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                  {replyCount} {replyLabel}
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                </div>
              )}

              {replies.map(r => (
                <ReplyBubble key={r.id} reply={r} isOwn={r.authorId === currentUser.id} />
              ))}

              {onAddReply && (
                <div style={{
                  marginTop: replies.length > 0 ? '.375rem' : 0,
                  border:'1.5px solid var(--border)',
                  borderRadius:'var(--r-lg)',
                  background:'var(--surface)',
                  overflow:'hidden',
                }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'.625rem', padding:'.625rem .875rem' }}>
                    <Avatar
                      name={currentUser.name} avatar={currentUser.avatar}
                      color={currentUser.color} colorFg={currentUser.colorFg} size={26}
                    />
                    <textarea
                      style={{
                        flex:1, border:'none', background:'transparent', outline:'none',
                        fontFamily:'inherit', fontSize:'.875rem', resize:'none',
                        minHeight:52, color:'var(--text)', lineHeight:1.6, paddingTop:'.1rem',
                      }}
                      placeholder={t('notes.replyPlaceholder')}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddReply() }}
                    />
                  </div>
                  {replyText.trim() && (
                    <div style={{
                      padding:'.375rem .875rem .625rem',
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      borderTop:'1px solid var(--divider)',
                    }}>
                      <span style={{ fontSize:'.72rem', color:'var(--text-faint)' }}>
                        {t('notes.replyHint')}
                      </span>
                      <button className="btn btn-primary btn-sm" onClick={handleAddReply}>
                        {t('notes.replyBtn')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="detail-footer">
          {confirmDelete ? (
            <>
              <span style={{ fontSize:'.8125rem', color:'var(--err)', flex:1 }}>
                {t('notes.deleteConfirm')}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>
                {t('btn.no')}
              </button>
              <button
                className="btn btn-sm"
                style={{ background:'var(--err)', color:'#fff' }}
                onClick={() => { onDelete?.(note.id); onClose() }}
              >
                {t('notes.deleteConfirmYes')}
              </button>
            </>
          ) : (
            <>
              {onDelete && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color:'var(--err)' }}
                  onClick={() => setConfirmDelete(true)}
                >
                  {t('btn.delete')}
                </button>
              )}
              <div style={{ marginLeft:'auto', display:'flex', gap:'.5rem' }}>
                {note.archived
                  ? <button className="btn btn-secondary btn-sm" onClick={() => { onUnarchive(note.id); onClose() }}>
                      {t('btn.unarchive')}
                    </button>
                  : <button className="btn btn-secondary btn-sm" onClick={() => { onArchive(note.id); onClose() }}>
                      {t('btn.archive')}
                    </button>
                }
                <button className="btn btn-secondary btn-sm" onClick={() => { onEdit(note); onClose() }}>
                  {t('btn.edit')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EDIT NOTE MODAL
══════════════════════════════════════════════════════════════════ */
interface EditProps {
  isOpen:  boolean
  onClose: () => void
  note:    NoteEntry | null
  onSave:  (updated: NoteEntry) => void
}

export function EditNoteModal({ isOpen, onClose, note, onSave }: EditProps) {
  const { t, i18n } = useTranslation()
  const today = new Date().toISOString().split('T')[0]
  const [type,    setType]    = useState('control')
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [contErr, setContErr] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (note && isOpen) {
      setType(note.type); setContent(note.content)
      setVet(note.vet);   setDate(note.date)
      setContErr('');     setSuccess(false)
    }
  }, [note, isOpen])

  if (!note) return null

  // Labels gerados via t() — sem TYPELABEL hardcoded
  const noteTypesEdit = NOTE_TYPE_KEYS.map(key => ({
    val:   key,
    icon:  TYPEICON[key],
    label: t(`notes.typeOptions.${key}` as never),
  }))

  const selType = noteTypesEdit.find(n => n.val === type) ?? noteTypesEdit[0]

  const handleSave = () => {
    if (!content.trim()) { setContErr(t('notes.errContent')); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...note, type, content: content.trim(), vet: vet.trim(), date })
      showToast(t('pet.notes.toastUpdated'))
      setSuccess(false); onClose()
    }, 900)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('notes.editTitle')}
      icon={selType.icon}
      accentBg={TYPEBG[type] ?? 'var(--primary-hl)'}
      accentFg={TYPEFG[type] ?? 'var(--primary)'}
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>{t('btn.saveChanges')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${TYPEBG[type] ?? 'var(--primary-hl)'},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: TYPEFG[type] ?? 'var(--primary)', color:'#fff', fontSize:'1.5rem' }}>
          {selType.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="modal-hero-title" style={{ fontSize:'1rem' }}>
            {selType.label}
          </div>
          {note.authorName && (
            <div className="modal-hero-sub">
              {t('notes.editBy', { name: note.authorName })}{note.vet ? ` · 🩺 ${note.vet}` : ''}
            </div>
          )}
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('notes.editSuccess')}</div>
        </div>
      ) : (
        <>
          {/* Tipo */}
          <div className="modal-section">{t('notes.type')}</div>
          <div className="note-type-grid" style={{ marginBottom:'1rem' }}>
            {noteTypesEdit.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type === n.val ? 'active' : ''].join(' ')}
                style={type === n.val ? { background:TYPEBG[n.val], borderColor:TYPEFG[n.val], color:TYPEFG[n.val] } : {}}
                onClick={() => setType(n.val)}
              >
                <span style={{ fontSize:'1.1rem' }}>{n.icon}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          <div className="modal-section">{t('notes.content')}</div>
          <div className="form-group">
            <div className={['form-input', contErr ? 'form-input--err' : ''].join(' ')} style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent',
                  outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical',
                  minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                placeholder={t('notes.addHint')}
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Vet + data */}
          <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">
                {t('field.vet')}{' '}
                <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
              </label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input
                  className="form-input"
                  placeholder={t('vet.appointments.vetNamePh')}
                  value={vet}
                  onChange={e => setVet(e.target.value)}
                />
              </div>
            </div>
            <FormDateField label={t('field.date')} value={date} onChange={setDate} max={today} />
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/PetChipEditOverlay.tsx
```typescript
import { useState, useEffect } from 'react'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import { showToast } from './AppLayout'
import { PfBtn } from './FooterButtons'

type ChipField = 'species' | 'birthDate' | 'weight' | 'caregivers'

interface Props {
  pet:     PetWithAlerts
  field:   ChipField | null
  onClose: () => void
  onSave:  (updated: Partial<PetWithAlerts>) => void
}

const SPECIES_OPTIONS: { value: Species; emoji: string; label: string; color: string }[] = [
  { value:'cat',     emoji:'🐱', label:'Gato',   color:'var(--pal-lilac)'      },
  { value:'dog',     emoji:'🐶', label:'Perro',  color:'var(--pal-sky)'        },
  { value:'bird',    emoji:'🦜', label:'Ave',    color:'var(--pal-candy)'      },
  { value:'rabbit',  emoji:'🐰', label:'Conejo', color:'var(--pal-mauve)'      },
  { value:'reptile', emoji:'🦎', label:'Reptil', color:'var(--success-hl)'     },
  { value:'fish',    emoji:'🐟', label:'Pez',    color:'var(--blue-hl)'        },
  { value:'other',   emoji:'🐾', label:'Otro',   color:'var(--surface-offset)' },
]

const FIELD_META: Record<ChipField, { icon: string; label: string }> = {
  species:    { icon:'🐾', label:'Especie'         },
  birthDate:  { icon:'🎂', label:'Fecha de nacimiento' },
  weight:     { icon:'⚖️', label:'Peso'            },
  caregivers: { icon:'👥', label:'Cuidadores'       },
}

interface MockCaregiver { id:string; initials:string; name:string; role:string; bg:string; color:string; removable:boolean }
const INITIAL_CAREGIVERS: MockCaregiver[] = [
  { id:'tl', initials:'TL', name:'Thamires Lopes', role:'Propietaria',          bg:'var(--pal-lilac)', color:'var(--nav-bg)', removable:false },
  { id:'am', initials:'AM', name:'Ana Martínez',   role:'Cuidadora',            bg:'var(--blue-hl)',  color:'var(--blue)',   removable:true  },
]

export default function PetChipEditOverlay({ pet, field, onClose, onSave }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [species,   setSpecies]   = useState<Species>(pet.species)
  const [birthDate, setBirthDate] = useState(pet.birthDate ?? '')
  const [weight,    setWeight]    = useState('')
  const [caregivers, setCaregivers] = useState<MockCaregiver[]>(INITIAL_CAREGIVERS)
  const [newEmail,  setNewEmail]  = useState('')
  const [emailErr,  setEmailErr]  = useState('')

  useEffect(() => {
    if (field) {
      setSpecies(pet.species)
      setBirthDate(pet.birthDate ?? '')
      setWeight('')
      setEmailErr('')
      setNewEmail('')
    }
  }, [field, pet])

  if (!field) return null

  const meta = FIELD_META[field]

  const handleSave = () => {
    if (field === 'species')   onSave({ species })
    if (field === 'birthDate') onSave({ birthDate: birthDate || undefined })
    if (field === 'weight')    { showToast(`⚖️ Peso actualizado${weight ? ': ' + weight + ' kg' : ''}`); onClose(); return }
    if (field === 'caregivers'){ showToast('👥 Cuidadores actualizados'); onClose(); return }
    showToast('✓ Actualizado')
    onClose()
  }

  const handleAddCaregiver = () => {
    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) { setEmailErr('Introduce un email válido'); return }
    const initials = newEmail.split('@')[0].slice(0,2).toUpperCase()
    setCaregivers(prev => [...prev, { id:Date.now().toString(), initials, name:newEmail, role:'Cuidador', bg:'var(--gold-hl)', color:'var(--gold)', removable:true }])
    setNewEmail(''); setEmailErr('')
    showToast(`✉ Invitación enviada a ${newEmail}`)
  }

  return (
    <div className="chip-edit-overlay" onClick={onClose}>
      <div className="chip-edit-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="chip-edit-header">
          <div className="chip-edit-icon">{meta.icon}</div>
          <div className="chip-edit-title">Editar {meta.label}</div>
          <button style={{ width:30,height:30,borderRadius:'var(--r-md)',background:'rgba(0,0,0,.08)',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-muted)' }} onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="chip-edit-body">

          {/* Species */}
          {field === 'species' && (
            <div className="mf-species-grid">
              {SPECIES_OPTIONS.map(o => (
                <button key={o.value} type="button"
                  className={['mf-species-card', species===o.value?'active':''].join(' ')}
                  style={species===o.value?{background:o.color,borderColor:'var(--primary)'}:{}}
                  onClick={() => setSpecies(o.value)}>
                  <span className="mf-species-emoji">{o.emoji}</span>
                  <span className="mf-species-label">{o.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Birth date */}
          {field === 'birthDate' && (
            <div>
              <label className="form-label" style={{ marginBottom:'.5rem',display:'block' }}>Fecha de nacimiento</label>
              <input type="date" className="form-input"
                value={birthDate}
                max={today}
                onChange={e => setBirthDate(e.target.value)}
                autoFocus
              />
              {birthDate && (
                <div style={{ marginTop:'.625rem', fontSize:'.8125rem', color:'var(--text-muted)' }}>
                  📅 {new Date(birthDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'long',year:'numeric'})}
                </div>
              )}
            </div>
          )}

          {/* Weight */}
          {field === 'weight' && (
            <div>
              <label className="form-label" style={{ marginBottom:'.5rem',display:'block' }}>Peso actual</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input type="number" className="mf-input" step="0.1" min="0"
                  placeholder="Ej: 4.2" value={weight} onChange={e => setWeight(e.target.value)} autoFocus/>
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          )}

          {/* Caregivers */}
          {field === 'caregivers' && (
            <div>
              <div style={{ fontWeight:700,fontSize:'.8125rem',color:'var(--text-muted)',marginBottom:'.625rem' }}>Cuidadores actuales</div>
              <div style={{ display:'flex',flexDirection:'column',gap:'.375rem',marginBottom:'1rem' }}>
                {caregivers.map(c => (
                  <div key={c.id} style={{ display:'flex',alignItems:'center',gap:'.625rem',padding:'.5rem .75rem',background:'var(--surface-offset)',border:'1.5px solid var(--border)',borderRadius:'var(--r-lg)' }}>
                    <div style={{ width:32,height:32,borderRadius:'50%',background:c.bg,color:c.color,fontSize:'.65rem',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{c.initials}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'.8125rem',fontWeight:700,color:'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize:'.7rem',color:'var(--text-muted)' }}>{c.role}</div>
                    </div>
                    {c.removable && (
                      <button style={{ width:26,height:26,borderRadius:'var(--r-md)',background:'var(--err-hl)',color:'var(--err)',border:'1px solid rgba(200,64,106,.25)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.65rem',fontWeight:800 }}
                        onClick={() => setCaregivers(prev => prev.filter(x=>x.id!==c.id))}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontWeight:700,fontSize:'.8125rem',color:'var(--text-muted)',marginBottom:'.5rem' }}>Añadir cuidador</div>
              <div style={{ display:'flex',gap:'.375rem' }}>
                <div className="field-icon-wrap" style={{ flex:1 }}>
                  <span className="field-icon">✉</span>
                  <input className={['form-input',emailErr?'form-input--err':''].join(' ')} type="email"
                    placeholder="Email del cuidador"
                    value={newEmail} onChange={e=>{setNewEmail(e.target.value);setEmailErr('')}}
                    style={{ flex:1 }}/>
                </div>
                <button className="pf-btn pf-btn--add pf-btn--sm" onClick={handleAddCaregiver}>
                  Invitar
                </button>
              </div>
              {emailErr && <div style={{ fontSize:'.75rem',color:'var(--err)',marginTop:'.25rem',fontWeight:700 }}>{emailErr}</div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="chip-edit-footer">
          <PfBtn variant="cancel" size="sm" onClick={onClose}>{t.btn.cancel}</PfBtn>
          <PfBtn variant="save" size="sm" onClick={handleSave}>{t('btn.save')}</PfBtn>
        </div>
      </div>
    </div>
  )
}
```

## File: src/components/RegisterSymptomModal.tsx
```typescript
// traduzio e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface SymptomData {
  petId:       string
  description: string
  category:    string
  severity:    string
  date:        string
  notes:       string
}

interface Props {
  isOpen:        boolean
  onClose:       () => void
  onAdd:         (d: SymptomData) => void
  defaultPetId?: string
}

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

const CAT_ICONS: Record<string, string> = {
  digestivo:'🤢', respiratorio:'🫁', piel:'🩹',
  comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓',
}

const SEV_ICON: Record<string, string> = {
  leve:'🟡', moderado:'🟠', grave:'🔴', emergencia:'🚨',
}
const SEV_BG: Record<string, string> = {
  leve:'var(--gold-hl)', moderado:'var(--warn-hl)',
  grave:'var(--err-hl)', emergencia:'rgba(200,64,106,.25)',
}
const SEV_FG: Record<string, string> = {
  leve:'var(--gold)', moderado:'var(--warn)',
  grave:'var(--err)', emergencia:'var(--err)',
}

export default function RegisterSymptomModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t }    = useTranslation()
  const { pets } = usePetsContext()

  // ✅ labels traduzidos dentro do componente
  const CATEGORIES = [
    { val:'digestivo',      label: t('symptoms.categoryOptions.digestivo')      },
    { val:'respiratorio',   label: t('symptoms.categoryOptions.respiratorio')   },
    { val:'piel',           label: t('symptoms.categoryOptions.piel')           },
    { val:'comportamiento', label: t('symptoms.categoryOptions.comportamiento') },
    { val:'movimiento',     label: t('symptoms.categoryOptions.movimiento')     },
    { val:'ocular',         label: t('symptoms.categoryOptions.ocular')         },
    { val:'otro',           label: t('symptoms.categoryOptions.otro')           },
  ]

  const SEVERITIES = [
    { val:'leve',       label: t('symptoms.severityOptions.leve'),       sub: t('symptoms.severitySub.leve')       },
    { val:'moderado',   label: t('symptoms.severityOptions.moderado'),   sub: t('symptoms.severitySub.moderado')   },
    { val:'grave',      label: t('symptoms.severityOptions.grave'),      sub: t('symptoms.severitySub.grave')      },
    { val:'emergencia', label: t('symptoms.severityOptions.emergencia'), sub: t('symptoms.severitySub.emergencia') },
  ]

  const today = new Date().toISOString().split('T')[0]

  const [petId,       setPetId]       = useState(defaultPetId ?? pets[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('digestivo')
  const [severity,    setSeverity]    = useState('leve')
  const [date,        setDate]        = useState(today)
  const [notes,       setNotes]       = useState('')
  const [descErr,     setDescErr]     = useState('')
  const [success,     setSuccess]     = useState(false)

  const reset = () => {
    setDescription(''); setCategory('digestivo'); setSeverity('leve')
    setDate(today); setNotes(''); setDescErr('')
  }
  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!description.trim()) { setDescErr(t('symptoms.errDescription')); return }
    setSuccess(true)
    setTimeout(() => {
      onAdd({ petId, description: description.trim(), category, severity, date, notes })
      showToast(`${SEV_ICON[severity] ?? '🌡️'} ${t('pet.symptoms.toastAdded')}`)
      reset(); setSuccess(false); onClose()
    }, 1100)
  }

  const pet         = pets.find(p => p.id === petId)
  const selSevLabel = SEVERITIES.find(s => s.val === severity)?.label ?? ''

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('symptoms.register')}
      icon="🌡️"
      accentBg="var(--err-hl)"
      accentFg="var(--err)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>{t('symptoms.register')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${SEV_BG[severity]},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: SEV_FG[severity], fontSize:'1.5rem' }}>
          {CAT_ICONS[category] ?? '🌡️'}
        </div>
        <div>
          <div className="modal-hero-title">{t('symptoms.register')}</div>
          <div className="modal-hero-sub">
            <strong>{pet?.name ?? '—'}</strong> · {selSevLabel}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon" style={{ background: SEV_FG[severity] }}>✓</div>
          <div className="modal-success-title">{t('pet.symptoms.toastAdded')}</div>
          <div className="modal-success-sub">
            <div className="modal-success-sub">
  {pet?.name && `${pet.name} · `}{t('pet.symptoms.toastAdded')}
</div>
          </div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">{t('cares.add.sectionPet')}</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${pets.length},1fr)`, marginBottom:'1rem' }}>
            {pets.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId===p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}>
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Descrição */}
          <div className="modal-section">{t('symptoms.description')}</div>
          <div className="form-group">
            <label className="form-label">{t('symptoms.whatObserved')} *</label>
            <div className={['form-input', descErr ? 'form-input--err' : ''].join(' ')}
              style={{ padding:0, border: descErr ? '1.5px solid var(--err)' : undefined }}>
              <textarea
                style={{ width:'100%', padding:'.55rem .875rem', border:'none', background:'transparent', outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical', minHeight:88, color:'var(--text)' }}
                placeholder={t('symptoms.descriptionPh')}
                value={description}
                onChange={e => { setDescription(e.target.value); setDescErr('') }}
                autoFocus
              />
            </div>
            {descErr && <span className="form-hint-err">{descErr}</span>}
          </div>

          {/* Categoria */}
          <div className="modal-section">{t('symptoms.category')}</div>
          <div className="symptom-cat-grid">
            {CATEGORIES.map(c => (
              <button key={c.val} type="button"
                className={['symptom-cat-btn', category===c.val ? 'active' : ''].join(' ')}
                onClick={() => setCategory(c.val)}>
                <span style={{ fontSize:'1.2rem' }}>{CAT_ICONS[c.val]}</span>
                <span style={{ fontSize:'.7rem', fontWeight:700 }}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Severidade */}
          <div className="modal-section">{t('symptoms.severity')}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.375rem', marginBottom:'1rem' }}>
            {SEVERITIES.map(s => (
              <button key={s.val} type="button" className="severity-btn"
                style={{ borderColor: severity===s.val ? SEV_FG[s.val] : 'var(--border)', background: severity===s.val ? SEV_BG[s.val] : 'var(--surface-offset)' }}
                onClick={() => setSeverity(s.val)}>
                <span style={{ fontSize:'1.1rem' }}>{SEV_ICON[s.val]}</span>
                <div style={{ flex:1, textAlign:'left' }}>
                  <div style={{ fontWeight:800, fontSize:'.875rem', color: severity===s.val ? SEV_FG[s.val] : 'var(--text)' }}>{s.label}</div>
                  <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{s.sub}</div>
                </div>
                <div className={['mf-radio', severity===s.val ? 'checked' : ''].join(' ')}
                  style={severity===s.val ? { borderColor: SEV_FG[s.val], background: SEV_FG[s.val] } : {}}/>
              </button>
            ))}
          </div>

          {/* Data + notas */}
          <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
          <FormDateField
            label={t('symptoms.startDate')}
            value={date}
            onChange={setDate}
            max={today}
          />
          <div className="form-group" style={{ marginBottom:0, marginTop:'.75rem' }}>
            <label className="form-label">
              {t('field.notes')}{' '}
              <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
            </label>
            <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
              <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
              <textarea className="form-input" rows={2}
                placeholder={t('symptoms.notesPh')}
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize:'vertical', minHeight:60, fontFamily:'inherit', border:'none' }}
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/SymptomModals.tsx
```typescript
import { useState, useEffect } from 'react'
import Modal from './Modal'
import FormDateField from './FormDateField'
import { showToast } from './AppLayout'
import { PfBtn } from '../components/FooterButtons'

export interface SymptomEntry {
  id:          string
  petId:       string
  description: string
  category:    string
  severity:    string
  date:        string
  notes:       string
  resolved:    boolean
}

// ── Lookup maps ────────────────────────────────────────────────────
const CAT_ICON:  Record<string,string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }
const SEV_COLOR: Record<string,string> = { leve:'var(--gold)', moderado:'var(--warn)', grave:'var(--err)', emergencia:'var(--err)' }
const SEV_BG:    Record<string,string> = { leve:'var(--gold-hl)', moderado:'var(--warn-hl)', grave:'var(--err-hl)', emergencia:'var(--err-hl)' }
const SEV_LABEL: Record<string,string> = { leve:'Leve', moderado:'Moderado', grave:'Grave', emergencia:'Emergencia' }
const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }

// ── Constantes do formulário ───────────────────────────────────────
const CATEGORIES = [
  { val:'digestivo',      icon:'🤢', label:'Digestivo'     },
  { val:'respiratorio',   icon:'🫁', label:'Respiratorio'  },
  { val:'piel',           icon:'🩹', label:'Piel'          },
  { val:'comportamiento', icon:'🧠', label:'Comportamiento' },
  { val:'movimiento',     icon:'🦶', label:'Movimiento'    },
  { val:'ocular',         icon:'👁',  label:'Ocular'        },
  { val:'otro',           icon:'❓', label:'Otro'          },
]
const SEVERITIES = [
  { val:'leve',       label:'Leve',       fg:'var(--gold)', bg:'var(--gold-hl)'         },
  { val:'moderado',   label:'Moderado',   fg:'var(--warn)', bg:'var(--warn-hl)'         },
  { val:'grave',      label:'Grave',      fg:'var(--err)',  bg:'var(--err-hl)'           },
  { val:'emergencia', label:'Emergencia', fg:'var(--err)',  bg:'rgba(200,64,106,.25)'   },
]

// ── Detail Overlay ─────────────────────────────────────────────────
interface DetailProps {
  symptom:     SymptomEntry | null
  onClose:     () => void
  onEdit:      (s: SymptomEntry) => void
  onResolve:   (id: string) => void
  onUnresolve: (id: string) => void
}

export function SymptomDetailModal({ symptom, onClose, onEdit, onResolve, onUnresolve }: DetailProps) {
  if (!symptom) return null
  const sev = symptom.severity
  const cat = symptom.category

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div className="detail-icon"
            style={{ background:SEV_BG[sev] || 'var(--err-hl)', color:SEV_COLOR[sev] || 'var(--err)', fontSize:'1.375rem' }}>
            {CAT_ICON[cat] || '🌡️'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', lineHeight:1.2 }}>
              {symptom.description.length > 50 ? symptom.description.slice(0,50) + '…' : symptom.description}
            </div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.2rem' }}>
              {PET_EMOJI[symptom.petId]} {PET_NAME[symptom.petId]} · {symptom.category}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="detail-body">
          <div style={{ display:'flex', gap:'.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
            <span className={`status-pill ${symptom.resolved ? 'resolved' : 'active'}`}>
              {symptom.resolved ? '✓ Resuelto' : '● Activo'}
            </span>
            <span style={{ background:SEV_BG[sev], color:SEV_COLOR[sev], border:`1.5px solid ${SEV_COLOR[sev]}`, borderRadius:'var(--r-full)', padding:'.25rem .75rem', fontSize:'.75rem', fontWeight:800 }}>
              {SEV_LABEL[sev] || sev}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Categoría</div>
              <div className="detail-info-value">{CAT_ICON[cat]} {cat}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Fecha</div>
              <div className="detail-info-value">
                {new Date(symptom.date+'T00:00:00').toLocaleDateString('es-ES',{ day:'2-digit', month:'short', year:'numeric' })}
              </div>
            </div>
          </div>

          <div style={{ background:'var(--surface-offset)', border:'1.5px solid var(--border)', borderRadius:'var(--r-lg)', padding:'.875rem 1rem', marginBottom:symptom.notes?'1rem':0 }}>
            <div style={{ fontSize:'.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--text-faint)', marginBottom:'.375rem' }}>Descripción</div>
            <div style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6 }}>{symptom.description}</div>
          </div>

          {symptom.notes && (
            <div style={{ background:'var(--surface-offset)', border:'1.5px solid var(--border)', borderRadius:'var(--r-lg)', padding:'.875rem 1rem', marginTop:'.625rem' }}>
              <div style={{ fontSize:'.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--text-faint)', marginBottom:'.375rem' }}>Notas</div>
              <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5 }}>{symptom.notes}</div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          <button className="btn btn-secondary" onClick={() => { onEdit(symptom); onClose() }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
            Editar
          </button>
          {symptom.resolved ? (
            <button className="btn btn-warn" onClick={() => { onUnresolve(symptom.id); onClose() }}>↩ Reabrir</button>
          ) : (
            <button className="btn btn-success" onClick={() => { onResolve(symptom.id); onClose() }}>✓ Marcar resuelto</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Edit Symptom Modal ─────────────────────────────────────────────
interface EditProps {
  isOpen:    boolean
  onClose:   () => void
  symptom:   SymptomEntry | null
  onSave:    (updated: SymptomEntry) => void
  onDelete?: (id: string) => void
}

export function EditSymptomModal({ isOpen, onClose, symptom, onSave, onDelete }: EditProps) {
  const today = new Date().toISOString().split('T')[0]
  const [description,   setDescription]   = useState('')
  const [category,      setCategory]      = useState('digestivo')
  const [severity,      setSeverity]      = useState('leve')
  const [date,          setDate]          = useState(today)
  const [notes,         setNotes]         = useState('')
  const [descErr,       setDescErr]       = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (symptom && isOpen) {
      setDescription(symptom.description)
      setCategory(symptom.category)
      setSeverity(symptom.severity)
      setDate(symptom.date)
      setNotes(symptom.notes)
      setDescErr('')
      setConfirmDelete(false)
    }
  }, [symptom, isOpen])

  if (!symptom) return null

  const selSev = SEVERITIES.find(s => s.val === severity)!

  const handleSave = () => {
    if (!description.trim()) { setDescErr('La descripción es obligatoria'); return }
    onSave({ ...symptom, description:description.trim(), category, severity, date, notes })
    showToast('🌡️ Síntoma actualizado')
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete?.(symptom.id)
    showToast('🗑 Síntoma eliminado')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon=""
      accentBg="var(--err-hl)"
      accentFg="var(--err)"
      size="md"
      footer={
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', gap:'.5rem' }}>
          <PfBtn variant="danger" onClick={handleDelete}>
            {confirmDelete ? '¿Confirmar?' : '🗑 Eliminar'}
          </PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            Guardar cambios
          </PfBtn>
        </div>
      }
    >
      {/* Hero com título dinâmico e botão close */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selSev.bg},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background:selSev.fg, fontSize:'1.5rem' }}>
          {CAT_ICON[category]}
        </div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">Editar síntoma</div>
          <div className="modal-hero-sub">{PET_EMOJI[symptom.petId]} {PET_NAME[symptom.petId]}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Aviso de confirmação de eliminação */}
      {confirmDelete && (
        <div className="note-delete-confirm">
          <div style={{ fontWeight:800, fontSize:'.875rem', color:'var(--err)', marginBottom:'.35rem' }}>
            ¿Eliminar este síntoma permanentemente?
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', lineHeight:1.5 }}>
            Esta acción no se puede deshacer. Pulsa de nuevo "<strong>¿Confirmar?</strong>" o{' '}
            <button
              style={{ background:'none', border:'none', color:'var(--primary)',
                fontWeight:700, cursor:'pointer', padding:0, fontSize:'inherit' }}
              onClick={() => setConfirmDelete(false)}>
              cancela aquí
            </button>.
          </div>
        </div>
      )}

      {/* Descripción */}
      <div className="modal-section">Descripción</div>
      <div className="form-group">
        <div className={['form-input', descErr?'form-input--err':''].join(' ')} style={{ padding:0 }}>
          <textarea
            style={{ width:'100%', padding:'.55rem .875rem', border:'none', background:'transparent',
              outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical',
              minHeight:72, color:'var(--text)' }}
            value={description}
            onChange={e => { setDescription(e.target.value); setDescErr('') }}
            autoFocus
          />
        </div>
        {descErr && <span className="form-hint-err">{descErr}</span>}
      </div>

      {/* Categoría */}
      <div className="modal-section">Categoría</div>
      <div className="symptom-cat-grid" style={{ marginBottom:'1rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.val} type="button"
            className={['symptom-cat-btn', category===c.val?'active':''].join(' ')}
            onClick={() => setCategory(c.val)}>
            <span style={{ fontSize:'1.2rem' }}>{c.icon}</span>
            <span style={{ fontSize:'.7rem', fontWeight:700 }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Severidad */}
      <div className="modal-section">Severidad</div>
      <div style={{ display:'flex', gap:'.375rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        {SEVERITIES.map(s => (
          <button key={s.val} type="button"
            style={{
              flex:1, padding:'.5rem .625rem', borderRadius:'var(--r-lg)',
              border:`1.5px solid ${severity===s.val ? s.fg : 'var(--border)'}`,
              background:severity===s.val ? s.bg : 'var(--surface-offset)',
              cursor:'pointer', fontWeight:700, fontSize:'.8125rem',
              color:severity===s.val ? s.fg : 'var(--text-muted)',
              fontFamily:'inherit', transition:'all var(--trans)', minWidth:70,
            }}
            onClick={() => setSeverity(s.val)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Fecha */}
      <div className="modal-section">Fecha</div>
      <FormDateField label="Fecha del síntoma" value={date} onChange={setDate} max={today}/>

      {/* Notas */}
      <div className="modal-section">Notas</div>
      <div className="form-group" style={{ marginBottom:0 }}>
        <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
          <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
          <textarea className="form-input" rows={2}
            placeholder="Observaciones adicionales…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize:'vertical', minHeight:56, fontFamily:'inherit', border:'none' }}
          />
        </div>
      </div>
    </Modal>
  )
}
```

## File: src/components/VaccineDetailModal.tsx
```typescript
import { useState } from 'react'
import type { VaccineRecord } from '../hooks/usePets'

interface Props {
  vaccine:  (VaccineRecord & { cls: 'ok' | 'soon' | 'late'; petName: string; petEmoji: string }) | null
  onClose:  () => void
  onEdit:   (v: VaccineRecord) => void
  onMarkApplied: (v: VaccineRecord, appliedDate: string, nextDate: string) => void
}

const STATUS_LABEL: Record<string, string> = { ok: 'Al día', soon: 'Por vencer', late: 'Vencida' }
const STATUS_CLASS: Record<string, string> = { ok: 'ok', soon: 'soon', late: 'late' }

export default function VaccineDetailModal({ vaccine, onClose, onEdit, onMarkApplied }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [markMode,   setMarkMode]   = useState(false)
  const [appliedDate, setAppliedDate] = useState(today)
  const [nextDate,   setNextDate]   = useState('')
  const [nextErr,    setNextErr]    = useState('')

  if (!vaccine) return null
  const { cls } = vaccine

  const handleApply = () => {
    if (!nextDate) { setNextErr('Indica la próxima dosis'); return }
    if (nextDate <= appliedDate) { setNextErr('Debe ser posterior a la aplicación'); return }
    onMarkApplied(vaccine, appliedDate, nextDate)
    onClose()
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="detail-header">
          <div className="detail-icon" style={{
            background: cls === 'ok' ? 'var(--success-hl)' : cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
            color:      cls === 'ok' ? 'var(--success)'    : cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
            fontSize: '1.5rem',
          }}>💉</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{vaccine.name}</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
              {vaccine.petEmoji} {vaccine.petName}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="detail-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1rem' }}>
            <span className={`status-pill ${STATUS_CLASS[cls]}`}>
              {cls === 'ok' ? '✓' : cls === 'soon' ? '⚠' : '✕'} {STATUS_LABEL[cls]}
            </span>
            <span className={`badge ${vaccine.badgeCls}`}>{vaccine.badge}</span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Última aplicación</div>
              <div className="detail-info-value">{vaccine.applied}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Próxima dosis</div>
              <div className="detail-info-value" style={{ color: cls === 'late' ? 'var(--err)' : cls === 'soon' ? 'var(--warn)' : 'var(--success)' }}>
                {new Date(vaccine.nextDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Mark as applied form */}
          {markMode && (
            <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)', borderRadius: 'var(--r-xl)', padding: '1rem', marginTop: '.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--success)', marginBottom: '.75rem' }}>
                ✓ Registrar aplicación
              </div>
              <div className="detail-date-row">
                <label>Aplicada el</label>
                <input type="date" value={appliedDate}
                  onChange={e => setAppliedDate(e.target.value)}
                  max={today}/>
              </div>
              <div className="detail-date-row">
                <label>Próxima dosis</label>
                <input type="date" value={nextDate}
                  onChange={e => { setNextDate(e.target.value); setNextErr('') }}
                  min={appliedDate}
                  style={{ borderColor: nextErr ? 'var(--err)' : undefined }}/>
              </div>
              {nextErr && <div style={{ fontSize: '.75rem', color: 'var(--err)', fontWeight: 700, marginTop: '.25rem' }}>{nextErr}</div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="detail-footer">
          {!markMode ? (
            <>
              <button className="btn btn-secondary" onClick={() => { onEdit(vaccine); onClose() }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
                Editar
              </button>
              <button className="btn btn-success" onClick={() => setMarkMode(true)}>
                💉 Marcar aplicada
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-success" onClick={handleApply}>✓ Confirmar aplicación</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

## File: src/context/CaresContext.tsx
```typescript
import {
  createContext, useContext, useState, useCallback, useEffect, type ReactNode,
} from 'react'
import type { CareEditData } from '../components/EditCareModal'
import { petsApi, caresApi } from '../api'
import type { ApiCare } from '../api'

export interface CareItem {
  id: string; petId: string; emoji: string; title: string; sub: string
  total: number; period: string; intervalDays: number; startDate: string
  quantity: string; notify: boolean; time: string; recurring: boolean
  bg: string; doneByDate: Record<string, { done: number; doneState: boolean }>
}

type NewCareItem = Omit<CareItem, 'id' | 'doneByDate'> & { id?: string; doneByDate?: CareItem['doneByDate'] }

interface CaresContextValue {
  items:           CareItem[]
  loading:         boolean
  error:           string | null
  setCareProgress: (id: string, dateStr: string, done: number, doneState: boolean) => void
  editCare:        (care: CareItem) => void
  updateCare:      (updated: CareEditData) => void
  deleteCare:      (id: string) => void
  addCare:         (item: NewCareItem) => void
}

export function getDueDatesInRange(care: CareItem, fromStr: string, toStr: string): string[] {
  const result: string[] = []
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  const to    = new Date(toStr          + 'T12:00:00')
  let cur = new Date(start)
  while (cur < from) cur.setDate(cur.getDate() + care.intervalDays)
  while (cur <= to) { result.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + care.intervalDays) }
  return result
}

export function isDueOnDate(care: CareItem, dateStr: string): boolean {
  if (care.intervalDays <= 1) return true
  return getDueDatesInRange(care, dateStr, dateStr).length > 0
}

export function getNextDueDate(care: CareItem, fromStr: string): string {
  if (care.intervalDays <= 1) return fromStr
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  let cur = new Date(start)
  while (cur <= from) cur.setDate(cur.getDate() + care.intervalDays)
  return cur.toISOString().split('T')[0]
}

function periodToInterval(p: string) { return p === 'week' ? 7 : p === 'month' ? 30 : 1 }
function resolveIntervalDays(u: CareEditData): number {
  if (u.period === 'custom' && u.intervalDays != null) return Math.max(2, Number(u.intervalDays) || 2)
  return periodToInterval(u.period ?? 'day')
}
function buildSub(u: CareEditData): string {
  const xd = u.intervalDays ?? 2
  const freq = u.period === 'day' ? 'al día' : u.period === 'week' ? 'por semana' : u.period === 'month' ? 'por mes' : `cada ${xd} día${xd !== 1 ? 's' : ''}`
  return `${u.total} ${freq}${u.quantity?.trim() ? ` · ${u.quantity.trim()}` : ''}`
}

const CARE_EMOJI: Record<string, string> = { food:'🍽️', water:'💧', walk:'🦮', bath:'🛁', brush:'🪮', medication:'💊', other:'🐾' }
const CARE_BG:   Record<string, string>  = { food:'linear-gradient(135deg,#FFF3DC,#FFE0A0)', water:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', walk:'linear-gradient(135deg,#E8FFE8,#B8F0B8)', bath:'linear-gradient(135deg,#E0F8FF,#A8DCFF)', brush:'linear-gradient(135deg,#F0E8FF,#DDD0FF)', other:'linear-gradient(135deg,#F5F5F5,#E0E0E0)' }

const today = new Date().toISOString().split('T')[0]

function mapApiCare(c: ApiCare, petId: string): CareItem {
  return {
    id: c.id, petId,
    emoji:       CARE_EMOJI[c.type ?? 'other'] ?? '🐾',
    title:       c.name,
    sub:         `${c.frequency ?? 1} al día`,
    total:       typeof c.frequency === 'number' ? c.frequency : 1,
    period:      'day', intervalDays: 1,
    startDate:   c.createdAt?.split('T')[0] ?? today,
    quantity:    c.notes ?? '', notify: true, time: c.time ?? '', recurring: true,
    bg:          CARE_BG[c.type ?? 'other'] ?? CARE_BG.other,
    doneByDate:  {},
  }
}

const CaresContext = createContext<CaresContextValue | null>(null)

export function CaresProvider({ children }: { children: ReactNode }) {
  const [items,   setItems]   = useState<CareItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    petsApi.getAll()
      .then(async res => {
        const pets = res.data
        const results = await Promise.all(
          pets.map(p =>
            caresApi.getAll(p.id)
              .then(r => r.data.map(c => mapApiCare(c, p.id)))
              .catch(() => [] as CareItem[])
          )
        )
        if (cancelled) return
        setItems(results.flat())
      })
      .catch(err => { if (!cancelled) setError(err?.message ?? 'Error al cargar cuidados') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  const setCareProgress = useCallback((id: string, dateStr: string, done: number, doneState: boolean) =>
    setItems(prev => prev.map(c => c.id !== id ? c : { ...c, doneByDate: { ...c.doneByDate, [dateStr]: { done, doneState } } })), [])

  const editCare   = useCallback((care: CareItem) =>
    setItems(prev => prev.map(c => c.id !== care.id ? c : { ...c, ...care })), [])

  const updateCare = useCallback((u: CareEditData) =>
    setItems(prev => prev.map(c => c.id !== u.id ? c : {
      ...c, emoji: u.emoji, title: u.title, total: Math.max(1, Number(u.total)),
      period: u.period ?? 'day', intervalDays: resolveIntervalDays(u),
      quantity: u.quantity ?? '', notify: u.notify ?? true, time: u.time ?? c.time,
      recurring: u.recurring ?? c.recurring, sub: buildSub(u), bg: u.bg ?? c.bg,
    })), [])

  const deleteCare = useCallback((id: string) =>
    setItems(prev => prev.filter(c => c.id !== id)), [])

  const addCare = useCallback((item: NewCareItem) =>
    setItems(prev => [...prev, {
      ...item,
      id:         item.id         ?? `care-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      doneByDate: item.doneByDate ?? {},
    }]), [])

  return (
    <CaresContext.Provider value={{ items, loading, error, setCareProgress, editCare, updateCare, deleteCare, addCare }}>
      {children}
    </CaresContext.Provider>
  )
}

export function useCares() {
  const ctx = useContext(CaresContext)
  if (!ctx) throw new Error('useCares must be used inside <CaresProvider>')
  return ctx
}

export function usePetCares(petId: string): CareItem[] {
  const { items } = useCares()
  return items.filter(c => c.petId === petId)
}
```

## File: src/context/MedicationsContext.tsx
```typescript
// traduzido e sem mock

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord }  from '../components/EditMedModal'
import { petsApi, medicationsApi } from '../api'
import type { ApiMedication } from '../api'

const PET_SPECIES_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

function mapApiMed(
  m: ApiMedication & { petId: string; petName?: string; petSpecies?: string }
): MedRecord {
  return {
    id:        m.id,
    icon:      '💊',
    // ✅ título só com nome do medicamento — sem nome da pet embutido
    title:     m.name,
    dose:      m.dosage    ?? '',
    frequency: m.frequency ?? '',
    startDate: m.startDate ?? '',
    endDate:   m.endDate   ?? '',
    notes:     m.notes     ?? '',
    // ✅ petId guardado directamente no MedRecord
    petId:     m.petId,
    bg:        'var(--warn-hl)',
    color:     'var(--warn)',
    // badge e badgeCls calculados pelo estado archived — sem strings ES
    badge:     '',
    badgeCls:  'badge-green',
    archived:  false,
  }
}

type MedicationsContextValue = {
  medications:                 MedRecord[]
  active:                      MedRecord[]
  history:                     MedRecord[]
  loading:                     boolean
  error:                       string | null
  addMedication:               (data: AddMedData) => MedRecord
  updateMedication:            (updated: MedRecord) => void
  deleteMedication:            (id: string) => void
  archiveMedication:           (id: string) => void
  unarchiveMedication:         (id: string) => void
  markMedicationAdministered:  (med: MedRecord, date: string, locale: string) => string
  getMedicationById:           (id: string) => MedRecord | undefined
  getMedicationsByPetId:       (petId: string) => MedRecord[]
  getActiveMedicationsByPetId: (petId: string) => MedRecord[]
}

const MedicationsContext = createContext<MedicationsContextValue | null>(null)

export function MedicationsProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<MedRecord[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    petsApi.getAll()
      .then(async res => {
        const pets = res.data
        const results = await Promise.all(
          pets.map(p =>
            medicationsApi.getAll(p.id)
              .then(r => r.data.map(m => ({
                ...m,
                petId:      p.id,
                petName:    p.name,
                petSpecies: p.species,
              })))
              .catch(() => [])
          )
        )
        if (cancelled) return
        setMedications(results.flat().map(m => mapApiMed(m as ApiMedication & { petId: string; petName: string; petSpecies: string })))
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          // ✅ mensagem da API — sem hardcode ES
          const msg = err instanceof Error ? err.message : String(err)
          setError(msg || null)
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  const active  = useMemo(() => medications.filter(m => !m.archived), [medications])
  const history = useMemo(() => medications.filter(m =>  m.archived), [medications])

  const addMedication = useCallback((data: AddMedData): MedRecord => {
    const petEmoji = PET_SPECIES_EMOJI[data.petSpecies ?? ''] ?? '🐾'
    const newMed: MedRecord = {
      id:        `m-${Date.now()}`,
      icon:      petEmoji,
      // ✅ título limpo — sem nome da pet embutido
      title:     data.name,
      dose:      data.dose,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate:   data.endDate,
      notes:     data.notes,
      // ✅ petId no MedRecord — sem petIdMap externo
      petId:     data.petId,
      bg:        'var(--warn-hl)',
      color:     'var(--warn)',
      badge:     '',
      badgeCls:  'badge-green',
      archived:  false,
    }
    setMedications(prev => [newMed, ...prev])
    return newMed
  }, [])

  const updateMedication = useCallback((u: MedRecord) =>
    setMedications(p => p.map(m => m.id === u.id ? u : m)), [])

  const deleteMedication = useCallback((id: string) =>
    setMedications(p => p.filter(m => m.id !== id)), [])

  // ✅ badge/badgeCls sem strings ES — deixa vazio para ser traduzido no render
  const archiveMedication = useCallback((id: string) =>
    setMedications(p => p.map(m => m.id === id
      ? { ...m, archived: true,  badgeCls: 'badge-gray'  }
      : m
    )), [])

  const unarchiveMedication = useCallback((id: string) =>
    setMedications(p => p.map(m => m.id === id
      ? { ...m, archived: false, badgeCls: 'badge-green' }
      : m
    )), [])

  // ✅ locale passado pelo chamador — sem 'es-ES' hardcoded
  const markMedicationAdministered = useCallback(
    (_med: MedRecord, date: string, locale: string) =>
      new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
    []
  )

  const getMedicationById = useCallback(
    (id: string) => medications.find(m => m.id === id),
    [medications]
  )

  // ✅ usa m.petId directamente — sem petIdMap
  const getMedicationsByPetId = useCallback(
    (petId: string) => medications.filter(m => m.petId === petId),
    [medications]
  )

  const getActiveMedicationsByPetId = useCallback(
    (petId: string) => medications.filter(m => !m.archived && m.petId === petId),
    [medications]
  )

  const value = useMemo(() => ({
    medications, active, history, loading, error,
    addMedication, updateMedication, deleteMedication,
    archiveMedication, unarchiveMedication, markMedicationAdministered,
    getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId,
  }), [
    medications, active, history, loading, error,
    addMedication, updateMedication, deleteMedication,
    archiveMedication, unarchiveMedication, markMedicationAdministered,
    getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId,
  ])

  return <MedicationsContext.Provider value={value}>{children}</MedicationsContext.Provider>
}

export function useMedications() {
  const ctx = useContext(MedicationsContext)
  if (!ctx) throw new Error('useMedications must be used within MedicationsProvider')
  return ctx
}
```

## File: src/context/PitutiContext.tsx
```typescript
// sem mock

import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { PetWithAlerts } from '../hooks/usePets'
import { petsApi } from '../api'

export type Theme = 'light' | 'dark'

export interface CareEntry {
  id: string; petId: string; emoji: string; label: string; total: number; done: number
}

export interface PitutiState {
  pets:         PetWithAlerts[]
  petsLoading:  boolean
  petsError:    string | null
  theme:        Theme
  toastMessage: string
  toastType:    'success' | 'err'
  toastVisible: boolean
  cares:        CareEntry[]
}

type Action =
  | { type: 'SET_PETS';         payload: PetWithAlerts[] }
  | { type: 'SET_PETS_LOADING'; payload: boolean }
  | { type: 'SET_PETS_ERROR';   payload: string | null }
  | { type: 'ADD_PET';          payload: PetWithAlerts }
  | { type: 'REMOVE_PET';       payload: string }
  | { type: 'SET_THEME';        payload: Theme }
  | { type: 'SHOW_TOAST';       payload: { message: string; kind: 'success' | 'err' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_CARE_DONE';    payload: { id: string; done: number } }
  | { type: 'SET_CARES';        payload: CareEntry[] }

const initialState: PitutiState = {
  pets: [], petsLoading: true, petsError: null,
  theme: (localStorage.getItem('pituti-theme') as Theme) ?? 'light',
  toastMessage: '', toastType: 'success', toastVisible: false,
  cares: [],
}

function reducer(state: PitutiState, action: Action): PitutiState {
  switch (action.type) {
    case 'SET_PETS':         return { ...state, pets: action.payload }
    case 'SET_PETS_LOADING': return { ...state, petsLoading: action.payload }
    case 'SET_PETS_ERROR':   return { ...state, petsError: action.payload }
    case 'ADD_PET':          return { ...state, pets: [action.payload, ...state.pets] }
    case 'REMOVE_PET':       return { ...state, pets: state.pets.filter(p => p.id !== action.payload) }
    case 'SET_THEME':        return { ...state, theme: action.payload }
    case 'SHOW_TOAST':       return { ...state, toastMessage: action.payload.message, toastType: action.payload.kind, toastVisible: true }
    case 'HIDE_TOAST':       return { ...state, toastVisible: false }
    case 'SET_CARE_DONE':    return { ...state, cares: state.cares.map(c => c.id === action.payload.id ? { ...c, done: action.payload.done } : c) }
    case 'SET_CARES':        return { ...state, cares: action.payload }
    default:                 return state
  }
}

interface PitutiContextValue {
  state:       PitutiState
  addPet:      (pet: PetWithAlerts) => void
  removePet:   (id: string) => void
  refetchPets: () => void
  toggleTheme: () => void
  showToast:   (message: string, kind?: 'success' | 'err') => void
  hideToast:   () => void
  setCaredone: (id: string, done: number) => void
}

const PitutiContext = createContext<PitutiContextValue | null>(null)

export function PitutiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const loadPets = useCallback(() => {
    dispatch({ type: 'SET_PETS_LOADING', payload: true })
    dispatch({ type: 'SET_PETS_ERROR',   payload: null })
    petsApi.getAll()
      .then(res => {
        dispatch({ type: 'SET_PETS',         payload: res.data as unknown as PetWithAlerts[] })
        dispatch({ type: 'SET_PETS_LOADING', payload: false })
      })
      .catch((err: unknown) => {
        // ✅ API falhou — lista fica vazia, sem MOCK_PETS como fallback
        dispatch({ type: 'SET_PETS',         payload: [] })
        // ✅ mensagem de erro vem da API — sem hardcode
        const message = err instanceof Error ? err.message : String(err)
        dispatch({ type: 'SET_PETS_ERROR',   payload: message || null })
        dispatch({ type: 'SET_PETS_LOADING', payload: false })
      })
  }, [])

  useEffect(() => { loadPets() }, [loadPets])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('pituti-theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    if (!state.toastVisible) return
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3200)
    return () => clearTimeout(t)
  }, [state.toastVisible, state.toastMessage])

  const addPet      = useCallback((pet: PetWithAlerts) => dispatch({ type: 'ADD_PET',    payload: pet }), [])
  const removePet   = useCallback((id: string)          => dispatch({ type: 'REMOVE_PET', payload: id  }), [])
  const refetchPets = useCallback(() => loadPets(), [loadPets])
  const toggleTheme = useCallback(() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' }), [state.theme])
  const showToast   = useCallback((message: string, kind: 'success' | 'err' = 'success') => dispatch({ type: 'SHOW_TOAST', payload: { message, kind } }), [])
  const hideToast   = useCallback(() => dispatch({ type: 'HIDE_TOAST' }), [])
  const setCaredone = useCallback((id: string, done: number) => dispatch({ type: 'SET_CARE_DONE', payload: { id, done } }), [])

  return (
    <PitutiContext.Provider value={{ state, addPet, removePet, refetchPets, toggleTheme, showToast, hideToast, setCaredone }}>
      {children}
    </PitutiContext.Provider>
  )
}

export function usePituti() {
  const ctx = useContext(PitutiContext)
  if (!ctx) throw new Error('usePituti deve ser usado dentro de <PitutiProvider>')
  return ctx
}

export const usePets     = () => { const { state, refetchPets } = usePituti(); return { pets: state.pets, loading: state.petsLoading, error: state.petsError, refetch: refetchPets } }
export const useTheme    = () => { const { state, toggleTheme } = usePituti(); return { theme: state.theme, toggleTheme } }
export const useCares    = () => { const { state, setCaredone } = usePituti(); return { cares: state.cares, setCaredone } }
export const useAppToast = () => { const { showToast } = usePituti(); return showToast }
```

## File: src/context/SymptomsContext.tsx
```typescript
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { petsApi, symptomsApi } from '../api'
import type { ApiSymptom } from '../api'

export interface SymptomEntry {
  id: string; petId: string; description: string; category: string
  severity: string; date: string; notes: string; resolved: boolean
}

interface SymptomsContextValue {
  symptoms:    SymptomEntry[]
  loading:     boolean
  error:       string | null
  refetch:     () => void
  addSymptom:  (s: Omit<SymptomEntry, 'id'>) => void
  saveSymptom: (s: SymptomEntry) => void
  resolve:     (id: string) => void
  unresolve:   (id: string) => void
}

const SymptomsContext = createContext<SymptomsContextValue | null>(null)

const SEVERITY_MAP: Record<string, string> = { mild: 'leve', moderate: 'moderado', severe: 'grave' }

function mapApiSymptom(s: ApiSymptom, petId: string): SymptomEntry {
  return {
    id:          s.id,
    petId,
    description: s.description,
    category:    (s as any).category ?? 'general',
    severity:    SEVERITY_MAP[s.severity] ?? s.severity,
    date:        s.date ?? s.createdAt?.split('T')[0] ?? '',
    notes:       s.notes ?? '',
    resolved:    s.resolved ?? false,
  }
}

export function SymptomsProvider({ children }: { children: ReactNode }) {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [tick,     setTick]     = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    petsApi.getAll()
      .then(async res => {
        const pets = res.data
        const results = await Promise.all(
          pets.map(p =>
            symptomsApi.getAll(p.id)
              .then(r => r.data.map(s => mapApiSymptom(s, p.id)))
              .catch(() => [] as SymptomEntry[])
          )
        )
        if (cancelled) return
        setSymptoms(results.flat())
      })
      .catch(err => { if (!cancelled) setError(err?.message ?? 'Error al cargar síntomas') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [tick])

  const addSymptom  = useCallback((s: Omit<SymptomEntry, 'id'>) =>
    setSymptoms(prev => [...prev, { ...s, id: `s-${Date.now()}` }]), [])
  const saveSymptom = useCallback((updated: SymptomEntry) =>
    setSymptoms(prev => prev.map(s => s.id === updated.id ? updated : s)), [])
  const resolve     = useCallback((id: string) =>
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, resolved: true  } : s)), [])
  const unresolve   = useCallback((id: string) =>
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, resolved: false } : s)), [])

  return (
    <SymptomsContext.Provider value={{ symptoms, loading, error, refetch, addSymptom, saveSymptom, resolve, unresolve }}>
      {children}
    </SymptomsContext.Provider>
  )
}

export function useSymptoms() {
  const ctx = useContext(SymptomsContext)
  if (!ctx) throw new Error('useSymptoms must be used within <SymptomsProvider>')
  return ctx
}

export function usePetSymptoms(petId: string) {
  const { symptoms } = useSymptoms()
  return {
    active:   symptoms.filter(s => s.petId === petId && !s.resolved),
    resolved: symptoms.filter(s => s.petId === petId &&  s.resolved),
    all:      symptoms.filter(s => s.petId === petId),
  }
}
```

## File: src/context/VetContext.tsx
```typescript
import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react'
import { vetsApi, appointmentsApi } from '../api'
import type { ApiVet, ApiAppointment } from '../api'

export { CONDITIONS_CATALOG } from './conditionsCatalog'
export type { ConditionItem }  from './conditionsCatalog'

export interface Surgery { id: string; name: string; date?: string; notes?: string }

export interface PetMedicalProfile {
  petId: string; sex?: 'male' | 'female'; neutered?: boolean; neuteredAge?: string
  bloodType?: string; allergies?: string; chronicConditionIds: string[]
  customConditions: string[]; surgeries: Surgery[]; behavioralNotes?: string
  environment?: 'apartment' | 'house' | 'both'; livingWithAnimals?: boolean
  parasiteControl?: string; vetQuestions?: string; updatedAt?: string
}

export type VetType = 'primary' | 'specialist' | 'emergency' | 'other'

export interface VetContact {
  id: string; name: string; clinic: string; type: VetType
  specialty?: string; phone: string; phone2?: string
  address?: string; notes?: string; petIds: string[]; createdAt: string
}

export type AppointmentType = 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other'

export interface VetAppointment {
  id: string; petId: string; vetContactId?: string; vetName: string
  clinic?: string; date: string; time?: string; type: AppointmentType
  reason: string; diagnosis?: string; treatment?: string
  nextAppointmentDate?: string; nextAppointmentNote?: string
  weightKg?: number; costBrl?: number; notes?: string; createdAt: string
}

export interface VetCalendarDate { date: string; petId: string; label: string; kind: 'past' | 'next' }

interface VetContextValue {
  getMedicalProfile:  (petId: string) => PetMedicalProfile
  saveMedicalProfile: (profile: PetMedicalProfile) => void
  vets:               VetContact[]
  addVet:             (v: Omit<VetContact, 'id' | 'createdAt'>) => void
  updateVet:          (v: VetContact) => void
  deleteVet:          (id: string) => void
  appointments:       VetAppointment[]
  addAppointment:     (a: Omit<VetAppointment, 'id' | 'createdAt'>) => void
  updateAppointment:  (a: VetAppointment) => void
  deleteAppointment:  (id: string) => void
  vetCalendarDates:   VetCalendarDate[]
  loading:            boolean
  error:              string | null
  refetch:            () => void
}

const VetContext = createContext<VetContextValue | null>(null)

function buildDefaultProfile(petId: string): PetMedicalProfile {
  return { petId, chronicConditionIds: [], customConditions: [], surgeries: [] }
}

export function VetProvider({ children }: { children: ReactNode }) {
  const [profiles,     setProfiles]     = useState<Record<string, PetMedicalProfile>>({})
  const [vets,         setVets]         = useState<VetContact[]>([])
  const [appointments, setAppointments] = useState<VetAppointment[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [tick,         setTick]         = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    vetsApi.getAll()
      .then(async res => {
        if (cancelled) return
        setVets(res.data as unknown as VetContact[])
        const results = await Promise.all(
          (res.data as ApiVet[]).map(v =>
            appointmentsApi.getAll(v.id)
              .then(r => r.data as unknown as VetAppointment[])
              .catch(() => [] as VetAppointment[])
          )
        )
        if (!cancelled) setAppointments(results.flat())
      })
      .catch(err => { if (!cancelled) setError(err?.message ?? 'Error al cargar veterinarios') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [tick])

  const getMedicalProfile  = useCallback((petId: string) => profiles[petId] ?? buildDefaultProfile(petId), [profiles])
  const saveMedicalProfile = useCallback((profile: PetMedicalProfile) =>
    setProfiles(prev => ({ ...prev, [profile.petId]: { ...profile, updatedAt: new Date().toISOString() } })), [])

  const addVet    = useCallback((data: Omit<VetContact, 'id' | 'createdAt'>) =>
    setVets(prev => [...prev, { ...data, id: `vet-${Date.now()}`, createdAt: new Date().toISOString() }]), [])
  const updateVet = useCallback((vet: VetContact) =>
    setVets(prev => prev.map(v => v.id === vet.id ? vet : v)), [])
  const deleteVet = useCallback((id: string) =>
    setVets(prev => prev.filter(v => v.id !== id)), [])

  const addAppointment    = useCallback((data: Omit<VetAppointment, 'id' | 'createdAt'>) =>
    setAppointments(prev => [...prev, { ...data, id: `apt-${Date.now()}`, createdAt: new Date().toISOString() }]), [])
  const updateAppointment = useCallback((appt: VetAppointment) =>
    setAppointments(prev => prev.map(a => a.id === appt.id ? appt : a)), [])
  const deleteAppointment = useCallback((id: string) =>
    setAppointments(prev => prev.filter(a => a.id !== id)), [])

  const vetCalendarDates = useMemo<VetCalendarDate[]>(() => {
    const result: VetCalendarDate[] = []
    for (const appt of appointments) {
      result.push({ date: appt.date, petId: appt.petId, label: appt.reason, kind: 'past' })
      if (appt.nextAppointmentDate)
        result.push({ date: appt.nextAppointmentDate, petId: appt.petId, label: appt.nextAppointmentNote ?? 'Retorno programado', kind: 'next' })
    }
    return result
  }, [appointments])

  return (
    <VetContext.Provider value={{
      getMedicalProfile, saveMedicalProfile,
      vets, addVet, updateVet, deleteVet,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      vetCalendarDates, loading, error, refetch,
    }}>
      {children}
    </VetContext.Provider>
  )
}

export function useVet() {
  const ctx = useContext(VetContext)
  if (!ctx) throw new Error('useVet must be used inside VetProvider')
  return ctx
}
```

## File: src/hooks/useApi.ts
```typescript
import { useState, useEffect, useCallback } from 'react'
import type { ApiResponse } from '../api/client'

interface UseApiState<T> {
  data:    T | null
  loading: boolean
  error:   string | null
}

export function useApi<T>(fetcher: () => Promise<ApiResponse<T>>) {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null })

  const execute = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }))
    fetcher()
      .then(res => setState({ data: res.data, loading: false, error: null }))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        setState({ data: null, loading: false, error: msg })
      })
  }, [fetcher])

  useEffect(() => { execute() }, [execute])

  return { ...state, refetch: execute }
}
```

## File: src/hooks/useApiMutation.ts
```typescript
import { useState, useCallback } from 'react'
import type { ApiResponse } from '../api/client'

interface MutationState<T> {
  data:    T | null
  loading: boolean
  error:   string | null
}

export function useApiMutation<TArgs extends unknown[], TResult>(
  mutationFn: (...args: TArgs) => Promise<ApiResponse<TResult>>
) {
  const [state, setState] = useState<MutationState<TResult>>({ data: null, loading: false, error: null })

  const mutate = useCallback(async (...args: TArgs) => {
    setState({ data: null, loading: true, error: null })
    try {
      const res = await mutationFn(...args)
      setState({ data: res.data, loading: false, error: null })
      return res.data
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setState({ data: null, loading: false, error: msg })
      throw new Error(msg)
    }
  }, [mutationFn])

  return { ...state, mutate }
}
```

## File: src/pages/NotFoundPage.tsx
```typescript
// traduzido


import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const t            = useTranslation

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font)',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', lineHeight: 1 }}>🐾</div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
        404
      </h1>

      <p style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
        t('notFound.title')
      </p>

      <p style={{
        fontSize: '.875rem',
        color: 'var(--text-muted)',
        maxWidth: 320,
        margin: 0,
      }}>
        t('notFound.hint.replace('n', pathname)')
      </p>

      <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          t('nav.dashboard')
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← t('btn.back')
        </button>
      </div>
    </div>
  )
}
```

## File: src/pages/VetPage.tsx
```typescript
// traduzido e sem mock
import { useMemo, useState } from 'react';
import { SPECIESEMOJI } from '../hooks/usePets';
import { usePetsContext } from '../context/PetsContext';       
import { useVet, CONDITIONS_CATALOG, type PetMedicalProfile, type VetContact, type VetAppointment } from '../context/VetContext';
import { VET_TYPES } from '../components/AddEditVetModal';
import { APPOINTMENT_TYPES } from '../components/AddEditAppointmentModal';
import AddEditVetModal from '../components/AddEditVetModal';
import AddEditAppointmentModal from '../components/AddEditAppointmentModal';
import PetMedicalProfileModal from '../components/PetMedicalProfileModal';
import BackButton from '../components/BackButton';
import { showToast } from '../components/AppLayout';
import { useTranslation } from 'react-i18next';

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

  const conditionLabels = profile.chronicConditionIds.map(
    (id) => CONDITIONS_CATALOG.find((item) => item.id === id)?.label ?? id,
  )
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
```

## File: src/styles/responsive.css
```css
/* ════════════════════════════════════════════════════════════
   RESPONSIVE.CSS  —  Pituti
   Order: largest → smallest breakpoint.
   ════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════
   CSS CUSTOM PROPERTIES (global — no query needed)
   ════════════════════════════════════════════════════════════ */
:root {
  --mobile-bottom-nav-h: 64px;
  --topbar-h:            60px;
  --sidebar-w:           224px;
  --sidebar-collapsed-w: 64px;
}


/* ════════════════════════════════════════════════════════════
   GLOBAL CLASSES (always visible, toggled by JS)
   ════════════════════════════════════════════════════════════ */

/* Mobile hamburger button — hidden on desktop, shown via media query below */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  background: rgba(255,255,255,.1);
  border: 1.5px solid rgba(255,255,255,.15);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--trans);
}
.mobile-menu-btn:hover { background: rgba(255,255,255,.18); }

/* Mobile sidebar header (close button row) */
.sidebar-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.125rem .875rem;
  border-bottom: 1.5px solid var(--nav-hover);
  margin-bottom: .5rem;
}
.sidebar-mobile-close {
  width: 36px; height: 36px;
  border-radius: var(--r-md);
  background: rgba(255,255,255,.1);
  border: none;
  color: var(--nav-text-active);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background var(--trans);
}
.sidebar-mobile-close:hover { background: rgba(255,255,255,.2); }

/* Sidebar backdrop overlay */
.mobile-sidebar-backdrop {
  display: none;
  position: fixed; inset: 0;
  z-index: 149;
  background: rgba(16,12,36,.55);
  backdrop-filter: blur(4px);
  animation: pm-fade-in 160ms ease both;
}

/* Mobile bottom navigation bar */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--mobile-bottom-nav-h);
  background: var(--nav-bg);
  border-top: 1.5px solid var(--nav-hover);
  padding: 0 .25rem env(safe-area-inset-bottom, 0);
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4px 20px rgba(42,52,98,.25);
}
.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .25rem;
  flex: 1;
  height: 100%;
  padding: .375rem .25rem;
  color: var(--nav-text);
  text-decoration: none;
  border-radius: var(--r-md);
  transition: color var(--trans), background var(--trans);
  min-width: 44px;
  min-height: 44px;
}
.mobile-nav-item.active { color: var(--nav-text-active); }
.mobile-nav-item.active .mobile-nav-icon {
  background: var(--nav-active);
  border-radius: var(--r-md);
}
.mobile-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 26px;
  border-radius: var(--r-sm);
  transition: background var(--trans);
}
.mobile-nav-label {
  font-size: .6rem;
  font-weight: 700;
  text-align: center;
  line-height: 1;
  max-width: 56px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: TABLET  ≤ 1024px
   Collapsed sidebar (icon-only)
   ════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  :root { --sidebar-w: 64px; }

  .sidebar { width: 64px; }
  .sidebar .nav-label,
  .sidebar .nav-badge,
  .sidebar .sidebar-section-label,
  .sidebar .sidebar-toggle .nav-label { display: none; }
  .sidebar .nav-item { justify-content: center; padding: .625rem; }
  .sidebar .sidebar-section-label { display: none; }

  .main { padding: 1.5rem 1.25rem; }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: CALENDAR / VET LAYOUT  ≤ 980px
   Stack grid columns to single column
   ════════════════════════════════════════════════════════════ */
@media (max-width: 980px) {
  /* Calendar two-column layout → single column */
  .cal-layout {
    grid-template-columns: 1fr;
  }
  .cal-detail {
    position: static;
  }

  /* Alert banner → stack pills */
  .alert-banner {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .alert-banner__aside,
  .alert-banner__warn {
    justify-self: start;
    text-align: left;
    max-width: none;
    white-space: normal;
  }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: DASHBOARD GRID TABLET  ≤ 900px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .dash-mockup-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "left   center"
      "left   events"
      "right  right";
  }

  /* Generic grid helpers */
  .grid-4, .grid-3 { grid-template-columns: repeat(2, 1fr); }
  .grid-2           { grid-template-columns: 1fr; }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: SETTINGS  ≤ 860px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 860px) {
  .settings-layout { grid-template-columns: 1fr; }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: MOBILE  ≤ 768px
   Full mobile layout — bottom nav, drawer sidebar, paw (240px)
   ════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {

  /* ── App shell ── */
  .app {
    grid-template-columns: 1fr !important;
    grid-template-rows: var(--topbar-h) 1fr !important;
    grid-template-areas: "topbar" "main" !important;
  }

  /* ── Sidebar → off-canvas drawer ── */
  .sidebar {
    position: fixed !important;
    top: 0; left: 0; bottom: 0;
    z-index: 150;
    width: 280px !important;
    transform: translateX(-100%);
    transition: transform 280ms cubic-bezier(.16,1,.3,1), box-shadow 280ms;
    box-shadow: none;
    overflow-y: auto;
  }
  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 40px rgba(16,12,36,.35);
  }

  /* Restore full labels inside the mobile drawer */
  .sidebar .nav-label           { display: inline !important; }
  .sidebar .nav-badge           { display: inline-flex !important; }
  .sidebar .sidebar-section-label { display: block !important; }
  .sidebar .nav-item            { justify-content: flex-start !important; padding: .75rem 1rem !important; }
  .sidebar .sidebar-toggle      { display: none; }

  /* Show mobile-only elements */
  .mobile-menu-btn         { display: flex; }
  .mobile-bottom-nav       { display: flex; }
  .mobile-sidebar-backdrop { display: block; }
  .sidebar-mobile-header   { display: flex; }

  /* ── Topbar ── */
  .topbar { padding: 0 1rem; gap: .5rem; }
  .topbar-search { display: none; }
  .topbar-logo .pituti-anim-wrap { display: flex !important; width: auto !important; opacity: 1 !important; }

  /* ── Main content area ── */
  .main {
    padding: 1rem .875rem calc(var(--mobile-bottom-nav-h) + 1rem) !important;
    margin: 0 !important;
  }

  /* ── Page headers ── */
  .page-header {
    flex-direction: column;
    gap: .875rem;
    margin-bottom: 1.25rem;
  }
  .page-header .btn { align-self: flex-start; width: 100%; justify-content: center; }

  /* ── Cards ── */
  .card { border-radius: var(--r-lg); padding: .875rem; }
  .card-title { font-size: .875rem; margin-bottom: .75rem; }

  /* ── Dashboard grid ── */
  .dash-mockup-grid {
    grid-template-columns: 1fr !important;
    grid-template-areas: "left" "center" "right" "eventos" !important;
    gap: 1rem;
  }
  .dash-col-left,
  .dash-col-center,
  .dash-col-right,
  .dash-col-eventos { grid-column: 1 !important; }

  /* ── PAW — 240×230px
       Desktop baseline: W=320, H=300, scale ≈ 0.75
       Main: 120px  (164 × 0.75)
       Toe-1,2: 62px (84 × 0.75) — top:8  left/right:51
       Toe-3,4: 56px (76 × 0.75) — top:74 left/right:0
       Geometry verified:
         Main top edge   = 230−120 = 110px
         Toe-3,4 bottom  = 74+56   = 130px  → 20px overlap ✓
         Toe-1,2 center  x = 51+31=82 | x = 240−82=158 (symmetric around 120) ✓
  ── */
  .paw-layout {
    width:  240px !important;
    height: 230px !important;
  }
  .paw-main {
    width:  120px !important;
    height: 120px !important;
    bottom: 0     !important;
    left:   50%   !important;
    transform: translateX(-50%) !important;
  }
  .paw-main:hover {
    transform: translateX(-50%) scale(1.05) !important;
  }

  /* Toe-1,2 (top center pair) */
  .paw-toe-1 {
    width:  62px !important;
    height: 62px !important;
    top:    8px  !important;
    left:   51px !important;
    right:  auto !important;
    bottom: auto !important;
  }
  .paw-toe-2 {
    width:  62px  !important;
    height: 62px  !important;
    top:    8px   !important;
    right:  51px  !important;
    left:   auto  !important;
    bottom: auto  !important;
  }

  /* Toe-3,4 (side pair) */
  .paw-toe-3 {
    width:  56px !important;
    height: 56px !important;
    top:    74px !important;
    left:   0    !important;
    right:  auto !important;
    bottom: auto !important;
  }
  .paw-toe-4 {
    width:  56px !important;
    height: 56px !important;
    top:    74px !important;
    right:  0    !important;
    left:   auto !important;
    bottom: auto !important;
  }

  /* ── Stat row ── */
  .stat-row { grid-template-columns: 1fr 1fr; gap: .5rem; }
  .stat-chip { padding: .625rem; }
  .stat-chip-value { font-size: 1rem !important; }

  /* ── Tabs ── */
  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: .25rem;
    padding-bottom: .25rem;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { white-space: nowrap; padding: .5rem .875rem; font-size: .8125rem; }

  /* ── Modal sheet (slide up from bottom) ── */
  .pm-overlay    { align-items: flex-end !important; padding: 0 !important; }
  .pm-sheet {
    max-width: 100% !important;
    width: 100% !important;
    border-radius: var(--r-xl) var(--r-xl) 0 0 !important;
    max-height: 92dvh;
    animation: sheet-slide-up 240ms cubic-bezier(.16,1,.3,1) both !important;
  }

  /* ── Detail overlay ── */
  .detail-overlay { align-items: flex-end !important; padding: 0 !important; }
  .detail-sheet {
    max-width: 100% !important;
    border-radius: var(--r-xl) var(--r-xl) 0 0 !important;
    animation: sheet-slide-up 240ms cubic-bezier(.16,1,.3,1) both !important;
  }

  /* ── Chip edit overlay ── */
  .chip-edit-overlay { align-items: flex-end !important; padding: 0 !important; }
  .chip-edit-sheet {
    max-width: 100% !important;
    border-radius: var(--r-xl) var(--r-xl) 0 0 !important;
    animation: sheet-slide-up 220ms cubic-bezier(.16,1,.3,1) both !important;
  }

  /* ── Invite / delete overlays ── */
  .invite-sent-overlay,
  .delete-account-overlay { padding: 1rem !important; }
  .invite-sent-card,
  .delete-account-sheet   { max-width: 100% !important; }

  /* ── Pet list / detail ── */
  .pet-card { border-radius: var(--r-lg); }
  .pet-profile-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: .875rem;
    padding: 1rem;
  }
  .pet-photo-circle {
    width: 72px !important;
    height: 72px !important;
    font-size: 2rem !important;
  }

  /* ── Settings ── */
  .settings-layout {
    grid-template-columns: 1fr !important;
    gap: 1rem;
  }
  .settings-profile-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }

  /* ── Pet list toolbar ── */
  .petlist-toolbar     { flex-direction: column; gap: .625rem; }
  .petlist-search-row  { flex-wrap: wrap; }
  .petlist-filter-row  { flex-wrap: wrap; }
  .petlist-sort-row    { flex-wrap: wrap; }

  /* ── Calendar ── */
  .cal-page-toolbar    { flex-direction: column; gap: .625rem; }
  .cal-date-jump       { max-width: 100% !important; }
  .cal-filter-pills    { justify-content: flex-start; }
  .cal-toolbar         { flex-direction: column; align-items: stretch; }
  .cal-filters         { justify-content: flex-start; }
  .cal-grid            { gap: .3rem; }
  .cal-day             { min-height: 52px; padding: .3rem; }

  /* ── Vet / Appt cards ── */
  .profile-grid,
  .vet-card,
  .appt-card,
  .return-banner        { grid-template-columns: 1fr; }
  .vet-card-footer,
  .appt-card-footer,
  .vet-card-actions,
  .appt-card-actions,
  .confirm-delete       { flex-direction: column; align-items: stretch; justify-content: stretch; }

  /* ── Buttons ── */
  .pf-btn { min-width: 80px; font-size: .8125rem; padding: .55rem 1rem; }

  /* ── Form rows ── */
  .form-row { flex-direction: column; }

  /* ── Vaccine calendar ── */
  .vacc-cal-grid    { gap: 2px !important; }
  .vacc-cal-day-num { font-size: .75rem !important; }

  /* ── Timeline ── */
  .timeline-item { flex-wrap: wrap; }

  /* ── Toast ── */
  .toast {
    bottom: calc(var(--mobile-bottom-nav-h) + .875rem) !important;
    left:   .875rem !important;
    right:  .875rem !important;
    max-width: none !important;
    border-radius: var(--r-xl) !important;
  }

  /* ── Back button ── */
  .back-btn { margin-bottom: .75rem; }

  /* ── Cares grid ── */
  .care-grid { grid-template-columns: 1fr 1fr !important; gap: .625rem !important; }
}

/* Slide-up animation for mobile sheets */
@keyframes sheet-slide-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: CALENDAR SMALL  ≤ 640px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  /* Generic grid helpers */
  .grid-2    { grid-template-columns: 1fr !important; }
  .grid-auto { grid-template-columns: 1fr !important; }
  .grid-3    { grid-template-columns: 1fr !important; }

  /* Calendar toolbar */
  .cal-toolbar,
  .cal-grid-wrap,
  .cal-detail {
    padding:       .95rem;
    border-radius: 1.2rem;
  }
    .cal-filters-groups {
    grid-template-columns: 1fr;
  }
  .cal-filter-group-label,
  .cal-filter-group__label { min-width: auto; width: 100%; }
  .cal-month-label          { font-size: 1.25rem; }
  .cal-cell                 { min-height: 72px; }

  /* Alert banner */
  .alert-banner             { padding: .8rem .82rem; gap: .7rem; }
  .alert-banner__title-row  { align-items: flex-start; }
  .alert-banner__list       { gap: .45rem; }
  .alert-banner__item,
  .alert-banner__item-main  { width: 100%; border-radius: .95rem; align-items: flex-start; }
  .alert-banner__item-text  { align-items: flex-start; }
  .alert-banner__meta       { white-space: normal; }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: DASHBOARD MOBILE  ≤ 600px
   Single-column dash grid + PAW 200×190px

   PAW geometry (scale ≈ 0.625 of 320×300 desktop):
     Main: 102px  (164 × 0.625)
     Toe-1,2: 52px (84 × 0.625) — top:6  left/right:42
     Toe-3,4: 48px (76 × 0.625) — top:60 left/right:0
   Verified:
     Main top edge   = 190−102 = 88px
     Toe-3,4 bottom  = 60+48   = 108px → 20px overlap ✓
     Toe-1,2 center  x = 42+26=68 | x = 200−68=132 (symmetric around 100) ✓
   ════════════════════════════════════════════════════════════ */
@media (max-width: 600px) {
  .dash-mockup-grid {
    grid-template-columns: 1fr;
    grid-template-areas: "left" "center" "events" "right";
    padding: .75rem;
  }

  /* PAW */
  .paw-layout {
    width:  200px !important;
    height: 190px !important;
  }
  .paw-main {
    width:  102px !important;
    height: 102px !important;
    bottom: 0     !important;
    left:   50%   !important;
    transform: translateX(-50%) !important;
  }
  .paw-main:hover {
    transform: translateX(-50%) scale(1.05) !important;
  }

  /* Toe-1,2 */
  .paw-toe-1 {
    width:  52px !important;
    height: 52px !important;
    top:    6px  !important;
    left:   42px !important;
    right:  auto !important;
    bottom: auto !important;
  }
  .paw-toe-2 {
    width:  52px  !important;
    height: 52px  !important;
    top:    6px   !important;
    right:  42px  !important;
    left:   auto  !important;
    bottom: auto  !important;
  }

  /* Toe-3,4 */
  .paw-toe-3 {
    width:  48px !important;
    height: 48px !important;
    top:    60px !important;
    left:   0    !important;
    right:  auto !important;
    bottom: auto !important;
  }
  .paw-toe-4 {
    width:  48px !important;
    height: 48px !important;
    top:    60px !important;
    right:  0    !important;
    left:   auto !important;
    bottom: auto !important;
  }

  /* Quick grid */
  .quick-grid { grid-template-columns: repeat(2, 1fr); }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT  ≤ 480px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 480px) {
  .cal-jump { max-width: 100%; }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT  ≤ 460px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 460px) {
  .emoji-picker-grid { grid-template-columns: repeat(6, 1fr); }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT  ≤ 400px
   ════════════════════════════════════════════════════════════ */
@media (max-width: 400px) {
  .symptom-cat-grid { grid-template-columns: repeat(3, 1fr); }
  .note-type-grid   { grid-template-columns: repeat(2, 1fr); }
}


/* ════════════════════════════════════════════════════════════
   BREAKPOINT: SMALL MOBILE  ≤ 390px
   PAW 176×168px

   PAW geometry (scale ≈ 0.55 of 320×300 desktop):
     Main: 90px   (164 × 0.55)
     Toe-1,2: 46px (84 × 0.55) — top:6  left/right:36
     Toe-3,4: 42px (76 × 0.55) — top:52 left/right:0
   Verified:
     Main top edge   = 168−90 = 78px
     Toe-3,4 bottom  = 52+42  = 94px → 16px overlap ✓
     Toe-1,2 center  x = 36+23=59 | x = 176−59=117 (symmetric around 88) ✓
   ════════════════════════════════════════════════════════════ */
@media (max-width: 390px) {
  :root { font-size: 15px; }

  .main        { padding: .75rem .75rem calc(var(--mobile-bottom-nav-h) + .875rem) !important; }
  .card        { padding: .75rem; }
  .stat-row    { grid-template-columns: 1fr 1fr; }
  .care-grid   { grid-template-columns: 1fr !important; }
  .mobile-nav-label { font-size: .55rem; }

  /* PAW */
  .paw-layout {
    width:  176px !important;
    height: 168px !important;
  }
  .paw-main {
    width:  90px !important;
    height: 90px !important;
    bottom: 0    !important;
    left:   50%  !important;
    transform: translateX(-50%) !important;
  }
  .paw-main:hover {
    transform: translateX(-50%) scale(1.05) !important;
  }

  /* Toe-1,2 */
  .paw-toe-1 {
    width:  46px !important;
    height: 46px !important;
    top:    6px  !important;
    left:   36px !important;
    right:  auto !important;
    bottom: auto !important;
  }
  .paw-toe-2 {
    width:  46px  !important;
    height: 46px  !important;
    top:    6px   !important;
    right:  36px  !important;
    left:   auto  !important;
    bottom: auto  !important;
  }

  /* Toe-3,4 */
  .paw-toe-3 {
    width:  42px !important;
    height: 42px !important;
    top:    52px !important;
    left:   0    !important;
    right:  auto !important;
    bottom: auto !important;
  }
  .paw-toe-4 {
    width:  42px !important;
    height: 42px !important;
    top:    52px !important;
    right:  0    !important;
    left:   auto !important;
    bottom: auto !important;
  }
}


/* ════════════════════════════════════════════════════════════
   SAFE AREA — iPhone notch / home indicator
   ════════════════════════════════════════════════════════════ */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-bottom-nav {
    padding-bottom: calc(env(safe-area-inset-bottom) + .25rem);
    height: calc(var(--mobile-bottom-nav-h) + env(safe-area-inset-bottom));
  }
  .main {
    padding-bottom: calc(var(--mobile-bottom-nav-h) + env(safe-area-inset-bottom) + 1rem);
  }
}


/* ════════════════════════════════════════════════════════════
   TOUCH TARGETS — minimum 44×44 px
   ════════════════════════════════════════════════════════════ */
@media (pointer: coarse) {
  .btn, .pf-btn, .nav-item, .tab, .care-btn-do, .care-btn-cfg,
  .back-btn, .cal-filter-pill, .petlist-filter-pill,
  .vacc-cal-nav, .vacc-cal-day, .toggle-pill,
  .topbar-icon-btn, .topbar-avatar,
  input[type="checkbox"], input[type="radio"] {
    min-height: 44px;
    min-width:  44px;
  }

  /* Larger touch areas on list rows */
  .vaccine-row, .list-item, .care-card,
  .timeline-item, .note-card, .pet-card { cursor: pointer; }

  /* More spacing between tappable items */
  .list-item + .list-item { margin-top: .25rem; }
}


/* ════════════════════════════════════════════════════════════
   PRINT
   ════════════════════════════════════════════════════════════ */
@media print {
  .sidebar, .topbar, .mobile-bottom-nav, .toast { display: none !important; }
  .main  { margin: 0 !important; padding: 1rem !important; }
  .card  { box-shadow: none; border: 1px solid #ccc; }
}


/* ════════════════════════════════════════════════════════════
   REDUCED MOTION
   ════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:        0.01ms !important;
    animation-iteration-count: 1      !important;
    transition-duration:       0.01ms !important;
  }
  .calico-cat { animation: none !important; opacity: 1; transform: translateX(2px) translateY(0); }
  .pituti-anim-wrap span { opacity: 1 !important; animation: none !important; }
}
```

## File: src/types/index.ts
```typescript
// ─────────────────────────────────────────────
// Tipos de dominio — PITUTI
// ─────────────────────────────────────────────

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other'
export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type HabitatType = 'indoor' | 'outdoor' | 'litter_box' | 'cage' | 'aquarium' | 'terrarium'
export type CarePeriod = 'day' | 'week' | 'month'

// Usuario
export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  createdAt: string
}

// Mascota
export interface Pet {
  id: string
  name: string
  species: Species
  breed?: string
  birthDate?: string
  photoUrl?: string
  ownerId: string
  createdAt: string
}

// Cuidador compartido
export interface Caregiver {
  id: string
  petId: string
  userId: string
  name: string
  email: string
  role: 'owner' | 'caregiver' | 'readonly'
  joinedAt: string
}

// Vacuna
export interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDueDate?: string
  veterinary?: string
  notes?: string
}

// Medicamento
export interface Medication {
  id: string
  petId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
}

// Síntoma
export interface Symptom {
  id: string
  petId: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  resolved: boolean
}

// Registro de alimentación
export interface FeedingLog {
  id: string
  petId: string
  date: string
  food: string
  amount?: string
  notes?: string
}

// Nota
export interface Note {
  id: string
  petId: string
  content: string
  veterinary?: string
  createdAt: string
}

// Documento
export interface DocumentFile {
  id: string
  petId: string
  name: string
  url: string
  type: string
  uploadedAt: string
}

// Actividad del log
export interface ActivityLog {
  id: string
  petId: string
  action: string
  description: string
  timestamp: string
}

// Cuidado diario
export interface CareItem {
  id: string
  petId: string
  name: string
  emoji: string
  habitatType: HabitatType
  timesPerPeriod: number
  period: CarePeriod
  quantity?: string
  notifyPush: boolean
  notifyEmail: boolean
  notifyCaregivers: boolean
}

// Registro de cuidado diario (check-in)
export interface CareLog {
  id: string
  careItemId: string
  petId: string
  doneAt: string
  doneBy: string
}

// Alerta para el dashboard
export interface PetAlert {
  type: 'warn' | 'err' | 'info'
  text: string
}
```

## File: src/components/AddCareModal.tsx
```typescript
// traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { usePetsContext } from '../context/PetsContext'
import { PfBtn, PfFooter } from '../components/FooterButtons'


// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface AddCareData {
  petId:            string
  emoji:            string
  title:            string
  total:            number
  recurrenceType:   'daily' | 'everyXDays' | 'everyXHours'
  recurrenceValue:  number
  quantity:         string
  notify:           boolean
  period?:          string
  intervalDays?:    number
  time?:            string
  recurring?:       boolean
}

interface Props {
  isOpen:        boolean
  onClose:       () => void
  onAdd:         (data: AddCareData) => void
  defaultPetId?: string
}


// ── Constantes ────────────────────────────────────────────────────────────────

const CARE_EMOJIS = [
  '🍽️','💧','🪮','🦮','🏃','🛁','💊','💉','🧴','🪥',
  '🐾','🌿','🪺','🐟','🐇','🐦','🧸','🩺','⏰','📅',
]

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🐦', rabbit:'🐰', reptile:'🦎', fish:'🐠', other:'🐾',
}


// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}
    >
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}


// ── Componente ────────────────────────────────────────────────────────────────

export default function AddCareModal({ isOpen, onClose, onAdd, defaultPetId }: Props) {
  const { t } = useTranslation()
  // ✅ dentro do componente, não no módulo
  const { pets } = usePetsContext()

  const RECURRENCE_OPTS = [
    { val: 'daily'       as const, icon: '📅', label: t('cares.add.recDaily')   },
    { val: 'everyXDays'  as const, icon: '🗓️', label: t('cares.add.recXDays')  },
    { val: 'everyXHours' as const, icon: '⏰', label: t('cares.add.recXHours') },
  ]

  const [petId,    setPetId   ] = useState(defaultPetId ?? pets[0]?.id ?? '')
  const [emoji,    setEmoji   ] = useState('')
  const [title,    setTitle   ] = useState('')
  const [total,    setTotal   ] = useState(1)
  const [recType,  setRecType ] = useState<'daily' | 'everyXDays' | 'everyXHours'>('daily')
  const [recValue, setRecValue] = useState(1)
  const [quantity, setQuantity] = useState('')
  const [notify,   setNotify  ] = useState(true)
  const [titleErr, setTitleErr] = useState('')
  const [success,  setSuccess ] = useState(false)

  const reset = () => {
    setTitle(''); setQuantity(''); setTitleErr('')
    setEmoji(''); setTotal(1)
    setRecType('daily'); setRecValue(1)
    setNotify(true)
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!title.trim()) { setTitleErr(t('cares.add.errTitle')); return }
    const rv = Math.max(1, Number(recValue) || 1)
    const intervalDays =
      recType === 'daily'      ? 1 :
      recType === 'everyXDays' ? rv :
      rv / 24

    setSuccess(true)
    setTimeout(() => {
      onAdd({
        petId,
        emoji,
        title: title.trim(),
        total: Math.max(1, Number(total) || 1),
        recurrenceType:  recType,
        recurrenceValue: rv,
        quantity,
        notify,
        period:      recType === 'daily' ? 'day' : 'custom',
        intervalDays,
      })
      showToast(`${emoji} ${t('cares.add.toast', { title: title.trim() })}`)
      reset()
      setSuccess(false)
      onClose()
    }, 1100)
  }

  const selectedPet = pets.find(p => p.id === petId)

  const pillStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '.35rem',
    padding: '.5rem .875rem',
    borderRadius: 'var(--r-full)',
    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background: active ? 'var(--primary-hl)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: active ? 700 : 500,
    fontSize: '.8125rem',
    cursor: 'pointer',
    transition: 'all var(--trans)',
    whiteSpace: 'nowrap' as const,
    fontFamily: 'inherit',
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon="🐾"
      accentBg="var(--success-hl)"
      accentFg="var(--success)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSubmit}>{t('cares.add.submitBtn')}</PfBtn>
        </PfFooter>
      ) : undefined}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--success-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--success)', fontSize:'1.5rem' }}>{emoji}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('cares.add.heroTitle')}</div>
          <div className="modal-hero-sub">
            {t('cares.add.heroSub')} <strong>{selectedPet?.name ?? '—'}</strong>
          </div>
        </div>
        <button className="pm-close" onClick={handleClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✅</div>
          <div className="modal-success-title">{t('cares.add.successTitle')}</div>
          <div className="modal-success-sub">{emoji} <strong>{title}</strong> {t('cares.add.successSub')}</div>
        </div>
      ) : (
        <>
          {/* Pet selector */}
          <div className="modal-section">{t('cares.add.sectionPet')}</div>
          <div className="mf-species-grid" style={{ gridTemplateColumns:`repeat(${pets.length},1fr)`, marginBottom:'1rem' }}>
            {pets.map(p => (
              <button key={p.id} type="button"
                className={['mf-species-card', petId === p.id ? 'active' : ''].join(' ')}
                onClick={() => setPetId(p.id)}
              >
                <span className="mf-species-emoji">{PET_EMOJI[p.species] ?? '🐾'}</span>
                <span className="mf-species-label">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Cuidado — ícone + nome */}
          <div className="modal-section">{t('cares.add.sectionCare')}</div>
          <div className="form-group">
            <label className="form-label">{t('cares.add.labelIcon')}</label>
            <div className="emoji-picker-grid">
              {CARE_EMOJIS.map(e => (
                <button key={e} type="button"
                  className={['emoji-pick-btn', emoji === e ? 'active' : ''].join(' ')}
                  onClick={() => setEmoji(e)}
                >{e}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('field.name')}</label>
            <div className="field-icon-wrap">
              <span className="field-icon" style={{ fontSize:'1rem' }}>{emoji}</span>
              <input
                className={['form-input', titleErr ? 'form-input--err' : ''].join(' ')}
                placeholder={t('cares.add.namePh')}
                value={title}
                onChange={e => { setTitle(e.target.value); setTitleErr('') }}
                autoFocus
              />
            </div>
            {titleErr && <span className="form-hint-err">{titleErr}</span>}
          </div>

          {/* Recorrência */}
          <div className="modal-section">{t('cares.add.sectionRecurrence')}</div>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'.875rem' }}>
            {RECURRENCE_OPTS.map(opt => (
              <button key={opt.val} type="button"
                style={pillStyle(recType === opt.val)}
                onClick={() => setRecType(opt.val)}
              >
                <span style={{ fontSize:'.95rem' }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {(recType === 'everyXDays' || recType === 'everyXHours') && (
            <div className="form-group" style={{ marginBottom:'.875rem' }}>
              <label className="form-label">
                {recType === 'everyXDays' ? t('cares.add.intervalDays') : t('cares.add.intervalHours')}
              </label>
              <div style={{ display:'flex', alignItems:'center', gap:'.625rem' }}>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={recType === 'everyXHours' ? 168 : 365}
                  value={recValue}
                  onChange={e => setRecValue(Math.max(1, Number(e.target.value) || 1))}
                  style={{ width:90, textAlign:'center', fontWeight:700, fontSize:'1.1rem' }}
                />
                <span style={{ color:'var(--text-muted)', fontSize:'.875rem', fontWeight:600 }}>
                  {recType === 'everyXDays' ? t('cares.add.unitDays') : t('cares.add.unitHours')}
                </span>
                <span style={{
                  marginLeft:'auto', fontSize:'.75rem', color:'var(--success)',
                  background:'var(--success-hl)', padding:'.2rem .5rem',
                  borderRadius:'var(--r-full)', fontWeight:700,
                }}>
                  {recType === 'everyXDays'
                    ? t('cares.add.previewDays', { count: recValue })
                    : t('cares.add.previewHours', { count: recValue })}
                </span>
              </div>
            </div>
          )}

          {recType === 'daily' && (
            <div className="form-group" style={{ marginBottom:'.875rem' }}>
              <label className="form-label">{t('cares.add.timesPerDay')}</label>
              <input
                className="form-input"
                type="number" min={1} max={10}
                value={total}
                onChange={e => setTotal(Number(e.target.value))}
                style={{ maxWidth:90 }}
              />
            </div>
          )}

          <div className="form-group" style={{ marginTop:'.25rem' }}>
            <label className="form-label">
              {t('cares.add.labelQuantity')}{' '}
              <span style={{ color:'var(--text-faint)', fontWeight:500 }}>{t('btn.optional')}</span>
            </label>
            <div className="field-icon-wrap">
              <span className="field-icon">⚖️</span>
              <input
                className="form-input"
                placeholder={t('cares.add.quantityPh')}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>
          </div>

          {/* Notificações */}
          <div className="modal-section">{t('cares.add.sectionPrefs')}</div>
          <div className="toggle-row">
            <div className="toggle-row-info">
              <div className="toggle-row-label">{t('cares.add.notifyLabel')}</div>
              <div className="toggle-row-sub">{t('cares.add.notifySub')}</div>
            </div>
            <Toggle on={notify} onChange={setNotify} />
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/AddEditVetModal.tsx
```typescript
//traduzido e sem mock

import { useState, useEffect, type FC } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { usePetsContext } from '../context/PetsContext'
import type { VetContact } from '../context/VetContext'
import { useTranslation } from 'react-i18next'

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

export const VET_TYPES = [
  { value: 'primary',    key: 'primary',    emoji: '🩺', color: 'var(--primary)'    },
  { value: 'specialist', key: 'specialist', emoji: '🔬', color: 'var(--blue)'       },
  { value: 'emergency',  key: 'emergency',  emoji: '🚨', color: 'var(--err)'        },
  { value: 'other',      key: 'other',      emoji: '📋', color: 'var(--text-muted)' },
] as const

type VetType = typeof VET_TYPES[number]['value']

interface Props {
  isOpen:   boolean
  onClose:  () => void
  onSave:   (v: Omit<VetContact, 'id'>) => void
  onUpdate: (v: VetContact) => void
  initial:  VetContact | null
}

const AddEditVetModal: FC<Props> = ({ isOpen, onClose, onSave, onUpdate, initial }) => {
  const { t }    = useTranslation()
  const { pets } = usePetsContext()
  const isEdit   = !!initial

  const [type,      setType]      = useState<VetType>('primary')
  const [name,      setName]      = useState('')
  const [clinic,    setClinic]    = useState('')
  const [specialty, setSpecialty] = useState('')
  const [phone,     setPhone]     = useState('')
  const [phone2,    setPhone2]    = useState('')
  const [address,   setAddress]   = useState('')
  const [notes,     setNotes]     = useState('')
  const [petIds,    setPetIds]    = useState<string[]>([])
  const [nameErr,   setNameErr]   = useState('')
  const [clinicErr, setClinicErr] = useState('')
  const [phoneErr,  setPhoneErr]  = useState('')

  useEffect(() => {
    if (initial) {
      setType((initial.type as VetType) ?? 'primary')
      setName(initial.name)
      setClinic(initial.clinic)
      setSpecialty(initial.specialty ?? '')
      setPhone(initial.phone)
      setPhone2(initial.phone2 ?? '')
      setAddress(initial.address ?? '')
      setNotes(initial.notes ?? '')
      setPetIds(initial.petIds)
    } else {
      setType('primary'); setName(''); setClinic(''); setSpecialty('')
      setPhone(''); setPhone2(''); setAddress(''); setNotes(''); setPetIds([])
    }
    setNameErr(''); setClinicErr(''); setPhoneErr('')
  }, [initial, isOpen])

  const validate = () => {
    let ok = true
    if (!name.trim())   { setNameErr(t('vet.contacts.errName'));    ok = false }
    if (!clinic.trim()) { setClinicErr(t('vet.contacts.errClinic')); ok = false }
    if (!phone.trim())  { setPhoneErr(t('vet.contacts.errPhone'));   ok = false }
    return ok
  }

  const handleSave = () => {
    if (!validate()) return
    const data: Omit<VetContact, 'id'> = {
      name:      name.trim(),
      clinic:    clinic.trim(),
      type,
      specialty: specialty.trim() || undefined,
      phone:     phone.trim(),
      phone2:    phone2.trim()  || undefined,
      address:   address.trim() || undefined,
      notes:     notes.trim()   || undefined,
      petIds,
      createdAt: initial?.createdAt ?? '',
    }
    if (isEdit && initial) onUpdate({ ...data, id: initial.id })
    else onSave(data)
    onClose()
  }

  const togglePet = (id: string) =>
    setPetIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? t('vet.contacts.subtitleEdit', { name: initial?.name ?? '' })
          : t('vet.contacts.titleAdd')
      }
      icon="🩺"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>{t('btn.cancel')}</PfBtn>
          <PfBtn variant="save" onClick={handleSave}>
            {isEdit ? t('btn.saveChanges') : t('vet.contacts.addBtn')}
          </PfBtn>
        </PfFooter>
      }
    >
      {/* Tipo de veterinário */}
      <div className="modal-section">{t('vet.contacts.sectionType')}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'.5rem', marginBottom:'1rem' }}>
        {VET_TYPES.map(vt => (
          <button key={vt.value} type="button" onClick={() => setType(vt.value)}
            style={{
              padding:'.625rem .75rem', borderRadius:'var(--r-md)', cursor:'pointer',
              fontFamily:'inherit', fontWeight:700, fontSize:'.8125rem',
              border:`1.5px solid ${type === vt.value ? vt.color : 'var(--border)'}`,
              background: type === vt.value
                ? `color-mix(in oklab, ${vt.color} 10%, var(--surface))`
                : 'var(--surface)',
              display:'flex', alignItems:'center', gap:'.5rem',
              color: type === vt.value ? vt.color : 'var(--text)',
            }}>
            <span>{vt.emoji}</span>
            {/* ✅ label via i18n em vez de hardcode ES */}
            <span>{t(`vet.contactTypes.${vt.key}`)}</span>
          </button>
        ))}
      </div>

      {/* Dados de contacto */}
      <div className="modal-section">{t('vet.contacts.sectionContact')}</div>

      <div className="form-group">
        <label className="form-label">{t('field.name')} *</label>
        <input className={`form-input${nameErr ? ' input-err' : ''}`}
          value={name} onChange={e => { setName(e.target.value); setNameErr('') }}
          placeholder={t('vet.contacts.vetNamePh')}/>
        {nameErr && <div className="form-error">{nameErr}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">{t('field.clinic')} *</label>
        <input className={`form-input${clinicErr ? ' input-err' : ''}`}
          value={clinic} onChange={e => { setClinic(e.target.value); setClinicErr('') }}
          placeholder={t('vet.contacts.clinicPh')}/>
        {clinicErr && <div className="form-error">{clinicErr}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('field.specialty')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <input className="form-input" value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          placeholder={t('vet.contacts.specialtyPh')}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
        <div className="form-group">
          <label className="form-label">{t('field.phone')} *</label>
          <input type="tel" className={`form-input${phoneErr ? ' input-err' : ''}`}
            value={phone} onChange={e => { setPhone(e.target.value); setPhoneErr('') }}
            placeholder={t('vet.contacts.phonePh')}/>
          {phoneErr && <div className="form-error">{phoneErr}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            {t('vet.contacts.phone2')}{' '}
            <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
          </label>
          <input type="tel" className="form-input" value={phone2}
            onChange={e => setPhone2(e.target.value)}
            placeholder={t('vet.contacts.phone2Ph')}/>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('field.address')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:400 }}>({t('btn.optional')})</span>
        </label>
        <input className="form-input" value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder={t('vet.contacts.addressPh')}/>
      </div>

      {/* ✅ pets via contexto */}
      <div className="modal-section">{t('vet.contacts.sectionPets')}</div>
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1rem' }}>
        {pets.map(p => (
          <button key={p.id} type="button"
            className={`btn btn-sm ${petIds.includes(p.id) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => togglePet(p.id)}>
            {PET_EMOJI[p.species ?? ''] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      {/* Notas */}
      <div className="modal-section">{t('vet.contacts.sectionNotes')}</div>
      <div className="form-group">
        <textarea className="form-input" rows={2} value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t('vet.contacts.notesPh')}/>
      </div>
    </Modal>
  )
}

export default AddEditVetModal
```

## File: src/components/EditMedModal.tsx
```typescript
// Traduzido e sem mock

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import Button from './Button'
import FormDateField from './FormDateField'
import { showToast } from './AppLayout'

// ✅ petId adicionado ao tipo
export interface MedRecord {
  id:        string
  icon:      string
  title:     string
  dose:      string
  frequency: string
  startDate: string
  endDate:   string
  notes:     string
  bg:        string
  color:     string
  badge:     string
  badgeCls:  string
  archived:  boolean
  petId:     string
}

interface Props {
  isOpen:   boolean
  onClose:  () => void
  med:      MedRecord | null
  onSave:   (updated: MedRecord) => void
  onDelete: (id: string) => void
}

const MED_ICONS = ['💊','💉','🩹','🧪','🫙','🌡️','🩺']

export default function EditMedModal({ isOpen, onClose, med, onSave, onDelete }: Props) {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  // ✅ valores de `frequency` alinhados com as chaves do contexto (daily, weekly…)
  const FREQ_OPTIONS = [
    { value: 'daily',    label: t('medications.freq.daily')     },
    { value: 'every12h', label: t('medications.freq.every12h')  },
    { value: 'every8h',  label: t('medications.freq.every8h')   },
    { value: 'weekly',   label: t('medications.freq.weekly')    },
    { value: 'biweekly', label: t('medications.freq.biweekly')  },
    { value: 'monthly',  label: t('medications.freq.monthly')   },
    { value: 'every3m',  label: t('medications.freq.every3m')   },
    { value: 'single',   label: t('medications.freq.single')    },
  ]

  const [icon,       setIcon]       = useState('💊')
  const [title,      setTitle]      = useState('')
  const [dose,       setDose]       = useState('')
  const [frequency,  setFrequency]  = useState('daily')
  const [startDate,  setStartDate]  = useState(today)
  const [endDate,    setEndDate]    = useState('')
  const [notes,      setNotes]      = useState('')
  const [errors,     setErrors]     = useState<Record<string,string>>({})
  const [confirmDel, setConfirmDel] = useState(false)

  useEffect(() => {
    if (med && isOpen) {
      setIcon(med.icon || '💊')
      setTitle(med.title)
      setDose(med.dose || '')
      setFrequency(med.frequency || 'daily')
      setStartDate(med.startDate || today)
      setEndDate(med.endDate || '')
      setNotes(med.notes || '')
      setErrors({})
      setConfirmDel(false)
    }
  }, [med, isOpen])

  if (!med) return null

  const validate = () => {
    const e: Record<string,string> = {}
    if (!title.trim()) e.title = t('medications.edit.errName')
    if (!dose.trim())  e.dose  = t('medications.edit.errDose')
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ ...med, icon, title: title.trim(), dose: dose.trim(), frequency, startDate, endDate, notes })
    showToast(`${icon} ${title.trim()} — ${t('toast.medSaved')}`)
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDel) { setConfirmDel(true); return }
    onDelete(med.id); onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon=""
      accentBg="var(--warn-hl)"
      accentFg="var(--warn)"
      size="md"
      footer={
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', gap:'.5rem' }}>
          <Button variant="danger" onClick={handleDelete} style={{ minWidth:0 }}>
            {confirmDel ? t('btn.confirmDelete') : t('btn.delete')}
          </Button>
          <div style={{ display:'flex', gap:'.5rem' }}>
            <Button variant="ghost" onClick={onClose}>{t('btn.cancel')}</Button>
            <Button onClick={handleSave}>{t('btn.save')}</Button>
          </div>
        </div>
      }
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--warn-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background:'var(--warn)', fontSize:'1.5rem' }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('medications.edit.title')}</div>
          <div className="modal-hero-sub">{med.title}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Tipo */}
      <div className="modal-section">{t('medications.edit.sectionType')}</div>
      <div style={{ display:'flex', gap:'.375rem', marginBottom:'1rem' }}>
        {MED_ICONS.map(ic => (
          <button key={ic} type="button"
            className={['emoji-pick-btn', icon===ic ? 'active' : ''].join(' ')}
            style={{ width:38, height:38, fontSize:'1.1rem' }}
            onClick={() => setIcon(ic)}>{ic}
          </button>
        ))}
      </div>

      {/* Nome + Dose */}
      <div className="modal-section">{t('medications.edit.sectionMed')}</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('field.name')} *</label>
          <div className="field-icon-wrap">
            <span className="field-icon" style={{ fontSize:'1rem' }}>{icon}</span>
            <input
              className={['form-input', errors.title ? 'form-input--err' : ''].join(' ')}
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(v => ({...v, title:''})) }}
              autoFocus/>
          </div>
          {errors.title && <span className="form-hint-err">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">{t('medications.dose')} *</label>
          <div className="field-icon-wrap">
            <span className="field-icon">⚖️</span>
            <input
              className={['form-input', errors.dose ? 'form-input--err' : ''].join(' ')}
              value={dose}
              onChange={e => { setDose(e.target.value); setErrors(v => ({...v, dose:''})) }}/>
          </div>
          {errors.dose && <span className="form-hint-err">{errors.dose}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('medications.frequency')}</label>
        <div className="field-icon-wrap">
          <span className="field-icon">🔄</span>
          <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
            {FREQ_OPTIONS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Período */}
      <div className="modal-section">{t('medications.startDate')} / {t('medications.endDate')}</div>
      <div className="form-row">
        <FormDateField
          label={t('medications.startDate')}
          value={startDate}
          onChange={setStartDate}
        />
        <FormDateField
          label={`${t('medications.endDate')} (${t('btn.optional')})`}
          value={endDate}
          onChange={setEndDate}
          min={startDate}
          hint={t('medications.edit.endHint')}
        />
      </div>

      {/* Notas */}
      <div className="modal-section">{t('field.notes')}</div>
      <div className="form-group" style={{ marginBottom:0 }}>
        <div className="field-icon-wrap" style={{ alignItems:'flex-start' }}>
          <span className="field-icon" style={{ paddingTop:'.55rem' }}>📝</span>
          <textarea
            className="form-input"
            rows={2}
            placeholder={t('medications.edit.notesPh')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize:'vertical', minHeight:60, fontFamily:'inherit', border:'none' }}
          />
        </div>
      </div>
    </Modal>
  )
}
```

## File: src/components/EditVaccineModal.tsx
```typescript
// TRADUZIDO

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import type { VaccineRecord } from '../hooks/usePets'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from '../components/FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  vaccine: VaccineRecord | null
  onSave:  (updated: VaccineRecord) => void
}

export default function EditVaccineModal({ isOpen, onClose, vaccine, onSave }: Props) {
  const { t } = useTranslation()
  const [name,     setName]     = useState('')
  const [applied,  setApplied]  = useState('')
  const [nextDate, setNextDate] = useState('')
  const [nameErr,  setNameErr]  = useState('')
  const [nextErr,  setNextErr]  = useState('')
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    if (vaccine && isOpen) {
      setName(vaccine.name)
      setApplied(vaccine.applied)
      setNextDate(vaccine.nextDate)
      setNameErr(''); setNextErr(''); setSuccess(false)
    }
  }, [vaccine, isOpen])

  if (!vaccine) return null

  const handleSave = () => {
    if (!name.trim()) { setNameErr(t('vet.contacts.errName')); return }
    if (!nextDate)    { setNextErr(t('vaccines.edit.errNext')); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...vaccine, name: name.trim(), applied, nextDate })
      showToast(`💉 ${name.trim()} ${t('vaccines.edit.toastUpdated')}`)
      setSuccess(false); onClose()
    }, 900)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon=""
      accentBg="var(--blue-hl)"
      accentFg="var(--blue)"
      footer={!success
        ? <PfFooter>
            <PfBtn variant="save" onClick={handleSave}>{t('vaccines.edit.saveBtn')}</PfBtn>
          </PfFooter>
        : <></>
      }
    >
      <div className="modal-hero" style={{ background: 'linear-gradient(135deg,var(--blue-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background: 'var(--blue)', fontSize: '1.5rem' }}>💉</div>
        <div style={{ flex: 1 }}>
          <div className="modal-hero-title">{t('vaccines.edit.title')}</div>
          <div className="modal-hero-sub">{vaccine.name}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('vaccines.edit.successTitle')}</div>
        </div>
      ) : (
        <>
          <div className="modal-section">{t('field.name')}</div>
          <div className="form-group">
            <div className="field-icon-wrap">
              <span className="field-icon">💉</span>
              <input
                className={['form-input', nameErr ? 'form-input--err' : ''].join(' ')}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                placeholder={t('vaccines.edit.namePh')}
                autoFocus
              />
            </div>
            {nameErr && <span className="form-hint-err">{nameErr}</span>}
          </div>

          <div className="modal-section">{t('vaccines.edit.sectionDates')}</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('vaccines.edit.labelApplied')}</label>
              <input
                type="text"
                className="form-input"
                value={applied}
                onChange={e => setApplied(e.target.value)}
                placeholder={t('vaccines.edit.appliedPh')}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('vaccines.edit.labelNext')}</label>
              <input
                type="date"
                className={['form-input', nextErr ? 'form-input--err' : ''].join(' ')}
                value={nextDate}
                onChange={e => { setNextDate(e.target.value); setNextErr('') }}
              />
              {nextErr && <span className="form-hint-err">{nextErr}</span>}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/PetMedicalProfileModal.tsx
```typescript
//traduzido

import { useState, useEffect } from 'react'
import Modal from './Modal'
import { PfBtn, PfFooter } from './FooterButtons'
import { CONDITIONS_CATALOG, type PetMedicalProfile } from '../context/VetContext'
import { useTranslation } from 'react-i18next'

type Sex = 'male' | 'female'
type Env = 'apartment' | 'house' | 'both'

interface Surgery {
  id:     string
  name:   string
  date?:  string
  notes?: string
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="modal-section" style={{ marginTop: '1.25rem' }}>{children}</div>
  )
}

interface Props {
  isOpen:  boolean
  onClose: () => void
  pet:     { name: string; species?: string }
  profile: PetMedicalProfile
  onSave:  (profile: PetMedicalProfile) => void
}

export default function PetMedicalProfileModal({
  isOpen, onClose, pet, profile, onSave,
}: Props) {
  const { t } = useTranslation()

  const [sex,          setSex]          = useState<Sex | undefined>(undefined)
  const [neutered,     setNeutered]     = useState<boolean | undefined>(undefined)
  const [neuteredAge,  setNeuteredAge]  = useState('')
  const [bloodType,    setBloodType]    = useState('')
  const [allergies,    setAllergies]    = useState('')
  const [condIds,      setCondIds]      = useState<string[]>([])
  const [customConds,  setCustomConds]  = useState<string[]>([])
  const [newCond,      setNewCond]      = useState('')
  const [surgeries,    setSurgeries]    = useState<Surgery[]>([])
  const [newSurgName,  setNewSurgName]  = useState('')
  const [newSurgNotes, setNewSurgNotes] = useState('')
  const [environment,  setEnvironment]  = useState<Env | undefined>(undefined)
  const [withAnimals,  setWithAnimals]  = useState<boolean | undefined>(undefined)
  const [parasite,     setParasite]     = useState('')
  const [behavior,     setBehavior]     = useState('')
  const [vetQuestions, setVetQuestions] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setSex(profile.sex)
    setNeutered(profile.neutered)
    setNeuteredAge(profile.neuteredAge ?? '')
    setBloodType(profile.bloodType ?? '')
    setAllergies(profile.allergies ?? '')
    setCondIds([...profile.chronicConditionIds])
    setCustomConds([...profile.customConditions])
    setNewCond('')
    setSurgeries(profile.surgeries.map(s => ({ ...s })))
    setNewSurgName(''); setNewSurgNotes('')
    setEnvironment(profile.environment)
    setWithAnimals(profile.livingWithAnimals)
    setParasite(profile.parasiteControl ?? '')
    setBehavior(profile.behavioralNotes ?? '')
    setVetQuestions(profile.vetQuestions ?? '')
  }, [isOpen, profile])

  const toggleCondId = (id: string) =>
    setCondIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const addCustomCond = () => {
    const val = newCond.trim()
    if (!val || customConds.includes(val)) return
    setCustomConds(prev => [...prev, val])
    setNewCond('')
  }

  const addSurgery = () => {
    const name = newSurgName.trim()
    if (!name) return
    setSurgeries(prev => [...prev, {
      id:    `surg-${Date.now()}`,
      name,
      notes: newSurgNotes.trim() || undefined,
    }])
    setNewSurgName(''); setNewSurgNotes('')
  }

  const handleSave = () => {
    const updated: PetMedicalProfile = {
      ...profile,
      sex,
      neutered,
      neuteredAge:         neuteredAge.trim()  || undefined,
      bloodType:           bloodType.trim()    || undefined,
      allergies:           allergies.trim()    || undefined,
      chronicConditionIds: condIds,
      customConditions:    customConds,
      surgeries,
      environment,
      livingWithAnimals:   withAnimals,
      parasiteControl:     parasite.trim()     || undefined,
      behavioralNotes:     behavior.trim()     || undefined,
      vetQuestions:        vetQuestions.trim() || undefined,
      updatedAt:           new Date().toISOString(),
    }
    onSave(updated)
    onClose()
  }

  const chip: React.CSSProperties = {
    padding: '.3rem .65rem', borderRadius: 'var(--r-full)',
    fontSize: '.8rem', fontWeight: 700, cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background var(--trans), border-color var(--trans)',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('vet.profile.modalTitle')}
      icon="🩺"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>{t('btn.cancel')}</PfBtn>
          <PfBtn variant="save"   onClick={handleSave}>{t('btn.save')}</PfBtn>
        </PfFooter>
      }
    >
      {/* ── Datos básicos ── */}
      {/* ✅ todas as v.profile.* → t('vet.profile.*') */}
      <SectionLabel>{t('vet.profile.sectionBasic')}</SectionLabel>

      {/* Sexo */}
      <div className="form-group">
        <label className="form-label">{t('vet.profile.sex')}</label>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {(['male', 'female'] as Sex[]).map(s => (
            <button key={s} type="button"
              onClick={() => setSex(sex === s ? undefined : s)}
              style={{
                ...chip,
                border: `1.5px solid ${sex === s ? 'var(--primary)' : 'var(--border)'}`,
                background: sex === s
                  ? 'color-mix(in oklab, var(--primary) 12%, var(--surface))'
                  : 'var(--surface)',
                color: sex === s ? 'var(--primary)' : 'var(--text)',
              }}>
              {s === 'male' ? `♂ ${t('vet.profile.sexMale')}` : `♀ ${t('vet.profile.sexFemale')}`}
            </button>
          ))}
        </div>
      </div>

      {/* Castrado */}
      <div className="form-group"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {t('vet.profile.neutered')}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {neutered == null ? '—' : neutered
              ? t('vet.profile.neuteredYes')
              : t('vet.profile.neuteredNo')}
          </span>
          <Toggle on={!!neutered} onChange={setNeutered} />
        </div>
      </div>

      {neutered && (
        <div className="form-group">
          <label className="form-label">
            {t('vet.profile.neuteredAge')}{' '}
            {/* ✅ era t.btn.optional */}
            <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
              ({t('btn.optional')})
            </span>
          </label>
          <input className="form-input" value={neuteredAge}
            onChange={e => setNeuteredAge(e.target.value)}
            placeholder={t('vet.profile.neuteredAge')} />
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.bloodType')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <input className="form-input" value={bloodType}
          onChange={e => setBloodType(e.target.value)}
          placeholder={t('vet.profile.bloodTypePh')} />
        <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.25rem' }}>
          {t('vet.profile.bloodTypeHint')}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.allergies')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <textarea className="form-input" rows={2} value={allergies}
          onChange={e => setAllergies(e.target.value)}
          placeholder={t('vet.profile.allergies')} />
      </div>

      {/* ── Condiciones crónicas ── */}
      <SectionLabel>{t('vet.profile.sectionConditions')}</SectionLabel>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '.875rem' }}>
        {CONDITIONS_CATALOG.map(c => {
          const active = condIds.includes(c.id)
          return (
            <button key={c.id} type="button" onClick={() => toggleCondId(c.id)}
              style={{
                ...chip,
                border: `1.5px solid ${active ? 'var(--err)' : 'var(--border)'}`,
                background: active
                  ? 'color-mix(in oklab, var(--err) 10%, var(--surface))'
                  : 'var(--surface)',
                color: active ? 'var(--err)' : 'var(--text-muted)',
              }}>
              {active ? '✓ ' : ''}{c.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
        <input className="form-input" value={newCond} style={{ flex: 1 }}
          onChange={e => setNewCond(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomCond()}
          placeholder={t('vet.profile.customConditionPh')} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={addCustomCond}>
          {t('vet.profile.addCondition')}
        </button>
      </div>

      {customConds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.375rem', marginBottom: '.5rem' }}>
          {customConds.map(c => (
            <span key={c} style={{
              ...chip, cursor: 'default',
              display: 'inline-flex', alignItems: 'center', gap: '.375rem',
              border: '1.5px solid var(--err)',
              background: 'color-mix(in oklab, var(--err) 10%, var(--surface))',
              color: 'var(--err)',
            }}>
              {c}
              <button type="button"
                onClick={() => setCustomConds(p => p.filter(x => x !== c))}
                style={{ background: 'none', border: 'none', color: 'var(--err)',
                  cursor: 'pointer', fontSize: '.9rem', lineHeight: 1, padding: 0 }}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Cirugías ── */}
      <SectionLabel>{t('vet.profile.sectionSurgeries')}</SectionLabel>

      {surgeries.map(s => (
        <div key={s.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: '.625rem',
          padding: '.5rem .75rem', borderRadius: 'var(--r-md)',
          background: 'var(--surface-offset)', marginBottom: '.375rem',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '.8125rem' }}>{s.name}</div>
            {s.notes && (
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{s.notes}</div>
            )}
          </div>
          <button type="button"
            onClick={() => setSurgeries(p => p.filter(x => x.id !== s.id))}
            style={{ color: 'var(--err)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '.9rem', flexShrink: 0 }}>
            {t('vet.profile.removeSurgery')}
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem', marginTop: '.5rem' }}>
        <input className="form-input" value={newSurgName}
          onChange={e => setNewSurgName(e.target.value)}
          placeholder={t('vet.profile.surgeryNamePh')} />
        <input className="form-input" value={newSurgNotes}
          onChange={e => setNewSurgNotes(e.target.value)}
          placeholder={t('vet.profile.surgeryNotesPh')} />
        <button type="button" className="btn btn-secondary btn-sm"
          style={{ alignSelf: 'flex-start' }} onClick={addSurgery}>
          {t('vet.profile.addSurgery')}
        </button>
      </div>

      {/* ── Entorno ── */}
      <SectionLabel>{t('vet.profile.sectionEnvironment')}</SectionLabel>

      <div className="form-group">
        <label className="form-label">{t('vet.profile.environment')}</label>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {([
            { val: 'apartment' as Env, label: `🏢 ${t('vet.profile.envApartment')}` },
            { val: 'house'     as Env, label: `🏠 ${t('vet.profile.envHouse')}` },
            { val: 'both'      as Env, label: `🔄 ${t('vet.profile.envBoth')}` },
          ]).map(o => (
            <button key={o.val} type="button"
              onClick={() => setEnvironment(environment === o.val ? undefined : o.val)}
              style={{
                ...chip,
                border: `1.5px solid ${environment === o.val ? 'var(--primary)' : 'var(--border)'}`,
                background: environment === o.val
                  ? 'color-mix(in oklab, var(--primary) 12%, var(--surface))'
                  : 'var(--surface)',
                color: environment === o.val ? 'var(--primary)' : 'var(--text)',
              }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {t('vet.profile.livingWithAnimals')}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>
            {withAnimals == null ? '—' : withAnimals
              ? t('vet.profile.neuteredYes')
              : t('vet.profile.neuteredNo')}
          </span>
          <Toggle on={!!withAnimals} onChange={setWithAnimals} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.parasiteControl')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <input className="form-input" value={parasite}
          onChange={e => setParasite(e.target.value)}
          placeholder={t('vet.profile.parasiteControl')} />
      </div>

      {/* ── Notas para el vet ── */}
      <SectionLabel>{t('vet.profile.sectionVetNotes')}</SectionLabel>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.behavioralNotes')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <textarea className="form-input" rows={2} value={behavior}
          onChange={e => setBehavior(e.target.value)}
          placeholder={t('vet.profile.behavioralNotes')} />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('vet.profile.vetQuestions')}{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>
            ({t('btn.optional')})
          </span>
        </label>
        <textarea className="form-input" rows={2} value={vetQuestions}
          onChange={e => setVetQuestions(e.target.value)}
          placeholder={t('vet.profile.vetQuestions')} />
      </div>
    </Modal>
  )
}
```

## File: src/hooks/usePets.ts
```typescript
// Hook de mascotas — sin mocks, datos reales via PitutiContext
import { usePituti } from '../context/PitutiContext';
import type { Pet } from '../context/PetsContext';

// PetWithAlerts: campos opcionais até o backend os fornecer
export interface PetWithAlerts extends Pet {
  healthScore?: number;
  alerts?: string[];
  vaccCoverage?: number;
}

export const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  bird: '🐦',
  rabbit: '🐰',
  reptile: '🦎',
  fish: '🐟',
  other: '🐾',
};

// Mantido como alias para compatibilidade com importações existentes
export const SPECIESEMOJI = SPECIES_EMOJI;

export function usePets() {
  const { state, refetchPets } = usePituti();
  return {
    pets: state.pets as PetWithAlerts[],
    loading: state.petsLoading,
    error: state.petsError,
    refetch: refetchPets,
  };
}
```

## File: src/pages/CalendarPage.tsx
```typescript
// traduzido e sem mock

import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCares } from '../context/CaresContext'
import { usePetsContext } from '../context/PetsContext'
import { useVet } from '../context/VetContext'
import type { CareEditData } from '../components/EditCareModal'
import EditCareModal from '../components/EditCareModal'
import { useMedications } from '../context/MedicationsContext'
import type { VaccineRecord } from '../context/PetsContext'

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

interface VaccEntry    { vaccKey: string; expired: boolean }
interface VaccWithMeta extends VaccineRecord { petId: string; petName: string; petEmoji: string }
type MedEv = {
  id: string; date: string; petId: string; name: string
  dose?: string; frequency?: string; petName: string; petEmoji: string
}
interface FilterChip { key: string; label: string; color: string; bg: string; emoji: string }

const toDateStr  = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const addDays    = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000)
const intervalToDays = (period: string, total: number) => {
  if (period === 'month') return Math.round(30 / total)
  if (period === 'week')  return Math.round(7  / total)
  return Math.max(1, Math.round(1 / total))
}

type DoneByDate = Record<string, { done: number; total: number; doneState?: boolean }>
type CareStatus = 'done' | 'skip' | 'pending'

function getCareStatus(doneByDate: DoneByDate | undefined, day: string): CareStatus {
  const rec = doneByDate?.[day]
  if (!rec) return 'pending'
  if (rec.doneState) return 'done'
  return 'skip'
}

// ✅ frequências identificadas por chaves neutras — sem strings ES/PT
const FREQ_DAILY    = ['daily',    'diaria',   'diário',  'diario',  '12 horas', '8 horas', 'every12h', 'every8h']
const FREQ_WEEKLY   = ['weekly',   'semanal']
const FREQ_BIWEEKLY = ['biweekly', 'quincenal']
const FREQ_MONTHLY  = ['monthly',  'mensual',  'mensal']

function matchesFreq(freq: string, list: string[]): boolean {
  const f = freq.toLowerCase()
  return list.some(k => f.includes(k))
}

export default function CalendarPage() {
  const { t, i18n } = useTranslation()
  const MED_COLOR   = 'var(--purple)'
  const today       = new Date()
  const todayStr    = toDateStr(today)

  const { items: careItems, setCareProgress, updateCare, deleteCare } = useCares()
  const { vetCalendarDates } = useVet()
  const { medications }      = useMedications()
  // ✅ pets e vacinas do contexto real
  const { pets, vaccinesByPet } = usePetsContext()

  type VetEv = (typeof vetCalendarDates)[number]

  const [extraVacc,     setExtraVacc]     = useState<Record<string, VaccineRecord[]>>({})
  const [viewMonth,     setViewMonth]     = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay,   setSelectedDay]   = useState(todayStr)
  const [jumpMonth,     setJumpMonth]     = useState(
    `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`,
  )
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [editCareItem,  setEditCareItem]  = useState<CareEditData | null>(null)
  const [editCareOpen,  setEditCareOpen]  = useState(false)
  const [careExpandIdx, setCareExpandIdx] = useState<number | null>(null)
  const detailRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.innerWidth < 768) detailRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [selectedDay])

  const FILTER_GROUPS: { id: string; label: string; filters: FilterChip[] }[] = [
    {
      id: 'vet', label: t('calendar.filterGroupVet'),
      filters: [
        { key:'vet_visit',  label: t('calendar.filterVetVisit'),   color:'var(--primary)', bg:'var(--primary-hl)', emoji:'🩺' },
        { key:'vet_return', label: t('calendar.filterVetReturn'),  color:'var(--blue)',    bg:'var(--blue-hl)',    emoji:'📅' },
      ],
    },
    {
      id: 'medications', label: t('calendar.medication'),
      filters: [
        { key:'medication', label: t('calendar.medication'), color:'var(--purple)', bg:'var(--purple-hl)', emoji:'💊' },
      ],
    },
    {
      id: 'vaccines', label: t('calendar.filterGroupVaccines'),
      filters: [
        { key:'vacc_due',     label: t('calendar.filterVaccDue'),     color:'var(--blue)', bg:'var(--blue-hl)', emoji:'💉' },
        { key:'vacc_expired', label: t('calendar.filterVaccExpired'), color:'var(--err)',  bg:'var(--err-hl)',  emoji:'🚨' },
      ],
    },
    {
      id: 'cares', label: t('calendar.filterGroupCares'),
      filters: [
        { key:'pending', label: t('calendar.filterPending'), color:'var(--warn)',    bg:'var(--warn-hl)',    emoji:'⏳' },
{ key:'done', label: t('calendar.filterDone'),  color:'var(--success)', bg:'var(--success-hl)', emoji:'✅' },
      ],
    },
  ]

  // ── VACCINES ───────────────────────────────────────────────────────────────
  const allVaccines = useMemo(
    (): VaccWithMeta[] =>
      pets.flatMap(p =>
        [...(vaccinesByPet[p.id] ?? []), ...(extraVacc[p.id] ?? [])].map(v => ({
          ...v,
          petId:    p.id,
          petName:  p.name,
          petEmoji: PET_EMOJI[p.species ?? ''] ?? '🐾',
        })),
      ),
    [pets, vaccinesByPet, extraVacc],
  )

  const handleVaccineApplied = (vaccKey: string, appliedDate: string) => {
    const [petId, ...nameParts] = vaccKey.split('::')
    const name     = nameParts.join('::')
    const existing = allVaccines.find(v => v.petId === petId && v.name === name)
    if (!existing) return
    const lbl = new Date(`${appliedDate}T12:00:00`).toLocaleDateString(i18n.language, {
      day:'2-digit', month:'short', year:'numeric',
    })
    setExtraVacc(prev => ({
      ...prev,
      [petId]: [
        ...(prev[petId] ?? []).filter(v => v.name !== name),
        { ...existing, applied: lbl, nextDate: appliedDate, badge: t('pet.vacc.badgeOk'), badgeCls:'badge-green' },
      ],
    }))
  }

  // ── MEDICATION EVENT MAP ───────────────────────────────────────────────────
  const medicationEventDates = useMemo<Record<string, MedEv[]>>(() => {
    const map: Record<string, MedEv[]> = {}

    for (const med of medications) {
      if (!med.startDate) continue

      const start = med.startDate
      const end   = med.endDate || start

      // ✅ petId guardado directamente no MedRecord — sem inferência por nome
      const pet      = pets.find(p => p.id === med.petId)
      const petId    = pet?.id    ?? ''
      const petName  = pet?.name  ?? ''
      const petEmoji = PET_EMOJI[pet?.species ?? ''] ?? '💊'

      let cursor = new Date(`${start}T12:00:00`)
      const limit = new Date(`${end}T12:00:00`)

      const pushDay = (dateStr: string) => {
        if (!map[dateStr]) map[dateStr] = []
        map[dateStr].push({
          id: med.id, date: dateStr, petId,
          name: med.title, dose: med.dose, frequency: med.frequency,
          petName, petEmoji,
        })
      }

      const freq = String(med.frequency || '')

      if (matchesFreq(freq, FREQ_DAILY)) {
        while (cursor <= limit) { pushDay(cursor.toISOString().split('T')[0]); cursor.setDate(cursor.getDate()+1) }
      } else if (matchesFreq(freq, FREQ_WEEKLY)) {
        while (cursor <= limit) { pushDay(cursor.toISOString().split('T')[0]); cursor.setDate(cursor.getDate()+7) }
      } else if (matchesFreq(freq, FREQ_BIWEEKLY)) {
        while (cursor <= limit) { pushDay(cursor.toISOString().split('T')[0]); cursor.setDate(cursor.getDate()+15) }
      } else if (matchesFreq(freq, FREQ_MONTHLY)) {
        while (cursor <= limit) { pushDay(cursor.toISOString().split('T')[0]); cursor.setMonth(cursor.getMonth()+1) }
      } else {
        pushDay(start)
      }
    }
    return map
  }, [medications, pets])

  // ── CARE EVENT MAP ─────────────────────────────────────────────────────────
  const careEventDates = useMemo(() => {
    const result: Record<string, { careId: string; seq: number }[]> = {}
    const monthStart = viewMonth
    const monthEnd   = new Date(viewMonth.getFullYear(), viewMonth.getMonth()+1, 0)

    for (const care of careItems) {
      const daysInterval = care.intervalDays > 0 ? care.intervalDays : intervalToDays(care.period ?? 'day', care.total)
      let cursor = addDays(monthStart, -90)
      let seq    = 0
      while (cursor <= addDays(monthEnd, 30)) {
        const d = toDateStr(cursor)
        if (d >= toDateStr(monthStart) && d <= toDateStr(monthEnd)) {
          if (!result[d]) result[d] = []
          result[d].push({ careId: care.id, seq })
        }
        cursor = addDays(cursor, daysInterval)
        seq++
      }
    }
    return result
  }, [careItems, viewMonth])

  const vaccineEventDates = useMemo((): Record<string, VaccEntry[]> => {
    const map: Record<string, VaccEntry[]> = {}
    for (const vac of allVaccines) {
      if (!vac.nextDate) continue
      if (!map[vac.nextDate]) map[vac.nextDate] = []
      map[vac.nextDate].push({ vaccKey:`${vac.petId}::${vac.name}`, expired: vac.nextDate < todayStr })
    }
    return map
  }, [allVaccines, todayStr])

  const vetEventDates = useMemo((): Record<string, VetEv[]> => {
    const map: Record<string, VetEv[]> = {}
    for (const ev of vetCalendarDates) {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    }
    return map
  }, [vetCalendarDates])

  // ── MONTH COUNTS ───────────────────────────────────────────────────────────
  const monthCounts = useMemo(() => {
    const counts = { pending:0, done:0, vacc_due:0, vacc_expired:0, vet_visit:0, vet_return:0, medication:0 }
    const year   = viewMonth.getFullYear()
    const month  = viewMonth.getMonth()
    const days   = new Date(year, month+1, 0).getDate()
    for (let d = 1; d <= days; d++) {
      const key = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      for (const { careId } of careEventDates[key] ?? []) {
        const care = careItems.find(c => c.id === careId)
        if (!care) continue
        getCareStatus(care.doneByDate as DoneByDate, key) === 'done' ? counts.done++ : counts.pending++
      }
      counts.medication += (medicationEventDates[key] ?? []).length
      for (const entry of vaccineEventDates[key] ?? []) {
        entry.expired ? counts.vacc_expired++ : counts.vacc_due++
      }
      for (const ev of vetEventDates[key] ?? []) {
        ev.kind === 'past' ? counts.vet_visit++ : counts.vet_return++
      }
    }
    return counts
  }, [careEventDates, careItems, medicationEventDates, vaccineEventDates, vetEventDates, viewMonth])

  // ── FILTER HELPERS ─────────────────────────────────────────────────────────
  const toggleFilter  = (key: string) =>
    setActiveFilters(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next })
  const clearFilters  = () => setActiveFilters(new Set())

  const dayPassesFilter = (day: string): boolean => {
    if (!activeFilters.size) return true
    const cares = careEventDates[day] ?? []
    if (activeFilters.has('pending') && cares.some(({ careId }) => {
      const c = careItems.find(x => x.id === careId)
      return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'pending'
    })) return true
    if (activeFilters.has('done') && cares.some(({ careId }) => {
      const c = careItems.find(x => x.id === careId)
      return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'done'
    })) return true
    if (activeFilters.has('medication') && (medicationEventDates[day] ?? []).length > 0) return true
    const vaccDay = vaccineEventDates[day] ?? []
    if (activeFilters.has('vacc_due')     && vaccDay.some(e => !e.expired)) return true
    if (activeFilters.has('vacc_expired') && vaccDay.some(e =>  e.expired)) return true
    const vetDay = vetEventDates[day] ?? []
    if (activeFilters.has('vet_visit')  && vetDay.some(ev => ev.kind === 'past')) return true
    if (activeFilters.has('vet_return') && vetDay.some(ev => ev.kind === 'next')) return true
    return false
  }

  // ── CALENDAR GRID ──────────────────────────────────────────────────────────
  const year         = viewMonth.getFullYear()
  const month        = viewMonth.getMonth()
  const totalDays    = new Date(year, month+1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const calendarCells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i+1),
  ]
  const prevMonth = () => setViewMonth(new Date(year, month-1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month+1, 1))
  const handleJumpChange = (val: string) => {
    setJumpMonth(val)
    const [y, m] = val.split('-').map(Number)
    if (y && m) setViewMonth(new Date(y, m-1, 1))
  }

  const getDayDots = (day: string) => {
    const dots: { color: string; key: string }[] = []
    const cares = careEventDates[day] ?? []
    const hasPending = cares.some(({ careId }) => {
      const c = careItems.find(x => x.id === careId)
      return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'pending'
    })
    const hasDone = cares.some(({ careId }) => {
      const c = careItems.find(x => x.id === careId)
      return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'done'
    })
    if (hasPending) dots.push({ color:'var(--warn)',    key:'pending'    })
    if (hasDone)    dots.push({ color:'var(--success)', key:'done'       })
    if ((medicationEventDates[day] ?? []).length > 0) dots.push({ color: MED_COLOR, key:'medication' })
    for (const entry of vaccineEventDates[day] ?? []) {
      dots.push({ color: entry.expired ? 'var(--err)' : 'var(--blue)', key:`vacc-${entry.expired}` })
    }
    for (const ev of vetEventDates[day] ?? []) {
      dots.push({ color: ev.kind === 'past' ? 'var(--primary)' : 'var(--warn)', key:`vet-${ev.kind}-${ev.petId}` })
    }
    return dots
  }

  // ── SELECTED DAY ───────────────────────────────────────────────────────────
  const selectedDayCares    = careEventDates[selectedDay]    ?? []
  const selectedDayMeds: MedEv[] = medicationEventDates[selectedDay] ?? []
  const selectedDayVaccines = vaccineEventDates[selectedDay] ?? []
  const selectedDayVet      = vetEventDates[selectedDay]     ?? []
  const expiredVaccines          = allVaccines.filter(v => v.nextDate && v.nextDate < todayStr)
  const expiredVaccinesPreview   = expiredVaccines.slice(0, 2)
  const expiredVaccinesRemaining = Math.max(0, expiredVaccines.length - expiredVaccinesPreview.length)
  const isDayEmpty =
    selectedDayVet.length      === 0 &&
    selectedDayMeds.length     === 0 &&
    selectedDayVaccines.length === 0 &&
    selectedDayCares.length    === 0

  const openEditCare = (careId: string) => {
    const care = careItems.find(c => c.id === careId)
    if (!care) return
    setEditCareItem({
      id: care.id, emoji: care.emoji, title: care.title, total: care.total,
      period: care.period, intervalDays: care.intervalDays, quantity: care.quantity ?? '',
      notify: care.notify, time: care.time, recurring: care.recurring, bg: care.bg,
    })
    setEditCareOpen(true)
  }
  const handleSaveEdit   = (updated: CareEditData) => { updateCare(updated); setEditCareOpen(false); setCareExpandIdx(null) }
  const handleDeleteCare = (id: string)             => { deleteCare(id);     setEditCareOpen(false); setCareExpandIdx(null) }

  const weekdaysShort: string[] = t('dates.weekdaysShort', { returnObjects: true })
  const monthNames:    string[] = t('dates.months',        { returnObjects: true })

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      {expiredVaccines.length > 0 && (
        <section className="alert-banner">
          <div className="alert-banner__main">
            <div className="alert-banner__title-row">
              <div className="alert-banner__title">🚨 {t('calendar.alertsTitle')}</div>
              <span className="badge badge-red">
                {expiredVaccines.length}{' '}
                {t('calendar.eventsCount', { n: expiredVaccines.length }).replace(/\d+ /, '')}
              </span>
            </div>
            <div className="alert-banner__list">
              {expiredVaccinesPreview.map(vac => (
                <div key={`${vac.petId}-${vac.name}-${vac.nextDate}`} className="alert-banner__item">
                  <div className="alert-banner__item-main">
                    <div className="alert-banner__pet">{vac.petEmoji}</div>
                    <div className="alert-banner__item-text">
                      <div className="alert-banner__item-top">
                        <span className="alert-banner__pet-name">{vac.petName}</span>
                        <span className="badge badge-red">{t('calendar.vacExpiredTag')}</span>
                      </div>
                      <div className="alert-banner__vacc-name">{vac.name}</div>
                      {vac.nextDate && (
                        <div className="alert-banner__meta">
                          {t('calendar.vacExpiredSince')} {vac.nextDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {expiredVaccinesRemaining > 0 && (
                <div className="alert-banner__item alert-banner__item--more">
                  <div className="alert-banner__item-text">
                    <div className="alert-banner__vacc-name">
                      {t('calendar.eventsCount', { n: expiredVaccinesRemaining })}
                    </div>
                    <div className="alert-banner__meta">{t('calendar.overdueHint')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="alert-banner__aside">
            <div className="alert-banner__warn">{t('calendar.alertsWarn')}</div>
          </div>
        </section>
      )}

      <div className="page-header">
        <div>
          <div className="page-title">{t('calendar.title')}</div>
          <div className="page-subtitle">{t('calendar.subtitle')}</div>
        </div>
      </div>

      <div className="cal-toolbar">
        <div className="cal-toolbar-top">
          <div className="cal-toolbar-nav">
            <input type="month" className="cal-jump" value={jumpMonth} onChange={e => handleJumpChange(e.target.value)}/>
            <button className="btn btn-secondary btn-sm"
              onClick={() => {
                setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))
                setJumpMonth(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`)
                setSelectedDay(todayStr)
              }}>
              {t('calendar.today')}
            </button>
          </div>
        </div>
        <div className="cal-toolbar-bottom">
          <div className="cal-filters">
            <div className="cal-filters-head">
              <div className="cal-filters-label">{t('calendar.filterLabel')}</div>
              {activeFilters.size > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>{t('calendar.clearFilters')}</button>
              )}
            </div>
            <div className="cal-filters-groups">
              {FILTER_GROUPS.map(group => (
                <div key={group.id} className="cal-filter-group">
                  <div className="cal-filter-group-label">{group.label}</div>
                  <div className="cal-filter-group-chips">
                    {group.filters.map(f => {
                      const isOn  = activeFilters.has(f.key)
                      const count = monthCounts[f.key as keyof typeof monthCounts] ?? 0
                      return (
                        <button key={f.key} className="cal-filter-chip"
                          onClick={() => toggleFilter(f.key)}
                          title={isOn ? `${t('btn.close')} "${f.label}"` : `${t('calendar.filterLabel')}: "${f.label}"`}
                          style={{
                            borderColor: isOn ? f.color : 'var(--border)',
                            background:  isOn ? f.bg    : 'var(--surface)',
                            color:       isOn ? f.color : 'var(--text-muted)',
                            fontWeight:  isOn ? 800     : 700,
                          }}>
                          <span>{f.emoji}</span>
                          <span>{f.label}</span>
                          {count > 0 && <span className="cal-filter-chip__count">{count}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="cal-layout">
        <div className="cal-grid-wrap">
          <div className="cal-month-header">
            <button className="btn btn-secondary btn-sm" onClick={prevMonth} aria-label={t('calendar.monthPrev')}>‹</button>
            <div className="cal-month-label">{monthNames[month]} {year}</div>
            <button className="btn btn-secondary btn-sm" onClick={nextMonth} aria-label={t('calendar.monthNext')}>›</button>
          </div>
          <div className="cal-grid cal-grid--header"
            style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(0, 1fr))', gap:'.55rem' }}>
            {weekdaysShort.map(wd => <div key={wd}>{wd}</div>)}
          </div>
          <div className="cal-grid"
            style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(0, 1fr))', gap:'.55rem' }}>
            {calendarCells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="cal-cell cal-cell--dimmed" aria-hidden="true"/>
              const key        = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const isToday    = key === todayStr
              const isSelected = key === selectedDay
              const passes     = dayPassesFilter(key)
              const dots       = getDayDots(key)
              return (
                <button key={key}
                  className={['cal-cell', isToday?'cal-cell--today':'', isSelected?'cal-cell--selected':'', !passes?'cal-cell--dimmed':''].filter(Boolean).join(' ')}
                  onClick={() => setSelectedDay(key)}
                  aria-label={`${day} ${monthNames[month]} ${year}`}
                  aria-pressed={isSelected}>
                  <div className="cal-cell__day">{day}</div>
                  {dots.length > 0 && (
                    <div className="cal-dots">
                      {dots.slice(0,4).map((dot, di) => (
                        <span key={`${dot.key}-${di}`} className="cal-dot" style={{ background: dot.color }}/>
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="cal-detail" ref={detailRef}>
          <div className="cal-detail__date">
            {(() => {
              const [y, m, d] = selectedDay.split('-').map(Number)
              return new Date(y, m-1, d).toLocaleDateString(i18n.language, {
                weekday:'long', day:'numeric', month:'long',
              })
            })()}
          </div>

          {isDayEmpty && <div className="empty">{t('calendar.dayEmpty')}</div>}

          {selectedDayVet.length > 0 && (
            <div className="cal-detail__section">
              <div className="cal-detail__section-title">{t('calendar.dayVetVisits')}</div>
              {selectedDayVet.map((ev, idx) => (
                <div key={`${ev.date}-${ev.petId}-${idx}`} className="vet-row">
                  <div className="vet-row__icon">{ev.kind === 'past' ? '🩺' : '🔄'}</div>
                  <div className="vet-row__info">
                    <div className="vet-row__label">{ev.label}</div>
                    <div className="vet-row__kind">
                      {ev.kind === 'past' ? t('calendar.vetVisitKind') : t('calendar.vetReturnKind')}
                    </div>
                  </div>
                  <span className={`badge ${ev.kind === 'past' ? 'badge-blue' : 'badge-yellow'}`}>
                    {ev.kind === 'past' ? t('calendar.vetVisitKind') : t('calendar.vetReturnKind')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {selectedDayMeds.length > 0 && (
            <div className="cal-detail__section">
              <div className="cal-detail__section-title">{t('calendar.dayMedications')}</div>
              {selectedDayMeds.map(med => (
                <div key={med.id} className="med-row">
                  <div className="med-row__icon">💊</div>
                  <div className="med-row__info">
                    <div className="med-row__name">{med.name}</div>
                    <div className="med-row__pet">
                      {med.petEmoji} {med.petName}
                      {med.dose      ? ` · ${med.dose}`      : ''}
                      {med.frequency ? ` · ${med.frequency}` : ''}
                    </div>
                  </div>
                  <span className="badge badge--purple">{t('calendar.medication')}</span>
                </div>
              ))}
            </div>
          )}

          {selectedDayVaccines.length > 0 && (
            <div className="cal-detail__section">
              <div className="cal-detail__section-title">{t('calendar.dayVaccines')}</div>
              {selectedDayVaccines.map(entry => {
                const vacc = allVaccines.find(v => `${v.petId}::${v.name}` === entry.vaccKey)
                if (!vacc) return null
                return (
                  <div key={entry.vaccKey} className="vacc-row">
                    <div className="vacc-row__icon">💉</div>
                    <div className="vacc-row__info">
                      <div className="vacc-row__name">{vacc.name}</div>
                      <div className="vacc-row__pet">{vacc.petEmoji} {vacc.petName}</div>
                    </div>
                    {entry.expired ? (
                      <span className="badge badge-red">🚨 {t('calendar.vacExpiredTag')}</span>
                    ) : (
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => handleVaccineApplied(entry.vaccKey, selectedDay)}>
                        💉 {t('calendar.vaccineApply')}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {selectedDayCares.length > 0 && (
            <div className="cal-detail__section">
              <div className="cal-detail__section-title">{t('calendar.dayCares')}</div>
              {selectedDayCares.map(({ careId }, listIdx) => {
                const care     = careItems.find(c => c.id === careId)
                if (!care) return null
                const status   = getCareStatus(care.doneByDate as DoneByDate, selectedDay)
                const isDone   = status === 'done'
                const isSkip   = status === 'skip'
                const expanded = careExpandIdx === listIdx
                return (
                  <div key={`${careId}-${listIdx}`} className="care-row">
                    <button className="care-row__header" onClick={() => setCareExpandIdx(expanded ? null : listIdx)}>
                      <div style={{ fontSize:'1.3rem' }}>{care.emoji}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="care-title">{care.title}</div>
                        {care.sub && <div className="care-sub">{care.sub}</div>}
                      </div>
                      {isDone && <span className="badge badge-green">✓ {t('calendar.careDone')}</span>}
                      {isSkip && <span className="badge badge-gray">{t('calendar.careSkipped')}</span>}
                      {!isDone && !isSkip && <span className="badge badge-yellow">{t('calendar.carePending')}</span>}
                    </button>
                    {expanded && (
                      <div className="care-row__actions">
                        {!isDone && (
                          <button className="btn btn-primary btn-sm"
                            onClick={() => setCareProgress(careId, selectedDay, care.total, true)}>
                            ✓ {t('calendar.careDone')}
                          </button>
                        )}
                        {isDone && (
                          <button className="btn btn-secondary btn-sm"
                            onClick={() => setCareProgress(careId, selectedDay, 0, false)}>
                            ↺ {t('calendar.carePending')}
                          </button>
                        )}
                        {!isSkip && !isDone && (
                          <button className="btn btn-ghost btn-sm"
                            onClick={() => setCareProgress(careId, selectedDay, 0, false)}>
                            {t('calendar.careSkipped')}
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditCare(careId)}>
                          ✏️ {t('calendar.editCare')}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <EditCareModal
        isOpen={editCareOpen}
        onClose={() => { setEditCareOpen(false); setCareExpandIdx(null) }}
        care={editCareItem}
        onSave={handleSaveEdit}
        onDelete={handleDeleteCare}
      />
    </>
  )
}
```

## File: src/pages/LoginPage.tsx
```typescript
//traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// ── Helpers ───────────────────────────────────────────────────────
function PitutiMark() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="14" fill="url(#logo-grad)"/>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%"   stopColor="#c4b5e0"/>
          <stop offset="100%" stopColor="#8B9FD4"/>
        </linearGradient>
      </defs>
      <circle cx="26" cy="30" r="14" fill="rgba(42,52,98,.85)"/>
      <polygon points="14,21 18,10 24,20" fill="rgba(42,52,98,.85)"/>
      <polygon points="15.5,20.5 18.5,12 22.5,19.5" fill="rgba(196,181,224,.5)"/>
      <polygon points="28,20 34,10 38,21" fill="rgba(42,52,98,.85)"/>
      <polygon points="29.5,19.5 33.5,12 36.5,20.5" fill="rgba(196,181,224,.5)"/>
      <circle cx="21" cy="29" r="3" fill="#D4A820"/>
      <ellipse cx="21" cy="29" rx="1.2" ry="3" fill="#0C0808"/>
      <circle cx="22.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)"/>
      <circle cx="31" cy="29" r="3" fill="#D4A820"/>
      <ellipse cx="31" cy="29" rx="1.2" ry="3" fill="#0C0808"/>
      <circle cx="32.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)"/>
      <path d="M25 33 L26 34.5 L27 33 Z" fill="#F0A0B8"/>
      <line x1="14" y1="32" x2="22" y2="32.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.8"/>
      <line x1="14" y1="34" x2="22" y2="33.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.7"/>
      <line x1="30" y1="32.5" x2="38" y2="32"  stroke="rgba(255,255,255,.5)" strokeWidth="0.8"/>
      <line x1="30" y1="33.5" x2="38" y2="34"  stroke="rgba(255,255,255,.5)" strokeWidth="0.7"/>
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
    </svg>
  )
}

// ── Input component ───────────────────────────────────────────────
interface FormFieldProps {
  type: string; label: string; value: string
  onChange: (v: string) => void; placeholder: string
  icon: React.ReactNode; error?: string; hint?: string
  extra?: React.ReactNode; disabled?: boolean
}

function FormField({ type, label, value, onChange, placeholder, icon, error, hint, extra, disabled }: FormFieldProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.375rem' }}>
        <label style={{ fontSize: '.8125rem', fontWeight: 700, color: 'var(--text-muted)' }}>{label}</label>
        {extra}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.5rem',
        background: 'var(--surface)',
        border: `1.5px solid ${error ? 'var(--err)' : focused ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)', padding: '.625rem .875rem',
        boxShadow: focused ? '0 0 0 3px var(--primary-hl)' : error ? '0 0 0 3px var(--err-hl)' : 'none',
        transition: 'all var(--trans)',
      }}>
        <span style={{ color: error ? 'var(--err)' : focused ? 'var(--primary)' : 'var(--text-faint)', flexShrink: 0 }}>{icon}</span>
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '.9rem', color: 'var(--text)' }}
        />
      </div>
      {error    && <div style={{ fontSize: '.75rem', color: 'var(--err)',        marginTop: '.3rem', fontWeight: 600 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.3rem' }}>{hint}</div>}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────
function OrDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', margin: '1.125rem 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}/>
      <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-faint)' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}/>
    </div>
  )
}

// ── Social Button ─────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
        padding: '.6rem 1rem',
        border: `1.5px solid ${hovered ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)',
        background: hovered ? 'var(--primary-hl)' : 'var(--surface)',
        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '.8125rem',
        color: 'var(--text)', transition: 'all var(--trans)', minHeight: 44,
      }}
    >
      {icon}{label}
    </button>
  )
}

// ── Main LoginPage ────────────────────────────────────────────────
type Mode = 'login' | 'register' | 'forgot'

export default function LoginPage() {
  const navigate    = useNavigate()
  const { t }       = useTranslation()
  const [mode, setMode] = useState<Mode>('login')

  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [rememberMe, setRememberMe] = useState(true)

  const clearErrors = () => setErrors({})
  const reset       = () => { setEmail(''); setPassword(''); setConfirm(''); setName(''); clearErrors() }

  // ── Validation ────────────────────────────────────────────────
  const validateLogin = () => {
    const e: Record<string, string> = {}
    if (!email.trim())                     e.email    = t('login.errEmailRequired')
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t('login.errEmailInvalid')
    if (!password)                         e.password = t('login.errPasswordRequired')
    return e
  }

  const validateRegister = () => {
    const e: Record<string, string> = {}
    if (!name.trim())                      e.name     = t('login.errNameRequired')
    if (!email.trim())                     e.email    = t('login.errEmailRequired')
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t('login.errEmailInvalid')
    if (!password)                         e.password = t('login.errPasswordRequired')
    else if (password.length < 8)          e.password = t('login.errPasswordMin')
    if (password !== confirm)              e.confirm  = t('login.errPasswordMatch')
    return e
  }

  const validateForgot = () => {
    const e: Record<string, string> = {}
    if (!email.trim())                     e.email = t('login.errEmailRequired')
    else if (!/\S+@\S+\.\S+/.test(email))  e.email = t('login.errEmailInvalid')
    return e
  }

  const handleSubmit = () => {
    const errs = mode === 'login' ? validateLogin() : mode === 'register' ? validateRegister() : validateForgot()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === 'forgot') { setSuccess(true); return }
      navigate('/dashboard')
    }, 1200)
  }

  const switchMode = (m: Mode) => { setMode(m); reset(); setSuccess(false) }

  // ── Icons ─────────────────────────────────────────────────────
  const emailIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
  const nameIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
  const lockIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: 'var(--bg)' }}>

      {/* ── Left panel — branding (desktop only) ── */}
      <div className="login-brand-panel">
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: 'auto' }}>
            <PitutiMark/>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontStyle: 'italic', color: 'white', letterSpacing: '-.01em' }}>Pituti</span>
          </div>

          <div style={{ marginBottom: 'auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,2.75rem)', color: 'white', fontWeight: 400, lineHeight: 1.15, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
              {t('login.heroTitle')}
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.72)', lineHeight: 1.6, maxWidth: 340 }}>
              {t('login.heroSubtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '2rem' }}>
            {[
              `💉 ${t('nav.vaccines')}`,
              `💊 ${t('nav.medications')}`,
              `🐾 ${t('nav.cares')}`,
              `📋 ${t('nav.notes')}`,
              `📅 ${t('nav.calendar')}`,
              `👥 ${t('modal.caregiver')}`,
            ].map((f) => (
              <span key={f} style={{ background: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.9)', borderRadius: 'var(--r-full)', padding: '.3rem .875rem', fontSize: '.8125rem', fontWeight: 700, border: '1px solid rgba(255,255,255,.2)' }}>
                {f}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex' }}>
              {['🐱', '🐶', '🦜', '🐰', '🦎'].map((e, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(255,255,255,.5)', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.875rem', marginLeft: i > 0 ? -8 : 0 }}>{e}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '.875rem', fontWeight: 700, color: 'white' }}>+2.400 {t('login.socialProof')}</div>
              <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)' }}>{t('login.heroSubtitle').split('.')[0]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem', minHeight: '100dvh' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="login-mobile-logo">
            <PitutiMark/>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--text)' }}>Pituti</span>
          </div>

          {/* Card */}
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '2rem 1.75rem', boxShadow: 'var(--sh-lg)' }}>

            {/* Tabs */}
            {mode !== 'forgot' && (
              <div style={{ display: 'flex', background: 'var(--surface-offset)', borderRadius: 'var(--r-lg)', padding: '.25rem', marginBottom: '1.5rem' }}>
                {(['login', 'register'] as Mode[]).map((m) => (
                  <button key={m} onClick={() => switchMode(m)}
                    style={{ flex: 1, padding: '.5rem', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '.875rem', transition: 'all 160ms',
                      background: mode === m ? 'var(--surface)' : 'transparent',
                      color:      mode === m ? 'var(--text)'    : 'var(--text-muted)',
                      boxShadow:  mode === m ? 'var(--sh-sm)'   : 'none',
                    }}>
                    {m === 'login' ? t('login.tabLogin') : t('login.tabRegister')}
                  </button>
                ))}
              </div>
            )}

            {/* ── Forgot password ── */}
            {mode === 'forgot' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <button onClick={() => switchMode('login')} style={{ display: 'flex', alignItems: 'center', gap: '.375rem', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '.875rem', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '.875rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  {t('login.backToLogin')}
                </button>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '.375rem' }}>
                  {t('login.forgotTitle')}
                </div>
                <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {t('login.forgotSubtitle')}
                </div>
              </div>
            )}

            {/* ── Success state (forgot) ── */}
            {success && mode === 'forgot' ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-hl)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1rem' }}>✉️</div>
                <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text)', marginBottom: '.5rem' }}>
                  {t('login.emailSentTitle')}
                </div>
                <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}
                  dangerouslySetInnerHTML={{ __html: t('login.emailSentBody', { email: `<strong style="color:var(--text)">${email}</strong>` }) }}
                />
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', minHeight: 48 }} onClick={() => switchMode('login')}>
                  {t('login.backToLogin')}
                </button>
              </div>
            ) : (
              <>
                {/* ── Login / Register titles ── */}
                {mode === 'login' && (
                  <div style={{ marginBottom: '1.125rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '.25rem' }}>
                      {t('login.loginTitle')}
                    </div>
                    <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
                      {t('login.loginSubtitle')}
                    </div>
                  </div>
                )}
                {mode === 'register' && (
                  <div style={{ marginBottom: '1.125rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '.25rem' }}>
                      {t('login.registerTitle')}
                    </div>
                    <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
                      {t('login.registerSubtitle')}
                    </div>
                  </div>
                )}

                {/* ── Form fields ── */}
                {mode === 'register' && (
                  <FormField
                    type="text"
                    label={t('settings.fullName')}
                    value={name}
                    onChange={(v) => { setName(v); clearErrors() }}
                    placeholder="Thamires Lopes"
                    icon={nameIcon}
                    error={errors.name}
                  />
                )}
                <FormField
                  type="email"
                  label={t('settings.email')}
                  value={email}
                  onChange={(v) => { setEmail(v); clearErrors() }}
                  placeholder="nome@email.com"
                  icon={emailIcon}
                  error={errors.email}
                />
                <FormField
                  type={showPwd ? 'text' : 'password'}
                  label={t('login.labelPassword')}
                  value={password}
                  onChange={(v) => { setPassword(v); clearErrors() }}
                  placeholder={mode === 'register' ? t('login.errPasswordMin') : '••••••••'}
                  icon={lockIcon}
                  error={errors.password}
                  hint={mode === 'register' ? t('login.errPasswordMin') : undefined}
                  extra={
                    <button
                      onClick={() => setShowPwd((p) => !p)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.25rem', fontSize: '.75rem', fontWeight: 700, fontFamily: 'inherit' }}
                    >
                      <EyeIcon open={showPwd}/>
                      {showPwd ? t('login.hidePassword') : t('login.showPassword')}
                    </button>
                  }
                />
                {mode === 'register' && (
                  <FormField
                    type={showPwd ? 'text' : 'password'}
                    label={t('login.labelConfirm')}
                    value={confirm}
                    onChange={(v) => { setConfirm(v); clearErrors() }}
                    placeholder="••••••••"
                    icon={lockIcon}
                    error={errors.confirm}
                  />
                )}

                {/* ── Remember + Forgot ── */}
                {mode === 'login' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', marginTop: '-.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: '.8125rem', color: 'var(--text-muted)' }}>
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}/>
                      {t('login.rememberMe')}
                    </label>
                    <button onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {t('login.forgotPassword')}
                    </button>
                  </div>
                )}

                {/* ── T&C for register ── */}
                {mode === 'register' && (
                  <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {t('login.termsPrefix')}{' '}
                    <a href="#" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('login.termsLink')}</a>
                    {' '}{t('login.termsAnd')}{' '}
                    <a href="#" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('login.privacyLink')}</a>.
                  </div>
                )}

                {/* ── Submit ── */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: '100%', minHeight: 48,
                    background: loading ? 'var(--primary-hl)' : 'linear-gradient(150deg, var(--primary) 0%, #3a4c80 100%)',
                    color: loading ? 'var(--primary)' : '#fff',
                    border: 'none', borderRadius: 'var(--r-lg)',
                    fontFamily: 'inherit', fontWeight: 800, fontSize: '.9375rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.625rem',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(91,108,158,.4)',
                    transition: 'all 160ms',
                    marginBottom: '.875rem',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin .7s linear infinite', display: 'inline-block' }}/>
                      {mode === 'login'    ? t('login.submittingLogin')
                     : mode === 'register' ? t('login.submittingRegister')
                     :                       t('login.submittingForgot')}
                    </>
                  ) : (
                    <>
                      {mode === 'login'    ? t('login.submitLogin')
                     : mode === 'register' ? t('login.submitRegister')
                     :                       t('login.submitForgot')}
                    </>
                  )}
                </button>

                {/* ── Social auth ── */}
                {mode !== 'forgot' && (
                  <>
                    <OrDivider label={t('login.orContinueWith')} />
                    <div style={{ display: 'flex', gap: '.625rem' }}>
                      <SocialBtn icon={<GoogleIcon/>} label="Google" onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); navigate('/dashboard') }, 900) }}/>
                      <SocialBtn icon={<AppleIcon/>}  label="Apple"  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); navigate('/dashboard') }, 900) }}/>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Bottom link */}
          {!success && (
            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: 'var(--text-muted)' }}>
              {mode === 'login' && (
                <>
                  {t('login.noAccount')}{' '}
                  <button onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                    {t('login.registerFree')}
                  </button>
                </>
              )}
              {mode === 'register' && (
                <>
                  {t('login.hasAccount')}{' '}
                  <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                    {t('login.signIn')}
                  </button>
                </>
              )}
            </p>
          )}

          {/* Demo shortcut */}
          {mode !== 'forgot' && (
            <div style={{ textAlign: 'center', marginTop: '.75rem' }}>
              <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: '.75rem', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline dotted' }}>
                {t('login.enterDemo')}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .login-brand-panel {
          width: 45%; min-height: 100dvh;
          background: linear-gradient(160deg, #2A3462 0%, #1a2050 40%, #3d2a62 100%);
          padding: 3rem 3.5rem; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }
        .login-brand-panel::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 60%, rgba(196,181,224,.18) 0%, transparent 60%),
                      radial-gradient(circle at 70% 20%, rgba(139,159,212,.14) 0%, transparent 50%);
        }
        .login-mobile-logo { display: none; }
        @media (max-width: 768px) {
          .login-brand-panel { display: none; }
          .login-mobile-logo {
            display: flex; align-items: center; gap: .625rem;
            justify-content: center; margin-bottom: 1.5rem;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
```

## File: src/pages/SymptomsPage.tsx
```typescript
// traduzido e mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import { useSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'
import type { SymptomData } from '../components/RegisterSymptomModal'
import { usePetsContext } from '../context/PetsContext'
import BackButton from '../components/BackButton'

const SEV_ICON:  Record<string, string> = { leve:'🟡', moderado:'🟠', grave:'🔴', emergencia:'🚨' }
const SEV_BADGE: Record<string, string> = { leve:'badge-yellow', moderado:'badge-yellow', grave:'badge-red', emergencia:'badge-red' }
const CAT_ICON:  Record<string, string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }
const SEV_COLOR: Record<string, string> = { leve:'var(--gold)', moderado:'var(--warn)', grave:'var(--err)', emergencia:'var(--err)' }
const SEV_BG:    Record<string, string> = { leve:'var(--gold-hl)', moderado:'var(--warn-hl)', grave:'var(--err-hl)', emergencia:'var(--err-hl)' }

const PET_EMOJI_SPECIES: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

function PencilIcon({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}

export default function SymptomsPage() {
  const { t } = useTranslation()
  const { symptoms, addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const { pets } = usePetsContext()

  const [addOpen,   setAddOpen]   = useState(false)
  const [detailSym, setDetailSym] = useState<SymptomEntry | null>(null)
  const [editSym,   setEditSym]   = useState<SymptomEntry | null>(null)
  const [editOpen,  setEditOpen]  = useState(false)

  const active   = symptoms.filter(s => !s.resolved)
  const resolved = symptoms.filter(s =>  s.resolved)

  const openEdit = (s: SymptomEntry) => { setEditSym(s); setEditOpen(true) }

  // ✅ lookup dinâmico via contexto
  const getPet = (petId: string) => pets.find(p => p.id === petId)
  const getPetEmoji = (petId: string) => PET_EMOJI_SPECIES[getPet(petId)?.species ?? ''] ?? '🐾'
  const getPetName  = (petId: string) => getPet(petId)?.name ?? petId

  const handleAdd = (d: SymptomData) => {
    addSymptom({ ...d, resolved: false })
    showToast(`${SEV_ICON[d.severity] ?? '🌡️'} ${t('pet.symptoms.toastAdded')}`)
  }

  const SymptomRow = ({ s, dim = false }: { s: SymptomEntry; dim?: boolean }) => (
    <div className="list-item symptom-row-clickable" style={{ opacity: dim ? .7 : 1 }} onClick={() => setDetailSym(s)}>
      <div className="list-item-icon" style={{
        background: dim ? 'var(--surface-offset)' : SEV_BG[s.severity]  || 'var(--err-hl)',
        color:      dim ? 'var(--text-faint)'      : SEV_COLOR[s.severity] || 'var(--err)',
      }}>
        {CAT_ICON[s.category] ?? '🌡️'}
      </div>
      <div className="list-item-info">
        <div className="list-item-title">
          {SEV_ICON[s.severity]} {s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''} — {getPetEmoji(s.petId)} {getPetName(s.petId)}
        </div>
        <div className="list-item-sub">
          {new Date(s.date + 'T12:00:00').toLocaleDateString(t('dates.locale'))} · {t(`symptoms.categoryOptions.${s.category}` as any)}
          {s.resolved ? ` · ${t('pet.symptoms.statusResolved')}` : ` · ${t('pet.symptoms.statusActive')}`}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'.25rem', alignItems:'flex-end', flexShrink:0 }}>
        <span className={`badge ${s.resolved ? 'badge-gray' : SEV_BADGE[s.severity] ?? 'badge-yellow'}`}>
          {s.resolved ? t('pet.symptoms.statusResolved') : t('pet.symptoms.statusActive')}
        </span>
        <button className="med-edit-btn" style={{ width:26, height:26 }} title={t('btn.edit')}
          onClick={e => { e.stopPropagation(); openEdit(s) }}>
          <PencilIcon size={12}/>
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('symptoms.title')}</div>
          <div className="page-subtitle">{t('symptoms.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          {t('symptoms.register')}
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            {t('symptoms.active')}
            {/* ✅ chave existente: pet.symptoms.statusActive */}
            {active.length > 0 && (
              <span className="badge badge-red">
                {active.length} {t('pet.symptoms.statusActive')}
              </span>
            )}
          </div>
          {active.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
                {t('symptoms.noActive')} ✓
              </div>
            : active.map(s => <SymptomRow key={s.id} s={s}/>)
          }
        </div>

        <div className="card">
          <div className="card-title">{t('symptoms.resolved')}</div>
          {resolved.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
                {t('symptoms.noResolved')}
              </div>
            : resolved.map(s => <SymptomRow key={s.id} s={s} dim/>)
          }
        </div>
      </div>

      <div className="card" style={{ marginTop:'1.125rem' }}>
        <div className="card-title">{t('symptoms.history')}</div>
        <div className="timeline">
          {[...active, ...resolved].slice(0, 8).map(s => (
            <div key={s.id} className="timeline-item symptom-row-clickable" onClick={() => setDetailSym(s)}>
              <div className="tl-icon symptom">{CAT_ICON[s.category] ?? '🌡️'}</div>
              <div style={{ flex:1 }}>
                <div className="tl-title">
                  {s.description.slice(0, 50)}{s.description.length > 50 ? '…' : ''} · {getPetEmoji(s.petId)} {getPetName(s.petId)}
                </div>
                <div className="tl-meta">
                  {/* ✅ chaves existentes em todos os JSONs */}
                  {s.resolved ? t('pet.symptoms.statusResolved') : t('pet.symptoms.statusActive')} · {t(`symptoms.categoryOptions.${s.category}` as any)}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.25rem' }}>
                <div className="tl-time">
                  {new Date(s.date + 'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short' })}
                </div>
                <button className="med-edit-btn" style={{ width:24, height:24 }}
                  onClick={e => { e.stopPropagation(); openEdit(s) }}>
                  <PencilIcon size={11}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegisterSymptomModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>

      <SymptomDetailModal
        symptom={detailSym}
        onClose={() => setDetailSym(null)}
        onEdit={s => { setDetailSym(null); openEdit(s) }}
        onResolve={id => { resolve(id); showToast(`✓ ${t('toast.symptomResolved')}`) }}
        onUnresolve={id => { unresolve(id); showToast(`↩ ${t('toast.symptomReopened')}`) }}
      />

      <EditSymptomModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        symptom={editSym}
        onSave={updated => { saveSymptom(updated); setEditOpen(false) }}
      />
    </div>
  )
}
```

## File: src/styles/pages/calendar.css
```css
/* ── Event Row ──────────────────────────────────────────── */
.event-row { display: flex; align-items: center; gap: .875rem; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: .875rem 1.125rem; box-shadow: var(--sh-sm); cursor: pointer; transition: box-shadow var(--trans), border-color var(--trans), transform var(--trans) }
.event-row:hover { box-shadow: var(--sh-md); border-color: var(--pal-denim); transform: translateY(-1px) }
.event-row.event-urgent { border-color: rgba(200,64,106,.35); background: var(--err-hl) }
.event-date-badge { display: flex; flex-direction: column; align-items: center; min-width: 36px; text-align: center }
.edb-day { font-size: 1.25rem; font-weight: 800; line-height: 1; color: var(--text) }
.edb-mon { font-size: .6rem; font-weight: 800; letter-spacing: .08em; color: var(--text-faint); text-transform: uppercase }
.event-icon { width: 40px; height: 40px; border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0 }
.event-info { flex: 1; min-width: 0 }
.event-title { font-size: .875rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
.event-sub   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem }


/* ── Calendar Page ───────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════
CALENDAR 
═══════════════════════════════════════════════════════════ */

.alert-banner {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
  gap: 1.25rem;
  align-items: start;
  padding: 1.25rem 1.35rem;
  margin-bottom: 1.5rem;
  background:
    linear-gradient(180deg, #fff7f9 0%, #fff1f4 100%);
  border: 1px solid rgba(200, 64, 106, .14);
  border-radius: 1.5rem;
  box-shadow:
    0 1px 0 rgba(255,255,255,.85) inset,
    0 12px 34px rgba(200,64,106,.08);
}

.alert-banner__title {
  display: flex;
  align-items: center;
  gap: .6rem;
  font-size: 1.05rem;
  font-weight: 900;
  color: #6b233d;
  margin-bottom: .85rem;
  letter-spacing: -.01em;
}

.alert-banner__list {
  display: flex;
  flex-direction: column;
  gap: .65rem;
}

.alert-banner__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .875rem;
  padding: .85rem .95rem;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(200,64,106,.10);
  border-radius: 1rem;
  backdrop-filter: blur(6px);
}

.alert-banner__item-main {
  display: flex;
  align-items: center;
  gap: .75rem;
  min-width: 0;
}

.alert-banner__pet {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(200,64,106,.08);
  font-size: .95rem;
  flex-shrink: 0;
}

.alert-banner__item-text {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .45rem;
}

.alert-banner__pet-name {
  font-size: .84rem;
  font-weight: 800;
  color: var(--text);
}

.alert-banner__vacc-name {
  font-size: .88rem;
  font-weight: 800;
  color: var(--text);
}

.alert-banner__meta {
  font-size: .8rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.alert-banner__warn,
.alert-banner-warn {
  align-self: center;
  justify-self: end;
  max-width: 280px;
  padding: .95rem 1rem;
  border-radius: 1rem;
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(200,64,106,.10);
  color: var(--err);
  font-size: .84rem;
  font-weight: 800;
  line-height: 1.45;
  text-align: left;
}

.cal-toolbar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
  padding: 1.15rem 1.25rem;
  margin-bottom: 1rem;
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(91,108,158,.10);
  border-radius: 1.5rem;
  box-shadow:
    0 1px 0 rgba(255,255,255,.95) inset,
    0 10px 28px rgba(44,52,98,.06);
  backdrop-filter: blur(10px);
}

.cal-toolbar > div:first-child {
  display: flex;
  align-items: center;
  gap: .75rem;
  flex-wrap: wrap;
}

.cal-jump {
  min-width: 170px;
  height: 44px;
  padding: 0 1rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.75);
}

.cal-filters {
  display: flex;
  flex-direction: column;
  gap: .9rem;
  min-width: 0;
}

.cal-filters-label,
.cal-filters__label {
  font-size: .74rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.cal-filter-group {
  display: flex;
  align-items: center;
  gap: .65rem;
  flex-wrap: wrap;
}

.cal-filter-group-label,
.cal-filter-group__label {
  min-width: 108px;
  font-size: .78rem;
  font-weight: 900;
  color: var(--text);
  letter-spacing: .03em;
}

.cal-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(340px, .8fr);
  gap: 1rem;
  align-items: start;
}

.cal-grid-wrap,
.cal-detail {
  background:
    linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(254,249,247,.92) 100%);
  border: 1px solid rgba(91,108,158,.10);
  border-radius: 1.7rem;
  box-shadow:
    0 1px 0 rgba(255,255,255,.95) inset,
    0 14px 32px rgba(44,52,98,.07);
}

.cal-grid-wrap {
  padding: 1.15rem;
}

.cal-detail {
  padding: 1.2rem;
  position: sticky;
  top: 1rem;
}

.cal-month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  margin-bottom: 1rem;
}

.cal-month-label {
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -.02em;
  color: var(--text);
}

.cal-grid--header {
  margin-bottom: .45rem;
}

.cal-grid--header > div {
  font-size: .73rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.cal-cell {
  min-height: 104px;
  padding: .7rem .72rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(91,108,158,.08);
  background:
    linear-gradient(180deg, rgba(255,255,255,.82), rgba(250,245,242,.9));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.92);
  transition:
    transform var(--trans),
    background var(--trans),
    border-color var(--trans),
    box-shadow var(--trans);
}

.cal-cell:hover {
  transform: translateY(-2px);
  border-color: rgba(91,108,158,.18);
  background: linear-gradient(180deg, #ffffff 0%, #f8f2ef 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.96),
    0 8px 18px rgba(44,52,98,.08);
}

.cal-cell--today {
  background:
    linear-gradient(180deg, rgba(91,108,158,.08), rgba(255,255,255,.92));
  border-color: rgba(91,108,158,.22);
}

.cal-cell--selected {
  background:
    linear-gradient(180deg, rgba(70,108,176,.13), rgba(255,255,255,.94));
  border-color: rgba(70,108,176,.72);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.95),
    0 0 0 4px rgba(70,108,176,.10),
    0 10px 24px rgba(70,108,176,.12);
}

.cal-cell--dimmed {
  opacity: .35;
}

.cal-cell__day {
  font-size: .95rem;
  font-weight: 900;
  color: var(--text);
  letter-spacing: -.02em;
}

.cal-dots {
  display: flex;
  flex-wrap: wrap;
  gap: .32rem;
  margin-top: .55rem;
}

.cal-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.45),
    0 1px 2px rgba(0,0,0,.08);
}

.cal-detail__date {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--text);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--divider);
  text-transform: capitalize;
  letter-spacing: -.02em;
}

.cal-detail__section {
  margin-bottom: 1.1rem;
}

.cal-detail__section:last-child {
  margin-bottom: 0;
}

.cal-detail__section-title {
  font-size: .74rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: .75rem;
}

/* --- FILTROS DE CALENDARIO ----*/
.cal-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  min-height: 36px;
  padding: .45rem .78rem;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: .8rem;
  font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
  transition: transform var(--trans), box-shadow var(--trans), border-color var(--trans), background var(--trans), color var(--trans);
}

.cal-filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(44,52,98,.08);
}

.cal-filter-chip__count {
  min-width: 20px;
  height: 20px;
  padding: 0 .38rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.06);
  font-size: .68rem;
  font-weight: 900;
}

* ──────────────────────────────────────────────────────────────
   Calendar toolbar & filter chips
   ────────────────────────────────────────────────────────────── */

/* Override the grouped display:grid — toolbar is now flex */
.cal-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: .75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

/* Left side: month input + today button */
.cal-toolbar__nav {
  display: flex;
  align-items: center;
  gap: .5rem;
  flex-shrink: 0;
}

/* Month input size */
.cal-jump {
  width: auto;
  max-width: 160px;
}

/* Filter chips area — overrides group's display:grid */
.cal-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .4rem .6rem;
  flex: 1;
  justify-content: flex-end;
}

.cal-filters__label {
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--text-faint);
  white-space: nowrap;
  margin-right: .2rem;
}

/* Group label inside filters */
.cal-filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: .3rem;
}

.cal-filter-group__label {
  font-size: .7rem;
  font-weight: 700;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-right: .1rem;
  white-space: nowrap;
}

/* Individual filter chip */
.cal-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .25rem .6rem;
  border-radius: var(--r-full);
  font-size: .75rem;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
  white-space: nowrap;
}

.cal-filter-chip__count {
  border-radius: var(--r-full);
  padding: 0 .35rem;
  font-size: .7rem;
  font-weight: 800;
  line-height: 1.5;
}


/* ──────────────────────────────────────────────────────────────
   Calendar month grid (panel)
   ────────────────────────────────────────────────────────────── */

/* Correct: .cal-panel is the card wrapper, defined at 18583. */
/* .cal-grid is defined at 18601 + 18635; still valid.        */

/* Month navigation row: ‹ Month Year › */
.cal-month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  margin-bottom: .875rem;
}

.cal-month-title {
  font-weight: 800;
  color: var(--text);
  font-size: 1rem;
}


/* ──────────────────────────────────────────────────────────────
   Calendar day-detail panel
   ────────────────────────────────────────────────────────────── */

/* Date heading inside the detail panel */
.cal-detail__date {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text);
  text-transform: capitalize;
  margin-bottom: 1rem;
  padding-bottom: .75rem;
  border-bottom: 1.5px solid var(--divider);
}

/* Shown when no events on selected day */
.cal-detail__empty {
  color: var(--text-muted);
  font-size: .875rem;
  text-align: center;
  padding: 2rem 0;
}

/* ──────────────────────────────────────────────────────────────
   Calendar layout (shared with vet-row used inside detail)
   ────────────────────────────────────────────────────────────── */

.cal-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(300px, .9fr);
  gap: 1rem;
  align-items: start;
}

/* Month grid card */
.cal-panel {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  padding: 1rem;
}

/* Day-detail card */
.cal-detail {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  padding: 1rem;
  position: sticky;
  top: calc(var(--topbar-h) + 1rem);
}

/* Weekday header row */
.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: .5rem;
  gap: .5rem;
}
.cal-weekday {
  text-align: center;
  font-size: .72rem;
  font-weight: 800;
  color: var(--text-faint);
  text-transform: uppercase;
}

/* Day cells grid */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: .5rem;
}

/* Individual day cell (button) */
.cal-day {
  min-height: 72px;
  border: 1.5px solid var(--divider);
  border-radius: var(--r-lg);
  background: var(--surface-2);
  padding: .4rem;
  display: flex;
  flex-direction: column;
  gap: .3rem;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--trans);
  text-align: left;
}
.cal-day:hover { border-color: var(--primary) }

.cal-day.is-today { box-shadow: inset 0 0 0 2px var(--primary) }
.cal-day.is-selected { background: var(--primary-hl); border-color: var(--primary) }
.cal-day.is-outside { opacity: .45; cursor: default }

.cal-day-number {
  font-size: .78rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1;
}

.cal-day-dots {
  display: flex;
  flex-wrap: wrap;
  gap: .2rem;
}

.cal-dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
}

/* Detail section */
.cal-detail__section { margin-top: 1rem }
.cal-detail__section-title {
  font-size: .8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--text-faint);
  margin-bottom: .6rem;
}

/* Vet rows inside detail panel */
.vet-row {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  gap: .625rem;
  align-items: center;
  padding: .6rem .75rem;
  border-radius: var(--r-lg);
  background: var(--surface-2);
  border: 1.5px solid var(--divider);
  margin-bottom: .5rem;
}
.vet-row__icon,
.vet-row__badge {
  width: 32px; height: 32px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  background: var(--primary-hl);
  font-size: 1rem;
}
.vet-row__info { min-width: 0; display: flex; flex-direction: column }
.vet-row__label { font-weight: 800; color: var(--text); font-size: .875rem }
.vet-row__kind { font-size: .78rem; color: var(--text-muted) }

/* ── Calendar polish ───────────────────────────────────────────────────────── */

.cal-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem 1.1rem;
  margin-bottom: 1rem;
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
}

.cal-toolbar > div:first-child {
  display: flex;
  align-items: center;
  gap: .625rem;
  flex-wrap: wrap;
}

.cal-jump {
  min-width: 180px;
  height: 40px;
  border-radius: var(--r-lg);
  background: var(--surface-offset);
}

.cal-filters {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  flex: 1;
  min-width: 320px;
}

.cal-filters-label,
.cal-filters__label {
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.cal-filter-group {
  display: flex;
  align-items: center;
  gap: .65rem;
  flex-wrap: wrap;
}

.cal-filter-group-label,
.cal-filter-group__label {
  min-width: 112px;
  font-size: .78rem;
  font-weight: 800;
  color: var(--text);
}

.cal-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, .9fr);
  gap: 1rem;
  align-items: start;
}

.cal-grid-wrap,
.cal-detail {
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
}

.cal-grid-wrap {
  padding: 1rem;
}

.cal-detail {
  padding: 1rem;
  position: sticky;
  top: 1rem;
}

.cal-month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  margin-bottom: .9rem;
}

.cal-month-label {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -.01em;
}

.cal-grid--header {
  margin-bottom: .35rem;
}

.cal-cell {
  min-height: 82px;
  border-radius: var(--r-lg);
  border: 1px solid transparent;
  background: transparent;
  transition: transform var(--trans), background var(--trans), border-color var(--trans), box-shadow var(--trans);
}

.cal-cell:hover {
  transform: translateY(-1px);
  background: var(--surface-offset);
  border-color: var(--border);
}

.cal-cell--today {
  background: color-mix(in oklab, var(--primary) 8%, var(--surface));
  border-color: color-mix(in oklab, var(--primary) 24%, var(--border));
}

.cal-cell--selected {
  background: color-mix(in oklab, var(--blue) 10%, var(--surface));
  border-color: var(--blue);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--blue) 16%, transparent);
}

.cal-cell--dimmed {
  opacity: .38;
}

.cal-dots {
  display: flex;
  flex-wrap: wrap;
  gap: .25rem;
  margin-top: .45rem;
}

.cal-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
}

.cal-detail__date {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text);
  padding-bottom: .9rem;
  margin-bottom: .9rem;
  border-bottom: 1px solid var(--divider);
  text-transform: capitalize;
}

.cal-detail__section {
  margin-bottom: 1rem;
}

.cal-detail__section:last-child {
  margin-bottom: 0;
}

.cal-detail__section-title {
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: .7rem;
}

.vet-row,
.vacc-row,
.med-row {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .8rem .9rem;
}

.vet-row__icon,
.vacc-row__icon,
.med-row__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 1rem;
}

.vet-row__icon {
  background: var(--primary-hl);
  color: var(--primary);
}

.vacc-row__icon {
  background: var(--blue-hl);
  color: var(--blue);
}

.med-row__icon {
  background: var(--purple-hl);
  color: var(--purple);
}

.vet-row__info,
.vacc-row__info,
.med-row__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.vet-row__label,
.vacc-row__name,
.med-row__name {
  font-size: .87rem;
  font-weight: 800;
  color: var(--text);
}

.vet-row__kind,
.vacc-row__pet,
.med-row__pet {
  font-size: .76rem;
  color: var(--text-muted);
  margin-top: .15rem;
}

.badge--purple {
  background: var(--purple-hl);
  color: var(--purple);
  border: 1px solid color-mix(in oklab, var(--purple) 18%, var(--border));
}

.care-row__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .8rem .9rem;
  background: transparent;
  border: 0;
  text-align: left;
}

.care-row__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  padding: 0 .9rem .9rem;
}

/* ===== CALENDAR PAGE FINAL ALIGNMENT OVERRIDES ===== */

.cal-toolbar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
}

.cal-toolbar-top {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.cal-toolbar-nav {
  display: flex;
  align-items: center;
  gap: .65rem;
  flex-wrap: wrap;
}

.cal-toolbar-bottom {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.cal-jump {
  min-width: 180px;
  height: 42px;
  padding: 0 1rem;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: var(--surface-offset);
  color: var(--text);
  font-weight: 800;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
}

.cal-filters {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .8rem;
  width: 100%;
  min-width: 0;
}

.cal-filters-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  width: 100%;
  flex-wrap: wrap;
}

.cal-filters-label {
  font-size: .76rem;
  font-weight: 900;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.cal-filters-groups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: start;
  gap: .85rem;
}

.cal-filter-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: .45rem;
}

.cal-filter-group-label,
.cal-filter-grouplabel {
  min-width: 0;
  padding-top: 0;
}

.cal-filter-group-chips {
  width: 100%;
}


.cal-filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(44,52,98,.08);
}

.cal-filter-chip__count {
  min-width: 20px;
  height: 20px;
  padding: 0 .38rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.06);
  font-size: .68rem;
  font-weight: 900;
}



@media (max-width: 640px) {
  .cal-toolbar,
  .cal-grid-wrap,
  .cal-detail {
    padding: .95rem;
    border-radius: 1.2rem;
  }

  .cal-toolbar-nav {
    width: 100%;
  }

  .cal-jump {
    width: 100%;
  }

  .cal-filter-group {
    flex-direction: column;
    gap: .45rem;
  }

  .cal-filter-group-chips {
    width: 100%;
  }
}

/* ===== ALERT BANNER — COMPACT / INTEGRATED ===== */

.alert-banner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: .85rem 1rem;
  align-items: center;
  padding: .82rem .95rem;
  margin-bottom: 1rem;
  background: linear-gradient(180deg, var(--surface), color-mix(in oklab, var(--err-hl) 38%, var(--surface)));
  border: 1px solid color-mix(in oklab, var(--err) 14%, var(--border));
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
}

.alert-banner__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: .6rem;
}

.alert-banner__title-row {
  display: flex;
  align-items: center;
  gap: .6rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.alert-banner__title {
  display: flex;
  align-items: center;
  gap: .45rem;
  margin: 0;
  font-size: .92rem;
  font-weight: 900;
  color: var(--text);
  letter-spacing: -.01em;
}

.alert-banner__title .badge,
.alert-banner__title-row .badge {
  flex-shrink: 0;
}

.alert-banner__list {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  align-items: center;
}

.alert-banner__item {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  min-height: 38px;
  max-width: 100%;
  padding: .42rem .68rem;
  background: color-mix(in oklab, var(--surface) 78%, white);
  border: 1px solid color-mix(in oklab, var(--err) 10%, var(--border));
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.78);
}

.alert-banner__item-main {
  display: inline-flex;
  align-items: center;
  gap: .55rem;
  min-width: 0;
}

.alert-banner__pet {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: color-mix(in oklab, var(--surface) 84%, white);
  border: 1px solid color-mix(in oklab, var(--err) 8%, var(--border));
  font-size: .9rem;
  flex-shrink: 0;
}

.alert-banner__item-text {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: .45rem;
  flex-wrap: wrap;
}

.alert-banner__item-top {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  flex-wrap: wrap;
}

.alert-banner__pet-name {
  font-size: .76rem;
  font-weight: 900;
  color: var(--text);
  line-height: 1.1;
}

.alert-banner__vacc-name {
  font-size: .8rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.15;
}

.alert-banner__meta {
  font-size: .74rem;
  color: var(--text-muted);
  line-height: 1.1;
  white-space: nowrap;
}

.alert-banner__item .badge {
  padding: .16rem .48rem;
  font-size: .62rem;
}

.alert-banner__item--more {
  background: color-mix(in oklab, var(--surface-offset) 72%, white);
  border-style: dashed;
}

.alert-banner__aside {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 180px;
}

.alert-banner__warn {
  padding: .38rem .7rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--err-hl) 68%, var(--surface));
  border: 1px solid color-mix(in oklab, var(--err) 16%, var(--border));
  color: var(--err);
  font-size: .75rem;
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
}

/* ── Reminder Banner ────────────────────────────────────── */
.reminder-banner {
  background: linear-gradient(135deg, var(--warn-hl), var(--surface));
  border: 1.5px solid rgba(184,96,18,.2); border-radius: var(--r-xl);
  padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;
}

/* ═══════════════════════════════════════════════════════════════
   VACCINES CALENDAR
   ═══════════════════════════════════════════════════════════════ */

.vacc-cal {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  padding: 1.375rem;
  box-shadow: var(--sh-sm);
}

/* Header */
.vacc-cal-header {
  display: flex;
  align-items: center;
  gap: .625rem;
  margin-bottom: 1.125rem;
}
.vacc-cal-month-title {
  flex: 1;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: var(--text);
  text-transform: capitalize;
  font-family: var(--font-display);
}
.vacc-cal-nav {
  width: 34px; height: 34px;
  border-radius: var(--r-md);
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: background var(--trans), color var(--trans), border-color var(--trans);
  flex-shrink: 0;
}
.vacc-cal-nav:hover { background: var(--primary-hl); color: var(--primary); border-color: var(--primary); }

.vacc-cal-today-btn {
  padding: .3rem .75rem;
  border-radius: var(--r-full);
  background: var(--primary-hl);
  color: var(--primary);
  font-size: .75rem;
  font-weight: 800;
  border: 1.5px solid var(--primary);
  cursor: pointer;
  transition: background var(--trans);
  white-space: nowrap;
}
.vacc-cal-today-btn:hover { background: var(--primary); color: #fff; }

/* Weekday headers */
.vacc-cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: .25rem;
}
.vacc-cal-wd {
  text-align: center;
  font-size: .625rem;
  font-weight: 800;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: .3rem 0;
}

/* Day grid */
.vacc-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}
.vacc-cal-pad { min-height: 52px; }

.vacc-cal-day {
  min-height: 52px;
  border-radius: var(--r-md);
  padding: .375rem .25rem .3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: background var(--trans), border-color var(--trans), box-shadow var(--trans);
  position: relative;
  user-select: none;
}
.vacc-cal-day:hover { background: var(--surface-offset); }
.vacc-cal-day.has-events { background: rgba(91,108,158,.06); }
.vacc-cal-day.is-selected { border-color: var(--primary); background: var(--primary-hl); box-shadow: 0 0 0 2px var(--primary-hl); }
.vacc-cal-day.has-events:hover { background: var(--primary-hl); }

.vacc-cal-day-num {
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  font-size: .8125rem; font-weight: 700; color: var(--text);
  border-radius: 50%;
  transition: background var(--trans), color var(--trans);
}
.today-circle {
  background: var(--primary);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(91,108,158,.4);
}

.vacc-cal-dots {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 28px;
}
.vacc-cal-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Legend */
.vacc-cal-legend {
  display: flex;
  gap: .875rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: .875rem;
  border-top: 1.5px solid var(--divider);
}
.vacc-cal-legend-item {
  display: flex;
  align-items: center;
  gap: .375rem;
  font-size: .75rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Selected day panel */
.vacc-cal-panel {
  margin-top: 1rem;
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  border-radius: var(--r-xl);
  overflow: hidden;
  animation: pm-rise 200ms cubic-bezier(.16,1,.3,1) both;
}
.vacc-cal-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .875rem 1.125rem;
  border-bottom: 1.5px solid var(--divider);
  background: var(--surface);
}
.vacc-cal-panel-date {
  font-size: .9rem;
  font-weight: 800;
  color: var(--text);
  text-transform: capitalize;
}
.vacc-cal-panel-close {
  width: 28px; height: 28px;
  border-radius: var(--r-md);
  background: var(--surface-offset);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-muted);
  transition: background var(--trans);
}
.vacc-cal-panel-close:hover { background: var(--err-hl); color: var(--err); }

.vacc-cal-event-list { padding: .75rem 1.125rem; display: flex; flex-direction: column; gap: .5rem; }
.vacc-cal-event-row {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .625rem .875rem;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  transition: border-color var(--trans);
}
.vacc-cal-event-row:hover { border-color: var(--pal-denim); }
.vacc-cal-event-type-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.vacc-cal-event-icon {
  width: 36px; height: 36px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.vacc-cal-event-label { font-size: .875rem; font-weight: 700; color: var(--text); }
.vacc-cal-event-pet   { font-size: .75rem; color: var(--text-muted); margin-top: .1rem; }

/* VET*/
@keyframes vet-day-pulse {
  0%, 100% {
    background:   color-mix(in oklab, var(--pal-lilac) 12%, var(--surface));
    border-color: color-mix(in oklab, var(--pal-denim) 35%, transparent);
  }
  50% {
    background:   color-mix(in oklab, var(--pal-lilac) 26%, var(--surface));
    border-color: var(--pal-denim);
  }
}

/* Célula do calendário com retorno marcado */
.vacc-cal-day.has-vet-appt {
  animation: vet-day-pulse 2.2s ease-in-out infinite;
  border-width: 1.5px;
}

.vacc-cal-day.has-vet-appt .vacc-cal-day-num {
  color: var(--pal-denim);
  font-weight: 900;
}

/* Dark mode: sem animação pulsante (luz não contrasta bem), usar cor fixa */
[data-theme="dark"] .vacc-cal-day.has-vet-appt {
  animation: none;
  background:   rgba(146, 161, 195, 0.15);
  border-color: rgba(146, 161, 195, 0.45);
}
```

## File: src/api/client.ts
```typescript
/**
 * Pituti API Client
 * Camada de rede centralizada — todos os fetches passam por aqui.
 */

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

// ── Tipos de resposta da API ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
}

export interface ApiError {
  status: number
  message: string
}

// ── Tipos de domínio ──────────────────────────────────────────────────────────

export interface ApiPet {
  id:        string
  name:      string
  species:   'cat' | 'dog' | 'bird' | 'other'
  breed?:    string
  birthDate?:string
  photoUrl?: string
  ownerId:   string
  createdAt: string
}

export interface ApiVet {
  id:         string
  name:       string
  clinic:     string
  type:       'primary' | 'specialist' | 'emergency' | 'other'
  specialty?: string
  phone:      string
  phone2?:    string
  address?:   string
  notes?:     string
  petIds:     string[]
  createdAt:  string
}

export interface ApiAppointment {
  id:                   string
  petId:                string
  vetContactId?:        string
  vetName:              string
  clinic?:              string
  date:                 string
  time?:                string
  type:                 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other'
  reason:               string
  diagnosis?:           string
  treatment?:           string
  nextAppointmentDate?: string
  nextAppointmentNote?: string
  weightKg?:            number
  notes?:               string
  createdAt:            string
}

export interface ApiMedication {
  id:        string
  petId:     string
  name:      string
  dosage:    string
  frequency: string
  startDate?:string
  endDate?:  string | null
  notes?:    string
  createdAt: string
}

export interface ApiSymptom {
  id:          string
  petId:       string
  description: string
  severity:    'mild' | 'moderate' | 'severe'
  date:        string
  notes?:      string
  resolved:    boolean
  createdAt:   string
}

export interface ApiCare {
  id:         string
  petId:      string
  name:       string
  type:       'food' | 'water' | 'walk' | 'bath' | 'brush' | 'medication' | 'other'
  frequency:  number
  periodType: 'day' | 'week' | 'month'
  time?:      string
  notes?:     string
  status:     'pending' | 'done'
  createdAt:  string
}

export interface ApiVaccine {
  id:           string
  petId:        string
  name:         string
  date:         string
  nextDueDate?: string
  veterinary?:  string
  notes?:       string
  createdAt:    string
}

// ── Cliente HTTP ──────────────────────────────────────────────────────────────

class ApiClient {
  private base: string

  constructor(base: string) {
    this.base = base
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err?.error ?? `HTTP ${res.status}`)
    }
    if (res.status === 204) return { data: undefined as unknown as T }
    return res.json()
  }

  get<T>(path: string)                        { return this.request<T>('GET',    path) }
  post<T>(path: string, body: unknown)        { return this.request<T>('POST',   path, body) }
  patch<T>(path: string, body: unknown)       { return this.request<T>('PATCH',  path, body) }
  put<T>(path: string, body: unknown)         { return this.request<T>('PUT',    path, body) }
  delete<T>(path: string)                     { return this.request<T>('DELETE', path) }
}

export const api = new ApiClient(BASE_URL)

// Named re-exports para os módulos de recursos
export const petsApi        = { getAll: () => api.get<ApiPet[]>('/pets'), getById: (id: string) => api.get<ApiPet>(`/pets/${id}`), create: (dto: Partial<ApiPet>) => api.post<ApiPet>('/pets', dto), update: (id: string, dto: Partial<ApiPet>) => api.patch<ApiPet>(`/pets/${id}`, dto), delete: (id: string) => api.delete<void>(`/pets/${id}`) }
export const vetsApi        = { getAll: () => api.get<ApiVet[]>('/vets'), getById: (id: string) => api.get<ApiVet>(`/vets/${id}`), create: (dto: Partial<ApiVet>) => api.post<ApiVet>('/vets', dto), update: (id: string, dto: Partial<ApiVet>) => api.patch<ApiVet>(`/vets/${id}`, dto), delete: (id: string) => api.delete<void>(`/vets/${id}`) }
export const appointmentsApi = { getAll: (vetId: string) => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`), create: (vetId: string, dto: Partial<ApiAppointment>) => api.post<ApiAppointment>(`/vets/${vetId}/appointments`, dto), update: (vetId: string, id: string, dto: Partial<ApiAppointment>) => api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, dto), delete: (vetId: string, id: string) => api.delete<void>(`/vets/${vetId}/appointments/${id}`) }
export const medicationsApi = { getAll: (petId: string) => api.get<ApiMedication[]>(`/pets/${petId}/medications`), create: (petId: string, dto: Partial<ApiMedication>) => api.post<ApiMedication>(`/pets/${petId}/medications`, dto), update: (petId: string, id: string, dto: Partial<ApiMedication>) => api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/medications/${id}`) }
export const symptomsApi    = { getAll: (petId: string) => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`), create: (petId: string, dto: Partial<ApiSymptom>) => api.post<ApiSymptom>(`/pets/${petId}/symptoms`, dto), update: (petId: string, id: string, dto: Partial<ApiSymptom>) => api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/symptoms/${id}`) }
export const caresApi       = { getAll: (petId: string) => api.get<ApiCare[]>(`/pets/${petId}/cares`), create: (petId: string, dto: Partial<ApiCare>) => api.post<ApiCare>(`/pets/${petId}/cares`, dto), update: (petId: string, id: string, dto: Partial<ApiCare>) => api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/cares/${id}`) }
export const vaccinesApi    = { getAll: (petId: string) => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`), create: (petId: string, dto: Partial<ApiVaccine>) => api.post<ApiVaccine>(`/pets/${petId}/vaccines`, dto), update: (petId: string, id: string, dto: Partial<ApiVaccine>) => api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/vaccines/${id}`) }
```

## File: src/components/EditCareModal.tsx
```typescript
// traduzido e sem mock

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from '../components/FooterButtons'

export interface CareEditData {
  id:               string
  emoji:            string
  title:            string
  total:            number
  recurrenceType?:  'daily' | 'everyXDays' | 'everyXHours'
  recurrenceValue?: number
  quantity:         string
  notify:           boolean
  time?:            string
  recurring?:       boolean
  bg:               string
  period?:          string
  intervalDays?:    number
}

interface Props {
  isOpen:    boolean
  onClose:   () => void
  care:      CareEditData | null
  onSave:    (updated: CareEditData) => void
  onDelete?: (id: string) => void
}

const CARE_EMOJIS = [
  '🍽️','💧','🪮','🦮','🏃','🛁','💊','💉','🧴','🪥',
  '🐾','🌿','🪺','🐟','🐇','🐦','🧸','🩺','⏰','📅',
]

function inferRecurrence(care: CareEditData): {
  type:  'daily' | 'everyXDays' | 'everyXHours'
  value: number
} {
  if (care.recurrenceType) return { type: care.recurrenceType, value: care.recurrenceValue ?? 1 }
  const days = care.intervalDays ?? 1
  if (days < 1) return { type: 'everyXHours', value: Math.max(1, Math.round(days * 24)) }
  if (days === 1) return { type: 'daily', value: 1 }
  return { type: 'everyXDays', value: days }
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }}/>
    </button>
  )
}

export default function EditCareModal({ isOpen, onClose, care, onSave, onDelete }: Props) {
  const { t } = useTranslation()

  // ✅ RECURRENCE_OPTS dentro do componente para reagir ao idioma
  const RECURRENCE_OPTS = [
    { val: 'daily'       as const, icon: '📅', label: t('cares.edit.recDaily')    },
    { val: 'everyXDays'  as const, icon: '🗓️', label: t('cares.edit.recXDays')   },
    { val: 'everyXHours' as const, icon: '⏰', label: t('cares.edit.recXHours')  },
  ]

  const [emoji,         setEmoji        ] = useState('')
  const [title,         setTitle        ] = useState('')
  const [total,         setTotal        ] = useState('1')
  const [recType,       setRecType      ] = useState<'daily' | 'everyXDays' | 'everyXHours'>('daily')
  const [recValue,      setRecValue     ] = useState(1)
  const [quantity,      setQuantity     ] = useState('')
  const [notify,        setNotify       ] = useState(true)
  const [titleErr,      setTitleErr     ] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!care || !isOpen) return
    setEmoji(care.emoji)
    setTitle(care.title)
    setTotal(String(care.total))
    setQuantity(care.quantity ?? '')
    setNotify(care.notify ?? true)
    setTitleErr('')
    setConfirmDelete(false)
    const { type, value } = inferRecurrence(care)
    setRecType(type)
    setRecValue(value)
  }, [care, isOpen])

  if (!care) return null

  const handleSave = () => {
    if (!title.trim()) { setTitleErr(t('vet.contacts.errName')); return }
    const rv = Math.max(1, Number(recValue) || 1)
    const intervalDays =
      recType === 'daily'      ? 1  :
      recType === 'everyXDays' ? rv :
      rv / 24

    onSave({
      ...care,
      emoji,
      title:           title.trim(),
      total:           Math.max(1, Number(total) || 1),
      recurrenceType:  recType,
      recurrenceValue: rv,
      quantity,
      notify,
      period:      recType === 'daily' ? 'day' : 'custom',
      intervalDays,
    })
    showToast(`${emoji} ${title.trim()} — ${t('toast.careUpdated')}`)
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete?.(care.id)
    showToast(`🗑️ ${t('toast.careDeleted')}`)
    onClose()
  }

  const pillStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '.35rem',
    padding: '.5rem .875rem', borderRadius: 'var(--r-full)',
    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background: active ? 'var(--primary-hl)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: active ? 700 : 500, fontSize: '.8125rem',
    cursor: 'pointer', transition: 'all var(--trans)',
    whiteSpace: 'nowrap' as const, fontFamily: 'inherit',
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon="✏️"
      accentBg="var(--primary-hl)"
      accentFg="var(--primary)"
      footer={
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', gap:'.5rem' }}>
          <PfFooter>
            <PfBtn variant="danger" onClick={handleDelete} style={{ minWidth:0 }}>
              {confirmDelete ? t('btn.confirmDelete') : t('btn.delete')}
            </PfBtn>
          </PfFooter>
          <PfFooter>
            <PfBtn variant="save" onClick={handleSave} style={{ minWidth:0 }}>
              {t('btn.saveChanges')}
            </PfBtn>
          </PfFooter>
        </div>
      }
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:'linear-gradient(135deg,var(--primary-hl),var(--surface))', position:'relative' }}>
        <div className="modal-hero-icon" style={{ background:'var(--primary)', fontSize:'1.5rem' }}>{emoji}</div>
        <div style={{ flex:1 }}>
          <div className="modal-hero-title">{t('cares.edit.title')}</div>
          <div className="modal-hero-sub">{care.title}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Emoji */}
      <div className="modal-section">{t('cares.edit.sectionIcon')}</div>
      <div className="emoji-picker-grid" style={{ marginBottom:'.875rem' }}>
        {CARE_EMOJIS.map(e => (
          <button key={e} type="button"
            className={['emoji-pick-btn', emoji===e ? 'active' : ''].join(' ')}
            onClick={() => setEmoji(e)}>{e}
          </button>
        ))}
      </div>

      {/* Nome */}
      <div className="modal-section">{t('field.name')}</div>
      <div className="form-group">
        <div className={['mf-input-wrap', titleErr ? 'mf-input-wrap--err' : ''].join(' ')}>
          <span className="mf-prefix">{emoji}</span>
          <input className="mf-input"
            value={title}
            onChange={e => { setTitle(e.target.value); setTitleErr('') }}
            placeholder={t('cares.edit.namePh')}
            autoFocus/>
        </div>
        {titleErr && <span className="mf-err">{titleErr}</span>}
      </div>

      {/* Recorrência */}
      <div className="modal-section">{t('cares.edit.sectionRecurrence')}</div>
      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'.875rem' }}>
        {RECURRENCE_OPTS.map(opt => (
          <button key={opt.val} type="button"
            style={pillStyle(recType === opt.val)}
            onClick={() => setRecType(opt.val)}>
            <span style={{ fontSize:'.95rem' }}>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {(recType === 'everyXDays' || recType === 'everyXHours') && (
        <div className="form-group" style={{ marginBottom:'.875rem' }}>
          <label className="form-label">
            {recType === 'everyXDays'
              ? t('cares.edit.intervalDays')
              : t('cares.edit.intervalHours')}
          </label>
          <div style={{ display:'flex', alignItems:'center', gap:'.625rem' }}>
            <input className="form-input" type="number"
              min={1} max={recType === 'everyXHours' ? 168 : 365}
              value={recValue}
              onChange={e => setRecValue(Math.max(1, Number(e.target.value) || 1))}
              style={{ width:90, textAlign:'center', fontWeight:700, fontSize:'1.1rem' }}/>
            <span style={{ color:'var(--text-muted)', fontSize:'.875rem', fontWeight:600 }}>
              {recType === 'everyXDays'
                ? t('cares.schedule.days')
                : t('cares.edit.hours')}
            </span>
            <span style={{
              marginLeft:'auto', fontSize:'.75rem', color:'var(--primary)',
              background:'var(--primary-hl)', padding:'.2rem .5rem',
              borderRadius:'var(--r-full)', fontWeight:700,
            }}>
              {recType === 'everyXDays'
                ? t('cares.edit.previewDays', { n: recValue })
                : t('cares.edit.previewHours', { n: recValue })}
            </span>
          </div>
        </div>
      )}

      {recType === 'daily' && (
        <div className="form-group" style={{ marginBottom:'.875rem' }}>
          <label className="form-label">{t('cares.edit.timesPerDay')}</label>
          <input className="form-input" type="number" min={1} max={10}
            value={total} onChange={e => setTotal(e.target.value)}
            style={{ maxWidth:90 }}/>
        </div>
      )}

      {/* Quantidade */}
      <div className="form-group" style={{ marginTop:'.25rem' }}>
        <label className="form-label">
          {t('cares.edit.quantity')}{' '}
          <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
        </label>
        <div className="field-icon-wrap">
          <span className="field-icon">⚖️</span>
          <input className="form-input"
            placeholder={t('cares.edit.quantityPh')}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}/>
        </div>
      </div>

      {/* Notificações */}
      <div className="modal-section">{t('cares.edit.sectionPrefs')}</div>
      <div className="toggle-row">
        <div className="toggle-row-info">
          <div className="toggle-row-label">{t('cares.edit.notifyLabel')}</div>
          <div className="toggle-row-sub">{t('cares.edit.notifySub')}</div>
        </div>
        <Toggle on={notify} onChange={setNotify}/>
      </div>
    </Modal>
  )
}
```

## File: src/components/EditPetModal.tsx
```typescript
// traduzido e sem mock

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from '../components/FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  onSave:  (pet: PetWithAlerts) => void
  pet:     PetWithAlerts
}

export default function EditPetModal({ isOpen, onClose, onSave, pet }: Props) {
  const { t } = useTranslation()

const SPECIES_OPTIONS = [
  { value: 'cat'     as Species, emoji: '🐱', label: t('pets.speciesOptions.cat'),     color: 'var(--pal-lilac)'      },
  { value: 'dog'     as Species, emoji: '🐶', label: t('pets.speciesOptions.dog'),     color: 'var(--pal-sky)'        },
  { value: 'bird'    as Species, emoji: '🦜', label: t('pets.speciesOptions.bird'),    color: 'var(--pal-candy)'      },
  { value: 'rabbit'  as Species, emoji: '🐰', label: t('pets.speciesOptions.rabbit'),  color: 'var(--pal-mauve)'      },
  { value: 'reptile' as Species, emoji: '🦎', label: t('pets.speciesOptions.reptile'), color: 'var(--success-hl)'     },
  { value: 'fish'    as Species, emoji: '🐟', label: t('pets.speciesOptions.fish'),    color: 'var(--blue-hl)'        },
  { value: 'other'   as Species, emoji: '🐾', label: t('pets.speciesOptions.other'),   color: 'var(--surface-offset)' },
]

  const [name,        setName]        = useState(pet.name)
  const [species,     setSpecies]     = useState<Species>(pet.species)
  const [breed,       setBreed]       = useState(pet.breed ?? '')
  const [birthDate,   setBirthDate]   = useState(pet.birthDate ?? '')
  const [weight,      setWeight]      = useState((pet as any).weight ?? '')
  const [nameErr,     setNameErr]     = useState('')
  const [success,     setSuccess]     = useState(false)
  const [color,       setColor]       = useState((pet as any).color       ?? '')
  const [height,      setHeight]      = useState((pet as any).height      ?? '')
  const [petLength,   setPetLength]   = useState((pet as any).petLength   ?? '')
  const [petWidth,    setPetWidth]    = useState((pet as any).petWidth    ?? '')
  const [microchip,   setMicrochip]   = useState((pet as any).microchip   ?? '')
  const [chipCountry, setChipCountry] = useState((pet as any).chipCountry ?? '')
  const [passport,    setPassport]    = useState((pet as any).passport    ?? '')

  useEffect(() => {
    if (!isOpen) return
    setName(pet.name)
    setSpecies(pet.species)
    setBreed(pet.breed ?? '')
    setBirthDate(pet.birthDate ?? '')
    setWeight((pet as any).weight ?? '')
    setColor((pet as any).color ?? '')
    setHeight((pet as any).height ?? '')
    setPetLength((pet as any).petLength ?? '')
    setPetWidth((pet as any).petWidth ?? '')
    setMicrochip((pet as any).microchip ?? '')
    setChipCountry((pet as any).chipCountry ?? '')
    setPassport((pet as any).passport ?? '')
    setNameErr('')
    setSuccess(false)
  }, [pet, isOpen])

  const handleClose = () => { setSuccess(false); onClose() }

  const handleSave = () => {
    if (!name.trim()) { setNameErr(t('vet.contacts.errName')); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({
        ...pet,
        name:      name.trim(),
        species,
        breed:     breed.trim() || undefined,
        birthDate: birthDate    || undefined,
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${name.trim()} — ${t('toast.changesSaved')}`)
      setSuccess(false)
      onClose()
    }, 1000)
  }

  const selectedSpecies = SPECIES_OPTIONS.find(o => o.value === species)!

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon={selectedSpecies.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>{t('btn.saveChanges')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selectedSpecies.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background:'var(--pal-denim)', color:'#fff', fontSize:'1.5rem' }}>
          {selectedSpecies.emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="modal-hero-title" style={{ fontSize:'1rem' }}>
            {name.trim() || pet.name}
          </div>
          <div className="modal-hero-sub">
            {selectedSpecies.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('btn.saveChanges')} ✓</div>
          <div className="modal-success-sub">
            <strong>{name}</strong> — {t('toast.changesSaved')}
          </div>
        </div>
      ) : (
        <>
          {/* Identidade */}
          <div className="modal-section">{t('pets.sectionIdentity')}</div>

          <div className="mf-species-grid" style={{ marginBottom:'1rem' }}>
            {SPECIES_OPTIONS.map(o => (
              <button key={o.value} type="button"
                className={['mf-species-card', species===o.value ? 'active' : ''].join(' ')}
                style={species===o.value ? { background: o.color, borderColor:'var(--primary)' } : {}}
                onClick={() => setSpecies(o.value)}>
                <span className="mf-species-emoji">{o.emoji}</span>
                <span className="mf-species-label">{o.label}</span>
              </button>
            ))}
          </div>

          <div className="mf-field">
            <label className="mf-label">{t('field.name')}</label>
            <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
              <span className="mf-prefix">{selectedSpecies.emoji}</span>
              <input className="mf-input"
               // continua a funcionar — label já vem traduzido do array
placeholder={t('pets.namePh', { species: selectedSpecies.label.toLowerCase() })}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                autoFocus/>
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('field.breed')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🏷️</span>
              <input className="mf-input" placeholder={t('pets.breedPh')}
                value={breed} onChange={e => setBreed(e.target.value)}/>
            </div>
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('pets.color')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🎨</span>
              <input className="mf-input" placeholder={t('pets.colorPh')}
                value={color} onChange={e => setColor(e.target.value)}/>
            </div>
          </div>

          {/* Dados físicos */}
          <div className="modal-section">{t('pets.sectionPhysical')}</div>

          <div className="form-row" style={{ marginBottom:'1rem' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">
                {t('field.birthDate')} <span className="mf-optional">({t('btn.optional')})</span>
              </label>
              <FormDateField
                value={birthDate}
                onChange={setBirthDate}
                label={undefined}/>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">
                {t('pets.weight')} <span className="mf-optional">({t('btn.optional')})</span>
              </label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder={t('pets.weightPh')}/>
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          </div>

          <label className="mf-label" style={{ display:'block', marginBottom:'.5rem' }}>
            {t('pets.measurements')} <span className="mf-optional">({t('btn.optional')})</span>
          </label>
          <div className="form-row" style={{ marginBottom:'1rem' }}>
            {[
              { label: t('pets.height'),  val: height,    set: setHeight,    prefix:'↕' },
              { label: t('pets.length'),  val: petLength, set: setPetLength, prefix:'↔' },
              { label: t('pets.width'),   val: petWidth,  set: setPetWidth,  prefix:'⟺' },
            ].map(field => (
              <div key={field.label} className="form-group" style={{ marginBottom:0 }}>
                <label className="mf-label" style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{field.label}</label>
                <div className="mf-input-wrap">
                  <span className="mf-prefix">{field.prefix}</span>
                  <input className="mf-input" type="number" step="0.1" min="0"
                    value={field.val} onChange={e => field.set(e.target.value)} placeholder="0.0"/>
                  <span className="mf-suffix">cm</span>
                </div>
              </div>
            ))}
          </div>

          {/* Identificação */}
          <div className="modal-section">
            {t('pets.sectionId')} <span className="mf-optional">({t('btn.optional')})</span>
          </div>

          <div className="form-row" style={{ marginBottom:'1rem' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">{t('pets.microchip')}</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">📡</span>
                <input className="mf-input" placeholder={t('pets.microchipPh')}
                  value={microchip} onChange={e => setMicrochip(e.target.value)} maxLength={20}/>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">{t('pets.chipCountry')}</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🌍</span>
                <input className="mf-input" placeholder={t('pets.chipCountryPh')}
                  value={chipCountry} onChange={e => setChipCountry(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('pets.passport')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder={t('pets.passportPh')}
                value={passport} onChange={e => setPassport(e.target.value)}/>
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize:'1.5rem' }}>{selectedSpecies.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{name}</div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>
                  {selectedSpecies.label}
                  {breed     ? ` · ${breed}`                                : ''}
                  {color     ? ` · ${color}`                                : ''}
                  {weight    ? ` · ${weight} kg`                            : ''}
                  {microchip ? ` · ${t('pets.microchip')}: ${microchip}`   : ''}
                  {passport  ? ` · ${t('pets.passport')}: ${passport}`     : ''}
                </div>
              </div>
              <span className="badge badge-blue" style={{ marginLeft:'auto', flexShrink:0 }}>
                {t('modal.editPet')}
              </span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/Modal.tsx
```typescript
import { useEffect, type ReactNode, type ReactElement } from 'react'
import { createPortal } from 'react-dom'


type ModalSize = 'sm' | 'md' | 'lg'


interface ModalProps {
  isOpen:    boolean
  onClose:   () => void
  title:     string
  subtitle?: string
  children:  ReactNode
  footer?:   ReactNode
  size?:     ModalSize
  icon?:     string
  accentBg?: string
  accentFg?: string
}


const maxWidths: Record<ModalSize, string> = {
  sm: '400px',
  md: '520px',
  lg: '680px',
}


export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size     = 'md',
  icon     = '✦',
  accentBg = 'var(--primary-hl)',
  accentFg = 'var(--primary)',
}: ModalProps): ReactElement | null {
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [isOpen, onClose])


  if (!isOpen) return null


  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="pm-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="pm-sheet" style={{ maxWidth: maxWidths[size] }}>

        {/* ── Single hero header ── */}
        {title && (
          <div
            className="pm-hero-header"
            style={{ background: `linear-gradient(135deg, ${accentBg} 0%, var(--surface) 100%)` }}
          >
            <div className="pm-hero-icon" style={{ background: accentFg, color: '#fff' }}>
              {icon}
            </div>
            <div className="pm-hero-text">
              <h2 id="modal-title" className="pm-hero-title">{title}</h2>
              {subtitle && <p className="pm-hero-subtitle">{subtitle}</p>}
            </div>
            <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div className="pm-body">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="pm-footer pm-footer--right">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
```

## File: src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import './styles/catAnim.css'
import './i18n/i18n' 
import { PetsProvider } from './context/PetsContext'
import { UserProvider } from './context/UserContext'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
<UserProvider>
  <PetsProvider>
    <App />
  </PetsProvider>
</UserProvider>
  </StrictMode>
)
```

## File: src/components/AddPetModal.tsx
```typescript
// traduzido e sem mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import type { PetWithAlerts } from '../hooks/usePets'
import type { Species } from '../types'
import { PfBtn, PfFooter } from './FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  onAdd:   (pet: PetWithAlerts) => void
}

export default function AddPetModal({ isOpen, onClose, onAdd }: Props) {
  const { t } = useTranslation()

  // ✅ labels traduzidos dentro do componente
  const SPECIES_OPTIONS = [
    { value: 'cat'     as Species, emoji: '🐱', label: t('pets.speciesOptions.cat'),     color: 'var(--pal-lilac)'       },
    { value: 'dog'     as Species, emoji: '🐶', label: t('pets.speciesOptions.dog'),     color: 'var(--pal-sky)'         },
    { value: 'bird'    as Species, emoji: '🦜', label: t('pets.speciesOptions.bird'),    color: 'var(--pal-candy)'       },
    { value: 'rabbit'  as Species, emoji: '🐰', label: t('pets.speciesOptions.rabbit'),  color: 'var(--pal-mauve)'       },
    { value: 'reptile' as Species, emoji: '🦎', label: t('pets.speciesOptions.reptile'), color: 'var(--success-hl)'      },
    { value: 'fish'    as Species, emoji: '🐟', label: t('pets.speciesOptions.fish'),    color: 'var(--blue-hl)'         },
    { value: 'other'   as Species, emoji: '🐾', label: t('pets.speciesOptions.other'),   color: 'var(--surface-offset)'  },
  ]

  const [name,        setName]        = useState('')
  const [species,     setSpecies]     = useState<Species>('cat')
  const [breed,       setBreed]       = useState('')
  const [birthDate,   setBirthDate]   = useState('')
  const [weight,      setWeight]      = useState('')
  const [nameErr,     setNameErr]     = useState('')
  const [success,     setSuccess]     = useState(false)
  const [color,       setColor]       = useState('')
  const [height,      setHeight]      = useState('')
  const [petLength,   setPetLength]   = useState('')
  const [petWidth,    setPetWidth]    = useState('')
  const [microchip,   setMicrochip]   = useState('')
  const [chipCountry, setChipCountry] = useState('')
  const [passport,    setPassport]    = useState('')

  const selected = SPECIES_OPTIONS.find(o => o.value === species)!

  const reset = () => {
    setName(''); setSpecies('cat'); setBreed(''); setBirthDate(''); setWeight('')
    setColor(''); setHeight(''); setPetLength(''); setPetWidth('')
    setMicrochip(''); setChipCountry(''); setPassport('')
    setNameErr('')
  }

  const handleClose = () => { reset(); setSuccess(false); onClose() }

  const handleSubmit = () => {
    if (!name.trim()) { setNameErr(t('vet.contacts.errName')); return }
    const petName = name.trim()
    setSuccess(true)
    setTimeout(() => {
      onAdd({
        id:          `pet-${Date.now()}`,
        name:        petName,
        species,
        breed:       breed.trim() || undefined,
        birthDate:   birthDate    || undefined,
        photoUrl:    undefined,
        ownerId:     'user.id',
        createdAt:   new Date().toISOString(),
        healthScore: 100,
        alerts:      [],
        vaccCoverage: 100,
        ...(weight      ? { weight }      : {}),
        ...(color       ? { color }       : {}),
        ...(height      ? { height }      : {}),
        ...(petLength   ? { petLength }   : {}),
        ...(petWidth    ? { petWidth }    : {}),
        ...(microchip   ? { microchip }   : {}),
        ...(chipCountry ? { chipCountry } : {}),
        ...(passport    ? { passport }    : {}),
      } as PetWithAlerts)
      showToast(`${selected.emoji} ${petName} — ${t('toast.petAdded')}`)
      reset(); setSuccess(false); onClose()
    }, 1000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      icon={selected.emoji}
      accentBg="var(--pal-lilac)"
      accentFg="var(--nav-bg)"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="add" onClick={handleSubmit}>{t('pets.addBtn')}</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${selected.color},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background:'var(--pal-denim)', color:'#fff', fontSize:'1.5rem' }}>
          {selected.emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="modal-hero-title" style={{ fontSize:'1rem' }}>
            {name.trim() || t('pets.newPet')}
          </div>
          <div className="modal-hero-sub">
            {selected.label}{breed ? ` · ${breed}` : ''}{color ? ` · ${color}` : ''}
          </div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('toast.petAdded')}</div>
          <div className="modal-success-sub">
            <strong>{name}</strong> {t('pets.successSub')}
          </div>
        </div>
      ) : (
        <>
          {/* Identidade */}
          <div className="modal-section">{t('pets.sectionIdentity')}</div>

          <div className="mf-species-grid" style={{ marginBottom:'1rem' }}>
            {SPECIES_OPTIONS.map(o => (
              <button key={o.value} type="button"
                className={['mf-species-card', species===o.value ? 'active' : ''].join(' ')}
                style={species===o.value ? { background: o.color, borderColor:'var(--primary)' } : {}}
                onClick={() => setSpecies(o.value)}>
                <span className="mf-species-emoji">{o.emoji}</span>
                <span className="mf-species-label">{o.label}</span>
              </button>
            ))}
          </div>

          <div className="mf-field">
            <label className="mf-label">{t('field.name')}</label>
            <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
              <span className="mf-prefix">{selected.emoji}</span>
              <input className="mf-input"
                placeholder={t('pets.namePh', { species: selected.label.toLowerCase() })}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                autoFocus/>
            </div>
            {nameErr && <span className="mf-err">{nameErr}</span>}
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('pets.breed')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🏷️</span>
              <input className="mf-input" placeholder={t('pets.breedPh')}
                value={breed} onChange={e => setBreed(e.target.value)}/>
            </div>
          </div>

          <div className="mf-field">
            <label className="mf-label">
              {t('pets.color')} <span className="mf-optional">({t('btn.optional')})</span>
            </label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">🎨</span>
              <input className="mf-input" placeholder={t('pets.colorPh')}
                value={color} onChange={e => setColor(e.target.value)}/>
            </div>
          </div>

          {/* Dados físicos */}
          <div className="modal-section">{t('pets.sectionPhysical')}</div>

          <div className="form-row" style={{ marginBottom:'1rem' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">
                {t('pets.birthDate')} <span className="mf-optional">({t('btn.optional')})</span>
              </label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🎂</span>
                <input className="mf-input" type="date"
                  value={birthDate} onChange={e => setBirthDate(e.target.value)}/>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">
                {t('pets.weight')} <span className="mf-optional">({t('btn.optional')})</span>
              </label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">⚖️</span>
                <input className="mf-input" type="number" step="0.1" min="0"
                  value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder={t('pets.weightPh')}/>
                <span className="mf-suffix">kg</span>
              </div>
            </div>
          </div>

          <label className="mf-label" style={{ display:'block', marginBottom:'.5rem' }}>
            {t('pets.measurements')} <span className="mf-optional">({t('btn.optional')})</span>
          </label>
          <div className="form-row" style={{ marginBottom:'1rem' }}>
            {[
              { label: t('pets.height'),  val: height,    set: setHeight,    prefix:'↕' },
              { label: t('pets.length'),  val: petLength, set: setPetLength, prefix:'↔' },
              { label: t('pets.width'),   val: petWidth,  set: setPetWidth,  prefix:'⟺' },
            ].map(field => (
              <div key={field.label} className="form-group" style={{ marginBottom:0 }}>
                <label className="mf-label" style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{field.label}</label>
                <div className="mf-input-wrap">
                  <span className="mf-prefix">{field.prefix}</span>
                  <input className="mf-input" type="number" step="0.1" min="0"
                    value={field.val} onChange={e => field.set(e.target.value)} placeholder="0.0"/>
                  <span className="mf-suffix">cm</span>
                </div>
              </div>
            ))}
          </div>

          {/* Identificação */}
          <div className="modal-section">
            {t('pets.sectionId')} <span className="mf-optional">({t('btn.optional')})</span>
          </div>

          <div className="form-row" style={{ marginBottom:'1rem' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">{t('pets.microchip')}</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">📡</span>
                <input className="mf-input" placeholder={t('pets.microchipPh')}
                  value={microchip} onChange={e => setMicrochip(e.target.value)} maxLength={20}/>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="mf-label">{t('pets.chipCountry')}</label>
              <div className="mf-input-wrap">
                <span className="mf-prefix">🌍</span>
                <input className="mf-input" placeholder={t('pets.chipCountryPh')}
                  value={chipCountry} onChange={e => setChipCountry(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="mf-field">
            <label className="mf-label">{t('pets.passport')}</label>
            <div className="mf-input-wrap">
              <span className="mf-prefix">📘</span>
              <input className="mf-input" placeholder={t('pets.passportPh')}
                value={passport} onChange={e => setPassport(e.target.value)}/>
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="mf-preview">
              <span style={{ fontSize:'1.5rem' }}>{selected.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{name}</div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>
                  {selected.label}
                  {breed     ? ` · ${breed}`                                : ''}
                  {color     ? ` · ${color}`                                : ''}
                  {weight    ? ` · ${weight} kg`                            : ''}
                  {microchip ? ` · ${t('pets.microchip')}: ${microchip}`   : ''}
                  {passport  ? ` · ${t('pets.passport')}: ${passport}`     : ''}
                </div>
              </div>
              <span className="badge badge-green" style={{ marginLeft:'auto', flexShrink:0 }}>
                {t('pets.badgeNew')}
              </span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
```

## File: src/components/AppLayout.tsx
```typescript
import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { usePituti } from '../context/PitutiContext'
import CalicoAnimation from './CalicoAnimation'
import NotificationsPanel from './NotificationPanel'
import { useTranslation } from 'react-i18next'
// catAnim.css must be imported in main.tsx: import './styles/catAnim.css'

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function PitutiLogo() {
  return (
    <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.18)' }}>
      <img src="logo-cat.jpg" alt="Pituti" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
    </div>
  )
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2.5"/><rect x="14" y="3" width="7" height="7" rx="2.5"/>
      <rect x="14" y="14" width="7" height="7" rx="2.5"/><rect x="3" y="14" width="7" height="7" rx="2.5"/>
    </svg>
  ),
  pets: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="9" cy="7" rx="2.2" ry="2.8"/><ellipse cx="15" cy="7" rx="2.2" ry="2.8"/>
      <ellipse cx="5" cy="13" rx="1.8" ry="2.3"/><ellipse cx="19" cy="13" rx="1.8" ry="2.3"/>
      <path d="M12 11c-3.5 0-6 2.2-6 5.5 0 2.8 2.5 4.5 6 4.5s6-1.7 6-4.5c0-3.3-2.5-5.5-6-5.5z"/>
    </svg>
  ),
  cares: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  vaccines: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2 6 14"/><path d="m2 22 4-4"/><path d="m7 17 10-10"/>
      <path d="M8 9.5 14.5 16"/><path d="m16.5 6-9 9"/><circle cx="19" cy="5" r="2.5"/>
    </svg>
  ),
  medications: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5-7-7a5 5 0 1 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"/>
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
    </svg>
  ),
  symptoms: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
    </svg>
  ),
  notes: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  calendar: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  settings: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  chevron: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  closeX: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  vet: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
    </svg>
  ),
}

// ─── NAV COMPONENTS ───────────────────────────────────────────────────────────
interface NavItemProps {
  to:        string
  icon:      React.ReactNode
  label:     string
  badge?:    string
  collapsed: boolean
  onClick?:  () => void
}

function NavItem({ to, icon, label, badge, collapsed, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['nav-item', isActive ? 'active' : ''].join(' ')}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      {icon}
      <span className="nav-label">{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </NavLink>
  )
}

function MobileNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['mobile-nav-item', isActive ? 'active' : ''].join(' ')}
    >
      <span className="mobile-nav-icon">{icon}</span>
      <span className="mobile-nav-label">{label}</span>
    </NavLink>
  )
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
interface ToastState {
  show:    boolean
  message: string
  type?:   'success' | 'err'
}

let _setToast: ((s: ToastState) => void) | null = null

export function showToast(message: string, type: 'success' | 'err' = 'success') {
  _setToast?.({ show: true, message, type })
  setTimeout(() => _setToast?.({ show: false, message, type: 'success' }), 3200)
}

// ─── APP LAYOUT ───────────────────────────────────────────────────────────────
export default function AppLayout() {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { state, toggleTheme } = usePituti()
  const theme = state.theme

  const { t } = useTranslation()

  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' })

  useEffect(() => {
    _setToast = setToast
    return () => { _setToast = null }
  }, [setToast])

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className={['app', collapsed ? 'sidebar-collapsed' : ''].join(' ')}>

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <button className="mobile-menu-btn" aria-label="Abrir menú" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? icons.closeX : icons.menu}
        </button>

        <div className="topbar-logo" onClick={() => navigate('dashboard')} style={{ cursor: 'pointer' }}>
          <PitutiLogo />
          <div className="pituti-anim-wrap">
            {'Pituti'.split('').map((char, i) => (
              <span key={i} style={{ '--i': i } as React.CSSProperties}>{char}</span>
            ))}
          </div>
          <CalicoAnimation />
        </div>

        <div className="topbar-search">
          {icons.search}
          <input placeholder={t.topbar.searchPlaceholder} aria-label={t.topbar.searchPlaceholder} />
          <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.1)', padding: '.1rem .35rem', borderRadius: '.25rem' }}>K</span>
        </div>

        <div className="topbar-actions">
          <NotificationsPanel />
          <button className="topbar-icon-btn" onClick={toggleTheme} title={t.topbar.changeTheme}>
            {theme === 'light' ? icons.moon : icons.sun}
          </button>
        </div>

        <div className="topbar-avatar" title="Thamires Lopes" onClick={() => navigate('settings')} role="button" tabIndex={0}>TL</div>
      </header>

      {mobileOpen && (
        <div className="mobile-sidebar-backdrop" onClick={closeMobile} aria-hidden="true" />
      )}

      {/* ── SIDEBAR ── */}
      <nav className={['sidebar', mobileOpen ? 'mobile-open' : ''].join(' ')} aria-label="Navegación principal">

        <div className="sidebar-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <PitutiLogo />
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.125rem', color: 'var(--nav-text-active)' }}>Pituti</span>
          </div>
          <button className="sidebar-mobile-close" onClick={closeMobile} aria-label="Cerrar menú">{icons.closeX}</button>
        </div>

<div className="sidebar-section-label">{t.nav.main}</div>
<NavItem to="dashboard" icon={icons.dashboard} label={t('nav.dashboard')} collapsed={collapsed} />
<NavItem to="pets"      icon={icons.pets}      label={t.nav.pets}      collapsed={collapsed} badge="3" />
<NavItem to="cares"     icon={icons.cares}     label={t.nav.cares}     collapsed={collapsed} />
<NavItem to="calendar"  icon={icons.calendar}  label={t.nav.calendar}  collapsed={collapsed} />

<div className="sidebar-divider" />

<div className="sidebar-section-label">{t.nav.health}</div>
<NavItem to="vaccines"    icon={icons.vaccines}    label={t.nav.vaccines}    collapsed={collapsed} />
<NavItem to="medications" icon={icons.medications} label={t.nav.medications} collapsed={collapsed} />
<NavItem to="symptoms"    icon={icons.symptoms}    label={t.nav.symptoms}    collapsed={collapsed} />
<NavItem to="notes"       icon={icons.notes}       label={t.nav.notes}       collapsed={collapsed} />
<NavItem to="vet"         icon={icons.vet}         label={t.nav.vet}         collapsed={collapsed} />

        <div className="sidebar-divider" />

<div className="sidebar-section-label">{t.nav.account}</div>
<NavItem to="settings" icon={icons.settings} label={t.nav.settings} collapsed={collapsed} />

        <div className="sidebar-toggle">
  <button
    className="nav-item"
    style={{ width: '100%' }}
    onClick={() => setCollapsed(c => !c)}
    title={t.nav.collapse}
  >
    <span style={{ transform: collapsed ? 'rotate(180deg)' : undefined, transition: 'transform 200ms', display: 'flex' }}>
      {icons.chevron}
    </span>
    <span className="nav-label">{t.nav.collapse}</span>
  </button>
</div>
      </nav>

      {/* ── Mobile Bottom Nav ── */}
<nav className="mobile-bottom-nav" aria-label="Navegación móvil">
  <MobileNavItem to="dashboard" icon={icons.dashboard} label={t('nav.dashboard')} />
  <MobileNavItem to="pets"      icon={icons.pets}      label={t.nav.pets}      />
  <MobileNavItem to="cares"     icon={icons.cares}     label={t.nav.cares}     />
  <MobileNavItem to="vet"       icon={icons.vet}       label={t.nav.vet}       />
  <MobileNavItem to="calendar"  icon={icons.calendar}  label={t.nav.calendar}  />
  <MobileNavItem to="settings"  icon={icons.settings}  label={t.nav.settings}  />
</nav>

      {/* ── MAIN ── */}
      <main className="main" id="main-content">
        <Outlet />
      </main>

      {/* ── TOAST ── */}
      <div className={['toast', toast.show ? 'show' : ''].join(' ')} role="alert" aria-live="polite">
        <div
          className="toast-icon"
          style={{
            background: toast.type === 'err' ? 'var(--err-hl)'  : 'var(--success-hl)',
            color:      toast.type === 'err' ? 'var(--err)'     : 'var(--success)',
          }}
        >
          {toast.type === 'err' ? '✕' : '✓'}
        </div>
        <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '.875rem' }}>
          {toast.message}
        </div>
        <button
          style={{
            marginLeft: '.5rem', width: 32, height: 32, borderRadius: 'var(--r-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer',
          }}
          onClick={() => setToast(t => ({ ...t, show: false }))}
        >
          {icons.closeX}
        </button>
      </div>

    </div>
  )
}
```

## File: src/pages/CaresPage.tsx
```typescript
// traduzido e sem mock
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import { useCares, isDueOnDate, getNextDueDate, type CareItem } from '../context/CaresContext'
import { usePetsContext } from '../context/PetsContext'
import { SPECIES_EMOJI } from '../hooks/usePets'
import AddCareModal from '../components/AddCareModal'
import EditCareModal, { type CareEditData } from '../components/EditCareModal'
import CareDetailModal, { type CareDetailItem } from '../components/CareDetailModal'

/* ─── CareCard ─────────────────────────────────────────────── */
function CareCard({ item, done, doneState, onToggle, onClick }: {
  item: CareItem; done: number; doneState: boolean
  onToggle: () => void; onClick: () => void
}) {
  const { t } = useTranslation()
  return (
    <div
      className={['care-card', doneState ? 'done' : ''].join(' ')}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="care-header">
        <div className="care-emoji" style={{ background: item.bg }}>{item.emoji}</div>
        <div>
          <div className="care-title">{item.title}</div>
          <div className="care-sub">{item.sub}</div>
        </div>
      </div>
      <div className="care-progress">
        <div className="care-dots">
          {Array.from({ length: Math.min(item.total, 7) }).map((_, j) => (
            <div key={j} className={`care-dot ${j < done ? 'done' : ''}`} />
          ))}
        </div>
        {/* ✅ era: t('cares.done') ✓ — fora de JSX, agora chamada correcta */}
        <span>
          {doneState
            ? <span style={{ color: 'var(--success)' }}>{t('cares.done')} ✓</span>
            : `${done}/${item.total}`}
        </span>
      </div>
      <div className="care-actions" onClick={e => e.stopPropagation()}>
        <button
          className={`care-btn-do ${doneState ? 'done-btn' : ''}`}
          onClick={onToggle}
        >
          ✓ {doneState ? t('cares.done') : t('cares.registerCare')}
        </button>
      </div>
    </div>
  )
}

/* ─── ScheduledRow ─────────────────────────────────────────── */
function ScheduledRow({ item, nextDate, onClick }: {
  item: CareItem; nextDate: string; onClick: () => void
}) {
  const { t, i18n } = useTranslation()
  // ✅ era 'es-ES' hardcoded — usa locale do i18n
  const dateLabel = new Date(nextDate + 'T12:00:00').toLocaleDateString(i18n.language, {
    weekday: 'short', day: 'numeric', month: 'short',
  })
  const daysFromNow = Math.round(
    (new Date(nextDate + 'T00:00:00').getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
  )
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '.875rem',
        padding: '.625rem .25rem', borderBottom: '1px solid var(--divider)', cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <div style={{
        background: item.bg, width: 36, height: 36, borderRadius: 'var(--r-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>
        {item.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)' }}>{item.title}</div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{item.sub}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '.8125rem', fontWeight: 800, color: 'var(--primary)' }}>{dateLabel}</div>
        <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', marginTop: '.1rem' }}>
          {daysFromNow === 0
            ? t('dates.today')
            : t('vet.time.inDays', { n: String(daysFromNow) })}
        </div>
      </div>
    </div>
  )
}

/* ─── CaresPage ────────────────────────────────────────────── */
export default function CaresPage() {
  const { items, addCare, editCare, deleteCare, setCareProgress } = useCares()
  const { t, i18n } = useTranslation()
  // ✅ pets reais — PETS_META mock eliminado
  const { pets } = usePetsContext()
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const [selPet,   setSelPet]   = useState('all')
  const [detail,   setDetail]   = useState<CareItem | null>(null)
  const [editItem, setEditItem] = useState<CareEditData | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen,  setAddOpen]  = useState(false)

  const getDone = (item: CareItem) =>
    item.doneByDate[today] ?? { done: 0, doneState: false }

  const getDailyCares = (petId: string) =>
    items.filter(i => i.petId === petId && isDueOnDate(i, today))

  const getScheduled = (petId: string) => {
    const toDate = new Date(); toDate.setDate(toDate.getDate() + 30)
    const toStr  = toDate.toISOString().split('T')[0]
    return items
      .filter(i => i.petId === petId && i.intervalDays > 1 && !isDueOnDate(i, today))
      .map(i => ({ item: i, nextDate: getNextDueDate(i, today) }))
      .filter(x => x.nextDate <= toStr)
      .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
  }

  const toDetailItem = (item: CareItem): CareDetailItem => {
    const d = getDone(item)
    return {
      id: item.id, petId: item.petId, emoji: item.emoji, title: item.title,
      sub: item.sub, total: item.total, done: d.done, done_state: d.doneState, bg: item.bg,
    }
  }

  const toEditData = (item: CareItem): CareEditData => ({
    id: item.id, emoji: item.emoji, title: item.title, total: item.total,
    period: item.period, quantity: item.quantity, notify: item.notify, bg: item.bg,
    time: item.time, intervalDays: item.intervalDays, recurring: item.recurring,
  })

  // ✅ helper de período — chaves já existentes em cares.add
  const periodLabel = (period: string) => {
    if (period === 'day')   return t('cares.add.recDaily')
    if (period === 'week')  return t('cares.add.recXDays')
    return period
  }

  // ✅ pets reais com pill "todos" — sem PETS_META
  const petsMeta = pets.map(p => ({
    id:    p.id,
    emoji: SPECIES_EMOJI[p.species] ?? '🐾',
    name:  p.name,
  }))
  const visiblePets = selPet === 'all' ? petsMeta : petsMeta.filter(p => p.id === selPet)

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '1.125rem',
      }}>
        <div>
          {/* ✅ era: t('dashboard.todayCares') fora de JSX — agora chamada correcta */}
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.375rem',
            fontWeight: 400, color: 'var(--text)',
          }}>
            {t('cares.title')}
          </div>
          {/* ✅ era 'es-ES' hardcoded */}
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
            {new Date().toLocaleDateString(i18n.language, {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </div>
        </div>
        {/* ✅ era: t('cares.addCare') fora de JSX */}
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t('cares.addCare')}
        </button>
      </div>

      {/* Pet filter pills */}
      <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[{ id: 'all', emoji: '🐾', name: t('pets.allSpecies') }, ...petsMeta].map(p => (
          <button
            key={p.id}
            type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: '.375rem',
              padding: '.4rem .875rem', borderRadius: 'var(--r-full)',
              border: `1.5px solid ${selPet === p.id ? 'var(--primary)' : 'var(--border)'}`,
              background: selPet === p.id ? 'var(--primary-hl)' : 'var(--surface-offset)',
              color: selPet === p.id ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700, fontSize: '.8125rem', cursor: 'pointer',
              fontFamily: 'inherit', minHeight: 40, transition: 'all 180ms',
            }}
            onClick={() => setSelPet(p.id)}
          >
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      {/* Content per pet */}
      {visiblePets.map(pet => {
        const daily     = getDailyCares(pet.id)
        const scheduled = getScheduled(pet.id)
        if (daily.length === 0 && scheduled.length === 0) return null
        const doneCount = daily.filter(c => getDone(c).doneState).length

        return (
          <div key={pet.id} style={{ marginBottom: '2rem' }}>

            {/* Pet header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.875rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{pet.emoji}</span>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{pet.name}</span>
              <span className={`badge ${doneCount === daily.length ? 'badge-green' : 'badge-yellow'}`}>
                {/* ✅ era: t('dates.today').toLowerCase() sem contexto — usa chave de progresso */}
                {t('cares.todayProgress', { done: doneCount, total: daily.length })}
              </span>
            </div>

            {/* Daily care grid */}
            <div className="care-grid">
              {daily.map(item => {
                const d = getDone(item)
                return (
                  <CareCard
                    key={item.id} item={item} done={d.done} doneState={d.doneState}
                    onToggle={() => {
                      const ns = !getDone(item).doneState
                      setCareProgress(item.id, today, ns ? item.total : 0, ns)
                      // ✅ era: `$t('cares.completed')'` — template string com sintaxe errada
                      showToast(ns
                        ? `✓ ${item.title} ${t('pet.cares.toastDone')}`
                        : `↩ ${item.title} ${t('pet.cares.toastUndone')}`)
                    }}
                    onClick={() => setDetail(item)}
                  />
                )
              })}
            </div>

            {/* Scheduled section */}
            {scheduled.length > 0 && (
              <div style={{
                marginTop: '1rem', background: 'var(--surface)',
                border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)',
                padding: '.875rem 1rem',
              }}>
                {/* ✅ era: 📅 t('cares.subtitle') — texto literal fora de JSX */}
                <div style={{
                  fontSize: '.75rem', fontWeight: 800, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem',
                }}>
                  📅 {t('cares.scheduled')}
                </div>
                {scheduled.map(({ item, nextDate }) => (
                  <ScheduledRow
                    key={item.id} item={item} nextDate={nextDate}
                    onClick={() => setDetail(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Modals */}
      {detail && (
        <CareDetailModal
          item={toDetailItem(detail)}
          onClose={() => setDetail(null)}
          onToggle={(id, newDone, newState) => {
            setCareProgress(id, today, newDone, newState)
            const u = items.find(i => i.id === id)
            if (u) setDetail({ ...u })
          }}
          onEdit={di => {
            setDetail(null)
            const item = items.find(i => i.id === di.id)
            if (item) { setEditItem(toEditData(item)); setEditOpen(true) }
          }}
        />
      )}

      <AddCareModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={d => {
          addCare({
            petId: d.petId, emoji: d.emoji, title: d.title,
            // ✅ era: modal.perDay/perWeek — chaves inexistentes
            sub: `${d.total}× ${periodLabel(d.period ?? 'day')}${d.quantity ? ' · ' + d.quantity : ''}`,
            total: d.total, period: d.period ?? 'day', quantity: d.quantity,
            notify: d.notify, bg: '', time: d.time ?? '',
            intervalDays: d.intervalDays ?? 1,
            recurring: (d as any).recurring ?? true,
            startDate: today,
          })
        }}
      />

      <EditCareModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        care={editItem}
        onSave={updated => {
          const item = items.find(i => i.id === updated.id)
          if (!item) return
          editCare({
            ...item,
            emoji: updated.emoji, title: updated.title, total: updated.total,
            period: updated.period ?? 'day', quantity: updated.quantity ?? '',
            notify: updated.notify,
            sub: `${updated.total}× ${periodLabel(updated.period ?? 'day')}${updated.quantity ? ' · ' + updated.quantity : ''}`,
            time: updated.time ?? '', intervalDays: updated.intervalDays ?? 1,
            recurring: (updated as any).recurring ?? true,
          })
          showToast(`${updated.emoji} ${updated.title} ${t('pet.cares.toastUpdated')}`)
          setEditOpen(false)
        }}
        onDelete={id => {
          deleteCare(id)
          setEditOpen(false)
          // ✅ era: notes.deletedNote — chave errada, usa a de cares
          showToast(t('pet.cares.toastDeleted'))
        }}
      />
    </div>
  )
}
```

## File: src/pages/MedicationsPage.tsx
```typescript
//traduzido e sem mock
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import AddMedicationModal from '../components/AddMedicationModal'
import EditMedModal from '../components/EditMedModal'
import MedDetailModal from '../components/MedDetailModal'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord } from '../components/EditMedModal'
import BackButton from '../components/BackButton'
import { useMedications } from '../context/MedicationsContext'

export default function MedicationsPage() {
  const {
    active, history, addMedication, updateMedication,
    deleteMedication, archiveMedication, unarchiveMedication, markMedicationAdministered,
  } = useMedications()

  const { t } = useTranslation()

  const [addOpen,   setAddOpen]   = useState(false)
  const [editOpen,  setEditOpen]  = useState(false)
  const [editMed,   setEditMed]   = useState<MedRecord | null>(null)
  const [detailMed, setDetailMed] = useState<MedRecord | null>(null)

  const openEdit   = (med: MedRecord) => { setEditMed(med); setEditOpen(true) }
  const openDetail = (med: MedRecord) => { setDetailMed(med) }
  const handleAdd  = (data: AddMedData) => { addMedication(data) }

  const handleSaveEdit = (updated: MedRecord) => {
    updateMedication(updated)
    showToast(t('toast.medSaved'))
  }

  const handleDelete = (id: string) => {
    deleteMedication(id)
    showToast(t('toast.medDeleted'))
  }

  const handleArchive = (id: string) => {
    archiveMedication(id)
    showToast(t('toast.medArchived'))
  }

  const handleUnarchive = (id: string) => {
    unarchiveMedication(id)
    showToast(t('toast.medUnarchived'))
  }

  const handleMarkAdministered = (med: MedRecord, date: string) => {
    const dateStr = markMedicationAdministered(med, date)
    showToast(`${med.title} — ${dateStr}`)
  }

  const handleDetailEdit = (med: MedRecord) => {
    setDetailMed(null)
    openEdit(med)
  }

  // ✅ próximas doses derivadas dos medicamentos activos — sem INITIAL_DOSES hardcoded
  const nextDoses = active
    .filter(m => m.endDate)
    .map(m => {
      const ms   = new Date(m.endDate! + 'T12:00:00').getTime() - Date.now()
      const days = Math.ceil(ms / 86_400_000)
      return { med: m, days }
    })
    .sort((a, b) => a.days - b.days)
    .slice(0, 5)

  return (
    <div>
      <BackButton />

      <div className="page-header">
        <div>
          <div className="page-title">{t('medications.title')}</div>
          <div className="page-subtitle">{t('medications.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t('medications.add')}
        </button>
      </div>

      <div className="grid-2">
        {/* ── Medicamentos activos ── */}
        <div className="card">
          <div className="card-title">
            {t('medications.active')}
            {active.length > 0 && <span className="badge badge-green">{active.length}</span>}
          </div>
          {active.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyActive')}
            </div>
          ) : (
            active.map(m => (
              <div key={m.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">{m.dose} · {m.frequency}</div>
                </div>
                <div className="med-row-actions">
                  <span className={`badge ${m.badgeCls}`}>{m.badge}</span>
                  <button className="med-archive-btn" title={t('btn.archive')}
                    onClick={e => { e.stopPropagation(); handleArchive(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/>
                      <rect x="1" y="3" width="22" height="5" rx="1"/>
                      <line x1="10" y1="12" x2="14" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Historial ── */}
        <div className="card">
          <div className="card-title">{t('medications.history')}</div>
          {history.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyHistory')}
            </div>
          ) : (
            history.map(m => (
              <div key={m.id} className="list-item" style={{ opacity:.7, cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:'var(--surface-offset)', color:'var(--text-faint)' }}>
                  {m.icon}
                </div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">
                    {m.dose}
                    {m.startDate ? ` · ${new Date(m.startDate+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' })}` : ''}
                    {m.endDate   ? ` → ${new Date(m.endDate  +'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' })}` : ''}
                  </div>
                </div>
                <div className="med-row-actions">
                  <span className="badge badge-gray">{t('medications.finished')}</span>
                  <button className="med-edit-btn" title={t('medications.unarchive')}
                    style={{ background:'var(--success-hl)', color:'var(--success)' }}
                    onClick={e => { e.stopPropagation(); handleUnarchive(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/>
                      <rect x="1" y="3" width="22" height="5" rx="1"/>
                      <polyline points="10 12 12 10 14 12"/>
                      <line x1="12" y1="10" x2="12" y2="16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop:'1.125rem' }}>
        {/* ── Adherência ── */}
        <div className="card">
          <div className="card-title">{t('medications.adherence')}</div>
          {active.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyActive')}
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', padding:'.5rem 0' }}>
              {/* ✅ anel calculado dinamicamente */}
              {(() => {
                const total = active.length
                const pct   = total > 0
                  ? Math.round(active.filter(m => m.badgeCls === 'badge-green').length / total * 100)
                  : 100
                const circ  = 2 * Math.PI * 36
                const offset = circ - (pct / 100) * circ
                return (
                  <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink:0 }}>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="var(--surface-offset)" strokeWidth="9"/>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="var(--success)" strokeWidth="9"
                      strokeDasharray={circ} strokeDashoffset={offset}
                      strokeLinecap="round" transform="rotate(-90 45 45)"/>
                    <text x="45" y="50" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="800" fontSize="20" fill="var(--text)">
                      {pct}%
                    </text>
                  </svg>
                )
              })()}
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'.625rem' }}>
                {active.map(m => {
                  const ms   = m.endDate ? new Date(m.endDate+'T12:00:00').getTime() - Date.now() : null
                  const days = ms !== null ? Math.ceil(ms / 86_400_000) : null
                  const pct  = m.badgeCls === 'badge-green' ? 100 : m.badgeCls === 'badge-yellow' ? 70 : 40
                  return (
                    <div key={m.id}>
                      <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'.3rem' }}>
                        {m.title.toUpperCase()}
                      </div>
                      <div className="progress-wrap">
                        <div className={`progress-bar ${m.badgeCls === 'badge-green' ? 'success' : 'warn'}`} style={{ width:`${pct}%` }}/>
                      </div>
                      <div style={{ fontSize:'.7rem', color: m.badgeCls === 'badge-green' ? 'var(--success)' : 'var(--warn)', marginTop:'.2rem', fontWeight:700 }}>
                        {days !== null
                          ? `${t('medications.nextDose')} ${days}d`
                          : t('vaccines.upToDate') + ' ✓'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Próximas doses ── */}
        <div className="card">
          <div className="card-title">{t('medications.nextDoses')}</div>
          {nextDoses.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyActive')}
            </div>
          ) : (
            nextDoses.map(({ med, days }) => (
              <div key={med.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => openDetail(med)}>
                <div className="list-item-icon" style={{ background:med.bg, color:med.color }}>{med.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{med.title}</div>
                  <div className="list-item-sub">
                    {new Date(med.endDate!+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' })}
                  </div>
                </div>
                <div className="med-row-actions">
                  <span className={`badge ${med.badgeCls}`}>{days}d</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddMedicationModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>
      <EditMedModal isOpen={editOpen} onClose={() => setEditOpen(false)} med={editMed} onSave={handleSaveEdit} onDelete={handleDelete}/>
      <MedDetailModal med={detailMed} onClose={() => setDetailMed(null)} onEdit={handleDetailEdit} onMarkAdministered={handleMarkAdministered}/>
    </div>
  )
}
```

## File: src/pages/NotesPage.tsx
```typescript
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import NewNoteModal from '../components/NewNoteModal'
import { NoteDetailModal, EditNoteModal, CURRENT_USER } from '../components/NoteModals'
import type { NoteEntry, NoteReply } from '../components/NoteModals'
import type { NoteData } from '../components/NewNoteModal'
import BackButton from '../components/BackButton'
import { showToast } from '../components/AppLayout'


const PET_META: Record<string, { emoji: string; name: string; borderColor: string; bg: string }> = {
  'pet-1': { emoji: '🐱', name: 'Luna', borderColor: 'var(--pal-lilac)', bg: 'var(--pal-lilac)' },
  'pet-2': { emoji: '🐶', name: 'Toby', borderColor: 'var(--pal-sky)',   bg: 'var(--pal-sky)'   },
  'pet-3': { emoji: '🦜', name: 'Kiwi', borderColor: 'var(--pal-mauve)', bg: 'var(--pal-mauve)' },
}

const TYPE_ICON: Record<string, string> = {
  control: '🩺', observacion: '👁', emergencia: '🚨', vacuna: '💉', cirugia: '🔬', otro: '📋',
}


// ── NoteCard ──────────────────────────────────────────────────────
function NoteCard({ note, onClick, archived = false }: {
  note: NoteEntry; onClick: () => void; archived?: boolean
}) {
  const { t } = useTranslation()
  const pm = PET_META[note.petId]
  const ti = TYPE_ICON[note.type] ?? '📋'

  const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
    control:     { label: t('notes.typeOptions.control'),     cls: 'badge-blue'   },
    observacion: { label: t('notes.typeOptions.observacion'), cls: 'badge-gray'   },
    emergencia:  { label: t('notes.typeOptions.emergencia'),  cls: 'badge-red'    },
    vacuna:      { label: t('notes.typeOptions.vacuna'),      cls: 'badge-green'  },
    cirugia:     { label: t('notes.typeOptions.cirugia'),     cls: 'badge-yellow' },
    otro:        { label: t('notes.typeOptions.otro'),        cls: 'badge-gray'   },
  }

  const tb      = TYPE_BADGE[note.type] ?? TYPE_BADGE.otro
  const replies = note.replies ?? []
  if (!pm) return null

  return (
    <div
      className={['card', archived ? 'note-card-archived' : ''].join(' ')}
      style={{ borderLeft: `4px solid ${archived ? 'var(--border)' : pm.borderColor}`, cursor: 'pointer' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '.75rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: archived ? 'var(--surface-offset)' : pm.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', flexShrink: 0,
        }}>
          {pm.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--text)' }}>{pm.name}</div>
          <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
            {ti} {note.vet || t('field.vet')}
          </div>
        </div>
        <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
          {new Date(note.date + 'T12:00:00').toLocaleDateString(t('dates.locale'))}
        </span>
      </div>

      <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {note.content.length > 140 ? note.content.slice(0, 140) + '…' : note.content}
      </p>

      <div style={{ marginTop: '.75rem', display: 'flex', alignItems: 'center', gap: '.375rem', flexWrap: 'wrap' }}>
        {note.authorName && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.3rem',
            background: 'var(--surface-offset)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-full)', padding: '.15rem .5rem .15rem .25rem',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: note.authorColor ?? 'var(--primary-hl)',
              color: note.authorColorFg ?? 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.55rem', fontWeight: 800,
            }}>
              {note.authorAvatar ?? note.authorName.slice(0, 2)}
            </div>
            {/* ✅ corrigido: chave correcta + "Você" em PT */}
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {note.authorId === CURRENT_USER.id ? t('pet.share.badgeYou') : note.authorName}
            </span>
          </div>
        )}

        <span className={`badge ${tb.cls}`}>{tb.label}</span>

        {replies.length > 0 && (
          <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>
            💬 {replies.length}
          </span>
        )}

        {archived && (
          <span className="badge badge-gray" style={{ opacity: .65 }}>
            📁 {t('notes.archived')}
          </span>
        )}
      </div>
    </div>
  )
}


// ── NotesPage ─────────────────────────────────────────────────────
export default function NotesPage() {
  const { t } = useTranslation()

  // ✅ mock removido — array vazio, será populado pela API
  const [notes,      setNotes]      = useState<NoteEntry[]>([])
  const [addOpen,    setAddOpen]    = useState(false)
  const [detailNote, setDetailNote] = useState<NoteEntry | null>(null)
  const [editNote,   setEditNote]   = useState<NoteEntry | null>(null)
  const [editOpen,   setEditOpen]   = useState(false)

  const active   = notes.filter((n) => !n.archived)
  const archived = notes.filter((n) =>  n.archived)

  const handleAdd = (d: NoteData) => {
    const newNote: NoteEntry = {
      ...d,
      id:            `n-${Date.now()}`,
      archived:      false,
      replies:       [],
      authorId:      CURRENT_USER.id,
      authorName:    CURRENT_USER.name,
      authorAvatar:  CURRENT_USER.avatar,
      authorColor:   CURRENT_USER.color,
      authorColorFg: CURRENT_USER.colorFg,
    }
    setNotes((prev) => [newNote, ...prev])
  }

  const handleSaveEdit = (updated: NoteEntry) => {
    setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n))
  }

  const handleArchive = (id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, archived: true } : n))
    showToast(t('toast.noteArchived'))
  }

  const handleUnarchive = (id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, archived: false } : n))
    showToast(t('toast.noteUnarchived'))
  }

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    showToast(t('toast.noteDeleted'))
  }

  const handleAddReply = (noteId: string, reply: NoteReply) => {
    setNotes((prev) => prev.map((n) =>
      n.id === noteId ? { ...n, replies: [...(n.replies ?? []), reply] } : n
    ))
    setDetailNote((prev) =>
      prev?.id === noteId ? { ...prev, replies: [...(prev.replies ?? []), reply] } : prev
    )
  }

  return (
    <div>
      <BackButton />

      <div className="page-header">
        <div>
          <div className="page-title">{t('notes.title')}</div>
          <div className="page-subtitle">{t('notes.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t('notes.new')}
        </button>
      </div>

      <div className="grid-auto">
        {active.map((n) => (
          <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} />
        ))}

        <div
          className="note-add-card"
          onClick={() => setAddOpen(true)}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setAddOpen(true)}
        >
          <div className="note-add-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="note-add-card-label">{t('notes.new')}</div>
          <div className="note-add-card-sub">{t('notes.addHint')}</div>
        </div>
      </div>

      {archived.length > 0 && (
        <div className="notes-archived-section">
          <div className="notes-archived-title">
            <span>📁 {t('notes.archived')} ({archived.length})</span>
          </div>
          <div className="grid-auto">
            {archived.map((n) => (
              <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} archived />
            ))}
          </div>
        </div>
      )}

      <NewNoteModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <NoteDetailModal
        note={detailNote}
        onClose={() => setDetailNote(null)}
        onEdit={(n) => { setDetailNote(null); setEditNote(n); setEditOpen(true) }}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
        onAddReply={handleAddReply}
      />

      <EditNoteModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        note={editNote}
        onSave={(updated) => { handleSaveEdit(updated); setEditOpen(false) }}
      />
    </div>
  )
}
```

## File: src/pages/SettingsPage.tsx
```typescript
// traduzido e sem mock
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import { PfBtn } from '../components/FooterButtons'
import BackButton from '../components/BackButton'
import DeleteAccountModal from '../components/DeleteAccountModal'

// ── Toggle ────────────────────────────────────────────────────────

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <button
      role="switch"
      aria-checked={on}
      style={{ width:40, height:22, borderRadius:99, background:on?'var(--primary)':'var(--border)', cursor:'pointer', position:'relative', flexShrink:0, transition:'background 200ms', border:'none' }}
      onClick={() => setOn(v => !v)}
    >
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:on?'calc(100% - 19px)':3, transition:'left 200ms' }}/>
    </button>
  )
}

// ── SettingsField ─────────────────────────────────────────────────

function SettingsField({ icon, label, type='text', value, onChange, placeholder, multiline=false }: {
  icon:string; label:string; type?:string; value:string; onChange:(v:string)=>void; placeholder?:string; multiline?:boolean
}) {
  return (
    <div className="settings-form-field">
      <div className="settings-form-field-icon">{icon}</div>
      <div className="settings-form-field-inner">
        <div className="settings-form-field-label">{label}</div>
        {multiline
          ? <textarea className="settings-form-field-input" style={{ resize:'none', minHeight:52 }} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={2}/>
          : <input type={type} className="settings-form-field-input" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
        }
      </div>
    </div>
  )
}

// ── exportCSV ─────────────────────────────────────────────────────

// ✅ só exporta os dados reais do utilizador — sem pets mockadas
function exportCSV(name: string, email: string, t: (k: string) => string) {
  const rows = [
    [t('field.name'),  name],
    [t('field.email'), email],
    [t('dates.today'), new Date().toLocaleString()],
  ]
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'pituti-dados.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ── LanguageSelector ──────────────────────────────────────────────

function LanguageSelector() {
  const { t, i18n } = useTranslation()

  const langs = [
    { code:'es', flag:'🇪🇸', label:'Español'   },
    { code:'en', flag:'🇬🇧', label:'English'   },
    { code:'pt', flag:'🇧🇷', label:'Português' },
  ]

  const handleChange = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    showToast(t('toast.languageChanged'))
  }

  return (
    <div style={{ display:'flex', gap:'.375rem', flexWrap:'wrap' }}>
      {langs.map(l => (
        <button key={l.code} onClick={() => handleChange(l.code)}
          style={{
            display:'flex', alignItems:'center', gap:'.375rem',
            padding:'.4rem .875rem',
            borderRadius:'var(--r-full)',
            border:`1.5px solid ${i18n.language===l.code ? 'var(--primary)' : 'var(--border)'}`,
            background: i18n.language===l.code ? 'var(--primary-hl)' : 'var(--surface-offset)',
            color:      i18n.language===l.code ? 'var(--primary)'    : 'var(--text-muted)',
            fontWeight: i18n.language===l.code ? 800 : 600,
            fontSize:'.8125rem', cursor:'pointer', fontFamily:'inherit',
            transition:'all var(--trans)', minHeight:40,
          }}>
          <span style={{ fontSize:'1rem' }}>{l.flag}</span>
          {l.label}
          {i18n.language===l.code && <span style={{ fontSize:'.65rem' }}>✓</span>}
        </button>
      ))}
    </div>
  )
}

// ── SettingsPage ──────────────────────────────────────────────────

export default function SettingsPage() {
  const { t } = useTranslation()

  // ✅ campos vazios — serão populados pela API de utilizador
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [bio,        setBio]        = useState('')
  const [city,       setCity]       = useState('')
  const [photoUrl,   setPhotoUrl]   = useState<string|null>(null)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // ✅ snapshot para o discard — sem valores hardcoded
  const savedSnapshot = useRef({ name, email, phone, bio, city })
  const photoRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const r = ev.target?.result as string
      if (r) { setPhotoUrl(r); showToast(t('toast.photoUpdated')) }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!name.trim()) return
    setSaving(true)
    setTimeout(() => {
      savedSnapshot.current = { name, email, phone, bio, city }
      setSaving(false); setSaved(true)
      showToast(t('toast.changesSaved'))
      setTimeout(() => setSaved(false), 3000)
    }, 800)
  }

  const handleDiscard = () => {
    const s = savedSnapshot.current
    setName(s.name); setEmail(s.email); setPhone(s.phone); setBio(s.bio); setCity(s.city)
  }

  const handleDeleteAccount = () => {
    setDeleteOpen(false)
    showToast(t('settings.deleteToast'), 'err')
    setTimeout(() => { try { localStorage.clear() } catch {} }, 2000)
  }

  const initials = name.split(' ').filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join('')

  const notifRows = [
    { label: t('settings.vaccineAlert'),  sub: t('settings.vaccineAlertHint'),  on: true  },
    { label: t('settings.medAlert'),      sub: t('settings.medAlertHint'),      on: true  },
    { label: t('settings.symptomAlert'),  sub: t('settings.symptomAlertHint'),  on: true  },
    { label: t('settings.weeklyDigest'),  sub: t('settings.weeklyDigestHint'),  on: false },
    { label: t('settings.urgentAlerts'),  sub: t('settings.urgentAlertsHint'),  on: true  },
  ]

  return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('settings.title')}</div>
          <div className="page-subtitle">{t('settings.subtitle')}</div>
        </div>
      </div>

      {/* Profile hero */}
      <div className="settings-profile-hero">
        <div className="settings-avatar-wrap">
          <div className="settings-avatar">
            {photoUrl ? <img src={photoUrl} alt={name}/> : <span>{initials}</span>}
          </div>
          <button className="settings-avatar-btn" onClick={() => photoRef.current?.click()} title={t('settings.changePhoto')}>📷</button>
          <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange}/>
        </div>
        <div className="settings-profile-info">
          <div className="settings-profile-name">{name || t('settings.fullNamePlaceholder')}</div>
          <div className="settings-profile-email">{email}</div>
          <div className="settings-profile-joined">
            {city && `📍 ${city} · `}{t('settings.memberSince', { count: 0 })}
          </div>
        </div>
        <div style={{ display:'flex', gap:'.5rem', flexDirection:'column', alignSelf:'flex-start', flexShrink:0 }}>
          <span className="badge badge-green">✓ {t('settings.activeAccount')}</span>
        </div>
      </div>

      <div className="settings-layout">
        {/* ── Dados pessoais ── */}
        <div className="settings-card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'1rem 1.375rem .875rem', borderBottom:'1.5px solid var(--divider)', display:'flex', alignItems:'center', gap:'.625rem', background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
            <div style={{ width:34,height:34,borderRadius:'var(--r-md)',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem' }}>👤</div>
            <div>
              <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{t('settings.personalData')}</div>
              <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{t('settings.personalSubtitle')}</div>
            </div>
          </div>
          {/* Photo row */}
          <div style={{ display:'flex',alignItems:'center',gap:'1rem',padding:'.875rem 1.375rem',borderBottom:'1px solid var(--divider)',background:'var(--bg)' }}>
            <div style={{ width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,var(--pal-lilac),var(--pal-denim))',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:800,color:'var(--nav-bg)',flexShrink:0 }}>
              {photoUrl ? <img src={photoUrl} alt={name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/> : initials}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:'.875rem', color:'var(--text)' }}>{t('settings.profilePhoto')}</div>
              <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{t('settings.photoHint')}</div>
            </div>
            <PfBtn variant="edit" size="sm" onClick={() => photoRef.current?.click()}>{t('settings.changePhoto')}</PfBtn>
          </div>
          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column' }}>
            <SettingsField icon="🪪" label={t('settings.fullName')} value={name}  onChange={setName}  placeholder={t('settings.fullNamePlaceholder')}/>
            <SettingsField icon="✉️" label={t('field.email')}       type="email"  value={email} onChange={setEmail} placeholder="nome@email.com"/>
            <SettingsField icon="📱" label={t('field.phone')}       type="tel"    value={phone} onChange={setPhone} placeholder={t('settings.phonePlaceholder')}/>
            <SettingsField icon="📍" label={t('settings.city')}     value={city}  onChange={setCity}  placeholder={t('settings.cityPlaceholder')}/>
            <SettingsField icon="💬" label={t('settings.about')}    value={bio}   onChange={setBio}   placeholder={t('settings.aboutPlaceholder')} multiline/>
          </div>
          {/* Footer */}
          <div style={{ padding:'.875rem 1.375rem',borderTop:'1.5px solid var(--divider)',background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'.5rem' }}>
            {saved && (
              <div style={{ display:'flex',alignItems:'center',gap:'.375rem',fontSize:'.8125rem',color:'var(--success)',fontWeight:700,marginRight:'auto' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                {t('settings.saved')}
              </div>
            )}
            <PfBtn variant="cancel" size="sm" onClick={handleDiscard}>{t('btn.discard')}</PfBtn>
            <PfBtn variant="save"   size="sm" loading={saving} onClick={handleSave}>{t('btn.save')}</PfBtn>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.125rem' }}>
          <div className="settings-card">
            <div className="settings-card-title"><span>🎨</span> {t('settings.appearance')}</div>
            <div className="notif-row">
              <div className="notif-row-info">
                <div className="notif-row-label">{t('settings.theme')}</div>
                <div className="notif-row-sub">{t('settings.themeHint')}</div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ minHeight:40 }}
                onClick={() => {
                  const d = document.documentElement
                  d.setAttribute('data-theme', d.getAttribute('data-theme')==='dark' ? 'light' : 'dark')
                  showToast(t('toast.themeChanged'))
                }}>
                {t('settings.changeTheme')}
              </button>
            </div>
            <div className="notif-row" style={{ borderBottom:'none', flexWrap:'wrap', gap:'.75rem' }}>
              <div className="notif-row-info" style={{ flexShrink:0 }}>
                <div className="notif-row-label">{t('settings.language')}</div>
                <div className="notif-row-sub">{t('settings.languageHint')}</div>
              </div>
              <LanguageSelector/>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title"><span>🔔</span> {t('settings.notifications')}</div>
            {notifRows.map(n => (
              <div key={n.label} className="notif-row">
                <div className="notif-row-info">
                  <div className="notif-row-label">{n.label}</div>
                  <div className="notif-row-sub">{n.sub}</div>
                </div>
                <Toggle initial={n.on}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings-card" style={{ marginTop:'1.125rem', borderColor:'rgba(200,64,106,.25)' }}>
        <div className="settings-card-title" style={{ color:'var(--err)' }}><span>⚠️</span> {t('settings.dangerZone')}</div>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--divider)',marginBottom:'1rem',flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:'.875rem', fontWeight:700, color:'var(--text)' }}>{t('settings.exportData')}</div>
            <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.2rem' }}>{t('settings.exportHint')}</div>
          </div>
          <PfBtn variant="archive" size="sm" onClick={() => { exportCSV(name, email, t); showToast(t('toast.csvDownloaded')) }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {t('settings.exportBtn')}
          </PfBtn>
        </div>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:'.875rem', fontWeight:700, color:'var(--err)' }}>{t('settings.deleteAccount')}</div>
            <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.2rem' }}>{t('settings.deleteHint')}</div>
          </div>
          <PfBtn variant="delete" size="sm" onClick={() => setDeleteOpen(true)}>{t('settings.deleteBtn')}</PfBtn>
        </div>
      </div>

      <DeleteAccountModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDeleteAccount}/>
    </div>
  )
}
```

## File: src/pages/VaccinesPage.tsx
```typescript
// traduzido sem mock

import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { usePetsContext } from '../context/PetsContext'
import { RegisterVaccineModal } from './PetDetailPage'
import VaccRing from '../components/VaccRing'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import BackButton from '../components/BackButton'

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

const pad = (n: number) => String(n).padStart(2, '0')
const buildDateStr = (y: number, m: number, d: number) => `${y}-${pad(m+1)}-${pad(d)}`

const STATUS_COLOR = {
  late: 'var(--err)',
  soon: '#d48e00',
  ok:   'var(--success)',
  med:  'var(--blue)',
}
const STATUS_BG = {
  late: 'var(--err-hl)',
  soon: '#fff8d6',
  ok:   'var(--success-hl)',
  med:  'var(--blue-hl)',
}

interface CalEvent {
  type:    'vaccine' | 'medication'
  petName: string; petEmoji: string; label: string
  status:  'ok' | 'soon' | 'late'; color: string; bgColor: string; careId?: string
}

type VaccineWithMeta = VaccineRecord & {
  cls: 'ok' | 'soon' | 'late'; petName: string; petEmoji: string; petId: string
}

const eventColor = (s: 'ok'|'soon'|'late') => s==='late' ? STATUS_COLOR.late : s==='soon' ? STATUS_COLOR.soon : STATUS_COLOR.ok
const eventBg    = (s: 'ok'|'soon'|'late') => s==='late' ? STATUS_BG.late   : s==='soon' ? STATUS_BG.soon   : STATUS_BG.ok

function PencilIcon({ size=13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}


// ── VaccinesCalendar ──────────────────────────────────────────────

function VaccinesCalendar({ allVaccines, extraVacc, initialDate, meds }: {
  allVaccines: VaccineWithMeta[]
  extraVacc: Record<string, VaccineRecord[]>
  initialDate?: string
  // ✅ medicamentos recebidos como prop — sem hardcode
  meds: { date: string; petId: string; label: string }[]
}) {
  const { t } = useTranslation()
  const { pets } = usePetsContext()

  const WEEKDAYS_SHORT = t('dates.weekdaysShort', { returnObjects: true }) as string[]
  const WEEKDAYS = [...WEEKDAYS_SHORT.slice(1), WEEKDAYS_SHORT[0]]
  const MONTHS   = t('dates.months', { returnObjects: true }) as string[]

  const today    = new Date()
  const todayStr = buildDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewMonth,   setViewMonth]   = useState(() => {
    if (initialDate) { const [y,m] = initialDate.split('-').map(Number); return new Date(y,m-1,1) }
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string|null>(initialDate ?? null)

  useEffect(() => {
    if (initialDate) {
      const [y,m] = initialDate.split('-').map(Number)
      setViewMonth(new Date(y,m-1,1)); setSelectedDay(initialDate)
    }
  }, [initialDate])

  const eventMap = useMemo(() => {
    const map: Record<string, CalEvent[]> = {}
    const add = (ds: string, ev: CalEvent) => { if (!map[ds]) map[ds] = []; map[ds].push(ev) }
    for (const v of allVaccines) {
      if (!v.nextDate) continue
      add(v.nextDate, { type:'vaccine', petName:v.petName, petEmoji:v.petEmoji, label:v.name, status:v.cls, color:eventColor(v.cls), bgColor:eventBg(v.cls) })
    }
    // ✅ meds via prop, sem MOCK_PETS nem HARDCODED_MEDS
    for (const m of meds) {
      const pet = pets.find(p => p.id === m.petId); if (!pet) continue
      add(m.date, { type:'medication', petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:m.label, status:'ok', color:STATUS_COLOR.med, bgColor:STATUS_BG.med })
    }
    return map
  }, [allVaccines, meds, pets])

  const cells = useMemo(() => {
    const year = viewMonth.getFullYear(), month = viewMonth.getMonth()
    const firstDow = (new Date(year,month,1).getDay()+6)%7
    const days = new Date(year,month+1,0).getDate()
    const result: (null|{ d: number; dateStr: string })[] = []
    for (let i = 0; i < firstDow; i++) result.push(null)
    for (let d = 1; d <= days; d++) result.push({ d, dateStr: buildDateStr(year,month,d) })
    return result
  }, [viewMonth])

  const selectedEvents = selectedDay ? (eventMap[selectedDay] ?? []) : []

  const legendItems = [
    { color: STATUS_COLOR.late, label: t('vaccines.expired')      },
    { color: STATUS_COLOR.soon, label: t('vaccines.expiringSoon') },
    { color: STATUS_COLOR.ok,   label: t('vaccines.upToDate')     },
    { color: STATUS_COLOR.med,  label: t('calendar.medication')   },
  ]

  return (
    <div className="vacc-cal">
      <div className="vacc-cal-header">
        <button className="vacc-cal-nav" onClick={() => setViewMonth(m => new Date(m.getFullYear(),m.getMonth()-1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="vacc-cal-month-title">{MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</div>
        <button className="vacc-cal-nav" onClick={() => setViewMonth(m => new Date(m.getFullYear(),m.getMonth()+1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <button className="vacc-cal-today-btn" onClick={() => { setViewMonth(new Date(today.getFullYear(),today.getMonth(),1)); setSelectedDay(todayStr) }}>
          {t('calendar.today')}
        </button>
      </div>

      <div className="vacc-cal-weekdays">
        {WEEKDAYS.map(d => <div key={d} className="vacc-cal-wd">{d}</div>)}
      </div>

      <div className="vacc-cal-grid">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`p${i}`} className="vacc-cal-pad"/>
          const evts = eventMap[cell.dateStr] ?? []
          const isToday = cell.dateStr === todayStr
          const isSel   = cell.dateStr === selectedDay
          return (
            <div key={cell.dateStr}
              className={['vacc-cal-day', isToday?'is-today':'', isSel?'is-selected':'', evts.length>0?'has-events':''].join(' ')}
              onClick={() => setSelectedDay(isSel ? null : cell.dateStr)}>
              <span className={['vacc-cal-day-num', isToday?'today-circle':''].join(' ')}>{cell.d}</span>
              {evts.length > 0 && (
                <div className="vacc-cal-dots">
                  {evts.slice(0,4).map((e,j) => <span key={j} className="vacc-cal-dot" style={{ background:e.color }}/>)}
                  {evts.length > 4 && <span style={{ fontSize:'.5rem', color:'var(--text-faint)', fontWeight:800 }}>+{evts.length-4}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="vacc-cal-legend">
        {legendItems.map(l => (
          <div key={l.label} className="vacc-cal-legend-item">
            <span className="vacc-cal-dot" style={{ background:l.color, width:8, height:8 }}/>{l.label}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="vacc-cal-panel">
          <div className="vacc-cal-panel-header">
            <span className="vacc-cal-panel-date">
              {new Date(selectedDay+'T12:00:00').toLocaleDateString(t('dates.locale'), { weekday:'long', day:'numeric', month:'long' })}
            </span>
            <button className="vacc-cal-panel-close" onClick={() => setSelectedDay(null)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {selectedEvents.length === 0
            ? <div style={{ padding:'1.25rem', textAlign:'center', color:'var(--text-faint)', fontSize:'.875rem' }}>
                {t('calendar.dayEmpty')} ✓
              </div>
            : <div className="vacc-cal-event-list">
                {selectedEvents.map((ev,i) => (
                  <div key={i} className="vacc-cal-event-row">
                    <div className="vacc-cal-event-type-dot" style={{ background:ev.color }}/>
                    <div className="vacc-cal-event-icon" style={{ background:ev.bgColor }}>{ev.type==='vaccine'?'💉':'💊'}</div>
                    <div style={{ flex:1 }}>
                      <div className="vacc-cal-event-label">{ev.label}</div>
                      <div className="vacc-cal-event-pet">{ev.petEmoji} {ev.petName}</div>
                    </div>
                    <span className="badge" style={{ background:ev.bgColor, color:ev.color, fontSize:'.65rem', border:`1px solid ${ev.color}44` }}>
                      {ev.type === 'vaccine'
                        ? (ev.status==='late' ? t('vaccines.expired') : ev.status==='soon' ? t('vaccines.expiringSoon') : t('vaccines.upToDate'))
                        : t('calendar.medication')}
                    </span>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  )
}


// ── VaccinesPage ──────────────────────────────────────────────────

export default function VaccinesPage() {
  const { t }        = useTranslation()
  const location     = useLocation()
  const { pets, vaccinesByPet } = usePetsContext()
  const initialDate  = (location.state as { initialDate?: string }|null)?.initialDate

  const VACC_BADGE = {
    ok:   { badge: t('pet.vacc.badgeOk'),   cls: 'badge-green'  },
    soon: { badge: t('pet.vacc.badgeSoon'), cls: 'badge-yellow' },
    late: { badge: t('pet.vacc.badgeLate'), cls: 'badge-red'    },
  }

  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id ?? '')
  const [registerOpen,  setRegisterOpen]  = useState(false)
  const [extraVacc,     setExtraVacc]     = useState<Record<string, VaccineRecord[]>>({})
  const [detailVaccine, setDetailVaccine] = useState<(VaccineRecord & { cls:'ok'|'soon'|'late'; petName:string; petEmoji:string })|null>(null)
  const [editVaccine,   setEditVaccine]   = useState<VaccineRecord|null>(null)
  const [editOpen,      setEditOpen]      = useState(false)

  const getVacc    = (petId: string) => [...(vaccinesByPet[petId] ?? []), ...(extraVacc[petId] ?? [])]
  const pet        = pets.find(p => p.id === selectedPetId) ?? pets[0]
  const vaccines   = pet ? getVacc(pet.id) : []
  const withStatus = vaccines.map(v => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok'|'soon'|'late' }))

  // ✅ sem HARDCODED_MEDS — array vazio, pronto para API
  const meds: { date: string; petId: string; label: string }[] = []

  const allVaccinesForCalendar: VaccineWithMeta[] = pets.flatMap(p =>
    getVacc(p.id).map(v => ({
      ...v,
      cls:      getVaccStatus(v.nextDate) as 'ok'|'soon'|'late',
      petName:  p.name,
      petEmoji: PET_EMOJI[p.species] ?? '🐾',
      petId:    p.id,
    }))
  )

  const okCount = withStatus.filter(v => v.cls==='ok').length
  const alDia   = withStatus.filter(v => v.cls==='ok' || v.cls==='soon').length
  const pending = withStatus.filter(v => v.cls==='soon' || v.cls==='late').length
  const total   = vaccines.length
  const cov     = total > 0 ? Math.round(okCount/total*100) : 100
  const alPct   = total > 0 ? Math.round(alDia/total*100)  : 100
  const penPct  = total > 0 ? Math.round(pending/total*100): 0

  const handleRegister = ({ name, date, nextDate }: { name:string; date:string; nextDate:string; vet:string; notes:string }) => {
    const cls = getVaccStatus(nextDate) as 'ok'|'soon'|'late'
    setExtraVacc(prev => ({
      ...prev,
      [selectedPetId]: [...(prev[selectedPetId] ?? []), {
        name,
        applied:  new Date(date+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' }),
        nextDate,
        badge:    VACC_BADGE[cls].badge,
        badgeCls: VACC_BADGE[cls].cls,
      }],
    }))
  }

  const handleOpenDetail = (v: VaccineRecord & { cls:'ok'|'soon'|'late' }) =>
    setDetailVaccine({ ...v, petName: pet?.name ?? '', petEmoji: PET_EMOJI[pet?.species ?? ''] ?? '🐾' })

  const handleSaveVaccine = (updated: VaccineRecord) => {
    const petId  = selectedPetId
    const isBase = (vaccinesByPet[petId] ?? []).some(v => v.name === updated.name)
    setExtraVacc(prev => {
      const existing = prev[petId] ?? []
      if (isBase) {
        const alreadyExtra = existing.find(v => v.name === updated.name)
        if (alreadyExtra) return { ...prev, [petId]: existing.map(v => v.name===updated.name ? updated : v) }
        return { ...prev, [petId]: [...existing, updated] }
      }
      return { ...prev, [petId]: existing.map(v => v.name===updated.name ? updated : v) }
    })
  }

  const handleMarkApplied = (v: VaccineRecord, appliedDate: string, nextDate: string) => {
    const cls = getVaccStatus(nextDate) as 'ok'|'soon'|'late'
    handleSaveVaccine({
      ...v,
      applied:  new Date(appliedDate+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' }),
      nextDate,
      badge:    VACC_BADGE[cls].badge,
      badgeCls: VACC_BADGE[cls].cls,
    })
  }

  const coverageBars = [
    { label: t('vaccines.coverage'),    pct: cov,   color: ''                                  },
    { label: t('vaccines.upToDate'),    pct: alPct, color: 'success'                           },
    { label: `${t('vaccines.expiringSoon')} / ${t('vaccines.expired')}`, pct: penPct, color: penPct>0?'warn':'success' },
  ]

  if (!pet) return null

  return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('vaccines.title')}</div>
          <div className="page-subtitle">{t('vaccines.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setRegisterOpen(true)}>
          💉 {t('vaccines.register')}
        </button>
      </div>

      {/* ✅ selector de pets via contexto */}
      <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {pets.map(p => (
          <button key={p.id}
            className={['btn', selectedPetId===p.id ? 'btn-primary' : 'btn-secondary'].join(' ')}
            onClick={() => setSelectedPetId(p.id)}>
            {PET_EMOJI[p.species] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            {t('pet.vacc.title')} {pet.name}
            <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>
              💉 {t('pet.vacc.registerBtn')}
            </button>
          </div>
          {withStatus.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
                {t('vaccines.noVaccines')}
              </div>
            : withStatus.map(v => (
                <div key={v.name+v.nextDate}
                  style={{ display:'flex', alignItems:'center', gap:'.875rem', padding:'.75rem 0', borderBottom:'1.5px solid var(--divider)', cursor:'pointer' }}
                  onClick={() => handleOpenDetail(v)}>
                  <div className="vaccine-icon" style={{ background:eventBg(v.cls), color:eventColor(v.cls) }}>💉</div>
                  <div style={{ flex:1 }}>
                    <div className="vaccine-name">{v.name}</div>
                    <div className="vaccine-date">{t('pet.vacc.applied')} {v.applied}</div>
                  </div>
                  <div style={{ textAlign:'right', marginRight:'.5rem' }}>
                    <div className="vaccine-next" style={{ color:eventColor(v.cls) }}>
                      {v.cls === 'late'
                        ? `${t('pet.vacc.expired')} · ${new Date(v.nextDate+'T12:00:00').toLocaleDateString(t('dates.locale'))}`
                        : `${t('pet.vacc.next')} ${new Date(v.nextDate+'T12:00:00').toLocaleDateString(t('dates.locale'))}`}
                    </div>
                    <span className="badge" style={{ background:eventBg(v.cls), color:eventColor(v.cls), fontSize:'.6rem' }}>{v.badge}</span>
                  </div>
                </div>
              ))
          }
        </div>

        <div className="card">
          <div className="card-title">{t('pet.vacc.coverage')} {pet.name}</div>
          <div style={{ display:'flex', justifyContent:'center', margin:'1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8}/>
          </div>
          {coverageBars.map(b => (
            <div key={b.label} style={{ marginBottom:'.875rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'.375rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{b.label}</span>
                <span style={{ fontWeight:700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap">
                <div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div>
            <div className="page-title" style={{ fontSize:'1.125rem' }}>{t('calendar.title')}</div>
            <div className="page-subtitle">{t('vaccines.calSubtitle')}</div>
          </div>
        </div>
        <VaccinesCalendar
          allVaccines={allVaccinesForCalendar}
          extraVacc={extraVacc}
          initialDate={initialDate}
          meds={meds}
        />
      </div>

      <RegisterVaccineModal petName={pet.name} isOpen={registerOpen} onClose={() => setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister}/>
      <VaccineDetailModal vaccine={detailVaccine} onClose={() => setDetailVaccine(null)} onEdit={v => { setEditVaccine(v); setEditOpen(true) }} onMarkApplied={handleMarkApplied}/>
      <EditVaccineModal isOpen={editOpen} onClose={() => setEditOpen(false)} vaccine={editVaccine} onSave={v => { handleSaveVaccine(v); setEditOpen(false) }}/>
    </div>
  )
}
```

## File: src/pages/DashboardPage.tsx
```typescript
//traduzido

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PALETTE_COLORS, SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { usePituti, useCares } from '../context/PitutiContext'
import CareDetailModal from '../components/CareDetailModal'
import type { CareDetailItem } from '../components/CareDetailModal'
import EditCareModal from '../components/EditCareModal'
import type { CareEditData } from '../components/EditCareModal'
import { SymptomDetailModal } from '../components/SymptomModals'
import type { SymptomEntry } from '../components/SymptomModals'

// ── Greeting hook ──────────────────────────────────────────────────────────
function useGreeting() {
  const { t, i18n } = useTranslation()
  const [text, setText] = useState({ saludo: '', date: '' })

  useEffect(() => {
    const now  = new Date()
    const h    = now.getHours()

    const saludo =
      h < 12 ? t('dashboard.greeting_morning')
    : h < 19 ? t('dashboard.greeting_afternoon')
    :           t('dashboard.greeting_evening')

    const days   = t('dates.weekdays', { returnObjects: true }) as string[]
    const months = t('dates.months',   { returnObjects: true }) as string[]

    setText({
      saludo: `${saludo}, Thamiris!`,
      date:   `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`,
    })
  }, [t, i18n.language])

  return text
}

// ── Paw layout ─────────────────────────────────────────────────────────────
const SLOT_CLASSES = [
  'paw-bubble paw-main',
  'paw-bubble paw-toe paw-toe-1',
  'paw-bubble paw-toe paw-toe-2',
  'paw-bubble paw-toe paw-toe-3',
  'paw-bubble paw-toe paw-toe-4',
]

function buildSlots(pets: PetWithAlerts[]) {
  return Array.from({ length: 5 }, (_, i) => {
    const pet = pets.length === 1 && i > 0 ? null : (pets[i] ?? null)
    return {
      pet:          pets.length === 1 ? (i === 0 ? pets[0] : null) : pet,
      paletteColor: PALETTE_COLORS[i % PALETTE_COLORS.length],
    }
  })
}

function PawLayout({ pets, onPetClick }: { pets: PetWithAlerts[]; onPetClick: (id: string) => void }) {
  const { t } = useTranslation()

  const photos: Record<string, string> = {}
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('pet-photo-'))
      .forEach((k) => { photos[k.replace('pet-photo-', '')] = localStorage.getItem(k)! })
  } catch {}

  if (!pets.length) return (
    <div className="paw-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="paw-empty">
        <div className="paw-empty-icon">🐾</div>
        <p>{t('dashboard.addFirstPet')}</p>
      </div>
    </div>
  )

  return (
    <div className="paw-layout">
      {buildSlots(pets).map((slot, i) => {
        const photo        = slot.pet ? (photos[slot.pet.id] || null) : null
        const highestAlert = slot.pet?.alerts?.find((a) => a.type === 'err') ?? slot.pet?.alerts?.[0]
        return (
          <div
            key={i}
            className={SLOT_CLASSES[i]}
            style={!slot.pet ? { cursor: 'default' } : undefined}
            onClick={slot.pet ? () => onPetClick(slot.pet!.id) : undefined}
          >
            <div
              className="paw-bubble-clip"
              style={{ background: photo ? undefined : slot.paletteColor, fontSize: i === 0 ? '3rem' : '1.4rem' }}
            >
              {photo
                ? <img src={photo} alt={slot.pet?.name} loading="lazy" />
                : <span>{slot.pet ? SPECIES_EMOJI[slot.pet.species] ?? '🐾' : ''}</span>
              }
            </div>
            {highestAlert && <div className={`paw-dot ${highestAlert.type}`} />}
            {slot.pet && <div className="paw-pet-name">{slot.pet.name}</div>}
          </div>
        )
      })}
    </div>
  )
}

// ── Care strip ─────────────────────────────────────────────────────────────
interface CareStripProps {
  emoji: string; label: string; total?: number; doneInit?: number
  urgent?: boolean; onDoneChange?: (d: number) => void; onClick?: () => void
}

function CareStripItem({ emoji, label, total = 1, doneInit = 0, urgent = false, onDoneChange, onClick }: CareStripProps) {
  const [doneCount, setDoneCount] = useState(doneInit)
  const allDone = doneCount >= total
  const cls     = ['care-strip-item', allDone ? 'done' : urgent && doneCount === 0 ? 'urgent' : ''].join(' ')
  const toggle  = (i: number) => {
    setDoneCount((prev) => {
      const next = i === prev ? prev + 1 : i === prev - 1 ? prev - 1 : prev
      onDoneChange?.(next)
      return next
    })
  }
  return (
    <div className={cls} onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <span className="care-emoji">{emoji}</span>
      <span className="care-label">{label}</span>
      <span className="care-dots" onClick={(e) => e.stopPropagation()}>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} className={['care-dot-btn', i < doneCount ? 'filled' : ''].join(' ')} onClick={() => toggle(i)}>
            {i < doneCount ? '✓' : '○'}
          </button>
        ))}
      </span>
    </div>
  )
}

// ── Mock data ──────────────────────────────────────────────────────────────
interface DashCareItem {
  id: string; petId: string; emoji: string; label: string
  total: number; done: number; title: string; sub: string; bg: string; done_state: boolean
}

const INITIAL: DashCareItem[] = [
  { id: 'pet-1_food',  petId: 'pet-1', emoji: '🍽️', label: 'Luna · comida',    title: 'Alimentación', sub: '2× día · 80g', total: 2, done: 0, bg: 'linear-gradient(135deg,#FFF3DC,#FFE0A0)', done_state: false },
  { id: 'pet-2_water', petId: 'pet-2', emoji: '💧', label: 'Toby · agua',      title: 'Agua',         sub: '3× día',       total: 3, done: 2, bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state: false },
  { id: 'pet-2_walk',  petId: 'pet-2', emoji: '🏃', label: 'Toby · paseo',     title: 'Paseo',        sub: '2× día',       total: 2, done: 0, bg: 'linear-gradient(135deg,#E8FFE8,#B8F0B8)', done_state: false },
  { id: 'pet-3_water', petId: 'pet-3', emoji: '💧', label: 'Kiwi · agua',      title: 'Água',         sub: '2× día',       total: 2, done: 2, bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state: true  },
  { id: 'pet-1_brush', petId: 'pet-1', emoji: '✂️', label: 'Luna · cepillado', title: 'Cepillado',    sub: '1× semana',    total: 1, done: 0, bg: 'linear-gradient(135deg,#F0E8FF,#DDD0FF)', done_state: false },
  { id: 'pet-1_water', petId: 'pet-1', emoji: '💧', label: 'Luna · agua',      title: 'Água',         sub: '2× día',       total: 2, done: 1, bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state: false },
]

const MOCK_SYMPTOM: SymptomEntry = {
  id: 's-1', petId: 'pet-2',
  description: 'Tos suave sin fiebre. Parece cansado desde hace 3 días.',
  category: 'respiratorio', severity: 'moderado',
  date: '2026-04-18', notes: 'No tiene fiebre. Come normal.', resolved: false,
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate        = useNavigate()
  const { state }       = usePituti()
  const { pets, loading } = { pets: state.pets, loading: state.petsLoading }
  const { setCaredone } = useCares()
  const { t }           = useTranslation()
  const { saludo, date } = useGreeting()

  const allAlerts = pets.flatMap((p) => (p.alerts ?? []).map((a) => ({ ...a, petName: p.name })))

  const [dashCares,     setDashCares]     = useState<DashCareItem[]>(INITIAL)
  const [detailItem,    setDetailItem]    = useState<CareDetailItem | null>(null)
  const [editCareItem,  setEditCareItem]  = useState<CareEditData | null>(null)
  const [editCareOpen,  setEditCareOpen]  = useState(false)
  const [symptomDetail, setSymptomDetail] = useState<SymptomEntry | null>(null)

  const handleCareToggle = useCallback((id: string, newDone: number, newState: boolean) => {
    setDashCares((prev) => prev.map((c) => c.id !== id ? c : { ...c, done: newDone, done_state: newState }))
    setCaredone(id, newDone)
  }, [setCaredone])

  const openDetail = (c: DashCareItem) => {
    setDetailItem({ id: c.id, petId: c.petId, emoji: c.emoji, title: c.title, sub: c.sub, total: c.total, done: c.done, done_state: c.done_state, bg: c.bg })
  }

  const handleSaveCare = (updated: CareEditData) => {
    setDashCares((prev) => prev.map((c) =>
      c.id !== updated.id ? c : {
        ...c,
        emoji: updated.emoji,
        title: updated.title,
        total: updated.total,
        label: `${c.label.split('·')[0].trim()} · ${updated.title.toLowerCase()}`,
        sub:   `${updated.total}× ${updated.period === 'day' ? t('modal.perDay') : t('modal.perWeek')}${updated.quantity ? ' · ' + updated.quantity : ''}`,
      }
    ))
  }

  const openCalendarAt = (dateStr: string) => navigate('/vaccines', { state: { initialDate: dateStr } })

  return (
    <div className="dash-mockup-grid">

      {/* ── Left: greeting + paw ── */}
      <div className="dash-col-left">
        <div className="dash-greeting">
          <div className="greeting-name">{saludo}</div>
          <div className="greeting-date">{date}</div>
        </div>
        <div className="paw-wrapper">
          {loading
            ? (
              <div className="paw-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '.875rem' }}>
                {t('btn.loading')}
              </div>
            )
            : <PawLayout pets={pets} onPetClick={(id) => navigate(`/pets/${id}`)} />
          }
          {allAlerts.length === 0 && <div className="paw-caption">{t('dashboard.allGood')}</div>}
        </div>
      </div>

      {/* ── Centre: today's cares ── */}
      <div className="dash-col-center">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>{t('dashboard.todayCares')}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cares')}>{t('btn.seeAll')} →</button>
        </div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '.625rem' }}>
          {t('dates.today')} —{' '}
          <span style={{ color: 'var(--err)' }}>
            {dashCares.filter((c) => !c.done_state).length} {t('dashboard.pendingTasks')}
          </span>
        </div>
        <div className="dash-care-col">
          {dashCares.map((c) => (
            <CareStripItem
              key={c.id}
              emoji={c.emoji}
              label={c.label}
              total={c.total}
              doneInit={c.done}
              urgent={c.done === 0 && (c.id.includes('food') || c.id.includes('walk'))}
              onDoneChange={(done) => handleCareToggle(c.id, done, done >= c.total)}
              onClick={() => openDetail(c)}
            />
          ))}
        </div>
      </div>

      {/* ── Upcoming events ── */}
      <div className="dash-col-eventos">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>{t('dashboard.upcomingEvents')}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vaccines')}>{t('btn.seeAll')} →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {[
            { day: '23', mon: 'ABR', icon: '💉', bg: 'var(--err-hl)',  color: 'var(--err)',  title: 'Vacuna antirrábica — Luna', sub: 'Vence pronto',  badge: 'URGENTE', badgeCls: 'badge-red',    urgent: true, date: '2026-04-23' },
            { day: '30', mon: 'ABR', icon: '💊', bg: 'var(--warn-hl)', color: 'var(--warn)', title: 'Pipeta antipulgas — Toby',  sub: '17 días',        badge: 'EN 17d',  badgeCls: 'badge-yellow',              date: '2026-04-30' },
            { day: '05', mon: 'JUN', icon: '💉', bg: 'var(--gold-hl)', color: 'var(--gold)', title: 'Antirrábica — Toby',        sub: '53 días',        badge: '2 MESES', badgeCls: 'badge-yellow',              date: '2026-06-05' },
          ].map((ev, i) => (
            <div
              key={i}
              className={`event-row${ev.urgent ? ' event-urgent' : ''}`}
              onClick={() => openCalendarAt(ev.date)}
              title={t('calendar.filterVetVisit')}
            >
              <div className="event-date-badge">
                <div className="edb-day">{ev.day}</div>
                <div className="edb-mon">{ev.mon}</div>
              </div>
              <div className="event-icon" style={{ background: ev.bg, color: ev.color }}>{ev.icon}</div>
              <div className="event-info">
                <div className="event-title">{ev.title}</div>
                <div className="event-sub">{ev.sub}</div>
              </div>
              <span className={`badge ${ev.badgeCls}`}>{ev.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: alerts + KPIs ── */}
      <div className="dash-col-right">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>{t('dashboard.alerts')}</div>
        </div>
        <div className="dash-kpi-col">
          {[
            { val: pets.length, label: t('nav.pets'),        sub: null,                         color: '',               to: '/pets'        },
            { val: 8,           label: t('nav.vaccines'),    sub: `⚠ 1 ${t('vaccines.expiringSoon')}`, color: 'var(--warn)',   to: '/vaccines'    },
            { val: 2,           label: t('nav.medications'), sub: `● ${t('status.active')}`,    color: 'var(--success)', to: '/medications' },
            { val: 1,           label: t('nav.symptoms'),    sub: '● Toby',                     color: 'var(--err)',     to: '/symptoms'    },
          ].map((k) => (
            <div
              key={k.label}
              className="paw-kpi"
              style={{ cursor: 'pointer' }}
              onClick={() => k.to === '/symptoms' ? setSymptomDetail(MOCK_SYMPTOM) : navigate(k.to)}
            >
              <div className="paw-kpi-value">{k.val}</div>
              <div className="paw-kpi-label">{k.label}</div>
              {k.sub && <div className="paw-kpi-sub" style={{ color: k.color }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {allAlerts.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {allAlerts.map((a, i) => (
              <div
                key={i}
                className={`paw-alert ${a.type}`}
                style={{ cursor: a.type === 'err' ? 'pointer' : undefined }}
                onClick={() => a.type === 'err' ? setSymptomDetail(MOCK_SYMPTOM) : undefined}
              >
                <span className="paw-alert-icon">{a.type === 'warn' ? '⚠️' : '🔴'}</span>
                <span className="paw-alert-text"><strong>{a.petName} </strong>{a.text}</span>
              </div>
            ))}
          </div>
        )}

        {allAlerts.length === 0 && (
          <div className="paw-caption" style={{ marginTop: '1rem' }}>
            {t('dashboard.noAlerts')}
          </div>
        )}
      </div>

      {/* Care detail overlay */}
      {detailItem && (
        <CareDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggle={(id, newDone, newState) => {
            handleCareToggle(id, newDone, newState)
            setDetailItem((prev) => prev ? { ...prev, done: newDone, done_state: newState } : null)
          }}
          onEdit={(item) => {
            setEditCareItem({ id: item.id, emoji: item.emoji, title: item.title, total: item.total, period: 'day', quantity: '', notify: true, bg: item.bg })
            setEditCareOpen(true)
          }}
        />
      )}

      {/* Edit care */}
      <EditCareModal
        isOpen={editCareOpen}
        onClose={() => setEditCareOpen(false)}
        care={editCareItem}
        onSave={(u) => { handleSaveCare(u); setEditCareOpen(false) }}
        onDelete={(id) => { setDashCares((prev) => prev.filter((c) => c.id !== id)); setEditCareOpen(false) }}
      />

      {/* Symptom detail overlay */}
      <SymptomDetailModal
        symptom={symptomDetail}
        onClose={() => setSymptomDetail(null)}
        onEdit={() => { setSymptomDetail(null); navigate('/symptoms') }}
        onResolve={() => {
          setSymptomDetail(null)
          import('../components/AppLayout').then((m) => m.showToast(t('toast.symptomResolved')))
        }}
        onUnresolve={() => setSymptomDetail(null)}
      />
    </div>
  )
}
```

## File: src/pages/PetListPage.tsx
```typescript
// traduzido

import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePets, SPECIES_EMOJI, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import Button from '../components/Button'
import MiniVaccRing from '../components/MiniVaccRing'
import type { Species } from '../types'
import BackButton from '../components/BackButton'
import { PfBtn, PfFooter } from '../components/FooterButtons'

function usePetPhotos() {
  const [photos, setPhotos] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('pet-photo-'))
        .forEach((k) => { m[k.replace('pet-photo-', '')] = localStorage.getItem(k)! })
    } catch {}
    return m
  })
  const setPhoto = useCallback((petId: string, dataUrl: string) => {
    setPhotos((prev) => ({ ...prev, [petId]: dataUrl }))
    try { localStorage.setItem('pet-photo-' + petId, dataUrl) } catch {}
  }, [])
  return { photos, setPhoto }
}

function calcVaccCoverage(petId: string): number {
  const vaccines = VACCINES_BY_PET[petId] ?? []
  if (!vaccines.length) return 100
  const ok = vaccines.filter((v) => getVaccStatus(v.nextDate) === 'ok').length
  return Math.round((ok / vaccines.length) * 100)
}

// ── Pet Card ──────────────────────────────────────────────────────
interface PetCardProps { pet: PetWithAlerts; onClick: () => void; photo?: string }

function PetCard({ pet, onClick, photo }: PetCardProps) {
  const { t } = useTranslation()

  const bDate  = pet.birthDate ? new Date(pet.birthDate) : null
  const months = bDate
    ? (new Date().getFullYear() - bDate.getFullYear()) * 12 + (new Date().getMonth() - bDate.getMonth())
    : null
  const age = months === null
    ? t('pets.ageUnknown')
    : months < 12
      ? `${months} ${t('pets.months')}`
      : `${Math.floor(months / 12)} ${t('pet.years')}`

  const vaccCov = calcVaccCoverage(pet.id)

  const speciesLabel: Record<Species, string> = {
    cat:     t('pets.speciesOptions.cat'),
    dog:     t('pets.speciesOptions.dog'),
    bird:    t('pets.speciesOptions.bird'),
    rabbit:  t('pets.speciesOptions.rabbit'),
    reptile: t('pets.speciesOptions.reptile'),
    fish:    t('pets.speciesOptions.fish'),
    other:   t('pets.speciesOptions.other'),
  }

  return (
    <div className="pet-card" onClick={onClick}>
      <div className="pet-card-header">
        <div className="pet-avatar-photo">
          {photo
            ? <img src={photo} alt={pet.name}/>
            : <span style={{ fontSize: '1.5rem' }}>{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pet-card-name">{pet.name}</div>
          <div className="pet-card-breed">{pet.breed ?? t('pet.unknownBreed')} · {age}</div>
        </div>
        {pet.alerts.length > 0 && (
          <span className={`badge ${pet.alerts[0].type === 'err' ? 'badge-red' : 'badge-yellow'}`}>⚠</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '.625rem', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
          {[
            { label: t('pet.chipSpecies'), value: speciesLabel[pet.species] ?? pet.species },
            { label: t('pets.age'),        value: age },
          ].map((s) => (
            <div key={s.label} className="stat-chip" style={{ padding: '.45rem .625rem' }}>
              <div className="stat-chip-label">{s.label}</div>
              <div className="stat-chip-value" style={{ fontSize: '.875rem' }}>{s.value}</div>
            </div>
          ))}
        </div>
        <MiniVaccRing coverage={vaccCov} size={52} strokeWidth={5}/>
      </div>

      <div className="pet-card-footer">
        <div className="caregiver-avatars">
          <div className="caregiver-avatar">TL</div>
          {pet.id === 'pet-1' && (
            <div className="caregiver-avatar" style={{ background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>
          )}
        </div>
        <span className="last-activity">
          {pet.id === 'pet-1' ? `${t('dates.today')} 10:22` : pet.id === 'pet-2' ? t('dates.yesterday') : t('dates.days_ago', { n: 2 })}
        </span>
      </div>
    </div>
  )
}

// ── Species filter ────────────────────────────────────────────────
function useSpeciesFilters() {
  const { t } = useTranslation()

  const SPECIES_FILTERS: { val: Species | 'all'; emoji: string; label: string }[] = [
    { val: 'all',     emoji: '🐾', label: t('pets.allSpecies')              },
    { val: 'cat',     emoji: '🐱', label: t('pets.speciesOptions.cat')      },
    { val: 'dog',     emoji: '🐶', label: t('pets.speciesOptions.dog')      },
    { val: 'bird',    emoji: '🦜', label: t('pets.speciesOptions.bird')     },
    { val: 'rabbit',  emoji: '🐰', label: t('pets.speciesOptions.rabbit')   },
    { val: 'reptile', emoji: '🦎', label: t('pets.speciesOptions.reptile')  },
    { val: 'other',   emoji: '🐾', label: t('pets.speciesOptions.other')    },
  ]

  const SPECIES_OPTIONS: { value: Species; emoji: string; label: string; color: string }[] = [
    { value: 'cat',     emoji: '🐱', label: t('pets.speciesOptions.cat'),     color: 'var(--pal-lilac)'      },
    { value: 'dog',     emoji: '🐶', label: t('pets.speciesOptions.dog'),     color: 'var(--pal-sky)'        },
    { value: 'bird',    emoji: '🦜', label: t('pets.speciesOptions.bird'),    color: 'var(--pal-candy)'      },
    { value: 'rabbit',  emoji: '🐰', label: t('pets.speciesOptions.rabbit'),  color: 'var(--pal-mauve)'      },
    { value: 'reptile', emoji: '🦎', label: t('pets.speciesOptions.reptile'), color: 'var(--success-hl)'     },
    { value: 'fish',    emoji: '🐟', label: t('pets.speciesOptions.fish'),    color: 'var(--blue-hl)'        },
    { value: 'other',   emoji: '🐾', label: t('pets.speciesOptions.other'),   color: 'var(--surface-offset)' },
  ]

  return { SPECIES_FILTERS, SPECIES_OPTIONS }
}

// ── AddPetModal ───────────────────────────────────────────────────
function AddPetModal({ isOpen, onClose, onAdd }: {
  isOpen: boolean; onClose: () => void; onAdd: (p: PetWithAlerts) => void
}) {
  const { t } = useTranslation()
  const { SPECIES_OPTIONS } = useSpeciesFilters()

  const [form,    setForm]    = useState({ name: '', species: 'cat' as Species, breed: '', birthDate: '', weight: '' })
  const [nameErr, setNameErr] = useState('')

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name.trim()) { setNameErr(t('vet.contacts.errName')); return }
    const petName = form.name.trim()
    onAdd({
      id: `pet-${Date.now()}`, name: petName, species: form.species,
      breed: form.breed.trim() || undefined, birthDate: form.birthDate || undefined,
      photoUrl: undefined, ownerId: 'user-1', createdAt: new Date().toISOString(),
      healthScore: 100, alerts: [], vaccCoverage: 100,
    })
    setForm({ name: '', species: 'cat', breed: '', birthDate: '', weight: '' })
    setNameErr('')
    onClose()
    showToast(`${petName} ${t('pets.savedPet')}`)
  }

  const selected = SPECIES_OPTIONS.find((o) => o.value === form.species)!

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={t('pets.newPetTitle')} icon="🐾"
      accentBg="var(--pal-lilac)" accentFg="var(--nav-bg)"
      footer={<PfFooter><PfBtn variant="save" onClick={handleSubmit}>{t('pets.savePet')}</PfBtn></PfFooter>}
    >
      <p className="mf-section-label">{t('pets.identity')}</p>

      <div className="mf-field">
        <label className="mf-label">{t('pets.name')} *</label>
        <div className={['mf-input-wrap', nameErr ? 'mf-input-wrap--err' : ''].join(' ')}>
          <span className="mf-prefix">{selected.emoji}</span>
          <input
            className="mf-input"
            placeholder={`${t('pets.namePh')} ${selected.label.toLowerCase()}`}
            value={form.name}
            onChange={(e) => { set('name', e.target.value); setNameErr('') }}
            autoFocus
          />
        </div>
        {nameErr && <span className="mf-err">{nameErr}</span>}
      </div>

      <div className="mf-field">
        <label className="mf-label">{t('pets.species')}</label>
        <div className="mf-species-grid">
          {SPECIES_OPTIONS.map((o) => (
            <button key={o.value} type="button"
              className={['mf-species-card', form.species === o.value ? 'active' : ''].join(' ')}
              style={form.species === o.value ? { background: o.color, borderColor: 'var(--primary)' } : {}}
              onClick={() => set('species', o.value)}>
              <span className="mf-species-emoji">{o.emoji}</span>
              <span className="mf-species-label">{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mf-field">
        <label className="mf-label">{t('pets.breed')} <span className="mf-optional">{t('pets.optional')}</span></label>
        <div className="mf-input-wrap">
          <span className="mf-prefix">🔬</span>
          <input className="mf-input" placeholder={t('pets.breedPh')} value={form.breed} onChange={(e) => set('breed', e.target.value)}/>
        </div>
      </div>

      <p className="mf-section-label" style={{ marginTop: '1.25rem' }}>{t('pets.physicalData')}</p>

      <div className="mf-row">
        <div className="mf-field">
          <label className="mf-label">{t('pets.birthDate')} <span className="mf-optional">{t('pets.optional')}</span></label>
          <div className="mf-input-wrap">
            <span className="mf-prefix">🎂</span>
            <input className="mf-input" type="date" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)}/>
          </div>
        </div>
        <div className="mf-field">
          <label className="mf-label">{t('pets.weight')} <span className="mf-optional">{t('pets.optional')}</span></label>
          <div className="mf-input-wrap">
            <span className="mf-prefix">⚖️</span>
            <input className="mf-input" type="number" placeholder={t('pets.weightPh')} value={form.weight} onChange={(e) => set('weight', e.target.value)}/>
            <span className="mf-suffix">kg</span>
          </div>
        </div>
      </div>

      {form.name.trim() && (
        <div className="mf-preview">
          <span style={{ fontSize: '1.5rem' }}>{selected.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{form.name}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
              {selected.label}{form.breed ? ` · ${form.breed}` : ''}
            </div>
          </div>
          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>{t('status.new')}</span>
        </div>
      )}
    </Modal>
  )
}

// ── PetListPage ───────────────────────────────────────────────────
export default function PetListPage() {
  const navigate                                  = useNavigate()
  const { t }                                     = useTranslation()
  const { pets, loading, error, addPet, reload }  = usePets()
  const { photos }                                = usePetPhotos()
  const { SPECIES_FILTERS }                       = useSpeciesFilters()

  const [search,     setSearch]     = useState('')
  const [specFilter, setSpecFilter] = useState<Species | 'all'>('all')
  const [modalOpen,  setModalOpen]  = useState(false)
  const [viewMode,   setViewMode]   = useState<'grid' | 'list'>('grid')

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...pets]
      .filter((p) =>
        (specFilter === 'all' || p.species === specFilter) &&
        (!term || p.name.toLowerCase().includes(term) || p.species.includes(term) || p.breed?.toLowerCase().includes(term))
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [pets, search, specFilter])

  const presentSpecies = useMemo(() => {
    const s = new Set(pets.map((p) => p.species))
    return SPECIES_FILTERS.filter((f) => f.val === 'all' || s.has(f.val as Species))
  }, [pets, SPECIES_FILTERS])

  const hasFilters = search || specFilter !== 'all'

  return (
    <div>
      <BackButton label={t('btn.back')}/>

      <div className="page-header">
        <div>
          <div className="page-title">{t('pets.title')}</div>
          <div className="page-subtitle">{pets.length} {t('pets.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t('pets.new')}
        </button>
      </div>

      {/* Toolbar */}
      <div className="petlist-toolbar">
        <div className="petlist-search-row">
          <div className="petlist-search-wrap">
            <span className="petlist-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              placeholder={t('pets.searchHint')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button className="petlist-search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={reload} title={t('petlist.reload')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
          <div className="petlist-view-toggle">
            <div className={`petlist-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div className={`petlist-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <circle cx="3" cy="6" r="1" fill="currentColor"/>
                <circle cx="3" cy="12" r="1" fill="currentColor"/>
                <circle cx="3" cy="18" r="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="petlist-filter-row">
          <span className="petlist-filter-label">{t('pets.species')}:</span>
          {presentSpecies.map((f) => (
            <button key={f.val}
              className={`petlist-filter-pill ${specFilter === f.val ? 'active' : ''}`}
              onClick={() => setSpecFilter(f.val)}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results bar */}
      <div className="petlist-results-bar">
        <span className="petlist-results-count">
          {filteredPets.length === pets.length
            ? `${pets.length} ${t('petlist.petCount', { count: pets.length })}`
            : `${filteredPets.length} ${t('petlist.of')} ${pets.length}`}
          {hasFilters && (
            <button
              style={{ marginLeft: '.625rem', fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => { setSearch(''); setSpecFilter('all') }}>
              {t('petlist.clearFilters')} ✕
            </button>
          )}
        </span>
      </div>

      {error && (
        <div style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--err-hl)', background: 'var(--err-hl)', padding: '.75rem 1rem', fontSize: '.875rem', color: 'var(--err)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Pet list */}
      {loading ? (
        <div className="grid-auto">{[1, 2, 3].map((i) => <SkeletonPetCard key={i}/>)}</div>
      ) : filteredPets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.375rem' }}>
            {hasFilters ? t('pets.noResults') : t('pets.noPets')}
          </div>
          <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {hasFilters ? t('pets.noResultsHint') : t('pets.noPetsHint')}
          </div>
          {!hasFilters && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              {t('pets.addPet')}
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid-auto">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onClick={() => navigate(`/pets/${pet.id}`)} photo={photos[pet.id]}/>
          ))}
          <div
            className="pet-card"
            style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', minHeight: 200, opacity: .6 }}
            onClick={() => setModalOpen(true)}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseOut={(e)  => (e.currentTarget.style.opacity = '.6')}>
            <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>＋</div>
            <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.5rem' }}>{t('pets.addPet')}</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {filteredPets.map((pet) => (
            <div key={pet.id} className="list-item"
              style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '.875rem 1.25rem', cursor: 'pointer' }}
              onClick={() => navigate(`/pets/${pet.id}`)}>
              <div className="pet-avatar-photo" style={{ width: 48, height: 48, fontSize: '1.375rem' }}>
                {photos[pet.id]
                  ? <img src={photos[pet.id]} alt={pet.name}/>
                  : <span>{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>}
              </div>
              <div className="list-item-info">
                <div className="list-item-title">{pet.name}</div>
                <div className="list-item-sub">{pet.breed ?? t('pet.unknownBreed')} · {pet.species}</div>
              </div>
              <div style={{ display: 'flex', gap: '.375rem', alignItems: 'center' }}>
                {pet.alerts.length > 0 && (
                  <span className={`badge ${pet.alerts[0].type === 'err' ? 'badge-red' : 'badge-yellow'}`}>⚠</span>
                )}
                <MiniVaccRing coverage={calcVaccCoverage(pet.id)} size={38} strokeWidth={4}/>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={addPet}/>
    </div>
  )
}
```

## File: src/App.tsx
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PitutiProvider } from './context/PitutiContext'
import { SymptomsProvider } from './context/SymptomsContext'
import { LanguageProvider } from './context/LanguageContext'
import { CaresProvider } from './context/CaresContext'
import { VetProvider } from './context/VetContext'

import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import PetListPage from './pages/PetListPage'
import PetDetailPage from './pages/PetDetailPage'
import VaccinesPage from './pages/VaccinesPage'
import MedicationsPage from './pages/MedicationsPage'
import SymptomsPage from './pages/SymptomsPage'
import NotesPage from './pages/NotesPage'
import CaresPage from './pages/CaresPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'
import VetPage from './pages/VetPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import { MedicationsProvider } from './context/MedicationsContext'

export default function App() {
  return (
    <LanguageProvider>
      <PitutiProvider>
        <SymptomsProvider>
          <CaresProvider>
            <MedicationsProvider>
            <VetProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="pets" element={<PetListPage />} />
                    <Route path="pets/:petId" element={<PetDetailPage />} />
                    <Route path="vaccines" element={<VaccinesPage />} />
                    <Route path="medications" element={<MedicationsPage />} />
                    <Route path="symptoms" element={<SymptomsPage />} />
                    <Route path="notes" element={<NotesPage />} />
                    <Route path="cares" element={<CaresPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="vet" element={<VetPage />} />
                  </Route>

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </VetProvider>
            </MedicationsProvider>
          </CaresProvider>
        </SymptomsProvider>
      </PitutiProvider>
    </LanguageProvider>
  )
}
```

## File: src/pages/PetDetailPage.tsx
```typescript
//traduzido

import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_PETS, SPECIES_EMOJI, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord, PetWithAlerts } from '../hooks/usePets'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import VaccRing from '../components/VaccRing'
import AddCareModal from '../components/AddCareModal'
import AddMedicationModal from '../components/AddMedicationModal'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import NewNoteModal from '../components/NewNoteModal'
import EditPetModal from '../components/EditPetModal'
import EditCareModal from '../components/EditCareModal'
import PetChipEditOverlay from '../components/PetChipEditOverlay'
import { PfBtn, PfFooter } from '../components/FooterButtons'
import InviteSentOverlay from '../components/InviteSentOverlay'
import type { AddMedData } from '../components/AddMedicationModal'
import type { CareEditData } from '../components/EditCareModal'
import type { SymptomData } from '../components/RegisterSymptomModal'
import { useSymptoms, usePetSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'
import CareDetailModal from '../components/CareDetailModal'
import type { CareDetailItem } from '../components/CareDetailModal'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import MedDetailModal from '../components/MedDetailModal'
import EditMedModal from '../components/EditMedModal'
import type { MedRecord } from '../components/EditMedModal'
import { NoteDetailModal, EditNoteModal } from '../components/NoteModals'
import type { NoteEntry } from '../components/NoteModals'
import { usePetCares, isDueOnDate, getNextDueDate, useCares } from '../context/CaresContext'
import { useMedications } from '../context/MedicationsContext'
import { useTranslation } from 'react-i18next'

type ChipField = 'species' | 'birthDate' | 'weight' | 'caregivers'

const NOTE_ICON: Record<string, string> = {
  control: '🩺', observacion: '📝', emergencia: '🚨',
  vacuna: '💉', cirugia: '🏥', otro: '📋',
}
const NOTE_BG: Record<string, string> = {
  control: 'var(--blue-hl)', observacion: 'var(--primary-hl)', emergencia: 'var(--err-hl)',
  vacuna: 'var(--success-hl)', cirugia: 'var(--warn-hl)', otro: 'var(--surface-offset)',
}
const NOTE_COLOR: Record<string, string> = {
  control: 'var(--blue)', observacion: 'var(--primary)', emergencia: 'var(--err)',
  vacuna: 'var(--success)', cirugia: 'var(--warn)', otro: 'var(--text-muted)',
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}

// ─── Register Vaccine Modal ───────────────────────────────────────────────────

export function RegisterVaccineModal({ petName, isOpen, onClose, vaccines, onRegister }: {
  petName: string; isOpen: boolean; onClose: () => void
  vaccines: VaccineRecord[]
  onRegister: (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => void
}) {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm]     = useState({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.selected) e.selected = t('pet.vacc.errSelect')
    if (!form.date)     e.date     = t('pet.vacc.errDate')
    if (!form.nextDate) e.next     = t('pet.vacc.errNext')
    else if (new Date(form.nextDate) <= new Date(form.date)) e.next = t('pet.vacc.errNextAfter')
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSuccess(true)
    setTimeout(() => {
      onRegister({ name: form.selected, date: form.date, nextDate: form.nextDate, vet: form.vet, notes: form.notes })
      showToast(`💉 "${form.selected}" ${t('pet.vacc.toastRegistered')}`)
      setSuccess(false)
      setForm({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
      setErrors({})
      onClose()
    }, 1000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title={t('pet.vacc.modalTitle')}
      subtitle={t('pet.vacc.modalSubtitle', { name: petName })}
      icon="💉" accentBg="var(--blue-hl)" accentFg="var(--blue)"
      footer={!success
        ? <PfFooter><PfBtn variant="register" onClick={handleSave}>{t('pet.vacc.registerBtn')}</PfBtn></PfFooter>
        : <></>}>
      {success
        ? <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <div className="modal-success-title">{t('pet.vacc.successTitle')}</div>
            <div className="modal-success-sub">{t('pet.vacc.successSub', { name: petName })}</div>
          </div>
        : <>
            <div className="modal-section">{t('pet.vacc.sectionVaccine')}</div>
            <div className="form-group">
              <label className="form-label">{t('pet.vacc.selectLabel')} *</label>
              <select className={['form-input', errors.selected ? 'form-input--err' : ''].join(' ')}
                value={form.selected} onChange={e => set('selected', e.target.value)}>
                <option value="">{t('pet.vacc.selectPh')}</option>
                {vaccines.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
              {errors.selected && <span className="form-hint-err">{errors.selected}</span>}
            </div>
            <div className="modal-section">{t('pet.vacc.sectionDates')}</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('pet.vacc.dateApplied')} *</label>
                <input type="date" className={['form-input', errors.date ? 'form-input--err' : ''].join(' ')}
                  value={form.date} onChange={e => set('date', e.target.value)} />
                {errors.date && <span className="form-hint-err">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">{t('pet.vacc.dateNext')} *</label>
                <input type="date" className={['form-input', errors.next ? 'form-input--err' : ''].join(' ')}
                  value={form.nextDate} onChange={e => set('nextDate', e.target.value)} />
                {errors.next && <span className="form-hint-err">{errors.next}</span>}
              </div>
            </div>
            <div className="modal-section">{t('pet.vacc.sectionExtra')}</div>
            <div className="form-group">
              <label className="form-label">{t('field.vet')} ({t('btn.optional')})</label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input" placeholder={t('pet.vacc.vetPh')}
                  value={form.vet} onChange={e => set('vet', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('field.notes')} ({t('btn.optional')})</label>
              <textarea className="form-input" rows={2} value={form.notes}
                onChange={e => set('notes', e.target.value)}
                style={{ resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
            </div>
          </>}
    </Modal>
  )
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ petName, isOpen, onClose }: {
  petName: string; isOpen: boolean; onClose: () => void
}) {
  const { t } = useTranslation()
  const [email, setEmail]       = useState('')
  const [role, setRole]         = useState('caregiver')
  const [emailErr, setEmailErr] = useState('')
  const [caregivers, setCaregivers] = useState([
    { id: 'tl', initials: 'TL', name: 'Thamires Lopes', role: t('pet.share.roleOwner'), bg: 'var(--pal-lilac)', color: 'var(--nav-bg)', badge: t('pet.share.badgeYou'), removable: false },
    { id: 'am', initials: 'AM', name: 'Ana Martínez',   role: t('pet.share.roleCaregiver'), bg: 'var(--blue-hl)', color: 'var(--blue)', badge: null as string | null, removable: true },
  ])
  const [inviteSent, setInviteSent] = useState(false)
  const [sentEmail, setSentEmail]   = useState('')

  const ACCESS = [
    { val: 'readonly',  icon: '👁',  label: t('pet.share.accessReadonly'),  sub: t('pet.share.accessReadonlySub')  },
    { val: 'caregiver', icon: '✏️', label: t('pet.share.accessCaregiver'), sub: t('pet.share.accessCaregiverSub') },
    { val: 'full',      icon: '⚙️', label: t('pet.share.accessFull'),      sub: t('pet.share.accessFullSub')      },
  ]

  const handleInvite = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailErr(t('pet.share.errEmail'))
      return
    }
    const initials  = email.split('@')[0].slice(0, 2).toUpperCase()
    const roleLabel = ACCESS.find(a => a.val === role)?.label ?? role
    setCaregivers(p => [...p, {
      id: Date.now().toString(), initials, name: email, role: roleLabel,
      bg: 'var(--gold-hl)', color: 'var(--gold)', badge: null, removable: true,
    }])
    setSentEmail(email); setEmail(''); setEmailErr(''); setInviteSent(true)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}
        title={t('pet.share.title')}
        subtitle={t('pet.share.subtitle', { name: petName })}
        icon="👥" accentBg="var(--blue-hl)" accentFg="var(--blue)" size="md"
        footer={<PfFooter><PfBtn variant="add" onClick={handleInvite}>{t('pet.share.sendBtn')}</PfBtn></PfFooter>}>
        <div className="modal-section">
          {t('pet.share.activeCaregivers')} <span className="badge badge-gray">{caregivers.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.5rem' }}>
          {caregivers.map(u => (
            <div key={u.id} className="caregiver-row">
              <div className="caregiver-row-avatar" style={{ background: u.bg, color: u.color }}>{u.initials}</div>
              <div style={{ flex: 1 }}>
                <div className="caregiver-row-name">{u.name}</div>
                <div className="caregiver-row-role">{u.role}</div>
              </div>
              {u.badge
                ? <span className="badge badge-green">{u.badge}</span>
                : <PfBtn variant="delete" size="sm" onClick={() => {
                    setCaregivers(p => p.filter(c => c.id !== u.id))
                    showToast(t('pet.share.toastRemoved'))
                  }}>{t('btn.delete')}</PfBtn>}
            </div>
          ))}
        </div>
        <div className="modal-section">{t('pet.share.inviteTitle')}</div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">{t('field.email')} *</label>
          <div className="field-icon-wrap" style={{ width: '100%' }}>
            <span className="field-icon">✉</span>
            <input className={['form-input', emailErr ? 'form-input--err' : ''].join(' ')}
              type="email" placeholder={t('pet.share.emailPh')}
              value={email} onChange={e => { setEmail(e.target.value); setEmailErr('') }}
              style={{ width: '100%' }} />
          </div>
          {emailErr && <span className="form-hint-err">{emailErr}</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('pet.share.accessLevel')}</label>
          <div className="access-options">
            {ACCESS.map(a => (
              <div key={a.val}
                className={['access-option', role === a.val ? 'selected' : ''].join(' ')}
                onClick={() => setRole(a.val)}>
                <div className="access-option-icon">{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="access-option-label">{a.label}</div>
                  <div className="access-option-sub">{a.sub}</div>
                </div>
                <div className="access-radio" />
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {inviteSent && <InviteSentOverlay email={sentEmail} onClose={() => setInviteSent(false)} />}
    </>
  )
}

// ─── Tab Cares ────────────────────────────────────────────────────────────────

function TabCares({ petId, petName }: { petId: string; petName: string }) {
  const { t } = useTranslation()
  const petItems = usePetCares(petId)
  const { addCare, editCare, deleteCare, setCareProgress } = useCares()
  const today = new Date().toISOString().split('T')[0]

  const daily = petItems.filter(i => isDueOnDate(i, today))
  const scheduled = petItems
    .filter(i => i.intervalDays > 1 && !isDueOnDate(i, today))
    .map(i => ({ item: i, nextDate: getNextDueDate(i, today) }))
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))

  const [editItem, setEditItem]   = useState<CareEditData | null>(null)
  const [editOpen, setEditOpen]   = useState(false)
  const [addOpen, setAddOpen]     = useState(false)
  const [detailItem, setDetailItem] = useState<CareDetailItem | null>(null)

  const getDone = (item: ReturnType<typeof usePetCares>[0]) =>
    item.doneByDate[today] ?? { done: 0, doneState: false }

  const toDetailItem = (item: ReturnType<typeof usePetCares>[0]): CareDetailItem => {
    const d = getDone(item)
    return {
      id: item.id, petId, emoji: item.emoji, title: item.title,
      sub: item.sub, total: item.total, done: d.done, done_state: d.doneState, bg: item.bg,
    }
  }

  return (
    <>
      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
            {t('pet.cares.todayTitle')}
          </div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {t('pet.cares.todayProgress', {
              done:  String(daily.filter(i => getDone(i).doneState).length),
              total: String(daily.length),
            })}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('btn.add')}
        </button>
      </div>

      {/* Grid de cuidados */}
      <div className="care-grid">
        {daily.map(item => {
          const d = getDone(item)
          return (
            <div key={item.id}
              className={['care-card', d.doneState ? 'done' : ''].join(' ')}
              onClick={() => setDetailItem(toDetailItem(item))}
              style={{ cursor: 'pointer' }}>
              <div className="care-header">
                <div className="care-emoji" style={{ background: item.bg }}>{item.emoji}</div>
                <div>
                  <div className="care-title">{item.title}</div>
                  <div className="care-sub">{item.sub}</div>
                </div>
              </div>
              <div className="care-progress">
                <div className="care-dots">
                  {Array.from({ length: Math.min(item.total, 7) }).map((_, j) => (
                    <div key={j} className={`care-dot ${j < d.done ? 'done' : ''}`} />
                  ))}
                </div>
                <span>
                  {d.doneState
                    ? <span style={{ color: 'var(--success)' }}>{t('pet.cares.done')}</span>
                    : `${d.done}/${item.total}`}
                </span>
              </div>
              <div className="care-actions" onClick={e => e.stopPropagation()}>
                <button
                  className={`care-btn-do ${d.doneState ? 'done-btn' : ''}`}
                  onClick={() => {
                    const ns = !getDone(item).doneState
                    setCareProgress(item.id, today, ns ? item.total : 0, ns)
                    showToast(ns
                      ? `✓ ${item.title} ${t('pet.cares.toastDone')}`
                      : `↩ ${item.title} ${t('pet.cares.toastUndone')}`)
                  }}>
                  {d.doneState ? t('pet.cares.done') : t('pet.cares.register')}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Próximos cuidados programados */}
      {scheduled.length > 0 && (
        <div style={{
          marginTop: '1rem', background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '.875rem 1rem',
        }}>
          <div style={{
            fontSize: '.75rem', fontWeight: 800, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem',
          }}>
            📅 {t('pet.cares.scheduled')}
          </div>
          {scheduled.map(({ item, nextDate }) => {
            const daysFromNow = Math.round(
              (new Date(nextDate + 'T00:00:00').getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
            )
            const dateLabel = new Date(nextDate + 'T12:00:00').toLocaleDateString(undefined, {
              weekday: 'short', day: 'numeric', month: 'short',
            })
            return (
              <div key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.625rem .25rem',
                  borderBottom: '1px solid var(--divider)', cursor: 'pointer',
                }}
                onClick={() => setDetailItem(toDetailItem(item))}>
                <div style={{
                  background: item.bg, width: 36, height: 36, borderRadius: 'var(--r-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0,
                }}>{item.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)' }}>{item.title}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{item.sub}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '.8125rem', fontWeight: 800, color: 'var(--primary)' }}>{dateLabel}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', marginTop: '.1rem' }}>
                    {daysFromNow === 0 ? t('vet.time.today') : t('vet.time.inDays', { n: String(daysFromNow) })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal detalle */}
      {detailItem && (
        <CareDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggle={(id, newDone, newState) => {
            setCareProgress(id, today, newDone, newState)
            setDetailItem(prev => prev ? { ...prev, done: newDone, done_state: newState } : null)
          }}
          onEdit={detail => {
            setDetailItem(null)
            const item = petItems.find(i => i.id === detail.id)
            if (item) {
              setEditItem({
                id: item.id, emoji: item.emoji, title: item.title, total: item.total,
                period: item.period, quantity: item.quantity, notify: item.notify, bg: item.bg,
                time: item.time, intervalDays: item.intervalDays, recurring: item.recurring,
              })
              setEditOpen(true)
            }
          }}
        />
      )}

      {/* Modal editar cuidado */}
      <EditCareModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        care={editItem}
        onSave={updated => {
          const item = petItems.find(i => i.id === updated.id)
          if (!item) return
          editCare({
            ...item,
            emoji: updated.emoji, title: updated.title, total: updated.total,
            period: updated.period ?? 'day', quantity: updated.quantity ?? '',
            notify: updated.notify,
            sub: `${updated.total}× ${updated.period === 'day' ? t('pet.cares.periodDay') : t('pet.cares.periodWeek')}${updated.quantity ? ' · ' + updated.quantity : ''}`,
            time: updated.time ?? '', intervalDays: updated.intervalDays ?? 1,
            recurring: updated.recurring ?? true,
          })
          showToast(`${updated.emoji} ${updated.title} ${t('pet.cares.toastUpdated')}`)
          setEditOpen(false)
        }}
        onDelete={id => {
          deleteCare(id)
          setEditOpen(false)
          showToast(t('pet.cares.toastDeleted'))
        }}
      />

      {/* Modal añadir cuidado */}
      <AddCareModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        defaultPetId={petId}
        onAdd={d => {
          addCare({
            petId: d.petId, emoji: d.emoji, title: d.title,
            sub: `${d.total}× ${d.period === 'day' ? t('pet.cares.periodDay') : t('pet.cares.periodWeek')}${d.quantity ? ' · ' + d.quantity : ''}`,
            total: d.total, period: d.period ?? 'day', quantity: d.quantity,
            notify: d.notify, bg: '', time: d.time ?? '',
            intervalDays: d.intervalDays ?? 1, recurring: d.recurring ?? true, startDate: today,
          })
          showToast(`${d.emoji} ${d.title} ${t('pet.cares.toastAdded')}`)
        }}
      />
    </>
  )
}

// ─── Tab Vaccines ─────────────────────────────────────────────────────────────

function TabVaccines({ petId, petName }: { petId: string; petName: string }) {
  const { t } = useTranslation()
  const [registerOpen, setRegisterOpen]   = useState(false)
  const [extraVacc, setExtraVacc]         = useState<VaccineRecord[]>([])
  const [vaccDetail, setVaccDetail]       = useState<(VaccineRecord & { cls: 'ok' | 'soon' | 'late' }) | null>(null)
  const [editVacc, setEditVacc]           = useState<VaccineRecord | null>(null)
  const [editVaccOpen, setEditVaccOpen]   = useState(false)

  const base       = VACCINES_BY_PET[petId] ?? []
  const vaccines   = [...base, ...extraVacc]
  const withStatus = vaccines.map(v => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late' }))
  const okCount    = withStatus.filter(v => v.cls === 'ok').length
  const alDia      = withStatus.filter(v => v.cls === 'ok' || v.cls === 'soon').length
  const pending    = withStatus.filter(v => v.cls === 'soon' || v.cls === 'late').length
  const total      = vaccines.length
  const cov        = total > 0 ? Math.round(okCount / total * 100) : 100
  const alPct      = total > 0 ? Math.round(alDia / total * 100) : 100
  const penPct     = total > 0 ? Math.round(pending / total * 100) : 0

  const VACC_BADGE = {
    ok:   { badge: t('pet.vacc.badgeOk'),   cls: 'badge-green'  },
    soon: { badge: t('pet.vacc.badgeSoon'), cls: 'badge-yellow' },
    late: { badge: t('pet.vacc.badgeLate'), cls: 'badge-red'    },
  }

  const handleRegister = ({ name, date, nextDate }: {
    name: string; date: string; nextDate: string; vet: string; notes: string
  }) => {
    const lbl = new Date(date + 'T12:00:00').toLocaleDateString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    const cls = getVaccStatus(nextDate) as 'ok' | 'soon' | 'late'
    setExtraVacc(prev => [...prev, {
      name, applied: lbl, nextDate,
      badge:    VACC_BADGE[cls].badge,
      badgeCls: VACC_BADGE[cls].cls,
    }])
  }

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            {t('pet.vacc.title')}
            <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>
              💉 {t('pet.vacc.registerBtn')}
            </button>
          </div>
          {withStatus.length === 0
            ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {t('pet.vacc.empty')}
              </div>
            : withStatus.map(v => (
                <div key={v.name + v.nextDate} className="vaccine-row"
                  onClick={() => setVaccDetail(v)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.75rem 0', borderBottom: '1.5px solid var(--divider)', cursor: 'pointer' }}>
                  <div className="vaccine-icon" style={{
                    background: v.cls === 'ok' ? 'var(--success-hl)' : v.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                    color:      v.cls === 'ok' ? 'var(--success)'    : v.cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
                  }}>💉</div>
                  <div style={{ flex: 1 }}>
                    <div className="vaccine-name">{v.name}</div>
                    <div className="vaccine-date">{t('pet.vacc.applied')} {v.applied}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`vaccine-next ${v.cls}`}>
                      {v.cls === 'late'
                        ? `${t('pet.vacc.expired')} · ${new Date(v.nextDate + 'T12:00:00').toLocaleDateString()}`
                        : `${t('pet.vacc.next')} ${new Date(v.nextDate + 'T12:00:00').toLocaleDateString()}`}
                    </div>
                    <span className={`badge ${v.badgeCls}`} style={{ fontSize: '.6rem' }}>{v.badge}</span>
                  </div>
                </div>
              ))}
        </div>
        <div className="card">
          <div className="card-title">{t('pet.vacc.coverage')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8} />
          </div>
          {[
            { label: t('pet.vacc.coverageTotal'), pct: cov,   color: ''      },
            { label: t('pet.vacc.coverageOk'),    pct: alPct, color: 'success' },
            { label: t('pet.vacc.coveragePending'), pct: penPct, color: penPct > 0 ? 'warn' : 'success' },
          ].map(b => (
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

      <RegisterVaccineModal petName={petName} isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister} />

      <VaccineDetailModal
        vaccine={vaccDetail ? { ...vaccDetail, petName, petEmoji: SPECIES_EMOJI[petId] ?? '🐾' } : null}
        onClose={() => setVaccDetail(null)}
        onEdit={v => { setVaccDetail(null); setEditVacc(v); setEditVaccOpen(true) }}
        onMarkApplied={(v, appliedDate, nextDate) => {
          const lbl = new Date(appliedDate + 'T12:00:00').toLocaleDateString(undefined, {
            day: '2-digit', month: 'short', year: 'numeric',
          })
          const cls = getVaccStatus(nextDate) as 'ok' | 'soon' | 'late'
          const updated: VaccineRecord = { ...v, applied: lbl, nextDate, ...VACC_BADGE[cls] }
          setExtraVacc(prev => {
            const exists = prev.find(x => x.name === v.name)
            return exists ? prev.map(x => x.name === v.name ? updated : x) : [...prev, updated]
          })
          setVaccDetail(null)
          showToast(t('pet.vacc.toastApplied'))
        }}
      />

      <EditVaccineModal
        isOpen={editVaccOpen}
        onClose={() => setEditVaccOpen(false)}
        vaccine={editVacc}
        onSave={updated => {
          setExtraVacc(prev => {
            const exists = prev.find(x => x.name === updated.name)
            return exists ? prev.map(x => x.name === updated.name ? updated : x) : [...prev, updated]
          })
          setEditVaccOpen(false)
          showToast(t('pet.vacc.toastUpdated'))
        }}
      />
    </>
  )
}

// ─── Pet Detail Page ──────────────────────────────────────────────────────────

export default function PetDetailPage() {
  const { t } = useTranslation()
  const { petId }  = useParams<{ petId: string }>()
  const navigate   = useNavigate()

  const [activeTab, setActiveTab]         = useState(0)
  const [shareOpen, setShareOpen]         = useState(false)
  const [editOpen, setEditOpen]           = useState(false)
  const [addMedOpen, setAddMedOpen]       = useState(false)
  const [addNoteOpen, setAddNoteOpen]     = useState(false)
  const [addSymptomOpen, setAddSymptomOpen] = useState(false)
  const [chipField, setChipField]         = useState<ChipField | null>(null)
  const [petData, setPetData]             = useState<PetWithAlerts>(
    MOCK_PETS.find(p => p.id === petId) ?? MOCK_PETS[0]
  )
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    try { return localStorage.getItem('pet-photo-' + (petId ?? MOCK_PETS[0].id)) } catch { return null }
  })

  const { addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const { active: activeSymptoms, resolved: resolvedSymptoms } = usePetSymptoms(petData.id)
  const [detailSym, setDetailSym]   = useState<SymptomEntry | null>(null)
  const [editSym, setEditSym]       = useState<SymptomEntry | null>(null)
  const [editSymOpen, setEditSymOpen] = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)

  const { getActiveMedicationsByPetId, addMedication, updateMedication, deleteMedication } = useMedications()
  const localMeds = getActiveMedicationsByPetId(petData.id)

  const [medDetail, setMedDetail]     = useState<MedRecord | null>(null)
  const [editMed, setEditMed]         = useState<MedRecord | null>(null)
  const [editMedOpen, setEditMedOpen] = useState(false)

  const [localNotes, setLocalNotes] = useState<NoteEntry[]>([{
    id: 'note-1', petId: petData.id,
    content: `${petData.name} en buen estado. Peso estable. Revisar vacuna antirrábica.`,
    vet: 'Dra. Martínez', date: '2026-01-10', type: 'control', archived: false,
  }])
  const [noteDetail, setNoteDetail]     = useState<NoteEntry | null>(null)
  const [editNote, setEditNote]         = useState<NoteEntry | null>(null)
  const [editNoteOpen, setEditNoteOpen] = useState(false)

  const NOTE_LABEL: Record<string, string> = {
    control:     t('pet.noteType.control'),
    observacion: t('pet.noteType.observacion'),
    emergencia:  t('pet.noteType.emergencia'),
    vacuna:      t('pet.noteType.vacuna'),
    cirugia:     t('pet.noteType.cirugia'),
    otro:        t('pet.noteType.otro'),
  }

  const TABS = [
    `🐾 ${t('pet.tabs.cares')}`,
    t('pet.tabs.vaccines'),
    t('pet.tabs.medications'),
    t('pet.tabs.symptoms'),
    t('pet.tabs.notes'),
    t('pet.tabs.history'),
  ]

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const r = ev.target?.result as string
      if (r) {
        setPhotoUrl(r)
        try { localStorage.setItem('pet-photo-' + petData.id, r) } catch {}
        showToast(t('pet.toastPhoto'))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChipSave = (updated: Partial<PetWithAlerts>) => {
    setPetData(prev => ({ ...prev, ...updated }))
    setChipField(null)
  }

  type HistItem = { cls: string; icon: string; title: string; meta: string; time: string; medId?: string; noteId?: string }
  const [histDetail, setHistDetail] = useState<HistItem | null>(null)

  const SEV_COLOR: Record<string, string> = { leve: 'var(--gold)', moderado: 'var(--warn)', grave: 'var(--err)', emergencia: 'var(--err)' }
  const SEV_BG: Record<string, string>    = { leve: 'var(--gold-hl)', moderado: 'var(--warn-hl)', grave: 'var(--err-hl)', emergencia: 'var(--err-hl)' }
  const CAT_ICON: Record<string, string>  = { digestivo: '🤢', respiratorio: '🫁', piel: '🩹', comportamiento: '🧠', movimiento: '🦶', ocular: '👁', otro: '❓' }

  const SPECIES_LABEL: Record<string, string> = {
    cat: `${t('pet.speciesCat')} 🐱`,
    dog: `${t('pet.speciesDog')} 🐶`,
    bird: `${t('pet.speciesBird')} 🦜`,
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}
        onClick={() => navigate('/pets')}>
        ← {t('pet.backToList')}
      </button>

      {/* Hero de la mascota */}
      <div className="pet-profile-hero">
        <div className="pet-photo-wrap">
          <div className="pet-photo-circle">
            {photoUrl
              ? <img src={photoUrl} alt={petData.name} />
              : <span>{SPECIES_EMOJI[petData.species] ?? '🐾'}</span>}
          </div>
          <button className="pet-photo-btn" onClick={() => photoRef.current?.click()}
            title={t('pet.changePhoto')}>📷</button>
          <input ref={photoRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handlePhotoChange} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>{petData.name}</h1>
            <span style={{ fontSize: '1.1rem' }}>{SPECIES_EMOJI[petData.species]}</span>
            <span className="badge badge-green" style={{ marginLeft: '.25rem' }}>{t('pet.statusHealthy')}</span>
          </div>
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
            {petData.breed ?? t('pet.unknownBreed')} · 4 {t('pet.years')}
          </p>
          <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
            {petData.alerts.map((a, i) => (
              <span key={i} className={`badge ${a.type === 'err' ? 'badge-red' : 'badge-yellow'}`}>
                {a.type === 'warn' ? '⚠️' : '🔴'} {a.text.slice(0, 28)}…
              </span>
            ))}
            <span className="badge badge-blue">💊 {t('pet.activeMed')}</span>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}>
          ✏ {t('btn.edit')}
        </button>
      </div>

      {/* Chips de estadísticas */}
      <div className="stat-row">
        {([
          { label: t('pet.chipSpecies'),    field: 'species'   as ChipField, value: SPECIES_LABEL[petData.species] ?? petData.species },
          { label: t('pet.chipBirth'),      field: 'birthDate' as ChipField, value: petData.birthDate ? new Date(petData.birthDate + 'T12:00:00').toLocaleDateString() : '—' },
          { label: t('pet.chipWeight'),     field: 'weight'    as ChipField, value: petData.species === 'cat' ? '4.2 kg' : petData.species === 'dog' ? '12.4 kg' : '32 g' },
          { label: t('pet.chipCaregivers'), field: 'caregivers' as ChipField, value: null },
        ] as const).map(s => (
          <div key={s.label} className="stat-chip clickable"
            onClick={() => setChipField(s.field)}
            title={`${t('btn.edit')} ${s.label}`}>
            <span className="stat-chip-edit-hint">✏</span>
            <div className="stat-chip-label">{s.label}</div>
            {s.value
              ? <div className="stat-chip-value" style={{ fontSize: '1rem' }}>{s.value}</div>
              : <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem' }}>TL</div>
                  {petData.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
                </div>}
          </div>
        ))}
      </div>

      {/* Barra de cuidadores */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1.125rem', padding: '.75rem 1rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-sm)' }}>
        <span style={{ fontSize: '.8125rem', fontWeight: 700, color: 'var(--text-muted)', flex: 1 }}>
          {t('pet.sharedCaregivers')}
        </span>
        <div className="caregiver-avatars">
          <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem' }}>TL</div>
          {petData.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShareOpen(true)}>
          👥 {t('pet.share.openBtn')}
        </button>
      </div>

      <div className="tabs">
        {TABS.map((tab, i) => (
          <div key={tab} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab}
          </div>
        ))}
      </div>

      {activeTab === 0 && <TabCares petId={petData.id} petName={petData.name} />}
      {activeTab === 1 && <TabVaccines petId={petData.id} petName={petData.name} />}

      {/* Tab Medicamentos */}
      {activeTab === 2 && (
        <div className="card">
          <div className="card-title">
            {t('pet.tabs.medications')}
            <button className="btn btn-primary btn-sm" onClick={() => setAddMedOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              {t('btn.add')}
            </button>
          </div>
          {localMeds.map(m => (
            <div key={m.id} className="list-item" onClick={() => setMedDetail(m)} style={{ cursor: 'pointer' }}>
              <div className="list-item-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
              <div className="list-item-info">
                <div className="list-item-title">{m.title}</div>
                <div className="list-item-sub">{[m.dose, m.frequency].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="list-item-right"><span className={`badge ${m.badgeCls}`}>{m.badge}</span></div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Síntomas */}
      {activeTab === 3 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              {t('pet.symptoms.title', { name: petData.name })}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setAddSymptomOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              {t('pet.symptoms.registerBtn')}
            </button>
          </div>
          {activeSymptoms.length === 0 && resolvedSymptoms.length === 0
            ? <div className="empty-state" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🐾</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.375rem' }}>
                  {t('pet.symptoms.emptyTitle', { name: petData.name })}
                </div>
                <div style={{ fontSize: '.875rem', marginBottom: '1.25rem' }}>
                  {t('pet.symptoms.emptyText')}
                </div>
              </div>
            : <div className="grid-2">
                <div className="card">
                  <div className="card-title">
                    {t('pet.symptoms.active')}
                    {activeSymptoms.length > 0 && <span className="badge badge-red">{activeSymptoms.length}</span>}
                  </div>
                  {activeSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                        {t('pet.symptoms.noneActive')}
                      </div>
                    : activeSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: SEV_BG[s.severity] || 'var(--err-hl)', color: SEV_COLOR[s.severity] || 'var(--err)' }}>
                            {CAT_ICON[s.category] ?? '🌡️'}
                          </div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · {new Date(s.date + 'T12:00:00').toLocaleDateString()}</div>
                          </div>
                          <span className="badge badge-yellow" style={{ flexShrink: 0 }}>{t('pet.symptoms.statusActive')}</span>
                        </div>
                      ))}
                </div>
                <div className="card">
                  <div className="card-title">{t('pet.symptoms.resolved')}</div>
                  {resolvedSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                        {t('pet.symptoms.noneResolved')}
                      </div>
                    : resolvedSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" style={{ opacity: .7 }} onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: 'var(--surface-offset)', color: 'var(--text-faint)' }}>
                            {CAT_ICON[s.category] ?? '🌡️'}
                          </div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · {t('pet.symptoms.statusResolved')}</div>
                          </div>
                          <span className="badge badge-gray" style={{ flexShrink: 0 }}>{t('pet.symptoms.statusResolved')}</span>
                        </div>
                      ))}
                </div>
              </div>}
        </div>
      )}

      {/* Tab Notas */}
      {activeTab === 4 && (
        <div className="card">
          <div className="card-title">
            {t('pet.tabs.notes')}
            <button className="btn btn-primary btn-sm" onClick={() => setAddNoteOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              {t('pet.notes.newBtn')}
            </button>
          </div>
          {localNotes.length === 0
            ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {t('pet.notes.empty')}
              </div>
            : localNotes.map(n => (
                <div key={n.id} className="list-item" onClick={() => setNoteDetail(n)} style={{ cursor: 'pointer' }}>
                  <div className="list-item-icon" style={{ background: NOTE_BG[n.type] ?? 'var(--primary-hl)', color: NOTE_COLOR[n.type] ?? 'var(--primary)' }}>
                    {NOTE_ICON[n.type] ?? '📋'}
                  </div>
                  <div className="list-item-info">
                    <div className="list-item-title">
                      {NOTE_LABEL[n.type] ?? t('pet.noteType.otro')}{n.vet ? ` — ${n.vet}` : ''}
                    </div>
                    <div className="list-item-sub">{n.content.slice(0, 70)}{n.content.length > 70 ? '…' : ''}</div>
                  </div>
                  <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
                    {n.date ? new Date(n.date + 'T12:00:00').toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) : ''}
                  </span>
                </div>
              ))}
        </div>
      )}

      {/* Tab Historial */}
      {activeTab === 5 && (
        <div className="card">
          <div className="card-title">{t('pet.history.title')}</div>
          <div className="timeline">
            {[
              { cls: 'vaccine', icon: '💉', title: t('pet.history.item1Title'), meta: 'Dra. García · VetSalud', time: t('vet.time.today'), medId: undefined, noteId: undefined },
              { cls: 'med',     icon: '💊', title: 'Bravecto',                 meta: '1 comprimido',            time: t('pet.history.3daysAgo'), medId: 'm1',   noteId: undefined },
              { cls: 'note',    icon: '📋', title: t('pet.noteType.control'),  meta: 'Peso 4.2 kg',             time: '10 ene',                  medId: undefined, noteId: 'note-1' },
            ].map(e => (
              <div key={e.title} className="timeline-item" onClick={() => setHistDetail(e)} style={{ cursor: 'pointer' }}>
                <div className={`tl-icon ${e.cls}`}>{e.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="tl-title">{e.title}</div>
                  <div className="tl-meta">{e.meta}</div>
                </div>
                <div className="tl-time">{e.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modales */}
      <ShareModal petName={petData.name} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <EditPetModal isOpen={editOpen} onClose={() => setEditOpen(false)} onSave={setPetData} pet={petData} />
      <AddMedicationModal
        isOpen={addMedOpen}
        onClose={() => setAddMedOpen(false)}
        onAdd={(d: AddMedData) => { addMedication(d); setAddMedOpen(false) }}
        defaultPetId={petData.id}
      />
      <NewNoteModal
        isOpen={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        onAdd={d => {
          setLocalNotes(p => [{
            id: `n${Date.now()}`, petId: petData.id,
            content: d.content, vet: d.vet || '', date: d.date, type: d.type, archived: false,
          }, ...p])
          setAddNoteOpen(false)
          showToast(t('pet.notes.toastAdded'))
        }}
        defaultPetId={petData.id}
      />
      <RegisterSymptomModal
        isOpen={addSymptomOpen}
        onClose={() => setAddSymptomOpen(false)}
        onAdd={(d: SymptomData) => {
          addSymptom({ ...d, resolved: false })
          setAddSymptomOpen(false)
          showToast(t('pet.symptoms.toastAdded'))
        }}
        defaultPetId={petData.id}
      />
      <SymptomDetailModal symptom={detailSym} onClose={() => setDetailSym(null)}
        onEdit={s => { setDetailSym(null); setEditSym(s); setEditSymOpen(true) }}
        onResolve={id    => { resolve(id);   setDetailSym(null); showToast(t('pet.symptoms.toastResolved')) }}
        onUnresolve={id  => { unresolve(id); setDetailSym(null); showToast(t('pet.symptoms.toastReopened')) }} />
      <EditSymptomModal isOpen={editSymOpen} onClose={() => setEditSymOpen(false)} symptom={editSym}
        onSave={updated => { saveSymptom(updated); setEditSymOpen(false); showToast(t('pet.symptoms.toastUpdated')) }} />

      <MedDetailModal
        med={medDetail}
        onClose={() => setMedDetail(null)}
        onEdit={m => { setMedDetail(null); setEditMed(m); setEditMedOpen(true) }}
        onMarkAdministered={(m, _date) => { showToast(`💊 ${m.title} ${t('pet.med.toastAdministered')}`); setMedDetail(null) }}
      />
      <EditMedModal
        isOpen={editMedOpen}
        onClose={() => setEditMedOpen(false)}
        med={editMed}
        onSave={updated => {
          updateMedication(updated)
          setEditMedOpen(false)
          showToast(t('pet.med.toastUpdated'))
        }}
        onDelete={id => {
          deleteMedication(id)
          setEditMedOpen(false)
          showToast(t('pet.med.toastDeleted'))
        }}
      />

      {/* Overlay detalle historial */}
      {histDetail && (
        <div className="detail-overlay" onClick={() => setHistDetail(null)}>
          <div className="detail-sheet" onClick={e => e.stopPropagation()}>
            <div className="detail-header">
              <div className="detail-icon" style={{
                background: histDetail.cls === 'vaccine' ? 'var(--blue-hl)' : histDetail.cls === 'med' ? 'var(--warn-hl)' : 'var(--primary-hl)',
                color:      histDetail.cls === 'vaccine' ? 'var(--blue)'    : histDetail.cls === 'med' ? 'var(--warn)'    : 'var(--primary)',
                fontSize: '1.375rem',
              }}>{histDetail.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{histDetail.title}</div>
                <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{histDetail.meta}</div>
              </div>
              <button className="detail-close" onClick={() => setHistDetail(null)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="detail-body">
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="status-pill ok">{histDetail.time}</span>
                <span className="badge badge-blue" style={{ fontSize: '.72rem' }}>
                  {histDetail.cls === 'vaccine' ? `💉 ${t('pet.tabs.vaccines')}` : histDetail.cls === 'med' ? `💊 ${t('pet.tabs.medications')}` : `📋 ${t('pet.tabs.notes')}`}
                </span>
              </div>
              <div className="detail-info-grid">
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.event')}</div>
                  <div className="detail-info-value">{histDetail.title}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.detail')}</div>
                  <div className="detail-info-value">{histDetail.meta}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.date')}</div>
                  <div className="detail-info-value">{histDetail.time}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.pet')}</div>
                  <div className="detail-info-value">{SPECIES_EMOJI[petData.species] ?? '🐾'} {petData.name}</div>
                </div>
              </div>
            </div>
            <div className="detail-footer">
              {histDetail.cls === 'vaccine' && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  setActiveTab(1); setHistDetail(null)
                  showToast(t('pet.history.toastGoVaccines'))
                }}>
                  ✏ {t('pet.history.goVaccines')}
                </button>
              )}
              {histDetail.cls === 'med' && histDetail.medId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const m = localMeds.find(x => x.id === histDetail.medId)
                  if (m) { setEditMed(m); setEditMedOpen(true); setHistDetail(null) }
                }}>✏ {t('pet.history.editMed')}</button>
              )}
              {histDetail.cls === 'note' && histDetail.noteId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const n = localNotes.find(x => x.id === histDetail.noteId)
                  if (n) { setEditNote(n); setEditNoteOpen(true); setHistDetail(null) }
                }}>✏ {t('pet.history.editNote')}</button>
              )}
              <button className="btn btn-secondary" onClick={() => setHistDetail(null)}>
                {t('btn.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <NoteDetailModal
        note={noteDetail}
        onClose={() => setNoteDetail(null)}
        onEdit={n => { setNoteDetail(null); setEditNote(n); setEditNoteOpen(true) }}
        onArchive={id    => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: true }  : n)); setNoteDetail(null); showToast(t('pet.notes.toastArchived'))   }}
        onUnarchive={id  => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: false } : n)); setNoteDetail(null); showToast(t('pet.notes.toastRestored'))   }}
        onDelete={id     => { setLocalNotes(p => p.filter(n => n.id !== id));                               setNoteDetail(null); showToast(t('pet.notes.toastDeleted'))    }}
      />
      <EditNoteModal
        isOpen={editNoteOpen}
        onClose={() => setEditNoteOpen(false)}
        note={editNote}
        onSave={updated => {
          setLocalNotes(p => p.map(n => n.id === updated.id ? updated : n))
          setEditNoteOpen(false)
          showToast(t('pet.notes.toastUpdated'))
        }}
      />

      <PetChipEditOverlay pet={petData} field={chipField} onClose={() => setChipField(null)} onSave={handleChipSave} />
    </div>
  )
}
```
