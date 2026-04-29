// ══════════════════════════════════════════════════════════════════
// PITUTI — Translations (ES · EN · PT-BR)
// Primary language: Spanish (Castellano)
// ══════════════════════════════════════════════════════════════════
//
// HOW TO ADD A KEY:
//  1. Add the key to the Translations interface (with type)
//  2. Add the value to `es` (primary — required)
//  3. Add the value to `en` and `pt`
//  4. Replace inline `L` objects in components with `t('namespace.key')`
//
// DYNAMIC STRINGS: use "{n}" / "{name}" placeholders and replace at
//   call-site with: t('...').replace('{n}', String(count))
// ══════════════════════════════════════════════════════════════════

export type Lang = 'es' | 'en' | 'pt'

export interface Translations {
  // ── Navigation ──────────────────────────────────────────────────
  nav: {
    main:      string
    health:    string
    account:   string
    dashboard: string
    pets:      string
    cares:     string
    vaccines:  string
    medications: string
    symptoms:  string
    notes:     string
    settings:  string
    calendar:  string
    vet:       string
    collapse:  string
  }
  // ── Common buttons / actions ────────────────────────────────────
  btn: {
    save:        string
    saveChanges: string
    cancel:      string
    close:       string
    edit:        string
    delete:      string
    add:         string
    register:    string
    confirm:     string
    discard:     string
    export:      string
    invite:      string
    share:       string
    back:        string
    seeAll:      string
    loading:     string
    done:        string
    resolve:     string
    archive:     string
    unarchive:   string
    reopen:      string
    new:         string
    update:      string
    optional:    string
  }
  // ── Common field labels ──────────────────────────────────────────
  field: {
    name:        string
    date:        string
    time:        string
    notes:       string
    phone:       string
    address:     string
    specialty:   string
    clinic:      string
    weight:      string
    cost:        string
    yes:         string
    no:          string
  }
  // ── Dashboard ───────────────────────────────────────────────────
  dashboard: {
    greeting_morning:   string
    greeting_afternoon: string
    greeting_evening:   string
    todayCares:       string
    upcomingEvents:   string
    allGood:          string
    alerts:           string
    noAlerts:         string
    noActiveSymptoms: string
    addFirstPet:      string
    pendingTasks:     string
  }
  // ── Pets ────────────────────────────────────────────────────────
  pets: {
    title:       string
    subtitle:    string
    new:         string
    noResults:   string
    noResultsHint: string
    noPets:      string
    noPetsHint:  string
    addPet:      string
    search:      string
    searchHint:  string
    species:     string
    allSpecies:  string
    name:        string
    breed:       string
    birthDate:   string
    weight:      string
    age:         string
    health:      string
    lastActivity: string
    caregivers:  string
    shareCares:  string
    identity:    string
    physicalData: string
    optional:    string
    newPetTitle:    string
    newPetSubtitle: string
    savedPet:    string
    speciesOptions: {
      cat:     string
      dog:     string
      bird:    string
      rabbit:  string
      reptile: string
      fish:    string
      other:   string
    }
  }
  // ── Cares ───────────────────────────────────────────────────────
  cares: {
    title:        string
    subtitle:     string
    addCare:      string
    completed:    string
    all:          string
    urgent:       string
    pending:      string
    done:         string
    dayDone:      string
    registerCare: string
  }
  // ── Vaccines ────────────────────────────────────────────────────
  vaccines: {
    title:          string
    subtitle:       string
    register:       string
    coverage:       string
    upToDate:       string
    expiringSoon:   string
    expired:        string
    lastApplied:    string
    nextDose:       string
    applied:        string
    noVaccines:     string
  }
  // ── Medications ─────────────────────────────────────────────────
  medications: {
    title:        string
    subtitle:     string
    add:          string
    active:       string
    history:      string
    adherence:    string
    nextDoses:    string
    dose:         string
    frequency:    string
    startDate:    string
    endDate:      string
    finished:     string
    unarchive:    string
  }
  // ── Symptoms ────────────────────────────────────────────────────
  symptoms: {
    title:        string
    subtitle:     string
    register:     string
    active:       string
    resolved:     string
    history:      string
    severity:     string
    category:     string
    date:         string
    notes:        string
    noActive:     string
    noResolved:   string
    markResolved: string
    reopen:       string
    severityOptions: {
      leve:       string
      moderado:   string
      grave:      string
      emergencia: string
    }
    categoryOptions: {
      digestivo:      string
      respiratorio:   string
      piel:           string
      comportamiento: string
      movimiento:     string
      ocular:         string
      otro:           string
    }
  }
  // ── Notes ───────────────────────────────────────────────────────
  notes: {
    title:         string
    subtitle:      string
    new:           string
    archived:      string
    noNotes:       string
    content:       string
    vet:           string
    type:          string
    typeOptions: {
      control:     string
      observacion: string
      emergencia:  string
      vacuna:      string
      cirugia:     string
      otro:        string
    }
    deleteNote:    string
    deleteConfirm: string
    deletedNote:   string
  }
  // ── Calendar ────────────────────────────────────────────────────
  calendar: {
    // existing keys
    title:        string
    subtitle:     string
    today:        string
    allEvents:    string
    late:         string
    soon:         string
    upToDate:     string
    medication:   string
    noEvents:     string
    overdueTitle: string
    overdueHint:  string
    monthPrev:    string
    monthNext:    string
    // Alerts banner
    alertsTitle:    string
    alertsWarn:     string
    vacExpiredTag:  string
    vacExpiredSince: string
    // Filters
    filterLabel:         string
    clearFilters:        string
    filterGroupCares:    string
    filterGroupVaccines: string
    filterGroupVet:      string
    filterPending:       string
    filterDone:          string
    filterVaccDue:       string
    filterVaccExpired:   string
    filterVetVisit:      string
    filterVetReturn:     string
    // Day detail
    dayEmpty:      string
    dayCares:      string
    dayVaccines:   string
    dayVetVisits:  string
    editCare:      string
    // Care status
    carePending:   string
    careDone:      string
    careSkipped:   string
    // Vaccine action
    vaccineApply:  string
    // Vet event kinds
    vetVisitKind:  string
    vetReturnKind: string
    // Events count tooltip — use "{n}"
    eventsCount:   string
    
  }
  // ── Veterinary ──────────────────────────────────────────────────
  vet: {
    // Page header
    pageTitle:    string
    pageSubtitle: string
    // Tabs
    tabs: {
      profile:      string
      vets:         string
      appointments: string
      exams:        string
      documents:    string
    }
    // Coming soon panels
    comingSoon: {
      exams:     string
      documents: string
      label:     string
    }
    // Medical profile — display
    profile: {
      emptyTitle:  string
      emptyText:   string
      emptyBtn:    string
      editBtn:     string
      lastUpdated: string
      noConditions: string
      noSurgeries:  string
      // Field labels (display cards)
      sex:          string
      sexMale:      string
      sexFemale:    string
      neutered:     string
      neuteredYes:  string
      neuteredNo:   string
      neuteredAge:  string
      bloodType:    string
      bloodTypePh:  string
      bloodTypeHint: string
      allergies:        string
      conditions:       string
      surgeries:        string
      environment:      string
      envApartment:     string
      envHouse:         string
      envBoth:          string
      livingWithAnimals: string
      parasiteControl:  string
      behavioralNotes:  string
      vetQuestions:     string
      // Modal
      modalTitle:      string
      editingFor:      string   // "{name}"
      savedSuccess:    string
      savedSuccessFor: string   // "{name}"
      // Form sections
      sectionBasic:       string
      sectionConditions:  string
      sectionSurgeries:   string
      sectionEnvironment: string
      sectionVetNotes:    string
      // Condition form
      customConditionPh: string
      addCondition:      string
      // Surgery form
      surgeryNamePh:  string
      surgeryNotesPh: string
      addSurgery:     string
      removeSurgery:  string
    }
    // Vet contact types
    contactTypes: {
      primary:    string
      specialist: string
      emergency:  string
      other:      string
    }
    // Vet contacts — list & form
    contacts: {
      addBtn:      string
      emptyTitle:  string
      emptyText:   string
      phone2:      string
      deleteConfirm: string
      // Form
      titleAdd:      string
      titleEdit:     string
      subtitleAdd:   string
      subtitleEdit:  string   // "{name}"
      sectionType:    string
      sectionContact: string
      sectionPets:    string
      sectionNotes:   string
      vetNamePh:    string
      clinicPh:     string
      specialtyPh:  string
      phonePh:      string
      phone2Ph:     string
      addressPh:    string
      notesPh:      string
      errName:      string
      errClinic:    string
      errPhone:     string
    }
    // Appointment types
    apptTypes: {
      routine:    string
      emergency:  string
      specialist: string
      followup:   string
      exam:       string
      vaccine:    string
      other:      string
    }
    // Appointments — list & form
    appointments: {
      addBtn:        string
      nextLabel:     string
      historyLabel:  string
      emptyTitle:    string
      emptyText:     string   // "{name}"
      deleteConfirm: string
      // Detail display
      diagnosis:  string
      treatment:  string
      weight:     string
      nextReturn: string
      // Form sections
      sectionDateTime:   string
      sectionVet:        string
      sectionDetails:    string
      sectionFollowUp:   string
      sectionExtra:      string
      // Form fields
      vetContactLabel:   string
      vetContactNone:    string
      vetNamePh:         string
      clinicPh:          string
      reason:            string
      reasonPh:          string
      diagnosisPh:       string
      treatmentPh:       string
      nextDate:          string
      nextNote:          string
      nextNotePh:        string
      weightPh:          string
      cost:              string
      costPh:            string
      notesPh:           string
      // Validation
      errReason:  string
      errVetName: string
      errDate:    string
      // Actions
      register:   string
      update:     string
      // Modal titles
      titleAdd:     string
      titleEdit:    string
      subtitleAdd:  string
      subtitleEdit: string   // "{date}"
    }
    // Toast messages
    toast: {
      vetAdded:     string
      vetUpdated:   string
      vetDeleted:   string
      apptAdded:    string
      apptUpdated:  string
      apptDeleted:  string
      profileSaved: string
    }
    // Relative time labels
    time: {
      today:    string
      tomorrow: string
      inDays:   string   // "En {n} días"
      daysAgo:  string   // "Hace {n} días"
    }
  }
  // ── Settings ────────────────────────────────────────────────────
  settings: {
    title:           string
    subtitle:        string
    personalData:    string
    personalSubtitle: string
    profilePhoto:    string
    photoHint:       string
    changePhoto:     string
    fullName:        string
    email:           string
    phone:           string
    city:            string
    about:           string
    fullNamePlaceholder: string
    phonePlaceholder:    string
    cityPlaceholder:     string
    aboutPlaceholder:    string
    appearance:      string
    theme:           string
    themeHint:       string
    changeTheme:     string
    language:        string
    languageHint:    string
    notifications:   string
    vaccineAlert:    string
    vaccineAlertHint: string
    medAlert:        string
    medAlertHint:    string
    symptomAlert:    string
    symptomAlertHint: string
    weeklyDigest:    string
    weeklyDigestHint: string
    urgentAlerts:    string
    urgentAlertsHint: string
    dangerZone:      string
    exportData:      string
    exportHint:      string
    exportBtn:       string
    deleteAccount:   string
    deleteHint:      string
    deleteBtn:       string
    saved:           string
    deleteModal: {
      title:        string
      subtitle:     string
      willLose:     string
      petProfiles:  string
      vaccines:     string
      medications:  string
      records:      string
      dailyCares:   string
      caregivers:   string
      warning:      string
      continue:     string
      typePrompt:   string
      typeWord:     string
      typeError:    string
      confirmBtn:   string
      finalWarning: string
    }
  }
  // ── Topbar ──────────────────────────────────────────────────────
  topbar: {
    searchPlaceholder: string
    noNotifications:   string
    changeTheme:       string
  }
  // ── Modals / forms ──────────────────────────────────────────────
  modal: {
    close:    string
    editPet:  string
    registerVaccine:  string
    vaccineApplied:   string
    vaccineNext:      string
    vaccineVet:       string
    vaccineNotes:     string
    vaccineSaved:     string
    selectVaccine:    string
    shareCares:            string
    shareInvite:           string
    activeCaregiversLabel: string
    inviteNew:             string
    accessLevel:           string
    sendInvitation:        string
    inviteSent:            string
    inviteExpiry:          string
    understood:            string
    removeCaregiver:       string
    editCare:    string
    addInfo:     string
    frequency:   string
    perDay:      string
    perWeek:     string
    perMonth:    string
    quantity:    string
    notify:      string
    readOnly:        string
    readOnlyHint:    string
    caregiver:       string
    caregiverHint:   string
    fullAccess:      string
    fullAccessHint:  string
  }
  // ── Status labels ───────────────────────────────────────────────
  status: {
    active:    string
    resolved:  string
    archived:  string
    expired:   string
    soon:      string
    upToDate:  string
    finished:  string
    new:       string
  }
  // ── Toast messages ──────────────────────────────────────────────
  toast: {
    changesSaved:      string
    themeChanged:      string
    petAdded:          string
    careRegistered:    string
    inviteSent:        string
    symptomResolved:   string
    symptomReopened:   string
    noteArchived:      string
    noteUnarchived:    string
    noteDeleted:       string
    csvDownloaded:     string
    vaccineRegistered: string
    medAdded:          string
    photoUpdated:      string
    languageChanged:   string
  }
  // ── Dates ───────────────────────────────────────────────────────
  dates: {
    today:         string
    yesterday:     string
    days_ago:      string   // "{n} días" — replace {n}
    months:        string[]
    weekdays:      string[]
    weekdaysShort: string[]
  }
}

// ══════════════════════════════════════════════════════════════════
// ESPAÑOL (primary)
// ══════════════════════════════════════════════════════════════════
const es: Translations = {
  nav: {
    main: 'Principal', health: 'Salud', account: 'Cuenta',
    dashboard: 'Dashboard', pets: 'Mis Mascotas', cares: 'Cuidados',
    vaccines: 'Vacunas', medications: 'Medicamentos', symptoms: 'Síntomas',
    notes: 'Notas', settings: 'Ajustes', calendar: 'Calendario',
    vet: 'Veterinaria', collapse: 'Colapsar',
  },
  btn: {
    save: 'Guardar', saveChanges: 'Guardar cambios', cancel: 'Cancelar',
    close: 'Cerrar', edit: 'Editar', delete: 'Eliminar', add: 'Añadir',
    register: 'Registrar', confirm: 'Confirmar', discard: 'Descartar',
    export: 'Exportar', invite: 'Invitar', share: 'Compartir',
    back: 'Volver', seeAll: 'Ver todos', loading: 'Cargando…',
    done: 'Hecho', resolve: 'Marcar resuelto', archive: 'Archivar',
    unarchive: 'Desarchivar', reopen: 'Reabrir', new: 'Nuevo',
    update: 'Actualizar', optional: 'opcional',
  },
  field: {
    name: 'Nombre', date: 'Fecha', time: 'Hora', notes: 'Notas',
    phone: 'Teléfono', address: 'Dirección', specialty: 'Especialidad',
    clinic: 'Clínica', weight: 'Peso', cost: 'Coste',
    yes: 'Sí', no: 'No',
  },
  dashboard: {
    greeting_morning: '¡Buenos días', greeting_afternoon: '¡Buenas tardes',
    greeting_evening: '¡Buenas noches',
    todayCares: 'Cuidados de hoy', upcomingEvents: 'Próximos eventos',
    allGood: 'Todo al día ✓', alerts: 'Alertas', noAlerts: 'Sin alertas activas ✓',
    noActiveSymptoms: 'Sin síntomas activos', addFirstPet: 'Añade tu primera mascota',
    pendingTasks: 'pendientes',
  },
  pets: {
    title: 'Mis Mascotas', subtitle: 'mascotas registradas', new: 'Nueva mascota',
    noResults: 'Sin resultados', noResultsHint: 'Prueba con otros filtros.',
    noPets: 'No hay mascotas', noPetsHint: 'Añade tu primera mascota para empezar.',
    addPet: 'Añadir mascota', search: 'Buscar',
    searchHint: 'Buscar por nombre, especie o raza…',
    species: 'Especie', allSpecies: 'Todas', name: 'Nombre', breed: 'Raza',
    birthDate: 'Fecha de nacimiento', weight: 'Peso', age: 'Edad', health: 'Salud',
    lastActivity: 'Última actividad', caregivers: 'Cuidadores', shareCares: 'Compartir',
    identity: 'Identidad', physicalData: 'Datos físicos', optional: 'opcional',
    newPetTitle: 'Nueva mascota', newPetSubtitle: 'Completa los datos para registrarla',
    savedPet: 'añadida correctamente 🐾',
    speciesOptions: {
      cat: 'Gato', dog: 'Perro', bird: 'Ave', rabbit: 'Conejo',
      reptile: 'Reptil', fish: 'Pez', other: 'Otro',
    },
  },
  cares: {
    title: 'Cuidados diarios', subtitle: 'Rutina de todas las mascotas · hoy',
    addCare: '+ Añadir cuidado', completed: 'completados', all: 'Todas',
    urgent: 'Urgentes', pending: 'Pendientes', done: 'Hechos',
    dayDone: '% del día completado', registerCare: 'Registrar',
  },
  vaccines: {
    title: 'Vacunas', subtitle: 'Control de vacunación de tus mascotas',
    register: '💉 Registrar vacuna', coverage: 'Cobertura', upToDate: 'Al día',
    expiringSoon: 'Por vencer', expired: 'Vencida', lastApplied: 'Última aplicación',
    nextDose: 'Próxima dosis', applied: 'Aplicada', noVaccines: 'Sin vacunas registradas',
  },
  medications: {
    title: 'Medicamentos', subtitle: 'Tratamientos activos y archivados',
    add: '+ Añadir medicamento', active: 'Activos', history: 'Historial',
    adherence: 'Adherencia al tratamiento', nextDoses: 'Próximas dosis',
    dose: 'Dosis', frequency: 'Frecuencia', startDate: 'Inicio', endDate: 'Fin',
    finished: 'Terminado', unarchive: 'Desarchivar', 
  },
  symptoms: {
    title: 'Síntomas', subtitle: 'Observaciones de comportamiento y salud',
    register: '+ Registrar síntoma', active: 'Activos', resolved: 'Resueltos',
    history: 'Historial', severity: 'Severidad', category: 'Categoría',
    date: 'Fecha', notes: 'Notas', noActive: 'Sin síntomas activos ✓',
    noResolved: 'Sin síntomas resueltos', markResolved: 'Marcar resuelto',
    reopen: '↩ Reabrir',
    severityOptions: {
      leve: 'Leve', moderado: 'Moderado', grave: 'Grave', emergencia: 'Emergencia',
    },
    categoryOptions: {
      digestivo: 'Digestivo', respiratorio: 'Respiratorio', piel: 'Piel',
      comportamiento: 'Comportamiento', movimiento: 'Movimiento',
      ocular: 'Ocular', otro: 'Otro',
    },
  },
  notes: {
    title: 'Notas', subtitle: 'Notas veterinarias y observaciones',
    new: '+ Nueva nota', archived: 'Archivadas', noNotes: 'Sin notas',
    content: 'Contenido', vet: 'Veterinario', type: 'Tipo',
    typeOptions: {
      control: 'Control', observacion: 'Observación', emergencia: 'Emergencia',
      vacuna: 'Post-vacuna', cirugia: 'Cirugía', otro: 'Otro',
    },
    deleteNote: 'Eliminar nota',
    deleteConfirm: '¿Eliminar esta nota permanentemente?',
    deletedNote: 'Nota eliminada',
  },
  calendar: {
    // existing
    title: 'Calendario', subtitle: 'Vista mensual de cuidados, vacunas y veterinaria',
    today: 'Hoy', allEvents: 'Todos', late: 'Vencidas', soon: 'Pronto (30d)',
    upToDate: 'Al día', medication: 'Medicamentos',
    noEvents: 'Sin eventos este día', overdueTitle: 'evento(s) vencido(s)',
    overdueHint: 'Ver todos', monthPrev: 'Mes anterior', monthNext: 'Mes siguiente',
    // alerts banner
    alertsTitle: 'Vacunas vencidas',
    alertsWarn: '⚠ Consulta con el veterinario lo antes posible',
    vacExpiredTag: 'VENCIDA',
    vacExpiredSince: 'Venció:',
    // filters
    filterLabel: 'Filtrar calendario',
    clearFilters: 'Limpiar filtros',
    filterGroupCares: 'Cuidados',
    filterGroupVaccines: 'Vacunas',
    filterGroupVet: 'Veterinaria',
    filterPending: 'Pendiente',
    filterDone: 'Realizado',
    filterVaccDue: 'Próxima vacuna',
    filterVaccExpired: 'Vacuna vencida',
    filterVetVisit: 'Consulta veterinaria',
    filterVetReturn: 'Retorno programado',
    // day detail
    dayEmpty: 'Sin eventos este día',
    dayCares: 'Cuidados del día',
    dayVaccines: 'Vacunas',
    dayVetVisits: 'Consultas / Citas',
    editCare: 'Editar cuidado',
    // care status
    carePending: 'Pendiente',
    careDone: 'Realizado',
    careSkipped: 'Omitido',
    // vaccine
    vaccineApply: 'Aplicar ahora',
    // vet event kinds
    vetVisitKind: 'Consulta',
    vetReturnKind: 'Retorno programado',
    // tooltip
    eventsCount: '{n} evento(s)',
  },
  vet: {
    pageTitle: 'Veterinaria',
    pageSubtitle: 'Salud clínica y registros médicos',
    tabs: {
      profile: 'Perfil médico',
      vets: 'Mis veterinarios',
      appointments: 'Consultas',
      exams: 'Exámenes',
      documents: 'Documentos',
    },
    comingSoon: {
      exams: 'Guarda resultados de exámenes, recetas e informes en un solo lugar.',
      documents: 'Pasaporte digital y compartición de datos con tu veterinario.',
      label: 'Próximamente',
    },
    profile: {
      emptyTitle: 'Sin perfil médico',
      emptyText: 'Rellena el perfil de tu mascota para que el veterinario tenga toda la información de un vistazo.',
      emptyBtn: 'Completar perfil',
      editBtn: 'Editar perfil',
      lastUpdated: 'Actualizado',
      noConditions: 'Sin condiciones registradas',
      noSurgeries: 'Sin cirugías registradas',
      sex: 'Sexo',
      sexMale: 'Macho',
      sexFemale: 'Hembra',
      neutered: 'Castrado / Esterilizado',
      neuteredYes: 'Sí',
      neuteredNo: 'No',
      neuteredAge: 'Edad en la castración',
      bloodType: 'Grupo sanguíneo',
      bloodTypePh: 'Ej. A, B, AB, DEA 1.1…',
      bloodTypeHint: 'Varía según la especie — escribe libremente',
      allergies: 'Alergias conocidas',
      conditions: 'Condiciones crónicas',
      surgeries: 'Cirugías',
      environment: 'Tipo de hábitat',
      envApartment: 'Piso / Apartamento',
      envHouse: 'Casa con jardín',
      envBoth: 'Ambos',
      livingWithAnimals: 'Convive con otros animales',
      parasiteControl: 'Antiparasitario habitual',
      behavioralNotes: 'Notas de comportamiento',
      vetQuestions: 'Preguntas para el veterinario',
      modalTitle: 'Perfil médico',
      editingFor: 'Editando perfil de {name}',
      savedSuccess: 'Perfil guardado',
      savedSuccessFor: 'El historial de {name} ha sido actualizado',
      sectionBasic: 'Datos básicos',
      sectionConditions: 'Condiciones crónicas',
      sectionSurgeries: 'Cirugías e intervenciones',
      sectionEnvironment: 'Entorno y comportamiento',
      sectionVetNotes: 'Notas para el veterinario',
      customConditionPh: 'Nombre de la condición',
      addCondition: 'Añadir',
      surgeryNamePh: 'Ej. Castración, Extracción dental',
      surgeryNotesPh: 'Observaciones',
      addSurgery: '+ Añadir cirugía',
      removeSurgery: '×',
    },
    contactTypes: {
      primary: 'Principal',
      specialist: 'Especialista',
      emergency: 'Urgencias',
      other: 'Otro',
    },
    contacts: {
      addBtn: 'Añadir veterinario',
      emptyTitle: 'Sin veterinarios guardados',
      emptyText: 'Guarda el contacto de tu veterinario para acceder rápidamente.',
      phone2: 'Tel. alternativo',
      deleteConfirm: '¿Confirmar eliminación?',
      titleAdd: 'Añadir veterinario',
      titleEdit: 'Editar veterinario',
      subtitleAdd: 'Guarda el contacto de tu veterinario de confianza',
      subtitleEdit: 'Editando contacto de {name}',
      sectionType: 'Tipo de veterinario',
      sectionContact: 'Datos de contacto',
      sectionPets: 'Mascotas asociadas',
      sectionNotes: 'Notas adicionales',
      vetNamePh: 'Ej. Dra. García',
      clinicPh: 'Ej. Clínica VetSalud',
      specialtyPh: 'Ej. Dermatología, Oncología',
      phonePh: 'Ej. +34 612 345 678',
      phone2Ph: 'Ej. +34 611 222 333',
      addressPh: 'Calle, número, ciudad',
      notesPh: 'Horarios, instrucciones especiales…',
      errName: 'El nombre es obligatorio',
      errClinic: 'La clínica es obligatoria',
      errPhone: 'El teléfono es obligatorio',
    },
    apptTypes: {
      routine: 'Revisión',
      emergency: 'Urgencia',
      specialist: 'Especialista',
      followup: 'Retorno',
      exam: 'Exámenes',
      vaccine: 'Vacuna',
      other: 'Otro',
    },
    appointments: {
      addBtn: 'Registrar consulta',
      nextLabel: '📅 Próximo retorno',
      historyLabel: 'Historial de consultas',
      emptyTitle: 'Sin consultas registradas',
      emptyText: 'Registra la primera consulta de {name} para llevar el historial.',
      deleteConfirm: '¿Confirmar eliminación?',
      diagnosis: 'Diagnóstico',
      treatment: 'Tratamiento',
      weight: 'Peso en la visita',
      nextReturn: 'Retorno',
      sectionDateTime: 'Fecha y hora',
      sectionVet: 'Veterinario',
      sectionDetails: 'Detalles de la consulta',
      sectionFollowUp: 'Seguimiento',
      sectionExtra: 'Datos adicionales',
      vetContactLabel: 'Veterinario guardado',
      vetContactNone: 'Introducir manualmente',
      vetNamePh: 'Ej. Dra. García',
      clinicPh: 'Ej. Clínica VetSalud',
      reason: 'Motivo de la consulta',
      reasonPh: 'Ej. Revisión anual, tos persistente…',
      diagnosisPh: 'Diagnóstico del veterinario',
      treatmentPh: 'Medicamentos, dosis, indicaciones…',
      nextDate: 'Fecha de retorno',
      nextNote: 'Nota del retorno',
      nextNotePh: 'Ej. Revisión post-tratamiento',
      weightPh: 'Ej. 4.2',
      cost: 'Coste de la consulta',
      costPh: 'Ej. 45.00',
      notesPh: 'Cualquier observación relevante…',
      errReason: 'El motivo es obligatorio',
      errVetName: 'El nombre del veterinario es obligatorio',
      errDate: 'La fecha es obligatoria',
      register: 'Registrar consulta',
      update: 'Guardar cambios',
      titleAdd: 'Registrar consulta',
      titleEdit: 'Editar consulta',
      subtitleAdd: 'Guarda el historial veterinario de tu mascota',
      subtitleEdit: 'Editando consulta del {date}',
    },
    toast: {
      vetAdded: 'Veterinario añadido ✓',
      vetUpdated: 'Veterinario actualizado ✓',
      vetDeleted: 'Veterinario eliminado',
      apptAdded: 'Consulta registrada ✓',
      apptUpdated: 'Consulta actualizada ✓',
      apptDeleted: 'Consulta eliminada',
      profileSaved: 'Perfil guardado ✓',
    },
    time: {
      today: 'Hoy',
      tomorrow: 'Mañana',
      inDays: 'En {n} días',
      daysAgo: 'Hace {n} días',
    },
  },
  settings: {
    title: 'Ajustes', subtitle: 'Cuenta y preferencias',
    personalData: 'Datos personales', personalSubtitle: 'Tu información en PITUTI',
    profilePhoto: 'Foto de perfil', photoHint: 'JPG, PNG o WebP · Máx. 2 MB',
    changePhoto: 'Cambiar', fullName: 'Nombre completo',
    email: 'Correo electrónico', phone: 'Teléfono', city: 'Ciudad', about: 'Sobre mí',
    fullNamePlaceholder: 'Tu nombre y apellido', phonePlaceholder: '+34 600 000 000',
    cityPlaceholder: 'Madrid, Barcelona…', aboutPlaceholder: 'Cuidador/a de mascotas…',
    appearance: 'Apariencia', theme: 'Tema de la app', themeHint: 'Claro u oscuro',
    changeTheme: 'Cambiar', language: 'Idioma',
    languageHint: 'Español · English · Português', notifications: 'Notificaciones',
    vaccineAlert: 'Vacunas a vencer', vaccineAlertHint: '7 días antes del vencimiento',
    medAlert: 'Dosis de medicamentos', medAlertHint: 'Recordatorio diario de dosis',
    symptomAlert: 'Síntomas sin resolución',
    symptomAlertHint: 'Cuando un síntoma lleva +3 días',
    weeklyDigest: 'Resumen semanal', weeklyDigestHint: 'Cada lunes por email',
    urgentAlerts: 'Alertas urgentes', urgentAlertsHint: 'Push inmediato en emergencias',
    dangerZone: 'Zona de riesgo',
    exportData: 'Exportar datos',
    exportHint: 'Descarga un CSV con todo el historial de tus mascotas, vacunas, medicamentos y síntomas.',
    exportBtn: 'Exportar CSV',
    deleteAccount: 'Eliminar cuenta',
    deleteHint: 'Acción permanente e irreversible. Se borrarán todos tus datos, mascotas e historial.',
    deleteBtn: 'Eliminar cuenta', saved: 'Guardado',
    deleteModal: {
      title: 'Eliminar cuenta permanentemente',
      subtitle: 'Esta acción no se puede deshacer',
      willLose: 'Si eliminas tu cuenta se perderá permanentemente:',
      petProfiles: 'El perfil completo de todas tus mascotas',
      vaccines: 'Historial de vacunas y próximas dosis',
      medications: 'Todos los medicamentos registrados',
      records: 'Síntomas, notas y registros veterinarios',
      dailyCares: 'Cuidados diarios y rutinas configuradas',
      caregivers: 'Acceso compartido con otros cuidadores',
      warning: '⚠ No podrás recuperar estos datos después de eliminar tu cuenta.',
      continue: 'Continuar →',
      typePrompt: 'Para confirmar, escribe',
      typeWord: 'eliminar',
      typeError: 'Escribe exactamente "eliminar" (sin comillas)',
      confirmBtn: 'Eliminar definitivamente',
      finalWarning: 'Al hacer clic en "Eliminar definitivamente" tu cuenta y todos los datos asociados serán borrados permanentemente de los servidores de PITUTI.',
    },
  },
  topbar: {
    searchPlaceholder: 'Buscar mascota, registro…',
    noNotifications: 'Sin notificaciones nuevas',
    changeTheme: 'Cambiar tema',
  },
  modal: {
    close: 'Cerrar', editPet: 'Editar mascota',
    registerVaccine: 'Registrar vacuna', vaccineApplied: 'Fecha de aplicación',
    vaccineNext: 'Próxima dosis', vaccineVet: 'Veterinario (opcional)',
    vaccineNotes: 'Notas (opcional)', vaccineSaved: '¡Registrado!',
    selectVaccine: 'Seleccionar vacuna',
    shareCares: 'Compartir cuidados', shareInvite: 'Invita a cuidadores de',
    activeCaregiversLabel: 'Cuidadores activos', inviteNew: '... Invitar nuevo cuidador',
    accessLevel: 'Nivel de acceso', sendInvitation: '✉ Enviar invitación',
    inviteSent: '¡Invitación enviada!',
    inviteExpiry: '✓ El enlace de invitación expira en 48 horas',
    understood: 'Entendido', removeCaregiver: 'Eliminar',
    editCare: 'Configurar cuidado', addInfo: 'Información adicional',
    frequency: 'Frecuencia', perDay: 'Por día', perWeek: 'Por semana',
    perMonth: 'Por mes', quantity: 'Cantidad (opcional)', notify: 'Activar recordatorio',
    readOnly: 'Solo lectura', readOnlyHint: 'Ver registros, no puede editar',
    caregiver: 'Cuidador', caregiverHint: 'Registrar cuidados y vacunas',
    fullAccess: 'Acceso completo', fullAccessHint: 'Editar perfil y todos los datos',
  },
  status: {
    active: 'Activo', resolved: 'Resuelto', archived: 'Archivado',
    expired: 'Vencida', soon: 'Pronto', upToDate: 'Al día',
    finished: 'Terminado', new: 'Nueva ✓',
  },
  toast: {
    changesSaved: '✓ Cambios guardados correctamente', themeChanged: 'Tema cambiado',
    petAdded: 'añadida correctamente 🐾', careRegistered: 'Cuidado registrado ✓',
    inviteSent: '✉ Invitación enviada a ', symptomResolved: '✓ Síntoma resuelto',
    symptomReopened: '↩ Síntoma reabierto', noteArchived: '📁 Nota archivada',
    noteUnarchived: '✓ Nota desarchivada', noteDeleted: 'Nota eliminada',
    csvDownloaded: '📄 CSV descargado correctamente',
    vaccineRegistered: '💉 Vacuna registrada',
    medAdded: 'Medicamento añadido', photoUpdated: '📸 Foto actualizada',
    languageChanged: 'Idioma actualizado',
  },
  dates: {
    today: 'Hoy', yesterday: 'Ayer', days_ago: 'Hace {n} días',
    months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    weekdays: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    weekdaysShort: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
  },
}

// ══════════════════════════════════════════════════════════════════
// ENGLISH
// ══════════════════════════════════════════════════════════════════
const en: Translations = {
  nav: {
    main: 'Main', health: 'Health', account: 'Account',
    dashboard: 'Dashboard', pets: 'My Pets', cares: 'Daily Care',
    vaccines: 'Vaccines', medications: 'Medications', symptoms: 'Symptoms',
    notes: 'Notes', settings: 'Settings', calendar: 'Calendar',
    vet: 'Vet', collapse: 'Collapse',
  },
  btn: {
    save: 'Save', saveChanges: 'Save changes', cancel: 'Cancel',
    close: 'Close', edit: 'Edit', delete: 'Delete', add: 'Add',
    register: 'Register', confirm: 'Confirm', discard: 'Discard',
    export: 'Export', invite: 'Invite', share: 'Share',
    back: 'Back', seeAll: 'See all', loading: 'Loading…',
    done: 'Done', resolve: 'Mark resolved', archive: 'Archive',
    unarchive: 'Unarchive', reopen: 'Reopen', new: 'New',
    update: 'Update', optional: 'optional',
  },
  field: {
    name: 'Name', date: 'Date', time: 'Time', notes: 'Notes',
    phone: 'Phone', address: 'Address', specialty: 'Specialty',
    clinic: 'Clinic', weight: 'Weight', cost: 'Cost',
    yes: 'Yes', no: 'No',
  },
  dashboard: {
    greeting_morning: 'Good morning', greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    todayCares: "Today's care", upcomingEvents: 'Upcoming events',
    allGood: 'All up to date ✓', alerts: 'Alerts', noAlerts: 'No active alerts ✓',
    noActiveSymptoms: 'No active symptoms', addFirstPet: 'Add your first pet',
    pendingTasks: 'pending',
  },
  pets: {
    title: 'My Pets', subtitle: 'registered pets', new: 'New pet',
    noResults: 'No results', noResultsHint: 'Try different filters.',
    noPets: 'No pets', noPetsHint: 'Add your first pet to get started.',
    addPet: 'Add pet', search: 'Search',
    searchHint: 'Search by name, species or breed…',
    species: 'Species', allSpecies: 'All', name: 'Name', breed: 'Breed',
    birthDate: 'Birth date', weight: 'Weight', age: 'Age', health: 'Health',
    lastActivity: 'Last activity', caregivers: 'Caregivers', shareCares: 'Share',
    identity: 'Identity', physicalData: 'Physical data', optional: 'optional',
    newPetTitle: 'New pet', newPetSubtitle: 'Complete the details to register',
    savedPet: 'added successfully 🐾',
    speciesOptions: {
      cat: 'Cat', dog: 'Dog', bird: 'Bird', rabbit: 'Rabbit',
      reptile: 'Reptile', fish: 'Fish', other: 'Other',
    },
  },
  cares: {
    title: 'Daily care', subtitle: "All pets' routine · today",
    addCare: '+ Add care', completed: 'completed', all: 'All',
    urgent: 'Urgent', pending: 'Pending', done: 'Done',
    dayDone: '% of day completed', registerCare: 'Register',
  },
  vaccines: {
    title: 'Vaccines', subtitle: 'Vaccination tracking for your pets',
    register: '💉 Register vaccine', coverage: 'Coverage', upToDate: 'Up to date',
    expiringSoon: 'Expiring soon', expired: 'Expired', lastApplied: 'Last applied',
    nextDose: 'Next dose', applied: 'Applied', noVaccines: 'No vaccines registered',
  },
  medications: {
    title: 'Medications', subtitle: 'Active and archived treatments',
    add: '+ Add medication', active: 'Active', history: 'History',
    adherence: 'Treatment adherence', nextDoses: 'Next doses',
    dose: 'Dose', frequency: 'Frequency', startDate: 'Start', endDate: 'End',
    finished: 'Finished', unarchive: 'Unarchive',
  },
  symptoms: {
    title: 'Symptoms', subtitle: 'Behaviour and health observations',
    register: '+ Register symptom', active: 'Active', resolved: 'Resolved',
    history: 'History', severity: 'Severity', category: 'Category',
    date: 'Date', notes: 'Notes', noActive: 'No active symptoms ✓',
    noResolved: 'No resolved symptoms', markResolved: 'Mark as resolved',
    reopen: '↩ Reopen',
    severityOptions: {
      leve: 'Mild', moderado: 'Moderate', grave: 'Severe', emergencia: 'Emergency',
    },
    categoryOptions: {
      digestivo: 'Digestive', respiratorio: 'Respiratory', piel: 'Skin',
      comportamiento: 'Behaviour', movimiento: 'Movement',
      ocular: 'Ocular', otro: 'Other',
    },
  },
  notes: {
    title: 'Notes', subtitle: 'Vet notes and observations',
    new: '+ New note', archived: 'Archived', noNotes: 'No notes',
    content: 'Content', vet: 'Veterinarian', type: 'Type',
    typeOptions: {
      control: 'Check-up', observacion: 'Observation', emergencia: 'Emergency',
      vacuna: 'Post-vaccine', cirugia: 'Surgery', otro: 'Other',
    },
    deleteNote: 'Delete note',
    deleteConfirm: 'Delete this note permanently?',
    deletedNote: 'Note deleted',
  },
  calendar: {
    title: 'Calendar', subtitle: 'Monthly view of care, vaccines and vet',
    today: 'Today', allEvents: 'All', late: 'Expired', soon: 'Soon (30d)',
    upToDate: 'Up to date', medication: 'Medications',
    noEvents: 'No events on this day', overdueTitle: 'overdue event(s)',
    overdueHint: 'View all', monthPrev: 'Previous month', monthNext: 'Next month',
    alertsTitle: 'Expired vaccines',
    alertsWarn: '⚠ Contact your vet as soon as possible',
    vacExpiredTag: 'EXPIRED',
    vacExpiredSince: 'Expired:',
    filterLabel: 'Filter calendar',
    clearFilters: 'Clear filters',
    filterGroupCares: 'Care',
    filterGroupVaccines: 'Vaccines',
    filterGroupVet: 'Veterinary',
    filterPending: 'Pending',
    filterDone: 'Done',
    filterVaccDue: 'Upcoming vaccine',
    filterVaccExpired: 'Expired vaccine',
    filterVetVisit: 'Vet appointment',
    filterVetReturn: 'Scheduled return',
    dayEmpty: 'No events on this day',
    dayCares: "Day's care",
    dayVaccines: 'Vaccines',
    dayVetVisits: 'Appointments',
    editCare: 'Edit care',
    carePending: 'Pending',
    careDone: 'Done',
    careSkipped: 'Skipped',
    vaccineApply: 'Apply now',
    vetVisitKind: 'Appointment',
    vetReturnKind: 'Scheduled return',
    eventsCount: '{n} event(s)',
  },
  vet: {
    pageTitle: 'Veterinary',
    pageSubtitle: 'Clinical health and medical records',
    tabs: {
      profile: 'Medical profile',
      vets: 'My vets',
      appointments: 'Appointments',
      exams: 'Exams',
      documents: 'Documents',
    },
    comingSoon: {
      exams: 'Save exam results, prescriptions and reports in one place.',
      documents: 'Digital passport and data sharing with your vet.',
      label: 'Coming soon',
    },
    profile: {
      emptyTitle: 'No medical profile',
      emptyText: 'Fill in your pet\'s profile so the vet has all the information at a glance.',
      emptyBtn: 'Complete profile',
      editBtn: 'Edit profile',
      lastUpdated: 'Updated',
      noConditions: 'No conditions recorded',
      noSurgeries: 'No surgeries recorded',
      sex: 'Sex',
      sexMale: 'Male',
      sexFemale: 'Female',
      neutered: 'Neutered / Spayed',
      neuteredYes: 'Yes',
      neuteredNo: 'No',
      neuteredAge: 'Age at neutering',
      bloodType: 'Blood type',
      bloodTypePh: 'e.g. A, B, AB, DEA 1.1…',
      bloodTypeHint: 'Varies by species — type freely',
      allergies: 'Known allergies',
      conditions: 'Chronic conditions',
      surgeries: 'Surgeries',
      environment: 'Habitat type',
      envApartment: 'Flat / Apartment',
      envHouse: 'House with garden',
      envBoth: 'Both',
      livingWithAnimals: 'Lives with other animals',
      parasiteControl: 'Regular parasite control',
      behavioralNotes: 'Behavioural notes',
      vetQuestions: 'Questions for the vet',
      modalTitle: 'Medical profile',
      editingFor: "Editing {name}'s profile",
      savedSuccess: 'Profile saved',
      savedSuccessFor: "{name}'s history has been updated",
      sectionBasic: 'Basic data',
      sectionConditions: 'Chronic conditions',
      sectionSurgeries: 'Surgeries & procedures',
      sectionEnvironment: 'Environment & behaviour',
      sectionVetNotes: 'Notes for the vet',
      customConditionPh: 'Condition name',
      addCondition: 'Add',
      surgeryNamePh: 'e.g. Neutering, Dental extraction',
      surgeryNotesPh: 'Observations',
      addSurgery: '+ Add surgery',
      removeSurgery: '×',
    },
    contactTypes: {
      primary: 'Primary',
      specialist: 'Specialist',
      emergency: 'Emergency',
      other: 'Other',
    },
    contacts: {
      addBtn: 'Add vet',
      emptyTitle: 'No vets saved',
      emptyText: 'Save your vet\'s contact for quick access.',
      phone2: 'Alt. phone',
      deleteConfirm: 'Confirm deletion?',
      titleAdd: 'Add vet',
      titleEdit: 'Edit vet',
      subtitleAdd: 'Save your trusted vet\'s contact',
      subtitleEdit: "Editing {name}'s contact",
      sectionType: 'Vet type',
      sectionContact: 'Contact details',
      sectionPets: 'Associated pets',
      sectionNotes: 'Additional notes',
      vetNamePh: 'e.g. Dr. Smith',
      clinicPh: 'e.g. City Animal Clinic',
      specialtyPh: 'e.g. Dermatology, Oncology',
      phonePh: 'e.g. +1 555 000 0000',
      phone2Ph: 'e.g. +1 555 111 1111',
      addressPh: 'Street, number, city',
      notesPh: 'Hours, special instructions…',
      errName: 'Name is required',
      errClinic: 'Clinic is required',
      errPhone: 'Phone is required',
    },
    apptTypes: {
      routine: 'Check-up',
      emergency: 'Emergency',
      specialist: 'Specialist',
      followup: 'Follow-up',
      exam: 'Exams',
      vaccine: 'Vaccine',
      other: 'Other',
    },
    appointments: {
      addBtn: 'Register appointment',
      nextLabel: '📅 Next return',
      historyLabel: 'Appointment history',
      emptyTitle: 'No appointments registered',
      emptyText: "Register {name}'s first appointment to start tracking.",
      deleteConfirm: 'Confirm deletion?',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      weight: 'Weight at visit',
      nextReturn: 'Return',
      sectionDateTime: 'Date & time',
      sectionVet: 'Veterinarian',
      sectionDetails: 'Appointment details',
      sectionFollowUp: 'Follow-up',
      sectionExtra: 'Additional data',
      vetContactLabel: 'Saved vet',
      vetContactNone: 'Enter manually',
      vetNamePh: 'e.g. Dr. Smith',
      clinicPh: 'e.g. City Animal Clinic',
      reason: 'Reason for visit',
      reasonPh: 'e.g. Annual check-up, persistent cough…',
      diagnosisPh: 'Vet\'s diagnosis',
      treatmentPh: 'Medications, doses, instructions…',
      nextDate: 'Return date',
      nextNote: 'Return note',
      nextNotePh: 'e.g. Post-treatment review',
      weightPh: 'e.g. 4.2',
      cost: 'Appointment cost',
      costPh: 'e.g. 45.00',
      notesPh: 'Any relevant observation…',
      errReason: 'Reason is required',
      errVetName: "Vet's name is required",
      errDate: 'Date is required',
      register: 'Register appointment',
      update: 'Save changes',
      titleAdd: 'Register appointment',
      titleEdit: 'Edit appointment',
      subtitleAdd: "Save your pet's vet history",
      subtitleEdit: 'Editing appointment on {date}',
    },
    toast: {
      vetAdded: 'Vet added ✓',
      vetUpdated: 'Vet updated ✓',
      vetDeleted: 'Vet removed',
      apptAdded: 'Appointment registered ✓',
      apptUpdated: 'Appointment updated ✓',
      apptDeleted: 'Appointment deleted',
      profileSaved: 'Profile saved ✓',
    },
    time: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      inDays: 'In {n} days',
      daysAgo: '{n} days ago',
    },
  },
  settings: {
    title: 'Settings', subtitle: 'Account and preferences',
    personalData: 'Personal data', personalSubtitle: 'Your info in PITUTI',
    profilePhoto: 'Profile photo', photoHint: 'JPG, PNG or WebP · Max. 2 MB',
    changePhoto: 'Change', fullName: 'Full name',
    email: 'Email address', phone: 'Phone', city: 'City', about: 'About me',
    fullNamePlaceholder: 'Your name and surname', phonePlaceholder: '+1 555 000 0000',
    cityPlaceholder: 'New York, London…', aboutPlaceholder: 'Pet lover and carer…',
    appearance: 'Appearance', theme: 'App theme', themeHint: 'Light or dark',
    changeTheme: 'Change', language: 'Language',
    languageHint: 'Español · English · Português', notifications: 'Notifications',
    vaccineAlert: 'Vaccines expiring', vaccineAlertHint: '7 days before expiry',
    medAlert: 'Medication doses', medAlertHint: 'Daily dose reminder',
    symptomAlert: 'Unresolved symptoms',
    symptomAlertHint: 'When a symptom lasts +3 days',
    weeklyDigest: 'Weekly digest', weeklyDigestHint: 'Every Monday by email',
    urgentAlerts: 'Urgent alerts', urgentAlertsHint: 'Instant push for emergencies',
    dangerZone: 'Danger zone',
    exportData: 'Export data',
    exportHint: "Download a CSV with all your pets' history, vaccines, medications and symptoms.",
    exportBtn: 'Export CSV',
    deleteAccount: 'Delete account',
    deleteHint: 'Permanent and irreversible action. All your data, pets and history will be deleted.',
    deleteBtn: 'Delete account', saved: 'Saved',
    deleteModal: {
      title: 'Permanently delete account',
      subtitle: 'This action cannot be undone',
      willLose: 'If you delete your account you will permanently lose:',
      petProfiles: 'Complete profiles for all your pets',
      vaccines: 'Vaccination history and upcoming doses',
      medications: 'All registered medications',
      records: 'Symptoms, notes and vet records',
      dailyCares: 'Daily care routines and configurations',
      caregivers: 'Shared access with other caregivers',
      warning: '⚠ You will not be able to recover this data after deleting your account.',
      continue: 'Continue →',
      typePrompt: 'To confirm, type',
      typeWord: 'delete',
      typeError: 'Type exactly "delete" (without quotes)',
      confirmBtn: 'Permanently delete',
      finalWarning: 'By clicking "Permanently delete" your account and all associated data will be permanently erased from PITUTI\'s servers.',
    },
  },
  topbar: {
    searchPlaceholder: 'Search pet, record…',
    noNotifications: 'No new notifications',
    changeTheme: 'Change theme',
  },
  modal: {
    close: 'Close', editPet: 'Edit pet',
    registerVaccine: 'Register vaccine', vaccineApplied: 'Application date',
    vaccineNext: 'Next dose', vaccineVet: 'Veterinarian (optional)',
    vaccineNotes: 'Notes (optional)', vaccineSaved: 'Registered!',
    selectVaccine: 'Select vaccine',
    shareCares: 'Share care', shareInvite: 'Invite caregivers for',
    activeCaregiversLabel: 'Active caregivers', inviteNew: 'Invite new caregiver',
    accessLevel: 'Access level', sendInvitation: '✉ Send invitation',
    inviteSent: 'Invitation sent!',
    inviteExpiry: '✓ The invitation link expires in 48 hours',
    understood: 'Got it', removeCaregiver: 'Remove',
    editCare: 'Configure care', addInfo: 'Additional info',
    frequency: 'Frequency', perDay: 'Per day', perWeek: 'Per week',
    perMonth: 'Per month', quantity: 'Quantity (optional)', notify: 'Enable reminder',
    readOnly: 'Read only', readOnlyHint: 'View records, cannot edit',
    caregiver: 'Caregiver', caregiverHint: 'Register care and vaccines',
    fullAccess: 'Full access', fullAccessHint: 'Edit profile and all data',
  },
  status: {
    active: 'Active', resolved: 'Resolved', archived: 'Archived',
    expired: 'Expired', soon: 'Soon', upToDate: 'Up to date',
    finished: 'Finished', new: 'New ✓',
  },
  toast: {
    changesSaved: '✓ Changes saved successfully', themeChanged: 'Theme changed',
    petAdded: 'added successfully 🐾', careRegistered: 'Care registered ✓',
    inviteSent: '✉ Invitation sent to ', symptomResolved: '✓ Symptom resolved',
    symptomReopened: '↩ Symptom reopened', noteArchived: '📁 Note archived',
    noteUnarchived: '✓ Note unarchived', noteDeleted: 'Note deleted',
    csvDownloaded: '📄 CSV downloaded successfully',
    vaccineRegistered: '💉 Vaccine registered',
    medAdded: 'Medication added', photoUpdated: '📸 Photo updated',
    languageChanged: 'Language updated',
  },
  dates: {
    today: 'Today', yesterday: 'Yesterday', days_ago: '{n} days ago',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    weekdaysShort: ['Su','Mo','Tu','We','Th','Fr','Sa'],
  },
}

// ══════════════════════════════════════════════════════════════════
// PORTUGUÊS BRASILEIRO
// ══════════════════════════════════════════════════════════════════
const pt: Translations = {
  nav: {
    main: 'Principal', health: 'Saúde', account: 'Conta',
    dashboard: 'Painel', pets: 'Minhas Mascotes', cares: 'Cuidados',
    vaccines: 'Vacinas', medications: 'Medicamentos', symptoms: 'Sintomas',
    notes: 'Notas', settings: 'Configurações', calendar: 'Calendário',
    vet: 'Veterinária', collapse: 'Recolher',
  },
  btn: {
    save: 'Salvar', saveChanges: 'Salvar alterações', cancel: 'Cancelar',
    close: 'Fechar', edit: 'Editar', delete: 'Excluir', add: 'Adicionar',
    register: 'Registrar', confirm: 'Confirmar', discard: 'Descartar',
    export: 'Exportar', invite: 'Convidar', share: 'Compartilhar',
    back: 'Voltar', seeAll: 'Ver todos', loading: 'Carregando…',
    done: 'Feito', resolve: 'Marcar resolvido', archive: 'Arquivar',
    unarchive: 'Desarquivar', reopen: 'Reabrir', new: 'Novo',
    update: 'Atualizar', optional: 'opcional',
  },
  field: {
    name: 'Nome', date: 'Data', time: 'Hora', notes: 'Notas',
    phone: 'Telefone', address: 'Endereço', specialty: 'Especialidade',
    clinic: 'Clínica', weight: 'Peso', cost: 'Custo',
    yes: 'Sim', no: 'Não',
  },
  dashboard: {
    greeting_morning: 'Bom dia', greeting_afternoon: 'Boa tarde',
    greeting_evening: 'Boa noite',
    todayCares: 'Cuidados de hoje', upcomingEvents: 'Próximos eventos',
    allGood: 'Tudo em dia ✓', alerts: 'Alertas', noAlerts: 'Sem alertas ativos ✓',
    noActiveSymptoms: 'Sem sintomas ativos', addFirstPet: 'Adicione seu primeiro animal',
    pendingTasks: 'pendentes',
  },
  pets: {
    title: 'Minhas Mascotes', subtitle: 'mascotes registradas', new: 'Nova mascote',
    noResults: 'Sem resultados', noResultsHint: 'Tente outros filtros.',
    noPets: 'Sem mascotes', noPetsHint: 'Adicione sua primeira mascote para começar.',
    addPet: 'Adicionar mascote', search: 'Buscar',
    searchHint: 'Buscar por nome, espécie ou raça…',
    species: 'Espécie', allSpecies: 'Todas', name: 'Nome', breed: 'Raça',
    birthDate: 'Data de nascimento', weight: 'Peso', age: 'Idade', health: 'Saúde',
    lastActivity: 'Última atividade', caregivers: 'Cuidadores',
    shareCares: 'Compartilhar',
    identity: 'Identidade', physicalData: 'Dados físicos', optional: 'opcional',
    newPetTitle: 'Nova mascote', newPetSubtitle: 'Preencha os dados para registrá-la',
    savedPet: 'adicionada com sucesso 🐾',
    speciesOptions: {
      cat: 'Gato', dog: 'Cachorro', bird: 'Pássaro', rabbit: 'Coelho',
      reptile: 'Réptil', fish: 'Peixe', other: 'Outro',
    },
  },
  cares: {
    title: 'Cuidados diários', subtitle: 'Rotina de todas as mascotes · hoje',
    addCare: '+ Adicionar cuidado', completed: 'concluídos', all: 'Todas',
    urgent: 'Urgentes', pending: 'Pendentes', done: 'Feitos',
    dayDone: '% do dia concluído', registerCare: 'Registrar',
  },
  vaccines: {
    title: 'Vacinas', subtitle: 'Controle de vacinação das suas mascotes',
    register: '💉 Registrar vacina', coverage: 'Cobertura', upToDate: 'Em dia',
    expiringSoon: 'A vencer', expired: 'Vencida', lastApplied: 'Última aplicação',
    nextDose: 'Próxima dose', applied: 'Aplicada', noVaccines: 'Sem vacinas registradas',
  },
  medications: {
    title: 'Medicamentos', subtitle: 'Tratamentos ativos e arquivados',
    add: '+ Adicionar medicamento', active: 'Ativos', history: 'Histórico',
    adherence: 'Adesão ao tratamento', nextDoses: 'Próximas doses',
    dose: 'Dose', frequency: 'Frequência', startDate: 'Início', endDate: 'Fim',
    finished: 'Concluído', unarchive: 'Desarquivar',
  },
  symptoms: {
    title: 'Sintomas', subtitle: 'Observações de comportamento e saúde',
    register: '+ Registrar sintoma', active: 'Ativos', resolved: 'Resolvidos',
    history: 'Histórico', severity: 'Gravidade', category: 'Categoria',
    date: 'Data', notes: 'Notas', noActive: 'Sem sintomas ativos ✓',
    noResolved: 'Sem sintomas resolvidos', markResolved: 'Marcar resolvido',
    reopen: '↩ Reabrir',
    severityOptions: {
      leve: 'Leve', moderado: 'Moderado', grave: 'Grave', emergencia: 'Emergência',
    },
    categoryOptions: {
      digestivo: 'Digestivo', respiratorio: 'Respiratório', piel: 'Pele',
      comportamiento: 'Comportamento', movimiento: 'Movimento',
      ocular: 'Ocular', otro: 'Outro',
    },
  },
  notes: {
    title: 'Notas', subtitle: 'Notas veterinárias e observações',
    new: '+ Nova nota', archived: 'Arquivadas', noNotes: 'Sem notas',
    content: 'Conteúdo', vet: 'Veterinário', type: 'Tipo',
    typeOptions: {
      control: 'Consulta', observacion: 'Observação', emergencia: 'Emergência',
      vacuna: 'Pós-vacina', cirugia: 'Cirurgia', otro: 'Outro',
    },
    deleteNote: 'Excluir nota',
    deleteConfirm: 'Excluir esta nota permanentemente?',
    deletedNote: 'Nota excluída',
  },
  calendar: {
    title: 'Calendário', subtitle: 'Visão mensal de cuidados, vacinas e veterinária',
    today: 'Hoje', allEvents: 'Todos', late: 'Vencidas', soon: 'Em breve (30d)',
    upToDate: 'Em dia', medication: 'Medicamentos',
    noEvents: 'Sem eventos neste dia', overdueTitle: 'evento(s) vencido(s)',
    overdueHint: 'Ver todos', monthPrev: 'Mês anterior', monthNext: 'Próximo mês',
    alertsTitle: 'Vacinas vencidas',
    alertsWarn: '⚠ Consulte o veterinário o mais rápido possível',
    vacExpiredTag: 'VENCIDA',
    vacExpiredSince: 'Venceu:',
    filterLabel: 'Filtrar calendário',
    clearFilters: 'Limpar filtros',
    filterGroupCares: 'Cuidados',
    filterGroupVaccines: 'Vacinas',
    filterGroupVet: 'Veterinária',
    filterPending: 'Pendente',
    filterDone: 'Realizado',
    filterVaccDue: 'Próxima vacina',
    filterVaccExpired: 'Vacina vencida',
    filterVetVisit: 'Consulta veterinária',
    filterVetReturn: 'Retorno agendado',
    dayEmpty: 'Sem eventos neste dia',
    dayCares: 'Cuidados do dia',
    dayVaccines: 'Vacinas',
    dayVetVisits: 'Consultas / Agendamentos',
    editCare: 'Editar cuidado',
    carePending: 'Pendente',
    careDone: 'Realizado',
    careSkipped: 'Ignorado',
    vaccineApply: 'Aplicar agora',
    vetVisitKind: 'Consulta',
    vetReturnKind: 'Retorno agendado',
    eventsCount: '{n} evento(s)',
  },
  vet: {
    pageTitle: 'Veterinária',
    pageSubtitle: 'Saúde clínica e prontuários médicos',
    tabs: {
      profile: 'Perfil médico',
      vets: 'Meus veterinários',
      appointments: 'Consultas',
      exams: 'Exames',
      documents: 'Documentos',
    },
    comingSoon: {
      exams: 'Guarde resultados de exames, receitas e relatórios em um só lugar.',
      documents: 'Passaporte digital e compartilhamento de dados com seu veterinário.',
      label: 'Em breve',
    },
    profile: {
      emptyTitle: 'Sem perfil médico',
      emptyText: 'Preencha o perfil da sua mascote para que o veterinário tenha todas as informações de um relance.',
      emptyBtn: 'Completar perfil',
      editBtn: 'Editar perfil',
      lastUpdated: 'Atualizado',
      noConditions: 'Sem condições registradas',
      noSurgeries: 'Sem cirurgias registradas',
      sex: 'Sexo',
      sexMale: 'Macho',
      sexFemale: 'Fêmea',
      neutered: 'Castrado / Esterilizado',
      neuteredYes: 'Sim',
      neuteredNo: 'Não',
      neuteredAge: 'Idade na castração',
      bloodType: 'Tipo sanguíneo',
      bloodTypePh: 'Ex. A, B, AB, DEA 1.1…',
      bloodTypeHint: 'Varia conforme a espécie — escreva livremente',
      allergies: 'Alergias conhecidas',
      conditions: 'Condições crônicas',
      surgeries: 'Cirurgias',
      environment: 'Tipo de habitat',
      envApartment: 'Apartamento',
      envHouse: 'Casa com jardim',
      envBoth: 'Ambos',
      livingWithAnimals: 'Convive com outros animais',
      parasiteControl: 'Antipulgas/vermífugo habitual',
      behavioralNotes: 'Notas de comportamento',
      vetQuestions: 'Perguntas para o veterinário',
      modalTitle: 'Perfil médico',
      editingFor: 'Editando perfil de {name}',
      savedSuccess: 'Perfil salvo',
      savedSuccessFor: 'O histórico de {name} foi atualizado',
      sectionBasic: 'Dados básicos',
      sectionConditions: 'Condições crônicas',
      sectionSurgeries: 'Cirurgias e intervenções',
      sectionEnvironment: 'Ambiente e comportamento',
      sectionVetNotes: 'Notas para o veterinário',
      customConditionPh: 'Nome da condição',
      addCondition: 'Adicionar',
      surgeryNamePh: 'Ex. Castração, Extração dental',
      surgeryNotesPh: 'Observações',
      addSurgery: '+ Adicionar cirurgia',
      removeSurgery: '×',
    },
    contactTypes: {
      primary: 'Principal',
      specialist: 'Especialista',
      emergency: 'Emergência',
      other: 'Outro',
    },
    contacts: {
      addBtn: 'Adicionar veterinário',
      emptyTitle: 'Sem veterinários salvos',
      emptyText: 'Salve o contato do seu veterinário para acesso rápido.',
      phone2: 'Tel. alternativo',
      deleteConfirm: 'Confirmar exclusão?',
      titleAdd: 'Adicionar veterinário',
      titleEdit: 'Editar veterinário',
      subtitleAdd: 'Salve o contato do seu veterinário de confiança',
      subtitleEdit: 'Editando contato de {name}',
      sectionType: 'Tipo de veterinário',
      sectionContact: 'Dados de contato',
      sectionPets: 'Mascotes associadas',
      sectionNotes: 'Notas adicionais',
      vetNamePh: 'Ex. Dra. Silva',
      clinicPh: 'Ex. Clínica VetSaúde',
      specialtyPh: 'Ex. Dermatologia, Oncologia',
      phonePh: 'Ex. +55 11 90000-0000',
      phone2Ph: 'Ex. +55 11 91111-1111',
      addressPh: 'Rua, número, cidade',
      notesPh: 'Horários, instruções especiais…',
      errName: 'O nome é obrigatório',
      errClinic: 'A clínica é obrigatória',
      errPhone: 'O telefone é obrigatório',
    },
    apptTypes: {
      routine: 'Consulta',
      emergency: 'Urgência',
      specialist: 'Especialista',
      followup: 'Retorno',
      exam: 'Exames',
      vaccine: 'Vacina',
      other: 'Outro',
    },
    appointments: {
      addBtn: 'Registrar consulta',
      nextLabel: '📅 Próximo retorno',
      historyLabel: 'Histórico de consultas',
      emptyTitle: 'Sem consultas registradas',
      emptyText: 'Registre a primeira consulta de {name} para iniciar o histórico.',
      deleteConfirm: 'Confirmar exclusão?',
      diagnosis: 'Diagnóstico',
      treatment: 'Tratamento',
      weight: 'Peso na visita',
      nextReturn: 'Retorno',
      sectionDateTime: 'Data e hora',
      sectionVet: 'Veterinário',
      sectionDetails: 'Detalhes da consulta',
      sectionFollowUp: 'Acompanhamento',
      sectionExtra: 'Dados adicionais',
      vetContactLabel: 'Veterinário salvo',
      vetContactNone: 'Inserir manualmente',
      vetNamePh: 'Ex. Dra. Silva',
      clinicPh: 'Ex. Clínica VetSaúde',
      reason: 'Motivo da consulta',
      reasonPh: 'Ex. Revisão anual, tosse persistente…',
      diagnosisPh: 'Diagnóstico do veterinário',
      treatmentPh: 'Medicamentos, doses, orientações…',
      nextDate: 'Data de retorno',
      nextNote: 'Nota do retorno',
      nextNotePh: 'Ex. Revisão pós-tratamento',
      weightPh: 'Ex. 4.2',
      cost: 'Custo da consulta',
      costPh: 'Ex. 45.00',
      notesPh: 'Qualquer observação relevante…',
      errReason: 'O motivo é obrigatório',
      errVetName: 'O nome do veterinário é obrigatório',
      errDate: 'A data é obrigatória',
      register: 'Registrar consulta',
      update: 'Salvar alterações',
      titleAdd: 'Registrar consulta',
      titleEdit: 'Editar consulta',
      subtitleAdd: 'Salve o histórico veterinário da sua mascote',
      subtitleEdit: 'Editando consulta de {date}',
    },
    toast: {
      vetAdded: 'Veterinário adicionado ✓',
      vetUpdated: 'Veterinário atualizado ✓',
      vetDeleted: 'Veterinário removido',
      apptAdded: 'Consulta registrada ✓',
      apptUpdated: 'Consulta atualizada ✓',
      apptDeleted: 'Consulta excluída',
      profileSaved: 'Perfil salvo ✓',
    },
    time: {
      today: 'Hoje',
      tomorrow: 'Amanhã',
      inDays: 'Em {n} dias',
      daysAgo: 'Há {n} dias',
    },
  },
  settings: {
    title: 'Configurações', subtitle: 'Conta e preferências',
    personalData: 'Dados pessoais', personalSubtitle: 'Suas informações no PITUTI',
    profilePhoto: 'Foto de perfil', photoHint: 'JPG, PNG ou WebP · Máx. 2 MB',
    changePhoto: 'Alterar', fullName: 'Nome completo',
    email: 'E-mail', phone: 'Telefone', city: 'Cidade', about: 'Sobre mim',
    fullNamePlaceholder: 'Seu nome e sobrenome', phonePlaceholder: '+55 11 90000-0000',
    cityPlaceholder: 'São Paulo, Rio de Janeiro…',
    aboutPlaceholder: 'Apaixonado/a por animais…',
    appearance: 'Aparência', theme: 'Tema do app', themeHint: 'Claro ou escuro',
    changeTheme: 'Alterar', language: 'Idioma',
    languageHint: 'Español · English · Português', notifications: 'Notificações',
    vaccineAlert: 'Vacinas a vencer', vaccineAlertHint: '7 dias antes do vencimento',
    medAlert: 'Doses de medicamentos', medAlertHint: 'Lembrete diário de doses',
    symptomAlert: 'Sintomas sem resolução',
    symptomAlertHint: 'Quando um sintoma dura +3 dias',
    weeklyDigest: 'Resumo semanal', weeklyDigestHint: 'Toda segunda por e-mail',
    urgentAlerts: 'Alertas urgentes', urgentAlertsHint: 'Push imediato em emergências',
    dangerZone: 'Zona de risco',
    exportData: 'Exportar dados',
    exportHint: 'Baixe um CSV com todo o histórico das suas mascotes, vacinas, medicamentos e sintomas.',
    exportBtn: 'Exportar CSV',
    deleteAccount: 'Excluir conta',
    deleteHint: 'Ação permanente e irreversível. Todos os seus dados, mascotes e histórico serão apagados.',
    deleteBtn: 'Excluir conta', saved: 'Salvo',
    deleteModal: {
      title: 'Excluir conta permanentemente',
      subtitle: 'Esta ação não pode ser desfeita',
      willLose: 'Se você excluir sua conta, perderá permanentemente:',
      petProfiles: 'O perfil completo de todas as suas mascotes',
      vaccines: 'Histórico de vacinas e próximas doses',
      medications: 'Todos os medicamentos registrados',
      records: 'Sintomas, notas e registros veterinários',
      dailyCares: 'Cuidados diários e rotinas configuradas',
      caregivers: 'Acesso compartilhado com outros cuidadores',
      warning: '⚠ Você não poderá recuperar esses dados após excluir sua conta.',
      continue: 'Continuar →',
      typePrompt: 'Para confirmar, digite',
      typeWord: 'excluir',
      typeError: 'Digite exatamente "excluir" (sem aspas)',
      confirmBtn: 'Excluir definitivamente',
      finalWarning: 'Ao clicar em "Excluir definitivamente", sua conta e todos os dados associados serão apagados permanentemente dos servidores do PITUTI.',
    },
  },
  topbar: {
    searchPlaceholder: 'Buscar mascote, registro…',
    noNotifications: 'Sem novas notificações',
    changeTheme: 'Alterar tema',
  },
  modal: {
    close: 'Fechar', editPet: 'Editar mascote',
    registerVaccine: 'Registrar vacina', vaccineApplied: 'Data de aplicação',
    vaccineNext: 'Próxima dose', vaccineVet: 'Veterinário (opcional)',
    vaccineNotes: 'Notas (opcional)', vaccineSaved: 'Registrado!',
    selectVaccine: 'Selecionar vacina',
    shareCares: 'Compartilhar cuidados', shareInvite: 'Convide cuidadores de',
    activeCaregiversLabel: 'Cuidadores ativos', inviteNew: 'Convidar novo cuidador',
    accessLevel: 'Nível de acesso', sendInvitation: '✉ Enviar convite',
    inviteSent: 'Convite enviado!',
    inviteExpiry: '✓ O link do convite expira em 48 horas',
    understood: 'Entendido', removeCaregiver: 'Remover',
    editCare: 'Configurar cuidado', addInfo: 'Informações adicionais',
    frequency: 'Frequência', perDay: 'Por dia', perWeek: 'Por semana',
    perMonth: 'Por mês', quantity: 'Quantidade (opcional)', notify: 'Ativar lembrete',
    readOnly: 'Somente leitura', readOnlyHint: 'Ver registros, não pode editar',
    caregiver: 'Cuidador', caregiverHint: 'Registrar cuidados e vacinas',
    fullAccess: 'Acesso completo', fullAccessHint: 'Editar perfil e todos os dados',
  },
  status: {
    active: 'Ativo', resolved: 'Resolvido', archived: 'Arquivado',
    expired: 'Vencida', soon: 'Em breve', upToDate: 'Em dia',
    finished: 'Concluído', new: 'Nova ✓',
  },
  toast: {
    changesSaved: '✓ Alterações salvas com sucesso', themeChanged: 'Tema alterado',
    petAdded: 'adicionada com sucesso 🐾', careRegistered: 'Cuidado registrado ✓',
    inviteSent: '✉ Convite enviado para ', symptomResolved: '✓ Sintoma resolvido',
    symptomReopened: '↩ Sintoma reaberto', noteArchived: '📁 Nota arquivada',
    noteUnarchived: '✓ Nota desarquivada', noteDeleted: 'Nota excluída',
    csvDownloaded: '📄 CSV baixado com sucesso',
    vaccineRegistered: '💉 Vacina registrada',
    medAdded: 'Medicamento adicionado', photoUpdated: '📸 Foto atualizada',
    languageChanged: 'Idioma atualizado',
  },
  dates: {
    today: 'Hoje', yesterday: 'Ontem', days_ago: 'Há {n} dias',
    months: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    weekdays: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    weekdaysShort: ['Do','Se','Te','Qu','Qu','Se','Sa'],
  },
}

// ══════════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════════

export const TRANSLATIONS: Record<Lang, Translations> = { es, en, pt }

export const LANG_LABELS: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
}
