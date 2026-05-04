# 🐾 Pituti App

> Aplicación de gestión de cuidados para animales de compañía.
> Registra vacunas, medicamentos, síntomas, cuidados diarios y consultas veterinarias.

---

## 🔗 URLs del Proyecto

| Recurso | URL |
|---------|-----|
| **Frontend** | https://pituti-app.vercel.app |
| **API** | https://pituti-api.vercel.app |
| **Health Check** | https://pituti-api.vercel.app/api/health |
| **Repositorio** | https://github.com/thamih-b/Pituti_App |
| **Tablero Trello** | https://trello.com/invite/b/69d1023913066206b5cd5e75/ATTIe0e0e73d3b37bfb345fdb0ec60f7e0cb7485F683/pituti-app |

---

## 🚀 Instalación Local

### Prerrequisitos
- Node.js >= 20
- npm >= 9

### Frontend
```bash
# En la raíz del proyecto
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd server
npm install
npm run dev
# → http://localhost:3001
# → http://localhost:3001/api/health
```

### Variables de Entorno

Crea un archivo `.env.development` en la raíz:
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 🏗️ Estructura del Proyecto

```
PITUTI_APP/
├── src/                  # Frontend React + Vite + TypeScript
│   ├── api/              # Clientes de la API (axios)
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Estado global (React Context)
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas de la aplicación
│   └── styles/           # CSS global y variables
│
├── server/               # Backend Node.js + Express
│   ├── controllers/      # Handlers HTTP
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio
│   ├── middleware/       # CORS, validación, errores
│   ├── data/             # Store en memoria + seed data
│   └── validators/       # Schemas Zod
│
├── docs/                 # Documentación
│   ├── deployment.md     # Guía de despliegue
│   └── testing.md        # Pruebas y QA
│
├── vercel.json           # Configuración Vercel (frontend)
└── server/vercel.json    # Configuración Vercel (backend)
```

---

## 🧰 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Estado | React Context + useReducer |
| Estilos | CSS Variables, Dark Mode |
| HTTP Client | Axios |
| Backend | Node.js 20, Express 4 |
| Validación | Zod |
| Despliegue | Vercel |

---

## 📋 Funcionalidades

- 🐶🐱 Gestión de múltiples animales de compañía
- 💉 Registro y calendario de vacunas
- 💊 Control de medicamentos (activos e historial)
- 🩺 Registro de síntomas y resolución
- 🛁 Cuidados diarios con seguimiento de progreso
- 🏥 Gestión de veterinarios y consultas
- 🌙 Modo oscuro (Dark Mode)
- 📱 Diseño responsivo (mobile + desktop)
- 🌍 Multi-idioma (ES / EN / PT)

---

## 📚 Documentación

- [Guía de Despliegue](docs/deployment.md)
- [Pruebas y QA](docs/testing.md)

---

## 📌 Gestión del Proyecto

El seguimiento de tareas, sprints y estado del desarrollo se gestiona en Trello:

🔗 [Tablero Pituti App en Trello](https://trello.com/invite/b/69d1023913066206b5cd5e75/ATTIe0e0e73d3b37bfb345fdb0ec60f7e0cb7485F683/pituti-app)

El tablero incluye:
- Backlog de funcionalidades
- Tareas en progreso
- Historial de tareas completadas
- Notas de diseño y decisiones técnicas

---

## ⚖️ Derechos de Autor y Licencia

Copyright © 2026 **thamih-b**. Todos los derechos reservados.

**Queda estrictamente prohibida** la reproducción total o parcial de este proyecto, su código fuente, diseño, documentación o cualquier otro contenido asociado, por cualquier medio o formato, con cualquier fin — comercial, educativo o personal — sin la autorización previa y expresa por escrito del autor.

Esto incluye, de forma no limitativa:
- Copiar, modificar o distribuir el código fuente
- Utilizar el diseño visual o la identidad del proyecto
- Publicar versiones derivadas, forks o adaptaciones
- Usar el proyecto como base para otros trabajos

Para solicitar permisos, contacta al autor a través del repositorio: https://github.com/thamih-b/Pituti_App
