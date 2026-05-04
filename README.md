# 🐾 Pituti App

> Aplicação de gestão de cuidados para animais de estimação.
> Regista vacinas, medicamentos, sintomas, cuidados diários e consultas veterinárias.

---

## 🔗 URLs do Projecto

| Recurso | URL |
|---------|-----|
| **Frontend** | https://pituti-app.vercel.app |
| **API** | https://pituti-api.vercel.app |
| **Health Check** | https://pituti-api.vercel.app/api/health |

---

## 🚀 Instalação Local

### Pré-requisitos
- Node.js >= 20
- npm >= 9

### Frontend
```bash
# Na raiz do projecto
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

### Variáveis de Ambiente

Cria um ficheiro `.env.development` na raiz:
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 🏗️ Estrutura do Projecto

```
PITUTI_APP/
├── src/                  # Frontend React + Vite + TypeScript
│   ├── api/              # Clientes da API (axios)
│   ├── components/       # Componentes reutilizáveis
│   ├── context/          # Estado global (React Context)
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas da aplicação
│   └── styles/           # CSS global e variáveis
│
├── server/               # Backend Node.js + Express
│   ├── controllers/      # Handlers HTTP
│   ├── routes/           # Definição de rotas
│   ├── services/         # Lógica de negócio
│   ├── middleware/       # CORS, validação, erros
│   ├── data/             # Store em memória + seed data
│   └── validators/       # Schemas Zod
│
├── docs/                 # Documentação
│   ├── deployment.md     # Guia de deploy
│   └── testing.md        # Testes e QA
│
├── vercel.json           # Configuração Vercel (frontend)
└── server/vercel.json    # Configuração Vercel (backend)
```

---

## 🧰 Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Estado | React Context + useReducer |
| Styling | CSS Variables, Dark Mode |
| HTTP Client | Axios |
| Backend | Node.js 20, Express 4 |
| Validação | Zod |
| Deploy | Vercel |

---

## 📚 Documentação

- [Guia de Deploy](docs/deployment.md)
- [Testes e QA](docs/testing.md)

---

## 📋 Funcionalidades

- 🐶🐱 Gestão de múltiplos animais de estimação
- 💉 Registo e calendário de vacinas
- 💊 Controlo de medicamentos (activos e histórico)
- 🩺 Registo de sintomas e resolução
- 🛁 Cuidados diários com tracking de progresso
- 🏥 Gestão de veterinários e consultas
- 🌙 Dark mode
- 📱 Design responsivo (mobile + desktop)
- 🌍 Multi-idioma (ES / EN / PT)
