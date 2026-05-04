# Deployment — Pituti App

> **Plataforma:** Vercel (frontend + backend)
> **Estratégia:** 2 projectos separados no Vercel dentro do mesmo repositório (monorepo)
> **Última actualização:** Maio 2026

---

## Arquitectura de Produção

```
GitHub repo (PITUTI_APP/)
│
├── / (raiz)          → Vercel projecto 1: pituti-app      (React/Vite)
│   └── src/
│
└── server/           → Vercel projecto 2: pituti-api      (Node/Express)
    └── index.js
```

```
Browser → https://pituti-app.vercel.app
                    ↓
          React SPA (Vercel CDN)
                    ↓ fetch VITE_API_URL
          https://pituti-api.vercel.app/api
                    ↓
          Node/Express (Vercel Serverless)
```

---

## Pré-requisitos

- [ ] Conta no [vercel.com](https://vercel.com) ligada ao GitHub
- [ ] Repositório no GitHub com o código actualizado
- [ ] `.env.development` adicionado ao `.gitignore`

---

## 1. Deploy do Backend (`server/`)

### 1.1 Criar projecto no Vercel

1. Acede a [vercel.com/new](https://vercel.com/new)
2. Importa o repositório GitHub
3. **Importante — configurar Root Directory:**
   - Clica em **"Edit"** ao lado de Root Directory
   - Escreve `server`
   - Confirma
4. Framework Preset: **Other**
5. Build Command: *(deixar vazio)*
6. Output Directory: *(deixar vazio)*
7. Install Command: `npm install`

### 1.2 Variáveis de ambiente do backend

No painel do projecto → **Settings → Environment Variables**:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `CLIENT_ORIGIN` | `https://pituti-app.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |

### 1.3 Deploy

Clica em **Deploy**. Após sucesso, copia a URL gerada, ex:
```
https://pituti-api.vercel.app
```

Verifica a API:
```
https://pituti-api.vercel.app/api/health
```
Deve retornar `{ "status": "ok", "service": "PITUTI API", ... }`

---

## 2. Deploy do Frontend (raiz `/`)

### 2.1 Criar projecto no Vercel

1. Acede a [vercel.com/new](https://vercel.com/new)
2. Importa o **mesmo repositório** GitHub
3. Root Directory: **deixar em branco** (raiz do repo)
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`

### 2.2 Variáveis de ambiente do frontend

No painel do projecto → **Settings → Environment Variables**:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `VITE_API_URL` | `https://pituti-api.vercel.app/api` | Production |
| `VITE_API_URL` | `http://localhost:3001/api` | Preview + Development |

> ⚠️ **Atenção:** Variáveis `VITE_*` são injectadas em tempo de build.
> Sempre que alterares uma variável, faz **Redeploy** no Vercel.

### 2.3 Deploy

Clica em **Deploy**. URL gerada, ex:
```
https://pituti-app.vercel.app
```

---

## 3. Actualizar CORS no Backend

Após teres a URL do frontend, vai ao projecto do backend no Vercel:

**Settings → Environment Variables → `CLIENT_ORIGIN`**

Actualiza para a URL real do frontend:
```
https://pituti-app.vercel.app
```

Depois faz **Redeploy** no projecto do backend.

---

## 4. Verificação em Produção

```bash
# 1. Health check da API
curl https://pituti-api.vercel.app/api/health

# 2. Lista de pets
curl https://pituti-api.vercel.app/api/pets

# 3. Frontend carrega sem erros de CORS
# Abrir https://pituti-app.vercel.app e verificar Network tab no DevTools
```

Checklist final:
- [ ] `https://pituti-app.vercel.app` carrega a aplicação
- [ ] `https://pituti-api.vercel.app/api/health` retorna `status: ok`
- [ ] Sem erros CORS no Network tab
- [ ] Pets, Cares, Vets carregam dados reais da API
- [ ] Dark mode funciona
- [ ] Mobile responsive verificado

---

## 5. Deploy Contínuo (automático)

O Vercel faz deploy automático a cada `git push` para `main`:

```bash
git add .
git commit -m "feat: descrição da alteração"
git push origin main
# ↑ Vercel detecta e faz deploy em ~30s
```

Para branches de feature, o Vercel cria **Preview Deployments** automáticos com URL única.

---

## 6. Variáveis de Ambiente — Resumo

| Variável | Projecto | Valor Dev | Valor Prod |
|----------|----------|-----------|------------|
| `VITE_API_URL` | Frontend | `http://localhost:3001/api` | `https://pituti-api.vercel.app/api` |
| `CLIENT_ORIGIN` | Backend | `*` | `https://pituti-app.vercel.app` |
| `PORT` | Backend | `3001` | *(Vercel define automaticamente)* |

---

## 7. Limitações Importantes

> ⚠️ **Dados em memória (in-memory store)**
>
> O backend usa `server/data/store.js` com `Map()` em memória.
> No Vercel Serverless, cada invocação pode ser uma instância nova — **os dados não persistem entre requests**.
>
> Para produção real, substituir o store por uma base de dados (ex: MongoDB Atlas, PlanetScale, Supabase).
> Ver `server/data/store.js` — cada serviço usa `store[key]` que pode ser trocado por chamadas DB.

---

## 8. URLs do Projecto

| Recurso | URL |
|---------|-----|
| Frontend | https://pituti-app.vercel.app *(actualizar após deploy)* |
| API | https://pituti-api.vercel.app *(actualizar após deploy)* |
| Health Check | https://pituti-api.vercel.app/api/health |
| Repositório | https://github.com/thamih-b/pituti-app |
