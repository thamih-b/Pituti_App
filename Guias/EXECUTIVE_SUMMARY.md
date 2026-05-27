# Resumo Executivo - Alterações Frontend

## 🎯 Objetivo

Sincronizar frontend com PostgreSQL via API backend, garantindo autenticação JWT funcional.

## 📦 Ficheiros a Alterar

### CRÍTICO - Deve ser alterado

#### 1. `src/api/client.ts` ⚠️ PRINCIPAL
**Status atual:** Não envia token JWT  
**Status desejado:** Envia `Authorization: Bearer <token>` em todas as requisições

**Localização:** `src/api/client.ts`  
**Ficheiro de substituição:** `client.ts` (fornecido)  
**Ação:** `cp client.ts src/api/client.ts`

**Mudanças principais:**
```diff
- private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
-   const res = await fetch(`${this.base}${path}`, {
-     method,
-     headers: { 'Content-Type': 'application/json' },

+ private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
+   const token = getToken()
+   const headers: HeadersInit = { 'Content-Type': 'application/json' }
+   if (token) {
+     headers['Authorization'] = `Bearer ${token}`
+   }
+   const res = await fetch(`${this.base}${path}`, {
+     method,
+     headers,
```

---

#### 2. `src/context/UserContext.tsx` ⚠️ IMPORTANTE
**Status atual:** Não inicializa usuário do localStorage  
**Status desejado:** Carrega usuário automaticamente ao montar

**Localização:** `src/context/UserContext.tsx`  
**Ficheiro de substituição:** `UserContext.tsx` (fornecido)  
**Ação:** `cp UserContext.tsx src/context/UserContext.tsx`

**Mudanças principais:**
```diff
  export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile>(EMPTY_USER);
+   const [isAuthenticated, setIsAuthenticated] = useState(false);
+
+   useEffect(() => {
+     const storedUser = localStorage.getItem('pituti_user') || sessionStorage.getItem('pituti_user');
+     const token = localStorage.getItem('pituti_token') || sessionStorage.getItem('pituti_token');
+     if (storedUser && token) {
+       setUser(JSON.parse(storedUser));
+       setIsAuthenticated(true);
+     }
+   }, []);
+
+   const logout = () => {
+     clearToken();
+     setUser(EMPTY_USER);
+     window.location.href = '/login';
+   };
```

---

### NECESSÁRIO - Configuração

#### 3. `.env.local` (criar se não existir)
**Status atual:** Não existe ou API_URL incorreta  
**Status desejado:** Aponta para backend correto

**Localização:** `.env.local` (raiz do projeto frontend)  
**Template:** `.env.example.frontend` (fornecido)  
**Ação:** `cp .env.example.frontend .env.local` e editar

**Conteúdo:**
```env
# Desenvolvimento
VITE_API_URL=http://localhost:3000/api

# Produção (depois de deploy)
# VITE_API_URL=https://pituti-api.vercel.app/api
```

---

## 🔍 Verificações Adicionais

### Contextos sem Mock (verificar se já está correto)

Estes contextos **devem** usar API real, não dados hardcoded:

#### ✅ `src/context/PetsContext.tsx`
```typescript
// Verificar que tem isto:
useEffect(() => {
  petsApi.getAll()
    .then(res => setPets(res.data))
    .finally(() => setLoading(false))
}, [])

// ❌ NÃO deve ter isto:
const MOCK_PETS = [{ id: '1', name: 'Luna' }]
setPets(MOCK_PETS)
```

#### ✅ `src/context/VaccinesContext.tsx`
```typescript
// Verificar que tem isto:
vaccinesApi.getAll(petId).then(...)

// ❌ NÃO deve ter isto:
const SAMPLE_VACCINES = [...]
```

#### ✅ `src/context/SymptomsContext.tsx`
```typescript
// Verificar que tem isto:
symptomsApi.getAll(petId).then(...)

// ❌ NÃO deve ter isto:
const DEMO_SYMPTOMS = [...]
```

---

## 📋 Plano de Execução

### Passo 1: Backup (30 segundos)
```bash
cd seu-projeto-frontend
mkdir -p backups
cp src/api/client.ts backups/client.ts.backup
cp src/context/UserContext.tsx backups/UserContext.tsx.backup
```

### Passo 2: Aplicar Mudanças (2 minutos)
```bash
# Copiar ficheiros fornecidos
cp ~/Downloads/client.ts src/api/client.ts
cp ~/Downloads/UserContext.tsx src/context/UserContext.tsx

# Criar .env.local
cp ~/Downloads/.env.example.frontend .env.local

# Editar .env.local com URL do backend
nano .env.local  # ou code .env.local
```

### Passo 3: Verificar Imports (1 minuto)
```bash
# Verificar que outros ficheiros não quebram
npm run build
# Se houver erros de tipo, ajustar imports
```

### Passo 4: Testar (5 minutos)
```bash
# Terminal 1: Backend
cd ../pituti-api
npm run dev

# Terminal 2: Frontend
cd ../pituti-frontend
npm run dev

# Abrir http://localhost:5173
# Testar login → criar pet → logout
```

---

## ✅ Checklist de Validação

### Ficheiros Alterados
- [ ] `src/api/client.ts` substituído
- [ ] `src/context/UserContext.tsx` substituído
- [ ] `.env.local` criado e configurado
- [ ] Verificado que não há imports quebrados

### Testes Funcionais
- [ ] Login funciona e guarda token
- [ ] Token aparece em localStorage (`pituti_token`)
- [ ] Requests têm header `Authorization: Bearer ...`
- [ ] Criar pet funciona (POST com auth)
- [ ] Listar pets funciona (GET com auth)
- [ ] Logout limpa token e redireciona
- [ ] Recarregar página mantém sessão ativa
- [ ] Tentar aceder /dashboard sem login → redireciona para /login

### Backend Requirements
- [ ] Backend rodando em http://localhost:3000
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` configurada
- [ ] Schema SQL executado
- [ ] Health check OK: `curl localhost:3000/api/health`

---

## 🚨 Problemas Comuns e Soluções

### Problema 1: "Cannot connect to backend"
**Sintoma:** Network error, fetch failed  
**Causa:** Backend não está rodando ou URL errada  
**Solução:**
```bash
# Verificar se backend está rodando
curl http://localhost:3000/api/health

# Se não responder, iniciar backend
cd pituti-api && npm run dev

# Verificar VITE_API_URL em .env.local
echo $VITE_API_URL  # deve ser http://localhost:3000/api
```

---

### Problema 2: "Token inválido" / 401
**Sintoma:** Todas as requisições retornam 401  
**Causa:** Token expirado ou JWT_SECRET diferente  
**Solução:**
```bash
# Limpar storage
localStorage.clear()
sessionStorage.clear()

# Fazer login novamente
# Verificar que JWT_SECRET é a mesma no backend
```

---

### Problema 3: "User data not persisting"
**Sintoma:** Usuário desaparece ao recarregar página  
**Causa:** UserContext não foi atualizado  
**Solução:**
```bash
# Verificar que UserContext.tsx tem useEffect de inicialização
grep -A 10 "useEffect" src/context/UserContext.tsx

# Deve ter:
# useEffect(() => {
#   const storedUser = localStorage.getItem('pituti_user')
#   ...
```

---

### Problema 4: CORS Error
**Sintoma:** "CORS policy: No 'Access-Control-Allow-Origin'"  
**Causa:** Backend não aceita requests do frontend  
**Solução (Backend next.config.ts):**
```typescript
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'http://localhost:5173' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,PATCH' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
    ],
  }];
}
```

---

## 📊 Impacto das Mudanças

| Componente | Antes | Depois | Impacto |
|------------|-------|--------|---------|
| Autenticação | ❌ Sem token nas requests | ✅ JWT em todas as requests | **CRÍTICO** |
| Persistência | ❌ Usuário perde sessão | ✅ Sessão mantida | **ALTO** |
| API URL | ⚠️ Hardcoded | ✅ Configurável via .env | **MÉDIO** |
| Logout | ⚠️ Parcial | ✅ Completo com limpeza | **BAIXO** |

---

## 🎯 Resultado Final

Depois destas alterações:

✅ **Login/Register** - Funciona e guarda token JWT  
✅ **Todas as requisições** - Incluem header Authorization  
✅ **Sessão persiste** - Usuário mantém login ao recarregar  
✅ **Logout completo** - Limpa token e redireciona  
✅ **Sincronização DB** - Dados vêm do PostgreSQL via API  
✅ **Zero hardcoded** - Todos os dados são dinâmicos  
✅ **Production ready** - Configurável via variáveis de ambiente  

**Tempo total:** 10-15 minutos para aplicar + 5-10 minutos para testar = **20-25 minutos**

---

## 📞 Próximos Passos

1. ✅ Aplicar alterações (este documento)
2. 🧪 Testar localmente (FRONTEND_INTEGRATION.md)
3. 🚀 Deploy frontend (Vercel/Netlify)
4. 🔗 Atualizar VITE_API_URL para produção
5. ✅ Testar em produção

**Quando concluído:** Sistema completo funcionando com PostgreSQL, autenticação JWT e pronto para portfolio! 🎉
