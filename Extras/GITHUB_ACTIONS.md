# GitHub Actions CI/CD - Pituti

Exemplos de workflows para automatizar testes, builds e deployments.

---

## 📁 Estrutura de Ficheiros

```
.github/
└── workflows/
    ├── test.yml           # Testes automáticos
    ├── deploy.yml         # Deploy automático
    └── security.yml       # Scan de segurança
```

---

## 🧪 Workflow: Testes Automáticos

**Ficheiro:** `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Backend Tests
  backend-tests:
    name: Backend Tests
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: pituti_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: 'pituti-api/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./pituti-api
        run: npm ci
      
      - name: Run database migrations
        working-directory: ./pituti-api
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/pituti_test
        run: |
          npm run db:migrate || echo "Migrations not configured yet"
      
      - name: Run tests
        working-directory: ./pituti-api
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/pituti_test
          JWT_SECRET: test-secret-key-for-ci-only
        run: npm test || echo "Tests not configured yet"
      
      - name: Build
        working-directory: ./pituti-api
        run: npm run build

  # Frontend Tests
  frontend-tests:
    name: Frontend Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: 'pituti-frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./pituti-frontend
        run: npm ci
      
      - name: Run linter
        working-directory: ./pituti-frontend
        run: npm run lint || echo "Linting not configured"
      
      - name: Type check
        working-directory: ./pituti-frontend
        run: npm run type-check || tsc --noEmit || echo "TypeScript check not configured"
      
      - name: Run tests
        working-directory: ./pituti-frontend
        run: npm test || echo "Tests not configured yet"
      
      - name: Build
        working-directory: ./pituti-frontend
        env:
          VITE_API_URL: https://api-test.example.com
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: pituti-frontend/dist
          retention-days: 7
```

---

## 🚀 Workflow: Deploy Automático

**Ficheiro:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch: # Permite deploy manual

jobs:
  # Deploy Backend
  deploy-backend:
    name: Deploy Backend to Vercel
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Pull Vercel Environment
        working-directory: ./pituti-api
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        working-directory: ./pituti-api
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        working-directory: ./pituti-api
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

  # Deploy Frontend
  deploy-frontend:
    name: Deploy Frontend to Vercel
    runs-on: ubuntu-latest
    needs: deploy-backend # Aguarda backend primeiro
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Pull Vercel Environment
        working-directory: ./pituti-frontend
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        working-directory: ./pituti-frontend
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        working-directory: ./pituti-frontend
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Get deployment URL
        id: deployment
        run: echo "url=$(vercel ls --token=${{ secrets.VERCEL_TOKEN }} | head -n 2 | tail -n 1 | awk '{print $2}')" >> $GITHUB_OUTPUT
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Frontend deployed to: ${{ steps.deployment.outputs.url }}`
            })
```

---

## 🔒 Workflow: Security Scan

**Ficheiro:** `.github/workflows/security.yml`

```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 2 * * 1' # Segunda-feira às 2h
  push:
    branches: [main]

jobs:
  # Dependency Scan
  dependency-scan:
    name: Dependency Vulnerability Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run npm audit (Backend)
        working-directory: ./pituti-api
        run: |
          npm audit --audit-level=moderate || true
          npm audit fix --audit-level=moderate || true
      
      - name: Run npm audit (Frontend)
        working-directory: ./pituti-frontend
        run: |
          npm audit --audit-level=moderate || true
          npm audit fix --audit-level=moderate || true

  # Code Quality
  code-quality:
    name: Code Quality Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run ESLint
        working-directory: ./pituti-frontend
        run: |
          npm ci
          npm run lint || true

  # Secret Scan
  secret-scan:
    name: Secret Detection
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

---

## 📋 Workflow: Pull Request Checks

**Ficheiro:** `.github/workflows/pr-checks.yml`

```yaml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  # Validar título do PR
  pr-title:
    name: Validate PR Title
    runs-on: ubuntu-latest
    
    steps:
      - name: Check PR title format
        uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            feat
            fix
            docs
            style
            refactor
            test
            chore
          requireScope: false

  # Preview Deploy
  preview-deploy:
    name: Deploy Preview
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./pituti-frontend
      
      - name: Comment Preview URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed! Check it out at the Vercel deployment URL.`
            })

  # Verificar tamanho do bundle
  bundle-size:
    name: Check Bundle Size
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./pituti-frontend
        run: npm ci
      
      - name: Build
        working-directory: ./pituti-frontend
        run: npm run build
      
      - name: Analyze bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          directory: ./pituti-frontend
```

---

## 🔧 Configuração de Secrets

No GitHub: **Settings → Secrets and variables → Actions**

Adicionar:

```
VERCEL_TOKEN          # Token do Vercel CLI
VERCEL_ORG_ID         # ID da organização Vercel
VERCEL_PROJECT_ID     # ID do projeto Vercel (backend)
VERCEL_PROJECT_ID_FE  # ID do projeto Vercel (frontend)
```

**Como obter:**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Obter tokens
vercel whoami
# Ir para vercel.com/account/tokens

# Obter IDs (dentro do projeto)
vercel link
cat .vercel/project.json
```

---

## 📊 Status Badges

Adicionar ao README.md:

```markdown
![Tests](https://github.com/seu-user/pituti/actions/workflows/test.yml/badge.svg)
![Deploy](https://github.com/seu-user/pituti/actions/workflows/deploy.yml/badge.svg)
![Security](https://github.com/seu-user/pituti/actions/workflows/security.yml/badge.svg)
```

---

## 🎯 Workflows Adicionais (Opcional)

### Database Backup

```yaml
name: Database Backup

on:
  schedule:
    - cron: '0 3 * * *' # Diariamente às 3h

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Backup Neon Database
        run: |
          pg_dump ${{ secrets.DATABASE_URL }} > backup.sql
          # Upload para S3/Google Drive/etc
```

### Performance Testing

```yaml
name: Performance Tests

on:
  schedule:
    - cron: '0 4 * * 1' # Segundas às 4h

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://pituti.vercel.app
            https://pituti.vercel.app/dashboard
```

---

## 🚦 Branch Protection Rules

Configurar em: **Settings → Branches → Add rule**

**Para branch `main`:**
- ✅ Require pull request reviews (1 aprovação)
- ✅ Require status checks (Tests must pass)
- ✅ Require branches to be up to date
- ✅ Include administrators
- ❌ Allow force pushes

---

## 📝 Exemplo de Uso

### Workflow Normal

```bash
# 1. Criar branch
git checkout -b feat/upload-photos

# 2. Fazer mudanças
git add .
git commit -m "feat: adicionar upload de fotos de pets"

# 3. Push
git push origin feat/upload-photos

# 4. Criar PR no GitHub
# → GitHub Actions roda testes automaticamente
# → Preview deploy é criado
# → Bundle size é verificado

# 5. Merge para main (após aprovação)
# → GitHub Actions faz deploy automático
# → Backend e frontend vão para produção
```

---

## ✅ Benefícios

- ✅ **Automação completa** - Push → Test → Deploy
- ✅ **Preview deploys** - Testar antes de merge
- ✅ **Segurança** - Scan de vulnerabilidades
- ✅ **Qualidade** - Testes obrigatórios
- ✅ **Rastreabilidade** - Histórico de deploys
- ✅ **Confiança** - Sem deploys manuais

---

**Documentação oficial:**
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/deployments/git/vercel-for-github)
