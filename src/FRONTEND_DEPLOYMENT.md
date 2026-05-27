# Deploy Frontend - Pituti

## 🎯 Opções de Deploy

### Opção 1: Vercel (Recomendado)
### Opção 2: Netlify
### Opção 3: GitHub Pages (apenas estático)

---

## 🚀 Opção 1: Vercel (Recomendado)

### Vantagens
- Deploy automático no push
- Preview deploys em pull requests
- Edge Network global
- HTTPS gratuito
- Integração perfeita com Next.js/Vite

### Passo 1: Preparar Projeto

```bash
# 1. Verificar que o build funciona
npm run build

# 2. Testar build localmente
npm run preview

# 3. Criar .gitignore se não existir
cat > .gitignore << 'EOF'
node_modules
dist
.env.local
.DS_Store
EOF

# 4. Commit e push
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### Passo 2: Deploy na Vercel

**Via Interface Web:**

1. Aceder a [vercel.com](https://vercel.com)
2. Login com GitHub
3. Clicar "Add New..." → "Project"
4. Selecionar repositório do frontend
5. Configurar:
   - **Framework Preset:** Vite (auto-detectado)
   - **Root Directory:** `.` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. **Environment Variables** (crítico):
   ```
   VITE_API_URL=https://seu-backend.vercel.app/api
   ```

7. Clicar "Deploy"

**Via CLI:**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Adicionar variável de ambiente
vercel env add VITE_API_URL production
# Cole a URL: https://seu-backend.vercel.app/api

# Deploy para produção
vercel --prod
```

### Passo 3: Configurar Domínio (Opcional)

1. Ir para projeto → Settings → Domains
2. Adicionar domínio personalizado
3. Configurar DNS conforme instruções
4. Aguardar propagação

---

## 🌐 Opção 2: Netlify

### Passo 1: Preparar Projeto

```bash
# 1. Criar netlify.toml
cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
EOF

# 2. Build local
npm run build

# 3. Commit
git add netlify.toml
git commit -m "Adicionar config Netlify"
git push
```

### Passo 2: Deploy na Netlify

**Via Interface:**

1. Aceder a [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Conectar GitHub
4. Selecionar repositório
5. Configurar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:**
     ```
     VITE_API_URL=https://seu-backend.vercel.app/api
     ```
6. Deploy site

**Via CLI:**

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

---

## 📦 Opção 3: GitHub Pages

**Limitações:**
- Apenas sites estáticos
- Sem variáveis de ambiente no server
- Precisa hardcode API URL ou usar .env no build

### Configuração

```bash
# 1. Instalar gh-pages
npm install -D gh-pages

# 2. Adicionar scripts ao package.json
```

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

```bash
# 3. Configurar base no vite.config.ts
```

```typescript
export default defineConfig({
  base: '/nome-do-repo/', // seu repositório GitHub
  // ...
})
```

```bash
# 4. Deploy
npm run deploy
```

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente por Ambiente

**.env.development** (local):
```env
VITE_API_URL=http://localhost:3000/api
```

**.env.production** (build):
```env
VITE_API_URL=https://pituti-api.vercel.app/api
```

### CORS no Backend

O backend precisa aceitar requests do frontend em produção:

**next.config.ts:**
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { 
          key: 'Access-Control-Allow-Origin', 
          value: process.env.NODE_ENV === 'production' 
            ? 'https://pituti-app.vercel.app' 
            : '*' 
        },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,PATCH,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
      ],
    },
  ];
}
```

---

## ✅ Checklist Pré-Deploy

### Código
- [ ] `npm run build` funciona sem erros
- [ ] `npm run preview` mostra app funcionando
- [ ] Sem console.logs desnecessários
- [ ] Sem dados hardcoded (API URL em .env)

### Configuração
- [ ] `.gitignore` inclui `.env.local`, `dist`, `node_modules`
- [ ] `.env.production` com `VITE_API_URL` correto
- [ ] `package.json` tem `"type": "module"` se necessário

### Backend
- [ ] Backend em produção e funcionando
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` configurada
- [ ] CORS permite domínio do frontend

### Testes
- [ ] Login funciona
- [ ] Criar pet funciona
- [ ] API requests incluem token
- [ ] Logout funciona

---

## 🧪 Testar Deploy

### 1. Verificar Build

```bash
# Build local
npm run build

# Verificar tamanho
du -sh dist/

# Preview local
npm run preview
# Abrir http://localhost:4173
```

### 2. Verificar Variáveis de Ambiente

```bash
# No build, verificar que API_URL foi injetada
grep -r "VITE_API_URL" dist/

# Ou inspecionar no navegador
console.log(import.meta.env.VITE_API_URL)
```

### 3. Testar em Produção

```bash
# Abrir URL do deploy
# Abrir DevTools → Network tab
# Fazer login
# Verificar requests:
#   - URL: https://seu-backend.vercel.app/api/auth/login
#   - Headers: Authorization: Bearer ...
#   - Status: 200
```

---

## 🐛 Troubleshooting

### Build falha com "Cannot find module"

**Causa:** Dependências em falta

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### App carrega mas API não responde

**Causa:** `VITE_API_URL` não foi injetada no build

**Solução:**
1. Verificar env vars na plataforma (Vercel/Netlify)
2. Fazer redeploy
3. Verificar no console: `import.meta.env.VITE_API_URL`

### CORS error em produção

**Causa:** Backend não aceita requests do domínio frontend

**Solução (Backend):**
```typescript
// next.config.ts
headers: [
  { key: 'Access-Control-Allow-Origin', value: 'https://seu-frontend.vercel.app' },
]
```

### Login funciona mas pets não aparecem

**Causa:** Token não está sendo enviado

**Solução:**
1. Verificar `client.ts` tem `getToken()` e `Authorization` header
2. Verificar localStorage tem `pituti_token`
3. Verificar Network tab → Request Headers

---

## 📊 Monitoramento

### Logs Vercel

```bash
# Via CLI
vercel logs

# Via interface
# Dashboard → Projeto → Functions → Logs
```

### Analytics

**Vercel:**
- Dashboard → Analytics
- Pageviews, unique visitors, top pages

**Google Analytics:**
1. Criar propriedade em analytics.google.com
2. Adicionar tracking code em `index.html`

---

## 🔄 Deploy Contínuo

### GitHub Actions (Vercel)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 Resultado Final

Depois do deploy:

✅ **URL pública** - https://pituti-app.vercel.app  
✅ **HTTPS automático** - SSL/TLS configurado  
✅ **Deploy automático** - Push para main = deploy  
✅ **Variáveis de ambiente** - API_URL configurada  
✅ **Performance** - CDN global (Vercel Edge)  
✅ **Logs e monitoring** - Dashboard completo  

---

## 📞 Próximos Passos

1. ✅ Deploy frontend (este guia)
2. 🔗 Testar integração completa
3. 🎨 Adicionar domínio personalizado
4. 📊 Configurar analytics
5. 🚀 Partilhar no portfolio!

**URL para portfolio:**
```
Frontend: https://pituti.vercel.app
Backend: https://pituti-api.vercel.app
GitHub: https://github.com/seu-user/pituti
```

🎉 **Sistema completo em produção!**
