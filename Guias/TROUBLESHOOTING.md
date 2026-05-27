# Troubleshooting Guide - Pituti

Guia completo para resolver problemas comuns durante desenvolvimento e produção.

---

## 🔴 Problemas de Autenticação

### Erro: "Token inválido" / 401 Unauthorized

**Sintomas:**
- Todas as requisições retornam 401
- Mensagem "Token inválido" ou "Unauthorized"
- Usuário é deslogado automaticamente

**Causas possíveis:**

1. **Token expirado** (após 7 dias)
2. **JWT_SECRET diferente** entre frontend e backend
3. **Token malformado** ou corrompido
4. **Header Authorization** não está sendo enviado

**Soluções:**

```bash
# 1. Verificar se token existe
# No console do navegador:
localStorage.getItem('pituti_token')
sessionStorage.getItem('pituti_token')

# 2. Limpar storage e fazer login novamente
localStorage.clear()
sessionStorage.clear()
# Depois fazer login de novo

# 3. Verificar JWT_SECRET no backend
# No Vercel Dashboard → Settings → Environment Variables
# Confirmar que JWT_SECRET está definida

# 4. Verificar se client.ts está enviando header
# No DevTools → Network → Selecionar request → Headers
# Deve ter: Authorization: Bearer eyJhbG...
```

**Debug avançado:**

```typescript
// Adicionar log temporário em client.ts
private async request<T>(method: string, path: string, body?: unknown) {
  const token = getToken()
  console.log('🔑 Token:', token ? token.slice(0, 20) + '...' : 'NENHUM')
  
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  console.log('📤 Request headers:', headers)
  // ... resto do código
}
```

---

### Erro: "Sessão expirada" ao recarregar página

**Sintomas:**
- Login funciona mas ao recarregar (F5) perde sessão
- Usuário volta para /login após refresh

**Causa:**
- UserContext não está inicializando do localStorage

**Solução:**

```typescript
// Verificar que UserContext.tsx tem este useEffect:
useEffect(() => {
  const storedUser = localStorage.getItem('pituti_user') || sessionStorage.getItem('pituti_user');
  const token = localStorage.getItem('pituti_token') || sessionStorage.getItem('pituti_token');
  
  if (storedUser && token) {
    try {
      const parsed = JSON.parse(storedUser);
      setUser({...parsed});
      setIsAuthenticated(true);
    } catch (e) {
      console.error('Error parsing stored user:', e);
      clearToken();
    }
  }
}, []);
```

---

## 🔴 Problemas de Conexão

### Erro: "Failed to fetch" / Network Error

**Sintomas:**
- Requests não chegam ao backend
- Console mostra "Failed to fetch"
- Network tab mostra requests canceladas

**Causas possíveis:**

1. **Backend não está rodando**
2. **URL incorreta** em VITE_API_URL
3. **CORS** bloqueando requests
4. **Firewall** bloqueando porta

**Soluções:**

```bash
# 1. Verificar se backend está rodando
curl http://localhost:3000/api/health
# Ou para produção:
curl https://sua-api.vercel.app/api/health

# Se não responder, iniciar backend:
cd pituti-api
npm run dev

# 2. Verificar VITE_API_URL
echo $VITE_API_URL
# Ou no código:
console.log(import.meta.env.VITE_API_URL)

# 3. Testar CORS com curl
curl -X OPTIONS http://localhost:3000/api/pets \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Deve retornar headers:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH
```

---

### Erro: "CORS policy: No 'Access-Control-Allow-Origin'"

**Sintomas:**
- Console mostra erro CORS
- Request aparece em Network mas sem response
- Mensagem menciona "Access-Control-Allow-Origin"

**Causa:**
- Backend não está configurado para aceitar requests do frontend

**Solução (Backend next.config.ts):**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NODE_ENV === 'production'
              ? 'https://pituti.vercel.app'  // URL do frontend
              : '*'
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,POST,PUT,DELETE,OPTIONS,PATCH' 
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' 
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Após alterar:**
```bash
git add next.config.ts
git commit -m "Fix CORS configuration"
git push
# Aguardar redeploy automático na Vercel
```

---

## 🔴 Problemas de Base de Dados

### Erro: "Cannot connect to database"

**Sintomas:**
- Backend retorna 500
- Logs mostram "connection refused" ou "timeout"
- Endpoints não retornam dados

**Causas possíveis:**

1. **DATABASE_URL incorreta** ou não configurada
2. **Neon database pausado** (free tier)
3. **IP bloqueado** (raro no Neon)
4. **SSL required** mas não configurado

**Soluções:**

```bash
# 1. Verificar DATABASE_URL
# No Vercel Dashboard → Settings → Environment Variables
# Deve ter formato:
# postgresql://user:password@host.neon.tech/dbname?sslmode=require

# 2. Testar conexão diretamente
psql "$DATABASE_URL" -c "SELECT NOW();"

# 3. Verificar se database está ativo no Neon
# Ir para console.neon.tech → Ver status do projeto

# 4. Se usar Neon, adicionar ?sslmode=require
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

**Verificar no código (lib/db.ts):**

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Testar conexão
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected:', result);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
```

---

### Erro: "relation does not exist"

**Sintomas:**
- Erro ao fazer queries
- Mensagem "relation 'users' does not exist"

**Causa:**
- Tabelas não foram criadas (schema.sql não foi executado)

**Solução:**

```bash
# 1. Conectar ao Neon SQL Editor
# console.neon.tech → SQL Editor

# 2. Copiar e executar schema.sql completo

# 3. Verificar tabelas criadas
\dt

# Deve listar 10 tabelas:
# - users
# - pets
# - medical_profiles
# - vaccines
# - medications
# - symptoms
# - cares
# - notes
# - vets
# - appointments
```

---

## 🔴 Problemas de Build

### Erro: "Module not found"

**Sintomas:**
- Build falha com "Cannot find module"
- TypeScript errors durante build

**Soluções:**

```bash
# 1. Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# 2. Limpar cache do build
rm -rf .next dist

# 3. Rebuild
npm run build

# 4. Verificar imports
# Usar paths relativos corretos
# ❌ import { api } from 'api/client'
# ✅ import { api } from '../api/client'
```

---

### Erro: "Out of memory" durante build

**Sintomas:**
- Build falha com "JavaScript heap out of memory"
- Vercel build timeout

**Solução:**

```bash
# Adicionar ao package.json:
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

## 🔴 Problemas em Produção

### Frontend deployed mas mostra página em branco

**Causas possíveis:**

1. **Erro JavaScript** quebrando a app
2. **VITE_API_URL** não configurada
3. **Build incorreto**

**Soluções:**

```bash
# 1. Abrir DevTools → Console
# Ver se há erros JavaScript

# 2. Verificar variáveis de ambiente
# Vercel Dashboard → Settings → Environment Variables
# Confirmar que VITE_API_URL está definida

# 3. Verificar build localmente
npm run build
npm run preview
# Deve funcionar em http://localhost:4173

# 4. Redeploy
vercel --prod
```

---

### Requests funcionam local mas não em produção

**Causa comum:**
- VITE_API_URL aponta para localhost

**Solução:**

```bash
# Verificar env vars na Vercel
# DEVE ser:
VITE_API_URL=https://pituti-api.vercel.app/api

# NÃO pode ser:
VITE_API_URL=http://localhost:3000/api
```

---

## 🔴 Problemas de Performance

### Carregamento muito lento (>5s)

**Diagnóstico:**

```bash
# 1. Verificar tamanho do bundle
npm run build
# Ver output - bundle size

# 2. Analisar com Lighthouse
# DevTools → Lighthouse → Run

# 3. Verificar Network waterfall
# DevTools → Network → Ver ordem de requests
```

**Otimizações:**

```typescript
// 1. Lazy loading de rotas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PetDetail = lazy(() => import('./pages/PetDetail'));

// 2. Code splitting
// Usar dynamic imports para componentes pesados

// 3. Otimizar imagens
// Usar formatos modernos (WebP, AVIF)
// Comprimir imagens antes de upload
```

---

## 🔴 Problemas de Dados

### Pets/dados não aparecem após criar

**Diagnóstico:**

```bash
# 1. Verificar se POST funcionou
# DevTools → Network → Criar pet
# Status deve ser 201 Created
# Response deve ter o pet criado

# 2. Verificar se GET está sendo chamado
# Após criar, deve haver GET /api/pets
# Status 200, response com array incluindo novo pet

# 3. Verificar se estado está atualizando
# Adicionar log temporário no context
console.log('Pets state:', pets)
```

**Solução:**

```typescript
// No PetsContext ou componente:
const createPet = async (petData: CreatePetDto) => {
  const response = await petsApi.create(petData)
  
  // Atualizar estado local imediatamente
  setPets(prev => [...prev, response.data])
  
  // OU recarregar lista
  await refreshPets()
}

const refreshPets = async () => {
  const response = await petsApi.getAll()
  setPets(response.data)
}
```

---

## 🔴 Problemas de Deployment

### Vercel deployment falha

**Verificar logs:**
```bash
# Via CLI
vercel logs

# Via dashboard
# Deployments → [último deploy] → View Function Logs
```

**Erros comuns:**

1. **"Environment variable not found"**
   - Ir para Settings → Environment Variables
   - Adicionar variáveis faltantes

2. **"Build failed"**
   - Verificar que `npm run build` funciona localmente
   - Verificar Node version (deve ser 20+)

3. **"Function timeout"**
   - Aumentar timeout em vercel.json:
   ```json
   {
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

---

## 📊 Ferramentas de Debug

### 1. Verificar Estado da App

```typescript
// Adicionar ao componente raiz (temporário)
useEffect(() => {
  console.log('🔍 Debug Info:', {
    apiUrl: import.meta.env.VITE_API_URL,
    hasToken: !!localStorage.getItem('pituti_token'),
    user: JSON.parse(localStorage.getItem('pituti_user') || '{}'),
  })
}, [])
```

### 2. Interceptar Requests

```typescript
// Em client.ts (temporário)
private async request<T>(method: string, path: string, body?: unknown) {
  console.log(`🌐 ${method} ${this.base}${path}`, body)
  
  const res = await fetch(...)
  
  console.log(`✅ Response ${res.status}`, await res.clone().json())
  
  return res.json()
}
```

### 3. Monitor Network

```bash
# Chrome DevTools → Network
# Filtrar: /api/
# Verificar:
# - URL correta
# - Headers incluem Authorization
# - Status 200/201 (sucesso) ou 4xx/5xx (erro)
# - Response tem dados esperados
```

---

## 🆘 Último Recurso: Reset Completo

Se nada funcionar:

```bash
# 1. Backup código importante
cp -r src src-backup

# 2. Limpar tudo
rm -rf node_modules .next dist package-lock.json
localStorage.clear()
sessionStorage.clear()

# 3. Reinstalar
npm install

# 4. Recriar .env.local
cat > .env.local << EOF
VITE_API_URL=http://localhost:3000/api
EOF

# 5. Test fresh
npm run dev
```

---

## 📞 Checklist Antes de Pedir Ajuda

Reunir estas informações:

- [ ] Mensagem de erro completa (screenshot)
- [ ] Logs do console (DevTools → Console)
- [ ] Network tab (requests falhando)
- [ ] Versão Node (`node -v`)
- [ ] Sistema operativo
- [ ] Onde falha (local/produção)
- [ ] Passos para reproduzir
- [ ] O que já tentou

---

## 🔗 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Troubleshooting](https://vercel.com/docs/troubleshooting)
- [MDN HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

**Problemas persistentes?** Reveja `DEPLOYMENT.md` e `FRONTEND_INTEGRATION.md` passo a passo.
