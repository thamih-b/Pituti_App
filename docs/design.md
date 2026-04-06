## Visión general

PITUTI es una aplicación fullstack para la gestión colaborativa del cuidado de mascotas. Múltiples tutores pueden compartir el seguimiento de vacunas, medicamentos, síntomas, alimentación y documentos de un mismo animal. La arquitectura sigue una separación clara entre frontend (React), API REST (Express) y capa de datos.

***

## Estructura de componentes del frontend

### Páginas (src/pages/)

Cada página corresponde a una ruta de React Router. Son responsables de cargar datos mediante hooks y componer la UI con componentes reutilizables.

| Página | Ruta | Descripción |
|---|---|---|
| `LoginPage` | `/login` | Formulario de inicio de sesión |
| `RegisterPage` | `/register` | Formulario de registro de nuevo usuario |
| `DashboardPage` | `/dashboard` | Vista general con resumen de todas las mascotas |
| `PetListPage` | `/pets` | Listado de mascotas del tutor |
| `PetFormPage` | `/pets/new` y `/pets/:petId/edit` | Crear o editar mascota |
| `PetDetailPage` | `/pets/:petId` | Perfil completo de una mascota |
| `PetHealthPage` | `/pets/:petId/health` | Vacunas, medicamentos e historial veterinario |
| `PetFeedingsPage` | `/pets/:petId/feedings` | Registro de alimentación |
| `PetSymptomsPage` | `/pets/:petId/symptoms` | Registro de síntomas |
| `PetDocumentsPage` | `/pets/:petId/documents` | Documentos subidos |
| `PetCaregiversPage` | `/pets/:petId/caregivers` | Tutores vinculados a la mascota |
| `NotFoundPage` | `*` | Página 404 |

### Componentes reutilizables (src/components/)

Los componentes reutilizables son independientes del dominio y pueden usarse en varias páginas.

**UI base:**
- `Button` — botón con variantes (primary, secondary, ghost, danger)
- `Input` — campo de texto con label, placeholder y estado de error
- `Modal` — overlay genérico con título y acción de cierre
- `Badge` — etiqueta de estado (activo, vencido, próximo)
- `Avatar` — imagen circular de perfil con fallback de iniciales
- `Card` — contenedor con sombra y borde sutil
- `EmptyState` — mensaje + icono + CTA cuando no hay datos
- `LoadingSpinner` — indicador de carga circular
- `SkeletonLoader` — esqueleto animado que espeja el layout real
- `Divider` — separador visual horizontal

**Dominio pets:**
- `PetCard` — tarjeta resumida de una mascota (nombre, especie, foto)
- `PetProfileHeader` — cabecera del perfil con foto, nombre y especie
- `PetAvatarUploader` — componente de subida de foto de mascota
- `OverviewCard` — card de resumen de una categoría (vacunas, medicamentos, etc.)

**Dominio salud:**
- `VaccineList` — lista de vacunas con estado por dosis
- `VaccineForm` — formulario de nueva vacuna
- `MedicationList` — lista de medicamentos activos
- `MedicationForm` — formulario de nuevo medicamento
- `SymptomList` — lista de síntomas registrados
- `SymptomForm` — formulario de nuevo síntoma

**Dominio rutina:**
- `FeedingList` — historial de alimentación
- `FeedingForm` — formulario de nuevo registro de alimentación
- `NoteList` — lista de anotaciones diarias
- `NoteForm` — formulario de nueva nota

**Dominio documentos y actividad:**
- `DocumentList` — lista de documentos subidos
- `DocumentUploader` — componente de subida de archivos
- `ActivityFeed` — historial de acciones de todos los tutores

**Navegación:**
- `AppLayout` — layout principal con sidebar/header y outlet de rutas
- `Navbar` — barra de navegación superior
- `Sidebar` — navegación lateral (desktop)
- `BottomNav` — navegación inferior (mobile)

***

## Componentes que serán reutilizables

La regla es: un componente es reutilizable si puede funcionar con datos diferentes sin cambiar su código interno. La lista priorizada:

1. `Button`, `Input`, `Modal`, `Badge`, `Card`, `EmptyState`, `SkeletonLoader` — reutilizables en toda la app
2. `PetCard` — reutilizable en listados y dashboard
3. `OverviewCard` — reutilizable para vacunas, medicamentos y síntomas
4. `ActivityFeed` — reutilizable en detalle de mascota y dashboard
5. Todos los formularios (`VaccineForm`, `MedicationForm`, etc.) — reutilizables para crear y editar mediante prop `initialData`

***

## Gestión del estado

La aplicación usa tres niveles de estado, cada uno con una responsabilidad clara:

| Nivel | Herramienta | Qué gestiona |
|---|---|---|
| **Estado local** | `useState` | UI: modales abiertos, valores de formularios, pestañas activas |
| **Estado global** | Context API (`AuthContext`, `PetContext`) | Usuario autenticado, mascota seleccionada actualmente |
| **Estado del servidor** | Custom hooks (`usePets`, `useVaccines`, etc.) | Datos cargados desde la API, con loading, data y error |

### AuthContext
Guarda el usuario autenticado y expone `login`, `logout` y `useAuth`. El token de sesión se almacena en memoria (variable de módulo) durante la sesión activa para evitar exposición en LocalStorage en entornos no seguros.

### PetContext
Guarda la mascota actualmente seleccionada y la lista resumida de mascotas del usuario. Permite que el sidebar y el dashboard accedan a esta información sin prop drilling.

### Custom hooks
Cada recurso tiene su propio hook. Ejemplo: `usePets` encapsula `fetch`, `loading`, `error` y funciones de mutación (`createPet`, `updatePet`, `deletePet`). Esta separación permite reusar lógica entre páginas sin duplicar código.

***

## Diseño de la API REST

### Convenciones

- Base URL: `/api/v1`
- Formato: JSON
- Autenticación: Bearer token en header `Authorization`
- Respuestas de error: `{ error: string, message: string }`
- Respuestas de éxito: el recurso directamente o un array del recurso

### Recursos y endpoints

#### Auth

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/auth/register` | Registrar usuario | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/auth/login` | Iniciar sesión | `{ email, password }` | `{ user, token }` |
| `GET` | `/auth/me` | Usuario autenticado | — | `User` |

#### Pets

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets` | Listar mascotas del tutor | — | `Pet[]` |
| `POST` | `/pets` | Crear mascota | `PetInput` | `Pet` |
| `GET` | `/pets/:petId` | Detalle de mascota | — | `Pet` |
| `PUT` | `/pets/:petId` | Actualizar mascota | `PetInput` | `Pet` |
| `DELETE` | `/pets/:petId` | Eliminar mascota | — | `{ success: true }` |

#### Caregivers

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/caregivers` | Listar tutores | — | `Caregiver[]` |
| `POST` | `/pets/:petId/caregivers/invite` | Invitar tutor | `{ email }` | `{ code }` |
| `POST` | `/pets/:petId/caregivers/join` | Aceptar invitación | `{ code }` | `Caregiver` |
| `DELETE` | `/pets/:petId/caregivers/:caregiverId` | Eliminar tutor | — | `{ success: true }` |

#### Vacunas

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/vaccines` | Listar vacunas | — | `Vaccine[]` |
| `POST` | `/pets/:petId/vaccines` | Registrar vacuna | `VaccineInput` | `Vaccine` |
| `PUT` | `/pets/:petId/vaccines/:vaccineId` | Actualizar vacuna | `VaccineInput` | `Vaccine` |
| `DELETE` | `/pets/:petId/vaccines/:vaccineId` | Eliminar vacuna | — | `{ success: true }` |

#### Medicamentos

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/medications` | Listar medicamentos | — | `Medication[]` |
| `POST` | `/pets/:petId/medications` | Registrar medicamento | `MedicationInput` | `Medication` |
| `PUT` | `/pets/:petId/medications/:medicationId` | Actualizar | `MedicationInput` | `Medication` |
| `DELETE` | `/pets/:petId/medications/:medicationId` | Eliminar | — | `{ success: true }` |

#### Síntomas

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/symptoms` | Listar síntomas | — | `Symptom[]` |
| `POST` | `/pets/:petId/symptoms` | Registrar síntoma | `SymptomInput` | `Symptom` |
| `DELETE` | `/pets/:petId/symptoms/:symptomId` | Eliminar síntoma | — | `{ success: true }` |

#### Alimentación

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/feedings` | Listar registros | — | `FeedingLog[]` |
| `POST` | `/pets/:petId/feedings` | Registrar alimentación | `FeedingInput` | `FeedingLog` |
| `DELETE` | `/pets/:petId/feedings/:feedingId` | Eliminar registro | — | `{ success: true }` |

#### Notas

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/notes` | Listar notas | — | `Note[]` |
| `POST` | `/pets/:petId/notes` | Crear nota | `{ content }` | `Note` |
| `DELETE` | `/pets/:petId/notes/:noteId` | Eliminar nota | — | `{ success: true }` |

#### Documentos

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/documents` | Listar documentos | — | `DocumentFile[]` |
| `POST` | `/pets/:petId/documents` | Subir documento | `multipart/form-data` | `DocumentFile` |
| `DELETE` | `/pets/:petId/documents/:documentId` | Eliminar documento | — | `{ success: true }` |

#### Actividad

| Método | Endpoint | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/pets/:petId/activity` | Historial de acciones | `ActivityLog[]` |

***

## Contratos de datos (TypeScript)

```typescript
interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  birthDate?: string
  photoUrl?: string
  ownerId: string
  createdAt: string
}

interface Caregiver {
  id: string
  petId: string
  userId: string
  name: string
  email: string
  role: 'owner' | 'caregiver'
  invitedBy: string
  joinedAt: string
}

interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDoseDate?: string
  veterinarian?: string
  notes?: string
  createdBy: string
  createdAt: string
}

interface Medication {
  id: string
  petId: string
  name: string
  dose: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
  createdBy: string
  createdAt: string
}

interface Symptom {
  id: string
  petId: string
  category: string
  severity: 'low' | 'medium' | 'high'
  description: string
  photoUrl?: string
  createdBy: string
  createdAt: string
}

interface FeedingLog {
  id: string
  petId: string
  foodType: string
  quantity: string
  appetiteLevel: 'none' | 'low' | 'normal' | 'high'
  notes?: string
  createdBy: string
  createdAt: string
}

interface Note {
  id: string
  petId: string
  content: string
  createdBy: string
  createdAt: string
}

interface DocumentFile {
  id: string
  petId: string
  name: string
  fileUrl: string
  fileType: string
  createdBy: string
  createdAt: string
}

interface ActivityLog {
  id: string
  petId: string
  userId: string
  userName: string
  action: string
  resource: string
  createdAt: string
}
```

***

## Persistencia de datos

| Dato | Dónde se persiste | Motivo |
|---|---|---|
| Usuarios | Servidor | Necesario para autenticación y compartir entre dispositivos |
| Mascotas | Servidor | Compartidas entre múltiples tutores |
| Vacunas, medicamentos, síntomas | Servidor | Historial médico compartido entre tutores |
| Alimentación, notas | Servidor | Registro colaborativo |
| Documentos (archivos) | Servidor (almacenamiento de archivos) | Acceso desde cualquier dispositivo |
| Historial de actividad | Servidor | Auditoría de acciones de tutores |
| Token de sesión | Memoria del cliente (variable de módulo) | Sesión activa, no persiste entre recargas intencionalmente |
| Mascota seleccionada | Memoria del cliente (PetContext) | Estado de UI temporal |
| Preferencias de tema (dark/light) | LocalStorage | Preferencia de UI del usuario |

***

## Flujo de datos

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│                                                      │
│  Page                                                │
│   └── custom hook (usePets, useVaccines...)          │
│         └── src/api/client.ts  (fetch tipado)        │
│               └── HTTP Request (Bearer token)        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS /api/v1/...
┌──────────────────────▼──────────────────────────────┐
│                  BACKEND (Express)                   │
│                                                      │
│  routes/        → define los endpoints               │
│   └── controllers/ → recibe req, llama al service   │
│         └── services/  → lógica de negocio           │
│               └── [Data Store]                       │
└─────────────────────────────────────────────────────┘
```

**Flujo de una solicitud típica:**

1. El usuario abre la página de detalle de una mascota
2. `PetDetailPage` llama al hook `usePet(petId)`
3. El hook llama a `api/pets.ts` → `getPet(petId)`
4. `client.ts` hace `GET /api/v1/pets/:petId` con el token en el header
5. Express recibe la petición en `routes/pets.ts`
6. El router llama a `controllers/petsController.ts`
7. El controller llama a `services/petsService.ts`
8. El service consulta los datos y devuelve el objeto `Pet`
9. El controller responde con JSON `{ ...pet }`
10. El hook actualiza su estado `data` y el componente re-renderiza

***

## Decisiones de arquitectura

### Por qué arquitectura por capas en el backend
La separación en `routes → controllers → services` permite cambiar la fuente de datos (en memoria, base de datos SQL, MongoDB) sin tocar la lógica de negocio ni las rutas. Los controllers solo orquestan; los services contienen las reglas.

### Por qué Context API en lugar de Redux
La aplicación tiene dos estados globales simples: usuario autenticado y mascota seleccionada. Redux añadiría boilerplate innecesario para este nivel de complejidad. Context API con hooks customizados es suficiente y más fácil de mantener.

### Por qué custom hooks para el estado del servidor
Encapsular `fetch + loading + error` en hooks reutilizables (`usePets`, `useVaccines`) permite que varias páginas compartan la misma lógica de carga sin duplicación. Si en el futuro se migra a React Query o SWR, el cambio se hace solo dentro del hook.

### Por qué el token en memoria y no en LocalStorage
LocalStorage es vulnerable a ataques XSS. Guardar el token en una variable de módulo (memoria JS) reduce la superficie de ataque. La contrapartida es que el usuario pierde la sesión al recargar la página, lo que se puede resolver en el futuro con cookies HttpOnly.

### Por qué no base de datos en la primera fase
El ejercicio permite LocalStorage o API externa como fuente de datos. El backend se diseña con contratos claros para que, cuando se añada una base de datos real, solo cambie la capa `services/` sin impactar rutas ni frontend.