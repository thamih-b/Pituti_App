# Roadmap & Future Improvements - Pituti

Sugestões de melhorias e novas funcionalidades para evoluir o projeto.

---

## 🚀 Fase 1: Melhorias Imediatas (1-2 semanas)

### 1.1 Segurança

#### Rate Limiting
**Objetivo:** Prevenir abuso da API

**Implementação:**
```bash
npm install express-rate-limit
```

```typescript
// middleware/rate-limit.ts
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Too many requests, please try again later',
})

// Aplicar em routes específicas
app.use('/api/auth/login', apiLimiter)
```

#### Refresh Tokens
**Objetivo:** Tokens de longa duração sem comprometer segurança

**Schema addition:**
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Endpoints:**
- `POST /api/auth/refresh` - Trocar refresh token por novo access token
- `POST /api/auth/logout` - Invalidar refresh token

#### Validação de Email
**Objetivo:** Confirmar emails reais

```sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
```

**Flow:**
1. Register → envia email com link de verificação
2. User clica → `GET /api/auth/verify/:token`
3. Token válido → marca `email_verified = true`

---

### 1.2 User Experience

#### Upload de Imagens
**Objetivo:** Fotos de pets e documentos

**Opções:**
1. **Cloudinary** (recomendado para MVP)
   ```bash
   npm install cloudinary multer
   ```

2. **AWS S3** (escalável)
3. **Vercel Blob** (integração fácil)

**Endpoint:**
```typescript
// POST /api/pets/:petId/photo
export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('photo')
  
  // Upload para Cloudinary
  const result = await cloudinary.uploader.upload(file)
  
  // Salvar URL no pet
  await sql`UPDATE pets SET photo_url = ${result.secure_url} WHERE id = ${petId}`
  
  return Response.json({ photoUrl: result.secure_url })
}
```

#### Notificações Push
**Objetivo:** Lembrar vacinas, medicamentos, consultas

**Implementação (Web Push):**
```bash
npm install web-push
```

**Tabela:**
```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Cron job (Vercel Cron):**
```typescript
// api/cron/notifications.ts
export async function GET(req: Request) {
  // Verificar vacinas próximas
  const upcomingVaccines = await sql`
    SELECT v.*, p.name as pet_name, u.email
    FROM vaccines v
    JOIN pets p ON v.pet_id = p.id
    JOIN users u ON p.owner_id = u.id
    WHERE v.next_dose_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  `
  
  // Enviar notificação para cada
  for (const vaccine of upcomingVaccines) {
    await sendPushNotification(vaccine.user_id, {
      title: `Vacina ${vaccine.name} próxima!`,
      body: `${vaccine.pet_name} tem vacina em ${vaccine.next_dose_date}`,
    })
  }
}
```

#### Modo Offline
**Objetivo:** App funciona sem internet (PWA)

**Service Worker:**
```typescript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pituti-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/app.js',
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

---

### 1.3 Performance

#### Paginação
**Objetivo:** Não carregar todos os registos de uma vez

**Backend:**
```typescript
// GET /api/pets?page=1&limit=20
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit
  
  const pets = await sql`
    SELECT * FROM pets 
    WHERE owner_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  
  const total = await sql`
    SELECT COUNT(*) FROM pets WHERE owner_id = ${userId}
  `
  
  return Response.json({
    data: pets,
    total: total[0].count,
    page,
    totalPages: Math.ceil(total[0].count / limit)
  })
}
```

**Frontend:**
```typescript
const [page, setPage] = useState(1)
const { data, total, totalPages } = await petsApi.getAll({ page, limit: 20 })

// Infinite scroll ou botões Previous/Next
```

#### Cache com React Query
**Objetivo:** Menos requests, UX mais rápida

```bash
npm install @tanstack/react-query
```

```typescript
// hooks/usePets.ts
import { useQuery } from '@tanstack/react-query'

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: () => petsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// No componente
const { data, isLoading, error } = usePets()
```

#### Compressão de Imagens
**Objetivo:** Fotos grandes → pequenas

```typescript
// Antes de upload
import imageCompression from 'browser-image-compression'

const compressedFile = await imageCompression(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
})
```

---

## 🎯 Fase 2: Novas Funcionalidades (1-2 meses)

### 2.1 Partilha de Pets

**Use case:** Famílias com múltiplos donos

**Schema:**
```sql
CREATE TABLE pet_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(20) CHECK (permission IN ('view', 'edit', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pet_id, shared_with_user_id)
);
```

**Endpoints:**
- `POST /api/pets/:petId/share` - Partilhar com email
- `GET /api/pets/shared-with-me` - Ver pets partilhados comigo
- `DELETE /api/pets/:petId/share/:userId` - Remover partilha

**UI:**
```typescript
// No PetDetail
<button onClick={() => sharePet('friend@email.com')}>
  Partilhar Pet
</button>
```

---

### 2.2 Calendário Integrado

**Objetivo:** Ver todas as datas importantes num só lugar

**Backend:**
```typescript
// GET /api/calendar/events
export async function GET(req: Request) {
  const events = await sql`
    -- Vacinas
    SELECT 'vaccine' as type, next_dose_date as date, name, pet_id
    FROM vaccines WHERE next_dose_date IS NOT NULL
    
    UNION ALL
    
    -- Consultas
    SELECT 'appointment' as type, date, reason as name, pet_id
    FROM appointments
    
    UNION ALL
    
    -- Medicamentos (fim de tratamento)
    SELECT 'medication' as type, end_date as date, name, pet_id
    FROM medications WHERE end_date IS NOT NULL
    
    ORDER BY date ASC
  `
  
  return Response.json({ data: events })
}
```

**Frontend (FullCalendar):**
```bash
npm install @fullcalendar/react @fullcalendar/daygrid
```

---

### 2.3 Relatórios e Estatísticas

**Use cases:**
- Gastos com veterinário por ano
- Evolução de peso do pet
- Histórico de sintomas

**Endpoints:**
```typescript
// GET /api/stats/expenses
{
  total: 1500.00,
  byMonth: [
    { month: '2024-01', total: 150 },
    { month: '2024-02', total: 300 },
  ],
  byCategory: [
    { type: 'vaccines', total: 400 },
    { type: 'appointments', total: 1100 },
  ]
}

// GET /api/stats/weight-history/:petId
{
  data: [
    { date: '2024-01-15', weight: 5.2 },
    { date: '2024-02-20', weight: 5.5 },
  ]
}
```

**UI (Recharts):**
```bash
npm install recharts
```

```typescript
import { LineChart, Line } from 'recharts'

<LineChart data={weightHistory}>
  <Line dataKey="weight" stroke="#8884d8" />
</LineChart>
```

---

### 2.4 Integração com Veterinários

**Use case:** Veterinários podem aceder aos perfis dos seus pacientes

**Schema:**
```sql
CREATE TABLE vet_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  license_number VARCHAR(50) NOT NULL,
  verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE vet_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vet_user_id UUID NOT NULL REFERENCES vet_users(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  granted_by_user_id UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Flow:**
1. Veterinário regista-se e adiciona licença
2. Dono do pet autoriza acesso (QR code ou código)
3. Veterinário vê histórico médico completo
4. Veterinário pode adicionar notas/diagnósticos

---

## 🌟 Fase 3: Scaling & Enterprise (3-6 meses)

### 3.1 Multi-tenancy

**Objetivo:** Clínicas veterinárias como clientes

**Schema:**
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  plan VARCHAR(20) CHECK (plan IN ('free', 'pro', 'enterprise')),
  max_users INT DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
```

**Pricing tiers:**
- Free: 1 usuário, 5 pets
- Pro: 10 usuários, 100 pets, €9.99/mês
- Enterprise: Ilimitado, suporte prioritário, custom

---

### 3.2 Mobile App Nativo

**Opções:**
1. **React Native** (reutiliza código web)
2. **Flutter** (performance nativa)
3. **Capacitor** (PWA → Native)

**Features mobile-only:**
- Scan de QR codes (microchip)
- Câmera para fotos de pets
- Geolocalização para veterinários próximos
- Notificações push nativas

---

### 3.3 AI/ML Features

#### Reconhecimento de Raça
```typescript
// Usar TensorFlow.js ou API externa
const breed = await identifyBreed(petPhoto)
```

#### Chatbot de Saúde
```typescript
// Usar OpenAI API
const advice = await chatWithVet('Meu gato está com tosse')
```

#### Detecção de Anomalias
```typescript
// Analisar peso, sintomas → alertar padrões preocupantes
if (weightLoss > 10% && symptoms.includes('lethargy')) {
  alert('Consulte veterinário urgentemente')
}
```

---

## 🧪 Fase 4: Qualidade (Ongoing)

### Testing

```bash
# Backend
npm install --save-dev jest @types/jest
npm install --save-dev supertest @types/supertest

# Frontend
npm install --save-dev vitest @testing-library/react
```

**Exemplo test:**
```typescript
// __tests__/api/pets.test.ts
describe('GET /api/pets', () => {
  it('returns pets for authenticated user', async () => {
    const response = await request(app)
      .get('/api/pets')
      .set('Authorization', `Bearer ${validToken}`)
    
    expect(response.status).toBe(200)
    expect(response.body.data).toBeInstanceOf(Array)
  })
})
```

### CI/CD

**GitHub Actions:**
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### Monitoring

**Sentry (Error Tracking):**
```bash
npm install @sentry/nextjs
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

---

## 📊 Priorização

### Must Have (Próximas 2 semanas)
1. ✅ Upload de fotos de pets
2. ✅ Rate limiting
3. ✅ Paginação

### Should Have (Próximo mês)
1. Notificações push
2. Partilha de pets
3. Relatórios básicos

### Nice to Have (Futuro)
1. Mobile app
2. AI features
3. Multi-tenancy

---

## 💡 Ideias da Comunidade

Abre issues no GitHub para sugestões! Exemplos:

- [ ] Integração com Apple Health / Google Fit
- [ ] Marketplace de produtos para pets
- [ ] Comunidade/fórum de donos de pets
- [ ] Diário de comportamento do pet
- [ ] Integração com pet shops / delivery

---

**Contribuições bem-vindas!** 🐾

Se implementar alguma destas features, faça PR no repositório.
