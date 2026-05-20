# Backend Teoria — Pituti API

## Padrão Cliente-Servidor

A arquitetura cliente-servidor divide responsabilidades em três camadas:

- **Cliente** (app móvel/web): faz pedidos HTTP, apresenta dados ao utilizador
- **API** (Next.js): valida pedidos, aplica regras de negócio, é o único a falar com a BD
- **Base de dados** (PostgreSQL/Neon): persiste os dados com garantias ACID

A app móvel **nunca** se conecta diretamente à base de dados. Se o connection
string estivesse no binário da app, qualquer pessoa que a descompile teria
acesso completo a todos os dados de todos os utilizadores.

## O que é uma API REST

REST (Representational State Transfer) é um estilo arquitetural para APIs HTTP.
Cada recurso tem um URL próprio e as operações mapeiam para métodos HTTP:

| Método   | Operação        | Exemplo                        |
|----------|-----------------|-------------------------------|
| GET      | Ler dados       | GET /api/pets                  |
| POST     | Criar dados     | POST /api/pets                 |
| PATCH    | Atualizar dados | PATCH /api/pets/:id            |
| DELETE   | Eliminar dados  | DELETE /api/pets/:id           |

## Códigos de Estado HTTP

| Código | Nome                  | Quando usar                              |
|--------|-----------------------|------------------------------------------|
| 200    | OK                    | Pedido bem sucedido (GET, PATCH)         |
| 201    | Created               | Recurso criado (POST)                    |
| 400    | Bad Request           | Dados inválidos (validação falhou)       |
| 401    | Unauthorized          | Token ausente ou inválido                |
| 404    | Not Found             | Recurso não encontrado                   |
| 500    | Internal Server Error | Erro inesperado no servidor              |

> **Regra de ouro**: nunca devolvas o erro real da base de dados ao cliente.
> É informação interna que um atacante pode usar para mapear a tua BD.


## Diagrama Entidade-Relação

users (1) ──── (N) pets
users (1) ──── (N) vets
pets  (N) ──── (N) vets          [via vet_pets]
pets  (1) ──── (N) vaccines
pets  (1) ──── (N) medications
pets  (1) ──── (N) symptoms
pets  (1) ──── (N) cares
pets  (1) ──── (N) appointments
pets  (1) ──── (N) notes
pets  (1) ──── (1) medical_profiles

Todas as relações têm ON DELETE CASCADE:
ao apagar um user, apagam-se todos os seus pets e dados.
Ao apagar um pet, apagam-se todas as suas vacinas, consultas, etc.