# Routing — Pituti

## Stack

- **React Router v6** com `BrowserRouter` + `Routes` declarativas
- Rotas aninhadas via `<Outlet />` no `AppLayout`
- Navegação programática com `useNavigate`
- Parâmetros de URL com `useParams`

---

## Estrutura de rotas

```
/                         → redireciona para /dashboard
│
├── /dashboard            → DashboardPage   (visão geral, alertas, cuidados)
├── /pets                 → PetListPage     (lista de mascotas)
├── /pets/:petId          → PetDetailPage   (ficha individual da mascota)
├── /vaccines             → VaccinesPage    (calendário de vacinas)
├── /medications          → MedicationsPage (medicamentos ativos)
├── /symptoms             → SymptomsPage    (registro de sintomas)
├── /notes                → NotesPage       (notas veterinárias)
├── /cares                → CaresPage       (cuidados diários)
├── /settings             → SettingsPage    (perfil e preferências)
│
└── *                     → NotFoundPage    (404 — fora do AppLayout)
```

---

## Como funciona o layout aninhado

Todas as rotas dentro de `/` usam o `AppLayout` como wrapper — ele renderiza
a topbar, a sidebar e chama `<Outlet />` onde o conteúdo da rota atual aparece.
A rota `*` está **fora** desse wrapper para ocupar a tela inteira.

```tsx
// App.tsx
<Route path="/" element={<AppLayout />}>   ← layout pai
  <Route path="dashboard" element={<DashboardPage />} />
  {/* ... */}
</Route>
<Route path="*" element={<NotFoundPage />} /> ← fora do layout
```

```tsx
// AppLayout.tsx
<main className="main">
  <Outlet />   {/* aqui renderiza DashboardPage, PetListPage, etc. */}
</main>
```

---

## Navegação entre páginas

### Via link declarativo (sidebar)
```tsx
import { NavLink } from 'react-router-dom'

<NavLink to="/pets" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
  Mis Mascotas
</NavLink>
```
`NavLink` aplica a classe `active` automaticamente quando a rota bate.

### Via código (programática)
```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

navigate('/pets')            // navegar para lista
navigate(`/pets/${pet.id}`)  // navegar para detalhe
navigate(-1)                 // voltar página anterior
navigate('/dashboard', { replace: true })  // sem histórico
```

### Redirecionamento automático
```tsx
import { Navigate } from 'react-router-dom'

<Route index element={<Navigate to="/dashboard" replace />} />
```
`replace: true` substitui a entrada no histórico em vez de empilhar.

---

## Parâmetros de URL

A rota `/pets/:petId` recebe o ID da mascota como parâmetro:

```tsx
// PetDetailPage.tsx
import { useParams } from 'react-router-dom'

const { petId } = useParams<{ petId: string }>()
// petId = "pet-1", "pet-2", etc.
```

---

## Página 404

Qualquer rota não mapeada cai no `NotFoundPage`:
- Mostra o caminho inválido com `useLocation().pathname`
- Botão para voltar ao Dashboard
- Botão para voltar à página anterior com `navigate(-1)`

---

## Quando usar cada hook de navegação

| Hook | Quando usar |
|---|---|
| `<NavLink>` | Links de navegação (sidebar, menus) — aplica `.active` automático |
| `<Link>` | Links simples sem estilo ativo |
| `useNavigate` | Após submit de formulário, clique em card, redirect condicional |
| `<Navigate>` | Redirect declarativo dentro do JSX (ex: index route) |
| `useParams` | Ler parâmetros dinâmicos da URL (`/pets/:petId`) |
| `useLocation` | Ler pathname, state ou query string atual |
