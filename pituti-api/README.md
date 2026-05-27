# Pituti API

API backend em Next.js para o projeto Pituti - gestão completa de pets, veterinários, consultas, vacinas, medicamentos e muito mais.

## Stack Tecnológica

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Neon)
- **Autenticação:** JWT com jose + bcryptjs
- **Validação:** Zod
- **Runtime:** Node.js 20+

## Funcionalidades

✅ Sistema completo de autenticação (register/login)  
✅ Gestão de pets e perfis médicos  
✅ Veterinários e consultas  
✅ Vacinas, medicamentos, sintomas  
✅ Rotinas de cuidados e notas  
✅ Health check endpoint  
✅ Proteção JWT em todos os endpoints  

## Setup Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um ficheiro `.env.local` na raiz:

```env
DATABASE_URL=postgresql://user:password@host:5432/pituti
JWT_SECRET=your-super-secure-secret-key-min-32-chars
```

### 3. Executar em desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## Deploy na Vercel

### Passo 1: Preparar a base de dados

1. Crie uma conta em [Neon](https://neon.tech) (gratuito)
2. Crie um novo projeto e base de dados
3. Execute o schema SQL (ficheiro `sql/schema.sql`)
4. Copie a `DATABASE_URL` fornecida

### Passo 2: Deploy na Vercel

1. Faça push do código para GitHub
2. Aceda a [vercel.com](https://vercel.com)
3. Clique em "Import Project"
4. Selecione o seu repositório
5. Configure as variáveis de ambiente:
   - `DATABASE_URL`: A connection string do Neon
   - `JWT_SECRET`: Gere uma chave forte (32+ caracteres)
6. Clique em "Deploy"

### Passo 3: Verificar deployment

```bash
curl https://seu-projeto.vercel.app/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "service": "Pituti API",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Estrutura de Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login

### Recursos protegidos (requerem `Authorization: Bearer <token>`)

**Users:**
- `GET /api/users` - Lista utilizadores
- `GET /api/users/:id` - Detalhes do utilizador
- `PUT /api/users/:id` - Atualizar utilizador

**Pets:**
- `GET /api/pets` - Lista pets do utilizador
- `POST /api/pets` - Criar pet
- `GET /api/pets/:petId` - Detalhes do pet
- `PUT /api/pets/:petId` - Atualizar pet
- `DELETE /api/pets/:petId` - Eliminar pet

**Perfil Médico:**
- `GET /api/pets/:petId/medical-profile` - Ver perfil médico
- `PUT /api/pets/:petId/medical-profile` - Atualizar perfil

**Vacinas:**
- `GET /api/pets/:petId/vaccines` - Lista vacinas
- `POST /api/pets/:petId/vaccines` - Adicionar vacina
- `PUT /api/pets/:petId/vaccines/:id` - Atualizar vacina
- `DELETE /api/pets/:petId/vaccines/:id` - Eliminar vacina

**Medicamentos:**
- `GET /api/pets/:petId/medications` - Lista medicamentos
- `POST /api/pets/:petId/medications` - Adicionar medicamento
- `PUT /api/pets/:petId/medications/:id` - Atualizar medicamento
- `DELETE /api/pets/:petId/medications/:id` - Eliminar medicamento

**Sintomas:**
- `GET /api/pets/:petId/symptoms` - Lista sintomas
- `POST /api/pets/:petId/symptoms` - Adicionar sintoma
- `PUT /api/pets/:petId/symptoms/:id` - Atualizar sintoma
- `DELETE /api/pets/:petId/symptoms/:id` - Eliminar sintoma

**Cuidados:**
- `GET /api/pets/:petId/cares` - Lista cuidados
- `POST /api/pets/:petId/cares` - Adicionar cuidado
- `PUT /api/pets/:petId/cares/:id` - Atualizar cuidado
- `DELETE /api/pets/:petId/cares/:id` - Eliminar cuidado

**Notas:**
- `GET /api/pets/:petId/notes` - Lista notas
- `POST /api/pets/:petId/notes` - Adicionar nota
- `PUT /api/pets/:petId/notes/:id` - Atualizar nota
- `DELETE /api/pets/:petId/notes/:id` - Eliminar nota

**Veterinários:**
- `GET /api/vets` - Lista veterinários
- `POST /api/vets` - Adicionar veterinário
- `GET /api/vets/:vetId` - Detalhes do veterinário
- `PUT /api/vets/:vetId` - Atualizar veterinário
- `DELETE /api/vets/:vetId` - Eliminar veterinário

**Consultas:**
- `GET /api/vets/:vetId/appointments` - Lista consultas
- `POST /api/vets/:vetId/appointments` - Marcar consulta
- `PUT /api/vets/:vetId/appointments/:id` - Atualizar consulta
- `DELETE /api/vets/:vetId/appointments/:id` - Cancelar consulta

## Exemplo de Uso

### 1. Registar utilizador

```bash
curl -X POST https://sua-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senha-segura-123"
  }'
```

### 2. Login

```bash
curl -X POST https://sua-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "senha-segura-123"
  }'
```

### 3. Criar pet (com token)

```bash
curl -X POST https://sua-api.vercel.app/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Luna",
    "species": "cat",
    "breed": "Siamês",
    "birth_date": "2020-03-15"
  }'
```

## Segurança

- Todas as passwords são encriptadas com bcrypt (10 rounds)
- Tokens JWT expiram em 7 dias
- Todos os endpoints (exceto auth e health) requerem autenticação
- Validação de input com Zod em todos os endpoints
- CORS configurado para produção

## Base de Dados

O schema SQL completo está em `sql/schema.sql`. Tabelas principais:

- `users` - Utilizadores da app
- `pets` - Pets e seus donos
- `medical_profiles` - Perfis médicos dos pets
- `vaccines` - Vacinas administradas
- `medications` - Medicamentos e tratamentos
- `symptoms` - Sintomas registados
- `cares` - Rotinas de cuidados
- `notes` - Notas gerais
- `vets` - Veterinários
- `appointments` - Consultas veterinárias

## Troubleshooting

### Erro de conexão à base de dados

Verifique se a `DATABASE_URL` está correta e se o Neon permite conexões externas.

### Token inválido

Certifique-se que:
1. O header `Authorization: Bearer <token>` está presente
2. O token não expirou (7 dias)
3. A `JWT_SECRET` é a mesma usada para gerar o token

### Erros de validação

Todos os erros de validação retornam status `400` com detalhes:

```json
{
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

## Licença

Projeto interno Pituti.
