# Testing & QA — Pituti App

> **Versão testada:** Tarefa 12 (Contexts migrados para API)
> **Data dos testes:** Maio 2026
> **Ambiente:** Vite + React 18 + TypeScript | API REST em `http://localhost:3001`
> **Plataformas:** Desktop (Chrome/Edge 1280px+) · Mobile (375px — simulado DevTools)

---

## 1. Resumo Executivo

| Área | Estado | Observações |
|------|--------|-------------|
| Páginas (routing) | ✅ Todas funcionam | Sem rotas quebradas |
| Erros no Console | ✅ Nenhum | Após migração da Tarefa 12 |
| Integração API | ✅ Funcional | Contexts usam `petsApi`, `vetsApi`, etc. |
| Fallback offline | ✅ MOCK_PETS activo | PitutiContext faz fallback se API cair |
| Design Responsive | ✅ Desktop + Mobile | Testado em ambos |
| Dark Mode | ✅ Funcional | Toggle persiste via `data-theme` |

---

## 2. Páginas Testadas

### 2.1 Dashboard (`/`)

| Teste | Resultado | Notas |
|-------|-----------|-------|
| Carrega lista de pets da API | ✅ | `petsApi.getAll()` chamado no mount |
| Cuidados do dia exibidos | ✅ | `CaresContext` carrega da API |
| Toast de sucesso/erro aparece | ✅ | Auto-oculta após 3.2s |
| Responsive 375px | ✅ | Cards empilham em coluna única |
| Dark mode | ✅ | Superfícies e textos corretos |

### 2.2 Pets (`/pets`)

| Teste | Resultado | Notas |
|-------|-----------|-------|
| Lista de pets carrega | ✅ | Via `PitutiContext` / `usePets()` |
| Adicionar novo pet | ✅ | `addPet` dispatch actualiza estado |
| Remover pet | ✅ | `removePet` com confirmação |
| Fallback MOCK_PETS (API offline) | ✅ | PitutiContext usa `MOCK_PETS` se fetch falha |
| Responsive | ✅ | Grid colapsa para 1 coluna em mobile |

### 2.3 Cuidados — Cares (`/cares`)

| Teste | Resultado | Notas |
|-------|-----------|-------|
| Lista de cuidados por pet | ✅ | `usePetCares(petId)` filtra correctamente |
| Marcar como feito | ✅ | `setCareProgress` actualiza `doneByDate` |
| Editar cuidado | ✅ | Modal `EditCareModal` + `updateCare` |
| Eliminar cuidado | ✅ | `deleteCare` remove do estado |
| Adicionar novo cuidado | ✅ | `addCare` gera `id` único |
| Cuidados com intervalo (ex: cada 14 dias) | ✅ | `getDueDatesInRange` + `isDueOnDate` |
| Loading state enquanto API responde | ✅ | `loading: true` inicial |
| Responsive | ✅ | — |

### 2.4 Medicamentos — Medications (`/medications`)

| Teste | Resultado | Notas |
|-------|-----------|-------|
| Lista de medicamentos activos | ✅ | `useMedications().active` |
| Histórico (arquivados) | ✅ | `useMedications().history` |
| Adicionar medicamento | ✅ | `addMedication` + mapeamento de pet |
| Arquivar medicamento | ✅ | `archiveMedication` → badge muda para "Terminado" |
| Filtro por pet (`getMedicationsByPetId`) | ✅ | `petIdMap` interno mantém relação |
| Loading state | ✅ | — |
| Responsive | ✅ | — |

### 2.5 Sintomas — Symptoms (`/symptoms`)

| Teste | Resultado | Notas |
|-------|-----------|-------|
| Sintomas activos por pet | ✅ | `usePetSymptoms(petId).active` |
| Sintomas resolvidos | ✅ | `usePetSymptoms(petId).resolved` |
| Marcar como resolvido / reabrir | ✅ | `resolve()` / `unresolve()` |
| Adicionar novo sintoma | ✅ | `addSymptom` gera `id` único |
| `refetch()` disponível no context | ✅ | Exposto via `useSymptomsContext` |
| Responsive | ✅ | — |

### 2.6 Veterinários — Vets (`/vets`)

| Teste | Resultado | Notas |
|-------|-----------|-------|
| Lista de vets carrega da API | ✅ | `vetsApi.getAll()` no mount |
| Consultas por vet carregam em paralelo | ✅ | `Promise.all` com `appointmentsApi.getAll` |
| Adicionar vet | ✅ | `addVet` actualiza estado local |
| Editar vet | ✅ | `updateVet` substitui entrada |
| Eliminar vet | ✅ | `deleteVet` filtra lista |
| Adicionar consulta | ✅ | `addAppointment` vincula ao pet |
| `vetCalendarDates` calculado | ✅ | `useMemo` combina datas passadas e futuras |
| `error` + `refetch()` expostos | ✅ | Disponíveis para componentes de UI |
| Responsive | ✅ | — |

### 2.7 Vacinas — Vaccines (`/vaccines`)

| Teste | Resultado | Notas |
|-------|-----------|-------|
| Calendário de vacinas exibido | ✅ | — |
| Próximas vacinas destacadas | ✅ | — |
| Responsive | ✅ | — |

---

## 3. Testes de Integração — Contexts

### 3.1 PitutiContext

```
✅ useEffect chama petsApi.getAll() no mount
✅ SET_PETS_LOADING: true → false ao completar fetch
✅ SET_PETS_ERROR preenchido em caso de falha
✅ Fallback para MOCK_PETS quando API não responde
✅ refetchPets() disponível como hook (usePets().refetch)
✅ Toast auto-oculta em 3200ms
✅ Tema persiste em data-theme e localStorage
```

### 3.2 CaresContext

```
✅ Carrega cuidados para todos os pets via petsApi + caresApi
✅ Mapeamento ApiCare → CareItem com emoji e bg corretos
✅ doneByDate inicializado como {}
✅ loading e error expostos
```

### 3.3 MedicationsContext

```
✅ Carrega medicamentos para todos os pets em paralelo
✅ petIdMap mantém associação med → pet após carregamento
✅ getMedicationsByPetId e getActiveMedicationsByPetId funcionam
✅ addMedication insere no topo da lista
```

### 3.4 SymptomsContext

```
✅ Carrega sintomas por pet em paralelo
✅ Mapeamento de severity (mild→leve, moderate→moderado, severe→grave)
✅ refetch() incrementa tick → re-executa useEffect
```

### 3.5 VetContext

```
✅ vetsApi.getAll() + appointmentsApi.getAll() em paralelo
✅ Appointments flat() combinam todos os vets
✅ vetCalendarDates inclui datas passadas e nextAppointmentDate
✅ Profiles médicos mantidos em memória por petId
```

---

## 4. Testes Responsivos

| Breakpoint | Dashboard | Pets | Cares | Meds | Symptoms | Vets |
|------------|-----------|------|-------|------|----------|------|
| 375px (mobile) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 768px (tablet) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1280px (desktop) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Bugs Encontrados e Corrigidos

| ID | Descrição | Contexto | Estado |
|----|-----------|----------|--------|
| BUG-01 | `VetContext-api.tsx` duplicava lógica de `VetContext.tsx` | VetContext | ✅ Corrigido — ficheiro eliminado |
| BUG-02 | `CaresContext` adicionava dados da API sobre `INITIAL` hard-coded (duplicatas) | CaresContext | ✅ Corrigido — INITIAL removido, dados 100% da API |
| BUG-03 | `PitutiContext` usava `fetch()` directo em vez de `petsApi` | PitutiContext | ✅ Corrigido — migrado para `petsApi.getAll()` |
| BUG-04 | `MedicationsContext` sem `loading`/`error` expostos | MedicationsContext | ✅ Corrigido |
| BUG-05 | `SymptomsContext` sem `refetch()` | SymptomsContext | ✅ Corrigido |

---

## 6. Checklist Final

- [x] Todas as páginas carregam sem erros no console
- [x] API integrada em todos os contexts (`petsApi`, `vetsApi`, `appointmentsApi`, `caresApi`, `medicationsApi`, `symptomsApi`)
- [x] `loading` e `error` expostos em todos os contexts
- [x] `refetch()` disponível em VetContext e SymptomsContext
- [x] Fallback para dados mock quando API offline (PitutiContext)
- [x] Design responsive verificado em mobile (375px) e desktop (1280px+)
- [x] Dark mode funcional em todas as páginas
- [x] Sem ficheiros órfãos (`VetContext-api.tsx` eliminado)
- [x] Sem dados hard-coded nos contexts (dados INITIAL removidos)

---

## 7. Próximos Passos Recomendados

1. **Testes automatizados** — adicionar testes unitários com Vitest para os hooks dos contexts
2. **Error Boundary** — envolver cada página num `<ErrorBoundary>` para capturar erros inesperados
3. **ErrorBanner component** — componente reutilizável com `message` + botão `onRetry` para os estados de erro dos contexts
4. **Loading Skeletons** — aproveitar `loading: true` dos contexts para mostrar skeletons em vez de ecrã em branco
5. **Optimistic updates** — nas mutações de add/update/delete, actualizar o estado local imediatamente antes da resposta da API
