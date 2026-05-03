Endpoints REST Completos

| Método         | Endpoint                                         | Descripción                              | HTTP |
| -------------- | ------------------------------------------------ | ---------------------------------------- | ---- |
| GET            | /api/health                                      | Estado del servidor + lista de endpoints | 200  |
| GET            | /api/users                                       | Listar usuarios                          | 200  |
| POST           | /api/users                                       | Crear usuario                            | 201  |
| GET            | /api/users/:id                                   | Obtener usuario                          | 200  |
| PATCH          | /api/users/:id                                   | Actualizar usuario (parcial)             | 200  |
| DELETE         | /api/users/:id                                   | Eliminar usuario                         | 204  |
| GET            | /api/pets?ownerId=                               | Listar mascotas (filtrable)              | 200  |
| POST           | /api/pets                                        | Crear mascota                            | 201  |
| GET            | /api/pets/:petId                                 | Obtener mascota                          | 200  |
| PATCH          | /api/pets/:petId                                 | Actualizar mascota                       | 200  |
| DELETE         | /api/pets/:petId                                 | Eliminar + cascade                       | 204  |
| GET            | /api/pets/:petId/vaccines                        | Vacunas de una mascota                   | 200  |
| POST           | /api/pets/:petId/vaccines                        | Registrar vacuna                         | 201  |
| PATCH          | /api/pets/:petId/vaccines/:id                    | Actualizar vacuna                        | 200  |
| DELETE         | /api/pets/:petId/vaccines/:id                    | Eliminar vacuna                          | 204  |
| (mismo patrón) | .../medications .../symptoms .../cares .../notes | Sub-recursos                             | —    |
| GET            | /api/pets/:petId/medical-profile                 | Perfil médico                            | 200  |
| PUT            | /api/pets/:petId/medical-profile                 | Crear o actualizar perfil                | 200  |
| GET            | /api/vets                                        | Listar veterinarios                      | 200  |
| POST           | /api/vets                                        | Crear veterinario                        | 201  |
| PATCH          | /api/vets/:vetId                                 | Actualizar veterinario                   | 200  |
| DELETE         | /api/vets/:vetId                                 | Eliminar veterinario                     | 204  |
| GET            | /api/vets/:vetId/appointments                    | Consultas del vet                        | 200  |
| POST           | /api/vets/:vetId/appointments                    | Registrar consulta                       | 201  |
| PATCH          | /api/vets/:vetId/appointments/:id                | Editar consulta                          | 200  |
| DELETE         | /api/vets/:vetId/appointments/:id                | Eliminar consulta                        | 204  |

Arquitectura por Capas
HTTP Request
    ↓
[Routes]          → Define verbos + middlewares por endpoint
    ↓
[Middleware]       → validate(Schema) — valida body con Zod en la frontera de red
    ↓
[Controllers]      → Lee req, llama al service, escribe res con código HTTP correcto
    ↓
[Services]         → Lógica de negocio (validaciones de negocio, cascade, deduplicación)
    ↓
[Data / Store]     → Maps in-memory (fácilmente reemplazables por Prisma/Mongoose)

Arrancar el Servidor
# Desde la raíz del repositorio
cd server
npm install
npm run dev     # modo watch (Node 20+, sin nodemon)
# → 🐾 Servidor PITUTI corriendo en http://localhost:3001

Agrega en .env del frontend:
VITE_API_URL=http://localhost:3001/api

Decisiones de Diseño

    Zod en la frontera de red — la validación ocurre en el middleware validate() antes de que el controlador o el servicio vean los datos; errores de validación retornan 400 con detalle por campo

    Fábrica createSubResourceService — las 5 entidades anidadas bajo mascota (vacunas, medicamentos, síntomas, cuidados, notas) comparten exactamente el mismo patrón CRUD; la fábrica elimina ~200 líneas de código repetido

    Store desacoplado — los servicios sólo hablan con store.js; para producción basta con reemplazar las operaciones de Map por llamadas a Prisma/Mongoose sin tocar controladores ni rutas

    Cascade delete en pets — al borrar una mascota se eliminan automáticamente todos sus sub-recursos y perfil médico

    Seed data — el store arranca con datos de demo (Luna y Rocky) para que los endpoints sean explorables inmediatamente sin setup adicional
