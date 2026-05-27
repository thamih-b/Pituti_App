# Contributing to Pituti

Obrigado pelo interesse em contribuir para o Pituti! 🐾

---

## 🚀 Como Contribuir

### 1. Fork & Clone

```bash
# Fork no GitHub
# Depois clone seu fork:
git clone https://github.com/SEU-USER/pituti.git
cd pituti
```

### 2. Setup Local

```bash
# Backend
cd pituti-api
npm install
cp .env.example .env.local
# Editar .env.local com suas credenciais
npm run dev

# Frontend (novo terminal)
cd ../pituti-frontend
npm install
cp .env.example.frontend .env.local
npm run dev
```

### 3. Criar Branch

```bash
git checkout -b feat/minha-feature
# ou
git checkout -b fix/corrigir-bug
```

**Convenção de nomes:**
- `feat/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `style/` - Formatação, não altera lógica
- `refactor/` - Refatoração de código
- `test/` - Adicionar/modificar testes
- `chore/` - Tarefas de manutenção

### 4. Fazer Mudanças

- Escreva código limpo e legível
- Siga as convenções de código existentes
- Adicione comentários onde necessário
- Teste suas mudanças localmente

### 5. Commit

```bash
git add .
git commit -m "feat: adicionar upload de fotos de pets"
```

**Formato de commit:**
```
tipo: descrição curta (max 50 caracteres)

Descrição detalhada do que foi feito e por quê.
Pode ter múltiplas linhas.

Closes #123
```

**Tipos:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

### 6. Push & Pull Request

```bash
git push origin feat/minha-feature
```

No GitHub:
1. Criar Pull Request
2. Preencher template do PR
3. Aguardar review
4. Fazer ajustes se necessário

---

## 📋 Pull Request Guidelines

### Template do PR

```markdown
## Descrição
Breve descrição do que foi feito.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## Checklist
- [ ] Código segue convenções do projeto
- [ ] Testes passam localmente
- [ ] Documentação atualizada
- [ ] Sem console.logs desnecessários
```

### Processo de Review

1. **Automated checks** rodam (testes, lint, build)
2. **Reviewer** analisa código
3. **Mudanças solicitadas** (se necessário)
4. **Aprovação** → Merge para main
5. **Deploy automático** (se main)

---

## 🧪 Testing

### Backend Tests

```bash
cd pituti-api
npm test
```

**Escrever testes:**
```typescript
// __tests__/api/pets.test.ts
import { describe, it, expect } from 'vitest'
import { createPet } from '../api/pets'

describe('Pets API', () => {
  it('should create a pet', async () => {
    const pet = await createPet({ name: 'Luna', species: 'cat' })
    expect(pet.name).toBe('Luna')
  })
})
```

### Frontend Tests

```bash
cd pituti-frontend
npm test
```

**Escrever testes:**
```typescript
// src/components/__tests__/PetCard.test.tsx
import { render, screen } from '@testing-library/react'
import PetCard from '../PetCard'

test('renders pet name', () => {
  render(<PetCard pet={{ name: 'Luna', species: 'cat' }} />)
  expect(screen.getByText('Luna')).toBeInTheDocument()
})
```

---

## 💻 Convenções de Código

### TypeScript

```typescript
// ✅ Bom
interface Pet {
  id: string
  name: string
  species: 'cat' | 'dog'
}

const createPet = async (data: CreatePetDto): Promise<Pet> => {
  // ...
}

// ❌ Evitar
const createPet = async (data: any): Promise<any> => {
  // ...
}
```

### Nomenclatura

```typescript
// Componentes: PascalCase
const PetCard = () => { }

// Funções: camelCase
const fetchPets = () => { }

// Constantes: UPPER_SNAKE_CASE
const MAX_PETS = 100

// Tipos/Interfaces: PascalCase
interface PetData { }
type Species = 'cat' | 'dog'
```

### Imports

```typescript
// Ordem:
// 1. External libs
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal libs
import { api } from '@/api/client'
import { Pet } from '@/types'

// 3. Components
import PetCard from '@/components/PetCard'

// 4. Styles
import styles from './styles.module.css'
```

### Componentes React

```typescript
// ✅ Funcional + Hooks
const PetList = () => {
  const [pets, setPets] = useState<Pet[]>([])
  
  useEffect(() => {
    fetchPets().then(setPets)
  }, [])
  
  return (
    <div>
      {pets.map(pet => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  )
}

// ❌ Class components (evitar)
class PetList extends React.Component { }
```

---

## 🎨 Formatação

### Prettier

```bash
# Instalar
npm install -D prettier

# .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}

# Formatar
npm run format
```

### ESLint

```bash
# .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}

# Lint
npm run lint
```

---

## 📝 Documentação

### Comentários

```typescript
// ✅ Bom - Explica "porquê"
// Usamos cache de 5 minutos para reduzir carga no DB
const CACHE_TIME = 5 * 60 * 1000

// ❌ Ruim - Explica "o quê" (óbvio)
// Define cache time como 5 minutos
const CACHE_TIME = 5 * 60 * 1000
```

### JSDoc (quando necessário)

```typescript
/**
 * Cria um novo pet no sistema
 * @param data - Dados do pet (nome, espécie, etc)
 * @returns Pet criado com ID gerado
 * @throws {ValidationError} Se dados inválidos
 */
async function createPet(data: CreatePetDto): Promise<Pet> {
  // ...
}
```

### README

- Atualizar README quando adicionar features
- Incluir exemplos de uso
- Screenshots se relevante

---

## 🐛 Reportar Bugs

### Template de Issue

```markdown
**Descrição do Bug**
Descrição clara do problema.

**Passos para Reproduzir**
1. Ir para '...'
2. Clicar em '...'
3. Ver erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável.

**Ambiente**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome 120]
- Versão: [1.0.0]

**Logs**
```
Colar logs relevantes
```
```

---

## 💡 Sugerir Features

### Template de Feature Request

```markdown
**Funcionalidade Desejada**
Descrição clara da feature.

**Problema que Resolve**
Por que esta feature é útil?

**Solução Proposta**
Como você imagina que funcione?

**Alternativas Consideradas**
Outras abordagens possíveis?

**Informação Adicional**
Mockups, exemplos, referências.
```

---

## 🏗️ Arquitetura

### Backend (Next.js API)

```
pituti-api/
├── app/api/           # Endpoints
│   ├── auth/         # Autenticação
│   ├── pets/         # CRUD pets
│   └── ...
├── lib/              # Utilities
│   ├── db.ts         # Database
│   ├── auth.ts       # JWT
│   └── validation.ts # Zod schemas
└── middleware/       # Express-like middleware
```

### Frontend (React + Vite)

```
pituti-frontend/
├── src/
│   ├── api/          # API client
│   ├── components/   # UI components
│   ├── context/      # React Context
│   ├── pages/        # Page components
│   ├── hooks/        # Custom hooks
│   └── utils/        # Helpers
```

---

## 🔐 Segurança

### Reportar Vulnerabilidades

**NÃO abra issue pública!**

Envie email para: security@pituti.app

Inclua:
- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestão de fix (se tiver)

---

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

---

## 🎉 Reconhecimento

Contribuidores são listados em:
- README.md (Contributors section)
- CHANGELOG.md (por release)

---

## 📞 Dúvidas?

- 💬 Discussões: GitHub Discussions
- 🐛 Bugs: GitHub Issues
- 📧 Email: thamiris.bittencourt@gmail.com 
- 💼 LinkedIn: (https://www.linkedin.com/in/thamirisb/)

---

**Obrigado por contribuir! Cada contribuição, por menor que seja, faz diferença.** 🐾
