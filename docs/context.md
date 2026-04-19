# Context API — Pituti

## O que é e por que usar

A **Context API** do React resolve o problema de *prop drilling*: passar dados por múltiplos componentes intermediários que não precisam deles. Em vez disso, um componente Provider disponibiliza estado globalmente, e qualquer componente na árvore pode consumi-lo diretamente via `useContext`.

**Use Context quando:**
- O dado é necessário em muitos componentes em diferentes níveis da árvore
- Evitar passar props por 3+ níveis intermediários
- Estado verdadeiramente global: tema, usuário autenticado, idioma, alertas
- Dados de domínio partilhados: lista de pets, cuidados do dia

**Não use Context quando:**
- O estado é local a um componente ou subárvore pequena (`useState` é suficiente)
- Os dados mudam com altíssima frequência (considere Zustand ou Redux para performance)

---

## Estrutura do PitutiContext

```
src/
└── context/
    └── PitutiContext.tsx   ← Contexto, Provider, Reducer, hooks
```

### Estado global (`PitutiState`)

| Campo          | Tipo               | Descrição                              |
|----------------|--------------------|----------------------------------------|
| `pets`         | `PetWithAlerts[]`  | Lista de mascotas do utilizador        |
| `petsLoading`  | `boolean`          | Carregamento inicial das mascotas      |
| `theme`        | `'light' \| 'dark'` | Tema da aplicação                    |
| `toastMessage` | `string`           | Mensagem do toast global               |
| `toastType`    | `'success' \| 'err'` | Tipo visual do toast                |
| `toastVisible` | `boolean`          | Visibilidade do toast                  |
| `cares`        | `CareEntry[]`      | Cuidados do dia com progresso          |

---

## Implementação

### 1. Criar o contexto e o reducer

```tsx
// src/context/PitutiContext.tsx
const PitutiContext = createContext<PitutiContextValue | null>(null)

function reducer(state: PitutiState, action: Action): PitutiState {
  switch (action.type) {
    case 'SET_PETS':      return { ...state, pets: action.payload }
    case 'SET_THEME':     return { ...state, theme: action.payload }
    case 'SHOW_TOAST':    return { ...state, toastVisible: true, ... }
    case 'SET_CARE_DONE': return { ...state, cares: state.cares.map(...) }
    // ...
  }
}
```

### 2. Criar o Provider

```tsx
export function PitutiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Efeitos de sincronização
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('pituti-theme', state.theme)
  }, [state.theme])

  // Callbacks estáveis com useCallback
  const toggleTheme = useCallback(() =>
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })
  , [state.theme])

  return (
    <PitutiContext.Provider value={{ state, toggleTheme, showToast, ... }}>
      {children}
    </PitutiContext.Provider>
  )
}
```

### 3. Envolver a aplicação no Provider

```tsx
// src/App.tsx
export default function App() {
  return (
    <PitutiProvider>          {/* ← Provider envolve toda a app */}
      <BrowserRouter>
        <Routes>...</Routes>
      </BrowserRouter>
    </PitutiProvider>
  )
}
```

### 4. Consumir o contexto nos componentes

**Hook principal** — acesso a tudo:
```tsx
import { usePituti } from '../context/PitutiContext'

function MeuComponente() {
  const { state, toggleTheme, showToast } = usePituti()
  return <div>{state.pets.length} mascotas</div>
}
```

**Hooks convenientes** — acesso específico e semântico:
```tsx
import { usePets, useTheme, useCares, useAppToast } from '../context/PitutiContext'

// Apenas pets
const { pets, loading } = usePets()

// Apenas tema
const { theme, toggleTheme } = useTheme()

// Apenas cuidados do dia
const { cares, setCaredone } = useCares()

// Apenas toast
const showToast = useAppToast()
showToast('Vacuna registrada ✓', 'success')
```

---

## Componentes que consomem o contexto

| Componente        | Hooks usados               | O que consome                    |
|-------------------|----------------------------|----------------------------------|
| `AppLayout`       | `usePituti`                | tema, toast, toggleTheme         |
| `DashboardPage`   | `usePituti`, `useCares`    | pets, cuidados, alertas          |
| `PetListPage`     | `usePets`                  | lista de mascotas                |
| `PetDetailPage`   | `usePets`                  | pet individual, alertas          |
| `SettingsPage`    | `useTheme`, `useAppToast`  | tema e notificações              |
| `CaresPage`       | `useCares`, `usePets`      | cuidados por mascota             |

---

## Fluxo de dados

```
PitutiProvider (App.tsx)
│
├── dispatch(action)  ←────────── qualquer componente
│        │
│        ▼
│    reducer(state, action) → novo estado
│        │
│        ▼
└── PitutiContext.value  ──────── todos os consumers re-renderizam
```

---

## Performance

- **`useCallback`** em todos os métodos do Provider evita re-criação de funções
- **Hooks granulares** (`usePets`, `useTheme`...) permitem isolar re-renders futuros
- Para aplicações maiores, considere separar em múltiplos contextos por domínio (PetsContext, ThemeContext, etc.) ou migrar para **Zustand** se o número de ações crescer significativamente
