# Pituti — Camada de Rede e Contrato de Tipos

## Visão Geral

Todos os acessos à API REST passam por `src/api/client.ts`.
Os contexts importam os recursos tipados (ex: `petsApi`, `vetsApi`) em vez de chamar `fetch()` diretamente.

```
src/
  api/
    client.ts   ← cliente HTTP + tipos de domínio + recursos tipados
    index.ts    ← barrel export
```

## BASE_URL

```ts
export const BASE_URL = 'http://localhost:3001/api'
```

Em produção, sobrescreva via variável de ambiente:
```ts
export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
```

## Uso nos Contexts

```ts
// Antes (fetch direto)
fetch('http://localhost:3001/api/pets').then(r => r.json()).then(d => d.data)

// Depois (cliente tipado)
import { petsApi } from '../api'
const { data: pets } = await petsApi.getAll()
```

## Gestão dos 3 estados de rede

Cada context que usa a API deve expor:

```ts
interface NetworkState<T> {
  data:    T
  loading: boolean
  error:   string | null
}
```

Exemplo no `VetContext`:
```ts
const [loading, setLoading] = useState(true)
const [error,   setError]   = useState<string | null>(null)

// No useEffect:
setLoading(true)
setError(null)
petsApi.getAll()
  .then(res => setData(res.data))
  .catch((err: ApiError) => setError(err.message ?? 'Error al cargar datos'))
  .finally(() => setLoading(false))
```

## Recursos disponíveis

| Recurso | Funções |
|---|---|
| `petsApi` | `getAll()` `getById(id)` `create(body)` `update(id, body)` `delete(id)` |
| `vetsApi` | `getAll()` `getById(id)` `create(body)` `update(id, body)` `delete(id)` |
| `appointmentsApi` | `getAll(vetId)` `create(vetId, body)` `update(vetId, id, body)` `delete(vetId, id)` |
| `medicationsApi` | `getAll(petId)` `create(petId, body)` `update(petId, id, body)` `delete(petId, id)` |
| `symptomsApi` | `getAll(petId)` `create(petId, body)` `update(petId, id, body)` `delete(petId, id)` |
| `caresApi` | `getAll(petId)` `create(petId, body)` `update(petId, id, body)` `delete(petId, id)` |
| `vaccinesApi` | `getAll(petId)` `create(petId, body)` `update(petId, id, body)` `delete(petId, id)` |

## Tipos de Domínio

| Tipo | Alinhado com |
|---|---|
| `ApiPet` | `store.pets` |
| `ApiVet` | `store.vets` |
| `ApiAppointment` | `store.appointments` |
| `ApiMedication` | `store.medications` |
| `ApiSymptom` | `store.symptoms` |
| `ApiCare` | `store.cares` |
| `ApiVaccine` | `store.vaccines` |

## Tratamento de Erros

O cliente lança `ApiError` (`{ status, message }`) em respostas não-ok.
Os contexts capturam com `.catch((err: ApiError) => setError(err.message))`.
A UI pode exibir o erro e um botão de retry chamando a função `refetch()` exposta pelo context.

## Fonte de Verdade

Os dados que vivem no backend **não são mais persistidos no localStorage**.
O localStorage é usado apenas para:
- `pituti-theme` — preferência de tema (dark/light)
- `pituti-lang` — preferência de idioma
- `pet-photo-*` — fotos de perfil dos pets (blob local)
