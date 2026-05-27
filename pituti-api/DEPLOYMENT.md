# Guia de Deployment - Pituti API

Este guia descreve o processo completo para fazer deployment da Pituti API na Vercel com PostgreSQL.

## Pré-requisitos

- [ ] Conta GitHub com repositório do projeto
- [ ] Conta Vercel (gratuita)
- [ ] Conta Neon Database (gratuita)

## Parte 1: Configurar Base de Dados (Neon)

### 1.1 Criar projeto no Neon

1. Aceda a [https://neon.tech](https://neon.tech)
2. Faça login ou crie conta
3. Clique em "Create Project"
4. Configure:
   - **Nome:** pituti-db
   - **Region:** Escolha a mais próxima (ex: Europe - Frankfurt)
   - **PostgreSQL Version:** 16 (recomendado)
5. Clique em "Create Project"

### 1.2 Obter Connection String

1. No dashboard do projeto, vá a "Connection Details"
2. Copie a **Connection string** completa
3. Deve ter este formato:
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```
4. **Guarde esta string** - vai precisar no passo 2.3

### 1.3 Executar Schema SQL

#### Opção A: Via SQL Editor (Web)

1. No Neon, clique em "SQL Editor"
2. Abra o ficheiro `schema.sql` do projeto
3. Copie todo o conteúdo
4. Cole no SQL Editor
5. Clique em "Run"
6. Verifique que todas as tabelas foram criadas (sem erros)

#### Opção B: Via CLI (psql)

```bash
# Instale psql se necessário (no macOS):
brew install postgresql

# Execute o schema
psql "YOUR_CONNECTION_STRING" -f schema.sql

# Verifique as tabelas criadas
psql "YOUR_CONNECTION_STRING" -c "\dt"
```

Deve ver todas as tabelas listadas:
- users
- pets
- medical_profiles
- vaccines
- medications
- symptoms
- cares
- notes
- vets
- appointments

## Parte 2: Deploy na Vercel

### 2.1 Preparar Repositório GitHub

1. Certifique-se que o código está no GitHub:
   ```bash
   git add .
   git commit -m "Preparar para deployment"
   git push origin main
   ```

2. Estrutura necessária:
   ```
   pituti-api/
   ├── app/
   ├── lib/
   ├── package.json
   ├── next.config.ts
   ├── tsconfig.json
   └── .env.example
   ```

### 2.2 Importar Projeto na Vercel

1. Aceda a [https://vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "Add New..." → "Project"
4. Selecione o repositório `pituti-api`
5. Clique em "Import"

### 2.3 Configurar Variáveis de Ambiente

**IMPORTANTE:** Antes de fazer deploy, configure estas variáveis:

1. Na página de configuração do projeto, vá a "Environment Variables"

2. Adicione as seguintes variáveis:

   **DATABASE_URL**
   - **Value:** Cole a connection string do Neon (passo 1.2)
   - **Environment:** Production, Preview, Development (marque todos)
   
   **JWT_SECRET**
   - **Value:** Gere uma chave segura (ver abaixo)
   - **Environment:** Production, Preview, Development (marque todos)

3. Para gerar `JWT_SECRET` seguro:
   ```bash
   # Opção 1: Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   
   # Opção 2: OpenSSL
   openssl rand -base64 32
   
   # Opção 3: Online
   # Visite https://www.grc.com/passwords.htm
   ```

### 2.4 Fazer Deploy

1. Depois de configurar as variáveis, clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. Se tudo correr bem, verá "Deployment Ready"
4. Copie a URL do projeto (ex: `pituti-api.vercel.app`)

## Parte 3: Verificar Deployment

### 3.1 Teste o Health Check

```bash
curl https://SUA-URL.vercel.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "service": "Pituti API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3.2 Teste o Register

```bash
curl -X POST https://SUA-URL.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@pituti.app",
    "password": "senha123456"
  }'
```

**Resposta esperada:**
```json
{
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "Teste User",
      "email": "teste@pituti.app"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3.3 Teste o Login

```bash
curl -X POST https://SUA-URL.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@pituti.app",
    "password": "senha123456"
  }'
```

### 3.4 Teste um Endpoint Protegido

```bash
# Guarde o token recebido no passo anterior
TOKEN="cole-o-token-aqui"

# Teste criar um pet
curl -X POST https://SUA-URL.vercel.app/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Luna",
    "species": "cat",
    "breed": "Siamês"
  }'
```

## Parte 4: Configurações Adicionais (Opcional)

### 4.1 Domínio Personalizado

1. Na Vercel, vá ao projeto → "Settings" → "Domains"
2. Adicione seu domínio (ex: `api.pituti.app`)
3. Configure DNS conforme instruções
4. Aguarde propagação (até 48h)

### 4.2 Configurar CORS

Se precisar permitir requests de domínios específicos:

1. Edite `next.config.ts`:
   ```typescript
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: 'https://seu-app.com' },
             { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
             { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
           ],
         },
       ];
     },
   };
   ```

2. Faça commit e push:
   ```bash
   git add next.config.ts
   git commit -m "Configure CORS"
   git push
   ```

3. Vercel fará redeploy automaticamente

### 4.3 Monitoring e Logs

1. Na Vercel, vá ao projeto → "Deployments"
2. Clique num deployment → "View Function Logs"
3. Aqui pode ver:
   - Requests em tempo real
   - Erros e stack traces
   - Performance metrics

## Parte 5: Integração com App Móvel

### 5.1 Atualizar Base URL

No seu app React Native/Expo, atualize a base URL da API:

```typescript
// config/api.ts
export const API_BASE_URL = 'https://SUA-URL.vercel.app';
```

### 5.2 Guardar Token com Segurança

Use `expo-secure-store` em vez de `AsyncStorage`:

```bash
npx expo install expo-secure-store
```

```typescript
import * as SecureStore from 'expo-secure-store';

// Guardar token
await SecureStore.setItemAsync('userToken', token);

// Ler token
const token = await SecureStore.getItemAsync('userToken');

// Apagar token
await SecureStore.deleteItemAsync('userToken');
```

### 5.3 Exemplo de Chamada API

```typescript
async function createPet(petData: any) {
  const token = await SecureStore.getItemAsync('userToken');
  
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(petData),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao criar pet');
  }
  
  return response.json();
}
```

## Troubleshooting

### Erro: "Database connection failed"

**Causa:** DATABASE_URL incorreta ou não configurada

**Solução:**
1. Vá à Vercel → Projeto → Settings → Environment Variables
2. Verifique se DATABASE_URL está correta
3. Teste a connection string no Neon SQL Editor
4. Redeploy o projeto: Deployments → ... → Redeploy

### Erro: "Invalid token" / "Token inválido"

**Causa:** JWT_SECRET diferente entre builds

**Solução:**
1. Confirme que JWT_SECRET está definido em Production
2. Não mude o JWT_SECRET depois de gerar tokens
3. Se mudou, utilizadores precisam fazer login novamente

### Erro: "Module not found"

**Causa:** Dependências em falta no package.json

**Solução:**
```bash
npm install
npm run build  # teste localmente primeiro
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

### Performance lenta

**Causa:** Região do Neon longe da Vercel

**Solução:**
1. No Neon, veja a região do database
2. Na Vercel → Settings → General → Region
3. Escolha região próxima ao Neon
4. Redeploy

## Checklist Final

Antes de considerar deployment completo:

- [ ] Health endpoint retorna 200 OK
- [ ] Register cria utilizador e retorna token
- [ ] Login retorna token válido
- [ ] Endpoints protegidos aceitam token e funcionam
- [ ] App móvel consegue comunicar com API
- [ ] Tokens são guardados em SecureStore
- [ ] Todas variáveis de ambiente configuradas
- [ ] Domain/URL funcional
- [ ] Logs não mostram erros críticos

## Próximos Passos

1. **Monitoring:** Configure Sentry ou similar para track de erros
2. **Rate Limiting:** Adicione proteção contra abuso de API
3. **Backup:** Configure backups automáticos no Neon
4. **Documentation:** Use Swagger/OpenAPI para docs automáticas
5. **Testing:** Adicione testes automatizados antes de deploy

## Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

**Questões?** Reveja os logs no Vercel ou consulte a documentação oficial.
