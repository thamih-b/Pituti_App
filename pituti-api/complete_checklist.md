# ✅ Checklist Completo - Pituti Full Stack

## 🎯 Objetivo
Sistema completo com frontend React, backend Next.js API e PostgreSQL em produção.

---

## Fase 1: Backend (30 min)

### 1.1 Base de Dados PostgreSQL (Neon)
- [ ] Conta criada em https://neon.tech
- [ ] Projeto PostgreSQL criado
- [ ] Região selecionada (recomendado: Europe - Frankfurt)
- [ ] Connection string copiada
- [ ] Schema SQL executado (`schema.sql`)
- [ ] Verificar tabelas criadas (10 tabelas):
  ```sql
  \dt
  -- users, pets, medical_profiles, vaccines, medications,
  -- symptoms, cares, notes, vets, appointments
  ```

### 1.2 Repositório Backend
- [ ] Código backend em repositório GitHub
- [ ] Estrutura de pastas verificada:
  ```
  pituti-api/
  ├── app/api/
  ├── lib/
  ├── package.json
  ├── next.config.ts
  ├── schema.sql
  └── README.md
  ```
- [ ] `.gitignore` atualizado (`.env.local`, `node_modules`, `.next`)

### 1.3 Deploy Backend na Vercel
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas:
  - [ ] `DATABASE_URL` (connection string Neon)
  - [ ] `JWT_SECRET` (32+ caracteres aleatórios)
- [ ] Build completado com sucesso
- [ ] URL do projeto copiada (ex: `pituti-api.vercel.app`)

### 1.4 Verificar Backend
- [ ] Health check OK:
  ```bash
  curl https://sua-url.vercel.app/api/health
  # Esperado: {"status":"ok","service":"Pituti API",...}
  ```
- [ ] Register funciona:
  ```bash
  curl -X POST https://sua-url.vercel.app/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","password":"test1234"}'
  # Esperado: {"data":{"user":{...},"token":"..."}}
  ```
- [ ] Login funciona:
  ```bash
  curl -X POST https://sua-url.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test1234"}'
  # Esperado: {"data":{"user":{...},"token":"..."}}
  ```

---

## Fase 2: Frontend - Integração (20 min)

### 2.1 Atualizar API Client
- [ ] Backup original:
  ```bash
  cp src/api/client.ts src/api/client.ts.backup
  ```
- [ ] Substituir por novo `client.ts` fornecido
- [ ] Verificar imports:
  ```bash
  grep "import.*client" src/**/*.ts*
  ```
- [ ] Sem erros TypeScript:
  ```bash
  npm run type-check
  # ou tsc --noEmit
  ```

### 2.2 Atualizar UserContext
- [ ] Backup original:
  ```bash
  cp src/context/UserContext.tsx src/context/UserContext.tsx.backup
  ```
- [ ] Substituir por novo `UserContext.tsx` fornecido
- [ ] Verificar que tem:
  - [ ] `useEffect` para carregar user do localStorage
  - [ ] Função `logout()`
  - [ ] Flag `isAuthenticated`

### 2.3 Configurar Ambiente
- [ ] Criar `.env.local`:
  ```env
  VITE_API_URL=https://pituti-api.vercel.app/api
  ```
- [ ] Verificar que `.env.local` está no `.gitignore`
- [ ] Criar `.env.example`:
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```

### 2.4 Remover Dados Hardcoded
- [ ] Verificar PetsContext usa `petsApi.getAll()`
- [ ] Verificar VaccinesContext usa `vaccinesApi.getAll()`
- [ ] Verificar SymptomsContext usa `symptomsApi.getAll()`
- [ ] Procurar por mocks:
  ```bash
  grep -r "MOCK_\|DEMO_\|SAMPLE_" src/
  # Não deve retornar nada relevante
  ```

---

## Fase 3: Testar Localmente (15 min)

### 3.1 Backend Local
- [ ] Instalar dependências:
  ```bash
  cd pituti-api
  npm install
  ```
- [ ] Configurar `.env.local`:
  ```env
  DATABASE_URL=postgresql://...
  JWT_SECRET=sua-chave-secreta
  ```
- [ ] Executar:
  ```bash
  npm run dev
  # Deve rodar em http://localhost:3000
  ```
- [ ] Health check local OK:
  ```bash
  curl http://localhost:3000/api/health
  ```

### 3.2 Frontend Local
- [ ] Instalar dependências:
  ```bash
  cd pituti-frontend
  npm install
  ```
- [ ] Configurar `.env.local`:
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```
- [ ] Executar:
  ```bash
  npm run dev
  # Deve rodar em http://localhost:5173
  ```
- [ ] Abrir no navegador: http://localhost:5173

### 3.3 Teste Completo do Fluxo
- [ ] **Register:**
  - [ ] Ir para `/login`
  - [ ] Clicar "Criar conta"
  - [ ] Preencher nome, email, password
  - [ ] Submit
  - [ ] Verifica redirecionamento para `/dashboard`
  - [ ] Verifica localStorage tem `pituti_token`

- [ ] **Criar Pet:**
  - [ ] Ir para página de criar pet
  - [ ] Preencher formulário (nome, espécie, etc)
  - [ ] Submit
  - [ ] Abrir DevTools → Network
  - [ ] Verificar request `POST /api/pets`:
    - [ ] Header `Authorization: Bearer ...` presente
    - [ ] Status 201 Created
    - [ ] Response contém pet criado

- [ ] **Listar Pets:**
  - [ ] Recarregar página de pets
  - [ ] Pet criado aparece na lista
  - [ ] Verificar request `GET /api/pets`:
    - [ ] Header `Authorization` presente
    - [ ] Status 200 OK
    - [ ] Response contém array com pet

- [ ] **Logout:**
  - [ ] Clicar botão de logout
  - [ ] Token removido de localStorage
  - [ ] Redirecionado para `/login`
  - [ ] Tentar aceder `/dashboard` → volta para `/login`

- [ ] **Persistência de Sessão:**
  - [ ] Fazer login
  - [ ] Recarregar página (F5)
  - [ ] Usuário continua logado
  - [ ] Dados aparecem normalmente

---

## Fase 4: Deploy Frontend (20 min)

### 4.1 Preparar para Deploy
- [ ] Build local funciona:
  ```bash
  npm run build
  # Sem erros
  ```
- [ ] Preview funciona:
  ```bash
  npm run preview
  # Abrir http://localhost:4173
  ```
- [ ] Commit e push:
  ```bash
  git add .
  git commit -m "Integração backend completa"
  git push origin main
  ```

### 4.2 Deploy na Vercel
- [ ] Projeto importado na Vercel
- [ ] Configurar:
  - [ ] Framework: Vite (auto-detectado)
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Variável de ambiente:
  ```
  VITE_API_URL=https://pituti-api.vercel.app/api
  ```
- [ ] Deploy iniciado
- [ ] Build completado com sucesso
- [ ] URL copiada (ex: `pituti.vercel.app`)

### 4.3 Verificar Deploy
- [ ] Abrir URL do frontend
- [ ] Login funciona
- [ ] Criar pet funciona
- [ ] Network tab mostra:
  - [ ] Requests vão para URL do backend Vercel
  - [ ] Headers incluem `Authorization`
  - [ ] Responses corretas (200/201)

---

## Fase 5: Configurações Finais (10 min)

### 5.1 CORS no Backend
- [ ] Atualizar `next.config.ts`:
  ```typescript
  headers: [
    { 
      key: 'Access-Control-Allow-Origin', 
      value: 'https://pituti.vercel.app' // URL do frontend
    },
  ]
  ```
- [ ] Commit e push
- [ ] Aguardar redeploy automático

### 5.2 Segurança
- [ ] `.env.local` não está no GitHub
- [ ] `JWT_SECRET` é forte (32+ caracteres)
- [ ] Passwords têm mínimo 8 caracteres
- [ ] Tokens expiram (7 dias configurado)

### 5.3 Domínios Personalizados (Opcional)
- [ ] Configurar domínio frontend (ex: `app.pituti.com`)
- [ ] Configurar domínio backend (ex: `api.pituti.com`)
- [ ] DNS configurado
- [ ] HTTPS ativo

---

## Fase 6: Documentação (10 min)

### 6.1 README.md
- [ ] Descrição do projeto
- [ ] Stack tecnológica
- [ ] Links para:
  - [ ] Frontend em produção
  - [ ] Backend em produção
  - [ ] Repositório
- [ ] Screenshots ou demo

### 6.2 Ficheiros de Documentação
- [ ] `README.md` - Visão geral
- [ ] `DEPLOYMENT.md` - Guia de deployment
- [ ] `schema.sql` - Schema da base de dados
- [ ] `.env.example` - Template de variáveis

---

## 📊 Checklist Final de Validação

### Funcionalidades Core
- [ ] ✅ Autenticação (register/login) funciona
- [ ] ✅ JWT tokens são enviados em requests
- [ ] ✅ CRUD de Pets funciona
- [ ] ✅ CRUD de Vacinas funciona
- [ ] ✅ CRUD de Medicamentos funciona
- [ ] ✅ CRUD de Sintomas funciona
- [ ] ✅ CRUD de Cuidados funciona
- [ ] ✅ CRUD de Notas funciona
- [ ] ✅ CRUD de Veterinários funciona
- [ ] ✅ CRUD de Consultas funciona

### Infraestrutura
- [ ] ✅ PostgreSQL em produção (Neon)
- [ ] ✅ Backend em produção (Vercel)
- [ ] ✅ Frontend em produção (Vercel)
- [ ] ✅ HTTPS ativo em ambos
- [ ] ✅ CORS configurado corretamente
- [ ] ✅ Variáveis de ambiente seguras

### Qualidade
- [ ] ✅ Sem console.logs em produção
- [ ] ✅ Sem dados hardcoded
- [ ] ✅ Sem erros no console do navegador
- [ ] ✅ Build sem warnings críticos
- [ ] ✅ TypeScript sem erros
- [ ] ✅ Performance aceitável (<3s carregamento)

### Portfolio Ready
- [ ] ✅ URLs públicas funcionais
- [ ] ✅ README completo
- [ ] ✅ Screenshots disponíveis
- [ ] ✅ Demo account (opcional)
- [ ] ✅ Código no GitHub
- [ ] ✅ Licença definida

---

## 🎯 URLs Finais

Preencher depois do deploy:

```
Frontend: https://_________________.vercel.app
Backend:  https://_________________.vercel.app
GitHub:   https://github.com/_____/pituti
Demo:     Email: __________ / Password: __________
```

---

## 🐛 Troubleshooting Rápido

### Problema: Login não funciona
- [ ] Verificar `VITE_API_URL` em env vars
- [ ] Verificar `DATABASE_URL` no backend
- [ ] Verificar CORS no backend
- [ ] Verificar Network tab no navegador

### Problema: Token inválido
- [ ] Limpar localStorage/sessionStorage
- [ ] Fazer login novamente
- [ ] Verificar `JWT_SECRET` é a mesma

### Problema: Pets não aparecem
- [ ] Verificar `Authorization` header em requests
- [ ] Verificar `client.ts` tem `getToken()`
- [ ] Verificar token está salvo em localStorage

---

## 📈 Métricas de Sucesso

Quando tudo estiver completo:

✅ **100% funcional** - Todos os endpoints funcionam  
✅ **Seguro** - Autenticação JWT, HTTPS, env vars  
✅ **Performático** - <3s carregamento, CDN global  
✅ **Escalável** - PostgreSQL, serverless functions  
✅ **Documentado** - README, schemas, guides  
✅ **Portfolio ready** - URLs públicas, código limpo  

---

## ⏱️ Tempo Estimado Total

- Fase 1 (Backend): 30 min
- Fase 2 (Integração): 20 min
- Fase 3 (Testes): 15 min
- Fase 4 (Deploy Frontend): 20 min
- Fase 5 (Configurações): 10 min
- Fase 6 (Documentação): 10 min

**Total: ~1h45min**

---

## 🎉 Projeto Completo!

Quando todos os checkboxes estiverem marcados:

**Parabéns! Você tem um sistema full-stack completo em produção com:**
- ✅ Frontend React moderno
- ✅ Backend Next.js API
- ✅ PostgreSQL gerenciado
- ✅ Autenticação JWT
- ✅ Deploy em produção
- ✅ Pronto para portfolio

**Próximo passo:** Partilhar o link e adicionar ao CV/LinkedIn! 🚀
