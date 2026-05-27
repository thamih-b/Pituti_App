# Comandos Úteis - Pituti API

Referência rápida de comandos para desenvolvimento, deployment e troubleshooting.

## Desenvolvimento Local

### Setup inicial
```bash
# Clonar repositório
git clone https://github.com/SEU-USER/pituti-api.git
cd pituti-api

# Instalar dependências
npm install

# Criar .env.local
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### Executar localmente
```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Build de produção
npm run build

# Executar build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Base de Dados

### Executar schema
```bash
# Via psql (CLI)
psql "$DATABASE_URL" -f schema.sql

# Verificar tabelas criadas
psql "$DATABASE_URL" -c "\dt"

# Ver estrutura de uma tabela
psql "$DATABASE_URL" -c "\d users"

# Limpar base de dados (CUIDADO!)
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Queries úteis
```sql
-- Ver todos os utilizadores
SELECT id, name, email, created_at FROM users;

-- Ver pets de um utilizador
SELECT p.name, p.species, u.name as owner 
FROM pets p 
JOIN users u ON p.owner_id = u.id;

-- Ver consultas recentes
SELECT a.date, p.name as pet, v.name as vet 
FROM appointments a
JOIN pets p ON a.pet_id = p.id
JOIN vets v ON a.vet_id = v.id
ORDER BY a.date DESC
LIMIT 10;

-- Contar registos por tabela
SELECT 'users' as table, COUNT(*) FROM users
UNION ALL
SELECT 'pets', COUNT(*) FROM pets
UNION ALL
SELECT 'vaccines', COUNT(*) FROM vaccines;
```

## Git & Deploy

### Commits
```bash
# Preparar mudanças
git add .
git status

# Commit
git commit -m "feat: adicionar endpoint de notas"

# Push (triggers auto-deploy na Vercel)
git push origin main
```

### Branches
```bash
# Criar branch para feature
git checkout -b feature/nova-funcionalidade

# Merge para main
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

## Vercel CLI (Opcional)

### Instalar
```bash
npm i -g vercel
```

### Comandos
```bash
# Login
vercel login

# Deploy de teste
vercel

# Deploy para produção
vercel --prod

# Ver logs em tempo real
vercel logs

# Listar deployments
vercel ls

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável
vercel env add DATABASE_URL production
```

## Testes da API

### Health Check
```bash
# Local
curl http://localhost:3000/api/health

# Produção
curl https://SUA-URL.vercel.app/api/health
```

### Autenticação
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senha-segura-123"
  }'

# Login e guardar token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","password":"senha-segura-123"}' \
  | jq -r '.data.token')

echo $TOKEN
```

### CRUD de Pets
```bash
# Criar pet
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Luna",
    "species": "cat",
    "breed": "Siamês",
    "birth_date": "2020-03-15"
  }'

# Listar pets
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/pets

# Ver um pet específico
PET_ID="cole-id-aqui"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/pets/$PET_ID

# Atualizar pet
curl -X PUT http://localhost:3000/api/pets/$PET_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Luna Gatinha"}'

# Deletar pet
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/pets/$PET_ID
```

### Vacinas
```bash
# Adicionar vacina
curl -X POST http://localhost:3000/api/pets/$PET_ID/vaccines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Antirrábica",
    "vaccine_date": "2024-01-15",
    "next_dose_date": "2025-01-15",
    "veterinarian": "Dr. João"
  }'

# Listar vacinas
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/pets/$PET_ID/vaccines
```

### Consultas
```bash
# Criar veterinário
curl -X POST http://localhost:3000/api/vets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Dr. João Silva",
    "clinic": "Clínica Veterinária Central",
    "phone": "+351912345678",
    "email": "joao@clinica.pt"
  }'

# Marcar consulta
VET_ID="cole-id-aqui"
curl -X POST http://localhost:3000/api/vets/$VET_ID/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "pet_id": "'$PET_ID'",
    "date": "2024-02-01T10:00:00Z",
    "type": "Consulta de rotina",
    "reason": "Check-up anual"
  }'
```

## Troubleshooting

### Ver logs Vercel
```bash
# No dashboard
# Vercel → Seu Projeto → Deployments → [último] → View Function Logs

# Via CLI
vercel logs
```

### Testar conexão DB
```bash
# Via psql
psql "$DATABASE_URL" -c "SELECT NOW();"

# Via Node
node -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT NOW()\`.then(console.log);
"
```

### Debug de erros comuns

#### "Cannot connect to database"
```bash
# Verificar se DATABASE_URL está correta
echo $DATABASE_URL

# Testar conexão
psql "$DATABASE_URL" -c "SELECT 1"

# Verificar IP whitelist no Neon (geralmente não necessário)
```

#### "Token inválido"
```bash
# Verificar se JWT_SECRET está definido
echo $JWT_SECRET

# Gerar novo token com login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"sua-senha"}'
```

#### "CORS error"
```bash
# Verificar headers na resposta
curl -I http://localhost:3000/api/health

# Deve incluir:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
```

## Ferramentas Úteis

### jq - Formatar JSON
```bash
# Instalar
brew install jq  # macOS
sudo apt install jq  # Linux

# Usar
curl http://localhost:3000/api/pets \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# Extrair campos específicos
curl http://localhost:3000/api/pets \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {name, species}'
```

### HTTPie - HTTP client amigável
```bash
# Instalar
brew install httpie

# Usar
http POST localhost:3000/api/auth/register \
  name="Maria" \
  email="maria@test.com" \
  password="senha123"

# Com auth
http localhost:3000/api/pets \
  Authorization:"Bearer $TOKEN"
```

### Postman/Insomnia
1. Importar collection (criar ficheiro JSON)
2. Configurar variáveis de ambiente
3. Testar todos os endpoints

## Scripts de Automação

### Criar utilizador e pet de teste
```bash
#!/bin/bash
# test-setup.sh

API_URL="http://localhost:3000"

# Register
RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test1234"}')

TOKEN=$(echo $RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

# Create pet
curl -X POST $API_URL/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"TestPet","species":"dog"}'

echo "Setup completo!"
```

### Backup da base de dados
```bash
#!/bin/bash
# backup.sh

BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"
pg_dump "$DATABASE_URL" > $BACKUP_FILE
echo "Backup criado: $BACKUP_FILE"
```

## Comandos de Produção

### Verificar status
```bash
# Health check
curl https://SUA-URL.vercel.app/api/health

# Métricas (se configurado)
curl https://SUA-URL.vercel.app/api/metrics
```

### Rollback (se necessário)
```bash
# Via Vercel dashboard
# Deployments → [versão anterior] → Promote to Production

# Via CLI
vercel rollback
```

---

**Dica:** Salve estes comandos num ficheiro `commands.sh` e deixe executável com `chmod +x commands.sh`
