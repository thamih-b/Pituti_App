# Integração Frontend-Backend - Pituti

## 📋 Mudanças Necessárias

### 1. Atualizar API Client (src/api/client.ts)

**Problema:** O client atual não envia o token JWT nas requisições.

**Solução:** Substituir `src/api/client.ts` pelo ficheiro `client.ts` fornecido.

**O que muda:**
- ✅ Adiciona header `Authorization: Bearer <token>` em todas as requisições
- ✅ Gestão automática de token (lê de localStorage/sessionStorage)
- ✅ Redirecionamento automático para /login em caso de 401
- ✅ Funções auxiliares: `setToken()`, `clearToken()`, `getToken()`
- ✅ Tipos completos para todos os recursos da API

**Como aplicar:**
```bash
# Backup do ficheiro original
mv src/api/client.ts src/api/client.ts.backup

# Copiar novo ficheiro
cp client.ts src/api/client.ts
```

---

### 2. Atualizar UserContext (src/context/UserContext.tsx)

**Problema:** O contexto não inicializa o usuário do localStorage ao carregar.

**Solução:** Substituir `src/context/UserContext.tsx` pelo ficheiro `UserContext.tsx` fornecido.

**O que muda:**
- ✅ Inicialização automática do usuário guardado em localStorage/sessionStorage
- ✅ Função `logout()` que limpa token e redireciona
- ✅ Flag `isAuthenticated` para verificar se há sessão ativa
- ✅ Sincronização automática com o token JWT

**Como aplicar:**
```bash
# Backup do ficheiro original
mv src/context/UserContext.tsx src/context/UserContext.tsx.backup

# Copiar novo ficheiro
cp UserContext.tsx src/context/UserContext.tsx
```

---

### 3. Configurar Variáveis de Ambiente

**Criar ficheiro `.env.local` na raiz do projeto frontend:**

```env
# Desenvolvimento local
VITE_API_URL=http://localhost:3000/api

# OU produção (depois de fazer deploy)
# VITE_API_URL=https://seu-projeto.vercel.app/api
```

**Verificar que `.env.local` está no .gitignore:**
```bash
echo ".env.local" >> .gitignore
```

---

## 🔄 Fluxo de Autenticação Atualizado

### Login/Register (já funciona corretamente)

1. **LoginPage** → envia credenciais para `/api/auth/login` ou `/api/auth/register`
2. **Backend** → valida e retorna `{ data: { user, token } }`
3. **LoginPage** → guarda token e user em localStorage/sessionStorage
4. **UserContext** → atualiza estado do usuário
5. **Redirecionamento** → navegação para `/dashboard`

### Requisições Autenticadas (após mudanças)

1. **Componente** → chama `petsApi.getAll()` (ou qualquer endpoint)
2. **Client** → lê token de localStorage: `getToken()`
3. **Client** → adiciona header: `Authorization: Bearer <token>`
4. **Fetch** → envia requisição com autenticação
5. **Backend** → verifica token JWT
6. **Backend** → retorna dados do usuário autenticado

### Logout

```typescript
import { useUser } from '../context/UserContext'

function MyComponent() {
  const { logout } = useUser()
  
  return (
    <button onClick={logout}>
      Sair
    </button>
  )
}
```

---

## 🔍 Verificação de Hardcoded Data

### ✅ Já Limpo (sem mock/hardcoded)

Estes contextos já estão a usar a API real:

- **PetsContext** - Carrega pets da API
- **VaccinesContext** - Carrega vacinas da API
- **SymptomsContext** - Carrega sintomas da API
- **MedicationsContext** - Carrega medicamentos (se implementado)
- **CaresContext** - Carrega cuidados (se implementado)

### ⚠️ Verificar Manualmente

Alguns contextos podem ter dados de exemplo. Procure por:

```typescript
// Padrão de mock - REMOVER se encontrar
const MOCK_DATA = [...]
const DEMO_PETS = [...]
const SAMPLE_VACCINES = [...]
```

**Como limpar:**
```bash
# Procurar por mocks em todo o projeto
grep -r "MOCK_" src/
grep -r "DEMO_" src/
grep -r "SAMPLE_" src/
```

---

## 🧪 Testar Integração

### 1. Backend Rodando

```bash
# Terminal 1: Backend (Next.js API)
cd pituti-api
npm run dev
# Deve estar em http://localhost:3000
```

### 2. Frontend Rodando

```bash
# Terminal 2: Frontend (Vite/React)
cd pituti-frontend  # ou o nome do seu projeto
npm run dev
# Deve estar em http://localhost:5173 (ou outra porta)
```

### 3. Teste Completo

**a) Registar novo utilizador:**
1. Ir para `/login`
2. Mudar para aba "Criar conta"
3. Preencher: Nome, Email, Password
4. Clicar "Criar conta"
5. Verificar redirecionamento para `/dashboard`

**b) Verificar token:**
```javascript
// No console do navegador
localStorage.getItem('pituti_token')
// Deve retornar: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**c) Criar pet:**
1. Ir para `/pets` ou página de criação
2. Preencher formulário
3. Submeter
4. **Verificar no Network tab:**
   - Request tem header `Authorization: Bearer ...`
   - Response retorna o pet criado
   - Status 201 Created

**d) Listar pets:**
1. Recarregar página `/pets`
2. Pets devem aparecer (carregados da API)
3. **Verificar no Network tab:**
   - Request GET `/api/pets` com header Authorization
   - Response retorna array de pets
   - Status 200 OK

**e) Logout:**
1. Clicar em botão de logout
2. Token deve ser removido de localStorage
3. Redirecionamento para `/login`
4. Tentar aceder `/dashboard` sem login → volta para `/login`

---

## 🐛 Troubleshooting

### Erro: "Network request failed" / CORS

**Causa:** Backend não permite requests do frontend.

**Solução (Backend - next.config.ts):**
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'http://localhost:5173' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,PATCH,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
      ],
    },
  ];
}
```

### Erro: "Token inválido" / 401 Unauthorized

**Possíveis causas:**
1. Token expirado (7 dias)
2. JWT_SECRET diferente entre frontend e backend
3. Token malformado

**Solução:**
```bash
# Limpar storage e fazer login novamente
localStorage.clear()
sessionStorage.clear()
# Depois fazer login de novo
```

### Erro: "Cannot read property 'data'" após requisição

**Causa:** Backend retornou erro mas frontend espera `.data`

**Solução:** Verificar response no Network tab:
```json
// Esperado (sucesso)
{ "data": [...], "total": 5 }

// Erro
{ "error": "Mensagem de erro" }
```

---

## 📱 Preparar para Produção

### 1. Atualizar .env para Produção

```env
# .env.production
VITE_API_URL=https://seu-projeto.vercel.app/api
```

### 2. Build Frontend

```bash
npm run build
# Gera pasta dist/ com ficheiros estáticos
```

### 3. Deploy Frontend (Vercel/Netlify)

**Opção A: Vercel**
```bash
npm i -g vercel
vercel
# Seguir instruções
# Adicionar VITE_API_URL nas env vars
```

**Opção B: Netlify**
```bash
npm i -g netlify-cli
netlify deploy
# Adicionar VITE_API_URL nas env vars
```

### 4. Testar em Produção

```bash
# Abrir app em produção
# Fazer login
# Criar pet
# Verificar no Network tab que requests vão para URL Vercel
```

---

## ✅ Checklist Final

Antes de considerar integração completa:

- [ ] `client.ts` atualizado com autenticação JWT
- [ ] `UserContext.tsx` inicializa usuário do localStorage
- [ ] `.env.local` configurado com `VITE_API_URL`
- [ ] Login funciona e guarda token
- [ ] Requests incluem header `Authorization`
- [ ] Backend aceita requests do frontend (CORS OK)
- [ ] Criar/listar pets funciona
- [ ] Logout limpa token e redireciona
- [ ] Sem dados hardcoded nos contextos
- [ ] Build de produção funciona

---

## 🎯 Resumo das Mudanças

| Ficheiro | Mudança | Impacto |
|----------|---------|---------|
| `src/api/client.ts` | Adicionar auth JWT | **CRÍTICO** - Sem isto, nenhuma requisição funciona |
| `src/context/UserContext.tsx` | Persistência de sessão | **IMPORTANTE** - Usuário perde login ao recarregar |
| `.env.local` | Configurar API URL | **NECESSÁRIO** - Define onde está o backend |

**Tempo estimado:** 15-30 minutos para aplicar todas as mudanças e testar.

---

**Próximo passo:** Aplicar os ficheiros `client.ts` e `UserContext.tsx` e testar o fluxo completo de login → criar pet → logout.
