# Docker Compose - Pituti Development

Ambiente de desenvolvimento completo com PostgreSQL local.

---

## 📦 docker-compose.yml

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: pituti-db
    environment:
      POSTGRES_USER: pituti
      POSTGRES_PASSWORD: pituti_dev_pass
      POSTGRES_DB: pituti_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pituti"]
      interval: 10s
      timeout: 5s
      retries: 5

  # pgAdmin (opcional - interface web para PostgreSQL)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pituti-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@pituti.local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    volumes:
      - pgadmin_data:/var/lib/pgadmin

  # Redis (opcional - para cache futuro)
  redis:
    image: redis:7-alpine
    container_name: pituti-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  pgadmin_data:
  redis_data:

networks:
  default:
    name: pituti-network
```

---

## 🚀 Uso

### Iniciar Ambiente

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver apenas logs do postgres
docker-compose logs -f postgres
```

### Verificar Status

```bash
# Ver containers rodando
docker-compose ps

# Esperado:
# pituti-db      postgres   Up      5432/tcp
# pituti-pgadmin pgadmin4   Up      5050/tcp
# pituti-redis   redis      Up      6379/tcp
```

### Conectar ao PostgreSQL

```bash
# Via psql (se tiver instalado localmente)
psql postgresql://pituti:pituti_dev_pass@localhost:5432/pituti_dev

# Via docker exec
docker-compose exec postgres psql -U pituti -d pituti_dev

# Connection string para .env.local
DATABASE_URL=postgresql://pituti:pituti_dev_pass@localhost:5432/pituti_dev
```

### Acessar pgAdmin

1. Abrir http://localhost:5050
2. Login: `admin@pituti.local` / `admin`
3. Adicionar servidor:
   - Host: `postgres` (nome do serviço)
   - Port: `5432`
   - Username: `pituti`
   - Password: `pituti_dev_pass`

### Parar Ambiente

```bash
# Parar containers (mantém dados)
docker-compose stop

# Parar e remover containers (mantém volumes)
docker-compose down

# Parar, remover containers E volumes (CUIDADO: perde dados!)
docker-compose down -v
```

---

## 🔧 Comandos Úteis

### Backup Database

```bash
# Criar backup
docker-compose exec postgres pg_dump -U pituti pituti_dev > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U pituti pituti_dev < backup.sql
```

### Reset Database

```bash
# Dropar e recriar database
docker-compose exec postgres psql -U pituti -c "DROP DATABASE IF EXISTS pituti_dev;"
docker-compose exec postgres psql -U pituti -c "CREATE DATABASE pituti_dev;"

# Executar schema novamente
docker-compose exec -T postgres psql -U pituti pituti_dev < schema.sql
```

### Ver Tabelas

```bash
docker-compose exec postgres psql -U pituti pituti_dev -c "\dt"
```

### Executar Query

```bash
docker-compose exec postgres psql -U pituti pituti_dev -c "SELECT * FROM users LIMIT 5;"
```

---

## 📝 .env.local (Backend)

```env
# Database (Docker)
DATABASE_URL=postgresql://pituti:pituti_dev_pass@localhost:5432/pituti_dev

# JWT
JWT_SECRET=dev-secret-key-change-in-production

# Redis (se usar)
REDIS_URL=redis://localhost:6379

# Node
NODE_ENV=development
```

---

## 🐳 Docker Alternativo (Apenas Backend)

Se quiser rodar backend também em Docker:

```yaml
# docker-compose.yml (adicionar ao existente)

  # Backend API
  api:
    build:
      context: ./pituti-api
      dockerfile: Dockerfile
    container_name: pituti-api
    environment:
      DATABASE_URL: postgresql://pituti:pituti_dev_pass@postgres:5432/pituti_dev
      JWT_SECRET: dev-secret-key
      NODE_ENV: development
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./pituti-api:/app
      - /app/node_modules
    command: npm run dev
```

**Dockerfile (pituti-api/Dockerfile):**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

## 🧪 Testes com Docker

### Setup para Testes

```yaml
# docker-compose.test.yml
version: '3.9'

services:
  postgres-test:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: pituti_test
    ports:
      - "5433:5432"
    tmpfs:
      - /var/lib/postgresql/data  # In-memory para testes rápidos
```

### Rodar Testes

```bash
# Iniciar DB de teste
docker-compose -f docker-compose.test.yml up -d

# Rodar testes
DATABASE_URL=postgresql://test:test@localhost:5433/pituti_test npm test

# Limpar
docker-compose -f docker-compose.test.yml down
```

---

## 🔍 Troubleshooting

### Porta 5432 já em uso

```bash
# Ver o que está usando a porta
lsof -i :5432

# Parar PostgreSQL local
sudo service postgresql stop  # Linux
brew services stop postgresql # macOS

# Ou mudar porta no docker-compose.yml
ports:
  - "5433:5432"  # Usar 5433 no host
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs postgres

# Reconstruir container
docker-compose up -d --force-recreate postgres

# Remover volumes e recomeçar
docker-compose down -v
docker-compose up -d
```

### Schema não carregou

```bash
# Executar manualmente
docker-compose exec -T postgres psql -U pituti pituti_dev < schema.sql

# Verificar
docker-compose exec postgres psql -U pituti pituti_dev -c "\dt"
```

---

## 📊 Monitoring (Opcional)

Adicionar ao docker-compose.yml:

```yaml
  # Grafana para visualização
  grafana:
    image: grafana/grafana:latest
    container_name: pituti-grafana
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana

  # Prometheus para métricas
  prometheus:
    image: prom/prometheus:latest
    container_name: pituti-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
```

---

## ✅ Vantagens do Docker

- ✅ **Ambiente consistente** - Funciona igual em todos os PCs
- ✅ **Setup rápido** - `docker-compose up` e pronto
- ✅ **Isolamento** - Não polui seu sistema
- ✅ **Fácil reset** - `down -v` e recomeça limpo
- ✅ **Múltiplas versões** - Pode ter vários projetos sem conflito

---

## 🎯 Workflow Recomendado

```bash
# 1. Iniciar ambiente
docker-compose up -d

# 2. Verificar que tudo subiu
docker-compose ps

# 3. Rodar backend (fora do Docker)
cd pituti-api
npm run dev

# 4. Rodar frontend (fora do Docker)
cd pituti-frontend
npm run dev

# 5. Desenvolver normalmente

# 6. Parar quando terminar
docker-compose stop
```

---

**Documentação:**
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
