# Pituti API

API backend em Next.js para o projeto Pituti, responsável por autenticação, gestão de pets, veterinários, consultas, vacinas, medicamentos, sintomas, rotinas e perfis médicos.

## Stack

- Next.js 16 (App Router).
- PostgreSQL / Neon.
- JWT para autenticação.
- Zod para validação.
- bcryptjs para hash de passwords.

## Funcionalidades

- Registo e login de utilizadores.
- Autenticação por token JWT no header `Authorization: Bearer <token>`.
- CRUD de pets, veterinários, consultas, vacinas, medicamentos, sintomas, rotinas e notas.
- Perfil médico por pet.
- Health check para deploy.

## Requisitos

- Node.js 20+.
- npm, pnpm ou yarn.
- Base de dados PostgreSQL acessível pela internet.

## Variáveis de ambiente

Cria um ficheiro `.env.local` com:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=uma_chave_forte_e_longa
```

### Observações

- `DATABASE_URL` é usada para ligar ao PostgreSQL.
- `JWT_SECRET` assina e valida os tokens JWT.
- Em produção, estas variáveis devem ser definidas no painel da Vercel.

## Setup local

1. Instala as dependências.

```bash
npm install
```

2. Configura as variáveis de ambiente em `.env.local`.

3. Executa o projeto em modo desenvolvimento.

```bash
npm run dev
```

4. Abre a API em `http://localhost:3000`.

## Deploy na Vercel

1. Faz push do repositório para GitHub.
2. Importa o projeto na Vercel.
3. Define `DATABASE_URL` e `JWT_SECRET` nas Environment Variables.
4. Faz o deploy.
5. Verifica o endpoint de health em produção.

## Autenticação

Depois do login ou registo, o cliente recebe um `token` JWT.

Envia esse token em todas as rotas protegidas:

```http
Authorization: Bearer <token>
```

### Registo

`POST /api/auth/register`

Body esperado:

```json
{
  "name": "Thami",
  "email": "thami@email.com",
  "password": "senha_forte_123"
}
```

Resposta 201:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Thami",
      "email": "thami@email.com"
    },
    "token": "jwt"
  }
}
```

### Login

`POST /api/auth/login`

Body esperado:

```json
{
  "email": "thami@email.com",
  "password": "senha_forte_123"
}
```

Resposta 200:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Thami",
      "email": "thami@email.com"
    },
    "token": "jwt"
  }
}
```

## Endpoints

### Health

- `GET /api/health`

Resposta:

```json
{
  "status": "ok",
  "service": "Pituti API",
  "version": "1.0.0",
  "timestamp": "2026-05-23T00:00:00.000Z"
}
```

### Users

- `GET /api/users/me` ou equivalente no projeto atual para obter o utilizador autenticado.
- `POST /api/users` cria um utilizador.
- `GET /api/users/:id` obtém um utilizador autenticado.
- `PATCH /api/users/:id` atualiza um utilizador autenticado.

Body `POST /api/users`:

```json
{
  "name": "Thami",
  "email": "thami@email.com",
  "photo_url": "https://..."
}
```

### Pets

- `GET /api/pets`
- `POST /api/pets`
- `GET /api/pets/:petId`
- `PATCH /api/pets/:petId`
- `DELETE /api/pets/:petId`

Body `POST /api/pets`:

```json
{
  "name": "Luna",
  "species": "cat",
  "breed": "Siamese",
  "birth_date": "2024-01-01",
  "photo_url": "https://...",
  "color": "white",
  "microchip": "123456",
  "passport": "AB123"
}
```

### Veterinários

- `GET /api/vets`
- `POST /api/vets`
- `GET /api/vets/:vetId`
- `PATCH /api/vets/:vetId`
- `DELETE /api/vets/:vetId`

### Consultas

- `GET /api/vets/:vetId/appointments`
- `POST /api/vets/:vetId/appointments`
- `GET /api/vets/:vetId/appointments/:id`
- `PATCH /api/vets/:vetId/appointments/:id`
- `DELETE /api/vets/:vetId/appointments/:id`

Body exemplo `POST /api/vets/:vetId/appointments`:

```json
{
  "pet_id": "uuid",
  "vet_name": "Dr. João",
  "clinic": "ClinVet",
  "type": "routine",
  "date": "2026-05-23",
  "reason": "Check-up anual",
  "diagnosis": null,
  "treatment": null,
  "next_appointment_date": null,
  "next_appointment_note": null,
  "weight_kg": 4.5,
  "cost": 35,
  "notes": "Tudo ok"
}
```

### Vacinas

- `GET /api/pets/:petId/vaccines`
- `POST /api/pets/:petId/vaccines`
- `GET /api/pets/:petId/vaccines/:id`
- `PATCH /api/pets/:petId/vaccines/:id`
- `DELETE /api/pets/:petId/vaccines/:id`

### Medicamentos

- `GET /api/pets/:petId/medications`
- `POST /api/pets/:petId/medications`
- `GET /api/pets/:petId/medications/:id`
- `PATCH /api/pets/:petId/medications/:id`
- `DELETE /api/pets/:petId/medications/:id`

### Sintomas

- `GET /api/pets/:petId/symptoms`
- `POST /api/pets/:petId/symptoms`
- `GET /api/pets/:petId/symptoms/:id`
- `PATCH /api/pets/:petId/symptoms/:id`
- `DELETE /api/pets/:petId/symptoms/:id`

### Rotinas

- `GET /api/pets/:petId/cares`
- `POST /api/pets/:petId/cares`
- `GET /api/pets/:petId/cares/:id`
- `PATCH /api/pets/:petId/cares/:id`
- `DELETE /api/pets/:petId/cares/:id`

### Notas

- `GET /api/pets/:petId/notes`
- `POST /api/pets/:petId/notes`
- `GET /api/pets/:petId/notes/:id`
- `PATCH /api/pets/:petId/notes/:id`
- `DELETE /api/pets/:petId/notes/:id`

### Perfil médico

- `GET /api/pets/:petId/medical-profile`
- `PUT /api/pets/:petId/medical-profile`

## Respostas e erros

- `200` quando a leitura ou atualização é bem-sucedida.
- `201` quando um recurso é criado.
- `204` quando um recurso é removido com sucesso.
- `400` quando a validação falha.
- `401` quando o token está ausente ou inválido.
- `403` quando o utilizador não tem permissão.
- `404` quando o recurso não existe.
- `409` quando há conflito, como email duplicado.
- `500` para erro inesperado.

## Integração com frontend

- Após registo ou login, guarda o `token` e envia-o em chamadas autenticadas.
- Se a app falhar com `401`, força novo login.
- Em mobile com Capacitor, guarda o token no armazenamento seguro da plataforma.

## SQL e schema

O schema está em `sql/` e contém as tabelas principais do projeto.

## Licença

Projeto interno Pituti.
